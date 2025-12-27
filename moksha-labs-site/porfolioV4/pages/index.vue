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
// Main entry point for the single page agency portfolio
const mainRef = ref(null)
</script>
