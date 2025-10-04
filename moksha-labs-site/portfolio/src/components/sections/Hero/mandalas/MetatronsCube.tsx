'use client';

import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MetatronsCubeProps {
  breakProgress: number;
}

/**
 * METATRON'S CUBE
 * 13 circles (1 center + 12 around) connected to form all 5 Platonic solids
 * Named after Archangel Metatron
 * Contains: Tetrahedron, Cube, Octahedron, Dodecahedron, Icosahedron
 * Mathematical basis: Fruit of Life pattern with specific geometric connections
 */
export function MetatronsCube({ breakProgress }: MetatronsCubeProps) {
  const groupRef = useRef<THREE.Group>(null);

  const mandalaElements = useMemo(() => {
    const elements: JSX.Element[] = [];
    const radius = 0.3;
    const thickness = 0.02;
    
    // 13 Circles: 1 center + 2 inner ring (6) + 1 outer ring (6)
    const positions: [number, number][] = [[0, 0]]; // Center
    
    // Inner hexagon (6 circles)
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const distance = radius * 2;
      positions.push([
        Math.cos(angle) * distance,
        Math.sin(angle) * distance
      ]);
    }
    
    // Outer hexagon (6 circles)
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const distance = radius * 4;
      positions.push([
        Math.cos(angle) * distance,
        Math.sin(angle) * distance
      ]);
    }
    
    // Draw all 13 circles
    positions.forEach((pos, i) => {
      elements.push(
        <mesh key={`circle-${i}`} position={[pos[0], pos[1], 0]}>
          <torusGeometry args={[radius, thickness, 16, 32]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
      );
    });
    
    // Connect all circles to all circles (creates the sacred geometry)
    // This forms the framework for all Platonic solids
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const [x1, y1] = positions[i];
        const [x2, y2] = positions[j];
        
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const angle = Math.atan2(y2 - y1, x2 - x1);
        
        elements.push(
          <mesh 
            key={`line-${i}-${j}`}
            position={[midX, midY, 0]}
            rotation={[0, 0, angle]}
          >
            <boxGeometry args={[length, thickness * 0.5, thickness * 0.5]} />
            <meshBasicMaterial color="#ffffff" wireframe opacity={0.3} transparent />
          </mesh>
        );
      }
    }
    
    // Highlight Platonic solid outlines within the cube
    // Tetrahedron (4 vertices)
    const tetraIndices = [0, 1, 3, 7]; // Specific circle indices that form tetrahedron
    for (let i = 0; i < tetraIndices.length; i++) {
      for (let j = i + 1; j < tetraIndices.length; j++) {
        const idx1 = tetraIndices[i];
        const idx2 = tetraIndices[j];
        const [x1, y1] = positions[idx1];
        const [x2, y2] = positions[idx2];
        
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const angle = Math.atan2(y2 - y1, x2 - x1);
        
        elements.push(
          <mesh 
            key={`tetra-${i}-${j}`}
            position={[midX, midY, 0.1]}
            rotation={[0, 0, angle]}
          >
            <boxGeometry args={[length, thickness * 2, thickness * 2]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        );
      }
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

    // Rotate to reveal the 3D nature of the cube
    groupRef.current.rotation.z = breakProgress * Math.PI * 0.4;
    groupRef.current.rotation.y = breakProgress * Math.PI * 0.3;

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
      
      const distance = breakProgress * 15;
      mesh.position.x = originalPos.x + normalizedX * distance;
      mesh.position.y = originalPos.y + normalizedY * distance;
      mesh.position.z = originalPos.z + Math.sin(index * 0.3 + breakProgress * Math.PI) * distance * 0.4;
      
      mesh.rotation.x = breakProgress * Math.PI * (index % 3) * 1.2;
      mesh.rotation.y = breakProgress * Math.PI * 2.8;
      
      const scale = 1 - breakProgress * 0.8;
      mesh.scale.setScalar(Math.max(0.1, scale));
      
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

