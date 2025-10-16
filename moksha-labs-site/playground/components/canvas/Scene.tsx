/**
 * Main 3D Scene component
 * This is where all 3D objects live
 */

'use client';

import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { Atmosphere } from './Atmosphere';
import * as THREE from 'three';

export function Scene() {
  const { viewport } = useThree();
  const fog1Ref = useRef();
  const fog2Ref = useRef();
  const fog3Ref = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if(fog1Ref.current) {
      fog1Ref.current.material.uniforms.uTime.value = time;
    }
    if(fog2Ref.current) {
      fog2Ref.current.material.uniforms.uTime.value = time;
    }
    if(fog3Ref.current) {
      fog3Ref.current.material.uniforms.uTime.value = time;
    }
  });

  return (
    <>
      {/* Fog Layers */}
      <Atmosphere
        ref={fog1Ref}
        scale={[viewport.width, viewport.height, 1]}
        position={[0, 0, -5]}
      />
      <Atmosphere
        ref={fog2Ref}
        scale={[viewport.width * 1.5, viewport.height * 1.5, 1]}
        position={[0, 0, -10]}
      />
       <Atmosphere
        ref={fog3Ref}
        scale={[viewport.width * 2, viewport.height * 2, 1]}
        position={[0, 0, -15]}
      />
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

