'use client';

import { ReactNode, useEffect, useRef, createContext, useContext } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Expose GSAP to window for debugging
if (typeof window !== 'undefined') {
  (window as any).gsap = gsap;
  (window as any).ScrollTrigger = ScrollTrigger;
}

interface LenisContextValue {
  lenis: Lenis | null;
  stopScroll: () => void;
  startScroll: () => void;
}

const LenisContext = createContext<LenisContextValue>({
  lenis: null,
  stopScroll: () => {},
  startScroll: () => {},
});

export function useLenis() {
  return useContext(LenisContext);
}

interface LenisProviderProps {
  children: ReactNode;
  scrollLocked?: boolean;
}

export function LenisProvider({ children, scrollLocked = false }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 2.5, // Even slower, more cinematic
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.3, // MUCH slower wheel scroll for epic feeling
      touchMultiplier: 1.0,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    // Use GSAP ticker to drive Lenis
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);
    
    // Tell ScrollTrigger to use custom scroller
    ScrollTrigger.defaults({ scroller: 'body' });

    // Cleanup
    return () => {
      lenis.destroy();
      gsap.ticker.remove(tickerCallback);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // Handle scroll lock state
  useEffect(() => {
    if (!lenisRef.current) return;

    if (scrollLocked) {
      lenisRef.current.stop();
      // Also disable scroll on body
      document.body.style.overflow = 'hidden';
    } else {
      lenisRef.current.start();
      // Re-enable scroll on body
      document.body.style.overflow = '';
    }
  }, [scrollLocked]);

  const stopScroll = () => {
    if (lenisRef.current) {
      lenisRef.current.stop();
      document.body.style.overflow = 'hidden';
    }
  };

  const startScroll = () => {
    if (lenisRef.current) {
      lenisRef.current.start();
      document.body.style.overflow = '';
    }
  };

  const contextValue: LenisContextValue = {
    lenis: lenisRef.current,
    stopScroll,
    startScroll,
  };

  return (
    <LenisContext.Provider value={contextValue}>
      {children}
    </LenisContext.Provider>
  );
}
