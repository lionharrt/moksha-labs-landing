/**
 * useScrollReveal Hook
 * 
 * Creates element-level scroll animations that trigger when the element
 * enters the viewport (not when the scene enters).
 */

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ScrollRevealConfig {
  start?: string;
  end?: string;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  scrub?: boolean | number;
  toggleActions?: string;
  stagger?: number;
  markers?: boolean;
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  config: ScrollRevealConfig = {}
) {
  const elementRef = useRef<T>(null);

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const {
      start = 'top 80%',
      end = 'top 20%',
      from = { opacity: 0, y: 50 },
      to = { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
      scrub = false,
      toggleActions = 'play reverse play reverse',
      markers = false,
    } = config;

    // Set initial state immediately
    gsap.set(element, from);

    // Create animation with ScrollTrigger
    const animation = gsap.to(element, {
      ...to,
      scrollTrigger: {
        trigger: element,
        start,
        end,
        scrub,
        toggleActions,
        markers,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      animation.kill();
    };
  }, [JSON.stringify(config)]);

  return elementRef;
}

export function useScrollRevealBatch(
  config: ScrollRevealConfig & { selector?: string } = {}
) {
  const parentRef = useRef<HTMLDivElement>(null);
  const childClass = config.selector || 'scroll-reveal-item';

  useLayoutEffect(() => {
    const parent = parentRef.current;
    if (!parent) return;

    const children = parent.querySelectorAll(`.${childClass}`);
    if (children.length === 0) return;

    const {
      start = 'top 80%',
      end = 'top 20%',
      from = { opacity: 0, y: 50 },
      to = { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      scrub = false,
      stagger = 0.1,
      toggleActions = 'play reverse play reverse',
      markers = false,
    } = config;

    // Set initial state
    gsap.set(children, from);

    // Create staggered animation
    const animation = gsap.to(children, {
      ...to,
      stagger,
      scrollTrigger: {
        trigger: parent,
        start,
        end,
        scrub,
        toggleActions,
        markers,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      animation.kill();
    };
  }, [childClass, JSON.stringify(config)]);

  return { parentRef, childClass };
}

export function useParallax(config: { speed?: number; direction?: 'up' | 'down' } = {}) {
  const elementRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const speed = config.speed ?? 0.5;
    const direction = config.direction ?? 'up';
    const multiplier = direction === 'up' ? -1 : 1;

    const animation = gsap.to(element, {
      y: () => multiplier * window.innerHeight * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      animation.kill();
    };
  }, [config.speed, config.direction]);

  return elementRef;
}
