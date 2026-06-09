<template>
  <div class="tag-carousel">
    <div class="tag-track ma-4 text-center">
      <v-card
        v-for="(tag, index) in repeatedTags"
        :key="`${tag}-${index}`"
        class="tag-card pa-4"
        elevation="2"
      >
        {{ tag }}
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useConfiguracaoStore } from '@/stores/configStore'

const configStore = useConfiguracaoStore()
const tags = ref<string[]>([])

const repeatedTags = computed(() => [...tags.value, ...tags.value])

const loadTags = async () => {
  const dados = await configStore.carregarConfig()
  tags.value = dados?.tags_do_blog?.split(',') ?? []
}

onMounted(loadTags)
</script>

<style scoped>
.tag-carousel {
  overflow: hidden;
  width: 100%;
}

.tag-track {
  display: flex;
  gap: 16px;
  animation: scroll-tags 20s linear infinite;
}

.tag-card {
  flex: 0 0 220px;
  min-width: 220px;
  min-height: 60px;
}
@keyframes scroll-tags {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
</style>