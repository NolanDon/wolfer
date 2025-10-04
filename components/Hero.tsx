"use client";
import CTA from "./CTA";

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
              We scrape reviews from winning products, spot painful gaps, and spin up a launchable MVP with agents for
              marketing, biz-dev, and web. You confirm direction — we build.
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
                  <span className="text-sub">Opportunity snapshot</span>
                  <span className="text-brand-200 text-sm">Live</span>
                </div>

                {/* Research coverage visual */}
                <div className="mt-6 h-40 w-full rounded-lg bg-gradient-to-t from-brand-600/30 to-transparent relative overflow-hidden">
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-r from-brand-500/60 via-cyan-300/50 to-fuchsia-400/50 blur-2xl opacity-60" />
                  <div className="absolute left-4 top-4 text-xs text-sub">
                    Research coverage: <span className="text-ink/90">2,000+ reviews parsed</span>
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
                    <p className="text-lg font-medium">82%</p>
                  </div>
                  <div className="card p-3">
                    <p className="text-xs text-sub">Time to MVP</p>
                    <p className="text-lg font-medium">~10 days</p>
                  </div>
                </div>

                {/* Optional quick facts row */}
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
