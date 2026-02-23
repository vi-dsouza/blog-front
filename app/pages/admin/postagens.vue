<template>
  <v-app>
    <MenuLateral />

    <v-main class="main-scroll">
      <v-container fluid class="pa-4 pa-sm-8">
        
        <v-card-text class="text-h5 font-weight-bold text-center text-sm-left ms-6 mt-n16 mb-2">
          Postagens
        </v-card-text>

        <v-card flat>
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
            <v-spacer></v-spacer>
          </v-card-title>
          <br />
          <v-divider></v-divider>

          <v-data-table
            v-model:search="search"
            :headers="headers"
            :items="items"
            item-value="name"
          >

            <!-- IMAGEM -->
            <template v-slot:item.image="{ item }">
              <v-img
                :src="`https://cdn.vuetifyjs.com/docs/images/graphics/gpus/${item.image}`"
                height="64"
                width="100"
                cover
                class="rounded"
              />
            </template>

            <!-- AÇÕES -->
            <template v-slot:item.acao="{ item }">
            <div class="d-flex gap-2">
                <!-- Botão Editar -->
                <v-btn
                icon="mdi-pencil"
                size="small"
                color="primary"
                variant="text"
                @click="editarPost(item)"
                />

                <!-- Botão Deletar -->
                <v-btn
                icon="mdi-delete"
                size="small"
                color="error"
                variant="text"
                @click="deletarPost(item)"
                />
            </div>
            </template>

          </v-data-table>
        </v-card>

      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MenuLateral from '~/components/admin/MenuLateral.vue'

const search = ref('')

const headers = [
  { title: 'Imagem', key: 'image' },
  { title: 'Título', key: 'nome' },
  { title: 'Categoria', key: 'categoria' },
  { title: 'Curtidas', key: 'curtidas' },
  { title: 'Ações', key: 'acao' },
]

const items = [
  {
    nome: 'Nebula GTX 3080',
    image: '1.png',
    categoria: 699.99,
    curtidas: 5,
    stock: true,
  },
  {
    nome: 'Galaxy RTX 3080',
    image: '2.png',
    categoria: 799.99,
    curtidas: 4,
    stock: false,
  },
  {
    nome: 'Orion RX 6800 XT',
    image: '3.png',
    categoria: 649.99,
    curtidas: 3,
    stock: true,
  },
  {
    nome: 'Vortex RTX 3090',
    image: '4.png',
    categoria: 1499.99,
    curtidas: 4,
    stock: true,
  },
  {
    nome: 'Cosmos GTX 1660 Super',
    image: '5.png',
    categoria: 299.99,
    curtidas: 4,
    stock: false,
  },
]

const editarPost = (post: any) => {
  console.log('Editar:', post)
  // Aqui você pode:
  // - abrir um modal
  // - navegar para /admin/postagens/editar/:id
}

const deletarPost = (post: any) => {
  const confirmar = confirm(`Deseja deletar a postagem "${post.nome}"?`)
  if (!confirmar) return

  console.log('Deletar:', post)
  // Aqui você pode:
  // - chamar API
  // - remover da lista
}

</script>

<style>
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
</style>