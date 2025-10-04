/**
 * Global state management with Zustand
 * Follows best practices from documentation
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface AppState {
  // UI State
  loading: boolean;
  currentExample: string;
  menuOpen: boolean;
  
  // 3D State
  cameraPosition: [number, number, number];
  
  // Actions
  setLoading: (loading: boolean) => void;
  setCurrentExample: (example: string) => void;
  toggleMenu: () => void;
  setCameraPosition: (position: [number, number, number]) => void;
}

export const useStore = create<AppState>()(
  subscribeWithSelector((set) => ({
    // Initial state
    loading: true,
    currentExample: 'basic-scene',
    menuOpen: false,
    cameraPosition: [0, 0, 5],
    
    // Actions
    setLoading: (loading) => set({ loading }),
    setCurrentExample: (example) => set({ currentExample: example }),
    toggleMenu: () => set((state) => ({ menuOpen: !state.menuOpen })),
    setCameraPosition: (position) => set({ cameraPosition: position }),
  }))
);

// Subscribe to changes for debugging
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  useStore.subscribe(
    (state) => state.currentExample,
    (example) => console.log('🎬 Example changed:', example)
  );
}

