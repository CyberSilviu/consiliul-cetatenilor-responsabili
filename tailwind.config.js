/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background-primary': '#0f172a',
        'background-secondary': 'rgba(30, 41, 59, 0.5)',
        'category-inovare': '#3B82F6',
        'category-egalitate': '#A855F7',
        'category-antreprenoriat': '#10B981',
        'status-red': '#EF4444',
        'status-orange': '#F97316',
        'status-green': '#10B981',
        'text-primary': '#FFFFFF',
        'text-secondary': '#94A3B8',
      },
      fontFamily: {
        'primary': ['Poppins', 'sans-serif'],
        'secondary': ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}