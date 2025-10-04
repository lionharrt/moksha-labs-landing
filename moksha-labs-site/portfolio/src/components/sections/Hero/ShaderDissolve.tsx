/**
 * Shader Dissolve - Minimal Implementation
 * 
 * Layer 1: Basic noise-based fade out
 * Geometry dissolves organically as breakProgress increases
 */

'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ShaderDissolveProps {
  breakProgress: number;
}

// VERTEX SHADER - Just passes data through
const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// FRAGMENT SHADER - Simple noise dissolve
const fragmentShader = `
  uniform float dissolve;
  varying vec2 vUv;
  
  // Simple noise function
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
    // Generate noise at UV coordinates
    float noiseValue = noise(vUv * 5.0); // Scale controls noise frequency
    
    // If noise is below dissolve threshold, discard pixel
    if (noiseValue < dissolve) {
      discard;
    }
    
    // Simple white color for the geometry
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
`;

export function ShaderDissolve({ breakProgress }: ShaderDissolveProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Create shader material
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

  // Update dissolve uniform based on breakProgress
  useFrame(() => {
    if (material) {
      material.uniforms.dissolve.value = breakProgress;
    }
  });

  // SOLID mandala geometry - rings and petals with actual surface area
  const geometry = useMemo(() => {
    const geometries: THREE.BufferGeometry[] = [];
    
    // Center solid circle
    const centerCircle = new THREE.CircleGeometry(0.3, 32);
    geometries.push(centerCircle);
    
    // 6 outer petals (solid circles)
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const petal = new THREE.CircleGeometry(0.5, 32);
      petal.translate(Math.cos(angle) * 1.2, Math.sin(angle) * 1.2, 0);
      geometries.push(petal);
    }
    
    // Connecting ring segments (filled arcs between petals)
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const ring = new THREE.RingGeometry(0.8, 1.0, 32, 1, angle - 0.3, 0.6);
      geometries.push(ring);
    }
    
    // Merge all geometries
    const mergedGeometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const uvs: number[] = [];
    
    geometries.forEach((geo) => {
      const pos = geo.attributes.position;
      const uv = geo.attributes.uv;
      
      for (let i = 0; i < pos.count; i++) {
        positions.push(pos.getX(i), pos.getY(i), pos.getZ(i));
        if (uv) {
          uvs.push(uv.getX(i), uv.getY(i));
        } else {
          // Generate UV from position
          const x = pos.getX(i);
          const y = pos.getY(i);
          uvs.push((x + 2) / 4, (y + 2) / 4);
        }
      }
    });
    
    mergedGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    mergedGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    
    return mergedGeometry;
  }, []);

  return <mesh ref={meshRef} geometry={geometry} material={material} />;
}

