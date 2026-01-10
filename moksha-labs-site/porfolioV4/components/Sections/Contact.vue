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
            href="mailto:hello@mokshalabs.ie"
            class="block text-3xl font-serif hover:text-saffron transition-colors"
            >hello@mokshalabs.ie</a
          >
          <div class="space-y-2">
            <p class="text-cream/40 uppercase tracking-widest text-sm">
              {{ $t("sections.contact.location") }}
            </p>
            <div class="flex items-center gap-6 pt-2">
              <a
                href="https://wa.me/353833639750"
                target="_blank"
                class="social-link group"
                aria-label="WhatsApp"
              >
                <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03a11.934 11.934 0 001.608 6.046L0 24l6.117-1.605a11.882 11.882 0 005.928 1.588h.005c6.637 0 12.032-5.396 12.035-12.03a11.85 11.85 0 00-3.535-8.503"
                  />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/mokshalabs/posts/?feedView=all"
                target="_blank"
                class="social-link group"
                aria-label="LinkedIn"
              >
                <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.208 24 24 23.227 24 22.271V1.729C24 .774 23.208 0 22.225 0z"
                  />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/mokshalabs.ie/"
                target="_blank"
                class="social-link group"
                aria-label="Instagram"
              >
                <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path
                    d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.984 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.051 1.05 20.381.646 19.591.33c-.765-.296-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.237-.421-.569-.224-.96-.479-1.382-.899-.419-.419-.679-.824-.896-1.38-.164-.42-.359-1.065-.413-2.235-.057-1.274-.07-1.649-.07-4.859 0-3.211.015-3.586.074-4.859.061-1.171.256-1.816.421-2.237.224-.56-.479-.96.899-1.382.419-.419.824-.679 1.38-.896.42-.164 1.065-.359 2.235-.413 1.274-.057 1.649-.07 4.859-.07l.031.001zm0 3.662c-3.446 0-6.238 2.792-6.238 6.238 0 3.446 2.792 6.238 6.238 6.238 3.446 0 6.238-2.792 6.238-6.238 0-3.446-2.792-6.238-6.238-6.238zm0 10.315c-2.252 0-4.077-1.825-4.077-4.077s1.825-4.077 4.077-4.077 4.077 1.825 4.077 4.077-1.825 4.077-4.077 4.077zm5.446-10.443a1.44 1.44 0 101.44 1.44 1.44 1.44 0 00-1.44-1.44z"
                  />
                </svg>
              </a>
            </div>
          </div>
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
              <template v-if="!turnstileToken">
                * Please verify you are human to ascend.
              </template>
              <template v-else-if="message.length <= 2">
                * Your message is a bit short. Tell us more.
              </template>
              <template v-else-if="!isEmailValid">
                * Please enter a valid email address.
              </template>
              <template v-else>
                {{ $t("sections.contact.form.validation_error") }}
              </template>
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
    message.value.length > 2 &&
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
.social-link {
  @apply relative text-cream/40 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-saffron flex items-center justify-center;
}

.social-link::after {
  content: "";
  @apply absolute inset-0 bg-saffron/0 rounded-full blur-xl transition-all duration-700 -z-10 scale-150;
}

.social-link:hover::after {
  @apply bg-saffron/10;
}

.social-link svg {
  @apply transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)];
}

.social-link:hover svg {
  @apply scale-150;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
