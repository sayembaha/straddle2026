import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Straddle — The Bloomberg Terminal for Finance Content",
  description:
    "Turn earnings prints, macro flow, and rough thoughts into institutional-grade thought leadership in seconds. Built for the side of the desk that writes.",
  openGraph: {
    title: "Straddle — The Bloomberg Terminal for Finance Content",
    description:
      "Institutional content infrastructure for finance professionals.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
