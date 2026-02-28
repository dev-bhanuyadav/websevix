"use client";

import { motion } from "framer-motion";
import {
  Lock,
  BadgeCheck,
  Receipt,
  MessageCircle,
  Headphones,
} from "lucide-react";
import { whyChooseUsFeatures } from "@/data/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const iconMap = { Lock, BadgeCheck, Receipt, MessageCircle, Headphones };
const easing = [0.25, 0.1, 0.25, 1] as const;

export default function WhyChooseUs() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: easing }}
          >
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-text-primary mb-4">
              Why Choose Us
            </h2>
            <p className="text-text-muted text-lg mb-10">
              Built for trust, transparency, and seamless collaboration.
            </p>
            <ul className="space-y-6">
              {whyChooseUsFeatures.map((feature, i) => {
                const Icon = iconMap[feature.icon as keyof typeof iconMap];
                return (
                  <motion.li
                    key={feature.title}
                    className="flex gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.1,
                      ease: easing,
                    }}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      {Icon && <Icon className="w-5 h-5 text-primary" />}
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-text-primary mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-text-muted text-sm">{feature.description}</p>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>

          <motion.div
            className="order-1 lg:order-2 relative"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: easing }}
          >
            <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 lg:p-10">
              <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 flex items-center justify-center">
                <motion.div
                  className="text-center"
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Lock className="w-16 h-16 text-primary mx-auto mb-4 opacity-80" />
                  <p className="text-text-muted text-sm">Secure by design</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
