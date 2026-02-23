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
      <v-list-item lines="two" subtitle="Logged in" title="Vitória Stéfane">
        <template v-slot:prepend>
          <v-avatar icon="$vuetify" image="smirk.png"></v-avatar>
        </template>
      </v-list-item>
    </template>

    <v-divider></v-divider>

    <v-list density="default" nav>
      <v-list-item prepend-icon="mdi-file-document-outline" title="Nova Postagem" to="/admin/nova-postagem"></v-list-item>
      <v-list-item prepend-icon="mdi-file-document" title="Postagens" to="/admin/postagens"></v-list-item>
      <v-list-item prepend-icon="mdi-chart-line" title="Dashboard" to="/admin/dashboard"></v-list-item>
      <v-list-item prepend-icon="mdi-cog" title="Configurações Gerais" to="/admin/configuracoes-gerais"></v-list-item>
      <v-list-item prepend-icon="mdi-account-circle" title="Usuários" to="/admin/usuarios"></v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn class="btn-sair" block>Sair</v-btn>
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
import { ref } from 'vue'
// Definimos o estado do menu aqui
const drawer = ref(true)
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