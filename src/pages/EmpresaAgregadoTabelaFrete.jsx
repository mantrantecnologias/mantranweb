import { useState } from "react";
import {
  XCircle,
  RotateCcw,
  PlusCircle,
  Edit,
  Trash2,
} from "lucide-react";

/* ==========================
   Helpers
========================== */
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
      className={`border border-gray-300 rounded px-2 py-[2px] h-[26px] text-[13px] w-full ${props.className || ""}`}
    />
  );
}

function Sel({ children, className = "", ...rest }) {
  return (
    <select
      {...rest}
      className={`border border-gray-300 rounded px-2 py-[2px] h-[26px] text-[13px] w-full ${className}`}
    >
      {children}
    </select>
  );
}

/* ==========================
   Componente Principal
========================== */
export default function EmpresaAgregadoTabelaFrete({ onClose, cnpj, razao }) {
  const [item, setItem] = useState({
    tabela: "",
    vigenciaIni: "",
    vigenciaFim: "",
    divisao: "",
    tpCalculo: "",
    tpCarga: "",
  });

  const [lista, setLista] = useState([]);

  const limparCampos = () => {
    setItem({
      ...item,
      tabela: "",
      vigenciaIni: "",
      vigenciaFim: "",
      divisao: "",
      tpCalculo: "",
      tpCarga: "",
    });
  };

  const incluir = () => {
    setLista((prev) => [...prev, { ...item, id: Date.now() }]);
    limparCampos();
  };

  const alterar = () => {
    setLista((prev) =>
      prev.map((l) => (l.id === item.id ? item : l))
    );
    limparCampos();
  };

  const excluir = () => {
    if (!item.id) return alert("Selecione um item antes de excluir.");
    setLista((prev) => prev.filter((l) => l.id !== item.id));
    limparCampos();
  };

  const selecionarLinha = (l) => {
    setItem(l);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-[900px] rounded shadow-lg border border-gray-300 p-4">
        <h1 className="text-center text-red-700 font-semibold text-sm border-b pb-1">
          TABELA FRETE AGREGADO
        </h1>

        {/* =======================================
              CARD 1
        ======================================= */}
        <fieldset className="border border-gray-300 rounded p-3 mt-3">
          <legend className="px-2 text-red-700 font-semibold">
            Dados
          </legend>

          {/* Linha 1 – CNPJ + Razão */}
          <div className="grid grid-cols-[100px_200px_1fr] gap-3 items-center">
            <Label className="text-right">CGC/CPF</Label>
            <Txt value={cnpj} disabled className="bg-gray-100" />
            <Txt value={razao} disabled className="bg-gray-100" />
          </div>

          {/* Linha 2 – Tabela + Vigência */}
          <div className="grid grid-cols-[100px_1fr_100px_1fr_40px_1fr] gap-3 mt-3 items-center">
            <Label className="text-right">Tabela</Label>
            <Sel
              value={item.tabela}
              onChange={(e) => setItem({ ...item, tabela: e.target.value })}
            >
              <option value=""></option>
              <option>TABELA LOGGI</option>
              <option>TABELA PADRÃO</option>
            </Sel>

            <Label className="text-right">Vigência</Label>
            <Txt
              type="date"
              value={item.vigenciaIni}
              onChange={(e) => setItem({ ...item, vigenciaIni: e.target.value })}
            />

            <Label className="text-right">Até</Label>
            <Txt
              type="date"
              value={item.vigenciaFim}
              onChange={(e) => setItem({ ...item, vigenciaFim: e.target.value })}
            />
          </div>

          {/* Linha 3 – Divisão + TP Cálculo */}
          <div className="grid grid-cols-[100px_1fr_100px_1fr] gap-3 mt-3 items-center">
            <Label className="text-right">Divisão</Label>
            <Sel
              value={item.divisao}
              onChange={(e) => setItem({ ...item, divisao: e.target.value })}
            >
              <option value=""></option>
              <option>0001 - LOGGI</option>
              <option>0002 - PADRÃO</option>
            </Sel>

            <Label className="text-right">TP Cálculo</Label>
            <Sel
              value={item.tpCalculo}
              onChange={(e) => setItem({ ...item, tpCalculo: e.target.value })}
            >
              <option value=""></option>
              <option>Padrão</option>
              <option>Especial</option>
            </Sel>
          </div>

          {/* Linha 4 – Tipo Carga */}
          <div className="grid grid-cols-[100px_250px] gap-3 mt-3 items-center">
            <Label className="text-right">TP Carga</Label>
            <Sel
              value={item.tpCarga}
              onChange={(e) => setItem({ ...item, tpCarga: e.target.value })}
            >
              <option value=""></option>
              <option>Fracionada</option>
              <option>Fechada</option>
            </Sel>
          </div>
        </fieldset>

        {/* =======================================
              CARD 2 – GRID
        ======================================= */}
        <fieldset className="border border-gray-300 rounded p-3 mt-3">
          <legend className="px-2 text-red-700 font-semibold">
            Registros
          </legend>

          <div className="border rounded bg-white max-h-[250px] overflow-auto mt-2">
            <table className="min-w-full text-[12px]">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  {["Tabela", "Divisão", "TP Carga", "TP Cálculo"].map(
                    (t) => (
                      <th key={t} className="border px-2 py-1 text-left">
                        {t}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {lista.map((l, index) => (
                  <tr
                    key={l.id}
                    onClick={() => selecionarLinha(l)}
                    className={`cursor-pointer ${
                      index % 2 === 0 ? "bg-orange-50" : "bg-white"
                    } hover:bg-gray-100`}
                  >
                    <td className="border px-2">{l.tabela}</td>
                    <td className="border px-2">{l.divisao}</td>
                    <td className="border px-2">{l.tpCarga}</td>
                    <td className="border px-2">{l.tpCalculo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </fieldset>

        {/* =======================================
              RODAPÉ
        ======================================= */}
        <div className="flex justify-end gap-3 mt-4">

          <button
            onClick={onClose}
            className="flex items-center gap-1 text-red-700 hover:text-gray-700 text-[13px]"
          >
            <XCircle size={16} /> Fechar
          </button>

          <button
            onClick={limparCampos}
            className="flex items-center gap-1 text-red-700 hover:text-gray-700 text-[13px]"
          >
            <RotateCcw size={16} /> Limpar
          </button>

          <button
            onClick={incluir}
            className="flex items-center gap-1 text-red-700 hover:text-gray-700 text-[13px]"
          >
            <PlusCircle size={16} /> Incluir
          </button>

          <button
            onClick={alterar}
            className="flex items-center gap-1 text-red-700 hover:text-gray-700 text-[13px]"
          >
            <Edit size={16} /> Alterar
          </button>

          <button
            onClick={excluir}
            className="flex items-center gap-1 text-red-700 hover:text-gray-700 text-[13px]"
          >
            <Trash2 size={16} /> Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
