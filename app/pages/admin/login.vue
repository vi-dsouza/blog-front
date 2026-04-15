<script setup>
// Reatividade para capturar os dados
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  // 1. Mude para password.value aqui (para bater com seu ref)
  if (!email.value || !password.value) { 
    errorMsg.value = "Preencha todos os campos."
    return
  }

  loading.value = true
  errorMsg.value = ""

  try {
    const data = await $fetch('http://localhost:5000/auth/login', {
      method: 'POST',
      body: { 
        email: email.value, 
        senha: password.value  // 'senha' é como o Python espera, 'password.value' é sua ref do Vue
      }
    })

    // 2. Verificação de segurança: Só salva se o token vier na resposta
    if (data && data.token) {
      const token = useCookie('auth_token', { maxAge: 7200, sameSite: 'lax' })
      token.value = data.token
      
      // 3. Verifique se a rota '/admin/Dashboard' realmente existe no seu Nuxt
      await navigateTo('/admin/Dashboard')
    }
    
  } catch (err) {
    // Captura o erro vindo do Flask (401, 400, etc)
    errorMsg.value = err.data?.error || "Falha na autenticação."
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-img
    cover
    src="/capa_login.jpg"
    class="fill-height d-flex align-center justify-center"
  >
    <v-card class="containerLogin">
      <v-card-title class="text-h5 font-weight-bold text-center pa-16 pt-0">
        Painel do Administrador
      </v-card-title>

      <div class="input-group">
        <i class="mdi mdi-email icon"></i>
        <input v-model="email" type="email" placeholder="E-mail" @keyup.enter="handleLogin" />
      </div>

      <div class="input-group">
        <i class="mdi mdi-lock icon"></i>
        <input v-model="password" type="password" placeholder="Senha" @keyup.enter="handleLogin" />
      </div>

      <transition name="fade">
        <span v-if="errorMsg" class="error-text">{{ errorMsg }}</span>
      </transition>

      <NuxtLink to="/cadastro" class="linkCadastro">
        <v-icon size="18">mdi-account</v-icon>
        Cadastrar administrador
      </NuxtLink>

      <v-btn 
        class="btn-login" 
        :loading="loading" 
        @click="handleLogin"
      >
        Entrar
      </v-btn>
    </v-card>
  </v-img>
</template>


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
  width: 26vw;
  min-height: 420px;
  gap: 28px;
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

.linkCadastro {
    align-self: flex-end;
    display: flex;
    align-items: center;
    gap: 6px;
    color: whitesmoke;
    text-decoration: none;
    font-weight: 600;
    transition: 0.3s;
}

.linkCadastro:hover {
    color: #7B5CFF;
}

.btn-login {
  width: 100%;
  height: 45px;
  border-radius: 12px;
  background: linear-gradient(135deg, #7B5CFF);
  color: white;
  font-weight: 600;
}

@media(max-width: 600px){
  .containerLogin {
    padding: 30px 20px;
    gap: 20px;
  }

  .v-card-title {
    font-size: 20px;
  }

  .btn-login {
    height: 42px;
  }
}

.error-text {
  color: #ffb3b3;
  font-size: 14px;
  font-weight: 500;
  margin-top: -10px;
  text-shadow: 0 2px 10px rgba(255, 0, 0, 0.3);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Garante que o loading do Vuetify não quebre seu gradiente */
.btn-login :deep(.v-btn__content) {
  color: white;
}

</style>

