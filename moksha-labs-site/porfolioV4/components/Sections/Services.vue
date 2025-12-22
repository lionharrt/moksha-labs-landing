<template>
  <BaseSection theme-color="#F5F2ED" id="services">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="(service, index) in services" :key="index" 
           class="p-8 glass-panel group hover:border-saffron/50 transition-all duration-500"
           :class="index % 2 === 0 ? 'rounded-tr-[100px] rounded-bl-xl' : 'rounded-tl-[100px] rounded-br-xl'">
        <div class="text-saffron mb-6">
          <component :is="service.icon" :size="40" stroke-width="1.5" />
        </div>
        <h3 class="text-2xl font-bold mb-4">{{ service.title }}</h3>
        <p class="text-charcoal/70 leading-relaxed">{{ service.description }}</p>
      </div>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import { Globe, Cpu, Palette } from 'lucide-vue-next'

const services = [
  {
    title: 'Digital Experience',
    description: 'Creating immersive web applications that push the boundaries of modern design and technology.',
    icon: Globe
  },
  {
    title: 'Brand Identity',
    description: 'Defining unique visual languages that resonate with your audience and build lasting trust.',
    icon: Palette
  },
  {
    title: 'Strategic Innovation',
    description: 'Transforming complex business challenges into elegant, scalable digital solutions.',
    icon: Cpu
  }
]
</script>

