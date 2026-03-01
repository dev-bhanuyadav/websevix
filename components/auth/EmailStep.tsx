"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlowInput } from "@/components/ui/GlowInput";

interface EmailStepProps {
  onSubmit: (email: string) => void;
  isLoading: boolean;
  error: string | null;
}

export function EmailStep({ onSubmit, isLoading, error }: EmailStepProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onSubmit(email.trim().toLowerCase());
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-5"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <GlowInput
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error ?? undefined}
        disabled={isLoading}
        autoFocus
        required
      />
      <motion.button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold hover:opacity-95 disabled:opacity-60 transition-opacity"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {isLoading ? "Checking…" : "Continue"}
      </motion.button>
    </motion.form>
  );
}
