<template>
  <section 
    ref="sectionRef"
    class="section-container"
    :class="[bgClass, paddingClass]"
  >
    <div class="max-w-7xl mx-auto w-full relative z-10">
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
}

const props = withDefaults(defineProps<Props>(), {
  bgClass: 'bg-transparent',
  paddingClass: 'py-24',
  themeColor: '#FDFBF7'
})

const sectionRef = ref<HTMLElement | null>(null)
const { gsap, ScrollTrigger } = useGsap()

onMounted(() => {
  if (props.themeColor && sectionRef.value) {
    // Determine text color based on background (basic light/dark check)
    const isDark = props.themeColor === '#1A1A1A'
    const targetTextColor = isDark ? '#FDFBF7' : '#1A1A1A'

    // Fade background and text color of the body
    ScrollTrigger.create({
      trigger: sectionRef.value,
      start: 'top 40%',
      end: 'bottom 40%',
      onEnter: () => {
        gsap.to('body', { 
          backgroundColor: props.themeColor, 
          color: targetTextColor,
          duration: 1, 
          ease: 'power2.inOut' 
        })
      },
      onEnterBack: () => {
        gsap.to('body', { 
          backgroundColor: props.themeColor, 
          color: targetTextColor,
          duration: 1, 
          ease: 'power2.inOut' 
        })
      }
    })
  }
})
</script>

