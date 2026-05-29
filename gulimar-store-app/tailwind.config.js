/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        beige: '#F4F1EA',
        blacklux: '#1A1A1A',
        gold: '#F2C94C',
      },
      fontFamily: {
        sans: ['\"Cairo\"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
