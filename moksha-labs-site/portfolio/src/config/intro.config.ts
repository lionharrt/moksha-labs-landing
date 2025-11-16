/**
 * Intro Configuration
 *
 * Configure the movie-style intro sequence settings
 */

export interface IntroConfiguration {
  /** Duration of intro animation in milliseconds */
  duration: number;
  /** Whether to auto-unlock scroll when intro completes */
  autoUnlock: boolean;
}

/**
 * Default intro configuration
 * Can be overridden in page.tsx or environment variables
 */
export const INTRO_CONFIG: IntroConfiguration = {
  // 2 minutes = 120000ms (configurable)
  duration: 5000,

  // Automatically unlock scroll when intro completes
  autoUnlock: true,
};

/**
 * Helper to get intro duration from env or config
 */
export function getIntroDuration(): number {
  if (typeof window !== "undefined") {
    // Check for window override (useful for debugging)
    const override = (window as any).__INTRO_DURATION__;
    if (override) return override;
  }

  return INTRO_CONFIG.duration;
}

/**
 * Helper to set intro duration at runtime (for debugging)
 * Usage in console: setIntroDuration(30000) // 30 seconds
 */
if (typeof window !== "undefined") {
  (window as any).setIntroDuration = (duration: number) => {
    (window as any).__INTRO_DURATION__ = duration;
    console.log(`[Intro] Duration set to ${duration}ms (${duration / 1000}s)`);
  };
}
