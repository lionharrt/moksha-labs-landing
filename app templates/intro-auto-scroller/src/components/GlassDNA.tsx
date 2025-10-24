/**
 * Glass DNA Helix - Canvas Wrapper
 * 
 * Renders the glass helix with lighting and effects
 */

import { Canvas } from '@react-three/fiber';
import { GlassHelixParticles } from './GlassHelixParticles';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

interface GlassDNAProps {
  rotationProgress: number;
  opacity: number;
}

export function GlassDNA({ rotationProgress, opacity }: GlassDNAProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 60 }}
      style={{ background: 'transparent' }}
      dpr={[1, 2]}
    >
      {/* Center-focused lighting */}
      <ambientLight intensity={0.15} />
      <fog attach="fog" args={['#0a0f14', 12, 40]} />
      
      {/* === MAIN CENTER SAFFRON ZONE === */}
      
      {/* Primary saffron spotlight from left */}
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
      
      {/* Primary saffron spotlight from right */}
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
      
      {/* Teal accent from front */}
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
      
      <GlassHelixParticles 
        rotationProgress={rotationProgress}
        opacity={opacity}
      />
      
      {/* Bloom to enhance reflections */}
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

