import { useRef } from "react";
import { XCircle, PlusCircle, Edit, Trash2 } from "lucide-react";

export default function TabelaFreteIncluirTarifa({ onClose }) {
  const modalRef = useRef(null);
  const pos = useRef({ x: 0, y: 0, dx: 0, dy: 0 });

  // === Movimento do modal ===
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

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
      <div
        ref={modalRef}
        className="absolute bg-white rounded-lg shadow-xl w-[90%] max-w-[950px] max-h-[90vh] overflow-auto border border-gray-300 text-black"
        style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* === CABEÇALHO === */}
        <div
          className="cursor-move bg-gray-50 border-b border-gray-300 px-4 py-2 rounded-t-lg flex items-center justify-between"
          onMouseDown={startDrag}
        >
          <h2 className="text-red-700 font-semibold text-[14px]">
            TARIFA PESO
          </h2>
        </div>

        {/* === CONTEÚDO === */}
        <div className="p-4 space-y-3 text-black">
          <div className="grid grid-cols-2 gap-3">
            {/* === CARD 1 - Manutenção de Tarifa === */}
            <fieldset className="border border-gray-300 rounded p-3">
              <legend className="text-red-700 font-semibold px-2">
                Manutenção de Tarifa
              </legend>
              <div className="flex flex-col gap-2 text-[13px]">
                {[
                  "Tarifa",
                  "% Advalorem",
                  "Valor Advalorem",
                  "Valor Tonelada",
                  "Valor Tx. Mínima",
                  "Valor Despacho",
                  "Valor Pacote Entregue",
                ].map((label, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <label className="whitespace-nowrap w-[140px]">
                      {label}
                    </label>
                    <input
                      type="text"
                      className="border border-gray-300 rounded px-2 py-[2px] w-[120px] text-right text-[13px]"
                      defaultValue="0,00"
                    />
                  </div>
                ))}
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" />
                  <label className="text-[13px]">Atualiza Faixas</label>
                </div>
              </div>
            </fieldset>

            {/* === CARD 2 - Grid Origem/Destino === */}
            <fieldset className="border border-gray-300 rounded p-3">
              <legend className="text-red-700 font-semibold px-2">
                Origem / Destino
              </legend>
              <div className="overflow-y-auto max-h-[220px]">
                <table className="min-w-full border border-gray-300 text-[13px] text-black">
                  <thead>
                    <tr className="bg-gray-200 text-black text-center font-semibold">
                      <th className="border border-gray-300 px-2 py-1">Origem</th>
                      <th className="border border-gray-300 px-2 py-1">Destino</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-center hover:bg-gray-100">
                      <td className="border border-gray-300 px-2 py-[3px]">
                        SALTO DE PIRAPORA
                      </td>
                      <td className="border border-gray-300 px-2 py-[3px] bg-orange-50">
                        ITAPEMA
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </fieldset>
          </div>

          {/* === CARD 3 - Cadastro de Percurso === */}
          <fieldset className="border border-gray-300 rounded p-3">
            <legend className="text-red-700 font-semibold px-2">
              Cadastro de Percurso
            </legend>
            <div className="space-y-2 text-[13px]">
              {/* Linha 1 */}
              <div className="flex items-center gap-2">
                <label className="w-[130px]">CEP Ref. Origem</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-[2px] w-[100px] text-center"
                  defaultValue="11010000"
                />
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-[2px] w-[200px]"
                  defaultValue="SANTOS"
                />
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-[2px] w-[40px] text-center"
                  defaultValue="SP"
                />
              </div>

              {/* Linha 2 */}
              <div className="flex items-center gap-2">
                <label className="w-[130px]">CEP Ref. Destino</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-[2px] w-[100px] text-center"
                  defaultValue="13010000"
                />
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-[2px] w-[200px]"
                  defaultValue="CAMPINAS"
                />
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-[2px] w-[40px] text-center"
                  defaultValue="SP"
                />
              </div>
            </div>
          </fieldset>
        </div>

        {/* === RODAPÉ === */}
        <div className="border-t border-gray-300 bg-gray-50 px-4 py-2 flex justify-end gap-3 rounded-b-lg">
          <button className="flex items-center gap-2 border border-gray-300 rounded px-3 py-1.5 text-[13px] hover:bg-gray-100 transition text-red-700">
            <PlusCircle size={16} />
            Incluir
          </button>
          <button className="flex items-center gap-2 border border-gray-300 rounded px-3 py-1.5 text-[13px] hover:bg-gray-100 transition text-red-700">
            <Edit size={16} />
            Alterar
          </button>
          <button className="flex items-center gap-2 border border-gray-300 rounded px-3 py-1.5 text-[13px] hover:bg-gray-100 transition text-red-700">
            <Trash2 size={16} />
            Excluir
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 border border-gray-300 rounded px-3 py-1.5 text-[13px] hover:bg-gray-100 transition text-red-700"
          >
            <XCircle size={16} />
            Fechar Tela
          </button>
        </div>
      </div>
    </div>
  );
}
