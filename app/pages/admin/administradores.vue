<template>
  <v-app theme="light">
    <MenuLateral />

    <v-main class="main-scroll">
      <v-container fluid class="pa-4 pa-sm-8" >
        <v-card-text class="text-h5 font-weight-bold text-center text-sm-left ms-6 mt-n16 mb-2">
          Administradores
        </v-card-text>

        <v-col cols="12" class="mt-4">
          <v-card border flat class="rounded-lg pa-4">
            <v-card-title class="px-0 d-flex justify-space-between align-center">
              Administradores do Blog
              <v-btn @click="abrirModalCadastro" color="#7B5CFF" theme="dark" size="small">
                Cadastrar
              </v-btn>

              <ModalCadastroUsuario v-model="cadastroAdmin">
                <div class="d-flex flex-column" style="height: 75vh; max-height: 600px; min-height: 0;">

                  <div class="d-flex justify-space-between align-center mb-4 flex-shrink-0">
                    <div>
                      <h2 class="text-h5 font-weight-bold">
                        {{ idSelecionado ? 'Editar Administrador' : 'Cadastrar Administrador' }}
                      </h2>
                      <p class="text-caption text-grey mb-0">
                        {{ idSelecionado ? 'Altere os dados do administrador' : 'Preencha as informações para criar um novo usuário' }}
                      </p>
                    </div>
                    <v-btn icon="mdi-close" variant="text" @click="fecharModal" />
                  </div>

                  <div class="flex-grow-1 overflow-y-auto pe-2" style="min-height: 0;">
                    <v-row>
                      <v-col cols="12" sm="5" md="4" class="d-flex justify-center align-start">
                        <v-sheet
                          border="dashed md"
                          color="grey-lighten-4"
                          height="180"
                          width="100%"
                          max-width="220"
                          rounded="xl"
                          elevation="0"
                          class="d-flex flex-column align-center justify-center position-relative cursor-pointer upload-box overflow-hidden"
                          @click="$refs.fileInput.click()"
                        >
                          <v-icon size="36" color="#7B5CFF" class="mb-2">
                            mdi-cloud-upload-outline
                          </v-icon>

                          <span class="text-caption font-weight-medium text-center px-2">
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
                            v-model="fotoArray"
                            accept="image/*"
                            class="d-none"
                            @update:modelValue="gerarPreview"
                          />
                        </v-sheet>
                      </v-col>

                      <v-col cols="12" sm="7" md="8">
                        <v-text-field
                          label="Nome"
                          v-model="form.nome"
                          variant="outlined"
                          density="compact"
                          class="mb-3"
                          prepend-inner-icon="mdi-account"
                        />

                        <v-text-field
                          label="E-mail"
                          v-model="form.email"
                          variant="outlined"
                          density="compact"
                          class="mb-3"
                          prepend-inner-icon="mdi-email"
                        />

                        <v-text-field
                          label="Senha"
                          v-model="form.senha"
                          type="password"
                          variant="outlined"
                          density="compact"
                          prepend-inner-icon="mdi-lock"
                          :placeholder="idSelecionado ? 'Deixe em branco para manter a atual' : ''"
                        />  
                      </v-col>
                      
                      <v-col cols="12" class="pt-0">
                        <v-textarea 
                          label="Biografia" 
                          variant="outlined"
                          v-model="form.biografia"
                          density="compact"
                          prepend-inner-icon="mdi-account-details-outline"  
                          counter="500"
                          maxlength="500"
                          rows="3"
                          class="mb-2"
                        />

                        <v-switch 
                          label="Administrador"
                          v-model="form.is_admin"
                          color="success"
                          hide-details
                        />
                      </v-col>
                    </v-row>
                  </div>

                  <div class="d-flex justify-end gap-3 pt-4 border-top flex-shrink-0">
                    <v-btn variant="text" @click="fecharModal">
                      Cancelar
                    </v-btn>

                    <v-btn color="#7B5CFF" theme="dark" elevation="2" @click="handleSalvar">
                      Salvar
                    </v-btn>
                  </div>

                </div>
              </ModalCadastroUsuario>

            </v-card-title>

            <v-table density="compact" >
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
                <tr v-for="item in adminStore.admin" :key="item.id">
                  <td>
                    <v-avatar size="32">
                      <v-img v-if="item.foto_url" :src="item.foto_url" cover />
                      <v-icon v-else icon="mdi-account-circle" />
                    </v-avatar>
                  </td>
                  <td>{{ item.nome }}</td>
                  <td>{{ item.email }}</td>
                  <td>
                    <v-chip size="x-small" :color="item.is_admin ? 'success' : 'warning'">
                      {{ item.is_admin ? 'Administrador' : 'Usuário' }}
                    </v-chip>
                  </td>
                  <td class="text-right">
                    <v-btn icon="mdi-pencil" variant="text" size="small" color="blue" @click="abrirEdicao(item)" />
                    <v-btn icon="mdi-delete" variant="text" size="small" color="red" @click="deletar(item)" />
                  </td>
                </tr>
                <tr v-if="!adminStore.loading && adminStore.admin.length === 0">
                  <td colspan="5" class="text-center">Nenhum administrador encontrado.</td>
                </tr>
                <tr v-if="adminStore.loading">
                  <td colspan="5" class="text-center">Carregando...</td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-col>

      </v-container>
    </v-main>
  </v-app>

  <v-dialog v-model="modalDelete" max-width="450">
    <v-card>
      <v-toolbar flat color="#7B5CFF">
        <v-toolbar-title class="text-white font-weight-bold">Confirmar exclusão</v-toolbar-title>
        <v-btn icon="mdi-close" variant="text" class="text-white" @click="modalDelete = false" />
      </v-toolbar>
      <v-card-text class="pt-4">
        Tem certeza que deseja excluir o administrador <strong>"{{ adminParaDeletar?.nome }}"</strong>?
      </v-card-text>
      <v-card-actions class="justify-end pb-4 px-4">
        <v-btn variant="text" color="grey" @click="modalDelete = false">Cancelar</v-btn>
        <v-btn color="red" variant="flat" class="text-white" @click="deletarConfirmado">Excluir</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MenuLateral from '~/components/admin/MenuLateral.vue'
import ModalCadastroUsuario from '~/components/admin/ModalCadastroUsuario.vue'
import { useAdminStore } from '~/stores/adminStore'
import { useAlertStore } from "~/stores/alert"

definePageMeta({
  middleware: 'auth'
})

const alertStore = useAlertStore()
const adminStore = useAdminStore()

// CORREÇÃO: Vuetify trabalha melhor vinculando arrays no v-model do v-file-input
const fotoArray = ref<File[]>([])
const idSelecionado = ref<number | null>(null)

const modalDelete = ref(false)
const adminParaDeletar = ref<any>(null)
const cadastroAdmin = ref(false)
const urlPreview = ref<string | null>(null)

const form = ref({
  nome: '',
  email: '',
  senha: '',
  is_admin: false,
  biografia: ''
})

const handleSalvar = async () => {
  try {
    // Coleta a foto se ela existir no array reativo
    const arquivoFinal = fotoArray.value.length > 0 ? fotoArray.value[0] : null
    const dados = { ...form.value, foto: arquivoFinal };

    if (idSelecionado.value) {
      await adminStore.atualizarAdmin(idSelecionado.value, dados);
      alertStore.showSuccess('Atualizado com sucesso');
    } else {
      await adminStore.registrarAdmin(dados);
      alertStore.showSuccess('Cadastrado com sucesso');
    }

    await adminStore.busca_admins();
    fecharModal();
  } catch (e) {
    alertStore.showError('Erro na operação');
  }
}

const abrirModalCadastro = () => {
  idSelecionado.value = null;
  resetForm();
  cadastroAdmin.value = true;
}

const abrirEdicao = (item: any) => {
  idSelecionado.value = item.id;
  form.value = {
    nome: item.nome,
    email: item.email,
    senha: '', 
    is_admin: !!item.is_admin,
    biografia: item.biografia,
  };
  urlPreview.value = item.foto_url || null;
  cadastroAdmin.value = true;
}

const fecharModal = () => {
  cadastroAdmin.value = false;
  idSelecionado.value = null;
  resetForm();
}

const deletar = (item: any) => {
  adminParaDeletar.value = item
  modalDelete.value = true
}

const deletarConfirmado = async () => {
  if (!adminParaDeletar.value) return

  await adminStore.deletarAdmin(adminParaDeletar.value.id)

  modalDelete.value = false
  adminParaDeletar.value = null

  await adminStore.busca_admins()
  alertStore.showSuccess("Administrador deletado com sucesso")
}

// CORREÇÃO: Refatorado para capturar corretamente a emissão do array
function gerarPreview(arquivos: File | File[] | null) {
  if (!arquivos) return
  const arquivo = Array.isArray(arquivos) ? arquivos[0] : arquivos
  urlPreview.value = URL.createObjectURL(arquivo)
}

const resetForm = () => {
  form.value = { 
    nome: '', 
    email: '', 
    senha: '', 
    is_admin: false, 
    biografia: ''
  };
  fotoArray.value = [];
  urlPreview.value = null;
};

function limparFoto() {
  fotoArray.value = []
  urlPreview.value = null
}

onMounted(() => {
  adminStore.busca_admins()
})
</script>

<style>
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

.upload-box {
  transition: all 0.3s ease;
  cursor: pointer;
}
.upload-box:hover {
  border-color: #7B5CFF !important;
  background-color: #f3efff !important;
  transform: scale(1.03);
}

.gap-3 {
  gap: 12px;
}
</style>