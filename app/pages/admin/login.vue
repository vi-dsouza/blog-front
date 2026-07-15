<template>
  <v-img
    cover
    src="/capa_login.jpg"
    class="fill-height d-flex align-center justify-center"
  >
    <v-card class="containerLogin">
      <v-card-title class="fonte text-h5 font-weight-bold text-center pa-16 pt-0">
        Painel do Administrador
      </v-card-title>

      <div class="fonte input-group">
        <i class="mdi mdi-email icon"></i>
        <input v-model="email" type="email" placeholder="E-mail" @keyup.enter="handleLogin" />
      </div>

      <div class="fonte input-group">
        <i class="mdi mdi-lock icon"></i>
        <input v-model="password" type="password" placeholder="Senha" @keyup.enter="handleLogin" />
      </div>

      <transition name="fade">
        <span v-if="errorMsg" class="fonte error-text">{{ errorMsg }}</span>
      </transition>

      <NuxtLink href="esqueci-senha" class="fonte linkCadastro">
        <v-icon size="18">mdi-lock</v-icon>
        Esqueci minha senha
      </NuxtLink>

      <v-btn 
        class="fonte btn-login" 
        :loading="loading" 
        :disabled="isButtonDisabled"
        @click="handleLogin"
      >
        <span v-if="cooldownSeconds > 0">Bloqueado ({{ cooldownSeconds }}s)</span>
        <span v-else>Entrar</span>
      </v-btn>
    </v-card>
  </v-img>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
const apiBase = runtimeConfig.public.apiBase
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')
const cooldownSeconds = ref(0)
const timerInterval = ref(null)
const isButtonDisabled = computed(() => loading.value || cooldownSeconds.value > 0)

function startCooldown(seconds) {
  cooldownSeconds.value = seconds
  clearInterval(timerInterval.value)

  timerInterval.value = setInterval(() => {
    if (cooldownSeconds.value > 1) {
      cooldownSeconds.value--
    } else {
      cooldownSeconds.value = 0
      errorMsg.value = '' 
      clearInterval(timerInterval.value)
    }
  }, 1000)
}

onUnmounted(() => {
  clearInterval(timerInterval.value)
})

async function handleLogin() {
  if (isButtonDisabled.value) return
  if (!email.value || !password.value) {
    errorMsg.value = 'Preencha todos os campos.'
    return
  }

  loading.value = true
  errorMsg.value = ''

  try {
    const data = await $fetch(`${apiBase}/auth/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: {
        email: email.value,
        senha: password.value
      }
    })

    if (data?.token) {
      const token = useCookie('auth_token', { maxAge: 7200, sameSite: 'lax' })
      token.value = data.token

      const user = useCookie('user', { maxAge: 7200, sameSite: 'lax' })
      user.value = {
        nome: data.user_nome,
        foto_url: data.user_foto
          ? `${apiBase}/uploads/${data.user_foto}`
          : '/smirk.png'
      }

      await navigateTo('/admin/dashboard')
    }
  } catch (err) {
    const serverError =
      err?.data ||
      err?.response?._data ||
      err?.response?.body ||
      {}

    errorMsg.value =
      serverError.error ||
      serverError.message ||
      'Falha na autenticação.'

    if (err?.response?.status === 403) {
      const match = errorMsg.value.match(/\d+/)
      const secondsToWait = match ? parseInt(match[0], 10) : 60
      
      startCooldown(secondsToWait)
    }

    console.error('Erro do login:', err)
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
    width: 90%;
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

.btn-login :deep(.v-btn__content) {
  color: white;
}

</style>

