<template>
  <BaseSection
    ref="triggerRef"
    id="portfolio"
    :key="locale"
    theme-color="#FDFBF7"
    class="portfolio-container relative bg-cream"
    :full-width="true"
    padding-class="!py-0 !px-0"
  >
    <!-- Mobile Title - Outside horizontal scroll -->
    <div v-if="isMobile" class="px-6 pt-12 pb-6">
      <h2 ref="headerRef" class="text-4xl font-black text-charcoal">
        {{ $t("sections.portfolio.title") }}
      </h2>
      <div class="mt-4 h-[1px] bg-charcoal/20"></div>
      <div class="mt-3 flex items-center gap-2 text-charcoal/40 text-xs">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
        <span class="uppercase tracking-wider">{{
          $t("sections.portfolio.scroll_hint") || "Swipe to explore"
        }}</span>
      </div>
    </div>

    <div
      class="exhibition-horizontal overflow-hidden flex flex-col justify-center"
      :class="isMobile ? 'min-h-auto pb-12' : 'min-h-screen'"
    >
      <div
        ref="horizontalRef"
        class="flex ps-6 md:ps-20 pe-6 md:pe-0 w-fit items-center"
        :class="
          isMobile
            ? 'mobile-portfolio-scroll gap-6 py-6'
            : 'gap-10 md:gap-20 py-10'
        "
      >
        <!-- Portfolio Title as First Card - Desktop Only -->
        <div
          v-if="!isMobile"
          ref="headerRefDesktop"
          class="w-[80vw] md:w-[65vw] lg:w-[55vw] max-w-[1200px] flex-shrink-0 flex flex-col justify-center min-h-[70vh]"
        >
          <h2
            class="text-6xl md:text-8xl lg:text-9xl font-black text-charcoal intro-reveal relative z-10"
          >
            <span class="overflow-hidden block">
              <span class="inline-block title-line">{{
                $t("sections.portfolio.title")
              }}</span>
            </span>
          </h2>
          <div class="mt-8 h-[1px] bg-charcoal/20 relative z-10"></div>

          <!-- Scroll Hint -->
          <div class="mt-12 flex items-center gap-3 text-charcoal/40">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            <span class="text-sm uppercase tracking-wider">{{
              $t("sections.portfolio.scroll_hint") || "Scroll to explore"
            }}</span>
          </div>
        </div>
        <div
          v-for="(project, idx) in masterpieceSlices"
          :key="project.id"
          class="project-card flex-shrink-0"
          :class="
            isMobile
              ? 'w-[85vw]'
              : 'w-[80vw] md:w-[65vw] lg:w-[55vw] max-w-[1200px]'
          "
          :data-project-id="project.id"
        >
          <div
            class="text-[10px] text-charcoal/30 mb-4 font-mono tracking-[0.3em] uppercase"
          >
            0{{ (idx as number) + 1 }} /
            {{ $t(`sections.portfolio.categories.${project.category}`) }}
          </div>

          <div class="relative mb-8 group/portfolio">
            <UIPortfolioCard
              class="aspect-video cursor-pointer hide-custom-cursor"
              :aria-label="`Portfolio project: ${project.title}`"
              :loading="project.isInView && !project.loaded"
              @click="openPlayer(project, 'desktop', $event)"
            >
              <div class="relative w-full h-full bg-charcoal/5">
                <!-- High-Quality First Frame Poster -->
                <img
                  :src="getPoster(project.id)"
                  class="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000"
                  :class="
                    project.loaded &&
                    (project.loadedMobile || !getMobileVideo(project.id))
                      ? 'opacity-0'
                      : 'opacity-100'
                  "
                  alt=""
                />

                <video
                  v-if="getVideo(project.id) && project.isInView"
                  :src="getVideo(project.id)"
                  :data-vid="`${project.id}-desktop`"
                  class="w-full h-full object-cover transition-all duration-1000 ease-out relative z-20"
                  :class="
                    project.loaded &&
                    (project.loadedMobile || !getMobileVideo(project.id))
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-105'
                  "
                  muted
                  loop
                  playsinline
                  autoplay
                  preload="auto"
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
              class="absolute bottom-[30%] translate-y-1/2 z-20 transition-transform duration-700 cursor-pointer hide-custom-cursor"
              :class="[
                isMobile
                  ? 'w-[20vw] -right-2'
                  : 'w-[15vw] md:w-[12vw] lg:w-[10vw] max-w-[240px]',
                !isMobile &&
                  (isRTL
                    ? '-left-4 md:-left-12 group-hover/portfolio:-translate-x-4'
                    : '-right-4 md:-right-12 group-hover/portfolio:translate-x-4'),
              ]"
              @click="openPlayer(project, 'mobile', $event)"
            >
              <UIPortfolioCard
                class="aspect-[9/19.5]"
                :initial-tilt-x="5"
                :initial-tilt-y="5"
                rounded="rounded-[0.5rem] md:rounded-[0.5rem]"
                :loading="project.isInView && !project.loadedMobile"
              >
                <div class="relative w-full h-full bg-charcoal/5">
                  <!-- Mobile Poster Frame -->
                  <img
                    :src="getMobilePoster(project.id)"
                    class="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000"
                    :class="
                      project.loaded && project.loadedMobile
                        ? 'opacity-0'
                        : 'opacity-100'
                    "
                    alt=""
                  />

                  <video
                    v-if="project.isInView"
                    :src="getMobileVideo(project.id)"
                    :data-vid="`${project.id}-mobile`"
                    class="w-full h-full object-cover transition-all duration-1000 ease-out relative z-20"
                    :class="
                      project.loaded && project.loadedMobile
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-110'
                    "
                    muted
                    loop
                    playsinline
                    preload="auto"
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
          class="flex-shrink-0 flex items-center justify-center relative"
          :class="isMobile ? 'w-[85vw] min-h-[60vh]' : 'w-screen h-[100vh]'"
        >
          <div class="text-center">
            <h4
              class="ready-text text-6xl md:text-[10vw] font-black uppercase mb-8 leading-none pointer-events-none flex items-center justify-center"
            >
              <template v-if="locale === 'ar'">
                <span class="ready-char inline-block" style="--i: 0; --j: 1">
                  {{ $t("sections.portfolio.ready") }}
                </span>
              </template>
              <template v-else>
                <span
                  v-for="(char, i) in $t('sections.portfolio.ready').split('')"
                  :key="i"
                  class="ready-char inline-block"
                  :class="char === ' ' ? 'mx-[2vw]' : ''"
                  :style="`--i: ${i}; --j: ${char === '?' ? 1 : 0}`"
                >
                  {{ char }}
                </span>
              </template>
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
                  >{{ $t("sections.portfolio.start") }}</span
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
                  >{{ $t("sections.portfolio.continue") }}</span
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

    <!-- Full-screen Player -->
    <UIPortfolioPlayer
      :is-open="playerState.isOpen"
      :video-url="playerState.videoUrl"
      :poster-url="playerState.posterUrl"
      :initial-rect="playerState.initialRect"
      :type="playerState.type"
      :current-time="playerState.currentTime"
      @close="closePlayer"
    />
  </BaseSection>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick, computed, watch } from "vue";

const { locale } = useI18n();
const { gsap, ScrollTrigger } = useGsap();
const { registerSection } = useScrollPhasing();

const isRTL = computed(() => locale.value === "ar");
const isMobile = ref(false);

const triggerRef = ref<HTMLElement | null>(null);
const headerRef = ref<HTMLElement | null>(null);
const headerRefDesktop = ref<HTMLElement | null>(null);
const horizontalRef = ref<HTMLElement | null>(null);
const magneticBtn = ref<any>(null);

// Player State
const playerState = ref({
  isOpen: false,
  videoUrl: "",
  posterUrl: "",
  initialRect: null as DOMRect | null,
  type: "desktop" as "desktop" | "mobile",
  currentTime: 0,
});

const openPlayer = (
  project: any,
  type: "desktop" | "mobile",
  event: MouseEvent
) => {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const video = (event.currentTarget as HTMLElement).querySelector(
    "video"
  ) as HTMLVideoElement;

  playerState.value = {
    isOpen: true,
    videoUrl:
      type === "desktop" ? getVideo(project.id) : getMobileVideo(project.id),
    posterUrl:
      type === "desktop" ? getPoster(project.id) : getMobilePoster(project.id),
    initialRect: rect,
    type,
    currentTime: video ? video.currentTime : 0,
  };
};

const closePlayer = () => {
  playerState.value.isOpen = false;
};

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
    category: "architecture",
    loaded: false,
    loadedMobile: false,
    isInView: false,
  },
  {
    id: "gokbey",
    title: "Gökbey",
    category: "mobility",
    loaded: false,
    loadedMobile: false,
    isInView: false,
  },
  {
    id: "illhanlar",
    title: "İlhanlar",
    category: "commerce",
    loaded: false,
    loadedMobile: false,
    isInView: false,
  },
]);

const { getAssetUrl } = useFirebase();
const videoUrls = ref<Record<string, string>>({});

const resolveVideos = async () => {
  for (const project of masterpieceSlices.value) {
    const dUrl = await getAssetUrl(`portfolio/${project.id}.mp4`);
    if (dUrl) videoUrls.value[project.id] = dUrl;
    if (["illhanlar", "gokbey", "emteknik"].includes(project.id)) {
      const mUrl = await getAssetUrl(`portfolio/${project.id}_mobile.mp4`);
      if (mUrl) videoUrls.value[`${project.id}_mobile`] = mUrl;
    }
  }
};

// Synchronization Logic: Watch for both to be ready, then reveal and sync
masterpieceSlices.value.forEach((project) => {
  watch(
    () => [project.loaded, project.loadedMobile, project.isInView],
    ([isLoaded, isMobileLoaded, isInView]) => {
      if (!isInView) return;

      const hasMobile = ["illhanlar", "gokbey", "emteknik"].includes(
        project.id
      );
      const ready = hasMobile ? isLoaded && isMobileLoaded : isLoaded;

      if (ready) {
        nextTick(() => {
          const desktopVid = document.querySelector(
            `video[data-vid="${project.id}-desktop"]`
          ) as HTMLVideoElement;
          const mobileVid = document.querySelector(
            `video[data-vid="${project.id}-mobile"]`
          ) as HTMLVideoElement;

          if (desktopVid) {
            desktopVid.currentTime = 0;
            desktopVid.play().catch(() => {});
          }
          if (mobileVid) {
            mobileVid.currentTime = 0;
            mobileVid.play().catch(() => {});
          }
        });
      }
    }
  );
});

// Handle video events
const handleLoadingState = (project: any, type: "desktop" | "mobile") => {
  if (type === "desktop") project.loaded = true;
  else project.loadedMobile = true;
};

// Store cleanup functions
let intersectionObserver: IntersectionObserver | null = null;
let wheelHandler: EventListener | null = null;
let touchStartHandler: EventListener | null = null;
let touchEndHandler: EventListener | null = null;

onMounted(async () => {
  await nextTick();

  // Check if mobile
  isMobile.value = window.innerWidth < 768;
  window.addEventListener("resize", () => {
    isMobile.value = window.innerWidth < 768;
  });

  // 1. Resolve Firebase video URLs
  resolveVideos();

  // 2. Safety Release: Reveal after 8s if still stuck in view
  masterpieceSlices.value.forEach((project) => {
    watch(
      () => project.isInView,
      (inView) => {
        if (inView) {
          setTimeout(() => {
            if (!project.loaded) {
              project.loaded = true;
              if (["illhanlar", "gokbey", "emteknik"].includes(project.id)) {
                project.loadedMobile = true;
              }
            }
          }, 8000);
        }
      }
    );
  });

  // 3. Intersection Observer: Only load video when card enters viewport
  intersectionObserver = new IntersectionObserver(
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
    intersectionObserver?.observe(el);
  });

  // 4. Wait for layout stabilization before initializing animations
  setTimeout(() => {
    // Header Animation - Desktop only (mobile title is static)
    if (!isMobile.value) {
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
            trigger: headerRefDesktop.value,
            start: "top 85%",
          },
        }
      );
    }

    // Horizontal Scroll Logic - ONLY ON DESKTOP
    if (horizontalRef.value && !isMobile.value) {
      const getScrollAmount = () => {
        if (!horizontalRef.value) return 0;
        return horizontalRef.value.scrollWidth - window.innerWidth;
      };

      // Calculate total distance - movement + hold phase
      const holdDistance = window.innerHeight * 1.5;

      const tl = gsap.timeline({
        scrollTrigger: {
          id: "portfolioTrigger",
          trigger: ".exhibition-horizontal",
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${getScrollAmount() + holdDistance}`,
          invalidateOnRefresh: true,
        },
      });

      const movementDuration = 0.85;

      gsap.set(horizontalRef.value, { x: 0 });

      tl.to(horizontalRef.value, {
        x: () => (isRTL.value ? getScrollAmount() : -getScrollAmount()),
        ease: "none",
        duration: movementDuration,
      });

      tl.to(
        ".ready-text",
        {
          scale: 1,
          color: "#d97706",
          opacity: 1,
          ease: "power2.out",
          duration: 0.2,
        },
        movementDuration - 0.1
      );

      tl.to(
        ".scroll-indicator-outro",
        {
          opacity: 1,
          y: 0,
          duration: 0.1,
          ease: "power2.out",
        },
        movementDuration
      );
    }

    // Register section for tracking
    registerSection({
      id: "portfolio",
      y: () => {
        const st = ScrollTrigger.getById("portfolioTrigger");
        return st ? st.start : 0;
      },
    });
  }, 600);

  // 5. Horizontal scroll support - ONLY on desktop, ONLY when inside portfolio section
  // On mobile, we use native horizontal scroll instead
  const el = document.querySelector(".exhibition-horizontal");
  if (el && !isMobile.value && window.innerWidth >= 768) {
    wheelHandler = (e: Event) => {
      // Double-check we're not on mobile
      if (window.innerWidth < 768) return;

      const wheelEvent = e as WheelEvent;
      // Check if we're actually in the portfolio section
      const st = ScrollTrigger.getById("portfolioTrigger");
      if (!st || !st.isActive) return;

      const isHorizontalIntent =
        Math.abs(wheelEvent.deltaX) > Math.abs(wheelEvent.deltaY) * 1.2 ||
        wheelEvent.shiftKey;

      if (isHorizontalIntent && Math.abs(wheelEvent.deltaX) > 2) {
        const atStart = st.progress <= 0 && wheelEvent.deltaX < 0;
        const atEnd = st.progress >= 1 && wheelEvent.deltaX > 0;
        if (atStart || atEnd) return;

        wheelEvent.preventDefault();
        const scrollAmount = wheelEvent.deltaX * 1.5;
        window.scrollBy(0, scrollAmount);
      }
    };

    el.addEventListener("wheel", wheelHandler as EventListener, {
      passive: false,
    });
  }
});

onUnmounted(() => {
  // Clean up ScrollTriggers
  ScrollTrigger.getById("portfolioTrigger")?.kill();
  ScrollTrigger.getAll().forEach((t: any) => {
    if (t.trigger === headerRef.value || t.trigger === ".title-line") {
      t.kill();
    }
  });

  // Clean up observers and event listeners
  if (intersectionObserver) {
    intersectionObserver.disconnect();
    intersectionObserver = null;
  }

  const el = document.querySelector(".exhibition-horizontal");
  if (el && wheelHandler) {
    el.removeEventListener("wheel", wheelHandler);
    wheelHandler = null;
  }
  if (el && touchStartHandler) {
    el.removeEventListener("touchstart", touchStartHandler);
    touchStartHandler = null;
  }
  if (el && touchEndHandler) {
    el.removeEventListener("touchend", touchEndHandler);
    touchEndHandler = null;
  }
});
</script>

<style scoped>
.portfolio-container {
  overflow-x: hidden;
}

/* Mobile: Allow native horizontal scroll */
@media (max-width: 767px) {
  .exhibition-horizontal {
    overflow-x: auto;
    overflow-y: visible;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
    min-height: auto !important;
  }

  .mobile-portfolio-scroll {
    height: auto;
  }

  /* Hide scrollbar but keep functionality */
  .exhibition-horizontal::-webkit-scrollbar {
    display: none;
  }

  .exhibition-horizontal {
    scrollbar-width: none;
  }
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
