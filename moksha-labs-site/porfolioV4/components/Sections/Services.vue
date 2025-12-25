<template>
  <BaseSection theme-color="#F5F2ED" id="services">
    <div class="text-center mb-16">
      <h2 class="text-5xl font-bold mb-4">
        {{ $t("sections.services.title") }}
      </h2>
      <p class="text-charcoal/60 uppercase tracking-widest text-sm">
        {{ $t("sections.services.subtitle") }}
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="(service, i) in servicesList"
        :key="i"
        class="p-10 glass-panel group hover:border-saffron/40 transition-all duration-700 hover:-translate-y-2 hover:bg-white/[0.03] hover:shadow-[0_30px_60px_rgba(226,160,79,0.08)] overflow-hidden relative"
        :class="
          i % 2 === 0
            ? 'rounded-tr-[100px] rounded-bl-xl'
            : 'rounded-tl-[100px] rounded-br-xl'
        "
      >
        <!-- Ambient Background Glow -->
        <div
          class="absolute -top-20 -right-20 w-40 h-40 bg-saffron/5 rounded-full blur-[80px] group-hover:bg-saffron/10 transition-colors duration-700"
        ></div>

        <!-- Unified Content Motion Wrapper -->
        <div
          class="transition-transform duration-700 group-hover:translate-x-2"
        >
          <div
            class="text-saffron mb-8 transition-transform duration-700 group-hover:scale-110 origin-left"
          >
            <component :is="service.icon" :size="48" stroke-width="1" />
          </div>

          <h3
            class="text-2xl font-bold mb-2 transition-colors duration-700 group-hover:text-saffron"
          >
            {{ service.title }}
          </h3>
          <p
            class="text-saffron/60 text-[10px] uppercase tracking-widest font-bold mb-6"
          >
            {{ service.subtitle }}
          </p>
          <p class="text-charcoal/70 text-sm leading-relaxed max-w-[90%]">
            {{ service.description }}
          </p>
        </div>
      </div>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import {
  Globe,
  Cpu,
  Palette,
  Share2,
  TrendingUp,
  Aperture,
} from "lucide-vue-next";

const { tm, rt } = useI18n();

const icons = [Globe, Palette, Cpu, Share2, TrendingUp, Aperture];

const servicesList = computed<any[]>(() => {
  const items = tm("sections.services.items");
  if (!Array.isArray(items)) return [];

  return items.map((item: any, index: number) => {
    // Defensive check for pre-compiled or missing properties
    const resolve = (val: any) => {
      if (!val) return "";
      return typeof val === "string" ? val : rt(val);
    };

    return {
      title: resolve(item.title),
      subtitle: resolve(item.subtitle),
      description: resolve(item.description),
      icon: icons[index],
    };
  });
});
</script>
