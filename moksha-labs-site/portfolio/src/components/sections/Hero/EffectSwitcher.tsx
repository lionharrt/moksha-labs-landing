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

interface EffectSwitcherProps {
  breakProgress: number;
}

export type VisualMode = 
  | 'wireframe'  // Original mandala wireframe
  | 'lotus';     // Lotus petals dissolve

export function EffectSwitcher({ breakProgress }: EffectSwitcherProps) {
  const visualMode = useStore((state) => state.visualMode);

  switch (visualMode) {
    case 'wireframe':
      return <GeometricWireframe breakProgress={breakProgress} />;
    case 'lotus':
      return <LotusDissolve breakProgress={breakProgress} />;
    default:
      return <GeometricWireframe breakProgress={breakProgress} />;
  }
}

