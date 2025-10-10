/**
 * DNA Helix - Double Helix Spiral
 * 
 * Two intertwined spirals of particles
 * Represents transformation, growth, and life
 * Connects particles with glowing lines
 */

'use client';

import { Canvas } from '@react-three/fiber';
import { HelixParticles } from './HelixParticles';

interface DNAHelixProps {
  breakProgress: number;
}

export function DNAHelix({ breakProgress }: DNAHelixProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      style={{ background: 'transparent' }}
      dpr={[1, 2]}
    >
      <HelixParticles breakProgress={breakProgress} />
    </Canvas>
  );
}

