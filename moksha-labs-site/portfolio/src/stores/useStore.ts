import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export type CursorType = 'default' | 'hover' | 'drag' | 'explore' | 'disabled';
export type SectionId = 'hero' | 'services' | 'work' | 'about' | 'contact';

interface AppState {
  // UI State
  currentSection: SectionId;
  scrollProgress: number;
  isScrolling: boolean;
  
  // Canvas State
  showCanvas: boolean;
  canvasReady: boolean;
  
  // Cursor State
  cursorType: CursorType;
  cursorPosition: { x: number; y: number };
  
  // Dev State
  devMode: boolean;
  showStats: boolean;
  selectedCursor: string;
  petalConcept: number; // 0-5 for the 6 concepts
  
  // Actions
  setCurrentSection: (section: SectionId) => void;
  setScrollProgress: (progress: number) => void;
  setIsScrolling: (isScrolling: boolean) => void;
  setShowCanvas: (show: boolean) => void;
  setCanvasReady: (ready: boolean) => void;
  setCursorType: (type: CursorType) => void;
  setCursorPosition: (position: { x: number; y: number }) => void;
  toggleDevMode: () => void;
  setShowStats: (show: boolean) => void;
  setSelectedCursor: (cursor: string) => void;
  setPetalConcept: (concept: number) => void;
}

export const useStore = create<AppState>()(
  subscribeWithSelector((set) => ({
    // Initial State
    currentSection: 'hero',
    scrollProgress: 0,
    isScrolling: false,
    showCanvas: true,
    canvasReady: false,
    cursorType: 'default',
    cursorPosition: { x: 0, y: 0 },
    devMode: true, // Start with dev mode on
    showStats: false,
    selectedCursor: 'default',
    petalConcept: 0, // Start with Concept 1
    
    // Actions
    setCurrentSection: (section) => set({ currentSection: section }),
    setScrollProgress: (progress) => set({ scrollProgress: progress }),
    setIsScrolling: (isScrolling) => set({ isScrolling }),
    setShowCanvas: (show) => set({ showCanvas: show }),
    setCanvasReady: (ready) => set({ canvasReady: ready }),
    setCursorType: (type) => set({ cursorType: type }),
    setCursorPosition: (position) => set({ cursorPosition: position }),
    toggleDevMode: () => set((state) => ({ devMode: !state.devMode })),
    setShowStats: (show) => set({ showStats: show }),
    setSelectedCursor: (cursor) => set({ selectedCursor: cursor }),
    setPetalConcept: (concept) => set({ petalConcept: concept }),
  }))
);

