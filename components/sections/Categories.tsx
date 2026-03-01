"use client";

import { motion } from "framer-motion";
import {
  Globe, Palette, ShoppingCart, Layers, Smartphone, Plug,
  ArrowUpRight,
} from "lucide-react";
import { categories } from "@/data/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const iconMap = { Globe, Palette, ShoppingCart, Layers, Smartphone, Plug };
const ease = [0.25, 0.1, 0.25, 1] as const;

const gradients = [
  "from-violet-600/20 to-violet-400/5",
  "from-cyan-500/20 to-cyan-400/5",
  "from-violet-500/20 to-cyan-500/5",
  "from-cyan-400/20 to-violet-500/5",
  "from-violet-400/20 to-cyan-400/5",
  "from-cyan-500/20 to-violet-600/5",
];
const iconBg = [
  "bg-violet-600/20 text-violet-400",
  "bg-cyan-500/20 text-cyan-400",
  "bg-violet-500/20 text-violet-300",
  "bg-cyan-400/20 text-cyan-400",
  "bg-violet-400/20 text-violet-400",
  "bg-cyan-500/20 text-cyan-400",
];

export default function Categories() {
  const rm = useReducedMotion();

  return (
    <section id="categories" className="section-pad relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
        >
          <div>
            <p className="text-xs font-semibold text-violet-400 uppercase tracking-[0.2em] mb-3">Categories</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[2.8rem] text-ink-white">
              What Can We Build for You?
            </h2>
          </div>
          <a
            href="#categories"
            className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-violet-400 font-medium transition-colors whitespace-nowrap"
          >
            View all services <ArrowUpRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.icon as keyof typeof iconMap];
            const delay = (Math.floor(i / 3) + (i % 3)) * 0.07;

            return (
              <motion.a
                key={cat.id}
                href={`#category-${cat.id}`}
                className={`group relative glass card-glow rounded-2xl border border-white/[0.07] p-6 flex items-start gap-4 cursor-pointer transition-all duration-300 overflow-hidden`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay, ease }}
                whileHover={rm ? {} : { y: -3 }}
              >
                {/* Gradient fill on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradients[i]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                {/* Top shine */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className={`relative flex-shrink-0 w-11 h-11 rounded-xl ${iconBg[i]} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                  {Icon && <Icon className="w-5 h-5" />}
                </div>

                <div className="relative flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display font-semibold text-ink-white text-[15px] leading-snug group-hover:text-white transition-colors">
                      {cat.title}
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-ink-faint group-hover:text-violet-400 transition-colors flex-shrink-0 mt-0.5" />
                  </div>
                  <p className="text-xs text-ink-muted mt-1">
                    <span className="text-ink-soft font-semibold">{cat.activeProjects}</span> active projects
                  </p>
                  <div className="mt-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-ring" />
                    <span className="text-[11px] text-success font-medium">Hiring Now</span>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
