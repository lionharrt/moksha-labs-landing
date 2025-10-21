/**
 * Storyboard Manager
 * 
 * Global coordinator for all scenes, elements, and effects.
 * Maintains a single master timeline and coordinates scene transitions.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SceneConfig, SceneTransition } from '../types/Scene.types';
import { ElementConfig } from '../types/Element.types';
import { EffectConfig } from '../types/Effect.types';
import { SceneController } from './SceneController';
import { ElementRegistry } from './ElementRegistry';
import { EffectRegistry } from './EffectRegistry';
import { killAllScrollTriggers, refreshScrollTriggers } from '../utils/scrollSync';

gsap.registerPlugin(ScrollTrigger);

export interface StoryboardConfig {
  /** All scene configurations */
  scenes: SceneConfig[];
  
  /** Global persistent elements */
  elements?: ElementConfig[];
  
  /** Global effect library */
  effects?: EffectConfig[];
  
  /** Enable debug mode (markers, logging) */
  debug?: boolean;
  
  /** Master timeline configuration */
  timeline?: {
    ease?: string;
    paused?: boolean;
  };
}

export class StoryboardManager {
  private config: StoryboardConfig;
  private sceneControllers: Map<string, SceneController>;
  private elementRegistry: ElementRegistry;
  private effectRegistry: EffectRegistry;
  private masterTimeline: gsap.core.Timeline | null;
  private isInitialized: boolean;
  private activeSceneId: string | null;
  private subscribers: Map<string, Set<(data: any) => void>>;
  
  constructor(config: StoryboardConfig) {
    this.config = config;
    this.sceneControllers = new Map();
    this.elementRegistry = new ElementRegistry();
    this.effectRegistry = new EffectRegistry();
    this.masterTimeline = null;
    this.isInitialized = false;
    this.activeSceneId = null;
    this.subscribers = new Map();
    
    // Validate config
    this.validateConfig();
  }
  
  /**
   * Initialize storyboard (register scenes, elements, effects)
   */
  public initialize(): void {
    if (this.isInitialized) {
      console.warn('StoryboardManager already initialized');
      return;
    }
    
    // Register global elements
    if (this.config.elements) {
      this.config.elements.forEach(element => {
        this.elementRegistry.register(element);
      });
    }
    
    // Register global effects
    if (this.config.effects) {
      this.config.effects.forEach(effect => {
        // Effect registration happens in EffectRegistry with application function
        // This is just the config registration
      });
    }
    
    // Sort scenes by order
    const sortedScenes = [...this.config.scenes].sort((a, b) => a.order - b.order);
    
    // Create scene controllers
    sortedScenes.forEach(sceneConfig => {
      const controller = new SceneController(
        sceneConfig,
        this.elementRegistry,
        this.effectRegistry
      );
      
      // Subscribe to scene events
      controller.on('enter', () => this.handleSceneEnter(sceneConfig.id));
      controller.on('exit', () => this.handleSceneExit(sceneConfig.id));
      controller.on('progress', (data) => this.handleSceneProgress(sceneConfig.id, data));
      
      this.sceneControllers.set(sceneConfig.id, controller);
    });
    
    // Create master timeline
    this.masterTimeline = gsap.timeline({
      paused: this.config.timeline?.paused ?? false,
      ease: this.config.timeline?.ease ?? 'none',
    });
    
    // Initialize all scene controllers
    this.sceneControllers.forEach(controller => {
      controller.initialize();
    });
    
    this.isInitialized = true;
    
    if (this.config.debug) {
      console.log('[StoryboardManager] Initialized with', {
        scenes: this.sceneControllers.size,
        elements: this.elementRegistry.getAll().length,
        effects: this.effectRegistry.getAll().length,
      });
    }
  }
  
  /**
   * Cleanup storyboard (remove all ScrollTriggers, timelines)
   */
  public cleanup(): void {
    // Cleanup all scene controllers
    this.sceneControllers.forEach(controller => {
      controller.cleanup();
    });
    
    // Kill master timeline
    if (this.masterTimeline) {
      this.masterTimeline.kill();
      this.masterTimeline = null;
    }
    
    // Kill all ScrollTriggers
    killAllScrollTriggers();
    
    // Clear registries
    this.sceneControllers.clear();
    this.subscribers.clear();
    
    this.isInitialized = false;
    
    if (this.config.debug) {
      console.log('[StoryboardManager] Cleaned up');
    }
  }
  
  /**
   * Get scene controller by ID
   */
  public getScene(sceneId: string): SceneController | undefined {
    return this.sceneControllers.get(sceneId);
  }
  
  /**
   * Get all scene controllers
   */
  public getAllScenes(): SceneController[] {
    return Array.from(this.sceneControllers.values());
  }
  
  /**
   * Get currently active scene
   */
  public getActiveScene(): SceneController | null {
    if (!this.activeSceneId) return null;
    return this.sceneControllers.get(this.activeSceneId) || null;
  }
  
  /**
   * Get element registry
   */
  public getElementRegistry(): ElementRegistry {
    return this.elementRegistry;
  }
  
  /**
   * Get effect registry
   */
  public getEffectRegistry(): EffectRegistry {
    return this.effectRegistry;
  }
  
  /**
   * Trigger a scene transition
   */
  public transitionToScene(
    toSceneId: string,
    options?: Partial<SceneTransition>
  ): void {
    const fromSceneId = this.activeSceneId;
    const toScene = this.sceneControllers.get(toSceneId);
    
    if (!toScene) {
      console.error(`Scene not found: ${toSceneId}`);
      return;
    }
    
    if (fromSceneId === toSceneId) {
      console.warn('Already at target scene');
      return;
    }
    
    const transition: SceneTransition = {
      from: fromSceneId || '',
      to: toSceneId,
      progress: 0,
      type: options?.type || 'fade',
      ...options,
    };
    
    this.emit('transition:start', transition);
    
    // Handle transition based on type
    if (transition.type === 'fade') {
      // Simple fade transition
      gsap.to(window, {
        duration: 0.6,
        scrollTo: `#${toSceneId}`,
        ease: 'power2.inOut',
        onComplete: () => {
          this.emit('transition:complete', transition);
        },
      });
    }
    
    // More transition types can be implemented here
  }
  
  /**
   * Refresh all ScrollTriggers (after layout changes)
   */
  public refresh(): void {
    refreshScrollTriggers();
  }
  
  /**
   * Subscribe to storyboard events
   */
  public on(event: string, callback: (data: any) => void): () => void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }
    
    this.subscribers.get(event)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers.get(event)?.delete(callback);
    };
  }
  
  /**
   * Emit event to subscribers
   */
  private emit(event: string, data?: any): void {
    if (this.config.debug) {
      console.log(`[StoryboardManager] Event: ${event}`, data);
    }
    
    this.subscribers.get(event)?.forEach(callback => {
      callback(data);
    });
  }
  
  /**
   * Handle scene enter
   */
  private handleSceneEnter(sceneId: string): void {
    this.activeSceneId = sceneId;
    this.emit('scene:enter', { sceneId });
  }
  
  /**
   * Handle scene exit
   */
  private handleSceneExit(sceneId: string): void {
    if (this.activeSceneId === sceneId) {
      this.activeSceneId = null;
    }
    this.emit('scene:exit', { sceneId });
  }
  
  /**
   * Handle scene progress update
   */
  private handleSceneProgress(sceneId: string, data: any): void {
    this.emit('scene:progress', { sceneId, ...data });
  }
  
  /**
   * Validate storyboard configuration
   */
  private validateConfig(): void {
    const errors: string[] = [];
    
    // Check for duplicate scene IDs
    const sceneIds = new Set<string>();
    this.config.scenes.forEach(scene => {
      if (sceneIds.has(scene.id)) {
        errors.push(`Duplicate scene ID: ${scene.id}`);
      }
      sceneIds.add(scene.id);
    });
    
    // Check for duplicate scene orders
    const orders = new Set<number>();
    this.config.scenes.forEach(scene => {
      if (orders.has(scene.order)) {
        errors.push(`Duplicate scene order: ${scene.order}`);
      }
      orders.add(scene.order);
    });
    
    // Check for gaps in scene order
    const sortedOrders = Array.from(orders).sort((a, b) => a - b);
    for (let i = 0; i < sortedOrders.length - 1; i++) {
      if (sortedOrders[i + 1] - sortedOrders[i] > 1) {
        errors.push(`Gap in scene order: ${sortedOrders[i]} -> ${sortedOrders[i + 1]}`);
      }
    }
    
    if (errors.length > 0) {
      console.error('[StoryboardManager] Configuration errors:', errors);
      throw new Error(`Invalid storyboard configuration: ${errors.join(', ')}`);
    }
  }
  
  /**
   * Get debug info
   */
  public getDebugInfo(): {
    initialized: boolean;
    activeScene: string | null;
    scenes: Array<{ id: string; order: number; lifecycle: string }>;
    elements: number;
    effects: number;
  } {
    return {
      initialized: this.isInitialized,
      activeScene: this.activeSceneId,
      scenes: Array.from(this.sceneControllers.values()).map(controller => ({
        id: controller.config.id,
        order: controller.config.order,
        lifecycle: controller.lifecycle,
      })),
      elements: this.elementRegistry.getAll().length,
      effects: this.effectRegistry.getAll().length,
    };
  }
}

