/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        satoshi: ["Satoshi", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
      colors: {
        primary: "#000000",       // Main black text color
        secondary: "#FFFFFF",     // White for backgrounds
        accent1: "#F3F3F3",       // Light gray background
        accent2: "#3b82f6",       // Blue highlight (buttons / links)
        background: "#FFFFFF",    // Global background
      },
    },
  },
  plugins: [],
}
