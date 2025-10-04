/**
 * Lenis smooth scroll hook
 * Industry-standard smooth scrolling
 */

'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

interface LenisOptions {
  duration?: number;
  easing?: (t: number) => number;
  smooth?: boolean;
}

export function useLenis(options: LenisOptions = {}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: options.duration || 1.2,
      easing: options.easing || ((t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))),
      smooth: options.smooth !== false,
    });

    lenisRef.current = lenis;

    // Animation loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    console.log('✨ Lenis smooth scroll initialized');

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [options.duration, options.smooth]);

  return lenisRef;
}

