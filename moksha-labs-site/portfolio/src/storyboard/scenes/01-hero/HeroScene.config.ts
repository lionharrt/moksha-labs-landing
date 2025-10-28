/**
 * Scene 1: Hero
 * 
 * Clean, centered hero with large typography
 * Minimal animation on scroll
 */

import { SceneConfig } from '../../types/Scene.types';

export const heroSceneConfig: SceneConfig = {
  id: 'hero',
  name: 'Hero',
  order: 1,
  duration: '+=100vh', // Pin for 1 extra screen
  
  phases: {
    intro: {
      start: 0,
      end: 0.4,
      ease: 'power2.out',
    },
    hold: {
      start: 0.4,
      end: 0.6,
      ease: 'none',
    },
    outro: {
      start: 0.6,
      end: 1.0,
      ease: 'power2.in',
    },
  },
  
  elements: [],
  effects: [],
  
  pin: true,
  scrub: 1,
  
  metadata: {
    description: 'Hero section with brand introduction',
    tags: ['hero', 'intro', 'brand'],
  },
};

