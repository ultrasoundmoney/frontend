const { colors } = require('tailwindcss/defaultTheme')
module.exports = {
  darkMood: "media",
  purge: [
    "./public/**/*.html",
    "./src/pages/**/*.{js,ts,jsx,tsx}", 
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        black:{
          ...colors.black,
        },
        gray: {
          ...colors.gray,
        },
        green:{
          ...colors.green,
          'mediumspring': '#00FFA3',
        },
        blue:{
          ...colors.blue,
          midnightexpress: '#131827', 
          tangaroa: '#1b2236',
          spindle: '#b5bddb',
          linkwater: '#c8cbd9',
          shipcove: "#8991ad"
        },
      },
      width: {

      },
      spacing:{
        '42': '165px',
      },
      lineHeight: {
        '2': '2',
        'card': '3.3',
        '18': '1.18',
        'loose1': '2.95',
      },
      fontFamily: {
        'roboto' : ['Roboto Mono', 'monospace'],
        'inter' : [ 'Inter', 'sans-serif']
      },
      transitionTimingFunction: {
        'ease-out-quint': 'cubic-bezier(0.23, 1, 0.32, 1)'
      },
      boxShadow: {
        outline: '0 0 0 1px rgba(229, 103, 86, 0.4)',
      },
      fontSize:{
        '41xl': '2.5rem',
        '21xl': '1.87rem'
      }
    }
  },
  variants: {
  },
  plugins: [
		require('tailwindcss'),
		require('precss'),
		require('autoprefixer'),
    require('postcss-import'),
	],
  future: {
    removeDeprecatedGapUtilities: true,
		purgeLayersByDefault: true,
  },
}