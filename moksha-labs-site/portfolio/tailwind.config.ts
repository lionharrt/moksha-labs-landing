import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        'brand-teal-dark': 'var(--brand-teal-dark)',
        'brand-teal': 'var(--brand-teal)',
        'brand-teal-light': 'var(--brand-teal-light)',
        'brand-saffron': 'var(--brand-saffron)',
        'brand-saffron-dark': 'var(--brand-saffron-dark)',
        'brand-saffron-light': 'var(--brand-saffron-light)',
        
        // Semantic colors
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-bg)',
        'background-dark': 'var(--color-bg-dark)',
        foreground: 'var(--color-text)',
        'foreground-light': 'var(--color-text-light)',
        'foreground-muted': 'var(--color-text-muted)',
      },
      fontFamily: {
        heading: 'var(--font-heading)',
        body: 'var(--font-body)',
        mono: 'var(--font-mono)',
      },
    },
  },
  plugins: [],
};

export default config;

