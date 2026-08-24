import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          black: "#050505",
          white: "#FFFFFF",
          gray: "#A1A1AA",
        },
        purple: {
          deep: "#6D28D9",
          DEFAULT: "#7C3AED",
          light: "#A855F7",
        },
        // The "portal" palette — used by the newer content sections
        // (Services, Projects, Clients, Contact, etc.) to match the
        // violet/white hero portal exactly (#c9a8f5 / #7b6aa8 are the
        // same colors as the HeroGate shader).
        portal: {
          bg: "#0d0a1e",
          card: "#1c1450",
          border: "#7b6aa8",
          accent: "#c9a8f5",
        },
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        arabic: ["var(--font-cairo)", "sans-serif"],
      },
      backgroundImage: {
        "aurora-gradient":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.35), transparent 60%)",
        "glow-radial":
          "radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)",
        "grid-mesh":
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        "float-slower": "float 12s ease-in-out infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
        "ken-burns": "kenBurns 24s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        kenBurns: {
          "0%": { transform: "scale(1.08) translate(0%, 0%)" },
          "50%": { transform: "scale(1.16) translate(-1.5%, -1%)" },
          "100%": { transform: "scale(1.08) translate(1%, 1%)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
