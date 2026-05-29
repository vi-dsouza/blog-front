<template>
  <v-app>
    <MenuLateral />

    <v-main class="main-scroll">
      <v-container fluid class="pa-4 pa-sm-8">
        <v-card-text class="text-h5 font-weight-bold text-center text-sm-left ms-6 mt-n16 mb-6">
          Visão Geral
        </v-card-text>

        <v-row class="ms-6 me-6">
          <v-col v-for="(stat, i) in stats" :key="i" cols="12" sm="6" md="3">
            <v-card border flat class="rounded-lg pa-4">
              <div class="d-flex justify-space-between align-center">
                <div>
                  <div class="text-overline mb-1">{{ stat.title }}</div>
                  <div class="text-h4 font-weight-bold" style="color: #7B5CFF">{{ stat.value }}</div>
                </div>
                <v-icon size="36" color="grey-lighten-1">{{ stat.icon }}</v-icon>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="ms-6 me-6 mt-4">
          <v-col cols="12" md="8">
            <v-card border flat class="rounded-lg h-100 pa-4">
              <v-card-title class="px-0">Acessos nos últimos 7 dias</v-card-title>
              <v-sheet height="250" class="d-flex align-center justify-center bg-grey-lighten-4 rounded-lg">
                <span class="text-grey">Gráfico de Linha: [Visualizações x Dias]</span>
              </v-sheet>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card border flat class="rounded-lg h-100 pa-4">
              <v-card-title class="px-0">Top Posts</v-card-title>
              <v-list lines="one">
                <v-list-item
                  v-for="post in topPosts"
                  :key="post.id"
                  :title="post.title"
                  :subtitle="post.views + ' views'"
                  prepend-icon="mdi-trending-up"
                ></v-list-item>
              </v-list>
              <v-btn block variant="text" color="#7B5CFF" class="mt-2">Ver todos</v-btn>
            </v-card>
          </v-col>

          <v-col cols="12" class="mt-4">
            <v-card border flat class="rounded-lg pa-4">
              <v-card-title class="px-0 d-flex justify-space-between align-center">
                Posts Recentes
                <v-btn to="/admin/nova-postagem" color="#7B5CFF" theme="dark" size="small">Novo Post</v-btn>
              </v-card-title>
              
              <v-table density="compact">
                <thead>
                  <tr>
                    <th class="text-left">Título</th>
                    <th class="text-left">Data</th>
                    <th class="text-left">Status</th>
                    <th class="text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in postsRecentes" :key="item.id || item.titulo || item.data">
                    <td>{{ item.titulo || item.title }}</td>
                    <td>{{ item.data || item.date }}</td>
                    <td>
                      <v-chip size="x-small" :color="(item.status || item.situacao || (item.publicado || item.published ? 'Publicado' : 'Rascunho')) === 'Publicado' ? 'success' : 'warning'">
                        {{ item.status || item.situacao || (item.publicado || item.published ? 'Publicado' : 'Rascunho') }}
                      </v-chip>
                    </td>
                    <td class="text-right">
                      <v-btn icon="mdi-pencil" variant="text" size="small" color="blue"></v-btn>
                      <v-btn icon="mdi-delete" variant="text" size="small" color="red"></v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import MenuLateral from '~/components/admin/MenuLateral.vue';
import { usePostagemStore } from '~/stores/postsStore';

const postsStore = usePostagemStore();

// 1. Variáveis reativas para o dashboard
const totalPosts = ref<number | string>(0);
const postsRecentes = ref<any[]>([]);

// 2. Computed para atualizar os cards automaticamente quando as variáveis mudarem
const stats = computed(() => [
  { title: 'Views Total', value: '24.8k', icon: 'mdi-eye', color: '#7B5CFF' },
  { 
    title: 'Postagens', 
    value: String(totalPosts.value || postsStore.posts?.length || 0), 
    icon: 'mdi-post', 
    color: '#7B5CFF' 
  },
  { title: 'Comentários', value: '85', icon: 'mdi-comment-text', color: '#7B5CFF' },
  { title: 'Inscritos', value: '1.2k', icon: 'mdi-account-group', color: '#7B5CFF' },
])

function formatarStatus(item: any) {
  return item.status || item.situacao || (item.publicado || item.published ? 'Publicado' : 'Rascunho')
}

// 3. Funções para buscar dados do Backend
async function carregarContagemPosts() {
  try {
    const data = await postsStore.contar_posts();

    if (typeof data === 'number') {
      totalPosts.value = data;
    } else if (data && typeof data === 'object') {
      totalPosts.value = data.count ?? 0;
    } else if (data) {
      totalPosts.value = Number(data) || 0;
    }
  } catch (err) {
    console.error('Erro ao carregar contagem de posts no componente:', err)
  }
}

async function carregarPostsRecentes() {
  try {
    const data = await postsStore.carregarPosts();
    const lista = Array.isArray(data) ? data : (data ? [data] : [])
    postsRecentes.value = lista.slice(0, 3)
  } catch (err) {
    console.error('Erro ao carregar posts recentes:', err)
    postsRecentes.value = []
  }
}

// 4. Ciclo de vida
onMounted(async () => {
  await carregarContagemPosts();
  await carregarPostsRecentes();
})

definePageMeta({
  middleware: 'auth'
})

// Dados estáticos (Mock)
const topPosts = [
  { id: 1, title: 'Como usar Vuetify 3', views: '4.5k' },
  { id: 2, title: 'Guia de Estilo CSS', views: '3.2k' },
  { id: 3, title: 'Dicas de UX/UI', views: '1.8k' },
]
</script>