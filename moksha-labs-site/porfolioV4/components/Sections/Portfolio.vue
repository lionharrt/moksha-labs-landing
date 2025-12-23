<template>
  <BaseSection theme-color="#F5F2ED" id="portfolio">
    <div class="flex flex-col md:flex-row justify-between items-end mb-16">
      <h2 class="text-6xl font-bold max-w-xl">Selected Works That Define Excellence</h2>
      <div class="hidden md:block text-right">
        <p class="text-charcoal/60 mb-2">Portfolio</p>
        <p class="text-2xl font-serif italic">2023 - 2025</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-16">
      <div v-for="(project, index) in projects" :key="index" 
           class="group cursor-pointer"
           :class="index % 2 !== 0 ? 'md:mt-24' : ''">
        <div class="relative aspect-[4/5] overflow-hidden rounded-3xl mb-6 bg-charcoal/5">
          <div class="absolute inset-0 bg-saffron/10 group-hover:bg-saffron/0 transition-colors duration-700"></div>
          <!-- Placeholder for Firebase image -->
          <div class="w-full h-full flex items-center justify-center text-charcoal/20">
            [ Project Image ]
          </div>
        </div>
        <p class="text-saffron uppercase tracking-widest text-xs font-bold mb-2">{{ project.category }}</p>
        <h3 class="text-3xl font-bold mb-4 group-hover:translate-x-2 transition-transform duration-500">{{ project.title }}</h3>
      </div>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
const projects = [
  { title: 'The Ethereal Collective', category: 'Creative Direction', image: '' },
  { title: 'Nexus FinTech', category: 'UI/UX Design', image: '' },
  { title: 'Aura Wellness', category: 'Brand Identity', image: '' },
  { title: 'Lumina Architecture', category: 'Web Development', image: '' }
]
</script>

