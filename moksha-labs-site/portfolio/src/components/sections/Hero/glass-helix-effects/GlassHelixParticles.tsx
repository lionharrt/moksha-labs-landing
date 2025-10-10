/**
 * Glass Helix Particles
 * 
 * DNA structure with glass crystal rungs connecting the strands
 */

'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MeshTransmissionMaterial } from '@react-three/drei';

interface GlassHelixParticlesProps {
  breakProgress: number;
}

const CONFIG = {
  PARTICLES_PER_STRAND: 80,
  HELIX_HEIGHT: 50, // Taller - more elongated DNA
  HELIX_RADIUS: 2.5, // Narrower radius - less squished
  HELIX_TURNS: 4, // More turns for that elongated look
  RUNG_FREQUENCY: 2, // Every 2nd particle gets a rung
  SPARKLE_COUNT: 120, // Reduced for performance
  GLOW_SPEED: 1.5,
  CAMERA_FLOAT_SPEED: 0.5,
  CAMERA_FLOAT_AMOUNT: 0.3,
};

export function GlassHelixParticles({ breakProgress }: GlassHelixParticlesProps) {
  const rungsGroupRef = useRef<THREE.Group>(null);
  const sparklesRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // Generate helix positions (for rungs only)
  const helixData = useMemo(() => {
    const rungData: Array<{
      corner1: THREE.Vector3;
      corner2: THREE.Vector3;
      corner3: THREE.Vector3;
      corner4: THREE.Vector3;
    }> = [];
    
    // Generate rungs between helical positions
    for (let i = 0; i < CONFIG.PARTICLES_PER_STRAND; i++) {
      // Create rungs every Nth particle
      // Connect 4 points to make actual rectangular steps
      // Skip first and last few to avoid clashing at extremes
      if (i % CONFIG.RUNG_FREQUENCY === 0 && i > 2 && i < CONFIG.PARTICLES_PER_STRAND - 4) {
        const t = i / CONFIG.PARTICLES_PER_STRAND;
        const y = (t - 0.5) * CONFIG.HELIX_HEIGHT;
        const angle = t * Math.PI * 2 * CONFIG.HELIX_TURNS;
        
        const x1 = Math.cos(angle) * CONFIG.HELIX_RADIUS;
        const z1 = Math.sin(angle) * CONFIG.HELIX_RADIUS;
        const x2 = Math.cos(angle + Math.PI) * CONFIG.HELIX_RADIUS;
        const z2 = Math.sin(angle + Math.PI) * CONFIG.HELIX_RADIUS;
        
        const nextI = i + 1;
        const nextT = nextI / CONFIG.PARTICLES_PER_STRAND;
        const nextY = (nextT - 0.5) * CONFIG.HELIX_HEIGHT;
        const nextAngle = nextT * Math.PI * 2 * CONFIG.HELIX_TURNS;
        
        // Four corners
        const corner1 = new THREE.Vector3(x1, y, z1); // Current strand 1
        const corner2 = new THREE.Vector3(
          Math.cos(nextAngle) * CONFIG.HELIX_RADIUS,
          nextY,
          Math.sin(nextAngle) * CONFIG.HELIX_RADIUS
        ); // Next strand 1
        const corner3 = new THREE.Vector3(x2, y, z2); // Current strand 2
        const corner4 = new THREE.Vector3(
          Math.cos(nextAngle + Math.PI) * CONFIG.HELIX_RADIUS,
          nextY,
          Math.sin(nextAngle + Math.PI) * CONFIG.HELIX_RADIUS
        ); // Next strand 2
        
        rungData.push({ corner1, corner2, corner3, corner4 });
      }
    }
    
    return { rungData };
  }, []);
  
  // Atmospheric particles (smoke/fog effect)
  const sparkleGeometry = useMemo(() => {
    const positions = new Float32Array(CONFIG.SPARKLE_COUNT * 3);
    const sizes = new Float32Array(CONFIG.SPARKLE_COUNT);
    
    for (let i = 0; i < CONFIG.SPARKLE_COUNT; i++) {
      // Distribute in volumetric cloud around helix
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 2 + Math.random() * 3; // Closer to helix
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = (Math.random() - 0.5) * CONFIG.HELIX_HEIGHT * 1.1;
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      
      // Varying sizes for depth
      sizes[i] = 0.05 + Math.random() * 0.15;
    }
    
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geom;
  }, []);
  
  useFrame((state) => {
    if (!groupRef.current || !rungsGroupRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Scroll-based rotation (2 full rotations as you scroll)
    groupRef.current.rotation.y = breakProgress * Math.PI * 4;
    
    // Mouse parallax tilt (subtle)
    const mouseX = state.pointer.x * 0.05;
    const mouseY = state.pointer.y * 0.05;
    groupRef.current.rotation.x = mouseY;
    groupRef.current.rotation.z = mouseX * 0.3;
    
    // Rotate sparkles slowly (independent of scroll)
    if (sparklesRef.current) {
      sparklesRef.current.rotation.y = time * 0.05;
      sparklesRef.current.rotation.x = time * 0.02;
    }
    
    // Build effect - reveal rungs progressively based on scroll
    const totalRungs = rungsGroupRef.current.children.length;
    
    rungsGroupRef.current.children.forEach((rung, i) => {
      // Calculate which rungs should be visible based on scroll progress
      // Start from TOP (1) and build downward to BOTTOM (0)
      const rungProgress = 1 - (i / totalRungs); // 1 to 0 (top to bottom)
      
      // This rung appears when scroll progress reaches its position
      // Add slight stagger for wave effect
      const appearThreshold = (1 - rungProgress) * 0.8; // Rungs appear across first 80% of scroll
      const disappearThreshold = (1 - rungProgress) * 0.8 + 0.2; // Start disappearing in last 20%
      
      let visibility = 0;
      
      if (breakProgress < appearThreshold) {
        // Not yet visible
        visibility = 0;
      } else if (breakProgress < appearThreshold + 0.08) {
        // Fading in (faster fade)
        visibility = (breakProgress - appearThreshold) / 0.08;
      } else if (breakProgress < disappearThreshold) {
        // Fully visible
        visibility = 1;
      } else {
        // Fading out (break apart effect at end)
        visibility = 1 - ((breakProgress - disappearThreshold) / 0.2);
      }
      
      visibility = Math.max(0, Math.min(1, visibility));
      
      // Apply visibility
      const material = (rung as THREE.Mesh).material as any;
      if (material.opacity !== undefined) {
        material.opacity = visibility * 0.85; // Max opacity of 0.85
      }
      
      // Very subtle emissive - let lighting do the work
      if (material.emissiveIntensity !== undefined) {
        material.emissiveIntensity = 0.05 + visibility * 0.08;
      }
      
      // Scale effect during fade in (less extreme)
      const scale = 0.5 + visibility * 0.5; // Scale from 0.5 to 1.0
      (rung as THREE.Mesh).scale.setScalar(scale);
    });
  });
  
  return (
    <group ref={groupRef}>
      {/* Rectangular rungs connecting 4 corners */}
      <group ref={rungsGroupRef}>
        {helixData.rungData.map((rung, i) => {
          // Uniform monochromatic teal - lighting will provide saffron
          const rungColor = i % 2 === 0 ? '#4d7a8c' : '#3d5f6f';
          
          // Create a custom geometry for the rectangle
          const geometry = new THREE.BufferGeometry();
          
          // Define vertices for the rectangle (4 corners)
          const vertices = new Float32Array([
            // Triangle 1
            rung.corner1.x, rung.corner1.y, rung.corner1.z,
            rung.corner2.x, rung.corner2.y, rung.corner2.z,
            rung.corner3.x, rung.corner3.y, rung.corner3.z,
            
            // Triangle 2
            rung.corner2.x, rung.corner2.y, rung.corner2.z,
            rung.corner4.x, rung.corner4.y, rung.corner4.z,
            rung.corner3.x, rung.corner3.y, rung.corner3.z,
          ]);
          
          geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
          geometry.computeVertexNormals();
          
          return (
            <mesh key={i} geometry={geometry}>
              {/* Polished materials with lighting */}
              <meshPhysicalMaterial
                color={rungColor}
                transparent
                opacity={0}
                side={THREE.DoubleSide}
                metalness={0.5}
                roughness={0.1}
                transmission={0.3}
                thickness={0.5}
                ior={1.5}
                emissive={rungColor}
                emissiveIntensity={0.08}
                envMapIntensity={1.2}
                clearcoat={0.8}
                clearcoatRoughness={0.2}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Atmospheric fog particles with subtle saffron hints */}
      <points ref={sparklesRef} geometry={sparkleGeometry}>
        <pointsMaterial
          size={0.1}
          color="#556677"
          transparent
          opacity={0.15}
          sizeAttenuation
          vertexColors={false}
        />
      </points>
    </group>
  );
}

