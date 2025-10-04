export default function SocialProof() {
  const quotes = [
    ["“This flips ‘AI idea generators’ on their head — it actually finds real gaps.”", "Ex-PM, unicorn SaaS"],
    ["“The agents shipped assets I actually used. Not just drafts.”", "Bootstrapped founder"],
    ["“If this existed last year, I’d have saved months.”", "Growth lead, DTC"]
  ];

  return (
    <section id="proof" className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid md:grid-cols-3 gap-6">
        {quotes.map(([q, a]) => (
          <figure key={q} className="card p-6">
            <blockquote className="text-lg leading-relaxed">{q}</blockquote>
            <figcaption className="mt-3 text-sub text-sm">{a}</figcaption>
          </figure>
        ))}
      </div>
      {/* <div className="mt-8 text-center text-sub text-sm">
        * Logos/media mentions drop here post-coverage. For now, we show live metrics above.
      </div> */}
    </section>
  );
}
