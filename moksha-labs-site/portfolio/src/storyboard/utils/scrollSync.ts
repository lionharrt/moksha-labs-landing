/**
 * Scroll Synchronization Utilities
 * 
 * Helpers for coordinating ScrollTrigger instances and scroll-based state
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface ScrollTriggerConfig {
  /** Element to trigger on */
  trigger: string | HTMLElement;
  
  /** Start position (e.g., 'top top', 'center center') */
  start?: string;
  
  /** End position (e.g., 'bottom top', '+=100%') */
  end?: string;
  
  /** Scrub duration for smooth animations */
  scrub?: number | boolean;
  
  /** Pin element during scroll */
  pin?: boolean;
  
  /** Markers for debugging */
  markers?: boolean;
  
  /** Callback on progress update */
  onUpdate?: (self: ScrollTrigger) => void;
  
  /** Callback on enter */
  onEnter?: (self: ScrollTrigger) => void;
  
  /** Callback on leave */
  onLeave?: (self: ScrollTrigger) => void;
  
  /** Callback on enter back */
  onEnterBack?: (self: ScrollTrigger) => void;
  
  /** Callback on leave back */
  onLeaveBack?: (self: ScrollTrigger) => void;
  
  /** Additional GSAP ScrollTrigger properties */
  [key: string]: any;
}

/**
 * Create a ScrollTrigger instance with defaults
 * Returns cleanup function
 */
export function createScrollTrigger(
  config: ScrollTriggerConfig
): () => void {
  const instance = ScrollTrigger.create({
    start: 'top top',
    end: '+=100%',
    scrub: true,
    ...config,
  });
  
  // Return cleanup function
  return () => {
    instance.kill();
  };
}

/**
 * Create a scene-based ScrollTrigger with phase-mapped callbacks
 * This is the recommended pattern for scene-based animations
 */
export function createSceneScrollTrigger(
  sceneId: string,
  element: HTMLElement,
  config: {
    duration?: string;
    pin?: boolean;
    scrub?: number | boolean;
    onProgress?: (progress: number) => void;
    onEnter?: () => void;
    onLeave?: () => void;
  }
): () => void {
  const instance = ScrollTrigger.create({
    trigger: element,
    start: 'top top',
    end: config.duration || '+=100%',
    pin: config.pin ?? false,
    scrub: config.scrub ?? true,
    markers: false,
    id: sceneId,
    
    onUpdate: (self) => {
      config.onProgress?.(self.progress);
    },
    
    onEnter: () => {
      config.onEnter?.();
    },
    
    onLeave: () => {
      config.onLeave?.();
    },
  });
  
  return () => {
    instance.kill();
  };
}

/**
 * Get current scroll progress for a specific trigger
 */
export function getScrollProgress(triggerId: string): number {
  const trigger = ScrollTrigger.getById(triggerId);
  return trigger ? trigger.progress : 0;
}

/**
 * Refresh all ScrollTriggers
 * Useful after layout changes or resizes
 */
export function refreshScrollTriggers(): void {
  ScrollTrigger.refresh();
}

/**
 * Kill all ScrollTriggers (cleanup)
 */
export function killAllScrollTriggers(): void {
  ScrollTrigger.getAll().forEach(st => st.kill());
}

/**
 * Get all active ScrollTriggers
 */
export function getActiveScrollTriggers(): ScrollTrigger[] {
  return ScrollTrigger.getAll();
}

/**
 * Scroll to a specific element with smooth animation
 */
export function scrollToElement(
  element: string | HTMLElement,
  options: {
    duration?: number;
    offset?: number;
    ease?: string;
    onComplete?: () => void;
  } = {}
): void {
  const target = typeof element === 'string' 
    ? document.querySelector(element) 
    : element;
  
  if (!target) {
    console.warn(`scrollToElement: Element not found`, element);
    return;
  }
  
  gsap.to(window, {
    duration: options.duration ?? 1,
    scrollTo: {
      y: target,
      offsetY: options.offset ?? 0,
    },
    ease: options.ease ?? 'power2.inOut',
    onComplete: options.onComplete,
  });
}

/**
 * Batch ScrollTrigger updates for performance
 * Useful when updating multiple triggers at once
 */
export function batchScrollTriggerUpdate(callback: () => void): void {
  ScrollTrigger.batch('.scene', {
    onEnter: callback,
    onLeave: callback,
    onEnterBack: callback,
    onLeaveBack: callback,
  });
}

/**
 * Create a scroll-linked timeline
 * Timeline progress is directly linked to scroll progress
 */
export function createScrollTimeline(
  config: ScrollTriggerConfig & {
    timeline: gsap.core.Timeline;
  }
): () => void {
  const { timeline, ...scrollConfig } = config;
  
  const instance = ScrollTrigger.create({
    ...scrollConfig,
    animation: timeline,
  });
  
  return () => {
    instance.kill();
    timeline.kill();
  };
}

/**
 * Normalize scroll position to 0-1 range for a specific element
 */
export function normalizeScrollPosition(
  element: HTMLElement,
  scrollY?: number
): number {
  const y = scrollY ?? window.scrollY;
  const rect = element.getBoundingClientRect();
  const elementTop = rect.top + y;
  const elementHeight = rect.height;
  const windowHeight = window.innerHeight;
  
  // Progress from element top entering viewport to bottom leaving
  const scrollRange = elementHeight + windowHeight;
  const scrolled = y + windowHeight - elementTop;
  
  return Math.max(0, Math.min(1, scrolled / scrollRange));
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: HTMLElement, threshold = 0): boolean {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  
  return (
    rect.top <= windowHeight * (1 - threshold) &&
    rect.bottom >= windowHeight * threshold
  );
}

/**
 * Get scroll velocity (pixels per second)
 * Useful for velocity-based effects
 */
export function getScrollVelocity(): number {
  return ScrollTrigger.getById('main')?.getVelocity() ?? 0;
}

/**
 * Create a scroll-based observer for element visibility
 * More performant than listening to scroll events
 */
export function createScrollObserver(
  element: HTMLElement,
  callbacks: {
    onEnter?: () => void;
    onLeave?: () => void;
    threshold?: number;
  }
): () => void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callbacks.onEnter?.();
        } else {
          callbacks.onLeave?.();
        }
      });
    },
    {
      threshold: callbacks.threshold ?? 0.1,
    }
  );
  
  observer.observe(element);
  
  return () => {
    observer.disconnect();
  };
}

/**
 * Smooth scroll configuration for Lenis integration
 */
export interface LenisScrollConfig {
  duration?: number;
  easing?: (t: number) => number;
  smooth?: boolean;
  direction?: 'vertical' | 'horizontal';
  gestureDirection?: 'vertical' | 'horizontal' | 'both';
  smoothTouch?: boolean;
  touchMultiplier?: number;
}

/**
 * Sync GSAP ScrollTrigger with Lenis smooth scroll
 * Call this after initializing Lenis
 */
export function syncWithLenis(lenis: any): () => void {
  // Update ScrollTrigger on each Lenis scroll frame
  lenis.on('scroll', ScrollTrigger.update);
  
  // Tell GSAP to use Lenis's scroll values
  gsap.ticker.add((time: number) => {
    lenis.raf(time * 1000);
  });
  
  // Disable lag smoothing for precise sync
  gsap.ticker.lagSmoothing(0);
  
  // Cleanup function
  return () => {
    lenis.off('scroll', ScrollTrigger.update);
    gsap.ticker.lagSmoothing(33, 16); // Restore defaults
  };
}

