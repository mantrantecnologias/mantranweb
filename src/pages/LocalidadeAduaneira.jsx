// src/pages/LocalidadeAduaneira.jsx
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

function Sel({ children, className = "", ...rest }) {
  return (
    <select
      {...rest}
      className={
        "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full " +
        className
      }
    >
      {children}
    </select>
  );
}

/* ========================= Mocks ========================= */
const mockLocalidades = [
  {
    codigo: "001",
    tipo: "MAR",
    descricao: "LIBRA PORT",
    endereco: "RUA TESTE 123",
  },
  {
    codigo: "002",
    tipo: "MAR",
    descricao: "SANTOS BRASIL PARTICIPAÇÕES",
    endereco: "Avenida Marginal Via Anchieta, 820, Alemoa - Santos",
  },
  {
    codigo: "003",
    tipo: "MAR",
    descricao: "RODIMAR",
    endereco: "END RODIMAR",
  },
];

/* ========================= Component ========================= */

const initialForm = {
  codigo: "",
  tipo: "Marítima",
  descricao: "",
  endereco: "",
};

export default function LocalidadeAduaneira({ open }) {
  const navigate = useNavigate();
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  const [form, setForm] = useState(initialForm);
  const [lista, setLista] = useState(mockLocalidades);
  const [selecionado, setSelecionado] = useState(null);

  /* ========================= Handlers ========================= */

  const gerarNovoCodigo = () => {
    if (lista.length === 0) return "001";
    const ult = lista[lista.length - 1].codigo;
    const num = parseInt(ult) + 1;
    return num.toString().padStart(3, "0");
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleGridSelect = (row, index) => {
    setSelecionado(index);
    setForm({
      codigo: row.codigo,
      tipo: row.tipo,
      descricao: row.descricao,
      endereco: row.endereco,
    });
  };

  const handleLimpar = () => {
    setForm(initialForm);
    setSelecionado(null);
  };

  const handleIncluir = () => {
    if (!form.descricao) {
      alert("Informe a descrição.");
      return;
    }

    const novo = {
      codigo: gerarNovoCodigo(),
      tipo: form.tipo,
      descricao: form.descricao,
      endereco: form.endereco,
    };

    setLista((prev) => [...prev, novo]);
    handleLimpar();
  };

  const handleAlterar = () => {
    if (selecionado === null) {
      alert("Selecione um registro para alterar.");
      return;
    }

    const atualizado = {
      codigo: form.codigo,
      tipo: form.tipo,
      descricao: form.descricao,
      endereco: form.endereco,
    };

    setLista((prev) =>
      prev.map((item, idx) => (idx === selecionado ? atualizado : item))
    );

    handleLimpar();
  };

  const handleExcluir = () => {
    if (selecionado === null) {
      alert("Selecione um registro para excluir.");
      return;
    }

    if (!window.confirm("Confirma a exclusão?")) return;

    setLista((prev) => prev.filter((_, idx) => idx !== selecionado));
    handleLimpar();
  };

  /* ========================= Render ========================= */

  return (
    <div
      className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 bg-gray-50 h-[calc(100vh-56px)] flex flex-col ${
        open ? "ml-[192px]" : "ml-[56px]"
      }`}
    >
      {/* Título */}
      <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
        CADASTRO DE LOCALIDADE ADUANEIRA
      </h1>

      {/* Conteúdo */}
      <div className="flex-1 p-3 bg-white border-x border-b border-gray-200 rounded-b-md overflow-y-auto flex flex-col gap-3">

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
                className="col-span-2 bg-gray-200 text-center"
                value={form.codigo}
                readOnly
              />

              <Label className="col-span-2">Tipo Localidade</Label>
              <Sel
                className="col-span-3"
                value={form.tipo}
                onChange={handleChange("tipo")}
              >
                <option>Marítima</option>
                <option>Aérea</option>
                <option>Rodoviária</option>
                <option>Ferroviária</option>
              </Sel>
            </div>

            {/* Linha 2 */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-2">Descrição</Label>
              <Txt
                className="col-span-10"
                value={form.descricao}
                onChange={handleChange("descricao")}
              />
            </div>

            {/* Linha 3 */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-2">Endereço</Label>
              <Txt
                className="col-span-10"
                value={form.endereco}
                onChange={handleChange("endereco")}
              />
            </div>
          </div>
        </fieldset>

        {/* ================= CARD 2 ================= */}
        <fieldset className="border border-gray-300 rounded p-3 bg-white">
          <legend className="text-red-700 font-semibold text-[13px] px-2">
            Localidades Aduaneiras
          </legend>

          <div className="border border-gray-200 rounded max-h-[360px] overflow-y-auto">
            <table className="w-full text-[12px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1">Código</th>
                  <th className="border px-2 py-1">Tipo</th>
                  <th className="border px-2 py-1">Descrição</th>
                  <th className="border px-2 py-1">Endereço</th>
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
                    <td className="border px-2 py-1 text-center">
                      {row.codigo}
                    </td>
                    <td className="border px-2 py-1">{row.tipo}</td>
                    <td className="border px-2 py-1">{row.descricao}</td>
                    <td className="border px-2 py-1">{row.endereco}</td>
                  </tr>
                ))}

                {lista.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="border px-2 py-3 text-center text-gray-500"
                    >
                      Nenhuma localidade cadastrada.
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
