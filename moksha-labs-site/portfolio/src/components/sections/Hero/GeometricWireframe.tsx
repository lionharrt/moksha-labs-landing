'use client';

import { Canvas } from '@react-three/fiber';
import { useStore } from '@/stores/useStore';
import {
  OriginalMandala,
  FlowerOfLife,
  SriYantra,
  MetatronsCube,
  FibonacciSpiral,
  SeedOfLife,
} from './mandalas';

interface GeometricWireframeProps {
  breakProgress: number;
}

export function GeometricWireframe({ breakProgress }: GeometricWireframeProps) {
  const selectedMandala = useStore((state) => state.selectedMandala);

  // Render the selected mandala component
  const renderMandala = () => {
    switch (selectedMandala) {
      case 'original':
        return <OriginalMandala breakProgress={breakProgress} />;
      case 'flowerOfLife':
        return <FlowerOfLife breakProgress={breakProgress} />;
      case 'sriYantra':
        return <SriYantra breakProgress={breakProgress} />;
      case 'metatronsCube':
        return <MetatronsCube breakProgress={breakProgress} />;
      case 'fibonacciSpiral':
        return <FibonacciSpiral breakProgress={breakProgress} />;
      case 'seedOfLife':
        return <SeedOfLife breakProgress={breakProgress} />;
      default:
        return <OriginalMandala breakProgress={breakProgress} />;
    }
  };

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ background: 'transparent' }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.5} />
      {renderMandala()}
    </Canvas>
  );
}

