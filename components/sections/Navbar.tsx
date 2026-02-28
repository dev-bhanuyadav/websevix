"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/data/content";
import Button from "@/components/ui/Button";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-xl bg-background/80 border-b border-border py-3"
            : "bg-transparent py-5"
        }`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <motion.span
              className="font-display font-bold text-xl text-text-primary"
              whileHover={reducedMotion ? {} : { scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Websevix
            </motion.span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-text-muted hover:text-text-primary text-sm font-medium transition-colors py-2 group"
              >
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.05,
                    duration: 0.3,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  {link.label}
                </motion.span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 ease-out" />
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="#login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link href="#signup">
              <Button variant="primary" size="sm" shimmer>Get Started</Button>
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden p-2 text-text-primary"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[60] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-background/95 backdrop-blur-xl"
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
            <motion.div
              className="relative pt-20 px-6 flex flex-col"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <button
                type="button"
                className="absolute top-6 right-6 p-2 text-text-primary"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.08, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    className="block py-4 text-lg text-text-primary font-medium border-b border-border"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                className="flex flex-col gap-3 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Link href="#login" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" size="lg" className="w-full">Login</Button>
                </Link>
                <Link href="#signup" onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" size="lg" shimmer className="w-full">Get Started</Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
