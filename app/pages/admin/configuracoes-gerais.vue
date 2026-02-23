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
            <v-text-field clearable label="Nome do Blog" variant="outlined" density="compact"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="Data da Atualização" type="date" variant="outlined" density="compact"></v-text-field>
          </v-col>

          <v-col cols="12" md="6" class="mt-n3">
            <v-text-field clearable label="Autor" variant="outlined" density="compact"></v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="mt-n3">
            <v-combobox
                v-model="tags"
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
            <v-btn color="#7B5CFF" theme="dark" elevation="2" min-width="150">Salvar</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import MenuLateral from '~/components/admin/MenuLateral.vue';

    const foto = ref<File | null>(null)
    const urlPreview = ref<string | null>(null)
    const tags = ref<string[]>([])

    const gerarPreview = (event: any) => {
    const file = event.target.files[0]
    if (file) {
        urlPreview.value = URL.createObjectURL(file)
    }
    }

    const limparFoto = () => {
    foto.value = null
    urlPreview.value = null
    }
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
