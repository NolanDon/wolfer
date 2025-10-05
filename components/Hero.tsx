"use client";
import { useEffect, useState } from "react";
import CTA from "./CTA";
import LivePulse, { LiveBadge } from "./LivePulse";

/* ---------- mini ticker that loops ideas ---------- */
function IdeaTicker() {
  const ideas = [
    { name: "Inbox rules + AI summaries for Shopify refunds", score: 86 },
    { name: "Slack bot that flags churn risk from review tone", score: 82 },
    { name: "Auto-build FAQ pages from 1★ review clusters", score: 79 },
    { name: "Niche CRM for agencies tracking Reddit leads", score: 84 },
    { name: "Chrome helper to rewrite listings by pain cluster", score: 81 },
  ];

  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // fade out → swap → fade in
    const t = setInterval(() => {
      setVisible(false);
      const swap = setTimeout(() => {
        setI((prev) => (prev + 1) % ideas.length);
        setVisible(true);
      }, 300); // out duration
      return () => clearTimeout(swap);
    }, 3400); // total per item
    return () => clearInterval(t);
  }, [ideas.length]);

  // respect reduced motion
  const prefersReduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const item = ideas[i];

  return (
    <div className="mt-4 rounded-lg border border-emerald-400/15 bg-emerald-300/5 px-3 py-3">
      <div className="mb-2 flex items-center gap-2 text-[11px] text-sub">
        <span className="relative inline-flex h-2 w-2">
          <span className="absolute inline-flex h-2 w-2 rounded-full bg-emerald-400/80 opacity-70"></span>
          <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-emerald-400/60"></span>
        </span>
        New ideas detected
      </div>

      <div className="relative h-[48px] overflow-hidden">
        <div
          key={item.name} // remount for smooth transition
          className={`absolute inset-0 flex items-center justify-between gap-3 rounded-md bg-black/25 px-3 py-2 ring-1 ring-white/5
            ${prefersReduced ? "" : visible ? "opacity-100 translate-y-0 transition-all duration-400 ease-out" : "opacity-0 translate-y-2 transition-all duration-300 ease-in"}
          `}
        >
          <p className="text-[13px] leading-tight text-white/90 line-clamp-2">{item.name}</p>
          <span className="shrink-0 rounded-md bg-emerald-500/15 px-2 py-1 text-[12px] font-semibold text-emerald-300 ring-1 ring-emerald-400/20">
            {item.score}%
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------ Hero ------------------------ */
export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4">
        <div className="py-20 md:py-28 grid lg:grid-cols-2 gap-10">
          {/* Copy / left column */}
          <div>
            <p className="text-brand-200 mb-3">WolferAI</p>
            <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
              Hello, we’re the <span className="text-brand-400">live agents</span> that
              <br /> construct your startup.
            </h1>
            <p className="mt-5 text-sub max-w-xl">
              Not “AI ideas.” Real <strong>research + execution</strong>.
              We do deep research on winning products, spot painful gaps, and spin up a launchable MVP with agents for
              marketing, biz-dev, and web. You confirm direction, we lay the foundation.
            </p>
            <div className="mt-8">
              <CTA compact />
            </div>
            <p className="mt-3 text-xs text-sub">VIP early access • Founders get lifetime discount</p>
          </div>

          {/* Visual / right column */}
          <div className="relative">
            <div className="card p-4">
              <div className="rounded-xl border border-white/10 bg-black/20 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sub">Opportunity Dashboard</span>
                  {/* Either just the icon + text */}
                  <span className="inline-flex items-center gap-2 text-brand-200 text-sm">
                    <LiveBadge size={8} />
                  </span>
                </div>

                {/* Research coverage visual */}
                <div className="mt-6 h-40 w-full rounded-lg bg-gradient-to-t from-brand-600/30 to-transparent relative overflow-hidden">
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-r from-brand-500/60 via-cyan-300/50 to-fuchsia-400/50 blur-2xl opacity-60" />
                  <div className="absolute left-4 top-4 text-xs text-sub">
                    Research coverage: <span className="text-ink/90">2,000+ data points parsed</span>
                  </div>

                  {/* Live idea ticker overlay (feels like app output) */}
                  <div className="absolute inset-x-4 bottom-4">
                    <IdeaTicker />
                  </div>
                </div>

                {/* Model-aligned KPIs */}
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div className="card p-3">
                    <p className="text-xs text-sub">Pain points detected</p>
                    <p className="text-lg font-medium">37 clusters</p>
                  </div>
                  <div className="card p-3">
                    <p className="text-xs text-sub">Confidence score</p>
                    <p className="text-lg font-medium text-emerald-300">82%</p>
                  </div>
                  <div className="card p-3">
                    <p className="text-xs text-sub">Time to MVP</p>
                    <p className="text-lg font-medium">~10 days</p>
                  </div>
                </div>

                {/* Quick facts */}
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <p className="text-[11px] text-sub">Agent mix</p>
                    <p className="text-sm">SEO • Outreach • Web</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <p className="text-[11px] text-sub">Domain hits</p>
                    <p className="text-sm">5 available</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <p className="text-[11px] text-sub">Moat signal</p>
                    <p className="text-sm">Medium–High</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -right-6 -bottom-6 hidden md:block h-24 w-24 rounded-full bg-gradient-orb opacity-60 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
