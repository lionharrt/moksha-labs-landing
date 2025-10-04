'use client';

import { useRef } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useStore } from '@/stores/useStore';
import * as THREE from 'three';

export function Camera() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const currentSection = useStore((state) => state.currentSection);
  
  // Smooth camera movement between sections
  useFrame((state, delta) => {
    if (!cameraRef.current) return;
    
    // Define target positions per section
    const targets: Record<string, [number, number, number]> = {
      hero: [0, 0, 5],
      services: [0, 0, 5],
      work: [0, 0, 5],
      about: [0, 0, 5],
      contact: [0, 0, 5],
    };
    
    const target = targets[currentSection] || [0, 0, 5];
    const targetVec = new THREE.Vector3(...target);
    
    // Smooth interpolation
    cameraRef.current.position.lerp(targetVec, delta * 2);
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 0, 5]}
      fov={75}
      near={0.1}
      far={1000}
    />
  );
}

