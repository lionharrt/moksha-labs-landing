'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/stores/useStore';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Services() {
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

      const cards = gsap.utils.toArray('.service-card');
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
        onEnter: () => setCurrentSection('services'),
        onEnterBack: () => setCurrentSection('services'),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [setCurrentSection]);

  const services = [
    {
      title: 'Web',
      subtitle: 'Digital experiences',
      description: 'Websites and apps that merge technical precision with creative vision',
    },
    {
      title: 'Brand',
      subtitle: 'Visual identity',
      description: 'Complete brand systems that capture essence and drive recognition',
    },
    {
      title: 'AI',
      subtitle: 'Smart integration',
      description: 'Intelligent solutions woven seamlessly into user experiences',
    },
  ];

  return (
    <section 
      ref={sectionRef}
      id="services"
      className="relative min-h-screen flex items-center py-32 bg-white"
      data-section="services"
    >
      <div className="max-w-7xl mx-auto px-8 w-full">
        <h2 
          ref={titleRef}
          className="text-[clamp(3rem,6vw,5rem)] font-heading font-bold mb-20 tracking-tight text-brand-teal-dark"
        >
          What We Do
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="service-card group relative border border-brand-teal-light/30 p-10 hover:border-brand-saffron hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <h3 className="text-4xl font-heading font-bold mb-3 text-brand-teal-dark">
                {service.title}
              </h3>
              <p className="text-base text-brand-saffron-dark mb-4 uppercase tracking-wider font-medium">
                {service.subtitle}
              </p>
              <p className="text-base leading-relaxed text-foreground-muted">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
