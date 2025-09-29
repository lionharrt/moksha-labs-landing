/**
 * useDarkMode Hook
 * 
 * Manages dark mode state with localStorage persistence and system preference detection.
 * Automatically applies dark mode class to document root and body elements.
 */

import { useState, useEffect } from 'react';
import { themeConfig } from '../config/theme';

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false; // Default to light mode on server-side
    }

    // Check for saved user preference
    const savedPreference = localStorage.getItem(themeConfig.darkMode.storageKey);
    if (savedPreference !== null) {
      return savedPreference === 'true';
    }

    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;

    if (isDark) {
      root.classList.add('dark');
      body.classList.add('dark');
      localStorage.setItem(themeConfig.darkMode.storageKey, 'true');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      localStorage.setItem(themeConfig.darkMode.storageKey, 'false');
    }
  }, [isDark]);

  return [isDark, setIsDark] as const;
};
