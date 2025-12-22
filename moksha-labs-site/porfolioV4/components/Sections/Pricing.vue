<template>
  <BaseSection theme-color="#FDFBF7" id="pricing">
    <div class="text-center mb-16">
      <h2 class="text-5xl font-bold mb-4">Investment</h2>
      <p class="text-charcoal/60 uppercase tracking-widest text-sm">Tailored solutions for every scale</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
      <div v-for="plan in plans" :key="plan.name" 
           class="relative p-12 border border-charcoal/10 rounded-[50px] overflow-hidden group">
        <div class="absolute top-0 right-0 p-8 text-saffron/10 group-hover:text-saffron/20 transition-colors">
          <component :is="plan.icon" :size="120" stroke-width="0.5" />
        </div>
        
        <h3 class="text-3xl font-bold mb-2">{{ plan.name }}</h3>
        <p class="text-saffron font-semibold mb-6">{{ plan.price }}</p>
        
        <ul class="space-y-4 mb-10">
          <li v-for="feature in plan.features" :key="feature" class="flex items-center text-charcoal/70">
            <span class="w-1.5 h-1.5 bg-saffron rounded-full mr-3"></span>
            {{ feature }}
          </li>
        </ul>
        
        <button class="w-full py-4 border border-charcoal text-charcoal hover:bg-charcoal hover:text-cream transition-colors rounded-full font-bold uppercase tracking-wider text-sm">
          Get Started
        </button>
      </div>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import { Zap, Crown } from 'lucide-vue-next'

const plans = [
  {
    name: 'Essential',
    price: 'Starting at $5k',
    icon: Zap,
    features: ['Custom Web Design', 'Responsive Development', 'Basic SEO', 'Content Strategy']
  },
  {
    name: 'Signature',
    price: 'Starting at $15k',
    icon: Crown,
    features: ['Advanced Animations', 'Full Brand Identity', 'Custom Interactions', 'Performance Optimization', 'Priority Support']
  }
]
</script>

