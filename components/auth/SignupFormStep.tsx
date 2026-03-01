"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { GlowInput } from "@/components/ui/GlowInput";

const schema = z.object({
  firstName: z.string().min(2, "At least 2 characters").max(50),
  lastName: z.string().min(2, "At least 2 characters").max(50),
  phone: z.string().regex(/^[+]?[\d\s-]{10,15}$/, "Valid phone required"),
  role: z.enum(["client", "developer"]),
});

type FormData = z.infer<typeof schema>;

interface SignupFormStepProps {
  email: string;
  onSubmit: (data: FormData) => void;
  onBack: () => void;
  isLoading: boolean;
  error: string | null;
}

export function SignupFormStep({ email, onSubmit, onBack, isLoading, error }: SignupFormStepProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "client" },
  });

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <p className="text-sm text-slate mb-4">
        Create your account — <span className="text-silver">{email}</span>
      </p>
      <div className="grid grid-cols-2 gap-4">
        <GlowInput label="First name" {...register("firstName")} error={errors.firstName?.message} placeholder="John" />
        <GlowInput label="Last name" {...register("lastName")} error={errors.lastName?.message} placeholder="Doe" />
      </div>
      <GlowInput label="Phone" {...register("phone")} error={errors.phone?.message} placeholder="+91 98765 43210" />
      <div>
        <label className="block text-xs font-medium text-slate mb-2">I am a</label>
        <div className="flex gap-2">
          {(["client", "developer"] as const).map((role) => (
            <label
              key={role}
              className="flex-1 flex items-center justify-center py-3 rounded-xl border border-white/10 bg-white/5 cursor-pointer has-[:checked]:border-indigo-500/50 has-[:checked]:bg-indigo-500/10 transition-colors"
            >
              <input type="radio" value={role} {...register("role")} className="sr-only" />
              <span className="text-sm font-medium capitalize">{role}</span>
            </label>
          ))}
        </div>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onBack} className="flex-1 py-3 rounded-xl border border-white/10 text-slate hover:bg-white/5 transition-colors">
          Back
        </button>
        <motion.button type="submit" disabled={isLoading} className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold disabled:opacity-60">
          {isLoading ? "Sending code…" : "Send verification code"}
        </motion.button>
      </div>
    </motion.form>
  );
}
