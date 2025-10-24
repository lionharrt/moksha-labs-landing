/**
 * Placeholder Scene Configuration
 * 
 * COPY THIS TEMPLATE to create new scenes quickly for storyboard planning.
 * Replace the id, name, order, and customize duration as needed.
 */

import { SceneConfig } from '../../types/Scene.types';

export function createPlaceholderScene(
  id: string,
  name: string,
  order: number,
  duration: string = '+=1000vh' // Default 10 screens
): SceneConfig {
  return {
    id,
    name,
    order,
    duration,
    
    phases: {
      intro: {
        start: 0,
        end: 0.2,
        ease: 'power2.out',
      },
      build: {
        start: 0.2,
        end: 0.7,
        ease: 'none',
      },
      hold: {
        start: 0.7,
        end: 0.9,
        ease: 'none',
      },
      outro: {
        start: 0.9,
        end: 1.0,
        ease: 'power2.in',
      },
    },
    
    elements: [],
    effects: [],
    
    pin: true,
    scrub: 1,
    
    metadata: {
      description: `Placeholder for ${name} scene`,
      tags: ['placeholder', id],
    },
  };
}

// Example usage for Scene 2:
export const seedPodArrivalConfig = createPlaceholderScene(
  'seed-pod-arrival',
  'Seed Pod Arrival',
  2,
  '+=800vh' // 8 screens
);

// Example usage for Scene 3:
export const petalUnfurlingConfig = createPlaceholderScene(
  'petal-unfurling',
  'Petal Unfurling',
  3,
  '+=800vh' // 8 screens
);

// Example usage for Scene 4:
export const fullBloomConfig = createPlaceholderScene(
  'full-bloom',
  'Full Bloom',
  4,
  '+=600vh' // 6 screens
);

// Example usage for Scene 5:
export const finalStateConfig = createPlaceholderScene(
  'final-state',
  'Final State',
  5,
  '+=200vh' // 2 screens - quick transition to end
);

