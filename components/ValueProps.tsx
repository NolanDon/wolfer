"use client";

import Image from "next/image";

type Item = {
  title: string;
  desc: string;
  img: string;   // /public path
  alt: string;   // decorative here; we’ll hide from SR
};

const items: Item[] = [
  {
    title: "Real research, not generic AI",
    desc:
      "We scrape reviews of large, successful products to surface validated pain points and overlooked niches.",
    img: "/images/research.webp",
    alt: "Holographic magnifying glass scanning review data",
  },
  {
    title: "Agents that actually build",
    desc:
      "Spin up agents for marketing, biz-dev, and web. They produce assets, outreach lists, and site scaffolds.",
    img: "/images/agent.webp",
    alt: "3D AI builder agent mascot",
  },
  {
    title: "Save $1,000s in wasted ideas",
    desc:
      "We’ve aggregated years of SEO, marketing, and BD lessons so you skip the dead ends and launch faster.",
    img: "/images/compass.webp",
    alt: "Futuristic compass with glowing path",
  },
];

export default function ValueProps() {
  return (
    <section id="benefits" className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((it, idx) => (
          <div key={it.title} className="card relative overflow-hidden p-6">
            {/* Overlay image in the top-right; doesn't affect layout */}
            <div
              aria-hidden // decorative
              className="pointer-events-none absolute right-3 top-3 sm:right-4 sm:top-4
                         w-20 sm:w-24 md:w-28 lg:w-32 aspect-square"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-500/10 to-cyan-300/10 blur-2xl" />
              <div className="relative h-full w-full">
                <Image
                  src={it.img}
                  alt=""                    // hide from screen readers (decorative)
                  fill
                  sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, (max-width: 1024px) 112px, 128px"
                  className="object-contain drop-shadow-[0_10px_30px_rgba(111,87,255,0.25)]"
                  priority={idx === 0}
                />
              </div>
            </div>

            {/* Content with extra right padding so text never hits the image */}
            <div className="min-w-0 pr-24 sm:pr-28 md:pr-32 lg:pr-36">
              <h3 className="text-2xl font-semibold leading-snug tracking-tight text-pretty">
                {it.title}
              </h3>
              <p className="mt-3 text-sub text-[16px] leading-8 max-w-[42ch] text-pretty">
                {it.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
