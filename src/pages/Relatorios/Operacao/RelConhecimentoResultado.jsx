// src/pages/Relatorios/Operacao/RelConhecimentoResultado.jsx
import RelatorioBase from "../base/RelatorioBase";

export default function RelConhecimentoResultado({ open }) {
    const logo = localStorage.getItem("param_logoBg") || "";
    const periodo = "23/01/2026 a 25/01/2026";

    /* =========================================================
       1) CATÁLOGO COMPLETO (inclui EXTRAS p/ aparecer em "Campos disponíveis")
       ✅ O segredo é passar isso no prop `columnCatalog`
    ========================================================= */
    const catalogColumns = [
        { id: "ctrc", label: "CTRC", accessor: "ctrc", width: 90 },
        { id: "emissao", label: "Dt. Emis.", accessor: "emissao", width: 90 },
        { id: "remetente", label: "Remetente", accessor: "remetente", width: 160 },
        { id: "cidade", label: "Cidade", accessor: "cidade", width: 130 },
        { id: "destinatario", label: "Destinatário", accessor: "destinatario", width: 170 },
        { id: "cidadeEntrega", label: "Cidade Entrega", accessor: "cidadeEntrega", width: 150 },

        {
            id: "peso",
            label: "Peso",
            accessor: (r) =>
                Number(r.peso || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
            width: 80,
            align: "right",
        },
        {
            id: "imposto",
            label: "Imposto",
            accessor: (r) =>
                `R$ ${Number(r.imposto || 0).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                })}`,
            width: 90,
            align: "right",
        },
        {
            id: "pedagio",
            label: "Pedágio",
            accessor: (r) =>
                Number(r.pedagio || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
            width: 80,
            align: "right",
        },
        {
            id: "vrFrete",
            label: "VR Frete",
            accessor: (r) =>
                `R$ ${Number(r.vrFrete || 0).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                })}`,
            width: 95,
            align: "right",
        },
        { id: "status", label: "Status", accessor: "status", width: 90 },

        // ======= EXTRAS (DISPONÍVEIS P/ PERSONALIZAÇÃO) =======
        {
            id: "gris",
            label: "Gris",
            accessor: (r) =>
                `R$ ${Number(r.gris || 0).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                })}`,
            width: 85,
            align: "right",
        },
        {
            id: "advalorem",
            label: "Advalorem",
            accessor: (r) =>
                `R$ ${Number(r.advalorem || 0).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                })}`,
            width: 95,
            align: "right",
        },
        {
            id: "aliquotaIcms",
            label: "Al. ICMS",
            accessor: (r) =>
                `${Number(r.aliquotaIcms || 0).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                })}%`,
            width: 80,
            align: "right",
        },
        { id: "cfop", label: "CFOP", accessor: "cfop", width: 70 },
        { id: "cst", label: "CST", accessor: "cst", width: 60 },
        { id: "motorista", label: "Motorista", accessor: "motorista", width: 160 },
        { id: "placa", label: "Placa", accessor: "placa", width: 85 },
    ];

    /* =========================================================
       2) LAYOUT PADRÃO MANTRAN (11 colunas)
    ========================================================= */
    const layoutPadraoMantran = [
        "ctrc",
        "emissao",
        "remetente",
        "cidade",
        "destinatario",
        "cidadeEntrega",
        "peso",
        "imposto",
        "pedagio",
        "vrFrete",
        "status",
    ];

    // colunas efetivas renderizadas hoje (padrão)
    const columns = layoutPadraoMantran
        .map((id) => catalogColumns.find((c) => c.id === id))
        .filter(Boolean);

    /* =========================================================
       3) DETALHE (NOTAS)
    ========================================================= */
    const detailColumns = [
        { id: "nf", label: "Nº NF", accessor: "nf" },
        { id: "serie", label: "Série", accessor: "serie" },
        { id: "emissao", label: "Dt Emissão", accessor: "emissao" },
        { id: "vol", label: "Vol.", accessor: "volumes", align: "right" },
        {
            id: "peso",
            label: "Peso",
            accessor: (r) =>
                Number(r.peso || 0).toLocaleString("pt-BR", { minimumFractionDigits: 3 }),
            align: "right",
        },
        {
            id: "valorNF",
            label: "Valor NF",
            accessor: (r) =>
                Number(r.valorNF || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
            align: "right",
        },
    ];

    /* =========================================================
       4) MOCK DE 10 REGISTROS (com extras preenchidos)
    ========================================================= */
    const base = [
        {
            ctrc: "181248",
            emissao: "23/01/2026",
            remetente: "SESTINI ITAJAI",
            cidade: "NAVEGANTES - SC",
            destinatario: "AGENCIA DE VIAGENS LTDA",
            cidadeEntrega: "SAO PAULO - SP",
            peso: 10.0,
            imposto: 16.81,
            pedagio: 7.6,
            vrFrete: 140.11,
            status: "Impresso",

            // extras
            gris: 4.5,
            advalorem: 12.3,
            aliquotaIcms: 12.0,
            cfop: "5353",
            cst: "00",
            motorista: "JOÃO DA SILVA",
            placa: "ABC1D23",

            notas: [
                {
                    nf: "10251471",
                    serie: "5",
                    emissao: "22/01/2026",
                    volumes: 2,
                    peso: 104.72,
                    valorNF: 376401.03,
                },
                {
                    nf: "10251472",
                    serie: "5",
                    emissao: "22/01/2026",
                    volumes: 2,
                    peso: 20.28,
                    valorNF: 56408.95,
                },
            ],
        },
        {
            ctrc: "181249",
            emissao: "23/01/2026",
            remetente: "SESTINI ITAJAI",
            cidade: "NAVEGANTES - SC",
            destinatario: "VACANZA AGENCIA LTDA",
            cidadeEntrega: "SAO PAULO - SP",
            peso: 8.5,
            imposto: 14.2,
            pedagio: 6.3,
            vrFrete: 132.5,
            status: "Impresso",

            // extras
            gris: 3.9,
            advalorem: 10.8,
            aliquotaIcms: 12.0,
            cfop: "5353",
            cst: "00",
            motorista: "CARLOS PEREIRA",
            placa: "DEF4G56",

            notas: [{ nf: "10251480", serie: "5", emissao: "22/01/2026", volumes: 1, peso: 12.345, valorNF: 15400.55 }],
        },
        {
            ctrc: "181250",
            emissao: "23/01/2026",
            remetente: "SESTINI ITAJAI",
            cidade: "NAVEGANTES - SC",
            destinatario: "KM AGENCIA LTDA",
            cidadeEntrega: "SAO PAULO - SP",
            peso: 11.2,
            imposto: 18.05,
            pedagio: 7.6,
            vrFrete: 155.0,
            status: "Impresso",

            gris: 5.1,
            advalorem: 13.2,
            aliquotaIcms: 12.0,
            cfop: "5353",
            cst: "00",
            motorista: "MARCOS LIMA",
            placa: "GHI7J89",

            notas: [{ nf: "10251481", serie: "5", emissao: "22/01/2026", volumes: 3, peso: 55.0, valorNF: 90210.0 }],
        },
        {
            ctrc: "181251",
            emissao: "23/01/2026",
            remetente: "SESTINI ITAJAI",
            cidade: "NAVEGANTES - SC",
            destinatario: "PRC VIAGENS LTDA",
            cidadeEntrega: "SAO PAULO - SP",
            peso: 9.75,
            imposto: 15.5,
            pedagio: 7.6,
            vrFrete: 141.2,
            status: "Impresso",

            gris: 4.2,
            advalorem: 11.0,
            aliquotaIcms: 12.0,
            cfop: "5353",
            cst: "00",
            motorista: "ANA SOUZA",
            placa: "KLM0N12",

            notas: [{ nf: "10251482", serie: "5", emissao: "22/01/2026", volumes: 2, peso: 18.765, valorNF: 24000.0 }],
        },
        {
            ctrc: "181252",
            emissao: "23/01/2026",
            remetente: "SESTINI ITAJAI",
            cidade: "NAVEGANTES - SC",
            destinatario: "CCB 8899 VIAGENS",
            cidadeEntrega: "SAO PAULO - SP",
            peso: 10.0,
            imposto: 16.81,
            pedagio: 7.6,
            vrFrete: 140.11,
            status: "Impresso",

            gris: 4.6,
            advalorem: 12.1,
            aliquotaIcms: 12.0,
            cfop: "5353",
            cst: "00",
            motorista: "RAFAEL MORAES",
            placa: "OPQ3R45",

            notas: [{ nf: "10251483", serie: "5", emissao: "22/01/2026", volumes: 1, peso: 9.123, valorNF: 9800.45 }],
        },
        {
            ctrc: "181253",
            emissao: "23/01/2026",
            remetente: "SESTINI ITAJAI",
            cidade: "NAVEGANTES - SC",
            destinatario: "KM AGENCIA DE VIAGENS",
            cidadeEntrega: "SAO PAULO - SP",
            peso: 12.3,
            imposto: 19.4,
            pedagio: 7.6,
            vrFrete: 161.0,
            status: "Impresso",

            gris: 5.4,
            advalorem: 14.0,
            aliquotaIcms: 12.0,
            cfop: "5353",
            cst: "00",
            motorista: "BRUNO ALVES",
            placa: "STU6V78",

            notas: [{ nf: "10251484", serie: "5", emissao: "22/01/2026", volumes: 4, peso: 60.111, valorNF: 120500.99 }],
        },
        {
            ctrc: "181254",
            emissao: "23/01/2026",
            remetente: "SESTINI ITAJAI",
            cidade: "NAVEGANTES - SC",
            destinatario: "CVC BRASIL OPERADORA",
            cidadeEntrega: "SAO PAULO - SP",
            peso: 7.8,
            imposto: 13.3,
            pedagio: 6.9,
            vrFrete: 128.7,
            status: "Impresso",

            gris: 3.5,
            advalorem: 10.2,
            aliquotaIcms: 12.0,
            cfop: "5353",
            cst: "00",
            motorista: "FERNANDA COSTA",
            placa: "WXY9Z01",

            notas: [{ nf: "10251485", serie: "5", emissao: "22/01/2026", volumes: 2, peso: 22.333, valorNF: 45000.0 }],
        },
        {
            ctrc: "181255",
            emissao: "23/01/2026",
            remetente: "SESTINI ITAJAI",
            cidade: "NAVEGANTES - SC",
            destinatario: "GBP VIAGENS LTDA",
            cidadeEntrega: "SAO PAULO - SP",
            peso: 9.0,
            imposto: 14.9,
            pedagio: 7.1,
            vrFrete: 136.25,
            status: "Impresso",

            gris: 3.8,
            advalorem: 10.9,
            aliquotaIcms: 12.0,
            cfop: "5353",
            cst: "00",
            motorista: "PEDRO HENRIQUE",
            placa: "BCD2E34",

            notas: [
                { nf: "10251486", serie: "5", emissao: "22/01/2026", volumes: 1, peso: 5.555, valorNF: 8700.0 },
                { nf: "10251487", serie: "5", emissao: "22/01/2026", volumes: 2, peso: 15.111, valorNF: 19500.0 },
            ],
        },
        {
            ctrc: "181256",
            emissao: "23/01/2026",
            remetente: "SESTINI ITAJAI",
            cidade: "NAVEGANTES - SC",
            destinatario: "CVC BRASIL OPERADORA",
            cidadeEntrega: "SANTO ANDRE - SP",
            peso: 10.0,
            imposto: 16.81,
            pedagio: 7.6,
            vrFrete: 140.11,
            status: "Impresso",

            gris: 4.7,
            advalorem: 12.4,
            aliquotaIcms: 12.0,
            cfop: "5353",
            cst: "00",
            motorista: "LUCAS MENDES",
            placa: "FGH5I67",

            notas: [{ nf: "10251488", serie: "5", emissao: "22/01/2026", volumes: 3, peso: 30.0, valorNF: 60000.0 }],
        },
        {
            ctrc: "181257",
            emissao: "23/01/2026",
            remetente: "SESTINI ITAJAI",
            cidade: "NAVEGANTES - SC",
            destinatario: "YELLOW & BLUE",
            cidadeEntrega: "SAO CAETANO - SP",
            peso: 10.0,
            imposto: 16.81,
            pedagio: 7.6,
            vrFrete: 140.11,
            status: "Impresso",

            gris: 4.2,
            advalorem: 11.8,
            aliquotaIcms: 12.0,
            cfop: "5353",
            cst: "00",
            motorista: "DIEGO ROCHA",
            placa: "JKL8M90",

            notas: [{ nf: "10251489", serie: "5", emissao: "22/01/2026", volumes: 2, peso: 14.25, valorNF: 22000.0 }],
        },
    ];

    /* =========================================================
       5) 100 LINHAS (10 diferentes x 10 repetições)
    ========================================================= */
    const rows = Array.from({ length: 10 }).flatMap((_, rep) =>
        base.map((b, idx) => ({
            ...b,
            id: `${rep}-${idx}-${b.ctrc}`,
            ctrc: String(Number(b.ctrc) + rep * 20 + idx),
        }))
    );

    /* =========================================================
       6) TOTAIS (NO FINAL)
    ========================================================= */
    const totals = [
        { id: "qtd", label: "Total de CTRC", type: "count" },
        { id: "peso", label: "Total Peso", type: "sum", accessor: "peso" },
        { id: "imp", label: "Total Imposto", type: "sum", accessor: "imposto", format: "money" },
        { id: "frete", label: "Total Frete", type: "sum", accessor: "vrFrete", format: "money" },

        // extras também podem ser totalizados
        { id: "gris", label: "Total Gris", type: "sum", accessor: "gris", format: "money" },
        { id: "adv", label: "Total Advalorem", type: "sum", accessor: "advalorem", format: "money" },
    ];

    return (
        <RelatorioBase
            sidebarOpen={open}
            reportKey="operacao.conhecimento_emitidos"
            titulo="Relatório de CTRC´s Emitidos"
            periodo={periodo}
            logo={logo}
            orientation="auto"
            columns={columns}
            columnCatalog={catalogColumns}   // ✅ AQUI: libera GRIS/Advalorem/CST/CFOP etc no modal
            rows={rows}
            detail={{
                enabled: true,
                key: "notas",
                columns: detailColumns,
                toggleColumnId: "ctrc",
            }}
            totals={totals}

        // ✅ IMPORTANTE: não sobrescrever o export padrão do RelatorioBase
        // onExportPDF={...}
        // onExportExcel={...}
        />
    );
}
