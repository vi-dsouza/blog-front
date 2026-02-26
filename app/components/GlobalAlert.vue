<template>
  <v-snackbar
    v-model="alert.show"
    :color="alert.color"
    timeout="3000"
    location="top right"
  >
    {{ alert.message }}

    <template #actions>
      <v-btn icon="mdi-close" variant="text" @click="alert.close()" />
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useAlertStore } from '~/stores/alert'
const alert = useAlertStore()
</script>