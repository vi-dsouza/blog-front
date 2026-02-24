<template>
  <v-app>
    <MenuLateral />

    <v-main class="main-scroll">
      <v-container fluid class="pa-4 pa-sm-8">
        <v-card-text class="text-h5 font-weight-bold text-center text-sm-left ms-6 mt-n16 mb-2">
          Administradores
        </v-card-text>

        <v-col cols="12" class="mt-4">
          <v-card border flat class="rounded-lg pa-4">
            <v-card-title class="px-0 d-flex justify-space-between align-center">
              Administradores do Blog
              <v-btn @click="cadastroAdmin = true" color="#7B5CFF" theme="dark" size="small">
                Cadastrar
              </v-btn>

              <!-- MODAL -->
              <ModalCadastroUsuario v-model="cadastroAdmin">

                <!-- HEADER -->
                <div class="d-flex justify-space-between align-center mb-6">
                  <div>
                    <h2 class="text-h5 font-weight-bold">Cadastrar Administrador</h2>
                    <p class="text-caption text-grey">
                      Preencha as informações abaixo para criar um novo usuário
                    </p>
                  </div>
                  <v-btn icon="mdi-close" variant="text" @click="cadastroAdmin = false" />
                </div>

                <!-- CONTEÚDO -->
                <v-row>

                  <!-- UPLOAD -->
                  <v-col cols="12" md="4" class="d-flex justify-center">
                    <v-sheet
                      border="dashed md"
                      color="grey-lighten-4"
                      height="225"
                      width="440"
                      rounded="xl"
                      elevation="0"
                      class="d-flex flex-column align-center justify-center position-relative cursor-pointer upload-box overflow-hidden"
                      @click="$refs.fileInput.click()"
                    >
                      <v-icon size="42" color="#7B5CFF" class="mb-2">
                        mdi-cloud-upload-outline
                      </v-icon>

                      <span class="text-caption font-weight-medium text-center">
                        Clique para enviar a foto
                      </span>

                      <v-img
                        v-if="urlPreview"
                        :src="urlPreview"
                        cover
                        class="position-absolute w-100 h-100"
                      >
                        <div class="d-flex justify-end pa-2">
                          <v-btn
                            icon="mdi-close"
                            size="x-small"
                            color="red"
                            elevation="2"
                            @click.stop="limparFoto"
                          />
                        </div>
                      </v-img>

                      <v-file-input
                        ref="fileInput"
                        v-model="foto"
                        accept="image/*"
                        class="d-none"
                        @update:modelValue="gerarPreview"
                      />
                    </v-sheet>
                  </v-col>

                  <!-- FORMULÁRIO -->
                  <v-col cols="12" md="8">
                    <v-text-field
                      label="Nome"
                      variant="outlined"
                      density="comfortable"
                      class="mb-4"
                      prepend-inner-icon="mdi-account"
                    />

                    <v-text-field
                      label="E-mail"
                      variant="outlined"
                      density="comfortable"
                      class="mb-4"
                      prepend-inner-icon="mdi-email"
                    />

                    <v-text-field
                      label="Senha"
                      type="password"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-lock"
                    />
                  </v-col>

                </v-row>

                <!-- DIVISOR -->
                <v-divider class="my-6" />

                <!-- AÇÕES -->
                <div class="d-flex justify-end gap-3">
                  <v-btn variant="text" @click="cadastroAdmin = false">
                    Cancelar
                  </v-btn>

                  <v-btn color="#7B5CFF" theme="dark" elevation="2">
                    Salvar
                  </v-btn>
                </div>

              </ModalCadastroUsuario>

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
                  <td>
                    <v-avatar size="32">
                      <v-img v-if="item.foto" :src="item.foto" cover />
                      <v-icon v-else icon="mdi-account-circle" />
                    </v-avatar>
                  </td>
                  <td>{{ item.nome }}</td>
                  <td>{{ item.email }}</td>
                  <td>
                    <v-chip
                      size="x-small"
                      :color="item.perfil === 'Administrador' ? 'success' : 'warning'"
                    >
                      {{ item.perfil }}
                    </v-chip>
                  </td>
                  <td class="text-right">
                    <v-btn icon="mdi-pencil" variant="text" size="small" color="blue" />
                    <v-btn icon="mdi-delete" variant="text" size="small" color="red" />
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
import MenuLateral from '~/components/admin/MenuLateral.vue'
import ModalCadastroUsuario from '~/components/admin/ModalCadastroUsuario.vue'

const postsRecentes = [
  { id: 1, foto: 'https://i.pravatar.cc/100?img=1', nome: 'Vitória', email: 'vitoriasteffane5@gmail.com', perfil: 'Administrador' },
  { id: 2, foto: 'https://i.pravatar.cc/100?img=2', nome: 'Vitória', email: 'vitoriasteffane5@gmail.com', perfil: 'Administrador' },
  { id: 3, foto: 'https://i.pravatar.cc/100?img=3', nome: 'Vitória', email: 'vitoriasteffane5@gmail.com', perfil: 'Administrador' },
]

const cadastroAdmin = ref(false)

// UPLOAD
const foto = ref<File | null>(null)
const urlPreview = ref<string | null>(null)

function gerarPreview(file: File | File[] | null) {
  if (!file) return
  const arquivo = Array.isArray(file) ? file[0] : file
  urlPreview.value = URL.createObjectURL(arquivo)
}

function limparFoto() {
  foto.value = null
  urlPreview.value = null
}
</script>

<style>
/* Layout principal */
html, body, #__nuxt, #app {
  height: 100%;
  margin: 0;
}
.v-application {
  height: 100vh;
  overflow: hidden;
}
.main-scroll {
  height: 100vh;
  overflow-y: auto;
}

/* Upload Box */
.upload-box {
  transition: all 0.3s ease;
  cursor: pointer;
}
.upload-box:hover {
  border-color: #7B5CFF !important;
  background-color: #f3efff !important;
  transform: scale(1.03);
}
</style>