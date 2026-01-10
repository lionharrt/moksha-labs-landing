<template>
  <div class="app-root">
    <FloatingBackground />
    <NavBar :class="{ 'navbar-entrance': !isAppReady }" />
    <CustomCursor />

    <NuxtPage :class="{ 'page-entrance': !isAppReady }" />

    <footer
      class="bg-charcoal text-cream py-10 px-10 text-center border-t border-cream/5 relative z-10"
    >
      <p class="text-[10px] uppercase tracking-[0.5em] opacity-30">
        {{ $t("footer.copyright") }}
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n();
const { initLazyLoad } = usePortfolioAssets();
useThemeTransition(); // Initialize theme transitions

const isAppReady = ref(false);

onMounted(() => {
  // Ensure we always start at the top on refresh
  if (history.scrollRestoration) {
    history.scrollRestoration = "manual";
  }
  window.scrollTo(0, 0);

  const { $lenis } = useNuxtApp() as any;
  if ($lenis) {
    $lenis.scrollTo(0, { immediate: true });
  }

  initLazyLoad();
  
  // Delay navbar entrance until after logo animation (1.2s)
  setTimeout(() => {
    isAppReady.value = true;
  }, 1200);
});

const i18nHead = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: "id",
  addSeoAttributes: true,
});

useHead({
  htmlAttrs: {
    lang: computed(() => i18nHead.value.htmlAttrs?.lang || locale.value),
    dir: computed(() => i18nHead.value.htmlAttrs?.dir || "ltr"),
  },
  link: computed(() => i18nHead.value.link || []),
  meta: computed(() => i18nHead.value.meta || []),
  script: [
    // Organization Schema
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": "https://mokshalabs.ie/#organization",
        name: "Moksha Labs",
        url: "https://mokshalabs.ie",
        logo: {
          "@type": "ImageObject",
          "url": "https://mokshalabs.ie/favicon.png",
          "width": "180",
          "height": "180"
        },
        description: "High-end digital agency specializing in immersive web experiences, cinematic motion design, and luxury brand identity.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Dublin",
          addressCountry: "IE",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "Customer Service",
          availableLanguage: ["English", "Turkish", "Italian", "Arabic"],
        },
        sameAs: [
          "https://www.instagram.com/mokshalabs",
          "https://www.linkedin.com/company/moksha-labs",
        ],
      }),
    },
    // WebSite Schema with SearchAction for AEO
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://mokshalabs.ie/#website",
        url: "https://mokshalabs.ie",
        name: "Moksha Labs",
        description: "Crafting high-end digital experiences for the modern era.",
        publisher: {
          "@id": "https://mokshalabs.ie/#organization",
        },
        inLanguage: ["en-US", "tr-TR", "it-IT", "ar-SA"],
      }),
    },
    // ProfessionalService Schema
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "@id": "https://mokshalabs.ie/#service",
        name: "Moksha Labs",
        image: "https://mokshalabs.ie/og-image.jpg",
        url: "https://mokshalabs.ie",
        priceRange: "€€€",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Dublin",
          addressCountry: "IE",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 53.3498,
          longitude: -6.2603,
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "00:00",
          closes: "23:59",
        },
        areaServed: {
          "@type": "Country",
          name: ["Ireland", "United Kingdom", "Europe", "Turkey", "Middle East"],
        },
        serviceType: [
          "Web Design & Development",
          "Brand Identity Design",
          "Digital Transformation",
          "Social Media Marketing",
          "SEO & Digital Marketing",
          "Motion Design",
        ],
      }),
    },
  ],
});
</script>

<style>
/* Any global app styles */
.app-root {
  @apply relative;
}

/* Smooth entrance animations - SEO friendly (content in DOM) */
.navbar-entrance {
  opacity: 0;
  transform: translateY(-30px);
}

.page-entrance {
  opacity: 0;
}

.page-entrance > * {
  opacity: 0;
}

/* Only hide non-hero sections initially */
.page-entrance > *:not(#hero) {
  visibility: hidden;
}

/* Navbar descends when ready */
.navbar-entrance {
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.navbar-entrance:not(.navbar-entrance) {
  opacity: 1;
  transform: translateY(0);
}
</style>
