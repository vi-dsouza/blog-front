<template>
  <v-footer class="text-center d-flex flex-column gap-4 py-4" color="indigo-lighten-1">

    <div class="text-body-small font-weight-regular opacity-60 w-100 mx-0">
        <v-row cols="12" class="d-flex flex-nowrap gap-16 w-100 mx-0" align="center" justify="space-between" style="width: 100%;">
            <v-col md="4" class="text-center">
                <p><strong>Política de Privacidade</strong></p>
                <a href="/TermosCondicoes" target="_blank" rel="noopener noreferrer">Termos e Condições</a>
            </v-col>
            <v-col cols="4" md="4" class="text-center">
                <p><strong>Fale Conosco</strong></p>
                <p>Email: entreideias@gmail.com</p>
            </v-col>
            <v-col cols="4" md="4" class="text-center">
                <p><strong>Redes Sociais</strong></p>
                <div class="d-flex justify-center">
                  <v-btn v-for="icon in icons" :key="icon" :icon="icon" density="comfortable" variant="text"></v-btn>
                </div>
            </v-col>
        </v-row>
    </div>
    <br>
    <v-divider class="my-2" thickness="2" width="50"></v-divider>
    <p>"Feito com ❤️, café e algumas linhas de código."</p>
    <v-divider class="my-2" thickness="2" width="50"></v-divider>
    <br>    
    <div>
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