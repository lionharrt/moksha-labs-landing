<template>
  <BaseSection theme-color="#FDFBF7" id="team">
    <div class="text-center mb-20">
      <h2 class="text-5xl font-bold italic font-serif">
        The Minds Behind Moksha
      </h2>
    </div>

    <div class="flex flex-wrap justify-center gap-x-16 gap-y-24">
      <div
        v-for="(member, index) in team"
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
              :alt="member.name"
            />
            <span v-else class="text-charcoal/20 font-bold text-2xl">{{
              member.initials
            }}</span>
          </div>
        </div>
        <h4 class="text-xl font-bold mb-2">{{ member.name }}</h4>
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
const team = [
  {
    name: "Dylan Mahony",
    role: "Founder & Tech Lead",
    initials: "DM",
    image: "/image/dylan.jpg",
  },
  {
    name: "Zeynep Mahony",
    role: "Co-Founder, Executive & Design Assistant",
    initials: "ZM",
    image: "/image/zeynep.jpg",
  },
  {
    name: "Berkay Erte",
    role: "Co-Founder, Multimedia Designer & Creative Producer",
    initials: "BE",
    image: "/image/berkay.jpg",
  },
  {
    name: "Ecenaz Demircan",
    role: "Co-Founder, Digital Architect & Lead Web Designer",
    initials: "ED",
    image: "/image/ecenaz.jpg",
  },
];
</script>
