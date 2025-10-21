/**
 * Silk Emergence Scene Component
 * 
 * Scene 1: Animated silk surface with ripple effects
 */

'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useScene } from '../../hooks/useScene';
import { silkEmergenceConfig } from './SilkEmergenceScene.config';
import { SilkSurface } from './components/SilkSurface';
import { SceneLighting } from './components/SceneLighting';
import { SceneCamera } from './components/SceneCamera';

export function SilkEmergenceScene() {
  const { sceneRef, progress, getPhaseProgress, isActive } = useScene(silkEmergenceConfig);
  
  // Get progress for each phase
  const introProgress = getPhaseProgress('intro');
  const buildProgress = getPhaseProgress('build');
  const holdProgress = getPhaseProgress('hold');
  const outroProgress = getPhaseProgress('outro');
  
  // Calculate ripple intensity based on phases
  const rippleIntensity = buildProgress > 0 
    ? buildProgress 
    : holdProgress > 0 
      ? 1.0 
      : 0;
  
  return (
    <section
      ref={sceneRef}
      id={silkEmergenceConfig.id}
      className="relative h-screen bg-brand-teal-dark"
      data-scene={silkEmergenceConfig.id}
      data-active={isActive}
    >
      {/* 3D Canvas Layer */}
      <div className="absolute inset-0">
        <Canvas
          shadows
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
        >
          {/* Camera */}
          <SceneCamera 
            progress={progress}
            driftAmount={buildProgress + holdProgress + outroProgress > 0 ? 0.1 : 0}
            zoomProgress={outroProgress}
          />
          
          {/* Lighting */}
          <SceneLighting 
            keyLightIntensity={0.5 + introProgress * 0.3}
          />
          
          {/* Silk Surface */}
          <SilkSurface
            opacity={introProgress}
            rippleIntensity={rippleIntensity}
            rippleSpeed={0.5}
          />
          
          {/* Fog for atmosphere */}
          <fog attach="fog" args={['#0d3838', 5, 20]} />
        </Canvas>
      </div>
      
      {/* DOM Overlay (optional text, UI elements) */}
      <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
        {/* Only show text after intro completes */}
        {introProgress >= 1 && (
          <div 
            className="text-brand-saffron/30 text-sm tracking-[0.3em] uppercase"
            style={{
              opacity: Math.min(buildProgress * 2, 1),
            }}
          >
            {/* Subtle atmosphere text - no company name yet */}
            Emergence
          </div>
        )}
      </div>
    </section>
  );
}

