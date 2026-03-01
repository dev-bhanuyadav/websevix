"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const ease = [0.25, 0.1, 0.25, 1] as const;

export default function CTASection() {
  const rm = useReducedMotion();

  return (
    <section className="section relative overflow-hidden">
      <div className="sep" />

      {/* Aurora background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {!rm && (
          <>
            <motion.div
              className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[120px]"
              style={{ background: "radial-gradient(circle, rgba(99,102,241,0.3), transparent 70%)" }}
              animate={{ x: [0, 40, -30, 0], y: [0, -40, 30, 0], scale: [1, 1.1, 0.92, 1] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[80px]"
              style={{ background: "radial-gradient(circle, rgba(139,92,246,0.2), transparent 70%)" }}
              animate={{ x: [0, -30, 20, 0], y: [0, 30, -20, 0], scale: [1, 0.9, 1.1, 1] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "56px 56px" }}
        />
      </div>

      <div className="relative max-w-3xl mx-auto px-5 sm:px-8 pt-16 text-center">
        <motion.div
          className="card border border-indigo-500/15 p-10 sm:p-16 relative overflow-hidden"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease }}
        >
          {/* Top glow line */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />
          {/* Corner decoration */}
          <div className="absolute top-0 left-0 w-32 h-32 rounded-br-full"
            style={{ background: "radial-gradient(circle at top left, rgba(99,102,241,0.08), transparent 70%)" }} />
          <div className="absolute bottom-0 right-0 w-32 h-32 rounded-tl-full"
            style={{ background: "radial-gradient(circle at bottom right, rgba(139,92,246,0.08), transparent 70%)" }} />

          <motion.p
            className="text-xs font-semibold text-indigo-400 uppercase tracking-[0.2em] mb-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Get Started Today
          </motion.p>

          <motion.h2
            className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-snow leading-tight mb-5"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.6, ease }}
          >
            Ready to build<br />
            <span className="text-gradient-animate">something great?</span>
          </motion.h2>

          <motion.p
            className="text-slate text-base sm:text-lg leading-relaxed max-w-lg mx-auto mb-9"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.22, duration: 0.55, ease }}
          >
            Post your project for free and receive detailed proposals from vetted developers within 24 hours.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5, ease }}
          >
            <Link href="#signup" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-4 w-full sm:w-auto justify-center">
              Post a Project Free <ArrowRight className="w-4.5 h-4.5" />
            </Link>
            <Link href="#login" className="btn-ghost inline-flex items-center gap-2 text-base px-8 py-4 w-full sm:w-auto justify-center">
              Browse Developers
            </Link>
          </motion.div>

          <motion.p
            className="mt-5 text-xs text-dim"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            No credit card · Free to post · No commitment
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
