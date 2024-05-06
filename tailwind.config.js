/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  prefix: 'tw-',
  theme: {
    extends: {
      fontFamily: {
        bebas: ['var(--font-bebas)'],
        pretendard: ['var(--font-pretendard)'],
      },
    },
    screens: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
    },
  },
  plugins: [
    // ...
    require('@tailwindcss/line-clamp'),
  ],
};
