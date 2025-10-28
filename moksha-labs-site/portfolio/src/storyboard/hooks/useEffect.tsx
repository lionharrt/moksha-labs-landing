/**
 * useEffect Hook (for storyboard effects, not React useEffect!)
 * 
 * React hook for applying effects to elements.
 */

import { useEffect as useReactEffect } from 'react';
import { EffectInstance } from '../types/Effect.types';
import { useStoryboard } from './useScene';
import { useElement } from './useElement';

export interface UseStoryboardEffectOptions {
  /** Effect ID from registry */
  effectId: string;
  
  /** Target element ID */
  targetId: string;
  
  /** Effect parameters */
  params?: Record<string, any>;
  
  /** Current progress (0-1) */
  progress: number;
  
  /** Whether effect is active */
  enabled?: boolean;
}

/**
 * Hook for applying effects to elements
 * Automatically creates and cleans up effect instances
 */
export function useStoryboardEffect(options: UseStoryboardEffectOptions): void {
  const { effectId, targetId, params, progress, enabled = true } = options;
  const storyboard = useStoryboard();
  const { state: elementState, updateState } = useElement(targetId);
  
  useReactEffect(() => {
    if (!enabled || !elementState) return;
    
    const effectRegistry = storyboard.getEffectRegistry();
    if (!effectRegistry) return;
    
    // Create effect instance
    let instance: EffectInstance;
    try {
      instance = effectRegistry.createInstance(effectId, targetId, params);
    } catch (error) {
      console.error(`[useStoryboardEffect] Failed to create instance:`, error);
      return;
    }
    
    // Apply effect on progress change
    const applyEffect = () => {
      if (!elementState) return;
      
      const newState = effectRegistry.applyInstance(
        instance,
        elementState,
        progress,
        1 / 60 // Assume 60fps
      );
      
      updateState(newState);
    };
    
    applyEffect();
    
    // Cleanup on unmount
    return () => {
      // Effect instance cleanup handled by registry
    };
  }, [effectId, targetId, params, progress, enabled, elementState, storyboard, updateState]);
}

/**
 * Hook for composing multiple effects on one element
 * 
 * Note: This function is currently a placeholder due to React hooks rules.
 * To use multiple effects, call useStoryboardEffect individually for each effect.
 */
export function useComposedEffects(
  targetId: string,
  effects: Array<{
    effectId: string;
    params?: Record<string, any>;
    progress: number;
    enabled?: boolean;
  }>
): void {
  // Placeholder - users should call useStoryboardEffect directly for each effect
  // This avoids the React hooks rules violation
  if (process.env.NODE_ENV === 'development' && effects.length > 0) {
    console.warn(
      'useComposedEffects is a placeholder. Call useStoryboardEffect individually for each effect to avoid hooks rules violations.'
    );
  }
}

