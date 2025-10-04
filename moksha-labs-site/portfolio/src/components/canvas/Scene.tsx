'use client';

import { useEffect } from 'react';
import { Camera } from './Camera';
import { Lights } from './Lights';
import { HeroScene } from './sections/HeroScene';
import { ServicesScene } from './sections/ServicesScene';
import { WorkScene } from './sections/WorkScene';
import { AboutScene } from './sections/AboutScene';
import { ContactScene } from './sections/ContactScene';
import { useStore } from '@/stores/useStore';
import { Stats } from '@react-three/drei';

export function Scene() {
  const setCanvasReady = useStore((state) => state.setCanvasReady);
  const showStats = useStore((state) => state.showStats);

  useEffect(() => {
    setCanvasReady(true);
  }, [setCanvasReady]);

  return (
    <>
      {showStats && <Stats />}
      
      <Camera />
      <Lights />
      
      {/* Each section's 3D elements */}
      <HeroScene />
      <ServicesScene />
      <WorkScene />
      <AboutScene />
      <ContactScene />
    </>
  );
}

