/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        teal:    { 400: '#2DD4BF', 500: '#14B8A6', 600: '#0D9488', 700: '#0F766E', 800: '#115E59', 900: '#134E4A', 950: '#042F2E' },
        amber:   { 400: '#FBBF24', 500: '#F59E0B' },
        slate:   { 50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0', 700: '#334155', 800: '#1E293B', 900: '#0F172A' }
      }
    }
  }
};
