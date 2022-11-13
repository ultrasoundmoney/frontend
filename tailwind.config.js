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
        "flash-orange": "to-orange-400 0.5s",
        "flash-blue": "to-blue-400 0.5s",
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
        "to-orange-400": {
          "0%": {
            color: "white",
          },
          "50%": {
            color: "#fb923c",
          },
          "100%": {
            color: "white",
          },
        },
        "to-blue-400": {
          "0%": {
            color: "white",
          },
          "50%": {
            color: "#60a5fa",
          },
          "100%": {
            color: "white",
          },
        },
      },
    },
  },
  plugins: [],
};
