"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useAuthFlow, type RegisterData } from "@/hooks/useAuthFlow";
import { useBlast, type BlastPhase } from "@/hooks/useBlast";
import { useAuth } from "@/hooks/useAuth";
import { useOTPTimer } from "@/hooks/useOTPTimer";
import { BlastCanvas, type BlastCanvasHandle } from "./BlastCanvas";
import { EmailStep }       from "./EmailStep";
import { LoginOTPStep }    from "./LoginOTPStep";
import { SignupFormStep }  from "./SignupFormStep";
import { SignupOTPStep }   from "./SignupOTPStep";
import { SuccessStep }     from "./SuccessStep";
import { stepForwardVariants, stepBackwardVariants, modalVariants } from "@/lib/animations";

const API = "/api/auth";

interface AuthModalProps {
  defaultMode?: "login" | "signup";
  onSuccess?: () => void;
  /** If true, blast fires from screen center on mount */
  autoBlast?: boolean;
}

export function AuthModal({ defaultMode = "login", onSuccess, autoBlast = true }: AuthModalProps) {
  const prefersReduced = useReducedMotion();
  const { login } = useAuth();
  const { phase, origin, trigger, reset: resetBlast } = useBlast();
  const {
    state, setEmail, setUserExists, setUserNew, setOtpSent,
    setUserData, setOtpVerified, setError, setLoading, reset,
  } = useAuthFlow(defaultMode);
  const { secondsLeft, start: startTimer, canResend } = useOTPTimer();

  const canvasRef         = useRef<BlastCanvasHandle>(null);
  const modalRef          = useRef<HTMLDivElement>(null);
  const microParticleRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  const [vignetteVisible, setVignetteVisible]   = useState(false);
  const [chromatic, setChromatic]               = useState(false);
  const [warp, setWarp]                         = useState(false);
  const [direction, setDirection]               = useState<"forward" | "backward">("forward");
  const [borderGlowColor, setBorderGlowColor]   = useState<string | null>(null);

  // ── Fire blast on mount ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!autoBlast) return;

    // Read coordinates stored by Navbar before navigation
    let ox: number | undefined;
    let oy: number | undefined;
    try {
      const stored = sessionStorage.getItem("blast_origin");
      if (stored) {
        const parsed = JSON.parse(stored) as { x: number; y: number };
        ox = parsed.x;
        oy = parsed.y;
        sessionStorage.removeItem("blast_origin");
      }
    } catch { /* ignore */ }

    // Small delay so the page paint is done first
    const t = setTimeout(() => trigger(ox, oy), 80);
    return () => clearTimeout(t);
  }, [autoBlast, trigger]);

  // ── Drive canvas effects based on phase ─────────────────────────────────────
  useEffect(() => {
    if (prefersReduced) return;
    if (phase === "blast") {
      const { x, y } = origin;
      canvasRef.current?.rings(x, y);
      setTimeout(() => canvasRef.current?.explode(x, y), 100);
      setTimeout(() => setWarp(true), 200);
      setTimeout(() => setWarp(false), 500);
      setTimeout(() => setVignetteVisible(true), 400);
      setTimeout(() => { setChromatic(true);  }, 600);
      setTimeout(() => { setChromatic(false); }, 720);
    }
    if (phase === "portal") {
      const { x, y } = origin;
      canvasRef.current?.implosion(x, y);
    }
    if (phase === "ambient") {
      // Start micro particle loop
      microParticleRef.current = setInterval(() => {
        if (!modalRef.current) return;
        const rect = modalRef.current.getBoundingClientRect();
        const mx = rect.left + Math.random() * rect.width;
        const my = rect.bottom - 4;
        canvasRef.current?.microParticle(mx, my);
      }, 700);
    }
    return () => {
      if (microParticleRef.current) clearInterval(microParticleRef.current);
    };
  }, [phase, origin, prefersReduced]);

  // ── Error → flash red border + error burst ──────────────────────────────────
  useEffect(() => {
    if (!state.error) return;
    setBorderGlowColor("#EF4444");
    const t = setTimeout(() => setBorderGlowColor(null), 350);
    return () => clearTimeout(t);
  }, [state.error]);

  // ── OTP / API handlers ───────────────────────────────────────────────────────
  const sendOtp = useCallback(
    async (email: string, type: "login" | "signup") => {
      setLoading(true);
      setError(null);
      try {
        const res  = await fetch(`${API}/send-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, type }),
        });
        const data = await res.json() as { error?: string; retryAfter?: number; expiresIn?: number };
        if (!res.ok) {
          setError(data.retryAfter
            ? `Please wait ${data.retryAfter}s before resending`
            : (data.error ?? "Failed to send code"));
          return;
        }
        setOtpSent(Date.now());
        startTimer(data.expiresIn ?? 600);
      } catch { setError("Network error"); }
      finally   { setLoading(false); }
    },
    [setOtpSent, setLoading, setError, startTimer]
  );

  const handleEmailSubmit = useCallback(
    async (email: string) => {
      setLoading(true);
      setError(null);
      setDirection("forward");
      try {
        const res  = await fetch(`${API}/check-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json() as { exists: boolean; firstName?: string; error?: string };
        if (!res.ok) { setError(data.error ?? "Something went wrong"); return; }
        setEmail(email);
        if (data.exists) {
          setUserExists(data.firstName);
          await sendOtp(email, "login");
        } else {
          setUserNew();
        }
      } catch { setError("Network error. Please try again."); }
      finally   { setLoading(false); }
    },
    [setEmail, setLoading, setError, setUserExists, setUserNew, sendOtp]
  );

  const handleLoginOtpSubmit = useCallback(
    async (otp: string) => {
      setLoading(true);
      setError(null);
      try {
        const res  = await fetch(`${API}/verify-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: state.email, otp, type: "login" }),
        });
        const data = await res.json() as { error?: string; accessToken?: string; user?: unknown };
        if (!res.ok) { setError(data.error ?? "Invalid code"); return; }
        login({ accessToken: data.accessToken!, user: data.user as Parameters<typeof login>[0]["user"] });
        setOtpVerified();
        setTimeout(() => onSuccess?.(), 2600);
      } catch { setError("Network error"); }
      finally   { setLoading(false); }
    },
    [state.email, login, setOtpVerified, setLoading, setError, onSuccess]
  );

  const handleSignupFormSubmit = useCallback(
    async (data: RegisterData) => {
      setDirection("forward");
      setUserData(data);
      await sendOtp(state.email, "signup");
    },
    [state.email, setUserData, sendOtp, setDirection]
  );

  const handleSignupOtpSubmit = useCallback(
    async (otp: string) => {
      setLoading(true);
      setError(null);
      const ud = state.userData as RegisterData;
      try {
        const res  = await fetch(`${API}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: state.email, firstName: ud.firstName, lastName: ud.lastName, phone: ud.phone, role: ud.role, otp }),
        });
        const data = await res.json() as { error?: string; accessToken?: string; user?: unknown };
        if (!res.ok) { setError(data.error ?? "Registration failed"); return; }
        login({ accessToken: data.accessToken!, user: data.user as Parameters<typeof login>[0]["user"] });
        setOtpVerified();
        setTimeout(() => onSuccess?.(), 2600);
      } catch { setError("Network error"); }
      finally   { setLoading(false); }
    },
    [state.email, state.userData, login, setOtpVerified, setLoading, setError, onSuccess]
  );

  const stepVariants = direction === "forward" ? stepForwardVariants : stepBackwardVariants;
  const showContent  = (phase === "content" || phase === "ambient") && !prefersReduced;
  const modalVisible = phase !== "idle" && phase !== "blast";

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050510]">

      {/* ── Canvas overlay (particles, rings) ── */}
      <BlastCanvas
        ref={canvasRef}
        className="fixed inset-0 z-50 w-full h-full"
      />

      {/* ── Vignette ── */}
      <motion.div
        className="fixed inset-0 z-40 pointer-events-none"
        animate={vignetteVisible
          ? { background: "radial-gradient(ellipse 60% 60% at 50% 50%, transparent 20%, rgba(5,5,16,0.75) 80%, rgba(5,5,16,0.95) 100%)" }
          : { background: "transparent" }
        }
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />

      {/* ── Chromatic aberration overlay ── */}
      <AnimatePresence>
        {chromatic && (
          <>
            <motion.div
              className="fixed inset-0 z-[41] pointer-events-none"
              style={{ mixBlendMode: "screen", background: "rgba(255,0,0,0.04)" }}
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: -3, opacity: 1 }}
              exit={{ x: 0, opacity: 0 }}
              transition={{ duration: 0.06 }}
            />
            <motion.div
              className="fixed inset-0 z-[41] pointer-events-none"
              style={{ mixBlendMode: "screen", background: "rgba(0,100,255,0.04)" }}
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: 3, opacity: 1 }}
              exit={{ x: 0, opacity: 0 }}
              transition={{ duration: 0.06 }}
            />
          </>
        )}
      </AnimatePresence>

      {/* ── Portal ── */}
      <AnimatePresence>
        {(phase === "portal") && !prefersReduced && (
          <motion.div
            className="fixed inset-0 z-[42] pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="rounded-3xl"
              style={{
                background: "conic-gradient(from 0deg, #6366F1, #8B5CF6, #06B6D4, #6366F1)",
                animation: "spin 0.5s linear infinite",
              }}
              initial={{ width: 4, height: 4, borderRadius: "50%" }}
              animate={{ width: 440, height: 580, borderRadius: 24 }}
              exit={{ width: 4, height: 4, borderRadius: "50%", opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Screen warp wrapper ── */}
      <motion.div
        className="w-full min-h-screen flex items-center justify-center"
        animate={warp && !prefersReduced
          ? { rotateX: [0, 2, 0], rotateY: [0, 1, 0], perspective: "800px" }
          : {}}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ willChange: "transform", transformStyle: "preserve-3d" }}
      >
        {/* ── Background ambient orbs ── */}
        {[
          { color: "#6366F1", x: "-20%", y: "-30%", delay: 0   },
          { color: "#8B5CF6", x:  "20%", y:  "30%", delay: 2.2 },
          { color: "#06B6D4", x:   "5%", y: "-10%", delay: 4   },
        ].map((orb, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none rounded-full"
            style={{
              background: `radial-gradient(circle, ${orb.color}30 0%, transparent 70%)`,
              width: 500,
              height: 500,
              left: "50%",
              top: "50%",
              translateX: "-50%",
              translateY: "-50%",
              x: orb.x,
              y: orb.y,
            }}
            animate={
              phase === "ambient" ? {
                scale: [1, 1.15, 1],
                x: [orb.x, `calc(${orb.x} + 20px)`, orb.x],
                opacity: [0.6, 0.85, 0.6],
              } : { opacity: phase === "idle" ? 0 : 0.6 }
            }
            transition={{
              duration: 5 + i * 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: orb.delay,
            }}
          />
        ))}

        {/* ── Modal card ── */}
        <AnimatePresence>
          {modalVisible && (
            <motion.div
              ref={modalRef}
              variants={prefersReduced
                ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
                : modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative z-[48] w-full max-w-md mx-4"
              style={{ willChange: "transform, filter" }}
            >
              {/* Rotating gradient border */}
              <div
                className="absolute inset-0 rounded-[26px] -z-10 overflow-hidden"
                style={{
                  padding: "1px",
                  boxShadow: borderGlowColor
                    ? `0 0 0 1.5px ${borderGlowColor}, 0 0 20px ${borderGlowColor}55`
                    : "none",
                  transition: "box-shadow 0.3s",
                }}
              >
                {/* Spinning conic gradient via CSS animation */}
                <div
                  className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2 border-spin"
                  style={{ borderRadius: "50%" }}
                />
              </div>

              {/* Scan-line effect (first 300ms only) */}
              {(phase === "modal") && !prefersReduced && (
                <div className="absolute inset-0 rounded-[24px] overflow-hidden pointer-events-none z-10">
                  <motion.div
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent"
                    initial={{ top: "-4px" }}
                    animate={{ top: "105%" }}
                    transition={{ duration: 0.4, ease: "linear" }}
                  />
                </div>
              )}

              {/* Card body */}
              <div
                className="relative rounded-[24px] overflow-hidden"
                style={{
                  background: "#0E0E1A",
                  border: "1px solid rgba(255,255,255,0.07)",
                  boxShadow: borderGlowColor
                    ? `0 0 0 1.5px ${borderGlowColor}, 0 20px 60px rgba(0,0,0,0.6)`
                    : "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
                  transition: "box-shadow 0.3s",
                }}
              >
                {/* Top bar */}
                <div className="flex items-center justify-between px-7 pt-6 pb-0">
                  <motion.div
                    animate={phase === "ambient" ? { y: [0, -4, 0] } : {}}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Link href="/" className="font-display font-bold text-lg text-snow tracking-tight">
                      Websevix
                    </Link>
                  </motion.div>
                  <Link href="/" className="text-xs text-slate hover:text-silver transition-colors px-3 py-1 rounded-lg hover:bg-white/[0.04]">
                    ← Home
                  </Link>
                </div>

                {/* Step content */}
                <div className="px-7 py-6">
                  <AnimatePresence mode="wait">
                    {state.step === "EMAIL" && (
                      <motion.div
                        key="email"
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                      >
                        <EmailStep
                          onSubmit={handleEmailSubmit}
                          isLoading={state.isLoading}
                          error={state.error}
                          showContent={showContent || phase === "modal"}
                        />
                      </motion.div>
                    )}

                    {state.step === "LOGIN_OTP" && (
                      <motion.div
                        key="login-otp"
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                      >
                        <LoginOTPStep
                          email={state.email}
                          onSubmit={handleLoginOtpSubmit}
                          onResend={() => sendOtp(state.email, "login")}
                          isLoading={state.isLoading}
                          error={state.error}
                          resendCooldown={secondsLeft}
                          canResend={canResend}
                          canvasRef={canvasRef}
                        />
                      </motion.div>
                    )}

                    {state.step === "SIGNUP_DETAILS" && (
                      <motion.div
                        key="signup-form"
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                      >
                        <SignupFormStep
                          email={state.email}
                          onSubmit={handleSignupFormSubmit}
                          onBack={() => { setDirection("backward"); reset(); }}
                          isLoading={state.isLoading}
                          error={state.error}
                        />
                      </motion.div>
                    )}

                    {state.step === "SIGNUP_OTP" && (
                      <motion.div
                        key="signup-otp"
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                      >
                        <SignupOTPStep
                          email={state.email}
                          onSubmit={handleSignupOtpSubmit}
                          onResend={() => sendOtp(state.email, "signup")}
                          isLoading={state.isLoading}
                          error={state.error}
                          resendCooldown={secondsLeft}
                          canResend={canResend}
                          canvasRef={canvasRef}
                        />
                      </motion.div>
                    )}

                    {state.step === "SUCCESS" && (
                      <motion.div key="success" variants={stepVariants} initial="enter" animate="center" exit="exit">
                        <SuccessStep
                          firstName={state.userData.firstName ?? state.firstName}
                          canvasRef={canvasRef}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                {(state.step === "EMAIL" || state.step === "SIGNUP_DETAILS") && (
                  <motion.div
                    className="px-7 pb-5 text-center text-xs text-slate"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: phase === "content" || phase === "ambient" ? 1 : 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    {state.step === "EMAIL" ? (
                      <>New to Websevix?{" "}
                        <Link href="/signup" className="text-indigo-400 hover:underline">Create account</Link>
                      </>
                    ) : (
                      <>Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => { setDirection("backward"); reset(); }}
                          className="text-indigo-400 hover:underline"
                        >
                          Sign in
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
