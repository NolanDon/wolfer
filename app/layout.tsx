// app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import "./globals.css";
import GtagPageView from "./gtag-pageview";
import FbPageView from "./FbPageView";

const GA_MEASUREMENT_ID = "G-2EFW8R86EN";
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || "";

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
        {/* GA4 */}
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

        {/* Meta Pixel base code (only if env var present) */}
        {FB_PIXEL_ID && (
          <Script id="fb-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
              n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
              (window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${FB_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
      </head>
      <body className="bg-bg bg-radial-spot">
        {/* noscript fallback for Pixel */}
        {FB_PIXEL_ID ? (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        ) : null}

        {/* SPA page_view tracking for GA4 + Meta */}
        <Suspense fallback={null}>
          <GtagPageView id={GA_MEASUREMENT_ID} />
          {FB_PIXEL_ID ? <FbPageView /> : null}
        </Suspense>

        {children}
      </body>
    </html>
  );
}
