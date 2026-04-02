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

/* ========== HELPERS ========== */
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

const onlyDigits = (v = "") => v.replace(/\D+/g, "");

const maskCEP = (v) =>
  onlyDigits(v)
    .slice(0, 8)
    .replace(/^(\d{5})(\d)/, "$1-$2");

/* ========== Buscar CEP (ViaCEP) ========== */
async function buscarCEP(cep, setForm) {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (!data.erro) {
      setForm((prev) => ({
        ...prev,
        cidade: data.localidade || "",
        uf: data.uf || "",
      }));
    }
  } catch (err) {
    console.log("Erro ao buscar CEP:", err);
  }
}

/* ========== MOCKS ========== */
const mockFeriados = [
  {
    data: "2025-07-09",
    tipo: "E", // E = Estadual, L = Local, N = Nacional
    descricao: "REVOLUÇÃO CONSTITUCIONALISTA DE 1932",
    cidade: "SÃO PAULO",
    uf: "SP",
    cep: "01000-000",
  },
];

/* ========== COMPONENTE PRINCIPAL ========== */
export default function Feriado({ open }) {
  const navigate = useNavigate();
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  const [feriados, setFeriados] = useState(mockFeriados);
  const [selecionado, setSelecionado] = useState(null);

  const [form, setForm] = useState({
    data: "",
    tipo: "L", // Default Local
    descricao: "",
    cep: "",
    cidade: "",
    uf: "",
  });

  /* ======= HANDLERS ======= */
  const handleChange = (field) => (e) => {
    let value = e.target.value;

    if (field === "cep") {
      value = maskCEP(value);
      const dig = onlyDigits(value);
      if (dig.length === 8) buscarCEP(dig, setForm);
    }

    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelecionarGrid = (row, idx) => {
    setSelecionado(idx);
    setForm({
      data: row.data,
      tipo: row.tipo,
      descricao: row.descricao,
      cep: row.cep,
      cidade: row.cidade,
      uf: row.uf,
    });
  };

  const handleLimpar = () => {
    setForm({
      data: "",
      tipo: "L",
      descricao: "",
      cep: "",
      cidade: "",
      uf: "",
    });
    setSelecionado(null);
  };

  const handleIncluir = () => {
    if (!form.data || !form.tipo || !form.descricao) {
      alert("Informe Data, Tipo e Descrição!");
      return;
    }

    setFeriados((prev) => [...prev, form]);
    handleLimpar();
  };

  const handleAlterar = () => {
    if (selecionado === null) {
      alert("Selecione um registro.");
      return;
    }

    setFeriados((prev) =>
      prev.map((item, idx) => (idx === selecionado ? form : item))
    );

    handleLimpar();
  };

  const handleExcluir = () => {
    if (selecionado === null) {
      alert("Selecione um registro.");
      return;
    }

    if (!window.confirm("Deseja excluir este feriado?")) return;

    setFeriados((prev) => prev.filter((_, idx) => idx !== selecionado));
    handleLimpar();
  };

  /* ========== RENDER ========== */
  return (
    <div
      className={`transition-all duration-300 mt-[44px] text-[13px] bg-gray-50
      h-[calc(100vh-56px)] flex flex-col
      ${open ? "ml-[192px]" : "ml-[56px]"}`}
    >
      {/* Título */}
      <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
        CADASTRO DE FERIADO
      </h1>

      {/* Conteúdo */}
      <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md overflow-y-auto flex flex-col gap-3">

        {/* CARD 1 - PARÂMETROS */}
        <fieldset className="border border-gray-300 rounded p-3 bg-white">
          <legend className="px-2 text-red-700 font-semibold text-[13px]">
            Parâmetros
          </legend>

          <div className="space-y-2">
            {/* Linha 1 */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-1">Data</Label>
              <Txt
                type="date"
                className="col-span-2"
                value={form.data}
                onChange={handleChange("data")}
              />

              <div className="col-span-9 flex items-center gap-4 pl-4">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    value="L"
                    checked={form.tipo === "L"}
                    onChange={handleChange("tipo")}
                    className="accent-red-700"
                  />
                  Local
                </label>

                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    value="E"
                    checked={form.tipo === "E"}
                    onChange={handleChange("tipo")}
                    className="accent-red-700"
                  />
                  Estadual
                </label>

                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    value="N"
                    checked={form.tipo === "N"}
                    onChange={handleChange("tipo")}
                    className="accent-red-700"
                  />
                  Nacional
                </label>
              </div>
            </div>

            {/* Linha 2 */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-1">Descrição</Label>
              <Txt
                className="col-span-11"
                value={form.descricao}
                onChange={handleChange("descricao")}
              />
            </div>

            {/* Linha 3 */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-2">CEP Ref.</Label>
              <Txt
                className="col-span-2"
                value={form.cep}
                onChange={handleChange("cep")}
                placeholder="00000-000"
              />

              <Label className="col-span-1">Cidade</Label>
              <Txt
                className="col-span-5 bg-gray-200"
                readOnly
                value={form.cidade}
              />

              <Label className="col-span-1">UF</Label>
              <Txt
                className="col-span-1 text-center bg-gray-200"
                readOnly
                value={form.uf}
              />
            </div>
          </div>
        </fieldset>

        {/* CARD 2 - GRID */}
        <fieldset className="border border-gray-300 rounded p-3 bg-white">
          <legend className="px-2 text-red-700 font-semibold text-[13px]">
            Feriados Cadastrados
          </legend>

          <div className="border rounded border-gray-200 max-h-[360px] overflow-y-auto">
            <table className="w-full text-[12px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1 w-[100px]">Data</th>
                  <th className="border px-2 py-1 w-[60px]">Tipo</th>
                  <th className="border px-2 py-1">Descrição</th>
                  <th className="border px-2 py-1">Cidade</th>
                  <th className="border px-2 py-1 w-[60px]">UF</th>
                </tr>
              </thead>
              <tbody>
                {feriados.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`cursor-pointer hover:bg-red-100 ${
                      selecionado === idx ? "bg-red-200" : ""
                    }`}
                    onClick={() => handleSelecionarGrid(row, idx)}
                  >
                    <td className="border px-2 py-1 text-center">
                      {row.data}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {row.tipo}
                    </td>
                    <td className="border px-2 py-1">{row.descricao}</td>
                    <td className="border px-2 py-1">{row.cidade}</td>
                    <td className="border px-2 py-1 text-center">
                      {row.uf}
                    </td>
                  </tr>
                ))}

                {feriados.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="border px-2 py-2 text-center text-gray-500"
                    >
                      Nenhum feriado cadastrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </fieldset>
      </div>

      {/* ========== Rodapé ========== */}
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
