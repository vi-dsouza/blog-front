<template>
  <v-main>
    <Banner />
    <Tags />
    <Descricao />

    <v-row cols="12" class="pa-4 ma-1" align="stretch" justify="space-around">
      <v-col cols="3" class="d-flex flex-column gap-4 ">  
        <v-card title="Escolha um tema" elevation="2" class="pa-4 rounded-lg">
          <v-chip
            v-for="(tag, index) in tags"
            :key="`${tag}-${index}`"
            class="ma-2"
          >
            {{ tag }}
          </v-chip>
        </v-card>

        <br>

        <v-card title="Sobre a autora" elevation="2" class="pa-2 rounded-lg">
          <v-row class="pa-4 d-flex align-center gap-6" justify="start">
            <v-col cols="auto" class="d-flex justify-center">
              <v-avatar size="120" border="2" color="#7B5CFF">
                <v-img src="https://via.placeholder.com/150" alt="Foto da autora"></v-img>
              </v-avatar>
            </v-col>
            <v-col cols="7" class="d-flex flex-column gap-2">
              <v-card-text>
                Este é um blog de tecnologia onde compartilhamos as últimas novidades, tutoriais e análises sobre o mundo da tecnologia. Fique ligado para conteúdos interessantes e atualizados!
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>

      </v-col>
      <v-col cols="8" class="d-flex flex-column gap-4">
        <PostDestaque />
      </v-col>
    </v-row>

  </v-main>
</template>

<script setup lang="ts">
import Banner from '@/components/Banner.vue';
import Tags from '@/components/Tags.vue';
import Descricao from '@/components/Descricao.vue';
import PostDestaque from '@/components/Post_destaque.vue';

import { ref, onMounted } from 'vue'
import { useConfiguracaoStore } from '@/stores/configStore'

const configStore = useConfiguracaoStore()
const tags = ref<string[]>([])

const loadTags = async () => {
  const dados = await configStore.carregarConfig()
  tags.value = dados?.tags_do_blog?.split(',') ?? []
}

onMounted(loadTags)

</script>