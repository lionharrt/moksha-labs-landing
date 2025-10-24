'use client';

import { useMemo } from 'react';
import { CircleGeometry } from 'three';

/**
 * Lotus Stamen - Simple Center
 * 
 * Plain circular disc perpendicular to Z (facing up)
 */

interface LotusStamenProps {
  radius?: number;
  scale?: number;
}

export function LotusStamen({ radius = 0.4, scale = 1 }: LotusStamenProps) {
  
  // Create simple flat circle geometry
  const stamenGeometry = useMemo(() => {
    const r = radius * scale;
    // Plain CircleGeometry - flat disc
    return new CircleGeometry(r, 32); // 32 segments for smooth circle
  }, [radius, scale]);
  
  return (
    <mesh 
      geometry={stamenGeometry} 
      rotation={[0, 0, 0]} // Already perpendicular to Z
      position={[0, 0, 0.05 * scale]} // Slightly raised
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color="#d4a86e" // Light golden/tan
        roughness={0.6}
        metalness={0.2}
      />
    </mesh>
  );
}
