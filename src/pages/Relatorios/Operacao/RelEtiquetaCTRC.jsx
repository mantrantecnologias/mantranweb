// src/pages/Relatorios/Operacao/RelEtiquetaCTRC.jsx
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EtiquetaBase from "../base/EtiquetaBase";

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

function n2(v) {
    return Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

/* =========================================================
   BARCODE (SVG) - imprime bem no print/PDF (sem lib)
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

function BarcodeSVG({ value, heightMm = 16, quietMm = 2 }) {
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
        if (isBar) lines.push(<rect key={i} x={x} y={0} width={w} height={H} fill="#000" />);
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
   MOCK (troca por API depois)
   - agora recebe embalagemAtual / embalagemTotal
========================================================= */
function makeMockCTRC(ctrcNumero = "181561", embalagemAtual = 1, embalagemTotal = 1) {
    // valor exibido no barcode (igual seu exemplo: 003181561001)
    const origemCod = "003";
    const destinoCod = "003";
    const emissao = "30/01/2026";

    const remetente = "LVMH - IG2";
    const destinatarioNome = "LVMH - IG2";
    const destinatarioEndereco = "AV. BRIGADEIRO FARIA LIMA - LJ. AA-01/03, 2232";
    const destinatarioBairro = "JARDIM PAULISTANO";
    const destinatarioCep = "01489-000";

    const origemCidadeUf = "GUARULHOS/SP";
    const destinoCidadeUf = "SAO PAULO/SP";

    const volume = 29;
    const peso = 140.8;

    const obs = "CAMPO OUTROS = COLETA SABADO 31/01/26 //";

    const ctrc = padLeft(ctrcNumero, 6);
    const barcodeValue = `${origemCod}${ctrc}${String(embalagemAtual).padStart(3, "0")}`; // ex: 003181561001

    return {
        id: `${ctrc}-${String(embalagemAtual).padStart(3, "0")}`,
        // padrão
        logo: localStorage.getItem("param_logoBg") || "",
        emissao,
        origemCod,
        destinoCod,
        remetente,
        origemCidadeUf,
        ctrc,
        destinatarioNome,
        destinatarioEndereco,
        destinatarioBairro,
        destinatarioCep,
        destinoCidadeUf,
        embalagemAtual,
        embalagemTotal,
        volume,
        peso,
        obs,
        barcodeValue,
    };
}

/* =========================================================
   MONTA ITENS: vários CT-es + várias embalagens
   Aceita:
   - selectedCtes: [{ ctrc, embalagemTotal, ... }]
   - ctes: ["181561","181562"] (fallback)
========================================================= */
function buildItemsFromSelection(state) {
    // 1) Preferência: lista completa vinda da tela
    const selectedCtes = Array.isArray(state?.selectedCtes) ? state.selectedCtes : null;

    // 2) Fallback: só números
    const ctesNumbers = Array.isArray(state?.ctes) ? state.ctes : null;

    const out = [];
    let guard = 0;

    if (selectedCtes && selectedCtes.length) {
        for (const c of selectedCtes) {
            const ctrc = String(c?.ctrc || c?.CTRC || c?.numero || c?.nr_ctrc || "").trim();
            if (!ctrc) continue;

            const total = Number(c?.embalagemTotal ?? c?.embalagens ?? c?.qtdEmbalagem ?? c?.qtd_embalagem ?? 1) || 1;
            const embTotal = Math.max(1, Math.floor(total));

            for (let e = 1; e <= embTotal; e++) {
                // se a tela mandar dados reais, você pode mapear aqui (emissao, remetente etc)
                // por enquanto seguimos com mock e só aplicamos ctrc + embalagem
                out.push(makeMockCTRC(ctrc, e, embTotal));

                guard++;
                if (guard >= 3000) break;
            }
            if (guard >= 3000) break;
        }
        return out;
    }

    if (ctesNumbers && ctesNumbers.length) {
        for (const ctrc of ctesNumbers) {
            const s = String(ctrc || "").trim();
            if (!s) continue;

            // sem info de embalagens, assume 1
            out.push(makeMockCTRC(s, 1, 1));

            guard++;
            if (guard >= 3000) break;
        }
        return out;
    }

    // 3) Fallback final: 1 ctrc simples
    const single = String(state?.ctrc || "181561");
    out.push(makeMockCTRC(single, 1, 1));
    return out;
}

/* =========================================================
   RENDER DA ETIQUETA (layout estilo a imagem)
   - respeita visibleFieldIds ( +Campos funciona )
========================================================= */
function RenderEtiquetaCTRC({ item, visibleFieldIds }) {
    const show = (id) => (visibleFieldIds || []).includes(id);

    const logo = item.logo || "";
    const hasLogo = !!logo;

    const embalagemTxt =
        item.embalagemAtual && item.embalagemTotal
            ? `${item.embalagemAtual} / ${item.embalagemTotal}`
            : "";

    return (
        <div
            className="w-full h-full"
            style={{
                boxSizing: "border-box",
                padding: "3mm",
                position: "relative",
                color: "#000",
                fontFamily: 'Arial, "Liberation Sans", "Helvetica", sans-serif',
            }}
        >
            {/* moldura */}
            <div
                style={{
                    position: "absolute",
                    left: "2mm",
                    right: "2mm",
                    top: "2mm",
                    bottom: "2mm",
                    border: "2px solid #000",
                }}
            />

            {/* conteúdo */}
            <div style={{ position: "absolute", left: "4mm", right: "4mm", top: "4mm", bottom: "4mm" }}>
                {/* linha topo */}
                <div style={{ display: "grid", gridTemplateColumns: "42mm 1fr 1fr", gap: "2mm", alignItems: "stretch" }}>
                    {/* LOGO */}
                    <div
                        style={{
                            border: "1px solid #000",
                            padding: "1.5mm",
                            minHeight: "14mm",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {show("logo") ? (
                            hasLogo ? (
                                <img
                                    src={logo}
                                    alt="Logo"
                                    style={{ maxWidth: "100%", maxHeight: "12mm", objectFit: "contain" }}
                                />
                            ) : (
                                <div style={{ width: "100%", height: "12mm" }} />
                            )
                        ) : (
                            <div style={{ width: "100%", height: "12mm" }} />
                        )}
                    </div>

                    {/* EMISSÃO */}
                    <div style={{ border: "1px solid #000", padding: "1.5mm" }}>
                        {show("emissao") && (
                            <>
                                <div style={{ fontWeight: 700, fontSize: "10pt", textAlign: "center" }}>Emissão</div>
                                <div style={{ fontWeight: 800, fontSize: "12pt", textAlign: "center", marginTop: "1mm" }}>
                                    {item.emissao || ""}
                                </div>
                            </>
                        )}
                    </div>

                    {/* ORIGEM / DESTINO COD */}
                    <div style={{ border: "1px solid #000", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                        <div style={{ padding: "1.5mm", borderRight: "1px solid #000" }}>
                            {show("origemCod") && (
                                <>
                                    <div style={{ fontWeight: 700, fontSize: "10pt", textAlign: "center" }}>Origem</div>
                                    <div style={{ fontWeight: 800, fontSize: "12pt", textAlign: "center", marginTop: "1mm" }}>
                                        {item.origemCod || ""}
                                    </div>
                                </>
                            )}
                        </div>
                        <div style={{ padding: "1.5mm" }}>
                            {show("destinoCod") && (
                                <>
                                    <div style={{ fontWeight: 700, fontSize: "10pt", textAlign: "center" }}>Destino</div>
                                    <div style={{ fontWeight: 800, fontSize: "12pt", textAlign: "center", marginTop: "1mm" }}>
                                        {item.destinoCod || ""}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* BLOCO 2 */}
                <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: "0mm", marginTop: "0mm" }}>
                    {/* esquerda (Remetente / Destinatário) */}
                    <div style={{ borderLeft: "1px solid #000", borderRight: "1px solid #000", borderBottom: "1px solid #000" }}>
                        <div style={{ borderTop: "1px solid #000", padding: "2mm" }}>
                            {show("remetente") && (
                                <>
                                    <div style={{ fontWeight: 800, fontSize: "11pt" }}>Remetente</div>
                                    <div style={{ fontWeight: 700, fontSize: "11pt", marginTop: "1mm" }}>{item.remetente || ""}</div>
                                </>
                            )}
                        </div>

                        <div style={{ borderTop: "1px solid #000", padding: "2mm", minHeight: "28mm" }}>
                            {show("destinatario") && (
                                <>
                                    <div style={{ fontWeight: 800, fontSize: "11pt" }}>Destinatario</div>
                                    <div style={{ fontWeight: 700, fontSize: "11pt", marginTop: "1mm" }}>
                                        {item.destinatarioNome || ""}
                                    </div>
                                    <div style={{ fontWeight: 700, fontSize: "10pt", marginTop: "1mm" }}>
                                        {item.destinatarioEndereco || ""}
                                    </div>
                                    <div style={{ fontWeight: 700, fontSize: "10pt", marginTop: "1mm" }}>
                                        Bairro: {item.destinatarioBairro || ""}
                                    </div>
                                    <div style={{ fontWeight: 700, fontSize: "10pt", marginTop: "1mm" }}>
                                        CEP : {item.destinatarioCep || ""}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* direita */}
                    <div style={{ borderRight: "1px solid #000", borderBottom: "1px solid #000", borderTop: "1px solid #000" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid #000" }}>
                            <div style={{ padding: "2mm", borderRight: "1px solid #000" }}>
                                {show("origemCidade") && (
                                    <>
                                        <div style={{ fontWeight: 800, fontSize: "11pt", textAlign: "center" }}>Origem</div>
                                        <div style={{ fontWeight: 800, fontSize: "11pt", textAlign: "center", marginTop: "1mm" }}>
                                            {item.origemCidadeUf || ""}
                                        </div>
                                    </>
                                )}
                            </div>
                            <div style={{ padding: "2mm" }}>
                                {show("ctrc") && (
                                    <>
                                        <div style={{ fontWeight: 800, fontSize: "11pt", textAlign: "center" }}>CTRC</div>
                                        <div style={{ fontWeight: 900, fontSize: "14pt", textAlign: "center", marginTop: "1mm" }}>
                                            {item.ctrc || ""}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid #000" }}>
                            <div style={{ padding: "2mm", borderRight: "1px solid #000" }}>
                                {show("destinoCidade") && (
                                    <>
                                        <div style={{ fontWeight: 800, fontSize: "11pt", textAlign: "center" }}>Destino</div>
                                        <div style={{ fontWeight: 800, fontSize: "11pt", textAlign: "center", marginTop: "1mm" }}>
                                            {item.destinoCidadeUf || ""}
                                        </div>
                                    </>
                                )}
                            </div>
                            <div style={{ padding: "2mm" }}>
                                {show("embalagem") && (
                                    <>
                                        <div style={{ fontWeight: 800, fontSize: "11pt", textAlign: "center" }}>Embalagem</div>
                                        <div style={{ fontWeight: 900, fontSize: "13pt", textAlign: "center", marginTop: "1mm" }}>
                                            {embalagemTxt}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                            <div style={{ padding: "2mm", borderRight: "1px solid #000" }}>
                                {show("volume") && (
                                    <>
                                        <div style={{ fontWeight: 800, fontSize: "11pt", textAlign: "center" }}>Volume</div>
                                        <div style={{ fontWeight: 900, fontSize: "13pt", textAlign: "center", marginTop: "1mm" }}>
                                            {item.volume ?? ""}
                                        </div>
                                    </>
                                )}
                            </div>
                            <div style={{ padding: "2mm" }}>
                                {show("peso") && (
                                    <>
                                        <div style={{ fontWeight: 800, fontSize: "11pt", textAlign: "center" }}>Peso</div>
                                        <div style={{ fontWeight: 900, fontSize: "13pt", textAlign: "center", marginTop: "1mm" }}>
                                            {item.peso !== undefined ? n2(item.peso) : ""}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* OBS */}
                <div style={{ borderLeft: "1px solid #000", borderRight: "1px solid #000", borderBottom: "1px solid #000", padding: "2mm" }}>
                    {show("obs") && (
                        <div style={{ fontWeight: 800, fontSize: "11pt" }}>
                            Obs.: <span style={{ fontWeight: 700 }}>{item.obs || ""}</span>
                        </div>
                    )}
                </div>

                {/* BARCODE */}
                <div style={{ borderLeft: "1px solid #000", borderRight: "1px solid #000", borderBottom: "1px solid #000", padding: "2mm", marginTop: "0mm" }}>
                    {show("barcode") && (
                        <div style={{ paddingTop: "1mm" }}>
                            <BarcodeSVG value={item.barcodeValue || item.ctrc || ""} heightMm={18} quietMm={2} />
                        </div>
                    )}
                    {show("barcodeTexto") && (
                        <div style={{ textAlign: "center", marginTop: "1mm", fontWeight: 800, fontSize: "11pt" }}>
                            {item.barcodeValue || ""}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function RelEtiquetaCTRC({ open }) {
    const location = useLocation();
    const navigate = useNavigate();

    // tamanho da etiqueta (pode vir da tela)
    const labelConfigFromState = location?.state?.labelConfig || null;

    // ✅ monta TODOS os itens selecionados + embalagens
    const items = useMemo(() => buildItemsFromSelection(location?.state || {}), [location?.state]);

    // ✅ padrão deste relatório: 200 x 120
    const labelConfig = useMemo(() => {
        const base = {
            widthMm: 200,
            heightMm: 120,
            gapMm: 0,
            marginMm: 0,
            dpi: 203,
        };
        if (labelConfigFromState && typeof labelConfigFromState === "object") {
            return { ...base, ...labelConfigFromState };
        }
        return base;
    }, [labelConfigFromState]);

    const templateId = useMemo(() => {
        const w = Number(labelConfig?.widthMm || 200);
        const h = Number(labelConfig?.heightMm || 120);
        return `${w}x${h}`;
    }, [labelConfig]);

    const template = useMemo(() => {
        return {
            fieldsCatalog: [
                { id: "logo", label: "Logo (Topo Esquerda)", group: "Padrão" },
                { id: "emissao", label: "Emissão", group: "Padrão" },
                { id: "origemCod", label: "Origem (Código)", group: "Padrão" },
                { id: "destinoCod", label: "Destino (Código)", group: "Padrão" },

                { id: "remetente", label: "Remetente", group: "Padrão" },
                { id: "destinatario", label: "Destinatário (Nome/Endereço)", group: "Padrão" },

                { id: "origemCidade", label: "Origem (Cidade/UF)", group: "Padrão" },
                { id: "ctrc", label: "CTRC", group: "Padrão", required: true },
                { id: "destinoCidade", label: "Destino (Cidade/UF)", group: "Padrão" },
                { id: "embalagem", label: "Embalagem (x/y)", group: "Padrão" },

                { id: "volume", label: "Volume", group: "Padrão" },
                { id: "peso", label: "Peso", group: "Padrão" },

                { id: "obs", label: "Obs.", group: "Padrão" },
                { id: "barcode", label: "Código de Barras", group: "Padrão" },
                { id: "barcodeTexto", label: "Texto abaixo do código", group: "Padrão" },
            ],

            defaultVisibleFieldIds: [
                "logo",
                "emissao",
                "origemCod",
                "destinoCod",
                "remetente",
                "destinatario",
                "origemCidade",
                "ctrc",
                "destinoCidade",
                "embalagem",
                "volume",
                "peso",
                "obs",
                "barcode",
                "barcodeTexto",
            ],

            renderLabel: ({ item, visibleFieldIds }) => (
                <RenderEtiquetaCTRC item={item} visibleFieldIds={visibleFieldIds} />
            ),
        };
    }, []);

    return (
        <EtiquetaBase
            sidebarOpen={open}
            reportKey="operacao.etiqueta_ctrc"
            templateId={templateId}
            labelKind="barcode"
            labelConfig={labelConfig}
            template={template}
            items={items}   // ✅ agora pode vir 1, 10, 500...
            onClose={() => navigate(-1)}
        />
    );
}
