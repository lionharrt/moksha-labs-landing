// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  experimental: {
    appManifest: false,
  },
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/i18n"],

  i18n: {
    locales: [
      { code: "en", language: "en-US", file: "en.json", name: "English" },
      { code: "tr", language: "tr-TR", file: "tr.json", name: "Türkçe" },
      { code: "it", language: "it-IT", file: "it.json", name: "Italiano" },
      {
        code: "ar",
        language: "ar-SA",
        file: "ar.json",
        name: "العربية",
        dir: "rtl",
      },
    ],
    baseUrl: "https://mokshalabs.ie", // Replace with your actual production URL
    lazy: true,
    restructureDir: "",
    langDir: "locales",
    defaultLocale: "en",
    strategy: "prefix",
    compilation: {
      strictMessage: false,
    },
    bundle: {
      fullInstall: true,
    },
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
      alwaysRedirect: false, // Set to false to prevent fighting with manual switches
      fallbackLocale: "en",
    },
  },

  nitro: {
    preset: "firebase",
    firebase: {
      gen: 2,
    },
  },

  app: {
    head: {
      title: "Moksha Labs",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "color-scheme", content: "light only" },
        {
          name: "description",
          content:
            "Moksha Labs is a high-end digital agency specializing in immersive web experiences, cinematic motion design, and luxury brand identity.",
        },
        // Open Graph / Facebook
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://mokshalabs.ie" },
        {
          property: "og:title",
          content: "Moksha Labs",
        },
        {
          property: "og:description",
          content:
            "Crafting high-end digital experiences for the modern era. Specializing in immersive web applications and luxury branding.",
        },
        { property: "og:image", content: "https://mokshalabs.ie/favicon.png" },

        // Twitter
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:url", content: "https://mokshalabs.ie" },
        {
          name: "twitter:title",
          content: "Moksha Labs",
        },
        {
          name: "twitter:description",
          content:
            "Crafting high-end digital experiences for the modern era. Specializing in immersive web applications and luxury branding.",
        },
        { name: "twitter:image", content: "https://mokshalabs.ie/favicon.png" },
      ],
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "/favicon.png",
          media: "(prefers-color-scheme: light)",
        },
        {
          rel: "icon",
          type: "image/png",
          href: "/favicon-dark.png",
          media: "(prefers-color-scheme: dark)",
        },
        { rel: "apple-touch-icon", href: "/favicon.png" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap",
        },
      ],
    },
  },

  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    public: {
      emailjsPublicKey: process.env.EMAILJS_PUBLIC_KEY || "",
      emailjsServiceId: process.env.EMAILJS_SERVICE_ID || "",
      emailjsTemplateId: process.env.EMAILJS_TEMPLATE_ID || "",
      turnstileSiteKey: process.env.TURNSTILE_SITE_KEY || "1x00000000000000000000AA", // Testing key
      firebaseApiKey: process.env.FIREBASE_API_KEY || "",
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN || "",
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID || "mokshalabs",
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET || "mokshalabs.firebasestorage.app",
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
      firebaseAppId: process.env.FIREBASE_APP_ID || "",
    },
  },
});
