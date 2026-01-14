<template>
  <section 
    ref="heroSection" 
    class="min-h-screen flex items-center justify-center overflow-hidden relative"
  >
    <div class="relative z-10 text-center px-4">
      <h1 class="hero-title text-[8vw] font-bold uppercase tracking-tight leading-none text-primary opacity-0 translate-y-20">
        [HERO_TITLE]
      </h1>
      <p class="hero-subtitle text-accent uppercase tracking-[0.3em] text-xs sm:text-sm font-bold mt-6 opacity-0">
        [HERO_SUBTITLE]
      </p>
    </div>

    <!-- Background elements placeholder -->
    <div class="absolute inset-0 z-0">
      <!-- [PLACEHOLDER]: Add background or parallax elements -->
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * HERO COMPONENT
 * Generic shell with GSAP entry animations.
 */
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

const heroSection = ref(null)

onMounted(() => {
  const tl = gsap.timeline({ delay: 0.5 })
  
  tl.to('.hero-title', {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: 'power3.out'
  })
  
  tl.to('.hero-subtitle', {
    opacity: 1,
    duration: 0.8,
    ease: 'power2.out'
  }, '-=0.4')
})
</script>

