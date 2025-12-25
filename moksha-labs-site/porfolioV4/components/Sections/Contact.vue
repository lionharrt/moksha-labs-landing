<template>
  <BaseSection
    theme-color="#1A1A1A"
    class="!text-cream"
    padding-class="pt-44"
    id="contact"
  >
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-20">
      <div>
        <h2 class="text-7xl font-bold mb-8 leading-tight">
          {{ $t("sections.contact.title") }}
          <span class="text-saffron italic">{{
            $t("sections.contact.ascend")
          }}</span>
        </h2>
        <p class="text-cream/60 text-xl max-w-md mb-12">
          {{ $t("sections.contact.subtitle") }}
        </p>

        <div class="space-y-6">
          <a
            href="mailto:hello@mokshalabs.com"
            class="block text-3xl font-serif hover:text-saffron transition-colors"
            >hello@mokshalabs.com</a
          >
          <p class="text-cream/40 uppercase tracking-widest text-sm">
            {{ $t("sections.contact.location") }}
          </p>
        </div>
      </div>

      <div class="glass-panel p-10 border-cream/10 relative overflow-hidden">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="space-y-2 group">
            <label
              class="text-xs uppercase tracking-widest font-bold opacity-50 group-focus-within:text-saffron transition-colors"
              >{{ $t("sections.contact.form.name") }}</label
            >
            <input
              v-model="form.name"
              type="text"
              :placeholder="$t('sections.contact.form.name_placeholder')"
              class="w-full bg-transparent border-b border-cream/20 py-3 focus:outline-none focus:border-saffron transition-colors placeholder:text-cream/10"
            />
          </div>
          <div class="space-y-2 group">
            <label
              class="text-xs uppercase tracking-widest font-bold opacity-50 group-focus-within:text-saffron transition-colors"
              >{{ $t("sections.contact.form.email") }}</label
            >
            <input
              v-model="form.email"
              type="email"
              :placeholder="$t('sections.contact.form.email_placeholder')"
              class="w-full bg-transparent border-b border-cream/20 py-3 focus:outline-none focus:border-saffron transition-colors placeholder:text-cream/10"
              :class="{ 'border-red-500/50': !isEmailValid && form.email }"
            />
          </div>
          <div class="space-y-2 group">
            <label
              class="text-xs uppercase tracking-widest font-bold opacity-50 group-focus-within:text-saffron transition-colors"
              >{{ $t("sections.contact.form.topic") }}</label
            >
            <input
              v-model="subject"
              type="text"
              class="w-full bg-transparent border-b border-cream/20 py-3 focus:outline-none focus:border-saffron transition-colors text-saffron/80 font-serif placeholder:text-cream/10"
              :placeholder="$t('sections.contact.form.topic_placeholder')"
            />
          </div>
          <div class="space-y-2 group">
            <label
              class="text-xs uppercase tracking-widest font-bold opacity-50 group-focus-within:text-saffron transition-colors"
              >{{ $t("sections.contact.form.message") }}</label
            >
            <textarea
              v-model="message"
              rows="4"
              :placeholder="$t('sections.contact.form.message_placeholder')"
              class="w-full bg-transparent border-b border-cream/20 py-3 focus:outline-none focus:border-saffron transition-colors resize-none placeholder:text-cream/10"
            ></textarea>
          </div>

          <div class="pt-4 flex flex-col gap-4">
            <button
              :disabled="!isFormValid"
              class="relative overflow-hidden group/btn bg-saffron text-charcoal font-bold py-4 px-10 rounded-full transition-all duration-500 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed hover:bg-cream active:scale-95"
            >
              <span class="relative z-10">{{
                isSubmitted
                  ? $t("sections.contact.form.sending")
                  : $t("sections.contact.form.submit")
              }}</span>
              <div
                class="absolute inset-0 bg-white translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"
              ></div>
            </button>

            <!-- Smooth Validation Note -->
            <p
              v-if="!isFormValid && (form.name || form.email || message)"
              class="text-[10px] uppercase tracking-widest text-saffron/60 italic animate-pulse"
            >
              {{ $t("sections.contact.form.validation_error") }}
            </p>
          </div>
        </form>

        <!-- Success Overlay -->
        <Transition name="fade">
          <div
            v-if="isSubmitted"
            class="absolute inset-0 bg-charcoal/90 backdrop-blur-sm flex items-center justify-center text-center p-10 z-20"
          >
            <div class="space-y-6">
              <div
                class="w-20 h-20 bg-saffron rounded-full mx-auto flex items-center justify-center animate-bounce"
              >
                <svg
                  class="w-10 h-10 text-charcoal"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h3 class="text-3xl font-bold">
                {{ $t("sections.contact.form.success_title") }}
              </h3>
              <p class="text-cream/60">
                {{ $t("sections.contact.form.success_text") }}
              </p>
              <button
                @click="isSubmitted = false"
                class="text-saffron uppercase tracking-widest text-xs font-bold border-b border-saffron/20 pb-1"
              >
                {{ $t("sections.contact.form.another") }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
const { message, subject } = useContactForm();

const form = ref({
  name: "",
  email: "",
});

const isSubmitted = ref(false);

const isEmailValid = computed(() => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(form.value.email);
});

const isFormValid = computed(() => {
  return (
    form.value.name.length > 1 &&
    isEmailValid.value &&
    message.value.length > 10
  );
});

const handleSubmit = () => {
  if (isFormValid.value) {
    // In a real app, you'd send this to Firebase or an API
    console.log("Form submitted:", {
      ...form.value,
      subject: subject.value,
      message: message.value,
    });
    isSubmitted.value = true;

    // Clear form
    form.value = { name: "", email: "" };
    message.value = "";
    subject.value = "";
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
