export interface IntroConfig {
  /** Client logo URL to display after "Moksha Labs presents" */
  clientLogoUrl?: string;
}

export interface AutoScrollConfig {
  /** Duration in ms per viewport height (default: 5819) */
  scrollSpeed?: number;
  /** Pause duration at bottom in ms (default: 2000) */
  pauseAtBottom?: number;
  /** Return to top duration in ms (default: 1500) */
  returnDuration?: number;
}

export interface IntroAutoScrollerConfig extends IntroConfig {
  /** Auto-scroll configuration */
  autoScroll?: AutoScrollConfig;
  /** Callback when entire sequence completes */
  onComplete?: () => void;
}

export interface IntroAutoScrollerReturn {
  /** Play button overlay component */
  PlayButton: React.FC;
  /** Title animation component */
  IntroAnimation: React.FC;
  /** Whether intro animation is playing */
  isPlaying: boolean;
  /** Whether auto-scroll is active */
  isScrolling: boolean;
  /** Whether auto-scroll is paused */
  isPaused: boolean;
  /** Start the intro sequence */
  start: () => void;
  /** Pause/resume auto-scroll */
  togglePause: () => void;
  /** Ref to attach to scroll container */
  scrollContainerRef: React.RefObject<HTMLElement>;
}

