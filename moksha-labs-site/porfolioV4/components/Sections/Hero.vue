<template>
  <BaseSection
    ref="heroSection"
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

      <!-- Content that appears after the text scrolls - Auto scrolls to services -->
      <div
        ref="subContent"
        class="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none translate-y-12"
      >
        <div class="text-center max-w-2xl px-6 relative">
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

      <!-- Interactive Start Button -->
      <div
        ref="scrollIndicator"
        class="absolute inset-0 z-20 flex flex-col items-center justify-center cursor-pointer pointer-events-auto group"
        :class="{ 'hero-mounted': isMounted }"
        @click="playHeroAnimation"
      >
        <div
          class="relative flex items-center justify-center transition-transform duration-500 group-hover:scale-110 active:scale-95"
        >
          <!-- Multi-layered Pulsing Rings (Ambient) -->
          <div
            class="w-32 h-32 border border-saffron/30 rounded-full hero-ripple-1 absolute opacity-0"
          ></div>
          <div
            class="w-32 h-32 border border-saffron/20 rounded-full hero-ripple-2 absolute opacity-0"
          ></div>
          <div
            class="w-32 h-32 border border-saffron/10 rounded-full hero-ripple-3 absolute opacity-0"
          ></div>

          <!-- The Focal Point with Logo (Bobbing on a Lake) -->
          <div
            class="flex flex-col items-center justify-center z-10 hero-float-lake space-y-2"
          >
            <img
              src="~/assets/image/Logo1a1a1a.png"
              class="h-16 hero-logo-entrance"
              alt="Moksha Logo"
            />
            <span
              class="hero-enter-text text-[10px] uppercase font-bold tracking-[0.4em] text-saffron group-hover:text-charcoal transition-colors duration-300"
            >
              {{ $t("hero.enter") }}
            </span>
          </div>
        </div>
      </div>

      <!-- Swallow Ripples (Triggered on Click) -->
      <div
        class="absolute inset-0 pointer-events-none flex items-center justify-center z-10"
      >
        <div
          v-for="i in 3"
          :key="i"
          class="swallow-ripple absolute w-32 h-32 border border-saffron/40 rounded-full opacity-0"
        ></div>
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
const { isHeroAnimationPlaying } = useScrollPhasing();
const { lock: lockScroll, unlock: unlockScroll } = useScrollLock();

const animationState = ref<"start" | "playing" | "complete">("start");
const heroTimeline = shallowRef<gsap.core.Timeline | null>(null);
const isMounted = ref(false);

const startExperience = () => {
  if (animationState.value !== "start") return;
  playHeroAnimation();
};

const text = "MOKSHA";
const heroChars = text.split("");

const playHeroAnimation = () => {
  const tl = heroTimeline.value;
  if (!tl || animationState.value !== "start") return;

  animationState.value = "playing";
  isHeroAnimationPlaying.value = true;

  tl.play();
};

const resetHero = () => {
  if (animationState.value === "start") return;

  const tl = heroTimeline.value;
  if (tl) {
    tl.pause(0); // Reset main timeline to start
  }

  animationState.value = "start";
  isHeroAnimationPlaying.value = false;

  // Reset swallow ripples
  const swallowRipples = document.querySelectorAll(".swallow-ripple");
  if (swallowRipples.length) {
    gsap.set(swallowRipples, { opacity: 0, scale: 1 });
  }

  // Reset visual elements to their initial "Enter Button" state
  if (subContent.value) {
    gsap.set(subContent.value, {
      opacity: 0,
      y: 12,
      scale: 1,
      clearProps: "all",
    });
  }
  if (scrollIndicator.value) {
    gsap.set(scrollIndicator.value, {
      opacity: 1,
      scale: 1,
      clearProps: "pointerEvents",
    });
    scrollIndicator.value.style.pointerEvents = "auto";
  }

  // NEVER re-lock - once user has control, they keep it
};


onMounted(async () => {
  // Clean up any existing ScrollTriggers from hot-reload
  ScrollTrigger.getById("heroTrigger")?.kill();
  ScrollTrigger.getById("heroResetTrigger")?.kill();
  
  // Delay mount flag to allow logo entrance animation to complete first
  await nextTick();
  setTimeout(() => {
    isMounted.value = true;
  }, 1200);

  const triggerElement = heroSection.value?.$el || heroSection.value;
  const chars = document.querySelectorAll(".hero-char");

  // Initial lock - ONLY if we are actually at the top of the page
  if (window.scrollY < 100) {
    lockScroll('hero-initial');
  } else {
    // If we start lower down, ensure Hero is in its completed state
    animationState.value = "complete";
    isHeroAnimationPlaying.value = false;
    unlockScroll('hero-initial');
    if (scrollIndicator.value)
      scrollIndicator.value.style.pointerEvents = "none";
    gsap.set(subContent.value, { opacity: 1, y: 0, scale: 1 });
    gsap.set(".hero-char", { opacity: 1, x: 0, y: 0, rotate: 0 });
  }

  if (!chars.length || !triggerElement) return;

  // 1. Create the master timeline
  const tl = gsap.timeline({
    paused: true,
    onComplete: () => {
      animationState.value = "complete";
      isHeroAnimationPlaying.value = false;
      unlockScroll('hero-initial');
    },
  });
  heroTimeline.value = tl;

  // 2. Swallow Ripples Animation - Only set them up, don't trigger immediate render
  const swallowRipples = document.querySelectorAll(".swallow-ripple");
  swallowRipples.forEach((ripple, i) => {
    const startTime = 0.1 + i * 0.25;
    // We use a to animation with an explicit start state to avoid ghosting
    tl.to(
      ripple,
      {
        opacity: 0.6,
        scale: 1,
        duration: 0.001,
        immediateRender: false,
      },
      startTime
    );
    tl.to(
      ripple,
      {
        scale: 8,
        opacity: 0,
        duration: 2.5,
        ease: "power2.out",
      },
      startTime + 0.001
    );
  });

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
    {
      opacity: 0,
      scale: 0.8,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        if (scrollIndicator.value)
          scrollIndicator.value.style.pointerEvents = "none";
      },
    },
    0
  );

  // 2. Create the ScrollTrigger for pinning - minimal spacing
  ScrollTrigger.create({
    id: "heroTrigger",
    trigger: triggerElement,
    start: "top top",
    end: "+=10%", // Minimal scroll space - just enough to trigger exit
    pin: true,
    pinSpacing: true,
    // No onEnterBack - never re-lock scroll once user has control
  });

  // 3. Create a separate ScrollTrigger for Reset (Ensures it's fully off-screen)
  ScrollTrigger.create({
    id: "heroResetTrigger",
    trigger: triggerElement,
    start: "bottom top", // Fires only when the bottom of Hero passes the top of the viewport
    onLeave: () => {
      if (animationState.value === "complete") {
        resetHero();
      }
    },
  });

  onUnmounted(() => {
    ScrollTrigger.getById("heroTrigger")?.kill();
    ScrollTrigger.getById("heroResetTrigger")?.kill();
    if (heroTimeline.value) {
      heroTimeline.value.kill();
    }
    unlockScroll('hero-initial'); // Clean up on unmount
  });
});
</script>

<style scoped>
@keyframes ripple-1 {
  0% {
    transform: scale(1);
    opacity: 0;
  }
  10% {
    opacity: 0.4;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}
@keyframes ripple-2 {
  0% {
    transform: scale(1);
    opacity: 0;
  }
  10% {
    opacity: 0.2;
  }
  100% {
    transform: scale(3.5);
    opacity: 0;
  }
}
@keyframes ripple-3 {
  0% {
    transform: scale(1);
    opacity: 0;
  }
  10% {
    opacity: 0.1;
  }
  100% {
    transform: scale(4.5);
    opacity: 0;
  }
}

@keyframes float-lake {
  0%,
  100% {
    transform: translateY(0) rotate(-0.5deg);
  }
  50% {
    transform: translateY(12px) rotate(0.5deg);
  }
}

/* Prevent animations from starting until component is mounted */
.hero-ripple-1,
.hero-ripple-2,
.hero-ripple-3,
.hero-float-lake {
  animation-play-state: paused;
}

/* Start animations only when mounted */
.hero-mounted .hero-ripple-1 {
  animation: ripple-1 5.2s cubic-bezier(0.2, 0, 0.3, 1) infinite;
  animation-delay: 2.6s;
  animation-fill-mode: backwards;
  animation-play-state: running;
}
.hero-mounted .hero-ripple-2 {
  animation: ripple-2 5.2s cubic-bezier(0.2, 0, 0.3, 1) infinite 3s;
  animation-fill-mode: backwards;
  animation-play-state: running;
}
.hero-mounted .hero-ripple-3 {
  animation: ripple-3 5.2s cubic-bezier(0.2, 0, 0.3, 1) infinite 3.4s;
  animation-fill-mode: backwards;
  animation-play-state: running;
}

.hero-mounted .hero-float-lake {
  animation: float-lake 5.2s ease-in-out infinite;
  animation-play-state: running;
}

/* Logo entrance - scale in first (independent of hero-mounted) */
.hero-logo-entrance {
  opacity: 0;
  transform: scale(0.5);
  animation: scaleIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s forwards;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 0.9;
    transform: scale(1);
  }
}

/* Graceful fade-in for ENTER text - after logo */
.hero-enter-text {
  opacity: 0;
  animation: fadeInDown 0.8s ease-out 1.2s forwards;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 0.8;
    transform: translateY(0);
  }
}

/* Prevent ripples and float from starting until hero is mounted */
.hero-ripple-1,
.hero-ripple-2,
.hero-ripple-3 {
  opacity: 0 !important;
}
</style>
