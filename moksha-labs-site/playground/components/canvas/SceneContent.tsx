/**
 * Scene Content with Scroll Camera
 * Camera travels from sun to planet's dynamic orbital position
 * 
 * Award-winning space environment with:
 * - Multi-layer star fields
 * - Procedural nebulae
 * - Milky Way band
 * - Enhanced post-processing
 */

'use client';

import { useRef } from 'react';
import { Sun } from './Sun';
import { Planet } from './Planet';
import {
  BackgroundStars,
  SpaceDust,
  SpaceHDRI,
} from './SpaceEnvironment';
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
  HueSaturation,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useScrollCamera } from '@/hooks/useScrollCamera';
import * as THREE from 'three';

export function SceneContent() {
  const planetRef = useRef<THREE.Mesh>(null);

  // Camera follows planet's orbital position
  useScrollCamera({
    planetRef,
    orbitRadius: 5,
    orbitHeight: 2,
  });

  return (
    <>
      {/* Real space HDRI environment (professional approach) */}
      <SpaceHDRI />

      {/* Ambient lighting - very subtle for space */}
      <ambientLight intensity={0.15} color="#7a8fb5" />

      {/* Additional star layers for depth */}
      <BackgroundStars />
      <SpaceDust />

      {/* Sun at center with rotating text */}
      <Sun />

      {/* Orbiting Planet - far from sun */}
      <Planet ref={planetRef} />

      {/* Post-processing for cinematic space look */}
      <EffectComposer>
        {/* Strong bloom for stars and sun */}
        <Bloom
          intensity={2.5}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.8}
          mipmapBlur
        />
        
        {/* Subtle chromatic aberration for lens feel */}
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.0008, 0.0008)}
        />
        
        {/* Color grading - slight purple/blue space tint */}
        <HueSaturation
          hue={0}
          saturation={0.15}
        />
        
        {/* Vignette for depth and focus */}
        <Vignette
          offset={0.3}
          darkness={0.7}
        />
      </EffectComposer>
    </>
  );
}

