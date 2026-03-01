"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";

type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onDrag" | "onDragEnd" | "onDragEnter" | "onDragExit" | "onDragLeave" | "onDragOver" | "onDragStart" | "onAnimationStart"
>;

interface GlowInputProps extends InputProps {
  label: string;
  error?: string;
}

export const GlowInput = forwardRef<HTMLInputElement, GlowInputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="block text-xs font-medium text-slate mb-2">{label}</label>
        <motion.input
          ref={ref}
          className={`
            w-full px-4 py-3.5 rounded-xl bg-white/5 border text-snow placeholder-slate/60
            focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/30
            transition-all duration-300
            ${error ? "border-red-500/50 focus:ring-red-500/30" : "border-white/10"}
            ${className}
          `}
          whileFocus={{ boxShadow: "0 0 0 3px rgba(99,102,241,0.15)" }}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

GlowInput.displayName = "GlowInput";
