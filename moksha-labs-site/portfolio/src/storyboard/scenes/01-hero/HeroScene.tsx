/**
 * Scene 1: Hero
 * 
 * FIXED: Content always visible, simple animations
 */

'use client';

import { useScene } from '../../hooks/useScene';
import { heroSceneConfig } from './HeroScene.config';

export function HeroScene() {
  const { sceneRef, progress } = useScene(heroSceneConfig);
  
  // Gradient changes with scroll
  const gradientProgress = progress * 200;

  return (
    <section
      ref={sceneRef}
      id={heroSceneConfig.id}
      data-scene={heroSceneConfig.id}
      className="relative h-screen overflow-hidden"
    >
      {/* Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${gradientProgress}deg, var(--brand-teal-dark) 0%, var(--brand-teal) 25%, var(--brand-saffron-dark) 50%, var(--brand-teal) 75%, var(--brand-teal-dark) 100%)`,
          backgroundSize: '200% 200%',
          backgroundPosition: `${gradientProgress}% ${gradientProgress}%`,
        }}
      />
      
      {/* Content - ALWAYS VISIBLE */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-8">
        <h1 className="text-[clamp(4rem,12vw,10rem)] font-bold text-white text-center leading-[0.9] tracking-tight mb-8">
          Moksha Labs
        </h1>
        
        <p className="text-[clamp(1.25rem,3vw,2rem)] text-teal-100 font-light text-center max-w-3xl tracking-wide">
          Spiritual Design & Digital Liberation
        </p>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-3 text-white/80">
            <span className="text-xs uppercase tracking-[0.3em]">Discover Now</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Progress */}
      <div className="absolute top-8 right-8 z-20 text-white/50 font-mono text-sm">
        {Math.round(progress * 100)}%
      </div>
    </section>
  );
}
