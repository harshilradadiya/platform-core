import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#09090B",
        surface: {
          DEFAULT: "#111113",
          alt: "#18181B",
        },
        border: {
          DEFAULT: "#27272A",
          strong: "#3F3F46",
        },
        primary: {
          DEFAULT: "#EF4444",
          hover: "#DC2626",
          soft: "rgba(239, 68, 68, 0.1)",
        },
        text: {
          primary: "#FAFAFA",
          secondary: "#A1A1AA",
          muted: "#71717A",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "Geist", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      maxWidth: {
        content: "1120px",
        hero: "900px",
        reading: "720px",
      },
      transitionTimingFunction: {
        "fast-ui": "cubic-bezier(0.22, 1, 0.36, 1)",
        "smooth-surface": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      boxShadow: {
        subtle: "0 4px 20px rgba(0, 0, 0, 0.35)",
        card: "0 1px 3px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.24)",
        glow: "0 0 25px -5px rgba(239, 68, 68, 0.25)",
      },
      borderRadius: {
        input: "12px",
        card: "16px",
        badge: "6px",
        control: "8px",
      },
    },
  },
  plugins: [],
};

export default config;
