// src/pages/Estado.jsx
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
        "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full " +
        (props.className || "")
      }
    />
  );
}

/* ================= Mock Inicial ================= */
const mockUF = [
  {
    sigla: "SP",
    nome: "SÃO PAULO",
    aliq: "0.12",
    aliqUF: "0.12",
    codInterno: "SP",
    aliqFora: "0.12",
    ibge: "35",
    aliqAereo: "0.00",
    fundo: "0.00",
    icmsBenef: true,
    icmsST: false,
    icmsIsento: false,
  },
  {
    sigla: "RJ",
    nome: "RIO DE JANEIRO",
    aliq: "0.12",
    aliqUF: "0.12",
    codInterno: "RJ",
    aliqFora: "0.12",
    ibge: "33",
    aliqAereo: "0.00",
    fundo: "0.00",
    icmsBenef: false,
    icmsST: true,
    icmsIsento: false,
  },
];

/* ================= Componente Principal ================= */
export default function Estado({ open }) {
  const navigate = useNavigate();
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  const [listaUF, setListaUF] = useState(mockUF);
  const [selecionado, setSelecionado] = useState(null);

  const [form, setForm] = useState({
    sigla: "",
    nome: "",
    aliq: "",
    aliqUF: "",
    codInterno: "",
    aliqFora: "",
    ibge: "",
    aliqAereo: "",
    fundo: "",
    icmsBenef: false,
    icmsST: false,
    icmsIsento: false,
  });

  /* ================= Handlers ================= */

  const handleChange = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleGridSelect = (row, idx) => {
    setSelecionado(idx);
    setForm({ ...row });
  };

  const handleLimpar = () => {
    setForm({
      sigla: "",
      nome: "",
      aliq: "",
      aliqUF: "",
      codInterno: "",
      aliqFora: "",
      ibge: "",
      aliqAereo: "",
      fundo: "",
      icmsBenef: false,
      icmsST: false,
      icmsIsento: false,
    });
    setSelecionado(null);
  };

  const handleIncluir = () => {
    if (!form.sigla || !form.nome) {
      alert("Informe SIGLA e NOME da UF.");
      return;
    }

    setListaUF((prev) => [...prev, form]);
    handleLimpar();
  };

  const handleAlterar = () => {
    if (selecionado === null) {
      alert("Selecione um registro.");
      return;
    }

    const atualizado = form;

    setListaUF((prev) =>
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

    setListaUF((prev) => prev.filter((_, idx) => idx !== selecionado));
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
        CADASTRO DE UF
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
              <Label className="col-span-1">Sigla UF</Label>
              <Txt className="col-span-3 text-center"
                value={form.sigla}
                onChange={handleChange("sigla")}
              />

              <Label className="col-span-2 col-start-7 ">Nome Estado</Label>
              <Txt className="col-span-4 text-center"
                value={form.nome}
                onChange={handleChange("nome")}
              />
            </div>

            {/* Linha 2 */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-1">Alíquota ICMS</Label>
              <Txt className="col-span-3 text-center"
                value={form.aliq}
                onChange={handleChange("aliq")}
              />

              <Label className="col-span-2 col-start-7">Aliq. ICMS UF Beneficiada</Label>
              <Txt className="col-span-4 text-center"
                value={form.aliqUF}
                onChange={handleChange("aliqUF")}
              />
            </div>

            {/* Linha 3 */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-1">Código Interno</Label>
              <Txt className="col-span-3 text-center"
                value={form.codInterno}
                onChange={handleChange("codInterno")}
              />

              <Label className="col-span-2 col-start-7">Aliq. ICMS Fora Estado</Label>
              <Txt className="col-span-4 text-center"
                value={form.aliqFora}
                onChange={handleChange("aliqFora")}
              />
            </div>

            {/* Linha 4 */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-1">Código IBGE</Label>
              <Txt className="col-span-3 text-center"
                value={form.ibge}
                onChange={handleChange("ibge")}
              />

              <Label className="col-span-2 col-start-7">Aliq. ICMS Aéreo</Label>
              <Txt className="col-span-1 text-center"
                value={form.aliqAereo}
                onChange={handleChange("aliqAereo")}
              />

              <Label className="col-span-2">Fundo Comb. Pobreza</Label>
              <Txt className="col-span-1 text-center"
                value={form.fundo}
                onChange={handleChange("fundo")}
              />
            </div>

            {/* Linha 5 - Flags */}
            <div className="grid grid-cols-12 gap-4 items-center mt-1 text-[12px]">
              <label className="col-span-3 flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={form.icmsBenef}
                  onChange={handleChange("icmsBenef")}
                  className="accent-red-700"
                />
                Estado Beneficiado com ICMS
              </label>

              <label className="col-span-3 flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={form.icmsST}
                  onChange={handleChange("icmsST")}
                  className="accent-red-700"
                />
                Estado com Substituição Tributária
              </label>

              <label className="col-span-3 flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={form.icmsIsento}
                  onChange={handleChange("icmsIsento")}
                  className="accent-red-700"
                />
                Estado com Produtos Isentos
              </label>
            </div>

          </div>
        </fieldset>

        {/* ================= CARD 2 - GRID ================= */}
        <fieldset className="border border-gray-300 rounded p-3 bg-white">
          <legend className="text-red-700 font-semibold text-[13px] px-2">
            Estados Cadastrados
          </legend>

          <div className="border border-gray-200 rounded max-h-[420px] overflow-y-auto">
            <table className="w-full text-[12px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1 text-center w-[60px]">Sigla</th>
                  <th className="border px-2 py-1">Nome</th>
                  <th className="border px-2 py-1 text-center">Aliq. ICMS</th>
                  <th className="border px-2 py-1 text-center">ICMS UF Benef.</th>
                  <th className="border px-2 py-1 text-center">Cód. Interno</th>
                  <th className="border px-2 py-1 text-center">ICMS Fora</th>
                  <th className="border px-2 py-1 text-center">Cód. IBGE</th>
                  <th className="border px-2 py-1 text-center">Fundo Pob.</th>
                </tr>
              </thead>

              <tbody>
                {listaUF.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`cursor-pointer hover:bg-red-100 ${
                      selecionado === idx ? "bg-red-200" : ""
                    }`}
                    onClick={() => handleGridSelect(row, idx)}
                  >
                    <td className="border px-2 py-1 text-center">{row.sigla}</td>
                    <td className="border px-2 py-1">{row.nome}</td>
                    <td className="border px-2 py-1 text-center">{row.aliq}</td>
                    <td className="border px-2 py-1 text-center">{row.aliqUF}</td>
                    <td className="border px-2 py-1 text-center">{row.codInterno}</td>
                    <td className="border px-2 py-1 text-center">{row.aliqFora}</td>
                    <td className="border px-2 py-1 text-center">{row.ibge}</td>
                    <td className="border px-2 py-1 text-center">{row.fundo}</td>
                  </tr>
                ))}

                {listaUF.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="border px-2 py-2 text-center text-gray-500"
                    >
                      Nenhum estado cadastrado.
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
