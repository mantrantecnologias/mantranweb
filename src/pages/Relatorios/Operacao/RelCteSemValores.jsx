// src/pages/Relatorios/Operacao/RelCteSemValores.jsx
import { useMemo, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DocumentoBase from "../base/DocumentoBase";
import QRCode from "qrcode";

/* =========================================================
   HELPERS
========================================================= */
const onlyDigits = (s) => String(s || "").replace(/\D/g, "");

const n2 = (v) =>
    Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 });

const n4 = (v) =>
    Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 4 });

const formatCNPJCPF = (v) => {
    const d = onlyDigits(v);
    if (d.length === 11) return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    if (d.length === 14) return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    return v || "";
};

const formatCEP = (v) => {
    const d = onlyDigits(v);
    if (d.length === 8) return d.replace(/(\d{5})(\d{3})/, "$1-$2");
    return v || "";
};

const formatChave4 = (v) => {
    const d = onlyDigits(v);
    return d ? d.replace(/(.{4})/g, "$1 ").trim() : "";
};



function txt(v) {
    if (v === null || v === undefined) return "";
    return String(v);
}



function padLeft(num, size) {
    const s = String(num);
    return s.length >= size ? s : "0".repeat(size - s.length) + s;
}

function buildRange(iniRaw, fimRaw) {
    const iniStr = String(iniRaw || "").trim();
    const fimStr = String(fimRaw || "").trim();

    if (!iniStr || !fimStr) return [];

    const size = Math.max(iniStr.length, fimStr.length);
    const ini = Number(onlyDigits(iniStr));
    const fim = Number(onlyDigits(fimStr));

    if (!Number.isFinite(ini) || !Number.isFinite(fim) || fim < ini) return [];

    const out = [];
    for (let n = ini; n <= fim; n++) out.push(padLeft(n, size));
    return out;
}

/* =========================================================
   MOCK (trocar WebApi depois)
   Obs: aqui é só pra você enxergar o layout 100%
========================================================= */
function mockCTe({ controle, filial } = {}) {
    return {
        filtro: { controle: controle || "300448", filial: filial || "001" },

        emitente: {
            fantasia: "TESTE MANTRAN",
            razao: "TESTE MANTRAN",
            endereco1: "RUA LOURDES, 169 - VILA VILMA",
            endereco2: "SANTO ANDRE / SP - CEP 09015340",
            docLine: "CNPJ 04.086.814/0001-41 | IE 121611082117 - Fone 1127541140",
        },

        dacte: {
            titulo: "DACTE",
            subtitulo: "Documento Auxiliar do Conhecimento de Transporte\nEletrônico",
            modal: "Rodoviário",
            modelo: "57",
            serie: "9",
            numeroCTe: controle || "300448",
            fl: "1",
            dataHoraEmissao: "2026-01-21T12:47:06-03:00",
            controleFiscoLabel: "CONTROLE DO FISCO",
            chaveHelp:
                "Chave de acesso para consulta de autenticidade no site\nwww.cte.fazenda.gov.br",
            chaveAcesso: "35260104086814000141570090003004481630030429",
            protocoloLabel: "N° PROTOCOLO",
            protocolo: "1352600000030506",
        },

        topo: {
            tipoCTe: "Normal",
            tipoServico: "Normal",
            tomadorServico: "Remetente",
            formaPagamento: "OUTROS",
            cfop: "6352 - TRANSPORTE RODOVIARIO DE CARGAS",
            origemPrestacao: "ITU / SP",
            destinoPrestacao: "SALVADOR / BA",
        },

        remetente: {
            nome: "CTE EMITIDO EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL",
            endereco: "AVENIDA PRIMO SCHINCARIOL, 02222",
            municipio: "ITU",
            uf: "SP",
            cep: "13312900",
            bairro: "ITAIM",
            doc: "50221019000136",
            ie: "387000650117",
            fone: "0000000000",
        },

        destinatario: {
            nome: "CTE EMITIDO EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL",
            endereco: "AV JEQUITAIÁ, 92",
            municipio: "SALVADOR",
            uf: "BA",
            cep: "40060120",
            bairro: "AGUA DE MENINOS",
            doc: "05254957005651",
            ie: "074570489",
            fone: "0000000000",
        },

        expedidor: {
            nome: "CTE EMITIDO EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL",
            endereco: "AVENIDA PRIMO SCHINCARIOL, 02222",
            municipio: "ITU",
            uf: "SP",
            cep: "13312900",
            bairro: "ITAIM",
            doc: "50221019000136",
            ie: "387000650117",
            fone: "0000000000",
        },

        recebedor: {
            nome: "CTE EMITIDO EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL",
            endereco: "AV JEQUITAIÁ, 92",
            municipio: "SALVADOR",
            uf: "BA",
            cep: "40015035",
            bairro: "COMERCIO",
            doc: "02864417003909",
            ie: "203733796",
            fone: "2121189500",
        },

        tomador: {
            nome: "CTE EMITIDO EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL",
            endereco: "AVENIDA PRIMO SCHINCARIOL, 02222",
            municipio: "ITU",
            uf: "SP",
            cep: "13312900",
            bairro: "ITAIM",
            doc: "50221019000136",
            ie: "387000650117",
            fone: "0000000000",
        },

        mercadoria: {
            qtVolumes: 3,
            pesoBruto: 322,
            valorMercadoria: 1540,
            dtDI: "",
            oc: "",
            especie: "CAIXA DE PAPELAO",
            cubagem: "PAP",
        },

        icms: {
            situacaoTributaria: "NORMAL",
            baseCalculo: 630,
            aliquota: 7,
            valorIcms: 44.1,
            redBC: "",
            icmsST: "",
        },

        componentesFrete: [
            { nome: "Frete Peso", valor: 0 },
            { nome: "Frete Valor", valor: 0 },
            { nome: "Advalorem", valor: 0 },
            { nome: "Gris", valor: 0 },
            { nome: "CAT", valor: 0 },
            { nome: "Despacho", valor: 0 },
            { nome: "Taxa entrega", valor: 0 },
        ],
        totalFrete: { totalServico: 630, aReceber: 630 },

        documentosOriginarios: ["19203030"],

        observacao:
            " | VEICULO: RXW4156 | INFO RATEIO: | - OBSERVACAO CTE ....... - Nro Referencia: 12213 - Nro DI/DTA: 18/2123132156 - Codigo do Processo da DI: 1231321 - Lacre: 21321 - Lacre Complementar: 213213 - Reserva: 21321 | Nome do Navio: CAP SAN MALEAS Tabela: 000083 - Container (es): BICU1234565 - Tipo Container: 20 DRY - Tara: 2500 - Porto: SANTOS BRASIL PARTICIPACOES.. AV JEQUITAIÁ, SALVADOR Motorista: ALAN DA COSTA - RG: 7422244 - CPF: 02745328409 - CNH: 01628446760 - Tracao: RXW4156 - Reboque: RKW3E53",

        rntrc: "00023244",
        respseg: "RESPSEG TESTE",
        valorContainer: 2500,
        placa: "RXW4156",

        // valor usado pro barcode e QR
        chaveAcesso: "35260104086814000141570090003004481630030429",
    };
}

/* =========================================================
   CÓDIGO DE BARRAS (SVG) - igual ideia do RelEtiquetasColeta
   (leve, imprime bem, sem dependência extra)
========================================================= */
function hashToBars(text) {
    const s = String(text || "");
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }

    // gera um padrão "bar/space" com larguras de 1..4
    const bars = [];
    for (let i = 0; i < 140; i++) {
        h ^= h << 13;
        h ^= h >>> 17;
        h ^= h << 5;
        const w = (Math.abs(h) % 4) + 1;
        bars.push(w);
    }
    return bars;
}

function BarcodeSVG({ value, heightMm = 16, quietMm = 2 }) {
    const bars = useMemo(() => hashToBars(value), [value]);

    const H = 120;
    const quiet = 12;
    let x = quiet;

    const totalW = bars.reduce((a, b) => a + b, 0) * 2 + quiet * 2;
    const viewW = Math.max(540, totalW);

    const lines = [];
    for (let i = 0; i < bars.length; i++) {
        const w = bars[i] * 2;
        const isBar = i % 2 === 0;
        if (isBar) lines.push(<rect key={i} x={x} y={0} width={w} height={H} fill="#000" />);
        x += w;
    }

    return (
        <div style={{ width: "100%", paddingLeft: `${quietMm}mm`, paddingRight: `${quietMm}mm` }}>
            <svg width="100%" height={`${heightMm}mm`} viewBox={`0 0 ${viewW} ${H}`} preserveAspectRatio="none">
                {lines}
            </svg>
        </div>
    );
}

/* =========================================================
   QRCode (dataURL) - igual o RelEtiquetasColeta
========================================================= */
function QRImg({ value, sizePx = 118 }) {
    const [src, setSrc] = useState("");

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const txt = String(value || "");
                if (!txt) {
                    if (alive) setSrc("");
                    return;
                }
                const url = await QRCode.toDataURL(txt, {
                    errorCorrectionLevel: "M",
                    margin: 0,
                    width: sizePx,
                    color: { dark: "#000000", light: "#ffffff" },
                });
                if (alive) setSrc(url);
            } catch {
                if (alive) setSrc("");
            }
        })();
        return () => {
            alive = false;
        };
    }, [value, sizePx]);

    if (!src) return <div style={{ width: sizePx, height: sizePx }} />;
    return (
        <img
            src={src}
            alt="qrcode"
            style={{
                width: sizePx,
                height: sizePx,
                objectFit: "contain",
                display: "block",
            }}
        />
    );

}

/* =========================================================
   COMPONENTE PRINCIPAL
========================================================= */
export default function RelCteSemValores({ open }) {
    const navigate = useNavigate();
    const location = useLocation();

    // Esperado: navegar passando state: { controleIni, controleFim, filial }
    const { controleIni, controleFim, filial } = location?.state || {};

    // 1) monta faixa (preserva zeros). Se não vier faixa, imprime 1 só.
    const controles = useMemo(() => {
        const range = buildRange(controleIni, controleFim);
        if (range.length) return range;
        return [String(controleIni || "300448")];
    }, [controleIni, controleFim]);

    // 2) gera N “data” (uma por CT-e)
    const dataList = useMemo(() => {
        const f = filial || "001";
        return controles.map((c) => mockCTe({ controle: c, filial: f }));
    }, [controles, filial]);

    const logo = localStorage.getItem("param_logoBg") || "";
    const template = useMemo(() => CteSemValoresTemplate(dataList), [dataList]);

    return (
        <DocumentoBase
            sidebarOpen={open}
            reportKey="operacao.cte_sem_valores"
            title="DACTE SEM VALOR"
            logo={logo}
            orientation="portrait"
            templateId="padrao"
            template={template}
            // pode passar qualquer um; as páginas vão usar dataList por índice
            data={dataList[0] || mockCTe({ controle: "300448", filial: filial || "001" })}
            onClose={() => navigate(-1)}
        />
    );

}

/* =========================================================
   TEMPLATE (DocumentoBase)
========================================================= */
function CteSemValoresTemplate(dataList = []) {
    // Campos por grupos (DocumentoBase agrupa pelo "group")
    const fieldsCatalog = [
        // Logo / Empresa
        { id: "logo", label: "Logo", group: "Logo" },
        { id: "empresa_razao", label: "Razão/Nome empresa", group: "Logo" },
        { id: "empresa_endereco", label: "Endereço empresa", group: "Logo" },
        { id: "empresa_doc", label: "Doc/IE/Fone empresa", group: "Logo" },

        // Topo
        { id: "tipo_cte", label: "Tipo do CT-e", group: "Topo" },
        { id: "tipo_servico", label: "Tipo do Serviço", group: "Topo" },
        { id: "tomador_servico", label: "Tomador do Serviço", group: "Topo" },
        { id: "forma_pagamento", label: "Forma de Pagamento", group: "Topo" },

        // DACTE
        { id: "dacte_titulo", label: "Título DACTE", group: "DACTE" },
        { id: "dacte_subtitulo", label: "Subtítulo", group: "DACTE" },
        { id: "dacte_modal", label: "Modal", group: "DACTE" },
        { id: "dacte_linha", label: "Modelo/Série/CT-e/FL/DataHora", group: "DACTE" },
        { id: "barcode_fisco", label: "Código de barras (Fisco)", group: "DACTE" },
        { id: "chave_acesso", label: "Chave de acesso", group: "DACTE" },
        { id: "protocolo", label: "Protocolo", group: "DACTE" },

        // CFOP / Prestação
        { id: "cfop", label: "CFOP - Natureza", group: "Prestação" },
        { id: "origem", label: "Origem da prestação", group: "Prestação" },
        { id: "destino", label: "Destino da prestação", group: "Prestação" },

        // Participantes
        { id: "remetente", label: "Remetente", group: "Participantes" },
        { id: "destinatario", label: "Destinatário", group: "Participantes" },
        { id: "expedidor", label: "Expedidor", group: "Participantes" },
        { id: "recebedor", label: "Recebedor", group: "Participantes" },
        { id: "tomador", label: "Tomador", group: "Participantes" },

        // Mercadoria / ICMS
        { id: "mercadoria", label: "Mercadoria", group: "Mercadoria" },
        { id: "icms", label: "Valores ICMS", group: "Mercadoria" },

        // Frete (por padrão oculto)
        { id: "componentes_frete", label: "Componentes do frete", group: "Frete" },
        { id: "total_frete", label: "Totais do frete", group: "Frete" },

        // Docs / QR
        { id: "docs_originarios", label: "Documentos originários", group: "Documentos" },
        { id: "qrcode", label: "QR Code", group: "Documentos" },

        // Observação / RNTRC
        { id: "observacao", label: "Observação", group: "Rodapé" },
        { id: "rntrc", label: "RNTRC", group: "Rodapé" },
        { id: "respseg", label: "Respseg", group: "Rodapé" },
        { id: "valor_container", label: "Valor Container", group: "Rodapé" },
        { id: "placa", label: "Placa", group: "Rodapé" },

    ];

    const defaultVisibleFieldIds = [
        "logo",
        "empresa_razao",
        "empresa_endereco",
        "empresa_doc",
        "tipo_cte",
        "tipo_servico",
        "tomador_servico",
        "forma_pagamento",

        "dacte_titulo",
        "dacte_subtitulo",
        "dacte_modal",
        "dacte_linha",
        "barcode_fisco",
        "chave_acesso",
        "protocolo",

        "cfop",
        "origem",
        "destino",

        "remetente",
        "destinatario",
        "expedidor",
        "recebedor",
        "tomador",

        "mercadoria",


        // por padrão NÃO mostra
        // "componentes_frete",
        // "total_frete",

        "docs_originarios",
        "qrcode",

        "observacao",
        "rntrc",
        "respseg",
        "valor_container",
        "placa",
    ];

    const defaultOptions = {
        templateVariant: "padrao", // padrao | espelho | inteiro
        copies: 2, // 1 via | 2 vias (no DocumentoBase)
    };

    const pages = (Array.isArray(dataList) && dataList.length ? dataList : [null]).map(
        (_, idx) => ({
            id: `p${idx + 1}`,
            render: ({ visibleFieldIds, options, logo }) => (
                <Sheet
                    data={dataList[idx] || {}}
                    visibleFieldIds={visibleFieldIds}
                    options={options}
                    logo={logo}
                />
            ),
        })
    );

    return { pages, fieldsCatalog, defaultVisibleFieldIds, defaultOptions };
}

/* =========================================================
   BUILDING BLOCKS (bordas finas estilo PDF)
========================================================= */
function Box({ children, className = "" }) {
    return <div className={`border border-black ${className}`}>{children}</div>;
}

function TitleMini({ children, className = "" }) {
    return (
        <div className={`text-[9px] font-bold leading-[1.05] ${className}`}>
            {children}
        </div>
    );
}

function ValMini({ children, className = "" }) {
    return (
        <div className={`text-[9px] leading-[1.10] whitespace-nowrap ${className}`}>
            {children}
        </div>
    );
}

function FieldLine({ label, value, right = false }) {
    return (
        <div className={`grid grid-cols-12 gap-1 text-[9px] leading-[1.12]`}>
            <div className="col-span-3 font-bold">{label}</div>
            <div className={`col-span-9 ${right ? "text-right" : ""}`}>
                {value || ""}
            </div>
        </div>
    );
}

function has(visibleFieldIds, id) {
    return Array.isArray(visibleFieldIds) && visibleFieldIds.includes(id);
}


/* =========================================================
   SHEET (ORQUESTRADOR)
   - padrao/espelho: meia folha (1 via ou 2 vias)
   - inteiro: folha inteira (1 via grande)
========================================================= */
function Sheet({ data, visibleFieldIds, options, logo }) {
    const variant = options?.templateVariant || "padrao"; // padrao | espelho | inteiro
    const copies = Number(options?.copies || 1);

    // ======= FOLHA INTEIRA =======
    if (variant === "inteiro") {
        // mantém as margens que você já ajustou no wrapper (px/pt/pb)
        return (
            <div className="w-full h-full">
                <ViaInteiro data={data} visibleFieldIds={visibleFieldIds} logo={logo} />
            </div>
        );
    }

    // ======= ESPELHO / PADRÃO (NÃO MEXE EM NADA DO LAYOUT EXISTENTE) =======
    return (
        <div className="w-full h-full">
            <Via
                tag="VIA CLIENTE"
                data={data}
                visibleFieldIds={visibleFieldIds}
                logo={logo}
                scale="meia"
            />

            {copies >= 2 ? (
                <>
                    <div className="my-[4px] border-t border-dashed border-black" />
                    <Via
                        tag={variant === "espelho" ? "VIA EMPRESA (ESPELHO)" : "VIA EMPRESA"}
                        data={data}
                        visibleFieldIds={visibleFieldIds}
                        logo={logo}
                        scale="meia"
                    />
                </>
            ) : null}
        </div>
    );
}

/* =========================================================
   SHEET
   - padrao/espelho: meia folha (2 vias na página)
   - inteiro: folha inteira (1 via grande)
   - copies: 1 -> só a 1ª via
========================================================= */
function BoxThin({ children, className = "" }) {
    return <div className={`border border-black ${className}`}>{children}</div>;
}

function T9({ children, className = "" }) {
    return <div className={`text-[9px] leading-[1.05] ${className}`}>{children}</div>;
}

function TH({ children, className = "" }) {
    return <div className={`text-[9px] font-bold leading-[1.05] ${className}`}>{children}</div>;
}

function Ellip({ children, className = "" }) {
    return (
        <div className={`whitespace-nowrap overflow-hidden text-ellipsis ${className}`}>
            {children}
        </div>
    );
}

function ViaInteiro({ data, visibleFieldIds, logo }) {
    const e = data?.emitente || {};
    const d = data?.dacte || {};
    const t = data?.topo || {};

    const remet = data?.remetente || {};
    const dest = data?.destinatario || {};
    const exp = data?.expedidor || {};
    const rec = data?.recebedor || {};
    const tom = data?.tomador || {};

    const merc = data?.mercadoria || {};
    const icms = data?.icms || {};

    const docs = data?.documentosOriginarios || [];
    const comps = data?.componentesFrete || [];
    const tot = data?.totalFrete || {};
    const chave = data?.chaveAcesso || d?.chaveAcesso || "";

    return (
        <div className="w-full h-full text-[9px] px-[8px]">
            <BoxThin className="w-full h-full">
                {/* ======== TOPO: EMITENTE (ESQ) | DACTE + QR (DIR) ======== */}
                <div className="grid grid-cols-12">
                    {/* ESQ: IDENTIFICAÇÃO DO EMITENTE */}
                    <div className="col-span-6 border-r border-black">
                        <div className="border-b border-black text-center py-[2px] font-bold text-[10px]">
                            IDENTIFICAÇÃO DO EMITENTE
                        </div>

                        <div className="p-2">
                            {/* Logo (opcional) */}
                            <div className="flex items-center justify-center min-h-[52px]">
                                {has(visibleFieldIds, "logo") && logo ? (
                                    <img
                                        src={logo}
                                        alt="logo"
                                        className="max-h-[48px] w-auto object-contain"
                                    />
                                ) : null}
                            </div>

                            <div className="text-center font-bold text-[18px] leading-[1.05]">
                                {txt(e.razao || e.fantasia)}
                            </div>

                            <div className="text-center font-bold text-[12px] leading-[1.05] mt-[2px]">
                                {txt(e.endereco1)}
                            </div>
                            <div className="text-center font-bold text-[11px] leading-[1.05]">
                                {txt(e.endereco2)}
                            </div>

                            <div className="text-center font-bold text-[10px] leading-[1.05] mt-[4px]">
                                {txt(e.docLine)}
                            </div>
                        </div>

                        {/* Tipo CT-e / Tipo Serviço */}
                        <div className="grid grid-cols-2 border-t border-black">
                            <div className="border-r border-black p-1">
                                <TH>TIPO DO CT-e</TH>
                                <T9>{txt(t.tipoCTe)}</T9>
                            </div>
                            <div className="p-1">
                                <TH>TIPO DO SERVIÇO</TH>
                                <T9>{txt(t.tipoServico)}</T9>
                            </div>
                        </div>

                        {/* CFOP */}
                        <div className="border-t border-black p-1">
                            <TH>CFOP - NATUREZA DA PRESTAÇÃO</TH>
                            <Ellip className="font-bold">{txt(t.cfop)}</Ellip>
                        </div>

                        {/* Origem / Destino */}
                        <div className="grid grid-cols-2 border-t border-black">
                            <div className="border-r border-black p-1">
                                <TH>ORIGEM DA PRESTAÇÃO</TH>
                                <T9 className="font-bold">{txt(t.origemPrestacao)}</T9>
                            </div>
                            <div className="p-1">
                                <TH>DESTINO DA PRESTAÇÃO</TH>
                                <T9 className="font-bold">{txt(t.destinoPrestacao)}</T9>
                            </div>
                        </div>
                    </div>

                    {/* DIR: DACTE + MODAL + FOLHA + QR */}
                    <div className="col-span-6">
                        <div className="grid grid-cols-12 border-b border-black pt-[3px]">
                            {/* título */}
                            <div className="col-span-7 p-2 border-r border-black">
                                <div className="text-center text-[20px] font-bold leading-[1]">
                                    {txt(d.titulo)}
                                </div>
                                <div className="text-center text-[10px] leading-[1.05]">
                                    {txt(d.subtitulo).replace(/\s*\n\s*/g, " ")}
                                </div>
                            </div>

                            {/* modal + folha */}
                            <div className="col-span-3 p-2 border-r border-black text-center">
                                <div className="text-[10px] leading-[1]">MODAL</div>
                                <div className="text-[16px] font-bold leading-[1]">
                                    {txt(d.modal)}
                                </div>

                                <div className="mt-[6px] text-[10px] leading-[1]">FOLHA</div>
                                <div className="text-[12px] font-bold leading-[1]">
                                    {txt(d.fl || "1/1")}
                                </div>
                            </div>

                            {/* QR */}
                            <div className="col-span-2 p-1 pt-[3px] flex items-center justify-center">

                                {has(visibleFieldIds, "qrcode") ? (
                                    <QRImg value={chave} sizePx={92} />
                                ) : (
                                    <div className="h-[92px] w-[92px]" />
                                )}
                            </div>
                        </div>

                        {/* Modelo / Série / Número / Data */}
                        <div className="grid grid-cols-12 border-b border-black">
                            <div className="col-span-1 border-r border-black p-1 text-center flex flex-col justify-center items-center">

                                <TH>MOD.</TH>
                                <T9 className="font-bold">{txt(d.modelo)}</T9>
                            </div>
                            <div className="col-span-1 border-r border-black p-1 text-center flex flex-col justify-center items-center">

                                <TH>SÉRIE</TH>
                                <T9 className="font-bold">{txt(d.serie)}</T9>
                            </div>
                            <div className="col-span-2 border-r border-black p-1 text-center flex flex-col justify-center items-center">

                                <TH>NÚMERO</TH>
                                <T9 className="font-bold">{txt(d.numeroCTe)}</T9>
                            </div>
                            <div className="col-span-5 border-r border-black p-1 text-center flex flex-col justify-center items-center">
                                <TH>DATA HORA DE EMISSÃO</TH>
                                <div className="text-[9px] font-bold leading-[1.05] whitespace-nowrap">
                                    {txt(d.dataHoraEmissao)}
                                </div>
                            </div>
                            <div className="col-span-3 p-1 text-center flex flex-col justify-center items-center">
                                <div className="text-[7px] font-bold leading-[1.05] whitespace-nowrap">
                                    INSC.SUF.DESTINATARIO
                                </div>
                                <div className="text-[9px] leading-[1.05]">&nbsp;</div>
                            </div>
                        </div>

                        {/* Barcode */}
                        <div className="border-b border-black p-1">
                            {has(visibleFieldIds, "barcode_fisco") ? (
                                <div className="h-[24px] flex items-center">
                                    <BarcodeSVG value={txt(chave)} heightMm={8} quietMm={2} />
                                </div>
                            ) : (
                                <div className="h-[24px]" />
                            )}
                        </div>

                        {/* Chave */}
                        <div className="border-b border-black p-1">
                            <div className="text-[9px] leading-[1]">
                                CHAVE DE ACESSO
                            </div>
                            <div className="text-[12px] font-bold leading-[1.05] whitespace-nowrap">
                                {formatChave4(d.chaveAcesso)}
                            </div>
                        </div>

                        {/* Texto consulta */}
                        <div className="border-b border-black p-1 text-center font-bold">
                            Consulta de autenticidade no portal nacional do CT-e, no site
                            <br />
                            da Sefaz Autorizadora ou em http://www.cte.fazenda.gov.br/portal
                        </div>

                        {/* Protocolo */}
                        <div className="p-1 text-center">
                            <span className="font-bold">PROTOCOLO DE AUTORIZAÇÃO DE USO</span>
                            <div className="font-bold text-[14px] leading-[1.1]">
                                {txt(d.protocolo)}{" "}
                                <span className="font-normal text-[12px]">
                                    {String(d.dataHoraEmissao || "").slice(0, 10).split("-").reverse().join("/")}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ======== PARTICIPANTES (2 COLUNAS) ======== */}
                <div className="grid grid-cols-12 border-t border-black">
                    <div className="col-span-6 border-r border-black">
                        <ParticipanteInteiro titulo="REMETENTE" p={remet} />
                        <ParticipanteInteiro titulo="EXPEDIDOR" p={exp} />

                    </div>

                    <div className="col-span-6">
                        <ParticipanteInteiro titulo="DESTINATÁRIO" p={dest} />
                        <ParticipanteInteiro titulo="RECEBEDOR" p={rec} />
                    </div>
                </div>
                <div className="border-t border-black">
                    <ParticipanteTomador3Linhas titulo="TOMADOR" p={tom} />
                </div>
                {/* ======== PRODUTO / PESOS / MERCADORIA + VALOR TOTAL MERCADORIA ======== */}
                <div className="border-t border-black">
                    <div className="grid grid-cols-12 border-b border-black">
                        <div className="col-span-9 p-1 border-r border-black">
                            <TH>PRODUTO PREDOMINANTE</TH>
                            <T9 className="font-bold">{txt(merc.cubagem || "DIVERSOS")}</T9>
                        </div>
                        <div className="col-span-3 p-1">
                            <TH>VALOR TOTAL DA MERCADORIA</TH>
                            <div className="text-right font-bold text-[12px]">
                                {n2(merc.valorMercadoria)}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-12 border-b border-black">
                        <div className="col-span-4 border-r border-black p-1">
                            <TH>DIVERSOS</TH>
                            <T9 className="font-bold">{txt(merc.especie || "DIVERSOS")}</T9>
                        </div>
                        <div className="col-span-4 border-r border-black p-1">
                            <TH>PESO BRUTO</TH>
                            <div className="text-right font-bold">{n4(merc.pesoBruto)}</div>
                        </div>
                        <div className="col-span-4 p-1">
                            <TH>PESO CÁLCULO</TH>
                            <div className="text-right font-bold">{n4(merc.pesoBruto)}</div>
                        </div>
                    </div>
                </div>

                {/* ======== COMPONENTES DO FRETE + TOTAIS (OPCIONAL) ======== */}
                {has(visibleFieldIds, "componentes_frete") || has(visibleFieldIds, "total_frete") ? (
                    <div className="border-t border-black">
                        <div className="text-center font-bold border-b border-black py-[2px]">
                            COMPONENTES DO VALOR DA PRESTAÇÃO DO SERVIÇO
                        </div>

                        <div className="grid grid-cols-12">
                            {/* lista componentes */}
                            <div className="col-span-9 border-r border-black p-1">
                                <div className="grid grid-cols-12 text-[9px] font-bold border-b border-black pb-[2px]">
                                    <div className="col-span-8">NOME</div>
                                    <div className="col-span-4 text-right">VALOR</div>
                                </div>

                                {has(visibleFieldIds, "componentes_frete") ? (
                                    <div className="pt-[2px]">
                                        {comps.map((c, i) => (
                                            <div key={i} className="grid grid-cols-12">
                                                <div className="col-span-8">{txt(c.nome)}</div>
                                                <div className="col-span-4 text-right">{n2(c.valor)}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-[32px]" />
                                )}
                            </div>

                            {/* totais */}
                            <div className="col-span-3 p-1">
                                <div className="border-b border-black pb-[2px]">
                                    <div className="font-bold">VALOR TOTAL DO SERVIÇO</div>
                                    <div className="text-right font-bold">{n2(tot.totalServico)}</div>
                                </div>
                                <div className="pt-[4px]">
                                    <div className="font-bold">VALOR A RECEBER</div>
                                    <div className="text-right font-bold">{n2(tot.aReceber)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}

                {/* ======== IMPOSTO (ICMS OPCIONAL) ======== */}
                {has(visibleFieldIds, "icms") ? (
                    <div className="border-t border-black">
                        <div className="text-center font-bold border-b border-black py-[2px]">
                            INFORMAÇÕES RELATIVAS AO IMPOSTO
                        </div>

                        <div className="grid grid-cols-12">
                            <div className="col-span-6 border-r border-black p-1">
                                <TH>CLASSIFICAÇÃO TRIBUTÁRIA DO SERVIÇO</TH>
                                <T9 className="font-bold">00 - Tributação Normal ICMS</T9>
                            </div>

                            <div className="col-span-2 border-r border-black p-1">
                                <TH>BASE DE CÁLCULO</TH>
                                <div className="text-right font-bold">{n2(icms.baseCalculo)}</div>
                            </div>

                            <div className="col-span-1 border-r border-black p-1">
                                <TH>ALIQ. ICMS</TH>
                                <div className="text-right font-bold">{n2(icms.aliquota)}</div>
                            </div>

                            <div className="col-span-2 border-r border-black p-1">
                                <TH>VALOR DO ICMS</TH>
                                <div className="text-right font-bold">{n2(icms.valorIcms)}</div>
                            </div>

                            <div className="col-span-1 p-1">
                                <TH>% RED.BC</TH>
                                <div className="text-right font-bold">{txt(icms.redBC)}</div>
                            </div>
                        </div>
                    </div>
                ) : null}

                {/* ======== DOCUMENTOS ORIGINÁRIOS ======== */}
                <div className="border-t border-black">
                    <div className="text-center font-bold border-b border-black py-[2px]">
                        DOCUMENTOS ORIGINÁRIOS
                    </div>

                    <div className="grid grid-cols-12 min-h-[170px]">
                        <div className="col-span-6 border-r border-black p-1">
                            {docs.map((x, i) => (
                                <div key={i} className="text-[9px]">
                                    {txt(x)}
                                </div>
                            ))}
                        </div>
                        <div className="col-span-6 p-1">{/* espaço como no PDF */}</div>
                    </div>
                </div>

                {/* ======== OBSERVAÇÕES (3 linhas) ======== */}
                <div className="border-t border-black p-1">
                    <div className="text-center font-bold mb-[2px]">OBSERVAÇÕES</div>
                    <div
                        className="text-[9px] leading-[1.05] break-words overflow-hidden"
                        style={{ minHeight: "3.15em", maxHeight: "3.15em" }}
                    >
                        {txt(data?.observacao)}
                    </div>
                </div>

                {/* RNTRC / MODAL RODOVIÁRIO (caixa grande) */}
                <div className="border-t border-black">
                    {/* LINHA: INFORMAÇÕES DO MODAL */}
                    <div className="p-1 text-center font-bold">
                        INFORMAÇÕES ESPECÍFICAS DO MODAL RODOVIÁRIO
                    </div>

                    {/* LINHA: RNTRC */}
                    <div className="border-t border-black p-1">
                        <span className="font-bold">RNTRC DA EMPRESA:</span> {txt(data?.rntrc)}
                    </div>

                    {/* CAIXAS: USO EXCLUSIVO / FISCO */}
                    <div className="grid grid-cols-12 min-h-[90px] border-t border-black">
                        <div className="col-span-6 border-r border-black p-1">
                            <div className="text-center font-bold">USO EXCLUSIVO DO EMISSOR DO CT-e</div>
                            <div className="mt-[6px] text-[9px] leading-[1.1]">
                                {has(visibleFieldIds, "respseg") ? (
                                    <div><span className="font-bold">Respseg:</span> {txt(data?.respseg)}</div>
                                ) : null}

                                {has(visibleFieldIds, "valor_container") ? (
                                    <div><span className="font-bold">Valor Container:</span> {n2(data?.valorContainer)}</div>
                                ) : null}

                                {has(visibleFieldIds, "placa") ? (
                                    <div><span className="font-bold">Placa:</span> {txt(data?.placa)}</div>
                                ) : null}
                            </div>

                        </div>
                        <div className="col-span-6 p-1">
                            <div className="text-center font-bold">RESERVADO AO FISCO</div>
                        </div>
                    </div>
                </div>


                {/* ======== DECLARAÇÃO (1 linha) ======== */}
                <div className="border-t border-black px-2 py-[2px] text-[9px] font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                    DECLARO QUE RECEBI OS VOLUMES DESTE CONHECIMENTO EM PERFEITO ESTADO PELO QUE DOU POR CUMPRIDO O PRESENTE CONTRATO DE TRANSPORTE
                </div>

                {/* ======== ASSINATURAS + CT-e ======== */}
                <div className="grid grid-cols-12 border-t border-black">
                    <div className="col-span-4 border-r border-black p-1 min-h-[56px]">
                        <div className="text-[9px]">NOME</div>
                        <div className="border-b border-black mt-[10px]" />
                        <div className="text-[9px] mt-[10px]">RG</div>
                        <div className="border-b border-black mt-[10px]" />
                    </div>

                    <div className="col-span-4 border-r border-black p-1 flex items-end justify-center">
                        <div className="text-center text-[9px]">ASSINATURA/CARIMBO</div>
                    </div>

                    <div className="col-span-2 border-r border-black p-1 text-center">
                        <div className="text-[9px]">____/____/____</div>
                        <div className="text-[9px] mt-[10px]">CHEGADA DATA/HORA</div>
                        <div className="text-[9px] mt-[10px]">____/____/____</div>
                        <div className="text-[9px] mt-[10px]">SAÍDA DATA/HORA</div>
                    </div>

                    <div className="col-span-2 p-1 text-center flex flex-col items-center justify-center">

                        <div className="text-[14px] font-bold">CT-e</div>
                        <div className="text-[10px] font-bold">
                            N° {txt(data?.filtro?.controle)}
                        </div>
                        <div className="text-[10px] font-bold">
                            SÉRIE: {txt(data?.dacte?.serie)}
                        </div>
                    </div>
                </div>
            </BoxThin>
        </div>
    );
}

function ParticipanteInteiro({ titulo, p }) {
    return (
        <div className="border-b border-black p-1">
            <div className="font-bold">{titulo} <span className="font-normal">{txt(p?.nome)}</span></div>

            <div className="grid grid-cols-12 gap-1 mt-[2px]">
                <div className="col-span-8">
                    <span className="font-bold">ENDEREÇO</span> {txt(p?.endereco)}
                </div>
                <div className="col-span-4 text-right">
                    <span className="font-bold">CEP</span> {formatCEP(p?.cep)}
                </div>
            </div>

            <div className="grid grid-cols-12 gap-1">
                <div className="col-span-7">
                    <span className="font-bold">MUNICÍPIO</span> {txt(p?.municipio)}/{txt(p?.uf)}
                </div>
                <div className="col-span-5 text-right">
                    <span className="font-bold">BAIRRO</span> {txt(p?.bairro)}
                </div>
            </div>

            <div className="grid grid-cols-12 gap-1">
                <div className="col-span-6">
                    <span className="font-bold">CNPJ/CPF</span> {formatCNPJCPF(p?.doc)}
                </div>
                <div className="col-span-3 text-right">
                    <span className="font-bold">IE</span> {txt(p?.ie)}
                </div>
                <div className="col-span-3 text-right">
                    <span className="font-bold">FONE</span> {txt(p?.fone)}
                </div>
            </div>
        </div>
    );
}

function ParticipanteTomador3Linhas({ titulo, p }) {
    return (
        <div className="p-1">
            <div className="font-bold">
                {titulo} <span className="font-normal">{txt(p?.nome)}</span>
            </div>

            <div className="text-[9px] leading-[1.05] whitespace-nowrap overflow-hidden text-ellipsis">
                <span className="font-bold">ENDEREÇO</span> {txt(p?.endereco)}{" "}
                <span className="font-bold">BAIRRO</span> {txt(p?.bairro)}
            </div>

            <div className="text-[9px] leading-[1.05] whitespace-nowrap overflow-hidden text-ellipsis">
                <span className="font-bold">MUNICÍPIO</span> {txt(p?.municipio)}/{txt(p?.uf)}{" "}
                <span className="font-bold">CEP</span> {formatCEP(p?.cep)}{" "}
                <span className="font-bold">CNPJ/CPF</span> {formatCNPJCPF(p?.doc)}
            </div>
        </div>
    );
}



/* =========================================================
   VIA (meia folha)
   PRINCIPAL CORREÇÃO:
   - grid 12 col: ESQUERDA 7 (≈58%) / DIREITA 5 (≈42%)
   - dentro da esquerda:
     - topo: logo (3 cols) + empresa (4 cols)
     - abaixo: tipo cte/serviço dentro do logo (não ultrapassa)
     - abaixo: tomador/pagamento dentro empresa (não ultrapassa)
   - dentro da direita:
     - MODELO/SÉRIE/N° CT-e/FL/DATA com larguras boas (DATA maior)
========================================================= */

function ParticipanteBox({ titulo, p }) {
    return (
        <div className="p-1 border-b border-black text-[9px] leading-[1.05]">
            {/* Linha 1 */}
            <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                <span className="font-bold">{titulo} </span>
                {txt(p?.nome)}
            </div>

            {/* Linha 2: Endereço | Bairro */}
            <div className="grid grid-cols-12 gap-1">
                <div className="col-span-8 whitespace-nowrap overflow-hidden text-ellipsis">
                    <span className="font-bold">ENDEREÇO:</span> {txt(p?.endereco)}
                </div>
                <div className="col-span-4 text-right whitespace-nowrap overflow-hidden text-ellipsis">
                    <span className="font-bold">BAIRRO:</span> {txt(p?.bairro)}
                </div>
            </div>

            {/* Linha 3: Município | UF+CEP */}
            <div className="grid grid-cols-12 gap-1">
                <div className="col-span-8 whitespace-nowrap overflow-hidden text-ellipsis">
                    <span className="font-bold">MUNICÍPIO:</span> {txt(p?.municipio)}
                </div>
                <div className="col-span-4 text-right whitespace-nowrap">
                    <span className="font-bold">UF:</span> {txt(p?.uf)}{" "}
                    <span className="font-bold">CEP:</span> {formatCEP(p?.cep)}
                </div>
            </div>

            {/* Linha 4: CNPJ | IE | Fone */}
            <div className="grid grid-cols-12 gap-1">
                <div className="col-span-5 whitespace-nowrap overflow-hidden text-ellipsis">
                    <span className="font-bold">CNPJ/CPF:</span> {formatCNPJCPF(p?.doc)}
                </div>
                <div className="col-span-4 text-center whitespace-nowrap overflow-hidden text-ellipsis">
                    <span className="font-bold">IE:</span> {txt(p?.ie)}
                </div>
                <div className="col-span-3 text-right whitespace-nowrap overflow-hidden text-ellipsis">
                    <span className="font-bold">FONE:</span> {txt(p?.fone)}
                </div>
            </div>
        </div>
    );
}

function Via({ tag, data, visibleFieldIds, logo, scale = "meia" }) {
    const e = data?.emitente || {};
    const d = data?.dacte || {};
    const t = data?.topo || {};

    const remet = data?.remetente || {};
    const dest = data?.destinatario || {};
    const exp = data?.expedidor || {};
    const rec = data?.recebedor || {};
    const tom = data?.tomador || {};

    const merc = data?.mercadoria || {};
    const icms = data?.icms || {};

    const docs = data?.documentosOriginarios || [];
    const comps = data?.componentesFrete || [];
    const tot = data?.totalFrete || {};
    const chave = data?.chaveAcesso || d?.chaveAcesso || "";

    // alturas mais “secas” pra caber 100% na meia folha
    const fontBase = scale === "meia" ? "text-[9px]" : "text-[10px]";
    const padTop = scale === "meia" ? "p-[5px]" : "p-[7px]";

    return (
        <div className={`w-full ${fontBase} px-[6px]`}>
            <Box className="w-full">
                {/* tag via */}
                <div className="px-2 pt-[3px] text-[10px] font-bold">{tag}</div>

                {/* =================== CABEÇALHO 60/40 =================== */}
                <div className="grid grid-cols-12">
                    {/* ESQUERDA (7/12 ~ 58%) */}
                    <div className="col-span-7 border-r border-black">
                        {/* LINHA 1: LOGO (3) + EMPRESA (4) */}
                        <div className="grid grid-cols-7">
                            {/* LOGO */}
                            <div className="col-span-3 border-r border-black">
                                <div className={`${padTop} flex items-center justify-center min-h-[64px]`}>
                                    {has(visibleFieldIds, "logo") && logo ? (
                                        <img
                                            src={logo}
                                            alt="logo"
                                            className="max-h-[52px] w-auto object-contain"
                                        />
                                    ) : (
                                        <div className="text-center leading-[1]">
                                            <div className="font-extrabold text-[22px] tracking-wide">
                                                MAN<span className="text-red-600">T</span>RAN
                                            </div>
                                            <div className="text-red-600 font-extrabold text-[14px]">
                                                TECNOLOGIAS
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* TIPO CT-E / TIPO SERVIÇO (não pode ultrapassar logo) */}
                                <div className="grid grid-cols-2 border-t border-black">
                                    <div className="border-r border-black p-[2px] h-[26px] flex flex-col items-center justify-center text-center">
                                        {has(visibleFieldIds, "tipo_cte") ? (
                                            <>
                                                <TitleMini>TIPO DO CT-e.</TitleMini>
                                                <ValMini className="mt-[1px]">{txt(t.tipoCTe)}</ValMini>
                                            </>
                                        ) : (
                                            <div className="h-[26px]" />
                                        )}
                                    </div>
                                    <div className="p-[2px] h-[26px] flex flex-col items-center justify-center text-center">
                                        {has(visibleFieldIds, "tipo_servico") ? (
                                            <>
                                                <TitleMini>TIPO DO SERVIÇO</TitleMini>
                                                <ValMini className="mt-[1px]">{txt(t.tipoServico)}</ValMini>
                                            </>
                                        ) : (
                                            <div className="h-[26px]" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* EMPRESA */}
                            <div className="col-span-4">
                                <div className={`${padTop} h-[64px] text-[8px] leading-[1.05] flex flex-col justify-center`}>

                                    {has(visibleFieldIds, "empresa_razao") ? (
                                        <div className="font-bold leading-[1.05]">{txt(e.fantasia || e.razao)}</div>
                                    ) : null}

                                    {has(visibleFieldIds, "empresa_endereco") ? (
                                        <>
                                            <div className="leading-[1.05]">{txt(e.endereco1)}</div>
                                            <div className="leading-[1.05]">{txt(e.endereco2)}</div>
                                        </>
                                    ) : null}

                                    {has(visibleFieldIds, "empresa_doc") ? (
                                        <div className="text-[7px] leading-[1.05]">{txt(e.docLine)}</div>
                                    ) : null}

                                </div>

                                {/* TOMADOR / FORMA (não pode ultrapassar empresa) */}
                                <div className="grid grid-cols-2 border-t border-black">
                                    <div className="border-r border-black p-[2px] h-[26px] flex flex-col items-center justify-center text-center">
                                        {has(visibleFieldIds, "tomador_servico") ? (
                                            <>
                                                <TitleMini>TOMADOR DO SERVIÇO</TitleMini>
                                                <ValMini className="mt-[1px]">{txt(t.tomadorServico)}</ValMini>
                                            </>
                                        ) : (
                                            <div className="h-[26px]" />
                                        )}
                                    </div>
                                    <div className="p-[2px] h-[26px] flex flex-col items-center justify-center text-center">
                                        {has(visibleFieldIds, "forma_pagamento") ? (
                                            <>
                                                <TitleMini>FORMA DE PAGAMENTO</TitleMini>
                                                <ValMini className="mt-[1px]">{txt(t.formaPagamento)}</ValMini>
                                            </>
                                        ) : (
                                            <div className="h-[26px]" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CFOP */}
                        <div className="border-t border-black p-1">
                            {has(visibleFieldIds, "cfop") ? (
                                <>
                                    <TitleMini>CFOP - NATUREZA DA OPERAÇÃO</TitleMini>
                                    <ValMini className="mt-[1px] whitespace-nowrap overflow-hidden text-ellipsis">
                                        {txt(t.cfop)}
                                    </ValMini>
                                </>
                            ) : (
                                <div className="h-[26px]" />
                            )}
                        </div>

                        {/* ORIGEM / DESTINO */}
                        <div className="grid grid-cols-2 border-t border-black h-[28px]">
                            <div className="border-r border-black px-1 py-[2px] flex flex-col justify-center">
                                {has(visibleFieldIds, "origem") ? (
                                    <>
                                        <TitleMini>ORIGEM DA PRESTAÇÃO</TitleMini>
                                        <ValMini className="mt-[1px]">{txt(t.origemPrestacao)}</ValMini>
                                    </>
                                ) : (
                                    <div className="h-[26px]" />
                                )}
                            </div>

                            <div className="px-1 py-[2px] flex flex-col justify-center">
                                {has(visibleFieldIds, "destino") ? (
                                    <>
                                        <TitleMini>DESTINO DA PRESTAÇÃO</TitleMini>
                                        <ValMini className="mt-[1px]">{txt(t.destinoPrestacao)}</ValMini>
                                    </>
                                ) : (
                                    <div className="h-[26px]" />
                                )}
                            </div>
                        </div>

                    </div>

                    {/* DIREITA (5/12 ~ 42%) */}
                    <div className="col-span-5 pt-[5px]">
                        {/* ====== DACTE (ALTURAS FIXAS p/ alinhar com a esquerda) ====== */}
                        <div className="h-[40px] px-[5px] pt-[2px]">
                            <div className="grid grid-cols-12 h-full items-start">
                                <div className="col-span-9 text-center">
                                    {has(visibleFieldIds, "dacte_titulo") ? (
                                        <div className="text-[16px] font-bold leading-[1]">
                                            {txt(d.titulo)}
                                        </div>
                                    ) : null}

                                    {has(visibleFieldIds, "dacte_subtitulo") ? (
                                        <div className="text-[8px] leading-[1] whitespace-nowrap overflow-hidden text-ellipsis">
                                            {txt(d.subtitulo).replace(/\s*\n\s*/g, " ")}
                                        </div>
                                    ) : null}
                                </div>

                                <div className="col-span-3 text-right">
                                    {has(visibleFieldIds, "dacte_modal") ? (
                                        <>
                                            <div className="text-[10px] leading-[1]">MODAL</div>
                                            <div className="text-[12px] font-bold leading-[1]">{txt(d.modal)}</div>
                                        </>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        {/* LINHA MODELO/SÉRIE/CT-e/FL/DATA (sobe porque o topo virou 44px) */}
                        {has(visibleFieldIds, "dacte_linha") ? (
                            <div className="border-t border-black h-[26px]">
                                <div
                                    className="grid h-full"
                                    style={{ gridTemplateColumns: "46px 42px 72px 26px 1fr" }}
                                >
                                    <div className="p-[2px] border-r border-black flex flex-col justify-center">
                                        <TitleMini>MODELO</TitleMini>
                                        <ValMini className="mt-[1px]">{txt(d.modelo)}</ValMini>
                                    </div>
                                    <div className="p-[2px] border-r border-black flex flex-col justify-center">
                                        <TitleMini>SÉRIE</TitleMini>
                                        <ValMini className="mt-[1px]">{txt(d.serie)}</ValMini>
                                    </div>
                                    <div className="p-[2px] border-r border-black flex flex-col justify-center">
                                        <TitleMini>N° CT-e</TitleMini>
                                        <ValMini className="mt-[1px]">{txt(d.numeroCTe)}</ValMini>
                                    </div>
                                    <div className="p-[2px] border-r border-black flex flex-col justify-center">
                                        <TitleMini>FL</TitleMini>
                                        <ValMini className="mt-[1px]">{txt(d.fl)}</ValMini>
                                    </div>
                                    <div className="p-[2px] flex flex-col justify-center">
                                        <TitleMini>DATA E HORA DE EMISSÃO</TitleMini>
                                        <div className="text-[9px] leading-[1.05] whitespace-nowrap">
                                            {txt(d.dataHoraEmissao)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        {/* CONTROLE + BARCODE (altura travada) */}
                        <div className="border-t border-black h-[50px]">
                            <div className="text-center text-[9px] font-bold h-[16px] leading-[16px]">
                                {txt(d.controleFiscoLabel)}
                            </div>

                            {has(visibleFieldIds, "barcode_fisco") ? (
                                <div className="h-[34px] flex items-center">
                                    <BarcodeSVG value={txt(chave)} heightMm={8} quietMm={2} />
                                </div>
                            ) : (
                                <div className="h-[34px]" />
                            )}
                        </div>


                        {/* CHAVE (altura travada e texto 1 linha) */}
                        {has(visibleFieldIds, "chave_acesso") ? (
                            <div className="border-t border-black text-center h-[28px] flex flex-col justify-center px-1">
                                <div className="text-[8px] leading-[1] whitespace-nowrap overflow-hidden text-ellipsis">
                                    {txt(d.chaveHelp).replace(/\s*\n\s*/g, " ")}
                                </div>
                                <div className="text-[12px] font-bold leading-[1] whitespace-nowrap">
                                    {txt(d.chaveAcesso)}
                                </div>
                            </div>
                        ) : null}

                        {/* PROTOCOLO (1 linha só) */}
                        {has(visibleFieldIds, "protocolo") ? (
                            <div className="border-t border-black h-[18px] px-2 flex items-center justify-center text-[9px]">
                                <span className="font-bold mr-2">{txt(d.protocoloLabel)}:</span>
                                <span className="whitespace-nowrap">{txt(d.protocolo)}</span>
                            </div>
                        ) : null}

                    </div>
                </div>

                {/* =================== CORPO (60/40) =================== */}
                <div className="grid grid-cols-12 border-t border-black">
                    {/* ESQUERDA 7 */}
                    <div className="col-span-7 border-r border-black">
                        {has(visibleFieldIds, "remetente") ? (
                            <ParticipanteBox titulo="REMETENTE:" p={remet} />
                        ) : null}


                        {has(visibleFieldIds, "destinatario") ? <ParticipanteBox titulo="DESTINATÁRIO:" p={dest} /> : null}

                        {has(visibleFieldIds, "expedidor") ? <ParticipanteBox titulo="EXPEDIDOR:" p={exp} /> : null}
                        {has(visibleFieldIds, "recebedor") ? <ParticipanteBox titulo="RECEBEDOR:" p={rec} /> : null}
                        {has(visibleFieldIds, "tomador") ? <ParticipanteBox titulo="TOMADOR:" p={tom} /> : null}

                        {/* Observação (linha comprida) */}
                        {has(visibleFieldIds, "observacao") ? (
                            <div className="p-1">
                                <div
                                    className="text-[9px] leading-[1.05] break-words overflow-hidden"
                                    style={{
                                        minHeight: "2.9em",   // ~3 linhas (1.05 * 3)
                                        maxHeight: "2.9em",   // trava em 3 linhas
                                    }}
                                >
                                    {txt(data?.observacao)}
                                </div>
                            </div>
                        ) : null}

                    </div>

                    {/* DIREITA 5 */}
                    <div className="col-span-5">
                        {/* Componentes do frete (opcional) */}
                        {has(visibleFieldIds, "componentes_frete") ? (
                            <div className="border-b border-black">
                                <div className="text-center text-[9px] font-bold py-[2px]">
                                    COMPONENTES DO FRETE (R$)
                                </div>
                                <div className="p-1">
                                    {comps.map((c, i) => (
                                        <div key={i} className="flex justify-between text-[9px]">
                                            <span>{txt(c.nome)}</span>
                                            <span>{n2(c.valor)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        {/* Mercadoria */}
                        {has(visibleFieldIds, "mercadoria") ? (
                            <div className="border-b border-black p-1">
                                <div className="text-center text-[9px] font-bold mb-[2px]">
                                    MERCADORIA
                                </div>
                                <div className="grid grid-cols-2 gap-x-2 text-[9px]">
                                    <div className="font-bold">QT VOLUMES</div>
                                    <div className="text-right">{n4(merc.qtVolumes)}</div>

                                    <div className="font-bold">PESO BRUTO</div>
                                    <div className="text-right">{n4(merc.pesoBruto)}</div>

                                    <div className="font-bold">VR. MERCADORIA</div>
                                    <div className="text-right">{n4(merc.valorMercadoria)}</div>

                                    <div className="font-bold">DT/DI</div>
                                    <div className="text-right">{txt(merc.dtDI)}</div>

                                    <div className="font-bold">OC</div>
                                    <div className="text-right">{txt(merc.oc)}</div>

                                    <div className="font-bold">ESPÉCIE</div>
                                    <div className="text-right">{txt(merc.especie)}</div>

                                    <div className="font-bold">CUBAGEM</div>
                                    <div className="text-right">{txt(merc.cubagem)}</div>
                                </div>
                            </div>
                        ) : null}

                        {/* ICMS */}
                        {has(visibleFieldIds, "icms") ? (
                            <div className="border-b border-black p-1">
                                <div className="text-center text-[9px] font-bold mb-[2px]">
                                    VALORES ICMS (R$)
                                </div>
                                <div className="grid grid-cols-2 gap-x-2 text-[9px]">
                                    <div className="font-bold">SITUAÇÃO TRIBUTARIA</div>
                                    <div className="text-right">{txt(icms.situacaoTributaria)}</div>

                                    <div className="font-bold">BASE DE CALCULO</div>
                                    <div className="text-right">{n2(icms.baseCalculo)}</div>

                                    <div className="font-bold">ALIQ. ICMS</div>
                                    <div className="text-right">{n2(icms.aliquota)}</div>

                                    <div className="font-bold">VALOR ICMS</div>
                                    <div className="text-right">{n2(icms.valorIcms)}</div>

                                    <div className="font-bold">% RED. BC. CALC.</div>
                                    <div className="text-right">{txt(icms.redBC)}</div>

                                    <div className="font-bold">ICMS ST</div>
                                    <div className="text-right">{txt(icms.icmsST)}</div>
                                </div>
                            </div>
                        ) : null}

                        {/* Totais frete (opcional) */}
                        {has(visibleFieldIds, "total_frete") ? (
                            <div className="border-b border-black p-1 text-[9px]">
                                <div className="flex justify-between">
                                    <span className="font-bold">VALOR TOTAL DO SERVIÇO</span>
                                    <span>{n2(tot.totalServico)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-bold">VALOR A RECEBER</span>
                                    <span>{n2(tot.aReceber)}</span>
                                </div>
                            </div>
                        ) : null}

                        {/* Documentos originários + QRCode (lado a lado, no rodapé da direita) */}
                        <div className="grid grid-cols-2">
                            <div className="border-r border-black">
                                {has(visibleFieldIds, "docs_originarios") ? (
                                    <>
                                        <div className="text-center text-[9px] font-bold py-[2px] border-b border-black">
                                            DOCUMENTOS ORIGINÁRIOS
                                        </div>
                                        <div className="p-2 text-center text-[9px]">
                                            {docs.map((x, i) => (
                                                <div key={i}>{txt(x)}</div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-[90px]" />
                                )}
                            </div>

                            <div className="p-2 flex items-center justify-center">
                                {has(visibleFieldIds, "qrcode") ? (
                                    <QRImg value={chave} sizePx={110} />
                                ) : (
                                    <div className="h-[110px] w-[110px]" />
                                )}
                            </div>
                        </div>

                        {/* RNTRC */}
                        {has(visibleFieldIds, "rntrc") ? (
                            <div className="border-t border-black p-1 text-[9px]">
                                <span className="font-bold">RNTC DA EMPRESA:</span> {txt(data?.rntrc)}
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* =================== DECLARAÇÃO FINAL =================== */}
                <div className="border-t border-black text-center text-[8px] font-bold py-[3px] whitespace-nowrap overflow-hidden text-ellipsis px-2">
                    DECLARO QUE RECEBI OS VOLUMES DESTE CONHECIMENTO DE TRANSPORTE EM PERFEITO ESTADO PELO QUE DOU POR CUMPRIDO O PRESENTE CONTRATO DE TRANSPORTE
                </div>


                {/* =================== RODAPÉ ASSINATURAS =================== */}
                <div className="grid grid-cols-12 border-t border-black">
                    <div className="col-span-3 border-r border-black p-1">
                        <div className="font-bold text-[9px]">NOME / RG</div>
                    </div>
                    <div className="col-span-4 border-r border-black p-1">
                        <div className="font-bold text-[9px]">ASSINATURA / CARIMBO</div>
                    </div>
                    <div className="col-span-2 border-r border-black p-1 text-center">
                        <div className="font-bold text-[9px]">CHEGADA DATA / HORA</div>
                    </div>
                    <div className="col-span-2 border-r border-black p-1 text-center">
                        <div className="font-bold text-[9px]">SAÍDA DATA / HORA</div>
                    </div>
                    <div className="col-span-1 p-0">
                        <div className="h-full grid grid-rows-2">
                            <div className="border-b border-black flex items-center justify-center text-[14px] font-bold">
                                {txt(data?.filtro?.controle)}
                            </div>
                            <div className="flex items-center justify-center text-[12px] font-bold">
                                {txt(data?.dacte?.serie)}
                            </div>
                        </div>
                    </div>
                </div>
            </Box>
        </div>
    );
}
