/**
 * Scene Wrapper
 * Switches between different example scenes
 */

'use client';

import { OrbitControls } from '@react-three/drei';
import { useStore } from '@/stores/useStore';
import { BasicScene } from './examples/BasicScene';
import { InteractiveBox } from './examples/InteractiveBox';
import { ParticleField } from './examples/ParticleField';
import { siteConfig } from '@/config/site';

export function SceneWrapper() {
  const currentExample = useStore((state) => state.currentExample);

  return (
    <>
      {/* Camera controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={2}
        maxDistance={20}
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#0088ff" />
      
      {/* Render current example */}
      {currentExample === 'basic-scene' && <BasicScene />}
      {currentExample === 'interactive' && <InteractiveBox />}
      {currentExample === 'particles' && <ParticleField />}
    </>
  );
}

