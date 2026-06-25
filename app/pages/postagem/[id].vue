<template>
  <Banner />
  <v-main class="bg-grey-lighten-4 min-h-screen">
    <v-container fluid class="mt-0 px-2 pb-16 px-sm-2" style="max-width: 100%; background: rgb(var(--v-theme-preto))">
      <v-row justify="center">
        <v-col v-if="loading" cols="12" class="text-center py-12">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        </v-col>

        <v-col v-else-if="!post" cols="12" class="text-center py-12">
          <p class="fonte text-h6 text-grey">Postagem não encontrada.</p>
          <v-btn color="septenary" class="mt-4" @click="voltar">Voltar para os posts</v-btn>
        </v-col>

        <v-col v-else cols="12" md="10" lg="8">
          
          <v-btn 
            variant="text" 
            prepend-icon="mdi-arrow-left" 
            class="fonte text-capitalize mb-4 text-body-2" 
            @click="voltar"
            style="color: rgb(var(--v-theme-septenary));"
          >
            Voltar para os posts
          </v-btn>

          <v-card flat class="rounded-xl overflow-hidden pa-4 pa-sm-8 pa-md-12 elevation-1" color="#FFFDF9"
            style="border: 2px solid rgb(var(--v-theme-primary));">
            <div class="fonte d-flex align-center flex-wrap gap-2 mb-4">
              <v-chip
                v-for="(tag, i) in post.listaHashtags"
                :key="i"
                color="secondary"
                size="small"
                label
                class="fonte font-weight-bold text-uppercase text-caption mr-1"
              >
                #{{ tag }}
              </v-chip>
              
              <span class="fonte text-caption text-grey-darken-1">
                {{ formatDate(post.data) }}
              </span>
            </div>

            <h1 class="fonte text-h5 text-sm-h4 text-md-h3 font-weight-bold text-black mb-6 leading-tight">
              {{ post.titulo }}
            </h1>

            <div class="d-flex flex-column flex-sm-row align-start align-sm-center justify-space-between mb-8 rounded-lg pa-4 gap-4"
              style="background-color: rgba(var(--v-theme-septenary), 0.4);">
              <div class="d-flex align-center">
                <v-avatar size="48" class="mr-3" color="septenary">
                  <v-img v-if="post.autor_foto" :src="post.autor_foto" :alt="post.autor"></v-img>
                  <v-icon v-else>mdi-account</v-icon>
                </v-avatar>
                <div>
                  <div class="fonte text-subtitle-2 font-weight-bold text-grey-darken-3">
                    {{ post.autor || 'Autor Anônimo' }}
                  </div>
                  <div class="fonte text-caption text-grey">
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
                    :color="liked ? 'error' : 'secondary'" 
                    @click="toggleLike" 
                    :aria-pressed="String(liked)"
                    style="z-index: 2;"
                  >
                    <v-icon :color="liked ? '#FFFDF9' : ''">{{ liked ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
                  </v-btn>

                  <div 
                    class="fonte like-counter py-1 pr-4 pl-6 rounded-e-pill text-subtitle-2 font-weight-bold"
                    :style="[
                      { marginLeft: '-20px', zIndex: 1 },
                      liked ? { borderColor: '#f44336 !important', color: '#d32f2f !important', backgroundColor: '#ffebee' } : {}
                    ]"
                  >
                    {{ likesCount }}
                  </div>
                </div>
                
                <v-btn title="Compartilhar" color="secondary" variant="outlined" icon density="comfortable" @click="compartilhar(post)">
                  <v-icon>mdi-share-variant</v-icon>
                </v-btn>
              </div>
            </div>

            <v-snackbar v-model="snackbar" timeout="2500" color="success" rounded="xl">
              <div class="fonte d-flex align-center">
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

            <div class="fonte post-content" v-html="post.conteudo"></div>

          </v-card>

        </v-col>
      </v-row>
    </v-container>
  </v-main>
  <Footer />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePostagemStore } from '@/stores/postsStore';
import Banner from '@/components/Banner.vue';
import Footer from '@/components/Footer.vue';

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

      useSeoMeta({
        title: postEncontrado.titulo,
        ogTitle: postEncontrado.titulo,
        description: 'Confira este artigo incrível no nosso blog!',
        ogDescription: 'Confira este artigo incrível no nosso blog!',
        ogImage: postEncontrado.post_url || 'http://localhost:3000/placeholder.png',
        twitterCard: 'summary_large_image',
      });

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
.fonte {
  font-family: 'Georgia', serif !important;
}
.post-main-image {
  width: 100%;
  height: auto;
  min-height: 220px;
  max-height: 480px;
}

.post-content {
  color: #231E1A !important;
  line-height: 1.8 !important;
  font-size: 1.05rem !important;
  letter-spacing: 0.01rem;
}

.post-content :deep(p) {
  margin-bottom: 1.5rem !important;
}

.post-content :deep(h1),
.post-content :deep(h2),
.post-content :deep(h3),
.post-content :deep(h4) {
  color: #1A1512;
  font-weight: 700;
  line-height: 1.3;
  margin-top: 2rem !important;
  margin-bottom: 1rem !important;
}

.post-content :deep(h2) { font-size: 1.75rem; }
.post-content :deep(h3) { font-size: 1.4rem; }
.post-content :deep(ol),
.post-content :deep(ul) {
  margin-bottom: 1.5rem !important;
  padding-left: 2rem !important; 
}

.post-content :deep(li) {
  margin-bottom: 0.5rem !important;
}

.post-content :deep(a) {
  color: #EAA851;
  text-decoration: none;
  font-weight: 600;
  border-bottom: 1px solid rgba(234, 168, 81, 0.3);
}

.post-content :deep(a:hover) {
  border-bottom-color: #EAA851;
}

@media (min-width: 600px) {
  .post-content {
    font-size: 1.15rem !important;
  }
}

.like-counter {
  border: 1px solid rgba(35, 30, 26, 0.15);
  color: #38312C;
  background-color: rgba(35, 30, 26, 0.03);
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