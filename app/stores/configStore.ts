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
        loading.value = true
        error.value = null

        const formData = new FormData()

        // 1. Tratamento de Data para satisfazer o TypeScript
        let dataFinal: string;
        if (payload.data_atualizacao instanceof Date) {
            // O ?? '' garante que se o split falhar, teremos uma string vazia (evita o erro da imagem)
            dataFinal = payload.data_atualizacao.toISOString().split('T')[0] ?? '';
        } else {
            dataFinal = payload.data_atualizacao || '';
        }

        // 2. Montagem do FormData (Nomes devem bater com o request.form do Flask)
        formData.append('nome_blog', payload.nome_blog)
        formData.append('data_atualizacao', dataFinal)
        formData.append('autor', payload.autor)
        formData.append('tags_do_blog', payload.tags_do_blog)
        formData.append('descricao_blog', payload.descricao_blog)

        // 3. Campo de imagem (Batendo com request.files.get("foto") do seu Flask)
        if (payload.banner) {
            formData.append('foto', payload.banner)
        }

        try {
            const response = await axios.post(
                'http://localhost:5000/blog/configuracao', 
                formData, 
                getHeaders()
            );
            return response.data
        } catch (err: any) {
            const mensagemErro = err.response?.data?.error || err.response?.data?.message || 'Erro ao salvar configuração!';
            error.value = mensagemErro;
            console.error("Erro na API: ", err.response?.data);
            throw err
        } finally {
            loading.value = false
        }
    }

    async function carregarConfig() {
        loading.value = true;
        try {
            const response = await axios.get('http://localhost:5000/blog/configuracao', getHeaders());
            return response.data; // Retorna o objeto com nome, autor, etc.
        } catch (err: any) {
            console.error("Erro ao carregar configurações:", err.response?.data);
            return null;
        } finally {
            loading.value = false;
        }
    }

    // Essencial: Retornar tudo para ser acessível nos componentes
    return { 
        criarConfig, 
        carregarConfig,
        loading, 
        error, 
        config 
    }

})