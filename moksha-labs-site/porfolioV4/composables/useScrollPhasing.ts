import { ref } from 'vue'

export interface ScrollSection {
  id: string
  y: number | (() => number)
}

// Simplified global state - only for tracking, NOT for controlling scroll
const currentSectionId = ref<string>('hero')
const isHeroAnimationPlaying = ref(false)
const sections = ref<ScrollSection[]>([])

export const useScrollPhasing = () => {
  const registerSection = (section: ScrollSection) => {
    // Avoid duplicates
    if (sections.value.find((s) => s.id === section.id)) return
    sections.value.push(section)
  }

  const registerSections = (newSections: ScrollSection[]) => {
    newSections.forEach((section) => {
      if (!sections.value.find((s) => s.id === section.id)) {
        sections.value.push(section)
      }
    })
  }

  const updateCurrentSection = (sectionId: string) => {
    currentSectionId.value = sectionId
  }

  const getCurrentSection = () => {
    return currentSectionId.value
  }

  return {
    currentSectionId,
    isHeroAnimationPlaying,
    sections,
    registerSection,
    registerSections,
    updateCurrentSection,
    getCurrentSection,
  }
}

