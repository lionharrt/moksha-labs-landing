/**
 * Theme Context
 * 
 * Provides theme state (dark mode) to the entire application.
 * This is the recommended way to manage global state in the template.
 * 
 * USAGE:
 * 1. Wrap your app with <ThemeProvider>
 * 2. Use useTheme() hook in any component to access theme state
 */

import React, { createContext, useContext } from 'react';
import { useDarkMode } from '../hooks';

interface ThemeContextType {
  isDark: boolean;
  toggleDark: () => void;
  setDark: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useDarkMode();

  const toggleDark = () => setIsDark(!isDark);
  const setDark = (value: boolean) => setIsDark(value);

  return (
    <ThemeContext.Provider value={{ isDark, toggleDark, setDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to access theme context
 * @throws Error if used outside ThemeProvider
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
