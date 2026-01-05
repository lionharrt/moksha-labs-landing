import { onMounted, onUnmounted } from 'vue'

export const useThemeTransition = () => {
  const { gsap, ScrollTrigger } = useGsap()
  let initialized = false

  const initThemeController = () => {
    if (!import.meta.client || initialized) return
    initialized = true

    // Find all sections with a theme color
    const sections = gsap.utils.toArray<HTMLElement>('[data-theme-color]')
    
    sections.forEach((section) => {
      const color = section.dataset.themeColor
      if (!color) return

      ScrollTrigger.create({
        trigger: section,
        start: "top 60%",
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
        refreshPriority: -10 
      })
    })
  }

  onMounted(() => {
    // Single initialization after layout is ready
    setTimeout(initThemeController, 800)
  })

  onUnmounted(() => {
    // Clean up theme triggers
    ScrollTrigger.getAll().forEach(st => {
      if (st.vars.trigger && (st.vars.trigger as HTMLElement).dataset?.themeColor) {
        st.kill()
      }
    })
  })

  return {
    refreshTheme: initThemeController
  }
}

