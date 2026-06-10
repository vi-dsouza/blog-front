<template>
    <v-main>
        <v-container class="pa-4">
            <v-card title="Descrição do Blog" elevation="2" class="pa-4 rounded-xl text-h2" height="200px">
                <v-card-text class="text-h6">
                    {{ descricao }}
                </v-card-text>
            </v-card>
        </v-container>
    </v-main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useConfiguracaoStore } from '@/stores/configStore'

const configStore = useConfiguracaoStore()
const descricao = ref('')

const loadDescricao = async () => {
  const dados = await configStore.carregarConfig()
  descricao.value = dados?.descricao_blog ?? 'Descrição padrão do blog'
}

onMounted(() => {
  loadDescricao()
})

</script>