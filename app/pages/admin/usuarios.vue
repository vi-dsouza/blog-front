<template>
    <v-app>
        <MenuLateral />

    <v-main class="main-scroll">
      <v-container fluid class="pa-4 pa-sm-8">
        <v-card-text class="text-h5 font-weight-bold text-center text-sm-left ms-6 mt-n16 mb-2">
          Usuários
        </v-card-text>

        <v-col cols="12" class="mt-4">
            <v-card border flat class="rounded-lg pa-4">
              <v-card-title class="px-0 d-flex justify-space-between align-center">
                Usuários do Blog
                <v-btn to="/admin/nova-postagem" color="#7B5CFF" theme="dark" size="small">Novo Post</v-btn>
              </v-card-title>
              
              <v-table density="compact">
                <thead>
                  <tr>
                    <th class="text-left">Foto</th>
                    <th class="text-left">Nome</th>
                    <th class="text-left">E-mail</th>
                    <th class="text-left">Perfil</th>
                    <th class="text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in postsRecentes" :key="item.id">
                    <!-- FOTO -->
                    <td>
                    <v-avatar size="32">
                        <v-img
                        v-if="item.foto"
                        :src="item.foto"
                        cover
                        />
                        <v-icon v-else icon="mdi-account-circle" />
                    </v-avatar>
                    </td>
                    <td>{{ item.nome }}</td>
                    <td>{{ item.email }}</td>
                    <td>
                      <v-chip size="x-small" :color="item.perfil === 'Administrador' ? 'success' : 'warning'">
                        {{ item.perfil }}
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

      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import MenuLateral from '~/components/admin/MenuLateral.vue';

    const postsRecentes = [
        { id: 1, foto: 'https://i.pravatar.cc/100?img=1', nome: 'Vitória', email: 'vitoriasteffane5@gmail.com', perfil: 'Administrador' },
        { id: 2, foto: 'https://i.pravatar.cc/100?img=1', nome: 'Vitória', email: 'vitoriasteffane5@gmail.com', perfil: 'Administrador' },
        { id: 3, foto: 'https://i.pravatar.cc/100?img=1', nome: 'Vitória', email: 'vitoriasteffane5@gmail.com', perfil: 'Administrador' },
    ]

</script>

<style>
    /* Faz a aplicação ocupar 100% da tela */
    html, body, #__nuxt, #app {
    height: 100%;
    margin: 0;
    }

    /* Trava o layout para não rolar tudo */
    .v-application {
    height: 100vh;
    overflow: hidden;
    }

    /* Apenas o conteúdo principal rola */
    .main-scroll {
    height: 100vh;
    overflow-y: auto;
    }
    .hover-effect {
    transition: 0.3s;
    cursor: pointer;
    }
    .hover-effect:hover {
    background-color: #f3efff !important;
    border-color: #7B5CFF !important;
    }
</style>
