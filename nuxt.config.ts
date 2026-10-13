export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [{ name: 'theme-color', content: '#ffffff' }],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap',
        },
      ],
    },
  },

  // Diisi lewat file .env (lihat .env.example)
  runtimeConfig: {
    adminPassword: '',
    sessionSecret: '',
  },

  routeRules: {
    '/admin': { ssr: false },
  },

  nitro: {
    // Semua konten disimpan di data/content.json
    storage: {
      content: { driver: 'fs', base: './data' },
    },
    prerender: {
      routes: ['/'],
    },
  },
})
