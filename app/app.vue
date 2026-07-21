<template>
  <v-app theme="entreIdeiasTheme">
    <NuxtPage />
    <GlobalAlert />
  </v-app>
</template>

<script setup>
  import GlobalAlert from './components/GlobalAlert.vue';
</script>

<style>
html, body {
  color-scheme: light;
  forced-color-adjust: none;
}

@media (prefers-color-scheme: dark) {
  html {
    color-scheme: light;
  }
}
</style>