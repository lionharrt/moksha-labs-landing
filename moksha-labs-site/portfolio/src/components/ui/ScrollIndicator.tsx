"use client";

import { useEffect, useState } from "react";

interface ScrollIndicatorProps {
  show: boolean; // Show when intro completes and scrolling is unlocked
}

/**
 * ScrollIndicator Component
 * Displays a bouncing chevron at the bottom center to indicate scrolling is available
 */
export function ScrollIndicator({ show }: ScrollIndicatorProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      // Small delay before showing for smooth transition
      const timer = setTimeout(() => setIsVisible(true), 300);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show]);

  // Hide on scroll
  useEffect(() => {
    if (!isVisible) return;

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none animate-bounce"
      style={{
        opacity: isVisible ? 0.5 : 0,
        transition: "opacity 0.5s ease-in-out",
      }}
    >
      <div className="flex flex-col items-center">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          <path
            d="M6 9L12 15L18 9"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
