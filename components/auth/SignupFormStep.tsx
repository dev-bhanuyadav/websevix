"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { GlowInput } from "@/components/ui/GlowInput";
import { contentContainerVariants, contentItemVariants } from "@/lib/animations";
import type { RegisterData } from "@/hooks/useAuthFlow";

const schema = z.object({
  firstName: z.string().min(2, "At least 2 chars").max(50),
  lastName:  z.string().min(2, "At least 2 chars").max(50),
  phone:     z.string().regex(/^[+]?[\d\s\-]{10,15}$/, "Valid phone required"),
});

interface SignupFormStepProps {
  email: string;
  onSubmit: (data: RegisterData) => void;
  onBack: () => void;
  isLoading: boolean;
  error: string | null;
}

export function SignupFormStep({ email, onSubmit, onBack, isLoading, error }: SignupFormStepProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const handleFormSubmit = (data: z.infer<typeof schema>) => {
    onSubmit({ ...data, email, role: "client" });
  };

  return (
    <motion.div
      variants={contentContainerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Header */}
      <motion.div variants={contentItemVariants} className="text-center space-y-1">
        <div
          className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-2"
          style={{
            background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
            boxShadow: "0 0 24px rgba(99,102,241,0.4)",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="2"/>
          </svg>
        </div>
        <h2 className="font-display font-bold text-xl text-snow">Create your account</h2>
        <p className="text-xs text-slate">{email}</p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-3"
        variants={contentItemVariants}
      >
        <div className="grid grid-cols-2 gap-3">
          <GlowInput
            label="First name"
            placeholder="John"
            autoFocus
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <GlowInput
            label="Last name"
            placeholder="Doe"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>

        <GlowInput
          label="Phone number"
          type="tel"
          placeholder="+91 98765 43210"
          error={errors.phone?.message}
          {...register("phone")}
        />

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-400 text-center"
          >
            {error}
          </motion.p>
        )}

        <div className="flex gap-3 pt-1">
          <motion.button
            type="button"
            onClick={onBack}
            className="flex-1 py-3 rounded-xl border border-white/10 text-slate hover:bg-white/[0.04] hover:text-silver text-sm font-medium transition-colors"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            ← Back
          </motion.button>

          <motion.button
            type="submit"
            disabled={isLoading}
            className="relative flex-1 py-3 rounded-xl font-semibold text-white text-sm overflow-hidden disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
              boxShadow: "0 4px 18px rgba(99,102,241,0.28)",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/12 to-transparent -skew-x-12"
              animate={{ x: ["-150%", "300%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
            />
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Sending…
                </>
              ) : "Send Code →"}
            </span>
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
}
