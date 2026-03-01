"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Clock, Star, Users } from "lucide-react";

const ease = [0.25, 0.1, 0.25, 1] as const;

// No fake numbers — platform promises/guarantees instead
const promises = [
  {
    icon: Clock,
    title: "Proposals in 24h",
    desc: "Or your project gets featured for free",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/20",
  },
  {
    icon: ShieldCheck,
    title: "100% Escrow Protected",
    desc: "Your money is safe until you say so",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Star,
    title: "Verified Reviews Only",
    desc: "Every rating is from a real completed project",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: Users,
    title: "Hand-picked Developers",
    desc: "Each dev is tested and identity-verified",
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
];

export default function Stats() {
  return (
    <section className="section relative overflow-hidden">
      <div className="sep" />

      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(99,102,241,0.05), transparent 70%)" }} />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 relative">
        <motion.div
          className="text-center mb-14 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
        >
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-[0.2em] mb-3">Our Guarantee</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[2.75rem] text-snow leading-tight">
            Our promises to you
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {promises.map((p, i) => (
            <motion.div
              key={p.title}
              className="card card-hover p-6 text-center flex flex-col items-center gap-4"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease }}
            >
              <div className={`w-12 h-12 rounded-xl border ${p.bg} flex items-center justify-center`}>
                <p.icon className={`w-5.5 h-5.5 ${p.color}`} />
              </div>
              <div>
                <h3 className="font-display font-bold text-snow text-base mb-1.5">{p.title}</h3>
                <p className="text-slate text-sm leading-relaxed">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
