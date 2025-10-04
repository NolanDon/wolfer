"use client";
import clsx from "clsx";

type Note = {
    line: string;
    author: string;
    role?: string;
    initials?: string; // optional avatar initials
};

const anticipation: Note[] = [
    { line: "I’m done wasting weeks on idea roulette. Ready for real market gaps.", author: "Amara K.", role: "Builder", initials: "AK" },
    { line: "If you can turn reviews into opportunities, I’m in on day one.", author: "Luis R.", role: "Growth", initials: "LR" },
    { line: "Craving agents that actually execute. No more drafts-that-die.", author: "Sam P.", role: "Indie", initials: "SP" },
    { line: "Domain picks + agent mixer? That’s the launch kit I wanted last year.", author: "Jae H.", role: "PM", initials: "JH" },
    { line: "Please help me skip the ‘shiny idea’ trap and ship faster.", author: "Mina T.", role: "Founder", initials: "MT" },
    { line: "Research-first beats AI idea spam. Take my email.", author: "Devin L.", role: "Engineer", initials: "DL" }
];

// duplicate for seamless loop
const loop = [...anticipation, ...anticipation];

export default function TestimonialMarquee({
    className,
    rows = 1
}: {
    className?: string;
    rows?: 1 | 2; // set to 2 for a double-line marquee
}) {
    return (
        <section
            className={clsx(
                "relative overflow-hidden border-y border-white/10 bg-white/[0.04] py-3",
                className
            )}
            // gradient masks for soft edge fade
            style={{
                WebkitMaskImage:
                    "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,.9) 10%, rgba(0,0,0,.9) 90%, rgba(0,0,0,0) 100%)",
                maskImage:
                    "linear-gradient(to right, transparent 0%, rgba(0,0,0,.9) 10%, rgba(0,0,0,.9) 90%, transparent 100%)"
            }}
        >
            <MarqueeRow items={loop} speed={26} />
            {rows === 2 && <MarqueeRow items={loop} speed={34} reverse className="mt-3" />}
        </section>
    );
}

function MarqueeRow({
    items,
    speed = 30,
    reverse = false,
    className
}: {
    items: Note[];
    speed?: number; // seconds for full cycle
    reverse?: boolean;
    className?: string;
}) {
    return (
        <div className={clsx("group relative", className)}>
            <div
                className={clsx(
                    "flex gap-4 will-change-transform",
                    "animate-marquee",
                    reverse && "animate-marquee-reverse"
                )}
                style={{
                    animationDuration: `${speed}s`
                }}
            >
                {items.map((t, i) => (
                    <Card key={`${t.author}-${i}`} note={t} />
                ))}
            </div>
        </div>
    );
}

function Card({ note }: { note: Note }) {
    return (
        <figure className="shrink-0 min-w-[360px] max-w-[420px]">
            <div className="rounded-2xl border border-white/10 bg-white/6 backdrop-blur-md px-5 py-4
                      shadow-[0_0_24px_rgba(111,87,255,0.12)] transition
                      hover:bg-white/8 hover:shadow-[0_0_36px_rgba(111,87,255,0.18)]">
                <blockquote className="text-[15px] leading-relaxed">
                    “{note.line}”
                </blockquote>
                <figcaption className="mt-3 flex items-center gap-3 text-sub text-xs">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full
                           bg-gradient-to-tr from-brand-500 to-cyan-300 text-[10px] text-white">
                        {note.initials ?? "•"}
                    </span>
                    <span>
                        — {note.author}
                        {note.role ? <span className="opacity-70">, {note.role}</span> : null}
                    </span>
                </figcaption>
            </div>
        </figure>
    );
}
