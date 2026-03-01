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
  title: "Websevix — Where Great Web Projects Get Built",
  description:
    "Post your project, receive proposals from vetted developers, and ship faster — all backed by milestone-based escrow.",
  keywords: ["web development", "hire developers", "escrow payments", "milestone projects", "freelance web platform"],
  authors: [{ name: "Websevix" }],
  openGraph: {
    title: "Websevix — Where Great Web Projects Get Built",
    description: "Post your project, receive proposals from vetted developers, and pay securely.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Websevix — Where Great Web Projects Get Built",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable}`}>
      <body className="font-sans bg-base text-snow antialiased">
        <div className="noise-overlay" aria-hidden />
        {children}
      </body>
    </html>
  );
}
