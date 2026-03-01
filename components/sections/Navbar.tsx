"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const links = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Services", href: "#services" },
  { label: "For Developers", href: "#" },
  { label: "Pricing", href: "#" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const rm = useReducedMotion();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "py-3 bg-[#050510]/85 backdrop-blur-2xl border-b border-white/[0.05]"
            : "py-5 bg-transparent"
        }`}
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="transition-transform duration-300 group-hover:scale-105">
              <rect width="28" height="28" rx="8" fill="url(#logoGrad)" />
              <path d="M8 10h12M8 14h8M8 18h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366F1" />
                  <stop offset="1" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
            <span className="font-display font-bold text-[17px] text-snow tracking-tight">Websevix</span>
          </Link>

          {/* Center nav */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              {links.map((l, i) => (
                <motion.div key={l.href} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + i * 0.06 }}>
                  <Link
                    href={l.href}
                    className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate hover:text-snow hover:bg-white/[0.07] transition-all duration-200"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </nav>

          {/* Right CTAs */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link href="#login" className="text-sm font-medium text-slate hover:text-snow px-3 py-2 rounded-lg hover:bg-white/[0.05] transition-all duration-200">
              Sign In
            </Link>
            <Link href="#signup" className="btn-primary text-sm px-5 py-2.5">
              Get Started →
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="md:hidden p-2 rounded-lg text-slate hover:text-snow hover:bg-white/[0.05] transition-all"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] md:hidden flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-[#050510]/96 backdrop-blur-3xl" onClick={() => setOpen(false)} />
            <motion.div
              className="relative h-full flex flex-col px-6 pt-5 pb-8"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
            >
              <div className="flex items-center justify-between mb-8">
                <Link href="/" className="flex items-center gap-2">
                  <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
                    <rect width="28" height="28" rx="8" fill="url(#mLogoGrad)" />
                    <path d="M8 10h12M8 14h8M8 18h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    <defs><linearGradient id="mLogoGrad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse"><stop stopColor="#6366F1" /><stop offset="1" stopColor="#8B5CF6" /></linearGradient></defs>
                  </svg>
                  <span className="font-display font-bold text-base text-snow">Websevix</span>
                </Link>
                <button type="button" onClick={() => setOpen(false)} className="p-2 rounded-lg text-slate hover:text-snow">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 flex flex-col gap-1">
                {links.map((l, i) => (
                  <motion.div key={l.href} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-3.5 text-base text-silver hover:text-snow rounded-xl hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06] transition-all"
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="flex flex-col gap-3 mt-6">
                <Link href="#login" onClick={() => setOpen(false)} className="btn-ghost text-center py-3.5 text-base">Sign In</Link>
                <Link href="#signup" onClick={() => setOpen(false)} className="btn-primary text-center py-3.5 text-base">Get Started →</Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
