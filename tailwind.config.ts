import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#050510",
        surface: "#0A0A1E",
        elevated: "#0F0F28",
        card: "#13132A",
        "border-dim": "rgba(255,255,255,0.06)",
        "border-soft": "rgba(255,255,255,0.12)",
        indigo: {
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
        },
        violet: { 400: "#A78BFA", 500: "#8B5CF6" },
        cyan: { 400: "#22D3EE", 500: "#06B6D4" },
        rose: { 500: "#F43F5E" },
        snow: "#F8FAFC",
        silver: "#CBD5E1",
        slate: "#64748B",
        dim: "#334155",
        emerald: { 400: "#34D399", 500: "#10B981" },
        amber: { 400: "#FBBF24" },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-syne)", "Syne", "sans-serif"],
      },
      backgroundImage: {
        "radial-glow":
          "radial-gradient(ellipse 80% 50% at 50% -5%, rgba(99,102,241,0.22), transparent 65%)",
        "grid-lines":
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        "card-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 60%)",
        "shine-gradient":
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        "marquee-x": "marqueeX 28s linear infinite",
        shimmer: "shimmer 2s linear infinite",
        "fade-up": "fadeUp 0.55s ease forwards",
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
        "border-spin": "borderSpin 4s linear infinite",
        aurora: "aurora 12s ease-in-out infinite",
        "scale-in": "scaleIn 0.4s var(--ease-spring) forwards",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-16px)" },
        },
        marqueeX: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(28px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulseDot: {
          "0%,100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.3)" },
        },
        borderSpin: {
          "0%": { "--angle": "0deg" } as Record<string, string>,
          "100%": { "--angle": "360deg" } as Record<string, string>,
        },
        aurora: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(50px,-40px) scale(1.12)" },
          "66%": { transform: "translate(-35px,30px) scale(0.9)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      boxShadow: {
        "glow-indigo": "0 0 40px rgba(99,102,241,0.25)",
        "glow-violet": "0 0 40px rgba(139,92,246,0.25)",
        "glow-sm": "0 0 20px rgba(99,102,241,0.2)",
        float: "0 20px 60px rgba(0,0,0,0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
