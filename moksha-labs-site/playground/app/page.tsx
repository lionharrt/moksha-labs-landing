/**
 * Main Page
 * Production-ready Three.js playground with best practices
 */

'use client';

import { Canvas } from '@react-three/fiber';
import { useLenis } from '@/hooks/useLenis';
import { siteConfig } from '@/config/site';
import { SceneContent } from '@/components/canvas/SceneContent';

export default function Home() {
  // Initialize smooth scroll
  useLenis();

  return (
    <>
      {/* Fixed 3D Canvas */}
      <Canvas
        camera={{ 
          position: [0, 0, 15], 
          fov: 75,
          near: 0.1,
          far: 5000, // Extended for deep space scenes
        }}
        dpr={[
          siteConfig.performance.pixelRatio.min,
          siteConfig.performance.pixelRatio.max,
        ]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#000000',
          zIndex: 0,
        }}
      >
        <SceneContent />
      </Canvas>

      {/* Scrollable spacer - drives camera animation */}
      <div style={{ height: '300vh', position: 'relative', zIndex: 1 }} />
    </>
  );
}
