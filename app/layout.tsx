// app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import GtagPageView from "./gtag-pageview";

const GA_MEASUREMENT_ID = "G-2EFW8R86EN";

export const metadata: Metadata = {
  title: "Wolfer | Waitlist",
  description: "Live research + AI agents that build with you. Join the waitlist.",
  openGraph: {
    title: "Wolfer | Waitlist",
    description: "Live research + AI agents that build with you.",
    images: ["/og-image.png"],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const isProd = process.env.NODE_ENV === "production";

  return (
    <html lang="en">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              send_page_view: false,
              debug_mode: ${!isProd}
            });
          `}
        </Script>
      </head>
      <body className="bg-bg bg-radial-spot">
        {/* SPA page_view tracking */}
        <GtagPageView id={GA_MEASUREMENT_ID} />
        {children}
      </body>
    </html>
  );
}
