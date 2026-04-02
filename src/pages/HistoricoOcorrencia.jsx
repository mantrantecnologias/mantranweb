import { useState } from "react";
import {
  XCircle,
  RotateCcw,
  PlusCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

/* ---------------------------------------------
   HELPERS
--------------------------------------------- */
function Label({ children, col = 2, className = "" }) {
  return (
    <label
      className={`text-[12px] text-gray-700 col-span-${col} flex items-center ${className}`}
    >
      {children}
    </label>
  );
}

function Txt({ col = 3, readOnly = false, className = "", ...rest }) {
  return (
    <input
      {...rest}
      readOnly={readOnly}
      className={`border border-gray-300 rounded px-1 h-[26px] text-[13px] w-full col-span-${col} ${readOnly ? "bg-gray-200" : ""
        } ${className}`}
    />
  );
}

/* ---------------------------------------------
   COMPONENTE PRINCIPAL
--------------------------------------------- */
export default function HistoricoOcorrencia({ open }) {
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  /* MOCK */
  const [lista, setLista] = useState([
    {
      codigo: "001",
      descricao: "VIAGEM AUTORIZADA",
      reentrega: "N",
      devolucao: "N",
    },
  ]);

  /* FORM */
  const [dados, setDados] = useState({
    codigo: "",
    descricao: "",
    reentrega: false,
    devolucao: false,
  });

  /* LIMPAR */
  const limpar = () => {
    setDados({
      codigo: "",
      descricao: "",
      reentrega: false,
      devolucao: false,
    });
  };

  /* HANDLER */
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setDados((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* INCLUIR */
  const incluir = () => {
    if (!dados.codigo || !dados.descricao) {
      alert("Informe Código e Descrição.");
      return;
    }

    const novo = {
      codigo: dados.codigo,
      descricao: dados.descricao,
      reentrega: dados.reentrega ? "S" : "N",
      devolucao: dados.devolucao ? "S" : "N",
    };

    setLista((prev) => [...prev, novo]);
    limpar();
  };

  /* ALTERAR */
  const alterar = () => {
    if (!dados.codigo) return;

    setLista((prev) =>
      prev.map((l) =>
        l.codigo === dados.codigo
          ? {
            codigo: dados.codigo,
            descricao: dados.descricao,
            reentrega: dados.reentrega ? "S" : "N",
            devolucao: dados.devolucao ? "S" : "N",
          }
          : l
      )
    );
  };

  /* EXCLUIR */
  const excluir = () => {
    setLista((prev) => prev.filter((l) => l.codigo !== dados.codigo));
    limpar();
  };

  /* SELECIONAR ITEM DA GRID */
  const selecionar = (item) => {
    setDados({
      codigo: item.codigo,
      descricao: item.descricao,
      reentrega: item.reentrega === "S",
      devolucao: item.devolucao === "S",
    });
  };

  return (
    <div
      className={`transition-all duration-300 mt-[44px] text-[13px] bg-gray-50 h-[calc(100vh-56px)] flex flex-col ${open ? "ml-[192px]" : "ml-[56px]"
        }`}
    >
      <div className="bg-white border border-gray-300 shadow p-4 rounded flex-1 flex flex-col">

        {/* TÍTULO */}
        <h2 className="text-center text-red-700 font-bold text-lg mb-4">
          CADASTRO DE HISTÓRICO DE OCORRÊNCIAS (SOLUÇÕES)
        </h2>

        <div className="flex-1 flex flex-col gap-3 overflow-y-auto">

          {/* CARD 1 - PARÂMETROS */}
          <fieldset className="border border-gray-300 rounded p-3">
            <legend className="text-red-700 font-semibold text-[13px] px-2">
              Parâmetros Ocorrência
            </legend>

            {/* Linha 1 */}
            <div className="grid grid-cols-12 gap-2 mb-2">
              <Label col={1}>Código</Label>
              <Txt
                col={1}
                name="codigo"
                value={dados.codigo}
                onChange={handleChange}
              />

              <Label col={1}>Descrição</Label>
              <Txt
                col={7}
                name="descricao"
                value={dados.descricao}
                onChange={handleChange}
              />
            </div>

            {/* Linha 2 */}
            <div className="grid grid-cols-12 gap-2">

              <div className="col-span-3 flex items-center gap-2">
                <input
                  type="checkbox"
                  name="reentrega"
                  checked={dados.reentrega}
                  onChange={handleChange}
                />
                <span className="text-[12px]">Gera CTRC de Reentrega</span>
              </div>

              <div className="col-span-3 flex items-center gap-2">
                <input
                  type="checkbox"
                  name="devolucao"
                  checked={dados.devolucao}
                  onChange={handleChange}
                />
                <span className="text-[12px]">Gera CTRC de Devolução</span>
              </div>

            </div>
          </fieldset>

          {/* CARD 2 - GRID */}
          <fieldset className="border border-gray-300 rounded p-3">
            <legend className="text-red-700 font-semibold text-[13px] px-2">
              Histórico de Ocorrências
            </legend>

            <div className="border border-gray-300 rounded max-h-[360px] overflow-y-auto">
              <table className="w-full text-[12px]">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="border px-2 py-1">Código</th>
                    <th className="border px-2 py-1">Descrição</th>
                    <th className="border px-2 py-1">Gera Reentrega</th>
                    <th className="border px-2 py-1">Gera Devolução</th>
                  </tr>
                </thead>

                <tbody>
                  {lista.map((item, idx) => (
                    <tr
                      key={idx}
                      className="cursor-pointer hover:bg-red-50"
                      onClick={() => selecionar(item)}
                    >
                      <td className="border px-2 py-1">{item.codigo}</td>
                      <td className="border px-2 py-1">{item.descricao}</td>
                      <td className="border px-2 py-1 text-center">{item.reentrega}</td>
                      <td className="border px-2 py-1 text-center">{item.devolucao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </fieldset>

        </div>



      </div>
      {/* RODAPÉ */}
      <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6 mt-3">
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
