import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#04040F",
          surface: "#0C0C1D",
          card: "#101025",
          elevated: "#14142E",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.07)",
          hover: "rgba(255,255,255,0.15)",
          glow: "rgba(124,58,237,0.5)",
        },
        violet: {
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
        },
        cyan: {
          400: "#22D3EE",
          500: "#06B6D4",
        },
        rose: {
          500: "#F43F5E",
        },
        ink: {
          white: "#F8FAFC",
          soft: "#CBD5E1",
          muted: "#64748B",
          faint: "#334155",
        },
        success: "#10B981",
        warning: "#F59E0B",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        display: ["var(--font-syne)", "Syne", "sans-serif"],
        mono: ["var(--font-fira)", "Fira Code", "monospace"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        "violet-glow":
          "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(124,58,237,0.25), transparent 70%)",
        "hero-gradient":
          "radial-gradient(ellipse 100% 70% at 50% -20%, rgba(124,58,237,0.2), transparent 60%), radial-gradient(ellipse 60% 40% at 90% 60%, rgba(6,182,212,0.12), transparent 50%), radial-gradient(ellipse 50% 40% at 10% 80%, rgba(124,58,237,0.08), transparent 50%)",
        "card-shine":
          "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)",
        "cta-aurora":
          "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(124,58,237,0.3), transparent 70%)",
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "pulse-ring": "pulseRing 2s ease-in-out infinite",
        "gradient-move": "gradientMove 6s ease infinite",
        "border-glow": "borderGlow 3s ease-in-out infinite",
        "fade-up": "fadeUp 0.6s ease forwards",
        "spin-slow": "spin 10s linear infinite",
        aurora: "aurora 10s ease-in-out infinite",
        "slide-in-left": "slideInLeft 0.6s ease forwards",
        "slide-in-right": "slideInRight 0.6s ease forwards",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseRing: {
          "0%,100%": { transform: "scale(1)", opacity: "0.6" },
          "50%": { transform: "scale(1.08)", opacity: "1" },
        },
        gradientMove: {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        borderGlow: {
          "0%,100%": { borderColor: "rgba(124,58,237,0.3)" },
          "50%": { borderColor: "rgba(124,58,237,0.8)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        aurora: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(40px,-30px) scale(1.1)" },
          "66%": { transform: "translate(-30px,20px) scale(0.92)" },
        },
        slideInLeft: {
          from: { opacity: "0", transform: "translateX(-40px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(40px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      boxShadow: {
        "glow-sm": "0 0 20px rgba(124,58,237,0.25)",
        "glow-md": "0 0 40px rgba(124,58,237,0.3)",
        "glow-lg": "0 0 80px rgba(124,58,237,0.2)",
        "glow-cyan": "0 0 30px rgba(6,182,212,0.25)",
        card: "0 4px 24px rgba(0,0,0,0.4)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.5), 0 0 30px rgba(124,58,237,0.15)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
