// src/pages/Relatorios/Operacao/RelAnaliseProdutividadeResultado.jsx
import { useLocation } from "react-router-dom";
import RelatorioBase from "../base/RelatorioBase";

/* =========================================================
   HELPERS
========================================================= */
function onlyDigits(s) {
    return String(s || "").replace(/\D/g, "");
}

function brMoney(n) {
    const v = Number(n || 0);
    return v.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

function brPct(n) {
    const v = Number(n || 0);
    return `${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}%`;
}

function parseISO(d) {
    // aceita "aaaa-mm-dd" ou "dd/mm/aaaa"
    if (!d) return null;
    if (String(d).includes("/")) {
        const [dd, mm, aa] = String(d).split("/");
        return new Date(Number(aa), Number(mm) - 1, Number(dd));
    }
    const dt = new Date(d);
    return Number.isNaN(dt.getTime()) ? null : dt;
}

function inRange(dateISO, ini, fim) {
    const d = parseISO(dateISO);
    const a = parseISO(ini);
    const b = parseISO(fim);
    if (!d || !a || !b) return true;
    return d >= a && d <= b;
}

function isoToBR(d) {
    // "2026-01-05" -> "05/01/2026"
    if (!d) return "";
    const s = String(d);
    if (s.includes("/")) return s;
    const [aa, mm, dd] = s.split("-");
    if (!aa || !mm || !dd) return s;
    return `${dd}/${mm}/${aa}`;
}

function NegSpan({ value, children }) {
    const v = Number(value || 0);
    const cls = v < 0 ? "text-red-600 font-semibold" : "";
    return <span className={cls}>{children}</span>;
}

/* =========================================================
   AGRUPAMENTO (Emissão / Veículo / Motorista)
   - cria linhas "sintéticas" (group/total) sem mexer no RelatorioBase
========================================================= */
function buildGroupedRows(items, agruparPor) {
    // agruparPor: E=Emissão | V=Veículo | M=Motorista
    const mode = String(agruparPor || "V").toUpperCase();

    const sorted = [...items].sort((a, b) => {
        if (mode === "E") {
            const da = parseISO(a.dtEmissao)?.getTime() ?? 0;
            const db = parseISO(b.dtEmissao)?.getTime() ?? 0;
            if (da !== db) return da - db;

            // desempate: placa, viagem
            const pa = String(a.placa || "");
            const pb = String(b.placa || "");
            const c1 = pa.localeCompare(pb);
            if (c1 !== 0) return c1;

            return String(a.nrViagem || "").localeCompare(String(b.nrViagem || ""));
        }

        if (mode === "V") {
            const pa = String(a.placa || "");
            const pb = String(b.placa || "");
            const c1 = pa.localeCompare(pb);
            if (c1 !== 0) return c1;

            // desempate: data, viagem
            const da = parseISO(a.dtEmissao)?.getTime() ?? 0;
            const db = parseISO(b.dtEmissao)?.getTime() ?? 0;
            if (da !== db) return da - db;

            return String(a.nrViagem || "").localeCompare(String(b.nrViagem || ""));
        }

        // mode === "M"
        const ma = String(a.nomeMotorista || "");
        const mb = String(b.nomeMotorista || "");
        const c0 = ma.localeCompare(mb);
        if (c0 !== 0) return c0;

        // desempate: placa, data
        const pa = String(a.placa || "");
        const pb = String(b.placa || "");
        const c1 = pa.localeCompare(pb);
        if (c1 !== 0) return c1;

        const da = parseISO(a.dtEmissao)?.getTime() ?? 0;
        const db = parseISO(b.dtEmissao)?.getTime() ?? 0;
        return da - db;
    });

    const out = [];
    let lastKey = null;

    let sumFrete = 0;
    let sumDesp = 0;
    let sumRes = 0;

    const flushTotal = () => {
        if (!lastKey) return;
        const totalPerc = sumFrete > 0 ? (sumRes / sumFrete) * 100 : 0;

        out.push({
            id: `tot_${onlyDigits(lastKey) || String(lastKey).slice(0, 12)}_${out.length}`,
            __type: "total",
            totalFrete: sumFrete,
            totalDesp: sumDesp,
            totalRes: sumRes,
            totalPerc,
        });

        sumFrete = 0;
        sumDesp = 0;
        sumRes = 0;
    };

    sorted.forEach((r, i) => {
        const groupKey =
            mode === "E"
                ? String(r.dtEmissao || "")
                : mode === "V"
                    ? String(r.placa || "")
                    : String(r.nomeMotorista || "");

        const groupLabel =
            mode === "E"
                ? isoToBR(r.dtEmissao)
                : mode === "V"
                    ? `${r.placa || ""}  ${r.descVeiculo || ""}`.trim()
                    : String(r.nomeMotorista || "");

        if (groupKey !== lastKey) {
            flushTotal();
            lastKey = groupKey;

            // linha “mesclada”: só a primeira coluna mostra texto; as outras ficam vazias
            out.push({
                id: `grp_${groupKey}_${i}`,
                __type: "group",
                groupLabel,
            });
        }

        const vrFrete = Number(r.vrFrete || 0);
        const vrDesp = Number(r.vrDespesa || 0);
        const vrRes = vrFrete - vrDesp;

        sumFrete += vrFrete;
        sumDesp += vrDesp;
        sumRes += vrRes;

        out.push({
            ...r,
            id: r.id || `r_${i}`,
            resultado: vrRes,
            perc: vrFrete > 0 ? (vrRes / vrFrete) * 100 : 0,
        });
    });

    flushTotal();
    return out;
}

/* =========================================================
   RESULTADO
========================================================= */
export default function RelAnaliseProdutividadeResultado({ open }) {
    const logo = localStorage.getItem("param_logoBg") || "";
    const { state } = useLocation();
    const filtros = state?.filtros || {};

    const titulo = "Produção Veículo";
    const periodo =
        filtros?.dtIni && filtros?.dtFim ? `${isoToBR(filtros.dtIni)} a ${isoToBR(filtros.dtFim)}` : "";

    /* =========================================================
       1) CATÁLOGO COMPLETO (+Campos)
    ========================================================= */
    const catalogColumns = [
        {
            id: "nr",
            label: "Nº Viag",
            width: 85,
            accessor: (r) => {
                if (r?.__type === "group") return r.groupLabel || "";
                if (r?.__type === "total") return "";
                return r.nrViagem || "";
            },
        },
        {
            id: "filialPlaca",
            label: "Filial Placa",
            width: 110,
            accessor: (r) => {
                if (r?.__type === "group") return "";
                if (r?.__type === "total") return "TOTAL";
                return `${String(r.filialCod || "").padStart(3, "0")}  ${r.placa || ""}`;
            },
        },
        {
            id: "tp",
            label: "TP",
            width: 45,
            accessor: (r) => (r?.__type ? "" : r.tpVeiculo || ""),
            align: "center",
        },
        {
            id: "descVeiculo",
            label: "Descrição Veículo",
            width: 170,
            accessor: (r) => (r?.__type ? "" : r.descVeiculo || ""),
        },
        {
            id: "nomeMotorista",
            label: "Nome Motorista",
            width: 230,
            accessor: (r) => (r?.__type ? "" : r.nomeMotorista || ""),
        },
        {
            id: "vrFrete",
            label: "Vr Frete",
            width: 90,
            accessor: (r) =>
                r?.__type === "total" ? brMoney(r.totalFrete) : r?.__type ? "" : brMoney(r.vrFrete),
            align: "right",
        },
        {
            id: "vrDespesa",
            label: "Vr Despesa",
            width: 90,
            accessor: (r) =>
                r?.__type === "total" ? brMoney(r.totalDesp) : r?.__type ? "" : brMoney(r.vrDespesa),
            align: "right",
        },
        {
            id: "resultado",
            label: "Resultado",
            width: 90,
            accessor: (r) => {
                if (r?.__type === "group") return "";
                if (r?.__type === "total") {
                    return (
                        <NegSpan value={r.totalRes}>
                            {brMoney(r.totalRes)}
                        </NegSpan>
                    );
                }
                return (
                    <NegSpan value={r.resultado}>
                        {brMoney(r.resultado)}
                    </NegSpan>
                );
            },
            align: "right",
        },
        {
            id: "perc",
            label: "Perc.",
            width: 70,
            accessor: (r) => {
                if (r?.__type === "group") return "";
                if (r?.__type === "total") {
                    return (
                        <NegSpan value={r.totalPerc}>
                            {brPct(r.totalPerc)}
                        </NegSpan>
                    );
                }
                return (
                    <NegSpan value={r.perc}>
                        {brPct(r.perc)}
                    </NegSpan>
                );
            },
            align: "right",
        },

        // ===== EXTRAS (+Campos) =====
        { id: "empresa", label: "Empresa", accessor: "empresa", width: 170 },
        { id: "dtEmissao", label: "Emissão", accessor: (r) => (r?.__type ? "" : isoToBR(r.dtEmissao)), width: 95 },
        { id: "km", label: "KM", accessor: (r) => (r?.__type ? "" : String(r.km ?? "")), width: 70, align: "right" },
        { id: "peso", label: "Peso", accessor: (r) => (r?.__type ? "" : String(r.peso ?? "")), width: 85, align: "right" },
    ];

    /* =========================================================
       2) LAYOUT PADRÃO (igual print)
    ========================================================= */
    const layoutPadrao = [
        "nr",
        "filialPlaca",
        "tp",
        "descVeiculo",
        "nomeMotorista",
        "vrFrete",
        "vrDespesa",
        "resultado",
        "perc",
    ];

    const columns = layoutPadrao.map((id) => catalogColumns.find((c) => c.id === id)).filter(Boolean);

    /* =========================================================
       3) MOCK (substitui depois por WebApi)
       - tpVeiculo: F=Frota | A=Agregado
    ========================================================= */
    const base = [
        // Grupo FROTA
        {
            empresa: "MANTRAN TECNOLOGIAS LTDA ME",
            filialCod: "003",
            filialNome: "FILIAL 03",
            dtEmissao: "2026-01-05",
            nrViagem: "079377",
            placa: "FFG-0326",
            tpVeiculo: "F",
            descVeiculo: "TRUCK",
            nomeMotorista: "ADENILSON SOUZA SILVA",
            vrFrete: 0,
            vrDespesa: 63.87,
            km: 120,
            peso: 9800,
        },
        {
            empresa: "MANTRAN TECNOLOGIAS LTDA ME",
            filialCod: "003",
            filialNome: "FILIAL 03",
            dtEmissao: "2026-01-08",
            nrViagem: "079423",
            placa: "FFG-0326",
            tpVeiculo: "F",
            descVeiculo: "TRUCK",
            nomeMotorista: "ADENILSON SOUZA SILVA",
            vrFrete: 7207.89,
            vrDespesa: 271.68,
            km: 420,
            peso: 11200,
        },

        // Grupo FROTA
        {
            empresa: "MANTRAN TECNOLOGIAS LTDA ME",
            filialCod: "003",
            filialNome: "FILIAL 03",
            dtEmissao: "2026-01-09",
            nrViagem: "079811",
            placa: "CUX-0118",
            tpVeiculo: "F",
            descVeiculo: "FH 460",
            nomeMotorista: "ADRIANO RODRIGUES DO NASCIMENTO",
            vrFrete: 0,
            vrDespesa: 117.8,
            km: 85,
            peso: 3200,
        },
        {
            empresa: "MANTRAN TECNOLOGIAS LTDA ME",
            filialCod: "003",
            filialNome: "FILIAL 03",
            dtEmissao: "2026-01-12",
            nrViagem: "079500",
            placa: "CUX-0118",
            tpVeiculo: "F",
            descVeiculo: "FH 460",
            nomeMotorista: "ADRIANO RODRIGUES DO NASCIMENTO",
            vrFrete: 3999.17,
            vrDespesa: 350.64,
            km: 610,
            peso: 15800,
        },

        // Grupo AGREGADO (pra testar filtro A e valores negativos)
        {
            empresa: "MANTRAN TECNOLOGIAS LTDA ME",
            filialCod: "002",
            filialNome: "FILIAL 02",
            dtEmissao: "2026-01-18",
            nrViagem: "078538",
            placa: "GAJ-3H08",
            tpVeiculo: "A",
            descVeiculo: "FIAT DOBLO",
            nomeMotorista: "AFONSO DOS PASSOS JUNIOR",
            vrFrete: 0,
            vrDespesa: 117.8,
            km: 40,
            peso: 300,
        },
    ];

    // multiplica pra ficar “cara” de relatório grande
    const rowsMock = Array.from({ length: 6 }).flatMap((_, rep) =>
        base.map((r, idx) => {
            const n = rep * 100 + idx;

            // alterna pra criar alguns resultados negativos e positivos no mock
            const extraFrete = rep === 0 ? 0 : idx % 2 ? 421.74 : 0;
            const extraDesp = rep === 0 ? 0 : idx % 3 === 0 ? 85.6 : 0;

            return {
                ...r,
                id: `${rep}-${idx}-${r.nrViagem}`,
                nrViagem: String(Number(r.nrViagem) + n),
                vrFrete: Number(r.vrFrete || 0) + extraFrete,
                vrDespesa: Number(r.vrDespesa || 0) + extraDesp,
            };
        })
    );

    /* =========================================================
       4) APLICA FILTROS (conforme tela)
       - veiculo: T=Todos | A=Agregado | F=Frota
    ========================================================= */
    let filtrados = [...rowsMock];

    // Filial
    if (String(filtros?.filial || "999") !== "999") {
        filtrados = filtrados.filter((r) => String(r.filialCod) === String(filtros.filial));
    }

    // Período Emissão
    if (filtros?.dtIni && filtros?.dtFim) {
        filtrados = filtrados.filter((r) => inRange(r.dtEmissao, filtros.dtIni, filtros.dtFim));
    }

    // Veículo (Filtro por tipo)
    // A = Agregado | F = Frota
    if (String(filtros?.veiculo || "T") === "A") {
        filtrados = filtrados.filter((r) => String(r.tpVeiculo) === "A");
    } else if (String(filtros?.veiculo || "T") === "F") {
        filtrados = filtrados.filter((r) => String(r.tpVeiculo) === "F");
    }

    // Rel. por Frete Peso (mock): simula recalculo usando peso
    if (filtros?.relFretePeso) {
        filtrados = filtrados.map((r) => {
            const peso = Number(r.peso || 0);
            const novoFrete = peso > 0 ? Math.max(0, (peso / 1000) * 120) : Number(r.vrFrete || 0);
            return { ...r, vrFrete: novoFrete };
        });
    }

    // Recalcular valores (mock): só pra mostrar mudança
    if (filtros?.recalcularValores) {
        filtrados = filtrados.map((r) => {
            const frete = Number(r.vrFrete || 0);
            const desp = Number(r.vrDespesa || 0);
            return { ...r, vrFrete: frete * 1.02, vrDespesa: desp * 0.98 };
        });
    }

    /* =========================================================
       5) AGRUPA
       - E=Emissão | V=Veículo | M=Motorista
    ========================================================= */
    const rows = buildGroupedRows(filtrados, filtros?.agruparPor || "V");

    /* =========================================================
       6) TOTAIS GERAIS
    ========================================================= */
    const totals = [{ id: "qtd", label: "Total de Registros", type: "count" }];

    return (
        <RelatorioBase
            sidebarOpen={open}
            reportKey="operacao.analise_produtividade"
            titulo={titulo}
            periodo={periodo ? `Período: ${periodo}` : ""}
            logo={logo}
            orientation="auto"
            columns={columns}
            columnCatalog={catalogColumns}
            rows={rows}
            totals={totals}

        />
    );
}
