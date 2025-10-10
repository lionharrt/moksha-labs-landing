/**
 * Effect Switcher - Parent component that selects visual system
 * 
 * Chooses between:
 * - GeometricWireframe (original mandala)
 * - LotusDissolve (alternative lotus petals effect)
 * 
 * Add new systems here without touching Hero.tsx
 */

'use client';

import { useStore } from '@/stores/useStore';
import { GeometricWireframe } from './GeometricWireframe';
import { LotusDissolve } from './dissolve-effects';
import { BoidSimulation } from './boid-effects';
import { FlowField } from './flow-field-effects';
import { DNAHelix } from './helix-effects';
import { CrystalGem } from './crystal-effects';
import { GlassDNA } from './glass-helix-effects';

interface EffectSwitcherProps {
  breakProgress: number;
  fadeProgress: number; // 0-1 fade from first 10% of scroll (for wireframe & lotus)
}

export type VisualMode = 
  | 'wireframe'  // Original mandala wireframe
  | 'lotus'      // Lotus petals dissolve
  | 'boids'      // Flocking particles with mouse interaction
  | 'flowfield'  // Perlin noise flow field
  | 'helix'      // DNA double helix
  | 'crystal'    // Glass/gem refraction
  | 'glassdna';  // Glass DNA helix (PREMIUM)

export function EffectSwitcher({ breakProgress, fadeProgress }: EffectSwitcherProps) {
  const visualMode = useStore((state) => state.visualMode);

  switch (visualMode) {
    case 'wireframe':
      return <GeometricWireframe breakProgress={breakProgress} fadeProgress={fadeProgress} />;
    case 'lotus':
      return <LotusDissolve breakProgress={breakProgress} fadeProgress={fadeProgress} />;
    case 'boids':
      return <BoidSimulation breakProgress={breakProgress} />;
    case 'flowfield':
      return <FlowField breakProgress={breakProgress} />;
    case 'helix':
      return <DNAHelix breakProgress={breakProgress} />;
    case 'crystal':
      return <CrystalGem breakProgress={breakProgress} />;
    case 'glassdna':
      return <GlassDNA breakProgress={breakProgress} />;
    default:
      return <GeometricWireframe breakProgress={breakProgress} fadeProgress={fadeProgress} />;
  }
}

