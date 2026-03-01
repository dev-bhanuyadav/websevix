"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Star,
  Clock,
  DollarSign,
  MessageSquare,
  Shield,
  TrendingUp,
  Code2,
  Zap,
} from "lucide-react";
import { heroContent } from "@/data/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const ease = [0.25, 0.1, 0.25, 1] as const;

const mockProposals = [
  { name: "Arjun Mehta", role: "Full-Stack Dev", rating: 4.9, bid: "$1,200", time: "7 days", avatar: "AM" },
  { name: "Sofia Reyes", role: "React Specialist", rating: 5.0, bid: "$950", time: "5 days", avatar: "SR" },
];

const mockMilestones = [
  { label: "UI Design", done: true },
  { label: "Frontend", done: true },
  { label: "Backend API", done: false },
  { label: "Deployment", done: false },
];

export default function Hero() {
  const rm = useReducedMotion();

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      {/* Background */}
      <div className="absolute inset-0 bg-[#04040F]">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Glow orbs */}
        {!rm && (
          <>
            <motion.div
              className="absolute top-[20%] left-[15%] w-[500px] h-[500px] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)" }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)" }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
          </>
        )}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* ── Left Content ── */}
          <div>
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-600/30 bg-violet-600/10 text-violet-400 text-xs font-semibold mb-6 uppercase tracking-widest"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse-ring inline-block" />
              {heroContent.badge}
            </motion.div>

            {/* Headline */}
            <h1 className="font-display font-bold text-[2.6rem] sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] leading-[1.08] tracking-tight text-ink-white mb-6">
              {["Find", "Expert", "Developers."].map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-[0.22em]"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease }}
                >
                  {word}
                </motion.span>
              ))}
              <br />
              {["Build", "Faster."].map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-[0.22em] gradient-text"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.24 + i * 0.08, duration: 0.5, ease }}
                >
                  {word}
                </motion.span>
              ))}
              <br />
              {["Pay", "Securely."].map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-[0.22em]"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.5, ease }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            {/* Sub */}
            <motion.p
              className="text-base sm:text-lg text-ink-muted max-w-lg leading-relaxed mb-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5, ease }}
            >
              {heroContent.subheadline}
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap gap-3 mb-10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5, ease }}
            >
              <Link
                href="#signup"
                className="btn-shimmer inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-700 to-violet-500 text-white font-semibold text-sm shadow-glow-md hover:shadow-glow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                {heroContent.ctaPrimary}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/[0.1] text-ink-soft font-semibold text-sm hover:bg-white/[0.05] hover:border-white/[0.18] hover:text-ink-white transition-all duration-300"
              >
                See How It Works
              </Link>
            </motion.div>

            {/* Trust row */}
            <motion.div
              className="flex flex-wrap items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2.5">
                  {["AK","SR","MJ","PD","RK"].map((init, i) => (
                    <motion.div
                      key={init}
                      className="w-7 h-7 rounded-full border-2 border-[#04040F] bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-[9px] font-bold text-white"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.85 + i * 0.06, type: "spring", stiffness: 200 }}
                    >
                      {init}
                    </motion.div>
                  ))}
                </div>
                <span className="text-xs text-ink-muted">{heroContent.trustText}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-warning text-warning" />)}
                </div>
                <span className="text-xs text-ink-muted">4.9/5 from 2,000+ reviews</span>
              </div>
            </motion.div>
          </div>

          {/* ── Right: Platform Mockup ── */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease }}
          >
            <motion.div
              animate={rm ? {} : { y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* Main dashboard card */}
              <div className="glass rounded-2xl border border-white/[0.08] p-5 shadow-card relative overflow-hidden">
                {/* Card shine */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-ink-muted mb-0.5">Active Project</p>
                    <p className="font-display font-semibold text-ink-white text-sm">E-commerce Platform Redesign</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-success/10 text-success text-[11px] font-semibold border border-success/20">
                    In Progress
                  </span>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { icon: Clock, label: "Deadline", value: "12 days" },
                    { icon: DollarSign, label: "Budget", value: "$4,500" },
                    { icon: MessageSquare, label: "Messages", value: "24" },
                  ].map((item) => (
                    <div key={item.label} className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">
                      <item.icon className="w-3.5 h-3.5 text-violet-400 mb-1.5" />
                      <p className="text-[10px] text-ink-muted mb-0.5">{item.label}</p>
                      <p className="text-sm font-semibold text-ink-white font-display">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Milestones */}
                <div className="mb-4">
                  <p className="text-xs text-ink-muted mb-2.5 font-medium">Milestones</p>
                  <div className="space-y-2">
                    {mockMilestones.map((m, i) => (
                      <div key={m.label} className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${m.done ? "bg-success/20 border border-success/40" : "bg-white/[0.05] border border-white/[0.1]"}`}>
                          {m.done && <CheckCircle2 className="w-3 h-3 text-success" />}
                        </div>
                        <span className={`text-xs ${m.done ? "text-ink-muted line-through" : "text-ink-soft"}`}>{m.label}</span>
                        {!m.done && i === 2 && (
                          <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-violet-600/20 text-violet-400 border border-violet-600/20">
                            Active
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[10px] text-ink-muted">Overall Progress</p>
                    <p className="text-[10px] font-semibold text-violet-400">50%</p>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "50%" }}
                      transition={{ delay: 1.2, duration: 1, ease }}
                    />
                  </div>
                </div>
              </div>

              {/* Proposals card — floating */}
              <motion.div
                className="absolute -bottom-12 -left-10 w-[220px] glass rounded-xl border border-white/[0.08] p-4 shadow-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-ink-soft">Top Proposals</p>
                  <span className="text-[10px] text-violet-400 font-medium">8 received</span>
                </div>
                {mockProposals.map((p) => (
                  <div key={p.name} className="flex items-center gap-2.5 mb-2.5 last:mb-0">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                      {p.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-ink-white truncate">{p.name}</p>
                      <p className="text-[10px] text-ink-muted">{p.role}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[11px] font-bold text-ink-white">{p.bid}</p>
                      <p className="text-[10px] text-success">{p.time}</p>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Escrow badge — floating */}
              <motion.div
                className="absolute -top-8 -right-6 glass rounded-xl border border-white/[0.08] px-3.5 py-2.5 shadow-card flex items-center gap-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3, type: "spring", stiffness: 200 }}
              >
                <div className="w-6 h-6 rounded-lg bg-success/20 border border-success/30 flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-success" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-ink-white">$4,500</p>
                  <p className="text-[10px] text-ink-muted">Held in Escrow</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom brand row */}
        <motion.div
          className="mt-20 pt-10 border-t border-white/[0.06] flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <p className="text-xs text-ink-muted font-medium uppercase tracking-widest">Trusted by teams at</p>
          {["Stripe", "Vercel", "Figma", "Linear", "Notion", "Loom"].map((brand) => (
            <span key={brand} className="text-sm font-semibold text-ink-faint hover:text-ink-muted transition-colors cursor-default tracking-wide">
              {brand}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
