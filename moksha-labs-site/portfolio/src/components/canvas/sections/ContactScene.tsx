'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '@/stores/useStore';
import * as THREE from 'three';

export function ContactScene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const currentSection = useStore((state) => state.currentSection);
  
  const isActive = currentSection === 'contact';
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    meshRef.current.rotation.y += delta * 0.1;
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.2;
    
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
      <torusKnotGeometry args={[0.8, 0.3, 64, 8]} />
      <meshStandardMaterial
        color="#000000"
        transparent
        opacity={0}
      />
    </mesh>
  );
}

