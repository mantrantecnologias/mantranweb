// src/pages/ClienteProduto.jsx
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
      className={`border border-gray-300 rounded px-1 py-[2px] 
      h-[26px] text-[13px] w-full ${props.className || ""}`}
    />
  );
}

function Sel({ children, className = "", ...rest }) {
  return (
    <select
      {...rest}
      className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] 
      text-[13px] w-full ${className}`}
    >
      {children}
    </select>
  );
}

export default function ClienteProduto({ open }) {
  const navigate = useNavigate();
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  /* ============== MOCK ============== */
  const mockRegistros = [
    {
      cnpj: "03878945000101",
      fantasia: "STOLLE MACHINERY",
      prod1: "222025177",
      descricao: "MÓDULO DE COMUNICAÇÃO ETHERNET"
    },
    {
      cnpj: "04066162000183",
      fantasia: "RODOMAGO TRANSPORTES",
      prod1: "AB1234",
      descricao: "CABO DE ENERGIA"
    }
  ];

  const [lista, setLista] = useState(mockRegistros);
  const [editIndex, setEditIndex] = useState(null);

  const [dados, setDados] = useState({
    cnpj: "",
    nome: "",
    tipoProduto: "",
    prod1: "",
    descricao: "",
    prod2: "",
    modelo: ""
  });

  /* ============== Funções básicas ============== */

  const limpar = () => {
    setDados({
      cnpj: "",
      nome: "",
      tipoProduto: "",
      prod1: "",
      descricao: "",
      prod2: "",
      modelo: ""
    });
    setEditIndex(null);
  };

  const incluir = () => {
    if (!dados.cnpj || !dados.prod1)
      return alert("Informe CNPJ e Código Produto (1)");

    setLista([
      ...lista,
      {
        cnpj: dados.cnpj,
        fantasia: dados.nome,
        prod1: dados.prod1,
        descricao: dados.descricao
      }
    ]);

    limpar();
  };

  const alterar = () => {
    if (editIndex === null) return alert("Selecione um registro!");

    const nova = [...lista];
    nova[editIndex] = {
      cnpj: dados.cnpj,
      fantasia: dados.nome,
      prod1: dados.prod1,
      descricao: dados.descricao
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
    setDados({
      cnpj: item.cnpj,
      nome: item.fantasia,
      tipoProduto: "",
      prod1: item.prod1,
      descricao: item.descricao,
      prod2: "",
      modelo: ""
    });
  };

  /* ============== RENDER ============== */

  return (
    <div
      className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 
      bg-gray-50 h-[calc(100vh-56px)] flex flex-col
      ${open ? "ml-[192px]" : "ml-[56px]"}`}
    >

      {/* ===== TÍTULO ===== */}
      <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
        CLIENTE – PRODUTO
      </h1>

      {/* ===== CONTEÚDO ===== */}
      <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md overflow-y-auto">

        {/* ===== CARD GERAL ===== */}
        <div className="border border-gray-300 rounded p-3 bg-white flex flex-col gap-3">

          {/* ===== CARD 1 ===== */}
          <fieldset className="border border-gray-300 rounded p-3">
            <legend className="px-2 text-red-700 font-semibold text-[13px]">
              Parâmetros
            </legend>

            {/* Linha 1 */}
            <div className="grid grid-cols-12 gap-2 mb-2">
              <Label className="col-span-2">Cliente</Label>
              <Txt
                className="col-span-3"
                value={dados.cnpj}
                onChange={(e) => setDados({ ...dados, cnpj: e.target.value })}
              />
              <Txt
                className="col-span-7 bg-gray-200"
                readOnly
                value={dados.nome}
              />
            </div>

            {/* Linha 2 */}
            <div className="grid grid-cols-12 gap-2 mb-2">
              <Label className="col-span-2">Código Produto</Label>
              <Sel
                className="col-span-3"
                value={dados.tipoProduto}
                onChange={(e) => setDados({ ...dados, tipoProduto: e.target.value })}
              >
                <option></option>
                <option>Diversos</option>
                <option>Cabos</option>
                <option>Bebidas</option>
              </Sel>
            </div>

            {/* Linha 3 */}
            <div className="grid grid-cols-12 gap-2 mb-2">
              <Label className="col-span-2">Código Produto (1)</Label>
              <Txt
                className="col-span-3"
                value={dados.prod1}
                onChange={(e) => setDados({ ...dados, prod1: e.target.value })}
              />

              <Label className="col-span-2">Descrição Produto</Label>
              <Txt
                className="col-span-5"
                value={dados.descricao}
                onChange={(e) => setDados({ ...dados, descricao: e.target.value })}
              />
            </div>

            {/* Linha 4 */}
            <div className="grid grid-cols-12 gap-2">
              <Label className="col-span-2">Código Produto (2)</Label>
              <Txt
                className="col-span-3"
                value={dados.prod2}
                onChange={(e) => setDados({ ...dados, prod2: e.target.value })}
              />

              <Label className="col-span-2">Modelo Produto</Label>
              <Txt
                className="col-span-5"
                value={dados.modelo}
                onChange={(e) => setDados({ ...dados, modelo: e.target.value })}
              />
            </div>
          </fieldset>

          {/* ===== CARD 2 - GRID ===== */}
          <fieldset className="border border-gray-300 rounded p-3">
            <legend className="px-2 text-red-700 font-semibold text-[13px]">
              Produtos Cadastrados
            </legend>

            <div className="border border-gray-300 rounded max-h-[350px] overflow-y-auto">
              <table className="w-full text-[12px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">CGC/CPF</th>
                    <th className="border px-2 py-1">Fantasia</th>
                    <th className="border px-2 py-1">Cod. Produto 1</th>
                    <th className="border px-2 py-1">Descrição</th>
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
                      <td className="border px-2 py-1">{item.cnpj}</td>
                      <td className="border px-2 py-1">{item.fantasia}</td>
                      <td className="border px-2 py-1">{item.prod1}</td>
                      <td className="border px-2 py-1">{item.descricao}</td>
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
