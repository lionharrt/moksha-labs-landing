'use client';

import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FlowerOfLifeProps {
  breakProgress: number;
}

/**
 * FLOWER OF LIFE
 * Sacred geometry pattern of 19 overlapping circles
 * Represents creation, interconnectedness, and the fundamental forms of space and time
 * Mathematical basis: Circles with radius R, centers separated by R
 */
export function FlowerOfLife({ breakProgress }: FlowerOfLifeProps) {
  const groupRef = useRef<THREE.Group>(null);

  const mandalaElements = useMemo(() => {
    const elements: JSX.Element[] = [];
    const radius = 0.5;
    const thickness = 0.02;
    
    // Center circle
    elements.push(
      <mesh key="center" position={[0, 0, 0]}>
        <torusGeometry args={[radius, thickness, 16, 32]} />
        <meshBasicMaterial color="#ffffff" wireframe />
      </mesh>
    );
    
    // First ring - 6 circles around center (hexagonal pattern)
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      elements.push(
        <mesh key={`ring1-${i}`} position={[x, y, 0]}>
          <torusGeometry args={[radius, thickness, 16, 32]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
      );
    }
    
    // Second ring - 12 circles (outer petals)
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const distance = i % 2 === 0 ? radius * 2 : radius * Math.sqrt(3);
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      elements.push(
        <mesh key={`ring2-${i}`} position={[x, y, 0]}>
          <torusGeometry args={[radius, thickness, 16, 32]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
      );
    }
    
    // Vesica Piscis lines (sacred almond shapes formed by circle intersections)
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      elements.push(
        <mesh 
          key={`vesica-${i}`}
          position={[0, 0, 0]}
          rotation={[0, 0, angle]}
        >
          <boxGeometry args={[0.02, radius * 2, 0.02]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
      );
    }

    return elements;
  }, []);

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

    groupRef.current.rotation.z = breakProgress * Math.PI * 0.3;

    groupRef.current.children.forEach((child, index) => {
      const mesh = child as THREE.Mesh;
      const originalPos = originalPositions.current[index];
      
      let dirX = originalPos.x;
      let dirY = originalPos.y;
      const length = Math.sqrt(dirX * dirX + dirY * dirY);
      
      let normalizedX, normalizedY;
      if (length === 0) {
        const angle = (index / groupRef.current!.children.length) * Math.PI * 2;
        normalizedX = Math.cos(angle);
        normalizedY = Math.sin(angle);
      } else {
        normalizedX = dirX / length;
        normalizedY = dirY / length;
      }
      
      const distance = breakProgress * 8;
      mesh.position.x = originalPos.x + normalizedX * distance;
      mesh.position.y = originalPos.y + normalizedY * distance;
      mesh.position.z = originalPos.z + Math.sin(index + breakProgress * Math.PI) * distance * 0.2;
      
      mesh.rotation.x = breakProgress * Math.PI * (index % 3);
      mesh.rotation.y = breakProgress * Math.PI * 2;
      
      const scale = 1 - breakProgress * 0.6;
      mesh.scale.setScalar(Math.max(0.2, scale));
      
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

