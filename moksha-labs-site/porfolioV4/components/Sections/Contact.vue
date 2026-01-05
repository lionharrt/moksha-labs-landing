<template>
  <BaseSection
    theme-color="#1A1A1A"
    class="!text-cream"
    padding-class="pt-44"
    id="contact"
  >
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-20">
      <div>
        <i18n-t
          keypath="sections.contact.title_template"
          tag="h2"
          class="text-7xl font-bold mb-8 leading-tight"
        >
          <template #ascend>
            <span class="text-saffron italic">{{
              $t("sections.contact.ascend_word")
            }}</span>
          </template>
        </i18n-t>
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
          <!-- 2025 Anti-Abuse: Honeypot (Hidden from humans) -->
          <div class="hidden" aria-hidden="true">
            <input
              v-model="form.honeypot"
              type="text"
              name="moksha_security_check"
              tabindex="-1"
              autocomplete="off"
            />
          </div>

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

          <!-- Cloudflare Turnstile Widget (Privacy-first bot protection) -->
          <div class="pt-2">
            <div id="turnstile-container"></div>
          </div>

          <div class="pt-4 flex flex-col gap-4">
            <button
              :disabled="!isFormValid || isSubmitting"
              class="relative overflow-hidden group/btn bg-saffron text-charcoal font-bold py-4 px-10 rounded-full transition-all duration-500 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed hover:bg-cream active:scale-95"
            >
              <span class="relative z-10">
                <template v-if="isSubmitting">
                  <span class="inline-block animate-pulse">{{
                    $t("sections.contact.form.sending")
                  }}</span>
                </template>
                <template v-else>
                  {{ $t("sections.contact.form.submit") }}
                </template>
              </span>
              <div
                class="absolute inset-0 bg-white translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"
              ></div>
            </button>

            <!-- Error Message -->
            <p
              v-if="isError"
              class="text-[10px] uppercase tracking-widest text-red-500 font-bold"
            >
              * Connection error. Please try again or email directly.
            </p>

            <!-- Smooth Validation Note -->
            <p
              v-if="
                !isFormValid &&
                !isSubmitting &&
                (form.name || form.email || message)
              "
              class="text-[10px] uppercase tracking-widest text-saffron/60 italic animate-pulse"
            >
              {{
                turnstileToken
                  ? $t("sections.contact.form.validation_error")
                  : "* Please verify you are human to ascend."
              }}
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
const config = useRuntimeConfig();

const form = ref({
  name: "",
  email: "",
  honeypot: "", // 2025 Bot Protection: Honeypot field
});

const isSubmitted = ref(false);
const isError = ref(false);
const isSubmitting = ref(false);
const turnstileToken = ref("");

// Remove automatic script load to handle it manually for CSP/Nonce compatibility
useHead({});

const isEmailValid = computed(() => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(form.value.email);
});

const isFormValid = computed(() => {
  return (
    form.value.name.length > 1 &&
    isEmailValid.value &&
    message.value.length > 10 &&
    turnstileToken.value !== ""
  );
});

// Turnstile callback
const onTurnstileVerify = (token: string) => {
  turnstileToken.value = token;
};

// Function to handle Turnstile expiration
const onTurnstileExpire = () => {
  turnstileToken.value = "";
};

const handleSubmit = async () => {
  if (!isFormValid.value || isSubmitting.value) return;
  
  // 1. Honeypot check: If filled, silently fail (it's a bot)
  if (form.value.honeypot) {
    console.warn("Honeypot filled. Bot detected.");
    isSubmitted.value = true; // Show success anyway to confuse bot
    return;
  }

  isSubmitting.value = true;
  isError.value = false;

  try {
    // Send to our server API endpoint (using Lark SMTP)
    const response = await $fetch("/api/contact", {
      method: "POST",
      body: {
        name: form.value.name,
        email: form.value.email,
        subject: subject.value,
        message: message.value,
        turnstileToken: turnstileToken.value,
        honeypot: form.value.honeypot,
      },
    });

    if (response.success) {
      isSubmitted.value = true;
      // Clear form
      form.value = { name: "", email: "", honeypot: "" };
      message.value = "";
      subject.value = "";
      turnstileToken.value = ""; // Reset token
    } else {
      throw new Error("Failed to send email");
    }
  } catch (error: any) {
    console.error("Email sending error:", error);
    isError.value = true;
  } finally {
    isSubmitting.value = false;
  }
};

// 2025 Production-Grade Turnstile Logic
const onTurnstileLoaded = () => {
  const w = window as any;
  if (w.turnstile) {
    w.turnstile.render("#turnstile-container", {
      sitekey: config.public.turnstileSiteKey,
      callback: (token: string) => {
        turnstileToken.value = token;
      },
      "expired-callback": () => {
        turnstileToken.value = "";
      },
      "error-callback": (code: string) => {
        console.error("Turnstile Error:", code);
        turnstileToken.value = "";
      },
      theme: "dark",
    });
  }
};

onMounted(() => {
  (window as any).onTurnstileLoaded = onTurnstileLoaded;

  // In case the script loads faster than the component mounts
  if ((window as any).turnstile) {
    onTurnstileLoaded();
  }
});

// useHead handles the 'nonce' automatically on production servers
useHead({
  script: [
    {
      src: "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileLoaded",
      async: true,
      defer: true,
    },
  ],
});
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
