/**
 * Scroll Utilities
 * 
 * Utility functions for managing scroll behavior in the scrolling app template.
 */

/**
 * Smoothly scroll to a section by ID
 * @param sectionId - The ID of the section to scroll to
 * @param behavior - Scroll behavior ('smooth' or 'auto')
 */
export const scrollToSection = (
  sectionId: string,
  behavior: ScrollBehavior = 'smooth'
): void => {
  const element = document.getElementById(sectionId);
  const scrollContainer = document.querySelector('.scroll-snap-container') as HTMLElement;

  if (element && scrollContainer) {
    element.scrollIntoView({
      behavior,
      block: 'start',
    });

    // Update URL hash without triggering scroll
    window.history.pushState(null, '', `#${sectionId}`);
  }
};

/**
 * Get the currently visible section based on scroll position
 * @param sectionIds - Array of section IDs to check
 * @param navHeight - Height of the navigation bar
 * @returns The ID of the currently visible section
 */
export const getCurrentSection = (
  sectionIds: string[],
  navHeight: number = 80
): string | null => {
  let activeSection: string | null = null;
  let closestDistance = Infinity;

  for (const sectionId of sectionIds) {
    const section = document.getElementById(sectionId);
    if (section) {
      const rect = section.getBoundingClientRect();
      const distanceFromTop = Math.abs(rect.top - navHeight);

      // Section is considered active if it's visible and closest to nav height
      if (rect.bottom > navHeight && rect.top < window.innerHeight) {
        if (distanceFromTop < closestDistance) {
          closestDistance = distanceFromTop;
          activeSection = sectionId;
        }
      }
    }
  }

  return activeSection;
};

/**
 * Calculate scroll progress as a percentage
 * @returns Scroll progress from 0 to 100
 */
export const getScrollProgress = (): number => {
  const scrollContainer = document.querySelector('.scroll-snap-container');
  if (!scrollContainer) return 0;

  const scrollTop = scrollContainer.scrollTop;
  const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
  const scrolled = (scrollTop / scrollHeight) * 100;

  return Math.min(Math.max(scrolled, 0), 100);
};

/**
 * Check if the scroll container is near the top
 * @param threshold - Distance from top in pixels (default: 20)
 * @returns True if near top
 */
export const isNearTop = (threshold: number = 20): boolean => {
  const scrollContainer = document.querySelector('.scroll-snap-container');
  if (!scrollContainer) return true;

  return scrollContainer.scrollTop <= threshold;
};
