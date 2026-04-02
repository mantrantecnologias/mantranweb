// src/pages/ClienteCondicaoPagamento.jsx
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
const listaTipos = ["À Vista", "À Prazo", "Fora Quinzena", "Semanal", "Mensal"];
const listaTipoCond = ["Fatura", "Boleto", "Fatura + Boleto"];
const listaDescricao = ["Fatura", "Boleto", "Fatura + Boleto"];

const mockLista = [
  {
    codigo: "001",
    tipo: "À Vista",
    dias1: "0",
    descricao: "Fatura",
    dias2: "0",
    tipoCond: "Fatura",
    dias3: "0",
    padrao: true,
    automatica: false,
  },
  {
    codigo: "002",
    tipo: "Mensal",
    dias1: "30",
    descricao: "Boleto",
    dias2: "45",
    tipoCond: "Boleto",
    dias3: "60",
    padrao: false,
    automatica: true,
  },
];

/* ================= Componente Principal ================= */
export default function ClienteCondicaoPagamento({ open }) {
  const navigate = useNavigate();
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  const [lista, setLista] = useState(mockLista);
  const [selecionado, setSelecionado] = useState(null);

  const [form, setForm] = useState({
    codigo: "",
    tipo: "",
    dias1: "",
    descricao: "",
    dias2: "",
    tipoCond: "",
    dias3: "",
    padrao: false,
    automatica: false,
  });

  /* ================= Handlers ================= */
  const handleChange = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [field]: value });
  };

  const handleGridSelect = (row, idx) => {
    setSelecionado(idx);
    setForm({ ...row });
  };

  const handleLimpar = () => {
    setForm({
      codigo: "",
      tipo: "",
      dias1: "",
      descricao: "",
      dias2: "",
      tipoCond: "",
      dias3: "",
      padrao: false,
      automatica: false,
    });
    setSelecionado(null);
  };

  const handleIncluir = () => {
    if (!form.codigo) {
      alert("Informe o Código!");
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
        CONDIÇÃO DE PAGAMENTO
      </h1>

      {/* Conteúdo */}
      <div className="flex-1 p-3 overflow-y-auto bg-white border-x border-b border-gray-300 rounded-b-md flex flex-col gap-3">

        {/* ================= CARD 1 ================= */}
        <fieldset className="border border-gray-300 rounded p-3 bg-white">
          <legend className="text-red-700 font-semibold text-[13px] px-2">
            Parâmetros
          </legend>

          <div className="space-y-2">

            {/* Linha 1 */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-2">Código</Label>
              <Txt
                className="col-span-1"
                value={form.codigo}
                onChange={handleChange("codigo")}
              />

              <Label className="col-span-1">Tipo</Label>
              <Sel
                className="col-span-2"
                value={form.tipo}
                onChange={handleChange("tipo")}
              >
                <option></option>
                {listaTipos.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </Sel>

              <Label className="col-span-2">Dias Pagamento 1</Label>
              <Txt
                className="col-span-2"
                value={form.dias1}
                onChange={handleChange("dias1")}
              />
            </div>

            {/* Linha 2 */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-2">Descrição</Label>
              <Sel
                className="col-span-4"
                value={form.descricao}
                onChange={handleChange("descricao")}
              >
                <option></option>
                {listaDescricao.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </Sel>

              <Label className="col-span-2">Dias Pagamento 2</Label>
              <Txt
                className="col-span-2"
                value={form.dias2}
                onChange={handleChange("dias2")}
              />
            </div>

            {/* Linha 3 */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-2">Tipo Cond.</Label>
              <Sel
                className="col-span-4"
                value={form.tipoCond}
                onChange={handleChange("tipoCond")}
              >
                <option></option>
                {listaTipoCond.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </Sel>

              <Label className="col-span-2">Dias Pagamento 3</Label>
              <Txt
                className="col-span-2"
                value={form.dias3}
                onChange={handleChange("dias3")}
              />
            </div>

            {/* Linha 4 – Flags */}
            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={form.padrao}
                  onChange={handleChange("padrao")}
                  className="accent-red-700"
                />
                Condição Padrão
              </label>

              <label className="col-span-3 flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={form.automatica}
                  onChange={handleChange("automatica")}
                  className="accent-red-700"
                />
                Condição Automática
              </label>
            </div>

          </div>
        </fieldset>

        {/* ================= CARD 2 - GRID ================= */}
        <fieldset className="border border-gray-300 rounded p-3 bg-white">
          <legend className="text-red-700 font-semibold text-[13px] px-2">
            Condições Cadastradas
          </legend>

          <div className="border border-gray-200 rounded max-h-[420px] overflow-y-auto">
            <table className="w-full text-[12px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1">Código</th>
                  <th className="border px-2 py-1">Descrição</th>
                  <th className="border px-2 py-1 text-center">Dias 1</th>
                  <th className="border px-2 py-1 text-center">Dias 2</th>
                  <th className="border px-2 py-1 text-center">Dias 3</th>
                  <th className="border px-2 py-1">Tipo</th>
                  <th className="border px-2 py-1 text-center">Padrão</th>
                  <th className="border px-2 py-1 text-center">Automática</th>
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
                    <td className="border px-2 py-1">{row.codigo}</td>
                    <td className="border px-2 py-1">{row.descricao}</td>
                    <td className="border px-2 py-1 text-center">{row.dias1}</td>
                    <td className="border px-2 py-1 text-center">{row.dias2}</td>
                    <td className="border px-2 py-1 text-center">{row.dias3}</td>
                    <td className="border px-2 py-1">{row.tipo}</td>
                    <td className="border px-2 py-1 text-center">{row.padrao ? "✔" : ""}</td>
                    <td className="border px-2 py-1 text-center">{row.automatica ? "✔" : ""}</td>
                  </tr>
                ))}
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
