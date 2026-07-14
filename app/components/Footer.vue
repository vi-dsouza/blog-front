<template>
  <v-footer class="text-center d-flex flex-column gap-4 py-8 custom-footer" color="transparent">

    <div class="text-body-small font-weight-regular w-100 mx-0">
      <v-row class="d-flex w-100 mx-0" align="center" justify="space-between">
        
        <v-col cols="12" md="4" class="fonte text-center mb-4 mb-md-0">
          <p class="footer-title">Política de Privacidade</p>
          <a href="/TermosCondicoes" target="_blank" rel="noopener noreferrer" class="fonte footer-link">
            Termos e Condições
          </a>
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

    <!-- Divisor minimalista sutil em tom dourado -->
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

/* Fundo Preto Puro com a bordinha superior dourada sutil */
.custom-footer {
  background: #000000 !important; 
  /* Bordinha dourada no topo em harmonia com os elementos visuais do banner */
  border-top: 1px solid rgba(212, 175, 55, 0.3) !important; 
}

/* Títulos em Branco Puro */
.footer-title {
  color: #FFFFFF !important;
  font-size: 0.9rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 8px;
}

/* Textos informativos em Bege Acinzentado Neutro */
.footer-text {
  color: #D1C7BD !important;
  font-size: 0.85rem;
  opacity: 0.9;
}

/* Frase em Branco com opacidade de texto clássico de editorial */
.quote-text {
  color: #FFFFFF !important;
  font-style: italic;
  opacity: 0.7;
}

/* Links limpos que mudam levemente de opacidade */
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

/* Botões de redes sociais discretos */
.social-btn {
  color: #D1C7BD !important;
  opacity: 0.8;
  transition: transform 0.2s ease, color 0.2s ease;
}

.social-btn:hover {
  color: #9d4edd !important; /* Toque de Roxo sofisticado apenas no foco */
  transform: translateY(-1px);
}

/* Divisor dourado sutil no meio do conteúdo */
.custom-divider {
  /* Dourado suave e sutil */
  border-color: rgba(212, 175, 55, 0.6) !important;
  margin-left: auto;
  margin-right: auto;
  
  /* Um leve brilho dourado bem discreto nas linhas */
  box-shadow: 0 0 4px rgba(212, 175, 55, 0.1) !important;
}

/* Direitos autorais discretos */
.copyright-text {
  color: #D1C7BD !important;
  opacity: 0.5;
  letter-spacing: 0.5px;
}
</style>