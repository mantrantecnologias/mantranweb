import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import Logo from "../assets/logo_mantran.png";
import { UsuarioService } from "../services/UsuarioService";
import UsuarioLoginModel from "../models/usuario/UsuarioLoginModel";

export default function Login({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalMsg, setModalMsg] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usuarioDigitado = user.trim();
    const senhaDigitada = pass.trim();

    if (!usuarioDigitado || !senhaDigitada) {
      setMensagemErro("Informe usuário e senha!");
      setModalMsg(true);
      return;
    }

    setLoading(true);

    try {
      const dadosLogin = {
        Usuario: usuarioDigitado,
        Senha: senhaDigitada,
      };

      const resposta = await UsuarioService.Login(dadosLogin);

      if (resposta && resposta.sucesso && resposta.data) {
        // ✅ Instancia o novo modelo simplificado
        const u = new UsuarioLoginModel(resposta.data);

        const nome = u.Nome_Usuario || usuarioDigitado;
        const empresa = u.Codigo_Empresa || "";
        const filial = u.Codigo_Filial || "";

        // Mantemos retrocompatibilidade com as chaves individuais
        localStorage.setItem("usuarioNome", nome);
        localStorage.setItem("usuarioEmpresa", empresa);
        localStorage.setItem("usuarioFilial", filial);

        // ✅ Segurança: removemos a senha antes de persistir o objeto no localStorage
        const usuarioSeguro = { ...u };
        delete usuarioSeguro.Senha;
        localStorage.setItem("usuario", JSON.stringify(usuarioSeguro));

        onLogin?.(nome);
      } else {
        setMensagemErro("Usuário ou senha inválidos!");
        setModalMsg(true);
      }
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      setMensagemErro("Erro ao conectar com o servidor. Tente novamente.");
      setModalMsg(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-red-800 via-white to-gray-700">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-[360px] text-center border border-gray-300 animate-[fadeIn_0.8s_ease-out]">
        <div className="flex justify-center mb-4">
          <img
            src={Logo}
            alt="Mantran Tecnologias"
            className="h-14 w-auto object-contain"
          />
        </div>

        <h2 className="text-lg font-bold mb-6 text-gray-800">
          Acesso ao Sistema
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuário
            </label>
            <input
              type="text"
              placeholder="Digite seu usuário"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-600"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              placeholder="Digite sua senha"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-600"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-2 rounded-md transition-all shadow-md ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-700 hover:bg-red-800"
              }`}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-6">
          © 2025 Mantran Tecnologias. Todos os direitos reservados.
        </p>
      </div>

      {modalMsg && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 shadow-lg rounded-lg border text-center w-[340px]">
            <div className="flex justify-center mb-4">
              <AlertTriangle size={48} className="text-red-400" strokeWidth={1.5} />
            </div>
            <p className="text-gray-800 font-bold text-xl mb-2">Atenção!</p>
            <p className="text-gray-600 mb-6">{mensagemErro}</p>
            <button
              className="px-6 py-2 bg-red-700 hover:bg-red-800 text-white font-semibold rounded transition-all"
              onClick={() => setModalMsg(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
}
