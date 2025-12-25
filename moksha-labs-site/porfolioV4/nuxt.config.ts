// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/i18n"],

  i18n: {
    locales: [
      { code: "en", iso: "en-US", file: "en.json", name: "English" },
      { code: "tr", iso: "tr-TR", file: "tr.json", name: "Türkçe" },
      { code: "it", iso: "it-IT", file: "it.json", name: "Italiano" },
      {
        code: "ar",
        iso: "ar-SA",
        file: "ar.json",
        name: "العربية",
        dir: "rtl",
      },
    ],
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
      title: "Moksha Labs | Digital Agency",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "High-end digital agency specializing in immersive web experiences.",
        },
      ],
      link: [
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
      firebaseApiKey: process.env.FIREBASE_API_KEY || "",
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN || "",
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID || "",
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
      firebaseAppId: process.env.FIREBASE_APP_ID || "",
    },
  },
});
