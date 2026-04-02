import { useState } from "react";
import {
  XCircle,
  Search,
  CheckCircle,
  RotateCcw,
} from "lucide-react";

export default function ViagemMontarMinuta({ isOpen, onClose }) {
  const [modo, setModo] = useState("data"); // "data" ou "nf"

  // === Dados simulados para teste ===
  const [notas, setNotas] = useState([
    {
      id: 1,
      filial: "001",
      numero: "0002345",
      serie: "1",
      remetente: "50221019000136",
      destinatario: "CERVEJARIA BRASIL LTDA",
      endereco: "RUA DOS PINHEIROS, 120",
      cidade: "SALVADOR",
      uf: "BA",
      peso: 700,
      selecionado: false,
    },
    {
      id: 2,
      filial: "001",
      numero: "0002346",
      serie: "1",
      remetente: "50221019000136",
      destinatario: "HNK DISTRIBUIÇÃO SUL",
      endereco: "AV. DAS AMÉRICAS, 350",
      cidade: "SALVADOR",
      uf: "BA",
      peso: 950,
      selecionado: false,
    },
    {
      id: 3,
      filial: "001",
      numero: "0002347",
      serie: "1",
      remetente: "50221019000136",
      destinatario: "LOG TRANSPORTES LTDA",
      endereco: "RUA CARLOS GOMES, 88",
      cidade: "FEIRA DE SANTANA",
      uf: "BA",
      peso: 600,
      selecionado: false,
    },
  ]);

  // === Funções dos botões ===
  const selecionarTodos = () => {
    setNotas((prev) => prev.map((n) => ({ ...n, selecionado: true })));
  };

  const limparSelecao = () => {
    setNotas((prev) => prev.map((n) => ({ ...n, selecionado: false })));
  };

  // === Cálculos ===
  const totalNotas = notas.length;
  const selecionadas = notas.filter((n) => n.selecionado).length;
  const pesoTotal = notas
    .filter((n) => n.selecionado)
    .reduce((acc, n) => acc + n.peso, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl border border-gray-300 w-[95%] max-w-[1100px] max-h-[90vh] overflow-hidden flex flex-col">
        {/* === CABEÇALHO === */}
        <div className="flex justify-between items-center px-4 py-2 border-b bg-gray-100">
          <h2 className="text-red-700 font-semibold text-[14px]">
            Pesquisa de Notas - Gerar Minuta
          </h2>
          <button onClick={onClose} className="hover:text-red-700 transition">
            <XCircle size={20} />
          </button>
        </div>

        {/* === CONTEÚDO === */}
        <div className="flex-1 overflow-y-auto p-4 text-[13px]">
          {/* CARD 1 - Filtros */}
          <fieldset className="border border-gray-300 rounded p-3 mb-3">
            <legend className="text-red-700 font-semibold px-2">Filtros</legend>

            {/* Linha 1 */}
            <div className="flex items-center gap-2 mb-2">
              <label className="w-[90px] text-right">Código Filial</label>
              <input className="border border-gray-300 rounded px-2 h-[26px] w-[80px]" defaultValue="001" />
              <label className="w-[80px] text-right">Remetente</label>
              <input className="border border-gray-300 rounded px-2 h-[26px] w-[180px]" defaultValue="50221019000136" />
              <input className="border border-gray-300 rounded px-2 h-[26px] flex-1" defaultValue="HNK-ITU (1) MATRIZ" />
              <label className="w-[60px] text-right">Viagem</label>
              <input className="border border-gray-300 rounded px-2 h-[26px] w-[100px]" defaultValue="079032" />
            </div>

            {/* Linha 2 - Opções */}
            <div className="flex items-center gap-3 mb-2">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="modo"
                  checked={modo === "nf"}
                  onChange={() => setModo("nf")}
                />
                Nº NF
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="modo"
                  checked={modo === "data"}
                  onChange={() => setModo("data")}
                />
                Data Emissão
              </label>
            </div>

            {/* Linha 3 - Campos Condicionais */}
            {modo === "nf" ? (
              <div className="flex items-center gap-2">
                <label className="w-[80px] text-right">Nº NF</label>
                <input className="border border-gray-300 rounded px-2 h-[26px] w-[150px]" />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <label className="w-[100px] text-right">Data Emissão</label>
                <input type="date" className="border border-gray-300 rounded px-2 h-[26px]" defaultValue="2025-01-01" />
                <span>até</span>
                <input type="date" className="border border-gray-300 rounded px-2 h-[26px]" defaultValue="2025-10-30" />
                <label className="w-[100px] text-right">Placa Veículo</label>
                <input className="border border-gray-300 rounded px-2 h-[26px] w-[120px]" />
                <label className="w-[80px] text-right">Romaneio</label>
                <input className="border border-gray-300 rounded px-2 h-[26px] w-[120px]" />
                <button className="border border-gray-300 rounded px-3 py-[4px] hover:bg-gray-100 flex items-center gap-1">
                  <Search size={14} className="text-red-700" /> Pesquisar
                </button>
              </div>
            )}
          </fieldset>

          {/* CARD 2 - Grid */}
          <fieldset className="border border-gray-300 rounded p-3 mb-3">
            <legend className="text-red-700 font-semibold px-2">Notas Encontradas</legend>
            <div className="overflow-auto max-h-[300px]">
              <table className="min-w-full border text-[12px]">
                <thead className="bg-gray-100">
                  <tr>
                    {[
                      "Chk",
                      "Filial",
                      "Nº NF",
                      "Série",
                      "CGC CPF Remetente",
                      "Razão Social Destinatário",
                      "Endereço Entrega",
                      "Cidade",
                      "UF",
                      "Peso NF",
                    ].map((h) => (
                      <th key={h} className="border px-2 py-1 text-left whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {notas.map((n) => (
                    <tr
                      key={n.id}
                      className={`${n.selecionado ? "bg-orange-100" : "bg-white"} hover:bg-orange-50`}
                    >
                      <td className="border text-center">
                        <input
                          type="checkbox"
                          checked={n.selecionado}
                          onChange={() =>
                            setNotas((prev) =>
                              prev.map((x) =>
                                x.id === n.id
                                  ? { ...x, selecionado: !x.selecionado }
                                  : x
                              )
                            )
                          }
                        />
                      </td>
                      <td className="border text-center">{n.filial}</td>
                      <td className="border text-center">{n.numero}</td>
                      <td className="border text-center">{n.serie}</td>
                      <td className="border text-center">{n.remetente}</td>
                      <td className="border px-2">{n.destinatario}</td>
                      <td className="border px-2">{n.endereco}</td>
                      <td className="border px-2">{n.cidade}</td>
                      <td className="border text-center">{n.uf}</td>
                      <td className="border text-right">{n.peso.toLocaleString("pt-BR")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </fieldset>

          {/* CARD 3 - Rodapé */}
          <fieldset className="border border-gray-300 rounded p-3">
            <div className="flex justify-between items-center">
              {/* Lado esquerdo */}
              <div className="flex items-center gap-2">
                <button
                  onClick={selecionarTodos}
                  className="border border-gray-300 rounded px-3 py-[4px] hover:bg-gray-100 text-[12px] flex items-center gap-1"
                >
                  <CheckCircle size={14} className="text-green-600" /> Selecionar Todos
                </button>
                <button
                  onClick={limparSelecao}
                  className="border border-gray-300 rounded px-3 py-[4px] hover:bg-gray-100 text-[12px] flex items-center gap-1"
                >
                  <RotateCcw size={14} className="text-red-600" /> Limpar Seleção
                </button>

                <label className="text-gray-700">Peso</label>
                <input
                  className="border border-gray-300 rounded px-2 h-[24px] w-[80px] bg-gray-100 text-right"
                  readOnly
                  value={pesoTotal.toLocaleString("pt-BR")}
                />
                <label>Selecionadas</label>
                <input
                  className="border border-gray-300 rounded px-2 h-[24px] w-[60px] bg-gray-100 text-center"
                  readOnly
                  value={selecionadas}
                />
                <input
                  className="border border-gray-300 rounded px-2 h-[24px] w-[60px] bg-gray-100 text-center"
                  readOnly
                  value={totalNotas}
                />
              </div>

              {/* Lado direito */}
              <div className="flex items-center gap-2">
                <button className="border border-gray-300 rounded px-3 py-[4px] bg-green-600 text-white hover:bg-green-700 text-[12px] flex items-center gap-1">
                  <CheckCircle size={14} /> Confirmar
                </button>
                <button
                  onClick={onClose}
                  className="border border-gray-300 rounded px-3 py-[4px] bg-red-600 text-white hover:bg-red-700 text-[12px] flex items-center gap-1"
                >
                  <XCircle size={14} /> Cancelar
                </button>
              </div>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
}
