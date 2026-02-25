import { defineStore } from "pinia"
import { ref } from 'vue'

interface Admin {
    id: number
    nome: string
    email: string
    senha: string
    foto: string
}

type NovoAdmin = Omit<Admin, 'id'>

export const useAdminStore = defineStore('admin', () => {
    const admins = ref<Admin[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    async function cadastrarAdmin(dados: NovoAdmin) {
        isLoading.value = true
        error.value = null

        try {
            const response = await fetch('http://localhost:5000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dados)
            })

            if (!response.ok) {
                throw new Error('Erro ao cadastrar administrador')
            }

            const novoAdminCriado: Admin = await response.json()
            admins.value.push(novoAdminCriado)

            return novoAdminCriado
        } catch (err: any) {
            error.value = err.message
            throw err
        } finally {
            isLoading.value = false
        }
    } // <-- A função cadastrarAdmin termina aqui

    // O return da Store deve ficar aqui, acessível por todo o useAdminStore
    return {
        admins,
        isLoading,
        error,
        cadastrarAdmin
    }
})