<template>
  <BaseSection theme-color="#FDFBF7" id="team">
    <div class="text-center mb-20">
      <h2 class="text-5xl font-bold italic font-serif">
        {{ $t("sections.team.title") }}
      </h2>
    </div>

    <div class="flex flex-wrap justify-center gap-x-16 gap-y-24">
      <div
        v-for="(member, index) in teamList"
        :key="member.name"
        class="text-center group max-w-[220px]"
      >
        <div
          class="w-48 h-48 rounded-full overflow-hidden mb-6 mx-auto bg-charcoal/5 relative border-2 border-transparent group-hover:border-saffron transition-all duration-500 p-2 hide-custom-cursor"
        >
          <div
            class="w-full h-full rounded-full bg-cream-dark flex items-center justify-center overflow-hidden"
          >
            <img
              v-if="member.image"
              :src="member.image"
              class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              :style="[
                member.name === 'Zeynep Mahony'
                  ? { objectPosition: 'center 20%' }
                  : {},
                member.name === 'Ecenaz Demircan'
                  ? { transform: 'scale(1.1) translateY(-5%)' }
                  : {},
                member.name === 'Berkay Erte'
                  ? { transform: 'scale(1.2)' }
                  : {},
              ]"
              :alt="`Moksha Labs Team Member - ${member.name}`"
            />
            <span v-else class="text-charcoal/20 font-bold text-2xl">{{
              member.initials
            }}</span>
          </div>
        </div>
        <h3 class="text-xl font-bold mb-2">{{ member.name }}</h3>
        <p
          class="text-saffron text-[10px] tracking-[0.2em] uppercase leading-relaxed px-4"
        >
          {{ member.role }}
        </p>
      </div>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
const { t, tm, rt } = useI18n();

const teamWithImages = [
  {
    name: "Dylan Mahony",
    initials: "DM",
    image: "/image/dylan.jpg",
  },
  {
    name: "Zeynep Mahony",
    initials: "ZM",
    image: "/image/zeynep.jpg",
  },
  {
    name: "Berkay Erte",
    initials: "BE",
    image: "/image/berkay.jpg",
  },
  {
    name: "Ecenaz Demircan",
    initials: "ED",
    image: "/image/ecenaz.jpg",
  },
];

const teamList = computed(() => {
  const members = tm("sections.team.members");
  if (!Array.isArray(members)) return [];
  return teamWithImages.map((member, index) => {
    const tMember: any = members[index];
    const resolve = (val: any) => (!val ? "" : (typeof val === 'string' ? val : rt(val)));
    return {
      ...member,
      name: tMember ? resolve(tMember.name) : member.name,
      role: tMember ? resolve(tMember.role) : "",
    };
  });
});
</script>
