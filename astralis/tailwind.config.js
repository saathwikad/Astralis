/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          dark: '#0B0B1E',  // Dark space background
          light: '#1A1B4B'  // Slightly lighter space color
        },
        star: {
          bright: '#FFFFFF',  // Bright star color
          glow: '#64B5F6'    // Star glow effect
        }
      }
    },
  },
  plugins: [],
}