import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import tailwindAnimate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,mdx}",
    ".components/**/*.{js,ts,jsx,tsx,mdx}",
    ".app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      colors: {
        ...colors,
        "bg-color-dark": "#171C28",
        "bg-input": "#22305e",
        "body-color": {
          DEFAULT: "#788293",
          dark: "#959CB1",
        },
        "custom-border": "rgba(255, 255, 255, 0.12)",
      },
      backgroundImage: {
        "custom-gradient": "linear-gradient(83.07deg, #5200FF 6.18%, #2C86D9 97%)",
        "custom-gradient2": "linear-gradient(32deg, #392fd0 15.02%, rgb(45 167 255 / 21%) 48.97%)",
      },
    },
  },
  plugins: [tailwindAnimate],
};

export default config;
