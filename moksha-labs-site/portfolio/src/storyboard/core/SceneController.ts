/**
 * Scene Controller
 * 
 * Manages lifecycle and animations for a single scene.
 * Each scene has its own ScrollTrigger and phase-mapped timeline.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  SceneConfig, 
  SceneState, 
  SceneLifecycle, 
  SceneEvent,
  SceneController as ISceneController 
} from '../types/Scene.types';
import { ElementRegistry } from './ElementRegistry';
import { EffectRegistry } from './EffectRegistry';
import { mapAllPhases, validatePhases } from '../utils/phaseMapper';
import { createSceneScrollTrigger } from '../utils/scrollSync';

gsap.registerPlugin(ScrollTrigger);

export class SceneController implements ISceneController {
  public config: SceneConfig;
  public state: SceneState;
  public lifecycle: SceneLifecycle;
  
  private elementRegistry: ElementRegistry;
  private effectRegistry: EffectRegistry;
  private scrollTrigger: ScrollTrigger | null;
  private timeline: gsap.core.Timeline | null;
  private cleanupFns: Array<() => void>;
  private eventHandlers: Map<SceneEvent, Set<(data: any) => void>>;
  private element: HTMLElement | null;
  private rafId: number | null;
  
  constructor(
    config: SceneConfig,
    elementRegistry: ElementRegistry,
    effectRegistry: EffectRegistry
  ) {
    this.config = config;
    this.elementRegistry = elementRegistry;
    this.effectRegistry = effectRegistry;
    this.scrollTrigger = null;
    this.timeline = null;
    this.cleanupFns = [];
    this.eventHandlers = new Map();
    this.element = null;
    this.rafId = null;
    
    // Initialize state
    this.state = {
      id: config.id,
      progress: 0,
      isActive: false,
      isPinned: false,
      phaseProgress: {},
      timestamp: Date.now(),
    };
    
    this.lifecycle = 'idle';
    
    // Validate phases
    const validation = validatePhases(config.phases);
    if (!validation.valid) {
      console.error(`[Scene ${config.id}] Phase validation errors:`, validation.errors);
    }
    if (validation.warnings.length > 0) {
      console.warn(`[Scene ${config.id}] Phase validation warnings:`, validation.warnings);
    }
  }
  
  /**
   * Initialize scene (setup ScrollTrigger, timeline, effects)
   */
  public initialize(): void {
    if (this.lifecycle !== 'idle') {
      console.warn(`[Scene ${this.config.id}] Already initialized`);
      return;
    }
    
    // Find scene element in DOM
    this.element = document.getElementById(this.config.id);
    
    if (!this.element) {
      console.error(`[Scene ${this.config.id}] Element not found in DOM`);
      return;
    }
    
    // Register scene-specific elements
    this.config.elements.forEach(elementRef => {
      if (!elementRef.persistent) {
        // Scene-scoped elements are registered per-scene
        const elementConfig = this.elementRegistry.getConfig(elementRef.id);
        if (!elementConfig) {
          console.warn(`[Scene ${this.config.id}] Element not found in registry: ${elementRef.id}`);
        }
      }
    });
    
    // Create timeline
    this.timeline = gsap.timeline({
      paused: true, // We'll control it via ScrollTrigger
    });
    
    // Setup ScrollTrigger
    const cleanup = createSceneScrollTrigger(
      this.config.id,
      this.element,
      {
        duration: this.config.duration,
        pin: this.config.pin,
        scrub: this.config.scrub,
        onProgress: (progress) => this.handleProgress(progress),
        onEnter: () => this.handleEnter(),
        onLeave: () => this.handleLeave(),
      }
    );
    
    this.cleanupFns.push(cleanup);
    
    // Get ScrollTrigger instance for direct access
    this.scrollTrigger = ScrollTrigger.getById(this.config.id) || null;
    
    // Start animation loop for continuous effects
    this.startAnimationLoop();
    
    this.emit('enter', { sceneId: this.config.id });
  }
  
  /**
   * Update scene based on scroll progress
   */
  public update(scrollProgress: number): void {
    this.state.progress = scrollProgress;
    this.state.timestamp = Date.now();
    
    // Map phases
    this.state.phaseProgress = mapAllPhases(scrollProgress, this.config.phases);
    
    // Update timeline progress
    if (this.timeline) {
      this.timeline.progress(scrollProgress);
    }
    
    // Apply effects
    this.applyEffects(scrollProgress);
    
    // Emit progress event
    this.emit('progress', {
      progress: scrollProgress,
      phaseProgress: this.state.phaseProgress,
    });
  }
  
  /**
   * Get progress for specific phase (0-1)
   */
  public getPhaseProgress(phaseName: string): number {
    return this.state.phaseProgress[phaseName] ?? 0;
  }
  
  /**
   * Cleanup scene (remove ScrollTrigger, timeline, effects)
   */
  public cleanup(): void {
    // Stop animation loop
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    
    // Run all cleanup functions
    this.cleanupFns.forEach(fn => fn());
    this.cleanupFns = [];
    
    // Kill timeline
    if (this.timeline) {
      this.timeline.kill();
      this.timeline = null;
    }
    
    // Kill ScrollTrigger
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
      this.scrollTrigger = null;
    }
    
    // Clear event handlers
    this.eventHandlers.clear();
    
    this.lifecycle = 'idle';
    
    this.emit('exit', { sceneId: this.config.id });
  }
  
  /**
   * Subscribe to scene events
   */
  public on(event: SceneEvent, handler: (data: any) => void): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);
  }
  
  /**
   * Unsubscribe from scene events
   */
  public off(event: SceneEvent, handler: (data: any) => void): void {
    this.eventHandlers.get(event)?.delete(handler);
  }
  
  /**
   * Emit event to handlers
   */
  private emit(event: SceneEvent, data?: any): void {
    this.eventHandlers.get(event)?.forEach(handler => {
      handler(data);
    });
  }
  
  /**
   * Handle scroll progress update
   */
  private handleProgress(progress: number): void {
    this.update(progress);
    
    // Check for phase transitions
    const activePhases = Object.entries(this.state.phaseProgress)
      .filter(([_, p]) => p > 0 && p < 1)
      .map(([name]) => name);
    
    // Emit phase enter/exit events (simplified - could be more sophisticated)
    activePhases.forEach(phase => {
      if (this.getPhaseProgress(phase) === 0) {
        this.emit('phase-enter', { phase });
      } else if (this.getPhaseProgress(phase) === 1) {
        this.emit('phase-exit', { phase });
      }
    });
  }
  
  /**
   * Handle scene enter
   */
  private handleEnter(): void {
    this.state.isActive = true;
    this.lifecycle = 'entering';
    
    // Initialize persistent elements for this scene
    this.config.elements
      .filter(el => el.persistent)
      .forEach(el => {
        const config = this.elementRegistry.getConfig(el.id);
        if (config && 'onSceneEnter' in config) {
          (config as any).onSceneEnter?.(
            this.config.id,
            this.elementRegistry.getState(el.id)!
          );
        }
      });
    
    setTimeout(() => {
      this.lifecycle = 'active';
    }, 100);
    
    this.emit('enter', { sceneId: this.config.id });
  }
  
  /**
   * Handle scene exit
   */
  private handleLeave(): void {
    this.state.isActive = false;
    this.lifecycle = 'exiting';
    
    // Notify persistent elements
    this.config.elements
      .filter(el => el.persistent)
      .forEach(el => {
        const config = this.elementRegistry.getConfig(el.id);
        if (config && 'onSceneExit' in config) {
          (config as any).onSceneExit?.(
            this.config.id,
            this.elementRegistry.getState(el.id)!
          );
        }
      });
    
    setTimeout(() => {
      this.lifecycle = 'complete';
    }, 100);
    
    this.emit('exit', { sceneId: this.config.id });
  }
  
  /**
   * Apply effects to elements based on current progress
   */
  private applyEffects(scrollProgress: number): void {
    this.config.effects.forEach(effectRef => {
      // Check if effect should be active in current phase
      const isActivePhase = effectRef.phases.some(phaseName => {
        const phaseProgress = this.state.phaseProgress[phaseName];
        return phaseProgress !== undefined && phaseProgress > 0 && phaseProgress < 1;
      });
      
      if (!isActivePhase) return;
      
      // Get target element state
      const elementState = this.elementRegistry.getState(effectRef.target);
      if (!elementState) return;
      
      // Get effect application
      const effectApp = this.effectRegistry.getApplication(effectRef.id);
      if (!effectApp) return;
      
      // Calculate effect progress (use first active phase)
      const activePhase = effectRef.phases.find(phaseName => {
        const p = this.state.phaseProgress[phaseName];
        return p !== undefined && p > 0 && p < 1;
      });
      
      const effectProgress = activePhase 
        ? this.state.phaseProgress[activePhase] 
        : 0;
      
      // Apply effect
      const newState = effectApp.apply(
        elementState,
        effectProgress,
        effectRef.params || {},
        1 / 60 // Assume 60fps for now
      );
      
      // Update element state
      this.elementRegistry.setState(effectRef.target, newState);
    });
  }
  
  /**
   * Start animation loop for continuous effects
   */
  private startAnimationLoop(): void {
    let lastTime = performance.now();
    
    const loop = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;
      
      // Update continuous effects
      if (this.state.isActive) {
        this.config.effects.forEach(effectRef => {
          const effectApp = this.effectRegistry.getApplication(effectRef.id);
          if (effectApp?.update) {
            const element = this.elementRegistry.getConfig(effectRef.target);
            const internalState = null; // Could track internal state per effect instance
            effectApp.update(element, deltaTime, internalState);
          }
        });
      }
      
      this.rafId = requestAnimationFrame(loop);
    };
    
    this.rafId = requestAnimationFrame(loop);
  }
  
  /**
   * Get debug info
   */
  public getDebugInfo(): {
    id: string;
    lifecycle: SceneLifecycle;
    progress: number;
    phaseProgress: Record<string, number>;
    activeEffects: string[];
  } {
    const activePhases = Object.entries(this.state.phaseProgress)
      .filter(([_, p]) => p > 0 && p < 1)
      .map(([name]) => name);
    
    const activeEffects = this.config.effects
      .filter(effect => {
        return effect.phases.some(phase => activePhases.includes(phase));
      })
      .map(effect => effect.id);
    
    return {
      id: this.config.id,
      lifecycle: this.lifecycle,
      progress: this.state.progress,
      phaseProgress: this.state.phaseProgress,
      activeEffects,
    };
  }
}

