import type { Config } from "tailwindcss";

// Straddle design tokens: white and navy. Change a colour here and it changes everywhere.
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B1F3A",
        brand: "#1E3A8A",
        wash: "#F7FAFD",
        line: "#E4EAF2",
        line2: "#C9D5E4",
        mute: "#52637A",
        faint: "#8696AB",
        sky: "#7FA3D1",
        "sky-ink": "#3F6DA6",
        ai: "#5F7089",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        display: ['"Instrument Serif"', "Georgia", "Times New Roman", "serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "Menlo", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
