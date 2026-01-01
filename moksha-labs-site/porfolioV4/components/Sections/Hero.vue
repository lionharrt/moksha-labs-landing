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
      <!-- Horizontal Typography Container - Always LTR for logo -->
      <div
        ref="textContainer"
        class="flex items-center absolute w-full h-full pointer-events-none"
        dir="ltr"
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
        class="absolute inset-0 z-0 flex flex-col items-center justify-center cursor-pointer pointer-events-auto"
        @click="startExperience"
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
            class="absolute top-[70px] flex flex-col items-center space-y-4 opacity-80"
          >
            <span
              class="text-[10px] uppercase font-bold animate-pulse text-saffron"
              :class="locale !== 'ar' ? 'tracking-[0.4em] mr-[-0.4em]' : ''"
            >
              {{ $t("hero.scroll") }}
            </span>
            <div class="flex flex-col items-center gap-2 mt-2">
              <svg
                width="14"
                height="8"
                viewBox="0 0 14 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="animate-arrow-flow-1"
              >
                <path
                  d="M1 1L7 7L13 1"
                  stroke="#E2A04F"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <svg
                width="14"
                height="8"
                viewBox="0 0 14 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="animate-arrow-flow-2"
              >
                <path
                  d="M1 1L7 7L13 1"
                  stroke="#E2A04F"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <svg
                width="14"
                height="8"
                viewBox="0 0 14 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="animate-arrow-flow-3"
              >
                <path
                  d="M1 1L7 7L13 1"
                  stroke="#E2A04F"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
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
const { registerPoint, navigate, isHeroAnimationPlaying } = useScrollPhasing();

const animationState = ref<"start" | "playing" | "complete">("start");
const heroTimeline = ref<gsap.core.Timeline | null>(null);
const isScrollLocked = ref(false);

const startExperience = () => {
  if (animationState.value !== "start") return;
  playHeroAnimation();
};

const text = "MOKSHA";
const heroChars = computed(() => text.split(""));

// Lock/unlock scroll functionality
const lockScroll = () => {
  isScrollLocked.value = true;
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";

  // Stop Lenis if available
  const { $lenis } = useNuxtApp();
  if ($lenis) $lenis.stop();
};

const unlockScroll = () => {
  isScrollLocked.value = false;
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";

  // Start Lenis if available
  const { $lenis } = useNuxtApp();
  if ($lenis) $lenis.start();
};

const playHeroAnimation = () => {
  if (animationState.value !== "start") return;

  const tl = heroTimeline.value;
  if (!tl) return;

  animationState.value = "playing";
  isHeroAnimationPlaying.value = true;

  // Play without locking scroll - let it be a visual flourish
  tl.play();
  tl.eventCallback("onComplete", () => {
    animationState.value = "complete";
    isHeroAnimationPlaying.value = false;
  });
};

const reverseHeroAnimation = () => {
  if (animationState.value !== "complete") return;

  const tl = heroTimeline.value;
  if (!tl) return;

  animationState.value = "start";
  isHeroAnimationPlaying.value = true;

  // Reverse without locking scroll
  tl.reverse();
  tl.eventCallback("onReverseComplete", () => {
    isHeroAnimationPlaying.value = false;
  });
};

onMounted(() => {
  const triggerElement = heroSection.value?.$el || heroSection.value;
  const chars = document.querySelectorAll(".hero-char");
  if (!chars.length || !triggerElement) return;

  // 1. Create the master timeline (NOT scrubbed, plays automatically when triggered)
  const tl = gsap.timeline({
    paused: true,
  });
  heroTimeline.value = tl;

  // The "Track" Animation for each character - with bounce and pause
  chars.forEach((char, i) => {
    const charTl = gsap.timeline();
    // Phase 1: Fly in from right with acceleration
    charTl.fromTo(
      char,
      { opacity: 0, x: "100vw", y: 0, rotate: 0 },
      { opacity: 1, x: "10vw", duration: 1.6, ease: "power2.in" }
    );
    // Phase 2: Hit the wall with bounce
    charTl.to(char, {
      x: "0vw",
      duration: 0.4,
      ease: "back.out(2)", // Bounce effect with overshoot
    });
    // Phase 3: Pause (delay before next action)
    charTl.to(char, {
      x: "0vw", // Stay in place
      duration: 1.0, // 1 second pause
    });
    // Phase 4: Rotate downward
    charTl.to(char, {
      y: "10vh",
      rotate: 90,
      duration: 0.5,
      ease: "power2.inOut",
    });
    // Phase 5: Accelerated fall
    charTl.to(char, { y: "120vh", duration: 0.8, ease: "power2.in" });

    // Smoother cascade - mix of linear and exponential
    tl.add(charTl, i * 0.05 + i * i * 0.008);
  });

  tl.to(
    subContent.value,
    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" },
    4.5
  );
  tl.to(
    scrollIndicator.value,
    { opacity: 0, scale: 0.5, duration: 0.5, ease: "power2.inOut" },
    0
  );

  // 2. Create the ScrollTrigger for pinning - shorter duration
  ScrollTrigger.create({
    id: "heroTrigger",
    trigger: triggerElement,
    start: "top top",
    end: "+=100%", // Just 1 viewport height instead of 2
    pin: true,
    pinSpacing: true,
  });

  // 3. Simple scroll-based animation trigger
  const animationTriggerPoint = 100;
  let lastScrollForDirection = window.scrollY;
  let scrollUpStreak = 0;

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    // Track sustained upward scrolling
    if (currentScrollY < lastScrollForDirection - 5) {
      // Scrolling up
      scrollUpStreak++;
    } else if (currentScrollY > lastScrollForDirection + 5) {
      // Scrolling down
      scrollUpStreak = 0;
    }
    lastScrollForDirection = currentScrollY;

    // Forward: scrolled down past threshold and animation hasn't played yet
    if (
      currentScrollY > animationTriggerPoint &&
      animationState.value === "start"
    ) {
      playHeroAnimation();
    }

    // Reverse: ONLY if sustained upward scrolling (5+ ups) AND at very top
    // This requires deliberate upward navigation back to start
    if (
      currentScrollY < 5 &&
      animationState.value === "complete" &&
      scrollUpStreak >= 5
    ) {
      scrollUpStreak = 0;
      reverseHeroAnimation();
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  // 4. Register Hero snap points
  registerPoint({
    id: "hero-start",
    y: 0,
  });

  registerPoint({
    id: "hero-evolution",
    y: () => {
      const st = ScrollTrigger.getById("heroTrigger");
      return st ? st.end : window.innerHeight * 2;
    },
  });

  onUnmounted(() => {
    ScrollTrigger.getById("heroTrigger")?.kill();
    window.removeEventListener("scroll", handleScroll);
    unlockScroll(); // Clean up on unmount
  });
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
@keyframes arrow-ripple {
  0% {
    transform: translateY(-5px);
    opacity: 0;
  }
  20% {
    transform: translateY(0);
    opacity: 1;
  }
  40% {
    transform: translateY(10px);
    opacity: 0;
  }
  100% {
    transform: translateY(10px);
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
  animation: arrow-ripple 4s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.2s;
}
.animate-arrow-flow-2 {
  animation: arrow-ripple 4s cubic-bezier(0.4, 0, 0.2, 1) infinite 1.2s;
}
.animate-arrow-flow-3 {
  animation: arrow-ripple 4s cubic-bezier(0.4, 0, 0.2, 1) infinite 2.2s;
}

.animate-bounce-subtle {
  animation: bounce-subtle 2s ease-in-out infinite;
}
</style>
