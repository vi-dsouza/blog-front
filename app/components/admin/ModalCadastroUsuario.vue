<template>
  <Teleport to="body">
    <div v-if="modelValue" class="overlay" @click.self="fechar">
      <div class="modal">
        <div class="modal-content">
          <slot></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue'])

function fechar() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(2px); /* Suaviza o fundo para isolar o modal */
}

.modal {
  background: white;
  padding: 28px;
  border-radius: 16px;
  
  /* LARGURA CONTROLADA: Impede o modal de esticar/encolher horizontalmente */
  width: 600px; 
  max-width: 92vw; 
  
  /* ALTURA DE SEGURANÇA: Evita que o modal mude de tamanho caso mensagens de erro sumam/apareçam */
  min-height: 300px; 

  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  box-sizing: border-box;
}

.modal-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
</style>