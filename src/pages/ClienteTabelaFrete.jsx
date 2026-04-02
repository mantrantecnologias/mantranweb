import { useState, useRef, useEffect } from "react";
import { XCircle, RotateCcw, PlusCircle, Trash2 } from "lucide-react";

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

export default function ClienteTabelaFrete({ isOpen, onClose }) {
  const modalRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [tipo, setTipo] = useState("Cliente");
  const [form, setForm] = useState({
    cnpj: "50221019000136",
    razao: "HNK BR INDUSTRIA DE BEBIDAS LTDA",
    indicandoCNPJ: "",
    indicandoRazao: "",
    tabela: "",
    vigenciaIni: "",
    vigenciaFim: "",
    contrato: "",
    tpCalculo: "Padrão",
    tpCarga: "Fracionada",
  });

  const [linhas, setLinhas] = useState([]);

  // centraliza o modal
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

  const handleLimpar = () => {
    setForm({
      ...form,
      tabela: "",
      vigenciaIni: "",
      vigenciaFim: "",
      contrato: "",
      tpCalculo: "Padrão",
      tpCarga: "Fracionada",
      indicandoCNPJ: "",
      indicandoRazao: "",
    });
  };

  const handleIncluir = () => {
    const nova = {
      tabela: form.tabela || "000001",
      descricao: "Tabela Teste",
      indicando: form.indicandoCNPJ || "",
      tpCalculo: form.tpCalculo,
      tpCarga: form.tpCarga,
    };
    setLinhas([...linhas, nova]);
  };

  const handleExcluir = (index) => {
    setLinhas(linhas.filter((_, i) => i !== index));
  };

  const handleSelecionar = (linha) => {
    setForm({
      ...form,
      tabela: linha.tabela,
      contrato: linha.descricao,
      indicandoCNPJ: linha.indicando,
      tpCalculo: linha.tpCalculo,
      tpCarga: linha.tpCarga,
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onMouseMove={duringDrag}
      onMouseUp={stopDrag}
    >
      <div
        ref={modalRef}
        className="absolute bg-white border border-gray-300 rounded-md shadow-lg w-[90vw] max-w-[950px] max-h-[90vh] overflow-y-auto p-3"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          cursor: dragging ? "grabbing" : "default",
        }}
      >
        {/* === CABEÇALHO === */}
        <div
          onMouseDown={startDrag}
          className="text-center text-red-700 font-semibold text-[14px] py-1 border-b cursor-grab select-none"
        >
          CLIENTE - TABELA DE FRETE
        </div>

        <div className="p-3 text-[13px] space-y-3">
          {/* === CARD 1 === */}
          <fieldset className="border border-gray-300 rounded p-2">
            <legend className="text-red-700 font-semibold px-2">Tipo</legend>
            <div className="flex gap-6">
              {["Cliente", "Indicação"].map((t) => (
                <label key={t} className="flex items-center gap-1">
                  <input
                    type="radio"
                    checked={tipo === t}
                    onChange={() => setTipo(t)}
                  />
                  {t}
                </label>
              ))}
            </div>
          </fieldset>

          {/* === CARD 2 === */}
          <fieldset className="border border-gray-300 rounded p-3 space-y-2">
            <legend className="text-red-700 font-semibold px-2">Dados</legend>

            {/* Linha 1 */}
            <div className="grid grid-cols-[100px_160px_1fr] gap-2 items-center">
              <Label className="text-right">CNPJ/CPF</Label>
              <Txt value={form.cnpj} readOnly />
              <Txt value={form.razao} readOnly />
            </div>

            {/* Linha 2 */}
            <div className="grid grid-cols-[100px_160px_1fr] gap-2 items-center">
              <Label className="text-right">Indicando</Label>
              <Txt
                value={form.indicandoCNPJ}
                onChange={(e) =>
                  setForm({ ...form, indicandoCNPJ: e.target.value })
                }
                readOnly={tipo !== "Indicação"}
              />
              <Txt
                value={form.indicandoRazao}
                onChange={(e) =>
                  setForm({ ...form, indicandoRazao: e.target.value })
                }
                readOnly={tipo !== "Indicação"}
              />
            </div>

            {/* Linha 3 */}
            <div className="grid grid-cols-[100px_1fr_100px_150px_50px_150px] gap-2 items-center">
              <Label className="text-right">Tabela</Label>
<Sel
  value={form.tabela}
  onChange={(e) => setForm({ ...form, tabela: e.target.value })}
>
  <option value="">Selecione...</option>
  <option value="000093">000093 - TABELA LOGGI</option>
  <option value="000064">000064 - TABELA NADER</option>
  <option value="000060">000060 - TABELA PADRAO</option>
  <option value="000087">000087 - TABELA RODONAVES</option>
</Sel>

              <Label className="text-right">Vigência</Label>
              <input
                type="date"
                className="border rounded px-1 h-[26px] text-[13px]"
                value={form.vigenciaIni}
                onChange={(e) => setForm({ ...form, vigenciaIni: e.target.value })}
              />
              <Label className="text-center">Até</Label>
              <input
                type="date"
                className="border rounded px-1 h-[26px] text-[13px]"
                value={form.vigenciaFim}
                onChange={(e) => setForm({ ...form, vigenciaFim: e.target.value })}
              />
            </div>

            {/* Linha 4 */}
            <div className="grid grid-cols-[100px_1fr_100px_1fr_100px_1fr] gap-2 items-center">
              <Label className="text-right">Contrato</Label>
              <Txt
                value={form.contrato}
                onChange={(e) => setForm({ ...form, contrato: e.target.value })}
              />
              <Label className="text-right">TP Cálculo</Label>
              <Sel
                value={form.tpCalculo}
                onChange={(e) => setForm({ ...form, tpCalculo: e.target.value })}
              >
                <option>Padrão</option>
                <option>Especial</option>
                <option>Outros</option>
              </Sel>
              <Label className="text-right">TP Carga</Label>
              <Sel
                value={form.tpCarga}
                onChange={(e) => setForm({ ...form, tpCarga: e.target.value })}
              >
                <option>Fracionada</option>
                <option>Fechada</option>
              </Sel>
            </div>
          </fieldset>

          {/* === CARD 3 - GRID === */}
          <fieldset className="border border-gray-300 rounded p-2 min-w-0">
            <legend className="text-red-700 font-semibold px-2">Tabelas</legend>
            <div className="border border-gray-300 rounded max-h-[300px] overflow-auto">
              <table className="min-w-full text-[12px] border-collapse">
                <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
                  <tr>
                    {["Nº Tabela Frete", "Descrição", "CGC_CPF_Indicando", "TP Cálculo", "TP Carga"].map((col) => (
                      <th key={col} className="border px-2 py-1 text-left">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {linhas.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center text-gray-400 italic py-2 border">
                        Nenhuma tabela adicionada
                      </td>
                    </tr>
                  ) : (
                    linhas.map((l, i) => (
                      <tr
                        key={i}
                        onClick={() => handleSelecionar(l)}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="border px-2 py-1">{l.tabela}</td>
                        <td className="border px-2 py-1">{l.descricao}</td>
                        <td className="border px-2 py-1">{l.indicando}</td>
                        <td className="border px-2 py-1">{l.tpCalculo}</td>
                        <td className="border px-2 py-1">{l.tpCarga}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </fieldset>
        </div>

        {/* === RODAPÉ === */}
        <div className="border-t mt-3 pt-2 flex justify-between bg-white sticky bottom-0">
          <div className="flex gap-3">
            {[
              { icon: XCircle, label: "Fechar", action: onClose },
              { icon: RotateCcw, label: "Limpar", action: handleLimpar },
              { icon: PlusCircle, label: "Incluir", action: handleIncluir },
              { icon: Trash2, label: "Excluir", action: () => handleExcluir(linhas.length - 1) },
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
