<template>
  <div class="tag-carousel-wrapper">
    <div class="tag-carousel">
      <div class="tag-track ma-4">
        <v-card
          v-for="(tag, index) in repeatedTags"
          :key="`${tag}-${index}`"
          class="fonte tag-card d-flex align-center justify-center text-uppercase font-weight-bold"
          elevation="0"
        >
          <v-icon size="small" color="primary" class="mr-2">mdi-rhombus-medium</v-icon>
          {{ tag.trim() }}
        </v-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const configStore = useConfiguracaoStore()
const tags = ref<string[]>([])
const repeatedTags = computed(() => [...tags.value, ...tags.value, ...tags.value, ...tags.value])

const loadTags = async () => {
  const dados = await configStore.carregarConfigPublico()
  tags.value = dados?.tags_do_blog?.split(',') ?? ['Tech', 'Design', 'Futuro', 'Insights', 'Código', 'Minimalismo']
}

onMounted(loadTags)
</script>

<style scoped>
.fonte {
  font-family: 'Georgia', serif !important;
}

.tag-carousel-wrapper {
  width: 100%;
  overflow: hidden;
  position: relative;
  padding: 20px 0;
  background: transparent;
}

.tag-carousel-wrapper::before,
.tag-carousel-wrapper::after {
  content: "";
  height: 100%;
  width: 150px;
  position: absolute;
  top: 0;
  z-index: 2;
  pointer-events: none;
}

.tag-carousel-wrapper::before {
  left: 0;
  background: linear-gradient(to right, var(--v-theme-quinary, #1F1A1B) 0%, transparent 100%);
}
.tag-carousel-wrapper::after {
  right: 0;
  background: linear-gradient(to left, var(--v-theme-quinary, #1F1A1B) 0%, transparent 100%);
}

.tag-carousel {
  width: 100%;
}

.tag-track {
  display: flex;
  gap: 24px;
  width: max-content;
  animation: scroll-tags 25s linear infinite;
}

.tag-track:hover {
  animation-play-state: paused;
}

.tag-card {
  flex: 0 0 200px;
  min-width: 200px;
  height: 55px;
  background: #4A2E80 !important; 
  color: var(--v-theme-septenary) !important;
  border: 1px solid rgba(234, 168, 81, 0.25); 
  border-radius: 12px !important;
  letter-spacing: 1.5px;
  font-size: 0.8rem;
  transition: 
    transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), 
    border-color 0.3s ease, 
    box-shadow 0.3s ease, 
    background 0.3s ease,
    color 0.3s ease;
}

.tag-card:hover {
  background: #694BB3 !important; 
  border-color: rgb(var(--v-theme-primary)) !important; 
  color: rgb(var(--v-theme-primary)) !important; 
  transform: translateY(-4px) scale(1.04);
  z-index: 10;
  box-shadow: 
    0 10px 25px rgba(105, 75, 179, 0.5),
    0 0 15px rgba(234, 168, 81, 0.25) !important;
}

@keyframes scroll-tags {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-25%);
  }
}
</style>