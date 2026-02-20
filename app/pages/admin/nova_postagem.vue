<template>
  <v-app>
    <MenuLateral />

    <v-main>
      <v-container fluid class="pa-4 pa-sm-8">
        <v-card-text class="text-h5 font-weight-bold text-center text-sm-left ms-6 mt-n16 mb-2">
          Nova Postagem
        </v-card-text>

        <v-row class="ms-6 me-6">
          <v-col cols="12" md="6">
            <v-text-field clearable label="Título da Postagem" variant="outlined" density="compact"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="Data da Postagem" type="date" variant="outlined" density="compact"></v-text-field>
          </v-col>

          <v-col cols="12" md="6" class="mt-n3">
            <v-text-field clearable label="Autor" variant="outlined" density="compact"></v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="mt-n3">
            <v-combobox
              clearable
              label="Hashtags"
              variant="outlined"
              density="compact"
              multiple
              chips
              placeholder="Digite e aperte Enter"
            ></v-combobox>
          </v-col>

          <v-col cols="12" md="4">
            <v-sheet
              border="dashed md"
              color="grey-lighten-4"
              min-height="300"
              class="d-flex flex-column align-center justify-center position-relative rounded-lg cursor-pointer hover-effect"
              @click="$refs.fileInput.click()"
            >
              <v-icon size="40" color="#7B5CFF" class="mb-2">mdi-cloud-upload</v-icon>
              <span class="text-subtitle-2 font-weight-bold text-center px-2">Clique para enviar a capa</span>
              
              <v-img v-if="urlPreview" :src="urlPreview" cover class="position-absolute rounded-lg w-100 h-100">
                <div class="d-flex justify-end pa-2">
                  <v-btn icon="mdi-close" size="x-small" color="red" @click.stop="limparFoto"></v-btn>
                </div>
              </v-img>

              <v-file-input ref="fileInput" v-model="foto" accept="image/*" class="d-none" @change="gerarPreview"></v-file-input>
            </v-sheet>
          </v-col>

          <v-col cols="12" md="8">
            <v-textarea
              clearable
              label="Conteúdo do Post"
              variant="outlined"
              auto-grow
              rows="11"
              max-rows="10"
              color="#7B5CFF"
            ></v-textarea>
          </v-col>

          <v-col cols="12" class="d-flex flex-column flex-sm-row justify-end ga-4 mt-4">
            <v-btn variant="text" color="grey" class="order-last order-sm-first">Cancelar</v-btn>
            <v-btn color="#7B5CFF" theme="dark" elevation="2" min-width="150">Publicar</v-btn>
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

<style scoped>
.hover-effect {
  transition: 0.3s;
  cursor: pointer;
}
.hover-effect:hover {
  background-color: #f3efff !important;
  border-color: #7B5CFF !important;
}
</style>