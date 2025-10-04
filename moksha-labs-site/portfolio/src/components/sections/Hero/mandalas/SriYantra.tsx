'use client';

import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SriYantraProps {
  breakProgress: number;
}

/**
 * SRI YANTRA
 * Nine interlocking triangles radiating from a central point (bindu)
 * 4 upward triangles (Shiva - masculine) + 5 downward triangles (Shakti - feminine)
 * Represents the cosmos and union of divine masculine and feminine
 * Mathematical precision: Specific angles and intersections based on sacred ratios
 */
export function SriYantra({ breakProgress }: SriYantraProps) {
  const groupRef = useRef<THREE.Group>(null);

  const mandalaElements = useMemo(() => {
    const elements: JSX.Element[] = [];
    const thickness = 0.02;
    
    // Central bindu (point)
    elements.push(
      <mesh key="bindu" position={[0, 0, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    );
    
    // Inner circle
    elements.push(
      <mesh key="inner-circle" position={[0, 0, 0]}>
        <torusGeometry args={[0.3, thickness, 16, 32]} />
        <meshBasicMaterial color="#ffffff" wireframe />
      </mesh>
    );
    
    // 9 Interlocking triangles - 4 upward (Shiva)
    const sizes = [0.8, 1.2, 1.6, 2.0];
    for (let i = 0; i < 4; i++) {
      const size = sizes[i];
      const offset = i * 0.1;
      
      // Create triangle using three lines
      const height = (size * Math.sqrt(3)) / 2;
      
      // Base
      elements.push(
        <mesh 
          key={`shiva-${i}-base`}
          position={[0, -height/3 + offset, 0]}
          rotation={[0, 0, 0]}
        >
          <boxGeometry args={[size, thickness, thickness]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
      );
      
      // Left side
      elements.push(
        <mesh 
          key={`shiva-${i}-left`}
          position={[-size/4, height/6 + offset, 0]}
          rotation={[0, 0, Math.PI / 3]}
        >
          <boxGeometry args={[size * 0.577, thickness, thickness]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
      );
      
      // Right side
      elements.push(
        <mesh 
          key={`shiva-${i}-right`}
          position={[size/4, height/6 + offset, 0]}
          rotation={[0, 0, -Math.PI / 3]}
        >
          <boxGeometry args={[size * 0.577, thickness, thickness]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
      );
    }
    
    // 5 Downward triangles (Shakti)
    const sizesDown = [0.6, 1.0, 1.4, 1.8, 2.2];
    for (let i = 0; i < 5; i++) {
      const size = sizesDown[i];
      const offset = -i * 0.08;
      const height = (size * Math.sqrt(3)) / 2;
      
      // Base (top for downward triangle)
      elements.push(
        <mesh 
          key={`shakti-${i}-base`}
          position={[0, height/3 + offset, 0]}
          rotation={[0, 0, 0]}
        >
          <boxGeometry args={[size, thickness, thickness]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
      );
      
      // Left side
      elements.push(
        <mesh 
          key={`shakti-${i}-left`}
          position={[-size/4, -height/6 + offset, 0]}
          rotation={[0, 0, -Math.PI / 3]}
        >
          <boxGeometry args={[size * 0.577, thickness, thickness]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
      );
      
      // Right side
      elements.push(
        <mesh 
          key={`shakti-${i}-right`}
          position={[size/4, -height/6 + offset, 0]}
          rotation={[0, 0, Math.PI / 3]}
        >
          <boxGeometry args={[size * 0.577, thickness, thickness]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
      );
    }
    
    // Outer square with 4 T-gates (traditional Sri Yantra enclosure)
    const squareSize = 2.8;
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      elements.push(
        <mesh 
          key={`square-${i}`}
          position={[0, 0, 0]}
          rotation={[0, 0, angle]}
        >
          <boxGeometry args={[thickness, squareSize, thickness]} />
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

    // Slow rotation maintaining symmetry
    groupRef.current.rotation.z = breakProgress * Math.PI * 0.25;

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
      
      const distance = breakProgress * 12;
      mesh.position.x = originalPos.x + normalizedX * distance;
      mesh.position.y = originalPos.y + normalizedY * distance;
      mesh.position.z = originalPos.z + Math.cos(index * 0.5 + breakProgress * Math.PI) * distance * 0.3;
      
      // Different rotation for triangles vs squares
      if (index < 30) { // Triangles
        mesh.rotation.x = breakProgress * Math.PI * (index % 2 === 0 ? 1.5 : -1.5);
        mesh.rotation.y = breakProgress * Math.PI * 2.5;
      } else { // Squares
        mesh.rotation.z += breakProgress * Math.PI * 4;
      }
      
      const scale = 1 - breakProgress * 0.75;
      mesh.scale.setScalar(Math.max(0.15, scale));
      
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

