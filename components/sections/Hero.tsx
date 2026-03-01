"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, CheckCircle2, Clock, ShieldCheck, Zap } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const ease = [0.25, 0.1, 0.25, 1] as const;
const spring = { type: "spring", stiffness: 180, damping: 20 } as const;

const words1 = ["Where", "Great", "Web"];
const words2 = ["Projects", "Get", "Built."];

const brands = ["Stripe", "Notion", "Linear", "Vercel", "Figma", "Framer", "Loom", "Raycast", "Slack", "Intercom"];

export default function Hero() {
  const rm = useReducedMotion();

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-28 pb-20">

      {/* ── Background ── */}
      <div className="absolute inset-0 bg-[#050510]">
        {/* Radial glow top-center */}
        <div className="absolute inset-0 bg-radial-glow" />
        {/* Grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
        {/* Moving orbs */}
        {!rm && (
          <>
            <motion.div
              className="absolute top-[15%] left-[20%] w-[640px] h-[640px] rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 65%)" }}
              animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-[20%] right-[15%] w-[480px] h-[480px] rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 65%)" }}
              animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
          </>
        )}
      </div>

      {/* ── Content (centered) ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-5 sm:px-8 max-w-5xl mx-auto w-full">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...spring, delay: 0.1 }}
          className="mb-7"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase border border-indigo-500/25 bg-indigo-500/8 text-indigo-400">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse-dot" />
            Professional Web Services Platform
          </span>
        </motion.div>

        {/* Headline */}
        <h1 className="font-display font-black leading-[1.04] tracking-tight text-[3rem] sm:text-[4rem] lg:text-[5.5rem] xl:text-[6.5rem] mb-7">
          <div className="overflow-hidden">
            <motion.div
              className="flex items-center justify-center flex-wrap gap-x-[0.2em]"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.07 } },
                hidden: {},
              }}
            >
              {words1.map((w) => (
                <motion.span
                  key={w}
                  className="text-snow inline-block"
                  variants={{
                    hidden: { y: "100%", opacity: 0 },
                    visible: { y: 0, opacity: 1, transition: { duration: 0.55, ease } },
                  }}
                >
                  {w}
                </motion.span>
              ))}
            </motion.div>
          </div>
          <div className="overflow-hidden mt-1">
            <motion.div
              className="flex items-center justify-center flex-wrap gap-x-[0.2em]"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.07, delayChildren: 0.22 } },
                hidden: {},
              }}
            >
              {words2.map((w, i) => (
                <motion.span
                  key={w}
                  className={`inline-block ${i < 2 ? "text-gradient" : "text-snow"}`}
                  variants={{
                    hidden: { y: "100%", opacity: 0 },
                    visible: { y: 0, opacity: 1, transition: { duration: 0.55, ease } },
                  }}
                >
                  {w}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </h1>

        {/* Sub */}
        <motion.p
          className="text-base sm:text-lg lg:text-xl text-slate max-w-2xl leading-relaxed mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.55, ease }}
        >
          Post your project, receive proposals from vetted developers, and ship faster —
          all backed by{" "}
          <span className="text-silver font-medium">milestone-based escrow</span> so you only pay for results.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5, ease }}
        >
          <Link href="#signup" className="btn-primary inline-flex items-center gap-2 text-base px-7 py-3.5">
            Post a Project <ArrowRight className="w-4.5 h-4.5" />
          </Link>
          <Link href="#how-it-works" className="btn-ghost inline-flex items-center gap-2 text-base px-7 py-3.5">
            See How It Works
          </Link>
        </motion.div>

        {/* Trust row */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-5 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {[
            { icon: ShieldCheck, text: "Escrow-protected payments" },
            { icon: CheckCircle2, text: "Vetted developers only" },
            { icon: Clock, text: "Proposals within 24 hours" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-1.5 text-sm text-slate">
              <item.icon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span>{item.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Platform preview window */}
        <motion.div
          className="w-full max-w-3xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.8, ease }}
        >
          <motion.div
            animate={rm ? {} : { y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            {/* Window chrome */}
            <div className="card shadow-float border border-white/[0.08] overflow-hidden">
              {/* Title bar */}
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-xs text-slate">
                    app.websevix.com/projects
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-7 grid sm:grid-cols-3 gap-4">
                {/* Project card */}
                <div className="sm:col-span-2 bg-white/[0.02] rounded-xl border border-white/[0.06] p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-2.5 py-0.5 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse-dot" /> Active
                      </span>
                      <h3 className="font-display font-semibold text-snow text-sm leading-snug">
                        SaaS Dashboard Redesign
                      </h3>
                      <p className="text-xs text-slate mt-0.5">React + TypeScript + Tailwind</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate">Budget</p>
                      <p className="font-display font-bold text-snow text-base">$3,200</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "65%" }}
                        transition={{ delay: 1.4, duration: 1, ease }}
                      />
                    </div>
                    <span className="text-[11px] text-indigo-400 font-medium">65%</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[["Milestone", "2 of 3"], ["Days Left", "14"], ["Proposals", "9"]].map(([k, v]) => (
                      <div key={k} className="bg-white/[0.03] rounded-lg p-2.5 border border-white/[0.05]">
                        <p className="text-[10px] text-slate mb-0.5">{k}</p>
                        <p className="text-xs font-bold text-snow font-display">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top developer card */}
                <div className="flex flex-col gap-3">
                  <div className="bg-white/[0.02] rounded-xl border border-white/[0.06] p-4">
                    <p className="text-[10px] font-semibold text-slate uppercase tracking-widest mb-3">Top Match</p>
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-400 flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
                        RK
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-snow">Raj Kumar</p>
                        <p className="text-[10px] text-slate">React Expert</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                      <span className="text-[10px] text-slate ml-1">5.0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate">Bid</span>
                      <span className="text-xs font-bold text-snow">$2,800</span>
                    </div>
                  </div>
                  <div className="bg-white/[0.02] rounded-xl border border-white/[0.06] p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-snow">Escrow Active</p>
                        <p className="text-[9px] text-slate">$1,200 secured</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating notification */}
            <motion.div
              className="absolute -bottom-5 -right-4 sm:-right-8 card border border-white/[0.08] px-4 py-2.5 flex items-center gap-2.5 shadow-float"
              initial={{ opacity: 0, scale: 0.7, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 1.6, ...spring }}
            >
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-snow leading-tight">Milestone approved!</p>
                <p className="text-[10px] text-slate">Payment released</p>
              </div>
            </motion.div>

            {/* Floating proposal badge */}
            <motion.div
              className="absolute -top-5 -left-4 sm:-left-8 card border border-white/[0.08] px-4 py-2.5 flex items-center gap-2.5 shadow-float"
              initial={{ opacity: 0, scale: 0.7, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 1.8, ...spring }}
            >
              <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                <Zap className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-snow leading-tight">New proposal!</p>
                <p className="text-[10px] text-slate">3 min ago</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Brand marquee ── */}
      <motion.div
        className="relative z-10 mt-24 w-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
      >
        <div className="sep mb-8" />
        <p className="text-center text-xs font-semibold text-dim uppercase tracking-[0.25em] mb-7">
          Trusted by teams from
        </p>
        <div className="relative overflow-hidden">
          <div
            className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to right, #050510, transparent)" }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to left, #050510, transparent)" }}
          />
          <div className="flex overflow-hidden">
            <div className="marquee-track flex items-center gap-12 pr-12">
              {[...brands, ...brands].map((b, i) => (
                <span key={`${b}-${i}`} className="text-sm font-semibold text-dim hover:text-slate transition-colors cursor-default whitespace-nowrap tracking-wide">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="sep mt-8" />
      </motion.div>
    </section>
  );
}
