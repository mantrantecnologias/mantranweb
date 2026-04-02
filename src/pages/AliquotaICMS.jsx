// src/pages/AliquotaICMS.jsx
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

// Todas UFs do Brasil
const UFs = [
  "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO",
  "MA", "MG", "MS", "MT", "PA", "PB", "PE", "PI",
  "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO"
];

export default function AliquotaICMS({ open }) {
  const navigate = useNavigate();
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  // Estado dos parâmetros
  const [param, setParam] = useState({
    ufOrigem: "",
    ufDestino: "",
    aliqInterestadual: "",
    aliqEstadual: "",
    fcb: "",
  });

  // Lista inicial MOCK – substituir depois pelo backend
  const [lista, setLista] = useState([
    { ufOrigem: "SP", ufDestino: "AC", aliqInt: "7,00", aliqEst: "0,00", fcb: "0,00" },
    { ufOrigem: "SP", ufDestino: "AL", aliqInt: "7,00", aliqEst: "0,00", fcb: "0,00" },
    { ufOrigem: "SP", ufDestino: "AM", aliqInt: "7,00", aliqEst: "0,00", fcb: "0,00" },
    { ufOrigem: "SP", ufDestino: "BA", aliqInt: "7,00", aliqEst: "0,00", fcb: "0,00" },
  ]);

  const [selecionado, setSelecionado] = useState(null);

  // Filtro da grid
  const listaFiltrada = lista.filter((l) => {
    const origemOK = param.ufOrigem ? l.ufOrigem === param.ufOrigem : true;
    const destinoOK = param.ufDestino ? l.ufDestino === param.ufDestino : true;
    return origemOK && destinoOK;
  });

  // Selecionar linha e carregar parâmetros
  const selecionarLinha = (l, index) => {
    setSelecionado(index);
    setParam({
      ufOrigem: l.ufOrigem,
      ufDestino: l.ufDestino,
      aliqInterestadual: l.aliqInt,
      aliqEstadual: l.aliqEst,
      fcb: l.fcb,
    });
  };

  // Funções CRUD
  const limpar = () => {
    setSelecionado(null);
    setParam({
      ufOrigem: "",
      ufDestino: "",
      aliqInterestadual: "",
      aliqEstadual: "",
      fcb: "",
    });
  };

  const incluir = () => {
    const novo = {
      ufOrigem: param.ufOrigem,
      ufDestino: param.ufDestino,
      aliqInt: param.aliqInterestadual,
      aliqEst: param.aliqEstadual,
      fcb: param.fcb,
    };
    setLista([...lista, novo]);
    limpar();
  };

  const alterar = () => {
    if (selecionado === null) return alert("Selecione um registro!");
    const copia = [...lista];
    copia[selecionado] = {
      ufOrigem: param.ufOrigem,
      ufDestino: param.ufDestino,
      aliqInt: param.aliqInterestadual,
      aliqEst: param.aliqEstadual,
      fcb: param.fcb,
    };
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
      {/* TÍTULO */}
      <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
        ALÍQUOTA DE ICMS
      </h1>

      {/* CONTEÚDO */}
      <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 overflow-y-auto flex flex-col gap-3">

        {/* CARD PARÂMETROS */}
        <fieldset className="border rounded-md p-3">
          <legend className="px-2 text-red-700 font-semibold text-[12px]">Parâmetros</legend>

          {/* Linha 1 */}
          <div className="grid grid-cols-12 gap-2 items-center">
            <Label className="col-span-2">UF Origem</Label>
            <Sel
              className="col-span-4"
              value={param.ufOrigem}
              onChange={(e) => setParam({ ...param, ufOrigem: e.target.value })}
            >
              <option value=""></option>
              {UFs.map((u) => <option key={u}>{u}</option>)}
            </Sel>

            <Label className="col-span-2">UF Destino</Label>
            <Sel
              className="col-span-4"
              value={param.ufDestino}
              onChange={(e) => setParam({ ...param, ufDestino: e.target.value })}
            >
              <option value=""></option>
              {UFs.map((u) => <option key={u}>{u}</option>)}
            </Sel>
          </div>

          {/* Linha 2 */}
          <div className="grid grid-cols-12 gap-2 items-center mt-2">
            <Label className="col-span-2">Alíquota Interestadual</Label>
            <Txt
              className="col-span-2"
              value={param.aliqInterestadual}
              onChange={(e) => setParam({ ...param, aliqInterestadual: e.target.value })}
            />

            <Label className="col-span-2">Alíquota Estadual</Label>
            <Txt
              className="col-span-2"
              value={param.aliqEstadual}
              onChange={(e) => setParam({ ...param, aliqEstadual: e.target.value })}
            />

            <Label className="col-span-2">% FCB</Label>
            <Txt
              className="col-span-2"
              value={param.fcb}
              onChange={(e) => setParam({ ...param, fcb: e.target.value })}
            />
          </div>
        </fieldset>

        {/* GRID */}
        <div className="border rounded-md overflow-y-auto max-h-[350px]">
          <table className="w-full text-[12px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">UF Origem</th>
                <th className="border px-2 py-1">UF Destino</th>
                <th className="border px-2 py-1">Alíq. Interestadual</th>
                <th className="border px-2 py-1">Alíquota Interna</th>
                <th className="border px-2 py-1">% FCB</th>
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
                  <td className="border px-2 py-1">{l.ufOrigem}</td>
                  <td className="border px-2 py-1">{l.ufDestino}</td>
                  <td className="border px-2 py-1">{l.aliqInt}</td>
                  <td className="border px-2 py-1">{l.aliqEst}</td>
                  <td className="border px-2 py-1">{l.fcb}</td>
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
