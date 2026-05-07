/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f4fef8',
          300: '#8df0ca',
          400: '#61e7bb',
          500: '#29d391',
          700: '#119164',
        },
        ink: {
          950: '#07111f',
          900: '#0d1b2d',
          800: '#142742',
          700: '#223554',
        },
        slate: {
          300: '#b1c1d7',
          200: '#ced8e7',
          100: '#ebf0f7',
        },
        warning: {
          400: '#f6c760',
        },
        danger: {
          400: '#ff7f7f',
        },
      },
    },
  },
  plugins: [],
}
