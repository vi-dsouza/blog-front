<template>
  <Banner />
  <v-main class="bg-grey-lighten-4">
    <v-container width="100%" class="mt-6 mb-16">
      <v-row justify="center">
        <v-col v-if="loading" cols="12" class="text-center py-12">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        </v-col>

        <v-col v-else-if="!post" cols="12" class="text-center py-12">
          <p class="text-h6 text-grey">Postagem não encontrada.</p>
          <v-btn color="primary" class="mt-4" @click="voltar">Voltar para os posts</v-btn>
        </v-col>

        <v-col v-else cols="12" md="10">
          
          <v-btn 
            variant="text" 
            prepend-icon="mdi-arrow-left" 
            class="text-capitalize mb-4 text-body-2 text-grey-darken-1" 
            @click="voltar"
          >
            Voltar para os posts
          </v-btn>

          <v-card flat class="rounded-xl overflow-hidden pa-6 pa-md-12 elevation-1">
            
            <div class="d-flex align-center flex-wrap gap-2 mb-4">
              <v-chip
                v-for="(tag, i) in post.listaHashtags"
                :key="i"
                color="primary"
                size="small"
                label
                class="font-weight-bold text-uppercase text-caption mr-1"
              >
                #{{ tag }}
              </v-chip>
              
              <span class="text-caption text-grey-darken-1 ml-2">
                {{ formatDate(post.data) }}
              </span>
            </div>

            <h1 class="text-h3 font-weight-bold text-grey-darken-4 mb-6 leading-tight">
              {{ post.titulo }}
            </h1>

            <v-row align="center" class="mb-8 bg-grey-lighten-5 rounded-lg pa-3 mx-0">
              <v-avatar size="48" class="mr-3" color="grey-lighten-2">
                <v-img v-if="post.autor_foto" :src="post.autor_foto" :alt="post.autor"></v-img>
                <v-icon v-else>mdi-account</v-icon>
              </v-avatar>
              <div>
                <div class="text-subtitle-2 font-weight-bold text-grey-darken-3">
                  {{ post.autor || 'Autor Anônimo' }}
                </div>
                <div class="text-caption text-grey">
                  Autor(a) do Artigo
                </div>
              </div>
              <v-spacer></v-spacer>
              <v-btn title="Curtir" icon :color="liked ? 'red' : undefined" @click="toggleLike" :aria-pressed="String(liked)">
                <v-icon>{{ liked ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
              </v-btn>
              <v-btn title="Compartilhar" icon>
                <v-icon>mdi-share-variant</v-icon>
              </v-btn>
            </v-row>

            <v-img
              :src="post.post_url || '/placeholder.png'"
              :alt="post.titulo"
              height="450"
              contain
              class="rounded-xl mb-8"
            ></v-img>

            <div class="post-content text-body-1 text-grey-darken-3 line-height-relaxed" v-html="post.conteudo">
            </div>

          </v-card>

        </v-col>
      </v-row>
    </v-container>
  </v-main>
  <Footer />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePostagemStore } from '@/stores/postsStore';
import Banner from '@/components/Banner.vue';
import Footer from '@/components/Footer.vue';

// No Nuxt, 'useRoute' é global e não precisa de importação manual do vue-router
const route = useRoute(); 
const postagemStore = usePostagemStore();

const post = ref<any>(null);
const loading = ref(true);
const liked = ref(false);
const likesCount = ref(0); 

const loadPostData = async () => {
  try {
    loading.value = true;
    
    // Captura o parâmetro ID da URL e transforma em Number purificado
    const idDoPost = Number(route.params.id); 

    const dados = await postagemStore.carregarPostsPublico();
    const listaDePosts = Array.isArray(dados) ? dados : dados ? [dados] : [];
    
    // Filtra localizando o ID correspondente da API
    const postEncontrado = listaDePosts.find((p: any) => Number(p.id) === idDoPost);

    if (postEncontrado) {
      // Divide a string "teste, inicio, start" em um Array real de strings
      if (postEncontrado.hashtags && typeof postEncontrado.hashtags === 'string') {
        postEncontrado.listaHashtags = postEncontrado.hashtags.split(',').map((h: string) => h.trim());
      } else {
        postEncontrado.listaHashtags = [];
      }
      
      post.value = postEncontrado;
    }

  } catch (error) {
    console.error('Erro ao carregar os detalhes do post:', error);
  } finally {
    loading.value = false;
  }
};

const formatDate = (value: string | undefined) => {
  if (!value) return '';
  const date = new Date(value + 'T00:00:00');
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

function toggleLike() {
    if (liked.value) {
        likesCount.value = Math.max(0, likesCount.value - 1)
        liked.value = false
    } else {
        likesCount.value = likesCount.value + 1
        liked.value = true
    }
}

// Navegação limpa do Nuxt para retornar à lista principal
const voltar = () => {
  navigateTo('/'); 
};

onMounted(loadPostData);
</script>

<style scoped>
.line-height-relaxed {
  line-height: 1.8 !important;
  font-size: 1.15rem !important;
  letter-spacing: 0.01rem;
  white-space: pre-line;
}
.leading-tight {
  line-height: 1.25;
}
</style>