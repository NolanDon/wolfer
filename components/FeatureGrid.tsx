export default function FeatureGrid() {
  const items: [string, string][] = [
    ["Review Scraper & Analyzer",
      "Crawls public data of market leaders. Clusters complaints and desires. Scores opportunity size."],
    ["Idea → “Confirm or Tweak”",
      "You confirm the opportunity, refine target user, pick angle; we lock scope & next steps."],
    ["Domain Suggestions",
      "Suggests brandable .ai / .io / .tech domains, with affiliate hooks if available."],
    ["Agent Mixer",
      "Choose the right set of AI agents (marketing, biz-dev, web) sized to your goal + budget."],
    ["Site Generator Hook",
      "Generates a clean starter site + landing copy blocks, ready to deploy / iterate with an active web developer AI ready to make adjustments."],
    ["Ops Dashboard",
      "Daily tasks, progress, and strategy milestones. Export an n8n workflow on Pro."]
  ];

  return (
    <section id="features" className="mx-auto max-w-6xl px-10 py-16">
      <h2 className="text-3xl md:text-4xl font-semibold">MVP features at launch</h2>
      <p className="text-sub mt-2 max-w-2xl">
        Laser-focused features that ship day one, enough to validate the “live agents that construct your startup” thesis.
      </p>

      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {items.map(([title, desc], i) => (
          // wrapper controls the number placement relative to each card
          <div key={title} className="relative">
            {/* Number OUTSIDE the card */}
            <span
              aria-hidden
              className="pointer-events-none absolute -top-7 -left-6 z-20
                         text-8xl md:text-8xl font-black tracking-tighter
                         bg-gradient-to-br from-brand-500/95 via-cyan-300/15 to-fuchsia-400/20
                         text-transparent bg-clip-text select-none"
              style={{ lineHeight: 0.9 }}
            >
              {i + 1}
            </span>
            {/* soft glow behind the number */}
            <span
              aria-hidden
              className="pointer-events-none absolute -top-12 -left-12 z-0
                         h-36 w-36 rounded-full blur-3xl opacity-40
                         bg-gradient-to-tr from-brand-500/30 via-cyan-300/20 to-fuchsia-400/20"
            />

            {/* the card itself */}
            <div className="relative z-10 card p-6">
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sub mt-2">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
