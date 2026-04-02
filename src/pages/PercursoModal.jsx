import { useState } from "react";
import { XCircle, RotateCcw, CheckCircle, PlusCircle, LogOut } from "lucide-react";

export default function PercursoModal({ onClose }) {
  const [ufSelecionada, setUfSelecionada] = useState("");
  const [listaUFs, setListaUFs] = useState([]);

  const ufsBrasil = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES",
    "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR",
    "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
    "SP", "SE", "TO"
  ];

  const descricaoUF = {
    AC: "Acre", AL: "Alagoas", AP: "Amapá", AM: "Amazonas", BA: "Bahia", CE: "Ceará", DF: "Distrito Federal",
    ES: "Espírito Santo", GO: "Goiás", MA: "Maranhão", MT: "Mato Grosso", MS: "Mato Grosso do Sul", MG: "Minas Gerais",
    PA: "Pará", PB: "Paraíba", PR: "Paraná", PE: "Pernambuco", PI: "Piauí", RJ: "Rio de Janeiro", RN: "Rio Grande do Norte",
    RS: "Rio Grande do Sul", RO: "Rondônia", RR: "Roraima", SC: "Santa Catarina", SP: "São Paulo", SE: "Sergipe", TO: "Tocantins"
  };

  // Adicionar UF à grid
  const handleIncluir = () => {
    if (ufSelecionada && !listaUFs.some(item => item.uf === ufSelecionada)) {
      setListaUFs([...listaUFs, { uf: ufSelecionada, descricao: descricaoUF[ufSelecionada] }]);
      setUfSelecionada("");
    }
  };

  // Limpar seleção
  const handleLimpar = () => setListaUFs([]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[500px] rounded shadow-lg border border-gray-300 p-3">
        {/* Título */}
        <h1 className="text-center text-blue-800 font-semibold border-b border-gray-300 pb-1 text-sm">
          UFs DE TRÂNSITO
        </h1>

        {/* CARD 1 - Percurso */}
        <fieldset className="border border-gray-300 rounded p-3 bg-white mt-3">
          <legend className="text-blue-800 font-semibold text-[13px] px-2">Percurso</legend>

          <div className="flex items-center gap-2">
            <label className="w-10 text-[12px] text-gray-700">UF</label>
            <select
              value={ufSelecionada}
              onChange={(e) => setUfSelecionada(e.target.value)}
              className="border border-gray-300 rounded px-2 py-[2px] h-[26px] text-[13px] flex-1"
            >
              <option value="">Selecione...</option>
              {ufsBrasil.map((uf) => (
                <option key={uf} value={uf}>
                  {descricaoUF[uf]}
                </option>
              ))}
            </select>

            <button
              onClick={handleIncluir}
              className="border border-gray-300 rounded px-3 py-1 bg-green-50 hover:bg-green-100 flex items-center gap-1 text-sm"
            >
              <PlusCircle size={14} className="text-green-700" /> Incluir
            </button>
          </div>
        </fieldset>

        {/* CARD 2 - Grid */}
        <div className="border border-gray-300 rounded p-2 bg-white mt-3 max-h-[200px] overflow-auto">
          <table className="w-full text-[12px] border">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border p-1 text-left">UF</th>
                <th className="border p-1 text-left">Descrição UF</th>
              </tr>
            </thead>
            <tbody>
              {listaUFs.map((item, idx) => (
                <tr key={idx} className="hover:bg-blue-50">
                  <td className="border p-1 text-center">{item.uf}</td>
                  <td className="border p-1">{item.descricao}</td>
                </tr>
              ))}
              {listaUFs.length === 0 && (
                <tr>
                  <td colSpan="2" className="text-center text-gray-400 py-2">
                    Nenhuma UF adicionada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* CARD 3 - Botões */}
        <div className="border border-gray-300 rounded p-2 bg-white mt-3 flex justify-between">
          <button
            onClick={onClose}
            className="border border-gray-300 rounded px-3 py-1 bg-gray-50 hover:bg-gray-100 flex items-center gap-1 text-sm text-gray-700"
          >
            <XCircle size={14} className="text-gray-600" /> Sair
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleLimpar}
              className="border border-gray-300 rounded px-3 py-1 bg-yellow-50 hover:bg-yellow-100 flex items-center gap-1 text-sm text-yellow-700"
            >
              <RotateCcw size={14} /> Limpar
            </button>

            <button
              onClick={() => alert("Percurso confirmado com sucesso!")}
              className="border border-gray-300 rounded px-3 py-1 bg-green-50 hover:bg-green-100 flex items-center gap-1 text-sm text-green-700"
            >
              <CheckCircle size={14} /> Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
