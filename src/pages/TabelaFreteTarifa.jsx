import { useState, useRef } from "react";
import { XCircle, PlusCircle, Layers } from "lucide-react";


export default function TabelaFreteTarifa({ onClose }) {
  const [aberto, setAberto] = useState(true);

  const [tarifas] = useState([
    {
      id: 1,
      tarifa: "0001",
      advaloremPerc: "2.00",
      advaloremVr: "22.00",
      txMinima: "2.00",
      despacho: "2.00",
      pacote: "0.00",
      faixa500: "100.000",
      faixa1000: "200.000",
      faixa99999999: "0.189",
    },
    {
      id: 2,
      tarifa: "0002",
      advaloremPerc: "0.10",
      advaloremVr: "22.00",
      txMinima: "2.00",
      despacho: "2.00",
      pacote: "0.00",
      faixa500: "100.000",
      faixa1000: "200.000",
      faixa99999999: "0.189",
    },
    {
      id: 3,
      tarifa: "0003",
      advaloremPerc: "0.10",
      advaloremVr: "0.00",
      txMinima: "0.00",
      despacho: "0.00",
      pacote: "0.00",
      faixa500: "100.000",
      faixa1000: "200.000",
      faixa99999999: "0.189",
    },
  ]);

  const handleClick = (col, item) => {
    if (col === "tarifa") {
      alert(`🧾 Editar Tarifa ${item.tarifa} (modal futuro)`);
    } else {
      alert(`📊 Editar Faixa da Tarifa ${item.tarifa} (${col}) (modal futuro)`);
    }
  };

  // === Movimento do modal ===
  const modalRef = useRef(null);
  const pos = useRef({ x: 0, y: 0, dx: 0, dy: 0 });

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

  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]"
      onClick={() => setAberto(false)}
    >
      {/* === MODAL === */}
      <div
        ref={modalRef}
        className="absolute bg-white rounded-lg shadow-xl w-[90%] max-w-[1000px] max-h-[90vh] overflow-auto border border-gray-300"
        onClick={(e) => e.stopPropagation()}
        style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
      >
        {/* CABEÇALHO - arrastável */}
        <div
          className="cursor-move bg-gray-50 border-b border-gray-300 px-4 py-2 rounded-t-lg"
          onMouseDown={startDrag}
        >
          <h2 className="text-red-700 font-semibold text-[14px]">
            TABELA DE FRETE - TARIFAS
          </h2>
        </div>

        {/* CONTEÚDO */}
        <div className="p-3">
          {/* === CARD 1 - GRID === */}
          <fieldset className="border border-gray-300 rounded p-0 bg-white mb-3">
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-[13px]">
                <thead>
                  <tr className="bg-gray-200 text-gray-800 text-center font-semibold">
                    <th className="px-2 py-1 border border-gray-400">TARIFA</th>
                    <th className="px-2 py-1 border border-gray-400">% ADVALOREM</th>
                    <th className="px-2 py-1 border border-gray-400">VR. ADVALOREM</th>
                    <th className="px-2 py-1 border border-gray-400">VR.TX.MINIMA</th>
                    <th className="px-2 py-1 border border-gray-400">VR.DESPACHO</th>
                    <th className="px-2 py-1 border border-gray-400">VR.PACOTE</th>
                    <th className="px-2 py-1 border border-gray-400">500 Kg (s)</th>
                    <th className="px-2 py-1 border border-gray-400">1000 Kg (s)</th>
                    <th className="px-2 py-1 border border-gray-400">99999999 Kg (s)</th>
                  </tr>
                </thead>
                <tbody className="text-black">
                  {tarifas.map((item, i) => (
                    <tr
                      key={item.id}
                      className={`text-center ${
                        i % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100 cursor-pointer`}
                    >
                      <td
                        className="border border-gray-300 px-2 py-[3px] font-semibold"
                        onClick={() => handleClick("tarifa", item)}
                      >
                        {item.tarifa}
                      </td>
                      <td className="border border-gray-300 px-2 py-[3px]">{item.advaloremPerc}</td>
                      <td className="border border-gray-300 px-2 py-[3px]">{item.advaloremVr}</td>
                      <td className="border border-gray-300 px-2 py-[3px]">{item.txMinima}</td>
                      <td className="border border-gray-300 px-2 py-[3px]">{item.despacho}</td>
                      <td className="border border-gray-300 px-2 py-[3px]">{item.pacote}</td>
                      <td
                        className="border border-gray-300 px-2 py-[3px] font-semibold"
                        onClick={() => handleClick("500Kg", item)}
                      >
                        {item.faixa500}
                      </td>
                      <td
                        className="border border-gray-300 px-2 py-[3px] font-semibold"
                        onClick={() => handleClick("1000Kg", item)}
                      >
                        {item.faixa1000}
                      </td>
                      <td
                        className="border border-gray-300 px-2 py-[3px] font-semibold"
                        onClick={() => handleClick("99999999Kg", item)}
                      >
                        {item.faixa99999999}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </fieldset>

          {/* === CARD 2 - BOTÕES === */}
          <fieldset className="border border-gray-300 rounded p-3 bg-white">
            <legend className="text-red-700 font-semibold px-2">Ações</legend>

            <div className="flex items-center justify-start gap-4 text-red-700">
              <button
                onClick={onClose}
                className="flex items-center gap-2 border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-100 transition"
              >
                <XCircle size={18} className="text-red-700" />
                Fechar Tela
              </button>

              {/* Botão que dispara o evento para abrir o modal fora */}
              <button
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("abrirIncluirTarifa"))
                }
                className="flex items-center gap-2 border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-100 transition"
              >
                <PlusCircle size={18} className="text-red-700" />
                Incluir Tarifa
              </button>

              <button
  onClick={() =>
    window.dispatchEvent(new CustomEvent("abrirIncluirFaixa"))
  }
  className="flex items-center gap-2 border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-100 transition"
>
  <Layers size={18} className="text-red-700" />
  Incluir Faixa
</button>

            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
}
