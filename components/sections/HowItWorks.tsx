"use client";

import { motion } from "framer-motion";
import { PenLine, UserCheck, ShieldCheck, ArrowRight } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const ease = [0.25, 0.1, 0.25, 1] as const;

const steps = [
  {
    num: "01",
    icon: PenLine,
    title: "Post Your Project",
    desc: "Describe what you need — stack, scope, timeline, budget. Your listing goes live to our curated developer network instantly.",
    tag: "Free to post",
    color: "text-indigo-400",
    iconBg: "bg-indigo-500/10 border-indigo-500/20",
  },
  {
    num: "02",
    icon: UserCheck,
    title: "Review & Hire",
    desc: "Receive detailed proposals within 24 hours. Chat with candidates, review portfolios, and hire the right developer — no pressure.",
    tag: "You choose",
    color: "text-violet-400",
    iconBg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    num: "03",
    icon: ShieldCheck,
    title: "Build with Confidence",
    desc: "Work in milestones. Funds are held in escrow and released only when you approve each stage. Full visibility, no surprises.",
    tag: "Escrow protected",
    color: "text-cyan-400",
    iconBg: "bg-cyan-500/10 border-cyan-500/20",
  },
];

export default function HowItWorks() {
  const rm = useReducedMotion();

  return (
    <section id="how-it-works" className="section relative overflow-hidden">
      <div className="sep" />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16">
        {/* Header */}
        <motion.div
          className="text-center mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
        >
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-[0.2em] mb-3">How it works</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[2.75rem] text-snow leading-tight mb-4">
            From brief to delivered,<br />
            <span className="text-gradient">in three simple steps</span>
          </h2>
          <p className="text-slate text-base leading-relaxed">
            No agency overhead, no ambiguity. Just direct collaboration with expert developers — protected every step of the way.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-5 lg:gap-6 relative">
          {/* Dashed connector */}
          <div className="hidden md:flex absolute top-[3.25rem] left-[calc(33.33%+1.5rem)] right-[calc(33.33%+1.5rem)] items-center justify-center pointer-events-none gap-1.5">
            <motion.div
              className="flex-1 h-px"
              style={{
                background: "linear-gradient(90deg, rgba(99,102,241,0.5) 0%, rgba(139,92,246,0.5) 50%, rgba(34,211,238,0.5) 100%)",
              }}
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.5, ease }}
            />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              className="relative group"
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.55, delay: i * 0.14, ease }}
            >
              <div className="card card-hover h-full p-7 flex flex-col gap-5">
                {/* Icon */}
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${step.iconBg}`}>
                    <step.icon className={`w-5.5 h-5.5 ${step.color}`} />
                  </div>
                  <span className={`font-display font-black text-4xl leading-none opacity-12 group-hover:opacity-25 transition-opacity ${step.color}`}>
                    {step.num}
                  </span>
                </div>
                {/* Text */}
                <div className="flex-1">
                  <h3 className="font-display font-bold text-snow text-lg mb-2 leading-snug">{step.title}</h3>
                  <p className="text-slate text-sm leading-relaxed">{step.desc}</p>
                </div>
                {/* Tag */}
                <div className={`inline-flex items-center gap-1.5 text-xs font-semibold ${step.color}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-dot" />
                  {step.tag}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA row */}
        <motion.div
          className="flex justify-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <a href="#signup" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors group">
            Start your project now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
