/**
 * Effect Type Definitions
 * 
 * Effects are reusable, composable animation patterns that:
 * - Are stateless and pure (input → output)
 * - Can be swapped without breaking scenes
 * - Can be layered/composed on elements
 */

import * as THREE from 'three';
import { ElementState } from './Element.types';

export type EffectCategory = 
  | 'camera'        // Camera movements (orbit, zoom, etc.)
  | 'material'      // Material properties (iridescence, glow, etc.)
  | 'geometry'      // Vertex/geometry modifications (ripples, waves)
  | 'transition'    // State transitions (fade, morph)
  | 'particle'      // Particle system effects
  | 'post'          // Post-processing effects
  | 'custom';       // Custom effects

export interface EffectConfig {
  /** Unique effect ID */
  id: string;
  
  /** Display name */
  name: string;
  
  /** Effect category */
  category: EffectCategory;
  
  /** Effect description for documentation */
  description?: string;
  
  /** Default parameters */
  defaultParams: Record<string, any>;
  
  /** Parameter schema for validation/UI generation */
  paramSchema?: {
    [paramName: string]: {
      type: 'number' | 'boolean' | 'string' | 'color' | 'vector3';
      min?: number;
      max?: number;
      default: any;
      description?: string;
    };
  };
  
  /** Whether effect requires shader/custom material */
  requiresShader?: boolean;
  
  /** Shader code (if applicable) */
  shader?: {
    vertex?: string;
    fragment?: string;
    uniforms?: Record<string, THREE.IUniform>;
  };
}

export interface EffectInstance {
  /** Reference to effect config */
  effectId: string;
  
  /** Target element ID */
  targetId: string;
  
  /** Active parameters (merged with defaults) */
  params: Record<string, any>;
  
  /** Current effect state */
  state: {
    isActive: boolean;
    progress: number;
    lastUpdate: number;
  };
  
  /** Effect-specific internal state */
  internalState?: any;
}

export interface EffectApplication {
  /** Apply effect to element state */
  apply: (
    elementState: ElementState,
    progress: number,
    params: Record<string, any>,
    deltaTime: number
  ) => ElementState;
  
  /** Initialize effect (setup shaders, uniforms, etc.) */
  initialize?: (element: any, params: Record<string, any>) => any;
  
  /** Cleanup effect (remove shaders, listeners, etc.) */
  cleanup?: (element: any, internalState: any) => void;
  
  /** Optional: Update per frame (for continuous effects) */
  update?: (element: any, deltaTime: number, internalState: any) => void;
}

export interface EffectRegistry {
  /** Register new effect */
  register: (config: EffectConfig, application: EffectApplication) => void;
  
  /** Unregister effect */
  unregister: (effectId: string) => void;
  
  /** Get effect config */
  getConfig: (effectId: string) => EffectConfig | undefined;
  
  /** Get effect application */
  getApplication: (effectId: string) => EffectApplication | undefined;
  
  /** Get all effects in category */
  getByCategory: (category: EffectCategory) => EffectConfig[];
  
  /** Create effect instance */
  createInstance: (effectId: string, targetId: string, params?: Record<string, any>) => EffectInstance;
  
  /** Apply effect instance */
  applyInstance: (instance: EffectInstance, elementState: ElementState, progress: number, deltaTime: number) => ElementState;
}

export interface ComposableEffect {
  /** Effect instances in order of application */
  effects: EffectInstance[];
  
  /** Blend mode for composing effects */
  blendMode?: 'replace' | 'additive' | 'multiply' | 'overlay';
  
  /** Apply all effects in composition */
  apply: (elementState: ElementState, progress: number, deltaTime: number) => ElementState;
}

// ==========================================
// Common Effect Parameter Types
// ==========================================

export interface CameraEffectParams {
  /** Target position to orbit around */
  target?: THREE.Vector3 | [number, number, number];
  
  /** Orbit radius */
  radius?: number;
  
  /** Orbit speed */
  speed?: number;
  
  /** Vertical angle (phi) */
  phi?: number;
  
  /** Horizontal angle (theta) */
  theta?: number;
}

export interface MaterialEffectParams {
  /** Target color */
  color?: string | number;
  
  /** Emissive color */
  emissive?: string | number;
  
  /** Roughness (0-1) */
  roughness?: number;
  
  /** Metalness (0-1) */
  metalness?: number;
  
  /** Opacity (0-1) */
  opacity?: number;
  
  /** Custom uniforms for shader */
  uniforms?: Record<string, any>;
}

export interface GeometryEffectParams {
  /** Displacement amplitude */
  amplitude?: number;
  
  /** Wave frequency */
  frequency?: number;
  
  /** Wave speed */
  speed?: number;
  
  /** Noise scale */
  noiseScale?: number;
  
  /** Custom vertex manipulation */
  vertexFn?: (vertex: THREE.Vector3, index: number, time: number) => THREE.Vector3;
}

export interface TransitionEffectParams {
  /** Transition duration (0-1 in phase progress) */
  duration?: number;
  
  /** Easing function */
  ease?: string;
  
  /** Start delay (0-1) */
  delay?: number;
}

export interface ParticleEffectParams {
  /** Number of particles */
  count?: number;
  
  /** Particle size */
  size?: number;
  
  /** Particle color */
  color?: string | number;
  
  /** Particle lifetime */
  lifetime?: number;
  
  /** Emission rate */
  emissionRate?: number;
  
  /** Velocity */
  velocity?: THREE.Vector3 | [number, number, number];
}

