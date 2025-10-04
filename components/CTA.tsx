"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useState } from "react";
import { z } from "zod";
import { emailSchema } from "@/lib/validate";
import clsx from "clsx";

type Props = { compact?: boolean };

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
    try {
      // inside handleSubmit
      setLoading(true);
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: parsed.data, source: "landing" }),
      });
      if (!res.ok) throw new Error("Request failed");
      setSubmitted(true);
      setEmail("");
    } catch (e) {
      console.error(e);
      setErr("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted && compact) {
    return <div className="rounded-xl bg-white/10 px-4 py-3">🎉 You’re in! We’ll be in touch soon.</div>;
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
        <p className="text-emerald-300 text-sm">🎉 You’re on the list! Check your inbox soon.</p>
      )}
    </form>
  );
}
