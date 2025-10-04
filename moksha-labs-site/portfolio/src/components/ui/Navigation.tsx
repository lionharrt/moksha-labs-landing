'use client';

import { useStore } from '@/stores/useStore';
import { sections } from '@/config/sections';

export function Navigation() {
  const currentSection = useStore((state) => state.currentSection);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Check if current section has dark background
  const isDarkSection = currentSection === 'hero' || currentSection === 'contact';

  return (
    <>
      {/* Logo - Fixed to top left */}
      <div className={`fixed top-8 left-8 z-50 text-xl font-bold transition-colors duration-300 ${
        isDarkSection ? 'text-white' : 'text-black'
      }`}>
        ML
      </div>
      
      {/* Navigation - Fixed to top right */}
      <nav className="fixed top-8 right-8 z-50">
        <div className="flex gap-6 text-sm">
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
                      ? 'text-white font-semibold underline'
                      : 'text-black font-semibold underline'
                    : isDarkSection
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-500 hover:text-black'
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
