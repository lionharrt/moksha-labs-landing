<template>
  <nav
    class="fixed top-0 left-0 w-full z-50 flex justify-between items-center py-8 px-10 mix-blend-difference"
  >
    <!-- Logo -->
    <NuxtLink
      :to="localePath('/')"
      class="text-2xl font-bold text-white uppercase tracking-tighter no-cursor-scale"
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
            class="text-[10px] font-bold uppercase tracking-widest text-saffron whitespace-nowrap cursor-pointer min-w-[25px]"
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
      class="md:hidden text-white no-cursor-scale relative z-[60]"
    >
      <Menu v-if="!isMenuOpen" :size="24" />
      <X v-else :size="24" />
    </button>

    <!-- Mobile Menu Overlay -->
    <Transition name="fade">
      <div 
        v-if="isMenuOpen"
        class="fixed inset-0 bg-charcoal/80 backdrop-blur-xl z-[55] flex flex-col items-center justify-center p-10 md:hidden"
      >
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
              :class="locale === loc.code ? 'text-saffron' : 'text-white/40 hover:text-white'"
              @click="isMenuOpen = false"
            >
              {{ loc.code }}
            </NuxtLink>
          </div>

          <button
            @click="prefillAndScrollMobile($t('nav.start_project'))"
            class="mt-8 bg-white text-black px-10 py-4 rounded-full text-sm font-bold uppercase tracking-widest"
          >
            {{ $t("nav.start_project") }}
          </button>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { Menu, X } from "lucide-vue-next";

const { prefillAndScroll } = useContactForm();
const { locale, locales, t } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const localePath = useLocalePath();
const { gsap } = useGsap();

const isMenuOpen = ref(false);

const scrollTo = (href: string) => {
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
    prefillAndScroll(msg);
  }, 300);
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
/* Prevent Arabic navigation links from trying to uppercase (no-op but safer) 
   while allowing language codes (EN, TR, etc.) to remain uppercase */
:deep([dir="rtl"]) .nav-link {
  text-transform: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
