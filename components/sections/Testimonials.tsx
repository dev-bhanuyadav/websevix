"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
const EXPO = [0.16, 1, 0.3, 1] as const;

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Manager @ TechFlow",
    initials: "SC",
    grad: "from-indigo-500 to-violet-400",
    stars: 5,
    quote: "I placed an order, paid via Razorpay, and chatted with the team throughout. They built our landing page and delivered on time. Simple and professional.",
    tag: "Landing page",
  },
  {
    name: "Marcus Johnson",
    role: "Founder @ StartupXYZ",
    initials: "MJ",
    grad: "from-violet-500 to-cyan-400",
    stars: 5,
    quote: "No hassle of finding a developer. I told them what I needed, paid with Razorpay, and used live chat for updates. Got my e-commerce site delivered as promised.",
    tag: "E-commerce site",
  },
  {
    name: "Priya Sharma",
    role: "CTO @ ScaleUp Labs",
    initials: "PS",
    grad: "from-cyan-500 to-indigo-400",
    stars: 5,
    quote: "We order all our client websites from Websevix. Razorpay for payments, live chat for coordination — and they build everything. Smooth experience every time.",
    tag: "Multiple projects",
  },
];

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const next = useCallback(() => setIdx((i) => (i + 1) % testimonials.length), []);
  const prev = () => setIdx((i) => (i - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    const t = setInterval(next, 6500);
    return () => clearInterval(t);
  }, [next]);

  return (
    <section id="testimonials" className="section relative overflow-hidden">
      <div className="sep" />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(99,102,241,0.06), transparent 70%)" }} />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-20 relative">
        <motion.div
          className="text-center mb-16 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.0, ease: EXPO }}
        >
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-[0.22em] mb-4">Testimonials</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[2.9rem] text-snow leading-[1.1]">
            What our clients say
          </h2>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.7, ease: EXPO }}
            >
              <div className="card p-9 sm:p-11 relative overflow-hidden"
                style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.4)" }}>
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/35 to-transparent" />

                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: testimonials[idx].stars }).map((_, s) => (
                    <motion.div
                      key={s}
                      initial={{ opacity: 0, scale: 0, rotate: -20 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ duration: 0.6, ease: EXPO, delay: s * 0.1 }}
                    >
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    </motion.div>
                  ))}
                </div>

                <p className="text-silver text-lg sm:text-xl leading-[1.85] mb-9 font-light">
                  &ldquo;{testimonials[idx].quote}&rdquo;
                </p>

                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${testimonials[idx].grad} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}>
                      {testimonials[idx].initials}
                    </div>
                    <div>
                      <p className="font-display font-semibold text-snow text-sm">{testimonials[idx].name}</p>
                      <p className="text-slate text-xs mt-0.5">{testimonials[idx].role}</p>
                    </div>
                  </div>
                  <div className="card px-3.5 py-2 border border-white/[0.06]">
                    <p className="text-[11px] text-slate">{testimonials[idx].tag}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav */}
          <div className="flex items-center justify-center gap-4 mt-9">
            <button type="button" onClick={prev}
              className="w-9 h-9 rounded-full border border-white/[0.08] flex items-center justify-center text-slate hover:text-snow hover:border-indigo-500/30 hover:bg-indigo-500/8 transition-all duration-500"
              aria-label="Previous"
              style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} type="button" onClick={() => setIdx(i)}
                  className={`rounded-full transition-all duration-700 ${i === idx ? "w-8 h-2 bg-indigo-500" : "w-2 h-2 bg-white/15 hover:bg-white/30"}`}
                  aria-label={`Testimonial ${i + 1}`}
                  style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }} />
              ))}
            </div>
            <button type="button" onClick={next}
              className="w-9 h-9 rounded-full border border-white/[0.08] flex items-center justify-center text-slate hover:text-snow hover:border-indigo-500/30 hover:bg-indigo-500/8 transition-all duration-500"
              aria-label="Next"
              style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
