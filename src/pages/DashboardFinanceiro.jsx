// src/pages/DashboardFinanceiro.jsx
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
    Wallet,
    ArrowDownCircle,
    ArrowUpCircle,
    FileText,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    ChevronDown,
    ChevronUp,
    Building2,
    HandCoins,
    BadgeDollarSign,
    Receipt,
} from "lucide-react";

/* =========================================================
   DASHBOARD 2.0 - FINANCEIRO (VISÃO GERAL)
   ✅ Visual no estilo Oficina/Operação: KPIs compactos + expansão
   ✅ Cards com NOMES claros (para tela de parâmetros depois)
   ✅ Foco transportadora:
      - Contas a Pagar / Receber
      - Atrasos (vencidas)
      - CT-e pendentes de faturamento
      - Fluxo de caixa (entrada x saída)
      - Top 10 Clientes / Fornecedores
      - Composição das despesas por categoria
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

function fmtBRMoney(v) {
    return `R$ ${Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
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

function CardShell({ cardName, title, icon, right, children, className = "" }) {
    return (
        <div
            data-card-name={cardName}
            className={[
                "bg-white border border-gray-200 rounded-xl shadow-sm p-4",
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
                        <div className="text-[11px] text-gray-400 truncate">{cardName}</div>
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
                        <div className={["text-[11px] px-2 py-1 rounded-full border", pillClass(badgeLevel)].join(" ")}>
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

export default function DashboardFinanceiro({ onClose, open = true }) {
    const [naoExibir, setNaoExibir] = useState(false);
    const [expanded, setExpanded] = useState(null);

    // CONFIGURAÇÃO DE VISIBILIDADE (Lê do localStorage)
    const [config] = useState(() => {
        const saved = localStorage.getItem("fin_dashboard_config");
        if (saved) return JSON.parse(saved);
        // Default: tudo true
        return {
            kpis: true,
            chartFluxo: true,
            chartDespesas: true,
            donutPagar: true,
            donutReceber: true,
            listaPendencias: true,
            tableClientes: true,
            tableFornecedores: true,
        };
    });

    const tituloTopo = useMemo(() => "DASHBOARD 2.0 - FINANCEIRO (VISÃO GERAL)", []);

    /* =========================
       MOCKS (trocar por API depois)
    ========================= */

    // KPIs compactos (linha 1)
    const kpis = {
        pagarAberto: 182340.75,
        pagarVencido: 28750.0,
        receberAberto: 245980.2,
        receberVencido: 19420.4,
        ctesPendFaturamento: 36,
    };

    // Fluxo de caixa (Entradas x Saídas - últimos 6 meses)
    const fluxoCaixa = [
        { mes: "Out", entrada: 420000, saida: 390000 },
        { mes: "Nov", entrada: 460000, saida: 445000 },
        { mes: "Dez", entrada: 520000, saida: 510000 },
        { mes: "Jan", entrada: 480000, saida: 505000 },
        { mes: "Fev", entrada: 510000, saida: 470000 },
        { mes: "Mar", entrada: 545000, saida: 498000 },
    ];

    const tendenciaFluxo = useMemo(() => {
        const last = fluxoCaixa?.[fluxoCaixa.length - 1];
        const prev = fluxoCaixa?.[fluxoCaixa.length - 2];
        if (!last || !prev) return 0;
        const lastSaldo = (last.entrada || 0) - (last.saida || 0);
        const prevSaldo = (prev.entrada || 0) - (prev.saida || 0);
        if (!prevSaldo) return 0;
        return ((lastSaldo - prevSaldo) / Math.abs(prevSaldo)) * 100;
    }, [fluxoCaixa]);

    // Pizza: Contas a pagar por status
    const pagarPorStatus = addPercent([
        { name: "Em Dia", value: 68, color: cores.verde },
        { name: "A Vencer", value: 22, color: cores.azul },
        { name: "Vencido", value: 10, color: cores.vermelho },
    ]);

    // Pizza: Contas a receber por status
    const receberPorStatus = addPercent([
        { name: "Em Dia", value: 72, color: cores.verde },
        { name: "A Vencer", value: 18, color: cores.azul },
        { name: "Vencido", value: 10, color: cores.vermelho },
    ]);

    // Barras: Despesas por categoria (mês atual)
    const despesasCategoria = [
        { categoria: "Agregados", valor: 148000, color: cores.laranja },
        { categoria: "Pedágio", valor: 52000, color: cores.amarelo },
        { categoria: "Manutenção", valor: 61000, color: cores.azul },
        { categoria: "Folha", valor: 92000, color: cores.vermelho },
        { categoria: "Terceiros", valor: 44000, color: cores.cinza },
    ];

    // Top 10 clientes (receita) e fornecedores (despesa)
    const topClientes = [
        { nome: "ACME LTDA", valor: 98000 },
        { nome: "BETA LOG", valor: 84200 },
        { nome: "OMEGA SA", valor: 80100 },
        { nome: "XPTO", valor: 65500 },
        { nome: "DELTA", valor: 60200 },
        { nome: "ALFA", valor: 58800 },
        { nome: "GAMA", valor: 54100 },
        { nome: "NORTE", valor: 49900 },
        { nome: "SUL", valor: 46200 },
        { nome: "LITORAL", valor: 43100 },
    ];

    const topFornecedores = [
        { nome: "Posto BR 01", valor: 121000 },
        { nome: "Concessionária X", valor: 69000 },
        { nome: "Pedágio SA", valor: 54000 },
        { nome: "Borracharia Y", valor: 42000 },
        { nome: "Oficina Z", valor: 38700 },
        { nome: "Seguradora", valor: 31000 },
        { nome: "Peças & Cia", valor: 29800 },
        { nome: "Serviços Terceiros", valor: 27200 },
        { nome: "TI & Infra", valor: 19600 },
        { nome: "Outros", valor: 17400 },
    ];

    // Lista: “Pendências que doem” (mock)
    const filaPendencias = [
        { hora: "09:05", texto: "12 títulos vencidos (fornecedor combustível) - renegociar/parcelar" },
        { hora: "10:22", texto: "CT-e autorizados aguardando faturamento: 36" },
        { hora: "11:40", texto: "Recebíveis vencidos (cliente XPTO): R$ 8.450,00" },
        { hora: "14:10", texto: "NFS-e pendente de emissão (serviços adicionais) - 7 itens" },
    ];

    // Detalhes expandidos (mock)
    const detalhesPagarVencido = [
        { doc: "NF 8921", fornecedor: "Posto BR 01", dias: 5, valor: 12450.2 },
        { doc: "BOL 1120", fornecedor: "Pedágio SA", dias: 2, valor: 3890.0 },
        { doc: "NF 9012", fornecedor: "Oficina Z", dias: 9, valor: 7800.0 },
        { doc: "REC 554", fornecedor: "Peças & Cia", dias: 1, valor: 1610.5 },
    ];

    const detalhesReceberVencido = [
        { doc: "CT-e 352401000021", cliente: "XPTO", dias: 6, valor: 8450.0 },
        { doc: "FAT 000889", cliente: "OMEGA SA", dias: 3, valor: 12990.4 },
        { doc: "FAT 000901", cliente: "BETA LOG", dias: 2, valor: 4980.0 },
    ];

    const detalhesCtePendFat = [
        { cte: "352401000031", cliente: "ACME LTDA", horas: 18 },
        { cte: "352401000034", cliente: "BETA LOG", horas: 9 },
        { cte: "352401000038", cliente: "OMEGA SA", horas: 26 },
        { cte: "352401000041", cliente: "XPTO", horas: 12 },
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

        if (expanded === "pagarVencido") {
            return wrap(
                "Contas a Pagar Vencidas (Detalhes)",
                "Top vencimentos para priorizar (mock)",
                tableShell(
                    "Vencidos",
                    detalhesPagarVencido.map((x, i) => (
                        <div key={i} className="px-3 py-2 grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-3 text-[12px] text-gray-800 font-semibold truncate">{x.doc}</div>
                            <div className="col-span-5 text-[12px] text-gray-600 truncate">{x.fornecedor}</div>
                            <div className="col-span-2 text-[12px] text-red-700 font-semibold text-right">{x.dias}d</div>
                            <div className="col-span-2 text-[12px] text-gray-800 font-semibold text-right">{fmtBRMoney(x.valor)}</div>
                        </div>
                    ))
                )
            );
        }

        if (expanded === "receberVencido") {
            return wrap(
                "Contas a Receber Vencidas (Detalhes)",
                "Top atrasos para cobrança (mock)",
                tableShell(
                    "Vencidos",
                    detalhesReceberVencido.map((x, i) => (
                        <div key={i} className="px-3 py-2 grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-5 text-[12px] text-gray-800 font-semibold truncate">{x.doc}</div>
                            <div className="col-span-4 text-[12px] text-gray-600 truncate">{x.cliente}</div>
                            <div className="col-span-1 text-[12px] text-red-700 font-semibold text-right">{x.dias}d</div>
                            <div className="col-span-2 text-[12px] text-gray-800 font-semibold text-right">{fmtBRMoney(x.valor)}</div>
                        </div>
                    ))
                )
            );
        }

        if (expanded === "ctePendFat") {
            return wrap(
                "CT-e Pendentes de Faturamento (Detalhes)",
                "Top CT-es aguardando faturar (mock)",
                tableShell(
                    "Pendentes",
                    detalhesCtePendFat.map((x, i) => (
                        <div key={i} className="px-3 py-2 grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-5 text-[12px] text-gray-800 font-semibold truncate">{x.cte}</div>
                            <div className="col-span-5 text-[12px] text-gray-600 truncate">{x.cliente}</div>
                            <div className="col-span-2 text-[12px] text-yellow-800 font-semibold text-right">{x.horas}h</div>
                        </div>
                    ))
                )
            );
        }

        return null;
    };

    const totalPagarStatus = sum(pagarPorStatus, "value");
    const totalReceberStatus = sum(receberPorStatus, "value");

    // Saldo mês (mock): entrada - saída do último ponto
    const saldoMes = useMemo(() => {
        const last = fluxoCaixa?.[fluxoCaixa.length - 1];
        if (!last) return 0;
        return (last.entrada || 0) - (last.saida || 0);
    }, [fluxoCaixa]);

    const saldoMesLevel = saldoMes >= 0 ? "ok" : "critico";

    return (
        <div
            className={`fixed top-[48px] right-0 bottom-0 z-50 flex items-center justify-center bg-black/40
            transition-all duration-300
            ${open ? "left-52" : "left-14"}
            `}
        >
            <div className="bg-gray-50 w-full h-full max-w-[1200px] max-h-[90vh] rounded shadow-lg border border-gray-300 flex flex-col overflow-hidden">
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
                                id="pagarVencido"
                                expandedId={expanded}
                                onToggle={setExpanded}

                                title="Contas a Pagar Vencidas"
                                value={fmtBRMoney(kpis.pagarVencido)}
                                subtitle={`Em aberto total: ${fmtBRMoney(kpis.pagarAberto)}`}
                                icon={<ArrowDownCircle size={20} className="text-gray-700" />}
                                badge="Priorizar"
                                badgeLevel={kpis.pagarVencido > 0 ? "critico" : "ok"}
                            />

                            <KpiCompact
                                id="receberVencido"
                                expandedId={expanded}
                                onToggle={setExpanded}

                                title="Contas a Receber Vencidas"
                                value={fmtBRMoney(kpis.receberVencido)}
                                subtitle={`Em aberto total: ${fmtBRMoney(kpis.receberAberto)}`}
                                icon={<ArrowUpCircle size={20} className="text-gray-700" />}
                                badge="Cobrar"
                                badgeLevel={kpis.receberVencido > 0 ? "alerta" : "ok"}
                            />

                            <KpiCompact
                                id="ctePendFat"
                                expandedId={expanded}
                                onToggle={setExpanded}

                                title="CT-e Pend. Faturamento"
                                value={kpis.ctesPendFaturamento}
                                subtitle="Autorizados aguardando faturar"
                                icon={<FileText size={20} className="text-gray-700" />}
                                badge="Fila"
                                badgeLevel={kpis.ctesPendFaturamento > 0 ? "alerta" : "ok"}
                            />

                            <KpiCompact
                                id="saldoMes"
                                expandedId={expanded}
                                onToggle={setExpanded}

                                title="Saldo do Mês (Caixa)"
                                value={fmtBRMoney(saldoMes)}
                                subtitle="Entrada - Saída (mês atual)"
                                icon={<Wallet size={20} className="text-gray-700" />}
                                badge={saldoMes >= 0 ? "Positivo" : "Negativo"}
                                badgeLevel={saldoMesLevel}
                            />
                        </div>
                    )}

                    {/* ======= Painel expandido (abaixo da linha 1) ======= */}
                    <ExpandedPanel />

                    {/* ======= Linha 2: Fluxo de Caixa + Despesas Categoria ======= */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
                        {config.chartFluxo && (
                            <CardShell

                                title="Fluxo de Caixa (Entradas x Saídas)"
                                icon={<BadgeDollarSign size={18} className="text-gray-700" />}
                                className="md:col-span-7"
                                right={
                                    <div
                                        className={[
                                            "text-[11px] px-2 py-1 rounded-full border",
                                            tendenciaFluxo >= 0
                                                ? "border-green-200 text-green-700 bg-green-50"
                                                : "border-red-200 text-red-700 bg-red-50",
                                        ].join(" ")}
                                    >
                                        Tendência: {tendenciaFluxo >= 0 ? "+" : ""}
                                        {fmtPct(tendenciaFluxo)}
                                    </div>
                                }
                            >
                                <div className="text-[12px] text-gray-500 mb-2">
                                    Comparativo mensal (mock) para entender “fôlego” do caixa
                                </div>

                                <div className="h-[240px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={fluxoCaixa}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="mes" />
                                            <YAxis />
                                            <Tooltip
                                                formatter={(v, name) => [fmtBRMoney(v), name === "entrada" ? "Entradas" : "Saídas"]}
                                            />
                                            <Legend
                                                formatter={(v) => (v === "entrada" ? "Entradas" : "Saídas")}
                                            />
                                            <Line type="monotone" dataKey="entrada" stroke="#16a34a" strokeWidth={3} dot />
                                            <Line type="monotone" dataKey="saida" stroke="#dc2626" strokeWidth={3} dot />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="mt-2 text-[12px] text-gray-600 flex items-center gap-2">
                                    {tendenciaFluxo >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                    <span>
                                        Dica: se “Saídas” encostar em “Entradas”, ajuste agenda de pagamentos.
                                    </span>
                                </div>
                            </CardShell>
                        )}

                        {config.chartDespesas && (
                            <CardShell

                                title="Despesas por Categoria (Mês)"
                                icon={<Receipt size={18} className="text-gray-700" />}
                                className="md:col-span-5"
                                right={
                                    <div className="text-[11px] px-2 py-1 rounded-full border border-gray-200 text-gray-700 bg-gray-50">
                                        Mês atual
                                    </div>
                                }
                            >
                                <div className="h-[260px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={despesasCategoria}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="categoria" hide />
                                            <YAxis />
                                            <Tooltip
                                                formatter={(v) => [fmtBRMoney(v), "Valor"]}
                                                labelFormatter={(lbl, payload) => payload?.[0]?.payload?.categoria || ""}
                                            />
                                            <Bar dataKey="valor">
                                                {despesasCategoria.map((e, i) => (
                                                    <Cell key={i} fill={e.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="mt-2 space-y-1">
                                    {despesasCategoria
                                        .slice()
                                        .sort((a, b) => b.valor - a.valor)
                                        .slice(0, 3)
                                        .map((x, i) => (
                                            <div key={i} className="text-[12px] text-gray-700 flex items-center gap-2">
                                                <span
                                                    className="w-[10px] h-[10px] rounded-sm inline-block"
                                                    style={{ background: x.color }}
                                                />
                                                <span className="truncate">
                                                    {x.categoria}: <b className="text-gray-800">{fmtBRMoney(x.valor)}</b>
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            </CardShell>
                        )}
                    </div>

                    {/* ======= Linha 3: Status Pagar/Receber + Pendências ======= */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
                        {config.donutPagar && (
                            <CardShell

                                title="Contas a Pagar (Status)"
                                icon={<ArrowDownCircle size={18} className="text-gray-700" />}
                                className="md:col-span-4"
                                right={
                                    <div className="text-[11px] px-2 py-1 rounded-full border border-gray-200 text-gray-700 bg-gray-50">
                                        Total: {totalPagarStatus}
                                    </div>
                                }
                            >
                                <div className="h-[220px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pagarPorStatus}
                                                dataKey="value"
                                                cx="40%"
                                                cy="45%"
                                                innerRadius={45}
                                                outerRadius={70}
                                                paddingAngle={2}
                                            >
                                                {pagarPorStatus.map((e, i) => (
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
                                                    const item = pagarPorStatus.find((d) => d.name === value);
                                                    return `${value} (${item?.value ?? 0})`;
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardShell>
                        )}

                        {config.donutReceber && (
                            <CardShell

                                title="Contas a Receber (Status)"
                                icon={<ArrowUpCircle size={18} className="text-gray-700" />}
                                className="md:col-span-4"
                                right={
                                    <div className="text-[11px] px-2 py-1 rounded-full border border-gray-200 text-gray-700 bg-gray-50">
                                        Total: {totalReceberStatus}
                                    </div>
                                }
                            >
                                <div className="h-[220px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={receberPorStatus}
                                                dataKey="value"
                                                cx="40%"
                                                cy="45%"
                                                innerRadius={45}
                                                outerRadius={70}
                                                paddingAngle={2}
                                            >
                                                {receberPorStatus.map((e, i) => (
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
                                                    const item = receberPorStatus.find((d) => d.name === value);
                                                    return `${value} (${item?.value ?? 0})`;
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardShell>
                        )}

                        {config.listaPendencias && (
                            <CardShell

                                title="Fila de Pendências (Financeiro)"
                                icon={<AlertTriangle size={18} className="text-gray-700" />}
                                className="md:col-span-4"
                                right={
                                    <div className="text-[11px] px-2 py-1 rounded-full border border-yellow-200 text-yellow-800 bg-yellow-50">
                                        Prioridades
                                    </div>
                                }
                            >
                                <div className="text-[12px] text-gray-500 mb-2">
                                    O que destrava caixa mais rápido (mock)
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
                                    <HandCoins size={14} className="text-gray-700" />
                                    <span>Objetivo: reduzir vencidos e acelerar faturamento.</span>
                                </div>
                            </CardShell>
                        )}
                    </div>

                    {/* ======= Linha 4: Top 10 Clientes / Fornecedores ======= */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
                        {config.tableClientes && (
                            <CardShell

                                title="Top 10 Clientes (Receita)"
                                icon={<Building2 size={18} className="text-gray-700" />}
                                className="md:col-span-6"
                                right={
                                    <div className="text-[11px] px-2 py-1 rounded-full border border-green-200 text-green-700 bg-green-50">
                                        Mês atual
                                    </div>
                                }
                            >
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 px-3 py-2 text-[12px] font-semibold text-gray-700">
                                        Ranking
                                    </div>

                                    <div className="divide-y">
                                        {topClientes.map((x, i) => (
                                            <div key={i} className="px-3 py-2 grid grid-cols-12 gap-2 items-center">
                                                <div className="col-span-1 text-[12px] text-gray-500">{i + 1}</div>
                                                <div className="col-span-7 text-[12px] text-gray-800 font-semibold truncate">
                                                    {x.nome}
                                                </div>
                                                <div className="col-span-4 text-[12px] text-gray-800 font-semibold text-right">
                                                    {fmtBRMoney(x.valor)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardShell>
                        )}

                        {config.tableFornecedores && (
                            <CardShell

                                title="Top 10 Fornecedores (Despesa)"
                                icon={<Building2 size={18} className="text-gray-700" />}
                                className="md:col-span-6"
                                right={
                                    <div className="text-[11px] px-2 py-1 rounded-full border border-red-200 text-red-700 bg-red-50">
                                        Mês atual
                                    </div>
                                }
                            >
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 px-3 py-2 text-[12px] font-semibold text-gray-700">
                                        Ranking
                                    </div>

                                    <div className="divide-y">
                                        {topFornecedores.map((x, i) => (
                                            <div key={i} className="px-3 py-2 grid grid-cols-12 gap-2 items-center">
                                                <div className="col-span-1 text-[12px] text-gray-500">{i + 1}</div>
                                                <div className="col-span-7 text-[12px] text-gray-800 font-semibold truncate">
                                                    {x.nome}
                                                </div>
                                                <div className="col-span-4 text-[12px] text-gray-800 font-semibold text-right">
                                                    {fmtBRMoney(x.valor)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardShell>
                        )}
                    </div>

                    {/* ======= Insight final ======= */}
                    <div className="mt-4 bg-white border border-gray-200 rounded-xl shadow-sm p-3 flex items-center gap-3">
                        <div className="w-[40px] h-[40px] rounded-lg bg-gray-100 flex items-center justify-center">
                            {saldoMes >= 0 ? (
                                <TrendingUp size={18} className="text-gray-700" />
                            ) : (
                                <TrendingDown size={18} className="text-gray-700" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-semibold text-gray-800">
                                Insight do Financeiro (mock)
                            </div>
                            <div className="text-[12px] text-gray-600 truncate">
                                Se “CT-e pendente de faturamento” estiver alto, o caixa “fica em segundo plano” mesmo com a operação rodando. Priorize faturar primeiro, pagar depois.
                            </div>
                        </div>

                        <div className="text-[11px] px-2 py-1 rounded-full border border-gray-200 text-gray-700 bg-gray-50">
                            Dica do dia
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
