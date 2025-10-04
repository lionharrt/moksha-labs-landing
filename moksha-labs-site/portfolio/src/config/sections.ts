import { SectionId } from '@/stores/useStore';

export interface SectionConfig {
  id: SectionId;
  title: string;
  cursorType: string;
  backgroundColor?: string;
  cameraPosition?: [number, number, number];
}

export const sections: SectionConfig[] = [
  {
    id: 'hero',
    title: 'HERO',
    cursorType: 'default',
    cameraPosition: [0, 0, 5],
  },
  {
    id: 'services',
    title: 'SERVICES',
    cursorType: 'explore',
    cameraPosition: [2, 0, 5],
  },
  {
    id: 'work',
    title: 'WORK',
    cursorType: 'hover',
    cameraPosition: [-2, 0, 5],
  },
  {
    id: 'about',
    title: 'ABOUT',
    cursorType: 'default',
    cameraPosition: [0, 2, 5],
  },
  {
    id: 'contact',
    title: 'CONTACT',
    cursorType: 'default',
    cameraPosition: [0, 0, 3],
  },
];

