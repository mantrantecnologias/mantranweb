// src/pages/RegiaoModal.jsx
import { useState } from "react";
import { useIconColor } from "../context/IconColorContext";
import {
  XCircle,
  RotateCcw,
  PlusCircle,
  Edit,
  Trash2,
} from "lucide-react";

/* ========================= Helpers ========================= */
function Label({ children, className = "" }) {
  return (
    <label className={`text-[12px] text-gray-700 ${className}`}>
      {children}
    </label>
  );
}

function Txt(props) {
  return (
    <input
      {...props}
      className={
        "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] " +
        (props.className || "")
      }
    />
  );
}

/* ========================= Mocks ========================= */

const regioesMockInicial = [
  { id: 1, codigo: "001", descricao: "CAPITAL" },
  { id: 2, codigo: "002", descricao: "INTERIOR" },
  { id: 3, codigo: "003", descricao: "GRANDE SÃO PAULO" },
  { id: 4, codigo: "004", descricao: "LITORAL" },
];

const initialForm = {
  codigo: "",
  descricao: "",
};

/* ========================= Componente ========================= */

export default function RegiaoModal({ open, onClose }) {
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  const [form, setForm] = useState(initialForm);
  const [regioes, setRegioes] = useState(regioesMockInicial);
  const [selecionadoId, setSelecionadoId] = useState(null);

  if (!open) return null;

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleLimpar = () => {
    setForm(initialForm);
    setSelecionadoId(null);
  };

  const handleGridSelect = (row) => {
    setSelecionadoId(row.id);
    setForm({
      codigo: row.codigo,
      descricao: row.descricao,
    });
  };

  const handleIncluir = () => {
    if (!form.codigo || !form.descricao) {
      alert("Informe Código e Descrição da Região.");
      return;
    }

    // Impede duplicidade de código no mock
    if (regioes.some((r) => r.codigo === form.codigo)) {
      alert("Já existe uma região com este código.");
      return;
    }

    const novo = {
      id: Date.now(),
      codigo: form.codigo,
      descricao: form.descricao,
    };

    setRegioes((prev) => [...prev, novo]);
    handleLimpar();
  };

  const handleAlterar = () => {
    if (!selecionadoId) {
      alert("Selecione um registro na grid para alterar.");
      return;
    }

    if (!form.codigo || !form.descricao) {
      alert("Informe Código e Descrição.");
      return;
    }

    setRegioes((prev) =>
      prev.map((r) =>
        r.id === selecionadoId
          ? { ...r, codigo: form.codigo, descricao: form.descricao }
          : r
      )
    );

    handleLimpar();
  };

  const handleExcluir = () => {
    if (!selecionadoId) {
      alert("Selecione um registro na grid para excluir.");
      return;
    }

    if (!window.confirm("Confirma exclusão da região selecionada?")) return;

    setRegioes((prev) => prev.filter((r) => r.id !== selecionadoId));
    handleLimpar();
  };

  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/40 z-[200]"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      ></div>

      {/* JANELA CENTRALIZADA */}
      <div
        className="
          fixed left-1/2 top-1/2
          -translate-x-1/2 -translate-y-1/2
          z-[201]
          w-[600px] max-w-[95vw]
          bg-white border border-gray-300 rounded shadow-2xl
          flex flex-col
        "
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50 rounded-t">
          <h2 className="text-red-700 font-semibold text-[14px]">
            CADASTRO DE REGIÃO
          </h2>

          <button
            onClick={onClose}
            className="flex items-center gap-1 text-red-700 hover:text-red-800 text-[12px]"
          >
            <XCircle size={18} /> Fechar
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-3 flex-1 flex flex-col gap-3 overflow-y-auto">
          {/* CARD 1 - Parâmetros */}
          <fieldset className="border border-gray-300 rounded p-3 bg-white">
            <legend className="text-red-700 font-semibold text-[13px] px-2">
              Parâmetros
            </legend>

            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-2">Código</Label>
              <Txt
                className="col-span-2 text-center"
                value={form.codigo}
                onChange={handleChange("codigo")}
              />

              <Label className="col-span-2">Descrição</Label>
              <Txt
                className="col-span-6"
                value={form.descricao}
                onChange={handleChange("descricao")}
              />
            </div>
          </fieldset>

          {/* CARD 2 - Grid */}
          <fieldset className="border border-gray-300 rounded p-3 bg-white">
            <legend className="text-red-700 font-semibold text-[13px] px-2">
              Regiões
            </legend>

            <div className="border border-gray-200 rounded max-h-[260px] overflow-y-auto">
              <table className="w-full text-[12px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1 w-[80px]">Código</th>
                    <th className="border px-2 py-1">Descrição</th>
                  </tr>
                </thead>
                <tbody>
                  {regioes.map((row) => (
                    <tr
                      key={row.id}
                      className={`cursor-pointer hover:bg-red-100 ${
                        selecionadoId === row.id ? "bg-red-200" : ""
                      }`}
                      onClick={() => handleGridSelect(row)}
                    >
                      <td className="border px-2 py-1 text-center">
                        {row.codigo}
                      </td>
                      <td className="border px-2 py-1">{row.descricao}</td>
                    </tr>
                  ))}

                  {regioes.length === 0 && (
                    <tr>
                      <td
                        colSpan={2}
                        className="border px-2 py-2 text-center text-gray-500"
                      >
                        Nenhuma região cadastrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </fieldset>
        </div>

        {/* Rodapé */}
        <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6 rounded-b">
          {/* Fechar */}
          <button
            onClick={onClose}
            title="Fechar"
            className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
          >
            <XCircle size={20} />
            <span>Fechar</span>
          </button>

          {/* Limpar */}
          <button
            onClick={handleLimpar}
            title="Limpar Campos"
            className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
          >
            <RotateCcw size={20} />
            <span>Limpar</span>
          </button>

          {/* Incluir */}
          <button
            onClick={handleIncluir}
            title="Incluir Região"
            className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
          >
            <PlusCircle size={20} />
            <span>Incluir</span>
          </button>

          {/* Alterar */}
          <button
            onClick={handleAlterar}
            title="Alterar Região"
            className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
          >
            <Edit size={20} />
            <span>Alterar</span>
          </button>

          {/* Excluir */}
          <button
            onClick={handleExcluir}
            title="Excluir Região"
            className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
          >
            <Trash2 size={20} />
            <span>Excluir</span>
          </button>
        </div>
      </div>
    </>
  );
}
