/**
 * Scene 7: Team
 * 
 * Horizontal scroll showcase of team members
 */

import { SceneConfig } from '../../types/Scene.types';

export const teamSceneConfig: SceneConfig = {
  id: 'team',
  name: 'Team',
  order: 7,
  duration: '+=200vh', // Horizontal scroll
  
  phases: {
    intro: {
      start: 0,
      end: 0.1,
      ease: 'power2.out',
    },
    build: {
      start: 0.1,
      end: 0.3,
      ease: 'none',
    },
    scroll: {
      start: 0.3,
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
  
  pin: true, // Pin while horizontal scrolling
  scrub: 1,
  
  metadata: {
    description: 'Meet the team behind Moksha Labs',
    tags: ['team', 'people', 'about'],
  },
};

