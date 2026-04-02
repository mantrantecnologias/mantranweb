import { useState, useEffect, useRef } from "react";
import {
  XCircle,
  RotateCcw,
  PlusCircle,
  Edit,
  Trash2,
  Search,
} from "lucide-react";

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

export default function ClienteAgenda({ isOpen, onClose }) {
  const modalRef = useRef(null);
  const dragRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [showPesquisa, setShowPesquisa] = useState(false);

  const [agenda, setAgenda] = useState([
    {
      id: 1,
      data: "12/11/2025",
      historico: "TESTE",
      categoria: "REUNIÃO",
      fl: "N",
      status: "AGENDADO",
    },
  ]);

  const [form, setForm] = useState({
    cnpj: "50221019000136",
    razao: "HNK BR INDÚSTRIA DE BEBIDAS LTDA",
    data: "12/11/2025",
    historico: "",
    categoria: "REUNIÃO",
    status: "AGENDADO",
    follow: false,
  });

  // Centraliza o modal ao abrir
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

  const handleLimpar = () =>
    setForm({ ...form, historico: "", categoria: "REUNIÃO", status: "AGENDADO", follow: false });

  const handleIncluir = () => {
    const novo = {
      id: agenda.length + 1,
      data: form.data,
      historico: form.historico || "—",
      categoria: form.categoria,
      fl: form.follow ? "S" : "N",
      status: form.status,
    };
    setAgenda([...agenda, novo]);
    alert("Item incluído na agenda!");
    handleLimpar();
  };

  const handleSelect = (item) => setForm({ ...form, ...item });

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
        {/* === Cabeçalho === */}
        <div
          ref={dragRef}
          onMouseDown={startDrag}
          className="text-center text-red-700 font-semibold text-[14px] py-1 border-b cursor-grab select-none"
        >
          CLIENTE - AGENDA
        </div>

        {/* === Conteúdo === */}
        <div className="p-3 text-[13px] space-y-3">
          {/* === CARD 1 === */}
          <fieldset className="border border-gray-300 rounded p-3 space-y-2">
            <legend className="text-red-700 font-semibold px-2">Dados</legend>

            {/* Linha 1 */}
            <div className="grid grid-cols-[110px_180px_1fr] gap-3 items-center">
              <Label className="text-right">CNPJ/CPF Cliente</Label>
              <Txt value={form.cnpj} readOnly />
              <Txt value={form.razao} readOnly />
            </div>

            {/* Linha 2 */}
            <div className="grid grid-cols-[110px_180px] gap-3 items-center">
              <Label className="text-right">Data</Label>
              <Txt
                type="date"
                value={form.data}
                onChange={(e) => setForm({ ...form, data: e.target.value })}
              />
            </div>

            {/* Linha 3 */}
            <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
              <Label className="text-right mt-[4px]">Histórico</Label>
              <textarea
                value={form.historico}
                onChange={(e) => setForm({ ...form, historico: e.target.value })}
                className="border border-gray-300 rounded px-2 py-1 text-[13px] w-full min-h-[50px] resize-y"
              ></textarea>
            </div>

            {/* Linha 4 */}
            <div className="grid grid-cols-[110px_1fr_100px_1fr_auto] gap-3 items-center">
              <Label className="text-right">Categoria</Label>
              <Sel
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              >
                <option>REUNIÃO</option>
                <option>RETORNO</option>
                <option>VISITA</option>
                <option>OUTROS</option>
              </Sel>

              <Label className="text-right">Status</Label>
              <Sel
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option>AGENDADO</option>
                <option>CONCLUÍDO</option>
                <option>CANCELADO</option>
              </Sel>

              <label className="flex items-center gap-1 text-[12px]">
                <input
                  type="checkbox"
                  checked={form.follow}
                  onChange={(e) => setForm({ ...form, follow: e.target.checked })}
                />{" "}
                Requer Follow Up
              </label>
            </div>
          </fieldset>

          {/* === CARD 2 === */}
          <fieldset className="border border-gray-300 rounded p-3">
            <legend className="text-red-700 font-semibold px-2">Agenda</legend>
            <div className="border border-gray-300 rounded max-h-[300px] overflow-auto">
              <table className="min-w-full text-[12px] border-collapse">
                <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
                  <tr>
                    {["Nº Item", "Data Agenda", "Histórico", "Categoria", "FL", "Status"].map(
                      (col) => (
                        <th key={col} className="border px-2 py-1 text-left">
                          {col}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {agenda.map((a, i) => (
                    <tr
                      key={i}
                      onClick={() => handleSelect(a)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="border px-2 py-1">{a.id}</td>
                      <td className="border px-2 py-1">{a.data}</td>
                      <td className="border px-2 py-1">{a.historico}</td>
                      <td className="border px-2 py-1">{a.categoria}</td>
                      <td className="border px-2 py-1 text-center">{a.fl}</td>
                      <td className="border px-2 py-1">{a.status}</td>
                    </tr>
                  ))}
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
              { icon: Edit, label: "Alterar" },
              { icon: Trash2, label: "Excluir" },
              { icon: Search, label: "Pesquisar", action: () => setShowPesquisa(true) },
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

        {/* === MODAL DE PESQUISA === */}
        {showPesquisa && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white border border-gray-300 rounded-md shadow-lg w-[420px] p-4 space-y-3">
              <h2 className="text-center text-red-700 font-semibold text-[14px] border-b pb-1">
                Opções de Pesquisa
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Período</Label>
                  <Txt type="date" />
                </div>
                <div>
                  <Label>Até</Label>
                  <Txt type="date" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Categoria</Label>
                  <Sel>
                    <option></option>
                    <option>REUNIÃO</option>
                    <option>RETORNO</option>
                    <option>VISITA</option>
                  </Sel>
                </div>
                <div>
                  <Label>Status</Label>
                  <Sel>
                    <option></option>
                    <option>AGENDADO</option>
                    <option>CONCLUÍDO</option>
                    <option>CANCELADO</option>
                  </Sel>
                </div>
              </div>

              <div className="flex justify-center gap-3 mt-3">
                <button
                  onClick={() => setShowPesquisa(false)}
                  className="flex items-center gap-1 border border-gray-300 rounded px-3 py-[4px] text-[12px] hover:bg-gray-100"
                >
                  Voltar
                </button>
                <button className="flex items-center gap-1 border border-gray-300 rounded px-3 py-[4px] text-[12px] hover:bg-gray-100 text-red-700">
                  <Search size={14} /> Pesquisar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
