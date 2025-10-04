'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/stores/useStore';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const setCurrentSection = useStore((state) => state.setCurrentSection);

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
        },
      });

      const cards = gsap.utils.toArray('.project-card');
      cards.forEach((card: any) => {
        gsap.from(card, {
          opacity: 0,
          y: 60,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
        });
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setCurrentSection('work'),
        onEnterBack: () => setCurrentSection('work'),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [setCurrentSection]);

  const projects = [
    {
      title: 'Project 1',
      category: 'E-commerce',
      year: '2024',
    },
    {
      title: 'Project 2',
      category: 'Brand Identity',
      year: '2024',
    },
    {
      title: 'Project 3',
      category: 'Web App',
      year: '2023',
    },
    {
      title: 'Project 4',
      category: 'AI Platform',
      year: '2023',
    },
  ];

  return (
    <section 
      ref={sectionRef}
      id="work"
      className="relative min-h-screen flex items-center py-32 bg-gray-50"
      data-section="work"
    >
      <div className="max-w-7xl mx-auto px-8 w-full">
        <h2 
          ref={titleRef}
          className="text-[clamp(3rem,6vw,5rem)] font-bold mb-20 tracking-tight text-black"
        >
          Selected Work
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {projects.map((project, index) => (
            <div 
              key={index} 
              className="project-card group cursor-pointer"
            >
              <div className="aspect-[4/3] bg-gray-200 mb-6 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-100 group-hover:scale-105 transition-transform duration-500"></div>
              </div>
              
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="text-3xl font-bold text-black">
                  {project.title}
                </h3>
                <span className="text-sm text-gray-600">{project.year}</span>
              </div>
              <p className="text-base text-gray-700">{project.category}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
