/**
 * Flow Field - Perlin Noise Particle System
 * 
 * Particles follow an invisible force field created by Perlin noise
 * Creates organic, flowing patterns like wind or water currents
 * 
 * Technique: Each particle samples the noise field at its position
 * to determine which direction to move
 */

'use client';

import { Canvas } from '@react-three/fiber';
import { FlowFieldParticles } from './FlowFieldParticles';

interface FlowFieldProps {
  breakProgress: number;
}

export function FlowField({ breakProgress }: FlowFieldProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ background: 'transparent' }}
      dpr={[1, 2]}
    >
      <FlowFieldParticles breakProgress={breakProgress} />
    </Canvas>
  );
}

