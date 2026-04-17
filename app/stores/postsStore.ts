import { defineStore } from "pinia"
import { ref } from "vue"
import axios from "axios"

interface Postagens {
    titulo: string;
    data: Date | string; 
    autor: string;
    hashtags: string;
    post: File | null;
    conteudo: string;
}

const getHeaders = () => {
    const token = useCookie('auth_token').value
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
}

export const usePostagemStore = defineStore('posts', () => {
    const loading = ref(false);
    const error = ref<string | null>(null);
    const config = ref<any[]>([]);

    async function criarPost(payload: Postagens) {
        loading.value = true;
        error.value = null;

        try {
            const formData = new FormData();

            // 1. Tratamento de Data
            let dataFinal: string = '';

            if (payload.data instanceof Date) {
                // Adicionado "|| ''" aqui também para garantir que o TS não reclame do [0]
                dataFinal = payload.data.toISOString().split('T')[0] || '';
            } else if (typeof payload.data === 'string') {
                // Garante que o resultado seja sempre string
                dataFinal = payload.data.split('T')[0] || '';
            }

            // 2. Montagem do FormData com os textos
            formData.append('titulo', payload.titulo);
            formData.append('data', dataFinal);
            formData.append('autor', payload.autor);
            formData.append('hashtags', payload.hashtags);
            formData.append('conteudo', payload.conteudo);

            // 3. Tratamento do Banner
            if (payload.post instanceof File) {
                formData.append('post', payload.post);
            }

            const response = await axios.post(
                'http://localhost:5000/post/postar', 
                formData, 
                getHeaders()
            );

            return response.data;

        } catch (err: any) {
            const mensagemErro = err.response?.data?.error || 
                                err.response?.data?.message || 
                                'Erro ao salvar configuração!';
            
            error.value = mensagemErro;
            console.error("Erro na API: ", err.response?.data);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function carregarPosts() {
        loading.value = true;
        try {
            const response = await axios.get('http://localhost:5000/post/postagens', getHeaders());
            return response.data;
        } catch (err: any) {
            console.error("Erro ao carregar configurações:", err.response?.data);
            return null;
        } finally {
            loading.value = false;
        }
    }

    async function deletarPost(id_post: number) {
        loading.value = true
        error.value = null

        try {
            await axios.delete(`http://localhost:5000/post/del_post/${id_post}`, getHeaders())
            
            config.value = config.value.filter(a => a.id !== id_post)
        } catch (err: any) {
            error.value = err.response?.data?.error || "Erro ao deletar post"
            throw err
        } finally {
            loading.value = false
        }
    }

    async function atualizarPost(id_post: number, payload: Postagens) {
        loading.value = true;
        error.value = null;

        try {
            const formData = new FormData();
            
            // --- CORREÇÃO DA DATA AQUI ---
            let dataFinal: string = '';
            if (payload.data instanceof Date) {
                dataFinal = payload.data.toISOString().split('T')[0] || '';
            } else if (typeof payload.data === 'string') {
                dataFinal = payload.data.split('T')[0] || '';
            }
            // -----------------------------

            // 1. Campos de Texto
            if (payload.titulo) formData.append('titulo', payload.titulo);
            if (payload.autor) formData.append('autor', payload.autor);
            if (payload.hashtags) formData.append('hashtags', payload.hashtags);
            if (payload.conteudo) formData.append('conteudo', payload.conteudo);
            
            // Envia a data formatada corretamente
            if (dataFinal) formData.append('data', dataFinal);

            // 2. Lógica da Imagem
            if (payload.post instanceof File) {
                formData.append('post', payload.post);
                console.log("📸 Nova imagem detectada no payload");
            }

            const response = await axios.put(
                `http://localhost:5000/post/update_post/${id_post}`, 
                formData, 
                getHeaders()
            );

            await carregarPosts(); 
            return response.data;
        } catch (err: any) {
            error.value = err.response?.data?.error || "Erro ao atualizar post";
            throw err;
        } finally {
            loading.value = false;
        }
    }

    return { 
        criarPost, 
        carregarPosts,
        deletarPost,
        atualizarPost,
        loading, 
        error, 
        config 
    }
})