<template>
  <v-main>
    <v-container fluid class="pa-0">
      <v-img
        :src="bannerUrl"
        alt="Banner do site"
        class="banner-image"
        cover
      />
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useConfiguracaoStore } from '@/stores/configStore'

const configStore = useConfiguracaoStore()
const bannerUrl = ref('https://via.placeholder.com/1200x400?text=Banner+Padr%C3%A3o')

const loadBanner = async () => {
  const dados = await configStore.carregarConfigPublico()

  if (dados?.banner_url) {
    bannerUrl.value = `http://localhost:5000/config_blog/${dados.banner_url}`
  }
}

onMounted(loadBanner)
</script>

<style scoped>
.banner-image {
  width: 100%;
  max-width: 100%;
  aspect-ratio: 16 / 5;
}

@media (max-width: 960px) {
  .banner-image {
    aspect-ratio: 4 / 3;
  }
}

@media (max-width: 600px) {
  .banner-image {
    aspect-ratio: 3 / 1;
  }
}
</style>