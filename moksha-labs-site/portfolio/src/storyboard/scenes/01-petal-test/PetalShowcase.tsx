'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { LotusFlower } from './components/LotusFlower';
import { SceneLighting } from './components/SceneLighting';

/**
 * Lotus Formation Test
 * 
 * Botanically accurate lotus built from our perfected petal:
 * - 3 layers (8, 13, 21 petals - Fibonacci)
 * - InstancedMesh for performance
 * - Golden angle rotation
 */
export function PetalShowcase() {
  return (
    <section className="relative w-full h-screen bg-brand-teal-dark overflow-hidden">
      {/* 3D Canvas */}
      <div className="absolute inset-0 w-full h-full">
        <Canvas
          camera={{ position: [0, 2, 8], fov: 45 }}
          shadows
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 2]}
        >
          <color attach="background" args={['#0d3838']} />
          
          <OrbitControls 
            enableDamping
            dampingFactor={0.05}
            minDistance={3}
            maxDistance={15}
            target={[0, 0, 0]}
          />
          
          <SceneLighting progress={0} />
          
          {/* Lotus Flower */}
          <LotusFlower scale={1} />
          
          <fog attach="fog" args={['#0d3838', 10, 20]} />
        </Canvas>
      </div>
      
      {/* Info */}
      <div className="fixed bottom-8 left-8 z-50 text-white/60 font-mono text-sm pointer-events-none">
        <div className="text-brand-saffron-light font-bold">Lotus Formation</div>
        <div className="mt-2 space-y-1 text-xs">
          <div>Layers: 3 (8, 13, 13 petals)</div>
          <div>Total: 34 petals, 7,140 vertices</div>
          <div>Draw calls: 3 (instanced)</div>
        </div>
        <div className="mt-2 text-xs opacity-60">💡 Drag to rotate • Scroll to zoom</div>
      </div>
    </section>
  );
}

