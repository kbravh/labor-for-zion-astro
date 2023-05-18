/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      backgroundSize: {
        'hidden-link': '0 3px',
        'shown-link': '100% 3px'
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
  darkMode: 'class',
};
