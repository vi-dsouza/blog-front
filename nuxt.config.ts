// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
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
})
