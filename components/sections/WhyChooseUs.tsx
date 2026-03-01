"use client";

import { motion } from "framer-motion";
import { CreditCard, MessageSquare, Wrench, FileCheck, Headphones } from "lucide-react";

const EXPO = [0.16, 1, 0.3, 1] as const;

const features = [
  { Icon: CreditCard,    title: "Razorpay Payments",  desc: "Pay securely with UPI, card, or net banking. Razorpay keeps your payment safe.", color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/18" },
  { Icon: MessageSquare, title: "Live Chat",         desc: "Chat with us in real time. Share files, ask questions, get updates — all in one place.", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/18" },
  { Icon: Wrench,       title: "We Build for You",  desc: "No marketplace, no picking developers. We take your order and build your website ourselves.", color: "text-cyan-400",   bg: "bg-cyan-500/10 border-cyan-500/18" },
  { Icon: FileCheck,    title: "Clear Deliverables", desc: "We agree on scope and phases. You know exactly what you're getting and when.", color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/18" },
  { Icon: Headphones,   title: "Support When You Need", desc: "Stuck or want changes? Reach out on live chat. We're here to help.", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/18" },
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
            Simple process.{" "}
            <span className="text-gradient">We do the work.</span>
          </h2>
          <p className="text-slate text-base leading-[1.8]">
            Order, pay with Razorpay, chat with us. We build your website — no middlemen, no developer hunting.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.slice(0, 5).map((f, i) => (
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
