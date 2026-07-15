import { defineStore } from "pinia"
import { ref } from "vue"
import axios from "axios"

interface ConfiguracaoBlog {
    nome_blog: string;
    data_atualizacao: Date | string; 
    autor: string;
    tags_do_blog: string;
    banner: File | null;
    descricao_blog: string;
}

interface CacheData {
    data: any;
    timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
let cachedConfigPublico: CacheData | null = null;
let cachedConfig: CacheData | null = null;

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

export const useConfiguracaoStore = defineStore('config', () => {
    const runtimeConfig = useRuntimeConfig()
    const apiBase = runtimeConfig.public.apiBase
    const loading = ref(false);
    const error = ref<string | null>(null);
    const config = ref<any[]>([]);

    async function criarConfig(payload: ConfiguracaoBlog) {
        loading.value = true;
        error.value = null;

        try {
            const formData = new FormData();
            let dataFinal: string = '';

            if (payload.data_atualizacao instanceof Date) {
                dataFinal = payload.data_atualizacao.toISOString().split('T')[0] || '';
            } else if (typeof payload.data_atualizacao === 'string') {
                dataFinal = payload.data_atualizacao.split('T')[0] || '';
            }

            formData.append('nome_blog', payload.nome_blog);
            formData.append('data_atualizacao', dataFinal);
            formData.append('autor', payload.autor);
            formData.append('tags_do_blog', payload.tags_do_blog);
            formData.append('descricao_blog', payload.descricao_blog);

            if (payload.banner instanceof File) {
                formData.append('banner', payload.banner);
            }

            const response = await axios.post(
                `${apiBase}/blog/configuracao`, 
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
            invalidarCache();
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function carregarConfig() {
        if (isCacheValid(cachedConfig)) {
            return cachedConfig!.data;
        }

        loading.value = true;
        try {
            const response = await axios.get(`${apiBase}/blog/configuracao`, getHeaders());
            cachedConfig = { data: response.data, timestamp: Date.now() };
            return response.data;
        } catch (err: any) {
            console.error("Erro ao carregar configurações:", err.response?.data);
            return null;
        } finally {
            loading.value = false;
        }
    }

    async function carregarConfigPublico() {
        if (isCacheValid(cachedConfigPublico)) {
            return cachedConfigPublico!.data;
        }

        loading.value = true;
        try {
            const response = await axios.get(`${apiBase}/blog/configuracao`);
            cachedConfigPublico = { data: response.data, timestamp: Date.now() };
            return response.data;
        } catch (err: any) {
            console.error("Erro ao carregar configurações públicas:", err.response?.data);
            return null;
        } finally {
            loading.value = false;
        }
    }

    function invalidarCache() {
        cachedConfig = null;
        cachedConfigPublico = null;
    }

    return { 
        criarConfig, 
        carregarConfig,
        carregarConfigPublico,
        invalidarCache,
        loading, 
        error, 
        config 
    }
})