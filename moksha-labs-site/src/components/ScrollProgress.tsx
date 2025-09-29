/**
 * ScrollProgress Component
 * 
 * Displays a progress bar at the top of the page showing scroll position.
 * Automatically calculates and updates as user scrolls through sections.
 */

import React, { useState, useEffect } from 'react';
import { getScrollProgress } from '../utils';

export const ScrollProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      setProgress(getScrollProgress());
    };

    const scrollContainer = document.querySelector('.scroll-snap-container');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', updateProgress);
      updateProgress(); // Initial calculation
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', updateProgress);
      }
    };
  }, []);

  return (
    <div
      className="scroll-progress"
      style={{ transform: `scaleX(${progress / 100})` }}
    />
  );
};
