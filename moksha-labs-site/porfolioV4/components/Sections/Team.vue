<template>
  <BaseSection theme-color="#FDFBF7" id="team">
    <div class="text-center mb-20">
      <h2 class="text-5xl font-bold italic font-serif">The Minds Behind Moksha</h2>
    </div>

    <div class="flex flex-wrap justify-center gap-12">
      <div v-for="member in team" :key="member.name" class="text-center group">
        <div class="w-48 h-48 rounded-full overflow-hidden mb-6 mx-auto bg-charcoal/5 relative border-2 border-transparent group-hover:border-saffron transition-all duration-500 p-2">
          <div class="w-full h-full rounded-full bg-cream-dark flex items-center justify-center">
            <span class="text-charcoal/20 font-bold text-2xl">{{ member.initials }}</span>
          </div>
        </div>
        <h4 class="text-xl font-bold">{{ member.name }}</h4>
        <p class="text-saffron text-sm tracking-widest uppercase">{{ member.role }}</p>
      </div>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
const team = [
  { name: 'Aria Vance', role: 'Creative Director', initials: 'AV' },
  { name: 'Julian Thorne', role: 'Lead Developer', initials: 'JT' },
  { name: 'Sienna Ray', role: 'UX Strategist', initials: 'SR' }
]
</script>

