<template>
    <v-main>
        <v-container class="pa-2">
            <v-card-title>
                Gostou do blog?
            </v-card-title>
            <v-card-text>
                Inscreva-se para receber as últimas atualizações e novidades diretamente no seu e-mail!
            </v-card-text>
            <v-card-actions class="d-flex">
                <v-btn color="primary" class="ma-2 subscribe-button" @click="abrirModal">Inscrever-se</v-btn>
            </v-card-actions>
        </v-container>
    
        <v-dialog v-model="dialog" max-width="450px" :persistent="store.carregando">
            <v-card>
                <v-card-title class="text-h5 mx-2 my-0 mt-2">
                    Newsletter Entre Ideias
                </v-card-title>
                <v-card-text class="pt-2 px-6 pb-0">
                    <p class="ma-0">Inscreva-se e fique por dentro de novos posts</p>
                </v-card-text>
                <v-divider style="margin-top: 16px; border-color: #2196F3; height: 10px;"></v-divider>
                
                <v-card-text class="pa-6">
                    <v-alert v-if="store.erro" type="error" variant="tonal" class="mb-4" closable>
                        {{ store.erro }}
                    </v-alert>

                    <div v-if="store.sucesso" class="text-center py-4">
                        <v-icon color="success" size="64" class="mb-2">mdi-email-check-outline</v-icon>
                        <h3 class="text-h6 font-weight-bold mb-1">Quase lá!</h3>
                        <p class="text-body-2 text-grey-darken-1">
                            Enviamos um link de confirmação para o seu e-mail. Acesse-o para ativar sua inscrição.
                        </p>
                    </div>

                    <v-form v-else ref="formRef">
                        <v-text-field 
                            label="Nome" 
                            v-model="form.nome" 
                            variant="outlined" 
                            required 
                            class="mb-4"
                            :disabled="store.carregando"
                        ></v-text-field>
                        
                        <v-text-field 
                            label="E-mail" 
                            v-model="form.email" 
                            type="email" 
                            variant="outlined" 
                            required
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
                            <div class="text-caption">
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
                
                <v-card-actions class="pa-4 d-flex gap-2">
                    <v-spacer></v-spacer>
                    
                    <template v-if="store.sucesso">
                        <v-btn color="primary" variant="flat" @click="dialog = false">Fechar</v-btn>
                    </template>
                    <template v-else>
                        <v-btn variant="text" @click="dialog = false" :disabled="store.carregando">Cancelar</v-btn>
                        <v-btn 
                            color="primary" 
                            style="border: 1px solid" 
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
    </v-main>
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

// Abre o modal limpando os estados antigos da store
const abrirModal = () => {
    store.limparEstados()
    form.value = { nome: '', sobrenome: '', email: '', consentimento_lgpd: false }
    dialog.value = true
}

// Dispara a ação da store
const enviarInscricao = async () => {
    try {
        await store.realizarInscricao(form.value)
        // Mantemos o modal aberto para mostrar a mensagem de sucesso do double opt-in
    } catch (error) {
        // O erro já é tratado e exibido automaticamente pela store no <v-alert>
        console.error("Falha no cadastro:", error)
    }
}
</script>

<style scoped>
/* Seus estilos CSS permanecem idênticos aqui... */
</style>