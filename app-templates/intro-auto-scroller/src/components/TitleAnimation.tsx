/**
 * Title Animation Component
 * 
 * Timed animation sequence for demo intros:
 * - 0-5s: Helix builds, text fades in
 * - 5-8s: Hold at full visibility (3 seconds)
 * - 8-10s: Fade out to black
 * 
 * Props:
 * - companyName: string - Company name to display
 * - tagline: string - Tagline text
 * - onComplete: () => void - Callback when animation finishes
 */

import { useState, useEffect, useRef } from 'react';
import { GlassDNA } from './GlassDNA';
import { EnhancedText } from './EnhancedText';

interface TitleAnimationProps {
  companyName: string;
  tagline: string;
  demoLogoUrl?: string;
  onComplete: () => void;
}

export function TitleAnimation({ companyName, tagline, demoLogoUrl, onComplete }: TitleAnimationProps) {
  const [helixRotationProgress, setHelixRotationProgress] = useState(0);
  const [helixOpacity, setHelixOpacity] = useState(0);
  const [textProgress, setTextProgress] = useState(0);
  const [presentsOpacity, setPresentsOpacity] = useState(0);
  const [demoLogoOpacity, setDemoLogoOpacity] = useState(0);
  const [demoLogoScale, setDemoLogoScale] = useState(0.97);
  const [fadeToBlack, setFadeToBlack] = useState(0);
  const [fadeInFromBlack, setFadeInFromBlack] = useState(1);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const animationStartTime = useRef<number>(Date.now());

  useEffect(() => {
    animationStartTime.current = Date.now();
    let rafId: number;

    // Easing functions
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const easeInOutCubic = (t: number) => t < 0.5 
      ? 4 * t * t * t 
      : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animate = () => {
      const elapsed = (Date.now() - animationStartTime.current) / 1000; // seconds
      const totalDuration = 14;

      if (elapsed >= totalDuration) {
        setHelixRotationProgress(1);
        setHelixOpacity(0);
        setTextProgress(1);
        setPresentsOpacity(0);
        setDemoLogoOpacity(0);
        setFadeToBlack(1);
        setFadeInFromBlack(0);
        onComplete();
        return;
      }

      // NEW TIMELINE:
      // 0-0.5s: Fade in from black
      // 0.5-3s: Helix + Text build together (2.5 seconds)
      // 3-5s: Hold both fully visible (2 seconds)
      // 5-6s: Helix fades out (1 second)
      // 6-7s: Text fades out (1 second, starts 1 second after helix)
      // 7-7.5s: Black (0.5 second delay)
      // 7.5-9s: "presents" (fade in 0.4s, hold 0.7s, fade out 0.4s) - 1.5s total
      // 9-10s: Black (1 second delay)
      // 10-13s: Demo logo (fade in 0.6s, hold 1.8s, fade out 0.6s) - with subtle depth effects
      // 13-14s: Fade to black and complete (1 second)

      // Fade in from black (0-0.5s)
      if (elapsed < 0.5) {
        const fadeInProg = elapsed / 0.5;
        setFadeInFromBlack(1 - easeOutCubic(fadeInProg));
      } else {
        setFadeInFromBlack(0);
      }

      // HELIX ROTATION: Linear throughout entire animation
      const rotationProg = Math.min(elapsed / 6, 1); // 0-6s for full rotation
      setHelixRotationProgress(rotationProg);

      // HELIX OPACITY: Fade in (0.5-3s), hold (3-5s), fade out (5-6s)
      const buildStart = 0.5;
      const buildEnd = 3;
      const holdEnd = 5;
      const helixFadeEnd = 6;
      let helixOp = 0;
      if (elapsed < buildStart) {
        helixOp = 0;
      } else if (elapsed < buildEnd) {
        // Fade in with easing for smooth reveal
        const fadeInProgress = (elapsed - buildStart) / (buildEnd - buildStart);
        helixOp = easeInOutCubic(fadeInProgress);
      } else if (elapsed < holdEnd) {
        // Hold at full visibility for 2 seconds
        helixOp = 1;
      } else if (elapsed < helixFadeEnd) {
        // Fade out over 1 second
        const fadeProgress = (elapsed - holdEnd) / (helixFadeEnd - holdEnd);
        helixOp = 1 - easeInOutCubic(fadeProgress);
      } else {
        helixOp = 0;
      }
      setHelixOpacity(helixOp);

      // TEXT: Appears slightly faster than helix (0.5-2.5s), holds (2.5-6s), fades (6-7s)
      const textBuildEnd = buildStart + (buildEnd - buildStart) * 0.8; // 2.5s
      const textFadeStart = 6;
      const textFadeEnd = 7;
      let textProg = 0;
      if (elapsed < buildStart) {
        textProg = 0;
      } else if (elapsed < textBuildEnd) {
        // Build faster: 0 to 0.6 in 2 seconds
        const textBuildProgress = (elapsed - buildStart) / (textBuildEnd - buildStart);
        textProg = textBuildProgress * 0.6;
      } else if (elapsed < textFadeStart) {
        // Hold at full visibility
        textProg = 0.6;
      } else if (elapsed < textFadeEnd) {
        // Fade out: 0.6 to 1.0 over 1 second
        const fadeProgress = (elapsed - textFadeStart) / (textFadeEnd - textFadeStart);
        textProg = 0.6 + easeInOutCubic(fadeProgress) * 0.4;
      } else {
        // Fully faded
        textProg = 1.0;
      }
      setTextProgress(textProg);

      // "PRESENTS" (7.5-9s): fade in (7.5-7.9s), hold (7.9-8.6s), fade out (8.6-9s)
      let presentsOp = 0;
      if (elapsed < 7.5) {
        presentsOp = 0;
      } else if (elapsed < 7.9) {
        // Fade in
        const fadeInProg = (elapsed - 7.5) / 0.4;
        presentsOp = easeInOutCubic(fadeInProg);
      } else if (elapsed < 8.6) {
        // Hold
        presentsOp = 1;
      } else if (elapsed < 9) {
        // Fade out
        const fadeOutProg = (elapsed - 8.6) / 0.4;
        presentsOp = 1 - easeInOutCubic(fadeOutProg);
      } else {
        presentsOp = 0;
      }
      setPresentsOpacity(presentsOp);

      // DEMO LOGO (10-13s): fade in (10-10.6s), hold (10.6-12.4s), fade out (12.4-13s)
      let logoOp = 0;
      let logoScale = 0.97;
      if (elapsed < 10) {
        logoOp = 0;
        logoScale = 0.97;
      } else if (elapsed < 10.6) {
        // Smooth fade in with subtle scale
        const fadeInProg = (elapsed - 10) / 0.6;
        logoOp = easeInOutCubic(fadeInProg);
        // Very subtle scale from 0.97 to 1.02 using easeOutCubic
        const easeOut = 1 - Math.pow(1 - fadeInProg, 3);
        logoScale = 0.97 + (easeOut * 0.05); // Goes to 1.02 then settles
      } else if (elapsed < 12.4) {
        // Extended hold - settle to 1.0
        logoOp = 1;
        const holdProgress = (elapsed - 10.6) / 0.3; // First 0.3s of hold
        logoScale = holdProgress < 1 ? 1.02 - (easeInOutCubic(holdProgress) * 0.02) : 1.0;
      } else if (elapsed < 13) {
        // Smooth fade out with subtle scale down
        const fadeOutProg = (elapsed - 12.4) / 0.6;
        logoOp = 1 - easeInOutCubic(fadeOutProg);
        logoScale = 1.0 - (easeInOutCubic(fadeOutProg) * 0.02); // Subtle scale down to 0.98
      } else {
        logoOp = 0;
        logoScale = 0.98;
      }
      setDemoLogoOpacity(logoOp);
      setDemoLogoScale(logoScale);

      // Fade to black overlay (starts at 13s)
      if (elapsed >= 13) {
        const fadeProgress = (elapsed - 13) / 1;
        setFadeToBlack(easeInOutCubic(fadeProgress));
      } else {
        setFadeToBlack(0);
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      {/* Fade in from black overlay (at start) */}
      <div
        className="absolute inset-0 z-30 bg-black pointer-events-none"
        style={{ opacity: fadeInFromBlack }}
      />

      {/* 3D Canvas - Behind text */}
      <div className="absolute inset-0 z-0">
        <GlassDNA 
          rotationProgress={helixRotationProgress}
          opacity={helixOpacity}
        />
      </div>

      {/* Text Content - In front */}
      <EnhancedText
        titleRef={titleRef}
        subtitleRef={subtitleRef}
        animationProgress={textProgress}
        titleText={companyName}
        subtitleText={tagline}
      />

      {/* "presents" text */}
      <div
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
        style={{ opacity: presentsOpacity }}
      >
        <p className="text-white text-2xl font-light tracking-[0.3em] uppercase">
          presents
        </p>
      </div>

      {/* Demo Logo */}
      {demoLogoUrl && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
          style={{ 
            opacity: demoLogoOpacity,
          }}
        >
          <div
            style={{
              transform: `scale(${demoLogoScale})`,
              filter: `drop-shadow(0 20px 60px rgba(0, 0, 0, ${0.4 * demoLogoOpacity})) drop-shadow(0 10px 30px rgba(0, 0, 0, ${0.3 * demoLogoOpacity}))`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={demoLogoUrl}
              alt="Demo Logo"
              style={{
                maxWidth: '60vw',
                maxHeight: '60vh',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                filter: `brightness(${0.95 + (0.1 * demoLogoOpacity)}) contrast(${1.05 + (0.05 * demoLogoOpacity)})`,
              }}
            />
          </div>
        </div>
      )}

      {/* Fade to black overlay (at end) */}
      <div
        className="absolute inset-0 z-20 bg-black pointer-events-none"
        style={{ opacity: fadeToBlack }}
      />
    </div>
  );
}

