<template>
  <v-img
    cover
    src="/capa_login.jpg"
    class="fill-height d-flex align-center justify-center"
  >
    <v-card class="containerLogin">
      <v-card-title class="text-h5 font-weight-bold text-center pa-16 pt-0">
        Nova Senha
      </v-card-title>

      <p class="instrucao-text text-center">
        Digite e confirme a sua nova senha de acesso administrativo abaixo.
      </p>
      
      <div class="input-group">
        <i class="mdi mdi-lock icon"></i>
        <input 
          v-model="password" 
          type="password" 
          placeholder="Digite a nova senha" 
          @keyup.enter="atualizarSenha" 
        />
      </div>

      <transition name="fade">
        <span v-if="mensagem" class="feedback-text">{{ mensagem }}</span>
      </transition>

      <v-btn 
        class="btn-login" 
        :loading="loading" 
        @click="atualizarSenha"
      >
        Alterar Senha
      </v-btn>
    </v-card>
  </v-img>
</template>

<script setup>
import { useAlertStore }  from '@/stores/alert'

const password = ref('')
const loading = ref(false)
const route = useRoute() // Para pegar os parâmetros da URL
const alertStore = useAlertStore()

async function atualizarSenha() {
  const token = route.query.token // Captura o ?token=XYZ da URL
  
  if (!token) {
    alert("Token ausente ou inválido.")
    return
  }

  loading.value = true
  try {
    await $fetch('http://localhost:5000/auth/redefinir-senha', {
      method: 'POST',
      body: { token, password: password.value }
    })
    alertStore.showSuccess("Senha alterada com sucesso! Agora você pode fazer login.")
    window.location.href = '/admin/login'
  } catch (err) {
    alertStore.showError("Erro ao redefinir a senha. O link pode ter expirado.")
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fill-height {
  height: 100vh !important;
  width: 100vw;
}

.containerLogin {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  width: 100%;
  max-width: 420px;
  min-width: 320px;
  min-height: 420px;
  gap: 24px;
  padding: 48px 40px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
}

.v-card-title {
  color: rgba(255, 255, 255, 0.95);
  font-size: 26px;
  letter-spacing: 1px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
}

.instrucao-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 1.5;
  margin-top: -10px;
}

.input-group {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 14px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.input-group:hover {
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.input-group input {
  background: transparent;
  border: none;
  outline: none;
  flex: 1;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
}

.input-group input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.icon {
  margin-right: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 18px;
}

.btn-login {
  width: 100%;
  height: 45px;
  border-radius: 12px;
  background: linear-gradient(135deg, #7B5CFF);
  color: white;
  font-weight: 600;
  text-transform: none;
}

.feedback-text {
  color: #e3dcff;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  text-shadow: 0 2px 10px rgba(123, 92, 255, 0.3);
}

@media(max-width: 600px){
  .containerLogin {
    width: 90%;
    padding: 30px 20px;
    gap: 20px;
  }

  .v-card-title {
    font-size: 22px;
  }

  .btn-login {
    height: 42px;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.btn-login :deep(.v-btn__content) {
  color: white;
}
</style>