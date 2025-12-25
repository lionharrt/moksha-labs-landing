<template>
  <BaseSection theme-color="#F5F2ED" id="portfolio">
    <div class="text-center mb-16">
      <h2 class="text-5xl font-bold mb-4">
        {{ $t("sections.portfolio.title") }}
      </h2>
      <p class="text-charcoal/60 uppercase tracking-widest text-sm">
        {{ $t("sections.portfolio.subtitle") }}
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-16">
      <div
        v-for="(project, index) in projectsList"
        :key="index"
        class="group cursor-pointer"
        :class="index % 2 !== 0 ? 'md:mt-24' : ''"
      >
        <div
          class="relative aspect-[4/5] overflow-hidden rounded-3xl mb-6 bg-charcoal/5"
        >
          <div
            class="absolute inset-0 bg-saffron/10 group-hover:bg-saffron/0 transition-colors duration-700"
          ></div>
          <!-- Placeholder for Firebase image -->
          <div
            class="w-full h-full flex items-center justify-center text-charcoal/20"
          >
            {{ $t("sections.portfolio.placeholder") }}
          </div>
        </div>
        <p
          class="text-saffron uppercase tracking-widest text-xs font-bold mb-2"
        >
          {{ project.category }}
        </p>
        <h3
          class="text-3xl font-bold mb-4 group-hover:translate-x-2 transition-transform duration-500"
        >
          {{ project.title }}
        </h3>
      </div>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
const { tm, rt } = useI18n();

const projectsList = computed(() => {
  const projects = tm("sections.portfolio.projects");
  if (!Array.isArray(projects)) return [];
  return projects.map((project: any) => ({
    title: typeof project.title === 'string' ? project.title : rt(project.title),
    category: typeof project.category === 'string' ? project.category : rt(project.category),
  }));
});
</script>
