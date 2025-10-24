/**
 * useScene Hook
 * 
 * React hook for scene components to access scene state and lifecycle.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { SceneConfig } from '../types/Scene.types';
import { mapPhase } from '../utils/phaseMapper';
import { useStoryboardContext } from '../context/StoryboardContext';

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
 * Connects to SceneController for real-time updates
 */
export function useScene(config: SceneConfig): UseSceneReturn {
  const sceneRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [activePhases, setActivePhases] = useState<string[]>([]);
  const { storyboard } = useStoryboardContext();
  
  // Subscribe to scene controller updates
  useEffect(() => {
    if (!storyboard) {
      console.warn('[useScene] Storyboard not initialized yet');
      return;
    }

    const controller = storyboard.getScene(config.id);
    
    if (!controller) {
      console.warn(`[useScene] Scene controller not found: ${config.id}`);
      return;
    }

    // Subscribe to progress updates
    const unsubscribeProgress = () => {
      controller.on('progress', (data) => {
        setProgress(data.progress);
        
        // Update active phases
        const active: string[] = [];
        Object.entries(data.phaseProgress).forEach(([name, prog]) => {
          if (prog > 0 && prog < 1) {
            active.push(name);
          }
        });
        setActivePhases(active);
      });
    };

    // Subscribe to enter/exit events
    controller.on('enter', () => setIsActive(true));
    controller.on('exit', () => setIsActive(false));

    unsubscribeProgress();

    return () => {
      // Cleanup subscriptions handled by controller
    };
  }, [storyboard, config.id]);
  
  const getPhaseProgress = useCallback((phaseName: string): number => {
    const phase = config.phases[phaseName];
    if (!phase) {
      console.warn(`[useScene] Phase not found: ${phaseName}`);
      return 0;
    }
    
    return mapPhase(progress, phase.start, phase.end);
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
 */
export function useStoryboard() {
  const { storyboard } = useStoryboardContext();
  
  return {
    getScene: (sceneId: string) => storyboard?.getScene(sceneId) || null,
    getActiveScene: () => storyboard?.getActiveScene() || null,
    transitionToScene: (sceneId: string) => storyboard?.transitionToScene(sceneId),
    getElementRegistry: () => storyboard?.getElementRegistry() || null,
    getEffectRegistry: () => storyboard?.getEffectRegistry() || null,
  };
}
