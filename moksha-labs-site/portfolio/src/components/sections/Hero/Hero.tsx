'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/stores/useStore';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';

import { TextSwitcher } from './TextSwitcher';

const DynamicEffectSwitcher = dynamic(() => import('./EffectSwitcher').then(mod => mod.EffectSwitcher), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const [fadeProgress, setFadeProgress] = useState(0);
  const [shapeBreakProgress, setShapeBreakProgress] = useState(0);
  const [textAnimationProgress, setTextAnimationProgress] = useState(0);
  const setCurrentSection = useStore((state) => state.setCurrentSection);

  useEffect(() => {
    if (!sectionRef.current || !scrollIndicatorRef.current || !canvasContainerRef.current) return;

    const ctx = gsap.context(() => {
      // Scroll indicator bounces
      gsap.to(scrollIndicatorRef.current, {
        y: 10,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });

      // SCRUB ANIMATION - tied to scroll position
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=1000vh', // HUGE scroll distance so text has room to breathe after appearing
          scrub: 0.5, // Tight scrubbing for instant response
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const rawProgress = self.progress; // 0-1 across entire Hero
            
            // Map rawProgress to fade progress (0-10%)
            // This is passed to effects that need fade-in (wireframe, lotus)
            let fadeOpacity = 0;
            if (rawProgress <= 0.1) {
              fadeOpacity = rawProgress / 0.1; // 0 to 1 over first 10%
            } else {
              fadeOpacity = 1;
            }
            setFadeProgress(fadeOpacity);
            
            console.log('Hero scroll progress:', rawProgress.toFixed(3), '| Fade:', fadeOpacity.toFixed(3));
            
            // Timeline for Glass DNA:
            // HELIX: 0-10% fade in, 10-100% build/break
            // TEXT: 10-30% fade in (reaches peak at middle of helix), 30-85% HOLD, 85-100% fade out
            
            // Map rawProgress to shape break phase (helix lifecycle)
            let breakProgress = 0;
            if (rawProgress < 0.1) {
              breakProgress = 0;
            } else {
              breakProgress = (rawProgress - 0.1) / 0.9;
            }
            setShapeBreakProgress(breakProgress);
            
            // Map rawProgress to text animation phase
            let textProgress = 0;
            if (rawProgress < 0.1) {
              // Wait for initial fade
              textProgress = 0;
            } else if (rawProgress < 0.3) {
              // Fast fade in: 0 to 0.45 (reaches crescendo at 30% scroll = middle of helix)
              textProgress = ((rawProgress - 0.1) / 0.2) * 0.45;
            } else if (rawProgress < 0.85) {
              // HOLD at full visibility through entire helix lifecycle
              textProgress = 0.45;
            } else {
              // Fade out only after helix is gone: 0.45 to 1.0
              textProgress = 0.45 + ((rawProgress - 0.85) / 0.15) * 0.55;
            }
            setTextAnimationProgress(textProgress);
          },
        }
      });

      // TIMELINE (for Glass DNA):
      // HELIX: 0-10% fade, 10-100% build/break lifecycle
      // TEXT: 10-30% fade in (peaks at 30% = middle of helix build)
      //       30-85% HOLD at full visibility
      //       85-100% fade out (after helix is gone)
      //
      // breakProgress: 0-1 controls helix lifecycle
      // textAnimationProgress: 0-1 controls text phases
      
      // Fade out scroll indicator as soon as scroll starts
      tl.to(scrollIndicatorRef.current, {
        opacity: 0,
        duration: 0.1,
        ease: 'none',
      }, 0);

      // Section tracking
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setCurrentSection('hero'),
        onEnterBack: () => setCurrentSection('hero'),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [setCurrentSection]);

  return (
    <section 
      ref={sectionRef}
      id="hero"
      className="relative h-screen flex items-center justify-center bg-black overflow-hidden"
      data-section="hero"
    >
      {/* 3D Canvas - Behind text */}
      <div 
        ref={canvasContainerRef}
        className="absolute inset-0 z-0"
      >
        <DynamicEffectSwitcher 
          breakProgress={shapeBreakProgress} 
          fadeProgress={fadeProgress}
        />
      </div>

      {/* Text Content - In front */}
      <TextSwitcher 
        titleRef={titleRef} 
        subtitleRef={subtitleRef} 
        animationProgress={textAnimationProgress}
      />

      {/* Scroll Indicator */}
      <div 
        ref={scrollIndicatorRef}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white rounded-full" />
        </div>
        <span className="text-white/40 text-xs uppercase tracking-wider">Scroll</span>
      </div>
    </section>
  );
}
