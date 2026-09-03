/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        deepAtmosphere: "#0B1220",
        clearSky: "#4FA8E0",
        hazyAmber: "#E0A458",
        alertRust: "#D64545",
        mistWhite: "#F4F7FA",
        slateInk: "#64748B",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        serif: ["Fraunces", "Georgia", "serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
