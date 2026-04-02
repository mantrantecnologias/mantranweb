// src/pages/Relatorios/Operacao/RelEtiquetasColeta.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EtiquetaBase from "../base/EtiquetaBase";
import QRCode from "qrcode";

/* =========================================================
   HELPERS
========================================================= */
function onlyDigits(s) {
    return String(s || "").replace(/\D/g, "");
}

function padLeft(n, len = 6) {
    const d = onlyDigits(n);
    return d.padStart(len, "0");
}

function parseRange(ini, fim) {
    const a = Number(onlyDigits(ini || ""));
    const b = Number(onlyDigits(fim || ""));
    if (!a || !b) return null;
    const start = Math.min(a, b);
    const end = Math.max(a, b);
    return { start, end };
}

/* =========================================================
   BARCODE (SVG) - imprime bem no print/PDF
   (visual, sem padrão oficial EAN/128 por enquanto)
========================================================= */
function hashToBars(text) {
    const s = String(text || "");
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    const bars = [];
    for (let i = 0; i < 92; i++) {
        h ^= h << 13;
        h ^= h >>> 17;
        h ^= h << 5;
        const w = (Math.abs(h) % 3) + 1; // 1..3
        bars.push(w);
    }
    return bars;
}

function BarcodeSVG({ value, heightMm = 18, quietMm = 2 }) {
    const bars = useMemo(() => hashToBars(value), [value]);

    const H = 120;
    const quiet = 12;
    let x = quiet;

    const totalW = bars.reduce((a, b) => a + b, 0) * 2 + quiet * 2;
    const viewW = Math.max(420, totalW);

    const lines = [];
    for (let i = 0; i < bars.length; i++) {
        const w = bars[i] * 2;
        const isBar = i % 2 === 0;
        if (isBar) {
            lines.push(<rect key={i} x={x} y={0} width={w} height={H} fill="#000" />);
        }
        x += w;
    }

    return (
        <div style={{ width: "100%", paddingLeft: `${quietMm}mm`, paddingRight: `${quietMm}mm` }}>
            <svg width="100%" height={`${heightMm}mm`} viewBox={`0 0 ${viewW} ${H}`} preserveAspectRatio="none">
                <rect x="0" y="0" width={viewW} height={H} fill="#fff" />
                {lines}
            </svg>
        </div>
    );
}

/* =========================================================
   QR (REAL) -> gera DataURL via lib "qrcode"
========================================================= */
function QRCodeImg({ value, sizePx = 180 }) {
    const [src, setSrc] = useState("");

    useEffect(() => {
        let alive = true;

        async function gen() {
            try {
                const txt = String(value || "").trim();
                if (!txt) {
                    if (alive) setSrc("");
                    return;
                }

                const url = await QRCode.toDataURL(txt, {
                    errorCorrectionLevel: "M",
                    margin: 0,
                    width: sizePx,
                    color: { dark: "#000000", light: "#FFFFFF" },
                });

                if (alive) setSrc(url);
            } catch {
                if (alive) setSrc("");
            }
        }

        gen();
        return () => {
            alive = false;
        };
    }, [value, sizePx]);

    if (!src) return null;

    return <img src={src} alt="QR Code" style={{ width: "100%", height: "100%", objectFit: "contain" }} />;
}
/* =========================================================
   MOCK (troca depois por WebApi)
   - já vem com os CAMPOS OFICIAIS (layout imagem 01)
========================================================= */
function makeMockColeta(coletaNumero) {
    const coleta = padLeft(coletaNumero, 6);

    const notaFiscal = padLeft(6036, 8); // 00006036
    const diDta = "26/0182993-0";
    const endereco = "AV BRIGADEIRO FARIA LIMA Nº 2232";
    const cidade = "SAO PAULO";
    const uf = "SP";
    const volumesTotal = 21;

    // extras (disponíveis no +Campos, fora do padrão)
    const extras = {
        cliente: "HNK-ITU (1) MATRIZ",
        motorista: "ALAN DA COSTA",
        placaTracao: "RXW4156",
        placaReboque: "ABC1D23",
    };

    const codigoValue = `${coleta}${notaFiscal}${onlyDigits(diDta)}`.slice(0, 24);

    return {
        coleta,
        notaFiscal,
        diDta,
        endereco,
        cidade,
        uf,
        volumesTotal,
        codigoValue,
        ...extras,
    };
}

/* =========================================================
   MONTA LISTA FINAL: 1 etiqueta por volume
========================================================= */
function buildItems(range) {
    if (!range) return [];

    const out = [];
    let guard = 0;

    for (let n = range.start; n <= range.end; n++) {
        const base = makeMockColeta(n);

        for (let v = 1; v <= base.volumesTotal; v++) {
            out.push({
                id: `${base.coleta}-${base.notaFiscal}-${v}`,
                ...base,
                volumeAtual: v,
            });

            guard++;
            if (guard >= 2000) break;
        }

        if (guard >= 2000) break;
    }

    return out;
}

/* =========================================================
   RENDER DA ETIQUETA (layout igual imagem 01)
   - Agora tem:
     - LOGO (campo disponível)
     - Código (barcode OU qrcode, conforme labelKind)
========================================================= */
function RenderEtiqueta({ item, visibleFieldIds, labelKind, logo }) {
    const show = (id) => (visibleFieldIds || []).includes(id);

    const cidadeUf = `${item.cidade || ""}/${item.uf || ""}`.trim();
    const volTxt =
        item.volumesTotal && item.volumeAtual ? `${item.volumeAtual} / ${item.volumesTotal}` : "";

    const fontFamily = 'Arial, "Liberation Sans", "Helvetica", sans-serif';

    const codigo = item.codigoValue || item.coleta;

    return (
        <div
            className="w-full h-full"
            style={{
                boxSizing: "border-box",
                padding: "4mm",
                fontFamily,
                color: "#000",
                position: "relative",
            }}
        >
            {/* LOGO (opcional) */}
            {show("logo") ? (
                <div style={{ position: "absolute", left: "4mm", top: "4mm", width: "30mm", height: "12mm" }}>
                    {logo ? (
                        <img
                            src={logo}
                            alt="Logo"
                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                    ) : null}
                </div>
            ) : null}

            {/* Bloco superior */}
            <div style={{ fontSize: "12pt", fontWeight: 700, lineHeight: 1.05, paddingTop: show("logo") ? "10mm" : 0 }}>
                {show("ordemColeta") && (
                    <div>
                        Nº ORDEM DE COLETA: <span style={{ fontSize: "16pt" }}>{item.coleta}</span>
                    </div>
                )}
            </div>

            <div style={{ marginTop: "2mm", fontSize: "12pt", fontWeight: 700, lineHeight: 1.15 }}>
                {show("notaFiscal") && (
                    <div>
                        Nº NOTA FISCAL: <span style={{ fontSize: "16pt" }}>{item.notaFiscal}</span>
                    </div>
                )}
                {show("diDta") && (
                    <div style={{ marginTop: "1mm" }}>
                        DI / DTA: <span style={{ fontSize: "16pt" }}>{item.diDta}</span>
                    </div>
                )}
            </div>

            <div style={{ marginTop: "3mm", fontSize: "11pt", fontWeight: 700, lineHeight: 1.2 }}>
                {show("enderecoEntrega") && <div>{item.endereco}</div>}
                {show("cidadeUf") && <div style={{ marginTop: "1mm" }}>{cidadeUf}</div>}
            </div>

            {/* VOLUMES */}
            {show("volumes") && (
                <div style={{ marginTop: "5mm", fontSize: "12pt", fontWeight: 700 }}>
                    <div style={{ textAlign: "center" }}>VOLUMES</div>
                    <div style={{ marginTop: "3mm" }}>
                        Nº Volume:&nbsp;&nbsp;<span style={{ fontSize: "14pt" }}>{volTxt}</span>
                    </div>
                </div>
            )}

            {/* Extras (disponíveis no +Campos) */}
            <div style={{ marginTop: "4mm", fontSize: "10pt", fontWeight: 700, lineHeight: 1.15 }}>
                {show("cliente") && <div>CLIENTE: {item.cliente}</div>}
                {show("motorista") && <div style={{ marginTop: "1mm" }}>MOTORISTA: {item.motorista}</div>}
                {show("placaTracao") && <div style={{ marginTop: "1mm" }}>PLACA TRAÇÃO: {item.placaTracao}</div>}
                {show("placaReboque") && <div style={{ marginTop: "1mm" }}>PLACA REBOQUE: {item.placaReboque}</div>}
            </div>

            {/* CÓDIGO (barcode OU qrcode) */}
            {show("codigo") ? (
                labelKind === "qrcode" ? (
                    <div
                        style={{
                            position: "absolute",
                            right: "6mm",
                            bottom: show("codigoTexto") ? "10mm" : "6mm",
                            width: "30mm",
                            height: "30mm",
                            border: "1px solid #111",
                            padding: "2mm",
                            boxSizing: "border-box",
                            background: "#fff",
                        }}
                    >
                        <QRCodeImg value={codigo} sizePx={220} />
                    </div>
                ) : (
                    <div style={{ position: "absolute", left: "4mm", right: "4mm", bottom: show("codigoTexto") ? "8mm" : "6mm" }}>
                        <BarcodeSVG value={codigo} heightMm={18} quietMm={2} />
                    </div>
                )
            ) : null}

            {/* texto abaixo do código */}
            {show("codigoTexto") ? (
                <div
                    style={{
                        position: "absolute",
                        left: "4mm",
                        right: "4mm",
                        bottom: "2mm",
                        textAlign: "center",
                        fontSize: "9pt",
                    }}
                >
                    {codigo}
                </div>
            ) : null}
        </div>
    );
}
export default function RelEtiquetasColeta({ open }) {
    const location = useLocation();
    const navigate = useNavigate();

    // vindo da tela (ex.: Coleta.jsx)
    const ini = location?.state?.ini || "";
    const fim = location?.state?.fim || "";

    // "barcode" | "qrcode"
    const labelKind = location?.state?.labelKind || "barcode";

    // tamanho da etiqueta (se você mandar da tela, ele respeita)
    const labelConfigFromState = location?.state?.labelConfig || null;

    // logo igual seu padrão (param_logoBg)
    const logo = localStorage.getItem("param_logoBg") || "";

    const range = useMemo(() => parseRange(ini, fim), [ini, fim]);

    // 1 etiqueta por volume
    const items = useMemo(() => buildItems(range), [range]);

    // tamanho padrão (100x150) podendo vir da tela
    const labelConfig = useMemo(() => {
        const base = {
            widthMm: 100,
            heightMm: 150,
            gapMm: 0,
            marginMm: 0,
            dpi: 203,
        };

        if (labelConfigFromState && typeof labelConfigFromState === "object") {
            return { ...base, ...labelConfigFromState };
        }
        return base;
    }, [labelConfigFromState]);

    // templateId amarra no tamanho (permite presets por tamanho)
    const templateId = useMemo(() => {
        const w = Number(labelConfig?.widthMm || 100);
        const h = Number(labelConfig?.heightMm || 150);
        return `${w}x${h}`;
    }, [labelConfig]);

    const template = useMemo(() => {
        return {
            fieldsCatalog: [
                // ===== OFICIAIS (PADRÃO) =====
                { id: "ordemColeta", label: "Nº Ordem de Coleta", group: "Padrão", required: true },
                { id: "notaFiscal", label: "Nº Nota Fiscal", group: "Padrão" },
                { id: "diDta", label: "DI / DTA", group: "Padrão" },
                { id: "enderecoEntrega", label: "Endereço da Entrega", group: "Padrão" },
                { id: "cidadeUf", label: "Cidade/UF", group: "Padrão" },
                { id: "volumes", label: "Nº Volume (x/total)", group: "Padrão" },
                { id: "codigo", label: labelKind === "qrcode" ? "QR Code" : "Código de barras", group: "Padrão" },

                // ===== DISPONÍVEIS (EXTRAS) =====
                { id: "logo", label: "Logo (Topo Esquerda)", group: "Extras" },
                { id: "codigoTexto", label: "Texto abaixo do código", group: "Extras" },
                { id: "cliente", label: "Cliente", group: "Extras" },
                { id: "motorista", label: "Motorista", group: "Extras" },
                { id: "placaTracao", label: "Placa Tração", group: "Extras" },
                { id: "placaReboque", label: "Placa Reboque", group: "Extras" },
            ],

            // PADRÃO = SOMENTE OS OFICIAIS
            defaultVisibleFieldIds: [
                "ordemColeta",
                "notaFiscal",
                "diDta",
                "enderecoEntrega",
                "cidadeUf",
                "volumes",
                "codigo",
            ],

            renderLabel: ({ item, visibleFieldIds }) => (
                <RenderEtiqueta
                    item={item}
                    visibleFieldIds={visibleFieldIds}
                    labelKind={labelKind}
                    logo={logo}
                />
            ),
        };
    }, [labelKind, logo]);

    return (
        <EtiquetaBase
            sidebarOpen={open}
            reportKey="operacao.etiquetas_coleta"
            templateId={templateId}
            labelKind={labelKind}
            labelConfig={labelConfig}
            template={template}
            items={items}
            onClose={() => navigate(-1)}
        />
    );
}
