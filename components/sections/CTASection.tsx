"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const ease = [0.25, 0.1, 0.25, 1] as const;

export default function CTASection() {
  const rm = useReducedMotion();

  return (
    <section className="section-pad relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* Aurora BG */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {!rm && (
          <>
            <motion.div
              className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[100px]"
              style={{ background: "radial-gradient(circle, rgba(124,58,237,0.35), transparent 70%)" }}
              animate={{ x: [0, 30, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.1, 0.95, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[80px]"
              style={{ background: "radial-gradient(circle, rgba(6,182,212,0.2), transparent 70%)" }}
              animate={{ x: [0, -25, 15, 0], y: [0, 20, -15, 0], scale: [1, 0.9, 1.1, 1] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-5 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
          className="mb-5"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-600/30 bg-violet-600/10 text-violet-400 text-xs font-semibold uppercase tracking-widest">
            <Zap className="w-3 h-3 fill-violet-400" /> Get Started Today
          </span>
        </motion.div>

        <motion.h2
          className="font-display font-bold text-4xl sm:text-5xl lg:text-[3.5rem] text-ink-white leading-tight mb-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
        >
          Ready to Build{" "}
          <span className="gradient-text-animated">Something Great?</span>
        </motion.h2>

        <motion.p
          className="text-ink-muted text-lg leading-relaxed max-w-xl mx-auto mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
        >
          Post your project today and receive qualified proposals from vetted developers within 24 hours. No commitment required.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.3, ease }}
        >
          <Link
            href="#signup"
            className="btn-shimmer inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-700 to-violet-500 text-white font-semibold text-base shadow-glow-md hover:shadow-glow-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            Start For Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="#how-it-works"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/[0.1] text-ink-soft font-semibold text-base hover:bg-white/[0.05] hover:border-white/[0.18] hover:text-ink-white transition-all duration-300"
          >
            See How It Works
          </Link>
        </motion.div>

        <motion.p
          className="mt-6 text-xs text-ink-muted"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          No credit card required · Free to post · Cancel anytime
        </motion.p>
      </div>
    </section>
  );
}
