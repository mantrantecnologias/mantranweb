import { React } from "react";
import { errorMessage } from "../components/Mensagem";
import { Config } from "../config";

export function EliminarBarrasDuplicadas(text) {
    return text.replace('//', '/')
}

export function SeVazioUndefinedOuNulo(text) {
    return text == null || text == undefined || text == "";
}

export function ValidarCNPJ(cnpj) {
    var cnpjValido = /^\d{14}$/.test(cnpj.replace(/\D/g, ''));
    if (!cnpjValido) return false
    return true;
}

export function ValidarEmail(email) {
    var emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValido) return false
    return true;
}

export function ValidarTelefone(telefone) {
    var telefoneValido = /^\d{10,11}$/.test(telefone.replace(/\D/g, ''));
    if (!telefoneValido) return false
    return true;
}

export function ValidarPreSenha(preSenha) {
    var preSenhaValida = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(preSenha);
    if (!preSenhaValida) return false
    return true;
}

export async function ConverterArquivosXMLBase64(files) {

    var retorno = {
        files64: { Ctes: [] },
        sucesso: true,
        mensagem: ''
    };

    for (var file of files) {
        if (file.type !== 'text/xml' && file.type !== 'application/xml') {
            retorno.mensagem = `Erro ao ler arquivo ${file.name}: ${error}.` + `Arquivo ${file.name} não é um XML válido.`;
            retorno.sucesso = false;
            return retorno;
        }

        try {
            var base64String = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const base64 = reader.result.split(',')[1]; // Remove o prefixo "data:application/xml;base64,"
                    resolve(base64);
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });


            retorno.files64.Ctes.push({ XmlBase64: base64String });

        } catch (error) {
            retorno.mensagem = `Erro ao ler arquivo ${file.name}: ${error}.`;
            retorno.sucesso = false;
            return retorno;
        }
    }
    console.log('Arquivos convertidos para Base64:', retorno.files64);
    return retorno;
}

export async function CriptografarSenha(senha) {
    try {
        let secretKey = Config().secretKey;

        if (!senha || !secretKey) {
            throw new Error('Senha ou chave secreta não fornecida');
        }

        // Convert string to bytes
        const encoder = new TextEncoder();
        const data = encoder.encode(senha);
        const key = encoder.encode(secretKey);

        // Create a simple XOR encryption
        const encrypted = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++) {
            encrypted[i] = data[i] ^ key[i % key.length];
        }

        // Convert to base64 string
        const base64String = btoa(String.fromCharCode(...encrypted));

        console.log('Senha criptografada com sucesso');
        return base64String;

    } catch (error) {
        console.error('Erro ao criptografar senha:', error);
        errorMessage('Erro ao criptografar senha');
        return null;
    }
}

const limparCNPJ = (cnpj) => {
    return cnpj.replace(/[^\d]/g, ''); // Remove all non-digit characters
};