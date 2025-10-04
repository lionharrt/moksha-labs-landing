'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '@/stores/useStore';
import * as THREE from 'three';

export function WorkScene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const currentSection = useStore((state) => state.currentSection);
  
  const isActive = currentSection === 'work';
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    meshRef.current.rotation.x += delta * 0.3;
    meshRef.current.rotation.y += delta * 0.2;
    
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
      <octahedronGeometry args={[1.2, 0]} />
      <meshStandardMaterial
        color="#000000"
        transparent
        opacity={0}
        wireframe
      />
    </mesh>
  );
}

