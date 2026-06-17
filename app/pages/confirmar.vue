<template>
  <v-container class="fill-height justify-center align-center">
    <v-card class="pa-6 text-center" max-width="400" elevation="2">
      
      <div v-if="carregando">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <h3 class="mt-4 text-h6 text-grey-darken-1">Ativando sua inscrição...</h3>
      </div>

      <div v-else-if="sucesso">
        <v-icon color="success" size="80">mdi-check-circle-outline</v-icon>
        <h2 class="mt-4 text-h5 font-weight-bold text-success">Inscrição Confirmada!</h2>
        <p class="mt-2 text-body-1 text-grey-darken-1">
          Obrigado! Seu e-mail foi validado com sucesso e você já faz parte da Newsletter Entre Ideias.
        </p>
        <v-btn color="primary" class="mt-4" to="/">Ir para a Home</v-btn>
      </div>

      <div v-else>
        <v-icon color="error" size="80">mdi-alert-circle-outline</v-icon>
        <h2 class="mt-4 text-h5 font-weight-bold text-error">Ops! Algo deu errado.</h2>
        <p class="mt-2 text-body-1 text-grey-darken-1">
          {{ store.erro || 'Este link de confirmação é inválido ou já expirou.' }}
        </p>
        <v-btn color="error" variant="outlined" class="mt-4" to="/">Tentar Novamente</v-btn>
      </div>

    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// REMOVIDO: import { useRoute } from 'vue-router' -> O Nuxt já faz o auto-import globalmente!
// REMOVIDO: import axios -> Toda a lógica HTTP agora fica isolada na Pinia Store

// Ajuste os caminhos abaixo usando o padrão '~/' do Nuxt se necessário
import { useInscritosStore } from '~/stores/inscricaoStore'
import { useAlertStore } from '~/stores/alert'

const route = useRoute() // Chame o useRoute nativo do Nuxt
const store = useInscritosStore()
const alertStore = useAlertStore()

const carregando = ref(true)
const sucesso = ref(false)

onMounted(async () => {
  // Limpa erros de tentativas anteriores antes de começar
  store.limparEstados()
  
  const token = route.query.token as string

  if (!token) {
    store.erro = 'Token de confirmação não encontrado na URL.'
    carregando.value = false
    return
  }

  try {
    // Dispara a action do Pinia que faz a requisição para o Flask
    await store.confirmarToken(token)
    sucesso.value = true
  } catch (error) {
    sucesso.value = false
    console.error("Erro na validação do token:", error)
  } finally {
    // Garante que o loading pare independente de ter dado certo ou errado
    carregando.value = false
  }
})
</script>