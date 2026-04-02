import IndexURI from '../api/index';
import { buscarDadosPrivado } from '../api/ApiBaseService';

export class CiotService {
    static async BuscarListaOperadoras(operadora = {}) {
        let resposta;

        try {
            resposta = await buscarDadosPrivado(
                IndexURI().operadora_lista_uri,
                'POST',
                operadora
            );
        } catch (error) {
            console.error("Erro na busca de operadoras CIOT:", error);
            resposta = { sucesso: false, erros: error };
        } finally {
            return resposta;
        }
    }

    static async BuscarOperadora(operadora = {}) {
        let resposta;

        try {
            resposta = await buscarDadosPrivado(
                IndexURI().operadora_buscar_uri,
                'POST',
                operadora
            );
        } catch (error) {
            console.error("Erro na busca de detalhes da operadora CIOT:", error);
            resposta = { sucesso: false, erros: error };
        } finally {
            return resposta;
        }
    }

    static async AlterarOperadora(operadora) {
        let resposta;

        try {
            resposta = await buscarDadosPrivado(
                IndexURI().operadora_alterar_uri,
                'POST',
                operadora
            );
        } catch (error) {
            console.error("Erro ao alterar operadora CIOT:", error);
            resposta = { sucesso: false, erros: error };
        } finally {
            return resposta;
        }
    }
}
