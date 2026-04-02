// src/pages/ClienteDivisao.jsx
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
const mockDivisoes = [
  { codigo: "0001", nome: "LOGGI", flObs: "N", rateio: "", obsCte: "", carac: "" },
  { codigo: "0002", nome: "IMILES", flObs: "N", rateio: "", obsCte: "", carac: "" },
  { codigo: "0003", nome: "SHOPEE", flObs: "N", rateio: "", obsCte: "", carac: "" },
  { codigo: "0004", nome: "REFRIGERADO", flObs: "N", rateio: "", obsCte: "", carac: "" },
  { codigo: "0005", nome: "CLIENTE TESTE", flObs: "S", rateio: "", obsCte: "", carac: "REENTREGA, DEVOLUÇÃO" },
];

/* ================= Componente Principal ================= */
export default function ClienteDivisao({ open }) {
  const navigate = useNavigate();
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  const [lista, setLista] = useState(mockDivisoes);
  const [selecionado, setSelecionado] = useState(null);

  const [form, setForm] = useState({
    codigo: "",
    nome: "",
    flObs: "",
    rateio: false,
    obsCte: "",
    carac: "",
    regiao: "",
    complemento: false,
  });

  /* ================= Handlers ================= */
  const handleChange = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setForm({ ...form, [field]: value });
  };

  const handleGridSelect = (row, idx) => {
    setSelecionado(idx);
    setForm({
      codigo: row.codigo,
      nome: row.nome,
      flObs: row.flObs === "S",
      rateio: row.rateio === "S",
      obsCte: row.obsCte,
      carac: row.carac,
      regiao: row.regiao || "",
      complemento: row.complemento === "S",
    });
  };

  const handleLimpar = () => {
    setForm({
      codigo: "",
      nome: "",
      flObs: false,
      rateio: false,
      obsCte: "",
      carac: "",
      regiao: "",
      complemento: false,
    });
    setSelecionado(null);
  };

  const handleIncluir = () => {
    if (!form.codigo || !form.nome) {
      alert("Informe Código e Nome.");
      return;
    }

    setLista((prev) => [
      ...prev,
      {
        codigo: form.codigo,
        nome: form.nome,
        flObs: form.flObs ? "S" : "N",
        rateio: form.rateio ? "S" : "N",
        obsCte: form.obsCte,
        carac: form.carac,
        regiao: form.regiao,
        complemento: form.complemento ? "S" : "N",
      },
    ]);

    handleLimpar();
  };

  const handleAlterar = () => {
    if (selecionado === null) return alert("Selecione um registro.");

    const atualizado = {
      codigo: form.codigo,
      nome: form.nome,
      flObs: form.flObs ? "S" : "N",
      rateio: form.rateio ? "S" : "N",
      obsCte: form.obsCte,
      carac: form.carac,
      regiao: form.regiao,
      complemento: form.complemento ? "S" : "N",
    };

    setLista((prev) =>
      prev.map((item, idx) => (idx === selecionado ? atualizado : item))
    );

    handleLimpar();
  };

  const handleExcluir = () => {
    if (selecionado === null) return alert("Selecione um registro.");
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
        DIVISÃO EMPRESARIAL
      </h1>

      {/* Conteúdo */}
      <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md overflow-y-auto">
        {/* 🔳 Card Geral englobando os 2 cards */}
        <div className="border border-gray-300 rounded p-3 bg-white flex flex-col gap-3">

          {/* ================= CARD 1 - PARÂMETROS ================= */}
          <fieldset className="border border-gray-300 rounded p-3 bg-white">
            <legend className="text-red-700 font-semibold text-[13px] px-2">
              Parâmetros
            </legend>

            <div className="space-y-2">
              {/* Linha 1 */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-2">Código</Label>
                <Txt
                  className="col-span-2"
                  value={form.codigo}
                  onChange={handleChange("codigo")}
                />

                <Label className="col-span-2">Divisão Rateio</Label>
                <input
                  type="checkbox"
                  className="col-span-1 accent-red-700"
                  checked={form.rateio}
                  onChange={handleChange("rateio")}
                />

                <Label className="col-span-3">Mostrar Compl. CTe</Label>
                <input
                  type="checkbox"
                  className="col-span-1 accent-red-700"
                  checked={form.complemento}
                  onChange={handleChange("complemento")}
                />
              </div>

              {/* Linha 2 */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-2">Nome</Label>
                <Txt
                  className="col-span-6"
                  value={form.nome}
                  onChange={handleChange("nome")}
                />
              </div>

              {/* Linha 3 */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-2">Observação</Label>
                <Txt
                  className="col-span-8"
                  value={form.obsCte}
                  onChange={handleChange("obsCte")}
                />
              </div>

              {/* Linha 4 */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-3">Características Adicionais</Label>
                <Txt
                  className="col-span-7"
                  value={form.carac}
                  onChange={handleChange("carac")}
                />
              </div>

              {/* Linha 5 */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-3">Região Divisão</Label>
                <Sel
                  className="col-span-4"
                  value={form.regiao}
                  onChange={handleChange("regiao")}
                >
                  <option></option>
                  <option>Sudeste</option>
                  <option>Nordeste</option>
                  <option>Sul</option>
                </Sel>
              </div>
            </div>
          </fieldset>

          {/* ================= CARD 2 - GRID ================= */}
          <fieldset className="border border-gray-300 rounded p-3 bg-white">
            <legend className="text-red-700 font-semibold text-[13px] px-2">
              Divisões Cadastradas
            </legend>

            <div className="border border-gray-200 rounded max-h-[320px] overflow-y-auto">
              <table className="w-full text-[12px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">Código</th>
                    <th className="border px-2 py-1">Nome</th>
                    <th className="border px-2 py-1">FL Obs</th>
                    <th className="border px-2 py-1">Rateio</th>
                    <th className="border px-2 py-1">Obs CTe</th>
                    <th className="border px-2 py-1">Carac</th>
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
                      <td className="border px-2 py-1">{row.nome}</td>
                      <td className="border px-2 py-1 text-center">{row.flObs}</td>
                      <td className="border px-2 py-1 text-center">{row.rateio}</td>
                      <td className="border px-2 py-1">{row.obsCte}</td>
                      <td className="border px-2 py-1">{row.carac}</td>
                    </tr>
                  ))}

                  {lista.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="border px-2 py-2 text-center text-gray-500"
                      >
                        Nenhuma divisão cadastrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </fieldset>
        </div>
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
