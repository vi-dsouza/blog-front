<template>
    <v-card elevation="6" class="rounded-xl overflow-hidden" style="background: rgba(33, 150, 243, 0.12); backdrop-filter: blur(14px); border: 1px solid rgba(33, 150, 243, 0.22);">
        <v-row class="ma-0" no-gutters>
            <v-col cols="12" md="4" class="pa-0">
                <v-img
                    :src="postDestaque?.post_url || '/placeholder.png'"
                    class="h-100"
                    aspect-ratio="4/3"
                    cover
                />
            </v-col>

            <v-col cols="12" md="8" class="pa-6 d-flex flex-column justify-space-between">
                <div>
                    <v-chip small color="deep-purple accent-4" text-color="white" class="mb-4">
                        Post em Destaque
                    </v-chip>
                    <h3 class="text-h4 font-weight-bold mb-3">{{ postDestaque?.titulo || 'Carregando o post mais recente...' }}</h3>
                    <v-subtitle class="text-body-2 font-weight-medium mb-3 pb-2">
                        Autor(a): {{ postDestaque?.autor || 'Autor desconhecido' }}
                    </v-subtitle>
                    <br>
                    <div class="d-flex flex-wrap gap-2 mb-4">
                        <v-chip
                            v-for="(tag, index) in (postDestaque?.hashtags || '').split(',').filter(t => t.trim())"
                            :key="`tag-${index}`"
                            size="small"
                            color="deep-purple accent-3"
                            text-color="white"
                        >
                            #{{ tag.trim() }}
                        </v-chip>
                    </div>
                    <p class="text-body-2 opacity-80" style="display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;"
                        v-html="postDestaque?.conteudo || 'Aguarde enquanto buscamos o post mais recente para você.'">
                    </p>
                </div>

                <div class="d-flex align-center justify-space-between mt-6">
                    <div class="d-flex align-center" style="gap: 12px;">
                        <div class="d-flex align-center position-relative">
                            <v-btn 
                                title="Curtir" 
                                icon 
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
                        <v-btn title="Visualizar" icon color="blue" @click="irParaPost(postDestaque)">
                            <v-icon>mdi-eye</v-icon>
                        </v-btn>
                        <v-btn title="Compartilhar" icon @click="compartilhar(postDestaque)">
                            <v-icon>mdi-share-variant</v-icon>
                        </v-btn>
                        <v-snackbar v-model="snackbar" timeout="2500" color="success" rounded="xl">
                            <div class="d-flex align-center">
                                <v-icon class="mr-2">
                                mdi-check-circle
                                </v-icon>
                                <span>Link copiado para área de transferência!</span>
                            </div>
                        </v-snackbar>
                    </div>

                    <div class="text-body-small opacity-70">
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

        // Configura o preview da página inicial com a imagem do destaque
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
    .text-body-2 :deep(span) {
    background-color: transparent !important;
    }

    .text-body-2 :deep(*) {
    background: transparent !important;
    background-color: transparent !important;
}
</style>