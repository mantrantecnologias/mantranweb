import { useState } from "react";
import {
  XCircle,
  RotateCcw,
  PlusCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

/* Helpers */
function Label({ children, col = 2 }) {
  return (
    <label className={`text-[12px] text-gray-700 col-span-${col}`}>
      {children}
    </label>
  );
}

function Txt({ col = 3, readOnly = false, className = "", ...rest }) {
  return (
    <input
      {...rest}
      readOnly={readOnly}
      className={`
        border border-gray-300 rounded px-1 py-[2px] h-[26px] 
        text-[13px] w-full col-span-${col}
        ${readOnly ? "bg-gray-200" : ""}
        ${className}
      `}
    />
  );
}

export default function Embalagem({ open }) {
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  // === MOCK ===
  const [lista, setLista] = useState([
    { codigo: "000", armazem: "S", descricao: "CAIXA DE PAPELAO PAP" },
    { codigo: "003", armazem: "N", descricao: "ROLO(S)" },
    { codigo: "010", armazem: "N", descricao: "BAG" },
    { codigo: "011", armazem: "N", descricao: "TESTE 011" },
    { codigo: "AMA", armazem: "N", descricao: "AMARRADO (S)" },
    { codigo: "BA", armazem: "N", descricao: "BALDE(S)" },
  ]);

  const [form, setForm] = useState({
    codigo: "",
    descricao: "",
    armazem: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const limpar = () => {
    setForm({
      codigo: "",
      descricao: "",
      armazem: false,
    });
  };

  const incluir = () => {
    if (!form.codigo || !form.descricao) {
      alert("Informe Código e Descrição.");
      return;
    }

    const novo = {
      codigo: form.codigo,
      descricao: form.descricao,
      armazem: form.armazem ? "S" : "N",
    };

    setLista((prev) => [...prev, novo]);
    limpar();
  };

  const alterar = () => {
    setLista((prev) =>
      prev.map((p) =>
        p.codigo === form.codigo
          ? {
              codigo: form.codigo,
              descricao: form.descricao,
              armazem: form.armazem ? "S" : "N",
            }
          : p
      )
    );
  };

  const excluir = () => {
    if (!form.codigo) return;

    setLista((prev) => prev.filter((p) => p.codigo !== form.codigo));
    limpar();
  };

  const selecionar = (item) => {
    setForm({
      codigo: item.codigo,
      descricao: item.descricao,
      armazem: item.armazem === "S",
    });
  };

  return (
    <div
      className={`transition-all duration-300 mt-[44px] text-[13px] bg-gray-50 h-[calc(100vh-56px)] flex flex-col ${
        open ? "ml-[192px]" : "ml-[56px]"
      }`}
    >
      {/* TÍTULO */}
      <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
        CADASTRO DE EMBALAGEM
      </h1>

      {/* CONTEÚDO */}
      <div className="flex-1 p-3 bg-white border-x border-b rounded-b-md overflow-y-auto flex flex-col gap-3">

        {/* CARD 1 */}
        <fieldset className="border border-gray-300 rounded p-3 bg-white">
          <legend className="text-red-700 font-semibold text-[13px] px-2">
            Parâmetros
          </legend>

          <div className="grid grid-cols-12 gap-2">

            {/* Linha 1 */}
            <Label col={1}>Código</Label>
            <Txt
              col={2}
              name="codigo"
              value={form.codigo}
              onChange={handleChange}
            />

            <Label col={1}>Descrição</Label>
            <Txt
              col={8}
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
            />

            {/* Linha 2 */}
            <div className="col-span-12 flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                name="armazem"
                checked={form.armazem}
                onChange={handleChange}
              />
              <span className="text-[12px]">Disponibilizar para o Armazém</span>
            </div>

          </div>
        </fieldset>

        {/* CARD 2 - GRID */}
        <fieldset className="border border-gray-300 rounded p-3 bg-white">
          <legend className="text-red-700 font-semibold text-[13px] px-2">
            Embalagens
          </legend>

          <div className="border border-gray-300 rounded max-h-[360px] overflow-y-auto">
            <table className="w-full text-[12px]">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="border px-2 py-1">Cód. Embalagem</th>
                  <th className="border px-2 py-1">Armazém</th>
                  <th className="border px-2 py-1">Descrição</th>
                </tr>
              </thead>

              <tbody>
                {lista.map((p, idx) => (
                  <tr
                    key={idx}
                    onClick={() => selecionar(p)}
                    className="cursor-pointer hover:bg-red-100"
                  >
                    <td className="border px-2 py-1">{p.codigo}</td>
                    <td className="border px-2 py-1 text-center">{p.armazem}</td>
                    <td className="border px-2 py-1">{p.descricao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </fieldset>
      </div>

      {/* RODAPÉ */}
      <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">

        <button
          onClick={() => window.history.back()}
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <XCircle size={20} />
          <span>Fechar</span>
        </button>

        <button
          onClick={limpar}
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <RotateCcw size={20} />
          <span>Limpar</span>
        </button>

        <button
          onClick={incluir}
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <PlusCircle size={20} />
          <span>Incluir</span>
        </button>

        <button
          onClick={alterar}
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <Edit size={20} />
          <span>Alterar</span>
        </button>

        <button
          onClick={excluir}
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <Trash2 size={20} />
          <span>Excluir</span>
        </button>

      </div>
    </div>
  );
}
