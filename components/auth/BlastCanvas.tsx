"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { ParticleEngine } from "@/lib/ParticleEngine";

export interface BlastCanvasHandle {
  explode: (x: number, y: number) => void;
  rings: (x: number, y: number) => void;
  implosion: (x: number, y: number) => void;
  confetti: (x: number, y: number) => void;
  microParticle: (x: number, y: number) => void;
  errorBurst: (x: number, y: number) => void;
}

interface BlastCanvasProps {
  className?: string;
}

export const BlastCanvas = forwardRef<BlastCanvasHandle, BlastCanvasProps>(
  ({ className = "" }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<ParticleEngine | null>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const engine = new ParticleEngine(canvas);
      engineRef.current = engine;

      const handleResize = () => engine.resize();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        engine.destroy();
      };
    }, []);

    useImperativeHandle(ref, () => ({
      explode: (x, y) => engineRef.current?.explode(x, y),
      rings: (x, y) => {
        const e = engineRef.current;
        if (!e) return;
        e.addRing(x, y, { color: "rgba(99,102,241,0.9)",  speed: 900,  maxRadius: 1600 });
        setTimeout(() => e.addRing(x, y, { color: "rgba(139,92,246,0.7)", speed: 750,  maxRadius: 1400 }), 40);
        setTimeout(() => e.addRing(x, y, { color: "rgba(6,182,212,0.6)",  speed: 600,  maxRadius: 1200 }), 120);
        setTimeout(() => e.addRing(x, y, { color: "rgba(167,139,250,0.5)", speed: 500, maxRadius: 1000 }), 240);
      },
      implosion:   (x, y) => engineRef.current?.addImplosion(x, y),
      confetti:    (x, y) => engineRef.current?.confetti(x, y),
      microParticle: (x, y) => engineRef.current?.microParticle(x, y),
      errorBurst:  (x, y) => engineRef.current?.errorBurst(x, y),
    }));

    return (
      <canvas
        ref={canvasRef}
        className={`pointer-events-none ${className}`}
        style={{ willChange: "transform" }}
      />
    );
  }
);

BlastCanvas.displayName = "BlastCanvas";
