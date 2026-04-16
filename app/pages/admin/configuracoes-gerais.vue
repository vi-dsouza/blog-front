<template>
  <v-app>
    <MenuLateral />

    <v-main class="main-scroll">
      <v-container fluid class="pa-4 pa-sm-8">
        <v-card-text class="text-h5 font-weight-bold text-center text-sm-left ms-6 mt-n16 mb-2">
          Configurações Gerais do Blog
        </v-card-text>

        <v-row class="ms-6 me-6">
          <v-col cols="12" md="6">
            <v-text-field v-model="nome_blog" clearable label="Nome do Blog" variant="outlined" density="compact"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="data_atualizacao" label="Data da Atualização" type="date" variant="outlined" density="compact"></v-text-field>
          </v-col>

          <v-col cols="12" md="6" class="mt-n3">
            <v-text-field v-model="autor" clearable label="Autor" variant="outlined" density="compact"></v-text-field>
          </v-col>
          
          <v-col cols="12" md="6" class="mt-n3">
            <v-combobox
              v-model="tags_selecionadas"
              label="Tags do Blog"
              variant="outlined"
              density="compact"
              multiple
              chips
              clearable
              closable-chips
              hide-selected
            />
          </v-col>

          <v-col cols="12">
            <v-sheet
              border="dashed md"
              color="grey-lighten-4"
              min-height="250"
              class="d-flex flex-column align-center justify-center position-relative rounded-lg cursor-pointer hover-effect"
              @click="$refs.fileInput.click()"
            >
              <v-icon size="40" color="#7B5CFF" class="mb-2">mdi-cloud-upload</v-icon>
              <span class="text-subtitle-2 font-weight-bold text-center px-2">Clique para enviar o banner</span>
              
              <v-img v-if="urlPreview" :src="urlPreview" cover class="position-absolute rounded-lg w-100 h-100">
                <div class="d-flex justify-end pa-2">
                  <v-btn icon="mdi-close" size="x-small" color="red" @click.stop="limparFoto"></v-btn>
                </div>
              </v-img>

              <v-file-input ref="fileInput" v-model="foto" accept="image/*" class="d-none" @change="gerarPreview"></v-file-input>
            </v-sheet>
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="descricao_blog"
              clearable
              label="Descrição do Blog"
              variant="outlined"
              auto-grow
              rows="3"
              max-rows="3"
              color="#7B5CFF"
            ></v-textarea>
          </v-col>

          <v-col cols="12" class="d-flex flex-column flex-sm-row justify-end ga-4">
            <v-btn variant="text" color="grey" class="order-last order-sm-first">Cancelar</v-btn>
            <v-btn 
              color="#7B5CFF" 
              theme="dark" 
              elevation="2" 
              min-width="150" 
              :loading="configStore.loading"
              @click="handleSalvar"
            >
              Salvar
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MenuLateral from '~/components/admin/MenuLateral.vue';
import { useConfiguracaoStore } from '~/stores/configStore' // Verifique o caminho da sua store
import { onMounted } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const configStore = useConfiguracaoStore()

// Refs para o formulário
const nome_blog = ref('')
const data_atualizacao = ref('')
const autor = ref('')
const tags_selecionadas = ref<string[]>([])
const descricao_blog = ref('')
const foto = ref<File | null>(null)
const urlPreview = ref<string | null>(null)

const gerarPreview = (event: any) => {
  const file = event.target.files[0]
  if (file) {
    foto.value = file
    urlPreview.value = URL.createObjectURL(file)
  }
}

const limparFoto = () => {
  foto.value = null
  urlPreview.value = null
}

const handleSalvar = async () => {
  // 1. Tratativa de campos vazios
  // Verificamos se os campos obrigatórios estão preenchidos
  if (!nome_blog.value || !autor.value || !data_atualizacao.value || !descricao_blog.value) {
    alert('Por favor, preencha todos os campos obrigatórios!')
    return // Interrompe a execução aqui
  }

  // Opcional: Validar se há pelo menos uma tag
  if (tags_selecionadas.value.length === 0) {
    alert('Adicione pelo menos uma tag ao blog!')
    return
  }

  try {
    await configStore.criarConfig({
      nome_blog: nome_blog.value,
      data_atualizacao: data_atualizacao.value,
      autor: autor.value,
      tags_do_blog: tags_selecionadas.value.join(','),
      descricao_blog: descricao_blog.value,
      banner: foto.value // O banner costuma ser opcional, por isso não barramos acima
    })
    
    alert('Configurações salvas com sucesso!')
  } catch (e) {
    // O erro já é registrado na configStore.error
    alert(configStore.error || 'Erro ao salvar configurações.')
  }
}

onMounted(async () => {
    const dados = await configStore.carregarConfig();
    
    if (dados) {
        // Preenche os campos do formulário com o que veio do banco
        nome_blog.value = dados.nome_blog;
        autor.value = dados.autor;
        data_atualizacao.value = dados.data_atualizacao;
        descricao_blog.value = dados.descricao_blog;
        
        // Converte a string de tags "tag1,tag2" de volta para array ['tag1', 'tag2']
        tags_selecionadas.value = dados.tags_do_blog ? dados.tags_do_blog.split(',') : [];

        // Mostra o preview da imagem que já está no servidor
        if (dados.banner_url) {
            urlPreview.value = `http://localhost:5000/config_blog/${dados.banner_url}`;
        }
    }
})

</script>

<style>
    /* Faz a aplicação ocupar 100% da tela */
    html, body, #__nuxt, #app {
    height: 100%;
    margin: 0;
    }

    /* Trava o layout para não rolar tudo */
    .v-application {
    height: 100vh;
    overflow: hidden;
    }

    /* Apenas o conteúdo principal rola */
    .main-scroll {
    height: 100vh;
    overflow-y: auto;
    }
    .hover-effect {
    transition: 0.3s;
    cursor: pointer;
    }
    .hover-effect:hover {
    background-color: #f3efff !important;
    border-color: #7B5CFF !important;
    }
</style>
