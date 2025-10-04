'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '@/stores/useStore';
import * as THREE from 'three';

export function ServicesScene() {
  const groupRef = useRef<THREE.Group>(null);
  const currentSection = useStore((state) => state.currentSection);
  
  const isActive = currentSection === 'services';
  
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Subtle orbit animation
    groupRef.current.rotation.y += delta * 0.1;
    
    // Fade based on section
    groupRef.current.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        const targetOpacity = isActive ? 1 : 0;
        const currentOpacity = (child.material as THREE.MeshStandardMaterial).opacity;
        (child.material as THREE.MeshStandardMaterial).opacity = THREE.MathUtils.lerp(
          currentOpacity,
          targetOpacity,
          delta * 3
        );
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh position={[-2, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#6366f1" transparent opacity={0} />
      </mesh>
      
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#8b5cf6" transparent opacity={0} />
      </mesh>
      
      <mesh position={[2, 0, 0]}>
        <torusGeometry args={[0.5, 0.2, 16, 32]} />
        <meshStandardMaterial color="#a855f7" transparent opacity={0} />
      </mesh>
    </group>
  );
}

