/**
 * Scene Lighting Component
 * 
 * Lighting setup for Silk Emergence scene
 */

'use client';

import React from 'react';

interface SceneLightingProps {
  keyLightIntensity: number;
}

export function SceneLighting({ keyLightIntensity }: SceneLightingProps) {
  return (
    <>
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.3} color="#ffffff" />
      
      {/* Key light with brand saffron tint */}
      <directionalLight
        position={[5, 5, 3]}
        intensity={keyLightIntensity}
        color="#e89f4c"
        castShadow
      />
      
      {/* Fill light from opposite side */}
      <directionalLight
        position={[-3, 2, -2]}
        intensity={0.2}
        color="#2d6363"
      />
      
      {/* Rim light for edge definition */}
      <spotLight
        position={[0, 8, -5]}
        intensity={0.4}
        angle={0.5}
        penumbra={0.5}
        color="#f2b56a"
      />
    </>
  );
}

