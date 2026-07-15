<template>
  <v-img
    cover
    src="/capa_login.jpg"
    class="fill-height d-flex align-center justify-center"
  >
    <v-card class="containerLogin">
      <v-card-title class="fonte text-h5 font-weight-bold text-center pa-16 pt-0">
        Recuperar Senha
      </v-card-title>
      
      <p class="fonte instrucao-text text-center">
        Digite o seu e-mail cadastrado abaixo para receber um link de redefinição de senha.
      </p>
      
      <div class="fonte input-group">
        <i class="mdi mdi-email icon"></i>
        <input v-model="email" type="email" placeholder="Digite seu e-mail" @keyup.enter="enviarEmail" />
      </div>

      <transition name="fade">
        <span v-if="mensagem" class="fonte feedback-text">{{ mensagem }}</span>
      </transition>

      <div class="acoes-links">
        <NuxtLink href="login" class="fonte linkVoltar">
          <v-icon size="16">mdi-arrow-left</v-icon>
          Voltar para o login
        </NuxtLink>
      </div>

      <v-btn 
        class="fonte btn-login" 
        :loading="loading" 
        @click="enviarEmail"
      >
        Enviar Link
      </v-btn>
    </v-card>
  </v-img>
</template>

<script setup>

const runtimeConfig = useRuntimeConfig()
const apiBase = runtimeConfig.public.apiBase
const email = ref('')
const loading = ref(false)
const mensagem = ref('')

async function enviarEmail() {
  loading.value = true
  try {
    await $fetch(`${apiBase}/auth/esqueci-senha`, {
      method: 'POST',
      body: { email: email.value }
    })
    mensagem.value = "Verifique sua caixa de entrada!"
  } catch (err) {
    mensagem.value = "Ocorreu um erro ao tentar enviar o e-mail."
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fonte {
  font-family: 'Georgia', serif !important;
}

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

.acoes-links {
  width: 100%;
  display: flex;
  justify-content: flex-start;
}

.linkVoltar {
  display: flex;
  align-items: center;
  gap: 6px;
  color: whitesmoke;
  text-decoration: none;
  font-size: 14px;
  transition: 0.3s;
}

.linkVoltar:hover {
  color: #7B5CFF;
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