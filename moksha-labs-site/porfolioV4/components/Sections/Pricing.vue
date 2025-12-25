<template>
  <BaseSection theme-color="#FDFBF7" id="pricing">
    <div class="text-center mb-16">
      <h2 class="text-5xl font-bold mb-4">
        {{ $t("sections.pricing.title") }}
      </h2>
      <p class="text-charcoal/60 uppercase tracking-widest text-sm">
        {{ $t("sections.pricing.subtitle") }}
      </p>
    </div>

    <div
      class="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto items-stretch"
    >
      <div
        v-for="(plan, index) in plansList"
        :key="index"
        class="relative p-12 border border-charcoal/10 rounded-[50px] overflow-hidden group flex flex-col h-full transition-all duration-700 hover:-translate-y-2 hover:bg-white/[0.03] hover:shadow-[0_30px_60px_rgba(226,160,79,0.08)]"
      >
        <!-- Ambient Background Glow -->
        <div
          class="absolute -top-20 -right-20 w-60 h-60 bg-saffron/5 rounded-full blur-[100px] group-hover:bg-saffron/10 transition-colors duration-700"
        ></div>

        <div
          class="absolute top-0 right-0 p-8 text-saffron/10 transition-all duration-700 group-hover:text-saffron/20 group-hover:scale-110 group-hover:-rotate-3"
        >
          <component :is="plan.icon" :size="140" stroke-width="0.5" />
        </div>

        <div
          class="relative z-10 transition-transform duration-700 group-hover:translate-x-1"
        >
          <h3
            class="text-3xl font-bold mb-2 transition-colors duration-700 group-hover:text-saffron"
          >
            {{ plan.name }}
          </h3>
          <p class="text-saffron font-semibold mb-8">
            {{ plan.price }}
          </p>

          <ul class="space-y-4 mb-12 flex-grow">
            <li
              v-for="(feature, fIndex) in plan.features"
              :key="fIndex"
              class="flex items-center text-charcoal/70 transition-transform duration-700 group-hover:translate-x-1"
            >
              <span
                class="w-1.5 h-1.5 bg-saffron rounded-full mr-3 transition-transform duration-500 group-hover:scale-150"
              ></span>
              {{ feature }}
            </li>
          </ul>
        </div>

        <button
          @click="prefillAndScroll(`${plan.name} Package Inquiry`)"
          class="relative overflow-hidden group/btn w-full py-4 border border-charcoal text-charcoal rounded-full font-bold uppercase tracking-wider text-sm mt-auto transition-all duration-300 active:scale-90 active:bg-charcoal/5"
        >
          <span
            class="relative z-10 group-hover/btn:text-cream transition-colors duration-500 pointer-events-none"
            >{{ $t("sections.pricing.get_started") }}</span
          >
          <div
            class="absolute inset-0 bg-charcoal translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 pointer-events-none"
          ></div>
        </button>
      </div>
    </div>

    <!-- Subtle Trust Note Footnote -->
    <div class="mt-24 text-center max-w-3xl mx-auto">
      <div class="h-px w-12 bg-charcoal/10 mx-auto mb-8"></div>
      <p
        class="text-[10px] uppercase tracking-[0.2em] text-charcoal/40 leading-relaxed px-6"
      >
        {{ $t("sections.pricing.trust_note") }}
      </p>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import { Zap, Crown } from "lucide-vue-next";

const { prefillAndScroll } = useContactForm();
const { tm, rt } = useI18n();

const icons = [Zap, Crown];

const plansList = computed(() => {
  const plans = tm("sections.pricing.plans");
  if (!Array.isArray(plans)) return [];
  
  const resolve = (val: any) => (!val ? "" : (typeof val === 'string' ? val : rt(val)));

  return plans.map((plan: any, index: number) => ({
    name: resolve(plan.name),
    price: resolve(plan.price),
    features: Array.isArray(plan.features) ? plan.features.map((f: any) => resolve(f)) : [],
    icon: icons[index],
  }));
});
</script>
