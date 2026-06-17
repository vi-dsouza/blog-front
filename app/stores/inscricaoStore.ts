import { defineStore } from "pinia"
import { ref } from 'vue'
import axios from 'axios'

interface InscritoForm {
    nome: string;
    email: string;
    consentimento_lgpd: boolean;
    sobrenome?: string; 
}

export const useInscritosStore = defineStore("inscritos", () => {
    const carregando = ref<boolean>(false)
    const erro = ref<string | null>(null)
    const sucesso = ref<boolean>(false)

    const API_URL = "http://localhost:5000/insc"

    async function realizarInscricao(dados: InscritoForm) {
        carregando.value = true
        erro.value = null
        sucesso.value = false

        try {
            const formData = new FormData()
            formData.append("nome", dados.nome)
            formData.append("email", dados.email)
            formData.append("consentimento_lgpd", String(dados.consentimento_lgpd))
            
            if (dados.sobrenome) {
                formData.append("sobrenome", dados.sobrenome)
            }

            const response = await axios.post(`${API_URL}/inscrever`, formData)
            
            sucesso.value = true
            return response.data
        } catch (err: any) {
            erro.value = err.response?.data?.error || "Erro ao realizar inscrição."
            throw err
        } finally {
            carregando.value = false
        }
    }

    async function confirmarToken(token: string) {
        carregando.value = true
        erro.value = null

        try {
            const response = await axios.get(`${API_URL}/confirmar`, {
                params: { token }
            })
            return response.data
        } catch (err: any) {
            erro.value = err.response?.data?.error || "Erro ao confirmar e-mail."
            console.log("Erro: ", erro.value)
            throw err
        } finally {
            carregando.value = false
        }
    }

    async function cancelarInscricao(email: string) {
        carregando.value = true
        erro.value = null

        try {
            const formData = new FormData()
            formData.append("email", email)

            const response = await axios.post(`${API_URL}/descadastrar`, formData)
            sucesso.value = true
            return response.data
        } catch (err: any) {
            erro.value = err.response?.data?.error || "Erro ao solicitar descadastro."
            throw err
        } finally {
            carregando.value = false
        }
    }

    function limparEstados() {
        erro.value = null
        sucesso.value = false
    }

    return {
        carregando,
        erro,
        sucesso,
        realizarInscricao,
        confirmarToken,
        limparEstados,
        cancelarInscricao
    }
})