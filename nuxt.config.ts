import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-04-01',
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxt/content',
    '@nuxt/fonts',
    '@nuxtjs/i18n',
  ],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  typescript: {
    strict: true,
  },

  experimental: {
    viewTransition: true,
  },

  i18n: {
    defaultLocale: 'it',
    strategy: 'prefix_except_default',
    locales: [
      { code: 'it', language: 'it-IT', name: 'Italiano', file: 'it.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
    ],
    bundle: {
      optimizeTranslationDirective: false,
    },
  },

  fonts: {
    families: [
      { name: 'Geist', provider: 'google' },
      { name: 'Geist Mono', provider: 'google' },
      { name: 'Anton', provider: 'google', weights: [400] },
      { name: 'Inter', provider: 'google', weights: [400, 500, 600, 700] },
    ],
    defaults: {
      preload: true,
    },
  },

  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#09090b' },

        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Tommaso Valenzano' },
        { property: 'og:title', content: 'Tommaso Valenzano — Full-stack developer' },
        { property: 'og:description', content: 'Personal portfolio. Full-stack developer at C&C Apple Premium Partner, CS MSc student (AI track). Case studies on Ospitio, Room N14 and more.' },
        { property: 'og:url', content: 'https://tvalenzano.it' },
        { property: 'og:image', content: 'https://tvalenzano.it/og-image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:locale', content: 'it_IT' },
        { property: 'og:locale:alternate', content: 'en_US' },

        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Tommaso Valenzano — Full-stack developer' },
        { name: 'twitter:description', content: 'Personal portfolio. Full-stack developer at C&C Apple Premium Partner, CS MSc student (AI track).' },
        { name: 'twitter:image', content: 'https://tvalenzano.it/og-image.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
    },
  },

})
