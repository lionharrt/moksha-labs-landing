/**
 * Enhanced Text Animation
 * 
 * Character-by-character fade with blur-to-sharp transition
 * Driven by animationProgress from Hero scroll timeline
 */

'use client';

import { RefObject, useEffect } from 'react';
import gsap from 'gsap';

interface EnhancedTextProps {
  titleRef: RefObject<HTMLHeadingElement>;
  subtitleRef: RefObject<HTMLParagraphElement>;
  animationProgress: number; // 0-1 from Hero's phase mapping
}

export function EnhancedText({ titleRef, subtitleRef, animationProgress }: EnhancedTextProps) {
  const titleText = 'Moksha Labs';
  const subtitleText = 'Where artistry meets code';

  // Apply character animations based on scroll progress
  useEffect(() => {
    if (!titleRef.current || !subtitleRef.current) return;

    const titleChars = titleRef.current.querySelectorAll('.char');
    const subtitleChars = subtitleRef.current.querySelectorAll('.char');

    // Phase mapping within text animation (0-1 progress)
    // 0-0.35: Title reveals character by character
    // 0.2-0.57: Subtitle reveals character by character (overlaps with title)
    // 0.57-0.65: Hold at full visibility
    // 0.65-1.0: Both fade out together
    
    titleChars.forEach((char, i) => {
      let opacity, blur, y;
      
      if (animationProgress < 0.65) {
        // Fade in phase - character by character with stagger
        const charStart = i * 0.03; // Each char starts 3% later
        const charProgress = Math.max(0, Math.min(1, (animationProgress - charStart) / 0.15));
        opacity = charProgress;
        blur = (1 - charProgress) * 10;
        y = (1 - charProgress) * 20;
      } else {
        // Fade out phase - all together
        const fadeOutProgress = (animationProgress - 0.65) / 0.35;
        opacity = 1 - fadeOutProgress;
        blur = fadeOutProgress * 10;
        y = -50 * fadeOutProgress;
      }
      
      gsap.set(char, {
        opacity,
        filter: `blur(${blur}px)`,
        y,
      });
    });

    subtitleChars.forEach((char, i) => {
      let opacity, blur, y;
      
      if (animationProgress < 0.65) {
        // Fade in phase - starts after title, character by character
        // Last char (27) starts at 0.2 + 27*0.01 = 0.47, completes at 0.57
        const charStart = 0.2 + i * 0.01;
        const charProgress = Math.max(0, Math.min(1, (animationProgress - charStart) / 0.1));
        opacity = charProgress;
        blur = (1 - charProgress) * 8;
        y = (1 - charProgress) * 15;
      } else {
        // Fade out phase - all together
        const fadeOutProgress = (animationProgress - 0.65) / 0.35;
        opacity = 1 - fadeOutProgress;
        blur = fadeOutProgress * 8;
        y = -50 * fadeOutProgress;
      }
      
      gsap.set(char, {
        opacity,
        filter: `blur(${blur}px)`,
        y,
      });
    });
  }, [animationProgress, titleRef, subtitleRef]);

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-8 text-center">
      <h1 
        ref={titleRef}
        className="text-[clamp(4rem,10vw,8rem)] font-bold leading-none tracking-tight mb-8 text-white"
        style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}
      >
        {titleText.split('').map((char, index) => (
          <span
            key={index}
            className="char"
            style={{
              display: 'inline-block',
              minWidth: char === ' ' ? '0.3em' : 'auto',
              opacity: 0,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h1>
      
      <p 
        ref={subtitleRef}
        className="text-[clamp(1.25rem,2.5vw,2rem)] text-gray-300 font-light"
        style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}
      >
        {subtitleText.split('').map((char, index) => (
          <span
            key={index}
            className="char"
            style={{
              display: 'inline-block',
              minWidth: char === ' ' ? '0.25em' : 'auto',
              opacity: 0,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </p>
    </div>
  );
}
