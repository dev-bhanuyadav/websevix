"use client";

import { motion } from "framer-motion";
import { Lock, BadgeCheck, Receipt, MessageCircle, Headphones, TrendingUp } from "lucide-react";
import { whyChooseUsFeatures } from "@/data/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const iconMap = { Lock, BadgeCheck, Receipt, MessageCircle, Headphones, TrendingUp };
const ease = [0.25, 0.1, 0.25, 1] as const;

const featureColors = [
  { bg: "bg-violet-600/15", text: "text-violet-400", border: "border-violet-600/20" },
  { bg: "bg-success/10", text: "text-success", border: "border-success/20" },
  { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20" },
  { bg: "bg-violet-400/10", text: "text-violet-300", border: "border-violet-400/20" },
  { bg: "bg-warning/10", text: "text-warning", border: "border-warning/20" },
];

export default function WhyChooseUs() {
  const rm = useReducedMotion();

  return (
    <section className="section-pad relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* BG accent */}
      <div
        className="absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* Left: content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease }}
          >
            <p className="text-xs font-semibold text-violet-400 uppercase tracking-[0.2em] mb-3">Why Websevix</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[2.8rem] text-ink-white mb-5 leading-tight">
              Built for trust,<br />
              <span className="gradient-text">speed & scale.</span>
            </h2>
            <p className="text-ink-muted text-base leading-relaxed mb-10 max-w-md">
              We've rethought how web projects are delivered — transparent pricing, milestone-based payments, and real-time collaboration baked in.
            </p>

            <div className="space-y-4">
              {whyChooseUsFeatures.map((feature, i) => {
                const Icon = iconMap[feature.icon as keyof typeof iconMap];
                const color = featureColors[i] ?? featureColors[0];
                return (
                  <motion.div
                    key={feature.title}
                    className="flex items-start gap-4 group"
                    initial={{ opacity: 0, x: -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: i * 0.1, ease }}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${color.bg} border ${color.border} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                      {Icon && <Icon className={`w-4.5 h-4.5 ${color.text}`} />}
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-ink-white text-sm mb-1">{feature.title}</h3>
                      <p className="text-ink-muted text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right: visual */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease }}
          >
            {/* Glow */}
            <div className="absolute -inset-10 bg-violet-600/10 blur-3xl rounded-full" />

            <div className="relative glass rounded-2xl border border-white/[0.08] p-7 shadow-card">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

              {/* Platform comparison */}
              <h4 className="font-display font-semibold text-ink-white text-sm mb-5">Platform Comparison</h4>
              <div className="space-y-0 text-xs">
                {/* Header row */}
                <div className="grid grid-cols-4 gap-2 pb-3 border-b border-white/[0.06]">
                  <span className="text-ink-muted font-medium">Feature</span>
                  <span className="text-center font-bold text-violet-400">Websevix</span>
                  <span className="text-center text-ink-muted">Freelancer</span>
                  <span className="text-center text-ink-muted">Agency</span>
                </div>
                {[
                  ["Escrow Protection", true, false, true],
                  ["Milestone Tracking", true, false, false],
                  ["Verified Devs", true, false, true],
                  ["Real-time Chat", true, true, true],
                  ["Dispute Resolution", true, false, true],
                  ["Fixed Pricing", true, false, false],
                ].map(([label, a, b, c]) => (
                  <div key={label as string} className="grid grid-cols-4 gap-2 py-2.5 border-b border-white/[0.04] last:border-0">
                    <span className="text-ink-muted text-[11px]">{label as string}</span>
                    <span className="text-center">{a ? <span className="text-success font-bold">✓</span> : <span className="text-ink-faint">—</span>}</span>
                    <span className="text-center">{b ? <span className="text-ink-muted">✓</span> : <span className="text-ink-faint">—</span>}</span>
                    <span className="text-center">{c ? <span className="text-ink-muted">✓</span> : <span className="text-ink-faint">—</span>}</span>
                  </div>
                ))}
              </div>

              {/* Bottom CTA chip */}
              <div className="mt-6 p-3 rounded-xl bg-violet-600/10 border border-violet-600/20 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-ink-white">3.2× faster delivery</p>
                  <p className="text-[10px] text-ink-muted">vs. traditional hiring</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
