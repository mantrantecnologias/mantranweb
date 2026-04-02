import { useState, useRef } from "react";
import { XCircle, Upload, Download } from "lucide-react";

export default function TabelaFreteImportacao({ onClose }) {
  const [empresa, setEmpresa] = useState("001 - MANTRAN TRANSPORTES LTDA");
  const [tabela, setTabela] = useState("000015 - TABELA VENDA");
  const [tipoTabela, setTipoTabela] = useState("Faixa Peso");

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

  // === Upload de Excel ===
  const handleImportar = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (!file.name.endsWith(".xlsx")) {
        alert("❌ Só é permitido arquivo com extensão .xlsx");
        return;
      }
      alert(`📦 Arquivo selecionado: ${file.name}\n\nEm breve faremos o upload automático.`);
    };
    input.click();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
      <div
        ref={modalRef}
        className="absolute bg-white rounded-lg shadow-xl w-[90%] max-w-[800px] max-h-[85vh] overflow-auto border border-gray-300 text-black"
        style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* === CABEÇALHO === */}
        <div
          className="cursor-move bg-gray-50 border-b border-gray-300 px-4 py-2 flex justify-between items-center"
          onMouseDown={startDrag}
        >
          <h2 className="text-red-700 font-semibold text-[14px]">
            TABELAS DE FRETE - IMPORTAÇÃO
          </h2>
        </div>

        {/* === CONTEÚDO === */}
        <div className="p-4 space-y-3 text-[13px]">
          <fieldset className="border border-gray-300 rounded p-4">
            {/* === Linha 1 === */}
            <div className="flex items-center gap-3 mb-3">
              <label className="w-[120px] text-right">Empresa</label>
              <select
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                className="border border-gray-300 rounded px-2 py-[3px] flex-1"
              >
                <option>001 - MANTRAN TRANSPORTES LTDA</option>
                <option>002 - MANTRAN LOGÍSTICA</option>
                <option>003 - MANTRAN DISTRIBUIÇÃO</option>
              </select>
            </div>

            {/* === Linha 2 === */}
            <div className="flex items-center gap-3 mb-3">
              <label className="w-[120px] text-right">Tabela Frete</label>
              <select
                value={tabela}
                onChange={(e) => setTabela(e.target.value)}
                className="border border-gray-300 rounded px-2 py-[3px] flex-1"
              >
                <option>000015 - TABELA VENDA</option>
                <option>000020 - TABELA RETORNO</option>
                <option>000025 - TABELA CLIENTE</option>
              </select>
            </div>

            {/* === Linha 3 === */}
            <div className="flex items-center gap-3">
              <label className="w-[120px] text-right">Tp. Tabela</label>
              <div className="flex gap-5">
                {["Faixa Peso", "Pallets", "Cubagem", "% NF", "Tipo de Veículo"].map((tipo) => (
                  <label key={tipo} className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="tipoTabela"
                      checked={tipoTabela === tipo}
                      onChange={() => setTipoTabela(tipo)}
                    />
                    {tipo}
                  </label>
                ))}
              </div>
            </div>
          </fieldset>
        </div>

        {/* === RODAPÉ === */}
        <div className="border-t border-gray-300 bg-gray-50 px-4 py-2 flex justify-start items-center gap-6 rounded-b-lg text-red-700">
          <button
            onClick={onClose}
            title="Fechar"
            className="hover:text-red-800 transition"
          >
            <XCircle size={20} />
          </button>

          <button
            onClick={handleImportar}
            title="Importar Tabela Frete (.xlsx)"
            className="hover:text-red-800 transition"
          >
            <Upload size={20} />
          </button>

          <button
            onClick={() => alert("📤 Exportar Tabela Frete (em breve)")}
            title="Exportar Tabela Frete"
            className="hover:text-red-800 transition"
          >
            <Download size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
