import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wolfer | Waitlist",
  description: "Live research + AI agents that build with you. Join the waitlist.",
  openGraph: {
    title: "Wolfer | Waitlist",
    description: "Live research + AI agents that build with you.",
    images: ["/og-image.png"]
  },
  twitter: { card: "summary_large_image" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg bg-radial-spot">
        {children}
      </body>
    </html>
  );
}
