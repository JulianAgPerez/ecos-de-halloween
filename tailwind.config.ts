import { HOME_BACKGROUND_URL } from "./src/config";
import { getOptimizedBackgroundUrl } from "./src/utils/cloudinary";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "home-principal": `url('${getOptimizedBackgroundUrl(HOME_BACKGROUND_URL)}')`,
      },
      fontFamily: {
        creepster: ["'Creepster'", "'Creepster Fallback'", "cursive"],
      },
      colors: {
        "custom-purple": "#1E193A",
      },
    },
  },
  plugins: [],
};