/**
 * Example 1: Basic Scene
 * Simple cube with lights - your first Three.js scene
 */

'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export function BasicScene() {
  const cubeRef = useRef<THREE.Mesh>(null);

  // Animation loop - runs 60fps
  useFrame((state, delta) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.y += delta;
      cubeRef.current.rotation.x += delta * 0.5;
    }
  });

  return (
    <group>
      {/* Rotating cube */}
      <mesh ref={cubeRef} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
      
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#1ea7fd" />
      </mesh>
    </group>
  );
}

