/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gateway: {
          bg: '#090d16',
          card: '#131b2e',
          cardBorder: '#1e293b',
          accent: '#6366f1',
          gradientStart: '#4f46e5',
          gradientEnd: '#9333ea',
          pinkGlow: '#ec4899',
          gold: '#eab308'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
