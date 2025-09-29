/**
 * Section Component
 * 
 * Core building block for scroll-snapping sections.
 * Provides configurable backgrounds, layouts, animations, and more.
 * 
 * USAGE:
 * <Section
 *   id="unique-section-id"
 *   background="gradient"
 *   layout="center"
 *   animation="fade"
 *   height="screen"
 * >
 *   Your content here
 * </Section>
 */

import React, { useRef, useEffect, useState } from 'react';
import { SectionProps } from '../types';
import { themeConfig } from '../config';

export const Section: React.FC<SectionProps> = ({
  id,
  children,
  className = '',
  background = 'light',
  backgroundImage,
  overlay = 'none',
  layout = 'center',
  padding = 'large',
  animation = 'fade',
  height = 'screen',
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
          setIsVisible(true);
        }
      },
      {
        threshold: themeConfig.sections.intersectionThreshold,
        rootMargin: themeConfig.sections.intersectionMargin,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Background styles
  const getBackgroundStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {};

    if (backgroundImage) {
      baseStyles.backgroundImage = `url(${backgroundImage})`;
      baseStyles.backgroundSize = 'cover';
      baseStyles.backgroundPosition = 'center';
      baseStyles.backgroundRepeat = 'no-repeat';
    }

    return baseStyles;
  };

  // Background classes
  const getBackgroundClass = (): string => {
    switch (background) {
      case 'dark':
        return 'bg-gray-900 dark:bg-neutral-900';
      case 'gradient':
        return 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900';
      case 'image':
        return 'bg-gray-100 dark:bg-gray-800';
      default:
        return 'bg-white dark:bg-neutral-800';
    }
  };

  // Overlay classes
  const getOverlayClass = (): string => {
    switch (overlay) {
      case 'light':
        return 'before:absolute before:inset-0 before:bg-white/20 before:backdrop-blur-sm';
      case 'dark':
        return 'before:absolute before:inset-0 before:bg-black/40 before:backdrop-blur-sm';
      case 'gradient':
        return 'before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/60 before:via-transparent before:to-black/20';
      default:
        return '';
    }
  };

  // Layout classes
  const getLayoutClass = (): string => {
    switch (layout) {
      case 'split':
        return 'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center';
      case 'hero':
        return 'flex flex-col items-center justify-center text-center';
      case 'grid':
        return 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8';
      case 'custom':
        return '';
      default:
        return 'flex flex-col items-center justify-center';
    }
  };

  // Padding classes - mobile-responsive
  const getPaddingClass = (): string => {
    // Hero sections typically have no padding
    if (layout === 'hero' && padding === 'none') return '';

    switch (padding) {
      case 'none':
        return '';
      case 'small':
        return 'px-4 py-6 sm:px-6 sm:py-8 lg:px-8';
      case 'medium':
        return 'px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16';
      case 'large':
        return 'px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20';
      default:
        return 'px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20';
    }
  };

  // Height classes - mobile-responsive
  const getHeightClass = (): string => {
    switch (height) {
      case 'auto':
        return 'min-h-fit';
      case 'min-screen':
        return 'min-h-screen';
      default:
        // Use min-height on mobile to prevent content cutoff, full height on desktop
        return 'min-h-screen md:h-screen';
    }
  };

  // Animation classes
  const getAnimationClass = (): string => {
    if (!isVisible) {
      switch (animation) {
        case 'slide':
          return 'transform translate-y-12 opacity-0';
        case 'scale':
          return 'transform scale-95 opacity-0';
        case 'fade':
          return 'opacity-0';
        default:
          return '';
      }
    }
    return 'transform translate-y-0 scale-100 opacity-100';
  };

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`
        scroll-snap-section
        relative
        ${getHeightClass()}
        ${getBackgroundClass()}
        ${getOverlayClass()}
        ${className}
      `}
      style={{
        ...getBackgroundStyles(),
        zIndex: id === 'home' ? 10 : 1,
        isolation: 'isolate',
      }}
    >
      {/* Content Container */}
      <div
        className={`
          relative z-10
          ${getHeightClass()}
          flex flex-col
          ${getPaddingClass()}
          w-full
          transition-all
          duration-1000
          ease-out
          ${getAnimationClass()}
        `}
        style={{
          transitionDelay: isInView ? themeConfig.animations.fadeIn.delay : '0ms',
        }}
      >
        <div className={`flex-1 ${getLayoutClass()}`}>{children}</div>
      </div>
    </section>
  );
};
