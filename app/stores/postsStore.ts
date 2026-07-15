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
    count: number;
}

interface CacheData {
    data: any;
    timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
let cachedPostsPublico: CacheData | null = null;
let cachedPosts: CacheData | null = null;

const isCacheValid = (cache: CacheData | null): boolean => {
    if (!cache) return false;
    return Date.now() - cache.timestamp < CACHE_DURATION;
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
    const runtimeConfig = useRuntimeConfig()
    const apiBase = runtimeConfig.public.apiBase
    const loading = ref(false);
    const error = ref<string | null>(null);
    const config = ref<any[]>([]);
    const posts = ref<any[]>([]);

    async function criarPost(payload: Postagens) {
        loading.value = true;
        error.value = null;

        try {
            const formData = new FormData();

            let dataFinal: string = '';

            if (payload.data instanceof Date) {
                dataFinal = payload.data.toISOString().split('T')[0] || '';
            } else if (typeof payload.data === 'string') {
                dataFinal = payload.data.split('T')[0] || '';
            }

            formData.append('titulo', payload.titulo);
            formData.append('data', dataFinal);
            formData.append('autor', payload.autor);
            formData.append('hashtags', payload.hashtags);
            formData.append('conteudo', payload.conteudo);

            if (payload.post instanceof File) {
                formData.append('post', payload.post);
            }

            const response = await axios.post(
                `${apiBase}/post/postar`, 
                formData, 
                getHeaders()
            );

            return response.data;

        } catch (err: any) {
            const mensagemErro = err.response?.data?.error || err.response?.data?.message || 'Erro ao salvar configuração!';
            error.value = mensagemErro;
            console.error("Erro na API: ", err.response?.data);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function carregarPosts() {
        if (isCacheValid(cachedPosts)) {
            posts.value = cachedPosts!.data;
            return cachedPosts!.data;
        }

        loading.value = true;
        try {
            const response = await axios.get(`${apiBase}/post/postagens`, getHeaders());
            const data = Array.isArray(response.data) ? response.data : [response.data];
            cachedPosts = { data, timestamp: Date.now() };
            posts.value = data;
            return data;
        } catch (err: any) {
            console.error("Erro ao carregar posts:", err.response?.data);
            posts.value = [];
            return null;
        } finally {
            loading.value = false;
        }
    }

    async function carregarPostsPublico() {
        if (isCacheValid(cachedPostsPublico)) {
            posts.value = cachedPostsPublico!.data;
            return cachedPostsPublico!.data;
        }

        loading.value = true;
        try {
            const response = await axios.get(`${apiBase}/post/postagens`);
            const data = Array.isArray(response.data) ? response.data : [response.data];
            cachedPostsPublico = { data, timestamp: Date.now() };
            posts.value = data;
            return data;
        } catch (err: any) {
            console.error("Erro ao carregar posts públicos:", err.response?.data);
            posts.value = [];
            return null;
        } finally {
            loading.value = false;
        }
    }

    function invalidarCache() {
        cachedPosts = null;
        cachedPostsPublico = null;
    }

    async function deletarPost(id_post: number) {
        loading.value = true
        error.value = null

        try {
            await axios.delete(`${apiBase}/post/del_post/${id_post}`, getHeaders())
            invalidarCache()
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
            
            let dataFinal: string = '';
            if (payload.data instanceof Date) {
                dataFinal = payload.data.toISOString().split('T')[0] || '';
            } else if (typeof payload.data === 'string') {
                dataFinal = payload.data.split('T')[0] || '';
            }

            if (payload.titulo) formData.append('titulo', payload.titulo);
            if (payload.autor) formData.append('autor', payload.autor);
            if (payload.hashtags) formData.append('hashtags', payload.hashtags);
            if (payload.conteudo) formData.append('conteudo', payload.conteudo);
            
            if (dataFinal) formData.append('data', dataFinal);

            if (payload.post instanceof File) {
                formData.append('post', payload.post);
                console.log("📸 Nova imagem detectada no payload");
            }

            const response = await axios.put(`${apiBase}/post/update_post/${id_post}`, formData, getHeaders());

            await carregarPosts(); 
            invalidarCache();
            return response.data;
        } catch (err: any) {
            error.value = err.response?.data?.error || "Erro ao atualizar post";
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function contar_posts() {
        loading.value = true;
        try {
            const response = await axios.get(`${apiBase}/post/qtd_posts`, getHeaders());
            return response.data;
        } finally {
            loading.value = false;
        }
    }

    async function alternarCurtidaNoServidor(id_post: number, action: 'like' | 'unlike') {
        try {
            const response = await axios.post(
                `${apiBase}/post/curtir/${id_post}/like`, 
                { action },
                { headers: { 'Content-Type': 'application/json' } } 
            );
            
            if (response.data && response.data.success) {
                invalidarCache(); 
                return { success: true, likes_count: response.data.likes_count };
            }
            return { success: false, likes_count: 0 };
        } catch (err) {
            console.error("Erro na store ao processar curtida:", err);
            return { success: false, likes_count: 0 };
        }
    }

    async function uploadImagem(file: File): Promise<string> {
        loading.value = true;
        error.value = null;

        try {
            const formData = new FormData();
            formData.append('image', file); 

            const response = await axios.post(
                `${apiBase}/post/upload`, 
                formData, 
                {
                    headers: {
                        ...getHeaders().headers,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            return response.data.url;

        } catch (err: any) {
            const mensagemErro = err.response?.data?.error || err.response?.data?.message || 'Erro ao fazer upload da imagem!';
            error.value = mensagemErro;
            console.error("Erro no upload da imagem interna: ", err.response?.data);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    return { 
        criarPost, 
        carregarPosts,
        carregarPostsPublico,
        deletarPost,
        atualizarPost,
        contar_posts,
        invalidarCache,
        alternarCurtidaNoServidor,
        uploadImagem,
        loading, 
        error, 
        config,
        posts
    }
})