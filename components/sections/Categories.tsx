"use client";

import { motion } from "framer-motion";
import { Globe, Palette, ShoppingCart, Layers, Smartphone, Plug, ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const ease = [0.25, 0.1, 0.25, 1] as const;

const services = [
  { icon: Globe, title: "Web Development", desc: "Custom websites, landing pages, full-stack apps", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/15" },
  { icon: Palette, title: "UI/UX Design", desc: "Figma design systems, user flows, prototyping", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/15" },
  { icon: ShoppingCart, title: "E-commerce", desc: "Shopify, WooCommerce, custom storefronts", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/15" },
  { icon: Layers, title: "SaaS Development", desc: "Multi-tenant apps, dashboards, billing flows", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/15" },
  { icon: Smartphone, title: "Mobile Apps", desc: "React Native, Expo, iOS & Android delivery", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/15" },
  { icon: Plug, title: "API & Integrations", desc: "REST, GraphQL, third-party API connections", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/15" },
];

export default function Categories() {
  const rm = useReducedMotion();

  return (
    <section id="services" className="section relative overflow-hidden">
      <div className="sep" />
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16">

        <motion.div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
        >
          <div>
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-[0.2em] mb-3">Services</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[2.75rem] text-snow leading-tight">
              What can we help<br />
              <span className="text-gradient">you build?</span>
            </h2>
          </div>
          <a href="#" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate hover:text-indigo-400 transition-colors group shrink-0">
            Browse all services <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s, i) => {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const delay = (row + col) * 0.07;

            return (
              <motion.a
                key={s.title}
                href="#"
                className="card card-hover group p-6 flex items-start gap-4 cursor-pointer"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay, ease }}
                whileHover={rm ? {} : {}}
              >
                <div className={`flex-shrink-0 w-11 h-11 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display font-semibold text-snow text-[15px] leading-snug">{s.title}</h3>
                    <ArrowUpRight className={`w-4 h-4 flex-shrink-0 mt-0.5 ${s.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  </div>
                  <p className="text-sm text-slate mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
