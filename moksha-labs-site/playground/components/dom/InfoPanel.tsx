/**
 * Info Panel
 * Shows helpful information
 */

'use client';

export function InfoPanel() {
  return (
    <div className="fixed bottom-4 right-4 z-10 bg-black/95 backdrop-blur-md rounded-xl p-4 text-white w-72 shadow-2xl border border-white/10">
      <h2 className="text-xs font-bold mb-3 text-white/50 tracking-widest uppercase">Info</h2>
      <p className="text-sm text-white/80 mb-3 leading-relaxed">
        Learning Three.js with award-winning best practices.
      </p>
      
      <div className="text-xs space-y-2 text-white/60">
        <p>📦 Next.js 15 + React Three Fiber</p>
        <p>✨ GSAP, Lenis, Zustand</p>
        <p>📚 See /docs for documentation</p>
      </div>
    </div>
  );
}

