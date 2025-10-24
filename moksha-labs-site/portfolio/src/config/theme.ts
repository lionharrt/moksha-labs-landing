import * as THREE from 'three';

export const theme = {
  colors: {
    // Brand colors
    tealDark: '#0d3838',
    teal: '#1a4d4d',
    tealLight: '#2d6363',
    saffron: '#e89f4c',
    saffronDark: '#d4883b',
    saffronLight: '#f2b56a',
    
    // Semantic colors
    primary: '#0d3838',
    secondary: '#e89f4c',
    accent: '#f2b56a',
  },
  
  // Three.js materials reference CSS variables
  getMaterialColor: (variable: string): THREE.Color => {
    if (typeof window === 'undefined') return new THREE.Color('#1a4d4d');
    
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim();
    
    return new THREE.Color(color || '#1a4d4d');
  },
  
  animation: {
    duration: {
      fast: 0.3,
      normal: 0.6,
      slow: 1.2,
      verySlow: 2.0,
    },
    easing: {
      smooth: 'power2.out',
      spring: 'elastic.out(1, 0.3)',
      bounce: 'back.out(1.7)',
    },
  },
};

export type Theme = typeof theme;

