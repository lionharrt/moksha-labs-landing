<template>
  <div
    ref="cursorRef"
    class="fixed top-0 left-0 w-8 h-8 bg-saffron rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
    style="transform: translate(-50%, -50%)"
  ></div>
</template>

<script setup lang="ts">
const cursorRef = ref<HTMLElement | null>(null);
const { gsap } = useGsap();

onMounted(() => {
  if (import.meta.client && cursorRef.value) {
    const cursor = cursorRef.value;

    // Smooth follow cursor
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.4, ease: "power3" });

    window.addEventListener("mousemove", (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    });

    // Use event delegation for hover effects
    window.addEventListener("mouseover", (e) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, .cursor-pointer");
      const noScale = target.closest(".no-cursor-scale");
      const hideCursor = target.closest(".hide-custom-cursor");

      if (hideCursor) {
        gsap.to(cursor, { opacity: 0, scale: 0.5, duration: 0.3 });
      } else if (interactive && !noScale) {
        gsap.to(cursor, { opacity: 1, scale: 2, duration: 0.3 });
      }
    });

    window.addEventListener("mouseout", (e) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, .cursor-pointer");
      const hideCursor = target.closest(".hide-custom-cursor");

      if (hideCursor) {
        gsap.to(cursor, { opacity: 1, scale: 1, duration: 0.3 });
      } else if (interactive) {
        gsap.to(cursor, { opacity: 1, scale: 1, duration: 0.3 });
      }
    });
  }
});
</script>
