// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'dt-brown': {
          dark: '#2a1d14',
          medium: '#422e20',
          light: '#5c4033',
        },
        'dt-gold': '#d4b7a0',
      }
    }
  },
  plugins: [],
};
