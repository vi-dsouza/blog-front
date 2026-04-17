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

const getHeaders = () => {
    const token = useCookie('auth_token').value
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
}

export const useConfiguracaoStore = defineStore('config', () => {
    const loading = ref(false);
    const error = ref<string | null>(null);
    const config = ref<any[]>([]);

    async function criarConfig(payload: ConfiguracaoBlog) {
        loading.value = true;
        error.value = null;

        try {
            const formData = new FormData();

            // 1. Tratamento de Data
            let dataFinal: string = '';

            if (payload.data_atualizacao instanceof Date) {
                // Adicionado "|| ''" aqui também para garantir que o TS não reclame do [0]
                dataFinal = payload.data_atualizacao.toISOString().split('T')[0] || '';
            } else if (typeof payload.data_atualizacao === 'string') {
                // Garante que o resultado seja sempre string
                dataFinal = payload.data_atualizacao.split('T')[0] || '';
            }

            // 2. Montagem do FormData com os textos
            formData.append('nome_blog', payload.nome_blog);
            formData.append('data_atualizacao', dataFinal);
            formData.append('autor', payload.autor);
            formData.append('tags_do_blog', payload.tags_do_blog);
            formData.append('descricao_blog', payload.descricao_blog);

            // 3. Tratamento do Banner
            if (payload.banner instanceof File) {
                formData.append('banner', payload.banner);
            }

            const response = await axios.post(
                'http://localhost:5000/blog/configuracao', 
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

    async function carregarConfig() {
        loading.value = true;
        try {
            const response = await axios.get('http://localhost:5000/blog/configuracao', getHeaders());
            return response.data;
        } catch (err: any) {
            console.error("Erro ao carregar configurações:", err.response?.data);
            return null;
        } finally {
            loading.value = false;
        }
    }

    return { 
        criarConfig, 
        carregarConfig,
        loading, 
        error, 
        config 
    }
})