/**
 * Element Registry
 * 
 * Central registry for all elements (persistent and scene-scoped).
 * Manages element state and provides subscription mechanism for updates.
 */

import { 
  ElementConfig, 
  ElementState, 
  ElementRegistry as IElementRegistry 
} from '../types/Element.types';

export class ElementRegistry implements IElementRegistry {
  private configs: Map<string, ElementConfig>;
  private states: Map<string, ElementState>;
  private subscribers: Map<string, Set<(state: ElementState) => void>>;
  
  constructor() {
    this.configs = new Map();
    this.states = new Map();
    this.subscribers = new Map();
  }
  
  /**
   * Register new element
   */
  public register(config: ElementConfig): void {
    if (this.configs.has(config.id)) {
      console.warn(`[ElementRegistry] Element already registered: ${config.id}`);
      return;
    }
    
    this.configs.set(config.id, config);
    this.states.set(config.id, { ...config.initialState });
  }
  
  /**
   * Unregister element
   */
  public unregister(elementId: string): void {
    this.configs.delete(elementId);
    this.states.delete(elementId);
    this.subscribers.delete(elementId);
  }
  
  /**
   * Get element config
   */
  public getConfig(elementId: string): ElementConfig | undefined {
    return this.configs.get(elementId);
  }
  
  /**
   * Get current state
   */
  public getState(elementId: string): ElementState | undefined {
    return this.states.get(elementId);
  }
  
  /**
   * Update element state
   */
  public setState(elementId: string, state: Partial<ElementState>): void {
    const currentState = this.states.get(elementId);
    
    if (!currentState) {
      console.warn(`[ElementRegistry] Element not found: ${elementId}`);
      return;
    }
    
    // Merge state
    const newState: ElementState = {
      ...currentState,
      ...state,
    };
    
    this.states.set(elementId, newState);
    
    // Notify subscribers
    this.notifySubscribers(elementId, newState);
  }
  
  /**
   * Get all elements for a scene
   */
  public getSceneElements(sceneId: string): ElementConfig[] {
    return Array.from(this.configs.values()).filter(config =>
      config.scenes.includes(sceneId)
    );
  }
  
  /**
   * Get all persistent elements
   */
  public getPersistentElements(): ElementConfig[] {
    return Array.from(this.configs.values()).filter(config =>
      config.scope === 'global'
    );
  }
  
  /**
   * Subscribe to state changes
   */
  public subscribe(
    elementId: string,
    callback: (state: ElementState) => void
  ): () => void {
    if (!this.subscribers.has(elementId)) {
      this.subscribers.set(elementId, new Set());
    }
    
    this.subscribers.get(elementId)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers.get(elementId)?.delete(callback);
    };
  }
  
  /**
   * Get all registered elements
   */
  public getAll(): ElementConfig[] {
    return Array.from(this.configs.values());
  }
  
  /**
   * Reset element to initial state
   */
  public reset(elementId: string): void {
    const config = this.configs.get(elementId);
    
    if (!config) {
      console.warn(`[ElementRegistry] Element not found: ${elementId}`);
      return;
    }
    
    this.setState(elementId, config.initialState);
  }
  
  /**
   * Reset all elements to initial state
   */
  public resetAll(): void {
    this.configs.forEach((config, id) => {
      this.reset(id);
    });
  }
  
  /**
   * Notify subscribers of state change
   */
  private notifySubscribers(elementId: string, state: ElementState): void {
    this.subscribers.get(elementId)?.forEach(callback => {
      callback(state);
    });
  }
  
  /**
   * Get debug info
   */
  public getDebugInfo(): {
    totalElements: number;
    persistentElements: number;
    sceneElements: number;
    activeSubscribers: number;
  } {
    const persistent = this.getPersistentElements().length;
    const total = this.configs.size;
    const subscribers = Array.from(this.subscribers.values()).reduce(
      (sum, set) => sum + set.size,
      0
    );
    
    return {
      totalElements: total,
      persistentElements: persistent,
      sceneElements: total - persistent,
      activeSubscribers: subscribers,
    };
  }
}

