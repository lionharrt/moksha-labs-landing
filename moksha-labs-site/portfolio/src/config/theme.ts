import * as THREE from 'three';

export const theme = {
  colors: {
    primary: '#000000',
    secondary: '#ffffff',
    accent: '#6366f1',
  },
  
  // Three.js materials reference CSS variables
  getMaterialColor: (variable: string): THREE.Color => {
    if (typeof window === 'undefined') return new THREE.Color('#000000');
    
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim();
    
    return new THREE.Color(color || '#000000');
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

