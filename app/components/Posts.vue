<template>
  <v-main>
    <div class="posts-grid">
      <v-card
        v-for="(post, index) in posts"
        :key="`post-${post?.id ?? index}`"
        class="post-card"
        elevation="1"
      >
        <v-row class="post-row" >
          <v-col class="post-image-col">
            <v-img
              :src="post?.post_url || '/placeholder.png'"
              width="60%"
              height="180px"
              contain
              class="post-image rounded-lg"
            ></v-img>
          </v-col>

          <v-col class="post-info-col">
            <v-card-text class="post-content">
              <div class="post-title">{{ post?.titulo }}</div>
              <div class="post-meta">{{ post?.autor }} • {{ formatDate(post?.data) }}</div>
              <div class="post-excerpt" v-html="post?.conteudo"></div>
            </v-card-text>
          </v-col>
        </v-row>

        <v-divider />

        <v-card-actions class="post-actions">
          <v-spacer />
          <v-btn color="primary" variant="text" @click="irParaPost(post)">Leia mais</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { usePostagemStore } from '@/stores/postsStore'

const postagemStore = usePostagemStore()
const posts = ref<any[]>([])

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
  // Só navega se o post realmente tiver um ID vindo da API
  if (post && post.id) {
    navigateTo(`/postagem/${post.id}`)
  }
}

onMounted(loadPosts)
</script>

<style scoped>
.posts-grid {
  display: grid;
  gap: 24px;
}

.post-card {
  border-radius: 14px;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease;  
  margin: 0;
}

.post-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.12);
}

.post-image {
  margin: 12px;
  padding: 10px;
  top: 3%;
  object-fit: cover;
}

.post-row {
  display: flex;
  flex-wrap: nowrap;
  gap: 4px;
}

.post-image-col {
  width: 15%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.post-info-col {
  width: 80%;
  padding-right: 80px;
}

.post-content {
  padding: 18px 0;
}

.post-title {
  font-size: 1.35rem;
  font-weight: 800;
  margin-bottom: 10px;
  color: #111827;
  letter-spacing: 0.01em;
}

.post-meta {
  color: rgba(31, 41, 55, 0.8);
  font-size: 0.92rem;
  margin-bottom: 14px;
  text-transform: capitalize;
}

.post-excerpt {
  color: rgba(31, 41, 55, 0.95);
  font-size: 1rem;
  font-weight: 200;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  opacity: 0.95;
}

.post-actions {
  padding: 16px 24px;
}

/* Tablets e telas médias */
@media (max-width: 960px) {
  .post-row {
    display: block !important;
    flex-wrap: wrap;
  }

  .post-image-col {
    width: 100% !important;
    margin-bottom: 16px;
    display: block !important;
  }

  .post-image {
    width: 100% !important;
    max-width: 100% !important;
  }

  .post-info-col {
    width: 100% !important;
    padding-right: 16px;
  }

  .post-title {
    font-size: 1.2rem;
  }

  .post-excerpt {
    font-size: 0.95rem;
    -webkit-line-clamp: 3;
  }
}

/* Celulares pequenos */
@media (max-width: 600px) {
  .posts-grid {
    gap: 16px;
  }

  .post-card {
    border-radius: 16px;
  }

  .post-row {
    display: block !important;
  }

  .post-image-col {
    width: 100% !important;
    margin-bottom: 12px;
    display: block !important;
  }

  .post-image {
    width: 100% !important;
    max-width: 100% !important;
    height: auto !important;
  }

  .post-info-col {
    width: 100% !important;
    padding-right: 0;
  }

  .post-content {
    padding: 12px 0;
  }

  .post-title {
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .post-meta {
    font-size: 0.85rem;
    margin-bottom: 10px;
  }

  .post-excerpt {
    font-size: 0.9rem;
    line-height: 1.5;
    -webkit-line-clamp: 2;
  }

  .post-actions {
    padding: 12px 16px;
  }
}
</style>