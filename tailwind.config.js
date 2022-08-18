const colors = require("tailwindcss/colors");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        black: {
          ...colors.black,
        },
        gray: {
          ...colors.gray,
        },
        green: {
          ...colors.green,
          mediumspring: "#00FFA3",
        },
        blue: {
          ...colors.blue,
          midnightexpress: "#141A2F",
          tangaroa: "#1b2236",
          spindle: "#b5bddb",
          linkwater: "#c8cbd9",
          shipcove: "#8991ad",
          manatee: "#8888af",
          highlightbg: "#2d344a",
          highlightborder: "#8794b8",
          dusk: "#464B6F",
        },
        slateus: {
          800: "#131827",
          700: "#1B2236",
          600: "#2D344A",
          500: "#464B6F",
          450: "#8888af",
          400: "#8991AD",
          200: "#B5BDDB",
          100: "#C8CBD9",
        },
        red: {
          ...colors.red,
          pinkish: "#f85a89",
        },
        pink: {
          300: colors.pink["300"],
        },
        orange: {
          fire: "#F4900C",
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
    },
  },
  plugins: [],
};
