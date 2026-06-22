<template>
  <v-main>
    <Banner />
    <Tags />
    <Descricao />

    <v-row cols="12" class="pa-4 ma-1" justify="space-around">

      <v-col cols="3" class="d-flex flex-column gap-4 "> 
        <v-card title="Escolha um tema" elevation="2" class="pa-4 rounded-lg">
          <v-chip
            v-for="(tag, index) in tags"
            :key="`${tag}-${index}`"
            class="ma-2"
          >
            {{ tag }}
          </v-chip>
        </v-card>

        <br>

        <v-card title="Sobre a autora" elevation="2" class="pa-2 rounded-lg">
          <v-row v-if="autores.length > 0" class="pa-2 d-flex align-center" justify="center">
            <v-col cols="3" sm="auto" class="d-flex flex-column align-center justify-center gap-3">
              <v-avatar size="100" style="border: 3px solid #7B5CFF;">
                <v-img :src="autores[0].foto_url" alt="Foto da autora" cover></v-img>
              </v-avatar>
              
              <p class="text-subtitle-1 font-weight-bold text-grey-darken-4 text-center lh-tight">
                {{ autores[0].nome }}
              </p>
            </v-col>
            <br>
            <v-col cols="7" sm="grow" class="d-flex flex-column gap-2">
              <v-card-text class="text-body-2 text-center text-sm-left pa-0 text-grey-darken-1 lh-relaxed">
                {{ autores[0].biografia || 'Nenhuma biografia informada.' }}
              </v-card-text>
            </v-col>

          </v-row>

          <v-row v-else class="pa-4 justify-center">
            <span class="text-caption text-grey">Carregando informações da autora...</span>
          </v-row>
        </v-card>

        <br>

        <v-card elevation="2" class="pa-4 rounded-lg">
          <Inscricao />
        </v-card>

      </v-col>

      <v-col cols="8" class="d-flex flex-column gap-4 coluna-conteudo">
        <v-autocomplete
          v-model="postSelecionado"
          clearable
          placeholder="O que você procura?" 
          :items="postsLista"
          item-title="titulo"
          item-value="id"
          return-object
          variant="solo-inverted"
          prepend-inner-icon="mdi-magnify"
          density="compact"
          hide-details
          class="busca-custom" >
          <template v-slot:selection="{ item }">
            <div class="text-body-1 text-truncate">
              {{ item.title }}
            </div>
          </template>
        </v-autocomplete>
        
        <PostDestaque v-if="!postSelecionado" class="mb-6 mt-12"/>
        <v-divider v-if="!postSelecionado" class="my-1 pb-6 mt-8" thickness="2" style="width: 100%;"></v-divider>
        
        <Posts :filtro-titulo="postSelecionado?.titulo" class="mb-2 mt-10"/>
      </v-col>
    </v-row>

  </v-main>
  <Footer />
</template>

<script setup lang="ts">
import Banner from '@/components/Banner.vue';
import Tags from '@/components/Tags.vue';
import Descricao from '@/components/Descricao.vue';
import PostDestaque from '@/components/Post_destaque.vue';
import Inscricao from '@/components/Inscricao.vue';
import Posts from '@/components/Posts.vue';
import Footer from '@/components/Footer.vue';

import { ref, onMounted } from 'vue'
import { useConfiguracaoStore } from '@/stores/configStore'
import { usePostagemStore } from '@/stores/postsStore'
import { useAdminStore } from '@/stores/adminStore';

const configStore = useConfiguracaoStore()
const postagemStore = usePostagemStore()
const adminStore = useAdminStore()

const tags = ref<string[]>([])
const autores = ref<any[]>([])
const postsLista = ref<any[]>([])
const postSelecionado = ref<any>(null)

const loadTags = async () => {
  const dados = await configStore.carregarConfigPublico()
  tags.value = dados?.tags_do_blog?.split(',') ?? []
}

const info_autor = async () => {
  try {
    await adminStore.busca_info_autores()
    autores.value = adminStore.autor || []
  } catch (error) {
    console.error("Erro ao buscar autores:", error)
  }
}

const buscaTitulos = async () => {
  try {
    const dados = await postagemStore.carregarPostsPublico()
    if (Array.isArray(dados)) {
      postsLista.value = dados
    }
  } catch (error) {
    console.error("Erro ao carregar os titulos:", error)
  }
}

onMounted(async () => {
  await Promise.all([
    loadTags(),
    info_autor(),
    buscaTitulos()
  ])
})
</script>

<style scoped>
.busca-custom :deep(.v-input__control) {
  height: 40px !important;
  min-height: 40px !important;

}

.busca-custom :deep(.v-field) {
  height: 40px !important;
  min-height: 40px !important;
  align-items: center !important;
}

.busca-custom :deep(.v-field__input) {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  min-height: 40px !important;
  height: 40px !important;
}

.coluna-conteudo {
  height: auto !important;
  min-height: min-content !important;
  align-self: flex-start !important;
}
</style>
