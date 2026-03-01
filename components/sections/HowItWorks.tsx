"use client";

import { motion } from "framer-motion";
import { FileSearch, UserCheck, Rocket } from "lucide-react";
import { howItWorksSteps } from "@/data/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const ease = [0.25, 0.1, 0.25, 1] as const;

const iconMap = { FileText: FileSearch, Users: UserCheck, ShieldCheck: Rocket };
const iconColors = [
  "from-violet-600 to-violet-400",
  "from-cyan-500 to-cyan-400",
  "from-violet-500 to-cyan-500",
];
const numberColors = ["text-violet-400", "text-cyan-400", "text-violet-300"];

export default function HowItWorks() {
  const rm = useReducedMotion();

  return (
    <section id="how-it-works" className="section-pad relative overflow-hidden">
      {/* Subtle top separator */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
        >
          <p className="text-xs font-semibold text-violet-400 uppercase tracking-[0.2em] mb-3">Process</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[2.8rem] text-ink-white mb-4">
            From Idea to Delivered — in 3 Steps
          </h2>
          <p className="text-ink-muted max-w-xl mx-auto text-base leading-relaxed">
            No agency middlemen, no hidden fees. Direct collaboration with vetted developers, protected by smart escrow.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-5 lg:gap-6 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-14 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-600/50 via-cyan-500/50 to-violet-500/50"
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.4, ease }}
            />
          </div>

          {howItWorksSteps.map((step, i) => {
            const Icon = (iconMap as Record<string, React.ElementType>)[step.icon] ?? FileSearch;
            return (
              <motion.div
                key={step.number}
                className="relative group"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.15, ease }}
              >
                <div className="glass card-glow rounded-2xl border border-white/[0.07] p-7 h-full flex flex-col transition-all duration-300">
                  {/* Number + Icon row */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${iconColors[i]} flex items-center justify-center shadow-glow-sm`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`font-display font-black text-5xl leading-none ${numberColors[i]} opacity-20 group-hover:opacity-40 transition-opacity duration-300`}>
                      0{step.number}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-ink-white mb-3 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-ink-muted text-sm leading-relaxed flex-1">
                    {step.description}
                  </p>

                  {/* Bottom accent */}
                  <div className={`mt-6 h-0.5 rounded-full bg-gradient-to-r ${iconColors[i]} opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
