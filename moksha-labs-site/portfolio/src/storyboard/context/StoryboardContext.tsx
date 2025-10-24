/**
 * Storyboard Context
 * 
 * Provides StoryboardManager instance to React components via context
 */

'use client';

import { createContext, useContext, ReactNode, useRef, useEffect, useState } from 'react';
import { StoryboardManager } from '../core/StoryboardManager';
import type { StoryboardConfig } from '../types/Scene.types';

interface StoryboardContextValue {
  storyboard: StoryboardManager | null;
}

const StoryboardContext = createContext<StoryboardContextValue>({ storyboard: null });

interface StoryboardProviderProps {
  children: ReactNode;
  config: StoryboardConfig;
}

export function StoryboardProvider({ children, config }: StoryboardProviderProps) {
  const storyboardRef = useRef<StoryboardManager | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize storyboard
    const storyboard = new StoryboardManager(config);
    storyboard.initialize();
    storyboardRef.current = storyboard;
    setIsInitialized(true);

    if (config.debug) {
      console.log('✨ StoryboardManager initialized:', storyboard.getDebugInfo());
    }

    // Cleanup
    return () => {
      storyboard.cleanup();
      storyboardRef.current = null;
    };
  }, [config]);

  return (
    <StoryboardContext.Provider value={{ storyboard: storyboardRef.current }}>
      {children}
    </StoryboardContext.Provider>
  );
}

export function useStoryboardContext() {
  return useContext(StoryboardContext);
}

