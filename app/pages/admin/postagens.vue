<template>
  <v-app>
    <MenuLateral />

    <v-main class="main-scroll">
      <v-container fluid class="pa-4 pa-sm-8">
        
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
                  :src="`http://localhost:5000/posts_image/${item.post_url}`"
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
                  <v-hover v-slot="{ isHovering, props }">
                    <v-card
                      v-bind="props"
                      border="dashed md"
                      class="d-flex align-center justify-center cursor-pointer position-relative"
                      height="200"
                      @click="$refs.fileInput.click()"
                    >
                      <v-img v-if="previewImagem || editItem.post_url" 
                        :src="previewImagem || `http://localhost:5000/posts_image/${editItem.post_url}`" 
                        cover class="w-100 h-100 rounded-lg" 
                      />
                      <v-overlay :model-value="isHovering" scrim="#7B5CFF" contained class="align-center justify-center">
                        <v-icon color="white" size="48">mdi-camera-flip</v-icon>
                      </v-overlay>
                      <v-file-input ref="fileInput" class="d-none" accept="image/*" @change="tratarUploadFoto" />
                    </v-card>
                  </v-hover>
                </v-col>

                <v-col cols="12" md="8">
                  <v-textarea v-model="editItem.conteudo" label="Conteúdo" variant="outlined" rows="7" auto-grow />
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-actions class="justify-end px-6 pb-4">
              <v-btn variant="text" color="grey" @click="modalEdicao = false">Cancelar</v-btn>
              <v-btn color="#7B5CFF" theme="dark" elevation="2" min-width="120" :loading="postStore.loading" @click="salvarEdicao">
                Salvar Alterações
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

const postStore = usePostagemStore()
const search = ref('')
const items = ref<any[]>([])

// Controle do Modal e Item em Edição
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
  { title: 'Ações', key: 'acao', sortable: false, align: 'end' },
]

// CARREGAR POSTS
const carregarPosts = async () => {
  const data = await postStore.carregarPosts()
  if (data) items.value = Array.isArray(data) ? data : [data]
}

onMounted(carregarPosts)

// ABRIR MODAL COM DADOS
const abrirEdicao = (item: any) => {
  editItem.value = { ...item } // Copia os dados para não alterar a tabela antes de salvar
  previewImagem.value = null
  arquivoNovaFoto.value = null
  modalEdicao.value = true
}

// TRATAR UPLOAD DE FOTO NO MODAL
const tratarUploadFoto = (event: any) => {
  const file = event.target.files[0]
  if (file) {
    arquivoNovaFoto.value = file
    previewImagem.value = URL.createObjectURL(file)
  }
}

// SALVAR EDIÇÃO
const salvarEdicao = async () => {
  try {
    const payload = {
      ...editItem.value,
      post: arquivoNovaFoto.value // Se for null, o service manterá a antiga
    }

    await postStore.atualizarPost(editItem.value.id, payload)
    modalEdicao.value = false
    alert("Postagem atualizada com sucesso!")
    await carregarPosts()
  } catch (error) {
    alert("Erro ao atualizar postagem.")
  }
}

// DELETAR
const confirmarDeletar = async (item: any) => {
  if (confirm(`Deseja deletar "${item.titulo}"?`)) {
    await postStore.deletarPost(item.id)
    await carregarPosts()
  }
}
</script>