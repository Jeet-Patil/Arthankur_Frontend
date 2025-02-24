/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'violet': {
          500: '#7C3AED',
          600: '#6D28D9',
        },
        'pink': {
          500: '#EC4899',
        },
      },
    },
  },
  plugins: [],
}

