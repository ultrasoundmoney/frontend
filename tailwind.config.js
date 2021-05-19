const { colors } = require('tailwindcss/defaultTheme')
module.exports = {
  purge: false,
  // purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          ...colors.gray,
          ddd: '#ddd',
          333: '#333333',
          666: '#666666',
          lilywhite: '#E8EEE9',
        },
        green:{
          ...colors.green,
          150: '#9AC3A7',
          sea: '#21C0C0',
          shadow: '#A8CAAF',
          summer: '#91BE9D',
          watercourse: '#01733e'
        },
        blue:{
          ...colors.blue,
          halfbacked: '#567E88',
          bayoux: '#5A6B7B',
          sanmarino: '#4B7497',
        },
      },
      width: {
        '96': '24rem',
        '80': '20rem'
      },
      fontFamily: {
        'roboto' : ['Roboto', 'sans-serif'],
        'arial'  : ['Arial Baltic','Arial'],
        'calibri': ['Calibri','Candara','Segoe','"Segoe UI"','Optima','Arial','sans-serif']
      },
      transitionTimingFunction: {
        'ease-out-quint': 'cubic-bezier(0.23, 1, 0.32, 1)'
      },
      boxShadow: {
        outline: '0 0 0 2px rgba(66, 153, 225, 0.5)',
      },
    }
  },
  variants: {
  },
  plugins: [],
  future: {
    removeDeprecatedGapUtilities: true,
  },
}