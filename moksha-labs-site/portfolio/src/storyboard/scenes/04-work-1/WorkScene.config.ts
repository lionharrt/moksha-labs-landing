/**
 * Work Scenes (4, 5, 6)
 * 
 * Case study showcases with alternating layouts
 */

import { SceneConfig } from '../../types/Scene.types';

export const workScene1Config: SceneConfig = {
  id: 'work-1',
  name: 'Work Case Study 1',
  order: 4,
  duration: '+=80vh', // One project per section
  
  phases: {
    intro: {
      start: 0,
      end: 0.2,
      ease: 'power2.out',
    },
    hold: {
      start: 0.2,
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
  
  pin: false,
  scrub: 1,
  
  metadata: {
    description: 'Featured work case study',
    tags: ['work', 'portfolio', 'case-study'],
  },
};

export const workScene2Config: SceneConfig = {
  ...workScene1Config,
  id: 'work-2',
  name: 'Work Case Study 2',
  order: 5,
};

export const workScene3Config: SceneConfig = {
  ...workScene1Config,
  id: 'work-3',
  name: 'Work Case Study 3',
  order: 6,
};

