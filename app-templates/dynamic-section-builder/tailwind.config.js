/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dynamic theme colors using CSS variables
        primary: {
          50: 'rgb(var(--theme-primary-50) / <alpha-value>)',
          100: 'rgb(var(--theme-primary-100) / <alpha-value>)',
          200: 'rgb(var(--theme-primary-200) / <alpha-value>)',
          300: 'rgb(var(--theme-primary-300) / <alpha-value>)',
          400: 'rgb(var(--theme-primary-400) / <alpha-value>)',
          500: 'rgb(var(--theme-primary-500) / <alpha-value>)',
          600: 'rgb(var(--theme-primary-600) / <alpha-value>)',
          700: 'rgb(var(--theme-primary-700) / <alpha-value>)',
          800: 'rgb(var(--theme-primary-800) / <alpha-value>)',
          900: 'rgb(var(--theme-primary-900) / <alpha-value>)',
        },
        secondary: {
          50: 'rgb(var(--theme-secondary-50) / <alpha-value>)',
          100: 'rgb(var(--theme-secondary-100) / <alpha-value>)',
          200: 'rgb(var(--theme-secondary-200) / <alpha-value>)',
          300: 'rgb(var(--theme-secondary-300) / <alpha-value>)',
          400: 'rgb(var(--theme-secondary-400) / <alpha-value>)',
          500: 'rgb(var(--theme-secondary-500) / <alpha-value>)',
          600: 'rgb(var(--theme-secondary-600) / <alpha-value>)',
          700: 'rgb(var(--theme-secondary-700) / <alpha-value>)',
          800: 'rgb(var(--theme-secondary-800) / <alpha-value>)',
          900: 'rgb(var(--theme-secondary-900) / <alpha-value>)',
        },
        accent: {
          50: 'rgb(var(--theme-accent-50) / <alpha-value>)',
          100: 'rgb(var(--theme-accent-100) / <alpha-value>)',
          200: 'rgb(var(--theme-accent-200) / <alpha-value>)',
          300: 'rgb(var(--theme-accent-300) / <alpha-value>)',
          400: 'rgb(var(--theme-accent-400) / <alpha-value>)',
          500: 'rgb(var(--theme-accent-500) / <alpha-value>)',
          600: 'rgb(var(--theme-accent-600) / <alpha-value>)',
          700: 'rgb(var(--theme-accent-700) / <alpha-value>)',
          800: 'rgb(var(--theme-accent-800) / <alpha-value>)',
          900: 'rgb(var(--theme-accent-900) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

