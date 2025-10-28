/**
 * Scene 3: Services
 * 
 * VIEWPORT-BASED staggered card reveals
 */

'use client';

import { useScene } from '../../hooks/useScene';
import { useScrollReveal, useScrollRevealBatch } from '../../hooks/useScrollReveal';
import { servicesSceneConfig } from './ServicesScene.config';

const services = [
  { id: 'web', title: 'Web Design', desc: 'Beautiful, functional websites that captivate and convert.' },
  { id: '3d', title: '3D Experiences', desc: 'Immersive WebGL environments that engage audiences.' },
  { id: 'brand', title: 'Brand Identity', desc: 'Cohesive visual systems that tell your story.' },
  { id: 'dev', title: 'Development', desc: 'Modern, performant applications built with cutting-edge tech.' },
  { id: 'motion', title: 'Motion Design', desc: 'Animations that bring interfaces to life with purpose.' },
  { id: 'consult', title: 'Consulting', desc: 'Digital transformation guided by insight and research.' },
];

export function ServicesScene() {
  // Register with StoryboardProvider
  const { sceneRef } = useScene(servicesSceneConfig);
  
  const headerRef = useScrollReveal({
    start: 'top 70%',
    from: { opacity: 0, y: 50 },
    to: { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
  });
  
  const { parentRef, childClass } = useScrollRevealBatch({
    start: 'top 75%',
    from: { opacity: 0, y: 60, scale: 0.9 },
    to: { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.2)' },
    stagger: 0.12,
  });

  return (
    <section
      ref={sceneRef}
      id="services"
      data-scene="services"
      className="relative min-h-screen bg-gradient-to-b from-white to-teal-50/20 section-padding"
    >
      <div className="container-custom">
        
        <div ref={headerRef} className="text-center mb-24">
          <h2 
            className="font-bold text-brand-teal mb-6"
            style={{ fontSize: 'var(--text-2xl)' }}
          >
            What We Do
          </h2>
          <p 
            className="text-brand-teal/60 max-w-3xl mx-auto"
            style={{ 
              fontSize: 'var(--text-lg)',
              lineHeight: 'var(--leading-relaxed)'
            }}
          >
            Comprehensive digital services designed to elevate your brand
          </p>
        </div>
        
        <div 
          ref={parentRef} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          {services.map((service) => (
            <div
              key={service.id}
              className={`${childClass} bg-white border border-brand-teal/10 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300`}
              style={{ padding: 'var(--card-padding)' }}
            >
              <div 
                className="mb-6 bg-gradient-to-br from-brand-teal to-brand-saffron rounded-xl flex items-center justify-center text-white text-3xl font-bold"
                style={{ width: '64px', height: '64px' }}
              >
                {service.title[0]}
              </div>
              
              <h3 
                className="font-bold text-brand-teal mb-4"
                style={{ fontSize: 'var(--text-xl)' }}
              >
                {service.title}
              </h3>
              
              <p 
                className="text-brand-teal/60"
                style={{ 
                  fontSize: 'var(--text-base)',
                  lineHeight: 'var(--leading-relaxed)'
                }}
              >
                {service.desc}
              </p>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
