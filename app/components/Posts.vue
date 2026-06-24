<template>
  <v-main>
    <div class="posts-grid px-2 px-sm-4">
      <v-card
        v-for="(post, index) in postsFiltrados"
        :key="`post-${post?.id ?? index}`"
        class="post-card"
        elevation="0"
      >
        <v-row class="ma-0 pa-2 pa-sm-4" align="center">
          
          <v-col cols="12" md="4" class="d-flex justify-center align-center">
            <v-img
              :src="post?.post_url || '/placeholder.png'"
              width="100%"
              max-height="220px"
              cover
              class="post-image rounded-lg"
              style="border: 1px solid #EAA851;"
            ></v-img>
          </v-col>

          <v-col cols="12" md="8" class="pa-2 pa-sm-4">
            <v-card-text class="pa-0">
              <div class="fonte post-title text-h6 text-sm-h5 text-septenary">{{ post?.titulo }}</div>
              <div class="fonte post-meta text-caption text-sm-body-2">{{ post?.autor }} • {{ formatDate(post?.data) }}</div>
              <div class="fonte post-excerpt text-body-2 text-sm-body-1" v-html="post?.conteudo"></div>
            </v-card-text>
          </v-col>
        </v-row>

        <v-divider style="border-color: rgb(var(--v-theme-background)) !important;" />

        <v-card-actions class="px-4 py-2">
          <v-spacer />
          <v-btn color="primary" variant="text" class="fonte font-weight-bold" @click="irParaPost(post)">Leia mais</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-main>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { usePostagemStore } from '@/stores/postsStore'

const postagemStore = usePostagemStore()
const posts = ref<any[]>([])

const props = defineProps({
  filtroTitulo: String
})

const postsFiltrados = computed(() => {
  if (!props.filtroTitulo || props.filtroTitulo.trim() === '') {
    return posts.value
  }

  const termoBusca = props.filtroTitulo.toLowerCase().trim()

  return posts.value.filter(post => {
    const tituloPost = post?.titulo ? String(post.titulo).toLowerCase() : ''
    return tituloPost.includes(termoBusca)
  })
})

const loadPosts = async () => {
  const dados = await postagemStore.carregarPostsPublico()
  posts.value = Array.isArray(dados) ? dados : dados ? [dados] : []
}

const formatDate = (value: string | undefined) => {
  if (!value) return ''
  const date = new Date(value + 'T00:00:00')
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const irParaPost = (post: any) => {
  if (post && post.id) {
    navigateTo(`/postagem/${post.id}`)
  }
}

onMounted(loadPosts)
</script>

<style scoped>
.fonte {
  font-family: 'Georgia', serif !important;
}

.posts-grid {
  display: grid;
  gap: 24px;
}

.post-card {
  border-radius: 20px !important;
  overflow: hidden;
  background: #EAE3D2 !important;
  border: 2px solid rgb(var(--v-theme-primary)) !important; 
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4) !important;
  transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease;  
}

.post-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 15px rgba(234, 168, 81, 0.2) !important;
}

.post-image {
  object-fit: cover;
  width: 100%;
}

.post-title {
  font-weight: 700;
  margin-bottom: 8px;
  letter-spacing: -0.01em;
  line-height: 1.3;
  color: #231E1A !important; 
}

.post-meta {
  color: #5C524A !important;
  font-weight: 500;
  margin-bottom: 12px;
}

.post-excerpt {
  color: #3D3530 !important;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

:deep(.v-btn) {
  font-weight: 700 !important;
  letter-spacing: 0.5px;
  color: rgb(var(--v-theme-secondary)) !important; 
}

@media (max-width: 600px) {
  .posts-grid {
    gap: 16px;
  }
  .post-excerpt {
    -webkit-line-clamp: 2;
  }
}
</style>
