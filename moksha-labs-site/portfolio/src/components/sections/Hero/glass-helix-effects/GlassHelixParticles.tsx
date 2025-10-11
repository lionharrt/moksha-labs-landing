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
  PARTICLES_PER_STRAND: 200, // More particles for longer helix
  HELIX_HEIGHT: 120, // Much taller - extends beyond view
  HELIX_RADIUS: 2.5, // Narrower radius - less squished
  HELIX_TURNS: 10, // More turns to maintain density
  RUNG_FREQUENCY: 2, // Every 2nd particle gets a rung
  RUNG_SEGMENTS: 10, // Segments to curve the rung edges (higher = smoother curve)
  SPARKLE_COUNT: 120, // Reduced for performance
  GLOW_SPEED: 1.5,
  CAMERA_FLOAT_SPEED: 0.5,
  CAMERA_FLOAT_AMOUNT: 0.3,
};

export function GlassHelixParticles({ breakProgress }: GlassHelixParticlesProps) {
  const rungsGroupRef = useRef<THREE.Group>(null);
  const sparklesGroupRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);
  const travelingLightsRef = useRef<THREE.Group>(null);
  
  // Generate helix positions with curved rungs
  const helixData = useMemo(() => {
    const rungData: Array<{
      geometry: THREE.BufferGeometry;
    }> = [];
    
    // Helper function to get helix position at parameter t
    const getHelixPoint = (t: number, strandOffset: number = 0): THREE.Vector3 => {
      const y = (t - 0.5) * CONFIG.HELIX_HEIGHT;
      const angle = t * Math.PI * 2 * CONFIG.HELIX_TURNS + strandOffset;
      const x = Math.cos(angle) * CONFIG.HELIX_RADIUS;
      const z = Math.sin(angle) * CONFIG.HELIX_RADIUS;
      return new THREE.Vector3(x, y, z);
    };
    
    // Generate rungs between helical positions
    for (let i = 0; i < CONFIG.PARTICLES_PER_STRAND; i++) {
      // Create rungs every Nth particle
      // Only skip a couple at very edges
      if (i % CONFIG.RUNG_FREQUENCY === 0 && i > 2 && i < CONFIG.PARTICLES_PER_STRAND - 3) {
        const startI = i;
        const endI = i + 1;
        
        // Sample points along the helix curve for both strands
        const strand1Points: THREE.Vector3[] = [];
        const strand2Points: THREE.Vector3[] = [];
        
        for (let seg = 0; seg <= CONFIG.RUNG_SEGMENTS; seg++) {
          const t = startI / CONFIG.PARTICLES_PER_STRAND + 
                    (seg / CONFIG.RUNG_SEGMENTS) * (1 / CONFIG.PARTICLES_PER_STRAND);
          
          // Strand 1 (angle offset 0)
          strand1Points.push(getHelixPoint(t, 0));
          
          // Strand 2 (angle offset PI - opposite side)
          strand2Points.push(getHelixPoint(t, Math.PI));
        }
        
        // Create a curved mesh connecting the two strands
        // Build vertices for a strip of quads following the curve
        const vertices: number[] = [];
        
        for (let seg = 0; seg < CONFIG.RUNG_SEGMENTS; seg++) {
          const p1 = strand1Points[seg];
          const p2 = strand1Points[seg + 1];
          const p3 = strand2Points[seg];
          const p4 = strand2Points[seg + 1];
          
          // Triangle 1: p1, p2, p3
          vertices.push(p1.x, p1.y, p1.z);
          vertices.push(p2.x, p2.y, p2.z);
          vertices.push(p3.x, p3.y, p3.z);
          
          // Triangle 2: p2, p4, p3
          vertices.push(p2.x, p2.y, p2.z);
          vertices.push(p4.x, p4.y, p4.z);
          vertices.push(p3.x, p3.y, p3.z);
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        geometry.computeVertexNormals();
        
        rungData.push({ geometry });
      }
    }
    
    return { rungData };
  }, []);
  
  // Create diamond/star sprite texture for sparkles
  const sparkleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    
    // Clear with transparent background
    ctx.clearRect(0, 0, 128, 128);
    
    const centerX = 64;
    const centerY = 64;
    
    // Draw diamond/star shape with clean edges
    ctx.save();
    ctx.translate(centerX, centerY);
    
    // Create a 4-pointed star/diamond path
    ctx.beginPath();
    const points = 4;
    const outerRadius = 50;
    const innerRadius = 18;
    
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points;
      const x = Math.cos(angle - Math.PI / 2) * radius;
      const y = Math.sin(angle - Math.PI / 2) * radius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    
    // Clip to star shape
    ctx.clip();
    
    // Fill with radial gradient INSIDE the star shape
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, outerRadius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(0.6, 'rgba(220, 220, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(200, 200, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(-outerRadius, -outerRadius, outerRadius * 2, outerRadius * 2);
    
    ctx.restore();
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
  
  // Create sparkle instances with positions, rotations, and sizes
  const sparkleData = useMemo(() => {
    const data: Array<{
      position: THREE.Vector3;
      rotation: number;
      size: number;
    }> = [];
    
    for (let i = 0; i < CONFIG.SPARKLE_COUNT; i++) {
      // Distribute in volumetric cloud around helix
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 2 + Math.random() * 3;
      
      const position = new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        (Math.random() - 0.5) * CONFIG.HELIX_HEIGHT * 0.8, // Stay within visible fog zone
        radius * Math.sin(phi) * Math.sin(theta)
      );
      
      const rotation = Math.random() * Math.PI * 2;
      const size = 0.08 + Math.random() * 0.12;
      
      data.push({ position, rotation, size });
    }
    
    return data;
  }, []);
  
  useFrame((state) => {
    if (!groupRef.current || !rungsGroupRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Scroll-based rotation (2 full rotations as you scroll)
    const currentRotation = breakProgress * Math.PI * 4;
    groupRef.current.rotation.y = currentRotation;
    
    // Mouse parallax tilt (subtle)
    const mouseX = state.pointer.x * 0.05;
    const mouseY = state.pointer.y * 0.05;
    groupRef.current.rotation.x = mouseY;
    groupRef.current.rotation.z = mouseX * 0.3;
    
    // Rotate traveling lights WITH the helix for constant edge catching
    if (travelingLightsRef.current) {
      travelingLightsRef.current.rotation.y = currentRotation;
    }
    
    // Rotate sparkles slowly and pulse opacity
    if (sparklesGroupRef.current) {
      sparklesGroupRef.current.rotation.y = time * 0.05;
      sparklesGroupRef.current.rotation.x = time * 0.02;
      
      // Pulse individual sparkles
      sparklesGroupRef.current.children.forEach((sprite, i) => {
        const material = (sprite as THREE.Sprite).material as THREE.SpriteMaterial;
        // Staggered pulsing for more organic feel
        const phase = i * 0.1;
        material.opacity = (0.25 + Math.sin(time * 2 + phase) * 0.15) * 0.8;
      });
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
      
      // Apply visibility (higher base opacity for more visibility)
      const material = (rung as THREE.Mesh).material as any;
      if (material.opacity !== undefined) {
        material.opacity = visibility * 0.95; // Increased from 0.85 to 0.95
      }
      
      // Very subtle emissive - let lighting do the work
      if (material.emissiveIntensity !== undefined) {
        material.emissiveIntensity = 0.05 + visibility * 0.08;
      }
      
      // Keep scale at 1.0 - no zoom effect
      (rung as THREE.Mesh).scale.setScalar(1.0);
    });
  });
  
  return (
    <group ref={groupRef}>
      {/* Curved rungs following the helix path */}
      <group ref={rungsGroupRef}>
        {helixData.rungData.map((rung, i) => {
          // Pure white/crystal for maximum reflectivity and monochrome theme
          const rungColor = i % 2 === 0 ? '#ffffff' : '#f0f0f5';
          
          return (
            <mesh key={i} geometry={rung.geometry}>
              {/* Polished materials with lighting */}
              <meshPhysicalMaterial
                color={rungColor}
                transparent
                opacity={0}
                side={THREE.DoubleSide}
                metalness={0.7}
                roughness={0.05}
                transmission={0.15}
                thickness={0.8}
                ior={1.5}
                emissive={rungColor}
                emissiveIntensity={0.15}
                envMapIntensity={1.5}
                clearcoat={1.0}
                clearcoatRoughness={0.1}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Movie-style traveling lights that orbit with the structure */}
      <group ref={travelingLightsRef}>
        {/* Rim light 1 - orbits to catch edges */}
        <pointLight
          position={[CONFIG.HELIX_RADIUS * 1.5, 5, 0]}
          intensity={2.5}
          color="#d4a574"
          distance={8}
          decay={2}
        />
        {/* Rim light 2 - opposite side for fill */}
        <pointLight
          position={[-CONFIG.HELIX_RADIUS * 1.5, -5, 0]}
          intensity={2}
          color="#cc9966"
          distance={8}
          decay={2}
        />
        {/* Rim light 3 - front for sparkle */}
        <pointLight
          position={[0, 0, CONFIG.HELIX_RADIUS * 1.8]}
          intensity={3}
          color="#ffffff"
          distance={10}
          decay={2}
        />
        {/* Rim light 4 - back rim */}
        <pointLight
          position={[0, 0, -CONFIG.HELIX_RADIUS * 1.5]}
          intensity={1.5}
          color="#8899aa"
          distance={8}
          decay={2}
        />
      </group>
      
      {/* Crystal sparkles with diamond shape - using sprites for proper rotation */}
      <group ref={sparklesGroupRef}>
        {sparkleData.map((sparkle, i) => (
          <sprite
            key={i}
            position={sparkle.position}
            scale={[sparkle.size, sparkle.size, sparkle.size]}
            rotation={[0, 0, sparkle.rotation]}
          >
            <spriteMaterial
              map={sparkleTexture}
              transparent
              opacity={0.35}
              color="#ffffff"
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        ))}
      </group>
    </group>
  );
}

