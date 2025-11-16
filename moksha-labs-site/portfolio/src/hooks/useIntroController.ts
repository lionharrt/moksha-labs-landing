"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface IntroConfig {
  /** Duration of intro animation in milliseconds */
  duration: number;
  /** Whether to auto-unlock scroll when intro completes */
  autoUnlock: boolean;
}

export interface IntroState {
  /** Current phase of the intro */
  phase: "playing" | "complete";
  /** Progress of intro animation (0-1) */
  progress: number;
  /** Whether scroll is currently locked */
  scrollLocked: boolean;
}

export interface IntroController {
  /** Current intro state */
  state: IntroState;
  /** Complete the intro and unlock scroll */
  completeIntro: () => void;
  /** Reset intro to beginning (for testing) */
  resetIntro: () => void;
}

const DEFAULT_CONFIG: IntroConfig = {
  duration: 120000, // 2 minutes
  autoUnlock: true,
};

/**
 * Hook to manage movie-style intro sequence
 *
 * Features:
 * - Timer-based progress (0-1 over configured duration)
 * - Scroll lock during intro
 * - Auto-unlock on completion
 * - No persistence (replays on refresh)
 */
export function useIntroController(
  config: Partial<IntroConfig> = {}
): IntroController {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  const [phase, setPhase] = useState<"playing" | "complete">("playing");
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Progress animation loop
  useEffect(() => {
    if (phase === "complete") {
      // Already complete, don't run timer
      return;
    }

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const newProgress = Math.min(elapsed / finalConfig.duration, 1);

      progressRef.current = newProgress;
      setProgress(newProgress);

      if (newProgress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Intro complete
        if (finalConfig.autoUnlock) {
          setPhase("complete");
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [phase, finalConfig.duration, finalConfig.autoUnlock]);

  const completeIntro = useCallback(() => {
    setPhase("complete");
    setProgress(1);
    progressRef.current = 1;

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const resetIntro = useCallback(() => {
    setPhase("playing");
    setProgress(0);
    progressRef.current = 0;
    startTimeRef.current = null;

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  return {
    state: {
      phase,
      progress,
      scrollLocked: phase === "playing",
    },
    completeIntro,
    resetIntro,
  };
}
