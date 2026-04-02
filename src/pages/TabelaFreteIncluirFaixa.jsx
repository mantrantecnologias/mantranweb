import { useRef } from "react";
import { XCircle, PlusCircle, Edit, Trash2 } from "lucide-react";

export default function TabelaFreteIncluirFaixa({ onClose }) {
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
        className="absolute bg-white rounded-lg shadow-xl w-[80%] max-w-[500px] max-h-[95vh] overflow-auto border border-gray-300 text-black"

        style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* === CABEÇALHO === */}
        <div
          className="cursor-move bg-gray-50 border-b border-gray-300 px-4 py-2 rounded-t-lg flex items-center justify-between"
          onMouseDown={startDrag}
        >
          <h2 className="text-red-700 font-semibold text-[14px]">
            FAIXA PESO
          </h2>
        </div>

        {/* === CONTEÚDO === */}
        <div className="p-4 space-y-3 text-black">
          {/* === CARD 1 - Manutenção de Faixa === */}
          <fieldset className="border border-gray-300 rounded p-3">
            <legend className="text-red-700 font-semibold px-2">
              Manutenção de Faixa
            </legend>
            <div className="flex flex-col gap-2 text-[13px]">
              {[
                "Faixa Peso",
                "Valor Frete Peso",
                "Valor Frete Distribuição",
                "Fator Divisão Peso (Kg)",
                "Fator de coeficiente",
                "Valor Despacho",
                "Valor CAT",
                "Valor Pedágio",
                "Valor Adicional Noturno",
                "Valor Pacote Entregue",
              ].map((label, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <label className="whitespace-nowrap w-[170px]">
                    {label}
                  </label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded px-2 py-[2px] w-[130px] text-right text-[13px]"
                    defaultValue="0,00"
                  />
                </div>
              ))}
            </div>
          </fieldset>

          {/* === LINHA COM 2 CARDS DE CHECKBOX === */}
          <div className="grid grid-cols-2 gap-3">
            {/* CARD 2 - Coluna da esquerda */}
            <div className="flex flex-col justify-center gap-2 border border-gray-300 rounded p-3">
              <div className="flex items-center gap-2">
                <input type="checkbox" />
                <label className="text-[13px]">
                  Cobrança por faixa de peso
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" />
                <label className="text-[13px]">Arredondamento de peso</label>
              </div>
            </div>

            {/* CARD 3 - Coluna da direita */}
<div className="flex flex-col justify-center gap-2 border border-gray-300 rounded p-3 text-right">
  <div className="flex items-center justify-end gap-2">
    <label className="text-[13px]">Alterar Tarifa</label>
    <input type="radio" name="tipoTarifa" />
  </div>
  <div className="flex items-center justify-end gap-2">
    <label className="text-[13px]">Todas as Tarifas</label>
    <input type="radio" name="tipoTarifa" />
  </div>
</div>

          </div>
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
