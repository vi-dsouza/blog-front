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
              clearable
              hide-selected
            >
              <template v-slot:chip="{ props, item }">
                <v-chip
                  v-bind="props"
                  color="#7B5CFF"
                  variant="flat"
                  text-color="white"
                  closable
                >
                  {{ item.title }}
                </v-chip>
              </template>
            </v-combobox>
          </v-col>

          <v-col cols="12">
            <v-sheet
              border="dashed md"
              color="grey-lighten-4"
              min-height="250"
              class="d-flex flex-column align-center justify-center position-relative rounded-lg cursor-pointer hover-effect overflow-hidden"
              @click="acionarInputArquivo"
            >
              <template v-if="!urlPreview">
                <v-icon size="40" color="#7B5CFF" class="mb-2">mdi-cloud-upload</v-icon>
                <span class="text-subtitle-2 font-weight-bold text-center px-2">Clique para enviar o banner</span>
              </template>
              
              <v-img v-if="urlPreview" :src="urlPreview" cover class="position-absolute rounded-lg w-100 h-100">
                <div class="d-flex justify-end pa-2">
                  <v-btn icon="mdi-close" size="x-small" color="red" elevation="2" @click.stop="limparFoto"></v-btn>
                </div>
              </v-img>

              <v-file-input 
                ref="fileInput" 
                v-model="foto" 
                accept="image/*" 
                class="d-none" 
                @update:model-value="gerarPreview"
              ></v-file-input>
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
            <v-btn variant="text" color="grey" class="order-last order-sm-first" @click="carregarDadosIniciais">Cancelar</v-btn>
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
import { ref, onMounted } from 'vue'
import MenuLateral from '~/components/admin/MenuLateral.vue';
import { useConfiguracaoStore } from '~/stores/configStore'

const configStore = useConfiguracaoStore()
const fileInput = ref<any>(null)

// Refs reativas
const nome_blog = ref('')
const data_atualizacao = ref('')
const autor = ref('')
const tags_selecionadas = ref<string[]>([])
const descricao_blog = ref('')
const foto = ref<File | null>(null)
const urlPreview = ref<string | null>(null)

const acionarInputArquivo = () => {
  if (fileInput.value) {
    const el = fileInput.value.$el.querySelector('input')
    if (el) el.click()
  }
}

const gerarPreview = (arquivo: any) => {
  const file = Array.isArray(arquivo) ? arquivo[0] : arquivo
  if (file) {
    foto.value = file;
    if (urlPreview.value?.startsWith('blob:')) URL.revokeObjectURL(urlPreview.value);
    urlPreview.value = URL.createObjectURL(file);
  }
}

const limparFoto = () => {
  if (urlPreview.value?.startsWith('blob:')) URL.revokeObjectURL(urlPreview.value);
  foto.value = null
  urlPreview.value = null
}

const handleSalvar = async () => {
  if (!nome_blog.value || !autor.value || !data_atualizacao.value) {
    alert('Preencha os campos obrigatórios!')
    return
  }

  try {
    // Criamos o objeto de carga (payload)
    await configStore.criarConfig({
      nome_blog: nome_blog.value,
      data_atualizacao: data_atualizacao.value,
      autor: autor.value,
      tags_do_blog: tags_selecionadas.value.join(','),
      descricao_blog: descricao_blog.value,
      banner: foto.value // Se 'foto.value' for null, a Store não deve enviar esse campo ou enviar vazio
    })
    
    alert('Configurações atualizadas com sucesso!')
    await carregarDadosIniciais() // Recarrega para garantir sincronia com o banco
  } catch (e) {
    alert('Erro ao salvar configurações.')
  }
}

const carregarDadosIniciais = async () => {
    const dados = await configStore.carregarConfig();
    
    if (dados) {
        nome_blog.value = dados.nome_blog;
        autor.value = dados.autor;
        data_atualizacao.value = dados.data_atualizacao;
        descricao_blog.value = dados.descricao_blog;
        tags_selecionadas.value = dados.tags_do_blog ? dados.tags_do_blog.split(',') : [];

        if (dados.banner_url) {
            // URL ajustada para buscar na pasta raiz config_blog do servidor
            urlPreview.value = `http://localhost:5000/config_blog/${dados.banner_url}`;
        } else {
            urlPreview.value = null;
        }
    }
}

onMounted(() => {
  carregarDadosIniciais()
})
</script>

<style scoped>
.main-scroll { height: 100vh; overflow-y: auto; }
.hover-effect { transition: 0.3s; }
.hover-effect:hover { background-color: #f3efff !important; border-color: #7B5CFF !important; }
</style>
