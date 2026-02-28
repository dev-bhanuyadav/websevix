import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0F",
        surface: "#111118",
        border: "#1E1E2E",
        primary: "#6366F1",
        "primary-glow": "rgba(99, 102, 241, 0.3)",
        secondary: "#8B5CF6",
        accent: "#06B6D4",
        "text-primary": "#F8FAFC",
        "text-muted": "#94A3B8",
        success: "#10B981",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        display: ["var(--font-syne)", "Syne", "sans-serif"],
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        aurora: "aurora 8s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        "gradient-shift": "gradientShift 4s ease infinite",
        "rotate-glow": "rotateGlow 4s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        aurora: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -30px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        rotateGlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "mesh-gradient":
          "radial-gradient(at 40% 20%, rgba(99, 102, 241, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(139, 92, 246, 0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(6, 182, 212, 0.08) 0px, transparent 50%)",
      },
      boxShadow: {
        glow: "0 0 30px rgba(99, 102, 241, 0.3)",
        "glow-lg": "0 0 60px rgba(99, 102, 241, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
