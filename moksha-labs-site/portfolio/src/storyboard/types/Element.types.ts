/**
 * Element Type Definitions
 * 
 * Elements are visual/interactive objects that can:
 * - Live within a single scene (scene-scoped)
 * - Persist across multiple scenes (global-scoped)
 * - Transform/morph between scenes
 */

import * as THREE from 'three';

export type ElementType = 
  | 'mesh'           // 3D mesh object
  | 'group'          // Group of 3D objects
  | 'light'          // Light source
  | 'camera'         // Camera (typically persistent)
  | 'dom'            // DOM/React component
  | 'effect'         // Post-processing effect
  | 'custom';        // Custom element type

export type ElementScope = 'scene' | 'global';

export interface ElementConfig {
  /** Unique element ID */
  id: string;
  
  /** Element type */
  type: ElementType;
  
  /** Scope: scene-specific or global/persistent */
  scope: ElementScope;
  
  /** Scenes this element appears in */
  scenes: string[];
  
  /** Initial state */
  initialState: ElementState;
  
  /** Whether element can be morphed/transformed */
  morphable?: boolean;
  
  /** Component to render (for React/R3F elements) */
  component?: React.ComponentType<any>;
  
  /** Metadata for debugging */
  metadata?: {
    description?: string;
    tags?: string[];
  };
}

export interface ElementState {
  /** Whether element is currently visible */
  visible: boolean;
  
  /** Opacity (0-1) */
  opacity: number;
  
  /** Position in 3D space (for 3D elements) */
  position?: THREE.Vector3 | [number, number, number];
  
  /** Rotation in 3D space (for 3D elements) */
  rotation?: THREE.Euler | [number, number, number];
  
  /** Scale in 3D space (for 3D elements) */
  scale?: THREE.Vector3 | [number, number, number];
  
  /** Material properties (for mesh elements) */
  material?: {
    color?: string | number;
    emissive?: string | number;
    roughness?: number;
    metalness?: number;
    opacity?: number;
    transparent?: boolean;
    [key: string]: any;
  };
  
  /** Morph target (for morphable elements) */
  morphTarget?: string;
  
  /** Morph progress (0-1) towards morphTarget */
  morphProgress?: number;
  
  /** Custom state properties */
  [key: string]: any;
}

export interface ElementTransform {
  /** Element ID */
  elementId: string;
  
  /** Source state */
  from: Partial<ElementState>;
  
  /** Target state */
  to: Partial<ElementState>;
  
  /** Transform duration (in scene progress units, 0-1) */
  duration: number;
  
  /** Easing function */
  ease?: string;
  
  /** Optional callback when transform completes */
  onComplete?: () => void;
}

export interface ElementRegistry {
  /** Register new element */
  register: (config: ElementConfig) => void;
  
  /** Unregister element */
  unregister: (elementId: string) => void;
  
  /** Get element config */
  getConfig: (elementId: string) => ElementConfig | undefined;
  
  /** Get current state */
  getState: (elementId: string) => ElementState | undefined;
  
  /** Update element state */
  setState: (elementId: string, state: Partial<ElementState>) => void;
  
  /** Get all elements for a scene */
  getSceneElements: (sceneId: string) => ElementConfig[];
  
  /** Get all persistent elements */
  getPersistentElements: () => ElementConfig[];
  
  /** Subscribe to state changes */
  subscribe: (elementId: string, callback: (state: ElementState) => void) => () => void;
}

export interface MorphableElement extends ElementConfig {
  morphable: true;
  
  /** Available morph targets */
  morphTargets: {
    [targetName: string]: Partial<ElementState>;
  };
  
  /** Morph transition function */
  morphFn?: (from: ElementState, to: ElementState, progress: number) => ElementState;
}

export interface PersistentElement extends ElementConfig {
  scope: 'global';
  
  /** Lifecycle hooks for persistent elements */
  onSceneEnter?: (sceneId: string, state: ElementState) => void;
  onSceneExit?: (sceneId: string, state: ElementState) => void;
}

