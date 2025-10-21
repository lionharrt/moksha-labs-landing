/**
 * useElement Hook
 * 
 * React hook for accessing and updating element state from components.
 */

import { useEffect, useState, useCallback } from 'react';
import { ElementState } from '../types/Element.types';
import { useStoryboard } from './useScene';

export interface UseElementReturn {
  /** Current element state */
  state: ElementState | null;
  
  /** Update element state */
  updateState: (newState: Partial<ElementState>) => void;
  
  /** Reset element to initial state */
  reset: () => void;
  
  /** Whether element is currently visible */
  isVisible: boolean;
}

/**
 * Hook for accessing element state
 * Subscribes to element updates and provides update function
 */
export function useElement(elementId: string): UseElementReturn {
  const storyboard = useStoryboard();
  const [state, setState] = useState<ElementState | null>(null);
  
  // Subscribe to element state changes
  useEffect(() => {
    const registry = storyboard.getElementRegistry();
    if (!registry) return;
    
    // Get initial state
    const initialState = registry.getState(elementId);
    if (initialState) {
      setState(initialState);
    }
    
    // Subscribe to updates
    const unsubscribe = registry.subscribe(elementId, (newState) => {
      setState(newState);
    });
    
    return unsubscribe;
  }, [elementId, storyboard]);
  
  // Update state
  const updateState = useCallback((newState: Partial<ElementState>) => {
    const registry = storyboard.getElementRegistry();
    if (registry) {
      registry.setState(elementId, newState);
    }
  }, [elementId, storyboard]);
  
  // Reset to initial state
  const reset = useCallback(() => {
    const registry = storyboard.getElementRegistry();
    if (registry) {
      registry.reset(elementId);
    }
  }, [elementId, storyboard]);
  
  return {
    state,
    updateState,
    reset,
    isVisible: state?.visible ?? false,
  };
}

