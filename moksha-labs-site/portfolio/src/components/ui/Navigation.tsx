"use client";

import { useStore } from "@/stores/useStore";
import { sections } from "@/config/sections";

export function Navigation() {
  const currentSection = useStore((state) => state.currentSection);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Check if current section has dark background
  const isDarkSection =
    currentSection === "hero" || currentSection === "contact";

  return (
    <>
      {/* Logo - Fixed to top left */}
      <div
        id="lotus-icon-target"
        className="lotus-icon-target fixed top-0 left-0 w-16 h-16 z-50"
      />

      {/* Navigation - Fixed to top right */}
      <nav className="fixed top-8 right-8 z-50">
        <div className="flex gap-6 text-sm font-medium tracking-wide">
          {sections.map((section) => {
            const isActive = currentSection === section.id;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={(e) => handleClick(e, section.id)}
                className={`transition-colors duration-200 ${
                  isActive
                    ? isDarkSection
                      ? "text-brand-saffron font-semibold underline decoration-2 underline-offset-4"
                      : "text-brand-teal-dark font-semibold underline decoration-2 underline-offset-4"
                    : isDarkSection
                    ? "text-brand-teal-light hover:text-brand-saffron-light"
                    : "text-brand-teal-light hover:text-brand-teal-dark"
                }`}
              >
                {section.title}
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}
