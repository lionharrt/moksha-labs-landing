/**
 * Crystal Component
 * 
 * Rotating crystal with glass-like material
 * Uses MeshPhysicalMaterial for realistic glass refraction
 */

'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MeshTransmissionMaterial } from '@react-three/drei';

interface CrystalProps {
  breakProgress: number;
}

export function Crystal({ breakProgress }: CrystalProps) {
  const crystalRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  // Generate particle positions around crystal
  const particleCount = 200;
  const particlePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    // Spherical distribution
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const radius = 2 + Math.random() * 1;
    
    particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    particlePositions[i * 3 + 2] = radius * Math.cos(phi);
  }
  
  useFrame((state) => {
    if (!crystalRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Rotate crystal slowly
    crystalRef.current.rotation.y = time * 0.3;
    crystalRef.current.rotation.x = Math.sin(time * 0.2) * 0.2;
    
    // Scale/shatter effect based on breakProgress
    if (breakProgress > 0) {
      const scale = 1 + breakProgress * 0.5;
      crystalRef.current.scale.set(scale, scale, scale);
      
      // Increase roughness as it breaks
      const material = crystalRef.current.material as any;
      if (material.roughness !== undefined) {
        material.roughness = breakProgress * 0.5;
      }
    } else {
      crystalRef.current.scale.set(1, 1, 1);
    }
    
    // Rotate particles
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.1;
      particlesRef.current.rotation.x = time * 0.05;
    }
  });
  
  return (
    <group>
      {/* Main Crystal - Icosahedron shape */}
      <mesh ref={crystalRef} castShadow receiveShadow>
        <icosahedronGeometry args={[1.2, 0]} />
        <MeshTransmissionMaterial
          backside
          samples={16}
          resolution={1024}
          transmission={1}
          roughness={0}
          thickness={1.5}
          ior={1.5}
          chromaticAberration={0.3}
          anisotropy={1}
          distortion={0.2}
          distortionScale={0.5}
          temporalDistortion={0.1}
          clearcoat={1}
          attenuationDistance={0.5}
          attenuationColor="#ffffff"
          color="#ffffff"
        />
      </mesh>
      
      {/* Surrounding sparkle particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#ffffff"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
      
      {/* Inner glow core */}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial
          color="#88ccff"
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}

