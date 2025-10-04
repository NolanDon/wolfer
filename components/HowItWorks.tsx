"use client";

import { useEffect, useMemo, useState } from "react";
import LivePulse from "./LivePulse";
import dynamic from "next/dynamic";

// Lottie stays client-only
const LottieAgent = dynamic(() => import("./LottieAgent"), { ssr: false });

/* ---------- status label with live pulse ---------- */
function StatusTicker({ labels, interval = 4200 }: { labels: string[]; interval?: number }) {
  const [i, setI] = useState(0);
  const reduced =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduced || labels.length <= 1) return;
    const id = setInterval(() => setI((p) => (p + 1) % labels.length), interval);
    return () => clearInterval(id);
  }, [labels.length, interval, reduced]);

  return (
    <span className="inline-flex items-center gap-2 text-brand-200 text-sm">
      <LivePulse size={8} />
      <span>{labels[i]}</span>
    </span>
  );
}

/* ---------- chat bubble ticker (no clipping, wraps nicely) ---------- */
function BubbleTicker({ messages, interval = 4200 }: { messages: string[]; interval?: number }) {
  const [i, setI] = useState(0);
  const [show, setShow] = useState(true);
  const reduced =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (messages.length <= 1) return;
    const id = setInterval(() => {
      if (reduced) {
        setI((p) => (p + 1) % messages.length);
        return;
      }
      setShow(false);
      const swap = setTimeout(() => {
        setI((p) => (p + 1) % messages.length);
        setShow(true);
      }, 220);
      return () => clearTimeout(swap);
    }, interval);
    return () => clearInterval(id);
  }, [messages.length, interval, reduced]);

  const msg = messages[i];

  return (
    <div className="absolute left-4 right-4 bottom-4 pointer-events-none">
      <div
        key={msg}
        className={`relative w-fit max-w-full rounded-2xl border border-white/10 bg-black/70 px-3 py-2 pr-10 
                    text-[13px] leading-snug text-white/90 ring-1 ring-white/5 
                    shadow-[0_10px_30px_rgba(0,0,0,0.35)]
                    ${reduced ? "" : show ? "opacity-100 translate-y-0 transition-all duration-400 ease-out" : "opacity-0 translate-y-2 transition-all duration-200 ease-in"}`}
      >
        <span className="mr-2 inline-flex -translate-y-[1px]">💡</span>
        <span className="whitespace-normal break-words">{msg}</span>
        <span
          aria-hidden
          className="absolute -bottom-[6px] left-6 h-3 w-3 rotate-45 rounded-[2px] bg-black/70 border-b border-r border-white/10"
        />
      </div>
    </div>
  );
}

/* ---------- dashboard-y agent tile ---------- */
function AgentCard({
  title,
  lottieSrc,
  accent = "purple",
  statuses,
  messages,
}: {
  title: string;
  lottieSrc: string;
  accent?: "purple" | "cyan" | "pink" | string;
  statuses: string[];
  messages: string[];
}) {
  const accentRing = useMemo(() => {
    if (accent === "cyan") return "from-cyan-400/30 to-teal-400/30";
    if (accent === "pink") return "from-fuchsia-400/30 to-pink-400/30";
    return "from-brand-500/30 to-indigo-400/30";
  }, [accent]);

  const dotCls =
    accent === "cyan"
      ? "bg-cyan-400"
      : accent === "pink"
        ? "bg-fuchsia-400"
        : "bg-violet-400";

  return (
    <div className="relative overflow-visible rounded-2xl p-[1px] bg-gradient-to-br from-white/5 to-white/10">
      <div className="relative rounded-2xl bg-black/35 ring-1 ring-white/10 p-5">
        {/* glow */}
        <div
          aria-hidden
          className={`pointer-events-none absolute -top-20 -right-16 h-44 w-44 rounded-full blur-3xl opacity-60 bg-gradient-to-tr ${accentRing}`}
        />
        {/* header with pulsing status */}
        <div className="relative mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${dotCls}`} aria-hidden />
            <h4 className="font-semibold">{title}</h4>
          </div>
          <StatusTicker labels={statuses} />
        </div>

        {/* visual area (no duplicate inner chrome) */}
        <div className="relative h-44 md:h-48 rounded-xl bg-white/5 ring-1 ring-white/10 overflow-hidden">
          <LottieAgent title={title} lottieSrc={lottieSrc} accent={accent} bubbles={[]} chromeless />
          <BubbleTicker messages={messages} />
        </div>
      </div>
    </div>
  );
}

/* ============================ Exported Section ============================ */

export default function HowItWorks() {
  const steps: [string, string][] = [
    [
      "Scrape & synthesize",
      "We crawl all data and public chatter to cluster pains, spot patterns, and surface real demand.",
    ],
    [
      "Validate & confirm",
      "You pick a direction from a short list. We score feasibility, moat, and go-to-market angle.",
    ],
    [
      "Recommend your agents",
      "Based on your idea, we propose the best starter stack (Marketing / Biz-Dev / Web), tools, and KPIs.",
    ],
    [
      "Auto-setup & launch ops",
      "We connect accounts, seed prompts, schedule tasks, and your agents start executing from day one.",
    ],
  ];

  return (
    <section id="how" className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-3xl md:text-4xl font-semibold">How it works</h2>
      <p className="text-sub mt-3 max-w-3xl">
        You’re not doing this alone. After we validate your direction, we <strong>recommend the exact AI agents
          to start with</strong> and <strong>automatically set them up</strong>connecting the right tools, calendars,
        and data sources. From day one they ship work and report progress so you always know what’s next.
      </p>

      {/* Steps */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        {steps.map(([t, d], i) => (
          <div key={i} className="card p-6">
            <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-brand-200">
              {String(i + 1).padStart(2, "0")}
            </div>
            <h3 className="mt-3 font-semibold">{t}</h3>
            <p className="text-sub mt-2">{d}</p>
          </div>
        ))}
      </div>

      {/* Agents */}
      <div className="mt-12">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-3xl font-semibold">Your AI agents (today’s plan)</h3>
          <StatusTicker labels={["Active", "Working…", "Reporting"]} />
        </div>
        <p className="text-sub mb-6 max-w-3xl">
          We spin up a starter pack tailored to your idea and wire it to your stack (analytics, email, CRM, domains).
          Tasks are queued automatically, with human help anytime.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <AgentCard
            title="Marketing Agent"
            lottieSrc="/lotties/agent.json"
            accent="purple"
            statuses={["Designing tests", "Publishing copy", "Analyzing results"]}
            messages={[
              "✅ Job complete> published 2 ad variants & scheduled A/B test.",
              "🧪 Recommending headline test: pain-first vs. outcome-first.",
              "📈 CTR up 12% on variant B. Preparing next iteration.",
            ]}
          />
          <AgentCard
            title="Biz-Dev Agent"
            lottieSrc="/lotties/agent.json"
            accent="cyan"
            statuses={["Prospecting", "Outreach", "Following up"]}
            messages={[
              "✉️ Emailed 5 potential clients matched to ICP.",
              "🤝 2 warm replies> drafted personalized follow-ups.",
              "📅 Suggested 3 time slots for intro calls this week.",
            ]}
          />
          <AgentCard
            title="Web Agent"
            lottieSrc="/lotties/agent.json"
            accent="pink"
            statuses={["Shipping UI", "SEO pass", "Deploying preview"]}
            messages={[
              "🚀 Deployed preview to Vercel> build #47.",
              "🧩 Recommending 'Usage-based pricing' feature (seen in competitor wins).",
              "🔍 Added FAQ from 1★ review clusters; schema validated.",
            ]}
          />
        </div>

        {/* Community callout */}
        <div className="mt-10">
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-white/10 via-white/5 to-white/10">
            <div className="rounded-2xl bg-black/40 ring-1 ring-white/10 px-5 py-4">
              <p className="text-sm text-sub">
                With your subscription, you’ll also join a{" "}
                <span className="font-semibold text-white">private community of startup founders</span> share wins,
                compare playbooks, and get help so you’re never building alone.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs text-sub">
          Need a hand? A human guide is always available to review outputs, adjust strategy, and keep momentum.
        </p>
      </div>
    </section>
  );
}
