/**
 * Work Scenes
 * 
 * VIEWPORT-BASED reveals
 */

'use client';

import { useScene } from '../../hooks/useScene';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { SceneConfig } from '../../types/Scene.types';
import { workScene1Config } from './WorkScene.config';

interface WorkSceneProps {
  config: SceneConfig;
  project: {
    title: string;
    subtitle: string;
    description: string;
    tags: string[];
    year: string;
    imagePosition: 'left' | 'right';
    bgColor?: string;
  };
}

export function WorkScene({ config, project }: WorkSceneProps) {
  // Register with StoryboardProvider
  const { sceneRef } = useScene(config);
  
  const isImageLeft = project.imagePosition === 'left';
  
  const imageRef = useScrollReveal({
    start: 'top 75%',
    from: { opacity: 0, x: isImageLeft ? -80 : 80, scale: 0.95 },
    to: { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power2.out' },
  });
  
  const contentRef = useScrollReveal({
    start: 'top 70%',
    from: { opacity: 0, x: isImageLeft ? 60 : -60 },
    to: { opacity: 1, x: 0, duration: 1, ease: 'power2.out' },
  });
  
  const tagsRef = useScrollReveal({
    start: 'top 65%',
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
  });

  return (
    <section
      ref={sceneRef}
      id={config.id}
      data-scene={config.id}
      className={`relative min-h-screen flex items-center ${project.bgColor || 'bg-white'} section-padding`}
    >
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Image: 50% width with proper aspect ratio */}
          <div
            ref={imageRef}
            className={isImageLeft ? 'lg:order-1' : 'lg:order-2'}
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl group cursor-pointer">
              <div 
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                style={{ background: `linear-gradient(135deg, var(--brand-teal) 0%, var(--brand-saffron) 100%)` }}
              />
              
              <div className="absolute inset-12 border-2 border-white/30 rounded-lg flex items-center justify-center">
                <div className="text-center text-white/50">
                  <div className="text-8xl mb-6">◇</div>
                  <div className="text-lg uppercase tracking-widest font-medium">Project Mockup</div>
                </div>
              </div>
              
              <div className="absolute inset-0 bg-brand-teal-dark/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-white text-2xl font-semibold">View Project →</span>
              </div>
            </div>
          </div>
          
          {/* Content: 50% width with proper hierarchy */}
          <div
            ref={contentRef}
            className={`space-y-6 ${isImageLeft ? 'lg:order-2' : 'lg:order-1'}`}
          >
            <div 
              className="px-4 py-2 bg-brand-saffron/10 text-brand-saffron font-mono uppercase inline-block rounded-full"
              style={{ fontSize: 'var(--text-xs)' }}
            >
              {project.year}
            </div>
            
            <h2 
              className="font-bold text-brand-teal leading-[1.05]"
              style={{ fontSize: 'var(--text-2xl)' }}
            >
              {project.title}
            </h2>
            
            <p 
              className="text-brand-saffron font-light"
              style={{ fontSize: 'var(--text-lg)' }}
            >
              {project.subtitle}
            </p>
            
            <div className="w-20 h-1.5 bg-brand-saffron rounded-full" />
            
            <p 
              className="text-brand-teal/70"
              style={{ 
                fontSize: 'var(--text-base)',
                lineHeight: 'var(--leading-relaxed)'
              }}
            >
              {project.description}
            </p>
            
            <div ref={tagsRef} className="flex flex-wrap gap-3 pt-4">
              {project.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-5 py-2.5 bg-white border border-brand-teal/20 text-brand-teal rounded-full hover:bg-brand-saffron-light hover:border-brand-saffron transition-all duration-300"
                  style={{ fontSize: 'var(--text-sm)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <button 
              className="mt-8 px-10 py-4 bg-brand-saffron text-white rounded-xl font-semibold hover:bg-brand-saffron-dark hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
              style={{ fontSize: 'var(--text-base)' }}
            >
              View Case Study →
            </button>
          </div>
          
        </div>
      </div>
    </section>
  );
}

export const workScene2Config: SceneConfig = {
  ...workScene1Config,
  id: 'work-2',
  name: 'Work Case Study 2',
  order: 5,
};

export const workScene3Config: SceneConfig = {
  ...workScene1Config,
  id: 'work-3',
  name: 'Work Case Study 3',
  order: 6,
};
