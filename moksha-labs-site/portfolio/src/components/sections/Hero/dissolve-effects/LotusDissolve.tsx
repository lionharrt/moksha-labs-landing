/**
 * Lotus Dissolve - Wireframe alternative
 * 
 * Lotus petals that dissolve upward
 * Represents opening and liberation
 */

'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LotusDissolveProps {
  breakProgress: number;
}

function Lotus({ breakProgress }: { breakProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        dissolve: { value: 0 },
      },
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
    });
  }, []);

  useFrame(() => {
    if (material) {
      material.uniforms.dissolve.value = breakProgress;
    }
    // Subtle rotation
    if (groupRef.current) {
      groupRef.current.rotation.z = breakProgress * Math.PI * 0.1;
    }
  });

  // Create lotus petals
  const petals = useMemo(() => {
    const petalGeometries: JSX.Element[] = [];
    const numPetals = 8;
    
    for (let i = 0; i < numPetals; i++) {
      const angle = (i / numPetals) * Math.PI * 2;
      const x = Math.cos(angle) * 0.8;
      const y = Math.sin(angle) * 0.8;
      
      petalGeometries.push(
        <mesh
          key={i}
          position={[x, y, 0]}
          rotation={[0, 0, angle]}
          material={material}
        >
          <planeGeometry args={[1, 2, 32, 32]} />
        </mesh>
      );
    }
    
    return petalGeometries;
  }, [material]);

  return (
    <group ref={groupRef}>
      {/* Center */}
      <mesh material={material}>
        <circleGeometry args={[0.5, 32]} />
      </mesh>
      {/* Petals */}
      {petals}
    </group>
  );
}

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float dissolve;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  
  void main() {
    // Vertical dissolve (bottom to top)
    // Get vertical position - petals are positioned differently, so use both y and distance
    float verticalPos = (vPosition.y + 2.0) / 4.0; // Normalize to 0-1 (accounting for petal offset)
    
    // Add noise for organic edge
    float noiseValue = noise(vUv * 8.0) * 0.15;
    
    // Combine vertical position with noise
    float threshold = verticalPos + noiseValue;
    
    // Normalize threshold to 0-1 range
    threshold = clamp(threshold, 0.0, 1.0);
    
    // Dissolve from bottom up - expand dissolve range to ensure full dissolution
    // Add 0.15 buffer to ensure everything dissolves by dissolve=1.0
    if (threshold < (dissolve + 0.15)) {
      discard;
    }
    
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
`;

export function LotusDissolve({ breakProgress }: LotusDissolveProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ background: 'transparent' }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.5} />
      <Lotus breakProgress={breakProgress} />
    </Canvas>
  );
}

