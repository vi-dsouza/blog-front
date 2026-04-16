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
          lines="two" 
          :subtitle="isLoggedIn ? 'Conectado' : 'Desconectado'" 
          :title="userName"
        >
          <template v-slot:prepend>
            <v-avatar 
              icon="mdi-account" 
              :image="userPhoto"
            ></v-avatar>
          </template>
        </v-list-item>
    </template>

    <v-divider></v-divider>

    <v-list density="default" nav>
      <v-list-item prepend-icon="mdi-file-document-outline" title="Nova Postagem" to="/admin/nova-postagem"></v-list-item>
      <v-list-item prepend-icon="mdi-file-document" title="Postagens" to="/admin/postagens"></v-list-item>
      <v-list-item prepend-icon="mdi-chart-line" title="Dashboard" to="/admin/dashboard"></v-list-item>
      <v-list-item prepend-icon="mdi-cog" title="Configurações Gerais" to="/admin/configuracoes-gerais"></v-list-item>
      <v-list-item prepend-icon="mdi-account-circle" title="Administradores" to="/admin/administradores"></v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn class="btn-sair" block @click="logout">
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
import { ref, computed } from 'vue'

const drawer = ref(true)

// 1. Pegamos os cookies
const token = useCookie('auth_token')
const userCookie = useCookie('user') // Aqui assumimos que você salvou um objeto { nome: '...', ... }

// 2. Criamos propriedades computadas para reagir a mudanças
const isLoggedIn = computed(() => !!token.value)
const userName = computed(() => userCookie.value?.nome || 'Usuário')
const userPhoto = computed(() => userCookie.value?.foto_url || 'smirk.png')

const logout = async () => {
  const token = useCookie('auth_token')
  const user = useCookie('user')

  token.value = null
  user.value = null

  await navigateTo('/admin/login')
}
</script>

<style scoped>
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