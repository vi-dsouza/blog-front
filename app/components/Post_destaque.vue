<template>
    <v-card title="Destaque" elevation="5" class="pa-4 rounded-lg" variant="tonal">
        <v-row class="pa-4">
            <v-col cols="3" class="pa-4">
                <v-img 
                    :src="postDestaque?.post_url || 'https://via.placeholder.com/150'"
                    width="250"
                    height="180"
                    class="rounded-lg"
                    cover
                >
                </v-img>
            </v-col>
            <v-col cols="8">
                <v-card-text>
                    <h3 class="text-h4 mb-3">{{ postDestaque?.titulo || 'Carregando o post mais recente...' }}</h3>
                    <p>{{ postDestaque?.conteudo || 'Aguarde enquanto buscamos o destaque.' }}</p>
                </v-card-text>
            </v-col>

            <v-divider class="my-8"></v-divider>

                <div class="d-flex" style="margin-left:auto; gap: 16px;">
                    <v-btn title="Curtir" icon :color="liked ? 'red' : undefined" @click="toggleLike" :aria-pressed="String(liked)">
                        <v-icon>{{ liked ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
                    </v-btn>

                    <!-- <span class="text-body-2">{{ likesCount }}</span> -->

                    <v-btn title="Visualizar" icon color="blue">
                        <v-icon>mdi-eye</v-icon>
                    </v-btn>

                    <v-btn title="Compartilhar" icon>
                        <v-icon>mdi-share</v-icon>
                    </v-btn>

                </div>

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
    const dados = await postagemStore.carregarPosts()
    console.log('Posts carregados:', dados)
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

onMounted(() => {
    loadPostDestaque()
})
</script>