'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/stores/useStore';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';

const GeometricWireframe = dynamic(() => import('./GeometricWireframe').then(mod => mod.GeometricWireframe), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const [shapeBreakProgress, setShapeBreakProgress] = useState(0);
  const setCurrentSection = useStore((state) => state.setCurrentSection);

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current || !subtitleRef.current || !scrollIndicatorRef.current) return;

    const ctx = gsap.context(() => {
      // Initial state - everything hidden
      gsap.set([titleRef.current, subtitleRef.current, canvasContainerRef.current], { 
        opacity: 0,
      });

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
            console.log('Hero scroll progress:', rawProgress.toFixed(3));
            
            // Map rawProgress to shape break phase
            // Shape breaks throughout 10-100%, but reaches 90% broken at 70%
            // Then finishes the last 10% of break while text is visible
            let breakProgress = 0;
            if (rawProgress < 0.1) {
              // 0-10%: Shape intact, fading in
              breakProgress = 0;
            } else {
              // 10-100%: Shape breaking continuously
              // Map 0.1-1.0 to breakProgress 0-1
              breakProgress = (rawProgress - 0.1) / 0.9;
            }
            
            setShapeBreakProgress(breakProgress);
          },
        }
      });

      // Phase 1: Geometric shape fades in (0-10%)
      tl.to(canvasContainerRef.current, {
        opacity: 1,
        duration: 0.1,
        ease: 'none',
      }, 0)
      
      // Phase 2: Shape breaks apart (10-100%)
      // This is handled by GeometricWireframe based on scroll progress
      // By 70%, shape is ~90% broken
      // Shape finishes breaking (90-100%) while text is visible
      
      // Phase 3: Text fades in (70-75%) - 5% of total scroll
      .to([titleRef.current, subtitleRef.current], {
        opacity: 1,
        y: 0,
        stagger: 0.02,
        duration: 0.05,
        ease: 'none',
      }, 0.70)
      
      // Phase 4: Text holds at full opacity (75-90%) - 15% of total scroll
      // GSAP naturally holds the values here
      
      // Phase 5: Text fades out (90-100%) - 10% of total scroll
      .to([titleRef.current, subtitleRef.current], {
        opacity: 0,
        y: -50,
        stagger: 0.02,
        duration: 0.1,
        ease: 'none',
      }, 0.90)
      
      // Fade out scroll indicator as soon as scroll starts
      .to(scrollIndicatorRef.current, {
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
        <GeometricWireframe breakProgress={shapeBreakProgress} />
      </div>

      {/* Text Content - In front */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 text-center">
        <h1 
          ref={titleRef}
          className="text-[clamp(4rem,10vw,8rem)] font-bold leading-none tracking-tight mb-8 text-white"
        >
          Moksha Labs
        </h1>
        <p 
          ref={subtitleRef}
          className="text-[clamp(1.25rem,2.5vw,2rem)] text-gray-300 font-light"
        >
          Where artistry meets code
        </p>
      </div>

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
