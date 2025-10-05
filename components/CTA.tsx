"use client";

import { useState } from "react";
import clsx from "clsx";
import { emailSchema } from "@/lib/validate";

type Props = { compact?: boolean };

// ---- analytics typings ----
declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

function readSource(): string {
  if (typeof window === "undefined") return "landing";
  const sp = new URLSearchParams(window.location.search);
  const src = sp.get("utm_source");
  const med = sp.get("utm_medium");
  const cam = sp.get("utm_campaign");
  const cnt = sp.get("utm_content");
  if (src || med || cam || cnt) {
    // compact, readable source string saved with the doc
    return [
      src ? `src:${src}` : null,
      med ? `med:${med}` : null,
      cam ? `cam:${cam}` : null,
      cnt ? `cnt:${cnt}` : null,
    ]
      .filter(Boolean)
      .join("|");
  }
  // fallback to referrer host if present
  try {
    const ref = document.referrer ? new URL(document.referrer).host : "";
    return ref || "landing";
  } catch {
    return "landing";
  }
}

export default function CTA({ compact }: Props) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErr(null);

    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setErr("Enter a valid email.");
      return;
    }

    const source = readSource();

    try {
      setLoading(true);

      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: parsed.data, source }),
      });

      // Treat 409 (already subscribed) as a soft success for ad optimization
      if (res.ok || res.status === 409) {
        // ---- FIRE CONVERSIONS ----
        // Meta Pixel Lead
        window.fbq?.("track", "Lead", {
          content_name: "waitlist",
          status: res.status === 409 ? "duplicate" : "new",
        });

        // GA4 suggested lead event
        window.gtag?.("event", "generate_lead", {
          method: "waitlist_form",
        });

        // Optional: GTM / dataLayer for later rules
        const domain = parsed.data.split("@")[1] || "";
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "waitlist_signup",
          email_domain: domain,
          source,
        });

        setSubmitted(true);
        setEmail("");
        if (res.status === 409) {
          // Friendly message for dupes
          setErr(null);
        }
        return;
      }

      // Any other failure
      const j = await res.json().catch(() => ({}));
      throw new Error(j?.error || "Request failed");
    } catch (e) {
      console.error(e);
      setErr("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted && compact) {
    return (
      <div className="rounded-xl bg-white/10 px-4 py-3">
        🎉 You’re in! We’ll be in touch soon.
      </div>
    );
  }

  return (
    <form
      id="waitlist"
      onSubmit={handleSubmit}
      className={clsx(
        "flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:items-center",
        compact ? "" : "mx-auto mt-6"
      )}
    >
      <input
        type="email"
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-xl bg-white/10 px-4 py-3 outline-none placeholder:text-sub focus:ring-2 focus:ring-brand-400/60"
        required
      />
      <button type="submit" className="btn-primary min-w-[160px]" disabled={loading}>
        {loading ? "Joining..." : "Join the waitlist"}
      </button>

      {err && <p className="text-rose-300 text-sm">{err}</p>}

      {submitted && !compact && (
        <p className="text-emerald-300 text-sm">
          🎉 You’re on the list! Check your inbox soon.
        </p>
      )}
    </form>
  );
}
