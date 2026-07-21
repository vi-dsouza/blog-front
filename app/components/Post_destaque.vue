<template>
  <v-card 
    elevation="6" 
    class="post-destaque-card rounded-xl overflow-hidden cursor-pointer mt-2 mt-sm-4 mt-md-10" 
    v-ripple
    @click="irParaPost(postDestaque)"
  >
    <v-row class="ma-0" no-gutters>
      <v-col cols="12" md="5" class="pa-0">
        <v-img
          :src="postDestaque?.post_url || '/placeholder.png'"
          class="h-md-100"
          style="max-height: 362px; min-height: 200px;"
          aspect-ratio="4/3"
          cover
        />
      </v-col>

      <v-col cols="12" md="7" class="pa-3 pa-sm-4 d-flex flex-column justify-space-between">
        <div>
          <v-chip size="small" class="fonte destaque-tag mb-2">
            Post em Destaque
          </v-chip>
          
          <h3 class="fonte destaque-title text-h5 text-sm-h4 font-weight-bold mb-2">
            {{ postDestaque?.titulo || 'Carregando o post mais recente...' }}
          </h3>
          
          <div class="fonte destaque-meta text-body-2 font-weight-medium mb-2 pb-2">
            Autor(a): {{ postDestaque?.autor || 'Autor desconhecido' }}
          </div>
          
          <div class="d-flex flex-wrap gap-2 mb-2">
            <v-chip
              v-for="(tag, index) in (postDestaque?.hashtags || '').split(',').filter((t: string) => t.trim())"
              :key="`tag-${index}`"
              size="small"
              class="fonte hashtag-card"
            >
              #{{ tag.trim() }}
            </v-chip>
          </div>
          
          <p class="fonte destaque-excerpt text-body-2" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; line-clamp: 4; overflow: hidden;"
            v-html="postDestaque?.conteudo || 'Aguarde enquanto buscamos o post mais recente para você.'">
          </p>
        </div>

        <div class="d-flex flex-column flex-sm-row align-start align-sm-center justify-space-between mt-3 gap-2">
          <div class="d-flex align-center flex-wrap" style="gap: 8px;">
            <div class="d-flex align-center position-relative">
              <v-btn 
                title="Curtir" 
                icon 
                density="comfortable"
                :color="liked ? 'error' : 'secondary'" 
                @click.stop="toggleLike" 
                :aria-pressed="String(liked)"
                style="z-index: 2;"
                variant="flat"
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
            
            <v-btn title="Visualizar" icon density="comfortable" color="primary" variant="flat" @click.stop="irParaPost(postDestaque)">
              <v-icon color="#FFFDF9">mdi-eye</v-icon>
            </v-btn>

            <v-btn title="Compartilhar" color="secondary" variant="outlined" icon density="comfortable" @click.stop="abrirShareModal(postDestaque)">
              <v-icon>mdi-share-variant</v-icon>
            </v-btn>
          </div>

          <div class="fonte destaque-data text-caption text-sm-body-2 align-self-end align-self-sm-center">
            {{ postDestaque?.data ? new Date(postDestaque.data + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : '' }}
          </div>
        </div>
      </v-col>
    </v-row>
  </v-card>

  <!-- Modal de Compartilhamento -->
  <v-dialog v-model="showShareModal" max-width="420">
    <v-card 
      flat
      class="rounded-xl" 
      color="#FFFDF9"
      style="border: 2px solid rgb(var(--v-theme-primary));"
    >
      <div 
        class="pa-8 text-center position-relative overflow-hidden"
        style="background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgba(var(--v-theme-primary), 0.7));"
      >
        <h3 class="fonte text-h5 font-weight-bold text-white mb-2">
          {{ postParaCompartilhar?.titulo }}
        </h3>
        <p class="fonte text-body-2 text-white" style="opacity: 0.9;">
          Compartilhe este artigo
        </p>
      </div>

      <div class="pa-8">
        <div class="d-flex justify-center gap-6 mb-8">
          <v-btn 
            icon
            size="60"
            rounded="circle"
            style="background-color: #25D366;"
            @click="compartilharWhatsApp(postParaCompartilhar)"
            class="share-btn shadow-lg"
          >
            <v-icon size="32" color="white">mdi-whatsapp</v-icon>
          </v-btn>

          <v-btn 
            icon
            size="60"
            rounded="circle"
            style="background-color: #1877F2;"
            @click="compartilharFacebook(postParaCompartilhar)"
            class="share-btn shadow-lg"
          >
            <v-icon size="32" color="white">mdi-facebook</v-icon>
          </v-btn>

          <v-btn 
            icon
            size="60"
            rounded="circle"
            style="background-color: #1DA1F2;"
            @click="compartilharTwitter(postParaCompartilhar)"
            class="share-btn shadow-lg"
          >
            <v-icon size="32" color="white">mdi-twitter</v-icon>
          </v-btn>
        </div>

        <v-divider class="mb-6"></v-divider>

        <v-btn 
          prepend-icon="mdi-content-copy" 
          color="secondary"
          size="large"
          class="fonte font-weight-bold w-100"
          variant="outlined"
          @click="copiarLink(postParaCompartilhar)"
        >
          Copiar Link
        </v-btn>

        <v-btn 
          text
          block
          class="fonte mt-4"
          @click="showShareModal = false"
        >
          Fechar
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useSeoMeta, navigateTo } from '#app'
import { usePostagemStore } from '@/stores/postsStore'

const postagemStore = usePostagemStore()
const postDestaque = ref<any>(null)
const liked = ref(false)
const likesCount = ref(0)
const showShareModal = ref(false)
const postParaCompartilhar = ref<any>(null)

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

const abrirShareModal = (currentPost: any) => {
  postParaCompartilhar.value = currentPost
  showShareModal.value = true
}

const compartilharWhatsApp = (currentPost: any) => {
  const urlDoPost = `${window.location.origin}/postagem/${currentPost.id}`;
  const mensagem = `Confira este artigo: ${currentPost.titulo}\n${urlDoPost}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
  window.open(whatsappUrl, '_blank');
  showShareModal.value = false;
};

const compartilharFacebook = (currentPost: any) => {
  const urlDoPost = `${window.location.origin}/postagem/${currentPost.id}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlDoPost)}`;
  window.open(facebookUrl, '_blank');
  showShareModal.value = false;
};

const compartilharTwitter = (currentPost: any) => {
  const urlDoPost = `${window.location.origin}/postagem/${currentPost.id}`;
  const texto = `Confira este artigo: ${currentPost.titulo}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(texto)}&url=${encodeURIComponent(urlDoPost)}`;
  window.open(twitterUrl, '_blank');
  showShareModal.value = false;
};

const copiarLink = async (currentPost: any) => {
  const urlDoPost = `${window.location.origin}/postagem/${currentPost.id}`;
  try {
    await navigator.clipboard.writeText(urlDoPost);
    alert("Link copiado para área de transferência!");
  } catch (err) {
    alert("Copie esta URL:\n" + urlDoPost);
  }
  showShareModal.value = false;
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
.fonte {
  font-family: 'Georgia', serif !important;
}

.cursor-pointer {
  cursor: pointer;
}

.post-destaque-card {
  background: #FFFDF9 !important; 
  border: 2px solid rgb(var(--v-theme-primary)) !important;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.45) !important;
  transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease;
}

.post-destaque-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.55), 0 0 15px rgba(234, 168, 81, 0.15) !important;
}

.destaque-tag {
  background: rgba(105, 75, 179, 0.1) !important;
  color: rgb(var(--v-theme-secondary)) !important;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.hashtag-card {
  background: #231E1A !important;
  color: #FFFDF9 !important;
  font-weight: 600;
}

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

.share-btn {
  transition: all 0.3s ease !important;
}

.share-btn:hover {
  transform: translateY(-4px) !important;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2) !important;
}
</style>