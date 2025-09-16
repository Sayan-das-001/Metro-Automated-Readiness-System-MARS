/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mars-blue': '#1e40af',
        'mars-green': '#059669',
        'mars-red': '#dc2626',
        'mars-orange': '#ea580c',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

