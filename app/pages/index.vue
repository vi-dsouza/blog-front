<template>
  <v-main style="background: rgb(var(--v-theme-preto));">
    <Banner />
    <Tags />
    <Descricao />
    
    <v-row class="pa-2 ma-1 pt-0 justify-center" style="gap: 20px;">
      
      <v-col cols="12" md="3" class="d-contents d-md-flex flex-column gap-4 pt-2"> 
        
        <v-card 
          elevation="0" 
          width="94%" 
          class="fonte pa-4 rounded-xl mt-md-10 order-1 order-md-1 mb-6"
          style="
            background: rgba(47, 47, 56, 0.4) !important; 
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(234, 168, 81, 0.15);
          "
        >
          <p class="text-subtitle-1 font-weight-light text-septenary mb-3 px-1" style="letter-spacing: 0.5px;">
            Escolha um tema
          </p>
          
          <v-autocomplete
            v-model="postSelecionado"
            clearable
            placeholder="O que você procura?" 
            color="primary"
            :items="postsLista"
            item-title="titulo"
            item-value="id"
            return-object
            variant="solo"
            prepend-inner-icon="mdi-magnify"
            density="compact"
            hide-details
            class="busca-custom"
            style="background: rgba(0, 0, 0, 0.25) !important; border-radius: 8px;"
          >
            <template v-slot:selection="{ item }" class="fonte">
              <div class="text-body-1 text-truncate text-septenary">
                {{ item.title }}
              </div>
            </template>
          </v-autocomplete>
        </v-card>

        <v-card 
          elevation="0" 
          width="94%" 
          class="pa-4 rounded-xl order-3 order-md-2 mt-4 mt-md-0 mb-6" 
          style="
            background: rgba(47, 47, 56, 0.4) !important; 
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(234, 168, 81, 0.15);
          "
        >
          <v-row v-if="autores.length > 0" class="pa-2 d-flex align-center" justify="center">
            <v-col cols="12" class="d-flex flex-column align-center justify-center gap-3 pb-2">
              <v-avatar size="90" style="border: 3px solid rgb(var(--v-theme-secondary));">
                <v-img :src="autores[0].foto_url" alt="Foto da autora" cover></v-img>
              </v-avatar>
              
              <p class="fonte text-subtitle-1 font-weight-light text-septenary text-center lh-tight mt-2" style="letter-spacing: 0.5px;">
                {{ autores[0].nome }}
              </p>
            </v-col>

            <v-col cols="12" class="d-flex flex-column gap-2">
              <v-card-text class="fonte text-body-2 text-center pa-0 text-septenary lh-relaxed" style="opacity: 0.75;">
                {{ autores[0].biografia || 'Nenhuma biografia informada.' }}
              </v-card-text>
            </v-col>
          </v-row>

          <v-row v-else class="pa-4 justify-center">
            <span class="text-caption text-septenary" style="opacity: 0.5;">Carregando informações da autora...</span>
          </v-row>
        </v-card>

        <v-card 
          width="94%" 
          elevation="0" 
          class="pa-4 rounded-xl order-4 order-md-3 mb-8" 
          style="
            background: rgba(47, 47, 56, 0.4) !important; 
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(234, 168, 81, 0.15);
          "
        >
          <Inscricao />
        </v-card>
      </v-col>

      <v-col cols="12" md="8" class="d-flex flex-column gap-4 coluna-conteudo order-2 order-md-2 pt-2" >
        <PostDestaque v-if="!postSelecionado" class="mb-6 mt-md-10"/>
        <v-divider v-if="!postSelecionado" class="my-1 pb-4 mt-8 " thickness="1" style="width: 100%; border-color: rgb(var(--v-theme-branco)) !important;"></v-divider>
        <div v-if="!postSelecionado" class="px-2 mb-2 mx-2">
          <h4 class="fonte text-h6 font-weight-light text-septenary" style="letter-spacing: 0.5px; opacity: 0.9;">
            Últimas Publicações
          </h4>
        </div>
        <Posts :filtro-titulo="postSelecionado?.titulo" class="mb-2 mt-md-10"/>
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
import { usePostagemStore } from '@/stores/postsStore'
import { useAdminStore } from '@/stores/adminStore';

const postagemStore = usePostagemStore()
const adminStore = useAdminStore()
const autores = ref<any[]>([])
const postsLista = ref<any[]>([])
const postSelecionado = ref<any>(null)

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
    info_autor(),
    buscaTitulos()
  ])
})
</script>

<style scoped>
.fonte {
  font-family: 'Georgia', serif !important;
}

.busca-custom :deep(.v-field) {
  height: 40px !important;
  min-height: 40px !important;
  box-shadow: none !important;
  background: transparent !important;
}

.busca-custom :deep(.v-field__input) {
  min-height: 40px !important;
  height: 40px !important;
  color: var(--v-theme-septenary) !important; 
}

.busca-custom :deep(.v-field__prepend-inner .v-icon) {
  color: rgb(var(--v-theme-primary)) !important; 
}

.busca-custom :deep(input::placeholder) {
  color: var(--v-theme-septenary) !important;
  opacity: 0.5 !important;
}

.coluna-conteudo {
  height: auto !important;
  min-height: min-content !important;
  align-self: flex-start !important;
}

@media (max-width: 959px) {
  .d-contents {
    display: contents !important;
    margin-bottom: 3%;
  }
}
</style>