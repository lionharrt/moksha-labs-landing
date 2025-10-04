'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '@/stores/useStore';
import * as THREE from 'three';

export function AboutScene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const currentSection = useStore((state) => state.currentSection);
  
  const isActive = currentSection === 'about';
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    meshRef.current.rotation.y += delta * 0.15;
    
    const targetOpacity = isActive ? 1 : 0;
    const currentOpacity = (meshRef.current.material as THREE.MeshStandardMaterial).opacity;
    (meshRef.current.material as THREE.MeshStandardMaterial).opacity = THREE.MathUtils.lerp(
      currentOpacity,
      targetOpacity,
      delta * 3
    );
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#6366f1"
        transparent
        opacity={0}
      />
    </mesh>
  );
}

