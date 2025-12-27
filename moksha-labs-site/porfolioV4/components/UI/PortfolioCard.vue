<template>
  <div
    ref="refElement"
    class="portfolio-card-container duration-[var(--duration)] ease-[var(--easing)] delay-[var(--delay)] relative isolate w-full transition-transform will-change-transform [contain:layout_style] [perspective:1000px]"
    @pointermove="handlePointerMove"
    @pointerenter="handlePointerEnter"
    @pointerleave="handlePointerLeave"
  >
    <div
      class="card-inner duration-[var(--duration)] ease-[var(--easing)] delay-[var(--delay)] grid h-full origin-center overflow-hidden rounded-2xl border border-charcoal/10 transition-transform will-change-transform [transform:rotateY(var(--r-x))_rotateX(var(--r-y))] shadow-2xl"
    >
      <div
        class="grid size-full [clip-path:inset(0_0_0_0_round_var(--radius))] [grid-area:1/1] bg-charcoal/5"
      >
        <div class="size-full">
          <slot />
        </div>
      </div>
      
      <!-- Subtle Luxury Sheen (Replacing the rainbow/diagonal effects with a minimalist saffron/white glow) -->
      <div
        class="transition-background duration-[var(--duration)] ease-[var(--easing)] delay-[var(--delay)] will-change-background grid size-full opacity-[var(--opacity)] mix-blend-overlay transition-opacity [background:radial-gradient(farthest-corner_circle_at_var(--m-x)_var(--m-y),_rgba(234,179,8,0.15)_0%,_rgba(255,255,255,0)_80%)] [grid-area:1/1]"
      />
      
      <!-- Glass Noise Overlay -->
      <div class="absolute inset-0 z-10 pointer-events-none mix-blend-overlay opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] [grid-area:1/1]"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const props = defineProps<{
  initialTiltX?: number;
  initialTiltY?: number;
}>();

const isPointerInside = ref(false);
const refElement = ref<HTMLElement | null>(null);

const state = ref({
  glare: { x: 50, y: 50 },
  rotate: { x: props.initialTiltX || 0, y: props.initialTiltY || 0 },
});

function handlePointerMove(event: PointerEvent) {
  const rotateFactor = 0.5;
  const rect = refElement.value?.getBoundingClientRect();
  if (rect) {
    const position = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    const percentage = {
      x: (100 / rect.width) * position.x,
      y: (100 / rect.height) * position.y,
    };
    const delta = {
      x: percentage.x - 50,
      y: percentage.y - 50,
    };
    
    // Smoothly blend from initial tilt to mouse position
    state.value.rotate.x = -(delta.x / 4) * rotateFactor;
    state.value.rotate.y = (delta.y / 2) * rotateFactor;
    state.value.glare.x = percentage.x;
    state.value.glare.y = percentage.y;
  }
}

function handlePointerEnter() {
  isPointerInside.value = true;
  if (refElement.value) {
    refElement.value.style.setProperty("--duration", "0.1s");
    refElement.value.style.setProperty("--opacity", "1");
  }
}

function handlePointerLeave() {
  isPointerInside.value = false;
  if (refElement.value) {
    refElement.value.style.setProperty("--duration", "0.8s");
    refElement.value.style.setProperty("--opacity", "0");
    state.value.rotate = { x: props.initialTiltX || 0, y: props.initialTiltY || 0 };
  }
}
</script>

<style scoped>
.portfolio-card-container {
  --m-x: v-bind(state.glare.x + "%");
  --m-y: v-bind(state.glare.y + "%");
  --r-x: v-bind(state.rotate.x + "deg");
  --r-y: v-bind(state.rotate.y + "deg");
  --duration: 0.8s;
  --opacity: 0;
  --radius: 16px;
  --easing: cubic-bezier(0.23, 1, 0.32, 1);
}

.card-inner {
  aspect-ratio: 16/10;
}
</style>

