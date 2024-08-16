/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      backgroundSize: {
        "hidden-link": "0 3px",
        "shown-link": "100% 3px",
      },
      fontFamily: {
        heading: ["Munken Sans", "sans-serif"],
        body: ["Atkinson Hyperlegible", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
  darkMode: "media",
};
