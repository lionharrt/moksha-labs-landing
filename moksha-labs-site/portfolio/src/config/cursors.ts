export interface CursorConfig {
  id: string;
  name: string;
  description: string;
}

export const cursorCatalogue: CursorConfig[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Simple dot cursor',
  },
  {
    id: 'hover',
    name: 'Hover',
    description: 'Expands on hover',
  },
  {
    id: 'drag',
    name: 'Drag',
    description: 'Shows drag intent',
  },
  {
    id: 'explore',
    name: 'Explore',
    description: 'Animated exploration cursor',
  },
  {
    id: 'trail',
    name: 'Trail',
    description: 'Leaves a trail effect',
  },
  {
    id: 'magnetic',
    name: 'Magnetic',
    description: 'Pulls toward interactive elements',
  },
];

