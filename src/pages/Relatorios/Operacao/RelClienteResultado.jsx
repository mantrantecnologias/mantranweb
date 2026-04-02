// src/pages/Relatorios/Operacao/RelClienteResultado.jsx
import { useLocation } from "react-router-dom";
import RelatorioBase from "../base/RelatorioBase";

/* =========================================================
   HELPERS
========================================================= */
function isoToBR(iso) {
    if (!iso) return "";
    const [y, m, d] = String(iso).split("-");
    if (!y || !m || !d) return String(iso);
    return `${d}/${m}/${y}`;
}

function buildPeriodo(filtros) {
    const ini = filtros?.dataIni ? isoToBR(filtros.dataIni) : "";
    const fim = filtros?.dataFim ? isoToBR(filtros.dataFim) : "";
    if (ini && fim) return `${ini} a ${fim}`;
    if (ini) return `A partir de ${ini}`;
    if (fim) return `Até ${fim}`;
    return "";
}

function tipoLabel(tipo) {
    if (tipo === "C") return "Correntistas";
    if (tipo === "E") return "Eventuais";
    return "Todos";
}

function situacaoLabel(sit) {
    if (sit === "A") return "Ativo";
    if (sit === "I") return "Inativo";
    if (sit === "B") return "Bloqueado";
    return "Todos";
}

/* =========================================================
   RESULTADO
========================================================= */
export default function RelClienteResultado({ open }) {
    const logo = localStorage.getItem("param_logoBg") || "";
    const { state } = useLocation();

    const filtros = state?.filtros || {};
    const periodo = buildPeriodo(filtros);

    /* =========================================================
       1) CATÁLOGO COMPLETO (+Campos)
    ========================================================= */
    const catalogColumns = [
        { id: "razaoSocial", label: "Razão Social", accessor: "razaoSocial", width: 210 },
        { id: "cgcCpf", label: "CGC/CPF", accessor: "cgcCpf", width: 120 },
        { id: "inscEstadual", label: "Insc. Estadual", accessor: "inscEstadual", width: 95 },
        { id: "endereco", label: "Endereço", accessor: "endereco", width: 210 },
        { id: "numero", label: "Nº Ender", accessor: "numero", width: 70, align: "right" },
        { id: "bairro", label: "Bairro", accessor: "bairro", width: 110 },
        { id: "cidade", label: "Cidade", accessor: "cidade", width: 140 },
        { id: "uf", label: "UF", accessor: "uf", width: 45 },
        { id: "cep", label: "CEP", accessor: "cep", width: 85 },
        { id: "filial", label: "Filial", accessor: "filial", width: 55, align: "right" },
        { id: "inclusao", label: "Inclusão", accessor: "inclusao", width: 80 },
        { id: "tp", label: "TP", accessor: "tp", width: 40 },

        // ===== EXTRAS (só no Relatório / +Campos) =====
        { id: "fantasia", label: "Fantasia", accessor: "fantasia", width: 160 },
        { id: "cdAtividade", label: "CD_Atividade", accessor: "cdAtividade", width: 95 },
        { id: "operador", label: "Operador", accessor: "operador", width: 120 },
        {
            id: "pcComissao",
            label: "PC_Comissão",
            accessor: (r) =>
                `${Number(r.pcComissao || 0).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                })}%`,
            width: 90,
            align: "right",
        },
        { id: "corretora", label: "Corretora", accessor: "corretora", width: 160 },

        // auxiliares (debug / conferência de filtros)
        { id: "tipoFiltro", label: "Tipo (Filtro)", accessor: "tipoFiltro", width: 120 },
        { id: "situacaoFiltro", label: "Situação (Filtro)", accessor: "situacaoFiltro", width: 140 },
    ];

    /* =========================================================
       2) LAYOUT PADRÃO MANTRAN
    ========================================================= */
    const layoutPadraoMantran = [
        "razaoSocial",
        "cgcCpf",
        "inscEstadual",
        "endereco",
        "numero",
        "bairro",
        "cidade",
        "uf",
        "cep",
        "filial",
        "inclusao",
        "tp",
    ];

    const columns = layoutPadraoMantran
        .map((id) => catalogColumns.find((c) => c.id === id))
        .filter(Boolean);

    /* =========================================================
       3) MOCK (substitui depois por API)
    ========================================================= */
    const base = [
        {
            razaoSocial: "A SA CRAMENTA NA COM ART. ESPORTIV",
            cgcCpf: "75339333000114",
            inscEstadual: "628018783",
            endereco: "R CONDOR",
            numero: "1239",
            bairro: "CENTRO",
            cidade: "ARAPONGAS",
            uf: "PR",
            cep: "86708360",
            filial: "003",
            inclusao: "05/09/2025",
            tp: "C",

            fantasia: "SACRAMENTA SPORT",
            cdAtividade: "0101",
            operador: "ALAN",
            pcComissao: 2.5,
            corretora: "CORRETORA SUL",

            tipoFiltro: tipoLabel(filtros?.tipo),
            situacaoFiltro: situacaoLabel(filtros?.situacao),
        },
        {
            razaoSocial: "A TABACA TABACARIA LTDA",
            cgcCpf: "25372355000103",
            inscEstadual: "562389449",
            endereco: "AV MANOEL GOULART",
            numero: "1545",
            bairro: "VILA SANTA R",
            cidade: "PRESIDENTE PRUDENTE",
            uf: "SP",
            cep: "19015241",
            filial: "003",
            inclusao: "10/12/2025",
            tp: "C",

            fantasia: "TABACA",
            cdAtividade: "0207",
            operador: "ADMIN",
            pcComissao: 1.2,
            corretora: "CORRETORA CENTRO",

            tipoFiltro: tipoLabel(filtros?.tipo),
            situacaoFiltro: situacaoLabel(filtros?.situacao),
        },
    ];

    const rows = Array.from({ length: 20 }).flatMap((_, rep) =>
        base.map((b, idx) => ({
            ...b,
            id: `${rep}-${idx}`,
        }))
    );

    /* =========================================================
       4) TOTAIS
    ========================================================= */
    const totals = [{ id: "qtd", label: "Total de Clientes", type: "count" }];

    return (
        <RelatorioBase
            sidebarOpen={open}
            reportKey="operacao.cadastro_clientes"
            titulo="Cadastro de Clientes"
            periodo={periodo}
            logo={logo}
            orientation="auto"
            columns={columns}
            columnCatalog={catalogColumns}
            rows={rows}
            totals={totals}

        />
    );
}
