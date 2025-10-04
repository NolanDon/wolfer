"use client";
import LottieAgent from "./LottieAgent";

export default function HowItWorks() {
  const steps = [
    ["Scrape & synthesize", "We crawl reviews + public chatter to detect pain clusters and success patterns."],
    ["Validate & confirm", "You review the shortlist; pick a direction; we score feasibility + moat."],
    ["Assemble agents", "We propose the right mix (SEO/ads/outreach/web) and spin them up."],
    ["Launch ops", "A focused dashboard drives daily execution. Export to n8n on Pro."]
  ];

  return (
    <section id="how" className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-3xl md:text-4xl font-semibold">How it works</h2>

      {/* Steps grid */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        {steps.map(([t, d], i) => (
          <div key={i} className="card p-6">
            <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-brand-200">{i + 1}</div>
            <h3 className="mt-3 font-semibold">{t}</h3>
            <p className="text-sub mt-2">{d}</p>
          </div>
        ))}
      </div>

      {/* Agents showcase */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4">Your AI agents (today’s plan)</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <LottieAgent
            title="Marketing Agent"
            lottieSrc="/lotties/agent-marketer.json"
            accent="purple"
            bubbles={[
              { text: "Drafting 3 landing-page headline variations." },
              { text: "Compiling 20 keywords with low difficulty." },
              { text: "Scheduling 2 A/B ad tests for Friday." }
            ]}
          />
          <LottieAgent
            title="Biz-Dev Agent"
            lottieSrc="/lotties/agent-bizdev.json"
            accent="cyan"
            bubbles={[
              { text: "Finding 50 ICP leads from review pain clusters." },
              { text: "Personalizing 10 first-touch emails." },
              { text: "Queuing LinkedIn follow-ups." }
            ]}
          />
          <LottieAgent
            title="Web Agent"
            lottieSrc="/lotties/agent-webdev.json"
            accent="pink"
            bubbles={[
              { text: "Generating hero copy & CTA blocks." },
              { text: "Assembling features section from clusters." },
              { text: "Pushing a preview to Vercel." }
            ]}
          />
        </div>
      </div>
    </section>
  );
}
