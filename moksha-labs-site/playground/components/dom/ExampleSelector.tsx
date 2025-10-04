/**
 * Example Selector UI
 * Switch between different 3D examples
 */

'use client';

import { useStore } from '@/stores/useStore';

const examples = [
  { id: 'basic-scene', name: '01. Basic Scene', description: 'Rotating cube with lights' },
  { id: 'interactive', name: '02. Interactive Box', description: 'Click and hover effects' },
  { id: 'particles', name: '03. Particle Field', description: '5000 animated particles' },
];

export function ExampleSelector() {
  const currentExample = useStore((state) => state.currentExample);
  const setCurrentExample = useStore((state) => state.setCurrentExample);

  return (
    <div className="fixed top-4 left-4 z-10 bg-black/95 backdrop-blur-md rounded-xl p-4 text-white w-72 shadow-2xl border border-white/10">
      <h2 className="text-xs font-bold mb-3 text-white/50 tracking-widest uppercase">Examples</h2>
      <div className="space-y-2">
        {examples.map((example) => (
          <button
            key={example.id}
            onClick={() => setCurrentExample(example.id)}
            className={`w-full text-left p-3 rounded-lg transition-all ${
              currentExample === example.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-white/5 hover:bg-white/10 text-white/80'
            }`}
          >
            <div className="font-semibold text-sm mb-1">{example.name}</div>
            <div className="text-xs opacity-70">{example.description}</div>
          </button>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/40">
        <p>💡 Drag to rotate • Scroll to zoom</p>
      </div>
    </div>
  );
}

