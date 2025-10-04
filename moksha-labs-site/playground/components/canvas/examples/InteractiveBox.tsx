/**
 * Example 2: Interactive Box
 * Click and hover interactions
 */

'use client';

import { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export function InteractiveBox() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.3;
      
      // Rotate when clicked
      if (clicked) {
        meshRef.current.rotation.y += 0.05;
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      onClick={() => setClicked(!clicked)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={clicked ? 1.5 : hovered ? 1.2 : 1}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={clicked ? '#ff00ff' : hovered ? '#00ff00' : '#ff6b6b'} 
        roughness={0.5}
        metalness={0.5}
      />
    </mesh>
  );
}

