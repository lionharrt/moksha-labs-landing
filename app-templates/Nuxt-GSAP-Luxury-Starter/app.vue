<template>
  <div class="app-root">
    <!-- [PLACEHOLDER]: App-wide background elements or ambient layers -->
    
    <!-- NAVIGATION: Global navigation -->
    <NavBar />
    
    <main class="relative z-10">
      <!-- 
        PAGE CONTENT:
        Add your page sections or components here.
      -->
      <SectionsHero />
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * NUXT-GSAP-STARTER
 * A boilerplate for digital experiences.
 * Uses GSAP for animations, Lenis for smooth scrolling, and Tailwind for styling.
 */
</script>

<style>
.app-root {
  @apply relative min-h-screen bg-background text-primary;
}
</style>

