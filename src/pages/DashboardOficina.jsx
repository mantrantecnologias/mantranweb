// src/pages/DashboardOficina.jsx
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
    Wrench,
    Fuel,
    Package,
    ClipboardList,
    AlertTriangle,
    Gauge,
    CalendarClock,
    ChevronDown,
    ChevronUp,
    TrendingUp,
    TrendingDown,
} from "lucide-react";

/* =========================================================
   DASHBOARD - OFICINA (VISÃO GERAL)
   ✅ Mantém KPIs compactos (linha 1)
   ✅ Ao clicar no KPI, expande ABAIXO com detalhes (igual sua ideia da imagem)
   ✅ Serviços por Tipo: BARRAS coloridas (não corta)
   ✅ Custo Mensal (não faturamento)
   ✅ Consumo: Meta vs Real + Desvio por veículo (ouro)
   ✅ Tudo dentro do dashboard (sem navegar)
========================================================= */

const cores = {
    verde: "#4ade80",
    azul: "#60a5fa",
    vermelho: "#f87171",
    amarelo: "#facc15",
    cinza: "#94a3b8",
};

function pillClass(level) {
    if (level === "critico") return "border-red-200 text-red-700 bg-red-50";
    if (level === "alerta") return "border-yellow-200 text-yellow-800 bg-yellow-50";
    if (level === "info") return "border-blue-200 text-blue-700 bg-blue-50";
    return "border-green-200 text-green-700 bg-green-50";
}

function CardShell({ title, icon, right, children, className = "" }) {
    return (
        <div
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

function fmtBRMoney(v) {
    return `R$ ${Number(v || 0).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
    })}`;
}

function fmtPct(v) {
    return `${Number(v || 0).toLocaleString("pt-BR", {
        minimumFractionDigits: 1,
    })}%`;
}

function sum(arr, key) {
    return (arr || []).reduce((s, x) => s + (Number(x?.[key]) || 0), 0);
}

function addPercent(arr, key = "value") {
    const t = sum(arr, key) || 1;
    return (arr || []).map((x) => ({
        ...x,
        percent: (((Number(x?.[key]) || 0) / t) * 100).toFixed(1),
    }));
}

export default function DashboardOficina({ onClose }) {
    const [naoExibir, setNaoExibir] = useState(false);

    // qual KPI está expandido (null = nenhum)
    const [expanded, setExpanded] = useState(null);

    // =============================
    // CONFIG DO DASHBOARD (lê de localStorage)
    // =============================
    const config = useMemo(() => {
        const saved = localStorage.getItem("ofi_dashboard_config");
        if (saved) return JSON.parse(saved);
        return {
            kpis: true,
            chartConsumo: true,
            chartServicos: true,
            bombaInterna: true,
            donutStatusOS: true,
            desvioVeiculo: true,
            agendamentos: true,
            custoMensal: true,
            servicosRecentes: true,
        };
    }, []);

    const tituloTopo = useMemo(() => "DASHBOARD - OFICINA (VISÃO GERAL)", []);

    /* =========================
       MOCKS (substituir pela API depois)
    ========================= */

    // KPIs compactos
    const kpis = {
        veiculosEmServico: 12,
        osAbertas: 9,
        preventivasVencidas: 6,
        estoqueCritico: 5,
    };

    // OS Status (donut)
    const statusOs = [
        { name: "Não Iniciado", value: 5, color: cores.vermelho },
        { name: "Em Andamento", value: 8, color: cores.azul },
        { name: "Encerrado", value: 12, color: cores.verde },
    ];
    const statusOsPct = addPercent(statusOs);

    // Consumo combustível: meta vs real (linha)
    const consumoCombMetaReal = [
        { mes: "Out", meta: 8.5, real: 8.2 },
        { mes: "Nov", meta: 8.5, real: 8.6 },
        { mes: "Dez", meta: 8.6, real: 8.4 },
        { mes: "Jan", meta: 8.7, real: 9.1 },
        { mes: "Fev", meta: 8.7, real: 8.9 },
        { mes: "Mar", meta: 8.8, real: 9.4 },
    ];

    // tendência do real (último vs penúltimo)
    const tendenciaComb = useMemo(() => {
        const last = consumoCombMetaReal?.[consumoCombMetaReal.length - 1];
        const prev = consumoCombMetaReal?.[consumoCombMetaReal.length - 2];
        if (!last || !prev || !prev.real) return 0;
        return ((last.real - prev.real) / prev.real) * 100;
    }, [consumoCombMetaReal]);

    // Desvio por veículo (card ouro)
    const desvioPorVeiculo = [
        { veiculo: "EVO1623", real: 9.6, meta: 8.8, desvioPct: 9.1 },
        { veiculo: "QWE9901", real: 9.3, meta: 8.7, desvioPct: 6.9 },
        { veiculo: "ABC1234", real: 9.1, meta: 8.7, desvioPct: 4.6 },
        { veiculo: "KLM7788", real: 8.6, meta: 8.6, desvioPct: 0.0 },
        { veiculo: "RXW4156", real: 8.2, meta: 8.8, desvioPct: -6.8 },
    ];

    // Serviços por tipo (BARRAS coloridas: vermelho/azul/amarelo/verde)
    const servicosPorTipo = [
        { tipo: "OS Corretiva", qtd: 10, color: cores.vermelho },
        { tipo: "Pneus/Rodízio", qtd: 18, color: cores.azul },
        { tipo: "Preventiva", qtd: 14, color: cores.amarelo },
        { tipo: "Troca de Óleo", qtd: 28, color: cores.verde },
    ];

    // Bomba interna
    const bomba = {
        capacidadeLitros: 5000,
        nivelLitros: 1850, // mude pra 1450 pra ver alerta
        consumoSemanaLitros: 920,
        alertaMinimoLitros: 1500,
    };
    const bombaPct = Math.max(
        0,
        Math.min(100, (bomba.nivelLitros / bomba.capacidadeLitros) * 100)
    );
    const bombaEmAlerta = bomba.nivelLitros <= bomba.alertaMinimoLitros;

    // Serviços recentes
    const servicosRecentes = [
        { hora: "10:00", texto: "Troca de Óleo - EVO1623" },
        { hora: "11:30", texto: "Rodízio de Pneus - RXW4156" },
        { hora: "14:00", texto: "OS Corretiva - ABC1234 (Freio)" },
        { hora: "15:10", texto: "Entrada de Item - Filtro de Óleo (Estoque)" },
    ];

    // Próximos agendamentos
    const proximosAgendamentos = [
        { data: "15/03", hora: "09:00", texto: "Preventiva - EVO1623 (Checklist)" },
        { data: "16/03", hora: "14:30", texto: "Troca de Pneus - RXW4156" },
        { data: "17/03", hora: "10:00", texto: "OS - ABC1234 (Alinhamento)" },
    ];

    // Custo mensal (OS internas custo estimado + externas valor real)
    const custoMes = 18750.55;

    /* =========================
       DETALHES EXPANDIDOS (mock)
    ========================= */

    const detalhesVeiculosEmServico = [
        { veiculo: "EVO1623", status: "Troca de Óleo", prioridade: "Média" },
        { veiculo: "RXW4156", status: "Pneus/Rodízio", prioridade: "Alta" },
        { veiculo: "ABC1234", status: "OS Corretiva (Freio)", prioridade: "Alta" },
        { veiculo: "QWE9901", status: "Preventiva (Checklist)", prioridade: "Média" },
    ];

    const detalhesOsAbertas = [
        { os: "000812", veiculo: "ABC1234", tipo: "Corretiva", status: "Não Iniciado" },
        { os: "000829", veiculo: "RXW4156", tipo: "Pneus", status: "Em Andamento" },
        { os: "000845", veiculo: "EVO1623", tipo: "Óleo", status: "Em Andamento" },
        { os: "000851", veiculo: "QWE9901", tipo: "Preventiva", status: "Não Iniciado" },
    ];

    const detalhesPreventivasVencidas = [
        { veiculo: "EVO1623", venc: "10/03", dias: 6 },
        { veiculo: "ABC1234", venc: "08/03", dias: 8 },
        { veiculo: "KLM7788", venc: "05/03", dias: 11 },
        { veiculo: "RXW4156", venc: "02/03", dias: 14 },
    ];

    const estoqueCriticoTop5 = [
        { item: "Filtro de Óleo", saldo: 2, minimo: 10 },
        { item: "Pastilha de Freio", saldo: 4, minimo: 8 },
        { item: "Óleo 15W40 (L)", saldo: 30, minimo: 80 },
        { item: "Pneu 295/80", saldo: 1, minimo: 6 },
        { item: "Graxa (Kg)", saldo: 3, minimo: 12 },
    ];

    const ExpandedPanel = () => {
        if (!expanded) return null;

        const wrap = (title, subtitle, children) => (
            <div className="mt-3 bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-gray-800">{title}</div>
                        {subtitle ? (
                            <div className="text-[12px] text-gray-500 mt-1">{subtitle}</div>
                        ) : null}
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

        if (expanded === "veiculos") {
            return wrap(
                "Veículos em Serviço (Detalhes)",
                "Lista rápida do que está em manutenção agora (mock)",
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-3 py-2 text-[12px] font-semibold text-gray-700">
                        Em manutenção
                    </div>
                    <div className="divide-y">
                        {detalhesVeiculosEmServico.map((x, i) => (
                            <div key={i} className="px-3 py-2 flex items-center justify-between gap-3">
                                <div className="text-[12px] text-gray-800 font-semibold">{x.veiculo}</div>
                                <div className="text-[12px] text-gray-600 flex-1 truncate">{x.status}</div>
                                <div
                                    className={[
                                        "text-[11px] px-2 py-1 rounded-full border shrink-0",
                                        x.prioridade === "Alta"
                                            ? "border-red-200 text-red-700 bg-red-50"
                                            : "border-yellow-200 text-yellow-800 bg-yellow-50",
                                    ].join(" ")}
                                >
                                    {x.prioridade}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (expanded === "os") {
            return wrap(
                "OS Abertas (Detalhes)",
                "Top OS aguardando execução / em andamento (mock)",
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-3 py-2 text-[12px] font-semibold text-gray-700">
                        Últimas OS abertas
                    </div>
                    <div className="divide-y">
                        {detalhesOsAbertas.map((x, i) => (
                            <div key={i} className="px-3 py-2 grid grid-cols-12 gap-2 items-center">
                                <div className="col-span-2 text-[12px] text-gray-800 font-semibold">
                                    OS {x.os}
                                </div>
                                <div className="col-span-2 text-[12px] text-gray-700">{x.veiculo}</div>
                                <div className="col-span-4 text-[12px] text-gray-600">{x.tipo}</div>
                                <div className="col-span-4 flex justify-end">
                                    <div
                                        className={[
                                            "text-[11px] px-2 py-1 rounded-full border",
                                            x.status === "Em Andamento"
                                                ? "border-blue-200 text-blue-700 bg-blue-50"
                                                : "border-red-200 text-red-700 bg-red-50",
                                        ].join(" ")}
                                    >
                                        {x.status}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (expanded === "preventivas") {
            return wrap(
                "Preventivas Vencidas (Detalhes)",
                "Veículos fora do prazo e há quantos dias (mock)",
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-3 py-2 text-[12px] font-semibold text-gray-700">
                        Vencidas
                    </div>
                    <div className="divide-y">
                        {detalhesPreventivasVencidas.map((x, i) => (
                            <div key={i} className="px-3 py-2 flex items-center justify-between gap-3">
                                <div className="text-[12px] text-gray-800 font-semibold">{x.veiculo}</div>
                                <div className="text-[12px] text-gray-600">
                                    Venceu em {x.venc}
                                </div>
                                <div className="text-[12px] font-semibold text-red-700">
                                    {x.dias} dias
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (expanded === "estoque") {
            return wrap(
                "Estoque Crítico (Detalhes)",
                "Top 5 itens abaixo do mínimo (mock)",
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-3 py-2 text-[12px] font-semibold text-gray-700">
                        Top 5 Itens Críticos
                    </div>
                    <div className="divide-y">
                        {estoqueCriticoTop5.map((x, i) => (
                            <div key={i} className="px-3 py-2 flex items-center justify-between gap-3">
                                <div className="text-[12px] text-gray-800 truncate">{x.item}</div>
                                <div className="text-[12px] text-gray-600 shrink-0">
                                    <span className="font-semibold text-red-700">{x.saldo}</span>
                                    {" / "}
                                    <span className="text-gray-500">mín {x.minimo}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
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
                                id="veiculos"
                                expandedId={expanded}
                                onToggle={setExpanded}
                                title="Veículos em Serviço"
                                value={kpis.veiculosEmServico}
                                subtitle="Em manutenção agora"
                                icon={<Wrench size={20} className="text-gray-700" />}
                                badge="Ativo"
                                badgeLevel="ok"
                            />

                            <KpiCompact
                                id="os"
                                expandedId={expanded}
                                onToggle={setExpanded}
                                title="OS Abertas"
                                value={kpis.osAbertas}
                                subtitle="Aguardando execução"
                                icon={<ClipboardList size={20} className="text-gray-700" />}
                                badge="Priorizar"
                                badgeLevel="info"
                            />

                            <KpiCompact
                                id="preventivas"
                                expandedId={expanded}
                                onToggle={setExpanded}
                                title="Preventivas Vencidas"
                                value={kpis.preventivasVencidas}
                                subtitle="Veículos fora do prazo"
                                icon={<AlertTriangle size={20} className="text-gray-700" />}
                                badge="Atenção"
                                badgeLevel={kpis.preventivasVencidas > 0 ? "alerta" : "ok"}
                            />

                            <KpiCompact
                                id="estoque"
                                expandedId={expanded}
                                onToggle={setExpanded}
                                title="Estoque Crítico"
                                value={kpis.estoqueCritico}
                                subtitle="Itens abaixo do mínimo"
                                icon={<Package size={20} className="text-gray-700" />}
                                badge="Repor"
                                badgeLevel={kpis.estoqueCritico > 0 ? "critico" : "ok"}
                            />
                        </div>
                    )}

                    {/* ======= Painel expandido (fica abaixo da linha 1) ======= */}
                    {config.kpis && <ExpandedPanel />}

                    {/* ======= Linha 2 ======= */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
                        {/* Consumo: Meta vs Real */}
                        {config.chartConsumo && (
                            <CardShell
                                className="md:col-span-6"
                                title="Consumo de Combustível (Meta vs Real)"
                                icon={<Fuel size={18} className="text-gray-700" />}
                                right={
                                    <div
                                        className={[
                                            "text-[11px] px-2 py-1 rounded-full border",
                                            tendenciaComb >= 0
                                                ? "border-red-200 text-red-700 bg-red-50"
                                                : "border-green-200 text-green-700 bg-green-50",
                                        ].join(" ")}
                                    >
                                        Tendência: {tendenciaComb >= 0 ? "+" : ""}
                                        {fmtPct(tendenciaComb)}
                                    </div>
                                }
                            >
                                <div className="text-[12px] text-gray-500 mb-2">
                                    Média mensal (mock): L/100km
                                </div>

                                <div className="h-[210px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={consumoCombMetaReal}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="mes" />
                                            <YAxis />
                                            <Tooltip
                                                formatter={(v, name) => [
                                                    `${v} L/100km`,
                                                    name === "meta" ? "Meta" : "Real",
                                                ]}
                                            />
                                            <Legend
                                                formatter={(value) => (value === "meta" ? "Meta" : "Real")}
                                            />
                                            <Line type="monotone" dataKey="meta" stroke="#16a34a" strokeWidth={2} dot />
                                            <Line type="monotone" dataKey="real" stroke="#dc2626" strokeWidth={3} dot />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="mt-2 text-[12px] text-gray-600">
                                    Dica: desvio positivo costuma apontar (pneu + alinhamento + preventiva atrasada).
                                </div>
                            </CardShell>
                        )}

                        {/* Serviços por Tipo (BARRAS coloridas) */}
                        {config.chartServicos && (
                            <CardShell
                                className="md:col-span-3"
                                title="Serviços por Tipo"
                                icon={<Wrench size={18} className="text-gray-700" />}
                                right={
                                    <div className="text-[11px] px-2 py-1 rounded-full border border-blue-200 text-blue-700 bg-blue-50">
                                        Gráfico
                                    </div>
                                }
                            >
                                <div className="h-[240px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={servicosPorTipo}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="tipo" hide />
                                            <YAxis />
                                            <Tooltip
                                                formatter={(v) => [`${v}`, "Qtd. Serviços"]}
                                                labelFormatter={(lbl, payload) =>
                                                    payload?.[0]?.payload?.tipo || ""
                                                }
                                            />
                                            <Bar dataKey="qtd">
                                                {servicosPorTipo.map((e, i) => (
                                                    <Cell key={i} fill={e.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* legenda colorida (igual você pediu) */}
                                <div className="mt-2 space-y-1">
                                    {servicosPorTipo.map((x, i) => (
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

                        {/* Bomba Interna */}
                        {config.bombaInterna && (
                            <CardShell
                                className="md:col-span-3"
                                title="Bomba Interna"
                                icon={<Gauge size={18} className="text-gray-700" />}
                                right={
                                    <div
                                        className={[
                                            "text-[11px] px-2 py-1 rounded-full border",
                                            bombaEmAlerta
                                                ? "border-red-200 text-red-700 bg-red-50"
                                                : "border-green-200 text-green-700 bg-green-50",
                                        ].join(" ")}
                                    >
                                        {bombaEmAlerta ? "Reabastecer" : "OK"}
                                    </div>
                                }
                            >
                                <div className="flex flex-col gap-3">
                                    <div>
                                        <div className="text-[12px] text-gray-600 flex items-center justify-between">
                                            <span>Nível</span>
                                            <b className="text-gray-800">
                                                {bomba.nivelLitros.toLocaleString("pt-BR")} L
                                            </b>
                                        </div>

                                        <div className="w-full h-[10px] rounded-full bg-gray-200 overflow-hidden mt-2">
                                            <div
                                                className={[
                                                    "h-full rounded-full",
                                                    bombaEmAlerta ? "bg-red-400" : "bg-green-400",
                                                ].join(" ")}
                                                style={{ width: `${bombaPct}%` }}
                                            />
                                        </div>

                                        <div className="text-[11px] text-gray-500 mt-1">
                                            Capacidade: {bomba.capacidadeLitros.toLocaleString("pt-BR")} L
                                            {" | "}
                                            Mínimo: {bomba.alertaMinimoLitros.toLocaleString("pt-BR")} L
                                        </div>
                                    </div>

                                    <div className="border-t pt-3">
                                        <div className="text-[12px] text-gray-600 flex items-center justify-between">
                                            <span>Consumo na semana</span>
                                            <b className="text-gray-800">
                                                {bomba.consumoSemanaLitros.toLocaleString("pt-BR")} L
                                            </b>
                                        </div>

                                        <div className="text-[11px] text-gray-500 mt-1">
                                            {bombaEmAlerta
                                                ? "Abaixo do mínimo. Programar compra urgente."
                                                : "Sugestão: acompanhar tendência semanal."}
                                        </div>
                                    </div>
                                </div>
                            </CardShell>
                        )}
                    </div>

                    {/* ======= Linha 3 ======= */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
                        {/* Status OS (donut) */}
                        {config.donutStatusOS && (
                            <CardShell
                                className="md:col-span-4"
                                title="Status das OS"
                                icon={<ClipboardList size={18} className="text-gray-700" />}
                            >
                                <div className="text-[12px] text-gray-500 mb-2">
                                    Distribuição por status
                                </div>

                                <div className="h-[220px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={statusOsPct}
                                                dataKey="value"
                                                cx="40%"
                                                cy="45%"
                                                innerRadius={45}
                                                outerRadius={70}
                                                paddingAngle={2}
                                            >
                                                {statusOsPct.map((e, i) => (
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
                                                    const item = statusOsPct.find((d) => d.name === value);
                                                    return `${value} (${item?.value ?? 0})`;
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="mt-2 text-[13px] font-semibold text-gray-700">
                                    Total OS:{" "}
                                    <span className="text-red-700 font-bold">{sum(statusOs, "value")}</span>
                                </div>
                            </CardShell>
                        )}

                        {/* Desvio por veículo (ouro) */}
                        {config.desvioVeiculo && (
                            <CardShell
                                className="md:col-span-5"
                                title="Consumo: Desvio por Veículo"
                                icon={<Fuel size={18} className="text-gray-700" />}
                                right={
                                    <div className="text-[11px] px-2 py-1 rounded-full border border-gray-200 text-gray-700 bg-gray-50">
                                        Top desvios
                                    </div>
                                }
                            >
                                <div className="text-[12px] text-gray-500 mb-2">
                                    Positivo = acima da meta (custo maior)
                                </div>

                                <div className="divide-y border border-gray-200 rounded-lg overflow-hidden">
                                    {desvioPorVeiculo
                                        .slice()
                                        .sort((a, b) => b.desvioPct - a.desvioPct)
                                        .slice(0, 5)
                                        .map((v, idx) => {
                                            const isUp = v.desvioPct > 0;
                                            const isZero = v.desvioPct === 0;
                                            const barPct = Math.min(100, Math.abs(v.desvioPct) * 8); // escala visual
                                            return (
                                                <div key={idx} className="px-3 py-2">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="text-[13px] font-semibold text-gray-800">
                                                            {v.veiculo}
                                                        </div>

                                                        <div className="text-[12px] text-gray-600 shrink-0">
                                                            Real: <b className="text-gray-800">{v.real}</b> | Meta:{" "}
                                                            <b className="text-gray-800">{v.meta}</b>
                                                        </div>
                                                    </div>

                                                    <div className="mt-2 flex items-center gap-2">
                                                        <div className="w-full h-[10px] rounded-full bg-gray-200 overflow-hidden">
                                                            <div
                                                                className={[
                                                                    "h-full rounded-full",
                                                                    isZero ? "bg-gray-400" : isUp ? "bg-red-400" : "bg-green-400",
                                                                ].join(" ")}
                                                                style={{ width: `${barPct}%` }}
                                                            />
                                                        </div>

                                                        <div
                                                            className={[
                                                                "text-[12px] font-semibold flex items-center gap-1 w-[90px] justify-end",
                                                                isZero ? "text-gray-600" : isUp ? "text-red-700" : "text-green-700",
                                                            ].join(" ")}
                                                        >
                                                            {isZero ? null : isUp ? (
                                                                <TrendingUp size={14} />
                                                            ) : (
                                                                <TrendingDown size={14} />
                                                            )}
                                                            {v.desvioPct > 0 ? "+" : ""}
                                                            {fmtPct(v.desvioPct)}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>

                                <div className="mt-2 text-[12px] text-gray-600">
                                    Dica: cruze “desvio” com pneus e preventiva pra achar o vilão rapidinho.
                                </div>
                            </CardShell>
                        )}

                        {/* Próximos Agendamentos */}
                        {config.agendamentos && (
                            <CardShell
                                className="md:col-span-3"
                                title="Próximos Agendamentos"
                                icon={<CalendarClock size={18} className="text-gray-700" />}
                                right={
                                    <button className="text-[12px] px-2 py-1 rounded border border-gray-200 bg-gray-50 text-gray-700">
                                        Ver todos
                                    </button>
                                }
                            >
                                <div className="text-[12px] text-gray-500 mb-2">Agenda da semana</div>

                                <div className="divide-y">
                                    {proximosAgendamentos.map((a, idx) => (
                                        <div key={idx} className="py-2 flex items-center gap-3">
                                            <div className="text-[11px] text-gray-500 w-[90px] shrink-0">
                                                {a.data}, {a.hora}
                                            </div>
                                            <div className="text-[13px] text-gray-800">{a.texto}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardShell>
                        )}
                    </div>

                    {/* ======= Linha 4 ======= */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
                        {/* Custo Mensal */}
                        {config.custoMensal && (
                            <CardShell
                                className="md:col-span-7"
                                title="Custo Mensal (Oficina)"
                                icon={<Wrench size={18} className="text-gray-700" />}
                                right={
                                    <div className="text-[11px] px-2 py-1 rounded-full border border-yellow-200 text-yellow-800 bg-yellow-50">
                                        Este mês
                                    </div>
                                }
                            >
                                <div className="text-[28px] font-bold text-gray-900">
                                    {fmtBRMoney(custoMes)}
                                </div>
                                <div className="text-[12px] text-gray-500 mt-1">
                                    Considera OS internas (custo estimado) + externas (valor real) (mock)
                                </div>

                                <div className="mt-2 text-[12px] text-gray-600">
                                    Dica: custo alto + desvio de consumo geralmente aponta pneu/alinhamento e preventiva atrasada.
                                </div>
                            </CardShell>
                        )}

                        {/* Serviços Recentes */}
                        {config.servicosRecentes && (
                            <CardShell
                                className="md:col-span-5"
                                title="Serviços Recentes"
                                icon={<Wrench size={18} className="text-gray-700" />}
                                right={
                                    <button className="text-[12px] px-2 py-1 rounded border border-gray-200 bg-gray-50 text-gray-700">
                                        Ver todos
                                    </button>
                                }
                            >
                                <div className="text-[12px] text-gray-500 mb-2">Últimas atividades</div>

                                <div className="divide-y">
                                    {servicosRecentes.map((s, idx) => (
                                        <div key={idx} className="py-2 flex items-center gap-3">
                                            <div className="text-[11px] text-gray-500 w-[60px] shrink-0">
                                                {s.hora}
                                            </div>
                                            <div className="text-[13px] text-gray-800">{s.texto}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardShell>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
