/**
 * Silk Surface Component
 * 
 * Procedurally generated silk surface with vertex shader ripples.
 * Mathematics-driven, smooth, continuous waves.
 */

'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SilkSurfaceProps {
  opacity: number;
  rippleIntensity: number;
  rippleSpeed: number;
}

// Vertex shader for silk ripple effect
const vertexShader = `
  uniform float uTime;
  uniform float uRippleIntensity;
  uniform float uRippleSpeed;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vElevation;
  
  // Smooth wave function using sine and cosine
  float wave(vec2 pos, float time) {
    float freq1 = 2.0;
    float freq2 = 3.0;
    float speed1 = uRippleSpeed;
    float speed2 = uRippleSpeed * 0.7;
    
    float wave1 = sin(pos.x * freq1 + time * speed1) * cos(pos.y * freq1 + time * speed1);
    float wave2 = sin(pos.x * freq2 - time * speed2) * sin(pos.y * freq2 + time * speed2);
    
    return (wave1 + wave2 * 0.5) * 0.5;
  }
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    
    // Calculate elevation based on wave function
    float elevation = wave(position.xy, uTime) * uRippleIntensity;
    vElevation = elevation;
    
    // Displace vertex along normal
    vec3 displaced = position + normal * elevation;
    vPosition = displaced;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

// Fragment shader for silk material
const fragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uRippleIntensity;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vElevation;
  
  void main() {
    // Fresnel effect for silk-like appearance
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - max(0.0, dot(viewDirection, vNormal)), 3.0);
    
    // Color based on elevation for subtle variation
    float elevationFactor = vElevation * 0.5 + 0.5;
    vec3 color = mix(uColor, uColor * 1.2, elevationFactor * 0.3);
    
    // Add fresnel glow
    color += vec3(0.1, 0.05, 0.0) * fresnel * uRippleIntensity;
    
    // Smooth lighting
    float light = max(0.3, dot(vNormal, normalize(vec3(1.0, 1.0, 0.5))));
    color *= light;
    
    gl_FragColor = vec4(color, uOpacity);
  }
`;

export function SilkSurface({ opacity, rippleIntensity, rippleSpeed }: SilkSurfaceProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create shader material with uniforms
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uRippleIntensity: { value: 0 },
        uRippleSpeed: { value: rippleSpeed },
        uColor: { value: new THREE.Color('#1a4d4d') }, // Brand teal
        uOpacity: { value: opacity },
      },
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, [rippleSpeed]);
  
  // Update uniforms on each frame
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const mat = meshRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uRippleIntensity.value = rippleIntensity;
    mat.uniforms.uOpacity.value = opacity;
  });
  
  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
    >
      {/* High-resolution plane for smooth ripples */}
      <planeGeometry args={[20, 20, 128, 128]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

