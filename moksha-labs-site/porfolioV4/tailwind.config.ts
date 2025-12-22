import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FDFBF7',
          dark: '#F5F2ED',
        },
        saffron: {
          DEFAULT: '#E2A04F',
          light: '#EBC18D',
          dark: '#B87D35',
        },
        charcoal: {
          DEFAULT: '#1A1A1A',
          light: '#333333',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
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

