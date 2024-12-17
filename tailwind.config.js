/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        zenithHeader: "#244d5a",
        slateteal: "#377284",
        primary: "#5cbbb4",
        secondary: "#3d7c78",
        tertiary: "#1e3e3c",
        myWhite: "#e5e9e9",
        black: "#000",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
