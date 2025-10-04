// components/LivePulse.tsx
"use client";
import clsx from "clsx";

type Props = {
    size?: number;             // px
    className?: string;
    srLabel?: string;
    ringClass?: string;        // outer pulse color
    dotClass?: string;         // inner dot color
};

export default function LivePulse({
    size = 8,
    className,
    srLabel = "Live",
    ringClass = "bg-emerald-400/60",
    dotClass = "bg-emerald-400/90",
}: Props) {
    const dim = { width: `${size}px`, height: `${size}px` };
    return (
        <span role="status" aria-label={srLabel} className={clsx("relative inline-flex", className)}>
            <span
                className={clsx("absolute inline-flex rounded-full motion-safe:animate-ping motion-reduce:animate-none", ringClass)}
                style={dim}
                aria-hidden
            />
            <span className={clsx("relative inline-flex rounded-full", dotClass)} style={dim} aria-hidden />
        </span>
    );
}

// Optional: a badge with label included
export function LiveBadge({ label = "Live", size = 8 }: { label?: string; size?: number }) {
    return (
        <span className="inline-flex items-center gap-2 text-brand-200 text-sm">
            <LivePulse size={size} />
            {label}
        </span>
    );
}
