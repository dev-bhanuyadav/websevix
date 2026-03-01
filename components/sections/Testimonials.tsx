"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const ease = [0.25, 0.1, 0.25, 1] as const;

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Manager @ TechFlow",
    initials: "SC",
    gradient: "from-indigo-500 to-violet-400",
    rating: 5,
    quote: "We shipped our MVP in 6 weeks. The milestone system meant we always knew where our money was going. Couldn't have done it without Websevix.",
    detail: "Built a B2B SaaS dashboard from scratch",
  },
  {
    name: "Marcus Johnson",
    role: "Founder @ StartupXYZ",
    initials: "MJ",
    gradient: "from-violet-500 to-cyan-400",
    rating: 5,
    quote: "I'd tried other platforms before. This one is different — the developers actually read your brief, the escrow system works, and support is real.",
    detail: "Launched a Shopify custom storefront",
  },
  {
    name: "Priya Sharma",
    role: "CTO @ ScaleUp Labs",
    initials: "PS",
    gradient: "from-cyan-500 to-indigo-400",
    rating: 5,
    quote: "Our dev team uses Websevix for every outsourced feature. Real-time chat and file sharing keeps everything in one place. Transparent, reliable, fast.",
    detail: "Ongoing SaaS feature development",
  },
];

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const rm = useReducedMotion();
  const next = useCallback(() => setIdx((i) => (i + 1) % testimonials.length), []);
  const prev = () => setIdx((i) => (i - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    if (rm) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [rm, next]);

  return (
    <section id="testimonials" className="section relative overflow-hidden">
      <div className="sep" />

      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 60%, rgba(99,102,241,0.06), transparent 70%)" }} />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 relative">
        <motion.div
          className="text-center mb-14 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
        >
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-[0.2em] mb-3">Testimonials</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[2.75rem] text-snow leading-tight">
            What our clients say
          </h2>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.38, ease }}
            >
              <div className="card border border-white/[0.08] p-8 sm:p-10 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: testimonials[idx].rating }).map((_, s) => (
                    <motion.div
                      key={s}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: s * 0.08, type: "spring", stiffness: 200 }}
                    >
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    </motion.div>
                  ))}
                </div>

                <p className="text-silver text-lg sm:text-xl leading-relaxed mb-8">
                  &ldquo;{testimonials[idx].quote}&rdquo;
                </p>

                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonials[idx].gradient} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                      {testimonials[idx].initials}
                    </div>
                    <div>
                      <p className="font-display font-semibold text-snow text-sm">{testimonials[idx].name}</p>
                      <p className="text-slate text-xs">{testimonials[idx].role}</p>
                    </div>
                  </div>
                  <div className="card px-3.5 py-2 border border-white/[0.06]">
                    <p className="text-[11px] text-slate">{testimonials[idx].detail}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button type="button" onClick={prev}
              className="w-9 h-9 rounded-full border border-white/[0.08] flex items-center justify-center text-slate hover:text-snow hover:border-indigo-500/30 hover:bg-indigo-500/8 transition-all"
              aria-label="Previous">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} type="button" onClick={() => setIdx(i)}
                  className={`rounded-full transition-all duration-300 ${i === idx ? "w-7 h-2 bg-indigo-500" : "w-2 h-2 bg-white/15 hover:bg-white/30"}`}
                  aria-label={`Testimonial ${i + 1}`} />
              ))}
            </div>
            <button type="button" onClick={next}
              className="w-9 h-9 rounded-full border border-white/[0.08] flex items-center justify-center text-slate hover:text-snow hover:border-indigo-500/30 hover:bg-indigo-500/8 transition-all"
              aria-label="Next">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
