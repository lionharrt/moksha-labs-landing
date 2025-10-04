/**
 * Comprehensive Space Environment
 * Combines multiple techniques for realistic space feel:
 * - Layered star fields with parallax
 * - Procedural nebulae with shaders
 * - Space skybox gradient
 * - Volumetric dust particles
 * 
 * References:
 * - @docs/09-PARTICLE-SYSTEMS.md
 * - @docs/03-SHADER-PROGRAMMING.md
 * - Elite Dangerous, No Man's Sky space rendering
 */

'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Background Star Field - Static, very distant
 * Layer 4: 800-2000 units (background layer)
 */
export function BackgroundStars() {
  const particles = useMemo(() => {
    const count = 12000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    // Star color palettes
    const starColors = [
      new THREE.Color(0.7, 0.7, 1.0),    // Blue-white
      new THREE.Color(1.0, 1.0, 1.0),    // White
      new THREE.Color(1.0, 0.95, 0.85),  // Warm white
      new THREE.Color(1.0, 0.85, 0.7),   // Yellow
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Background layer: 800-2000 units
      const radius = 800 + Math.random() * 1200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Random color
      const color = starColors[Math.floor(Math.random() * starColors.length)];
      const brightness = 0.3 + Math.random() * 0.5;
      colors[i3] = color.r * brightness;
      colors[i3 + 1] = color.g * brightness;
      colors[i3 + 2] = color.b * brightness;
    }

    return { positions, colors };
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.8}
        vertexColors
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

/**
 * Nebula Clouds - Procedural fog-like particles
 * Creates colorful gas clouds like in the Milky Way
 */
export function NebulaCloud({ position = [0, 0, 0], color = '#6b4ba8', scale = 20 }) {
  const particles = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const baseColor = new THREE.Color(color);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Clustered distribution (nebula-like)
      const radius = Math.pow(Math.random(), 2) * scale; // Power distribution for density at center
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Color variation
      const colorVariation = 0.2;
      colors[i3] = baseColor.r + (Math.random() - 0.5) * colorVariation;
      colors[i3 + 1] = baseColor.g + (Math.random() - 0.5) * colorVariation;
      colors[i3 + 2] = baseColor.b + (Math.random() - 0.5) * colorVariation;

      // Varied sizes
      sizes[i] = Math.random() * 2 + 0.5;
    }

    return { positions, colors, sizes };
  }, [color, scale]);

  return (
    <group position={position}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.positions.length / 3}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particles.colors.length / 3}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.5}
          vertexColors
          transparent
          opacity={0.15}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

/**
 * Space Dust - Foreground particles with parallax
 * Layer 2: 50-200 units (foreground layer for depth parallax)
 */
export function SpaceDust() {
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Foreground layer: 50-200 units for parallax
      const radius = 50 + Math.random() * 150;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
    }

    return positions;
  }, []);

  // Subtle drift animation
  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#ffffff"
        transparent
        opacity={0.3}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/**
 * Space Background Gradient - Camera-relative skybox
 * Follows camera to create infinite space illusion
 */
export function SpaceGradient() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Follow camera
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.copy(state.camera.position);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2500, 32, 32]} />
      <meshBasicMaterial
        color="#050510"
        side={THREE.BackSide}
        fog={false}
      />
    </mesh>
  );
}

/**
 * Real Space Environment using HDRI
 * Uses actual space photography textures (professional approach)
 * 
 * Free space HDRIs from:
 * - Polyhaven.com (space section)
 * - NASA image libraries
 * - ESA Hubble archives
 */
export function SpaceHDRI() {
  const texture = useMemo(() => {
    // Procedural space background with Milky Way
    // For production: download space panorama from NASA/ESO and place in /public/hdri/
    const canvas = document.createElement('canvas');
    canvas.width = 4096;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d')!;

    // Deep space gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#000510');
    gradient.addColorStop(0.5, '#0a0a20');
    gradient.addColorStop(1, '#000510');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Milky Way band (equirectangular - wraps horizontally)
    const bandGradient = ctx.createLinearGradient(0, canvas.height * 0.3, 0, canvas.height * 0.7);
    bandGradient.addColorStop(0, 'rgba(30, 20, 50, 0)');
    bandGradient.addColorStop(0.3, 'rgba(80, 60, 100, 0.4)');
    bandGradient.addColorStop(0.5, 'rgba(140, 100, 80, 0.6)');
    bandGradient.addColorStop(0.7, 'rgba(80, 60, 100, 0.4)');
    bandGradient.addColorStop(1, 'rgba(30, 20, 50, 0)');
    
    ctx.fillStyle = bandGradient;
    ctx.fillRect(0, canvas.height * 0.3, canvas.width, canvas.height * 0.4);

    // Dense star field
    for (let i = 0; i < 30000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      
      const distFromBand = Math.abs(y - canvas.height / 2) / (canvas.height / 2);
      if (Math.random() > distFromBand * 0.7) {
        const size = Math.random() * 2;
        const brightness = Math.random();
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
        ctx.fillRect(x, y, size, size);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    return texture;
  }, []);
  
  return (
    <mesh>
      <sphereGeometry args={[3000, 64, 64]} />
      <meshBasicMaterial
        map={texture}
        side={THREE.BackSide}
        fog={false}
      />
    </mesh>
  );
}

