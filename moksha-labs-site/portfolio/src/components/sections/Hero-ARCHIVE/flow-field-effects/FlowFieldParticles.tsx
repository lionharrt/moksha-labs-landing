/**
 * Flow Field Particles
 * 
 * Uses simplified Perlin noise (pseudo-random smooth noise)
 * Each particle follows the force field, creating organic movement
 */

'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface FlowFieldParticlesProps {
  breakProgress: number;
}

const CONFIG = {
  COUNT: 800,
  TRAIL_LENGTH: 50, // Length of particle trail
  SPEED: 0.02,
  NOISE_SCALE: 0.3, // How zoomed in the noise is
  TIME_SCALE: 0.2, // How fast noise changes over time
  BOUNDS: { x: 8, y: 5, z: 2 },
};

// Simplified Perlin-like noise (smooth random)
function smoothNoise(x: number, y: number, z: number): number {
  // Create pseudo-random but smooth noise
  const n = Math.sin(x * 12.9898 + y * 78.233 + z * 43.145) * 43758.5453;
  return (n - Math.floor(n)) * 2 - 1; // -1 to 1
}

function perlinNoise3D(x: number, y: number, z: number): number {
  // Integer parts
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  
  // Fractional parts
  const xf = x - xi;
  const yf = y - yi;
  const zf = z - zi;
  
  // Smooth interpolation
  const u = xf * xf * (3.0 - 2.0 * xf);
  const v = yf * yf * (3.0 - 2.0 * yf);
  const w = zf * zf * (3.0 - 2.0 * zf);
  
  // Sample 8 corners of cube
  const aaa = smoothNoise(xi, yi, zi);
  const aba = smoothNoise(xi, yi + 1, zi);
  const aab = smoothNoise(xi, yi, zi + 1);
  const abb = smoothNoise(xi, yi + 1, zi + 1);
  const baa = smoothNoise(xi + 1, yi, zi);
  const bba = smoothNoise(xi + 1, yi + 1, zi);
  const bab = smoothNoise(xi + 1, yi, zi + 1);
  const bbb = smoothNoise(xi + 1, yi + 1, zi + 1);
  
  // Trilinear interpolation
  const x1 = aaa + u * (baa - aaa);
  const x2 = aba + u * (bba - aba);
  const x3 = aab + u * (bab - aab);
  const x4 = abb + u * (bbb - abb);
  
  const y1 = x1 + v * (x2 - x1);
  const y2 = x3 + v * (x4 - x3);
  
  return y1 + w * (y2 - y1);
}

class FlowParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  trail: THREE.Vector3[] = [];
  
  constructor() {
    this.position = new THREE.Vector3(
      (Math.random() - 0.5) * CONFIG.BOUNDS.x,
      (Math.random() - 0.5) * CONFIG.BOUNDS.y,
      (Math.random() - 0.5) * CONFIG.BOUNDS.z
    );
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.trail = [this.position.clone()];
  }
  
  update(time: number) {
    // Sample noise field at current position
    const noiseX = perlinNoise3D(
      this.position.x * CONFIG.NOISE_SCALE,
      this.position.y * CONFIG.NOISE_SCALE,
      time * CONFIG.TIME_SCALE
    );
    
    const noiseY = perlinNoise3D(
      this.position.x * CONFIG.NOISE_SCALE + 100,
      this.position.y * CONFIG.NOISE_SCALE + 100,
      time * CONFIG.TIME_SCALE
    );
    
    const noiseZ = perlinNoise3D(
      this.position.x * CONFIG.NOISE_SCALE + 200,
      this.position.y * CONFIG.NOISE_SCALE + 200,
      time * CONFIG.TIME_SCALE
    );
    
    // Convert noise to angle (flow direction)
    const angle = noiseX * Math.PI * 2;
    const force = new THREE.Vector3(
      Math.cos(angle) * CONFIG.SPEED,
      Math.sin(angle) * CONFIG.SPEED,
      noiseZ * CONFIG.SPEED * 0.5
    );
    
    this.velocity.lerp(force, 0.1); // Smooth acceleration
    this.position.add(this.velocity);
    
    // Wrap around bounds
    if (Math.abs(this.position.x) > CONFIG.BOUNDS.x) {
      this.position.x = -Math.sign(this.position.x) * CONFIG.BOUNDS.x;
      this.trail = [this.position.clone()];
    }
    if (Math.abs(this.position.y) > CONFIG.BOUNDS.y) {
      this.position.y = -Math.sign(this.position.y) * CONFIG.BOUNDS.y;
      this.trail = [this.position.clone()];
    }
    if (Math.abs(this.position.z) > CONFIG.BOUNDS.z) {
      this.position.z = -Math.sign(this.position.z) * CONFIG.BOUNDS.z;
      this.trail = [this.position.clone()];
    }
    
    // Update trail
    this.trail.unshift(this.position.clone());
    if (this.trail.length > CONFIG.TRAIL_LENGTH) {
      this.trail.pop();
    }
  }
}

export function FlowFieldParticles({ breakProgress }: FlowFieldParticlesProps) {
  const linesRef = useRef<THREE.LineSegments>(null);
  const { pointer } = useThree();
  
  // Create particles
  const particles = useMemo(() => {
    return Array.from({ length: CONFIG.COUNT }, () => new FlowParticle());
  }, []);
  
  // Create line geometry for trails
  const geometry = useMemo(() => {
    const maxPoints = CONFIG.COUNT * CONFIG.TRAIL_LENGTH;
    const positions = new Float32Array(maxPoints * 3 * 2); // 2 points per segment
    const colors = new Float32Array(maxPoints * 3 * 2);
    
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    return geom;
  }, []);
  
  useFrame((state) => {
    if (!linesRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Add mouse influence to noise
    const mouseInfluence = new THREE.Vector3(
      pointer.x * 4,
      pointer.y * 3,
      0
    );
    
    // Update particles
    particles.forEach(particle => particle.update(time));
    
    // Update line geometry
    const positions = geometry.attributes.position.array as Float32Array;
    const colors = geometry.attributes.color.array as Float32Array;
    
    let index = 0;
    particles.forEach((particle) => {
      for (let i = 0; i < particle.trail.length - 1; i++) {
        const current = particle.trail[i];
        const next = particle.trail[i + 1];
        
        // Add mouse attraction
        const distToMouse = current.distanceTo(mouseInfluence);
        const attraction = Math.max(0, 1 - distToMouse / 3);
        
        positions[index * 6] = current.x;
        positions[index * 6 + 1] = current.y;
        positions[index * 6 + 2] = current.z;
        
        positions[index * 6 + 3] = next.x;
        positions[index * 6 + 4] = next.y;
        positions[index * 6 + 5] = next.z;
        
        // Fade trail from bright to dim
        const alpha = (1 - i / particle.trail.length);
        const brightness = 0.5 + alpha * 0.5 + attraction * 0.3;
        
        // Color based on breakProgress (white -> blue)
        const r = 1.0 - breakProgress * 0.5;
        const g = 1.0 - breakProgress * 0.3;
        const b = 1.0;
        
        colors[index * 6] = r * brightness;
        colors[index * 6 + 1] = g * brightness;
        colors[index * 6 + 2] = b * brightness;
        
        colors[index * 6 + 3] = r * brightness * 0.8;
        colors[index * 6 + 4] = g * brightness * 0.8;
        colors[index * 6 + 5] = b * brightness * 0.8;
        
        index++;
      }
    });
    
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
    geometry.setDrawRange(0, index * 2);
  });
  
  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

