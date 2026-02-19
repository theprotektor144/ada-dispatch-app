import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Techspatch — AI-Powered Freight Intelligence Platform",
  description:
    "CarrierScout and Techspatch Nexus: AI-driven carrier intelligence and real-time dispatch automation for modern freight brokerages. Find carriers instantly. Dispatch seamlessly. Scale infinitely.",
  keywords: [
    "freight technology",
    "carrier intelligence",
    "dispatch automation",
    "freight brokerage",
    "AI logistics",
    "CarrierScout",
    "Techspatch Nexus",
    "TMS integration",
  ],
  openGraph: {
    title: "Techspatch — AI-Powered Freight Intelligence",
    description:
      "AI-driven carrier intelligence and dispatch automation for modern freight brokerages.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
