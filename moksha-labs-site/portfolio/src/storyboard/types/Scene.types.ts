/**
 * Scene Type Definitions
 * 
 * A Scene is a self-contained scroll segment with:
 * - Fixed duration (scroll distance)
 * - Phase definitions (intro, build, hold, outro, etc.)
 * - Elements (DOM + 3D components)
 * - Effects (animations that operate on elements)
 */

export interface PhaseDefinition {
  /** Start point in scene progress (0-1) */
  start: number;
  /** End point in scene progress (0-1) */
  end: number;
  /** Optional easing function for this phase */
  ease?: string;
}

export interface ScenePhases {
  /** Standard phases - can be extended per scene */
  intro?: PhaseDefinition;
  build?: PhaseDefinition;
  hold?: PhaseDefinition;
  outro?: PhaseDefinition;
  /** Custom phases can be added */
  [key: string]: PhaseDefinition | undefined;
}

export interface ElementReference {
  /** Unique element ID */
  id: string;
  /** Element type for registry lookup */
  type: string;
  /** Whether element persists across scenes */
  persistent?: boolean;
  /** Initial state for this element in this scene */
  initialState?: Record<string, any>;
}

export interface EffectReference {
  /** Effect ID from registry */
  id: string;
  /** Target element ID */
  target: string;
  /** Phases during which effect is active */
  phases: string[];
  /** Effect-specific parameters */
  params?: Record<string, any>;
}

export interface SceneConfig {
  /** Unique scene identifier */
  id: string;
  
  /** Display name for debugging/tools */
  name?: string;
  
  /** Scene order in sequence (1-indexed) */
  order: number;
  
  /** Scroll duration (CSS units: '100vh', '200vh', etc.) */
  duration: string;
  
  /** Phase definitions for this scene */
  phases: ScenePhases;
  
  /** Elements used in this scene */
  elements: ElementReference[];
  
  /** Effects applied during this scene */
  effects: EffectReference[];
  
  /** Optional: Pin scene during scroll */
  pin?: boolean;
  
  /** Optional: Scrub duration for smoother animations */
  scrub?: number | boolean;
  
  /** Optional: Custom start/end triggers for advanced control */
  triggers?: {
    start?: string;
    end?: string;
  };
  
  /** Optional: Scene-specific metadata */
  metadata?: {
    description?: string;
    thumbnail?: string;
    tags?: string[];
  };
}

export interface SceneState {
  /** Current scene ID */
  id: string;
  
  /** Raw scroll progress (0-1) through this scene */
  progress: number;
  
  /** Whether scene is active (in viewport) */
  isActive: boolean;
  
  /** Whether scene is pinned */
  isPinned: boolean;
  
  /** Progress per phase */
  phaseProgress: Record<string, number>;
  
  /** Timestamp of last update */
  timestamp: number;
}

export interface SceneTransition {
  /** Source scene ID */
  from: string;
  
  /** Target scene ID */
  to: string;
  
  /** Transition progress (0-1) */
  progress: number;
  
  /** Shared elements to transition */
  sharedElements?: string[];
  
  /** Transition type */
  type?: 'fade' | 'morph' | 'crossfade' | 'custom';
  
  /** Custom transition function */
  transitionFn?: (progress: number) => void;
}

export type SceneLifecycle = 'idle' | 'entering' | 'active' | 'exiting' | 'complete';

export interface SceneController {
  /** Scene configuration */
  config: SceneConfig;
  
  /** Current scene state */
  state: SceneState;
  
  /** Lifecycle stage */
  lifecycle: SceneLifecycle;
  
  /** Initialize scene (setup GSAP timelines, effects) */
  initialize: () => void;
  
  /** Update scene based on scroll progress */
  update: (scrollProgress: number) => void;
  
  /** Get progress for specific phase */
  getPhaseProgress: (phaseName: string) => number;
  
  /** Cleanup scene (remove effects, timelines) */
  cleanup: () => void;
  
  /** Scene-specific event handlers */
  on: (event: SceneEvent, handler: (data: any) => void) => void;
  off: (event: SceneEvent, handler: (data: any) => void) => void;
}

export type SceneEvent = 
  | 'enter'        // Scene enters viewport
  | 'exit'         // Scene exits viewport
  | 'progress'     // Progress update
  | 'phase-enter'  // Phase becomes active
  | 'phase-exit'   // Phase ends
  | 'complete';    // Scene fully scrolled through

