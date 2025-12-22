<template>
  <nav class="fixed top-0 left-0 w-full z-50 flex justify-between items-center py-8 px-10 mix-blend-difference">
    <div class="text-2xl font-bold text-white uppercase tracking-tighter">
      Moksha<span class="italic font-serif">Labs</span>
    </div>
    
    <div class="hidden md:flex gap-10 items-center">
      <a v-for="link in navLinks" :key="link.name" :href="link.href" class="text-white/70 hover:text-white uppercase tracking-widest text-[10px] font-bold transition-colors">
        {{ link.name }}
      </a>
      <button class="bg-white text-black px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-saffron transition-colors">
        Start Project
      </button>
    </div>

    <!-- Mobile Menu Toggle (simplified) -->
    <button class="md:hidden text-white">
      <Menu :size="24" />
    </button>
  </nav>
</template>

<script setup lang="ts">
import { Menu } from 'lucide-vue-next'

const navLinks = [
  { name: 'Services', href: '#services' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'Team', href: '#team' },
  { name: 'Contact', href: '#contact' }
]
</script>

