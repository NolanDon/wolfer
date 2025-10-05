// app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

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
        {/* gtag loader */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        {/* gtag init */}
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            // mark gtag load time
            gtag('js', new Date());

            // Disable automatic page_view so we control SPA navigation events
            gtag('config', '${GA_MEASUREMENT_ID}', {
              send_page_view: false,
              debug_mode: ${!isProd} // enable in dev/preview
            });
          `}
        </Script>
      </head>
      <body className="bg-bg bg-radial-spot">
        {/* Track SPA page views */}
        <GtagPageView gaMeasurementId={GA_MEASUREMENT_ID} />
        {children}
      </body>
    </html>
  );
}

/** Inline client component to avoid making a new file if you prefer */
function GtagPageView({ gaMeasurementId }: { gaMeasurementId: string }) {
  // This block is client-only
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const React = require("react");
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { usePathname, useSearchParams } = require("next/navigation");
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { useEffect } = React;

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : "");
    // Fire a GA4 page_view on mount + whenever the route/search changes
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "page_view", {
        page_path: url,
        page_location: window.location.href,
        send_to: gaMeasurementId,
      });
    }
  }, [pathname, searchParams, gaMeasurementId]);

  return null;
}
