/**
 * Navigation Component
 * 
 * Adaptive navigation bar with:
 * - Smooth scroll to sections
 * - Active section tracking
 * - Auto-hide/show based on scroll position
 * - Mobile responsive menu
 * - Dark mode toggle
 * - Blur effect on scroll
 * 
 * USAGE:
 * <Navigation items={navigationItems} />
 */

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { NavigationProps } from '../types';
import { useTheme } from '../context';
import { useMobileDetection } from '../hooks';
import { scrollToSection, getCurrentSection, isNearTop } from '../utils';
import { navigationConfig, themeConfig } from '../config';

export const Navigation: React.FC<NavigationProps> = ({
  items = navigationConfig,
  onNavigate,
  className = '',
}) => {
  const { t } = useTranslation('common');
  const { isDark, toggleDark } = useTheme();
  const isMobile = useMobileDetection();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMouseNear, setIsMouseNear] = useState(false);
  const [isActivelyScrolling, setIsActivelyScrolling] = useState(false);
  const [showBlur, setShowBlur] = useState(false);

  const scrollTimeoutRef = useRef<number>();
  const autoFadeTimeoutRef = useRef<number>();

  // Get translated navigation items
  const navItems = items.map(item => ({
    ...item,
    label: t(`navigation.${item.id}`, item.label),
  }));

  // Normalize section heights for consistent scroll snapping
  useEffect(() => {
    const normalizeSectionHeight = () => {
      const sections = document.querySelectorAll<HTMLElement>('.scroll-snap-section');

      sections.forEach((section) => {
        if (isMobile) {
          section.style.minHeight = 'auto';
        } else {
          const targetHeight = Math.max(section.scrollHeight, window.innerHeight);
          section.style.minHeight = `${targetHeight}px`;
        }
      });
    };

    normalizeSectionHeight();
    const resizeHandler = () => normalizeSectionHeight();
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, [isMobile]);

  // Handle section tracking with proper cleanup for scroll container
  useEffect(() => {
    const initializeScrollTracking = () => {
      const scrollContainer = document.querySelector('.scroll-snap-container') as HTMLElement;

      if (!scrollContainer) {
        setTimeout(initializeScrollTracking, 100);
        return;
      }

      const updateSectionState = (isInitialCall = false) => {
        const scrollTop = scrollContainer.scrollTop;
        const nearTopThreshold = isMobile ? 50 : 20;
        const isNear = scrollTop <= nearTopThreshold;

        setIsScrolled(!isNear);

        if (!isInitialCall) {
          setIsActivelyScrolling(true);
        }

        // Determine active section
        const sectionIds = navItems.map(item => item.id);
        const activeId = getCurrentSection(sectionIds, themeConfig.navigation.height);

        if (activeId) {
          setActiveSection(activeId);
          const newHash = `#${activeId}`;
          if (window.location.hash !== newHash) {
            window.history.replaceState(null, '', newHash);
          }
        }

        if (!isInitialCall) {
          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
          }
          scrollTimeoutRef.current = window.setTimeout(() => {
            setIsActivelyScrolling(false);
          }, 100);
        }
      };

      // Throttled scroll handler
      let scrollThrottleTimeout: NodeJS.Timeout | null = null;
      const handleScroll = () => {
        if (scrollThrottleTimeout) return;
        
        scrollThrottleTimeout = setTimeout(() => {
          updateSectionState(false);
          scrollThrottleTimeout = null;
        }, 16);
      };

      const handleMouseMove = (e: MouseEvent) => {
        setIsMouseNear(e.clientY <= 120);
      };

      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('mousemove', handleMouseMove);
      updateSectionState(true);

      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
        window.removeEventListener('mousemove', handleMouseMove);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        if (autoFadeTimeoutRef.current) clearTimeout(autoFadeTimeoutRef.current);
      };
    };

    const cleanup = initializeScrollTracking();
    return () => {
      if (cleanup) cleanup();
    };
  }, [isMobile, navItems]);

  // Blur visibility logic
  useEffect(() => {
    const shouldShow = isMouseNear || isActivelyScrolling;

    if (shouldShow) {
      if (autoFadeTimeoutRef.current) {
        clearTimeout(autoFadeTimeoutRef.current);
        autoFadeTimeoutRef.current = undefined;
      }
      setShowBlur(true);
    } else if (isScrolled || activeSection !== 'home') {
      if (autoFadeTimeoutRef.current) {
        clearTimeout(autoFadeTimeoutRef.current);
        autoFadeTimeoutRef.current = undefined;
      }
      setShowBlur(true);
    } else if (activeSection === 'home' && !isScrolled && !autoFadeTimeoutRef.current) {
      autoFadeTimeoutRef.current = window.setTimeout(() => {
        setShowBlur(false);
        autoFadeTimeoutRef.current = undefined;
      }, 0);
    }

    return () => {
      if (autoFadeTimeoutRef.current) {
        clearTimeout(autoFadeTimeoutRef.current);
      }
    };
  }, [isMouseNear, isActivelyScrolling, isScrolled, activeSection]);

  const handleNavClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setIsMenuOpen(false);
    if (onNavigate) onNavigate(sectionId);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        showBlur
          ? 'bg-white/95 dark:bg-neutral-800/95 backdrop-blur-lg shadow-sm border-b border-gray-100/50 dark:border-neutral-700/50'
          : 'bg-transparent border-b border-transparent'
      } ${className}`}
    >
      <div className="mx-auto px-2 sm:px-4">
        <div className="flex items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center space-x-3 group"
            >
              <span
                className={`text-lg font-bold transition-colors duration-500 ease-out ${
                  showBlur
                    ? 'text-gray-900 dark:text-neutral-100'
                    : 'text-white'
                }`}
              >
                {t('common.appName', 'App Name')}
              </span>
            </button>
          </div>

          {/* Desktop Navigation Menu */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3 xl:px-4 py-2 text-xs xl:text-sm font-medium whitespace-nowrap transition-all duration-500 ease-out rounded-lg ${
                    isActive
                      ? showBlur
                        ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20'
                        : 'text-white bg-white/10'
                      : showBlur
                      ? 'text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-neutral-300 dark:hover:text-blue-400 dark:hover:bg-neutral-700'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-3 flex-shrink-0 ml-auto">
            {/* Desktop Dark Mode Toggle */}
            <div className="hidden md:flex items-center space-x-3">
              <button
                onClick={toggleDark}
                className={`p-2 rounded-lg transition-all duration-500 ease-out ${
                  showBlur
                    ? 'text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700'
                    : 'text-white hover:bg-white/10'
                }`}
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors duration-500 ease-out ${
                showBlur
                  ? 'text-gray-600 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700'
                  : 'text-white hover:bg-white/10'
              }`}
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-neutral-800 border-t border-gray-100 dark:border-neutral-700 shadow-xl rounded-b-2xl overflow-hidden">
            <div className="px-4 py-6 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center py-3 px-4 text-left font-medium rounded-xl transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activeSection === item.id
                          ? 'bg-blue-600 dark:bg-blue-400'
                          : 'bg-gray-300 dark:bg-neutral-600'
                      }`}
                    ></div>
                    <span className="text-base">{item.label}</span>
                  </div>
                </button>
              ))}

              {/* Mobile Dark Mode Toggle */}
              <div className="pt-6 mt-6 border-t border-gray-100 dark:border-neutral-700">
                <button
                  onClick={toggleDark}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors"
                >
                  <span className="font-medium">
                    {isDark ? t('theme.lightMode', 'Light Mode') : t('theme.darkMode', 'Dark Mode')}
                  </span>
                  {isDark ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
