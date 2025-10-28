/**
 * Team Scene
 * 
 * FIXED: Content ALWAYS visible
 */

'use client';

import { useScene } from '../../hooks/useScene';
import { teamSceneConfig } from './TeamScene.config';

const team = [
  { name: 'Sarah Chen', role: 'Creative Director', bio: '10+ years experience.', initial: 'S' },
  { name: 'Marcus Rivera', role: 'Lead Developer', bio: 'WebGL specialist.', initial: 'M' },
  { name: 'Aisha Patel', role: 'Brand Strategist', bio: 'Connecting brands.', initial: 'A' },
  { name: 'David Kim', role: '3D Artist', bio: 'Immersive worlds.', initial: 'D' },
  { name: 'Emma Rodriguez', role: 'UX Designer', bio: 'Human-centered design.', initial: 'E' },
];

export function TeamScene() {
  const { sceneRef, getPhaseProgress } = useScene(teamSceneConfig);

  const scrollProgress = getPhaseProgress('scroll');
  const maxScroll = (team.length - 1) * 400;
  const scrollOffset = scrollProgress * maxScroll;

  return (
    <section
      ref={sceneRef}
      id={teamSceneConfig.id}
      data-scene={teamSceneConfig.id}
      className="relative h-screen bg-gradient-to-br from-brand-teal-dark to-brand-teal overflow-hidden"
    >
      {/* Header */}
      <div className="absolute top-20 left-0 right-0 text-center z-20 px-8">
        <h2 
          className="font-bold text-white mb-6"
          style={{ fontSize: 'var(--text-2xl)' }}
        >
          Meet the Team
        </h2>
        <p 
          className="text-teal-100 max-w-2xl mx-auto"
          style={{ 
            fontSize: 'var(--text-lg)',
            lineHeight: 'var(--leading-normal)'
          }}
        >
          Passionate individuals united by design
        </p>
      </div>
      
      {/* Cards */}
      <div className="absolute inset-0 flex items-center overflow-hidden">
        <div 
          className="flex gap-8 px-[10vw]"
          style={{ transform: `translateX(-${scrollOffset}px)` }}
        >
          {team.map((member) => (
            <div 
              key={member.name} 
              className="flex-shrink-0 bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-shadow duration-500"
              style={{ width: '360px' }}
            >
              <div 
                className="flex items-center justify-center"
                style={{ 
                  height: '240px',
                  background: `linear-gradient(135deg, var(--brand-teal) 0%, var(--brand-saffron) 100%)` 
                }}
              >
                <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/40">
                  <span className="text-6xl font-bold text-white">{member.initial}</span>
                </div>
              </div>
              
              <div className="space-y-5" style={{ padding: 'var(--card-padding)' }}>
                <h3 
                  className="font-bold text-brand-teal"
                  style={{ fontSize: 'var(--text-xl)' }}
                >
                  {member.name}
                </h3>
                <div 
                  className="px-4 py-2 bg-brand-saffron/10 text-brand-saffron rounded-full inline-block"
                  style={{ fontSize: 'var(--text-sm)' }}
                >
                  {member.role}
                </div>
                <p 
                  className="text-brand-teal/60"
                  style={{ 
                    fontSize: 'var(--text-base)',
                    lineHeight: 'var(--leading-relaxed)'
                  }}
                >
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="absolute bottom-8 left-0 right-0 px-[10vw] z-20">
        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand-saffron rounded-full"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
      </div>
    </section>
  );
}
