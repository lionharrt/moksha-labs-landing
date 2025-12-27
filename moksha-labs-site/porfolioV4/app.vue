<template>
  <div class="app-root">
    <FloatingBackground />
    <NavBar />
    <CustomCursor />

    <NuxtPage />

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
const { refreshTheme } = useThemeTransition();

onMounted(() => {
  initLazyLoad();
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
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: "Moksha Labs",
        image: "https://mokshalabs.ie/favicon.png",
        "@id": "https://mokshalabs.ie",
        url: "https://mokshalabs.ie",
        telephone: "",
        address: {
          "@type": "PostalAddress",
          streetAddress: "",
          addressLocality: "Dublin",
          postalCode: "",
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
        sameAs: [
          "https://www.instagram.com/mokshalabs",
          "https://www.linkedin.com/company/moksha-labs",
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
</style>
