<template>
    <Teleport to="body">
        <div v-if="modelValue" class="overlay" @click.self="fechar">
            <div class="modal">
                <slot></slot>
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
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    }

    .modal {
        background: white;
        padding: 20px;
        border-radius: 8px;
        min-width: 300px;
    }

    .fechar {
        margin-top: 10px;
    }
</style>