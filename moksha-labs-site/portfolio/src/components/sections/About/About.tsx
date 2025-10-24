'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/stores/useStore';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const setCurrentSection = useStore((state) => state.setCurrentSection);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const content = contentRef.current;
    
    if (!section || !title || !content) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
        }
      });

      tl.from(title, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
      })
      .from(content.children, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
      }, '-=0.5');

      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setCurrentSection('about'),
        onEnterBack: () => setCurrentSection('about'),
      });
    }, section);

    return () => ctx.revert();
  }, [setCurrentSection]);

  return (
    <section 
      ref={sectionRef}
      id="about"
      className="relative min-h-screen flex items-center py-32 bg-white"
      data-section="about"
    >
      <div className="max-w-5xl mx-auto px-8 w-full">
        <h2 
          ref={titleRef}
          className="text-[clamp(3rem,6vw,5rem)] font-heading font-bold mb-16 tracking-tight text-brand-teal-dark"
        >
          About Us
        </h2>
        
        <div ref={contentRef}>
          <p className="text-[clamp(1.5rem,2.5vw,2.25rem)] leading-relaxed font-light text-brand-teal-dark mb-8">
            We craft digital experiences that blend artistry with technological prowess.
          </p>
          <p className="text-[clamp(1.5rem,2.5vw,2.25rem)] leading-relaxed font-light text-foreground-muted">
            Every project is an opportunity to push boundaries and create something remarkable.
          </p>
        </div>
      </div>
    </section>
  );
}
