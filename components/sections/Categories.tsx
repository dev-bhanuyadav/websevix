"use client";

import { motion } from "framer-motion";
import {
  Globe,
  Palette,
  ShoppingCart,
  Layers,
  Smartphone,
  Plug,
} from "lucide-react";
import { categories } from "@/data/content";
import TiltCard from "@/components/ui/TiltCard";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const iconMap = {
  Globe,
  Palette,
  ShoppingCart,
  Layers,
  Smartphone,
  Plug,
};

const easing = [0.25, 0.1, 0.25, 1] as const;

const diagonalOrder = [0, 1, 2, 3, 4, 5]; // top-left to bottom-right: 0, 1, 2 (row1) 3, 4, 5 (row2)

export default function Categories() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="categories" className="relative py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-center text-text-primary mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: easing }}
        >
          Featured Categories
        </motion.h2>
        <motion.p
          className="text-text-muted text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: easing }}
        >
          Find developers for your next project across popular categories
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, index) => {
            const Icon = iconMap[cat.icon as keyof typeof iconMap];
            const staggerDelay = diagonalOrder[index] * 0.08;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.5,
                  delay: staggerDelay,
                  ease: easing,
                }}
              >
                <TiltCard className="h-full">
                  <motion.a
                    href={`#category-${cat.id}`}
                    className="block h-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group"
                    whileHover={reducedMotion ? {} : { y: -4 }}
                  >
                    {/* Subtle border shimmer */}
                    {!reducedMotion && (
                      <span
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent)",
                          backgroundSize: "200% 100%",
                          animation: "shimmer 2s linear infinite",
                        }}
                      />
                    )}
                    <div className="relative z-10">
                      <motion.div
                        className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4"
                        whileHover={reducedMotion ? {} : { scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      >
                        {Icon && <Icon className="w-6 h-6 text-primary" />}
                      </motion.div>
                      <h3 className="font-display font-semibold text-lg text-text-primary mb-1">
                        {cat.title}
                      </h3>
                      <p className="text-text-muted text-sm">
                        {cat.activeProjects} active projects
                      </p>
                    </div>
                  </motion.a>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
