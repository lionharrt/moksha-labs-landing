'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/stores/useStore';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MANDALA_INFO } from '@/components/sections/Hero/mandalas';

export function DevToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showMarkers, setShowMarkers] = useState(false);
  const [viewportSize, setViewportSize] = useState('N/A');
  const currentSection = useStore((state) => state.currentSection);
  const scrollProgress = useStore((state) => state.scrollProgress);
  const selectedMandala = useStore((state) => state.selectedMandala);
  const setSelectedMandala = useStore((state) => state.setSelectedMandala);

  useEffect(() => {
    // Only access window on client
    if (typeof window === 'undefined') return;
    
    const updateViewport = () => {
      setViewportSize(`${window.innerWidth}x${window.innerHeight}`);
    };
    
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const toggleMarkers = () => {
    const newValue = !showMarkers;
    setShowMarkers(newValue);
    
    // Toggle ScrollTrigger markers
    ScrollTrigger.getAll().forEach(trigger => {
      // Recreate triggers with/without markers would be complex
      // So we'll just toggle visibility of existing markers
      const markers = document.querySelectorAll('.gsap-marker-scroller-start, .gsap-marker-scroller-end, .gsap-marker-start, .gsap-marker-end');
      markers.forEach(marker => {
        (marker as HTMLElement).style.display = newValue ? 'block' : 'none';
      });
    });
  };

  const refreshScrollTrigger = () => {
    ScrollTrigger.refresh();
    console.log('🔄 ScrollTrigger refreshed');
  };

  return (
    <>
      {/* Toolbar Panel */}
      <div 
        className={`fixed bottom-0 right-0 bg-black/95 text-white transition-transform duration-300 ease-out z-[9999] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ 
          width: '320px',
          maxHeight: '80vh',
          borderTopLeftRadius: '12px',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/20 pb-3">
            <h3 className="text-sm font-bold tracking-wider">DEV TOOLS</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Current Section */}
          <div className="space-y-2">
            <label className="text-xs text-white/60 uppercase tracking-wider">Current Section</label>
            <div className="bg-white/10 rounded px-3 py-2 text-sm font-mono">
              {currentSection}
            </div>
          </div>

              {/* Scroll Progress */}
              <div className="space-y-2">
                <label className="text-xs text-white/60 uppercase tracking-wider">Scroll Progress</label>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span>{Math.round(scrollProgress * 100)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-white h-full transition-all duration-200"
                      style={{ width: `${scrollProgress * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Mandala Selector */}
              <div className="space-y-2 pt-3 border-t border-white/20">
                <label className="text-xs text-white/60 uppercase tracking-wider">Sacred Geometry</label>
                <select
                  value={selectedMandala}
                  onChange={(e) => setSelectedMandala(e.target.value as any)}
                  className="w-full px-3 py-2 rounded text-sm bg-white/10 hover:bg-white/20 transition-colors text-white border border-white/20 cursor-pointer"
                >
                  {Object.entries(MANDALA_INFO).map(([key, info]) => (
                    <option key={key} value={key} className="bg-black text-white">
                      {info.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-white/40 leading-relaxed">
                  {MANDALA_INFO[selectedMandala]?.description}
                </p>
              </div>

              {/* Controls */}
          <div className="space-y-3 pt-3 border-t border-white/20">
            <label className="text-xs text-white/60 uppercase tracking-wider">Controls</label>
            
            <button
              onClick={toggleMarkers}
              className={`w-full px-3 py-2 rounded text-sm transition-colors ${
                showMarkers 
                  ? 'bg-white text-black' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {showMarkers ? '✓ ' : ''}ScrollTrigger Markers
            </button>

            <button
              onClick={refreshScrollTrigger}
              className="w-full px-3 py-2 rounded text-sm bg-white/10 hover:bg-white/20 transition-colors"
            >
              🔄 Refresh ScrollTrigger
            </button>

            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="w-full px-3 py-2 rounded text-sm bg-white/10 hover:bg-white/20 transition-colors"
            >
              ⬆️ Scroll to Top
            </button>
          </div>

          {/* Info */}
          <div className="space-y-2 pt-3 border-t border-white/20">
            <label className="text-xs text-white/60 uppercase tracking-wider">Info</label>
            <div className="text-xs font-mono text-white/60 space-y-1">
              <div>GSAP: {gsap.version}</div>
              <div>ScrollTriggers: {ScrollTrigger.getAll().length}</div>
              <div>Viewport: {viewportSize}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Tab */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-0 bg-black/95 text-white px-3 py-2 transition-all duration-300 z-[9998] hover:pr-4 group ${
          isOpen ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
        }`}
        style={{
          borderTopLeftRadius: '6px',
          borderBottomLeftRadius: '6px',
          backdropFilter: 'blur(10px)',
          fontSize: '11px',
          fontWeight: '600',
          letterSpacing: '0.05em',
        }}
      >
        <span className="flex items-center gap-2">
          <span>DEV</span>
          <span className="text-white/40 group-hover:text-white/60 transition-colors">→</span>
        </span>
      </button>
    </>
  );
}
