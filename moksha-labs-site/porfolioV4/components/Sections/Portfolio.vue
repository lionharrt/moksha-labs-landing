<template>
  <BaseSection
    ref="triggerRef"
    id="portfolio"
    theme-color="#FDFBF7"
    class="portfolio-container relative bg-cream"
    :full-width="true"
    padding-class="!py-0"
  >
    <!-- Section Intro Header -->
    <div
      ref="headerRef"
      class="pt-40 pb-40 text-center max-w-7xl mx-auto px-6 relative z-10 portfolio-header-box"
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

    <!-- THE CINEMATIC FILMSTRIP (Horizontal Side Scroll) -->
    <div
      class="exhibition-horizontal overflow-hidden min-h-screen flex items-center"
    >
      <div
        ref="horizontalRef"
        class="flex gap-20 px-20 py-10 w-fit items-center"
      >
        <div
          v-for="(project, idx) in masterpieceSlices"
          :key="project.id"
          class="project-card w-[80vw] md:w-[65vw] lg:w-[55vw] max-w-[1200px] flex-shrink-0"
        >
          <div
            class="text-[10px] text-charcoal/30 mb-4 font-mono tracking-[0.3em] uppercase"
          >
            0{{ (idx as number) + 1 }} / {{ project.category }}
          </div>

          <UIPortfolioCard
            class="aspect-video mb-8"
            :aria-label="`Portfolio project: ${project.title}`"
          >
            <div class="relative w-full h-full bg-charcoal/5">
              <!-- Loading Spinner / Placeholder -->
              <div
                v-if="!project.loaded"
                class="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
              >
                <div
                  class="w-8 h-8 border-2 border-charcoal/10 border-t-saffron rounded-full animate-spin"
                ></div>
              </div>

              <video
                v-if="getVideo(project.id)"
                :src="getVideo(project.id)"
                class="w-full h-full object-cover transition-all duration-1000 ease-out"
                :class="
                  project.loaded
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-105'
                "
                muted
                loop
                playsinline
                autoplay
                :title="`${project.title} project showcase video`"
                @loadeddata="project.loaded = true"
              ></video>
            </div>
          </UIPortfolioCard>

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
          class="w-[60vw] md:w-[40vw] flex-shrink-0 flex items-center justify-center"
        >
          <div class="text-center">
            <h4
              class="text-6xl md:text-[10vw] font-black text-charcoal/5 uppercase mb-8 leading-none pointer-events-none"
            >
              READY?
            </h4>
            <NuxtLink
              to="#contact"
              ref="magneticBtn"
              class="group relative inline-flex items-center gap-4 px-12 py-6 bg-charcoal text-cream overflow-hidden rounded-full transition-all duration-500 hover:bg-saffron hover:text-charcoal magnetic-btn"
              @mousemove="handleMagnetic"
              @mouseleave="resetMagnetic"
            >
              <span
                class="relative z-10 font-black uppercase tracking-widest text-[12px] pointer-events-none"
                >Start Project</span
              >
              <div
                class="w-2 h-2 bg-saffron rounded-full group-hover:bg-charcoal transition-colors duration-500 pointer-events-none"
              ></div>
            </NuxtLink>
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

// Import video assets from the original folder
const videoModules = import.meta.glob("~/assets/portfolio-pieces/*.mp4", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const getVideo = (name: string) => {
  const match = Object.entries(videoModules).find(([path]) =>
    path.toLowerCase().includes(name.toLowerCase())
  );
  return match ? match[1] : "";
};

const masterpieceSlices = ref([
  {
    id: "emteknik",
    title: "Emteknik",
    category: "Architecture",
    loaded: false,
  },
  {
    id: "gokbey",
    title: "Gökbey",
    category: "Mobility",
    loaded: false,
  },
  {
    id: "illhanlar",
    title: "İlhanlar",
    category: "Commerce",
    loaded: false,
  },
]);

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

    gsap.to(horizontalRef.value, {
      x: -amountToScroll,
      ease: "none",
      scrollTrigger: {
        trigger: ".exhibition-horizontal",
        pin: true,
        scrub: 1,
        start: "top top",
        end: () => "+=" + amountToScroll,
        invalidateOnRefresh: true,
      },
    });
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
</style>
