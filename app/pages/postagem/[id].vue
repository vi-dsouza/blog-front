<template>
  <Banner />
  <v-main class="bg-grey-lighten-4">
    <v-container fluid class="mt-6 mb-16 px-2 px-sm-4" style="max-width: 100%;">
      <v-row justify="center">
        <v-col v-if="loading" cols="12" class="text-center py-12">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        </v-col>

        <v-col v-else-if="!post" cols="12" class="text-center py-12">
          <p class="text-h6 text-grey">Postagem não encontrada.</p>
          <v-btn color="primary" class="mt-4" @click="voltar">Voltar para os posts</v-btn>
        </v-col>

        <v-col v-else cols="12" md="10" lg="8">
          
          <v-btn 
            variant="text" 
            prepend-icon="mdi-arrow-left" 
            class="text-capitalize mb-4 text-body-2 text-grey-darken-1" 
            @click="voltar"
          >
            Voltar para os posts
          </v-btn>

          <v-card flat class="rounded-xl overflow-hidden pa-4 pa-sm-8 pa-md-12 elevation-1">
            
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
              
              <span class="text-caption text-grey-darken-1">
                {{ formatDate(post.data) }}
              </span>
            </div>

            <h1 class="text-h5 text-sm-h4 text-md-h3 font-weight-bold text-grey-darken-4 mb-6 leading-tight">
              {{ post.titulo }}
            </h1>

            <div class="d-flex flex-column flex-sm-row align-start align-sm-center justify-space-between mb-8 bg-grey-lighten-5 rounded-lg pa-4 gap-4">
              <div class="d-flex align-center">
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
              </div>

              <div class="d-flex align-center justify-space-between w-100 w-sm-auto pt-2 pt-sm-0 border-top-mobile">
                <div class="d-flex align-center position-relative">
                  <v-btn 
                    title="Curtir" 
                    icon 
                    density="comfortable"
                    :color="liked ? 'red' : undefined" 
                    @click="toggleLike" 
                    :aria-pressed="String(liked)"
                    style="z-index: 2;"
                  >
                    <v-icon>{{ liked ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
                  </v-btn>

                  <div 
                    class="border py-1 pr-4 pl-6 rounded-e-pill text-subtitle-2 font-weight-bold text-grey-darken-2"
                    :style="[
                      { marginBackground: '#f5f5f5', marginLeft: '-20px', zIndex: 1 },
                      liked ? { borderColor: '#f44336 !important', color: '#d32f2f !important', backgroundColor: '#ffebee' } : {}
                    ]"
                  >
                    {{ likesCount }}
                  </div>
                </div>
                
                <v-btn title="Compartilhar" icon density="comfortable" class="ml-2" @click="compartilhar(post)">
                  <v-icon>mdi-share-variant</v-icon>
                </v-btn>
              </div>
            </div>

            <v-snackbar v-model="snackbar" timeout="2500" color="success" rounded="xl">
              <div class="d-flex align-center">
                <v-icon class="mr-2">mdi-check-circle</v-icon>
                <span>Link copiado para área de transferência!</span>
              </div>
            </v-snackbar>

            <v-img
              :src="post.post_url || '/placeholder.png'"
              :alt="post.titulo"
              class="rounded-xl mb-8 post-main-image"
              contain
            ></v-img>

            <div class="post-content text-body-1 text-sm-h6 text-grey-darken-3 line-height-relaxed" v-html="post.conteudo">
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
import axios from 'axios'; // Importação do axios necessária para falar com o Flask

const route = useRoute(); 
const postagemStore = usePostagemStore();

const post = ref<any>(null);
const loading = ref(true);
const liked = ref(false);
const likesCount = ref(0); 
const snackbar = ref(false);

const loadPostData = async () => {
  try {
    loading.value = true;
    const idDoPost = Number(route.params.id); 

    const dados = await postagemStore.carregarPostsPublico();
    const listaDePosts = Array.isArray(dados) ? dados : dados ? [dados] : [];
    
    const postEncontrado = listaDePosts.find((p: any) => Number(p.id) === idDoPost);

    if (postEncontrado) {
      if (postEncontrado.hashtags && typeof postEncontrado.hashtags === 'string') {
        postEncontrado.listaHashtags = postEncontrado.hashtags.split(',').map((h: string) => h.trim());
      } else {
        postEncontrado.listaHashtags = [];
      }
      
      post.value = postEncontrado;

      likesCount.value = postEncontrado.likes_count || 0;

      // ====== AQUI CONFIGURAMOS A IMAGEM E O LINK INTELIGENTE ======
      useSeoMeta({
        title: postEncontrado.titulo,
        ogTitle: postEncontrado.titulo,
        description: 'Confira este artigo incrível no nosso blog!',
        ogDescription: 'Confira este artigo incrível no nosso blog!',
        // Esta é a tag mágica que puxa a imagem pequena/preview para o link!
        ogImage: postEncontrado.post_url || 'http://localhost:3000/placeholder.png',
        twitterCard: 'summary_large_image',
      });
      // ===============================================================

      // [INTEGRAÇÃO]: Verifica no LocalStorage se este navegador já curtiu o post atual
      const curtidos = JSON.parse(localStorage.getItem('blog_liked_posts') || '[]');
      liked.value = curtidos.includes(idDoPost);
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

async function toggleLike() {
  if (!post.value) return;

  const id_post = post.value.id;
  const action = liked.value ? 'unlike' : 'like';

  try {
    // Agora chama perfeitamente a Store passando os parâmetros isolados
    const resultado = await postagemStore.alternarCurtidaNoServidor(id_post, action);

    if (resultado && resultado.success) {
      likesCount.value = resultado.likes_count;
      liked.value = !liked.value;

      let curtidos = JSON.parse(localStorage.getItem('blog_liked_posts') || '[]');
      if (liked.value) {
        curtidos.push(id_post);
      } else {
        curtidos = curtidos.filter((id: number) => id !== id_post);
      }
      localStorage.setItem('blog_liked_posts', JSON.stringify(curtidos));
    }
  } catch (error) {
    console.error("Erro no clique do componente:", error);
  }
}

const compartilhar = async (currentPost: any) => {
  if (!currentPost || !currentPost.id) return;

  const urlDoPost = `${window.location.origin}/postagem/${currentPost.id}`;
  const tituloCompartilhar = `Confira este artigo: ${currentPost.titulo}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: currentPost.titulo,
        text: tituloCompartilhar,
        url: urlDoPost,
      });
      return;
    } catch (error) {
      if ((error as Error).name !== 'AbortError') console.error(error);
    }
  }

  try {
    const htmlLink = `<a href="${urlDoPost}" target="_blank">${currentPost.titulo}</a>`;

    const blobHtml = new Blob([htmlLink], { type: 'text/html' });
    const blobText = new Blob([urlDoPost], { type: 'text/plain' });

    const clipboardItem = new ClipboardItem({
      'text/html': blobHtml,
      'text/plain': blobText
    });

    await navigator.clipboard.write([clipboardItem]);
    
    snackbar.value = true;

  } catch (err) {
    console.error("Falha ao copiar link inteligente:", err);
    
    try {
      await navigator.clipboard.writeText(urlDoPost);
      snackbar.value = true;
    } catch (fallbackErr) {
      alert("Copie a URL direto da barra de endereços.");
    }
  }
};

const voltar = () => {
  navigateTo('/'); 
};

onMounted(loadPostData);
</script>

<style scoped>
.post-main-image {
  width: 100%;
  height: auto;
  min-height: 220px;
  max-height: 480px;
}

.line-height-relaxed {
  line-height: 1.8 !important;
  font-size: 1.05rem !important;
  letter-spacing: 0.01rem;
  white-space: pre-line;
}

@media (min-width: 600px) {
  .line-height-relaxed {
    font-size: 1.15rem !important;
  }
}

.leading-tight {
  line-height: 1.25;
}

@media (max-width: 599px) {
  .border-top-mobile {
    border-top: 1px solid rgba(0, 0, 0, 0.06);
  }
}
</style>