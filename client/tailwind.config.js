/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
        },
        accent: {
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
