// src/pages/IRRF.jsx
import { useState } from "react";
import {
  XCircle,
  RotateCcw,
  PlusCircle,
  Edit,
  Trash2,
  Copy,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIconColor } from "../context/IconColorContext";

function Label({ children, className = "" }) {
  return (
    <label className={`text-[12px] text-gray-700 ${className}`}>{children}</label>
  );
}

function Txt({ className = "", ...rest }) {
  return (
    <input
      {...rest}
      className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full ${className}`}
    />
  );
}

export default function IRRF({ open }) {
  const navigate = useNavigate();
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  const [selecionado, setSelecionado] = useState(null);

  /** ================= MOCK (trocar por backend depois) ================= */
  const [lista, setLista] = useState([
    {
      ano: "2026",
      faixaIni: "0.00",
      faixaFim: "2112.00",
      aliq: "0.00",
      deducao: "0.00",
      impMin: "0.00",
      dependente: "0.00",
      baseIrrf: "0.00",
      seq: "1",
    },
    {
      ano: "2026",
      faixaIni: "2112.01",
      faixaFim: "2826.65",
      aliq: "7.50",
      deducao: "158.40",
      impMin: "0.00",
      dependente: "189.59",
      baseIrrf: "0.00",
      seq: "2",
    },
  ]);

  /** =================== ESTADO DO CARD 1 =================== */
  const [param, setParam] = useState({
    ano: "",
    faixaIni: "",
    faixaFim: "",
    aliq: "",
    deducao: "",
    impMin: "",
    dependente: "",
    baseIrrf: "",
    seq: "",
  });

  /** =================== FILTRO POR ANO =================== */
  const listaFiltrada = lista.filter((l) =>
    param.ano ? l.ano.startsWith(param.ano) : true
  );

  /** =================== SELECIONA LINHA =================== */
  const selecionarLinha = (l, index) => {
    setSelecionado(index);
    setParam({
      ano: l.ano,
      faixaIni: l.faixaIni,
      faixaFim: l.faixaFim,
      aliq: l.aliq,
      deducao: l.deducao,
      impMin: l.impMin,
      dependente: l.dependente,
      baseIrrf: l.baseIrrf,
      seq: l.seq,
    });
  };

  /** =================== CRUD =================== */
  const limpar = () => {
    setSelecionado(null);
    setParam({
      ano: "",
      faixaIni: "",
      faixaFim: "",
      aliq: "",
      deducao: "",
      impMin: "",
      dependente: "",
      baseIrrf: "",
      seq: "",
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
    setLista(lista.filter((_, i) => i !== selecionado));
    limpar();
  };

  /** =================== DUPLICAR ANO BASE =================== */
  const duplicarAno = () => {
    if (!param.ano) return alert("Informe um Ano Base para duplicar!");
    const anoAtual = param.ano;
    const proximoAno = (parseInt(anoAtual) + 1).toString();

    const dadosAno = lista.filter((l) => l.ano === anoAtual);
    if (dadosAno.length === 0)
      return alert("Nenhum registro encontrado para duplicar!");

    const novos = dadosAno.map((l) => ({
      ...l,
      ano: proximoAno,
    }));

    setLista([...lista, ...novos]);
    alert(`Ano ${anoAtual} duplicado para ${proximoAno} com sucesso!`);
  };

  /** =================== RENDER =================== */
  return (
    <div
      className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 bg-gray-50 h-[calc(100vh-56px)] flex flex-col ${
        open ? "ml-[192px]" : "ml-[56px]"
      }`}
    >
      {/* Título */}
      <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
        TABELA IRRF
      </h1>

      {/* Conteúdo */}
      <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 overflow-y-auto flex flex-col gap-3">

        {/* CARD PARÂMETROS */}
        <fieldset className="border rounded-md p-3">
          <legend className="px-2 text-red-700 font-semibold text-[12px]">
            Parâmetros
          </legend>

          {/* Linha 1 */}
          <div className="grid grid-cols-12 gap-2 items-center">
            <Label className="col-span-2">Ano Base</Label>
            <Txt
              className="col-span-2"
              value={param.ano}
              onChange={(e) => setParam({ ...param, ano: e.target.value })}
            />

            <Label className="col-span-2">Faixa Inicial</Label>
            <Txt
              className="col-span-3"
              value={param.faixaIni}
              onChange={(e) => setParam({ ...param, faixaIni: e.target.value })}
            />

            <Label className="col-span-1">Faixa Final</Label>
            <Txt
              className="col-span-2"
              value={param.faixaFim}
              onChange={(e) => setParam({ ...param, faixaFim: e.target.value })}
            />
          </div>

          {/* Linha 2 */}
          <div className="grid grid-cols-12 gap-2 items-center mt-2">
            <Label className="col-span-2">Alíquota</Label>
            <Txt
              className="col-span-2"
              value={param.aliq}
              onChange={(e) => setParam({ ...param, aliq: e.target.value })}
            />

            <Label className="col-span-2">Dedução IRRF</Label>
            <Txt
              className="col-span-3"
              value={param.deducao}
              onChange={(e) => setParam({ ...param, deducao: e.target.value })}
            />

            <Label className="col-span-1">Imposto Mínimo</Label>
            <Txt
              className="col-span-2"
              value={param.impMin}
              onChange={(e) => setParam({ ...param, impMin: e.target.value })}
            />
          </div>

          {/* Linha 3 */}
          <div className="grid grid-cols-12 gap-2 items-center mt-2">
            <Label className="col-span-2">Dependente</Label>
            <Txt
              className="col-span-2"
              value={param.dependente}
              onChange={(e) =>
                setParam({ ...param, dependente: e.target.value })
              }
            />

            <Label className="col-span-2">Base IRRF</Label>
            <Txt
              className="col-span-3"
              value={param.baseIrrf}
              onChange={(e) =>
                setParam({ ...param, baseIrrf: e.target.value })
              }
            />

            <Label className="col-span-1">Sequência</Label>
            <Txt
              className="col-span-2"
              value={param.seq}
              onChange={(e) => setParam({ ...param, seq: e.target.value })}
            />
          </div>
        </fieldset>

        {/* GRID */}
        <div className="border rounded-md overflow-y-auto max-h-[380px]">
          <table className="w-full text-[12px]">
            <thead className="bg-gray-100 border">
              <tr>
                {[
                  "Ano Base",
                  "Faixa Inicial",
                  "Faixa Final",
                  "Alíquota",
                  "Dedução IRRF",
                  "Imposto Mínimo",
                  "Dependente",
                  "Base IRRF",
                  "Sequência",
                ].map((h) => (
                  <th key={h} className="border px-2 py-1">
                    {h}
                  </th>
                ))}
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
                  <td className="border px-2 py-1">{l.ano}</td>
                  <td className="border px-2 py-1">{l.faixaIni}</td>
                  <td className="border px-2 py-1">{l.faixaFim}</td>
                  <td className="border px-2 py-1">{l.aliq}</td>
                  <td className="border px-2 py-1">{l.deducao}</td>
                  <td className="border px-2 py-1">{l.impMin}</td>
                  <td className="border px-2 py-1">{l.dependente}</td>
                  <td className="border px-2 py-1">{l.baseIrrf}</td>
                  <td className="border px-2 py-1">{l.seq}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RODAPÉ */}
      <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">

        {/* Fechar */}
        <button
          onClick={() => navigate(-1)}
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <XCircle size={20} />
          <span>Fechar</span>
        </button>

        {/* Limpar */}
        <button
          onClick={limpar}
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <RotateCcw size={20} />
          <span>Limpar</span>
        </button>

        {/* Incluir */}
        <button
          onClick={incluir}
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <PlusCircle size={20} />
          <span>Incluir</span>
        </button>

        {/* Alterar */}
        <button
          onClick={alterar}
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <Edit size={20} />
          <span>Alterar</span>
        </button>

        {/* Excluir */}
        <button
          onClick={excluir}
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <Trash2 size={20} />
          <span>Excluir</span>
        </button>

        {/* Duplicar */}
        <button
          onClick={duplicarAno}
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <Copy size={20} />
          <span>Duplicar</span>
        </button>
      </div>
    </div>
  );
}
