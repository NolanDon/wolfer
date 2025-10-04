// app/api/waitlist/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { createHash } from "crypto";

const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!raw) throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_KEY");

if (!getApps().length) {
    initializeApp({ credential: cert(JSON.parse(raw)) });
}
const db = getFirestore();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
    const { email, source = "landing" } = await req.json();

    if (typeof email !== "string") {
        return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const normalized = email.trim().toLowerCase();
    if (!EMAIL_RE.test(normalized) || normalized.length > 320) {
        return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // 1) Fast path: do we already have this email?
    const existing = await db
        .collection("waitlist")
        .where("emailNorm", "==", normalized)
        .limit(1)
        .get();

    if (!existing.empty) {
        return NextResponse.json({ error: "Already subscribed" }, { status: 409 });
    }

    // 2) Deterministic doc ID to prevent race-duplicates
    const id = createHash("sha256").update(normalized).digest("hex").slice(0, 40);
    const ref = db.collection("waitlist").doc(id);

    try {
        await ref.create({
            email: normalized,     // store normalized
            emailNorm: normalized, // (kept for the query above)
            source,
            createdAt: FieldValue.serverTimestamp(),
        });
    } catch (e: any) {
        // If another request slipped in just before, this will catch it.
        if (e?.code === 6 || e?.message?.includes("ALREADY_EXISTS")) {
            return NextResponse.json({ error: "Already subscribed" }, { status: 409 });
        }
        throw e;
    }

    return NextResponse.json({ ok: true });
}
