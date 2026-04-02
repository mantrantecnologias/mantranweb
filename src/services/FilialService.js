import IndexURI from '../api/index';
import { buscarDadosPrivado } from '../api/ApiBaseService';

export class FilialService {
    static async BuscarTodas(filial = {}) {
        let resposta;
        try {
            resposta = await buscarDadosPrivado(
                IndexURI().filial_lista_uri,
                'POST',
                filial
            );
        } catch (error) {
            console.error("Erro na busca de filiais:", error);
            resposta = { sucesso: false, erros: error };
        } finally {
            return resposta;
        }
    }

    static async BuscarFilial(filial) {
        let resposta;
        try {
            resposta = await buscarDadosPrivado(
                IndexURI().filial_buscar_uri,
                'POST',
                filial
            );
        } catch (error) {
            console.error("Erro na busca da filial:", error);
            resposta = { sucesso: false, erros: error };
        } finally {
            return resposta;
        }
    }

    static async IncluirFilial(filial) {
        let resposta;
        try {
            resposta = await buscarDadosPrivado(
                IndexURI().filial_incluir_uri,
                'POST',
                filial
            );
        } catch (error) {
            console.error("Erro na inclusão da filial:", error);
            resposta = { sucesso: false, erros: error };
        } finally {
            return resposta;
        }
    }

    static async AlterarFilial(filial) {
        let resposta;
        try {
            resposta = await buscarDadosPrivado(
                IndexURI().filial_alterar_uri,
                'POST',
                filial
            );
        } catch (error) {
            console.error("Erro na alteração da filial:", error);
            resposta = { sucesso: false, erros: error };
        } finally {
            return resposta;
        }
    }

    static async ExcluirFilial(filial) {
        let resposta;
        try {
            resposta = await buscarDadosPrivado(
                IndexURI().filial_excluir_uri,
                'POST',
                filial
            );
        } catch (error) {
            console.error("Erro na exclusão da filial:", error);
            resposta = { sucesso: false, erros: error };
        } finally {
            return resposta;
        }
    }

    static async BuscarFilialParametro(filial) {
        let resposta;
        try {
            resposta = await buscarDadosPrivado(
                IndexURI().filial_buscar_parametro_uri,
                'POST',
                filial
            );
        } catch (error) {
            console.error("Erro na busca dos parâmetros da filial:", error);
            resposta = { sucesso: false, erros: error };
        } finally {
            return resposta;
        }
    }

    static async AlterarFilialParametro(filial) {
        let resposta;
        try {
            resposta = await buscarDadosPrivado(
                IndexURI().filial_alterar_parametro_uri,
                'POST',
                filial
            );
        } catch (error) {
            console.error("Erro ao alterar parâmetros da filial:", error);
            resposta = { sucesso: false, erros: error };
        } finally {
            return resposta;
        }
    }

    static async BuscarFilialHubDesenvolvedor(filial) {
        let resposta;
        try {
            resposta = await buscarDadosPrivado(
                IndexURI().filial_buscar_hub_uri,
                'POST',
                filial
            );
        } catch (error) {
            console.error("Erro na busca de filial no Hub Desenvolvedor:", error);
            resposta = { sucesso: false, erros: error };
        } finally {
            return resposta;
        }
    }
}
