export default function SocialProof() {
  const quotes = [
    ["“This feels way closer to how real founders think about ideas.”", "Ex-PM, unicorn SaaS"],
    ["“Can’t wait to see if it actually builds out the startup steps.”", "Bootstrapped founder"],
    ["“I’ve spent months validating bad ideas—hoping this saves me from that.”", "Growth lead, DTC"]
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
