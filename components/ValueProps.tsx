"use client";

import Image from "next/image";
import Link from "next/link";

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
      "We do deep research of large, successful products to surface validated pain points and overlooked niches.",
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
    <section id="benefits" className="mx-auto max-w-6xl px-6 py-10">

      <h2 className="text-3xl md:text-4xl font-semibold">Why this approach works</h2>
      <p className="text-sub my-2 mb-5 max-w-2xl">
        Most great SaaS starts with real pain, not guessing. We mine public company data to find proven gaps and spin up agents to build fast.
        It’s the same path behind <span className="font-semibold text-white">Slack</span>, <span className="font-semibold text-white">ConvertKit</span>, <span className="font-semibold text-white">UserVoice</span>, and <span className="font-semibold text-white">Markup Hero</span>.
      </p>
      {/* Conversion summary — darker treatment */}
      <div className="mb-10">

        {/* darker gradient frame */}
        <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-brand-500/25 via-cyan-400/15 to-brand-500/25">
          {/* inner dark glass */}
          <div className="relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-sm ring-1 ring-white/5 px-6 py-6 md:px-8 md:py-8 shadow-[0_30px_80px_rgba(0,0,0,0.45),0_20px_50px_rgba(40,30,120,0.18)]">
            {/* darker, subtler glows */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-gradient-to-tr from-brand-500/12 to-cyan-300/10 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-gradient-to-tr from-cyan-300/10 to-brand-500/12 blur-3xl"
            />
            {/* faint/dark grid */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-soft-light"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.25) 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
            />

            <ul className="relative mt-5 space-y-2 text-[15px] leading-7 text-sub">
              <li>
                • <span className="font-medium text-white">Slack</span> started as an internal tool the team wished existed, then became the product.
              </li>
              <li>
                • <span className="font-medium text-white">ConvertKit</span> was built from frustration with creator email workflows, simpler automations, better tagging.
              </li>
              <li>
                • <span className="font-medium text-white">UserVoice</span> emerged from the need to collect and prioritize feedback more sanely.
              </li>
              <li>
                • <span className="font-medium text-white">Markup Hero</span> came from wanting a faster, lighter screenshot + annotation flow.
              </li>
            </ul>

            <div className="relative mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
              <Link
                href="/waitlist"
                className="inline-flex items-center justify-center rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-400 shadow-lg shadow-black/40"
              >
                Join the Waitlist
              </Link>
              <span className="text-xs text-sub">Early access spots this month are limited.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Existing value props grid (unchanged) */}
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((it, idx) => (
          <div key={it.title} className="card relative overflow-hidden p-6">
            <div
              aria-hidden
              className="pointer-events-none absolute right-3 top-3 sm:right-4 sm:top-4 w-20 sm:w-24 md:w-28 lg:w-32 aspect-square"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-500/10 to-cyan-300/10 blur-2xl" />
              <div className="relative h-full w-full">
                <Image
                  src={it.img}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, (max-width: 1024px) 112px, 128px"
                  className="object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                  priority={idx === 0}
                />
              </div>
            </div>

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
