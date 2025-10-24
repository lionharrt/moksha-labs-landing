'use client';

import { useRef, useMemo } from 'react';
import { Mesh } from 'three';
import { createPetalGeometry, PETAL_LOD } from '../utils/createPetalGeometry';

/**
 * Lotus Petal Component
 * 
 * Uses optimized geometry utility with LOD support
 * Preserves the exact mathematical shape we perfected
 */

interface LotusPetalProps {
  progress?: number;
  /** LOD level: 'high', 'medium', or 'low' */
  lod?: 'high' | 'medium' | 'low';
}

export function LotusPetal({ progress = 0, lod = 'high' }: LotusPetalProps) {
  const meshRef = useRef<Mesh>(null);

  const petalGeometry = useMemo(() => {
    const lodLevel = lod === 'high' ? PETAL_LOD.HIGH : lod === 'medium' ? PETAL_LOD.MEDIUM : PETAL_LOD.LOW;
    return createPetalGeometry(lodLevel.u, lodLevel.v);
  }, [lod]);

  return (
    <mesh 
      ref={meshRef} 
      geometry={petalGeometry}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color="#e89f4c"
        roughness={0.6}
        metalness={0.1}
        side={2}
      />
    </mesh>
  );
}
