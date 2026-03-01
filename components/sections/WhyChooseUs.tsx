"use client";

import { motion } from "framer-motion";
import { Lock, Users, BarChart3, MessageSquare, HeartHandshake, Award } from "lucide-react";

const EXPO = [0.16, 1, 0.3, 1] as const;

const features = [
  { Icon: Lock,          title: "Escrow Payments",   desc: "Funds locked until you approve every milestone. Zero risk, full control.", color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/18" },
  { Icon: Users,         title: "Vetted Developers",  desc: "Every dev passes skill assessments and identity verification before joining.", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/18" },
  { Icon: BarChart3,     title: "Milestone Tracking", desc: "Break projects into milestones, track progress in real time, stay in control.", color: "text-cyan-400",   bg: "bg-cyan-500/10 border-cyan-500/18"   },
  { Icon: MessageSquare, title: "Built-in Chat",      desc: "Message, share files, review deliverables — all in one platform.", color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/18" },
  { Icon: HeartHandshake,"title": "Dispute Resolution", desc: "Our mediation team ensures fair outcomes if anything goes wrong.", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/18" },
  { Icon: Award,         title: "Verified Reviews",   desc: "Every review is tied to a real completed project — no fake ratings, ever.", color: "text-cyan-400",   bg: "bg-cyan-500/10 border-cyan-500/18"   },
];

export default function WhyChooseUs() {
  return (
    <section className="section relative overflow-hidden">
      <div className="sep" />
      <div
        className="absolute inset-0 opacity-[0.022] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "80px 80px" }}
      />
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-20 relative">

        <motion.div
          className="text-center mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.0, ease: EXPO }}
        >
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-[0.22em] mb-4">Why Websevix</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[2.9rem] text-snow leading-[1.1] mb-5">
            Built for trust.{" "}
            <span className="text-gradient">Designed for results.</span>
          </h2>
          <p className="text-slate text-base leading-[1.8]">
            We&apos;ve removed every friction point between you and a great web project.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="card card-hover p-6 group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 1.0, ease: EXPO, delay: i * 0.1 }}
            >
              <div className={`w-11 h-11 rounded-xl border ${f.bg} flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110`}>
                <f.Icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <h3 className="font-display font-semibold text-snow text-base mb-2.5">{f.title}</h3>
              <p className="text-slate text-sm leading-[1.8]">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
