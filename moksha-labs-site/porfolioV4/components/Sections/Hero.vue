<template>
  <BaseSection
    ref="heroSection"
    :key="locale"
    theme-color="#FDFBF7"
    class="hero-section flex items-center justify-center overflow-hidden !py-0 min-h-screen"
  >
    <div
      ref="heroContainer"
      class="relative w-full h-screen flex items-center justify-center overflow-hidden"
    >
      <!-- Horizontal Typography Container -->
      <div
        ref="textContainer"
        class="flex items-center absolute w-full h-full pointer-events-none"
      >
        <h1
          class="hero-text text-[15vw] font-bold uppercase tracking-tighter leading-none flex items-center absolute left-0 top-1/2 -translate-y-1/2"
        >
          <span
            v-for="(char, i) in heroChars"
            :key="i"
            class="hero-char inline-block opacity-0 translate-x-[100vw]"
            :class="char === ' ' ? 'mx-[2vw]' : ''"
          >
            <span class="text-charcoal">
              {{ char }}
            </span>
          </span>
        </h1>
      </div>

      <!-- Content that appears after the text scrolls -->
      <div
        ref="subContent"
        class="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none translate-y-12"
      >
        <div class="text-center max-w-2xl px-6">
          <p
            class="text-saffron uppercase tracking-[0.5em] text-sm font-bold mb-6"
          >
            {{ $t("hero.subtitle") }}
          </p>
          <h2 class="text-4xl md:text-6xl font-bold mb-8 text-charcoal">
            {{ $t("hero.title") }}
          </h2>
        </div>
      </div>

      <div
        ref="scrollIndicator"
        class="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none"
      >
        <div class="relative flex items-center justify-center">
          <!-- Multi-layered Pulsing Rings -->
          <div
            class="w-32 h-32 border border-saffron/30 rounded-full animate-ripple-1 absolute"
          ></div>
          <div
            class="w-32 h-32 border border-saffron/20 rounded-full animate-ripple-2 absolute"
          ></div>
          <div
            class="w-32 h-32 border border-saffron/10 rounded-full animate-ripple-3 absolute"
          ></div>

          <!-- The Focal Point with Logo -->
          <div class="flex flex-col items-center justify-center z-10">
            <img
              src="~/assets/image/Logo1a1a1a.png"
              class="h-16 opacity-90 animate-bounce-subtle"
              alt="Moksha Logo"
            />
          </div>

          <!-- Downward Flow Indicator (Elegant Arrows) -->
          <div
            class="absolute top-[60px] flex flex-col items-center space-y-2 opacity-60"
          >
            <div
              class="w-2.5 h-2.5 border-r-2 border-b-2 border-saffron rotate-45 animate-arrow-flow-1"
            ></div>
            <div
              class="w-2.5 h-2.5 border-r-2 border-b-2 border-saffron rotate-45 animate-arrow-flow-2"
            ></div>
            <div
              class="w-2.5 h-2.5 border-r-2 border-b-2 border-saffron rotate-45 animate-arrow-flow-3"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
const heroSection = ref<any>(null);
const heroContainer = ref<HTMLElement | null>(null);
const textContainer = ref<HTMLElement | null>(null);
const subContent = ref<HTMLElement | null>(null);
const scrollIndicator = ref<HTMLElement | null>(null);

const { locale, t } = useI18n();
const { gsap, ScrollTrigger } = useGsap();

const text = "MOKSHA";
const heroChars = computed(() => text.split(""));

onMounted(() => {
  const triggerElement = heroSection.value?.$el || heroSection.value;
  const chars = document.querySelectorAll(".hero-char");
  if (!chars.length || !triggerElement) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: triggerElement,
      start: "top top",
      end: "+=600%",
      scrub: 1,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
    },
  });

  // The "Track" Animation for each character
  // Path: [Start Right] -> [Center Left] -> [Curve 90 Down] -> [Exit Bottom]

  chars.forEach((char, i) => {
    const charTl = gsap.timeline();

    // 1. Enter from right and move to the "Turn Point"
    charTl.fromTo(
      char,
      {
        opacity: 0,
        x: "100vw",
        y: 0,
        rotate: 0,
      },
      {
        opacity: 1,
        x: "10vw",
        duration: 3,
        ease: "none",
      }
    );

    // 2. The Corner Curve (90 degrees down)
    charTl.to(char, {
      x: "0vw",
      y: "10vh",
      rotate: 90,
      duration: 1,
      ease: "power1.inOut",
    });

    // 3. Exit Downward (Faster exit)
    charTl.to(char, {
      y: "120vh",
      duration: 2,
      ease: "power1.in",
    });

    // Add this character's path to the main timeline with a stagger
    tl.add(charTl, i * 0.12);
  });

  // Reveal sub-content - adjusted timing for much shorter text "Moksha"
  tl.to(
    subContent.value,
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.2,
      ease: "power3.out",
    },
    5
  );

  tl.to(
    scrollIndicator.value,
    {
      opacity: 0,
      scale: 0.5,
      duration: 0.8,
      ease: "power2.inOut",
    },
    0
  );
});
</script>

<style scoped>
@keyframes ripple-1 {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.8);
    opacity: 0;
  }
}
@keyframes ripple-2 {
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  100% {
    transform: scale(2.2);
    opacity: 0;
  }
}
@keyframes ripple-3 {
  0% {
    transform: scale(1);
    opacity: 0.1;
  }
  100% {
    transform: scale(2.6);
    opacity: 0;
  }
}
@keyframes arrow-flow {
  0% {
    transform: translateY(-15px) rotate(45deg);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(15px) rotate(45deg);
    opacity: 0;
  }
}

@keyframes bounce-subtle {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.animate-ripple-1 {
  animation: ripple-1 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
.animate-ripple-2 {
  animation: ripple-2 4s cubic-bezier(0.4, 0, 0.2, 1) infinite 1s;
}
.animate-ripple-3 {
  animation: ripple-3 4s cubic-bezier(0.4, 0, 0.2, 1) infinite 2s;
}

.animate-arrow-flow-1 {
  animation: arrow-flow 2s infinite;
}
.animate-arrow-flow-2 {
  animation: arrow-flow 2s infinite 0.3s;
}
.animate-arrow-flow-3 {
  animation: arrow-flow 2s infinite 0.6s;
}
.animate-arrow-flow-4 {
  animation: arrow-flow 2s infinite 0.9s;
}
.animate-arrow-flow-5 {
  animation: arrow-flow 2s infinite 1.2s;
}

.animate-bounce-subtle {
  animation: bounce-subtle 2s ease-in-out infinite;
}
</style>
