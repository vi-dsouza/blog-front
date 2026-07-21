// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      meta: [
        { name: 'color-scheme', content: 'light' }
      ]
    }
  },
  plugins: [
    '~/plugins/vuetify.ts'
  ],
  css: [
    'vuetify/lib/styles/main.css',
    '@mdi/font/css/materialdesignicons.min.css'
  ],
  modules: ['@pinia/nuxt'],
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    define: {
      'process.env.DEBUG': 'false',
    },
  },
  runtimeConfig: {
    public: {
      apiBase: 'https://blog-back-u2m0.onrender.com'
    }
  }
})
