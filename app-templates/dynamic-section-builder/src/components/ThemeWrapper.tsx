import React, { useEffect, ReactNode } from 'react';
import { useVariants } from '../contexts/VariantContext';
import { THEME_VARIANTS } from '../config/variants';

interface ThemeWrapperProps {
  children: ReactNode;
}

/**
 * Applies theme colors dynamically by injecting CSS custom properties
 * This allows us to switch themes without rebuilding Tailwind
 */
export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ children }) => {
  const { state } = useVariants();

  useEffect(() => {
    const theme = THEME_VARIANTS[state.theme];
    const root = document.documentElement;

    // Helper to convert hex to RGB values (without rgb() wrapper)
    const hexToRgb = (hex: string): string => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result 
        ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
        : '0 0 0';
    };

    // Apply ALL theme colors (primary, secondary, accent)
    Object.entries(theme.colors.primary).forEach(([shade, color]) => {
      root.style.setProperty(`--theme-primary-${shade}`, hexToRgb(color));
    });

    Object.entries(theme.colors.secondary).forEach(([shade, color]) => {
      root.style.setProperty(`--theme-secondary-${shade}`, hexToRgb(color));
    });

    Object.entries(theme.colors.accent).forEach(([shade, color]) => {
      root.style.setProperty(`--theme-accent-${shade}`, hexToRgb(color));
    });

    // Update meta theme-color to primary-500
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme.colors.primary[500]);
    }
  }, [state.theme]);

  return <>{children}</>;
};

