import { useState, useRef } from "react";
import { XCircle, DollarSign } from "lucide-react";

export default function TabelaFreteReajuste({ onClose }) {
  const [tipoReajuste, setTipoReajuste] = useState(""); // "acrescimo" ou "desconto"
  const [tabela, setTabela] = useState({
    numero: "000001",
    descricao: "MARFRIG EXPORTACAO/MERCADO INTERNO",
    reajuste: "0,00",
    desconto: "0,00",
  });
  const [tipoTarifa, setTipoTarifa] = useState("valores"); // valores, percentuais, ambos

  const modalRef = useRef(null);
  const pos = useRef({ x: 0, y: 0, dx: 0, dy: 0 });

  const startDrag = (e) => {
    const modal = modalRef.current;
    pos.current = { x: e.clientX, y: e.clientY, dx: modal.offsetLeft, dy: modal.offsetTop };
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    const limpo = value.replace(/[^0-9.,]/g, "");
    setTabela((prev) => ({ ...prev, [name]: limpo }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const val = value.replace(",", ".").trim();
    const num = parseFloat(val);
    const formatado = isNaN(num) ? "0,00" : num.toFixed(2).replace(".", ",");
    setTabela((prev) => ({ ...prev, [name]: formatado }));
  };

  const handleReajustar = () => {
    alert(
      `💰 Reajuste aplicado com sucesso!\n\nTipo: ${
        tipoReajuste === "acrescimo" ? "Acréscimo" : "Desconto"
      }\nTabela: ${tabela.numero} - ${tabela.descricao}\n${
        tipoReajuste === "acrescimo"
          ? "% Reajuste: " + tabela.reajuste
          : "% Desconto: " + tabela.desconto
      }\nTipo de Tarifa: ${
        tipoTarifa === "valores"
          ? "Somente Valores"
          : tipoTarifa === "percentuais"
          ? "Somente Percentuais"
          : "Valores e Percentuais"
      }`
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
      <div
        ref={modalRef}
        className="absolute bg-white rounded-lg shadow-xl w-[90%] max-w-[800px] max-h-[90vh] overflow-auto border border-gray-300 text-black"
        style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* === CABEÇALHO === */}
        <div
          className="cursor-move bg-gray-50 border-b border-gray-300 px-4 py-2 flex items-center justify-between"
          onMouseDown={startDrag}
        >
          <h2 className="text-red-700 font-semibold text-[14px] uppercase">
            REAJUSTE TABELA FRETE
          </h2>
        </div>

        {/* === CONTEÚDO === */}
        <div className="p-4 space-y-3 text-[13px]">
          {/* === CARD 1 - Tipo Reajuste === */}
          <fieldset className="border border-gray-300 rounded p-2">
            <legend className="text-red-700 font-semibold px-2">
              Tipo Reajuste
            </legend>
            <div className="flex items-center gap-6 px-4">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="tipoReajuste"
                  value="acrescimo"
                  checked={tipoReajuste === "acrescimo"}
                  onChange={() => setTipoReajuste("acrescimo")}
                />
                Acréscimo
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="tipoReajuste"
                  value="desconto"
                  checked={tipoReajuste === "desconto"}
                  onChange={() => setTipoReajuste("desconto")}
                />
                Desconto
              </label>
            </div>
          </fieldset>

          {/* === CARD 2 - Dados da Tabela === */}
          <fieldset className="border border-gray-300 rounded p-3">
            <div className="flex items-center gap-2 mb-2">
              <label className="w-[100px] text-right">Tabela Frete</label>
              <input
                className="border border-gray-300 rounded px-2 py-[2px] w-[100px]"
                value={tabela.numero}
                readOnly
              />
              <input
                className="border border-gray-300 rounded px-2 py-[2px] flex-1"
                value={tabela.descricao}
                readOnly
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <label className="w-[100px] text-right">% Reajuste</label>
                <input
                  name="reajuste"
                  value={tabela.reajuste}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={tipoReajuste !== "acrescimo"}
                  className={`border border-gray-300 rounded px-2 py-[2px] w-[80px] text-right ${
                    tipoReajuste !== "acrescimo"
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="w-[100px] text-right">% Desconto</label>
                <input
                  name="desconto"
                  value={tabela.desconto}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={tipoReajuste !== "desconto"}
                  className={`border border-gray-300 rounded px-2 py-[2px] w-[80px] text-right ${
                    tipoReajuste !== "desconto"
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                />
              </div>
            </div>
          </fieldset>

          {/* === CARD 3 - Tarifas === */}
          <fieldset className="border border-gray-300 rounded p-2">
            <legend className="text-red-700 font-semibold px-2">Tarifas</legend>
            <div className="flex items-center gap-6 px-4">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="tarifa"
                  value="valores"
                  checked={tipoTarifa === "valores"}
                  onChange={() => setTipoTarifa("valores")}
                />
                Somente Valores
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="tarifa"
                  value="percentuais"
                  checked={tipoTarifa === "percentuais"}
                  onChange={() => setTipoTarifa("percentuais")}
                />
                Somente Percentuais
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="tarifa"
                  value="ambos"
                  checked={tipoTarifa === "ambos"}
                  onChange={() => setTipoTarifa("ambos")}
                />
                Valores e Percentuais
              </label>
            </div>
          </fieldset>
        </div>

        {/* === RODAPÉ === */}
        <div className="border-t border-gray-300 bg-gray-50 px-4 py-2 flex justify-start gap-4 items-center rounded-b-lg text-red-700">
          <button
            onClick={onClose}
            title="Fechar"
            className="hover:text-red-800 transition"
          >
            <XCircle size={20} />
          </button>
          <button
            title="Reajustar"
            onClick={handleReajustar}
            className="hover:text-red-800 transition"
          >
            <DollarSign size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
