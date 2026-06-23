<template>
  <v-main>
    <v-container fluid class="pa-4 d-flex justify-center">
      <v-card 
        elevation="0" 
        class="mx-auto rounded-xl overflow-hidden pa-6 card-elegante-animado" 
        min-height="220px"
        width="92%"
        style="
          background: rgba(47, 47, 56, 0.4); 
          backdrop-filter: blur(16px); 
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(234, 168, 81, 0.2); 
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 0 12px rgba(234, 168, 81, 0.05);
          color: var(--v-theme-septenary) !important;
        "
      >
        <v-chip
          color="primary"
          variant="tonal"
          size="small"
          class="text-uppercase font-weight-bold mb-4 px-3"
          letter-spacing="1"
        >
          Editorial
        </v-chip>

        <v-card-title class="text-h5 text-sm-h4 font-weight-light text-septenary pa-0 mb-4" style="letter-spacing: -0.5px !important;">
          Descrição do Blog
        </v-card-title>

        <v-card-text 
          class="text-body-1 text-sm-h6 text-septenary pa-0 pl-4 font-weight-light"
          style="
            border-left: 3px solid rgb(var(--v-theme-primary)); 
            line-height: 1.6 !important; 
            opacity: 0.9;
          "
        >
          {{ descricao }}
        </v-card-text>
      </v-card>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useConfiguracaoStore } from '@/stores/configStore'

const configStore = useConfiguracaoStore()
const descricao = ref('')

const loadDescricao = async () => {
  const dados = await configStore.carregarConfigPublico()
  descricao.value = dados?.descricao_blog ?? 'Explore reflexões profundas, conexões inteligentes e novas perspectivas sobre o conhecimento moderno.'
}

onMounted(() => {
  loadDescricao()
})
</script>

<style scoped>

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-elegante-animado {
  animation: fadeInUp 0.8s ease-out forwards;
  transition: all 0.4s ease;
}

.card-elegante-animado:hover {
  transform: translateY(-4px); 
  border-color: rgba(234, 168, 81, 0.5) !important; 
  box-shadow: 
    0 12px 40px 0 rgba(0, 0, 0, 0.5), 
    0 0 20px rgba(234, 168, 81, 0.2), 
    inset 0 0 12px rgba(234, 168, 81, 0.1) !important;
}
</style>