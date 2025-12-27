<template>
  <BaseSection 
    ref="heroSection" 
    class="min-h-screen flex items-center justify-center overflow-hidden"
    theme-color="#FDFBF7"
  >
    <div class="relative z-10 text-center">
      <!-- 
        HERO DIRECTION:
        Implement high-impact entry animation here using GSAP.
        Use the 'heroSection' ref for pinning or tracking scroll-driven sequences.
      -->
      <h1 class="hero-title text-[10vw] font-bold uppercase tracking-tighter leading-none text-charcoal opacity-0 translate-y-20">
        [BRAND_NAME]
      </h1>
      <p class="hero-subtitle text-accent uppercase tracking-[0.5em] text-sm font-bold mt-8 opacity-0">
        Digital Experience Starter
      </p>
    </div>

    <!-- Background elements placeholder -->
    <template #background>
      <div class="absolute inset-0 z-0">
        <!-- Add parallax or ambient background elements here -->
      </div>
    </template>
  </BaseSection>
</template>

<script setup lang="ts">
/**
 * HERO COMPONENT SHELL
 * Use this as the starting point for your main entrance animation.
 */
const heroSection = ref<any>(null)
const { gsap, ScrollTrigger } = useGsap()

onMounted(() => {
  // Simple entry animation as direction
  const tl = gsap.timeline({ delay: 0.5 })
  
  tl.to('.hero-title', {
    opacity: 1,
    y: 0,
    duration: 1.5,
    ease: 'power4.out'
  })
  
  tl.to('.hero-subtitle', {
    opacity: 1,
    duration: 1,
    ease: 'power2.out'
  }, '-=0.5')
})
</script>

