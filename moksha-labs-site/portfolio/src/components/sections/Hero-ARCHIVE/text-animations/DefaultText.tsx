/**
 * Default Text Animation
 * 
 * Simple fade in/out with vertical movement
 * Driven by animationProgress from Hero scroll timeline
 */

'use client';

import { RefObject, useEffect } from 'react';
import gsap from 'gsap';

interface DefaultTextProps {
  titleRef: RefObject<HTMLHeadingElement>;
  subtitleRef: RefObject<HTMLParagraphElement>;
  animationProgress: number; // 0-1 from Hero's phase mapping
}

export function DefaultText({ titleRef, subtitleRef, animationProgress }: DefaultTextProps) {
  // Apply animations based on scroll progress
  useEffect(() => {
    if (!titleRef.current || !subtitleRef.current) return;

    // Map progress to fade in/out phases
    // 0-0.3: Fade in
    // 0.3-0.7: Hold
    // 0.7-1.0: Fade out
    
    let opacity = 0;
    let y = 20;
    
    if (animationProgress < 0.3) {
      // Fade in phase
      const fadeInProgress = animationProgress / 0.3;
      opacity = fadeInProgress;
      y = 20 * (1 - fadeInProgress);
    } else if (animationProgress < 0.7) {
      // Hold phase
      opacity = 1;
      y = 0;
    } else {
      // Fade out phase
      const fadeOutProgress = (animationProgress - 0.7) / 0.3;
      opacity = 1 - fadeOutProgress;
      y = -50 * fadeOutProgress;
    }
    
    gsap.set([titleRef.current, subtitleRef.current], {
      opacity,
      y,
    });
  }, [animationProgress, titleRef, subtitleRef]);

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-8 text-center">
      <h1 
        ref={titleRef}
        className="text-[clamp(4rem,10vw,8rem)] font-bold leading-none tracking-tight mb-8 text-white"
        style={{ opacity: 0 }}
      >
        Moksha Labs
      </h1>
      <p 
        ref={subtitleRef}
        className="text-[clamp(1.25rem,2.5vw,2rem)] text-gray-300 font-light"
        style={{ opacity: 0 }}
      >
        Where artistry meets code
      </p>
    </div>
  );
}
