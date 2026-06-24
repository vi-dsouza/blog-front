<template>
  <div class="w-100">
    <v-container class="pa-0">
      <v-card-title class="fonte text-h6 text-sm-h5 px-0 pb-2">
        Gostou do blog?
      </v-card-title>
      <v-card-text class="fonte px-0 pb-4 text-body-2 text-grey-darken-1 lh-relaxed">
        Inscreva-se para receber as últimas atualizações e novidades diretamente no seu e-mail!
      </v-card-text>
      <v-card-actions class="pa-0 d-flex">
        <v-btn 
          color="secondary" 
          variant="flat"
          class="fonte w-100 w-sm-auto subscribe-button rounded-lg font-weight-bold" 
          @click="abrirModal"
        >
          Inscrever-se
        </v-btn>
      </v-card-actions>
    </v-container>

    <v-dialog v-model="dialog" max-width="450px" :persistent="store.carregando">
      <v-card class="rounded-xl" color="branco" style="border: 2px solid rgb(var(--v-theme-surface));">
        <v-card-title class="fonte text-h6 text-sm-h5 mx-2 my-0 mt-4 font-weight-bold">
          Newsletter Entre Ideias
        </v-card-title>
        <v-card-text class="fonte pt-1 px-6 pb-0 text-body-2 text-grey-darken-1">
          <p class="ma-0">Inscreva-se e fique por dentro de novos posts</p>
        </v-card-text>
        <v-divider style="margin-top: 16px;; opacity: 0.3;" color="secondary"></v-divider>
        
        <v-card-text class="pa-4 pa-sm-6">
          <v-alert v-if="store.erro" type="error" variant="tonal" class="mb-4 text-caption text-sm-body-2" closable>
            {{ store.erro }}
          </v-alert>

          <div v-if="store.sucesso" class="text-center py-4">
            <v-icon color="success" size="56" class="fonte mb-2">mdi-email-check-outline</v-icon>
            <h3 class="fonte text-h6 font-weight-bold mb-1">Quase lá!</h3>
            <p class="fonte text-body-2 text-grey-darken-1">
              Enviamos um link de confirmação para o seu e-mail. Acesse-o para ativar sua inscrição.
            </p>
          </div>

          <v-form v-else ref="formRef">
            <v-text-field 
              label="Nome" 
              v-model="form.nome" 
              variant="outlined" 
              density="comfortable"
              required 
              class="fonte mb-3"
              :disabled="store.carregando"
            ></v-text-field>
            
            <v-text-field 
              label="E-mail" 
              v-model="form.email" 
              type="email" 
              variant="outlined" 
              density="comfortable"
              required
              class="fonte mb-2"
              :disabled="store.carregando"
            ></v-text-field>
            
            <div style="display: none !important;" aria-hidden="true">
              <input type="text" name="sobrenome" v-model="form.sobrenome" autocomplete="off" tabindex="-1">
            </div>

            <v-checkbox 
              color="indigo" 
              hide-details 
              v-model="form.consentimento_lgpd"
              :disabled="store.carregando"
            >
              <template v-slot:label>
                <div class="fonte text-caption leading-tight text-grey-darken-2">
                  Aceito receber novidades e posts do Entre Ideias de acordo com a 
                  <a 
                    href="/TermosCondicoes" 
                    target="_blank" 
                    @click.stop 
                    style="color: #3f51b5; text-decoration: underline;"
                  >
                    Política de Privacidade
                  </a>.
                </div>
              </template>
            </v-checkbox>
          </v-form>
        </v-card-text>
        
        <v-card-actions class="pa-4 pt-0 d-flex gap-2">
          <v-spacer></v-spacer>
          
          <template v-if="store.sucesso">
            <v-btn color="primary" variant="flat" class="px-6 rounded-lg" @click="dialog = false">Fechar</v-btn>
          </template>
          <template v-else>
            <v-btn variant="text" class="fonte rounded-lg" @click="dialog = false" :disabled="store.carregando">Cancelar</v-btn>
            <v-btn 
              color="secondary" 
              variant="flat"
              class="fonte px-4 rounded-lg"
              @click="enviarInscricao"
              :loading="store.carregando"
              :disabled="!form.nome || !form.email || !form.consentimento_lgpd"
            >
              Me inscrever
            </v-btn>
          </template>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useInscritosStore } from '~/stores/inscricaoStore'

const dialog = ref(false)
const store = useInscritosStore()

const form = ref({
  nome: '',
  sobrenome: '',
  email: '',
  consentimento_lgpd: false,
})

const abrirModal = () => {
    store.limparEstados()
    form.value = { nome: '', sobrenome: '', email: '', consentimento_lgpd: false }
    dialog.value = true
}

const enviarInscricao = async () => {
    try {
        await store.realizarInscricao(form.value)
    } catch (error) {
        console.error("Falha no cadastro:", error)
    }
}
</script>

<style>
.fonte{
  font-family: 'Georgia', serif !important;
}
</style>