import { defineStore } from "pinia"
import { ref } from 'vue'
import axios from 'axios'

interface AdminRegister {
    nome: string;
    email: string;
    senha?: string;
    is_admin: boolean;
    foto: File | null;
}

export const useAdminStore = defineStore('admin', () => {
    const loading = ref(false)
    const error = ref<string | null>(null);
    const admin = ref<any[]>([])

    async function registrarAdmin(payload: AdminRegister) {
        loading.value = true
        error.value = null

        const formData = new FormData()
        formData.append('nome', payload.nome)
        formData.append('email', payload.email)
        formData.append('is_admin', payload.is_admin.toString())

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

    async function busca_admins() {
        loading.value = true
        error.value = null

        try {
            const response = await axios.get('http://localhost:5000/auth/admins');
            admin.value = response.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erro ao buscar admins!'
        } finally {
            loading.value = false
        }
    }

    async function deletarAdmin(id: number) {
        loading.value = true
        error.value = null

        try {
            await axios.delete(`http://localhost:5000/auth/admin/del/${id}`)
            
            admin.value = admin.value.filter(a => a.id !== id)
        } catch (err: any) {
            error.value = err.response?.data?.error || "Erro ao deletar adminstrador"
            throw err
        } finally {
            loading.value = false
        }
    }

    async function atualizarAdmin(id: number, payload: AdminRegister) {
        loading.value = true;
        error.value = null;

        try {
            const formData = new FormData();
            
            // Adicionamos ao FormData apenas o que foi passado no payload
            if (payload.nome) formData.append('nome', payload.nome);
            if (payload.email) formData.append('email', payload.email);
            if (payload.is_admin !== undefined) {
                formData.append('is_admin', String(payload.is_admin));
            }
            if (payload.senha) {
                formData.append('senha', payload.senha);
            }
            if (payload.foto) {
                formData.append('foto', payload.foto);
            }

            const response = await axios.put(`http://localhost:5000/auth/admin/edit/${id}`, formData);

            // Atualiza a lista local para refletir a mudança sem precisar recarregar a página
            await busca_admins(); 
            
            return response.data;
        } catch (err: any) {
            error.value = err.response?.data?.error || "Erro ao atualizar administrador";
            throw err;
        } finally {
            loading.value = false;
        }
    }

    return { registrarAdmin, busca_admins, deletarAdmin, atualizarAdmin, admin, loading, error }
})