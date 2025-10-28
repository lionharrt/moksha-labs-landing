'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useScene } from '../../hooks/useScene';
import { petalTestConfig } from './PetalTestScene.config';
import { LotusPetal } from './components/LotusPetal';
import { SceneLighting } from './components/SceneLighting';

/**
 * Scene 1: Lotus Petal Test
 * 
 * Purpose: Create and refine a single beautiful lotus petal
 * Once this looks right, we'll use it to build the full flower
 */

export function PetalTestScene() {
  const { sceneRef, progress, isActive } = useScene(petalTestConfig);

  return (
    <section
      ref={sceneRef}
      className="relative w-full"
      style={{
        minHeight: '100vh',
        background: '#0d3838', // Brand teal dark
      }}
    >
      {/* 3D Canvas */}
      <div className="fixed inset-0 w-full h-full">
        <Canvas
          camera={{ position: [0, 2, 5], fov: 45 }}
          shadows
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 2]}
        >
          {/* Background Color */}
          <color attach="background" args={['#0d3838']} />
          
          {/* Orbit Controls - Click and drag to inspect */}
          <OrbitControls 
            enableDamping
            dampingFactor={0.05}
            minDistance={2}
            maxDistance={10}
          />
          
          {/* Lighting */}
          <SceneLighting progress={progress} />
          
          {/* The Petal */}
          <LotusPetal progress={progress} />
          
          {/* Subtle fog for depth */}
          <fog attach="fog" args={['#0d3838', 8, 15]} />
        </Canvas>
      </div>

      {/* Debug Info */}
      {isActive && (
        <div className="fixed bottom-8 left-8 z-50 text-white/60 font-mono text-sm pointer-events-none">
          <div>Scene: Petal Test</div>
          <div>Progress: {(progress * 100).toFixed(1)}%</div>
          <div className="text-brand-saffron-light mt-2">💡 Click + drag to rotate camera</div>
        </div>
      )}
    </section>
  );
}

