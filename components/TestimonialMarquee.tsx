"use client";
import clsx from "clsx";
import { useEffect, useState } from "react";

type Note = {
    line: string;
    author: string;
    role?: string;
    initials?: string;
};

const anticipation: Note[] = [
    { line: "I’m done wasting weeks on idea roulette. Ready for real market gaps.", author: "Amara K.", role: "Builder", initials: "AK" },
    { line: "If you can turn reviews into opportunities, I’m in on day one.", author: "Luis R.", role: "Growth", initials: "LR" },
    { line: "Craving agents that actually execute. No more drafts-that-die.", author: "Sam P.", role: "Indie", initials: "SP" },
    { line: "Domain picks + agent mixer? That’s the launch kit I wanted last year.", author: "Jae H.", role: "PM", initials: "JH" },
    { line: "Please help me skip the ‘shiny idea’ trap and ship faster.", author: "Mina T.", role: "Founder", initials: "MT" },
    { line: "Research-first beats AI idea spam. Take my email.", author: "Devin L.", role: "Engineer", initials: "DL" },
];

const loop = [...anticipation, ...anticipation];

/* --------- mobile detector (client-only, SSR-safe) --------- */
function useIsMobile(maxWidth = 768) {
    const [mobile, setMobile] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia(`(max-width:${maxWidth}px)`);
        const onChange = (e: MediaQueryListEvent | MediaQueryList) =>
            setMobile("matches" in e ? e.matches : (e as MediaQueryList).matches);
        onChange(mq);
        mq.addEventListener?.("change", onChange as any);
        return () => mq.removeEventListener?.("change", onChange as any);
    }, [maxWidth]);
    return mobile;
}

export default function TestimonialMarquee({
    className,
    rows = 1,
}: {
    className?: string;
    rows?: 1 | 2;
}) {
    return (
        <section
            className={clsx(
                "relative overflow-hidden border-y border-white/10 bg-white/[0.04] py-3",
                className
            )}
            style={{
                WebkitMaskImage:
                    "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,.9) 10%, rgba(0,0,0,.9) 90%, rgba(0,0,0,0) 100%)",
                maskImage:
                    "linear-gradient(to right, transparent 0%, rgba(0,0,0,.9) 10%, rgba(0,0,0,.9) 90%, transparent 100%)",
            }}
        >
            {/* Faster cycle on mobile */}
            <MarqueeRow items={loop} speed={26} speedMobile={14} />
            {rows === 2 && (
                <MarqueeRow items={loop} speed={34} speedMobile={18} reverse className="mt-3" />
            )}
        </section>
    );
}

function MarqueeRow({
    items,
    speed = 30,
    speedMobile,
    reverse = false,
    className,
}: {
    items: Note[];
    speed?: number;           // desktop duration (s)
    speedMobile?: number;     // mobile duration (s)
    reverse?: boolean;
    className?: string;
}) {
    const isMobile = useIsMobile();
    const duration = `${(isMobile ? speedMobile ?? Math.max(10, speed * 0.55) : speed)}s`;

    return (
        <div className={clsx("group relative", className)}>
            <div
                className={clsx(
                    "flex gap-4 will-change-transform",
                    "animate-marquee",
                    reverse && "animate-marquee-reverse"
                )}
                style={{ animationDuration: duration }}
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
        <figure
            className={clsx(
                "shrink-0",
                // smaller cards on mobile to keep fewer pixels moving
                "min-w-[260px] max-w-[300px] sm:min-w-[360px] sm:max-w-[420px]"
            )}
        >
            <div
                className={clsx(
                    "rounded-2xl border border-white/10 px-5 py-4 transition",
                    // tone down expensive effects on mobile
                    "bg-white/4 sm:bg-white/6",
                    "backdrop-blur-0 sm:backdrop-blur-md",
                    "shadow-none sm:shadow-[0_0_24px_rgba(111,87,255,0.12)]",
                    "hover:bg-white/6 sm:hover:bg-white/8 sm:hover:shadow-[0_0_36px_rgba(111,87,255,0.18)]"
                )}
            >
                <blockquote className="text-[15px] leading-relaxed">
                    “{note.line}”
                </blockquote>
                <figcaption className="mt-3 flex items-center gap-3 text-sub text-xs">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-brand-500 to-cyan-300 text-[10px] text-white">
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
