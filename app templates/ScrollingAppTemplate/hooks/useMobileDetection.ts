/**
 * useMobileDetection Hook
 * 
 * Detects mobile devices and screen sizes with responsive updates.
 * Uses configurable breakpoint from theme config.
 */

import { useState, useEffect } from 'react';
import { themeConfig } from '../config/theme';

export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    const isMobileWidth = window.innerWidth <= themeConfig.navigation.mobileBreakpoint;
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    return isMobileWidth || isMobileDevice;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= themeConfig.navigation.mobileBreakpoint);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};
