"use client";

import { motion } from "framer-motion";
import { CreditCard, MessageSquare, Wrench, FileCheck } from "lucide-react";

const EXPO = [0.16, 1, 0.3, 1] as const;

const promises = [
  { Icon: CreditCard,  title: "Razorpay Secured",      desc: "All payments through Razorpay. Safe and reliable.", color: "text-indigo-400",  bg: "bg-indigo-500/10 border-indigo-500/20" },
  { Icon: MessageSquare, title: "Live Chat",           desc: "Chat with us in real time. No waiting for email replies.", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
  { Icon: Wrench,      title: "We Build It",           desc: "We build your website. No third-party developers to choose.", color: "text-cyan-400",   bg: "bg-cyan-500/10 border-cyan-500/20" },
  { Icon: FileCheck,   title: "Clear Scope & Delivery", desc: "Agreed scope, clear phases. You know what you're getting.", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
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
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-[0.22em] mb-4">What You Get</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[2.9rem] text-snow leading-[1.1]">
            Our promise to you
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {promises.map((promise, i) => {
            const Icon = promise.Icon;
            return (
              <motion.div
                key={promise.title}
                className="card card-hover p-7 text-center flex flex-col items-center gap-5 group"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 1.0, ease: EXPO, delay: i * 0.12 }}
              >
                <div className={`w-12 h-12 rounded-xl border ${promise.bg} flex items-center justify-center transition-transform duration-500 group-hover:scale-110`}>
                  <Icon className={`w-5.5 h-5.5 ${promise.color}`} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-snow text-base mb-2">{promise.title}</h3>
                  <p className="text-slate text-sm leading-[1.8]">{promise.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
