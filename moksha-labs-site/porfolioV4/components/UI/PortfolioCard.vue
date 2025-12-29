<template>
  <div
    ref="refElement"
    class="portfolio-card-container duration-[var(--duration)] ease-[var(--easing)] delay-[var(--delay)] relative isolate w-full transition-transform will-change-transform [contain:layout_style] [perspective:1000px]"
    :class="{ 'is-loading': loading }"
    @pointermove="handlePointerMove"
    @pointerenter="handlePointerEnter"
    @pointerleave="handlePointerLeave"
  >
    <div
      class="card-inner duration-[var(--duration)] ease-[var(--easing)] delay-[var(--delay)] grid h-full origin-center transition-transform will-change-transform [transform:rotateY(var(--r-x))_rotateX(var(--r-y))] shadow-2xl relative"
      :class="[$attrs.class, rounded, { 'loading-state': loading }]"
    >
      <!-- Animated Border Layer (Conic Gradient) -->
      <div v-if="loading" class="animated-border-wrap">
        <div class="animated-border-bg"></div>
      </div>

      <!-- Main Content Container -->
      <div
        class="content-mask relative z-10 grid size-full overflow-hidden bg-cream [grid-area:1/1]"
        :class="rounded"
      >
        <div class="size-full">
          <slot />
        </div>

        <!-- Subtle Luxury Sheen -->
        <div
          class="sheen-layer transition-background duration-[var(--duration)] ease-[var(--easing)] delay-[var(--delay)] will-change-background absolute inset-0 opacity-[var(--opacity)] mix-blend-overlay transition-opacity [background:radial-gradient(farthest-corner_circle_at_var(--m-x)_var(--m-y),_rgba(226,160,79,0.15)_0%,_rgba(255,255,255,0)_80%)]"
        />

        <!-- Glass Noise -->
        <div
          class="absolute inset-0 z-10 pointer-events-none mix-blend-overlay opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = withDefaults(
  defineProps<{
    initialTiltX?: number;
    initialTiltY?: number;
    loading?: boolean;
    rounded?: string;
  }>(),
  {
    rounded: "rounded-xl md:rounded-2xl",
  }
);

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
    state.value.rotate = {
      x: props.initialTiltX || 0,
      y: props.initialTiltY || 0,
    };
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
  --easing: cubic-bezier(0.23, 1, 0.32, 1);
}

.card-inner {
  border: 1px solid rgba(26, 26, 26, 0.1);
  overflow: hidden;
}

.card-inner.loading-state {
  padding: 2px;
  border: none;
  background: transparent;
  overflow: visible;
}

.animated-border-wrap {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
  z-index: 0;
  pointer-events: none;
}

.animated-border-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400%; /* Massive spread to ensure corners are hit first */
  aspect-ratio: 1/1;
  translate: -50% -50%;
  background: conic-gradient(
    from 0deg,
    transparent 0%,
    transparent 40%,
    rgba(226, 160, 79, 0.9) 50%,
    /* Using official saffron */ transparent 60%,
    transparent 100%
  );
  animation: rotate-border 4s linear infinite;
  will-change: transform;
}

.content-mask {
  z-index: 10;
}

@keyframes rotate-border {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
