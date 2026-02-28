import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Websevix — On-Demand Web Services Marketplace",
  description:
    "Post your project, receive proposals from vetted developers, and pay securely with milestone-based escrow. Find expert developers, build faster, pay securely.",
  keywords: [
    "web development",
    "freelance developers",
    "escrow",
    "milestone payments",
    "web services marketplace",
  ],
  authors: [{ name: "Websevix" }],
  openGraph: {
    title: "Websevix — On-Demand Web Services Marketplace",
    description:
      "Post your project, receive proposals from vetted developers, and pay securely with milestone-based escrow.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Websevix — On-Demand Web Services Marketplace",
    description: "Find expert developers. Build faster. Pay securely.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable}`}>
      <body className="font-sans antialiased bg-background text-text-primary">
        <div className="noise-overlay" aria-hidden />
        {children}
      </body>
    </html>
  );
}
