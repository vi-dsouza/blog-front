<template>
  <v-main>
    <Banner />
    <Tags />
    <Descricao />

    <v-row cols="12" class="pa-4 ma-1" align="stretch" justify="space-around">
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

      <v-col cols="8" class="d-flex flex-column gap-4">
        <PostDestaque class="mb-16"/>
        <v-divider class="my-1 pb-16" thickness="2" style="width: 100%;""></v-divider>
        <Posts class="mb-16"/>
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
const autor = ref<any[]>([])

const loadTags = async () => {
  const dados = await configStore.carregarConfigPublico()
  tags.value = dados?.tags_do_blog?.split(',') ?? []
}

const info_autor = async () => {
  try {
    await adminStore.busca_info_autores()
    autores.value = adminStore.autor || []
    console.log(autores.value)
  } catch (error) {
    console.error("Erro ao buscar autores:", error)
  }
}

onMounted(async () => {
  // Carrega tudo em paralelo para melhor performance
  await Promise.all([
    loadTags(),
    info_autor(),
    postagemStore.carregarPostsPublico()
  ])
})

</script>