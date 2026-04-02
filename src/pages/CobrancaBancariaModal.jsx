import { XCircle, RotateCcw, PlusCircle, Edit, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

function Label({ children, className = "" }) {
  return <label className={`text-[12px] text-gray-600 ${className}`}>{children}</label>;
}

function Txt({ readOnly = false, ...props }) {
  return (
    <input
      {...props}
      readOnly={readOnly}
      className={`border rounded px-1 py-[2px] h-[26px] text-[13px] w-full ${
        readOnly ? "bg-gray-200 text-gray-600 cursor-not-allowed" : "bg-white"
      }`}
    />
  );
}

function Sel({ children, ...rest }) {
  return (
    <select
      {...rest}
      className="border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full bg-white"
    >
      {children}
    </select>
  );
}

export default function CobrancaBancariaModal({ isOpen, onClose }) {
  const modalRef = useRef(null);
  const dragRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const { innerWidth, innerHeight } = window;
      const rect = modalRef.current.getBoundingClientRect();
      setPos({
        x: (innerWidth - rect.width) / 2,
        y: (innerHeight - rect.height) / 2,
      });
    }
  }, [isOpen]);

  const startDrag = (e) => {
    setDragging(true);
    const rect = modalRef.current.getBoundingClientRect();
    setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const duringDrag = (e) => {
    if (dragging) setPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const stopDrag = () => setDragging(false);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onMouseMove={duringDrag}
      onMouseUp={stopDrag}
    >
      <div
        ref={modalRef}
        className="absolute bg-white border border-gray-300 rounded-md shadow-lg w-[90vw] max-w-[1050px] max-h-[90vh] overflow-y-auto p-3"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          cursor: dragging ? "grabbing" : "default",
        }}
      >
        {/* === Cabeçalho === */}
        <div
          ref={dragRef}
          onMouseDown={startDrag}
          className="text-center text-red-700 font-semibold text-[14px] py-0 border-b cursor-grab select-none"
        >
          CLIENTE - DADOS DE COBRANÇA
        </div>

        {/* === Conteúdo === */}
        <div className="p-3 space-y-2 text-[13px]">
          {/* === Linha 1 === */}
          <div className="grid grid-cols-[100px_200px_1fr] gap-2 items-center">
            <Label className="text-right">Cliente</Label>
            <Txt value="50221019000136" />
            <Txt value="HNK BR INDÚSTRIA DE BEBIDAS LTDA" readOnly className="col-span-2" />
          </div>

          {/* === Linha 2 === */}
          <div className="grid grid-cols-[100px_1fr_150px_1fr] gap-2 items-center">
            <Label className="text-right">Faturamento</Label>
            <Sel defaultValue="Mensal">
              <option>Semanal</option>
              <option>Quinzenal</option>
              <option>Mensal</option>
            </Sel>
            <Label className="text-right">Cond. Pagamento</Label>
            <Sel defaultValue="30 - 30 DIAS">
              <option>15 - 15 DIAS</option>
              <option>30 - 30 DIAS</option>
              <option>45 - 45 DIAS</option>
            </Sel>
          </div>

          {/* === Linha 3 === */}
          <div className="grid grid-cols-[100px_1fr_100px_1fr] gap-2 items-center">
            <Label className="text-right">Filial Cobradora</Label>
            <Sel>
              <option>001 - TESTE MANTRAN</option>
              <option>002 - MATRIZ</option>
            </Sel>
            <Label className="text-right">Portador</Label>
            <Sel>
              <option>BANCO DO BRASIL S/A</option>
              <option>ITAU</option>
              <option>SANTANDER</option>
            </Sel>
          </div>

          {/* === Linha 4 === */}
          <div className="grid grid-cols-[100px_1fr_100px_1fr_100px_1fr] gap-2 items-center">
            <Label className="text-right">Qtd CTRC/Fatura</Label>
            <Txt inputMode="numeric" />
            <Label className="text-right">Vr. Máx. Fatura</Label>
            <Txt inputMode="decimal" />
            <Label className="text-right">% Desconto</Label>
            <Txt inputMode="decimal" />
          </div>

          {/* === Linha 9 === */}
          <div className="grid grid-cols-[100px_160px_1fr] gap-2 items-center">
            <Label className="text-right">CNPJ/CPF p/ Fatura</Label>
            <Txt />
            <Txt value="HNK BR INDÚSTRIA DE BEBIDAS LTDA" readOnly />
          </div>

          {/* === Linha 10 === */}
          <div className="grid grid-cols-[100px_160px_1fr] gap-2 items-center">
            <Label className="text-right">CNPJ/CPF Corresp.</Label>
            <Txt />
            <Txt value="HNK BR INDÚSTRIA DE BEBIDAS LTDA" readOnly />
          </div>

          {/* === Linha 11 === */}
          <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
            <Label className="text-right mt-[4px]">Observação</Label>
            <textarea
              className="border border-gray-300 rounded px-2 py-1 text-[13px] w-full min-h-[50px] resize-y"
              placeholder="Digite observações gerais..."
            ></textarea>
          </div>

          {/* === Linha 12 === */}
          <div className="grid grid-cols-[100px_100px_1fr] gap-2 items-center">
            <Label className="text-right">Categoria</Label>
            <Txt />
            <Txt value="RECEITAS OPERACIONAIS" readOnly />
          </div>

          {/* === Linha 13 === */}
          <div className="grid grid-cols-[100px_100px_1fr] gap-2 items-center">
            <Label className="text-right">Subcategoria</Label>
            <Txt />
            <Txt value="CTE / CONHECIMENTO" readOnly />
          </div>

          {/* === Linha 14 - Faturamento e Documento lado a lado === */}
          <div className="grid grid-cols-2 gap-3 mt-2">
            <fieldset className="border border-gray-300 rounded p-2">
              <legend className="text-red-700 font-semibold px-2">Faturamento</legend>
              <div className="flex gap-4">
                <label className="flex items-center gap-1">
                  <input type="radio" name="faturamento" defaultChecked /> Automático
                </label>
                <label className="flex items-center gap-1">
                  <input type="radio" name="faturamento" /> Manual
                </label>
              </div>
            </fieldset>

            <fieldset className="border border-gray-300 rounded p-2">
              <legend className="text-red-700 font-semibold px-2">Documento de Cobrança</legend>
              <div className="flex gap-4">
                <label className="flex items-center gap-1">
                  <input type="checkbox" defaultChecked /> Fatura
                </label>
                <label className="flex items-center gap-1">
                  <input type="checkbox" /> Boleto Bancário
                </label>
              </div>
            </fieldset>
          </div>

          {/* === Linha 16 - Dias Específicos === */}
          <fieldset className="border border-gray-300 rounded p-2">
            <legend className="text-red-700 font-semibold px-2">
              Dia Específico p/ Faturamento
            </legend>
            <div className="flex gap-6">
              {["2ª Feira", "3ª Feira", "4ª Feira", "5ª Feira", "6ª Feira"].map((dia) => (
                <label key={dia} className="flex items-center gap-1">
                  <input type="checkbox" /> {dia}
                </label>
              ))}
            </div>
          </fieldset>

          {/* === Linha 17 - Operador === */}
          <div className="grid grid-cols-[100px_1fr_100px_120px_100px_120px] gap-2 items-center">
            <Label className="text-right">Operador</Label>
            <Txt value="SUPORTE" readOnly />
            <Label className="text-right">Inclusão</Label>
            <Txt value="07/06/2018" readOnly />
            <Label className="text-right">Atualização</Label>
            <Txt value="17/06/2024" readOnly />
          </div>
        </div>

        {/* === Rodapé com ícones padrão Mantran === */}
        <div className="border-t mt-3 pt-2 flex justify-between bg-white sticky bottom-0">
          <div className="flex gap-3">
            {[
              { icon: XCircle, label: "Fechar", action: onClose },
              { icon: RotateCcw, label: "Limpar" },
              { icon: PlusCircle, label: "Incluir" },
              { icon: Edit, label: "Alterar" },
              { icon: Trash2, label: "Excluir" },
            ].map(({ icon: Icon, label, action }) => (
              <button
                key={label}
                onClick={action}
                className="flex items-center gap-1 text-red-700 hover:text-gray-700 text-[13px]"
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
