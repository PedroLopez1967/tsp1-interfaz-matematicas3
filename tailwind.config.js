/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-blue': '#1E3A8A',
        'vibrant-purple': '#7C3AED',
        'golden-yellow': '#F59E0B',
        'emerald-success': '#10B981',
        'coral-warning': '#EF4444',
        'soft-cream': '#FFFBEB',
        'scientific-blue': '#0369A1',
        'lab-green': '#059669',
        'caution-yellow': '#D97706',
      },
      fontFamily: {
        'fredoka': ['Fredoka One', 'cursive'],
        'inter': ['Inter', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'roboto-mono': ['Roboto Mono', 'monospace'],
        'open-sans': ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
