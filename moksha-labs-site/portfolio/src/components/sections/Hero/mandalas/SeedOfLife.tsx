'use client';

import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SeedOfLifeProps {
  breakProgress: number;
}

/**
 * SEED OF LIFE
 * Foundation pattern: 7 overlapping circles in hexagonal symmetry
 * Represents the 7 days of creation
 * Forms the basis for Flower of Life, Tree of Life, and Egg of Life
 * Mathematical basis: 1 center circle + 6 surrounding circles, all same radius
 * Perfect hexagonal geometry - each circle passes through center of adjacent circles
 */
export function SeedOfLife({ breakProgress }: SeedOfLifeProps) {
  const groupRef = useRef<THREE.Group>(null);

  const mandalaElements = useMemo(() => {
    const elements: JSX.Element[] = [];
    const radius = 0.8;
    const thickness = 0.03;
    
    // Center circle (Day 1 - The void/potential)
    elements.push(
      <mesh key="center" position={[0, 0, 0]}>
        <torusGeometry args={[radius, thickness, 16, 32]} />
        <meshBasicMaterial color="#ffffff" wireframe />
      </mesh>
    );
    
    // 6 surrounding circles in perfect hexagonal pattern (Days 2-7)
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      elements.push(
        <mesh key={`petal-${i}`} position={[x, y, 0]}>
          <torusGeometry args={[radius, thickness, 16, 32]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
      );
    }
    
    // Vesica Piscis (sacred almond shapes) - intersection points
    // These represent the division and creation process
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const nextAngle = ((i + 1) / 6) * Math.PI * 2;
      
      // Vesica between center and each petal
      elements.push(
        <mesh 
          key={`vesica-center-${i}`}
          position={[Math.cos(angle) * radius * 0.5, Math.sin(angle) * radius * 0.5, 0]}
          rotation={[0, 0, angle]}
        >
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
      );
      
      // Lines connecting centers (hexagon)
      const x1 = Math.cos(angle) * radius;
      const y1 = Math.sin(angle) * radius;
      const x2 = Math.cos(nextAngle) * radius;
      const y2 = Math.sin(nextAngle) * radius;
      
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      const lineAngle = Math.atan2(y2 - y1, x2 - x1);
      
      elements.push(
        <mesh 
          key={`hexagon-${i}`}
          position={[midX, midY, 0]}
          rotation={[0, 0, lineAngle]}
        >
          <boxGeometry args={[length, thickness, thickness]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
      );
    }
    
    // Inner hexagon (star pattern)
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      elements.push(
        <mesh 
          key={`star-ray-${i}`}
          position={[0, 0, 0]}
          rotation={[0, 0, angle]}
        >
          <boxGeometry args={[thickness, radius, thickness]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
      );
    }
    
    // Sacred ratios - smaller circles at intersection points
    for (let i = 0; i < 6; i++) {
      const angle1 = (i / 6) * Math.PI * 2;
      const angle2 = ((i + 1) / 6) * Math.PI * 2;
      
      // Intersection points
      const x = (Math.cos(angle1) + Math.cos(angle2)) * radius * 0.333;
      const y = (Math.sin(angle1) + Math.sin(angle2)) * radius * 0.333;
      
      elements.push(
        <mesh key={`intersection-${i}`} position={[x, y, 0]}>
          <torusGeometry args={[0.15, thickness * 0.8, 12, 24]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
      );
    }
    
    // Outer protective circle
    elements.push(
      <mesh key="outer-circle" position={[0, 0, 0]}>
        <torusGeometry args={[radius * 2, thickness * 0.7, 16, 32]} />
        <meshBasicMaterial color="#ffffff" wireframe />
      </mesh>
    );

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

    // Slow, meditative rotation
    groupRef.current.rotation.z = breakProgress * Math.PI * 0.5;

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
      
      const distance = breakProgress * 9;
      mesh.position.x = originalPos.x + normalizedX * distance;
      mesh.position.y = originalPos.y + normalizedY * distance;
      mesh.position.z = originalPos.z + Math.sin(index * 0.7 + breakProgress * Math.PI * 0.7) * distance * 0.2;
      
      // Gentle rotation
      mesh.rotation.x = breakProgress * Math.PI * (index % 3 === 0 ? 1 : -1);
      mesh.rotation.y = breakProgress * Math.PI * 1.5;
      
      const scale = 1 - breakProgress * 0.65;
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

