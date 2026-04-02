// src/pages/Regiao.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIconColor } from "../context/IconColorContext";

import {
  XCircle,
  RotateCcw,
  PlusCircle,
  Edit,
  Trash2,
} from "lucide-react";

/* ============ Helpers ============ */
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

/* ============ Mock de Regiões ============ */
const mockRegioes = [
  { codigo: "001", descricao: "GRANDE SÃO PAULO" },
  { codigo: "002", descricao: "INTERIOR SP" },
  { codigo: "003", descricao: "RIO DE JANEIRO" },
  { codigo: "004", descricao: "MINAS GERAIS" },
  { codigo: "005", descricao: "PARANÁ" },
];

/* ============ Tela Principal ============ */
export default function Regiao({ open }) {
  const navigate = useNavigate();
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  const [form, setForm] = useState({ codigo: "", descricao: "" });
  const [regioes, setRegioes] = useState(mockRegioes);
  const [selecionado, setSelecionado] = useState(null);

  /* ---- Handlers ---- */
  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleLimpar = () => {
    setForm({ codigo: "", descricao: "" });
    setSelecionado(null);
  };

  const handleGridSelect = (row, idx) => {
    setSelecionado(idx);
    setForm({
      codigo: row.codigo,
      descricao: row.descricao,
    });
  };

  const handleIncluir = () => {
    if (!form.codigo || !form.descricao) {
      alert("Informe Código e Descrição.");
      return;
    }

    const novo = {
      codigo: form.codigo,
      descricao: form.descricao,
    };

    setRegioes((prev) => [...prev, novo]);
    handleLimpar();
  };

  const handleAlterar = () => {
    if (selecionado === null) {
      alert("Selecione um registro para alterar.");
      return;
    }

    const atualizado = {
      codigo: form.codigo,
      descricao: form.descricao,
    };

    setRegioes((prev) =>
      prev.map((item, idx) => (idx === selecionado ? atualizado : item))
    );

    handleLimpar();
  };

  const handleExcluir = () => {
    if (selecionado === null) {
      alert("Selecione um registro para excluir.");
      return;
    }

    if (!window.confirm("Confirma exclusão da Região selecionada?")) return;

    setRegioes((prev) => prev.filter((_, idx) => idx !== selecionado));
    handleLimpar();
  };

  /* ============================================= */
  return (
    <div
      className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 bg-gray-50 h-[calc(100vh-56px)] flex flex-col ${
        open ? "ml-[192px]" : "ml-[56px]"
      }`}
    >
      {/* Título */}
      <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
        CADASTRO DE REGIÕES
      </h1>

      {/* Conteúdo */}
      <div className="flex-1 p-3 bg-white border-x border-b border-gray-200 rounded-b-md overflow-y-auto flex flex-col gap-3">

        {/* CARD 1 - Parâmetros */}
        <fieldset className="border border-gray-300 rounded p-3 bg-white">
          <legend className="text-red-700 font-semibold text-[13px] px-2">
            Parâmetros
          </legend>

          <div className="space-y-2">
            {/* Linha 1 */}
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
          </div>
        </fieldset>

        {/* CARD 2 - Grid */}
        <fieldset className="border border-gray-300 rounded p-3 bg-white">
          <legend className="text-red-700 font-semibold text-[13px] px-2">
            Regiões Cadastradas
          </legend>

          <div className="border border-gray-200 rounded max-h-[420px] overflow-y-auto">
            <table className="w-full text-[12px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1 text-center w-[80px]">Código</th>
                  <th className="border px-2 py-1 text-left">Descrição</th>
                </tr>
              </thead>

              <tbody>
                {regioes.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`cursor-pointer hover:bg-red-100 ${
                      selecionado === idx ? "bg-red-200" : ""
                    }`}
                    onClick={() => handleGridSelect(row, idx)}
                  >
                    <td className="border px-2 py-1 text-center">{row.codigo}</td>
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
      <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">

        <button
          onClick={() => navigate(-1)}
          title="Fechar Tela"
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <XCircle size={20} />
          <span>Fechar</span>
        </button>

        <button
          onClick={handleLimpar}
          title="Limpar Campos"
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <RotateCcw size={20} />
          <span>Limpar</span>
        </button>

        <button
          onClick={handleIncluir}
          title="Incluir"
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <PlusCircle size={20} />
          <span>Incluir</span>
        </button>

        <button
          onClick={handleAlterar}
          title="Alterar"
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <Edit size={20} />
          <span>Alterar</span>
        </button>

        <button
          onClick={handleExcluir}
          title="Excluir"
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <Trash2 size={20} />
          <span>Excluir</span>
        </button>
      </div>
    </div>
  );
}
