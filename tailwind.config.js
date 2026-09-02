/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Unbounded"', 'sans-serif'],
        sans: ['"Manrope"', '"Segoe UI"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}