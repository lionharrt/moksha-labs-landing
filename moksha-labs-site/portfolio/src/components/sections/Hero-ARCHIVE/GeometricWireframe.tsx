/**
 * Geometric Wireframe - Original mandala
 */

'use client';

import { Canvas } from '@react-three/fiber';
import { OriginalMandala } from './mandalas';

interface GeometricWireframeProps {
  breakProgress: number;
  fadeProgress: number; // 0-1 fade-in
}

export function GeometricWireframe({ breakProgress, fadeProgress }: GeometricWireframeProps) {
  return (
    <div style={{ opacity: fadeProgress, width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <OriginalMandala breakProgress={breakProgress} />
      </Canvas>
    </div>
  );
}

