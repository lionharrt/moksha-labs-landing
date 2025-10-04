'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '@/stores/useStore';
import * as THREE from 'three';

export function HeroScene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const currentSection = useStore((state) => state.currentSection);
  const scrollProgress = useStore((state) => state.scrollProgress);
  
  const isActive = currentSection === 'hero';
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Gentle rotation
    meshRef.current.rotation.y += delta * 0.2;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    
    // Fade in/out based on section
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
      <torusGeometry args={[1, 0.4, 16, 32]} />
      <meshStandardMaterial
        color="#000000"
        transparent
        opacity={1}
      />
    </mesh>
  );
}

