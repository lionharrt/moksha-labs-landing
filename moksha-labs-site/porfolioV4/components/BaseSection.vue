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
    // Fade background color of the body or a global overlay when this section is active
    ScrollTrigger.create({
      trigger: sectionRef.value,
      start: "top center",
      end: "bottom center",
      onRefresh: (self) => {
        if (self.isActive) {
          gsap.to("body", {
            backgroundColor: props.themeColor,
            duration: 1,
            ease: "power2.inOut",
          });
        }
      },
      onToggle: (self) => {
        if (self.isActive) {
          gsap.to("body", {
            backgroundColor: props.themeColor,
            duration: 1,
            ease: "power2.inOut",
          });
        }
      },
    });
  }
})
</script>

