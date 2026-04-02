// src/pages/Relatorios/Operacao/RelAgregadoResultado.jsx
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

function isAtivoByDesligamento(dt) {
    return !String(dt || "").trim(); // vazio = ativo | preenchido = inativo
}

function parseISODate(d) {
    // aceita "YYYY-MM-DD" (input type=date)
    const s = String(d || "").trim();
    if (!s) return null;
    const t = new Date(s + "T00:00:00");
    if (Number.isNaN(t.getTime())) return null;
    return t;
}

/* =========================================================
   AGRUPAMENTO (Filial)
   - cria linhas "sintéticas" sem mexer no RelatorioBase
========================================================= */
function buildGroupedRows(rows, ordemImpressao) {
    // Nome (N) = sem agrupamento
    if (ordemImpressao === "N") {
        return [...rows].sort((a, b) =>
            String(a.razaoSocial || "").localeCompare(String(b.razaoSocial || ""))
        );
    }

    // Filial (F) = agrupa por filial, ordena por razão social
    const sorted = [...rows].sort((a, b) => {
        const fa = onlyDigits(a.filialVinculoCod);
        const fb = onlyDigits(b.filialVinculoCod);
        if (fa !== fb) return fa.localeCompare(fb);

        return String(a.razaoSocial || "").localeCompare(String(b.razaoSocial || ""));
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

    sorted.forEach((r, i) => {
        const filialKey = String(r.filialVinculoCod || "");

        if (filialKey !== lastFilial) {
            flushCount();
            lastFilial = filialKey;

            out.push({
                id: `filial_${filialKey}_${i}`,
                __type: "filial",
                filialLabel: `FILIAL  ${String(r.filialVinculoCod).padStart(3, "0")}   ${r.filialVinculoNome}`,
            });
        }

        out.push({
            ...r,
            id: r.id || `a_${filialKey}_${i}`,
        });

        count += 1;
    });

    flushCount();
    return out;
}

function tipoAgregadoLabel(tp) {
    if (tp === "A") return "AGREGADO";
    if (tp === "T") return "TERCEIRO";
    if (tp === "C") return "COOPERATIVA";
    return tp || "";
}

/* =========================================================
   RESULTADO
========================================================= */
export default function RelAgregadoResultado({ open }) {
    const logo = localStorage.getItem("param_logoBg") || "";
    const { state } = useLocation();
    const filtros = state?.filtros || {};

    const titulo = "RELAÇÃO DE AGREGADOS";

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
                if (r?.__type === "qtde") return "Qtde:";
                return r.codigo || "";
            },
        },
        {
            id: "razaoSocial",
            label: "Razão Social",
            width: 260,
            accessor: (r) =>
                r?.__type === "qtde" ? String(r.qtde || 0) : r?.__type ? "" : r.razaoSocial || "",
        },
        {
            id: "cpfCnpj",
            label: "CPF/CNPJ",
            width: 130,
            accessor: (r) => (r?.__type ? "" : r.cpfCnpj || ""),
        },
        {
            id: "ie",
            label: "IE",
            width: 100,
            accessor: (r) => (r?.__type ? "" : r.ie || ""),
        },
        {
            id: "cidade",
            label: "Cidade",
            width: 150,
            accessor: (r) => (r?.__type ? "" : r.cidade || ""),
        },
        {
            id: "uf",
            label: "UF",
            width: 45,
            accessor: (r) => (r?.__type ? "" : r.uf || ""),
            align: "center",
        },
        {
            id: "tpAgregado",
            label: "TP_Agregado",
            width: 110,
            accessor: (r) => (r?.__type ? "" : tipoAgregadoLabel(r.tpAgregado)),
        },
        {
            id: "tpEmpresa",
            label: "TP_Empresa",
            width: 90,
            accessor: (r) => (r?.__type ? "" : r.tpEmpresa || ""),
            align: "center",
        },
        {
            id: "rntrc",
            label: "RNTRC",
            width: 110,
            accessor: (r) => (r?.__type ? "" : r.rntrc || ""),
        },

        // ====== EXTRAS (+Campos) ======
        { id: "sexo", label: "Sexo", width: 70, accessor: (r) => (r?.__type ? "" : r.sexo || "") },
        { id: "estadoCivil", label: "Estado Civil", width: 120, accessor: (r) => (r?.__type ? "" : r.estadoCivil || "") },
        { id: "chavePix", label: "Chave Pix", width: 180, accessor: (r) => (r?.__type ? "" : r.chavePix || "") },
        { id: "dtNascimento", label: "DT Nascimento", width: 110, accessor: (r) => (r?.__type ? "" : r.dtNascimento || "") },
        { id: "favorecidoConta", label: "Favorecido_Conta", width: 180, accessor: (r) => (r?.__type ? "" : r.favorecidoConta || "") },
        { id: "contato", label: "Contato", width: 150, accessor: (r) => (r?.__type ? "" : r.contato || "") },
        { id: "fone", label: "Fone", width: 120, accessor: (r) => (r?.__type ? "" : r.fone || "") },

        // auxiliares p/ filtros (não precisa mostrar no layout padrão, mas pode aparecer no +Campos)
        { id: "dtCadastro", label: "DT Cadastro", width: 110, accessor: (r) => (r?.__type ? "" : r.dtCadastro || "") },
        { id: "dtDesligamentoAgregado", label: "DT Desligamento", width: 130, accessor: (r) => (r?.__type ? "" : r.dtDesligamentoAgregado || "") },
        { id: "filialVinculo", label: "Filial", width: 60, accessor: (r) => (r?.__type ? "" : r.filialVinculoCod || ""), align: "right" },
    ];

    /* =========================================================
       2) LAYOUT PADRÃO (do relatório)
    ========================================================= */
    const layoutPadrao = [
        "codigo",
        "razaoSocial",
        "cpfCnpj",
        "ie",
        "cidade",
        "uf",
        "tpAgregado",
        "tpEmpresa",
        "rntrc",
    ];

    const columns = layoutPadrao.map((id) => catalogColumns.find((c) => c.id === id)).filter(Boolean);

    /* =========================================================
       3) MOCK DADOS (3 filiais + variedades)
       Campos reais:
       - DT_Desligamento_Agregado
       - TP_Agregado (A/T/C)
       - TP_Empresa (TAC/ETC)
       - RNTRC
       - DT_Cadastro (mock)
    ========================================================= */
    const base = [
        // 001
        {
            codigo: "00001",
            razaoSocial: "AGREGADO JOAO LTDA",
            cpfCnpj: "12.345.678/0001-99",
            ie: "ISENTO",
            cidade: "PETROPOLIS",
            uf: "RJ",
            tpAgregado: "A",
            tpEmpresa: "TAC",
            rntrc: "12345678",
            dtCadastro: "2025-01-10",
            dtDesligamentoAgregado: "",

            filialVinculoCod: "001",
            filialVinculoNome: "MATRIZ",

            sexo: "M",
            estadoCivil: "Casado",
            chavePix: "123.456.789-00",
            dtNascimento: "1990-05-12",
            favorecidoConta: "JOAO DA SILVA",
            contato: "JOAO",
            fone: "(24) 99999-0001",
        },
        {
            codigo: "00002",
            razaoSocial: "TERCEIRO MARIA TRANSP",
            cpfCnpj: "987.654.321-00",
            ie: "123.456.789.000",
            cidade: "PETROPOLIS",
            uf: "RJ",
            tpAgregado: "T",
            tpEmpresa: "ETC",
            rntrc: "22334455",
            dtCadastro: "2024-12-01",
            dtDesligamentoAgregado: "2025-08-20", // inativo

            filialVinculoCod: "001",
            filialVinculoNome: "MATRIZ",

            sexo: "F",
            estadoCivil: "Solteira",
            chavePix: "maria@pix.com",
            dtNascimento: "1988-11-02",
            favorecidoConta: "MARIA SOUZA",
            contato: "MARIA",
            fone: "(24) 98888-0002",
        },

        // 002
        {
            codigo: "00010",
            razaoSocial: "COOPERATIVA DO CARLOS",
            cpfCnpj: "11.222.333/0001-44",
            ie: "99887766",
            cidade: "CAMPINAS",
            uf: "SP",
            tpAgregado: "C",
            tpEmpresa: "ETC",
            rntrc: "55667788",
            dtCadastro: "2025-03-15",
            dtDesligamentoAgregado: "",

            filialVinculoCod: "002",
            filialVinculoNome: "FILIAL 02",

            sexo: "M",
            estadoCivil: "Divorciado",
            chavePix: "11.222.333/0001-44",
            dtNascimento: "1981-02-10",
            favorecidoConta: "COOP CARLOS",
            contato: "CARLOS",
            fone: "(19) 97777-1234",
        },

        // 003
        {
            codigo: "00020",
            razaoSocial: "AGREGADO ANTONIO OLIVEIRA",
            cpfCnpj: "555.666.777-88",
            ie: "ISENTO",
            cidade: "SOROCABA",
            uf: "SP",
            tpAgregado: "A",
            tpEmpresa: "TAC",
            rntrc: "88990011",
            dtCadastro: "2025-06-05",
            dtDesligamentoAgregado: "",

            filialVinculoCod: "003",
            filialVinculoNome: "FILIAL 03",

            sexo: "M",
            estadoCivil: "Casado",
            chavePix: "555.666.777-88",
            dtNascimento: "1992-09-01",
            favorecidoConta: "ANTONIO OLIVEIRA",
            contato: "ANTONIO",
            fone: "(15) 99123-4567",
        },
    ];

    // Multiplica pra testar paginação
    const agregados = Array.from({ length: 6 }).flatMap((_, rep) =>
        base.map((a, idx) => ({
            ...a,
            id: `${rep}-${idx}-${a.codigo}`,
            codigo: String(Number(a.codigo) + rep * 100).padStart(5, "0"),
            razaoSocial: `${a.razaoSocial}${rep > 0 ? ` ${rep}` : ""}`,
            // mexe um pouco nas datas só pra ficar "vivo" nos testes
            dtCadastro: a.dtCadastro,
        }))
    );

    /* =========================================================
       4) FILTROS
    ========================================================= */
    let filtrados = [...agregados];

    // Filial
    if (String(filtros?.filial || "999") !== "999") {
        filtrados = filtrados.filter((a) => String(a.filialVinculoCod) === String(filtros.filial));
    }

    // Situação
    if (filtros?.situacao === "A") {
        filtrados = filtrados.filter((a) => isAtivoByDesligamento(a.dtDesligamentoAgregado));
    } else if (filtros?.situacao === "I") {
        filtrados = filtrados.filter((a) => !isAtivoByDesligamento(a.dtDesligamentoAgregado));
    }

    // Tipo Agregado (TP_Agregado)
    if (String(filtros?.tipoAgregado || "TDS") !== "TDS") {
        filtrados = filtrados.filter((a) => String(a.tpAgregado) === String(filtros.tipoAgregado));
    }

    // Tipo Empresa (TP_Empresa)
    if (String(filtros?.tipoEmpresa || "TDS") !== "TDS") {
        filtrados = filtrados.filter((a) => String(a.tpEmpresa) === String(filtros.tipoEmpresa));
    }

    // Período Data Cadastro
    const dtIni = parseISODate(filtros?.dtIni);
    const dtFim = parseISODate(filtros?.dtFim);

    if (dtIni || dtFim) {
        filtrados = filtrados.filter((a) => {
            const d = parseISODate(a.dtCadastro);
            if (!d) return false;
            if (dtIni && d < dtIni) return false;
            if (dtFim && d > dtFim) return false;
            return true;
        });
    }

    // Agrupamento / ordenação
    const rows = buildGroupedRows(filtrados, filtros?.ordemImpressao || "F");

    /* =========================================================
       5) TOTAIS
    ========================================================= */
    const totals = [{ id: "qtd", label: "Total de Agregados", type: "count" }];

    return (
        <RelatorioBase
            sidebarOpen={open}
            reportKey="operacao.relacao_agregados"
            titulo={titulo}
            periodo={
                periodo
                    ? periodo
                    : `Situação: ${situacaoLabel(filtros?.situacao)} | Tipo: ${filtros?.tipoAgregado || "TDS"
                    } | Empresa: ${filtros?.tipoEmpresa || "TDS"}`
            }
            logo={logo}
            orientation="auto"
            columns={columns}
            columnCatalog={catalogColumns}
            rows={rows}
            totals={totals}

        />
    );
}
