/**
 * Placeholder Scene Component
 * 
 * Generic placeholder for storyboard planning.
 * Shows scene name, progress, and phase info for debugging.
 */

'use client';

import React from 'react';
import { useScene } from '../../hooks/useScene';
import { SceneConfig } from '../../types/Scene.types';

interface PlaceholderSceneProps {
  config: SceneConfig;
  bgColor?: string;
  textColor?: string;
}

export function PlaceholderScene({ 
  config, 
  bgColor = '#1a4d4d', 
  textColor = '#e89f4c' 
}: PlaceholderSceneProps) {
  const { sceneRef, progress, getPhaseProgress, isActive, activePhases } = useScene(config);
  
  const introProgress = getPhaseProgress('intro');
  const buildProgress = getPhaseProgress('build');
  const holdProgress = getPhaseProgress('hold');
  const outroProgress = getPhaseProgress('outro');
  
  return (
    <section
      ref={sceneRef}
      id={config.id}
      className="relative h-screen flex items-center justify-center"
      style={{ backgroundColor: bgColor }}
      data-scene={config.id}
      data-active={isActive}
    >
      {/* Scene Info Overlay */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
        style={{ 
          color: textColor,
          opacity: 0.3 + progress * 0.7 // Fade in as you scroll
        }}
      >
        <h1 className="text-6xl font-heading font-bold mb-4">
          {config.name}
        </h1>
        
        <p className="text-xl mb-8 text-white/60">
          Scene {config.order} • Placeholder
        </p>
        
        {/* Progress Info */}
        <div className="space-y-4 font-mono text-sm">
          <div>
            <span className="text-white/40">Overall Progress:</span>{' '}
            <span className="font-bold">{(progress * 100).toFixed(1)}%</span>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className={activePhases.includes('intro') ? 'text-white' : 'text-white/30'}>
              <div className="text-xs mb-1">INTRO</div>
              <div className="text-lg font-bold">{(introProgress * 100).toFixed(0)}%</div>
            </div>
            <div className={activePhases.includes('build') ? 'text-white' : 'text-white/30'}>
              <div className="text-xs mb-1">BUILD</div>
              <div className="text-lg font-bold">{(buildProgress * 100).toFixed(0)}%</div>
            </div>
            <div className={activePhases.includes('hold') ? 'text-white' : 'text-white/30'}>
              <div className="text-xs mb-1">HOLD</div>
              <div className="text-lg font-bold">{(holdProgress * 100).toFixed(0)}%</div>
            </div>
            <div className={activePhases.includes('outro') ? 'text-white' : 'text-white/30'}>
              <div className="text-xs mb-1">OUTRO</div>
              <div className="text-lg font-bold">{(outroProgress * 100).toFixed(0)}%</div>
            </div>
          </div>
          
          {activePhases.length > 0 && (
            <div className="mt-6 text-xs text-white/60">
              Active: {activePhases.join(', ')}
            </div>
          )}
        </div>
        
        <div className="mt-12 text-xs text-white/40">
          {config.metadata?.description}
        </div>
      </div>
      
      {/* Visual indicator line that grows with progress */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ 
          backgroundColor: textColor,
          width: `${progress * 100}%`,
          transition: 'width 0.1s ease'
        }}
      />
    </section>
  );
}

