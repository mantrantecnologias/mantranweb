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

export default function ProdutoPredominante({ open }) {
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  // === MOCK ===
  const [lista, setLista] = useState([
    { codigo: "001", descricao: "Grãos (soja, milho, trigo)", ncm: "10059010" },
    { codigo: "002", descricao: "Farelo de soja", ncm: "23040010" },
    { codigo: "003", descricao: "Cimento Portland", ncm: "25232900" },
    { codigo: "004", descricao: "Areia e brita", ncm: "25051000" },
    { codigo: "005", descricao: "Cal e gesso", ncm: "25222000" },
    { codigo: "006", descricao: "Combustíveis (diesel, gasolina)", ncm: "27101932" },
  ]);

  const [form, setForm] = useState({
    codigo: "",
    descricao: "",
    ncm: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const limpar = () => {
    setForm({
      codigo: "",
      descricao: "",
      ncm: "",
    });
  };

  const incluir = () => {
    if (!form.codigo || !form.descricao || !form.ncm) {
      alert("Informe todos os campos.");
      return;
    }

    const novo = {
      codigo: form.codigo,
      descricao: form.descricao,
      ncm: form.ncm,
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
              ncm: form.ncm,
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
      ncm: item.ncm,
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
        CADASTRO DE PRODUTO PREDOMINANTE
      </h1>

      {/* CONTEÚDO */}
      <div className="flex-1 p-3 bg-white border-x border-b rounded-b-md overflow-y-auto flex flex-col gap-3">

        {/* CARD 1 – PARÂMETROS */}
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
            <Label col={1}>NCM</Label>
            <Txt
              col={2}
              name="ncm"
              value={form.ncm}
              onChange={handleChange}
            />
          </div>
        </fieldset>

        {/* CARD 2 – GRID */}
        <fieldset className="border border-gray-300 rounded p-3 bg-white">
          <legend className="text-red-700 font-semibold text-[13px] px-2">
            Produtos Predominantes
          </legend>

          <div className="border border-gray-300 rounded max-h-[360px] overflow-y-auto">
            <table className="w-full text-[12px]">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="border px-2 py-1 w-20">Cód. Produto</th>
                  <th className="border px-2 py-1">Descrição</th>
                  <th className="border px-2 py-1 w-28">NCM</th>
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
                    <td className="border px-2 py-1">{p.descricao}</td>
                    <td className="border px-2 py-1">{p.ncm}</td>
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
