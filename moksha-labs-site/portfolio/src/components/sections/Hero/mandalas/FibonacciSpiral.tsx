'use client';

import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FibonacciSpiralProps {
  breakProgress: number;
}

/**
 * FIBONACCI SPIRAL / GOLDEN RATIO MANDALA
 * Based on Phi (φ = 1.618...) - the golden ratio
 * Fibonacci sequence: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89...
 * Found in nautilus shells, galaxies, DNA, flower petals, and throughout nature
 * Mathematical basis: Each number is sum of previous two; ratio approaches φ
 */
export function FibonacciSpiral({ breakProgress }: FibonacciSpiralProps) {
  const groupRef = useRef<THREE.Group>(null);

  const mandalaElements = useMemo(() => {
    const elements: JSX.Element[] = [];
    const PHI = 1.618033988749; // Golden ratio
    const thickness = 0.02;
    
    // Fibonacci sequence
    const fibonacci = [1, 1, 2, 3, 5, 8, 13, 21];
    
    // Golden spiral using fibonacci rectangles
    let x = 0, y = 0;
    let size = 0.1; // Starting size
    let rotation = 0;
    
    fibonacci.forEach((fib, index) => {
      const scaledSize = size * fib;
      
      // Draw square/rectangle for this fibonacci number
      elements.push(
        <mesh 
          key={`fib-rect-${index}`}
          position={[x, y, 0]}
          rotation={[0, 0, rotation]}
        >
          <boxGeometry args={[scaledSize, scaledSize, thickness]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
      );
      
      // Draw quarter-circle arc for the spiral
      const segments = 16;
      for (let i = 0; i < segments; i++) {
        const angle1 = (i / segments) * (Math.PI / 2) + rotation;
        const angle2 = ((i + 1) / segments) * (Math.PI / 2) + rotation;
        
        const x1 = x + Math.cos(angle1) * scaledSize;
        const y1 = y + Math.sin(angle1) * scaledSize;
        const x2 = x + Math.cos(angle2) * scaledSize;
        const y2 = y + Math.sin(angle2) * scaledSize;
        
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const lineAngle = Math.atan2(y2 - y1, x2 - x1);
        
        elements.push(
          <mesh 
            key={`spiral-${index}-${i}`}
            position={[midX, midY, 0]}
            rotation={[0, 0, lineAngle]}
          >
            <boxGeometry args={[length, thickness * 1.5, thickness * 1.5]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        );
      }
      
      // Calculate next position based on spiral growth
      rotation += Math.PI / 2;
      
      if (index % 4 === 0) {
        x += scaledSize;
      } else if (index % 4 === 1) {
        y += scaledSize;
      } else if (index % 4 === 2) {
        x -= scaledSize;
      } else {
        y -= scaledSize;
      }
    });
    
    // Add golden ratio circles at key points
    const goldenCircles = [1, PHI, PHI * PHI, PHI * PHI * PHI];
    goldenCircles.forEach((scale, i) => {
      const angle = i * (Math.PI * 2) / goldenCircles.length;
      elements.push(
        <mesh 
          key={`golden-circle-${i}`}
          position={[Math.cos(angle) * scale * 0.5, Math.sin(angle) * scale * 0.5, 0]}
        >
          <torusGeometry args={[0.2 * scale, thickness, 16, 32]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
      );
    });
    
    // Central point
    elements.push(
      <mesh key="center" position={[0, 0, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    );
    
    // Phi ratio lines emanating from center
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const length = PHI;
      elements.push(
        <mesh 
          key={`phi-ray-${i}`}
          position={[0, 0, 0]}
          rotation={[0, 0, angle]}
        >
          <boxGeometry args={[thickness, length * 1.5, thickness]} />
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

    // Spiral rotation
    groupRef.current.rotation.z = breakProgress * Math.PI * 1.618; // Golden ratio rotation

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
      
      // Spiral outward motion
      const spiralAngle = breakProgress * Math.PI * 4;
      const spiralDistance = breakProgress * 10;
      const spiralX = Math.cos(spiralAngle + Math.atan2(originalPos.y, originalPos.x)) * spiralDistance * 0.3;
      const spiralY = Math.sin(spiralAngle + Math.atan2(originalPos.y, originalPos.x)) * spiralDistance * 0.3;
      
      mesh.position.x = originalPos.x + normalizedX * spiralDistance + spiralX;
      mesh.position.y = originalPos.y + normalizedY * spiralDistance + spiralY;
      mesh.position.z = originalPos.z + Math.sin(index * 1.618 + breakProgress * Math.PI) * spiralDistance * 0.25;
      
      mesh.rotation.x = breakProgress * Math.PI * 1.618 * (index % 2 === 0 ? 1 : -1);
      mesh.rotation.y = breakProgress * Math.PI * 2.618;
      
      const scale = 1 - breakProgress * 0.7;
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

