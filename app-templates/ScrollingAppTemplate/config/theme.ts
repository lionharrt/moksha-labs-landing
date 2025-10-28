/**
 * Theme Configuration
 * 
 * Centralized theme settings for colors, animations, and styling.
 * Modify these values to customize the look and feel of your scrolling app.
 */

export const themeConfig = {
  // Color scheme
  colors: {
    primary: {
      light: '#3b82f6', // blue-600
      dark: '#60a5fa',  // blue-400
    },
    secondary: {
      light: '#6366f1', // indigo-600
      dark: '#818cf8',  // indigo-400
    },
    background: {
      light: '#ffffff',
      dark: '#262626', // neutral-800
    },
    surface: {
      light: '#f9fafb', // gray-50
      dark: '#171717',  // neutral-900
    },
    text: {
      primary: {
        light: '#111827', // gray-900
        dark: '#f5f5f5',  // neutral-100
      },
      secondary: {
        light: '#6b7280', // gray-500
        dark: '#a3a3a3',  // neutral-400
      },
    },
  },

  // Navigation
  navigation: {
    height: 64, // pixels
    blurAmount: 'blur(10px)',
    transitionDuration: '500ms',
    mobileBreakpoint: 768, // pixels
  },

  // Scroll behavior
  scroll: {
    behavior: 'smooth' as const,
    snapType: 'mandatory' as const, // 'mandatory' | 'proximity'
    disableSnapOnMobile: true,
    progressBarHeight: 3, // pixels
    progressBarGradient: 'linear-gradient(to right, #667eea, #764ba2)',
  },

  // Animations
  animations: {
    duration: {
      fast: '200ms',
      normal: '300ms',
      slow: '500ms',
      xslow: '1000ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    fadeIn: {
      duration: '0.6s',
      delay: '100ms',
    },
  },

  // Section defaults
  sections: {
    defaultHeight: 'screen' as const,
    defaultPadding: 'large' as const,
    defaultAnimation: 'fade' as const,
    minHeight: '100vh',
    intersectionThreshold: [0.1, 0.3, 0.7],
    intersectionMargin: '-5% 0px -5% 0px',
  },

  // Responsive breakpoints (matches Tailwind defaults)
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },

  // Dark mode
  darkMode: {
    storageKey: 'darkMode',
    defaultMode: 'system' as 'light' | 'dark' | 'system',
  },
} as const;

export type ThemeConfig = typeof themeConfig;
