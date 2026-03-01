"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface SuccessStepProps {
  firstName: string;
}

export function SuccessStep({ firstName }: SuccessStepProps) {
  return (
    <motion.div
      className="text-center py-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-6"
      >
        <CheckCircle className="w-8 h-8 text-emerald-400" />
      </motion.div>
      <motion.h3
        className="font-display font-bold text-xl text-snow mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        Welcome{firstName ? `, ${firstName}` : ""}!
      </motion.h3>
      <motion.p
        className="text-slate text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Taking you to your dashboard…
      </motion.p>
    </motion.div>
  );
}
