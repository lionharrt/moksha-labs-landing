import { onMounted, onUnmounted } from 'vue'

export const useThemeTransition = () => {
  const { gsap, ScrollTrigger } = useGsap()

  const initThemeController = () => {
    if (!import.meta.client) return

    // 1. Clean up existing theme triggers
    ScrollTrigger.getAll().forEach(st => {
      if (st.vars.id === 'theme-trigger') st.kill()
    })

    // 2. Find all sections with a theme color
    const sections = gsap.utils.toArray<HTMLElement>('[data-theme-color]')
    
    sections.forEach((section) => {
      const color = section.dataset.themeColor
      if (!color) return

      ScrollTrigger.create({
        id: 'theme-trigger',
        trigger: section,
        start: "top 60%", // Deterministic threshold: 60% down the viewport
        end: "bottom 60%",
        onToggle: (self) => {
          if (self.isActive) {
            gsap.to("body", {
              backgroundColor: color,
              duration: 1.2,
              ease: "expo.out",
              overwrite: 'auto'
            })
          }
        },
        // Low priority ensures this calculates AFTER pinning and layout shifts
        refreshPriority: -10 
      })
    })
  }

  onMounted(() => {
    // Initial load - wait for Nuxt hydration and layout
    setTimeout(initThemeController, 1000)
    
    // Listen for layout shifts (like horizontal pinning ready)
    window.addEventListener('refresh-theme', initThemeController)
  })

  onUnmounted(() => {
    window.removeEventListener('refresh-theme', initThemeController)
  })

  return {
    refreshTheme: initThemeController
  }
}

