<template>
  <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    <div
      v-for="shape in shapes"
      :key="shape.id"
      :ref="(el) => setShapeRef(el, shape.id)"
      class="absolute opacity-[0.08] transition-opacity duration-1000"
      :style="{
        width: `${shape.width}px`,
        height: `${shape.height}px`,
        backgroundColor: shape.color,
        filter: `blur(${shape.blur}px)`,
        borderRadius: shape.borderRadius,
        left: 0,
        top: 0,
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
const { gsap } = useGsap();

interface Shape {
  id: number;
  size: number;
  width: number;
  height: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  blur: number;
  color: string;
  borderRadius: string;
  rotate: number;
  vr: number; // Velocity of rotation
}

const shapes = ref<Shape[]>([]);
const shapeRefs = new Map<number, HTMLElement>();

const setShapeRef = (el: any, id: number) => {
  if (el) shapeRefs.set(id, el);
};

const initShapes = () => {
  if (!import.meta.client) return;

  const count = 7; // Reduced by ~50%
  const saffron = "#E2A04F";

  for (let i = 0; i < count; i++) {
    const baseSize = 40 + Math.random() * 120;
    const shapeType = Math.random();

    let width = baseSize;
    let height = baseSize;
    let borderRadius = "0px";

    if (shapeType > 0.6) {
      borderRadius = "100%";
    } else if (shapeType > 0.3) {
      borderRadius = "12px";
      if (Math.random() > 0.5) width *= 1.5;
    }

    const depthFactor = baseSize / 160;

    shapes.value.push({
      id: i,
      size: baseSize,
      width,
      height,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * (0.5 + depthFactor),
      vy: (Math.random() - 0.5) * (0.5 + depthFactor),
      blur: (1 - depthFactor) * 15 + 2,
      color: saffron, // Removed charcoal
      borderRadius,
      rotate: Math.random() * 360,
      vr: (Math.random() - 0.5) * 0.5,
    });
  }
};

let tickerCallback: (() => void) | null = null;

onMounted(() => {
  initShapes();

  if (!import.meta.client) return;

  // Performance optimized ticker with cleanup
  tickerCallback = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    shapes.value.forEach((shape, i) => {
      // 1. Move & Rotate
      shape.x += shape.vx;
      shape.y += shape.vy;
      shape.rotate += shape.vr;

      // 2. Wall Bounce
      if (shape.x < -shape.width) {
        shape.x = -shape.width;
        shape.vx *= -1;
      } else if (shape.x > width) {
        shape.x = width;
        shape.vx *= -1;
      }

      if (shape.y < -shape.height) {
        shape.y = -shape.height;
        shape.vy *= -1;
      } else if (shape.y > height) {
        shape.y = height;
        shape.vy *= -1;
      }

      // 3. Soft Collision
      for (let j = i + 1; j < shapes.value.length; j++) {
        const other = shapes.value[j];
        const dx = shape.x + shape.width / 2 - (other.x + other.width / 2);
        const dy = shape.y + shape.height / 2 - (other.y + other.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = (shape.size + other.size) / 2;

        if (distance < minDistance) {
          const angle = Math.atan2(dy, dx);
          const force = 0.02;
          shape.vx += Math.cos(angle) * force;
          shape.vy += Math.sin(angle) * force;
          other.vx -= Math.cos(angle) * force;
          other.vy -= Math.sin(angle) * force;
        }
      }

      // 4. Update DOM
      const el = shapeRefs.get(shape.id);
      if (el) {
        el.style.transform = `translate(${shape.x}px, ${shape.y}px) rotate(${shape.rotate}deg)`;
      }
    });
  };

  gsap.ticker.add(tickerCallback);
});

onUnmounted(() => {
  // Clean up ticker to prevent memory leaks
  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback);
    tickerCallback = null;
  }
  shapeRefs.clear();
});
</script>
