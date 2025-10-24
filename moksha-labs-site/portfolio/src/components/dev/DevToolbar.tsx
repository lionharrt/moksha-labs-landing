'use client';

import { useState } from 'react';

export function DevToolbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toolbar Panel */}
      <div 
        className={`fixed bottom-0 right-0 bg-black/95 text-white transition-transform duration-300 ease-out z-[9999] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ 
          width: '340px',
          maxHeight: '80vh',
          borderTopLeftRadius: '12px',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/20 pb-3">
            <h3 className="text-sm font-bold tracking-wider">PETAL TEST</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Info */}
          <div className="space-y-3">
            <div className="text-sm text-white/80">
              <div className="text-brand-saffron font-bold mb-2">✓ Clean Slate</div>
              <div className="text-xs space-y-1 text-white/60">
                <div>• All legacy concepts removed</div>
                <div>• Single petal test scene</div>
                <div>• Optimized geometry utility</div>
                <div>• LOD system ready</div>
              </div>
            </div>

            <div className="bg-white/5 rounded p-3 text-xs space-y-1">
              <div className="text-brand-saffron">Performance:</div>
              <div className="text-white/60">HIGH LOD: 820 vertices</div>
              <div className="text-white/60">MEDIUM LOD: 210 vertices</div>
              <div className="text-white/60">LOW LOD: 60 vertices</div>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-2 pt-3 border-t border-white/20">
            <div className="text-xs text-white/60 space-y-1">
              <div>💡 Drag to rotate camera</div>
              <div>💡 Scroll to zoom</div>
              <div>💡 Shape preserved from original</div>
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
