import { defineStore } from "pinia"
import { ref } from 'vue'
import axios from 'axios'

interface AdminRegister {
    nome: string;
    email: string;
    senha?: string;
    is_admin: boolean;
    biografia: string;
    foto: File | null;
}

const getHeaders = () => {
    const token = useCookie('auth_token').value
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
}

export const useAdminStore = defineStore('admin', () => {
    const loading = ref(false)
    const error = ref<string | null>(null);
    const admin = ref<any[]>([])
    const autor = ref<any[]>([])

    async function registrarAdmin(payload: AdminRegister) {
        loading.value = true
        error.value = null

        const formData = new FormData()
        formData.append('nome', payload.nome)
        formData.append('email', payload.email)
        formData.append('biografia', payload.biografia)
        formData.append('is_admin', payload.is_admin.toString())

        if (payload.senha) formData.append('senha', payload.senha)
        if (payload.foto) formData.append('foto', payload.foto)

        try {
            // Removido o header manual para o Axios configurar o boundary automaticamente
            const response = await axios.post('http://localhost:5000/auth/register', formData, getHeaders());
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
            const response = await axios.get('http://localhost:5000/auth/admins', getHeaders());
            admin.value = response.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erro ao buscar admins!'
        } finally {
            loading.value = false
        }
    }

    async function busca_info_autores() {
        loading.value = true
        error.value = null

        try {
            const response = await axios.get('http://localhost:5000/auth/autores', getHeaders());
            autor.value = response.data  
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erro ao buscar info do autor!'
        } finally {
            loading.value = false
        }
    }

    async function deletarAdmin(id: number) {
        loading.value = true
        error.value = null

        try {
            await axios.delete(`http://localhost:5000/auth/admin/del/${id}`, getHeaders())
            
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

            formData.append('nome', payload.nome || '');
            formData.append('email', payload.email || '');
            formData.append('biografia', payload.biografia || '');
            formData.append('senha', payload.senha || '');
            formData.append('is_admin', payload.is_admin ? 'true' : 'false');

            if (payload.foto instanceof File) {
                formData.append('foto', payload.foto);
            } else {
                formData.append('foto', ''); 
            }

            const response = await axios.put(`http://localhost:5000/auth/admin/edit/${id}`, formData, getHeaders());

            await busca_admins(); 
            return response.data;
        } catch (err: any) {
            error.value = err.response?.data?.error || "Erro ao atualizar administrador";
            throw err;
        } finally {
            loading.value = false;
        }
    }

    return { registrarAdmin, busca_admins, busca_info_autores, deletarAdmin, atualizarAdmin, admin, autor, loading, error }
})