/**
 * Orbiting Planet Component
 * A distant planet that orbits around the sun
 */

'use client';

import { useRef, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Planet = forwardRef<THREE.Mesh>((props, ref) => {
  const orbitGroupRef = useRef<THREE.Group>(null);

  // Orbit animation
  useFrame((state) => {
    if (orbitGroupRef.current) {
      // Slow orbit around sun
      orbitGroupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
    
    if (ref && 'current' in ref && ref.current) {
      // Planet self-rotation
      ref.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group ref={orbitGroupRef}>
      {/* Planet positioned very far from sun */}
      <mesh ref={ref} position={[45, 0, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color="#3a7ca5"
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
      
      {/* Subtle rim light on planet */}
      <pointLight
        position={[45, 0, 0]}
        intensity={0.3}
        distance={3}
        color="#6fa8dc"
      />
    </group>
  );
});

Planet.displayName = 'Planet';

