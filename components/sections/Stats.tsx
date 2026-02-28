"use client";

import { motion } from "framer-motion";
import { stats } from "@/data/content";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const easing = [0.25, 0.1, 0.25, 1] as const;

export default function Stats() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-center text-text-primary mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: easing }}
        >
          Live Marketplace Stats
        </motion.h2>
        <motion.p
          className="text-text-muted text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: easing }}
        >
          Real numbers from our growing community
        </motion.p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: easing,
              }}
            >
              <div className="relative rounded-2xl p-6 lg:p-8 backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden">
                {!reducedMotion && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-30"
                    style={{
                      background: `conic-gradient(from 0deg, transparent, rgba(99, 102, 241, 0.4), transparent 30%)`,
                      animation: "rotateGlow 4s linear infinite",
                    }}
                  />
                )}
                <div className="relative z-10">
                  <div className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-text-primary mb-1">
                    {stat.isDecimal ? (
                      <>
                        $<AnimatedCounter
                          target={stat.value * 10}
                          duration={2000}
                          suffix={stat.suffix}
                          isDecimal
                          decimals={1}
                        />
                      </>
                    ) : (
                      <AnimatedCounter
                        target={stat.value}
                        duration={2000}
                        suffix={stat.suffix}
                      />
                    )}
                  </div>
                  <p className="text-text-muted text-sm">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
