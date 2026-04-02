// src/pages/ClienteGrupoEconomicoCNPJ.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  XCircle,
  RotateCcw,
  PlusCircle,
  Edit,
  Trash2
} from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

/* Helpers */
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
      className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full ${props.className || ""}`}
    />
  );
}

export default function ClienteGrupoEconomicoCNPJ({ open }) {
  const navigate = useNavigate();
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  /* ================= MOCK ================= */
  const mockRegistros = [
    { codigo: "001", cnpj: "02166389929", fantasia: "FELIPE FAVERSANI", cidade: "URAI" },
    { codigo: "001", cnpj: "02864417002090", fantasia: "HNK-CAXIAS", cidade: "CAXIAS" }
  ];

  const [lista, setLista] = useState(mockRegistros);
  const [editIndex, setEditIndex] = useState(null);

  const [dados, setDados] = useState({
    cnpj: "",
    nome: "",
  });

  /* ================= HANDLERS ================= */
  const limpar = () => {
    setDados({ cnpj: "", nome: "" });
    setEditIndex(null);
  };

  const incluir = () => {
    if (!dados.cnpj) return alert("Informe o CNPJ!");

    setLista([
      ...lista,
      {
        codigo: "001",
        cnpj: dados.cnpj,
        fantasia: dados.nome,
        cidade: "SP",
      },
    ]);

    limpar();
  };

  const alterar = () => {
    if (editIndex === null) return alert("Selecione um registro!");

    const nova = [...lista];
    nova[editIndex] = {
      codigo: "001",
      cnpj: dados.cnpj,
      fantasia: dados.nome,
      cidade: "SP",
    };

    setLista(nova);
    limpar();
  };

  const excluir = () => {
    if (editIndex === null) return alert("Selecione um registro!");
    setLista(lista.filter((_, i) => i !== editIndex));
    limpar();
  };

  const selecionar = (item, index) => {
    setEditIndex(index);
    setDados({ cnpj: item.cnpj, nome: item.fantasia });
  };

  return (
    <div
      className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 
      bg-gray-50 h-[calc(100vh-56px)] flex flex-col
      ${open ? "ml-[192px]" : "ml-[56px]"}`}
    >
      {/* ===== TÍTULO ===== */}
      <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
        CLIENTE – GRUPO ECONÔMICO
      </h1>

      {/* ===== CONTEÚDO PRINCIPAL ===== */}
      <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md overflow-y-auto">

        {/* ===== CARD GERAL ===== */}
        <div className="border border-gray-300 rounded p-3 bg-white flex flex-col gap-3">

          {/* ===== CARD 1 - PARÂMETROS ===== */}
          <fieldset className="border border-gray-300 rounded p-3">
            <legend className="px-2 text-red-700 font-semibold text-[13px]">
              Cliente
            </legend>

            <div className="grid grid-cols-12 gap-2">

              <Label className="col-span-2">CNPJ</Label>
              <Txt
                className="col-span-3"
                value={dados.cnpj}
                onChange={(e) => setDados({ ...dados, cnpj: e.target.value })}
              />

              <Label className="col-span-2 text-right">Razão Social</Label>
              <Txt
                className="col-span-5 bg-gray-200"
                readOnly
                value={dados.nome}
              />
            </div>
          </fieldset>

          {/* ===== GRID ===== */}
          <fieldset className="border border-gray-300 rounded p-3">
            <legend className="px-2 text-red-700 font-semibold text-[13px]">
              Registros Cadastrados
            </legend>

            <div className="border border-gray-300 rounded max-h-[350px] overflow-y-auto">
              <table className="w-full text-[12px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">Código</th>
                    <th className="border px-2 py-1">CNPJ</th>
                    <th className="border px-2 py-1">Fantasia</th>
                    <th className="border px-2 py-1">Cidade</th>
                  </tr>
                </thead>

                <tbody>
                  {lista.map((item, idx) => (
                    <tr
                      key={idx}
                      onClick={() => selecionar(item, idx)}
                      className={`cursor-pointer hover:bg-red-100 ${
                        editIndex === idx ? "bg-red-200" : ""
                      }`}
                    >
                      <td className="border px-2 py-1">{item.codigo}</td>
                      <td className="border px-2 py-1">{item.cnpj}</td>
                      <td className="border px-2 py-1">{item.fantasia}</td>
                      <td className="border px-2 py-1">{item.cidade}</td>
                    </tr>
                  ))}

                  {lista.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-3 text-gray-500">
                        Nenhum registro encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </fieldset>

        </div>
      </div>

      {/* ===== RODAPÉ ===== */}
      <div className="border-t border-gray-300 bg-white py-2 px-5 flex items-center gap-6">
        
        <button
          onClick={() => navigate(-1)}
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
