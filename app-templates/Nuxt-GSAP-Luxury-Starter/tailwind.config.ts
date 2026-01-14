import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#FFFFFF', // Placeholder background
          dark: '#F5F5F5',
        },
        primary: {
          DEFAULT: '#000000', // Placeholder primary
          light: '#333333',
          dark: '#000000',
        },
        accent: {
          DEFAULT: '#888888', // Placeholder accent
          light: '#AAAAAA',
          dark: '#666666',
        }
      },
      fontFamily: {
        serif: ['serif'],
        sans: ['sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '2rem',
        '3xl': '3rem',
        'section': '100px',
      }
    }
  },
  plugins: [],
}

