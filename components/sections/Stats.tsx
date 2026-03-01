"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, CheckSquare, DollarSign } from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

const ease = [0.25, 0.1, 0.25, 1] as const;

const statsData = [
  {
    value: 12400,
    suffix: "+",
    label: "Active Projects",
    sublabel: "Live right now",
    icon: TrendingUp,
    color: "text-violet-400",
    bg: "bg-violet-600/10",
    border: "border-violet-600/20",
    glow: "rgba(124,58,237,0.15)",
  },
  {
    value: 8200,
    suffix: "+",
    label: "Developers Online",
    sublabel: "Vetted & rated",
    icon: Users,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    glow: "rgba(6,182,212,0.15)",
  },
  {
    value: 95000,
    suffix: "+",
    label: "Completed Orders",
    sublabel: "Delivered on time",
    icon: CheckSquare,
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/20",
    glow: "rgba(16,185,129,0.15)",
  },
  {
    value: 42,
    suffix: "M+",
    label: "Secured in Escrow",
    sublabel: "Total transactions",
    icon: DollarSign,
    prefix: "$",
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/20",
    glow: "rgba(245,158,11,0.15)",
  },
];

export default function Stats() {
  return (
    <section className="section-pad relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* BG glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(124,58,237,0.06), transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
        >
          <p className="text-xs font-semibold text-violet-400 uppercase tracking-[0.2em] mb-3">Numbers</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[2.8rem] text-ink-white">
            A Marketplace That Delivers
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statsData.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="relative group"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease }}
            >
              {/* Rotating glow ring */}
              <div
                className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at 50% 50%, ${stat.glow}, transparent 70%)` }}
              />
              <div className="relative glass card-glow rounded-2xl border border-white/[0.07] p-7 flex flex-col gap-4">
                <div className={`w-11 h-11 rounded-xl ${stat.bg} border ${stat.border} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <div className={`font-display font-black text-3xl lg:text-4xl ${stat.color} leading-none mb-1`}>
                    {stat.prefix ?? ""}
                    <AnimatedCounter
                      target={stat.value}
                      duration={2200}
                      suffix={stat.suffix}
                    />
                  </div>
                  <p className="font-semibold text-ink-white text-sm">{stat.label}</p>
                  <p className="text-ink-muted text-xs mt-0.5">{stat.sublabel}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
