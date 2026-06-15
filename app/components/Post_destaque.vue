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
                        <v-btn title="Curtir" icon :color="liked ? 'red' : undefined" @click="toggleLike" :aria-pressed="String(liked)">
                            <v-icon>{{ liked ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
                        </v-btn>
                        <v-btn title="Visualizar" icon color="blue" @click="irParaPost(postDestaque)">
                            <v-icon>mdi-eye</v-icon>
                        </v-btn>
                        <v-btn title="Compartilhar" icon>
                            <v-icon>mdi-share-variant</v-icon>
                        </v-btn>
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

const loadPostDestaque = async () => {
    const dados = await postagemStore.carregarPostsPublico()
    const lista = Array.isArray(dados) ? dados : (dados ? [dados] : [])
    if (lista.length === 0) {
        return
    }

    postDestaque.value = [...lista].sort((a, b) => {
        const dataA = new Date(a.data).getTime()
        const dataB = new Date(b.data).getTime()
        return dataB - dataA
    })[0]

    likesCount.value = Number(postDestaque.value?.likes ?? 0)
    liked.value = false
}

function toggleLike() {
    if (liked.value) {
        likesCount.value = Math.max(0, likesCount.value - 1)
        liked.value = false
    } else {
        likesCount.value = likesCount.value + 1
        liked.value = true
    }
}

const irParaPost = (post: any) => {
  // Só navega se o post realmente tiver um ID vindo da API
  if (post && post.id) {
    navigateTo(`/postagem/${post.id}`)
  }
}

onMounted(() => {
    loadPostDestaque()
})
</script>

<style scoped>
    /* Remove qualquer cor de fundo vinda de elementos de texto (como spans do editor) */
    .text-body-2 :deep(span) {
    background-color: transparent !important;
    }

    /* Garante que parágrafos internos também não forcem fundos esquisitos */
    .text-body-2 :deep(*) {
    background: transparent !important;
    background-color: transparent !important;
}
</style>