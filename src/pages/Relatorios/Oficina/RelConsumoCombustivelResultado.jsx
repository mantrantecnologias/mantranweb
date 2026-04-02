// src/pages/Relatorios/Oficina/RelConsumoCombustivelResultado.jsx
import { useLocation } from "react-router-dom";
import RelatorioBase from "../base/RelatorioBase";

function n2(v) {
    return Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

function money(v) {
    return `R$ ${Number(v || 0).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
    })}`;
}

// ✅ cria linhas de agrupamento por placa (veiculoPlaca)
function groupByPlaca(rows) {
    const map = new Map();
    rows.forEach((r) => {
        const key = r.veiculoPlaca || "(SEM PLACA)";
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(r);
    });

    const out = [];
    Array.from(map.keys()).forEach((placa) => {
        out.push({
            id: `grp_${placa}`,
            __type: "group",
            groupLabel: `Veículo (Placa): ${placa}`,
        });
        map.get(placa).forEach((r) => out.push(r));
    });

    return out;
}

export default function RelConsumoCombustivelResultado({ open }) {
    const { state } = useLocation();
    const filtros = state?.filtros || {};

    const logo = localStorage.getItem("param_logoBg") || "";

    // período exibido no topo do relatório (dd/mm/aaaa)
    const periodo = (() => {
        const ini = filtros?.dataIni || "";
        const fim = filtros?.dataFim || "";
        const fmt = (iso) => {
            if (!iso) return "";
            const [y, m, d] = String(iso).split("-");
            if (!y || !m || !d) return iso;
            return `${d}/${m}/${y}`;
        };
        return `${fmt(ini)} a ${fmt(fim)}`.trim();
    })();

    /* =========================================================
       1) CATÁLOGO COMPLETO (inclui extras p/ +Campos)
       - extras: Posto, Cidade, UF (conforme pedido)
    ========================================================= */
    const catalogColumns = [
        { id: "dataHora", label: "Data/Hora", accessor: "dataHora", width: 120 },
        { id: "veiculoPlaca", label: "Placa", accessor: "veiculoPlaca", width: 85 },
        { id: "motorista", label: "Motorista", accessor: "motorista", width: 180 },
        { id: "km", label: "KM", accessor: "km", width: 70, align: "right" },
        {
            id: "litros",
            label: "Qtde Litros",
            accessor: (r) => n2(r.litros),
            width: 90,
            align: "right",
        },
        {
            id: "valorLitro",
            label: "Valor",
            accessor: (r) => n2(r.valorLitro),
            width: 70,
            align: "right",
        },
        {
            id: "valorTotal",
            label: "Total",
            accessor: (r) => money(r.valorTotal),
            width: 90,
            align: "right",
        },

        // ===== EXTRAS p/ +Campos =====
        { id: "posto", label: "Posto", accessor: "posto", width: 200 },
        { id: "cidade", label: "Cidade", accessor: "cidade", width: 140 },
        { id: "uf", label: "UF", accessor: "uf", width: 45 },
    ];

    /* =========================================================
       2) LAYOUT PADRÃO (o que aparece por default)
    ========================================================= */
    const layoutPadrao = [
        "dataHora",
        "motorista",
        "litros",
        "valorLitro",
        "valorTotal",
        "km",
        "veiculoPlaca",
    ];

    const columns = layoutPadrao
        .map((id) => catalogColumns.find((c) => c.id === id))
        .filter(Boolean);

    /* =========================================================
       3) MOCK (base) + volume
    ========================================================= */
    const base = [
        {
            dataHora: "15/02/2026 08:12",
            veiculoPlaca: "RXW4156",
            motorista: "ALAN DA COSTA",
            km: 98,
            litros: 50.0,
            valorLitro: 6.0,
            valorTotal: 300.0,
            posto: "VTA",
            cidade: "ITAJAÍ",
            uf: "SC",
        },
        {
            dataHora: "15/02/2026 12:40",
            veiculoPlaca: "RXW4156",
            motorista: "ALAN DA COSTA",
            km: 210,
            litros: 20.0,
            valorLitro: 5.5,
            valorTotal: 110.0,
            posto: "AUTO POSTO SACI LTDA",
            cidade: "ITAJAÍ",
            uf: "SC",
        },
        {
            dataHora: "15/02/2026 09:30",
            veiculoPlaca: "EVO1623",
            motorista: "DANIEL ALVARENGA BATISTA",
            km: 700,
            litros: 10.0,
            valorLitro: 5.0,
            valorTotal: 50.0,
            posto: "POSTO DE SERVIÇOS NOVA CASTELO LTDA",
            cidade: "NAVEGANTES",
            uf: "SC",
        },
        {
            dataHora: "15/02/2026 10:15",
            veiculoPlaca: "EVO1623",
            motorista: "DANIEL ALVARENGA BATISTA",
            km: 900,
            litros: 15.0,
            valorLitro: 5.0,
            valorTotal: 75.0,
            posto: "POSTO DE SERVIÇOS NOVA CASTELO LTDA",
            cidade: "NAVEGANTES",
            uf: "SC",
        },
    ];

    // cria volume (ex: 40 linhas)
    const rowsRaw = Array.from({ length: 10 }).flatMap((_, rep) =>
        base.map((b, idx) => ({
            ...b,
            id: `${rep}-${idx}-${b.veiculoPlaca}-${b.dataHora}`,
            km: Number(b.km || 0) + rep * 10 + idx,
            litros: Number(b.litros || 0) + (idx % 2 === 0 ? 0 : 0.5),
            valorTotal:
                (Number(b.litros || 0) + (idx % 2 === 0 ? 0 : 0.5)) *
                Number(b.valorLitro || 0),
        }))
    );

    // ✅ aplica agrupamento por placa (linha mesclada)
    const rows = groupByPlaca(rowsRaw);

    /* =========================================================
       4) TOTAIS (no final)
    ========================================================= */
    const totals = [
        { id: "qtd", label: "Qtde Registros", type: "count" },
        { id: "lit", label: "Total Litros", type: "sum", accessor: "litros" },
        {
            id: "tot",
            label: "Total Valor",
            type: "sum",
            accessor: "valorTotal",
            format: "money",
        },
    ];

    const isOficina = useLocation().pathname.includes("/modulo-oficina");

    return (
        <div
            className={`oficina-rel-wrap transition-all duration-300 ${isOficina ? "-mt-[16px] ml-[-16px] w-[calc(100%+32px)]" : ""
                }`}
        >
            <RelatorioBase
                // Se for oficina, o App.jsx já dá margin-left no main.
                sidebarOpen={isOficina ? undefined : open}
                reportKey="oficina.consumo_combustivel"
                titulo="Relatório Consumo de Combustível"
                periodo={periodo}
                logo={logo}
                orientation="auto"
                columns={columns}
                columnCatalog={catalogColumns}
                rows={rows}
                totals={totals}
                /* Offset lateral para anular o do componente, pois o main já desloca */
                sidebarOffsetPx={isOficina ? 0.1 : undefined}
                /* O viewport deve descontar apenas os 48px do Header real */
                topOffsetPx={isOficina ? 48 : 56}
                /* Compensa os 16px de padding do <main> para colar no Header */
                stickyTopPx={isOficina ? -16 : 32}
            />

            {/* ===== Ajuste específico para IMPRESSÃO ===== */}
            <style>{`
      @media print {
        /* tira “gambiarras” de tela que quebram a impressão */
        .oficina-rel-wrap {
          margin: 0 !important;
          width: auto !important;
        }

        /* sidebar/padding do app não pode influenciar o papel */
        #relatorio-print-root,
        #documento-print-root {
          padding-left: 0 !important;
        }

        /* garante A4 e evita corte por margem default do browser */
        @page { size: A4 portrait; margin: 8mm; }

        html, body {
          width: 210mm !important;
          height: auto !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        /* força caber na largura do A4 mesmo se tiver 1px a mais */
        .relatorio-page,
        .documento-page {
          width: 194mm !important; /* 210 - (8mm*2) */
          max-width: 194mm !important;
        }

        /* se ainda estiver “no limite”, dá um respiro leve */
        .relatorio-page,
        .documento-page,
        table {
          transform: scale(0.98);
          transform-origin: top left;
        }
      }
    `}</style>
        </div>
    );

}

