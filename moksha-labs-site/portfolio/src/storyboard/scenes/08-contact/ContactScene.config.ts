/**
 * Scene 8: Contact
 * 
 * Contact form and closing CTA
 */

import { SceneConfig } from '../../types/Scene.types';

export const contactSceneConfig: SceneConfig = {
  id: 'contact',
  name: 'Contact',
  order: 8,
  duration: '+=50vh', // Just enough for form reveal
  
  phases: {
    intro: {
      start: 0,
      end: 0.3,
      ease: 'power2.out',
    },
    hold: {
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
  
  pin: true,
  scrub: 1,
  
  metadata: {
    description: 'Contact form and call to action',
    tags: ['contact', 'cta', 'form'],
  },
};

