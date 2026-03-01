"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Clock, Star, Users } from "lucide-react";

const EXPO = [0.16, 1, 0.3, 1] as const;

const promises = [
  { Icon: Clock,       title: "Proposals in 24h",     desc: "Or your project gets featured for free.", color: "text-indigo-400",  bg: "bg-indigo-500/10 border-indigo-500/20"  },
  { Icon: ShieldCheck, title: "100% Escrow Protected", desc: "Your money moves only when you approve.", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { Icon: Star,        title: "Real Reviews Only",     desc: "Every rating comes from a completed project.", color: "text-amber-400",  bg: "bg-amber-500/10 border-amber-500/20"    },
  { Icon: Users,       title: "Tested Developers",     desc: "Each dev passes skills and ID checks.", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20"  },
];

export default function Stats() {
  return (
    <section className="section relative overflow-hidden">
      <div className="sep" />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(99,102,241,0.05), transparent 70%)" }} />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-20 relative">
        <motion.div
          className="text-center mb-16 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.0, ease: EXPO }}
        >
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-[0.22em] mb-4">Our Guarantee</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[2.9rem] text-snow leading-[1.1]">
            Our promises to you
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {promises.map((p, i) => (
            <motion.div
              key={p.title}
              className="card card-hover p-7 text-center flex flex-col items-center gap-5 group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 1.0, ease: EXPO, delay: i * 0.12 }}
            >
              <div className={`w-12 h-12 rounded-xl border ${p.bg} flex items-center justify-center transition-transform duration-500 group-hover:scale-110`}>
                <p.Icon className={`w-5.5 h-5.5 ${p.color}`} />
              </div>
              <div>
                <h3 className="font-display font-bold text-snow text-base mb-2">{p.title}</h3>
                <p className="text-slate text-sm leading-[1.8]">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
