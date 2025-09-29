/**
 * ScrollingAppTemplate - Main Exports
 * 
 * Central export point for the entire template.
 * Import everything you need from here.
 * 
 * @example
 * import { Navigation, Section, useTheme, themeConfig } from './ScrollingAppTemplate';
 */

// Components
export { Navigation, Section, ScrollProgress } from './components';

// Hooks
export { useDarkMode, useMobileDetection } from './hooks';

// Context
export { ThemeProvider, useTheme } from './context';

// Configuration
export { themeConfig, navigationConfig, getNavigationItems } from './config';

// Types
export type {
  NavigationItem,
  NavigationProps,
  SectionProps,
  SectionBackground,
  SectionOverlay,
  SectionLayout,
  SectionPadding,
  SectionAnimation,
  SectionHeight,
} from './types';

// Utilities
export {
  scrollToSection,
  getCurrentSection,
  getScrollProgress,
  isNearTop,
} from './utils';
