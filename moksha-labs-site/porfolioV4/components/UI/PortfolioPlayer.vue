<template>
  <Teleport to="body">
    <Transition @enter="onEnter" @leave="onLeave" :css="false">
      <div
        v-if="isOpen"
        ref="playerOverlay"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/95 backdrop-blur-sm pointer-events-auto"
        @click="closePlayer"
      >
        <!-- Close Button (Mobile Only) -->
        <button
          v-if="isMobile"
          class="absolute top-8 right-8 z-[110] p-4 text-cream/60 hover:text-cream transition-colors"
          @click.stop="closePlayer"
        >
          <X :size="32" stroke-width="1.5" />
        </button>

        <!-- Player Container -->
        <div
          ref="playerContainer"
          class="relative overflow-hidden bg-black shadow-2xl transition-transform"
          :class="[
            type === 'mobile' ? 'aspect-[9/19.5] h-[85vh]' : 'aspect-video w-[90vw] md:w-[80vw]',
          ]"
          @click.stop
        >
          <video
            ref="videoElement"
            :src="videoUrl"
            class="w-full h-full object-cover"
            autoplay
            loop
            playsinline
            muted
          ></video>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { X } from 'lucide-vue-next';

interface Props {
  isOpen: boolean;
  videoUrl: string;
  posterUrl: string;
  initialRect: DOMRect | null;
  type: 'desktop' | 'mobile';
  currentTime: number;
}

const props = defineProps<Props>();
const emits = defineEmits(['close']);

const { gsap, Observer } = useGsap();
const playerOverlay = ref<HTMLElement | null>(null);
const playerContainer = ref<HTMLElement | null>(null);
const videoElement = ref<HTMLVideoElement | null>(null);
const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

const closePlayer = () => {
  emits('close');
};

const onEnter = (el: HTMLElement, done: () => void) => {
  if (!props.initialRect || !playerContainer.value || !playerOverlay.value) {
    done();
    return;
  }

  // Set initial video time
  if (videoElement.value) {
    videoElement.value.currentTime = props.currentTime;
  }

  const tl = gsap.timeline({ onComplete: done });

  // 1. Fade in overlay
  tl.fromTo(playerOverlay.value, 
    { opacity: 0 }, 
    { opacity: 1, duration: 0.5, ease: 'power2.out' }
  );

  // 2. Animate container from initial position (FLIP)
  const targetRect = playerContainer.value.getBoundingClientRect();
  const needsRotation = isMobile.value && props.type === 'desktop';
  
  tl.fromTo(playerContainer.value, 
    {
      x: props.initialRect.left - targetRect.left,
      y: props.initialRect.top - targetRect.top,
      width: props.initialRect.width,
      height: props.initialRect.height,
      borderRadius: '1rem',
      rotate: 0,
    },
    {
      x: 0,
      y: 0,
      width: needsRotation ? '85vh' : targetRect.width,
      height: needsRotation ? '90vw' : targetRect.height,
      borderRadius: '0rem',
      rotate: needsRotation ? 90 : 0,
      duration: 0.8,
      ease: 'expo.out',
    },
    0
  );
};

const onLeave = (el: HTMLElement, done: () => void) => {
  if (!props.initialRect || !playerContainer.value || !playerOverlay.value) {
    done();
    return;
  }

  const tl = gsap.timeline({ onComplete: done });
  const currentRect = playerContainer.value.getBoundingClientRect();
  const needsRotation = isMobile.value && props.type === 'desktop';

  tl.to(playerOverlay.value, { opacity: 0, duration: 0.4, ease: 'power2.in' });
  
  tl.to(playerContainer.value, {
    x: props.initialRect.left - currentRect.left,
    y: props.initialRect.top - currentRect.top,
    width: props.initialRect.width,
    height: props.initialRect.height,
    borderRadius: '1rem',
    rotate: 0,
    duration: 0.6,
    ease: 'expo.inOut',
  }, 0);
};

// Global Observers
let scrollObserver: any = null;
let resizeHandler: (() => void) | null = null;
let escHandler: ((e: KeyboardEvent) => void) | null = null;

onMounted(() => {
  checkMobile();
  
  resizeHandler = checkMobile;
  window.addEventListener('resize', resizeHandler);
  
  escHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.isOpen) {
      closePlayer();
    }
  };
  window.addEventListener('keydown', escHandler);

  // Close on scroll
  scrollObserver = Observer.create({
    type: "wheel,touch,scroll",
    onChange: (self) => {
      if (props.isOpen && Math.abs(self.deltaY) > 10) {
        closePlayer();
      }
    }
  });
});

onUnmounted(() => {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
    resizeHandler = null;
  }
  if (escHandler) {
    window.removeEventListener('keydown', escHandler);
    escHandler = null;
  }
  if (scrollObserver) {
    scrollObserver.kill();
    scrollObserver = null;
  }
});
</script>

<style scoped>
.landscape-mobile {
  transform: rotate(90deg);
  width: 85vh !important;
  height: 90vw !important;
}
</style>

