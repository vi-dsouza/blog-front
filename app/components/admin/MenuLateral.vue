<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    location="left"
    color="#7B5CFF"
    theme="dark"
    class="no-scroll-drawer"
  >
    <template v-slot:prepend>
      <v-list-item 
        class="fonte py-3"
        lines="two" 
        :subtitle="isLoggedIn ? 'Conectado' : 'Desconectado'" 
        :title="userName"
      >
        <template v-slot:prepend>
          <v-badge
            dot
            location="bottom right"
            :color="isLoggedIn ? 'success' : 'error'"
            offset-x="2"
            offset-y="2"
            class="mr-3"
          >
            <v-avatar size="42">
              <v-img 
                v-if="userPhoto" 
                :src="userPhoto" 
                alt="Foto do usuário"
                cover
              />
              <v-icon v-else icon="mdi-account" size="24"></v-icon>
            </v-avatar>
          </v-badge>
        </template>
      </v-list-item>
    </template>

    <v-divider></v-divider>

    <v-list class="fonte" density="default" nav>
      <v-list-item prepend-icon="mdi-file-document-outline" title="Nova Postagem" to="/admin/nova-postagem"></v-list-item>
      <v-list-item prepend-icon="mdi-file-document" title="Postagens" to="/admin/postagens"></v-list-item>
      <v-list-item prepend-icon="mdi-chart-line" title="Dashboard" to="/admin/dashboard"></v-list-item>
      <v-list-item prepend-icon="mdi-cog" title="Configurações Gerais" to="/admin/configuracoes-gerais"></v-list-item>
      <v-list-item prepend-icon="mdi-account-circle" title="Administradores" to="/admin/administradores"></v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn class="fonte btn-sair" block @click="logout">
          Sair
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>

  <v-app-bar flat color="transparent">
    <v-btn 
      :icon="drawer ? 'mdi-chevron-left' : 'mdi-chevron-right'"
      @click="drawer = !drawer"
    ></v-btn>
  </v-app-bar>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const drawer = ref(true)
const token = useCookie('auth_token')
const userData = ref(null)

const isLoggedIn = computed(() => !!token.value)
const userName = computed(() => userData.value?.nome || 'Usuário')

const userPhoto = computed(() => {
  const foto = userData.value?.foto_url || userData.value?.foto
  if (!foto) return null

  if (!foto.startsWith('data:image') && !foto.startsWith('http') && !foto.startsWith('/')) {
    return `data:image/png;base64,${foto}`
  }

  return foto
})

const carregarUsuario = () => {
  if (import.meta.client) {
    const dadosSalvos = localStorage.getItem('user_data')
    if (dadosSalvos) {
      try {
        userData.value = JSON.parse(dadosSalvos)
      } catch (e) {
        console.error('Erro ao ler user_data do localStorage:', e)
      }
    }
  }
}

const logout = async () => {
  const tokenCookie = useCookie('auth_token')
  const userCookie = useCookie('user')

  tokenCookie.value = null
  userCookie.value = null

  if (import.meta.client) {
    localStorage.removeItem('user_data')
    window.removeEventListener('user-data-updated', carregarUsuario)
  }

  await navigateTo('/admin/login')
}

onMounted(() => {
  carregarUsuario()
  if (import.meta.client) {
    window.addEventListener('user-data-updated', carregarUsuario)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('user-data-updated', carregarUsuario)
  }
})
</script>

<style scoped>
.fonte {
  font-family: 'Georgia', serif !important;
}

.btn-sair {
  height: 45px;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  background-color: #212121;
}

.no-scroll-drawer {
  overflow: hidden !important;
}
</style>