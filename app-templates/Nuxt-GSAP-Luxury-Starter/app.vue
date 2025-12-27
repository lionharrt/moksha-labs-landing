<template>
  <div class="app-root">
    <!-- BACKGROUND: Global floating elements or ambient lighting -->
    <FloatingBackground />
    
    <!-- NAVIGATION: Fixed global navbar -->
    <NavBar />
    
    <!-- INTERACTION: High-end custom cursor -->
    <CustomCursor />
    
    <main class="relative z-10">
      <!-- 
        PAGE STRUCTURE:
        Each top-level component should be a section wrapped in BaseSection.
        This enables the smooth background fade transitions.
      -->
      <SectionsHero />
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * NUXT-GSAP-LUXURY-STARTER
 * A boilerplate for high-end digital experiences.
 * Uses GSAP for animations, Lenis for smooth scrolling, and Tailwind for styling.
 */
</script>

<style>
.app-root {
  @apply relative min-h-screen bg-cream;
}
</style>

