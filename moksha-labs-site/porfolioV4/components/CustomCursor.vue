<template>
  <div 
    ref="cursorRef" 
    class="fixed top-0 left-0 w-8 h-8 bg-saffron rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
    style="transform: translate(-50%, -50%)"
  ></div>
</template>

<script setup lang="ts">
const cursorRef = ref<HTMLElement | null>(null)
const { gsap } = useGsap()

onMounted(() => {
  if (import.meta.client && cursorRef.value) {
    const cursor = cursorRef.value
    
    // Smooth follow cursor
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.4, ease: "power3" })
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.4, ease: "power3" })

    window.addEventListener("mousemove", e => {
      xTo(e.clientX)
      yTo(e.clientY)
    })

    // Hover effects on links and buttons
    const interactiveElements = document.querySelectorAll('a, button, .cursor-pointer')
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to(cursor, { scale: 2, duration: 0.3 })
      })
      el.addEventListener('mouseleave', () => {
        gsap.to(cursor, { scale: 1, duration: 0.3 })
      })
    })
  }
})
</script>

