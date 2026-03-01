"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useAuthFlow, type RegisterData } from "@/hooks/useAuthFlow";
import { useBlast, type BlastPhase } from "@/hooks/useBlast";
import { useAuth } from "@/hooks/useAuth";
import { BlastCanvas, type BlastCanvasHandle } from "./BlastCanvas";
import { EmailStep }           from "./EmailStep";
import { LoginPasswordStep }   from "./LoginPasswordStep";
import { SignupFormStep }       from "./SignupFormStep";
import { SuccessStep }          from "./SuccessStep";
import { VerifyAnimation, type ButtonOrigin } from "./VerifyAnimation";
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
    state, setEmail, setUserExists, setUserNew,
    setAuthSuccess, setError, setLoading, reset,
  } = useAuthFlow(defaultMode);

  const canvasRef         = useRef<BlastCanvasHandle>(null);
  const modalRef          = useRef<HTMLDivElement>(null);
  const microParticleRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingAuthRef    = useRef<{ accessToken: string; user: unknown } | null>(null);

  const [vignetteVisible, setVignetteVisible]   = useState(false);
  const [chromatic, setChromatic]               = useState(false);
  const [warp, setWarp]                         = useState(false);
  const [direction, setDirection]               = useState<"forward" | "backward">("forward");
  const [borderGlowColor, setBorderGlowColor]   = useState<string | null>(null);
  const [verifyAnim, setVerifyAnim]             = useState<{
    active: boolean;
    apiResult: "success" | "error" | null;
    origin: ButtonOrigin | null;
    errorMsg: string | null;
  }>({ active: false, apiResult: null, origin: null, errorMsg: null });

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
      // Micro particles — slow interval to avoid jank
      microParticleRef.current = setInterval(() => {
        if (!modalRef.current) return;
        const rect = modalRef.current.getBoundingClientRect();
        const mx = rect.left + Math.random() * rect.width;
        const my = rect.bottom - 4;
        canvasRef.current?.microParticle(mx, my);
      }, 2000);
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

  // ── Auth handlers ─────────────────────────────────────────────────────────────
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
          setUserExists(data.firstName);       // → LOGIN_PASSWORD step
        } else {
          setUserNew();                         // → SIGNUP_DETAILS step
        }
      } catch { setError("Network error. Please try again."); }
      finally   { setLoading(false); }
    },
    [setEmail, setLoading, setError, setUserExists, setUserNew]
  );

  const handleLoginPasswordSubmit = useCallback(
    async (password: string, origin: ButtonOrigin) => {
      setLoading(true);
      setError(null);
      pendingAuthRef.current = null;
      setVerifyAnim({ active: true, apiResult: null, origin, errorMsg: null });
      try {
        const res  = await fetch(`${API}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: state.email, password }),
        });
        const data = await res.json() as { error?: string; accessToken?: string; user?: unknown };
        if (!res.ok) {
          setVerifyAnim(s => ({ ...s, apiResult: "error", errorMsg: data.error ?? "Invalid email or password" }));
          return;
        }
        pendingAuthRef.current = { accessToken: data.accessToken!, user: data.user };
        setVerifyAnim(s => ({ ...s, apiResult: "success" }));
      } catch {
        setVerifyAnim(s => ({ ...s, apiResult: "error", errorMsg: "Network error. Please try again." }));
      } finally { setLoading(false); }
    },
    [state.email, setLoading, setError]
  );

  const handleSignupFormSubmit = useCallback(
    async (data: RegisterData, origin: ButtonOrigin) => {
      setDirection("forward");
      setLoading(true);
      setError(null);
      pendingAuthRef.current = null;
      setVerifyAnim({ active: true, apiResult: null, origin, errorMsg: null });
      try {
        const res  = await fetch(`${API}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: state.email, firstName: data.firstName, lastName: data.lastName, phone: data.phone, password: data.password, role: "client" }),
        });
        const resData = await res.json() as { error?: string; accessToken?: string; user?: unknown };
        if (!res.ok) {
          setVerifyAnim(s => ({ ...s, apiResult: "error", errorMsg: resData.error ?? "Registration failed" }));
          return;
        }
        pendingAuthRef.current = { accessToken: resData.accessToken!, user: resData.user };
        setVerifyAnim(s => ({ ...s, apiResult: "success" }));
      } catch {
        setVerifyAnim(s => ({ ...s, apiResult: "error", errorMsg: "Network error. Please try again." }));
      } finally { setLoading(false); }
    },
    [state.email, setLoading, setError]
  );

  const handleVerifyComplete = useCallback(() => {
    if (pendingAuthRef.current) {
      login({ accessToken: pendingAuthRef.current.accessToken as string, user: pendingAuthRef.current.user as Parameters<typeof login>[0]["user"] });
    }
    setVerifyAnim({ active: false, apiResult: null, origin: null, errorMsg: null });
    onSuccess?.();
  }, [login, onSuccess]);

  const handleVerifyErrorDismiss = useCallback(() => {
    setVerifyAnim({ active: false, apiResult: null, origin: null, errorMsg: null });
    setLoading(false);
    setError(null);
  }, [setLoading, setError]);

  const stepVariants = direction === "forward" ? stepForwardVariants : stepBackwardVariants;
  const showContent  = (phase === "content" || phase === "ambient") && !prefersReduced;
  const modalVisible = phase !== "idle" && phase !== "blast";

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050510]">

      {/* ── Cinematic verify animation ── */}
      <VerifyAnimation
        isActive={verifyAnim.active}
        apiResult={verifyAnim.apiResult}
        origin={verifyAnim.origin}
        errorMessage={verifyAnim.errorMsg}
        onComplete={handleVerifyComplete}
        onErrorDismiss={handleVerifyErrorDismiss}
      />

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

      {/* ── Portal — simple scale from point, GPU-only transform ── */}
      <AnimatePresence>
        {(phase === "portal") && !prefersReduced && (
          <motion.div
            className="fixed inset-0 z-[42] pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              className="rounded-3xl"
              style={{
                background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%)",
                width: 440, height: 560,
              }}
              initial={{ scale: 0, borderRadius: "50%" }}
              animate={{ scale: 1, borderRadius: 24 }}
              exit={{ scale: 0, borderRadius: "50%", opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Content wrapper ── */}
      <div className="w-full min-h-screen flex items-center justify-center" style={{ perspective: "1000px" }}>
        {/* ── Background ambient orbs — CSS animation only, no Framer Motion repaints ── */}
        {phase !== "idle" && [
          { color: "#6366F1", left: "20%", top: "15%",  animDur: "7s",  animDelay: "0s"   },
          { color: "#8B5CF6", left: "65%", top: "60%",  animDur: "9s",  animDelay: "2.5s" },
          { color: "#06B6D4", left: "45%", top: "40%",  animDur: "11s", animDelay: "5s"   },
        ].map((orb, i) => (
          <div
            key={i}
            className="absolute pointer-events-none rounded-full"
            style={{
              background: `radial-gradient(circle, ${orb.color}28 0%, transparent 70%)`,
              width: 480,
              height: 480,
              left: orb.left,
              top: orb.top,
              transform: "translate(-50%,-50%)",
              animation: `auroraSlow ${orb.animDur} ease-in-out infinite`,
              animationDelay: orb.animDelay,
              willChange: "transform",
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

                    {state.step === "LOGIN_PASSWORD" && (
                      <motion.div
                        key="login-password"
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                      >
                        <LoginPasswordStep
                          email={state.email}
                          firstName={state.firstName}
                          onSubmit={handleLoginPasswordSubmit}
                          onBack={() => { setDirection("backward"); reset(); }}
                          isLoading={state.isLoading}
                          error={state.error}
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

                    {state.step === "SUCCESS" && (
                      <motion.div key="success" variants={stepVariants} initial="enter" animate="center" exit="exit">
                        <SuccessStep
                          firstName={(state.userData.firstName ?? state.firstName) || ""}
                          canvasRef={canvasRef}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                {(state.step === "EMAIL" || state.step === "LOGIN_PASSWORD" || state.step === "SIGNUP_DETAILS") && (
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
      </div>
    </div>
  );
}
