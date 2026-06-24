<template>
  <v-footer class="text-center d-flex flex-column gap-4 py-6" color="surface">

    <div class="text-body-small font-weight-regular opacity-60 w-100 mx-0">
      <v-row class="d-flex w-100 mx-0" align="center" justify="space-between">
        
        <v-col cols="12" md="4" class="fonte text-center mb-4 mb-md-0">
          <p><strong>Política de Privacidade</strong></p>
          <a href="/TermosCondicoes" target="_blank" rel="noopener noreferrer" class="fonte text-white decoration-none">
            Termos e Condições
          </a>
        </v-col>

        <v-col cols="12" md="4" class="fonte text-center mb-4 mb-md-0">
          <p><strong>Fale Conosco</strong></p>
          <p>Email: entreideias@gmail.com</p>
        </v-col>

        <v-col cols="12" md="4" class="fonte text-center">
          <p><strong>Redes Sociais</strong></p>
          <div class="d-flex justify-center">
            <v-btn v-for="icon in icons" :key="icon" :icon="icon" density="comfortable" variant="text"></v-btn>
          </div>
        </v-col>

      </v-row>
    </div>

    <v-divider class="my-4" thickness="2" width="50"></v-divider>
    <p class="fonte text-body-2 px-4">"Feito com ❤️, café e algumas linhas de código."</p>
    <v-divider class="my-4" thickness="2" width="50"></v-divider>
    
    <div class="fonte text-caption text-sm-body-2">
      <strong>© {{ new Date().getFullYear() }} Entre Idéias</strong> — Todos os direitos reservados.
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
a {
  color: inherit;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
</style>