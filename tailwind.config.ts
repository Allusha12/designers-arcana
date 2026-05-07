import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    // Mobile-first breakpoints matching design targets
    screens: {
      sm: "375px",   // iPhone 14 / small mobile
      md: "768px",   // iPad portrait
      lg: "1024px",  // iPad landscape / small desktop
      xl: "1280px",  // desktop
      "2xl": "1440px", // large desktop (design base is 1728px, content max 1440px)
    },
    extend: {
      colors: {
        // Sourced from Figma — Project page screens
        brand: {
          bg:      "#000000",          // page background
          surface: "#0a0507",          // card/container surface
          border:  "rgba(200,168,97,0.35)",
          "border-outer": "rgba(200,168,97,0.45)",
          "border-inner": "rgba(200,168,97,0.20)",
          glow:    "rgba(200,168,97,0.12)",
        },
        content: {
          primary:   "#f4eccb",        // landing subtitle, warm cream
          secondary: "#e5ddc8",        // meaning / advice body text
          muted:     "rgba(200,168,97,0.50)",
          "on-btn":  "#1f0d1a",        // text on gold button (dark maroon)
        },
        accent: {
          gold: "#c8a861",             // primary gold — logo, borders, labels
          star: "#e0b96a",             // constellation stars, ornaments
          "btn-border": "rgba(232,200,130,0.85)",
        },
      },
      fontFamily: {
        // Sourced from Figma — Cormorant Garamond + Open Sans
        display: ["'Cormorant Garamond'", "Georgia", "serif"],
        body:    ["'Open Sans'", "system-ui", "sans-serif"],
        mono:    ["'JetBrains Mono'", "'Fira Code'", "monospace"],
      },
      fontSize: {
        // Figma exact values
        "logo":     ["13px",  { letterSpacing: "0.40em", lineHeight: "1" }],
        "nav":      ["13px",  { letterSpacing: "0.40em", lineHeight: "1" }],
        "label":    ["22px",  { letterSpacing: "0.50em", lineHeight: "1" }],
        "body-card":["20px",  { letterSpacing: "0",      lineHeight: "1.55" }],
        "subtitle": ["22px",  { letterSpacing: "0",      lineHeight: "1.4" }],
        "btn":      ["18px",  { letterSpacing: "0.36em", lineHeight: "1" }],
        "hero-sm":  ["48px",  { letterSpacing: "0.01em", lineHeight: "1" }],
        "hero-md":  ["72px",  { letterSpacing: "0.01em", lineHeight: "1" }],
        "hero-xl":  ["128px", { letterSpacing: "0.01em", lineHeight: "1" }],
      },
      spacing: {
        // Card dimensions derived from Figma (219×347px → aspect ratio 0.631)
        "card-w": "var(--card-width)",
        "card-h": "var(--card-height)",
      },
      aspectRatio: {
        card: "219 / 347", // tarot card proportion from Figma
      },
      maxWidth: {
        content: "1440px",
      },
      animation: {
        "card-flip": "cardFlip 0.6s ease-in-out",
        "card-float": "cardFloat 3s ease-in-out infinite",
        "star-twinkle": "starTwinkle 2s ease-in-out infinite",
        "glow-pulse": "glowPulse 4s ease-in-out infinite",
      },
      keyframes: {
        cardFlip: {
          "0%": { transform: "rotateY(0deg)" },
          "50%": { transform: "rotateY(90deg)" },
          "100%": { transform: "rotateY(0deg)" },
        },
        cardFloat: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        starTwinkle: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
