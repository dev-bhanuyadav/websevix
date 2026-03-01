import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

// Body font — DM Sans: clean, modern humanist
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

// Display font — Space Grotesk: geometric, premium SaaS feel
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Websevix — Where Great Web Projects Get Built",
  description:
    "Post your project, receive proposals from vetted developers, and ship faster — all backed by milestone-based escrow.",
  keywords: ["web development", "hire developers", "escrow payments", "milestone projects"],
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

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans bg-base text-snow antialiased">
        <AuthProvider>
          <div className="noise-overlay" aria-hidden />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
