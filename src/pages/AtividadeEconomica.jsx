// src/pages/AtividadeEconomica.jsx
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

/* ================= Helpers ================= */
function Label({ children, className = "" }) {
  return (
    <label className={`text-[12px] text-gray-700 flex items-center ${className}`}>
      {children}
    </label>
  );
}

function Txt(props) {
  return (
    <input
      {...props}
      className={
        "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full " +
        (props.className || "")
      }
    />
  );
}

function Sel({ children, className = "", ...rest }) {
  return (
    <select
      {...rest}
      className={
        "border border-gray-300 rounded px-1 h-[26px] text-[13px] w-full " +
        className
      }
    >
      {children}
    </select>
  );
}

/* ================= Mock Inicial ================= */
const mockCFOP = [
  { codigo: "5351", descricao: "PREST SERV DE TRANSP / EXECUCAO MESMA NATUREZA" },
  { codigo: "5352", descricao: "ESTAB INDUSTRIAL NORMAL" },
  { codigo: "5353", descricao: "ESTAB. INDUSTRIAL EXPORTACAO" },
  { codigo: "5354", descricao: "PREST. SERV. COMUNICAÇÃO" },
  { codigo: "5355", descricao: "GER. DIST. ENERGIA ELET." },
  { codigo: "5356", descricao: "PRODUTOR RURAL" },
  { codigo: "5357", descricao: "TRANSP. NÃO CONTRIB." },
];

const mockLista = [
  {
    codigo: "0001",
    descricao: "SERVIÇO DA MESMA NATUREZA TRAN",
    cfopEstadual: "5351",
    cfopInterestadual: "6351",
  },
  {
    codigo: "0002",
    descricao: "ESTAB. INDUSTRIAL NORMAL",
    cfopEstadual: "5352",
    cfopInterestadual: "6352",
  },
];

/* ================= Componente Principal ================= */
export default function AtividadeEconomica({ open }) {
  const navigate = useNavigate();
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  const [lista, setLista] = useState(mockLista);
  const [selecionado, setSelecionado] = useState(null);

  const [form, setForm] = useState({
    codigo: "",
    descricao: "",
    cfopEstadual: "",
    cfopInterestadual: "",
  });

  /* ================= Handlers ================= */
  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleGridSelect = (row, idx) => {
    setSelecionado(idx);
    setForm({ ...row });
  };

  const handleLimpar = () => {
    setForm({
      codigo: "",
      descricao: "",
      cfopEstadual: "",
      cfopInterestadual: "",
    });
    setSelecionado(null);
  };

  const handleIncluir = () => {
    if (!form.codigo || !form.descricao) {
      alert("Informe Código e Descrição.");
      return;
    }

    setLista((prev) => [...prev, form]);
    handleLimpar();
  };

  const handleAlterar = () => {
    if (selecionado === null) {
      alert("Selecione um registro.");
      return;
    }

    const atualizado = form;

    setLista((prev) =>
      prev.map((item, idx) => (idx === selecionado ? atualizado : item))
    );

    handleLimpar();
  };

  const handleExcluir = () => {
    if (selecionado === null) {
      alert("Selecione um registro.");
      return;
    }

    if (!window.confirm("Deseja excluir este registro?")) return;

    setLista((prev) => prev.filter((_, idx) => idx !== selecionado));
    handleLimpar();
  };

  /* ================= Render ================= */
  return (
    <div
      className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 bg-gray-50 
      h-[calc(100vh-56px)] flex flex-col 
      ${open ? "ml-[192px]" : "ml-[56px]"}`}
    >
      {/* Título */}
      <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
        CADASTRO DE ATIVIDADE
      </h1>

      {/* Conteúdo */}
      <div className="flex-1 p-3 overflow-y-auto bg-white border-x border-b border-gray-300 rounded-b-md flex flex-col gap-3">

        {/* ================= CARD 1 - PARÂMETROS ================= */}
        <fieldset className="border border-gray-300 rounded p-3 bg-white">
          <legend className="text-red-700 font-semibold text-[13px] px-2">
            Parâmetros
          </legend>

          <div className="space-y-2">

            {/* Linha 1 */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-1">Código</Label>
              <Txt
                className="col-span-1"
                value={form.codigo}
                onChange={handleChange("codigo")}
              />

              <Label className="col-span-1 ">Descrição</Label>
              <Txt
                className="col-span-4"
                value={form.descricao}
                onChange={handleChange("descricao")}
              />
            </div>

          </div>
        </fieldset>

        {/* ================= CARD 2 - CFO ================= */}
        <fieldset className="border border-gray-300 rounded p-3 bg-white">
          <legend className="text-red-700 font-semibold text-[13px] px-2">
            CFO - Código de Operação Fiscal
          </legend>

          <div className="space-y-2">

            {/* Linha 1 */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-2">Operações Estaduais</Label>
              <Sel
                value={form.cfopEstadual}
                onChange={handleChange("cfopEstadual")}
                className="col-span-5"
              >
                <option value="">Selecione</option>
                {mockCFOP.map((c) => (
                  <option key={c.codigo} value={c.codigo}>
                    {c.codigo} - {c.descricao}
                  </option>
                ))}
              </Sel>
            </div>

            {/* Linha 2 */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-2">Operações Interestaduais</Label>
              <Sel
                value={form.cfopInterestadual}
                onChange={handleChange("cfopInterestadual")}
                className="col-span-5"
              >
                <option value="">Selecione</option>
                {mockCFOP.map((c) => (
                  <option key={c.codigo} value={c.codigo}>
                    {c.codigo} - {c.descricao}
                  </option>
                ))}
              </Sel>
            </div>

          </div>
        </fieldset>

        {/* ================= CARD 3 - GRID ================= */}
        <fieldset className="border border-gray-300 rounded p-3 bg-white">
          <legend className="text-red-700 font-semibold text-[13px] px-2">
            Atividades Cadastradas
          </legend>

          <div className="border border-gray-200 rounded max-h-[420px] overflow-y-auto">
            <table className="w-full text-[12px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1 w-[80px] text-center">Código</th>
                  <th className="border px-2 py-1">Descrição</th>
                  <th className="border px-2 py-1 text-center">CFO Estadual</th>
                  <th className="border px-2 py-1 text-center">CFO Inter</th>
                </tr>
              </thead>

              <tbody>
                {lista.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`cursor-pointer hover:bg-red-100 ${
                      selecionado === idx ? "bg-red-200" : ""
                    }`}
                    onClick={() => handleGridSelect(row, idx)}
                  >
                    <td className="border px-2 py-1 text-center">{row.codigo}</td>
                    <td className="border px-2 py-1">{row.descricao}</td>
                    <td className="border px-2 py-1 text-center">{row.cfopEstadual}</td>
                    <td className="border px-2 py-1 text-center">{row.cfopInterestadual}</td>
                  </tr>
                ))}

                {lista.length === 0 && (
                  <tr>
                    <td colSpan={4} className="border px-2 py-2 text-center text-gray-500">
                      Nenhuma atividade cadastrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </fieldset>
      </div>

      {/* ================= Rodapé ================= */}
      <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">

        <button
          onClick={() => navigate(-1)}
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <XCircle size={20} />
          <span>Fechar</span>
        </button>

        <button
          onClick={handleLimpar}
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <RotateCcw size={20} />
          <span>Limpar</span>
        </button>

        <button
          onClick={handleIncluir}
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <PlusCircle size={20} />
          <span>Incluir</span>
        </button>

        <button
          onClick={handleAlterar}
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <Edit size={20} />
          <span>Alterar</span>
        </button>

        <button
          onClick={handleExcluir}
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <Trash2 size={20} />
          <span>Excluir</span>
        </button>

      </div>
    </div>
  );
}
