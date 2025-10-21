/**
 * Scene Camera Component
 * 
 * Animated camera with drift and zoom effects
 */

'use client';

import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface SceneCameraProps {
  progress: number;
  driftAmount: number;
  zoomProgress: number;
}

export function SceneCamera({ progress, driftAmount, zoomProgress }: SceneCameraProps) {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3(0, 3, 8));
  const initialPosition = new THREE.Vector3(0, 3, 8);
  const finalPosition = new THREE.Vector3(0, 2, 5);
  
  useFrame((state) => {
    // Subtle drift based on time
    const time = state.clock.elapsedTime;
    const driftX = Math.sin(time * 0.3) * driftAmount;
    const driftY = Math.cos(time * 0.4) * driftAmount * 0.5;
    
    // Zoom during outro phase
    const zoomedPosition = new THREE.Vector3().lerpVectors(
      initialPosition,
      finalPosition,
      zoomProgress
    );
    
    // Apply drift
    targetPosition.current.set(
      zoomedPosition.x + driftX,
      zoomedPosition.y + driftY,
      zoomedPosition.z
    );
    
    // Smooth camera movement
    camera.position.lerp(targetPosition.current, 0.05);
    
    // Look at center with slight offset from drift
    camera.lookAt(driftX * 0.5, driftY * 0.5, 0);
  });
  
  return null;
}

