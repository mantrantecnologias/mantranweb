import { fetchingDataLoading, stopFetchingDataLoading } from "../components/Loading";
import { SeVazioUndefinedOuNulo } from "../utils/Utilidades";

// ✅ Requisições públicas — permitimos cookies para capturar o Set-Cookie no Login
export const buscarDadosPublico = async (url, method, body = null) => {
  return buscarDados(url, method, body, true);
};

// ✅ Requisições privadas — envia o cookie httpOnly automaticamente
export const buscarDadosPrivado = async (url, method, body = null) => {
  // Não precisa mais receber token como parâmetro
  // O navegador envia o cookie auth_token automaticamente com credentials: "include"
  return buscarDados(url, method, body, true);
};

const buscarDados = async (url, method, body = null, comCredenciais = false) => {
  let resposta;
  let respostaTexto;
  let data = {
    status: null,
    sucesso: true,
    mensagem: null,
    erros: null,
    data: null,
  };

  var options = { method: method };
  if (body) options.body = JSON.stringify(body);

  try {
    fetchingDataLoading();

    resposta = await fetch(url, {
      ...options,
      credentials: comCredenciais ? "include" : "omit", // ✅ "include" envia o cookie automaticamente
      headers: {
        "Content-Type": "application/json",
        // ✅ Não precisa mais montar o header Authorization manualmente
      },
    });

    respostaTexto = await resposta.text();
    data.status = resposta.status;

    // ✅ Token expirado ou inválido → limpa localStorage e redireciona para login
    if (data.status === 401) {
      console.error("Erro 401: Não autorizado. Redirecionando para login...", url);
      localStorage.removeItem("usuario");
      localStorage.removeItem("usuarioNome");
      window.location.href = "/";
      return data;
    }

    if (data.status !== 200) {
      data.sucesso = false;
      data.mensagem = respostaTexto;
      data.erros = data.mensagem;
      console.log(data.mensagem);
      return data;
    }

    if (data.status == 200 && SeVazioUndefinedOuNulo(respostaTexto)) {
      return data;
    }

    try {
      data.data = JSON.parse(respostaTexto);
    } catch (jsonError) {
      // ✅ Se não for JSON (ex: uma string simples retornada pela API), usamos o texto puro
      data.data = respostaTexto;
    }

    console.log(data);
    return data;

  } catch (error) {
    console.error("Fetch error:", error);
  } finally {
    stopFetchingDataLoading();
    options = null;
    body = null;
    respostaTexto = null;
  }
};
