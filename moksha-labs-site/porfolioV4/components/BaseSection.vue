<template>
  <section 
    ref="sectionRef"
    class="section-container"
    :class="[bgClass, paddingClass]"
    :data-theme-color="themeColor"
  >
    <div :class="fullWidth ? 'w-full h-full relative z-10' : 'max-w-7xl mx-auto w-full relative z-10'">
      <slot />
    </div>
    
    <!-- Background floating elements / depth -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <slot name="background" />
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  bgClass?: string
  paddingClass?: string
  themeColor?: string // For background fade transition
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  bgClass: 'bg-transparent',
  paddingClass: 'py-24',
  themeColor: '#FDFBF7',
  fullWidth: false
})

const sectionRef = ref<HTMLElement | null>(null)
</script>

