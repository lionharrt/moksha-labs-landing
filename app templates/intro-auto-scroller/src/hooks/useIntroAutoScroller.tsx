/**
 * useIntroAutoScroller Hook
 * 
 * Complete intro animation + auto-scroll solution for demo pages
 * 
 * @example
 * ```tsx
 * const { PlayButton, IntroAnimation, scrollContainerRef, isScrolling } = useIntroAutoScroller({
 *   companyName: "Moksha Labs",
 *   tagline: "Where artistry meets code",
 *   clientLogoUrl: "/client-logo.png",
 * });
 * 
 * return (
 *   <>
 *     <PlayButton />
 *     <IntroAnimation />
 *     <main ref={scrollContainerRef}>
 *       // Your content
 *     </main>
 *   </>
 * );
 * ```
 */

import { useState, useRef, useCallback } from 'react';
import { TitleAnimation } from '../components/TitleAnimation';
import type { IntroAutoScrollerConfig, IntroAutoScrollerReturn } from '../types';

export function useIntroAutoScroller(config: IntroAutoScrollerConfig): IntroAutoScrollerReturn {
  const {
    clientLogoUrl,
    autoScroll = {},
    onComplete,
  } = config;

  const {
    scrollSpeed = 5819,
    pauseAtBottom = 2000,
    returnDuration = 1500,
  } = autoScroll;

  const [showPlayButton, setShowPlayButton] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const scrollContainerRef = useRef<HTMLElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);

  const start = useCallback(() => {
    setShowPlayButton(false);
    setShowAnimation(true);
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused(prev => {
      isPausedRef.current = !prev;
      return !prev;
    });
  }, []);

  const handleAnimationComplete = useCallback(() => {
    setShowAnimation(false);
    
    // Fade in demo content
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
        
        // Wait for content to be visible, then start auto-scroll
        setTimeout(() => {
          startAutoScroll();
        }, 300);
      }
    }, 100);
  }, []);

  const startAutoScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setIsScrolling(true);
    setIsPaused(false);
    
    container.style.pointerEvents = 'none';

    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    const totalScrollDistance = scrollHeight - clientHeight;
    
    const duration = (totalScrollDistance / clientHeight) * scrollSpeed;

    let startTime: number | null = null;
    let pausedAt: number | null = null;
    let totalPausedTime = 0;

    const animate = (currentTime: number) => {
      if (isPausedRef.current) {
        if (!pausedAt) {
          pausedAt = currentTime;
        }
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      
      if (pausedAt !== null) {
        totalPausedTime += (currentTime - pausedAt);
        pausedAt = null;
      }

      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime - totalPausedTime;
      const progress = Math.min(elapsed / duration, 1);
      
      container.scrollTop = progress * totalScrollDistance;

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          scrollBackToTop();
        }, pauseAtBottom);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [scrollSpeed, pauseAtBottom]);

  const scrollBackToTop = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let startScrollTop = container.scrollTop;
    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / returnDuration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 3);
      container.scrollTop = startScrollTop * (1 - easeOut);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        container.style.pointerEvents = 'auto';
        setIsScrolling(false);
        onComplete?.();
      }
    };

    requestAnimationFrame(animate);
  }, [returnDuration, onComplete]);

  // Play Button Component
  const PlayButton = useCallback(() => {
    if (!showPlayButton) return null;

    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-black via-black to-gray-900 flex items-center justify-center">
        <button
          onClick={start}
          className="group relative focus:outline-none focus:ring-4 focus:ring-white/20 rounded-full"
          aria-label="Play demo"
        >
          <div className="absolute inset-0 animate-ping rounded-full bg-white/10 scale-150" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-0 animate-ping rounded-full bg-white/5 scale-[2]" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
          <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-100 to-gray-300 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-all duration-500 scale-[2]" />
          
          <div className="relative w-28 h-28 bg-gradient-to-br from-white to-gray-100 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.3)] group-hover:shadow-[0_0_80px_rgba(255,255,255,0.5)] group-hover:scale-105 transition-all duration-300 border border-white/20">
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/50 to-transparent" />
            <svg className="relative w-11 h-11 text-black ml-1.5 drop-shadow-sm group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-center animate-pulse" style={{ animationDuration: '2s' }}>
            <p className="text-white/90 text-base font-light tracking-wider uppercase text-sm mb-1">Click to Play</p>
            <div className="flex items-center justify-center gap-1 text-white/40 text-xs">
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>Demo Experience</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
            </div>
          </div>
        </button>
      </div>
    );
  }, [showPlayButton, start]);

  // Intro Animation Component
  const IntroAnimation = useCallback(() => {
    if (!showAnimation) return null;

    return (
      <TitleAnimation
        companyName="Moksha Labs"
        tagline="Where artistry meets code"
        clientLogoUrl={clientLogoUrl}
        onComplete={handleAnimationComplete}
      />
    );
  }, [showAnimation, clientLogoUrl, handleAnimationComplete]);

  return {
    PlayButton,
    IntroAnimation,
    isPlaying: showAnimation,
    isScrolling,
    isPaused,
    start,
    togglePause,
    scrollContainerRef,
  };
}

