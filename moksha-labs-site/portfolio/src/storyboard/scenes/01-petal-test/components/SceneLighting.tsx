'use client';

/**
 * Scene Lighting for Petal Test
 * 
 * Enhanced lighting setup to show 3D form:
 * - Ambient: Base illumination
 * - Key: Strong directional light with shadows
 * - Fill: Soft side lighting
 * - Rim: Back light for edge definition
 */

interface SceneLightingProps {
  progress?: number;
}

export function SceneLighting({ progress = 0 }: SceneLightingProps) {
  return (
    <>
      {/* Ambient light - base illumination */}
      <ambientLight intensity={0.4} color="#ffffff" />
      
      {/* Key light - main directional from FRONT TOP */}
      <directionalLight
        position={[0, 8, 8]}
        intensity={2.0}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Fill light - from side, softer */}
      <directionalLight
        position={[-5, 4, 6]}
        intensity={1.2}
        color="#f2b56a" // Warm saffron tint
      />
      
      {/* Rim light - from opposite side for depth */}
      <pointLight
        position={[5, 3, 4]}
        intensity={1.0}
        color="#ffffff"
      />
      
      {/* Bottom light - subtle uplighting to show petal undersides */}
      <pointLight
        position={[0, -2, 3]}
        intensity={0.6}
        color="#2d6363" // Teal tint
      />
    </>
  );
}

