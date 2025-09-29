/**
 * Navigation Configuration
 * 
 * Define your navigation items here. The scrolling system will automatically
 * handle section tracking, smooth scrolling, and active state management.
 */

import { NavigationItem } from '../types';

export const navigationConfig: NavigationItem[] = [
  {
    id: 'home',
    label: 'Home',
    href: '#home',
  },
  {
    id: 'about',
    label: 'About',
    href: '#about',
  },
  {
    id: 'features',
    label: 'Features',
    href: '#features',
  },
  {
    id: 'contact',
    label: 'Contact',
    href: '#contact',
  },
];

/**
 * Utility function to get navigation items with translations
 * @param t - Translation function (from i18n)
 * @returns Translated navigation items
 */
export const getNavigationItems = (t: (key: string) => string): NavigationItem[] => {
  return navigationConfig.map(item => ({
    ...item,
    label: t(`navigation.${item.id}`),
  }));
};
