export { OriginalMandala } from './OriginalMandala';
export { FlowerOfLife } from './FlowerOfLife';
export { SriYantra } from './SriYantra';
export { MetatronsCube } from './MetatronsCube';
export { FibonacciSpiral } from './FibonacciSpiral';
export { SeedOfLife } from './SeedOfLife';

export const MANDALA_TYPES = {
  ORIGINAL: 'original',
  FLOWER_OF_LIFE: 'flowerOfLife',
  SRI_YANTRA: 'sriYantra',
  METATRONS_CUBE: 'metatronsCube',
  FIBONACCI_SPIRAL: 'fibonacciSpiral',
  SEED_OF_LIFE: 'seedOfLife',
} as const;

export type MandalaType = typeof MANDALA_TYPES[keyof typeof MANDALA_TYPES];

export const MANDALA_INFO = {
  [MANDALA_TYPES.ORIGINAL]: {
    name: 'Original Mandala',
    description: 'Multi-ring geometric pattern with petals, circles, and radiating lines',
  },
  [MANDALA_TYPES.FLOWER_OF_LIFE]: {
    name: 'Flower of Life',
    description: '19 overlapping circles - represents creation and interconnectedness',
  },
  [MANDALA_TYPES.SRI_YANTRA]: {
    name: 'Sri Yantra',
    description: '9 interlocking triangles - union of masculine (4↑) and feminine (5↓) energies',
  },
  [MANDALA_TYPES.METATRONS_CUBE]: {
    name: "Metatron's Cube",
    description: '13 circles connected - contains all 5 Platonic solids',
  },
  [MANDALA_TYPES.FIBONACCI_SPIRAL]: {
    name: 'Fibonacci Spiral',
    description: 'Golden ratio (φ=1.618) - found throughout nature and the cosmos',
  },
  [MANDALA_TYPES.SEED_OF_LIFE]: {
    name: 'Seed of Life',
    description: '7 circles in hexagonal symmetry - represents the 7 days of creation',
  },
};

