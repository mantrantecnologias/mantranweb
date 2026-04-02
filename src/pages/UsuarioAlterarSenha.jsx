import { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, XCircle, CheckCircle, AlertTriangle } from "lucide-react";

export default function UsuarioAlterarSenha({ onClose }) {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [repetirSenha, setRepetirSenha] = useState("");
  const [mostrar, setMostrar] = useState({
    atual: false,
    nova: false,
    repetir: false,
  });
  const [erro, setErro] = useState("");

  // 🔍 Validação em tempo real
  useEffect(() => {
    if (novaSenha && repetirSenha && novaSenha !== repetirSenha) {
      setErro("As senhas novas não coincidem!");
    } else {
      setErro("");
    }
  }, [novaSenha, repetirSenha]);

  const handleConfirmar = () => {
    if (!senhaAtual || !novaSenha || !repetirSenha) {
      alert("Preencha todos os campos!");
      return;
    }
    if (novaSenha !== repetirSenha) {
      alert("As senhas novas não coincidem!");
      return;
    }

    alert("✅ Senha alterada com sucesso!");
    onClose?.();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[400px] rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between bg-gradient-to-r from-red-700 to-black text-white px-4 py-2 rounded-t-2xl">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Lock size={16} /> ALTERAR SENHA
          </h2>
        </div>

        {/* Corpo */}
        <div className="p-5 space-y-4">
          {/* Senha atual */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Senha Atual:
            </label>
            <div className="relative">
              <input
                type={mostrar.atual ? "text" : "password"}
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-2 py-[6px] text-[14px] focus:ring-1 focus:ring-red-600 focus:border-red-600"
              />
              <button
                type="button"
                onClick={() =>
                  setMostrar((m) => ({ ...m, atual: !m.atual }))
                }
                className="absolute right-2 top-1.5 text-gray-500 hover:text-red-700"
              >
                {mostrar.atual ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Nova Senha */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Nova Senha:
            </label>
            <div className="relative">
              <input
                type={mostrar.nova ? "text" : "password"}
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                className={`w-full border ${
                  erro ? "border-red-500" : "border-gray-300"
                } rounded-lg px-2 py-[6px] text-[14px] focus:ring-1 ${
                  erro
                    ? "focus:ring-red-500 focus:border-red-500"
                    : "focus:ring-red-600 focus:border-red-600"
                }`}
              />
              <button
                type="button"
                onClick={() => setMostrar((m) => ({ ...m, nova: !m.nova }))}
                className="absolute right-2 top-1.5 text-gray-500 hover:text-red-700"
              >
                {mostrar.nova ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Repetir Senha */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Repetir Senha:
            </label>
            <div className="relative">
              <input
                type={mostrar.repetir ? "text" : "password"}
                value={repetirSenha}
                onChange={(e) => setRepetirSenha(e.target.value)}
                className={`w-full border ${
                  erro ? "border-red-500" : "border-gray-300"
                } rounded-lg px-2 py-[6px] text-[14px] focus:ring-1 ${
                  erro
                    ? "focus:ring-red-500 focus:border-red-500"
                    : "focus:ring-red-600 focus:border-red-600"
                }`}
              />
              <button
                type="button"
                onClick={() =>
                  setMostrar((m) => ({ ...m, repetir: !m.repetir }))
                }
                className="absolute right-2 top-1.5 text-gray-500 hover:text-red-700"
              >
                {mostrar.repetir ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Mensagem de erro visual */}
            {erro && (
              <div className="flex items-center gap-1 text-red-600 text-xs mt-1">
                <AlertTriangle size={14} /> {erro}
              </div>
            )}
          </div>
        </div>

        {/* Rodapé */}
        <div className="flex justify-end gap-2 bg-gray-50 border-t border-gray-200 px-5 py-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-gray-600 hover:text-red-700 text-sm px-3 py-[4px] rounded-lg transition"
          >
            <XCircle size={14} /> Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            disabled={!!erro}
            className={`flex items-center gap-1 px-4 py-[4px] rounded-lg text-sm transition ${
              erro
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            <CheckCircle size={14} /> Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
