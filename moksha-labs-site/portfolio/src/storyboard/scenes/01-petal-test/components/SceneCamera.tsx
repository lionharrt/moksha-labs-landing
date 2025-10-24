'use client';

import { useRef } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Scene Camera for Petal Test
 * 
 * Position: Looking down at petal from slight angle
 * Goal: Showcase the 3D form and curvature
 */

interface SceneCameraProps {
  progress?: number;
}

export function SceneCamera({ progress = 0 }: SceneCameraProps) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useFrame((state) => {
    if (!cameraRef.current) return;
    
    // Very subtle camera drift for dynamic feel
    const time = state.clock.elapsedTime;
    cameraRef.current.position.x = Math.sin(time * 0.1) * 0.2;
    cameraRef.current.position.y = 2 + Math.sin(time * 0.15) * 0.1;
    
    // Always look at center where petal is
    cameraRef.current.lookAt(0, 0, 0);
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 2, 5]}
      fov={45}
      near={0.1}
      far={100}
    />
  );
}

