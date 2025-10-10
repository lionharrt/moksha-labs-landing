/**
 * Boid Simulation - Flocking particles with mouse interaction
 * 
 * Based on Craig Reynolds' boid algorithm with mouse avoidance
 * Optimized for 500-1000 boids at 60fps
 */

'use client';

import { Canvas } from '@react-three/fiber';
import { BoidSwarm } from './BoidSwarm';

interface BoidSimulationProps {
  breakProgress: number; // 0-1 from Hero scroll phase
}

export function BoidSimulation({ breakProgress }: BoidSimulationProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 75 }}
      style={{ background: 'transparent' }}
      dpr={[1, 2]}
    >
      {/* No lights needed - using meshBasicMaterial */}
      <BoidSwarm breakProgress={breakProgress} />
    </Canvas>
  );
}

