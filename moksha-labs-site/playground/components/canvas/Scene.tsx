/**
 * Main 3D Scene component
 * This is where all 3D objects live
 */

'use client';

import { OrbitControls } from '@react-three/drei';

export function Scene() {
  return (
    <>
      {/* Camera controls - drag to rotate, scroll to zoom */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={2}
        maxDistance={20}
      />
      
      {/* Lighting setup */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#0088ff" />
      
      {/* Example content */}
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </>
  );
}

