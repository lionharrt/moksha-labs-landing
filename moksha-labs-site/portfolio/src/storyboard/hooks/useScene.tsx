/**
 * useScene Hook
 * 
 * React hook for scene components to access scene state and lifecycle.
 */

import { useEffect, useRef, useState } from 'react';
import { SceneConfig } from '../types/Scene.types';
import { mapPhase } from '../utils/phaseMapper';

export interface UseSceneReturn {
  /** Reference to scene DOM element */
  sceneRef: React.RefObject<HTMLElement>;
  
  /** Current scroll progress through scene (0-1) */
  progress: number;
  
  /** Get progress for a specific phase (0-1) */
  getPhaseProgress: (phaseName: string) => number;
  
  /** Whether scene is currently active (in viewport) */
  isActive: boolean;
  
  /** Current active phase names */
  activePhases: string[];
}

/**
 * Hook for scene components
 * Provides scene ref, progress tracking, and phase mapping
 */
export function useScene(config: SceneConfig): UseSceneReturn {
  const sceneRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [activePhases, setActivePhases] = useState<string[]>([]);
  
  // This is a placeholder - actual integration happens via StoryboardManager
  // The scene controller will update these values
  
  const getPhaseProgress = (phaseName: string): number => {
    const phase = config.phases[phaseName];
    if (!phase) {
      console.warn(`[useScene] Phase not found: ${phaseName}`);
      return 0;
    }
    
    return mapPhase(progress, phase.start, phase.end);
  };
  
  // Update active phases when progress changes
  useEffect(() => {
    const active: string[] = [];
    
    Object.entries(config.phases).forEach(([name, phase]) => {
      if (phase) {
        const phaseProgress = mapPhase(progress, phase.start, phase.end);
        if (phaseProgress > 0 && phaseProgress < 1) {
          active.push(name);
        }
      }
    });
    
    setActivePhases(active);
  }, [progress, config.phases]);
  
  return {
    sceneRef,
    progress,
    getPhaseProgress,
    isActive,
    activePhases,
  };
}

/**
 * Hook to access storyboard manager from context
 * (To be implemented when integrating with StoryboardManager)
 */
export function useStoryboard() {
  // This will access StoryboardManager from React context
  // For now, return placeholder
  return {
    getScene: (sceneId: string) => null,
    getActiveScene: () => null,
    transitionToScene: (sceneId: string) => {},
    getElementRegistry: () => null,
    getEffectRegistry: () => null,
  };
}

