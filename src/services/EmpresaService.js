import IndexURI from '../api/index';
import { buscarDadosPrivado } from '../api/ApiBaseService';

export class EmpresaService {
    static async BuscarTodas() {
        let resposta;

        try {
            resposta = await buscarDadosPrivado(
                IndexURI().empresa_lista_uri,
                'GET'
            );
        } catch (error) {
            console.error("Erro na busca de empresas:", error);
            resposta = { sucesso: false, erros: error };
        } finally {
            return resposta;
        }
    }

    static async IncluirEmpresa(empresa) {
        let resposta;

        try {
            resposta = await buscarDadosPrivado(
                IndexURI().empresa_incluir_uri,
                'POST',
                empresa
            );
        } catch (error) {
            console.error("Erro na inclusão da empresa:", error);
            resposta = { sucesso: false, erros: error };
        } finally {
            return resposta;
        }
    }
    static async AlterarEmpresa(empresa) {
        let resposta;

        try {
            resposta = await buscarDadosPrivado(
                IndexURI().empresa_alterar_uri,
                'POST',
                empresa
            );
        } catch (error) {
            console.error("Erro na alteração da empresa:", error);
            resposta = { sucesso: false, erros: error };
        } finally {
            return resposta;
        }
    }

    static async ExcluirEmpresa(empresa) {
        let resposta;

        try {
            resposta = await buscarDadosPrivado(
                IndexURI().empresa_excluir_uri,
                'POST',
                empresa
            );
        } catch (error) {
            console.error("Erro na exclusão da empresa:", error);
            resposta = { sucesso: false, erros: error };
        } finally {
            return resposta;
        }
    }

    static async BuscarEmpresaHubDesenvolvedor(empresa) {
        let resposta;

        try {
            resposta = await buscarDadosPrivado(
                IndexURI().empresa_buscar_hub_uri,
                'POST',
                empresa
            );
        } catch (error) {
            console.error("Erro na busca de empresa no Hub Desenvolvedor:", error);
            resposta = { sucesso: false, erros: error };
        } finally {
            return resposta;
        }
    }

    static async BuscarEmpresaParametro(empresa) {
        let resposta;

        try {
            resposta = await buscarDadosPrivado(
                IndexURI().empresa_buscar_parametro_uri,
                'POST',
                empresa
            );
        } catch (error) {
            console.error("Erro na busca dos parâmetros da empresa:", error);
            resposta = { sucesso: false, erros: error };
        } finally {
            return resposta;
        }
    }

    static async VerificaSenhaEmpresa(senha) {
        let resposta;

        try {
            resposta = await buscarDadosPrivado(
                IndexURI().empresa_verifica_senha_uri,
                'POST',
                senha
            );
        } catch (error) {
            console.error("Erro ao verificar senha:", error);
            resposta = { sucesso: false, erros: error };
        } finally {
            return resposta;
        }
    }

    static async AlterarEmpresaParametro(parametro) {
        let resposta;

        try {
            resposta = await buscarDadosPrivado(
                IndexURI().empresa_alterar_parametro_uri,
                'POST',
                parametro
            );
        } catch (error) {
            console.error("Erro ao alterar parâmetros da empresa:", error);
            resposta = { sucesso: false, erros: error };
        } finally {
            return resposta;
        }
    }
}
