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
    "Post your project, get proposals from vetted developers, and pay securely with milestone-based escrow. Find expert developers, build faster, pay securely.",
  keywords: [
    "web development marketplace",
    "hire developers",
    "escrow payments",
    "milestone-based projects",
    "freelance web services",
  ],
  authors: [{ name: "Websevix" }],
  themeColor: "#04040F",
  openGraph: {
    title: "Websevix — On-Demand Web Services Marketplace",
    description: "Post your project, get proposals from vetted developers, and pay securely.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Websevix — Build Faster. Pay Securely.",
    description: "The professional marketplace for web services.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable}`}>
      <body className="font-sans antialiased bg-[#04040F] text-ink-white">
        <div className="noise-overlay" aria-hidden />
        {children}
      </body>
    </html>
  );
}
