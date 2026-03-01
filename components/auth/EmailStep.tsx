"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { GlowInput } from "@/components/ui/GlowInput";
import { contentContainerVariants, contentItemVariants, charVariants } from "@/lib/animations";

const TITLE = "Welcome back";

interface EmailStepProps {
  onSubmit: (email: string) => void;
  isLoading: boolean;
  error: string | null;
  showContent?: boolean;
}

export function EmailStep({ onSubmit, isLoading, error, showContent = true }: EmailStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = inputRef.current?.value.trim();
    if (val) onSubmit(val);
  };

  return (
    <motion.div
      variants={contentContainerVariants}
      initial="hidden"
      animate={showContent ? "visible" : "hidden"}
      className="space-y-5"
    >
      {/* Logo */}
      <motion.div
        variants={{
          hidden: { scale: 0, rotate: -30, opacity: 0 },
          visible: {
            scale: 1, rotate: 0, opacity: 1,
            transition: { type: "spring", stiffness: 280, damping: 18, delay: 0 },
          },
        }}
        className="flex justify-center mb-2"
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center relative"
          style={{
            background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
            boxShadow: "0 0 30px rgba(99,102,241,0.45), 0 0 60px rgba(99,102,241,0.15)",
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M3 8h18M3 12h12M3 16h9" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </motion.div>

      {/* Title character-by-character */}
      <motion.div
        variants={contentItemVariants}
        className="text-center"
      >
        <h1 className="font-display font-bold text-2xl text-snow tracking-tight">
          {TITLE.split("").map((char, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={charVariants}
              className="inline-block"
              style={{ whiteSpace: char === " " ? "pre" : "normal" }}
            >
              {char}
            </motion.span>
          ))}
        </h1>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        variants={contentItemVariants}
        className="text-center text-sm text-slate"
      >
        Enter your email to continue
      </motion.p>

      {/* Divider */}
      <motion.div variants={contentItemVariants} className="relative h-px overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
        />
      </motion.div>

      {/* Form */}
      <motion.form onSubmit={handleSubmit} className="space-y-4" variants={contentItemVariants}>
        <GlowInput
          ref={inputRef}
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          autoFocus
          required
          error={error ?? undefined}
        />

        <motion.button
          type="submit"
          disabled={isLoading}
          className="relative w-full py-3.5 rounded-xl font-semibold text-white overflow-hidden disabled:opacity-60"
          style={{
            background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
            boxShadow: "0 4px 20px rgba(99,102,241,0.3)",
          }}
          whileHover={{ scale: 1.02, boxShadow: "0 6px 28px rgba(99,102,241,0.45)" }}
          whileTap={{ scale: 0.97 }}
        >
          {/* Shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12"
            animate={{ x: ["-150%", "300%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
          />
          <span className="relative z-10">
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Checking…
              </span>
            ) : "Continue →"}
          </span>
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
