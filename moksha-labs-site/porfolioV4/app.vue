<template>
  <div class="app-root">
    <FloatingBackground />
    <NavBar />
    <CustomCursor />
    
    <main class="relative z-10">
      <SectionsHero />
      <SectionsServices />
      <SectionsPortfolio />
      <SectionsPricing />
      <SectionsTeam />
      <SectionsContact />
    </main>

    <footer class="bg-charcoal text-cream py-10 px-10 text-center border-t border-cream/5">
      <p class="text-[10px] uppercase tracking-[0.5em] opacity-30">© 2025 Moksha Labs. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Nuxt will automatically import components from the components/ directory
</script>

<style>
/* Any global app styles */
.app-root {
  @apply relative;
}
</style>
