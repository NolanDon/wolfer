// components/LottieAgent.tsx
"use client";
import dynamic from "next/dynamic";
import React from "react";

const Player = dynamic(
    () => import("@lottiefiles/react-lottie-player").then((m) => m.Player),
    { ssr: false }
);

type Bubble = { text: string };

export default function LottieAgent({
    title,
    lottieSrc,
    accent,
    bubbles = [],
    chromeless = false,       // <-- NEW
}: {
    title: string;
    lottieSrc: string;
    accent?: string;
    bubbles?: Bubble[];
    chromeless?: boolean;     // <-- NEW
}) {
    return (
        <div className="relative h-full w-full">
            {/* Omit any internal header/chrome when chromeless */}
            {!chromeless && (
                <div className="absolute left-4 top-3 z-10 text-sm font-medium">{title}</div>
            )}
            <Player autoplay loop src={lottieSrc} style={{ width: "100%", height: "100%" }} keepLastFrame />
            {/* if you previously rendered bubbles here, keep them behind a prop as well */}
        </div>
    );
}
