// src/pages/Relatorios/Seguranca/RelLogResultado.jsx
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
    const ini = filtros?.periodoIni ? isoToBR(filtros.periodoIni) : "";
    const fim = filtros?.periodoFim ? isoToBR(filtros.periodoFim) : "";
    if (ini && fim) return `${ini} a ${fim}`;
    if (ini) return `A partir de ${ini}`;
    if (fim) return `Até ${fim}`;
    return "";
}

/* =========================================================
   RESULTADO
========================================================= */
export default function RelLogResultado({ open }) {
    const logo = localStorage.getItem("param_logoBg") || "";
    const { state } = useLocation();

    const filtros = state?.filtros || {};
    const periodo = buildPeriodo(filtros);

    /* =========================================================
       1) CATÁLOGO DE COLUNAS
    ========================================================= */
    const catalogColumns = [
        { id: "usuario", label: "Usuário", accessor: "usuario", width: 100 },
        { id: "data", label: "Data", accessor: "data", width: 130 },
        { id: "direito", label: "Direito", accessor: "direito", width: 180 },
        { id: "descricao", label: "Descrição", accessor: "descricao", width: 350 },
    ];

    /* =========================================================
       2) LAYOUT PADRÃO
    ========================================================= */
    const layoutPadrao = ["usuario", "data", "direito", "descricao"];

    const columns = layoutPadrao
        .map((id) => catalogColumns.find((c) => c.id === id))
        .filter(Boolean);

    /* =========================================================
       3) MOCK (substitui depois por API)
    ========================================================= */
    const base = [
        {
            usuario: "EDSON2",
            data: "06/02/2026 15:35",
            direito: "7001 - Manutencao\nOrdem de Coleta",
            descricao: "Inclusão da coleta no. 006950 Operador:\nEDSON2",
        },
        {
            usuario: "EDSON2",
            data: "06/02/2026 15:38",
            direito: "7001 - Manutencao\nOrdem de Coleta",
            descricao: "Alteração da coleta no. 006951 Operador:\nEDSON2",
        },
        {
            usuario: "EDSON2",
            data: "06/02/2026 15:44",
            direito: "7001 - Manutencao\nOrdem de Coleta",
            descricao: "Alteração da coleta no. 006952 Operador:\nEDSON2",
        },
        {
            usuario: "EDSON2",
            data: "06/02/2026 15:49",
            direito: "7001 - Manutencao\nOrdem de Coleta",
            descricao: "Alteração da coleta no. 006951 Operador:\nEDSON2",
        },
        {
            usuario: "EDSON2",
            data: "06/02/2026 15:52",
            direito: "7001 - Manutencao\nOrdem de Coleta",
            descricao: "Alteração da coleta no. 006950 Operador:\nEDSON2",
        },
        {
            usuario: "EDSON2",
            data: "06/02/2026 15:52",
            direito: "7001 - Manutencao\nOrdem de Coleta",
            descricao: "Alteração da coleta no. 006950 Operador:\nEDSON2",
        },
        {
            usuario: "EDSON2",
            data: "06/02/2026 15:57",
            direito: "7001 - Manutencao\nOrdem de Coleta",
            descricao: "Inicializacao da Coleta no. 006960 Operador:\nEDSON2",
        },
        {
            usuario: "EDSON2",
            data: "06/02/2026 15:59",
            direito: "7001 - Manutencao\nOrdem de Coleta",
            descricao: "Inicializacao da Coleta no. 006961 Operador:\nEDSON2",
        },
        {
            usuario: "EDSON2",
            data: "06/02/2026 16:01",
            direito: "7001 - Manutencao\nOrdem de Coleta",
            descricao: "Inicializacao da coleta no. 006962 Operador:\nEDSON2",
        },
        {
            usuario: "EDSON2",
            data: "06/02/2026 18:01",
            direito: "7001 - Manutencao\nOrdem de Coleta",
            descricao: "Inclusão da coleta no. 006953 Operador:\nEDSON2",
        },
        {
            usuario: "Caique2",
            data: "06/02/2026 18:01",
            direito: "7001 - Manutencao\nOrdem de Coleta",
            descricao: "Inclusão da Coleta no. 006953 Operador:\nCaique2",
        },
        {
            usuario: "Caique2",
            data: "06/02/2026 18:01",
            direito: "7001 - Manutencao\nOrdem de Coleta",
            descricao: "Alteração da Coleta no. 006953 Operador:\nCaique2",
        },
        {
            usuario: "EDSON2",
            data: "06/02/2026 18:34",
            direito: "7001 - Manutencao\nOrdem de Coleta",
            descricao: "Alteração da coleta no. 006952 Operador:\nEDSON",
        },
        {
            usuario: "THALLYTA",
            data: "09/02/2026 12:54",
            direito: "7290 - Incluir - Títulos\nContas a Pagar",
            descricao: "Incluir - Contas Pagar Título nº: 8312/1 CNPJ\n14100013000147",
        },
        {
            usuario: "THALLYTA",
            data: "09/02/2026 12:59",
            direito: "7290 - Incluir - Títulos\nContas a Pagar",
            descricao: "Incluir - Contas Pagar Título nº: FEV/26/1 CNPJ\n07805990000184",
        },
        {
            usuario: "THALLYTA",
            data: "09/02/2026 12:59",
            direito: "7290 - Incluir - Títulos\nContas a Pagar",
            descricao: "Incluir - Contas Pagar Título nº:\nFEVEREIRO/26/1 CNPJ 07805990000184",
        },
        {
            usuario: "THALLYTA",
            data: "09/02/2026 12:59",
            direito: "7290 - Incluir - Títulos\nContas a Pagar",
            descricao: "Incluir - Contas Pagar Título nº: 113-26/1 CNPJ\n30948705000104",
        },
        {
            usuario: "THALLYTA",
            data: "09/02/2026 12:59",
            direito: "7290 - Incluir - Títulos\nContas a Pagar",
            descricao: "Incluir - Contas Pagar Título nº: TAXA TRI/2026\nIBAMA/1 CNPJ 03659166000102",
        },
        {
            usuario: "THALLYTA",
            data: "09/02/2026 12:59",
            direito: "7290 - Incluir - Títulos\nContas a Pagar",
            descricao: "Incluir - Contas Pagar Título nº: TAXA TRI/2026\nIBAMA/2 CNPJ 03659166000102",
        },
        {
            usuario: "THALLYTA",
            data: "09/02/2026 12:59",
            direito: "7290 - Incluir - Títulos\nContas a Pagar",
            descricao: "Incluir - Contas Pagar Título nº: TAXA TRI/2026\nIBAMA/3 CNPJ 03659166000102",
        },
        {
            usuario: "THALLYTA",
            data: "09/02/2026 12:59",
            direito: "7290 - Incluir - Títulos\nContas a Pagar",
            descricao: "Incluir - Contas Pagar Título nº: TAXA TRI/2026\nIBAMA/4 CNPJ 03659166000102",
        },
    ];

    const rows = base.map((b, idx) => ({
        ...b,
        id: `log-${idx}`,
    }));

    /* =========================================================
       4) TOTAIS
    ========================================================= */
    const totals = [{ id: "qtd", label: "Total de Registros", type: "count" }];

    return (
        <div className="mt-[-16px] ml-[-16px] w-[calc(100%+32px)]">
            <RelatorioBase
                /* NÃO passar sidebarOpen para que effectiveSidebarOffsetPx seja 0 */
                reportKey="seguranca.relatorio_log"
                titulo="Relatório Log de Transação"
                periodo={periodo}
                logo={logo}
                orientation="auto"
                columns={columns}
                columnCatalog={catalogColumns}
                rows={rows}
                totals={totals}
                /* Força offset lateral zero (o main já tem ml-52) */
                sidebarOffsetPx={0.1}
                /* O viewport deve descontar apenas os 48px do Header real */
                topOffsetPx={48}
                /* Compensa os 16px de padding do <main> para colar no Header */
                stickyTopPx={-16}
            />
        </div>
    );
}
