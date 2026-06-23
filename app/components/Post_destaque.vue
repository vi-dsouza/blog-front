<template>
  <v-card 
    elevation="6" 
    class="post-destaque-card rounded-xl overflow-hidden" 
  >
    <v-row class="ma-0" no-gutters>
      <v-col cols="12" md="4" class="pa-0">
        <v-img
          :src="postDestaque?.post_url || '/placeholder.png'"
          class="h-md-100"
          style="max-height: 362px; min-height: 200px;"
          aspect-ratio="4/3"
          cover
        />
      </v-col>

      <v-col cols="12" md="8" class="pa-4 pa-sm-6 d-flex flex-column justify-space-between">
        <div>
          <v-chip size="small" class="destaque-tag mb-2">
            Post em Destaque
          </v-chip>
          
          <h3 class="destaque-title text-h5 text-sm-h4 font-weight-bold mb-2">
            {{ postDestaque?.titulo || 'Carregando o post mais recente...' }}
          </h3>
          
          <div class="destaque-meta text-body-2 font-weight-medium mb-2 pb-2">
            Autor(a): {{ postDestaque?.autor || 'Autor desconhecido' }}
          </div>
          
          <div class="d-flex flex-wrap gap-2 mb-2">
            <v-chip
              v-for="(tag, index) in (postDestaque?.hashtags || '').split(',').filter(t => t.trim())"
              :key="`tag-${index}`"
              size="small"
              class="hashtag-card"
            >
              #{{ tag.trim() }}
            </v-chip>
          </div>
          
          <p class="destaque-excerpt text-body-2" style="display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;"
            v-html="postDestaque?.conteudo || 'Aguarde enquanto buscamos o post mais recente para você.'">
          </p>
        </div>

        <div class="d-flex flex-column flex-sm-row align-start align-sm-center justify-space-between mt-6 gap-4">
          <div class="d-flex align-center flex-wrap" style="gap: 8px;">
            <div class="d-flex align-center position-relative">
              <v-btn 
                title="Curtir" 
                icon 
                density="comfortable"
                :color="liked ? 'error' : 'secondary'" 
                @click="toggleLike" 
                :aria-pressed="String(liked)"
                style="z-index: 2;"
                variant="flat"
              >
                <v-icon :color="liked ? '#FFFDF9' : ''">{{ liked ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
              </v-btn>

              <div 
                class="like-counter py-1 pr-4 pl-6 rounded-e-pill text-subtitle-2 font-weight-bold"
                :style="[
                  { marginLeft: '-20px', zIndex: 1 },
                  liked ? { borderColor: '#f44336 !important', color: '#d32f2f !important', backgroundColor: '#ffebee' } : {}
                ]"
              >
                {{ likesCount }}
              </div>
            </div>
            
            <v-btn title="Visualizar" icon density="comfortable" color="primary" variant="flat" @click="irParaPost(postDestaque)">
              <v-icon color="#FFFDF9">mdi-eye</v-icon>
            </v-btn>

            <v-btn title="Compartilhar" color="secondary" variant="outlined" icon density="comfortable" @click="compartilhar(postDestaque)">
              <v-icon>mdi-share-variant</v-icon>
            </v-btn>
            
            <v-snackbar v-model="snackbar" timeout="2500" color="success" rounded="xl">
              <div class="d-flex align-center">
                <v-icon class="mr-2">mdi-check-circle</v-icon>
                <span>Link copiado para área de transferência!</span>
              </div>
            </v-snackbar>
          </div>

          <div class="destaque-data text-caption text-sm-body-2 align-self-end align-self-sm-center">
            {{ postDestaque?.data ? new Date(postDestaque.data + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : '' }}
          </div>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { usePostagemStore } from '@/stores/postsStore'

const postagemStore = usePostagemStore()
const postDestaque = ref<any>(null)
const liked = ref(false)
const likesCount = ref(0)
const snackbar = ref(false);

const loadPostDestaque = async () => {
    const dados = await postagemStore.carregarPostsPublico()
    const lista = Array.isArray(dados) ? dados : (dados ? [dados] : [])
    if (lista.length === 0) {
        return
    }

    const maisRecente = [...lista].sort((a, b) => {
        const dataA = new Date(a.data).getTime()
        const dataB = new Date(b.data).getTime()
        return dataB - dataA
    })[0]

    if (maisRecente) {
        postDestaque.value = maisRecente
        likesCount.value = Number(maisRecente.likes_count ?? 0)

        useSeoMeta({
            title: 'Meu Blog - Página Inicial',
            ogTitle: maisRecente.titulo,
            ogImage: maisRecente.post_url,
        });

        const curtidos = JSON.parse(localStorage.getItem('blog_liked_posts') || '[]');
        liked.value = curtidos.includes(Number(maisRecente.id));
    }
}

async function toggleLike() {
    if (!postDestaque.value) return;

    const id_post = Number(postDestaque.value.id);
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
        console.error("Erro ao sincronizar curtida do destaque com o servidor:", error);
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

const irParaPost = (post: any) => {
  if (post && post.id) {
    navigateTo(`/postagem/${post.id}`)
  }
}

onMounted(() => {
    loadPostDestaque()
})
</script>

<style scoped>
.post-destaque-card {
  /* 🌟 FUNDO MARFIM/BEGE CLARO PREMIUM */
  background: #FFFDF9 !important; 
  /* Moldura bem desenhada em Dourado */
  border: 2px solid rgb(var(--v-theme-primary)) !important;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.45) !important;
  transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease;
}

.post-destaque-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.55), 0 0 15px rgba(234, 168, 81, 0.15) !important;
}

/* CHIPS / TAG DE DESTAQUE */
.destaque-tag {
  background: rgba(105, 75, 179, 0.1) !important;
  color: rgb(var(--v-theme-secondary)) !important;
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* HASHTAGS */
.hashtag-card {
  background: #231E1A !important;
  color: #FFFDF9 !important;
  font-weight: 600;
}

/* TEXTOS E HIERARQUIA */
.destaque-title {
  color: #1A1512 !important;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.destaque-meta {
  color: #5C524A !important; 
}

.destaque-excerpt {
  color: #38312C !important; 
  line-height: 1.6;
}

.destaque-data {
  color: #5C524A !important;
  font-weight: 500;
}

/* Contador de Curtidas */
.like-counter {
  border: 1px solid rgba(35, 30, 26, 0.15);
  color: #38312C;
  background-color: rgba(35, 30, 26, 0.03);
}

.text-body-2 :deep(span),
.text-body-2 :deep(*) {
  background: transparent !important;
  background-color: transparent !important;
}
</style>