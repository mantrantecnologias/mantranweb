import { useState, useEffect, useRef } from "react";
import { XCircle, CheckCircle, Move } from "lucide-react";

export default function ParametroTaxa({ onClose }) {
  const taxaKeys = [
    "FretePeso", "Frete Valor", "Advalorem", "Despacho", "Cat", "ITR", "Pedágio",
    "Ademe", "Outros", "Taxa Entrega", "Taxa Coleta", "Descarga", "Gris", "Estadia",
    "Escolta", "Estacionamento", "Emissão DTA", "Valor Ajudante", "Imo Carga Perigosa", "Monitoramento",
    "Imo Adesivagem", "Imposto Suspenso", "Dev. Container", "Taxa Emissao CTe", "Taxa Ova", "Taxa Desova",
    "Taxa Agravo", "Frete Morto", "Taxa Cancelamento", "Taxa Anvisa", "Taxa Refrigerada", "Taxa Plataforma", "Ad. Noturno",
    "TRT"
  ];

  const [selecionadas, setSelecionadas] = useState([]);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  // Centraliza o modal na primeira renderização
  useEffect(() => {
    const centerX = window.innerWidth / 2 - 350; // metade da largura do modal (700px / 2)
    const centerY = window.innerHeight / 2 - 250; // altura aproximada
    setPos({ x: centerX, y: centerY });
  }, []);

  // Carrega preferências salvas
  useEffect(() => {
    const saved = localStorage.getItem("param_taxas_ativas");
    if (saved) setSelecionadas(JSON.parse(saved));
  }, []);

  // Alternar taxa individual
  const toggleTaxa = (taxa) => {
    setSelecionadas((prev) =>
      prev.includes(taxa)
        ? prev.filter((t) => t !== taxa)
        : [...prev, taxa]
    );
  };

  // Selecionar ou limpar todas
  const handleSelectAll = () => {
    if (selecionadas.length === taxaKeys.length) {
      setSelecionadas([]); // limpar
    } else {
      setSelecionadas(taxaKeys); // selecionar todas
    }
  };

  // Salvar no localStorage
  const handleSalvar = () => {
    localStorage.setItem("param_taxas_ativas", JSON.stringify(selecionadas));
    alert("✅ Taxas salvas com sucesso!");
    onClose?.();
  };

  /* === Lógica para arrastar === */
  const handleMouseDown = (e) => {
    setDragging(true);
    const rect = dragRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPos({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        ref={dragRef}
        className="absolute bg-white w-[700px] max-h-[80vh] overflow-auto rounded shadow-2xl border border-gray-300"
        style={{
          top: pos.y,
          left: pos.x,
          cursor: dragging ? "grabbing" : "default",
        }}
      >
        {/* ===== Cabeçalho simples (arrastável) ===== */}
        <div
          onMouseDown={handleMouseDown}
          className="flex items-center gap-2 px-4 py-2 border-b bg-white cursor-grab select-none"
        >
          <Move size={16} className="text-red-700" />
          <h2 className="text-[15px] font-semibold text-red-700">
            Selecionar Taxas Utilizadas
          </h2>
        </div>

        {/* ===== Conteúdo ===== */}
        <div className="p-4">
          {/* Botão Selecionar/Limpar Todos */}
          <div className="flex justify-end mb-3">
            <button
              onClick={handleSelectAll}
              className="bg-gray-100 border border-gray-300 text-sm px-3 py-1 rounded hover:bg-gray-200 text-red-700 font-medium"
            >
              {selecionadas.length === taxaKeys.length
                ? "❌ Limpar Todos"
                : "✅ Selecionar Todos"}
            </button>
          </div>

          {/* Grade de checkboxes */}
          <div className="grid grid-cols-3 gap-y-2 gap-x-4 text-[13px] text-gray-700">
            {taxaKeys.map((taxa) => (
              <label key={taxa} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selecionadas.includes(taxa)}
                  onChange={() => toggleTaxa(taxa)}
                  className="w-4 h-4 accent-red-700"
                />
                {taxa}
              </label>
            ))}
          </div>

          {/* Rodapé com botões */}
          <div className="flex justify-end items-center mt-4 border-t pt-3 gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-1 border border-gray-300 rounded px-3 py-[4px] hover:bg-gray-100 text-red-700 text-[13px]"
            >
              <XCircle size={16} /> Fechar
            </button>

            <button
              onClick={handleSalvar}
              className="flex items-center gap-1 bg-green-600 text-white px-3 py-[4px] rounded hover:bg-green-700 text-[13px]"
            >
              <CheckCircle size={14} /> Salvar Seleção
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
