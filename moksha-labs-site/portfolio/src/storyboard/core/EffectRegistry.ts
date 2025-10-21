/**
 * Effect Registry
 * 
 * Central registry for all reusable effects.
 * Manages effect configurations and application functions.
 */

import {
  EffectConfig,
  EffectInstance,
  EffectApplication,
  EffectCategory,
  EffectRegistry as IEffectRegistry,
} from '../types/Effect.types';
import { ElementState } from '../types/Element.types';

export class EffectRegistry implements IEffectRegistry {
  private configs: Map<string, EffectConfig>;
  private applications: Map<string, EffectApplication>;
  private instances: Map<string, EffectInstance>; // instanceId -> instance
  
  constructor() {
    this.configs = new Map();
    this.applications = new Map();
    this.instances = new Map();
  }
  
  /**
   * Register new effect
   */
  public register(config: EffectConfig, application: EffectApplication): void {
    if (this.configs.has(config.id)) {
      console.warn(`[EffectRegistry] Effect already registered: ${config.id}`);
      return;
    }
    
    this.configs.set(config.id, config);
    this.applications.set(config.id, application);
    
    console.log(`[EffectRegistry] Registered effect: ${config.id} (${config.category})`);
  }
  
  /**
   * Unregister effect
   */
  public unregister(effectId: string): void {
    // Cleanup all instances of this effect
    const instancesToRemove: string[] = [];
    this.instances.forEach((instance, instanceId) => {
      if (instance.effectId === effectId) {
        this.cleanupInstance(instanceId);
        instancesToRemove.push(instanceId);
      }
    });
    
    instancesToRemove.forEach(id => this.instances.delete(id));
    
    this.configs.delete(effectId);
    this.applications.delete(effectId);
    
    console.log(`[EffectRegistry] Unregistered effect: ${effectId}`);
  }
  
  /**
   * Get effect config
   */
  public getConfig(effectId: string): EffectConfig | undefined {
    return this.configs.get(effectId);
  }
  
  /**
   * Get effect application
   */
  public getApplication(effectId: string): EffectApplication | undefined {
    return this.applications.get(effectId);
  }
  
  /**
   * Get all effects in category
   */
  public getByCategory(category: EffectCategory): EffectConfig[] {
    return Array.from(this.configs.values()).filter(
      config => config.category === category
    );
  }
  
  /**
   * Create effect instance
   */
  public createInstance(
    effectId: string,
    targetId: string,
    params?: Record<string, any>
  ): EffectInstance {
    const config = this.configs.get(effectId);
    
    if (!config) {
      throw new Error(`[EffectRegistry] Effect not found: ${effectId}`);
    }
    
    // Merge params with defaults
    const mergedParams = {
      ...config.defaultParams,
      ...(params || {}),
    };
    
    // Create instance ID
    const instanceId = `${effectId}-${targetId}-${Date.now()}`;
    
    const instance: EffectInstance = {
      effectId,
      targetId,
      params: mergedParams,
      state: {
        isActive: false,
        progress: 0,
        lastUpdate: Date.now(),
      },
    };
    
    // Initialize effect if needed
    const application = this.applications.get(effectId);
    if (application?.initialize) {
      instance.internalState = application.initialize(null, mergedParams);
    }
    
    this.instances.set(instanceId, instance);
    
    return instance;
  }
  
  /**
   * Apply effect instance
   */
  public applyInstance(
    instance: EffectInstance,
    elementState: ElementState,
    progress: number,
    deltaTime: number
  ): ElementState {
    const application = this.applications.get(instance.effectId);
    
    if (!application) {
      console.warn(`[EffectRegistry] Effect application not found: ${instance.effectId}`);
      return elementState;
    }
    
    // Update instance state
    instance.state.progress = progress;
    instance.state.isActive = progress > 0 && progress < 1;
    instance.state.lastUpdate = Date.now();
    
    // Apply effect
    return application.apply(
      elementState,
      progress,
      instance.params,
      deltaTime
    );
  }
  
  /**
   * Get all registered effects
   */
  public getAll(): EffectConfig[] {
    return Array.from(this.configs.values());
  }
  
  /**
   * Cleanup effect instance
   */
  private cleanupInstance(instanceId: string): void {
    const instance = this.instances.get(instanceId);
    if (!instance) return;
    
    const application = this.applications.get(instance.effectId);
    if (application?.cleanup) {
      application.cleanup(null, instance.internalState);
    }
  }
  
  /**
   * Get debug info
   */
  public getDebugInfo(): {
    totalEffects: number;
    effectsByCategory: Record<EffectCategory, number>;
    activeInstances: number;
  } {
    const effectsByCategory: Record<string, number> = {};
    
    this.configs.forEach(config => {
      effectsByCategory[config.category] = (effectsByCategory[config.category] || 0) + 1;
    });
    
    const activeInstances = Array.from(this.instances.values()).filter(
      instance => instance.state.isActive
    ).length;
    
    return {
      totalEffects: this.configs.size,
      effectsByCategory: effectsByCategory as Record<EffectCategory, number>,
      activeInstances,
    };
  }
}

