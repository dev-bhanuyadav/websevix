"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const EXPO = [0.16, 1, 0.3, 1] as const;

const links = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Services",     href: "#services"    },
  { label: "Developers",   href: "#"            },
  { label: "Pricing",      href: "#"            },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const rm = useReducedMotion();
  const router = useRouter();

  const goAuth = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    try {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      sessionStorage.setItem("blast_origin", JSON.stringify({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      }));
    } catch { /* ignore */ }
    router.push(href);
  }, [router]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
          scrolled
            ? "py-3 bg-[#050510]/88 backdrop-blur-2xl border-b border-white/[0.05] shadow-[0_1px_0_rgba(255,255,255,0.04)]"
            : "py-6 bg-transparent"
        }`}
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.0, ease: EXPO, delay: 0.1 }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: EXPO, delay: 0.25 }}
          >
            <Link href="/" className="flex items-center gap-2.5 group">
              <motion.div
                className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center"
                whileHover={rm ? {} : { scale: 1.08, rotate: 5 }}
                transition={{ duration: 0.5, ease: EXPO }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 5h10M3 8h7M3 11h8" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </motion.div>
              <span className="font-display font-bold text-[17px] text-snow tracking-tight">
                Websevix
              </span>
            </Link>
          </motion.div>

          {/* Center nav */}
          <nav className="hidden md:block">
            <motion.div
              className="flex items-center gap-0.5 px-2.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EXPO, delay: 0.35 }}
            >
              {links.map((l, i) => (
                <motion.div
                  key={l.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, ease: EXPO, delay: 0.45 + i * 0.07 }}
                >
                  <Link
                    href={l.href}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-slate hover:text-snow hover:bg-white/[0.07] transition-all duration-400"
                    style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </nav>

          {/* Right CTAs */}
          <motion.div
            className="hidden md:flex items-center gap-2.5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: EXPO, delay: 0.4 }}
          >
            <Link
              href="/login"
              onClick={(e) => goAuth(e, "/login")}
              className="text-sm font-medium text-slate hover:text-snow px-4 py-2 rounded-lg hover:bg-white/[0.04] transition-all duration-500"
              style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              onClick={(e) => goAuth(e, "/signup")}
              className="btn-primary btn-shimmer text-sm px-5 py-2.5"
            >
              Get Started →
            </Link>
          </motion.div>

          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            className="md:hidden p-2 rounded-lg text-slate hover:text-snow hover:bg-white/[0.05] transition-all duration-400"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <Menu className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EXPO }}
          >
            <div className="absolute inset-0 bg-[#050510]/97 backdrop-blur-3xl" onClick={() => setOpen(false)} />
            <motion.div
              className="relative h-full flex flex-col px-6 pt-5 pb-10"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.6, ease: EXPO }}
            >
              <div className="flex items-center justify-between mb-10">
                <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
                  <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 5h10M3 8h7M3 11h8" stroke="white" strokeWidth="1.8" strokeLinecap="round" /></svg>
                  </div>
                  <span className="font-display font-bold text-base text-snow">Websevix</span>
                </Link>
                <button type="button" onClick={() => setOpen(false)} className="p-2 rounded-lg text-slate hover:text-snow">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 flex flex-col gap-1">
                {links.map((l, i) => (
                  <motion.div
                    key={l.label}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: EXPO, delay: 0.08 * i }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-4 text-base font-medium text-silver hover:text-snow rounded-xl hover:bg-white/[0.04] transition-all duration-500"
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <motion.div
                className="flex flex-col gap-3 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EXPO, delay: 0.35 }}
              >
                <Link href="/login" onClick={(e) => { setOpen(false); goAuth(e, "/login"); }} className="btn-ghost text-center py-4 text-base">Sign In</Link>
                <Link href="/signup" onClick={(e) => { setOpen(false); goAuth(e, "/signup"); }} className="btn-primary btn-shimmer text-center py-4 text-base">Get Started →</Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
