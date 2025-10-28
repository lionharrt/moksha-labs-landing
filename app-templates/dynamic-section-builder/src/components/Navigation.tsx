import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MEDIA_CONFIG } from '../config/media';
import { useVariants } from '../contexts/VariantContext';

interface NavigationProps {
  className?: string;
}

// Smooth scroll function with routing support
const scrollToSection = (
  sectionId: string,
  navigate: ReturnType<typeof useNavigate>,
  currentPathname: string
) => {
  // If we're not on the home page, navigate there first
  if (currentPathname !== '/') {
    navigate(`/#${sectionId}`);
    return;
  }

  // If we're already on the home page, scroll to the section
  const element = document.getElementById(sectionId);
  const scrollContainer = document.querySelector('.scroll-snap-container') as HTMLElement;

  if (element && scrollContainer) {
    // Use scrollIntoView for smooth scrolling
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    // Update URL hash without triggering scroll
    window.history.pushState(null, '', `#${sectionId}`);
  } else if (element) {
    // Fallback to regular scroll if no scroll container
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    window.history.pushState(null, '', `#${sectionId}`);
  } else {
    // Element doesn't exist yet, wait for it to load
    setTimeout(() => {
      const delayedElement = document.getElementById(sectionId);
      if (delayedElement) {
        delayedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        window.history.pushState(null, '', `#${sectionId}`);
      }
    }, 100);
  }
};

const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMouseNear, setIsMouseNear] = useState(false);
  const [isActivelyScrolling, setIsActivelyScrolling] = useState(false);
  const [showBlur, setShowBlur] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(['navigation', 'common']);
  const { state } = useVariants();

  const scrollTimeoutRef = useRef<number>();
  const autoFadeTimeoutRef = useRef<number>();

  // Section key to nav ID mapping
  const sectionToNavId: Record<string, string> = {
    whoWeAre: 'who-we-are',
    benefits: 'benefits',
    services: 'services',
    showcase: 'recent-jobs',  // showcase section uses recent-jobs ID
    process: 'process',
    didYouKnow: 'did-you-know',
    invest: 'invest',
    contact: 'contact',
  };

  // Section key to translation key mapping
  const sectionToTranslationKey: Record<string, string> = {
    whoWeAre: 'whoWeAre',
    benefits: 'benefits',
    services: 'services',
    showcase: 'recentJobs',
    process: 'process',
    didYouKnow: 'didYouKnow',
    invest: 'invest',
    contact: 'contact',
  };

  // Dynamic navigation items based on enabled sections
  const navItems = [
    { id: 'home', label: t('navigation:home') },
    ...state.sectionOrder
      .filter(sectionKey => sectionToNavId[sectionKey]) // Only include sections with nav mappings
      .map(sectionKey => ({
        id: sectionToNavId[sectionKey],
        label: t(`navigation:${sectionToTranslationKey[sectionKey]}`),
      })),
  ];

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sync active section with route/hash
  useEffect(() => {
    if (location.pathname !== '/') {
      const path = location.pathname.toLowerCase();
      if (path.includes('contact')) setActiveSection('contact');
      else setActiveSection('home');
      setShowBlur(true);
      return;
    }

    if (location.hash) {
      const hash = location.hash.replace('#', '');
      if (hash) setActiveSection(hash);
    }
  }, [location.pathname, location.hash]);

  // Handle hash changes
  useEffect(() => {
    const onHashChange = () => {
      if (location.pathname === '/') {
        const hash = window.location.hash.replace('#', '');
        if (hash) setActiveSection(hash);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [location.pathname]);

  // Scroll tracking
  useEffect(() => {
    const initializeScrollTracking = () => {
      const scrollContainer = document.querySelector('.scroll-snap-container') as HTMLElement;
      
      if (!scrollContainer) {
        // Retry if container not found yet
        setTimeout(initializeScrollTracking, 100);
        return;
      }

      const updateSectionState = (isInitialCall = false) => {
        const scrollTop = scrollContainer.scrollTop;
        const nearTopThreshold = isMobile ? 50 : 20;
        const isNearTop = scrollTop <= nearTopThreshold;

        setIsScrolled(!isNearTop);

        if (!isInitialCall) {
          setIsActivelyScrolling(true);
        }

        // Determine active section (dynamically based on navItems)
        const sections = navItems.map(item => item.id);
        const navHeight = isMobile ? 80 : 96; // h-20 (80px) mobile, h-24 (96px) desktop

        let activeSection = null;
        let closestDistance = Infinity;
        
        for (const sectionId of sections) {
          const section = document.getElementById(sectionId);
          if (section) {
            const rect = section.getBoundingClientRect();
            const distanceFromTop = Math.abs(rect.top - navHeight);
            
            if (rect.bottom > navHeight && rect.top < window.innerHeight) {
              if (distanceFromTop < closestDistance) {
                closestDistance = distanceFromTop;
                activeSection = sectionId;
              }
            }
          }
        }
        
        if (activeSection) {
          setActiveSection(activeSection);
          const newHash = `#${activeSection}`;
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
      let scrollThrottleTimeout: ReturnType<typeof setTimeout> | null = null;
      const handleScroll = () => {
        if (scrollThrottleTimeout) return;
        
        scrollThrottleTimeout = setTimeout(() => {
          updateSectionState(false);
          scrollThrottleTimeout = null;
        }, 16); // ~60fps
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
    scrollToSection(sectionId, navigate, location.pathname);
    setIsMenuOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToSection('home', navigate, location.pathname);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        showBlur
          ? 'bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-100/50'
          : 'bg-transparent border-b border-transparent'
      } ${className}`}
    >
      <div className="mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 sm:h-24">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={handleLogoClick}
              className="flex items-center hover:opacity-80 transition-opacity duration-300"
            >
              <img 
                src={MEDIA_CONFIG.images.logo} 
                alt={t('common:company.name')}
                className="h-16 sm:h-20 w-auto min-w-[120px] sm:min-w-[160px]"
                style={{ objectFit: 'contain' }}
              />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 xl:px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-500 ease-out rounded-lg ${
                    isActive
                      ? showBlur
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-white bg-white/10'
                      : showBlur
                      ? 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Right side - CTA + Mobile Menu */}
          <div className="flex items-center space-x-3">
            {/* Desktop CTA Button */}
            <button
              onClick={() => handleNavClick('contact')}
              className={`hidden md:block px-6 py-2 text-sm font-medium rounded-lg transition-all duration-500 ease-out shadow-md hover:shadow-lg ${
                showBlur
                  ? 'bg-secondary-500 hover:bg-secondary-600 text-white'
                  : 'bg-secondary-500 hover:bg-secondary-600 text-white'
              }`}
            >
              {t('navigation:getQuote')}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors duration-500 ease-out ${
                showBlur
                  ? 'text-gray-600 hover:bg-gray-100'
                  : 'text-white hover:bg-white/10'
              }`}
              aria-label={t('navigation:menu')}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl rounded-b-2xl overflow-hidden">
            <div className="px-4 py-6 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center py-3 px-4 text-left font-medium rounded-xl transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        activeSection === item.id ? 'bg-primary-600' : 'bg-gray-300'
                      }`}
                    />
                    <span className="text-base">{item.label}</span>
                  </div>
                </button>
              ))}

              <div className="pt-6 mt-6 border-t border-gray-100">
                <button
                  onClick={() => {
                    handleNavClick('contact');
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-secondary-500 hover:bg-secondary-600 text-white py-4 px-6 rounded-lg font-semibold text-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {t('navigation:getQuote')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

