<template>
  <nav
    ref="navRef"
    class="fixed top-0 left-0 w-full z-[100] flex justify-between items-center py-8 px-10 transition-all duration-300 md:mix-blend-difference"
    :class="{ 'navbar-scrolled': isScrolled }"
  >
    <!-- Logo -->
    <NuxtLink
      :to="localePath('/')"
      class="text-2xl font-bold uppercase tracking-tighter no-cursor-scale transition-colors duration-300 text-charcoal md:text-white"
    >
      Moksha<span class="italic font-serif">Labs</span>
    </NuxtLink>

    <!-- Desktop Navigation -->
    <div class="hidden md:flex gap-10 items-center">
      <div class="flex gap-8 items-center">
        <button
          v-for="link in navLinks"
          :key="link.key"
          @click="scrollTo(link.href)"
          class="nav-link text-white/70 hover:text-white uppercase tracking-widest text-[10px] font-bold transition-colors whitespace-nowrap min-w-fit"
        >
          {{ $t(`nav.${link.key}`) }}
        </button>
      </div>

      <!-- Redesigned Language Switcher -->
      <div
        class="relative flex items-center border-s border-white/10 ps-10"
        @mouseenter="openPicker"
        @mouseleave="closePicker"
      >
        <div
          ref="pickerContainer"
          class="flex items-center gap-4 overflow-hidden"
          style="width: 40px"
        >
          <!-- Current Locale (Always Visible) -->
          <div
            class="text-[10px] font-bold uppercase tracking-widest text-blue-500 whitespace-nowrap cursor-pointer min-w-[25px]"
          >
            {{ locale }}
          </div>

          <!-- Other Locales (Animate In/Out) -->
          <div ref="otherLocales" class="flex items-center gap-4 opacity-0">
            <NuxtLink
              v-for="loc in availableLocales"
              :key="loc.code"
              :to="switchLocalePath(loc.code)"
              class="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors whitespace-nowrap"
            >
              {{ loc.code }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- CTA Button -->
      <button
        @click="prefillAndScroll($t('nav.start_project'))"
        class="relative overflow-hidden group/btn bg-white text-black px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 active:scale-90 active:bg-saffron/20"
      >
        <span
          class="relative z-10 group-hover/btn:text-white transition-colors duration-500 pointer-events-none"
        >
          {{ $t("nav.start_project") }}
        </span>
        <div
          class="absolute inset-0 bg-saffron translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 pointer-events-none"
        ></div>
      </button>
    </div>

    <!-- Mobile Menu Toggle -->
    <button
      @click="isMenuOpen = !isMenuOpen"
      class="md:hidden no-cursor-scale relative z-[110] transition-colors duration-300 text-charcoal"
    >
      <Menu v-if="!isMenuOpen" :size="24" />
      <X v-else :size="24" />
    </button>

    <!-- Mobile Menu Overlay - Full Screen Blur -->
    <Teleport to="body">
      <Transition name="mobile-fade">
        <div v-if="isMenuOpen" class="mobile-menu-overlay">
          <!-- Close Button -->
          <button
            @click="isMenuOpen = false"
            class="absolute top-8 right-8 text-white/70 hover:text-white transition-colors p-2"
            aria-label="Close menu"
          >
            <X :size="32" stroke-width="1.5" />
          </button>

          <div class="flex flex-col gap-8 items-center">
            <button
              v-for="link in navLinks"
              :key="link.key"
              @click="scrollToMobile(link.href)"
              class="text-white text-2xl font-bold uppercase tracking-widest hover:text-saffron transition-colors"
            >
              {{ $t(`nav.${link.key}`) }}
            </button>

            <div class="h-[1px] w-20 bg-white/10 my-4"></div>

            <div class="flex gap-6">
              <NuxtLink
                v-for="loc in locales"
                :key="loc.code"
                :to="switchLocalePath(loc.code)"
                class="text-sm font-bold uppercase tracking-widest transition-colors"
                :class="
                  locale === loc.code
                    ? 'text-saffron'
                    : 'text-white/40 hover:text-white'
                "
                @click="isMenuOpen = false"
              >
                {{ loc.code }}
              </NuxtLink>
            </div>

            <button
              @click="prefillAndScrollMobile($t('nav.start_project'))"
              class="mt-8 bg-white text-black px-10 py-4 rounded-full text-sm font-bold uppercase tracking-widest active:scale-95 transition-transform"
            >
              {{ $t("nav.start_project") }}
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </nav>
</template>

<script setup lang="ts">
import { Menu, X } from "lucide-vue-next";
import { watch, onUnmounted } from "vue";

const { prefillAndScroll } = useContactForm();
const { locale, locales, t } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const localePath = useLocalePath();
const { gsap } = useGsap();
const { unlock: unlockScroll } = useScrollLock();

const isMenuOpen = ref(false);
const isScrolled = ref(false);
const navRef = ref<HTMLElement | null>(null);

// Track scroll position for mobile navbar blur ONLY
// Don't use this for desktop - let mix-blend-difference handle it
if (import.meta.client) {
  onMounted(() => {
    const handleScroll = () => {
      // Only apply scrolled state on mobile for the blur effect
      isScrolled.value = window.innerWidth < 768 && window.scrollY > 50;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    onUnmounted(() => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    });
  });
}

// Lock/unlock body scroll when menu opens/closes
watch(isMenuOpen, (newVal) => {
  if (import.meta.client) {
    if (newVal) {
      // Lock scroll
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      // Unlock scroll
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
  }
});

// Cleanup on unmount
onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }
});

const scrollTo = (href: string) => {
  // Force unlock scroll in case hero has it locked
  const { forceUnlock } = useScrollLock();
  forceUnlock();

  // Now Lenis is started and scroll is enabled - navigate immediately
  const { $lenis } = useNuxtApp() as any;
  if ($lenis) {
    $lenis.scrollTo(href, {
      duration: 1.5,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else {
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  }
};

const scrollToMobile = (href: string) => {
  isMenuOpen.value = false;
  setTimeout(() => {
    scrollTo(href);
  }, 300);
};

const prefillAndScrollMobile = (msg: string) => {
  isMenuOpen.value = false;
  setTimeout(() => {
    const { $lenis } = useNuxtApp() as any;
    const contactEl = document.querySelector("#contact");

    if (!contactEl) return;

    // Calculate the top position of the contact section
    const rect = contactEl.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetPosition = rect.top + scrollTop; //

    if ($lenis) {
      $lenis.scrollTo(targetPosition, {
        duration: 1.5,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  }, 400);
};

const navLinks = [
  { href: "#services", key: "services" },
  { href: "#pricing", key: "pricing" },
  { href: "#portfolio", key: "portfolio" },
  { href: "#team", key: "team" },
  { href: "#contact", key: "contact" },
];

const availableLocales = computed(() => {
  return locales.value.filter((loc: any) => loc.code !== locale.value);
});

const pickerContainer = ref<HTMLElement | null>(null);
const otherLocales = ref<HTMLElement | null>(null);

const openPicker = () => {
  if (!pickerContainer.value || !otherLocales.value) return;

  gsap.to(pickerContainer.value, {
    width: "auto",
    duration: 0.5,
    ease: "expo.out",
  });

  gsap.to(otherLocales.value, {
    opacity: 1,
    x: 0,
    duration: 0.4,
    delay: 0.1,
    ease: "power2.out",
  });
};

const closePicker = () => {
  if (!pickerContainer.value || !otherLocales.value) return;

  gsap.to(otherLocales.value, {
    opacity: 0,
    duration: 0.3,
    ease: "power2.in",
  });

  gsap.to(pickerContainer.value, {
    width: 40,
    duration: 0.5,
    delay: 0.1,
    ease: "expo.inOut",
  });
};
</script>

<style scoped>
/* Navbar blur effect on mobile when scrolled */
.navbar-scrolled {
  background: rgba(253, 251, 247, 0.85);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  backdrop-filter: blur(20px) saturate(180%);
  box-shadow: 0 1px 0 rgba(26, 26, 26, 0.05);
}

/* Mobile-specific: remove mix-blend-difference and apply normal blend */
@media (max-width: 767px) {
  nav {
    mix-blend-mode: normal !important;
  }
}

/* Desktop: Keep navbar transparent and let mix-blend-difference work */
@media (min-width: 768px) {
  .navbar-scrolled {
    background: transparent;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    box-shadow: none;
  }
}

/* Prevent Arabic navigation links from trying to uppercase (no-op but safer) 
   while allowing language codes (EN, TR, etc.) to remain uppercase */
:deep([dir="rtl"]) .nav-link {
  text-transform: none;
}

/* Mobile Menu Overlay - Full Screen Frosted Glass */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem;
  background: rgba(26, 26, 26, 0.85);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  backdrop-filter: blur(40px) saturate(180%);
}

/* Force backdrop blur on all browsers */
@supports (backdrop-filter: blur(1px)) {
  .mobile-menu-overlay {
    backdrop-filter: blur(40px) saturate(180%) brightness(0.8);
  }
}

@supports (-webkit-backdrop-filter: blur(1px)) {
  .mobile-menu-overlay {
    -webkit-backdrop-filter: blur(40px) saturate(180%) brightness(0.8);
    backdrop-filter: blur(40px) saturate(180%) brightness(0.8);
  }
}

/* Hide on desktop */
@media (min-width: 768px) {
  .mobile-menu-overlay {
    display: none;
  }
}

/* Mobile Menu Transitions */
.mobile-fade-enter-active,
.mobile-fade-leave-active {
  transition: opacity 0.4s ease;
}

.mobile-fade-enter-from,
.mobile-fade-leave-to {
  opacity: 0;
}
</style>
