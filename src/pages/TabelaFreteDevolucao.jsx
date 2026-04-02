import { useState, useRef } from "react";
import {
  XCircle,
  RotateCcw,
  PlusCircle,
  Edit,
  Trash2,
  Copy,
} from "lucide-react";

export default function TabelaFreteDevolucao({ onClose }) {
  const [itens, setItens] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [dados, setDados] = useState({
    codigoLocal: "",
    descricao: "",
    valorDevolucao: "0,00",
    valorPedagioEixo: "0,00",
  });

  const modalRef = useRef(null);
  const pos = useRef({ x: 0, y: 0, dx: 0, dy: 0 });

  // === Movimentação do Modal ===
  const startDrag = (e) => {
    const modal = modalRef.current;
    pos.current = {
      x: e.clientX,
      y: e.clientY,
      dx: modal.offsetLeft,
      dy: modal.offsetTop,
    };
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
  };
  const onDrag = (e) => {
    const modal = modalRef.current;
    const { x, y, dx, dy } = pos.current;
    modal.style.left = dx + e.clientX - x + "px";
    modal.style.top = dy + e.clientY - y + "px";
  };
  const stopDrag = () => {
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
  };

  // === Manipulação dos Campos ===
  const handleChange = (e) => {
    const { name, value } = e.target;
    const novoValor = value.replace(/[^0-9.,]/g, "");
    setDados((prev) => ({ ...prev, [name]: novoValor }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const val = value.replace(",", ".").trim();
    const num = parseFloat(val);
    const formatado = isNaN(num) ? "0,00" : num.toFixed(2).replace(".", ",");
    setDados((prev) => ({ ...prev, [name]: formatado }));
  };

  const handleIncluir = () => {
    if (!dados.codigoLocal || !dados.descricao) {
      alert("Preencha o Local de Devolução Container!");
      return;
    }

    const valPedagio = dados.valorPedagioEixo.replace(",", ".").trim();
    const numPedagio = parseFloat(valPedagio);
    const pedagioFmt = isNaN(numPedagio)
      ? "0,00"
      : numPedagio.toFixed(2).replace(".", ",");

    setItens([...itens, { ...dados, valorPedagioEixo: pedagioFmt }]);
    setDados({
      codigoLocal: "",
      descricao: "",
      valorDevolucao: "0,00",
      valorPedagioEixo: "0,00",
    });
  };

  const handleExcluir = () => {
    if (selecionado === null) {
      alert("Selecione um item para excluir.");
      return;
    }
    setItens(itens.filter((_, i) => i !== selecionado));
    setSelecionado(null);
  };

  const handleSelecionar = (i) => {
    setSelecionado(i);
    setDados(itens[i]);
  };

  const handleUltimoCampo = () => {
    handleIncluir();
  };

  // === Render ===
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
      <div
        ref={modalRef}
        className="absolute bg-white rounded-lg shadow-xl w-[90%] max-w-[900px] max-h-[90vh] overflow-auto border border-gray-300 text-black"
        style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* === CABEÇALHO === */}
        <div
          className="cursor-move bg-gray-50 border-b border-gray-300 px-4 py-2 flex items-center justify-between"
          onMouseDown={startDrag}
        >
          <h2 className="text-red-700 font-semibold text-[14px]">
            DEVOLUÇÃO DE CONTAINER
          </h2>
        </div>

        <div className="p-4 space-y-3">
          {/* === CARD 1 === */}
          <fieldset className="border border-gray-300 rounded p-3">
            <legend className="text-red-700 font-semibold px-2">
              Dados da Devolução
            </legend>

            {/* Linha 1 */}
            <div className="flex items-center gap-2 mb-2 text-[13px]">
              <label className="w-[160px] text-right">
                Local Devolução Container
              </label>
              <input
                name="codigoLocal"
                value={dados.codigoLocal}
                onChange={(e) =>
                  setDados((prev) => ({ ...prev, codigoLocal: e.target.value }))
                }
                className="border border-gray-300 rounded px-2 py-[2px] w-[100px]"
              />
              <input
                name="descricao"
                value={dados.descricao}
                onChange={(e) =>
                  setDados((prev) => ({ ...prev, descricao: e.target.value }))
                }
                className="border border-gray-300 rounded px-2 py-[2px] flex-1"
              />
            </div>

            {/* Linha 2 e 3 */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-[6px] text-[13px]">
              {[
                ["Valor Devolução Container", "valorDevolucao"],
                ["Valor Pedágio por Eixo", "valorPedagioEixo"],
              ].map(([label, name], i) => (
                <div key={i} className="flex items-center gap-2">
                  <label className="w-[180px] text-right">{label}</label>
                  <input
                    name={name}
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*[.,]?[0-9]*"
                    value={dados[name] || "0,00"}
                    onChange={handleChange}
                    onBlur={(e) => {
                      handleBlur(e);
                      if (name === "valorPedagioEixo") handleUltimoCampo();
                    }}
                    onKeyDown={(e) => {
                      if (name === "valorPedagioEixo" && e.key === "Enter") {
                        e.preventDefault();
                        handleBlur(e);
                        handleUltimoCampo();
                      }
                    }}
                    className="border border-gray-300 rounded px-2 py-[2px] w-[100px] text-right"
                  />
                </div>
              ))}
            </div>
          </fieldset>

          {/* === CARD 2 === */}
          <fieldset className="border border-gray-300 rounded p-0 overflow-hidden">
            <table className="min-w-full border-collapse text-[13px]">
              <thead className="bg-gray-200 text-gray-800 font-semibold text-center">
                <tr>
                  <th className="border border-gray-300 px-2 py-1">
                    Código Local
                  </th>
                  <th className="border border-gray-300 px-2 py-1">
                    Localidade
                  </th>
                  <th className="border border-gray-300 px-2 py-1">
                    Valor Devolução
                  </th>
                  <th className="border border-gray-300 px-2 py-1">
                    Valor Pedágio
                  </th>
                </tr>
              </thead>
              <tbody>
                {itens.map((item, i) => (
                  <tr
                    key={i}
                    onClick={() => handleSelecionar(i)}
                    className={`text-center cursor-pointer ${
                      selecionado === i
                        ? "bg-red-100 border-l-4 border-red-600"
                        : i % 2 === 0
                        ? "bg-gray-50"
                        : "bg-white"
                    } hover:bg-gray-100`}
                  >
                    <td className="border border-gray-300 px-2 py-[3px]">
                      {item.codigoLocal}
                    </td>
                    <td className="border border-gray-300 px-2 py-[3px]">
                      {item.descricao}
                    </td>
                    <td className="border border-gray-300 px-2 py-[3px]">
                      {item.valorDevolucao}
                    </td>
                    <td className="border border-gray-300 px-2 py-[3px]">
                      {item.valorPedagioEixo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </fieldset>
        </div>

        {/* === RODAPÉ === */}
        <div className="border-t border-gray-300 bg-gray-50 px-4 py-2 flex justify-start gap-4 items-center rounded-b-lg text-red-700">
          <button onClick={onClose} title="Fechar" className="hover:text-red-800 transition">
            <XCircle size={20} />
          </button>
          <button
            title="Limpar"
            onClick={() =>
              setDados({
                codigoLocal: "",
                descricao: "",
                valorDevolucao: "0,00",
                valorPedagioEixo: "0,00",
              })
            }
            className="hover:text-red-800 transition"
          >
            <RotateCcw size={20} />
          </button>
          <button title="Incluir" onClick={handleIncluir} className="hover:text-red-800 transition">
            <PlusCircle size={20} />
          </button>
          <button title="Alterar" className="hover:text-red-800 transition">
            <Edit size={20} />
          </button>
          <button title="Excluir" onClick={handleExcluir} className="hover:text-red-800 transition">
            <Trash2 size={20} />
          </button>
          <button title="Replicar" className="hover:text-red-800 transition">
            <Copy size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
