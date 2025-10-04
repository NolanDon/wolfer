"use client";

import { Player } from "@lottiefiles/react-lottie-player"; // alt: import Lottie from "lottie-react"
import Image from "next/image";
import clsx from "clsx";

type Bubble = { text: string };
type Props = {
    title: string;
    lottieSrc: string;     // e.g. "/lotties/agent-marketer.json"
    bubbles: Bubble[];     // chat bubbles to show what they’re doing today
    accent?: "purple" | "cyan" | "pink";
};

const accentMap = {
    purple: "from-brand-500",
    cyan: "from-cyan-300",
    pink: "from-fuchsia-400",
};

export default function LottieAgent({ title, lottieSrc, bubbles, accent = "purple" }: Props) {
    return (
        <div className="card p-5 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-3">
                <div className={clsx("h-2 w-2 rounded-full bg-gradient-to-tr", accentMap[accent], "to-white/70")} />
                <h3 className="font-semibold">{title}</h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                {/* Lottie visual */}
                <div className="rounded-xl bg-black/20 border border-white/10 p-3">
                    {/* If you prefer lottie-react: <Lottie animationData={json} loop /> (requires importing json) */}
                    <Player src={lottieSrc} autoplay loop style={{ height: 160, width: "100%" }} />
                </div>

                {/* “What I’m doing today” chat bubbles */}
                <div className="flex flex-col gap-2">
                    {bubbles.map((b, i) => (
                        <div key={i} className="relative max-w-full">
                            <div className="rounded-xl bg-white/8 border border-white/10 px-3 py-2 text-sm leading-relaxed">
                                {b.text}
                            </div>
                            {/* tiny tail */}
                            <div className="absolute left-3 -bottom-1 h-2 w-2 rotate-45 bg-white/8 border-l border-b border-white/10" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
