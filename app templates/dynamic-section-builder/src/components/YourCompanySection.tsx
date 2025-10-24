import React, { useRef, useEffect, useState } from 'react';

interface YourCompanySectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  background?: 'light' | 'dark' | 'gradient' | 'transparent';
  padding?: 'none' | 'small' | 'medium' | 'large';
  animation?: 'fade' | 'slide' | 'none';
  height?: 'screen' | 'auto' | 'min-screen';
}

export const YourCompanySection: React.FC<YourCompanySectionProps> = ({
  id,
  children,
  className = '',
  background = 'transparent',
  padding = 'large',
  animation = 'fade',
  height = 'screen',
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
          setIsVisible(true);
        }
      },
      {
        threshold: [0.1, 0.2, 0.5],
        rootMargin: '-10% 0px -10% 0px',
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

  const getBackgroundClass = () => {
    switch (background) {
      case 'light':
        return 'bg-white dark:bg-neutral-900';
      case 'dark':
        return 'bg-gray-900 dark:bg-neutral-950';
      case 'gradient':
        return 'bg-gradient-to-br from-emerald-50 via-blue-50 to-white dark:from-gray-900 dark:via-emerald-950 dark:to-gray-900';
      default:
        return '';
    }
  };

  const getPaddingClass = () => {
    switch (padding) {
      case 'none':
        return '';
      case 'small':
        return 'px-4 py-8 sm:px-6 sm:py-12 lg:px-8';
      case 'medium':
        return 'px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20';
      case 'large':
        return 'px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24';
      default:
        return 'px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24';
    }
  };

  const getHeightClass = () => {
    switch (height) {
      case 'auto':
        return 'min-h-fit';
      case 'min-screen':
        return 'min-h-screen';
      default:
        return 'h-screen';
    }
  };

  const getAnimationClass = () => {
    if (!isVisible) {
      switch (animation) {
        case 'slide':
          return 'transform translate-y-12 opacity-0';
        case 'fade':
          return 'opacity-0';
        default:
          return '';
      }
    }
    return 'transform translate-y-0 opacity-100';
  };

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`
        relative
        ${getHeightClass()}
        ${getBackgroundClass()}
        ${getPaddingClass()}
        ${className}
      `}
    >
      <div
        className={`
          relative
          max-w-7xl
          mx-auto
          transition-all
          duration-1000
          ease-out
          ${getAnimationClass()}
        `}
      >
        {children}
      </div>
    </section>
  );
};

