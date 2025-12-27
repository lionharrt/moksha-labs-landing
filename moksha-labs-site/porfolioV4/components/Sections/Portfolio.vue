<template>
  <BaseSection
    ref="triggerRef"
    id="portfolio"
    theme-color="#FDFBF7"
    class="portfolio-container relative bg-cream"
    :full-width="true"
    padding-class="!py-0 !px-0"
  >
    <!-- Section Intro Header -->
    <div
      ref="headerRef"
      class="pt-24 pb-12 md:pt-40 md:pb-40 text-center max-w-7xl mx-auto px-6 relative z-10 portfolio-header-box"
    >
      <h2
        class="text-6xl md:text-8xl font-black text-charcoal intro-reveal flex flex-col items-center"
      >
        <span class="overflow-hidden">
          <span class="inline-block title-line">{{
            $t("sections.portfolio.title")
          }}</span>
        </span>
      </h2>
      <div class="mt-8 flex justify-center items-center gap-4">
        <div class="h-[1px] w-20 bg-charcoal/20"></div>
        <p
          class="text-saffron font-medium tracking-[0.3em] uppercase text-sm italic"
        >
          {{ $t("sections.portfolio.subtitle") }}
        </p>
        <div class="h-[1px] w-20 bg-charcoal/20"></div>
      </div>
    </div>

    <div
      class="exhibition-horizontal overflow-hidden min-h-screen flex items-center"
    >
      <div
        ref="horizontalRef"
        class="flex gap-10 md:gap-20 pl-6 md:pl-20 pr-0 py-10 w-fit items-center"
      >
        <div
          v-for="(project, idx) in masterpieceSlices"
          :key="project.id"
          class="project-card w-[80vw] md:w-[65vw] lg:w-[55vw] max-w-[1200px] flex-shrink-0"
          :data-project-id="project.id"
        >
          <div
            class="text-[10px] text-charcoal/30 mb-4 font-mono tracking-[0.3em] uppercase"
          >
            0{{ (idx as number) + 1 }} / {{ project.category }}
          </div>

          <div class="relative mb-8 group/portfolio">
            <UIPortfolioCard
              class="aspect-video"
              :aria-label="`Portfolio project: ${project.title}`"
              :loading="project.isInView && !project.loaded"
            >
              <div class="relative w-full h-full bg-charcoal/5">
                <!-- High-Quality First Frame Poster -->
                <img
                  :src="getPoster(project.id)"
                  class="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000"
                  :class="project.loaded ? 'opacity-0' : 'opacity-100'"
                  alt=""
                />

                <video
                  v-if="getVideo(project.id) && project.isInView"
                  :src="getVideo(project.id)"
                  class="w-full h-full object-cover transition-all duration-1000 ease-out relative z-20"
                  :class="
                    project.loaded
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-105'
                  "
                  muted
                  loop
                  playsinline
                  autoplay
                  preload="none"
                  :title="`${project.title} project showcase video`"
                  @loadeddata="handleLoadingState(project, 'desktop')"
                  @canplay="handleLoadingState(project, 'desktop')"
                  @playing="handleLoadingState(project, 'desktop')"
                ></video>
              </div>
            </UIPortfolioCard>

            <!-- Overlapping Phone Panel (Only shows if mobile video exists) -->
            <div
              v-if="getMobileVideo(project.id)"
              class="absolute -right-4 md:-right-12 bottom-[30%] translate-y-1/2 w-[15vw] md:w-[12vw] lg:w-[10vw] max-w-[240px] z-20 transition-transform duration-700 group-hover/portfolio:translate-x-4"
            >
              <UIPortfolioCard
                class="aspect-[9/19.5]"
                :initial-tilt-x="5"
                :initial-tilt-y="5"
                :loading="project.isInView && !project.loadedMobile"
              >
                <div class="relative w-full h-full bg-charcoal/5">
                  <!-- Mobile Poster Frame -->
                  <img
                    :src="getMobilePoster(project.id)"
                    class="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000"
                    :class="project.loadedMobile ? 'opacity-0' : 'opacity-100'"
                    alt=""
                  />

                  <video
                    v-if="project.isInView"
                    :src="getMobileVideo(project.id)"
                    class="w-full h-full object-cover transition-all duration-1000 ease-out relative z-20"
                    :class="
                      project.loadedMobile
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-110'
                    "
                    muted
                    loop
                    playsinline
                    autoplay
                    preload="none"
                    @loadeddata="handleLoadingState(project, 'mobile')"
                    @canplay="handleLoadingState(project, 'mobile')"
                    @playing="handleLoadingState(project, 'mobile')"
                  ></video>
                </div>
              </UIPortfolioCard>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <h3
              class="text-[10vw] md:text-[7vw] lg:text-[5vw] font-black uppercase text-charcoal leading-none tracking-tighter whitespace-nowrap"
            >
              {{ project.title }}
            </h3>
            <div
              class="h-[1px] w-[30vw] bg-charcoal/10 mt-4 hidden md:block"
            ></div>
          </div>
        </div>

        <!-- Final Cinematic Outro -->
        <div
          class="w-screen h-[100vh] flex-shrink-0 flex items-center justify-center relative"
        >
          <div class="text-center">
            <h4
              class="ready-text text-6xl md:text-[10vw] font-black uppercase mb-8 leading-none pointer-events-none flex items-center justify-center"
            >
              <span class="ready-char inline-block" style="--i: 0; --j: 0"
                >R</span
              >
              <span class="ready-char inline-block" style="--i: 1; --j: 0"
                >E</span
              >
              <span class="ready-char inline-block" style="--i: 2; --j: 0"
                >A</span
              >
              <span class="ready-char inline-block" style="--i: 3; --j: 0"
                >D</span
              >
              <span class="ready-char inline-block" style="--i: 4; --j: 0"
                >Y</span
              >
              <span
                class="ready-char inline-block ml-[1vw]"
                style="--i: 5; --j: 1"
                >?</span
              >
            </h4>
            <div class="flex flex-col items-center gap-12">
              <NuxtLink
                to="#contact"
                ref="magneticBtn"
                class="group relative inline-flex items-center gap-4 px-8 py-4 md:px-12 md:py-6 bg-charcoal text-cream overflow-hidden rounded-full transition-all duration-500 hover:bg-saffron hover:text-charcoal magnetic-btn"
                @mousemove="handleMagnetic"
                @mouseleave="resetMagnetic"
              >
                <span
                  class="relative z-10 font-black uppercase tracking-widest text-[10px] md:text-[12px] pointer-events-none"
                  >Start Project</span
                >
                <div
                  class="w-2 h-2 bg-saffron rounded-full group-hover:bg-charcoal transition-colors duration-500 pointer-events-none"
                ></div>
              </NuxtLink>
            </div>
          </div>

          <!-- Hero-style Scroll Indicator (Absolute Positioned) -->
          <div
            class="scroll-indicator-outro absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-0 translate-y-4 transition-all duration-1000"
          >
            <div class="relative flex items-center justify-center h-28 w-28">
              <!-- Multi-layered Pulsing Rings -->
              <div
                class="w-full h-full border border-saffron/30 rounded-full animate-ripple-1 absolute"
              ></div>
              <div
                class="w-full h-full border border-saffron/20 rounded-full animate-ripple-2 absolute"
              ></div>
              <div
                class="w-full h-full border border-saffron/10 rounded-full animate-ripple-3 absolute"
              ></div>

              <!-- Center Content -->
              <div class="flex flex-col items-center justify-center z-10">
                <span
                  class="text-[9px] uppercase tracking-[0.5em] text-charcoal font-black mb-2"
                  >continue</span
                >
                <div class="flex flex-col items-center space-y-1 opacity-60">
                  <div
                    class="w-1.5 h-1.5 border-r border-b border-saffron rotate-45 animate-arrow-flow-1"
                  ></div>
                  <div
                    class="w-1.5 h-1.5 border-r border-b border-saffron rotate-45 animate-arrow-flow-2"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick } from "vue";

const { gsap, ScrollTrigger } = useGsap();

const triggerRef = ref<HTMLElement | null>(null);
const headerRef = ref<HTMLElement | null>(null);
const horizontalRef = ref<HTMLElement | null>(null);
const magneticBtn = ref<any>(null);

// Magnetic Button Logic
const handleMagnetic = (e: MouseEvent) => {
  if (!magneticBtn.value) return;
  const btn = magneticBtn.value.$el || magneticBtn.value;
  const rect = btn.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;

  gsap.to(btn, {
    x: x * 0.3,
    y: y * 0.3,
    duration: 0.4,
    ease: "power2.out",
  });
};

const resetMagnetic = () => {
  if (!magneticBtn.value) return;
  const btn = magneticBtn.value.$el || magneticBtn.value;
  gsap.to(btn, {
    x: 0,
    y: 0,
    duration: 0.6,
    ease: "elastic.out(1, 0.3)",
  });
};

// Static video paths from the public/videos folder
const getVideo = (id: string) => videoUrls.value[id] || "";
const getMobileVideo = (id: string) => videoUrls.value[`${id}_mobile`] || "";

const getPoster = (id: string) => `/portfolio-posters/${id}.jpg`;
const getMobilePoster = (id: string) => `/portfolio-posters/${id}_mobile.jpg`;

const masterpieceSlices = ref([
  {
    id: "emteknik",
    title: "Emteknik",
    category: "Architecture",
    loaded: false,
    loadedMobile: false,
    isInView: false, // New: Visibility tracking
  },
  {
    id: "gokbey",
    title: "Gökbey",
    category: "Mobility",
    loaded: false,
    loadedMobile: false,
    isInView: false, // New: Visibility tracking
  },
  {
    id: "illhanlar",
    title: "İlhanlar",
    category: "Commerce",
    loaded: false,
    loadedMobile: false,
    isInView: false, // New: Visibility tracking
  },
]);

const { getAssetUrl } = useFirebase();
const videoUrls = ref<Record<string, string>>({});

const resolveVideos = async () => {
  for (const project of masterpieceSlices.value) {
    const dUrl = await getAssetUrl(`portfolio/${project.id}.mp4`);
    if (dUrl) videoUrls.value[project.id] = dUrl;
    if (["illhanlar", "gokbey"].includes(project.id)) {
      const mUrl = await getAssetUrl(`portfolio/${project.id}_mobile.mp4`);
      if (mUrl) videoUrls.value[`${project.id}_mobile`] = mUrl;
    }
  }
};

// Safety: Mark as loaded if event doesn't fire
const handleLoadingState = (project: any, type: "desktop" | "mobile") => {
  if (type === "desktop") project.loaded = true;
  else project.loadedMobile = true;
};

onMounted(() => {
  resolveVideos();
  // 1. Safety Release
  masterpieceSlices.value.forEach((project) => {
    setTimeout(() => {
      project.loaded = true;
      if (["illhanlar", "gokbey"].includes(project.id)) project.loadedMobile = true;
    }, 8000);
  });

  // 2. Intersection Observer: Only load video when card enters viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("data-project-id");
          const project = masterpieceSlices.value.find((p) => p.id === id);
          if (project) project.isInView = true;
        }
      });
    },
    { threshold: 0.1, rootMargin: "200px" }
  );

  document.querySelectorAll(".project-card").forEach((el) => {
    observer.observe(el);
  });
});

const initExhibitionAnimations = () => {
  if (!import.meta.client) return;

  // Kill existing to avoid duplicates
  ScrollTrigger.getAll().forEach((t: any) => {
    if (
      t.trigger === ".exhibition-horizontal" ||
      t.trigger === headerRef.value
    ) {
      t.kill();
    }
  });

  // 1. Header Animation
  gsap.fromTo(
    ".title-line",
    { y: 100, rotate: 2, opacity: 0 },
    {
      y: 0,
      rotate: 0,
      opacity: 1,
      duration: 1.5,
      ease: "expo.out",
      scrollTrigger: {
        trigger: headerRef.value,
        start: "top 85%",
      },
    }
  );

  // 2. Horizontal Scroll Logic
  if (horizontalRef.value) {
    const scrollWidth = horizontalRef.value.scrollWidth;
    const amountToScroll = scrollWidth - window.innerWidth;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".exhibition-horizontal",
        pin: true,
        scrub: 1,
        start: "top top",
        end: () => "+=" + (amountToScroll + window.innerHeight),
        invalidateOnRefresh: true,
      },
    });

    // We want the horizontal scroll to take up most of the pinning distance,
    // but leave some "hold" at the end so the user can actually see the full screen Ready section.
    const scrollDuration =
      amountToScroll / (amountToScroll + window.innerHeight);

    tl.to(horizontalRef.value, {
      x: -amountToScroll,
      ease: "none",
      duration: scrollDuration,
    });

    // Variable weight morph animation for the "READY?" text
    // We delay the start so it happens primarily while the section is centering
    // and finishing slightly into the "hold" phase for maximum impact.
    const readySectionRatio =
      window.innerWidth / (amountToScroll + window.innerHeight);

    // Start when the section is 50% visible on screen
    const startPoint = scrollDuration - readySectionRatio * 0.5;
    // End a bit after it has become full screen (during the pinned "hold" phase)
    const animDuration = readySectionRatio * 0.8;

    tl.to(
      ".ready-text",
      {
        scale: 1,
        color: "#d97706",
        opacity: 1,
        ease: "power2.out",
        duration: animDuration,
      },
      startPoint
    );

    // Reveal the scroll indicator slightly after the text starts morphing
    tl.to(
      ".scroll-indicator-outro",
      {
        opacity: 1,
        y: 0,
        duration: animDuration * 0.5,
        ease: "power2.out",
      },
      startPoint + animDuration * 0.3
    );
  }

  // CRITICAL: Force a total recalculation of the page height
  // and all subsequent section trigger positions.
  ScrollTrigger.refresh();
  window.dispatchEvent(new CustomEvent("refresh-theme"));
};

onMounted(async () => {
  await nextTick();
  setTimeout(() => {
    initExhibitionAnimations();
  }, 400);
});

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((t: any) => t.kill());
});
</script>

<style scoped>
.portfolio-container {
  overflow-x: hidden;
}

.title-line {
  will-change: transform, opacity;
}

.intro-reveal {
  perspective: 1000px;
}

.magnetic-btn {
  will-change: transform;
}

.ready-text {
  color: #363636;
  opacity: 0.1;
  letter-spacing: 0.1em;
  transform: scale(0.95);
  transition: color 0.3s ease, opacity 0.3s ease;
}

.ready-char {
  display: inline-block;
  will-change: transform;
  animation: wave-action 4s infinite;
  animation-delay: calc(var(--i) * 0.1s);
  transform-origin: bottom;
}

@keyframes wave-action {
  0%,
  10%,
  70%,
  100% {
    transform: translateY(0) scaleY(1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  /* Tension Phase (All letters + ?) */
  15% {
    transform: translateY(0) scaleY(0.7);
    animation-timing-function: cubic-bezier(0.75, 0, 0.5, 1);
  }
  /* Release Phase (Only ? uses --j: 1 to jump) */
  25% {
    transform: translateY(calc(-2.5vw * var(--j)))
      scaleY(calc(1 + (0.2 * var(--j))));
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  35% {
    transform: translateY(0) scaleY(calc(1 - (0.2 * var(--j))));
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  /* Dun-Dun-Dun Bounces (Only ? has height because of --j) */
  45% {
    transform: translateY(calc(-1vw * var(--j)))
      scaleY(calc(1 + (0.05 * var(--j))));
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  52% {
    transform: translateY(0) scaleY(calc(1 - (0.08 * var(--j))));
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  60% {
    transform: translateY(calc(-0.4vw * var(--j)))
      scaleY(calc(1 + (0.02 * var(--j))));
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  66% {
    transform: translateY(0) scaleY(calc(1 - (0.02 * var(--j))));
  }
}

/* Hero-style Scroll Indicator Animations */
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
    transform: translateY(-8px) rotate(45deg);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(8px) rotate(45deg);
    opacity: 0;
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
</style>
