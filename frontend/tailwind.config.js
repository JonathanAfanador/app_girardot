/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A',
        secondary: '#FBBF24',
        accent: '#EF4444',
        background: '#F9FAFB',
        text: '#1F2937',
      },
    },
  },
  plugins: [],
}
