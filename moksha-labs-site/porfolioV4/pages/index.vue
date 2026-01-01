<template>
  <main ref="mainRef" class="relative z-10">
    <SectionsHero id="hero" />
    <SectionsServices id="services" />
    <SectionsPortfolio id="portfolio" />
    <SectionsPricing id="pricing" />
    <SectionsOfferings id="offerings" />
    <SectionsTeam id="team" />
    <SectionsContact id="contact" />
  </main>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
const { gsap, ScrollTrigger } = useGsap()
const { registerPoint, syncIndex, updateVelocity } = useScrollPhasing()

// Main entry point for the single page agency portfolio
const mainRef = ref(null)

onMounted(async () => {
  await nextTick()
  
  // SIMPLIFIED: Let Lenis + ScrollTrigger provide natural, smooth scrolling
  // No aggressive snap navigation - user has full control
  
  // 1. Register section points for tracking only
  const sections = ['#services', '#pricing', '#offerings', '#team', '#contact']
  
  setTimeout(() => {
    sections.forEach((id) => {
      const el = document.querySelector(id)
      if (el) {
        registerPoint({
          id,
          y: () => {
            const st = ScrollTrigger.getById(id.replace('#', '') + 'Trigger')
            return st ? st.start : (el as HTMLElement).offsetTop
          }
        })
      }
    })
    
    syncIndex()
  }, 1000)

  // 2. Track scroll position passively
  window.addEventListener('scroll', () => {
    updateVelocity()
    syncIndex()
  }, { passive: true })
  
  window.addEventListener('resize', () => {
    ScrollTrigger.refresh()
    syncIndex()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', syncIndex)
  })
})
</script>
