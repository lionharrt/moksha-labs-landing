'use client';

import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Create a spacer element to enable scrolling (invisible)
    const spacer = document.createElement('div');
    spacer.id = 'scroll-spacer';
    spacer.style.cssText = 'height: 500vh; width: 1px; position: absolute; opacity: 0; pointer-events: none;';
    document.body.appendChild(spacer);

    // Initialize Lenis with default window scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Use GSAP ticker to drive Lenis
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Track scroll progress (0-1)
    lenis.on('scroll', ({ progress }: { progress: number }) => {
      setProgress(progress);
    });

    // Cleanup
    return () => {
      lenis.destroy();
      gsap.ticker.remove(tickerCallback);
      ScrollTrigger.getAll().forEach(t => t.kill());
      if (document.body.contains(spacer)) {
        document.body.removeChild(spacer);
      }
    };
  }, []);

  return progress;
}

