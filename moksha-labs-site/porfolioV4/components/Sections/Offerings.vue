<template>
  <BaseSection theme-color="#FDFBF7" id="offerings" class="!py-0">
    <div class="max-w-6xl mx-auto px-6 py-32 border-t border-charcoal/5">
      <div class="text-center mb-16">
        <h2 class="text-5xl font-bold mb-4">
          {{ $t("sections.offerings.title") }}
        </h2>
        <p class="text-charcoal/60 uppercase tracking-widest text-sm">
          {{ $t("sections.offerings.subtitle") }}
        </p>
      </div>

      <div class="space-y-4">
        <div
          v-for="(category, index) in offeringsList"
          :key="index"
          class="offering-row border-b border-charcoal/10 overflow-hidden"
          @mouseenter="hovered = index"
          @mouseleave="hovered = null"
        >
          <!-- Category Header -->
          <div
            class="flex justify-between items-center py-10 cursor-pointer group transition-all duration-500"
            @click="toggle(index)"
          >
            <div class="flex items-baseline gap-8">
              <span class="text-xs font-serif italic text-saffron/40"
                >0{{ index + 1 }}</span
              >
              <h3
                class="text-4xl md:text-6xl font-serif transition-transform duration-500 group-hover:translate-x-4"
              >
                {{ category.title }}
              </h3>
            </div>
            <div class="relative w-10 h-10 flex items-center justify-center">
              <div class="absolute w-full h-[1px] bg-charcoal"></div>
              <div
                class="absolute w-[1px] h-full bg-charcoal transition-transform duration-500"
                :class="active === index ? 'rotate-90 opacity-0' : 'rotate-0'"
              ></div>
            </div>
          </div>

          <!-- Content Drawer -->
          <div
            :ref="(el) => setDrawerRef(el, index)"
            class="drawer-content h-0 opacity-0 invisible"
          >
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20 pt-4">
              <div
                v-for="(item, i) in category.items"
                :key="i"
                class="p-8 bg-cream-dark/50 rounded-3xl border border-charcoal/5 group/card hover:border-saffron/20 transition-all duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_50px_rgba(226,160,79,0.05)]"
              >
                <h4 class="text-xl font-bold mb-4 flex items-center gap-3">
                  <span
                    class="w-1.5 h-1.5 bg-saffron rounded-full transition-transform duration-500 group-hover/card:scale-150"
                  ></span>
                  {{ item.name }}
                </h4>
                <p class="text-charcoal/60 text-sm leading-relaxed mb-6">
                  {{ item.description }}
                </p>
                <div v-if="item.deliverables" class="space-y-2">
                  <p
                    class="text-[10px] uppercase tracking-widest font-bold text-saffron/60"
                  >
                    {{ $t("sections.offerings.key_deliverables") }}
                  </p>
                  <p class="text-xs text-charcoal/80 leading-relaxed">
                    {{ item.deliverables }}
                  </p>
                </div>
                <div v-if="item.highlights" class="space-y-2">
                  <p
                    class="text-[10px] uppercase tracking-widest font-bold text-saffron/60"
                  >
                    {{ $t("sections.offerings.highlights") }}
                  </p>
                  <ul class="text-xs text-charcoal/80 space-y-1">
                    <li v-for="h in item.highlights" :key="h">• {{ h }}</li>
                  </ul>
                </div>
                <div v-if="item.tiers" class="space-y-3">
                  <div
                    v-for="tier in item.tiers"
                    :key="tier.label"
                    class="border-l-2 border-saffron/20 pl-4 py-1"
                  >
                    <span
                      class="text-[10px] uppercase tracking-wider font-bold block"
                      >{{ tier.label }}</span
                    >
                    <span
                      class="text-xs text-charcoal/60 leading-tight block"
                      >{{ tier.desc }}</span
                    >
                  </div>
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
const { gsap } = useGsap();
const { t, tm, rt } = useI18n();

const active = ref<number | null>(null);
const hovered = ref<number | null>(null);
const drawerRefs = new Map<number, HTMLElement>();

const setDrawerRef = (el: any, index: number) => {
  if (el) drawerRefs.set(index, el);
};

const toggle = (index: number) => {
  const drawer = drawerRefs.get(index);
  const { ScrollTrigger } = useGsap();
  if (!drawer) return;

  if (active.value === index) {
    // Close
    gsap.to(drawer, {
      height: 0,
      opacity: 0,
      duration: 0.6,
      ease: "power3.inOut",
      onComplete: () => {
        drawer.style.visibility = "hidden";
        ScrollTrigger.refresh();
      },
    });
    active.value = null;
  } else {
    // Close existing if any
    if (active.value !== null) {
      const prevDrawer = drawerRefs.get(active.value);
      if (prevDrawer)
        gsap.to(prevDrawer, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
        });
    }

    // Open new
    drawer.style.visibility = "visible";
    gsap.set(drawer, { height: "auto" });
    ScrollTrigger.refresh();

    const autoHeight = drawer.offsetHeight;
    gsap.fromTo(
      drawer,
      { height: 0, opacity: 0 },
      {
        height: autoHeight,
        opacity: 1,
        duration: 0.8,
        ease: "expo.out",
        onComplete: () => {
          ScrollTrigger.refresh();
        },
      }
    );
    active.value = index;
  }
};

const offeringsList = computed(() => {
  const resolve = (val: any) => (!val ? "" : (typeof val === 'string' ? val : rt(val)));

  const resolveItems = (path: string) => {
    const items = tm(path);
    if (!Array.isArray(items)) return [];
    return items.map((item: any) => ({
      name: resolve(item.name),
      description: resolve(item.description),
      deliverables: item.deliverables ? resolve(item.deliverables) : undefined,
      highlights: Array.isArray(item.highlights) ? item.highlights.map((h: any) => resolve(h)) : undefined,
      tiers: Array.isArray(item.tiers) ? item.tiers.map((tier: any) => ({
        label: resolve(tier.label),
        desc: resolve(tier.desc)
      })) : undefined
    }));
  };

  return [
    {
      title: t('sections.offerings.branding.title'),
      items: resolveItems('sections.offerings.branding.items'),
    },
    {
      title: t('sections.offerings.social_media.title'),
      items: resolveItems('sections.offerings.social_media.items'),
    },
    {
      title: t('sections.offerings.growth_marketing.title'),
      items: resolveItems('sections.offerings.growth_marketing.items'),
    },
    {
      title: t('sections.offerings.add_ons.title'),
      items: resolveItems('sections.offerings.add_ons.items'),
    }
  ]
})
</script>

<style scoped>
.offering-row:last-child {
  border-bottom: none;
}
</style>
