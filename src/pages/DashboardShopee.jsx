// src/pages/DashboardShopee.jsx
import { useEffect, useState } from "react";
import {
  Search,
  CheckCircle,
  CircleDot,
  XCircle,
  AlertTriangle,
  ClipboardList,
} from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

// RECHARTS
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  YAxis,
  CartesianGrid,
} from "recharts";

/* Helpers visuais */
function Label({ children, className = "" }) {
  return (
    <label className={`text-[12px] text-gray-700 ${className}`}>
      {children}
    </label>
  );
}

function Txt({ className = "", ...rest }) {
  const isReadOnly = rest.readOnly;
  return (
    <input
      {...rest}
      className={
        "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] " +
        (isReadOnly ? "bg-gray-200 " : "") +
        className
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

export default function DashboardShopee({ open }) {
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  // Datas atuais
  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const mesAtualIndex = hoje.getMonth();
  const dia = hoje.getDate();

  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const quinzenaDefault = dia <= 15 ? "2ª Quinzena" : "1ª Quinzena";

  /* ============================ ESTADOS ============================ */
  const [filtros, setFiltros] = useState({
    processo: "LAST MILE XPT",
    ano: anoAtual,
    mes: meses[mesAtualIndex],
    quinzena: quinzenaDefault,
    manifesto: false,
    cteComplementar: false,
  });

  const [statusProc, setStatusProc] = useState({
    preFatura: "pendente",
    processando: "pendente",
    finalizado: "pendente",
  });

  const [mostrarGrafico, setMostrarGrafico] = useState(false);

  const [resumo, setResumo] = useState({
    ano: anoAtual,
    mes: meses[mesAtualIndex],
    quinzena: quinzenaDefault,
    importadosPlano: 118006,
    docsShopee: 118006,
    faltaGerar: 90,
    enviandoSefaz: 5,
    autorizadoSefaz: 12378,
    erroApiShopee: 670,
    erroSefaz: 77676,
    viagensCalcular: 0,
  });

  // Checkbox da linha do resumo
  const [resumoSelecionado, setResumoSelecionado] = useState(false);

  /* VOLUMETRIA */
  const [volumetria, setVolumetria] = useState({
    cteShopee: 80000,
    cteNormal: 20000,
    cteServico: 18006,
  });

  const totalCte =
    volumetria.cteShopee +
    volumetria.cteNormal +
    volumetria.cteServico;

  useEffect(() => {
    setResumo((prev) => ({
      ...prev,
      importadosPlano: totalCte,
      docsShopee: totalCte,
    }));
  }, [totalCte]);

  /* RECEITA / PAGAMENTO */
  const receitaCTe = resumo.autorizadoSefaz * 1.25;
  const receitaCTeServico = 0;
  const receitaTotal = receitaCTe + receitaCTeServico;
  const totalICMS = receitaTotal * 0.18;

  const pagamentoTotalDocs = resumo.autorizadoSefaz;
  const pagamentoFreteViagem = resumo.autorizadoSefaz * 0.8;

  /* RETRÁTEIS */
  const [mostrarReceitaPag, setMostrarReceitaPag] = useState(false);
  const [mostrarVolumetria, setMostrarVolumetria] = useState(false);

  /* ============================ RECHARTS DATA ============================ */
  const dadosGrafico = [
    { name: "Importados Plano", valor: resumo.importadosPlano },
    { name: "CT-e Shopee", valor: resumo.docsShopee },
    { name: "Falta Gerar", valor: resumo.faltaGerar },
    { name: "Enviar Sefaz", valor: resumo.enviandoSefaz },
    { name: "Autorizado", valor: resumo.autorizadoSefaz },
    { name: "Erro API", valor: resumo.erroApiShopee },
    { name: "A Calcular", valor: resumo.viagensCalcular },
  ];

  /* ============================ HANDLERS ============================ */
  const handleFiltroChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePesquisar = () => {
    setMostrarGrafico(true);

    setStatusProc({
      preFatura: "processando",
      processando: "pendente",
      finalizado: "pendente",
    });

    setTimeout(() => {
      setStatusProc((prev) => ({
        ...prev,
        preFatura: "finalizado",
        processando: "processando",
      }));
    }, 800);

    setTimeout(() => {
      setStatusProc({
        preFatura: "finalizado",
        processando: "finalizado",
        finalizado: "finalizado",
      });
    }, 1600);
  };

  const handleExportar = () => {
    if (!resumoSelecionado) {
      alert("Selecione o período na grid (checkbox) para exportar.");
      return;
    }
    alert("Exportação gerada (mock). Aqui entra a lógica de exportar.");
  };

  const handleRejeitados = () => {
    alert("Abrir listagem de CT-es rejeitados (mock).");
  };

  const handleNotasServico = () => {
    alert("Abrir listagem de Notas de Serviço (mock).");
  };

  const tudoFinalizado =
    statusProc.preFatura === "finalizado" &&
    statusProc.processando === "finalizado" &&
    statusProc.finalizado === "finalizado";

  /* ============================ RENDER ============================ */
  return (
    <div
      className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 bg-gray-50 flex flex-col h-[calc(100vh-56px)] ${
        open ? "ml-[192px]" : "ml-[56px]"
      }`}
    >
      <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
        DASHBOARD eCOMMERCE - SHOPEE
      </h1>

      <div className="flex-1 p-3 overflow-y-auto bg-white border-x border-b border-gray-300">
        {/* ================== PARÂMETROS + STATUS ================== */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3 mb-3">
         {/* PARÂMETROS */}
<fieldset className="border border-gray-300 rounded p-3">
  <legend className="px-2 text-red-700 font-semibold">
    Parâmetros de Pesquisa
  </legend>

  {/* Linha 1 - usando GRID COLS 12 */}
  <div className="grid grid-cols-12 gap-3 mb-3 mt-1">

    {/* Processo */}
    <Label className="col-span-1 flex items-center">Processo</Label>
    <Sel
      name="processo"
      value={filtros.processo}
      onChange={handleFiltroChange}
      className="col-span-2"
    >
      <option>LAST MILE XPT</option>
      <option>LAST MILE HUB</option>
      <option>LINE HAUL</option>
    </Sel>

    {/* Ano */}
    <Label className="col-span-1 flex items-center">Ano</Label>
    <Txt
      name="ano"
      type="number"
      value={filtros.ano}
      onChange={handleFiltroChange}
      className="col-span-1"
    />

    {/* Mês */}
    <Label className="col-span-1 flex items-center">Mês</Label>
    <Sel
      name="mes"
      value={filtros.mes}
      onChange={handleFiltroChange}
      className="col-span-2"
    >
      {meses.map((m) => (
        <option key={m}>{m}</option>
      ))}
    </Sel>

    {/* Quinzena */}
    
    <Sel
      name="quinzena"
      value={filtros.quinzena}
      onChange={handleFiltroChange}
      className="col-span-2"
    >
      <option>1ª Quinzena</option>
      <option>2ª Quinzena</option>
    </Sel>

       
      <button
        onClick={handlePesquisar}
        className="col-span-2 h-[26px] px-3 bg-red-700 text-white rounded hover:bg-red-800 flex items-center text-[12px]"
      >
        <Search size={14} className="mr-1" />
        Pesquisar
      </button>
  

  </div>

  {/* ================= Linha 2 – Checkboxes ================= */}
  <div className="grid grid-cols-12 gap-3 mt-1">

    <label className="col-span-2 flex items-center gap-2">
      <input
        type="checkbox"
        name="manifesto"
        checked={filtros.manifesto}
        onChange={handleFiltroChange}
      />
      Manifesto
    </label>

    <label className="col-span-3 flex items-center gap-2">
      <input
        type="checkbox"
        name="cteComplementar"
        checked={filtros.cteComplementar}
        onChange={handleFiltroChange}
      />
      CT-e Complementar
    </label>
    {/* ================= Botão Exportar (condicional) ================= */}
  {tudoFinalizado && (
<button
          onClick={handleExportar}
          className="h-[26px] px-3 col-start-11 col-span-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 flex items-center text-[12px]"
        >
          <Search size={14} className="mr-1" />
          Exportar
        </button>
          )}
  </div>

  

    

</fieldset>


          {/* STATUS */}
          <fieldset className="border border-gray-300 rounded p-3">
            <legend className="px-2 text-red-700 font-semibold">
              Status
            </legend>

            <div className="space-y-3 mt-1">
              {/* Pré-fatura */}
              <div className="flex items-center justify-between">
                <span>Pré-Fatura</span>
                <div className="flex items-center gap-2">
                  <CircleDot
                    size={18}
                    className={
                      statusProc.preFatura === "processando"
                        ? "text-red-700"
                        : statusProc.preFatura === "finalizado"
                        ? "text-green-600"
                        : "text-slate-400"
                    }
                  />
                  <span className="text-[12px]">
                    {statusProc.preFatura}
                  </span>
                </div>
              </div>

              {/* Processando */}
              <div className="flex items-center justify-between">
                <span>Processando</span>
                <div className="flex items-center gap-2">
                  <CircleDot
                    size={18}
                    className={
                      statusProc.processando === "processando"
                        ? "text-red-700"
                        : statusProc.processando === "finalizado"
                        ? "text-green-600"
                        : "text-slate-400"
                    }
                  />
                  <span className="text-[12px]">
                    {statusProc.processando}
                  </span>
                </div>
              </div>

              {/* Finalizado */}
              <div className="flex items-center justify-between border-t pt-3 mt-2">
                <span>Finalizado</span>
                <div className="flex items-center gap-2">
                  <CheckCircle
                    size={18}
                    className={
                      statusProc.finalizado === "finalizado"
                        ? "text-green-600"
                        : "text-slate-400"
                    }
                  />
                  <span className="text-[12px]">
                    {statusProc.finalizado}
                  </span>
                </div>
              </div>
            </div>
          </fieldset>
        </div>

        {/* ================== RESUMO ================== */}
        <fieldset className="border border-gray-300 rounded p-3 mb-3">
          <legend className="px-2 text-red-700 font-semibold">
            Resumo por Período
          </legend>

          <div className="overflow-x-auto mt-1">
            <table className="w-full text-[12px]">
              <thead className="bg-gray-100 border">
                <tr>
                  <th className="border px-1 py-[4px] text-center">
                    {/* Checkbox header opcional, aqui só linha única */}
                    Sel
                  </th>
                  {[
                    "Ano",
                    "Mês",
                    "Quinzena",
                    "Importados Plano",
                    "Docs Shopee",
                    "Falta Gerar",
                    "Enviando Sefaz",
                    "Autorizado",
                    "Erro API Shopee",
                    "Erro SEFAZ",
                    "A Calcular",
                  ].map((col) => (
                    <th key={col} className="border px-1 py-[4px]">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-red-50">
                  <td className="border px-1 text-center">
                    <input
                      type="checkbox"
                      checked={resumoSelecionado}
                      onChange={(e) =>
                        setResumoSelecionado(e.target.checked)
                      }
                    />
                  </td>
                  <td className="border px-1">{resumo.ano}</td>
                  <td className="border px-1">{resumo.mes}</td>
                  <td className="border px-1">{resumo.quinzena}</td>
                  <td className="border px-1">
                    {resumo.importadosPlano.toLocaleString("pt-BR")}
                  </td>
                  <td className="border px-1">
                    {resumo.docsShopee.toLocaleString("pt-BR")}
                  </td>
                  <td className="border px-1">
                    {resumo.faltaGerar.toLocaleString("pt-BR")}
                  </td>
                  <td className="border px-1">
                    {resumo.enviandoSefaz.toLocaleString("pt-BR")}
                  </td>
                  <td className="border px-1">
                    {resumo.autorizadoSefaz.toLocaleString("pt-BR")}
                  </td>
                  <td className="border px-1">
                    {resumo.erroApiShopee.toLocaleString("pt-BR")}
                  </td>
                  <td className="border px-1">
                    {resumo.erroSefaz.toLocaleString("pt-BR")}
                  </td>
                  <td className="border px-1">
                    {resumo.viagensCalcular.toLocaleString("pt-BR")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </fieldset>

        {/* ================== GRÁFICO (RECHARTS) ================== */}
        <fieldset className="border border-gray-300 rounded p-3 mb-3">
          <legend className="px-2 text-red-700 font-semibold">
            Gráfico Status Processamento
          </legend>

          <div className="w-full h-[200px]">
            {mostrarGrafico ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosGrafico}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(v) =>
                      v.toLocaleString("pt-BR")
                    }
                  />
                  <Bar
                    dataKey="valor"
                    fill="#1E90FF"
                    minPointSize={4} // garante barra mínima
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-400 py-6">
                Clique em <b>Pesquisar</b> para exibir o gráfico
              </div>
            )}
          </div>
        </fieldset>

{/* ================== RECEITA / PAGAMENTO (RETRÁTIL) ================== */}
<fieldset className="border border-gray-300 rounded p-3 mb-3">
  <legend
    className="px-2 text-red-700 font-semibold flex items-center justify-between cursor-pointer"
    onClick={() => setMostrarReceitaPag((v) => !v)}
  >
    <span>Receita / Pagamento</span>
    <span className="text-[11px] text-gray-500">
      {mostrarReceitaPag ? "▼" : "►"}
    </span>
  </legend>

  {mostrarReceitaPag && (
    <>

      {/* ================== RECEITA ================== */}
      <div className="grid grid-cols-12 gap-3 mt-2">

        {/* Título RECEITA */}
        <span className="font-semibold col-span-1 flex items-center">
          RECEITA
        </span>

        {/* CT-e */}
        <Label className="col-span-1  col-start-3 flex items-center">CT-e</Label>
        <Txt
          readOnly
          value={receitaCTe.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}
          className="col-span-1 bg-gray-200"
        />

        {/* CT-e Serviço */}
        <Label className="col-span-1 flex items-center">CT-e Serviço</Label>
        <Txt
          readOnly
          value={receitaCTeServico.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}
          className="col-span-1 bg-gray-200"
        />

        {/* Total ICMS */}
        <Label className="col-span-1 flex items-center">Total ICMS</Label>
        <Txt
          readOnly
          value={totalICMS.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}
          className="col-span-1 bg-gray-200"
        />

        {/* Total */}
        <Label className="col-span-1 flex items-center">Total</Label>
        <Txt
          readOnly
          value={receitaTotal.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}
          className="col-span-2 bg-gray-200"
        />

        
        {/* Botão Pesquisar */}
        
          <button
            onClick={() => alert("Pesquisar Receita (mock).")}
            className="h-[26px] px-3 bg-red-700 text-white rounded hover:bg-red-800 text-[12px] flex items-center"
          >
            <Search size={14} className="mr-1" />
            Pesquisar
          </button>
        
      </div>

      {/* ================== PAGAMENTO ================== */}
      <div className="grid grid-cols-12 gap-3 mt-4">

        {/* Título PAGAMENTO */}
        <span className="font-semibold col-span-2 flex items-center">
          PAGAMENTO
        </span>

        {/* Total Documentos */}
        <Label className="col-span-2  col-start-4 flex items-center">Total Documentos</Label>
        <Txt
          readOnly
          value={pagamentoTotalDocs.toLocaleString("pt-BR")}
          className="col-span-1 bg-gray-200"
        />

        {/* Total Frete Viagem */}
        <Label className="col-span-1 col-start-9 flex items-center">Total Frete </Label>
        <Txt
          readOnly
          value={pagamentoFreteViagem.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}
          className="col-span-2 bg-gray-200"
        />

        {/* Botão Pesquisar */}
                <button
            onClick={() => alert("Pesquisar Pagamento (mock).")}
            className="h-[26px] px-3 bg-red-700 text-white rounded hover:bg-red-800 text-[12px] flex items-center"
          >
            <Search size={14} className="mr-1" />
            Pesquisar
          </button>
        
      </div>

    </>
  )}
</fieldset>


        {/* ================== VOLUMETRIA (RETRÁTIL) ================== */}
<fieldset className="border border-gray-300 rounded p-3 mb-3">
  <legend
    className="px-2 text-red-700 font-semibold flex items-center justify-between cursor-pointer"
    onClick={() => setMostrarVolumetria((v) => !v)}
  >
    <span>Volumetria</span>
    <span className="text-[11px] text-gray-500">
      {mostrarVolumetria ? "▼" : "►"}
    </span>
  </legend>

  {mostrarVolumetria && (
    <>
      {/* 1 única linha com grid 12 colunas */}
      <div className="grid grid-cols-12 gap-3 mb-3 mt-2">

        {/* CT-e Shopee */}
        <Label className="col-span-1 flex items-center">
          CT-e Shopee
        </Label>
        <Txt
          readOnly
          value={volumetria.cteShopee.toLocaleString("pt-BR")}
          className="col-span-2 bg-gray-200"
        />

        {/* CT-e Normal */}
        <Label className="col-span-1 flex items-center">
          CT-e Normal
        </Label>
        <Txt
          readOnly
          value={volumetria.cteNormal.toLocaleString("pt-BR")}
          className="col-span-2 bg-gray-200"
        />

        {/* CT-e Serviço */}
        <Label className="col-span-1 flex items-center">
          CT-e Serviço
        </Label>
        <Txt
          readOnly
          value={volumetria.cteServico.toLocaleString("pt-BR")}
          className="col-span-2 bg-gray-200"
        />

        {/* Total */}
        <Label className="col-span-1 flex items-center">
          Total CT-e
        </Label>
        <Txt
          readOnly
          value={totalCte.toLocaleString("pt-BR")}
          className="col-span-2 bg-gray-200 font-semibold"
        />

      </div>
    </>
  )}
</fieldset>

      </div>

      {/* ================= FOOTER ================== */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-2 flex justify-between mt-auto z-10 shadow-[0_-2px_4px_rgba(0,0,0,0.05)]">
        <div className="flex gap-6">
          <button
            onClick={() => window.history.back()}
            className={`flex flex-col items-center text-[11px] transition ${footerIconColorNormal} hover:${footerIconColorHover}`}
          >
            <XCircle size={18} />
            <span>Fechar</span>
          </button>
  <button
                 onClick={() => window.history.back()}
            className={`flex flex-col items-center text-[11px] transition ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                  <AlertTriangle size={18} />
                  <span>Rejeitados</span>
                </button>

                <button
                  onClick={() => window.history.back()}
            className={`flex flex-col items-center text-[11px] transition ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                  <ClipboardList size={18} />
                  <span>Notas Serviço</span>
                </button>

        </div>

        <div />
      </div>
    </div>
  );
}
