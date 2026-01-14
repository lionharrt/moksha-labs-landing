<template>
  <nav class="fixed top-0 left-0 w-full z-50 flex justify-between items-center py-6 px-8 mix-blend-difference">
    <div class="text-xl font-bold text-white tracking-tight">
      [LOGO]
    </div>
    
    <div class="hidden md:flex gap-8 items-center">
      <a v-for="link in navLinks" :key="link.name" :href="link.href" class="text-white/80 hover:text-white uppercase tracking-wider text-[11px] font-medium transition-colors">
        {{ link.name }}
      </a>
      <button class="bg-white text-black px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-accent transition-colors">
        [ACTION]
      </button>
    </div>

    <!-- Mobile Menu Toggle -->
    <button class="md:hidden text-white">
      <Menu :size="24" />
    </button>
  </nav>
</template>

<script setup lang="ts">
import { Menu } from 'lucide-vue-next'

const navLinks = [
  { name: 'Link 1', href: '#' },
  { name: 'Link 2', href: '#' },
  { name: 'Link 3', href: '#' }
]
</script>

