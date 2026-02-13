<template>
  <v-img
    cover
    src="/capa_login.jpg"
    class="fill-height d-flex align-center justify-center"
  >
    <v-card class="containerLogin">

      <v-card-title
        class="text-h5 font-weight-bold text-center pa-16 pt-0"
      >
        Painel do Administrador
      </v-card-title>

      <div class="input-group">
        <i class="mdi mdi-email icon"></i>
        <input type="email" placeholder="E-mail" />
      </div>

      <div class="input-group">
        <i class="mdi mdi-lock icon"></i>
        <input type="password" placeholder="Senha" />
      </div>

      <NuxtLink to="#" class="linkCadastro">
        <v-icon size="18">mdi-account</v-icon>
        Cadastrar administrador
      </NuxtLink>
      <v-btn class="btn-login">Entrar</v-btn>

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

</style>

