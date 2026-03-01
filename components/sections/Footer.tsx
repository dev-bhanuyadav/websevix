"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Twitter, Linkedin, Github } from "lucide-react";

const ease = [0.25, 0.1, 0.25, 1] as const;

const cols = [
  {
    heading: "Platform",
    links: [
      { label: "How It Works", href: "#how-it-works" },
      { label: "Services", href: "#services" },
      { label: "For Developers", href: "#" },
      { label: "Pricing", href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.05] bg-[#050510]">
      <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/25 to-transparent" />
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand */}
          <motion.div
            className="col-span-2 sm:col-span-1"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
          >
            <Link href="/" className="flex items-center gap-2 mb-4 group w-fit">
              <svg width="26" height="26" viewBox="0 0 28 28" fill="none" className="transition-transform group-hover:scale-105 duration-300">
                <rect width="28" height="28" rx="8" fill="url(#fLogoGrad)" />
                <path d="M8 10h12M8 14h8M8 18h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <defs>
                  <linearGradient id="fLogoGrad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6366F1" />
                    <stop offset="1" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="font-display font-bold text-base text-snow">Websevix</span>
            </Link>
            <p className="text-sm text-slate leading-relaxed max-w-[200px]">
              The professional platform for web project delivery.
            </p>
          </motion.div>

          {/* Links */}
          {cols.map((col, ci) => (
            <motion.div
              key={col.heading}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.07 * (ci + 1), ease }}
            >
              <h4 className="text-[11px] font-semibold text-slate uppercase tracking-[0.16em] mb-4">{col.heading}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-slate hover:text-snow transition-colors duration-200 hover:-translate-y-px inline-block">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom */}
        <motion.div
          className="pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-xs text-dim">© {new Date().getFullYear()} Websevix · Made with ❤️ in India</p>
          <div className="flex items-center gap-1">
            {[
              { Icon: Twitter, href: "#", label: "Twitter" },
              { Icon: Linkedin, href: "#", label: "LinkedIn" },
              { Icon: Github, href: "#", label: "GitHub" },
            ].map(({ Icon, href, label }) => (
              <Link key={label} href={href} aria-label={label}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate hover:text-indigo-400 hover:bg-indigo-500/8 transition-all duration-200">
                <Icon className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
