"use client";

import { motion } from "framer-motion";
import {
  Lock, Users, BarChart3, MessageSquare, HeartHandshake, Award
} from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const ease = [0.25, 0.1, 0.25, 1] as const;

const features = [
  { icon: Lock, title: "Escrow Payments", desc: "Your funds are locked until you approve each milestone. Zero risk, full control.", color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
  { icon: Users, title: "Vetted Developers", desc: "Every developer passes skill assessments and identity verification before joining.", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
  { icon: BarChart3, title: "Milestone Tracking", desc: "Break projects into milestones, track progress in real time, stay in control.", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
  { icon: MessageSquare, title: "Built-in Messaging", desc: "Chat, share files, and review deliverables — all in one platform, no Slack needed.", color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
  { icon: HeartHandshake, title: "Dispute Resolution", desc: "Our mediation team ensures fair outcomes if anything goes wrong. Always.", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
  { icon: Award, title: "Verified Reviews", desc: "Every review is tied to a real completed project — no fake ratings, ever.", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
];

export default function WhyChooseUs() {
  const rm = useReducedMotion();

  return (
    <section className="section relative overflow-hidden">
      <div className="sep" />
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "80px 80px" }}
      />
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 relative">
        <motion.div
          className="text-center mb-14 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
        >
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-[0.2em] mb-3">Why Websevix</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[2.75rem] text-snow leading-tight mb-4">
            Built for trust.<br />
            <span className="text-gradient">Designed for results.</span>
          </h2>
          <p className="text-slate text-base leading-relaxed">
            We've removed every friction point between you and a great web project. Here's what makes us different.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="card card-hover p-6 group"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.07, ease }}
            >
              <div className={`w-11 h-11 rounded-xl border ${f.bg} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <h3 className="font-display font-semibold text-snow text-base mb-2">{f.title}</h3>
              <p className="text-slate text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
