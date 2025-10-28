/**
 * Scene 2: Philosophy
 * 
 * VIEWPORT-BASED animations - elements animate when THEY enter viewport
 */

'use client';

import { useScene } from '../../hooks/useScene';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { philosophySceneConfig } from './PhilosophyScene.config';

export function PhilosophyScene() {
  // Register with StoryboardProvider
  const { sceneRef } = useScene(philosophySceneConfig);
  
  // Each element gets its own scroll trigger
  const titleRef = useScrollReveal({
    start: 'top 75%',
    from: { opacity: 0, x: -100 },
    to: { opacity: 1, x: 0, duration: 1, ease: 'power2.out' },
  });
  
  const contentRef = useScrollReveal({
    start: 'top 75%',
    from: { opacity: 0, x: 100 },
    to: { opacity: 1, x: 0, duration: 1, ease: 'power2.out' },
  });

  return (
    <section
      ref={sceneRef}
      id="philosophy"
      data-scene="philosophy"
      className="relative min-h-screen bg-white flex items-center section-padding"
    >
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-24 items-center">
          
          {/* Left: Title (40% width = 2 cols) */}
          <div ref={titleRef} className="lg:col-span-2">
            <h2 
              className="font-bold text-brand-teal leading-[0.95] mb-8"
              style={{ fontSize: 'var(--text-2xl)' }}
            >
              ALWAYS,<br/>BETTER
            </h2>
            <div className="w-16 h-1.5 bg-brand-saffron rounded-full" />
          </div>
          
          {/* Right: Content (60% width = 3 cols) */}
          <div ref={contentRef} className="lg:col-span-3 space-y-8">
            <p 
              className="text-brand-teal/80"
              style={{ 
                fontSize: 'var(--text-lg)',
                lineHeight: 'var(--leading-relaxed)'
              }}
            >
              Founded with the vision of constructing digital experiences that respect 
              humanity and innovation, <strong className="text-brand-teal">Moksha Labs</strong> continues 
              to grow without compromising its values.
            </p>
            
            <p 
              className="text-brand-teal/60"
              style={{ 
                fontSize: 'var(--text-base)',
                lineHeight: 'var(--leading-relaxed)'
              }}
            >
              We blend aesthetic design with modern technologies, creating worlds 
              that transcend the ordinary.
            </p>
          </div>
          
        </div>
      </div>
    </section>
  );
}
