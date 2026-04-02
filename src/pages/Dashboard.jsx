// src/pages/DashboardOperacao.jsx
import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";
import {
  XCircle,
  Truck,
  ClipboardList,
  FileText,
  Receipt,
  PackageCheck,
  AlertTriangle,
  FileWarning,
  HandCoins,
  ScrollText,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
} from "lucide-react";

/* =========================================================
   DASHBOARD 2.0 - OPERAÇÃO (VISÃO GERAL)
   ✅ Visual “Oficina style”: KPIs compactos + gráficos + listas
   ✅ KPIs compactos com expansão (fica abaixo, sem navegar)
   ✅ Cards com NOMES claros (para futura tela de parâmetros)
   ✅ Inclui: manifestos abertos, pendências faturamento, cotações sem CT-e etc.
   ✅ Tudo mockado (trocar pela WebAPI depois)
========================================================= */

const cores = {
  verde: "#4ade80",
  azul: "#60a5fa",
  vermelho: "#f87171",
  amarelo: "#facc15",
  cinza: "#94a3b8",
  laranja: "#fb923c",
};

function pillClass(level) {
  if (level === "critico") return "border-red-200 text-red-700 bg-red-50";
  if (level === "alerta") return "border-yellow-200 text-yellow-800 bg-yellow-50";
  if (level === "info") return "border-blue-200 text-blue-700 bg-blue-50";
  return "border-green-200 text-green-700 bg-green-50";
}

function CardShell({ cardName, title, icon, right, children, className = "" }) {
  return (
    <div
      data-card-name={cardName}
      className={[
        "bg-white border border-gray-200 rounded-xl shadow-sm",
        "p-4",
        className,
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-[40px] h-[40px] rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            {icon}
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-gray-800 truncate">
              {title}
            </div>
            {/* Nome técnico do card (para futura tela de parâmetros) */}
            <div className="text-[11px] text-gray-400 truncate">
              {cardName}
            </div>
          </div>
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>

      {children}
    </div>
  );
}

function KpiCompact({
  id,
  expandedId,
  onToggle,
  cardName,
  title,
  value,
  subtitle,
  icon,
  badge,
  badgeLevel = "ok",
}) {
  const isOpen = expandedId === id;

  return (
    <button
      type="button"
      data-card-name={cardName}
      onClick={() => onToggle(isOpen ? null : id)}
      className={[
        "text-left w-full",
        "bg-white border border-gray-200 rounded-xl shadow-sm p-4",
        "hover:border-gray-300 hover:shadow transition",
        "focus:outline-none focus:ring-2 focus:ring-red-200",
      ].join(" ")}
      title="Clique para expandir detalhes"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-gray-800">{title}</div>
          <div className="text-[11px] text-gray-400">{cardName}</div>

          <div className="text-[28px] font-bold text-gray-900 leading-tight mt-1">
            {value}
          </div>
          <div className="text-[12px] text-gray-500 mt-1">{subtitle}</div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="w-[44px] h-[44px] rounded-xl bg-gray-100 flex items-center justify-center">
            {icon}
          </div>

          {badge ? (
            <div
              className={[
                "text-[11px] px-2 py-1 rounded-full border",
                pillClass(badgeLevel),
              ].join(" ")}
            >
              {badge}
            </div>
          ) : null}

          <div className="text-[11px] text-gray-500 flex items-center gap-1">
            {isOpen ? (
              <>
                Recolher <ChevronUp size={14} />
              </>
            ) : (
              <>
                Expandir <ChevronDown size={14} />
              </>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

function fmtPct(v) {
  return `${Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 1 })}%`;
}

function sum(arr, key = "value") {
  return (arr || []).reduce((s, x) => s + (Number(x?.[key]) || 0), 0);
}

function addPercent(arr, key = "value") {
  const t = sum(arr, key) || 1;
  return (arr || []).map((x) => ({
    ...x,
    percent: (((Number(x?.[key]) || 0) / t) * 100).toFixed(1),
  }));
}

export default function DashboardOperacao({ onClose, open = true }) {
  const [naoExibir, setNaoExibir] = useState(false);
  const [expanded, setExpanded] = useState(null);

  // Ler configuração do localStorage (Novo)
  const [config] = useState(() => {
    const saved = localStorage.getItem("op_dashboard_config");
    if (saved) return JSON.parse(saved);
    // Default: tudo true
    return {
      kpis: true,
      chartTendencia: true,
      chartPendencias: true,
      donutsDia: true,
      donutMes: true,
      donutOcorrencias: true,
      listaFila: true,
    };
  });

  const tituloTopo = useMemo(() => "DASHBOARD 2.0 - OPERAÇÃO (VISÃO GERAL)", []);

  /* =========================
     MOCKS (trocar por API depois)
  ========================= */

  // KPIs compactos (linha 1)
  const kpis = {
    manifestosAbertos: 14,
    ctesPendentesFaturamento: 28,
    nfsePendentesFaturamento: 11,
    cotacoesSemCte: 7,
  };

  // Pizzas (dia/mês)
  const coletasDia = [
    { name: "Não Iniciadas", value: 5, color: cores.vermelho },
    { name: "Em Andamento", value: 8, color: cores.azul },
    { name: "Encerradas", value: 12, color: cores.verde },
  ];

  const viagensDia = [
    { name: "Não Iniciadas", value: 2, color: cores.vermelho },
    { name: "Em Andamento", value: 6, color: cores.azul },
    { name: "Encerradas", value: 9, color: cores.verde },
  ];

  const ctesDia = [
    { name: "Autorizados", value: 15, color: cores.verde },
    { name: "Cancelados", value: 1, color: cores.vermelho },
    { name: "Rejeitados", value: 2, color: cores.azul },
  ];

  const ctesMes = [
    { name: "Autorizados", value: 120, color: cores.verde },
    { name: "Cancelados", value: 5, color: cores.vermelho },
    { name: "Rejeitados", value: 3, color: cores.azul },
  ];

  const ocorrenciasCte = [
    { name: "Entrega Realizada", value: 80, color: cores.verde },
    { name: "Recusada", value: 12, color: cores.vermelho },
    { name: "Com Ocorrência", value: 8, color: cores.azul },
  ];

  const coletasDiaPct = addPercent(coletasDia);
  const viagensDiaPct = addPercent(viagensDia);
  const ctesDiaPct = addPercent(ctesDia);
  const ctesMesPct = addPercent(ctesMes);
  const ocorrenciasCtePct = addPercent(ocorrenciasCte);

  // Tendência (linha) “volume de CT-e autorizados” últimos 7 dias
  const volumeCte7dias = [
    { dia: "Seg", qtd: 18 },
    { dia: "Ter", qtd: 22 },
    { dia: "Qua", qtd: 19 },
    { dia: "Qui", qtd: 24 },
    { dia: "Sex", qtd: 28 },
    { dia: "Sáb", qtd: 14 },
    { dia: "Dom", qtd: 9 },
  ];

  const tendenciaCte = useMemo(() => {
    const last = volumeCte7dias?.[volumeCte7dias.length - 1]?.qtd || 0;
    const prev = volumeCte7dias?.[volumeCte7dias.length - 2]?.qtd || 1;
    return ((last - prev) / prev) * 100;
  }, [volumeCte7dias]);

  // Barras: “Pendências Operacionais por Tipo”
  const pendenciasPorTipo = [
    { tipo: "Manifestos Abertos", qtd: kpis.manifestosAbertos, color: cores.laranja },
    { tipo: "CT-e Pend. Faturamento", qtd: kpis.ctesPendentesFaturamento, color: cores.vermelho },
    { tipo: "NFS-e Pend. Faturamento", qtd: kpis.nfsePendentesFaturamento, color: cores.azul },
    { tipo: "Cotações sem CT-e", qtd: kpis.cotacoesSemCte, color: cores.amarelo },
  ];

  // Listas “Ações rápidas” (mock)
  const filaPendencias = [
    { hora: "09:12", texto: "CT-e 352401... pendente de faturamento (cliente X)" },
    { hora: "10:05", texto: "Manifesto 000123 em aberto (rota SP → RJ)" },
    { hora: "11:20", texto: "NFS-e pendente de faturamento (serviço adicional)" },
    { hora: "13:45", texto: "Cotação 000778 sem emissão de CT-e" },
  ];

  // Detalhes expandidos (mock)
  const detalhesManifestos = [
    { id: "000123", rota: "SP → RJ", status: "Em Andamento" },
    { id: "000130", rota: "SP → MG", status: "Não Encerrado" },
    { id: "000142", rota: "PR → SC", status: "Em Andamento" },
    { id: "000151", rota: "BA → SP", status: "Não Encerrado" },
  ];

  const detalhesCteFat = [
    { cte: "000001", cliente: "ACME LTDA", dias: 2 },
    { cte: "000014", cliente: "BETA LOG", dias: 1 },
    { cte: "000021", cliente: "OMEGA SA", dias: 4 },
    { cte: "000030", cliente: "XPTO", dias: 3 },
  ];

  const detalhesNfseFat = [
    { nfse: "8891", cliente: "ACME LTDA", dias: 1 },
    { nfse: "8894", cliente: "BETA LOG", dias: 2 },
    { nfse: "8902", cliente: "OMEGA SA", dias: 5 },
  ];

  const detalhesCotacaoSemCte = [
    { cot: "000778", cliente: "ACME LTDA", idadeHoras: 6 },
    { cot: "000781", cliente: "BETA LOG", idadeHoras: 12 },
    { cot: "000790", cliente: "OMEGA SA", idadeHoras: 24 },
  ];

  const ExpandedPanel = () => {
    if (!expanded) return null;

    const wrap = (title, subtitle, children) => (
      <div className="mt-3 bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-gray-800">{title}</div>
            {subtitle ? <div className="text-[12px] text-gray-500 mt-1">{subtitle}</div> : null}
          </div>

          <button
            type="button"
            className="text-[12px] px-2 py-1 rounded border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
            onClick={() => setExpanded(null)}
            title="Fechar detalhes"
          >
            Recolher
          </button>
        </div>

        <div className="mt-3">{children}</div>
      </div>
    );

    const tableShell = (header, rows) => (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-3 py-2 text-[12px] font-semibold text-gray-700">
          {header}
        </div>
        <div className="divide-y">{rows}</div>
      </div>
    );

    if (expanded === "manifestos") {
      return wrap(
        "Manifestos Não Encerrados (Detalhes)",
        "Top manifestos em aberto (mock)",
        tableShell(
          "Em aberto",
          detalhesManifestos.map((x, i) => (
            <div key={i} className="px-3 py-2 grid grid-cols-12 gap-2 items-center">
              <div className="col-span-3 text-[12px] text-gray-800 font-semibold">{x.id}</div>
              <div className="col-span-5 text-[12px] text-gray-600">{x.rota}</div>
              <div className="col-span-4 flex justify-end">
                <div
                  className={[
                    "text-[11px] px-2 py-1 rounded-full border",
                    x.status.includes("Não") ? "border-red-200 text-red-700 bg-red-50" : "border-blue-200 text-blue-700 bg-blue-50",
                  ].join(" ")}
                >
                  {x.status}
                </div>
              </div>
            </div>
          ))
        )
      );
    }

    if (expanded === "cteFat") {
      return wrap(
        "CT-e Pendentes de Faturamento (Detalhes)",
        "Top pendências de faturamento (mock)",
        tableShell(
          "CT-e pendentes",
          detalhesCteFat.map((x, i) => (
            <div key={i} className="px-3 py-2 grid grid-cols-12 gap-2 items-center">
              <div className="col-span-5 text-[12px] text-gray-800 font-semibold truncate">{x.cte}</div>
              <div className="col-span-5 text-[12px] text-gray-600 truncate">{x.cliente}</div>
              <div className="col-span-2 text-[12px] text-red-700 font-semibold text-right">
                {x.dias}d
              </div>
            </div>
          ))
        )
      );
    }

    if (expanded === "nfseFat") {
      return wrap(
        "NFS-e Pendentes de Faturamento (Detalhes)",
        "Top NFS-e pendentes (mock)",
        tableShell(
          "NFS-e pendentes",
          detalhesNfseFat.map((x, i) => (
            <div key={i} className="px-3 py-2 grid grid-cols-12 gap-2 items-center">
              <div className="col-span-4 text-[12px] text-gray-800 font-semibold">{x.nfse}</div>
              <div className="col-span-6 text-[12px] text-gray-600 truncate">{x.cliente}</div>
              <div className="col-span-2 text-[12px] text-red-700 font-semibold text-right">
                {x.dias}d
              </div>
            </div>
          ))
        )
      );
    }

    if (expanded === "cotacao") {
      return wrap(
        "Cotações sem Emissão de CT-e (Detalhes)",
        "Top cotações pendentes de conversão (mock)",
        tableShell(
          "Cotações sem CT-e",
          detalhesCotacaoSemCte.map((x, i) => (
            <div key={i} className="px-3 py-2 grid grid-cols-12 gap-2 items-center">
              <div className="col-span-4 text-[12px] text-gray-800 font-semibold">{x.cot}</div>
              <div className="col-span-6 text-[12px] text-gray-600 truncate">{x.cliente}</div>
              <div className="col-span-2 text-[12px] text-yellow-800 font-semibold text-right">
                {x.idadeHoras}h
              </div>
            </div>
          ))
        )
      );
    }

    return null;
  };

  const renderDonut = (cardName, title, icon, dadosPct, totalLabel) => {
    const totalGeral = sum(dadosPct, "value");
    return (
      <CardShell
        cardName={cardName}
        title={title}
        icon={icon}
        className="md:col-span-4"
        right={
          <div className="text-[11px] px-2 py-1 rounded-full border border-gray-200 text-gray-700 bg-gray-50">
            Total: {totalGeral}
          </div>
        }
      >
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dadosPct}
                dataKey="value"
                cx="40%"
                cy="45%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={2}
              >
                {dadosPct.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, name, props) => [
                  `${value} (${props?.payload?.percent ?? "0"}%)`,
                  name,
                ]}
              />

              <Legend
                verticalAlign="middle"
                align="right"
                layout="vertical"
                formatter={(value) => {
                  const item = dadosPct.find((d) => d.name === value);
                  return `${value} (${item?.value ?? 0})`;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-1 text-[12px] text-gray-600">
          {totalLabel}: <b className="text-gray-800">{totalGeral}</b>
        </div>
      </CardShell>
    );
  };

  return (
    <div
      className={`fixed top-[48px] right-0 bottom-0 z-50 flex items-center justify-center bg-black/40
      transition-all duration-300
      ${open ? "left-52" : "left-14"}
      `}
    >
      <div className="bg-gray-50 w-[1200px] rounded shadow-lg border border-gray-300 flex flex-col overflow-hidden">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between bg-gradient-to-r from-red-700 to-black text-white px-4 py-2">
          <h1 className="text-sm font-semibold">{tituloTopo}</h1>

          <div className="flex items-center gap-4">
            <label className="flex items-center text-[12px]">
              <input
                type="checkbox"
                className="mr-1"
                checked={naoExibir}
                onChange={(e) => setNaoExibir(e.target.checked)}
              />
              Não exibir novamente
            </label>

            <button
              title="Fechar Tela"
              onClick={onClose}
              className="flex items-center gap-1 hover:text-gray-200"
            >
              <XCircle size={18} />
              <span className="text-[13px]">Fechar</span>
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-4 overflow-y-auto max-h-[82vh]">
          {/* ======= KPIs compactos (linha 1) ======= */}
          {config.kpis && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <KpiCompact
                id="manifestos"
                expandedId={expanded}
                onToggle={setExpanded}

                title="Manifestos Não Encerrados"
                value={kpis.manifestosAbertos}
                subtitle="Em aberto no operacional"
                icon={<ScrollText size={20} className="text-gray-700" />}
                badge="Atenção"
                badgeLevel={kpis.manifestosAbertos > 0 ? "alerta" : "ok"}
              />

              <KpiCompact
                id="cteFat"
                expandedId={expanded}
                onToggle={setExpanded}

                title="CT-e Pend. Faturamento"
                value={kpis.ctesPendentesFaturamento}
                subtitle="Autorizados aguardando faturar"
                icon={<FileText size={20} className="text-gray-700" />}
                badge="Priorizar"
                badgeLevel={kpis.ctesPendentesFaturamento > 0 ? "critico" : "ok"}
              />

              <KpiCompact
                id="nfseFat"
                expandedId={expanded}
                onToggle={setExpanded}

                title="NFS-e Pend. Faturamento"
                value={kpis.nfsePendentesFaturamento}
                subtitle="Serviços aguardando faturar"
                icon={<Receipt size={20} className="text-gray-700" />}
                badge="Fila"
                badgeLevel={kpis.nfsePendentesFaturamento > 0 ? "alerta" : "ok"}
              />

              <KpiCompact
                id="cotacao"
                expandedId={expanded}
                onToggle={setExpanded}

                title="Cotações sem CT-e"
                value={kpis.cotacoesSemCte}
                subtitle="Conversão pendente"
                icon={<HandCoins size={20} className="text-gray-700" />}
                badge="Converter"
                badgeLevel={kpis.cotacoesSemCte > 0 ? "info" : "ok"}
              />
            </div>
          )}

          {/* ======= Painel expandido (abaixo da linha 1) ======= */}
          <ExpandedPanel />

          {/* ======= Linha 2 (Tendência + Pendências por Tipo) ======= */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
            {config.chartTendencia && (
              <CardShell

                title="CT-e Autorizados (Últimos 7 dias)"
                icon={<Truck size={18} className="text-gray-700" />}
                className={config.chartPendencias ? "md:col-span-7" : "md:col-span-12"}
                right={
                  <div
                    className={[
                      "text-[11px] px-2 py-1 rounded-full border",
                      tendenciaCte >= 0
                        ? "border-green-200 text-green-700 bg-green-50"
                        : "border-red-200 text-red-700 bg-red-50",
                    ].join(" ")}
                  >
                    Tendência: {tendenciaCte >= 0 ? "+" : ""}
                    {fmtPct(tendenciaCte)}
                  </div>
                }
              >
                <div className="text-[12px] text-gray-500 mb-2">
                  Volume diário (mock) para dar “pulso” do operacional
                </div>

                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={volumeCte7dias}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="dia" />
                      <YAxis />
                      <Tooltip formatter={(v) => [`${v}`, "CT-e"]} />
                      <Line type="monotone" dataKey="qtd" strokeWidth={3} dot />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardShell>
            )}

            {config.chartPendencias && (
              <CardShell

                title="Pendências Operacionais por Tipo"
                icon={<FileWarning size={18} className="text-gray-700" />}
                className={config.chartTendencia ? "md:col-span-5" : "md:col-span-12"}
                right={
                  <div className="text-[11px] px-2 py-1 rounded-full border border-gray-200 text-gray-700 bg-gray-50">
                    Prioridades
                  </div>
                }
              >
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pendenciasPorTipo}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="tipo" hide />
                      <YAxis />
                      <Tooltip
                        formatter={(v) => [`${v}`, "Qtd."]}
                        labelFormatter={(lbl, payload) => payload?.[0]?.payload?.tipo || ""}
                      />
                      <Bar dataKey="qtd">
                        {pendenciasPorTipo.map((e, i) => (
                          <Cell key={i} fill={e.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-2 space-y-1">
                  {pendenciasPorTipo.map((x, i) => (
                    <div key={i} className="text-[12px] flex items-center gap-2">
                      <span
                        className="w-[10px] h-[10px] rounded-sm inline-block"
                        style={{ background: x.color }}
                      />
                      <span className="text-gray-700">
                        {x.tipo} ({x.qtd})
                      </span>
                    </div>
                  ))}
                </div>
              </CardShell>
            )}
          </div>

          {/* ======= Linha 3 (Donuts) ======= */}
          {config.donutsDia && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
              {renderDonut(
                "DONUT_COLETAS_DO_DIA",
                "Coletas do Dia",
                <ClipboardList size={18} className="text-gray-700" />,
                coletasDiaPct,
                "Total Coletas"
              )}

              {renderDonut(
                "DONUT_VIAGENS_DO_DIA",
                "Viagens do Dia",
                <Truck size={18} className="text-gray-700" />,
                viagensDiaPct,
                "Total Viagens"
              )}

              {renderDonut(
                "DONUT_CTE_DO_DIA",
                "CT-e do Dia",
                <FileText size={18} className="text-gray-700" />,
                ctesDiaPct,
                "Total CT-e"
              )}
            </div>
          )}

          {/* ======= Linha 4 (CT-e mês + Ocorrências + Fila) ======= */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
            {config.donutMes && (
              <CardShell

                title="CT-e do Mês"
                icon={<FileText size={18} className="text-gray-700" />}
                className="md:col-span-4"
                right={
                  <div className="text-[11px] px-2 py-1 rounded-full border border-gray-200 text-gray-700 bg-gray-50">
                    Mês atual
                  </div>
                }
              >
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ctesMesPct}
                        dataKey="value"
                        cx="40%"
                        cy="45%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={2}
                      >
                        {ctesMesPct.map((e, i) => (
                          <Cell key={i} fill={e.color} />
                        ))}
                      </Pie>

                      <Tooltip
                        formatter={(value, name, props) => [
                          `${value} (${props?.payload?.percent ?? "0"}%)`,
                          name,
                        ]}
                      />

                      <Legend
                        verticalAlign="middle"
                        align="right"
                        layout="vertical"
                        formatter={(value) => {
                          const item = ctesMesPct.find((d) => d.name === value);
                          return `${value} (${item?.value ?? 0})`;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-1 text-[12px] text-gray-600">
                  Total: <b className="text-gray-800">{sum(ctesMes, "value")}</b>
                </div>
              </CardShell>
            )}

            {config.donutOcorrencias && (
              <CardShell

                title="Ocorrências de CT-e"
                icon={<AlertTriangle size={18} className="text-gray-700" />}
                className="md:col-span-4"
                right={
                  <div className="text-[11px] px-2 py-1 rounded-full border border-gray-200 text-gray-700 bg-gray-50">
                    Qualidade
                  </div>
                }
              >
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ocorrenciasCtePct}
                        dataKey="value"
                        cx="40%"
                        cy="45%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={2}
                      >
                        {ocorrenciasCtePct.map((e, i) => (
                          <Cell key={i} fill={e.color} />
                        ))}
                      </Pie>

                      <Tooltip
                        formatter={(value, name, props) => [
                          `${value} (${props?.payload?.percent ?? "0"}%)`,
                          name,
                        ]}
                      />

                      <Legend
                        verticalAlign="middle"
                        align="right"
                        layout="vertical"
                        formatter={(value) => {
                          const item = ocorrenciasCtePct.find((d) => d.name === value);
                          return `${value} (${item?.value ?? 0})`;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-1 text-[12px] text-gray-600">
                  Total: <b className="text-gray-800">{sum(ocorrenciasCte, "value")}</b>
                </div>
              </CardShell>
            )}

            {config.listaFila && (
              <CardShell

                title="Fila de Pendências"
                icon={<PackageCheck size={18} className="text-gray-700" />}
                className="md:col-span-4"
                right={
                  <div className="text-[11px] px-2 py-1 rounded-full border border-green-200 text-green-700 bg-green-50">
                    Ações rápidas
                  </div>
                }
              >
                <div className="text-[12px] text-gray-500 mb-2">
                  Próximos passos para destravar o operacional (mock)
                </div>

                <div className="divide-y border border-gray-200 rounded-lg overflow-hidden">
                  {filaPendencias.map((x, i) => (
                    <div key={i} className="px-3 py-2 flex items-center gap-3">
                      <div className="text-[11px] text-gray-500 w-[60px] shrink-0">
                        {x.hora}
                      </div>
                      <div className="text-[13px] text-gray-800">{x.texto}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-2 text-[12px] text-gray-600 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-gray-700" />
                  <span>Objetivo: reduzir pendências e evitar acúmulo no faturamento.</span>
                </div>
              </CardShell>
            )}
          </div>

          {/* ======= Rodapé “micro-insight” (opcional) ======= */}
          <div className="mt-4 bg-white border border-gray-200 rounded-xl shadow-sm p-3 flex items-center gap-3">
            <div className="w-[40px] h-[40px] rounded-lg bg-gray-100 flex items-center justify-center">
              {tendenciaCte >= 0 ? (
                <TrendingUp size={18} className="text-gray-700" />
              ) : (
                <TrendingDown size={18} className="text-gray-700" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-gray-800">
                Insight do Dia (mock)
              </div>
              <div className="text-[12px] text-gray-600 truncate">
                Se Existir Manifesto em Aberto, Priorize o Encerramento para que não trave sua Operação.
              </div>
            </div>

            <div className="text-[11px] px-2 py-1 rounded-full border border-gray-200 text-gray-700 bg-gray-50">
              Dica operacional
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
