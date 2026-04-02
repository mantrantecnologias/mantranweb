// src/pages/Relatorios/Operacao/RelVeiculoResultado.jsx
import { useLocation } from "react-router-dom";
import RelatorioBase from "../base/RelatorioBase";

/* =========================================================
   HELPERS
========================================================= */
function situacaoLabel(s) {
    if (s === "A") return "Ativos";
    if (s === "I") return "Inativos";
    return "Todos";
}

function onlyDigits(s) {
    return String(s || "").replace(/\D/g, "");
}

function isAtivoByDesligamento(dtDesligamento) {
    return !String(dtDesligamento || "").trim(); // vazio = ativo | preenchido = inativo
}

/* =========================================================
   AGRUPAMENTO (Filial -> Classe)
   - cria linhas "sintéticas" sem mexer no RelatorioBase
========================================================= */
function buildGroupedRows(vehicles) {
    const sorted = [...vehicles].sort((a, b) => {
        const fa = onlyDigits(a.filialVinculoCod);
        const fb = onlyDigits(b.filialVinculoCod);
        if (fa !== fb) return fa.localeCompare(fb);

        const ca = String(a.classeCod || "");
        const cb = String(b.classeCod || "");
        if (ca !== cb) return ca.localeCompare(cb);

        return String(a.placa || "").localeCompare(String(b.placa || ""));
    });

    const out = [];
    let lastFilial = null;
    let lastClasse = null;
    let classCount = 0;

    const flushClassCount = () => {
        if (!lastClasse) return;
        out.push({
            id: `qtde_${lastFilial}_${lastClasse}_${out.length}`,
            __type: "qtde",
            qtde: classCount,
        });
        classCount = 0;
    };

    sorted.forEach((v, i) => {
        const filialKey = String(v.filialVinculoCod || "");
        const classeKey = String(v.classeCod || "");

        // mudou filial
        if (filialKey !== lastFilial) {
            flushClassCount();

            lastFilial = filialKey;
            lastClasse = null;

            out.push({
                id: `filial_${filialKey}_${i}`,
                __type: "filial",
                filialLabel: `FILIAL  ${String(v.filialVinculoCod).padStart(3, "0")}   ${v.filialVinculoNome}`,
            });
        }

        // mudou classe
        if (classeKey !== lastClasse) {
            flushClassCount();

            lastClasse = classeKey;

            out.push({
                id: `classe_${filialKey}_${classeKey}_${i}`,
                __type: "classe",
                classeLabel: `Classe:  ${String(v.classeCod).padStart(2, "0")}    ${v.classeDesc}`,
            });
        }

        out.push({
            ...v,
            id: v.id || `v_${filialKey}_${classeKey}_${i}`,
        });

        classCount += 1;
    });

    flushClassCount();
    return out;
}

/* =========================================================
   RESULTADO
========================================================= */
export default function RelVeiculoResultado({ open }) {
    const logo = localStorage.getItem("param_logoBg") || "";
    const { state } = useLocation();
    const filtros = state?.filtros || {};

    const titulo = filtros?.incluirAgregados
        ? "RELAÇÃO DE VEÍCULOS (AGREGADOS)"
        : "RELAÇÃO DE VEÍCULOS (FROTA)";

    const periodo = "";

    /* =========================================================
       1) CATÁLOGO COMPLETO (+Campos)
    ========================================================= */
    const catalogColumns = [
        {
            id: "codigo",
            label: "Código",
            width: 75,
            accessor: (r) => {
                if (r?.__type === "filial") return r.filialLabel || "";
                if (r?.__type === "classe") return r.classeLabel || "";
                if (r?.__type === "qtde") return "Qtde:";
                return r.codigo || "";
            },
        },
        {
            id: "placa",
            label: "Nº Placa",
            width: 90,
            accessor: (r) => (r?.__type === "qtde" ? String(r.qtde || 0) : r?.__type ? "" : r.placa || ""),
        },
        {
            id: "ano",
            label: "Ano",
            width: 70,
            accessor: (r) => (r?.__type ? "" : r.ano || ""),
            align: "right",
        },
        {
            id: "filialVinculo",
            label: "Filial Vínculo",
            width: 90,
            accessor: (r) => (r?.__type ? "" : r.filialVinculoCod || ""),
            align: "right",
        },
        {
            id: "utilizacao",
            label: "Utilização",
            width: 110,
            accessor: (r) => (r?.__type ? "" : r.TP_Utilizacao === "T" ? "TRAÇÃO" : r.TP_Utilizacao === "R" ? "REBOQUE" : ""),
        },
        {
            id: "cidade",
            label: "Cidade",
            width: 140,
            accessor: (r) => (r?.__type ? "" : r.cidade || ""),
        },
        {
            id: "uf",
            label: "UF",
            width: 45,
            accessor: (r) => (r?.__type ? "" : r.uf || ""),
        },
        {
            id: "classeDesc",
            label: "Descrição da Classe",
            width: 170,
            accessor: (r) => (r?.__type ? "" : r.classeDesc || ""),
        },
        {
            id: "contratacao",
            label: "Contratação",
            width: 100,
            accessor: (r) => (r?.__type ? "" : r.contratacao || ""),
        },
        {
            id: "desligamento",
            label: "Desligamento",
            width: 105,
            accessor: (r) => (r?.__type ? "" : r.DT_Desligamento || ""),
        },
        {
            id: "licenciamento",
            label: "Licenciamento",
            width: 110,
            accessor: (r) => (r?.__type ? "" : r.licenciamento || ""),
        },

        // extras
        { id: "TP_Veiculo", label: "TP_Veiculo", accessor: (r) => (r?.__type ? "" : r.TP_Veiculo || ""), width: 85 },
        { id: "TP_Utilizacao", label: "TP_Utilizacao", accessor: (r) => (r?.__type ? "" : r.TP_Utilizacao || ""), width: 95 },
        { id: "chassi", label: "Chassi", accessor: "chassi", width: 160 },
        { id: "renavam", label: "Renavam", accessor: "renavam", width: 120 },
        { id: "marcaModelo", label: "Marca/Modelo", accessor: "marcaModelo", width: 180 },
    ];

    /* =========================================================
       2) LAYOUT PADRÃO MANTRAN
    ========================================================= */
    const layoutPadraoMantran = [
        "codigo",
        "placa",
        "ano",
        "filialVinculo",
        "utilizacao",
        "cidade",
        "uf",
        "classeDesc",
        "contratacao",
        "desligamento",
        "licenciamento",
    ];

    const columns = layoutPadraoMantran.map((id) => catalogColumns.find((c) => c.id === id)).filter(Boolean);

    /* =========================================================
       3) MOCK (com Filiais 001/002/003)
       - TP_Veiculo: F (Frota) | A (Agregado)
       - DT_Desligamento: preenchido = Inativo
       - TP_Utilizacao: T (Tração) | R (Reboque)
    ========================================================= */
    const veiculosBase = [
        // ===== FILIAL 001 =====
        {
            codigo: "0000007",
            placa: "KOH7119",
            ano: 1995,
            filialVinculoCod: "001",
            filialVinculoNome: "TRANSAFLA TRANSPORTES LTDA",
            TP_Utilizacao: "T",
            cidade: "PETROPOLIS",
            uf: "RJ",
            classeCod: "04",
            classeDesc: "TOCO",
            contratacao: "",
            DT_Desligamento: "",
            licenciamento: "30/09/2022",
            chassi: "9BWZZZ377VT004251",
            renavam: "00123456789",
            marcaModelo: "VW 13.180",
            TP_Veiculo: "F",
        },
        {
            codigo: "0000011",
            placa: "KOH7514",
            ano: 1996,
            filialVinculoCod: "001",
            filialVinculoNome: "TRANSAFLA TRANSPORTES LTDA",
            TP_Utilizacao: "T",
            cidade: "PETROPOLIS",
            uf: "RJ",
            classeCod: "04",
            classeDesc: "TOCO",
            contratacao: "",
            DT_Desligamento: "10/10/2020", // inativo exemplo
            licenciamento: "30/04/2018",
            chassi: "9BWZZZ377VT004252",
            renavam: "00123456790",
            marcaModelo: "VW 13.180",
            TP_Veiculo: "F",
        },

        // ===== FILIAL 002 =====
        {
            codigo: "0000101",
            placa: "LPU9E51",
            ano: 2010,
            filialVinculoCod: "002",
            filialVinculoNome: "FILIAL 02",
            TP_Utilizacao: "T",
            cidade: "CAMPINAS",
            uf: "SP",
            classeCod: "06",
            classeDesc: "CAVALO MECANICO",
            contratacao: "14/01/2025",
            DT_Desligamento: "",
            licenciamento: "31/05/2025",
            chassi: "9BWZZZ377VT004255",
            renavam: "00123456793",
            marcaModelo: "VOLVO FH",
            TP_Veiculo: "F",
        },
        {
            codigo: "0000102",
            placa: "KZY0349",
            ano: 2005,
            filialVinculoCod: "002",
            filialVinculoNome: "FILIAL 02",
            TP_Utilizacao: "R",
            cidade: "CAMPINAS",
            uf: "SP",
            classeCod: "07",
            classeDesc: "SEMI-REBOQUE",
            contratacao: "",
            DT_Desligamento: "",
            licenciamento: "30/09/2017",
            chassi: "9BWZZZ377VT004256",
            renavam: "00123456794",
            marcaModelo: "RANDON SR",
            TP_Veiculo: "A", // agregado
        },

        // ===== FILIAL 003 =====
        {
            codigo: "0000201",
            placa: "RTY3A21",
            ano: 2018,
            filialVinculoCod: "003",
            filialVinculoNome: "FILIAL 03",
            TP_Utilizacao: "T",
            cidade: "SOROCABA",
            uf: "SP",
            classeCod: "05",
            classeDesc: "TRUCK",
            contratacao: "01/02/2024",
            DT_Desligamento: "",
            licenciamento: "30/09/2026",
            chassi: "9BWZZZ377VT009999",
            renavam: "00999999999",
            marcaModelo: "SCANIA P310",
            TP_Veiculo: "F",
        },
        {
            codigo: "0000202",
            placa: "ASD9Z88",
            ano: 2016,
            filialVinculoCod: "003",
            filialVinculoNome: "FILIAL 03",
            TP_Utilizacao: "R",
            cidade: "SOROCABA",
            uf: "SP",
            classeCod: "07",
            classeDesc: "SEMI-REBOQUE",
            contratacao: "",
            DT_Desligamento: "15/03/2023", // inativo exemplo
            licenciamento: "30/09/2023",
            chassi: "9BWZZZ377VT008888",
            renavam: "00888888888",
            marcaModelo: "LIBRELATO SR",
            TP_Veiculo: "A", // agregado
        },
    ];

    // volume p/ testar
    const veiculos = Array.from({ length: 8 }).flatMap((_, rep) =>
        veiculosBase.map((v, idx) => {
            const n = rep * 20 + idx;
            const placaBase = (v.placa || "AAA0A00").slice(0, 6);
            return {
                ...v,
                id: `${rep}-${idx}-${v.codigo}`,
                codigo: String(Number(v.codigo) + n).padStart(7, "0"),
                placa: `${placaBase}${String((n % 10) || 0)}`,
            };
        })
    );

    /* =========================================================
       4) APLICA FILTROS (✅ AGORA FUNCIONA)
       - filial: "999" = todas | senão filtra igual
       - incluirAgregados:
          - true  => TP_Veiculo === "A"
          - false => TP_Veiculo === "F"
       - situacao:
          - A => DT_Desligamento vazio
          - I => DT_Desligamento preenchido
          - T => todos
       - tipoUtilizacao:
          - T / R / X (todos)
    ========================================================= */
    let filtrados = [...veiculos];

    // filial
    if (String(filtros?.filial || "999") !== "999") {
        filtrados = filtrados.filter((x) => String(x.filialVinculoCod || "") === String(filtros.filial));
    }

    // agregados/frota
    if (filtros?.incluirAgregados) {
        filtrados = filtrados.filter((x) => String(x.TP_Veiculo || "") === "A");
    } else {
        filtrados = filtrados.filter((x) => String(x.TP_Veiculo || "") === "F");
    }

    // situação por DT_Desligamento
    if (filtros?.situacao === "A") {
        filtrados = filtrados.filter((x) => isAtivoByDesligamento(x.DT_Desligamento));
    } else if (filtros?.situacao === "I") {
        filtrados = filtrados.filter((x) => !isAtivoByDesligamento(x.DT_Desligamento));
    }

    // tipo (TP_Utilizacao)
    if (filtros?.tipoUtilizacao === "T") {
        filtrados = filtrados.filter((x) => String(x.TP_Utilizacao || "") === "T");
    } else if (filtros?.tipoUtilizacao === "R") {
        filtrados = filtrados.filter((x) => String(x.TP_Utilizacao || "") === "R");
    }

    // agrupado
    const rows = buildGroupedRows(filtrados);

    /* =========================================================
       5) TOTAIS
    ========================================================= */
    const totals = [{ id: "qtd", label: "Total de Veículos", type: "count" }];

    return (
        <RelatorioBase
            sidebarOpen={open}
            reportKey="operacao.relacao_veiculos"
            titulo={titulo}
            periodo={periodo ? periodo : `Situação: ${situacaoLabel(filtros?.situacao)} | Filial: ${filtros?.filial || "999"}`}
            logo={logo}
            orientation="auto"
            columns={columns}
            columnCatalog={catalogColumns}
            rows={rows}
            totals={totals}

        />
    );
}
