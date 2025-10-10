/**
 * Crystal Gem - Glass Refraction Effect
 * 
 * A rotating crystal/gem with:
 * - Glass-like material with refraction
 * - Chromatic aberration
 * - Bloom/glow effect
 * - Dynamic lighting
 * 
 * Creates a premium, luxury aesthetic
 */

'use client';

import { Canvas } from '@react-three/fiber';
import { Crystal } from './Crystal';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Environment } from '@react-three/drei';

interface CrystalGemProps {
  breakProgress: number;
}

export function CrystalGem({ breakProgress }: CrystalGemProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ background: 'transparent' }}
      dpr={[1, 2]}
    >
      {/* HDRI lighting for reflections */}
      <Environment preset="city" />
      
      {/* Main lights */}
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-5, -5, 5]} intensity={0.5} color="#4488ff" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        castShadow
      />
      
      <Crystal breakProgress={breakProgress} />
      
      {/* Post-processing for glow */}
      <EffectComposer>
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>
    </Canvas>
  );
}

