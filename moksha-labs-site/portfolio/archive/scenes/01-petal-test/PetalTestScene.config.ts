import { SceneConfig } from '../../types/Scene.types';

/**
 * Scene 1: Lotus Petal Test
 * 
 * Purpose: Create and showcase a single, beautiful lotus petal
 * Goal: Get the geometry, material, and appearance right before building full flower
 */
export const petalTestConfig: SceneConfig = {
  id: 'petal-test',
  name: 'Lotus Petal Test',
  order: 1,
  duration: '+=600vh', // 6 screens - enough to examine the petal
  
  phases: {
    // Simple phases for now - just showing the petal
    intro: {
      start: 0,
      end: 0.1,
      ease: 'power2.out',
    },
    
    display: {
      start: 0.1,
      end: 0.9,
      ease: 'none',
    },
    
    outro: {
      start: 0.9,
      end: 1.0,
      ease: 'power2.in',
    },
  },
  
  elements: [
    {
      id: 'lotus-petal',
      type: 'mesh',
      persistent: false, // Just a test for now
      initialState: {
        visible: true,
        opacity: 1,
        position: [0, 0, 0],
        scale: [1, 1, 1],
        rotation: [0, 0, 0],
        material: {
          color: '#e89f4c', // Brand saffron
          roughness: 0.7,
          metalness: 0.0,
        },
      },
    },
    {
      id: 'main-camera',
      type: 'camera',
      persistent: true,
      initialState: {
        visible: true,
        opacity: 1,
        position: [0, 2, 5], // Looking down at petal from slight angle
        rotation: [-0.3, 0, 0],
      },
    },
    {
      id: 'ambient-light',
      type: 'light',
      persistent: false,
      initialState: {
        visible: true,
        opacity: 1,
        material: {
          color: '#ffffff',
          intensity: 0.4,
        },
      },
    },
    {
      id: 'key-light',
      type: 'light',
      persistent: false,
      initialState: {
        visible: true,
        opacity: 1,
        position: [3, 5, 3],
        material: {
          color: '#ffffff',
          intensity: 1.2,
        },
      },
    },
    {
      id: 'back-light',
      type: 'light',
      persistent: false,
      initialState: {
        visible: true,
        opacity: 1,
        position: [0, -2, -3], // Behind and below petal for translucency
        material: {
          color: '#f2b56a', // Light saffron
          intensity: 0.6,
        },
      },
    },
  ],
  
  effects: [], // No effects yet, just static petal
  
  pin: true,
  scrub: 1,
  
  metadata: {
    description: 'Test scene for single lotus petal geometry and material',
    tags: ['test', 'petal', 'lotus'],
  },
};

