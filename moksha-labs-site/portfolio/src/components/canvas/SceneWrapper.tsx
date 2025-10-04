'use client';

import { Canvas } from '@react-three/fiber';
import { Scene } from './Scene';

export function SceneWrapper() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
      }}
    >
      <Scene />
    </Canvas>
  );
}

