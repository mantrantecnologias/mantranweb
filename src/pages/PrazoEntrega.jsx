import { useState } from "react";
import { XCircle, RotateCcw, PlusCircle, Edit, Trash2 } from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

export default function PrazoEntrega({ open, onClose }) {
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  // ---------------------------------------
  // MOCK DE DADOS
  // ---------------------------------------
  const [lista, setLista] = useState([
    { tipo: "1544", descricao: "1544", qtd: 0, tipoNF: "N" },
    { tipo: "26", descricao: "TESTE TESTE TESTE", qtd: 13, tipoNF: "N" },
    { tipo: "336", descricao: "SUPER SUPER", qtd: 6, tipoNF: "T" },
  ]);

  const [dados, setDados] = useState({
    tipo: "",
    descricao: "",
    qtd: "",
    tipoNF: "T - Transferência",
  });

  const limpar = () => {
    setDados({
      tipo: "",
      descricao: "",
      qtd: "",
      tipoNF: "T - Transferência",
    });
  };

  const incluir = () => {
    if (!dados.tipo || !dados.descricao) return;

    setLista((prev) => [
      ...prev,
      {
        tipo: dados.tipo,
        descricao: dados.descricao,
        qtd: dados.qtd || 0,
        tipoNF: dados.tipoNF.startsWith("T") ? "T" : "N",
      },
    ]);

    limpar();
  };

  const alterar = () => {
    setLista((prev) =>
      prev.map((item) =>
        item.tipo === dados.tipo
          ? {
            tipo: dados.tipo,
            descricao: dados.descricao,
            qtd: dados.qtd,
            tipoNF: dados.tipoNF.startsWith("T") ? "T" : "N",
          }
          : item
      )
    );
    limpar();
  };

  const excluir = () => {
    setLista((prev) => prev.filter((x) => x.tipo !== dados.tipo));
    limpar();
  };

  const selecionar = (item) => {
    setDados({
      tipo: item.tipo,
      descricao: item.descricao,
      qtd: item.qtd,
      tipoNF: item.tipoNF === "T" ? "T - Transferência" : "N - Normal",
    });
  };

  const handleFechar = () => {
    if (onClose) onClose();
    else window.history.back();
  };

  return (
    <div
      className={`transition-all duration-300 mt-[44px] text-[13px] bg-gray-50 h-[calc(100vh-56px)] flex flex-col ${open ? "ml-[192px]" : "ml-[56px]"
        }`}
    >
      {/* ===================== CONTEÚDO ===================== */}
      <div className="flex-1 p-4 overflow-y-auto pb-[88px]">
        <div className="bg-white border border-gray-300 shadow rounded p-4">
          {/* TÍTULO */}
          <h2 className="text-center text-red-700 font-bold text-lg mb-4">
            CADASTRO DE PRAZO DE ENTREGA
          </h2>

          {/* CARD 1 */}
          <fieldset className="border border-gray-300 rounded p-3 mb-4">
            <legend className="px-2 text-red-700 font-semibold">
              Parâmetros
            </legend>

            {/* Linha 1 */}
            <div className="grid grid-cols-12 gap-2 mb-2">
              <label className="col-span-2 text-[12px] text-gray-700 flex items-center">
                Prazo de Entrega
              </label>
              <input
                className="col-span-3 border border-gray-300 rounded px-1 h-[26px] text-[13px]"
                value={dados.tipo}
                onChange={(e) =>
                  setDados({ ...dados, tipo: e.target.value })
                }
              />

              <label className="col-span-2 col-start-7 text-[12px] text-gray-700 flex items-center">
                Tipo de NF
              </label>
              <select
                className="col-span-4 border border-gray-300 rounded h-[26px] text-[13px] w-full"
                value={dados.tipoNF}
                onChange={(e) =>
                  setDados({ ...dados, tipoNF: e.target.value })
                }
              >
                <option>T - Transferência</option>
                <option>N - Normal</option>
              </select>
            </div>

            {/* Linha 2 */}
            <div className="grid grid-cols-12 gap-2">
              <label className="col-span-2 text-[12px] text-gray-700 flex items-center">
                Qtd Entregas Máx. por Veículo Dia
              </label>
              <input
                type="number"
                className="col-span-3 border border-gray-300 rounded px-1 h-[26px] text-[13px]"
                value={dados.qtd}
                onChange={(e) =>
                  setDados({ ...dados, qtd: e.target.value })
                }
              />
            </div>
          </fieldset>

          {/* CARD 2 – GRID */}
          <div className="border border-gray-300 rounded p-2 overflow-auto">
            <table className="w-full text-[13px]">
              <thead className="bg-gray-100 h-8 text-gray-700">
                <tr>
                  <th className="text-left px-2 w-24">Tipo</th>
                  <th className="text-left px-2">Descrição do Prazo</th>
                  <th className="text-right px-2 w-32">
                    Qtd Entrega Veículo Dia
                  </th>
                  <th className="text-center px-2 w-20">Tipo NF</th>
                </tr>
              </thead>

              <tbody>
                {lista.map((item, index) => (
                  <tr
                    key={index}
                    onClick={() => selecionar(item)}
                    className="h-8 cursor-pointer hover:bg-red-50 border-b"
                  >
                    <td className="px-2">{item.tipo}</td>
                    <td className="px-2">{item.descricao}</td>
                    <td className="px-2 text-right">{item.qtd}</td>
                    <td className="px-2 text-center">{item.tipoNF}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ===================== RODAPÉ FIXO ===================== */}
      <div className="sticky bottom-0 bg-white border-t border-gray-300 py-2 px-4 flex items-center gap-6 mt-auto z-10 shadow-[0_-2px_4px_rgba(0,0,0,0.05)]">
        <button
          onClick={handleFechar}
          className={`flex flex-col items-center text-[11px] transition ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <XCircle size={20} />
          <span>Fechar</span>
        </button>

        <button
          onClick={limpar}
          className={`flex flex-col items-center text-[11px] transition ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <RotateCcw size={20} />
          <span>Limpar</span>
        </button>

        <button
          onClick={incluir}
          className={`flex flex-col items-center text-[11px] transition ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <PlusCircle size={20} />
          <span>Incluir</span>
        </button>

        <button
          onClick={alterar}
          className={`flex flex-col items-center text-[11px] transition ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <Edit size={20} />
          <span>Alterar</span>
        </button>

        <button
          onClick={excluir}
          className={`flex flex-col items-center text-[11px] transition ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <Trash2 size={20} />
          <span>Excluir</span>
        </button>
      </div>
    </div>
  );
}
