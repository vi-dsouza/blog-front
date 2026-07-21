<template>
  <v-app theme="entreIdeiasTheme">
    <NuxtPage />
    <GlobalAlert />
  </v-app>
</template>

<script setup>
import { useHead } from '#imports';
import GlobalAlert from './components/GlobalAlert.vue';

useHead({
  htmlAttrs: {
    style: 'color-scheme: only dark !important; forced-color-adjust: none !important;'
  },
  meta: [
    { name: 'color-scheme', content: 'only dark' },
    { name: 'supported-color-schemes', content: 'dark' }
  ]
})
</script>

<style>
html, body {
  color-scheme: only dark !important;
  forced-color-adjust: none !important;
  border-image: none !important;
  -webkit-border-image: none !important;
}

*, *::before, *::after {
  forced-color-adjust: none !important;
}

img, video, iframe, .v-img {
  forced-color-adjust: none !important;
}

@media (prefers-color-scheme: dark) {
  :root, html, body {
    color-scheme: only dark !important;
    forced-color-adjust: none !important;
  }
}
</style>