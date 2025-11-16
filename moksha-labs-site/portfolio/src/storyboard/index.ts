/**
 * Storyboard Framework - Main Export
 * 
 * Centralized exports for the entire storyboard system.
 */

// Core Classes
export { StoryboardManager } from './core/StoryboardManager';
export { SceneController } from './core/SceneController';
export { ElementRegistry } from './core/ElementRegistry';
export { EffectRegistry } from './core/EffectRegistry';

// Types
export type {
  SceneConfig,
  SceneState,
  ScenePhases,
  PhaseDefinition,
  SceneLifecycle,
  SceneEvent,
  SceneController as ISceneController,
  SceneTransition,
  ElementReference,
  EffectReference,
} from './types/Scene.types';

export type {
  ElementConfig,
  ElementState,
  ElementType,
  ElementScope,
  ElementTransform,
  ElementRegistry as IElementRegistry,
  MorphableElement,
  PersistentElement,
} from './types/Element.types';

export type {
  EffectConfig,
  EffectInstance,
  EffectApplication,
  EffectCategory,
  EffectRegistry as IEffectRegistry,
  ComposableEffect,
  CameraEffectParams,
  MaterialEffectParams,
  GeometryEffectParams,
  TransitionEffectParams,
  ParticleEffectParams,
} from './types/Effect.types';

// Utilities
export {
  mapPhase,
  mapPhaseDefinition,
  mapAllPhases,
  isInPhase,
  getActivePhases,
  validatePhases,
  applyEasing,
  smoothstep,
  smootherstep,
  createPhaseMapper,
} from './utils/phaseMapper';

export {
  createScrollTrigger,
  createSceneScrollTrigger,
  getScrollProgress,
  refreshScrollTriggers,
  killAllScrollTriggers,
  getActiveScrollTriggers,
  scrollToElement,
  normalizeScrollPosition,
  isInViewport,
  getScrollVelocity,
  createScrollObserver,
  syncWithLenis,
} from './utils/scrollSync';

// Context
export { StoryboardProvider, useStoryboardContext } from './context/StoryboardContext';

// Hooks
export { useScene, useStoryboard } from './hooks/useScene';
export { useElement } from './hooks/useElement';
export { useStoryboardEffect, useComposedEffects } from './hooks/useEffect';

// Example Scenes (for reference)
export { heroSceneConfig } from './scenes/01-hero/HeroScene.config';
export { HeroScene } from './scenes/01-hero/HeroScene';

export { aboutUsSceneConfig } from './scenes/02-about-us/AboutUsScene.config';
export { default as AboutUsScene } from './scenes/02-about-us/AbouUsScene';

export { ourWorkSceneConfig } from './scenes/03-our-work/OurWorkScene.config';
export { default as OurWorkScene } from './scenes/03-our-work/OurWorkScene';

export { ourServicesSceneConfig } from './scenes/04-our-services/OurServicesScene.config';
export { default as OurServicesScene } from './scenes/04-our-services/OurServicesScene';

export { contactUsSceneConfig } from './scenes/05-contact-us/ContactUsScene.config';
export { default as ContactUsScene } from './scenes/05-contact-us/ContactUsScene';

