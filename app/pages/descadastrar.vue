<template>
  <v-container class="fill-height justify-center align-center">
    <v-card class="pa-6 text-center" max-width="400" elevation="2">
      
      <div v-if="loading">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <h3 class="mt-4 text-h6 text-grey-darken-1">Processando seu descadastro...</h3>
      </div>

      <div v-else-if="sucessoExibicao">
        <v-icon color="warning" size="80">mdi-email-minus-outline</v-icon>
        <h2 class="mt-4 text-h5 font-weight-bold text-warning">Inscrição Cancelada</h2>
        <p class="mt-2 text-body-1 text-grey-darken-1">
          Seu e-mail foi removido da nossa lista. Você não receberá mais as atualizações do Entre Ideias.
        </p>
        <v-btn color="primary" variant="text" class="mt-4" to="/">Voltar para o Blog</v-btn>
      </div>

      <div v-else>
        <v-icon color="error" size="80">mdi-alert-circle-outline</v-icon>
        <h2 class="mt-4 text-h5 font-weight-bold text-error">Ops! Algo deu errado</h2>
        <p class="mt-2 text-body-1 text-grey-darken-1">
          {{ store.erro || 'Não conseguimos processar o cancelamento automático.' }}
        </p>
        <v-btn color="primary" class="mt-4" to="/">Ir para a Home</v-btn>
      </div>

    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useInscritosStore } from '~/stores/inscricaoStore'

const route = useRoute()
const store = useInscritosStore()
const loading = ref(true)
const sucessoExibicao = ref(false)

onMounted(async () => {
  store.limparEstados()
  const email = route.query.email as string

  if (!email) {
    store.erro = 'Nenhum e-mail foi fornecido para descadastro.'
    loading.value = false
    return
  }

  try {
    await store.cancelarInscricao(email)
    sucessoExibicao.value = true
  } catch (error) {
    sucessoExibicao.value = false
  } finally {
    loading.value = false
  }
})
</script>