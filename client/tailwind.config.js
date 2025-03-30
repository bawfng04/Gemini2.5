config.js;
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "100%",
            color: "white",
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
