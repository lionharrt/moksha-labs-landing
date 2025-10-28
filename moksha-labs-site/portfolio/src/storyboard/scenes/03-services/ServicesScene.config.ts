/**
 * Scene 3: Services
 * 
 * Grid of service offerings with hover interactions
 */

import { SceneConfig } from '../../types/Scene.types';

export const servicesSceneConfig: SceneConfig = {
  id: 'services',
  name: 'Services',
  order: 3,
  duration: '+=150vh', // Reasonable duration for grid
  
  phases: {
    intro: {
      start: 0,
      end: 0.15,
      ease: 'power2.out',
    },
    build: {
      start: 0.15,
      end: 0.4,
      ease: 'none',
    },
    hold: {
      start: 0.4,
      end: 0.85,
      ease: 'none',
    },
    outro: {
      start: 0.85,
      end: 1.0,
      ease: 'power2.in',
    },
  },
  
  elements: [],
  effects: [],
  
  pin: false, // Let it scroll naturally
  scrub: 1,
  
  metadata: {
    description: 'Service offerings and capabilities',
    tags: ['services', 'offerings', 'capabilities'],
  },
};

