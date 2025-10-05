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
const RESEND_FROM = process.env.RESEND_FROM || "Wolfer <team@trywolfer.com>"; // e.g. "Nolan from Wolfer <nolan@trywolfer.com>"

if (!svc) throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_KEY");
if (!RESEND_KEY) throw new Error("Missing RESEND_API_KEY");
if (!RESEND_FROM) throw new Error("Missing RESEND_FROM (e.g. 'Name <nolan@trywolfer.com>')");

if (!getApps().length) initializeApp({ credential: cert(JSON.parse(svc)) });
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

    // Duplicate check (fast)
    const existing = await db
        .collection("waitlist")
        .where("emailNorm", "==", normalized)
        .limit(1)
        .get();
    if (!existing.empty) {
        return NextResponse.json({ error: "Already subscribed" }, { status: 409 });
    }

    // Deterministic ID to prevent race duplicates
    const id = createHash("sha256").update(normalized).digest("hex").slice(0, 40);
    const ref = db.collection("waitlist").doc(id);

    // Create document (race-safe)
    try {
        await ref.create({
            email: normalized,
            emailNorm: normalized,
            source,
            createdAt: FieldValue.serverTimestamp(),
        });
    } catch (e: any) {
        if (e?.code === 6 || e?.message?.includes("ALREADY_EXISTS")) {
            return NextResponse.json({ error: "Already subscribed" }, { status: 409 });
        }
        throw e;
    }

    // ---- Send welcome email (check {data,error}) ----
    const subject = "Welcome to Wolfer — You’re on the list 🐺";

    const text = [
        "You're in 🎉",
        "Thanks for joining the Wolfer waitlist.",
        "We turn review data into validated opportunities and spin up agents from day one.",
        "You’ll also get an invite to our private Slack community.",
        "Reply with your focus area and we’ll prioritize it."
    ].join("\n\n");

    const html = `
    <div style="font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#e5e7eb;background:#0b0b12;padding:24px">
      <div style="max-width:560px;margin:0 auto;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:24px">
        <h1 style="margin:0 0 8px;color:#fff;font-size:20px;line-height:1.2">You're in 🎉</h1>
        <p style="margin:0 0 12px">Thanks for joining the Wolfer waitlist.</p>
        <p style="margin:0 0 12px">We turn real review data into validated opportunities and spin up agents to execute from day one.</p>
        <ul style="margin:12px 0 16px;padding-left:18px">
          <li>Research coverage of your space</li>
          <li>Recommended agent stack (Marketing / Biz-Dev / Web)</li>
          <li>Invite to our private <strong>Slack founder community</strong></li>
        </ul>
        <p style="margin:0 0 16px">Reply with your focus area and we’ll prioritize it.</p>
        <p style="margin:0;font-size:12px;color:#9ca3af">If this wasn’t you, you can ignore this email.</p>
      </div>
    </div>
  `;

    let emailed = false;
    let messageId: string | undefined;

    const { data, error } = await resend.emails.send({
        from: RESEND_FROM as string,          // must be a verified domain mailbox
        to: normalized,
        subject,
        text,
        html,
        replyTo: "nolan@trywolfer.com",
        headers: {
            // keep mailto for now; add a URL only if you implement it
            "List-Unsubscribe": "<mailto:hello@trywolfer.com?subject=unsubscribe>",
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
        tags: [{ name: "list", value: "waitlist" }],
    });

    if (error) {
        console.error("Resend error:", error);
    } else {
        emailed = true;
        messageId = data?.id;
    }

    return NextResponse.json({ ok: true, emailed, messageId });
}
