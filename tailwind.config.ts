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
          dark: "#0D0D0D",
          card: "#111118",
          border: "#1E1E2A",
          surface: "#08080F",
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
