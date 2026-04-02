
import IndexURI from '../api/index';
import { buscarDadosPublico } from '../api/ApiBaseService';
import UsuarioLoginModel from '../models/usuario/UsuarioLoginModel';

export class UsuarioService {

    static async Login(usuario) {
        let resposta

        try {

            return resposta = await buscarDadosPublico(
                IndexURI().login_uri,
                'POST',
                usuario
            );


        } catch (error) {
            console.log(error);
            resposta.erros = error;
            resposta.sucesso = false;
        }
        finally {
            return resposta;
        }
    }

    static async Logout() {
        let resposta;

        try {
            return resposta = await buscarDadosPublico(
                IndexURI().logout_uri,
                'POST',
                null
            );
        } catch (error) {
            console.log(error);
            resposta = { sucesso: false, erros: error };
        } finally {
            return resposta;
        }
    }
}