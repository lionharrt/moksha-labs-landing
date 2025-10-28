/**
 * Scene 2: Philosophy
 * 
 * Split-screen layout revealing agency philosophy
 */

import { SceneConfig } from '../../types/Scene.types';

export const philosophySceneConfig: SceneConfig = {
  id: 'philosophy',
  name: 'Philosophy',
  order: 2,
  duration: '+=100vh', // Reasonable duration
  
  phases: {
    intro: {
      start: 0,
      end: 0.2,
      ease: 'power2.out',
    },
    hold: {
      start: 0.2,
      end: 0.8,
      ease: 'none',
    },
    outro: {
      start: 0.8,
      end: 1.0,
      ease: 'power2.in',
    },
  },
  
  elements: [],
  effects: [],
  
  pin: false, // Don't pin, let it scroll naturally
  scrub: 1,
  
  metadata: {
    description: 'Agency philosophy and approach',
    tags: ['philosophy', 'about', 'values'],
  },
};

