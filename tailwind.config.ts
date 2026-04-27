import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        oliv: {
          red: "#C8102E",
          "red-dark": "#a00d24",
          navy: "#1C3A6B",
          "navy-light": "#2a5199",
          // New NBA-style grey palette
          dark: "#141416",       // main background
          darker: "#0F0F11",     // deeper sections
          card: "#1C1C20",       // card background
          surface: "#222228",    // slightly lighter surface
          hover: "#2A2A30",      // hover state
          border: "#2E2E36",     // borders
          muted: "#3A3A44",      // muted elements
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', "sans-serif"],
        sans: ['"DM Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
