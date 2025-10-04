export default function Metrics() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-8 -mt-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          ["Research hrs saved / wk", "12+"],
          ["Benchmarked products", "2,000+"],
          ["Agent playbooks", "40+"],
          ["Founders on list", "1,200+"]
        ].map(([k, v]) => (
          <div key={k} className="card p-5 text-center">
            <div className="text-2xl font-semibold">{v}</div>
            <div className="text-xs text-sub mt-1">{k}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
