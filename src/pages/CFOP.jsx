// src/pages/CFOP.jsx
import { useState } from "react";
import { XCircle, RotateCcw, PlusCircle, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIconColor } from "../context/IconColorContext";

function Label({ children, className = "" }) {
  return <label className={`text-[12px] text-gray-700 ${className}`}>{children}</label>;
}

function Txt({ className = "", ...rest }) {
  return (
    <input
      {...rest}
      className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full ${className}`}
    />
  );
}

function Sel({ children, className = "", ...rest }) {
  return (
    <select
      {...rest}
      className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full ${className}`}
    >
      {children}
    </select>
  );
}

function TxtArea({ className = "", ...rest }) {
  return (
    <textarea
      {...rest}
      rows={3}
      className={`border border-gray-300 rounded px-1 py-1 text-[13px] w-full resize-none ${className}`}
    />
  );
}

// Mock inicial — depois trocar por backend
const cstList = [
  "00 - Tributada integralmente",
  "20 - Com redução de base",
  "40 - Isenta",
  "41 - Não tributada",
  "60 - Substituição tributária",
];

const cfopCompraList = [
  "1101 - COMPRA PARA INDUSTRIALIZAÇÃO",
  "2101 - COMPRA PARA COMERCIALIZAÇÃO",
  "1403 - DEVOLUÇÃO",
];

export default function CFOP({ open }) {
  const navigate = useNavigate();
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  const [selecionado, setSelecionado] = useState(null);

  const [param, setParam] = useState({
    cfop: "",
    descricao: "",
    msgCfop: "",
    msgCfopEx: "",
    cst: "",
    cfopCompra: "",
    icms: false,
    iss: false,
    subcontratado: false,
  });

  // MOCK TEMPORÁRIO
  const [lista, setLista] = useState([
    {
      cfop: "5353",
      descricao: "PREST DE SERV DE TRANSPORTES A ESTABELECIMENTO COM",
      msgCfop: "ICMS ISENTO EXPORTACAO",
      msgCfopEx: "ISENCAO DE ICMS DO SERVICO DE TRANSPORTE ART. 149, IV",
      cst: "00",
      cfopCompra: "1101",
      icms: true,
      iss: false,
      subcontratado: false,
    },
    {
      cfop: "5352",
      descricao: "PREST DE SERV DE TRANSPORTES DIVERSOS",
      msgCfop: "ICMS ISENTO EXPORTACAO",
      msgCfopEx: "",
      cst: "41",
      cfopCompra: "2101",
      icms: false,
      iss: true,
      subcontratado: false,
    },
  ]);

  // Filtra grid conforme digita
  const listaFiltrada = lista.filter((l) =>
    param.cfop ? l.cfop.startsWith(param.cfop) : true
  );

  // Seleciona linha e carrega parâmetros
  const selecionarLinha = (l, index) => {
    setSelecionado(index);
    setParam({
      cfop: l.cfop,
      descricao: l.descricao,
      msgCfop: l.msgCfop,
      msgCfopEx: l.msgCfopEx,
      cst: l.cst,
      cfopCompra: l.cfopCompra,
      icms: l.icms,
      iss: l.iss,
      subcontratado: l.subcontratado,
    });
  };

  // Pressionar Enter no CFOP -> pesquisa
  const handleCFOPEnter = (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      const encontrado = lista.find((l) => l.cfop === param.cfop);
      if (encontrado) {
        selecionarLinha(encontrado, lista.indexOf(encontrado));
      }
    }
  };

  // CRUD
  const limpar = () => {
    setSelecionado(null);
    setParam({
      cfop: "",
      descricao: "",
      msgCfop: "",
      msgCfopEx: "",
      cst: "",
      cfopCompra: "",
      icms: false,
      iss: false,
      subcontratado: false,
    });
  };

  const incluir = () => {
    const novo = { ...param };
    setLista([...lista, novo]);
    limpar();
  };

  const alterar = () => {
    if (selecionado === null) return alert("Selecione um registro!");
    const copia = [...lista];
    copia[selecionado] = { ...param };
    setLista(copia);
    limpar();
  };

  const excluir = () => {
    if (selecionado === null) return alert("Selecione um registro!");
    const copia = lista.filter((_, i) => i !== selecionado);
    setLista(copia);
    limpar();
  };

  return (
    <div
      className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 bg-gray-50 h-[calc(100vh-56px)] flex flex-col ${
        open ? "ml-[192px]" : "ml-[56px]"
      }`}
    >
      {/* Título */}
      <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
        CADASTRO DE CFOP
      </h1>

      <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 overflow-y-auto flex flex-col gap-3">

        {/* CARD PARÂMETROS */}
        <fieldset className="border rounded-md p-3">
          <legend className="px-2 text-red-700 font-semibold text-[12px]">Parâmetros</legend>

          {/* Linha 1 */}
          <div className="grid grid-cols-12 gap-2 items-center">
            <Label className="col-span-2">CFOP</Label>
            <Txt
              className="col-span-2"
              value={param.cfop}
              onChange={(e) => setParam({ ...param, cfop: e.target.value })}
              onKeyDown={handleCFOPEnter}
            />

            <Label className="col-span-2">Descrição</Label>
            <Txt
              className="col-span-6"
              value={param.descricao}
              onChange={(e) => setParam({ ...param, descricao: e.target.value })}
            />
          </div>

          {/* Linha 2 */}
          <div className="grid grid-cols-12 gap-2 items-center mt-2">
            <Label className="col-span-2">Mensagem CFOP</Label>
            <TxtArea
              className="col-span-10"
              value={param.msgCfop}
              onChange={(e) => setParam({ ...param, msgCfop: e.target.value })}
            />
          </div>

          {/* Linha 3 */}
          <div className="grid grid-cols-12 gap-2 items-center mt-2">
            <Label className="col-span-2">Mensagem CFOP EX</Label>
            <TxtArea
              className="col-span-10"
              value={param.msgCfopEx}
              onChange={(e) => setParam({ ...param, msgCfopEx: e.target.value })}
            />
          </div>

          {/* Linha 4 */}
          <div className="grid grid-cols-12 gap-2 items-center mt-2">
            <Label className="col-span-2">CST</Label>
            <Sel
              className="col-span-4"
              value={param.cst}
              onChange={(e) => setParam({ ...param, cst: e.target.value })}
            >
              <option value=""></option>
              {cstList.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Sel>
          </div>

          {/* Linha 5 */}
          <div className="grid grid-cols-12 gap-2 items-center mt-2">
            <Label className="col-span-2">CFOP Compras</Label>
            <Sel
              className="col-span-6"
              value={param.cfopCompra}
              onChange={(e) => setParam({ ...param, cfopCompra: e.target.value })}
            >
              <option value=""></option>
              {cfopCompraList.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Sel>
          </div>

          {/* Linha 6 */}
          <div className="grid grid-cols-12 gap-4 items-center mt-2">
            <label className="col-span-2 flex items-center gap-1 text-[12px]">
              <input
                type="checkbox"
                checked={param.icms}
                onChange={(e) => setParam({ ...param, icms: e.target.checked })}
              />
              ICMS
            </label>

            <label className="col-span-2 flex items-center gap-1 text-[12px]">
              <input
                type="checkbox"
                checked={param.iss}
                onChange={(e) => setParam({ ...param, iss: e.target.checked })}
              />
              ISS
            </label>

            <label className="col-span-4 flex items-center gap-1 text-[12px]">
              <input
                type="checkbox"
                checked={param.subcontratado}
                onChange={(e) =>
                  setParam({ ...param, subcontratado: e.target.checked })
                }
              />
              CFOP para Operações com SubContratado
            </label>
          </div>
        </fieldset>

        {/* GRID */}
        <div className="border rounded-md overflow-y-auto max-h-[380px]">
          <table className="w-full text-[12px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Código</th>
                <th className="border px-2 py-1">Descrição</th>
                <th className="border px-2 py-1">Mensag. CFOP</th>
                <th className="border px-2 py-1">Mensag. CFOP EX</th>
                <th className="border px-2 py-1">Cód. CFOP Compras</th>
                <th className="border px-2 py-1">ICMS</th>
                <th className="border px-2 py-1">ISS</th>
              </tr>
            </thead>
            <tbody>
              {listaFiltrada.map((l, index) => (
                <tr
                  key={index}
                  className={`cursor-pointer hover:bg-red-100 ${
                    selecionado === index ? "bg-red-200" : ""
                  }`}
                  onClick={() => selecionarLinha(l, index)}
                >
                  <td className="border px-2 py-1">{l.cfop}</td>
                  <td className="border px-2 py-1">{l.descricao}</td>
                  <td className="border px-2 py-1">{l.msgCfop}</td>
                  <td className="border px-2 py-1">{l.msgCfopEx}</td>
                  <td className="border px-2 py-1">{l.cfopCompra}</td>
                  <td className="border px-2 py-1 text-center">{l.icms ? "✔" : ""}</td>
                  <td className="border px-2 py-1 text-center">{l.iss ? "✔" : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* RODAPÉ */}
      <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">

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
