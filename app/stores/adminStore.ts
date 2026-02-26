import { defineStore } from "pinia"
import { ref } from 'vue'
import axios from 'axios'

interface AdminRegister {
    nome: string;
    email: string;
    senha?: string;
    foto: File | null;
}

export const useAdminStore = defineStore('admin', () => {
    const loading = ref(false)
    const error = ref<string | null>(null);

    async function registrarAdmin(payload: AdminRegister) {
        loading.value = true
        error.value = null

        const formData = new FormData()
        formData.append('nome', payload.nome)
        formData.append('email', payload.email)

        if (payload.senha) formData.append('senha', payload.senha)
        if (payload.foto) formData.append('foto', payload.foto)

        try {
            // Removido o header manual para o Axios configurar o boundary automaticamente
            const response = await axios.post('http://localhost:5000/auth/register', formData);
            return response.data
        } catch (err: any) {
            // Correção do erro de digitação: .response
            const mensagemErro = err.response?.data?.message || 'Erro ao cadastrar administrador!';
            error.value = mensagemErro;
            console.error("Erro na API:", err.response?.data); // Para você ver o log real no console
            throw err
        } finally {
            loading.value = false
        }
    }

    return { registrarAdmin, loading, error }
})