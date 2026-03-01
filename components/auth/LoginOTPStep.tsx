"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { OTPInput } from "@/components/ui/OTPInput";

interface LoginOTPStepProps {
  email: string;
  onSubmit: (otp: string) => void;
  onResend: () => void;
  isLoading: boolean;
  error: string | null;
  resendCooldown: number;
  canResend: boolean;
}

export function LoginOTPStep({
  email,
  onSubmit,
  onResend,
  isLoading,
  error,
  resendCooldown,
  canResend,
}: LoginOTPStepProps) {
  const [otp, setOtp] = useState("");

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35 }}
    >
      <p className="text-sm text-slate">
        We sent a 6-digit code to <span className="text-silver font-medium">{email}</span>
      </p>
      <OTPInput
        value={otp}
        onChange={setOtp}
        length={6}
        disabled={isLoading}
        error={!!error}
        onComplete={onSubmit}
      />
      {error && (
        <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-400 text-center">
          {error}
        </motion.p>
      )}
      <div className="text-center">
        {canResend ? (
          <button type="button" onClick={onResend} disabled={isLoading} className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">
            Resend code
          </button>
        ) : (
          <span className="text-sm text-slate">Resend in {resendCooldown}s</span>
        )}
      </div>
      <motion.button
        type="button"
        onClick={() => otp.length === 6 && onSubmit(otp)}
        disabled={otp.length !== 6 || isLoading}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold disabled:opacity-50 transition-opacity"
      >
        {isLoading ? "Verifying…" : "Verify & sign in"}
      </motion.button>
    </motion.div>
  );
}
