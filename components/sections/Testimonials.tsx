"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const ease = [0.25, 0.1, 0.25, 1] as const;

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechFlow Inc",
    initials: "SC",
    gradient: "from-violet-500 to-cyan-400",
    rating: 5,
    text: "We shipped our MVP in 6 weeks thanks to Websevix. The escrow and milestone flow gave us complete peace of mind — no surprises, just results.",
    metric: { label: "Shipped in", value: "6 weeks" },
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "Founder",
    company: "StartupXYZ",
    initials: "MJ",
    gradient: "from-cyan-500 to-violet-400",
    rating: 5,
    text: "Found a brilliant full-stack developer within 48 hours. The platform is smooth, proposals were detailed, and the whole process was transparent from day one.",
    metric: { label: "Hired in", value: "48 hours" },
  },
  {
    id: 3,
    name: "Priya Sharma",
    role: "CTO",
    company: "ScaleUp Labs",
    initials: "PS",
    gradient: "from-violet-400 to-violet-600",
    rating: 5,
    text: "We use Websevix for all our outsourced dev work. Transparent pricing, real-time chat, and milestone tracking makes collaboration with remote developers effortless.",
    metric: { label: "Projects done", value: "12+" },
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const rm = useReducedMotion();

  useEffect(() => {
    if (rm) return;
    const t = setInterval(() => setActive((i) => (i + 1) % testimonials.length), 5500);
    return () => clearInterval(t);
  }, [rm]);

  const prev = () => setActive((i) => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive((i) => (i + 1) % testimonials.length);

  return (
    <section id="testimonials" className="section-pad relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* BG accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.4), transparent 70%)" }} />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
        >
          <p className="text-xs font-semibold text-violet-400 uppercase tracking-[0.2em] mb-3">Social Proof</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[2.8rem] text-ink-white">
            Loved by Builders Worldwide
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease }}
            >
              <div className="glass rounded-3xl border border-white/[0.08] p-8 sm:p-10 relative overflow-hidden shadow-card">
                {/* Top shine */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

                {/* Quote icon */}
                <div className="absolute top-6 right-6 opacity-10">
                  <Quote className="w-16 h-16 text-violet-400 fill-violet-400" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map((s, si) => (
                    <motion.div
                      key={s}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: si * 0.08, type: "spring", stiffness: 200 }}
                    >
                      <Star className="w-4 h-4 fill-warning text-warning" />
                    </motion.div>
                  ))}
                </div>

                {/* Text */}
                <p className="text-ink-soft text-lg sm:text-xl leading-relaxed mb-8 relative z-10">
                  &ldquo;{testimonials[active].text}&rdquo;
                </p>

                {/* Author row */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${testimonials[active].gradient} flex items-center justify-center font-bold text-sm text-white flex-shrink-0`}>
                      {testimonials[active].initials}
                    </div>
                    <div>
                      <p className="font-display font-semibold text-ink-white text-sm">{testimonials[active].name}</p>
                      <p className="text-ink-muted text-xs">{testimonials[active].role} · {testimonials[active].company}</p>
                    </div>
                  </div>
                  <div className="glass rounded-xl border border-white/[0.07] px-4 py-2 text-center">
                    <p className="font-display font-bold text-violet-400 text-lg leading-tight">{testimonials[active].metric.value}</p>
                    <p className="text-ink-muted text-[10px] font-medium">{testimonials[active].metric.label}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              type="button"
              onClick={prev}
              className="w-9 h-9 rounded-full border border-white/[0.1] flex items-center justify-center text-ink-muted hover:text-ink-white hover:border-violet-500/40 hover:bg-violet-600/10 transition-all duration-200"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === active ? "w-8 h-2 bg-violet-500" : "w-2 h-2 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              className="w-9 h-9 rounded-full border border-white/[0.1] flex items-center justify-center text-ink-muted hover:text-ink-white hover:border-violet-500/40 hover:bg-violet-600/10 transition-all duration-200"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
