<template>
  <v-app>
    <MenuLateral />

    <v-main class="main-scroll">
      <v-container fluid class="pa-4 pa-sm-8">
        <v-card-text class="fonte text-h5 font-weight-bold text-center text-sm-left ms-6 mt-n16 mb-2">
          Nova Postagem
        </v-card-text>

        <v-row class="fonte ms-6 me-6">
          <v-col cols="12" md="6">
            <v-text-field clearable v-model="titulo" label="Título da Postagem" variant="outlined" density="compact"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="data" label="Data da Postagem" type="date" variant="outlined" density="compact"></v-text-field>
          </v-col>

          <v-col cols="12" md="6" class="mt-n3">
            <v-text-field clearable v-model="autor" label="Autor" variant="outlined" density="compact"></v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="mt-n3">
            <v-combobox
              clearable
              v-model="hashtags"
              label="Hashtags"
              variant="outlined"
              density="compact"
              multiple
              chips
              placeholder="Digite e aperte Enter"
            ></v-combobox>
          </v-col>

          <v-col cols="12" md="4">
            <label class="fonte editor-label text-subtitle-2 mb-2 d-block">Capa do Post</label>
            <v-sheet
              border="dashed md"
              color="grey-lighten-4"
              min-height="300"
              class="d-flex flex-column align-center justify-center position-relative rounded-lg cursor-pointer hover-effect"
              @click="$refs.fileInput.click()"
            >
              <v-icon size="40" color="#7B5CFF" class="mb-2">mdi-cloud-upload</v-icon>
              <span class="fonte text-subtitle-2 font-weight-bold text-center px-2">Clique para enviar a capa</span>
              
              <v-img v-if="urlPreview" :src="urlPreview" cover class="position-absolute rounded-lg w-100 h-100">
                <div class="d-flex justify-end pa-2">
                  <v-btn icon="mdi-close" size="x-small" color="red" @click.stop="limparFoto"></v-btn>
                </div>
              </v-img>

              <v-file-input ref="fileInput" v-model="post" accept="image/*" class="d-none" @change="gerarPreview"></v-file-input>
            </v-sheet>
          </v-col>

          <v-col cols="12" md="8">
            <div class="editor-wrapper">
              <label class="fonte editor-label text-subtitle-2 mb-2 d-block">Conteúdo do Post</label>
              
              <QuillEditor 
                ref="meuEditor"
                v-model:content="conteudo" 
                contentType="html" 
                theme="snow"
                :options="editorOptions"
                placeholder="Escreva e estilize o conteúdo do seu post aqui..."
                @update:content="conteudo = $event"
              />
            </div>
          </v-col>

          <v-col cols="12" class="d-flex flex-column flex-sm-row justify-end ga-4 mt-4">
            <v-btn variant="text" color="grey" class="fonte order-last order-sm-first" @click="cancelar">Cancelar</v-btn>
            <v-btn color="#7B5CFF" theme="dark" elevation="2" min-width="150" class="fonte" @click="publicarPostagem">Publicar</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MenuLateral from '~/components/admin/MenuLateral.vue';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { usePostagemStore } from '~/stores/postsStore';
import { useAlertStore } from "~/stores/alert"

const router = useRouter()

definePageMeta({
  middleware: 'auth'
})

const postagemStore = usePostagemStore()
const alertStore = useAlertStore()
const titulo = ref('')
const data = ref(new Date().toISOString().substr(0, 10)) 
const autor = ref('')
const hashtags = ref<string[]>([])
const conteudo = ref('')
const post = ref<File | null>(null)
const urlPreview = ref<string | null>(null)

const meuEditor = ref<any>(null)

const imageHandler = () => {
  const input = document.createElement('input')
  input.setAttribute('type', 'file')
  input.setAttribute('accept', 'image/*')
  input.click()

  input.onchange = async () => {
    const file = input.files?.[0]
    if (!file) return

    try {
      alertStore.showSuccess("Enviando imagem, por favor aguarde...")

      const urlDaImagemSalva = await postagemStore.uploadImagem(file)

      const quill = meuEditor.value.getQuill()
      const range = quill.getSelection()
      const posicaoCursor = range ? range.index : quill.getLength()

      quill.insertEmbed(posicaoCursor, 'image', urlDaImagemSalva)
      quill.setSelection(posicaoCursor + 1)

    } catch (error: any) {
      console.error("Erro no upload da imagem interna:", error)
      alertStore.showError("Falha ao subir imagem interna do texto. Tente novamente.")
    }
  }
}

const editorOptions = {
  theme: 'snow',
  modules: {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],       
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],    
        ['link', 'image', 'video'], 
        ['clean']                                        
      ],
      handlers: {
        image: imageHandler
      }
    }
  }
}

const gerarPreview = (event: any) => {
  const file = event.target.files[0]
  if (file) {
    post.value = file
    urlPreview.value = URL.createObjectURL(file)
  }
}

const limparFoto = () => {
  post.value = null
  urlPreview.value = null
}

const publicarPostagem = async () => {
  const textoLimpo = conteudo.value 
    ? conteudo.value.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, '').trim() 
    : '';

  if (!titulo.value || !textoLimpo || !autor.value) {
    alertStore.showError("Por favor, preencha os campos obrigatórios (Título, Autor e Conteúdo).")
    return
  }

  try {
    const payload = {
      titulo: titulo.value,
      data: data.value,
      autor: autor.value,
      hashtags: hashtags.value.join(', '), 
      conteudo: conteudo.value,
      post: post.value
    }

    await postagemStore.criarPost(payload)
    alertStore.showSuccess("Postagem publicada com sucesso!")
    router.push('/admin/dashboard') 

  } catch (error: any) {
    console.error("Erro ao publicar:", error)
    alertStore.showError(postagemStore.error || "Ocorreu um erro ao publicar a postagem.")
  }
}

const cancelar = () => {
  if (confirm("Deseja descartar as alterações?")) {
    router.back()
  }
}
</script>

<style scoped>
html, body, #__nuxt, #app {
  height: 100%;
  margin: 0;
}

.fonte {
  font-family: 'Georgia', serif !important;
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

.editor-wrapper :deep(.ql-editor p:has(img)) {
  margin-bottom: 0.25rem !important;
}

.editor-wrapper :deep(.ql-editor img) {
  display: block;
  margin: 1.5rem auto 0.25rem auto;
  border-radius: 8px;
  max-width: 100%;
  height: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.editor-wrapper :deep(.ql-editor p:has(img) + p em) {
  display: block;
  text-align: center;
  color: #757575 !important;
  font-size: 0.85rem !important;
  margin-top: 0px;
  margin-bottom: 1.5rem;
}

.editor-wrapper :deep(.ql-editor .ql-video) {
  display: block;
  margin: 1.5rem auto;
  border-radius: 8px;
  max-width: 100%;
  aspect-ratio: 16 / 9;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.editor-wrapper :deep(.ql-container) {
  position: relative;
}

.editor-wrapper :deep(.ql-snow .ql-tooltip) {
  z-index: 1000 !important;
  background-color: #ffffff !important;
  border: 1px solid #7B5CFF !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15) !important;
  padding: 8px 12px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
}

.editor-wrapper :deep(.ql-snow .ql-tooltip input[type=text]) {
  background-color: #ffffff !important;
  color: #333333 !important;
  border: 1px solid rgba(0, 0, 0, 0.2) !important;
  border-radius: 4px !important;
  padding: 4px 8px !important;
  font-size: 0.9rem !important;
  outline: none !important;
}

.editor-wrapper :deep(.ql-snow .ql-tooltip input[type=text]:focus) {
  border-color: #7B5CFF !important;
}

.editor-wrapper :deep(.ql-snow .ql-tooltip a.ql-action::after) {
  content: 'Salvar' !important;
  font-weight: bold;
  color: #7B5CFF !important;
}

.editor-wrapper :deep(.ql-snow .ql-tooltip a.ql-remove::before) {
  content: 'Remover' !important;
  color: #ff5252 !important;
}
</style>