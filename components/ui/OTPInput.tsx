"use client";

import { useRef, useCallback, KeyboardEvent } from "react";
import { motion } from "framer-motion";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  error?: boolean;
  onComplete?: (value: string) => void;
}

export function OTPInput({
  value,
  onChange,
  length = 6,
  disabled,
  error,
  onComplete,
}: OTPInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const digits = value.split("").concat(Array(length - value.length).fill(""));

  const setFocus = useCallback(() => inputRef.current?.focus(), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, "").slice(0, length);
    onChange(v);
    if (v.length === length) onComplete?.(v);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && value.length > 0 && !e.currentTarget.value) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="flex justify-center gap-2" onClick={setFocus}>
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        maxLength={length}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="absolute opacity-0 w-0 h-0 pointer-events-none"
        aria-label="OTP code"
      />
      {digits.map((d, i) => (
        <motion.div
          key={i}
          layout
          className={`
            w-12 h-14 rounded-xl border flex items-center justify-center text-xl font-bold font-mono
            transition-colors duration-200
            ${error ? "border-red-500/60 bg-red-500/10 text-red-400" : "border-white/20 bg-white/5 text-snow"}
            ${value.length === i ? "ring-2 ring-indigo-500/50" : ""}
          `}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, type: "spring", stiffness: 400, damping: 20 }}
        >
          {d}
        </motion.div>
      ))}
    </div>
  );
}
