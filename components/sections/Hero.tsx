"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, MessageSquare, FileText } from "lucide-react";
import { heroContent } from "@/data/content";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ParticleField from "@/components/ui/ParticleField";
import GradientText from "@/components/ui/GradientText";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const easing = [0.25, 0.1, 0.25, 1] as const;

export default function Hero() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 bg-background">
        {!reducedMotion && (
          <motion.div
            className="absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.2), transparent 50%), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(139, 92, 246, 0.12), transparent 50%), radial-gradient(ellipse 50% 30% at 0% 80%, rgba(6, 182, 212, 0.1), transparent 50%)",
            }}
            animate={{
              opacity: [0.5, 0.8, 0.6],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
        <div className="absolute inset-0 bg-mesh-gradient opacity-90" />
      </div>
      <ParticleField />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easing }}
            className="mb-6"
          >
            <Badge>{heroContent.badge}</Badge>
          </motion.div>

          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight text-text-primary mb-6">
            <span className="block">
              {(["Find", "Expert", "Developers."].map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-[0.25em] text-text-primary"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: easing }}
                >
                  {word}
                </motion.span>
              )))}
            </span>
            <span className="block">
              {(["Build", "Faster."].map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-[0.25em]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.24 + i * 0.08, duration: 0.5, ease: easing }}
                >
                  <GradientText>{word}</GradientText>
                </motion.span>
              )))}
            </span>
            <span className="block">
              {(["Pay", "Securely."].map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-[0.25em] text-text-primary"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.5, ease: easing }}
                >
                  {word}
                </motion.span>
              )))}
            </span>
          </h1>

          <motion.p
            className="text-lg sm:text-xl text-text-muted max-w-xl mx-auto lg:mx-0 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: easing }}
          >
            {heroContent.subheadline}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: easing }}
          >
            <Link href="#signup">
              <Button variant="primary" size="lg" shimmer className="w-full sm:w-auto">
                {heroContent.ctaPrimary}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="#categories">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                {heroContent.ctaSecondary}
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-text-muted text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.6,
              duration: 0.5,
              type: "spring",
              stiffness: 100,
              damping: 15,
            }}
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-background"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.05, type: "spring", stiffness: 200 }}
                />
              ))}
            </div>
            <span>{heroContent.trustText}</span>
          </motion.div>
        </div>

        {/* Hero mockup - floating dashboard */}
        <motion.div
          className="relative hidden lg:block"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: easing }}
          style={{
            y: reducedMotion ? 0 : undefined,
          }}
        >
          {!reducedMotion && (
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-glow-lg">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-4 text-text-muted text-sm">Dashboard</span>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { label: "Active", value: "24", icon: BarChart3 },
                    { label: "Proposals", value: "12", icon: FileText },
                    { label: "Messages", value: "8", icon: MessageSquare },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      className="bg-white/5 rounded-xl p-4 border border-white/5"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                    >
                      <item.icon className="w-5 h-5 text-primary mb-2" />
                      <div className="text-2xl font-display font-bold text-text-primary">
                        {item.value}
                      </div>
                      <div className="text-xs text-text-muted">{item.label}</div>
                    </motion.div>
                  ))}
                </div>
                <div className="h-24 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-text-muted text-sm">
                  Project activity feed
                </div>
              </div>
            </motion.div>
          )}
          {reducedMotion && (
            <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-glow-lg">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-4 text-text-muted text-sm">Dashboard</span>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Active", value: "24", icon: BarChart3 },
                  { label: "Proposals", value: "12", icon: FileText },
                  { label: "Messages", value: "8", icon: MessageSquare },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-white/5 rounded-xl p-4 border border-white/5"
                  >
                    <item.icon className="w-5 h-5 text-primary mb-2" />
                    <div className="text-2xl font-display font-bold text-text-primary">
                      {item.value}
                    </div>
                    <div className="text-xs text-text-muted">{item.label}</div>
                  </div>
                ))}
              </div>
              <div className="h-24 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-text-muted text-sm">
                Project activity feed
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
