"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { FileText, Users, ShieldCheck } from "lucide-react";
import { howItWorksSteps } from "@/data/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import TiltCard from "@/components/ui/TiltCard";

const easing = [0.25, 0.1, 0.25, 1] as const;
const icons = { FileText, Users, ShieldCheck };

export default function HowItWorks() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="how-it-works" className="relative py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-center text-text-primary mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: easing }}
        >
          How It Works
        </motion.h2>
        <motion.p
          className="text-text-muted text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: easing }}
        >
          Three simple steps from idea to delivery
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connector line (desktop) */}
          {!reducedMotion && (
            <svg
              className="absolute left-0 w-full h-2 hidden md:block pointer-events-none"
              style={{ top: "120px" }}
              viewBox="0 0 100 2"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M 0 1 L 100 1"
                fill="none"
                stroke="rgba(99, 102, 241, 0.3)"
                strokeWidth="0.5"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </svg>
          )}

          {howItWorksSteps.map((step, index) => {
            const Icon = icons[step.icon as keyof typeof icons];
            return (
              <motion.div
                key={step.number}
                className="relative"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: easing,
                }}
              >
                <TiltCard className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 h-full">
                  <div className="flex flex-col items-center text-center">
                    {/* Animated number ring */}
                    <div className="relative w-16 h-16 mb-6">
                      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          fill="none"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="4"
                        />
                        <motion.circle
                          cx="32"
                          cy="32"
                          r="28"
                          fill="none"
                          stroke="url(#stepGradient)"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 28}
                          initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                          whileInView={{ strokeDashoffset: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ duration: 1, delay: index * 0.2, ease: "easeInOut" }}
                        />
                        <defs>
                          <linearGradient id="stepGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#6366F1" />
                            <stop offset="100%" stopColor="#8B5CF6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center font-display font-bold text-xl text-text-primary">
                        {step.number}
                      </span>
                    </div>
                    <motion.div
                      whileHover={reducedMotion ? {} : { rotate: 5, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                      {Icon && <Icon className="w-10 h-10 text-primary mx-auto mb-4" />}
                    </motion.div>
                    <h3 className="font-display font-semibold text-xl text-text-primary mb-2">
                      {step.title}
                    </h3>
                    <p className="text-text-muted text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
