<template>
  <v-footer class="text-center d-flex flex-column gap-4 py-8 custom-footer" color="transparent">

    <div class="text-body-small font-weight-regular w-100 mx-0">
      <v-row class="d-flex w-100 mx-0" align="center" justify="space-between">
        
        <v-col cols="12" md="4" class="fonte text-center mb-4 mb-md-0">
          <p class="footer-title">Política de Privacidade</p>
          <NuxtLink to="/TermosCondicoes" class="fonte footer-link">
            Termos e Condições
          </NuxtLink>
        </v-col>

        <v-col cols="12" md="4" class="fonte text-center mb-4 mb-md-0">
          <p class="footer-title">Fale Conosco</p>
          <p class="footer-text">Email: entreideiasvs@gmail.com</p>
        </v-col>

        <v-col cols="12" md="4" class="fonte text-center">
          <p class="footer-title">Redes Sociais</p>
          <div class="d-flex justify-center gap-2">
            <v-btn 
              v-for="icon in icons" 
              :key="icon" 
              :icon="icon" 
              density="comfortable" 
              variant="text"
              class="social-btn"
            ></v-btn>
          </div>
        </v-col>

      </v-row>
    </div>

    <v-divider class="my-4 custom-divider" thickness="1" width="40"></v-divider>
    <p class="fonte text-body-2 px-4 quote-text">"Feito com ❤️, café e algumas linhas de código."</p>
    <v-divider class="my-4 custom-divider" thickness="1" width="40"></v-divider>
    
    <div class="fonte text-caption text-sm-body-2 copyright-text">
      <strong>© {{ new Date().getFullYear() }} Entre Ideias</strong> — Todos os direitos reservados.
    </div>
  </v-footer>
</template>

<script setup>
  const icons = [
    'mdi-facebook',
    'mdi-twitter',
    'mdi-linkedin',
    'mdi-instagram',
  ]
</script>

<style scoped>
.fonte {
  font-family: 'Georgia', serif !important;
}

.custom-footer {
  background: #000000 !important; 
  border-top: 1px solid rgba(212, 175, 55, 0.3) !important; 
}

.footer-title {
  color: #FFFFFF !important;
  font-size: 0.9rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 8px;
}

.footer-text {
  color: #D1C7BD !important;
  font-size: 0.85rem;
  opacity: 0.9;
}

.quote-text {
  color: #FFFFFF !important;
  font-style: italic;
  opacity: 0.7;
}

.footer-link {
  color: #D1C7BD !important;
  font-size: 0.85rem;
  text-decoration: none;
  transition: color 0.2s ease, opacity 0.2s ease;
}

.footer-link:hover {
  color: #FFFFFF !important;
  text-decoration: underline;
}

.social-btn {
  color: #D1C7BD !important;
  opacity: 0.8;
  transition: transform 0.2s ease, color 0.2s ease;
}

.social-btn:hover {
  color: #9d4edd !important;
  transform: translateY(-1px);
}

.custom-divider {
  border-color: rgba(212, 175, 55, 0.6) !important;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 0 4px rgba(212, 175, 55, 0.1) !important;
}

.copyright-text {
  color: #D1C7BD !important;
  opacity: 0.5;
  letter-spacing: 0.5px;
}
</style>