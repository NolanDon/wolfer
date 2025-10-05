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
    const subject = "Welcome to Wolfer! You’re on the list 🐺";
    // palette + links (optional but handy)
    const site = process.env.NEXT_PUBLIC_SITE_URL || "https://trywolfer.com";
    const slackLink = `${site}/community`;
    const text = [
        "You're in 🎉",
        "Thanks for joining the Wolfer waitlist.",
        "We’ll auto-tailor your starter agent stack from your intake and, when your spot opens, connect your tools and begin executing day one.",
        "You’ll also get an invite to our private Slack founder community.",
        `${site}/community`
    ].join("\n\n");

    // === brand email ===
    const html = `
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
  You're in! Here’s what happens next (invite + KPIs inside).
</div>

<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#0b0b12;">
  <tr>
    <td align="center" style="padding:28px 16px;">
      <!-- container -->
      <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="width:600px; max-width:600px;">
        <!-- header -->
        <tr>
          <td style="padding:0 0 12px;">
            <table role="presentation" width="100%">
              <tr>
                <td style="font-family:Inter,ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#c7c9d1; font-size:12px;">
                  WolferAI
                </td>
                <td align="right" style="font-family:Inter,ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#b4b7ff; font-size:12px;">
                  <span style="display:inline-block; vertical-align:middle; height:8px; width:8px; background:#34d399; border-radius:50%; box-shadow:0 0 0 4px rgba(52,211,153,.18); margin-right:6px;"></span>
                  Live
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- gradient border card -->
        <tr>
          <td style="background:linear-gradient(135deg, rgba(124,108,244,.35), rgba(103,232,249,.25)); padding:1px; border-radius:16px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:16px;">
              <tr>
                <td style="padding:24px; border-radius:16px;">
                  
                  <!-- title -->
                  <h1 style="margin:0 0 8px; font-family:Inter,ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; font-size:28px; line-height:1.2; color:#ffffff;">
                    You're in 🎉
                  </h1>
                  <p style="margin:0 0 16px; font-family:Inter,ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#e5e7eb; font-size:15px; line-height:1.6;">
                    Thanks for joining the Wolfer waitlist. We do <strong style="color:#ffffff;">research + execution</strong>:
                    we mine review data, surface validated gaps, then spin up agents that start working on day one.
                  </p>

                  <!-- "Opportunity Dashboard" look -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(0,0,0,0.25); border:1px solid rgba(255,255,255,0.06); border-radius:12px;">
                    <tr>
                      <td style="padding:16px 16px 8px;">
                        <p style="margin:0; font-family:Inter,ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#a3a7b7; font-size:12px;">
                          Research coverage: <span style="color:#d1d5db;">2,000+ data points parsed</span>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0 16px 16px;">
                        <!-- idea pill -->
                        <table role="presentation" width="100%" style="background:linear-gradient(180deg, rgba(124,108,244,.22), rgba(103,232,249,.15)); border:1px solid rgba(255,255,255,0.06); border-radius:10px;">
                          <tr>
                            <td style="padding:10px 12px;">
                              <table role="presentation" width="100%">
                                <tr>
                                  <td style="font-family:Inter,ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#b9c0ff; font-size:11px;">
                                    <span style="display:inline-block; height:8px; width:8px; border-radius:50%; background:#34d399; margin-right:6px;"></span>
                                    New ideas detected
                                  </td>
                                  <td align="right">
                                    <span style="display:inline-block; font-family:Inter,ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#a7f3d0; font-weight:600; font-size:12px; background:rgba(52,211,153,.15); border:1px solid rgba(52,211,153,.25); padding:4px 8px; border-radius:8px;">
                                      82%
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td colspan="2" style="padding-top:8px; font-family:Inter,ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#e6e8f7; font-size:13px;">
                                    Slack bot that flags churn risk from review tone
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- KPIs -->
                    <tr>
                      <td style="padding:8px 16px 16px;">
                        <table role="presentation" width="100%">
                          <tr>
                            <td width="33.33%" style="padding:6px;">
                              <table role="presentation" width="100%" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.10); border-radius:12px;">
                                <tr><td align="center" style="padding:10px;">
                                  <div style="font-family:Inter,ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#a3a7b7; font-size:11px;">Pain points detected</div>
                                  <div style="font-family:Inter,ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#ffffff; font-size:18px; font-weight:600;">33 clusters</div>
                                </td></tr>
                              </table>
                            </td>
                            <td width="33.33%" style="padding:6px;">
                              <table role="presentation" width="100%" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.10); border-radius:12px;">
                                <tr><td align="center" style="padding:10px;">
                                  <div style="font-family:Inter,ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#a3a7b7; font-size:11px;">Confidence score</div>
                                  <div style="font-family:Inter,ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#a7f3d0; font-size:18px; font-weight:600;">82%</div>
                                </td></tr>
                              </table>
                            </td>
                            <td width="33.33%" style="padding:6px;">
                              <table role="presentation" width="100%" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.10); border-radius:12px;">
                                <tr><td align="center" style="padding:10px;">
                                  <div style="font-family:Inter,ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#a3a7b7; font-size:11px;">Time to MVP</div>
                                  <div style="font-family:Inter,ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#ffffff; font-size:18px; font-weight:600;">~12 days</div>
                                </td></tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- bullets -->
                  <ul style="margin:18px 0 6px; padding-left:18px; color:#d6d8e5; font-family:Inter,ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; font-size:14px; line-height:1.7;">
                    <li>We’ll <strong style="color:#fff;">auto-tailor your starter agent stack</strong> (Marketing / Biz-Dev / Web) from your intake.</li>
                    <li>When your spot opens, we’ll <strong style="color:#fff;">connect your tools</strong> and start the first tasks day one.</li>
                    <li>Get an invite to our private <strong style="color:#fff;">Slack founder community</strong> to share ideas and progress.</li>
                    <li>Expect a dashboard preview with <strong style="color:#fff;">opportunity score</strong>, <strong style="color:#fff;">time-to-MVP</strong>, and first milestones.</li>
                </ul>

                  <!-- CTA -->
                  <div style="padding-top:10px;">
                    <a href="${slackLink}"
                       style="background:#7c6cf4; color:#ffffff; text-decoration:none; display:inline-block; padding:12px 18px; border-radius:12px; font-family:Inter,ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; font-size:14px; font-weight:600; border:1px solid rgba(255,255,255,0.12);">
                      Join the Slack community →
                    </a>
                  </div>

                  <!-- footer -->
                  <p style="margin:18px 0 0; font-family:Inter,ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#9ca3af; font-size:12px;">
                    If this wasn’t you, you can ignore this email.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="height:16px;"></td>
        </tr>
      </table>
    </td>
  </tr>
</table>
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
