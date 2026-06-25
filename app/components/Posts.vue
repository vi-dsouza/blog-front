<template>
  <v-main class="py-0">
    <div class="posts-container w-100">
      
      <v-hover 
        v-for="(post, index) in postsFiltrados"
        :key="`post-${post?.id ?? index}`"
        v-slot="{ isHovering, props }"
      >
        <article
          v-bind="props"
          :class="['post-card', { 'post-card--hover': isHovering }]"
          v-ripple
          @click="irParaPost(post)"
        >
          <v-row class="ma-0 h-100" align="stretch">
            
            <v-col cols="12" sm="5" md="4" class="pa-0 image-wrapper h-100">
              <v-img
                :src="post?.post_url || '/placeholder.png'"
                height="100%"
                cover
                class="post-image"
                :class="{ 'post-image--zoom': isHovering }"
                alt="Capa do post"
              >
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="amber-darken-2" />
                  </v-row>
                </template>
              </v-img>
            </v-col>

            <v-col cols="12" sm="7" md="8" class="pa-5 pa-md-6 d-flex flex-column justify-center">
              <div class="fonte post-meta text-uppercase text-caption mb-2">
                <span>{{ post?.autor }}</span>
                <span class="mx-2">•</span>
                <span>{{ formatDate(post?.data) }}</span>
              </div>
              
              <h2 class="fonte post-title text-h5 text-md-h4 mb-3">
                {{ post?.titulo }}
              </h2>
              
              <div class="fonte post-excerpt text-body-2 text-md-body-1 mb-4" v-html="post?.conteudo"></div>

              <div class="d-flex align-center mt-auto pt-2">
                <span class="fonte read-more-link text-button font-weight-bold" :class="{ 'text-primary-color': isHovering }">
                  Ler Artigo 
                  <v-icon 
                    icon="mdi-arrow-right" 
                    size="small" 
                    class="ml-1 transition-icon"
                    :class="{ 'transition-icon--moved': isHovering }"
                  />
                </span>
              </div>
            </v-col>

          </v-row>
        </article>
      </v-hover>

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

.posts-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.post-card {
  background: #F9F6F0 !important; 
  border: 1px solid rgba(35, 30, 26, 0.12) !important; 
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  height: 260px; 
  will-change: transform, box-shadow;
  box-shadow: 0 2px 12px rgba(35, 30, 26, 0.04) !important;
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out, border-color 0.2s ease-out;
}

.post-card--hover {
  transform: translateY(-3px);
  border-color: #EAA851 !important; 
  box-shadow: 0 10px 25px rgba(35, 30, 26, 0.1) !important;
}

.image-wrapper {
  overflow: hidden;
}

.post-image {
  will-change: transform;
  transition: transform 0.3s ease-out;
}

.post-image--zoom {
  transform: scale(1.02);
}

.post-title {
  color: #231E1A;
  font-weight: 400;
  line-height: 1.25;
  letter-spacing: -0.02em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-meta {
  color: #8C827A;
  letter-spacing: 0.1em;
  font-weight: 600;
}

.post-excerpt {
  color: #5C524A;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.read-more-link {
  color: #231E1A;
  border-bottom: 1px solid rgba(234, 168, 81, 0.4);
  padding-bottom: 2px;
  transition: color 0.2s ease;
}

.text-primary-color {
  color: #EAA851 !important;
}

.transition-icon {
  transition: transform 0.2s ease;
}

.transition-icon--moved {
  transform: translateX(4px);
}

@media (max-width: 600px) {
  .posts-container {
    gap: 24px;
  }
  
  .post-card {
    height: auto; 
  }
  
  .image-wrapper {
    height: 200px; 
  }

  .post-title {
    font-size: 1.35rem !important;
  }
  
  .post-excerpt {
    -webkit-line-clamp: 2;
  }
}
</style>