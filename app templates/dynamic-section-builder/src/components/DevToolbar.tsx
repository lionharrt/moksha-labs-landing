import React, { useState } from 'react';
import { useVariants } from '../contexts/VariantContext';
import { THEME_VARIANTS, SECTION_VARIANTS } from '../config/variants';

const DevToolbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showReorderMode, setShowReorderMode] = useState(false);
  const [tempOrder, setTempOrder] = useState<string[]>([]);
  const { state, setTheme, setSectionVariant, setSectionOrder, resetAll } = useVariants();

  // Initialize temp order when entering reorder mode
  React.useEffect(() => {
    if (showReorderMode) {
      setTempOrder([...state.sectionOrder]);
    }
  }, [showReorderMode, state.sectionOrder]);

  const moveSection = (fromIndex: number, direction: 'up' | 'down') => {
    const newOrder = [...tempOrder];
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    
    if (toIndex < 0 || toIndex >= newOrder.length) return;
    
    [newOrder[fromIndex], newOrder[toIndex]] = [newOrder[toIndex], newOrder[fromIndex]];
    setTempOrder(newOrder);
  };

  const applyReorder = () => {
    setSectionOrder(tempOrder);
    setShowReorderMode(false);
  };

  const cancelReorder = () => {
    setTempOrder([...state.sectionOrder]);
    setShowReorderMode(false);
  };

  // Always show toolbar (temporary for client review)
  // To hide in production later, add: && import.meta.env.DEV
  const shouldShow = true;

  if (!shouldShow) return null;

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 z-[9999] bg-gray-900 text-white px-4 py-2 rounded-lg shadow-2xl hover:bg-gray-800 transition-all"
      >
        🎨 Variants
      </button>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-white rounded-lg shadow-2xl border border-gray-200 w-80 max-h-[80vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎨</span>
          <span className="font-semibold">Variants</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="hover:bg-gray-800 px-2 py-1 rounded transition-colors"
            title="Minimize"
          >
            ─
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-gray-800 px-2 py-1 rounded transition-colors"
            title="Close"
          >
            ×
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto flex-1 p-4 space-y-6">
        {/* Reorder Mode Toggle */}
        {!showReorderMode && (
          <div className="border-b border-gray-200 pb-4">
            <button
              onClick={() => setShowReorderMode(true)}
              className="w-full px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm font-medium transition-colors"
            >
              ↕️ Reorder Sections
            </button>
          </div>
        )}

        {/* Reorder Mode UI */}
        {showReorderMode && (
          <div className="border-b border-gray-200 pb-4 space-y-2">
            <div className="text-sm font-semibold text-gray-700 mb-2">Reorder Sections</div>
            <div className="space-y-1">
              {tempOrder.map((sectionKey, index) => {
                const sectionName = sectionKey
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase())
                  .trim();

                return (
                  <div
                    key={sectionKey}
                    className="flex items-center gap-2 bg-gray-50 p-2 rounded border border-gray-200"
                  >
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveSection(index, 'up')}
                        disabled={index === 0}
                        className="text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveSection(index, 'down')}
                        disabled={index === tempOrder.length - 1}
                        className="text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        ▼
                      </button>
                    </div>
                    <div className="flex-1 text-sm font-medium text-gray-700">
                      {index + 1}. {sectionName}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={applyReorder}
                className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded text-sm font-medium transition-colors"
              >
                ✓ Apply Order
              </button>
              <button
                onClick={cancelReorder}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-sm font-medium transition-colors"
              >
                ✕ Cancel
              </button>
            </div>
          </div>
        )}
        {/* Theme Selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Theme
          </label>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((themeId) => (
              <button
                key={themeId}
                onClick={() => setTheme(themeId)}
                className={`px-2 py-2 rounded-lg border-2 transition-all text-sm ${
                  state.theme === themeId
                    ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
                title={THEME_VARIANTS[themeId].name}
              >
                {themeId}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {THEME_VARIANTS[state.theme].name}
          </p>
        </div>

               {/* Section Variants - Dynamically generated in sectionOrder */}
               <div className="space-y-4">
                 <div className="text-sm font-semibold text-gray-700">Section Variants</div>

                 {state.sectionOrder.map((sectionKey) => {
                   const variants = SECTION_VARIANTS[sectionKey as keyof typeof SECTION_VARIANTS];
                   if (!variants) return null;
                   
                   const currentVariant = state.sections[sectionKey as keyof typeof state.sections];
                   
                   // Format section name (camelCase to Title Case)
                   const sectionName = sectionKey
                     .replace(/([A-Z])/g, ' $1')
                     .replace(/^./, (str) => str.toUpperCase())
                     .trim();

                   return (
                     <div key={sectionKey}>
                       <label className="block text-xs font-medium text-gray-600 mb-1">
                         {sectionName}
                       </label>
                       <div className="flex gap-2">
                         {Object.keys(variants).map((variantKey) => (
                           <button
                             key={variantKey}
                             onClick={() => setSectionVariant(sectionKey as keyof typeof state.sections, variantKey)}
                             className={`flex-1 px-3 py-2 rounded border-2 text-sm transition-all ${
                               currentVariant === variantKey
                                 ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                                 : 'border-gray-200 hover:border-gray-300 text-gray-600'
                             }`}
                             title={variants[variantKey as keyof typeof variants].description}
                           >
                             {variantKey}
                           </button>
                         ))}
                       </div>
                     </div>
                   );
                 })}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-3 bg-gray-50">
        <button
          onClick={resetAll}
          className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-sm font-medium transition-colors"
        >
          🔄 Reset All
        </button>
      </div>
    </div>
  );
};

export default DevToolbar;

