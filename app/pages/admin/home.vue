<template>
    <v-app>
        <MenuLateral />

    </v-app>
</template>

<script setup lang="ts">
import MenuLateral from '~/components/admin/MenuLateral.vue';

definePageMeta({
  middleware: 'auth'
})

</script>