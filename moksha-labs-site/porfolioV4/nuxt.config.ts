// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  experimental: {
    appManifest: false,
  },
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/i18n", "@nuxtjs/sitemap"],

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

  // Sitemap Configuration
  site: {
    url: "https://mokshalabs.ie",
    name: "Moksha Labs",
  },

  sitemap: {
    xsl: false,
    credits: false,
    sources: ["/sitemap.xml"],
    defaults: {
      changefreq: "monthly",
      priority: 0.8,
      lastmod: new Date().toISOString(),
    },
    urls: [
      {
        loc: "/",
        changefreq: "monthly",
        priority: 1.0,
        lastmod: new Date().toISOString(),
      },
      {
        loc: "/en",
        changefreq: "monthly",
        priority: 1.0,
        lastmod: new Date().toISOString(),
      },
      {
        loc: "/tr",
        changefreq: "monthly",
        priority: 1.0,
        lastmod: new Date().toISOString(),
      },
      {
        loc: "/it",
        changefreq: "monthly",
        priority: 1.0,
        lastmod: new Date().toISOString(),
      },
      {
        loc: "/ar",
        changefreq: "monthly",
        priority: 1.0,
        lastmod: new Date().toISOString(),
      },
    ],
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
        { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=5" },
        { name: "color-scheme", content: "light only" },
        { name: "theme-color", content: "#FDFBF7" },
        {
          name: "description",
          content:
            "Moksha Labs is a high-end digital agency specializing in immersive web experiences, cinematic motion design, and luxury brand identity. Based in Dublin, serving clients globally.",
        },
        {
          name: "keywords",
          content:
            "digital agency, web design, web development, brand identity, motion design, SEO, digital marketing, luxury branding, immersive experiences, Dublin, Ireland",
        },
        { name: "author", content: "Moksha Labs" },
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { name: "googlebot", content: "index, follow" },
        { name: "format-detection", content: "telephone=no" },
        
        // Open Graph / Facebook
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://mokshalabs.ie" },
        { property: "og:site_name", content: "Moksha Labs" },
        {
          property: "og:title",
          content: "Moksha Labs - High-End Digital Agency",
        },
        {
          property: "og:description",
          content:
            "Crafting high-end digital experiences for the modern era. Specializing in immersive web applications, luxury branding, and cinematic motion design.",
        },
        { property: "og:image", content: "https://mokshalabs.ie/og-image.jpg" },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:image:alt", content: "Moksha Labs - Digital Excellence" },
        { property: "og:locale", content: "en_IE" },
        { property: "og:locale:alternate", content: "tr_TR" },
        { property: "og:locale:alternate", content: "it_IT" },
        { property: "og:locale:alternate", content: "ar_SA" },

        // Twitter
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@mokshalabs" },
        { name: "twitter:creator", content: "@mokshalabs" },
        { name: "twitter:url", content: "https://mokshalabs.ie" },
        {
          name: "twitter:title",
          content: "Moksha Labs - High-End Digital Agency",
        },
        {
          name: "twitter:description",
          content:
            "Crafting high-end digital experiences for the modern era. Specializing in immersive web applications and luxury branding.",
        },
        { name: "twitter:image", content: "https://mokshalabs.ie/og-image.jpg" },
        { name: "twitter:image:alt", content: "Moksha Labs - Digital Excellence" },
        
        // Additional SEO
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
        { name: "apple-mobile-web-app-title", content: "Moksha Labs" },
      ],
      link: [
        { rel: "canonical", href: "https://mokshalabs.ie" },
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
    // Private server-side config (not exposed to client)
    larkEmail: process.env.LARK_EMAIL || "hello@mokshalabs.ie",
    larkPassword: process.env.LARK_PASSWORD || "",
    larkFromName: process.env.LARK_FROM_NAME || "Moksha Labs",
    
    public: {
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
