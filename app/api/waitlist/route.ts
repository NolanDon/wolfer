// app/api/waitlist/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { createHash } from "crypto";
import { Resend } from "resend";

const svc = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
const RESEND_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM || "Wolfer <onboarding@resend.dev>";

if (!svc) throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_KEY");
if (!RESEND_KEY) throw new Error("Missing RESEND_API_KEY");

if (!getApps().length) {
    initializeApp({ credential: cert(JSON.parse(svc)) });
}
const db = getFirestore();
const resend = new Resend(RESEND_KEY);

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

    // Check for existing
    const existing = await db
        .collection("waitlist")
        .where("emailNorm", "==", normalized)
        .limit(1)
        .get();

    if (!existing.empty) {
        return NextResponse.json({ error: "Already subscribed" }, { status: 409 });
    }

    // Deterministic ID to avoid race duplicates
    const id = createHash("sha256").update(normalized).digest("hex").slice(0, 40);
    const ref = db.collection("waitlist").doc(id);

    try {
        await ref.create({
            email: normalized,
            emailNorm: normalized,
            source,
            createdAt: FieldValue.serverTimestamp(),
        });
    } catch (e: any) {
        // If a concurrent request beat us
        if (e?.code === 6 || e?.message?.includes("ALREADY_EXISTS")) {
            return NextResponse.json({ error: "Already subscribed" }, { status: 409 });
        }
        throw e;
    }

    // Best-effort welcome email (don’t fail the request if email send hiccups)
    let emailed = false;
    try {
        const subject = "Welcome to Wolfer — You’re on the list 🐺";
        const html = `
      <div style="font-family:Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color:#e5e7eb; background:#0b0b12; padding:24px">
        <div style="max-width:560px; margin:0 auto; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:24px">
          <h1 style="margin:0 0 8px; color:#fff; font-size:20px; line-height:1.2">You're in 🎉</h1>
          <p style="margin:0 0 12px">Thanks for joining the Wolfer waitlist.</p>
          <p style="margin:0 0 12px">We turn real review data into validated opportunities and spin up agents to execute from day one.</p>
          <ul style="margin:12px 0 16px; padding-left:18px">
            <li>Research coverage of your space</li>
            <li>Recommended agent stack (Marketing / Biz-Dev / Web)</li>
            <li>Early access to our private founder community</li>
          </ul>
          <p style="margin:0 0 16px">We’ll email you as soon as your spot opens. In the meantime, reply to this message with your focus area and we’ll prioritize it.</p>
          <p style="margin:0; font-size:12px; color:#9ca3af">If this wasn’t you, you can ignore this email.</p>
        </div>
      </div>
    `;

        await resend.emails.send({
            from: RESEND_FROM,
            to: normalized,
            subject,
            html,
            // reply_to: "founder@your-domain.com", // optional
            headers: { "X-List": "wolfer-waitlist" },
        });

        emailed = true;
    } catch (err) {
        console.error("Resend send failed:", err);
    }

    return NextResponse.json({ ok: true, emailed });
}
