/**
 * Glass DNA Helix - Premium Edition
 * 
 * Combines DNA double helix structure with crystal glass materials
 * Features:
 * - Two spiral particle strands (cyan/magenta)
 * - Glass crystal "rungs" connecting the strands (every 2nd particle)
 * - Sparkle particles orbiting the structure
 * - Bloom glow effect
 * - Full transmission/refraction on glass steps
 */

'use client';

import { Canvas } from '@react-three/fiber';
import { GlassHelixParticles } from './GlassHelixParticles';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
// Removed Environment import for performance

interface GlassDNAProps {
  breakProgress: number;
}

// Helper to calculate light position based on scroll progress
function getLightYPosition(breakProgress: number, height: number): number {
  // Start at top (positive Y), move down to bottom (negative Y) as scroll progresses
  return (height / 2) - (breakProgress * height);
}

export function GlassDNA({ breakProgress }: GlassDNAProps) {
  // Center-focused lighting - helix grows THROUGH the light zone
  
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 60 }}
      style={{ background: 'transparent' }}
      dpr={[1, 2]}
    >
      {/* Center-focused spotlight zone */}
      <ambientLight intensity={0.15} />
      <fog attach="fog" args={['#0a0f14', 8, 25]} />
      
      {/* === MAIN CENTER SAFFRON ZONE (Y: -3 to +3) === */}
      
      {/* Primary saffron spotlight from left - focused on center */}
      <spotLight
        position={[-8, 0, 8]}
        target-position={[0, 0, 0]}
        angle={0.6}
        penumbra={0.8}
        intensity={4}
        color="#d4a574"
        distance={20}
        decay={2}
      />
      
      {/* Primary saffron spotlight from right - focused on center */}
      <spotLight
        position={[8, 0, 8]}
        target-position={[0, 0, 0]}
        angle={0.6}
        penumbra={0.8}
        intensity={3.5}
        color="#cc9966"
        distance={20}
        decay={2}
      />
      
      {/* Top saffron spotlight angled down to center */}
      <spotLight
        position={[0, 10, 7]}
        target-position={[0, 0, 0]}
        angle={0.5}
        penumbra={0.85}
        intensity={3.2}
        color="#d4a574"
        distance={18}
        decay={2}
      />
      
      {/* Bottom saffron spotlight angled up to center */}
      <spotLight
        position={[0, -10, 7]}
        target-position={[0, 0, 0]}
        angle={0.5}
        penumbra={0.85}
        intensity={3}
        color="#cc9966"
        distance={18}
        decay={2}
      />
      
      {/* Teal accent from front (for context outside center zone) */}
      <pointLight
        position={[0, 0, 12]}
        intensity={0.6}
        color="#4d7a8c"
        distance={25}
        decay={2}
      />
      
      {/* Subtle rim light from behind */}
      <directionalLight
        position={[0, 0, -10]}
        intensity={0.25}
        color="#a0b0c0"
      />
      
      <GlassHelixParticles breakProgress={breakProgress} />
      
      {/* Bloom to enhance saffron reflections */}
      <EffectComposer>
        <Bloom
          intensity={0.4}
          luminanceThreshold={0.4}
          luminanceSmoothing={0.95}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}

