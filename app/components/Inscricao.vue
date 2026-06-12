<template>
    <v-main>
        <v-container class="pa-2">
            <v-card-title class="">
                Gostou do blog?
            </v-card-title>
            <v-card-text class="">
                Inscreva-se para receber as últimas atualizações e novidades diretamente no seu e-mail!
            </v-card-text>
            <v-card-actions class="d-flex">
                <v-btn color="primary" class="ma-2 subscribe-button" @click="dialog = true">Inscrever-se</v-btn>
            </v-card-actions>
        </v-container>
    
        <v-dialog v-model="dialog" max-width="450px">
            <v-card>
                <v-card-title class="text-h5 mx-2 my-0 mt-2">
                    Newsletter Entre Ideias
                </v-card-title>
                <v-card-text class="pt-2 px-6 pb-0">
                    <p class="ma-0 mt-0">Inscreva-se e fique por dentro de novos posts</p>
                </v-card-text>
                <v-divider style="margin-top: 16px; border-color: #2196F3; height: 10px;"></v-divider>
                <v-card-text class="pa-6">
                    <v-form>
                        <v-text-field label="Nome" variant="outlined" required class="mb-4"></v-text-field>
                        <v-text-field label="E-mail" type="email" variant="outlined" required></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions class="pa-4 d-flex gap-2">
                    <v-spacer></v-spacer>
                    <v-btn variant="text" @click="dialog = false">Cancelar</v-btn>
                    <v-btn color="primary" style="border: 1px solid">Me inscrever</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const dialog = ref(false)

const confirm = () => {
    dialog.value = false
}

</script>

<style scoped>
.subscribe-button {
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 10px 25px rgba(33, 150, 243, 0.2);
  border: 1px solid #2196F3;
}

.subscribe-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 30px rgba(33, 150, 243, 0.35);
}

.subscribe-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top left, rgba(255,255,255,0.65), transparent 25%);
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
}

.subscribe-button:hover::before {
  opacity: 1;
}

.subscribe-button::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 300%;
  height: 300%;
  background: rgba(255, 255, 255, 0.12);
  transform: translate(-50%, -50%) scale(0.7);
  opacity: 0;
  border-radius: 50%;
  transition: transform 0.5s ease, opacity 0.5s ease;
  pointer-events: none;
}

.subscribe-button:hover::after {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.subscribe-button {
  animation: pulse-border 2.8s ease-in-out infinite;
}

@keyframes pulse-border {
  0%, 100% {
    box-shadow: 0 10px 25px rgba(33, 150, 243, 0.18);
  }
  50% {
    box-shadow: 0 12px 30px rgba(33, 150, 243, 0.28);
  }
}
</style>