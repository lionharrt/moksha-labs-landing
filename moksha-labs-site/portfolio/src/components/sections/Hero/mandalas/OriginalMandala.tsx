'use client';

import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface OriginalMandalaProps {
  breakProgress: number;
}

export function OriginalMandala({ breakProgress }: OriginalMandalaProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Create mandala structure with multiple rings and patterns
  const mandalaElements = useMemo(() => {
    const elements: JSX.Element[] = [];
    
    // Outer ring - 8 petals
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      elements.push(
        <mesh key={`petal-${i}`} position={[0, 0, 0]} rotation={[0, 0, angle]}>
          <torusGeometry args={[2.5, 0.03, 16, 32, Math.PI / 4]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
      );
    }
    
    // Middle ring - 6 circles
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const radius = 1.5;
      elements.push(
        <mesh 
          key={`circle-${i}`} 
          position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
        >
          <torusGeometry args={[0.4, 0.02, 16, 32]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
      );
    }
    
    // Inner geometric pattern - 12 lines radiating
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      elements.push(
        <mesh 
          key={`line-${i}`}
          position={[0, 0, 0]}
          rotation={[0, 0, angle]}
        >
          <boxGeometry args={[0.02, 1.2, 0.02]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
      );
    }
    
    // Center circles - 3 concentric
    for (let i = 0; i < 3; i++) {
      const radius = 0.3 + i * 0.2;
      elements.push(
        <mesh key={`center-${i}`} position={[0, 0, 0]}>
          <torusGeometry args={[radius, 0.02, 16, 32]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
      );
    }

    return elements;
  }, []);

  // Store original positions once
  const originalPositions = useRef<THREE.Vector3[]>([]);
  
  useEffect(() => {
    if (groupRef.current && originalPositions.current.length === 0) {
      groupRef.current.children.forEach((child) => {
        originalPositions.current.push(child.position.clone());
      });
    }
  }, []);

  useFrame(() => {
    if (!groupRef.current || originalPositions.current.length === 0) return;

    // Rotation ONLY based on break progress
    groupRef.current.rotation.z = breakProgress * Math.PI * 0.5;

    // Break apart effect - each child moves outward from its ORIGINAL position
    groupRef.current.children.forEach((child, index) => {
      const mesh = child as THREE.Mesh;
      const originalPos = originalPositions.current[index];
      
      // Calculate direction from center to original position
      let dirX = originalPos.x;
      let dirY = originalPos.y;
      const length = Math.sqrt(dirX * dirX + dirY * dirY);
      
      let normalizedX, normalizedY;
      if (length === 0) {
        // Center pieces - give them a direction based on index
        const angle = (index / groupRef.current!.children.length) * Math.PI * 2;
        normalizedX = Math.cos(angle);
        normalizedY = Math.sin(angle);
      } else {
        normalizedX = dirX / length;
        normalizedY = dirY / length;
      }
      
      // Fly out in the direction of original position
      const distance = breakProgress * 10;
      mesh.position.x = originalPos.x + normalizedX * distance;
      mesh.position.y = originalPos.y + normalizedY * distance;
      mesh.position.z = originalPos.z + (Math.sin(index) * 0.5 - 0.25) * distance * 0.3;
      
      // Rotate individual pieces - ONLY based on break progress
      mesh.rotation.x = breakProgress * Math.PI * 2 * (index % 2 === 0 ? 1 : -1);
      mesh.rotation.y = breakProgress * Math.PI * 3;
      
      // Scale down as they fly away
      const scale = 1 - breakProgress * 0.7;
      mesh.scale.setScalar(Math.max(0.1, scale));
      
      // Fade out completely
      const material = mesh.material as THREE.MeshBasicMaterial;
      material.opacity = 1 - breakProgress;
      material.transparent = true;
    });
  });

  return (
    <group ref={groupRef}>
      {mandalaElements}
    </group>
  );
}

