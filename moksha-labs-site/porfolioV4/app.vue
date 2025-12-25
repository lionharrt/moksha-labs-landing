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
});
</script>

<style>
/* Any global app styles */
.app-root {
  @apply relative;
}
</style>
