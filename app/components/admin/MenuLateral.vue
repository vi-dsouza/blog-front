<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
        location="left"
        v-model="drawer"
        color="#7B5CFF"
        theme="dark"
      >
        <template v-slot:prepend>
          <v-list-item
            lines="two"
            prepend-avatar=""
            subtitle="Logged in"
            title="Vitória Stéfane"
          ></v-list-item>
        </template>

        <v-divider></v-divider>

        <v-list density="default" nav>
          <v-list-item prepend-icon="mdi-file-document-outline" title="Nova Postagem" value="home"></v-list-item>
          <v-list-item prepend-icon="mdi-file-document" title="Postagens" value="account"></v-list-item>
          <v-list-item prepend-icon="mdi-chart-line" title="Dashboard" value="users"></v-list-item>
        </v-list>

        <v-btn class="btn-sair">Sair</v-btn>

      </v-navigation-drawer>
      <v-main style="height: 100vh">
        <v-btn 
            :icon="drawer ? 'mdi-chevron-left' : 'mdi-chevron-right'"
            variant="text"
            @click="drawer = !drawer"
        />

      </v-main>
    </v-layout>
  </v-card>
</template>

<style>
    .btn-sair {
        width: 95%;
        height: 45px;
        border-radius: 12px;
        color: white;
        font-weight: 600;
        margin: 5px 5px 5px 5px;
        margin-top: auto;
        margin-bottom: 10px;
    }
</style>

<script setup>
import { ref } from 'vue'

const drawer = ref(true)
</script>