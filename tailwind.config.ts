import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        oliv: {
          // Primary - Victory Red
          red: "#bd001b",
          "red-vivid": "#e61d2b",
          "red-dark": "#930012",
          // Secondary - Union Blue
          navy: "#3557bc",
          "navy-dark": "#002a82",
          "navy-light": "#7796fe",
          // Tertiary - Court Navy
          tertiary: "#485b90",
          // Surfaces (light mode)
          bg: "#f8f9fa",
          surface: "#ffffff",
          "surface-low": "#f3f4f5",
          "surface-mid": "#edeeef",
          "surface-high": "#e7e8e9",
          // Text
          text: "#191c1d",
          "text-muted": "#5d3f3d",
          // Borders
          border: "#e7bdb9",
          outline: "#926e6b",
        },
      },
      fontFamily: {
        display: ['"Lexend"', "sans-serif"],
        sans: ['"Inter"', "sans-serif"],
      },
      borderRadius: {
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};
export default config;
