/**
 * Helix Particles
 * 
 * Creates a double helix structure with:
 * - Two spiral strands
 * - Connecting "rungs" between them
 * - Pulsing glow effect
 * - Rotation animation
 */

'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HelixParticlesProps {
  breakProgress: number;
}

const CONFIG = {
  PARTICLES_PER_STRAND: 100,
  HELIX_HEIGHT: 6,
  HELIX_RADIUS: 1.5,
  HELIX_TURNS: 3,
  RUNG_FREQUENCY: 5, // Connect every N particles
  GLOW_SPEED: 2,
};

export function HelixParticles({ breakProgress }: HelixParticlesProps) {
  const strand1Ref = useRef<THREE.Points>(null);
  const strand2Ref = useRef<THREE.Points>(null);
  const rungsRef = useRef<THREE.LineSegments>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // Generate helix positions
  const helixData = useMemo(() => {
    const strand1Positions = new Float32Array(CONFIG.PARTICLES_PER_STRAND * 3);
    const strand2Positions = new Float32Array(CONFIG.PARTICLES_PER_STRAND * 3);
    const strand1Colors = new Float32Array(CONFIG.PARTICLES_PER_STRAND * 3);
    const strand2Colors = new Float32Array(CONFIG.PARTICLES_PER_STRAND * 3);
    
    // Generate two helical strands
    for (let i = 0; i < CONFIG.PARTICLES_PER_STRAND; i++) {
      const t = i / CONFIG.PARTICLES_PER_STRAND;
      const y = (t - 0.5) * CONFIG.HELIX_HEIGHT;
      const angle = t * Math.PI * 2 * CONFIG.HELIX_TURNS;
      
      // Strand 1
      strand1Positions[i * 3] = Math.cos(angle) * CONFIG.HELIX_RADIUS;
      strand1Positions[i * 3 + 1] = y;
      strand1Positions[i * 3 + 2] = Math.sin(angle) * CONFIG.HELIX_RADIUS;
      
      // Strand 2 (180 degrees offset)
      strand2Positions[i * 3] = Math.cos(angle + Math.PI) * CONFIG.HELIX_RADIUS;
      strand2Positions[i * 3 + 1] = y;
      strand2Positions[i * 3 + 2] = Math.sin(angle + Math.PI) * CONFIG.HELIX_RADIUS;
      
      // Colors - cyan and magenta
      strand1Colors[i * 3] = 0.3;
      strand1Colors[i * 3 + 1] = 0.8;
      strand1Colors[i * 3 + 2] = 1.0;
      
      strand2Colors[i * 3] = 1.0;
      strand2Colors[i * 3 + 1] = 0.3;
      strand2Colors[i * 3 + 2] = 0.8;
    }
    
    // Generate connecting rungs
    const rungIndices: number[] = [];
    for (let i = 0; i < CONFIG.PARTICLES_PER_STRAND; i += CONFIG.RUNG_FREQUENCY) {
      rungIndices.push(i);
    }
    
    return {
      strand1Positions,
      strand2Positions,
      strand1Colors,
      strand2Colors,
      rungIndices,
    };
  }, []);
  
  // Create geometries
  const strand1Geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(helixData.strand1Positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(helixData.strand1Colors, 3));
    return geom;
  }, [helixData]);
  
  const strand2Geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(helixData.strand2Positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(helixData.strand2Colors, 3));
    return geom;
  }, [helixData]);
  
  // Create rung lines geometry
  const rungsGeometry = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    
    helixData.rungIndices.forEach((i) => {
      // Start point (strand 1)
      positions.push(
        helixData.strand1Positions[i * 3],
        helixData.strand1Positions[i * 3 + 1],
        helixData.strand1Positions[i * 3 + 2]
      );
      
      // End point (strand 2)
      positions.push(
        helixData.strand2Positions[i * 3],
        helixData.strand2Positions[i * 3 + 1],
        helixData.strand2Positions[i * 3 + 2]
      );
      
      // White color for rungs
      colors.push(1, 1, 1, 1, 1, 1);
    });
    
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    return geom;
  }, [helixData]);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Rotate the entire helix
    groupRef.current.rotation.y = time * 0.3;
    
    // Pulsing glow effect on particles
    if (strand1Ref.current && strand2Ref.current) {
      const pulse = (Math.sin(time * CONFIG.GLOW_SPEED) + 1) / 2;
      const baseSize = 0.08;
      const glowSize = baseSize + pulse * 0.04;
      
      (strand1Ref.current.material as THREE.PointsMaterial).size = glowSize;
      (strand2Ref.current.material as THREE.PointsMaterial).size = glowSize;
    }
    
    // Break apart effect based on scroll
    if (breakProgress > 0) {
      const spread = breakProgress * 3;
      
      // Spread strands outward
      if (strand1Ref.current) {
        strand1Ref.current.position.x = -spread;
      }
      if (strand2Ref.current) {
        strand2Ref.current.position.x = spread;
      }
      
      // Fade out rungs
      if (rungsRef.current) {
        (rungsRef.current.material as THREE.LineBasicMaterial).opacity = 1 - breakProgress;
      }
    } else {
      // Reset positions
      if (strand1Ref.current) {
        strand1Ref.current.position.x = 0;
      }
      if (strand2Ref.current) {
        strand2Ref.current.position.x = 0;
      }
      if (rungsRef.current) {
        (rungsRef.current.material as THREE.LineBasicMaterial).opacity = 0.5;
      }
    }
  });
  
  return (
    <group ref={groupRef}>
      {/* Strand 1 (cyan) */}
      <points ref={strand1Ref} geometry={strand1Geometry}>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
      
      {/* Strand 2 (magenta) */}
      <points ref={strand2Ref} geometry={strand2Geometry}>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
      
      {/* Connecting rungs */}
      <lineSegments ref={rungsRef} geometry={rungsGeometry}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

