import { HOME_BACKGROUND_URL } from "./src/config";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "home-principal": `url('${HOME_BACKGROUND_URL}')`,
      },
      fontFamily: {
        creepster: ["'Creepster'", "cursive"],
      },
      colors: {
        "custom-purple": "#1E193A",
      },
    },
  },
  plugins: [],
};