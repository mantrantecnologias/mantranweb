// src/pages/Relatorios/Operacao/RelMotoristaResultado.jsx
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
   AGRUPAMENTO (Filial)
   - cria linhas "sintéticas" sem mexer no RelatorioBase
========================================================= */
function buildGroupedRows(motoristas, ordemImpressao) {
    // Se ordem for Nome (N), apenas ordena por nome e não agrupa
    if (ordemImpressao === "N") {
        return [...motoristas].sort((a, b) =>
            String(a.nome || "").localeCompare(String(b.nome || ""))
        );
    }

    // Se ordem for Filial (F) - Padrão
    const sorted = [...motoristas].sort((a, b) => {
        const fa = onlyDigits(a.filialVinculoCod);
        const fb = onlyDigits(b.filialVinculoCod);
        if (fa !== fb) return fa.localeCompare(fb);

        return String(a.nome || "").localeCompare(String(b.nome || ""));
    });

    const out = [];
    let lastFilial = null;
    let count = 0;

    const flushCount = () => {
        if (!lastFilial) return;
        out.push({
            id: `qtde_${lastFilial}_${out.length}`,
            __type: "qtde",
            qtde: count,
        });
        count = 0;
    };

    sorted.forEach((m, i) => {
        const filialKey = String(m.filialVinculoCod || "");

        // mudou filial
        if (filialKey !== lastFilial) {
            flushCount();
            lastFilial = filialKey;

            out.push({
                id: `filial_${filialKey}_${i}`,
                __type: "filial",
                filialLabel: `FILIAL  ${String(m.filialVinculoCod).padStart(3, "0")}   ${m.filialVinculoNome
                    }`,
            });
        }

        out.push({
            ...m,
            id: m.id || `m_${filialKey}_${i}`,
        });

        count += 1;
    });

    flushCount();
    return out;
}

/* =========================================================
   RESULTADO
========================================================= */
export default function RelMotoristaResultado({ open }) {
    const logo = localStorage.getItem("param_logoBg") || "";
    const { state } = useLocation();
    const filtros = state?.filtros || {};

    const titulo =
        filtros?.tipo === "A"
            ? "RELAÇÃO DE MOTORISTAS (AGREGADOS)"
            : filtros?.tipo === "F"
                ? "RELAÇÃO DE MOTORISTAS (FROTA)"
                : "RELAÇÃO DE MOTORISTAS (TODOS)";

    const periodo = "";

    /* =========================================================
       1) CATÁLOGO COMPLETO (+Campos)
       ✅ aqui é onde o +Campos busca as opções
    ========================================================= */
    const catalogColumns = [
        // ====== PADRÃO ======
        {
            id: "codigo",
            label: "Código",
            width: 75,
            accessor: (r) => {
                if (r?.__type === "filial") return r.filialLabel || "";
                if (r?.__type === "qtde") return "Qtde:";
                return r.codigo || "";
            },
        },
        {
            id: "nome",
            label: "Nome",
            width: 250,
            accessor: (r) =>
                r?.__type === "qtde" ? String(r.qtde || 0) : r?.__type ? "" : r.nome || "",
        },
        {
            id: "cpf",
            label: "CPF",
            width: 110,
            accessor: (r) => (r?.__type ? "" : r.cpf || ""),
        },
        {
            id: "cnh",
            label: "CNH",
            width: 95,
            accessor: (r) => (r?.__type ? "" : r.cnh || ""),
        },
        {
            id: "categoriaCnh",
            label: "Cat.",
            width: 50,
            accessor: (r) => (r?.__type ? "" : r.categoriaCnh || ""),
            align: "center",
        },
        {
            id: "validadeCnh",
            label: "Validade",
            width: 95,
            accessor: (r) => (r?.__type ? "" : r.validadeCnh || ""),
        },
        {
            id: "celular",
            label: "Celular",
            width: 110,
            accessor: (r) => (r?.__type ? "" : r.celular || ""),
        },
        {
            id: "filialVinculo",
            label: "Filial",
            width: 60,
            accessor: (r) => (r?.__type ? "" : r.filialVinculoCod || ""),
            align: "right",
        },
        {
            id: "tipo",
            label: "Tipo",
            width: 95,
            accessor: (r) => (r?.__type ? "" : r.tipo === "F" ? "FROTA" : "AGREGADO"),
        },
        {
            id: "dataAdmissao",
            label: "Admissão",
            width: 95,
            accessor: (r) => (r?.__type ? "" : r.dataAdmissao || ""),
        },
        {
            id: "dataDesligamento",
            label: "Desligamento",
            width: 105,
            accessor: (r) => (r?.__type ? "" : r.dataDesligamento || ""),
        },

        // ====== EXTRAS (+Campos) ✅ ======
        { id: "apelido", label: "Apelido", width: 140, accessor: (r) => (r?.__type ? "" : r.apelido || "") },
        { id: "tpFuncao", label: "TP_Funcao", width: 90, accessor: (r) => (r?.__type ? "" : r.tpFuncao || "") },
        { id: "endereco", label: "Endereço", width: 220, accessor: (r) => (r?.__type ? "" : r.endereco || "") },
        { id: "bairro", label: "Bairro", width: 140, accessor: (r) => (r?.__type ? "" : r.bairro || "") },
        { id: "cgcEmpresa", label: "CGC_Empresa", width: 150, accessor: (r) => (r?.__type ? "" : r.cgcEmpresa || "") },
        { id: "observacao", label: "Observação", width: 220, accessor: (r) => (r?.__type ? "" : r.observacao || "") },
        { id: "cdVeiculoTracao", label: "CD_Veiculo_Tracao", width: 130, accessor: (r) => (r?.__type ? "" : r.cdVeiculoTracao || "") },
        { id: "cdVeiculoReboque", label: "CD_Veiculo_Reboque", width: 140, accessor: (r) => (r?.__type ? "" : r.cdVeiculoReboque || "") },
    ];

    /* =========================================================
       2) LAYOUT PADRÃO
    ========================================================= */
    const layoutPadrao = [
        "codigo",
        "nome",
        "cpf",
        "cnh",
        "categoriaCnh",
        "validadeCnh",
        "celular",
        "filialVinculo",
        "tipo",
        "dataAdmissao",
        "dataDesligamento",
    ];

    const columns = layoutPadrao
        .map((id) => catalogColumns.find((c) => c.id === id))
        .filter(Boolean);

    /* =========================================================
       3) MOCK DADOS (agora com os campos extras)
    ========================================================= */
    const motoristasBase = [
        // Filial 001
        {
            codigo: "00001",
            nome: "JOAO SILVA",
            apelido: "JOÃO",
            tpFuncao: "M",
            endereco: "RUA A, 123",
            bairro: "CENTRO",
            cgcEmpresa: "12.345.678/0001-99",
            observacao: "",
            cdVeiculoTracao: "000007",
            cdVeiculoReboque: "",
            cpf: "123.456.789-00",
            cnh: "1234567890",
            categoriaCnh: "AE",
            validadeCnh: "10/10/2026",
            celular: "(24) 99999-0001",
            filialVinculoCod: "001",
            filialVinculoNome: "TRANSAFLA TRANSPORTES LTDA",
            tipo: "F",
            dataAdmissao: "01/01/2020",
            dataDesligamento: "",
        },
        {
            codigo: "00002",
            nome: "MARIA SOUZA",
            apelido: "MARI",
            tpFuncao: "A",
            endereco: "AV B, 900",
            bairro: "ALTO",
            cgcEmpresa: "12.345.678/0001-99",
            observacao: "Inativo por desligamento",
            cdVeiculoTracao: "",
            cdVeiculoReboque: "",
            cpf: "987.654.321-00",
            cnh: "0987654321",
            categoriaCnh: "E",
            validadeCnh: "05/05/2025",
            celular: "(24) 98888-0002",
            filialVinculoCod: "001",
            filialVinculoNome: "TRANSAFLA TRANSPORTES LTDA",
            tipo: "F",
            dataAdmissao: "15/03/2019",
            dataDesligamento: "20/12/2023",
        },

        // Filial 002
        {
            codigo: "00010",
            nome: "CARLOS PEREIRA",
            apelido: "CARLÃO",
            tpFuncao: "M",
            endereco: "RUA C, 45",
            bairro: "TAQUARAL",
            cgcEmpresa: "98.765.432/0001-11",
            observacao: "Agregado",
            cdVeiculoTracao: "000200",
            cdVeiculoReboque: "000201",
            cpf: "111.222.333-44",
            cnh: "1122334455",
            categoriaCnh: "D",
            validadeCnh: "20/11/2027",
            celular: "(19) 97777-1234",
            filialVinculoCod: "002",
            filialVinculoNome: "FILIAL 02",
            tipo: "A",
            dataAdmissao: "01/06/2024",
            dataDesligamento: "",
        },

        // Filial 003
        {
            codigo: "00020",
            nome: "ANTONIO OLIVEIRA",
            apelido: "TONINHO",
            tpFuncao: "M",
            endereco: "AV D, 777",
            bairro: "IPIRANGA",
            cgcEmpresa: "11.222.333/0001-44",
            observacao: "",
            cdVeiculoTracao: "000300",
            cdVeiculoReboque: "",
            cpf: "555.666.777-88",
            cnh: "5566778899",
            categoriaCnh: "E",
            validadeCnh: "12/12/2028",
            celular: "(15) 99123-4567",
            filialVinculoCod: "003",
            filialVinculoNome: "FILIAL 03",
            tipo: "F",
            dataAdmissao: "10/02/2021",
            dataDesligamento: "",
        },
    ];

    // Multiplica para teste
    const motoristas = Array.from({ length: 6 }).flatMap((_, rep) =>
        motoristasBase.map((m, idx) => ({
            ...m,
            id: `${rep}-${idx}-${m.codigo}`,
            codigo: String(Number(m.codigo) + rep * 100).padStart(5, "0"),
            nome: `${m.nome} ${rep > 0 ? rep : ""}`.trim(),
        }))
    );

    /* =========================================================
       4) APLICA FILTROS
    ========================================================= */
    let filtrados = [...motoristas];

    // Filial
    if (String(filtros?.filial || "999") !== "999") {
        filtrados = filtrados.filter((m) => String(m.filialVinculoCod) === String(filtros.filial));
    }

    // Tipo: F = Frota, A = Agregado, T = Todos
    if (filtros?.tipo === "F") {
        filtrados = filtrados.filter((m) => m.tipo === "F");
    } else if (filtros?.tipo === "A") {
        filtrados = filtrados.filter((m) => m.tipo === "A");
    }

    // Situação
    if (filtros?.situacao === "A") {
        filtrados = filtrados.filter((m) => isAtivoByDesligamento(m.dataDesligamento));
    } else if (filtros?.situacao === "I") {
        filtrados = filtrados.filter((m) => !isAtivoByDesligamento(m.dataDesligamento));
    }

    // Agrupamento/ordem
    const rows = buildGroupedRows(filtrados, filtros?.ordemImpressao || "F");

    /* =========================================================
       5) TOTAIS
    ========================================================= */
    const totals = [{ id: "qtd", label: "Total de Motoristas", type: "count" }];

    return (
        <RelatorioBase
            sidebarOpen={open}
            reportKey="operacao.relacao_motoristas"
            titulo={titulo}
            periodo={periodo ? periodo : `Situação: ${situacaoLabel(filtros?.situacao)} | Tipo: ${filtros?.tipo || "T"}`}
            logo={logo}
            orientation="auto"
            columns={columns}
            columnCatalog={catalogColumns}
            rows={rows}
            totals={totals}

        />
    );
}
