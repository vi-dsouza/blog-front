<template>
  <div class="tag-carousel-wrapper">
    <div class="tag-carousel">
      <!-- Removido o 'ma-4' que causava o grande espaçamento externo -->
      <div class="tag-track">
        <v-card
          v-for="(tag, index) in repeatedTags"
          :key="`${tag}-${index}`"
          class="fonte tag-card d-flex align-center justify-center text-uppercase font-weight-bold"
          elevation="0"
        >
          <v-icon size="x-small" class="mr-2 gold-icon">mdi-rhombus-medium</v-icon>
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
  padding: 0; /* Zerado o espaçamento do container principal */
  background: transparent !important;
  border-bottom: 1px solid rgba(212, 175, 55, 0.15);
}

/* Efeito de fade nas laterais */
.tag-carousel-wrapper::before,
.tag-carousel-wrapper::after {
  content: "";
  height: 100%;
  width: 180px;
  position: absolute;
  top: 0;
  z-index: 2;
  pointer-events: none;
}

.tag-carousel-wrapper::before {
  left: 0;
  background: linear-gradient(to right, #0b0813 0%, transparent 100%);
}
.tag-carousel-wrapper::after {
  right: 0;
  background: linear-gradient(to left, #0b0813 0%, transparent 100%);
}

.tag-carousel {
  width: 100%;
  /* Apenas um pequeno respiro de 6px para o efeito de "subir" no hover não cortar a tag */
  padding: 6px 0; 
}

.tag-track {
  display: flex;
  gap: 16px; /* Espaço entre as tags ligeiramente mais compacto */
  width: max-content;
  animation: scroll-tags 40s linear infinite;
  transition: animation-play-state 0.5s ease-in-out;
}

.tag-track:hover {
  animation-play-state: paused;
}

.tag-card {
  flex: 0 0 auto;
  padding: 6px 16px !important; 
  height: auto !important;
  
  /* Alterado para preto com 20% de opacidade */
  background: rgba(0, 0, 0, 0.2) !important;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  
  /* Cor do texto: Bege/Creme suave */
  color: #F4EFEB !important;
  
  /* Borda minimalista dourada */
  border: 1px solid rgba(212, 175, 55, 0.15) !important;
  border-radius: 30px !important;
  
  letter-spacing: 1.5px;
  font-size: 0.72rem;
  
  transition: 
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
    border-color 0.4s ease, 
    background-color 0.4s ease,
    box-shadow 0.4s ease,
    color 0.4s ease;
}

.gold-icon {
  color: #D4AF37 !important;
  opacity: 0.7;
  transition: transform 0.4s ease;
}

.tag-card:hover {
  background: rgba(110, 73, 184, 0.12) !important;
  border-color: rgba(212, 175, 55, 0.6) !important;
  color: #FFFFFF !important;
  transform: translateY(-2px); /* Mantém o micro movimento sem quebrar o layout */
  
  box-shadow: 
    0 6px 15px rgba(110, 73, 184, 0.2),
    0 0 8px rgba(212, 175, 55, 0.1) !important;
}

.tag-card:hover .gold-icon {
  transform: rotate(45deg);
  opacity: 1;
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