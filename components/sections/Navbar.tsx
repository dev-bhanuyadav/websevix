"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";
import { navLinks } from "@/data/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const rm = useReducedMotion();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <motion.header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "py-3 bg-[#04040F]/80 backdrop-blur-2xl border-b border-white/[0.06]"
            : "py-5 bg-transparent"
        }`}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-violet-400 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-md transition-shadow duration-300">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-display font-bold text-lg text-ink-white tracking-tight">
              Websevix
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.4 }}
              >
                <Link
                  href={link.href}
                  className="relative px-4 py-2 text-sm text-ink-muted hover:text-ink-white rounded-lg hover:bg-white/[0.05] transition-all duration-200 font-medium"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="#login"
              className="text-sm font-medium text-ink-muted hover:text-ink-white px-4 py-2 rounded-lg hover:bg-white/[0.05] transition-all duration-200"
            >
              Sign In
            </Link>
            <Link
              href="#signup"
              className="btn-shimmer text-sm font-semibold text-white px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-700 to-violet-500 hover:from-violet-600 hover:to-violet-400 shadow-glow-sm hover:shadow-glow-md transition-all duration-300"
            >
              Start Building →
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-ink-muted hover:text-ink-white hover:bg-white/[0.05] transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[60] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-[#04040F]/95 backdrop-blur-2xl"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="relative h-full flex flex-col px-6 pt-6 pb-10"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between mb-10">
                <Link href="/" className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-violet-400 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white fill-white" />
                  </div>
                  <span className="font-display font-bold text-lg text-ink-white">Websevix</span>
                </Link>
                <button
                  type="button"
                  className="p-2 rounded-lg text-ink-muted hover:text-ink-white hover:bg-white/[0.05]"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * i }}
                  >
                    <Link
                      href={link.href}
                      className="block px-4 py-3.5 text-base font-medium text-ink-soft hover:text-ink-white rounded-xl hover:bg-white/[0.05] border border-transparent hover:border-white/[0.07] transition-all"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="flex flex-col gap-3 mt-8">
                <Link
                  href="#login"
                  className="text-center py-3.5 rounded-xl border border-white/[0.1] text-ink-soft font-medium hover:bg-white/[0.05] transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="#signup"
                  className="btn-shimmer text-center py-3.5 rounded-xl bg-gradient-to-r from-violet-700 to-violet-500 text-white font-semibold shadow-glow-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Start Building →
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
