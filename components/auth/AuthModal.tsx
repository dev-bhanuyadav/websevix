"use client";

import { useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useAuthFlow, type RegisterData } from "@/hooks/useAuthFlow";
import { useAuth } from "@/hooks/useAuth";
import { useOTPTimer } from "@/hooks/useOTPTimer";
import { EmailStep } from "./EmailStep";
import { LoginOTPStep } from "./LoginOTPStep";
import { SignupFormStep } from "./SignupFormStep";
import { SignupOTPStep } from "./SignupOTPStep";
import { SuccessStep } from "./SuccessStep";

const API = "/api/auth";

interface AuthModalProps {
  defaultMode?: "login" | "signup";
  onSuccess?: () => void;
}

export function AuthModal({ defaultMode = "login", onSuccess }: AuthModalProps) {
  const { login } = useAuth();
  const {
    state,
    setEmail,
    setUserExists,
    setUserNew,
    setOtpSent,
    setUserData,
    setOtpVerified,
    setError,
    setLoading,
    reset,
  } = useAuthFlow(defaultMode);

  const { secondsLeft, start: startTimer, canResend } = useOTPTimer();

  // ── sendOtp must be defined BEFORE handleEmailSubmit ──
  const sendOtp = useCallback(
    async (email: string, type: "login" | "signup") => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API}/send-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, type }),
        });
        const data = await res.json() as { error?: string; retryAfter?: number; expiresIn?: number };
        if (!res.ok) {
          const msg = data.retryAfter
            ? `Please wait ${data.retryAfter}s before resending`
            : (data.error ?? "Failed to send code");
          setError(msg);
          return;
        }
        setOtpSent(Date.now());
        startTimer(data.expiresIn ?? 600);
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    },
    [setOtpSent, setLoading, setError, startTimer]
  );

  const handleEmailSubmit = useCallback(
    async (email: string) => {
      setLoading(true);
      setError(null);
      try {
        const checkRes = await fetch(`${API}/check-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const checkData = await checkRes.json() as { exists: boolean; firstName?: string; error?: string };
        if (!checkRes.ok) {
          setError(checkData.error ?? "Something went wrong");
          return;
        }
        setEmail(email);
        if (checkData.exists) {
          setUserExists(checkData.firstName);
          await sendOtp(email, "login");
        } else {
          setUserNew();
        }
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [setEmail, setLoading, setError, setUserExists, setUserNew, sendOtp]
  );

  const handleLoginOtpSubmit = useCallback(
    async (otp: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API}/verify-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: state.email, otp, type: "login" }),
        });
        const data = await res.json() as { error?: string; accessToken?: string; user?: unknown };
        if (!res.ok) {
          setError(data.error ?? "Invalid code");
          return;
        }
        login({ accessToken: data.accessToken!, user: data.user as Parameters<typeof login>[0]["user"] });
        setOtpVerified();
        setTimeout(() => onSuccess?.(), 1500);
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    },
    [state.email, login, setOtpVerified, setLoading, setError, onSuccess]
  );

  const handleSignupFormSubmit = useCallback(
    async (data: RegisterData) => {
      setUserData(data);
      await sendOtp(state.email, "signup");
    },
    [state.email, setUserData, sendOtp]
  );

  const handleSignupOtpSubmit = useCallback(
    async (otp: string) => {
      setLoading(true);
      setError(null);
      const ud = state.userData as RegisterData;
      try {
        const res = await fetch(`${API}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: state.email,
            firstName: ud.firstName,
            lastName: ud.lastName,
            phone: ud.phone,
            role: ud.role,
            otp,
          }),
        });
        const data = await res.json() as { error?: string; accessToken?: string; user?: unknown };
        if (!res.ok) {
          setError(data.error ?? "Registration failed");
          return;
        }
        login({ accessToken: data.accessToken!, user: data.user as Parameters<typeof login>[0]["user"] });
        setOtpVerified();
        setTimeout(() => onSuccess?.(), 1500);
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    },
    [state.email, state.userData, login, setOtpVerified, setLoading, setError, onSuccess]
  );

  const step = state.step;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-base">
      <motion.div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-card shadow-card-float p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="font-display font-bold text-xl text-snow">
            Websevix
          </Link>
          <Link href="/" className="text-sm text-slate hover:text-silver transition-colors">
            ← Back
          </Link>
        </div>

        <AnimatePresence mode="wait">
          {step === "EMAIL" && (
            <EmailStep
              key="email"
              onSubmit={handleEmailSubmit}
              isLoading={state.isLoading}
              error={state.error}
            />
          )}
          {step === "LOGIN_OTP" && (
            <LoginOTPStep
              key="login-otp"
              email={state.email}
              onSubmit={handleLoginOtpSubmit}
              onResend={() => sendOtp(state.email, "login")}
              isLoading={state.isLoading}
              error={state.error}
              resendCooldown={secondsLeft}
              canResend={canResend}
            />
          )}
          {step === "SIGNUP_DETAILS" && (
            <SignupFormStep
              key="signup-form"
              email={state.email}
              onSubmit={handleSignupFormSubmit}
              onBack={reset}
              isLoading={state.isLoading}
              error={state.error}
            />
          )}
          {step === "SIGNUP_OTP" && (
            <SignupOTPStep
              key="signup-otp"
              email={state.email}
              onSubmit={handleSignupOtpSubmit}
              onResend={() => sendOtp(state.email, "signup")}
              isLoading={state.isLoading}
              error={state.error}
              resendCooldown={secondsLeft}
              canResend={canResend}
            />
          )}
          {step === "SUCCESS" && (
            <SuccessStep
              key="success"
              firstName={state.userData.firstName ?? state.firstName}
            />
          )}
        </AnimatePresence>

        {(step === "SIGNUP_DETAILS" || step === "EMAIL") && (
          <p className="mt-6 text-center text-xs text-slate">
            {step === "SIGNUP_DETAILS" ? (
              <>
                Already have an account?{" "}
                <button type="button" onClick={reset} className="text-indigo-400 hover:underline">
                  Sign in
                </button>
              </>
            ) : (
              <>
                New here?{" "}
                <Link href="/signup" className="text-indigo-400 hover:underline">
                  Create account
                </Link>
              </>
            )}
          </p>
        )}
      </motion.div>
    </div>
  );
}
