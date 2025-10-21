/**
 * Silk Emergence Scene Configuration
 * 
 * Scene 1: The silk surface emerges from darkness with gentle ripples.
 * This scene establishes the visual foundation and mood.
 */

import { SceneConfig } from '../../types/Scene.types';

export const silkEmergenceConfig: SceneConfig = {
  id: 'silk-emergence',
  name: 'Silk Emergence',
  order: 1,
  duration: '100vh',
  
  phases: {
    // 0-15%: Fade in from black, silk surface becomes visible
    intro: {
      start: 0,
      end: 0.15,
      ease: 'power2.out',
    },
    
    // 15-60%: Ripples gradually intensify, camera begins subtle drift
    build: {
      start: 0.15,
      end: 0.6,
      ease: 'none', // Linear for smooth ripple progression
    },
    
    // 60-85%: Hold state, ripples continue at peak intensity
    hold: {
      start: 0.6,
      end: 0.85,
      ease: 'none',
    },
    
    // 85-100%: Prepare for next scene, subtle camera movement toward center
    outro: {
      start: 0.85,
      end: 1.0,
      ease: 'power2.in',
    },
  },
  
  elements: [
    {
      id: 'silk-surface',
      type: 'mesh',
      persistent: true, // Surface morphs into lotus base in later scenes
      initialState: {
        visible: false,
        opacity: 0,
        position: [0, 0, 0],
        scale: [1, 1, 1],
        material: {
          color: '#1a4d4d', // Brand teal
          roughness: 0.2,
          metalness: 0.1,
        },
      },
    },
    {
      id: 'main-camera',
      type: 'camera',
      persistent: true, // Camera persists through all scenes
      initialState: {
        visible: true,
        opacity: 1,
        position: [0, 3, 8],
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
          intensity: 0.5,
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
        position: [5, 5, 3],
        material: {
          color: '#e89f4c', // Brand saffron
          intensity: 0.8,
        },
      },
    },
  ],
  
  effects: [
    // Fade in silk surface during intro
    {
      id: 'fade-in',
      target: 'silk-surface',
      phases: ['intro'],
      params: {
        startOpacity: 0,
        endOpacity: 1,
      },
    },
    
    // Silk ripple effect during build and hold
    {
      id: 'silk-ripple',
      target: 'silk-surface',
      phases: ['build', 'hold'],
      params: {
        amplitude: 0.2,
        frequency: 2.0,
        speed: 0.5,
        direction: [0, 1, 0], // Ripples move upward
      },
    },
    
    // Camera drift during build, hold, and outro
    {
      id: 'camera-drift',
      target: 'main-camera',
      phases: ['build', 'hold', 'outro'],
      params: {
        driftAmount: 0.1,
        driftSpeed: 0.3,
      },
    },
    
    // Camera zoom in during outro (prepare for seed pod)
    {
      id: 'camera-zoom',
      target: 'main-camera',
      phases: ['outro'],
      params: {
        startPosition: [0, 3, 8],
        endPosition: [0, 2, 5],
      },
    },
  ],
  
  pin: true,
  scrub: 1,
  
  metadata: {
    description: 'Opening scene: silk surface emerges with gentle ripples',
    tags: ['intro', 'silk', 'atmosphere'],
  },
};

