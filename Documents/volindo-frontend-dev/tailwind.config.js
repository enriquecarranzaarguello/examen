// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/containers/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      xxs: { max: '324px' },
      xs: { min: '325px', max: '640px' },
      xst: { min: '325px', max: '767px' },
      sm: '640px',
      md: '768px',
      t: { min: '768px', max: '900' },
      lg: '1024px',
      xl: '1280px',
      xxl: '1536px',
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sf-pro)', ...fontFamily.sans],
      },
      colors: {
        whiteLabelColor: process.env.BASICCOLOR,
        whiteLabelColorLight: process.env.BASICCOLORLIGHT,
        gray: '#BAB2B5',
        blue: '#BADFE7',
        blue2: '#697184',
        pink: '#D8CFD0',
        bg: '#B1A6A4',
        bgDark: '#413F3D',
      },
    },
  },
  plugins: [
    // eslint-disable-next-line no-undef
    require('tailwind-scrollbar-hide'),
    // eslint-disable-next-line no-undef
  ],
};
