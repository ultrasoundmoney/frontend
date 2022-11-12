const colors = require("tailwindcss/colors");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        blue: {
          ...colors.blue,
          midnightexpress: "#141a2f",
          spindle: "#b5bddb",
          shipcove: "#8991ad",
          manatee: "#8888af",
          highlightbg: "#2d344a",
          highlightborder: "#8794b8",
          dusk: "#464b6f",
        },
        drop: "#5dadec",
        fire: "#f4900c",
        mediumspring: "#00ffa3",
        slateus: {
          800: "#131827",
          700: "#1b2236",
          600: "#2d344a",
          500: "#464b6f",
          450: "#8888af",
          400: "#8991ad",
          200: "#b5bddb",
          100: "#c8cbd9",
        },
      },
      width: {
        "w-34": "34%",
        "w-32": "30%",
        "w-55": "55%",
      },
      lineHeight: {
        2: "2",
        card: "3.3",
        18: "1.18",
        loose1: "2.95",
      },
      fontFamily: {
        roboto: ["Roboto Mono", "monospace"],
        inter: ["Inter", "sans-serif"],
      },
      fontSize: {
        "2xs": "0.65rem",
        "41xl": "2.5rem",
        "21xl": "1.87rem",
        "32xl": "2rem",
        "28xl": "1.75rem",
      },
      animation: {
        "fade-in": "fade-in 1s ease-in 0s",
        "slow-pulse": "pulse 4s ease-in-out infinite",
      },
      keyframes: {
        "fade-in": {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 100,
          },
        },
      },
    },
  },
  plugins: [],
};
