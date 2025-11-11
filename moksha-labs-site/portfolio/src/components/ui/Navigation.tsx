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

  return <></>;
}
