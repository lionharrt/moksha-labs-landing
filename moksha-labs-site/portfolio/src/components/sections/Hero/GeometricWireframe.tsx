/**
 * Geometric Wireframe - Original mandala
 */

'use client';

import { Canvas } from '@react-three/fiber';
import { OriginalMandala } from './mandalas';

interface GeometricWireframeProps {
  breakProgress: number;
}

export function GeometricWireframe({ breakProgress }: GeometricWireframeProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ background: 'transparent' }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.5} />
      <OriginalMandala breakProgress={breakProgress} />
    </Canvas>
  );
}

