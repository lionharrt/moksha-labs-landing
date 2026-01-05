<template>
  <main ref="mainRef" class="relative z-10">
    <ClientOnly>
      <SectionsHero id="hero" />
    </ClientOnly>
    <div ref="sectionsContainer" class="sections-container">
      <SectionsServices id="services" />
      <SectionsPortfolio id="portfolio" />
      <SectionsPricing id="pricing" />
      <SectionsOfferings id="offerings" />
      <SectionsTeam id="team" />
      <SectionsContact id="contact" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
const { ScrollTrigger, gsap } = useGsap()
const { registerSections } = useScrollPhasing()

// Main entry point for the single page agency portfolio
const mainRef = ref(null)
const sectionsContainer = ref<HTMLElement | null>(null)

let resizeHandler: (() => void) | null = null

onMounted(async () => {
  await nextTick()
  
  // Fade in sections container after hero is ready
  setTimeout(() => {
    if (sectionsContainer.value) {
      gsap.to(sectionsContainer.value, {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out"
      })
    }
  }, 600)
  
  // Natural smooth scrolling via Lenis + ScrollTrigger
  // Register sections for tracking only (no forced snapping)
  setTimeout(() => {
    const sections = ['#services', '#portfolio', '#pricing', '#offerings', '#team', '#contact']
    const sectionsToRegister = sections.map((id) => {
      const el = document.querySelector(id)
      return {
        id: id.replace('#', ''),
        y: () => (el as HTMLElement)?.offsetTop || 0
      }
    })
    
    registerSections(sectionsToRegister)
  }, 800)

  // Handle resize gracefully
  resizeHandler = () => {
    ScrollTrigger.refresh()
  }
  
  window.addEventListener('resize', resizeHandler, { passive: true })
})

onUnmounted(() => {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
    resizeHandler = null
  }
})
</script>

<style scoped>
.sections-container {
  opacity: 0;
}
</style>
