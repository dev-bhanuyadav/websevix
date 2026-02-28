"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "@/data/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const easing = [0.25, 0.1, 0.25, 1] as const;

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const t = setInterval(() => {
      setActiveIndex((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(t);
  }, [reducedMotion]);

  return (
    <section id="testimonials" className="relative py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-center text-text-primary mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: easing }}
        >
          What Our Clients Say
        </motion.h2>
        <motion.p
          className="text-text-muted text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: easing }}
        >
          Trusted by startups and enterprises worldwide
        </motion.p>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: easing }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-10"
            >
              <div className="flex flex-col items-center text-center">
                <span className="text-6xl text-primary/20 font-serif leading-none select-none">
                  &ldquo;
                </span>
                <p className="text-text-primary text-lg sm:text-xl leading-relaxed mb-8 -mt-4">
                  {testimonials[activeIndex].text}
                </p>
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star, i) => (
                    <motion.div
                      key={star}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * i, duration: 0.3 }}
                    >
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    </motion.div>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <motion.div
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5"
                    whileHover={reducedMotion ? {} : { scale: 1.05 }}
                  >
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center font-display font-bold text-lg text-text-primary">
                      {testimonials[activeIndex].name.charAt(0)}
                    </div>
                  </motion.div>
                  <div className="text-left">
                    <div className="font-display font-semibold text-text-primary">
                      {testimonials[activeIndex].name}
                    </div>
                    <div className="text-text-muted text-sm">
                      {testimonials[activeIndex].role}, {testimonials[activeIndex].company}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              type="button"
              onClick={() => setActiveIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}
              className="p-2 rounded-full border border-border text-text-muted hover:text-text-primary hover:border-white/20 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === activeIndex ? "bg-primary w-8" : "bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setActiveIndex((i) => (i + 1) % testimonials.length)}
              className="p-2 rounded-full border border-border text-text-muted hover:text-text-primary hover:border-white/20 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
