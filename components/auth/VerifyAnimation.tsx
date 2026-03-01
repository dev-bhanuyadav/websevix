"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, type TargetAndTransition, type Transition } from "framer-motion";
import { createPortal } from "react-dom";
import { LogoMark } from "./LogoMark";
import { SparkBurst } from "./SparkBurst";

// ── Types ─────────────────────────────────────────────────────────────────────
type AnimPhase =
  | "IDLE"
  | "LOGO_BIRTH"
  | "LOGO_ASCENT"
  | "LOGO_SETTLE"
  | "LINE_DRAWING"
  | "LINE_COMPLETE"
  | "TICK_MORPH"
  | "CELEBRATE"
  | "EXIT"
  | "ERROR";

export interface ButtonOrigin {
  centerX: number;
  centerY: number;
  top: number;
  width: number;
  height: number;
}

interface VerifyAnimationProps {
  isActive: boolean;
  apiResult: "success" | "error" | null;
  origin: ButtonOrigin | null;
  errorMessage?: string | null;
  onComplete: () => void;
  onErrorDismiss: () => void;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const LOGO_SIZE  = 56;
const SVG_SIZE   = 100;   // ring SVG width/height
const GAP        = 20;    // px gap between logo bottom and button top
const RING_R     = 40;    // ring radius in SVG coordinate space

// ── Helper ────────────────────────────────────────────────────────────────────
function getPositions(origin: ButtonOrigin) {
  // Logo rests GAP px above button top
  const logoEndTop  = origin.top - GAP - LOGO_SIZE;
  const logoStartTop = origin.centerY - LOGO_SIZE / 2;
  const logoLeft    = origin.centerX - LOGO_SIZE / 2;

  // SVG: center over logo
  const logoCenterY = logoEndTop + LOGO_SIZE / 2;
  const svgTop  = logoCenterY - SVG_SIZE / 2;
  const svgLeft = origin.centerX - SVG_SIZE / 2;

  // Spark position: 12 o'clock of ring (top of circle)
  const sparkX = origin.centerX;
  const sparkY = logoCenterY - RING_R;   // 12 o'clock

  return { logoEndTop, logoStartTop, logoLeft, svgTop, svgLeft, sparkX, sparkY };
}

// ── Component ─────────────────────────────────────────────────────────────────
export function VerifyAnimation({
  isActive,
  apiResult,
  origin,
  errorMessage,
  onComplete,
  onErrorDismiss,
}: VerifyAnimationProps) {
  const [phase, setPhase]           = useState<AnimPhase>("IDLE");
  const [mounted, setMounted]       = useState(false);
  const [sparkTrigger, setSparkTrigger] = useState(0);
  const [sparkPos, setSparkPos]     = useState({ x: 0, y: 0 });

  const phaseRef    = useRef<AnimPhase>("IDLE");
  const apiRef      = useRef<"success" | "error" | null>(null);
  const timers      = useRef<ReturnType<typeof setTimeout>[]>([]);
  const pollRef     = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { apiRef.current = apiResult; }, [apiResult]);

  // ── Utilities ─────────────────────────────────────────────────────────────
  const clearAll = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  }, []);

  const go = useCallback((p: AnimPhase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  const after = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
  }, []);

  // ── Success chain ─────────────────────────────────────────────────────────
  const runSuccess = useCallback(() => {
    go("LINE_COMPLETE");
    // Spark at 12 o'clock when line completes
    if (origin) {
      const { sparkX, sparkY } = getPositions(origin);
      setSparkPos({ x: sparkX, y: sparkY });
      setSparkTrigger(n => n + 1);
    }
    after(() => go("TICK_MORPH"),  180);
    after(() => go("CELEBRATE"),   600);
    after(() => go("EXIT"),       1050);
    after(() => onComplete(),     1500);
  }, [go, after, origin, onComplete]);

  // ── Main sequence ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isActive) {
      clearAll();
      go("IDLE");
      return;
    }

    clearAll();
    go("LOGO_BIRTH");
    after(() => go("LOGO_ASCENT"),  350);
    after(() => go("LOGO_SETTLE"), 1150);
    after(() => go("LINE_DRAWING"),1350);

    // At 2350ms: check API result or wait
    after(() => {
      const r = apiRef.current;
      if      (r === "success") runSuccess();
      else if (r === "error")   go("ERROR");
      else {
        pollRef.current = setInterval(() => {
          const r2 = apiRef.current;
          if (r2 === "success") {
            if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
            runSuccess();
          } else if (r2 === "error") {
            if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
            go("ERROR");
          }
        }, 80);
      }
    }, 2350);

    return clearAll;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  // If API errors while still in LINE_DRAWING (before 2350ms check)
  useEffect(() => {
    if (apiResult === "error" && phaseRef.current === "LINE_DRAWING") {
      clearAll();
      go("ERROR");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiResult]);

  if (!mounted || !isActive || !origin || phase === "IDLE") return null;

  const { logoEndTop, logoStartTop, logoLeft, svgTop, svgLeft } = getPositions(origin);

  // ── Logo animate values ───────────────────────────────────────────────────
  const logoAnimate: TargetAndTransition = (() => {
    switch (phase) {
      case "LOGO_BIRTH":
        return { top: logoStartTop, scale: 0.12, rotateX: 170, opacity: 0.5 };
      case "LOGO_ASCENT":
        return { top: logoEndTop, scale: 1, rotateX: 0, opacity: 1,
          filter: "drop-shadow(0 0 18px rgba(99,102,241,0.9))" };
      case "LOGO_SETTLE":
        return { top: logoEndTop, scale: [1, 1.14, 1], rotateX: 0, opacity: 1,
          filter: ["drop-shadow(0 0 18px rgba(99,102,241,0.8))","drop-shadow(0 0 32px rgba(99,102,241,1.0))","drop-shadow(0 0 18px rgba(99,102,241,0.8))"] };
      case "LINE_DRAWING":
      case "LINE_COMPLETE":
        return { top: logoEndTop, scale: 1, rotateX: 0, opacity: 1,
          filter: "drop-shadow(0 0 16px rgba(99,102,241,0.7))" };
      case "TICK_MORPH":
        return { top: logoEndTop, scale: 1, rotateX: 0, opacity: 1,
          filter: "drop-shadow(0 0 12px rgba(99,102,241,0.5))" };
      case "CELEBRATE":
        return { top: logoEndTop, scale: [1, 1.1, 1], rotateX: 0, opacity: 1,
          filter: ["drop-shadow(0 0 14px rgba(99,102,241,0.8))","drop-shadow(0 0 22px rgba(16,185,129,0.9))","drop-shadow(0 0 14px rgba(99,102,241,0.7))"] };
      case "EXIT":
        return { top: logoEndTop - 200, scale: 0.3, rotateX: 0, opacity: 0,
          filter: "drop-shadow(0 0 4px rgba(99,102,241,0.3))" };
      case "ERROR":
        return { top: logoStartTop, scale: 0.1, rotateX: 180, opacity: 0,
          filter: "drop-shadow(0 0 10px rgba(239,68,68,0.5))" };
      default:
        return { top: logoStartTop, scale: 0.1, rotateX: 180, opacity: 0 };
    }
  })();

  const logoTransition: Transition = (() => {
    switch (phase) {
      case "LOGO_ASCENT":  return { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] as number[] };
      case "LOGO_SETTLE":  return { duration: 0.3, ease: "easeOut" };
      case "CELEBRATE":    return { duration: 0.4 };
      case "EXIT":         return { duration: 0.4, ease: "easeIn" };
      case "ERROR":        return { duration: 0.55, ease: "easeIn" };
      default:             return { duration: 0.18 };
    }
  })();

  const inSuccessFlow    = ["LINE_COMPLETE","TICK_MORPH","CELEBRATE","EXIT"].includes(phase);
  const showRing         = ["LINE_DRAWING","LINE_COMPLETE"].includes(phase);
  const showTick         = phase === "TICK_MORPH" || phase === "CELEBRATE";
  const showSvg          = ["LINE_DRAWING","LINE_COMPLETE","TICK_MORPH","CELEBRATE","EXIT"].includes(phase);
  const showButtonGlow   = ["LOGO_ASCENT","LOGO_SETTLE","LINE_DRAWING"].includes(phase);
  const logoColor        = phase === "CELEBRATE" ? "#10B981" : phase === "ERROR" ? "#EF4444" : "white";

  return createPortal(
    <>
      {/* ── Spark canvas ─────────────────────────────────────────────────── */}
      <SparkBurst x={sparkPos.x} y={sparkPos.y} trigger={sparkTrigger} />

      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9998 }}>

        {/* ── Cinematic backdrop ─────────────────────────────────────────── */}
        <motion.div
          className="absolute inset-0"
          style={{ background: "rgba(5,5,16,0.82)", backdropFilter: "blur(4px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "EXIT" ? 0 : 0.9 }}
          transition={{ duration: phase === "EXIT" ? 0.5 : 0.35 }}
        />

        {/* ── Rising logo ────────────────────────────────────────────────── */}
        <motion.div
          style={{ position: "absolute", left: logoLeft, width: LOGO_SIZE, height: LOGO_SIZE,
            display: "flex", alignItems: "center", justifyContent: "center" }}
          animate={logoAnimate}
          transition={logoTransition}
        >
          <LogoMark size={LOGO_SIZE - 8} color={logoColor} />
        </motion.div>

        {/* ── Light streak during ascent ─────────────────────────────────── */}
        <AnimatePresence>
          {phase === "LOGO_ASCENT" && (
            <motion.div
              style={{
                position: "absolute",
                left: origin.centerX - 0.5,
                top: logoEndTop + LOGO_SIZE,
                width: 1,
                transformOrigin: "top",
                background: "linear-gradient(to bottom, rgba(99,102,241,0.6), transparent)",
              }}
              initial={{ height: 0, opacity: 0.9 }}
              animate={{ height: GAP + LOGO_SIZE + origin.height / 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>

        {/* ── SVG: ring + checkmark ──────────────────────────────────────── */}
        <AnimatePresence>
          {showSvg && (
            <motion.svg
              width={SVG_SIZE} height={SVG_SIZE}
              viewBox="0 0 100 100"
              overflow="visible"
              style={{ position: "absolute", left: svgLeft, top: svgTop }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: phase === "EXIT" ? -200 : 0 }}
              exit={{ opacity: 0, y: -200 }}
              transition={phase === "EXIT" ? { duration: 0.4, ease: "easeIn" } : { duration: 0.12 }}
            >
              <defs>
                <filter id="va-glow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <filter id="va-glow-strong" x="-70%" y="-70%" width="240%" height="240%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>

              {/* Progress ring — draws from 12 o'clock clockwise */}
              <motion.circle
                cx="50" cy="50" r={RING_R}
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                filter="url(#va-glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={
                  showRing            ? { pathLength: 1, opacity: 1 } :
                  inSuccessFlow       ? { pathLength: 1, opacity: 0 } :
                                        { pathLength: 0, opacity: 0 }
                }
                transition={
                  phase === "LINE_DRAWING" ? { pathLength: { duration: 1, ease: "linear" }, opacity: { duration: 0.12 } } :
                  phase === "LINE_COMPLETE" ? { duration: 0 } :
                  { duration: 0.25 }
                }
              />

              {/* Leading glow dot on ring tip */}
              {phase === "LINE_DRAWING" && (
                <motion.circle
                  cx="50" cy="10"   /* 12 o'clock, will be animated via transform */
                  r="4"
                  fill="#10B981"
                  filter="url(#va-glow-strong)"
                  opacity="0.9"
                  style={{ originX: "50px", originY: "50px" }}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 1, ease: "linear" }}
                />
              )}

              {/* Checkmark group — scales on celebrate */}
              <AnimatePresence>
                {showTick && (
                  <motion.g
                    key="tick"
                    style={{ originX: "50px", originY: "50px" }}
                    animate={phase === "CELEBRATE" ? { scale: [1, 1.28, 1] } : { scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.path
                      d="M 24,52 L 42,67 L 76,33"
                      fill="none"
                      stroke={phase === "CELEBRATE" ? "#ffffff" : "#10B981"}
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter={phase === "CELEBRATE" ? "url(#va-glow-strong)" : "url(#va-glow)"}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      exit={{ pathLength: 0, opacity: 0, transition: { duration: 0.2 } }}
                      transition={{ pathLength: { duration: 0.38, ease: [0.34, 1.56, 0.64, 1] }, opacity: { duration: 0.04 } }}
                    />
                  </motion.g>
                )}
              </AnimatePresence>

              {/* Celebration ripple ring */}
              {phase === "CELEBRATE" && (
                <motion.circle
                  cx="50" cy="50" r="44"
                  fill="none"
                  stroke="rgba(16,185,129,0.4)"
                  strokeWidth="1.5"
                  style={{ originX: "50px", originY: "50px" }}
                  initial={{ scale: 1, opacity: 0.7 }}
                  animate={{ scale: 2.4, opacity: 0 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                />
              )}
            </motion.svg>
          )}
        </AnimatePresence>

        {/* ── Button pulse border during loading ────────────────────────── */}
        {showButtonGlow && (
          <motion.div
            style={{
              position: "absolute",
              left: origin.centerX - origin.width / 2 - 5,
              top: origin.top - 5,
              width: origin.width + 10,
              height: origin.height + 10,
              borderRadius: 16,
              border: "1.5px solid rgba(99,102,241,0.5)",
              pointerEvents: "none",
            }}
            animate={{
              borderColor: ["rgba(99,102,241,0.15)","rgba(99,102,241,0.65)","rgba(99,102,241,0.15)"],
              boxShadow:   ["0 0 0px rgba(99,102,241,0)","0 0 22px rgba(99,102,241,0.3)","0 0 0px rgba(99,102,241,0)"],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {/* ── Green "Verified!" button overlay on CELEBRATE ─────────────── */}
        {phase === "CELEBRATE" && (
          <motion.div
            style={{
              position: "absolute",
              left:   origin.centerX - origin.width / 2,
              top:    origin.top,
              width:  origin.width,
              height: origin.height,
              borderRadius: 12,
              background: "linear-gradient(135deg,#059669,#10B981)",
              boxShadow: "0 0 32px rgba(16,185,129,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
          >
            <motion.span
              className="text-white font-semibold text-sm tracking-wide"
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
            >
              ✓ &nbsp;Verified!
            </motion.span>
          </motion.div>
        )}

        {/* ── Error toast ────────────────────────────────────────────────── */}
        <AnimatePresence>
          {phase === "ERROR" && (
            <motion.div
              style={{
                position: "absolute",
                left: origin.centerX - 150,
                top: origin.top + origin.height + 14,
                width: 300,
                pointerEvents: "all",
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="bg-red-500/10 border border-red-500/25 rounded-2xl px-5 py-4 text-center">
                <p className="text-red-400 text-sm mb-2">
                  {errorMessage || "Something went wrong. Please try again."}
                </p>
                <button
                  onClick={onErrorDismiss}
                  className="text-xs text-red-400/70 hover:text-red-300 transition-colors underline-offset-2 hover:underline"
                >
                  ← Try again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </>,
    document.body
  );
}
