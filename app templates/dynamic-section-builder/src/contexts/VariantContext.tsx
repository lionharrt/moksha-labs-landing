import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface VariantState {
  theme: number; // 1-11
  sections: {
    whoWeAre: string;
    benefits: string;
    services: string;
    showcase: string;
    process: string;
    didYouKnow: string;
    invest: string;
    contact: string;
  };
  sectionOrder: string[]; // Order of sections on the page
}

interface VariantContextType {
  state: VariantState;
  setTheme: (theme: number) => void;
  setSectionVariant: (section: keyof VariantState['sections'], variant: string) => void;
  setSectionOrder: (order: string[]) => void;
  resetAll: () => void;
}

const defaultState: VariantState = {
  theme: 1, // Warm Orange (current)
  sections: {
    whoWeAre: 'A',
    benefits: 'A',
    services: 'A',
    showcase: 'A',
    process: 'A',
    didYouKnow: 'A',
    invest: 'A',
    contact: 'A',
  },
  sectionOrder: ['whoWeAre', 'benefits', 'services', 'showcase', 'process', 'didYouKnow', 'invest', 'contact'],
};

const VariantContext = createContext<VariantContextType | undefined>(undefined);

export const VariantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<VariantState>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('yourcompany-variants');
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        
        // Merge sections: start with default, then apply saved values
        const mergedSections = { ...defaultState.sections };
        Object.keys(parsedState.sections || {}).forEach(key => {
          if (key in mergedSections) {
            mergedSections[key as keyof typeof mergedSections] = parsedState.sections[key];
          }
        });
        
        // Merge sectionOrder: add any new sections from default that aren't in saved order
        const savedOrder = parsedState.sectionOrder || [];
        const mergedOrder = [...savedOrder];
        defaultState.sectionOrder.forEach(section => {
          if (!mergedOrder.includes(section)) {
            mergedOrder.push(section);
          }
        });
        
        return {
          theme: parsedState.theme || defaultState.theme,
          sections: mergedSections,
          sectionOrder: mergedOrder,
        };
      } catch {
        return defaultState;
      }
    }
    return defaultState;
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('yourcompany-variants', JSON.stringify(state));
  }, [state]);

  const setTheme = (theme: number) => {
    setState((prev) => ({ ...prev, theme }));
  };

  const setSectionVariant = (section: keyof VariantState['sections'], variant: string) => {
    setState((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: variant,
      },
    }));
  };

  const setSectionOrder = (order: string[]) => {
    setState((prev) => ({
      ...prev,
      sectionOrder: order,
    }));
  };

  const resetAll = () => {
    setState(defaultState);
    localStorage.removeItem('yourcompany-variants');
  };

  return (
    <VariantContext.Provider value={{ state, setTheme, setSectionVariant, setSectionOrder, resetAll }}>
      {children}
    </VariantContext.Provider>
  );
};

export const useVariants = () => {
  const context = useContext(VariantContext);
  if (!context) {
    throw new Error('useVariants must be used within VariantProvider');
  }
  return context;
};

