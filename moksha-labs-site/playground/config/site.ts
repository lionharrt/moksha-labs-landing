/**
 * Site configuration
 * Based on best practices from documentation
 */

export const siteConfig = {
  name: 'Moksha Labs Playground',
  description: 'Learning Three.js - Building award-winning 3D experiences',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  
  features: {
    stats: process.env.NODE_ENV === 'development', // Show FPS stats in dev
    debug: process.env.NODE_ENV === 'development',
  },
  
  performance: {
    maxParticles: {
      mobile: 1000,
      desktop: 10000,
    },
    pixelRatio: {
      min: 1,
      max: 2, // Cap at 2 for performance
    },
  },
  
  // For future agency site
  agency: {
    name: 'Moksha Labs',
    tagline: 'Crafting Digital Experiences',
  },
} as const;

