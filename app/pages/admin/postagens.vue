<template>
  <v-app theme="light">
    <MenuLateral />

    <v-main class="main-scroll">
      <v-container fluid class="pa-4 pa-sm-8" >
        
        <v-card-text class="text-h5 font-weight-bold text-center text-sm-left ms-6 mt-n16 mb-2">
          Postagens
        </v-card-text>

        <v-card flat border class="mx-6">
          <v-card-title class="d-flex align-center pe-2">
            <v-text-field
              v-model="search"
              density="compact"
              label="Buscar por título"
              prepend-inner-icon="mdi-magnify"
              variant="solo-filled"
              flat
              hide-details
              single-line
            />
          </v-card-title>

          <v-data-table
            :headers="headers"
            :items="items"
            :search="search"
            :loading="postStore.loading"
            no-data-text="Nenhuma postagem encontrada"
          >
            <template v-slot:item.post_url="{ item }">
              <v-avatar size="60" rounded="lg" class="my-2 border">
                <v-img
                  v-if="item.post_url"
                  :src="item.post_url"
                  cover
                />
                <v-icon v-else icon="mdi-image-off" color="grey-lighten-1"></v-icon>
              </v-avatar>
            </template>

            <template v-slot:item.acao="{ item }">
              <div class="d-flex ga-2">
                <v-btn icon="mdi-pencil" size="small" color="#7B5CFF" variant="text" @click="abrirEdicao(item)" />
                <v-btn icon="mdi-delete" size="small" color="error" variant="text" @click="confirmarDeletar(item)" />
              </div>
            </template>
          </v-data-table>
        </v-card>

        <v-dialog v-model="modalEdicao" max-width="800px" persistent>
          <v-card class="rounded-xl pa-4">
            <v-card-title class="text-h5 font-weight-bold d-flex justify-space-between align-center">
              Editar Postagem
              <v-btn icon="mdi-close" variant="text" @click="modalEdicao = false"></v-btn>
            </v-card-title>
            
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field v-model="editItem.titulo" label="Título" variant="outlined" density="compact" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="editItem.data" label="Data" type="date" variant="outlined" density="compact" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="editItem.autor" label="Autor" variant="outlined" density="compact" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="editItem.hashtags" label="Hashtags (separadas por vírgula)" variant="outlined" density="compact" />
                </v-col>
                
                <v-col cols="12" md="4">
                  <label class="editor-label text-subtitle-2 mb-2 d-block">Capa do Post</label>
                  <v-sheet
                    border="dashed md"
                    color="grey-lighten-4"
                    min-height="200"
                    class="d-flex flex-column align-center justify-center position-relative rounded-lg cursor-pointer hover-effect overflow-hidden"
                    @click="$refs.fileInput.click()"
                  >
                    <template v-if="!(previewImagem || editItem.post_url)">
                      <v-icon size="40" color="#7B5CFF" class="mb-2">mdi-cloud-upload</v-icon>
                      <span class="text-subtitle-2 font-weight-bold text-center px-2">
                        Clique para enviar a imagem
                      </span>
                    </template>
                    
                    <v-img 
                      v-if="previewImagem || editItem.post_url"
                      :src="previewImagem || editItem.post_url"
                      cover
                      class="position-absolute rounded-lg w-100 h-100"
                    >
                      <div class="d-flex justify-end pa-2">
                        <v-btn 
                          icon="mdi-close" 
                          size="x-small" 
                          color="red" 
                          elevation="2" 
                          @click.stop="limparImagem"
                        />
                      </div>
                    </v-img>

                    <v-file-input 
                      ref="fileInput" 
                      class="d-none" 
                      accept="image/*" 
                      @change="tratarUploadFoto" 
                    />
                  </v-sheet>
                </v-col>

                <v-col cols="12" md="8">
                  <div class="editor-wrapper">
                    <label class="editor-label text-subtitle-2 mb-2 d-block">Conteúdo do Post</label>
                    
                    <QuillEditor 
                      v-model:content="editItem.conteudo" 
                      contentType="html" 
                      theme="snow"
                      placeholder="Escreva e estilize o conteúdo do seu post aqui..."
                    />
                  </div>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-actions class="justify-end px-6 pb-4">
              <v-btn variant="text" color="grey" @click="modalEdicao = false">Cancelar</v-btn>
              <v-btn color="#7B5CFF" variant="flat" class="text-white" elevation="2" min-width="120" :loading="postStore.loading" @click="salvarEdicao" >
                Salvar Alterações
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="modalDelete" max-width="450">
          <v-card >
            <v-toolbar flat color="#7B5CFF">
              <v-toolbar-title class="text-white font-weight-bold">
                Confirmar exclusão
              </v-toolbar-title>
              <v-btn
                icon="mdi-close"
                variant="text"
                class="text-white"
                @click="modalDelete = false"
              />
            </v-toolbar>

            <v-card-text class=" pt-4">
              Tem certeza que deseja excluir o post
              <strong>"{{ postParaDeletar?.titulo }}"</strong>?
            </v-card-text>

            <v-card-actions class="justify-end pb-4 px-4">
              <v-btn variant="text" color="grey" @click="modalDelete = false">
                Cancelar
              </v-btn>
              <v-btn
                color="red"
                variant="flat"
                class="text-white"
                @click="deletarPostConfirmado"
              >
                Excluir
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MenuLateral from '~/components/admin/MenuLateral.vue'
import { usePostagemStore } from '~/stores/postsStore'
import { useAlertStore } from "~/stores/alert"

// IMPORTAÇÕES DO QUILL EDITOR ADICIONADAS AQUI
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const postStore = usePostagemStore()
const search = ref('')
const items = ref<any[]>([])

const modalDelete = ref(false)
const postParaDeletar = ref<any>(null)

const alertStore = useAlertStore()
const modalEdicao = ref(false)
const previewImagem = ref<string | null>(null)
const arquivoNovaFoto = ref<File | null>(null)
const editItem = ref({
  id: 0,
  titulo: '',
  data: '',
  autor: '',
  hashtags: '',
  conteudo: '',
  post_url: ''
})

const headers = [
  { title: 'Capa', key: 'post_url', sortable: false },
  { title: 'Título', key: 'titulo' },
  { title: 'Autor', key: 'autor' },
  { title: 'Data', key: 'data' },
  { title: 'Ações', key: 'acao', sortable: false},
]

const carregarPosts = async () => {
  const data = await postStore.carregarPosts()
  if (data) items.value = Array.isArray(data) ? data : [data]
}

onMounted(carregarPosts)

const abrirEdicao = (item: any) => {
  editItem.value = { ...item } 
  previewImagem.value = null
  arquivoNovaFoto.value = null
  modalEdicao.value = true
}

const tratarUploadFoto = (event: any) => {
  const file = event.target.files[0]
  if (file) {
    arquivoNovaFoto.value = file
    previewImagem.value = URL.createObjectURL(file)
  }
}

const salvarEdicao = async () => {
  try {
    const payload = {
      ...editItem.value,
      post: arquivoNovaFoto.value 
    }

    await postStore.atualizarPost(editItem.value.id, payload)
    modalEdicao.value = false
    alertStore.showSuccess("Postagem actualizada com sucesso!")
    await carregarPosts()
  } catch (error) {
    alertStore.showError("Erro ao atualizar postagem.")
  }
}

const limparImagem = () => {
  previewImagem.value = null
  arquivoNovaFoto.value = null
  editItem.value.post_url = ''
}

const confirmarDeletar = (item: any) => {
  postParaDeletar.value = item
  modalDelete.value = true
}

const deletarPostConfirmado = async () => {
  if (!postParaDeletar.value) return
  await postStore.deletarPost(postParaDeletar.value.id)
  modalDelete.value = false
  postParaDeletar.value = null
  await carregarPosts()
  alertStore.showSuccess("Postagem deletada com sucesso!")
}
</script>

<style scoped>
html, body, #__nuxt, #app {
  height: 100%;
  margin: 0;
}

.v-application {
  height: 100vh;
  overflow: hidden;
}

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

.editor-wrapper {
  --quill-color: #7B5CFF;
}

.editor-label {
  color: var(--quill-color);
  font-weight: 600;
}

.editor-wrapper :deep(.ql-container.ql-snow) {
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  border-color: rgba(0, 0, 0, 0.22);
  font-size: 1rem;
  height: 250px; 
  overflow-y: auto; 
}

.editor-wrapper :deep(.ql-toolbar.ql-snow) {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border-color: rgba(0, 0, 0, 0.22);
  background-color: #fafafa;
}

.editor-wrapper :deep(.ql-container:focus-within),
.editor-wrapper :deep(.ql-toolbar:focus-within) {
  border-color: var(--quill-color) !important;
}
</style>