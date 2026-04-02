// src/pages/Relatorios/Faturamento/RelFatura.jsx
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DocumentoBase from "../base/DocumentoBase";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// helpers simples
const n2 = (v) =>
    Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 });

const onlyDigits = (s) => (s || "").replace(/\D/g, "");

const formatCNPJ = (cnpj) => {
    const d = onlyDigits(cnpj);
    if (d.length !== 14) return cnpj || "";
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(
        8,
        12
    )}-${d.slice(12, 14)}`;
};

function getDefaultTemplateId() {
    return "padrao";
}

// MOCK (depois você troca por API)
function mockFatura(numeroFatura) {
    return {
        templateId: "padrao",
        empresa: {
            razao: "DIFALUX TRANSPORTES LTDA ME",
            endereco: "RUA LOURDES - SANTO ANDRE/SP CEP 09015340",
            tel: "(11) 27541140",
            email: "difalux@difalux.com.br",
            cnpj: "04086814000141",
            ie: "121611082117",
        },
        fatura: {
            numero: numeroFatura || "048695C",
            data: "28/01/2026",
            vencimento: "13/02/2026",
            valorTotal: 6879.25,
            valorBruto: 6879.25,
            valorJuros: 0,
            desconto: 0,
            valorISS: 0,
            valorICMS: 825.51,
            valorExtenso:
                "SEIS MIL E OITOCENTOS E SETENTA E NOVE REAIS E VINTE E CINCO CENTAVOS",
        },
        sacado: {
            nome: "GOLGRAN IND COM INSTR ODOTOLOGICO LT",
            endereco: "RUA SENADOR VERGUEIRO, 433",
            bairro: "CENTRO",
            compl: "ESQ. R BARALDI",
            pracaPagto: "09521320 - SAO CAETANO DO SUL/SP",
            cnpj: "51753374000119",
            ie: "636311623112",
        },
        itens: [
            { emissao: "28/01/2026", docto: "181404", vrFrete: 6879.25, tipo: "CTRC" },
            { emissao: "28/01/2026", docto: "181405", vrFrete: 120.0, tipo: "CTRC" },
            { emissao: "27/01/2026", docto: "181399", vrFrete: 55.5, tipo: "NF" },
        ],
        observacoes:
            "Deve(m) esta fatura de venda mercantil e/ou prestação de serviços com pagamento a Transportadora DIFALUX TRANSPORTES LTDA ME, a importância referente aos serviços constantes nos documentos acima relacionados.",
    };
}

export default function RelFatura({ open }) {
    const navigate = useNavigate();
    const location = useLocation();

    const numeroFatura = location?.state?.numeroFatura || "048695C";
    const templateId = location?.state?.templateId || getDefaultTemplateId();

    const logo = localStorage.getItem("param_logoBg") || "";

    const doc = useMemo(() => {
        const f = mockFatura(numeroFatura);
        return { ...f, templateId };
    }, [numeroFatura, templateId]);

    // catálogo de campos (fica dentro do template)
    const fieldsCatalog = useMemo(() => {
        return [
            { id: "empresa_razao", label: "Emitente - Razão", group: "Emitente" },
            { id: "empresa_endereco", label: "Emitente - Endereço", group: "Emitente" },
            { id: "empresa_tel", label: "Emitente - Telefone", group: "Emitente" },
            { id: "empresa_email", label: "Emitente - E-mail", group: "Emitente" },
            { id: "empresa_cnpj", label: "Emitente - CNPJ", group: "Emitente" },
            { id: "empresa_ie", label: "Emitente - IE", group: "Emitente" },

            { id: "fatura_numero", label: "Nº Fatura", group: "Fatura" },
            { id: "fatura_data", label: "Data", group: "Fatura" },
            { id: "fatura_vencimento", label: "Vencimento", group: "Fatura" },
            { id: "fatura_valor_total", label: "Valor Total", group: "Fatura" },
            { id: "fatura_valor_bruto", label: "Valor Bruto", group: "Fatura" },
            { id: "fatura_valor_juros", label: "Valor Juros", group: "Fatura" },
            { id: "fatura_desconto", label: "Desconto", group: "Fatura" },
            { id: "fatura_valor_iss", label: "Valor ISS", group: "Fatura" },
            { id: "fatura_valor_icms", label: "Valor ICMS", group: "Fatura" },
            { id: "fatura_extenso", label: "Valor por Extenso", group: "Fatura" },

            { id: "sacado_nome", label: "Sacado - Nome", group: "Sacado" },
            { id: "sacado_endereco", label: "Sacado - Endereço", group: "Sacado" },
            { id: "sacado_bairro_compl", label: "Sacado - Bairro/Compl.", group: "Sacado" },
            { id: "sacado_praca", label: "Sacado - Praça Pagto", group: "Sacado" },
            { id: "sacado_cnpj", label: "Sacado - CNPJ", group: "Sacado" },
            { id: "sacado_ie", label: "Sacado - IE", group: "Sacado" },

            { id: "itens_tabela", label: "Tabela de Itens", group: "Itens" },

            { id: "observacoes", label: "Observações", group: "Rodapé" },
            { id: "assinatura", label: "Área de Assinatura", group: "Rodapé" },
        ];
    }, []);

    const defaultVisibleFieldIds = useMemo(() => {
        return [
            "empresa_razao",
            "empresa_endereco",
            "empresa_tel",
            "empresa_email",
            "empresa_cnpj",
            "empresa_ie",

            "fatura_numero",
            "fatura_data",

            "sacado_nome",
            "sacado_endereco",
            "sacado_bairro_compl",
            "sacado_praca",
            "sacado_cnpj",
            "sacado_ie",

            "fatura_vencimento",
            "fatura_valor_total",
            "fatura_valor_bruto",
            "fatura_valor_juros",
            "fatura_desconto",
            "fatura_valor_iss",
            "fatura_valor_icms",

            "fatura_extenso",
            "itens_tabela",
            "observacoes",
            "assinatura",
        ];
    }, []);

    // ✅ O DocumentoBase QUER um objeto template
    const template = useMemo(() => {
        return {
            fieldsCatalog,
            defaultVisibleFieldIds,
            pages: [
                {
                    id: "p1",
                    render: ({ data, visibleFieldIds, logo }) => (
                        <FaturaTemplateA4Retrato
                            data={data}
                            visibleFieldIds={visibleFieldIds}
                            logo={logo}
                            formatCNPJ={formatCNPJ}
                            n2={n2}
                        />
                    ),
                },
            ],
        };
    }, [fieldsCatalog, defaultVisibleFieldIds]);

    return (
        <DocumentoBase
            sidebarOpen={open}
            reportKey={`operacao.faturamento.fatura.${templateId}`}
            title="FATURA"
            logo={logo}
            orientation="portrait"
            templateId={templateId}
            template={template}
            data={doc}
            onClose={() => navigate(-1)}

        // PDF: por enquanto deixa o default do DocumentoBase
        // (abaixo eu te passo o patch para ele mandar visibleFieldIds/data pro onExportPDF)
        />
    );
}

// ======================= TEMPLATE A4 RETRATO (HTML) =======================
// ======================= TEMPLATE A4 RETRATO (HTML) =======================
// props esperadas do DocumentoBase:
// - data: doc (objeto da fatura)
// - visibleFieldIds: array ids visíveis
// ======================= TEMPLATE A4 RETRATO (HTML) =======================
export function FaturaTemplateA4Retrato({
    data,
    visibleFieldIds,
    formatCNPJ,
    n2,
    logo, // ✅ vem do DocumentoBase
}) {
    const v = new Set(visibleFieldIds || []);

    const empresa = data?.empresa || {};
    const fatura = data?.fatura || {};
    const sacado = data?.sacado || {};
    const itens = data?.itens || [];
    const observacoes = data?.observacoes || "";


    const chunk2 = (list = []) => {
        const out = [];
        for (let i = 0; i < list.length; i += 2) out.push([list[i], list[i + 1]]);
        return out;
    };

    const itens2 = chunk2(itens);
    return (
        <div className="w-full h-full text-[12px] text-black">
            {/* Área útil A4 (margens visuais) */}
            <div className="absolute left-[40px] top-[38px] right-[40px] bottom-[30px]">

                {/* ======================= HEADER (BOX ÚNICO) ======================= */}
                <div className="border border-black p-2">
                    <div className="flex items-start gap-2">
                        {/* LOGO (caixa fixa: não invade texto) */}
                        <div className="w-[150px] h-[60px] flex items-center justify-start overflow-hidden">
                            {logo ? (
                                <img
                                    src={logo}
                                    alt="Logo"
                                    className="max-w-full max-h-full object-contain"
                                />
                            ) : null}
                        </div>

                        {/* Emitente (não encosta no logo) */}
                        <div className="flex-1 min-w-0">
                            {v.has("empresa_razao") && (
                                <div className="font-bold text-[13px] leading-4 truncate">
                                    {empresa.razao}
                                </div>
                            )}

                            {v.has("empresa_endereco") && (
                                <div className="text-[12px] leading-4">
                                    {empresa.endereco}
                                </div>
                            )}

                            <div className="text-[12px] leading-4">
                                {v.has("empresa_tel") ? <span>Tel.: {empresa.tel} </span> : null}
                                {v.has("empresa_email") ? (
                                    <span className="ml-3">E-mail: {empresa.email}</span>
                                ) : null}
                            </div>

                            <div className="text-[12px] leading-4 flex gap-6">
                                {v.has("empresa_cnpj") ? (
                                    <span>CNPJ.: {formatCNPJ(empresa.cnpj)}</span>
                                ) : null}
                                {v.has("empresa_ie") ? <span>I.E.: {empresa.ie}</span> : null}
                            </div>
                        </div>

                        {/* Fatura (direita) */}
                        <div className="w-[170px] text-right">
                            {v.has("fatura_numero") && (
                                <div className="leading-4">
                                    <div className="font-bold text-[14px]">Nº Fatura</div>
                                    <div className="font-bold text-[18px]">{fatura.numero}</div>
                                </div>
                            )}

                            {v.has("fatura_data") && (
                                <div className="mt-1 text-[12px] leading-4">
                                    <b>Data:</b> {fatura.data}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ======================= SACADO + VENCIMENTO (MESMO BOX) ======================= */}
                <div className="mt-3 border border-black">
                    <div className="grid grid-cols-12">
                        {/* Lado esquerdo: Sacado */}
                        <div className="col-span-8 p-2 border-r border-black">
                            {v.has("sacado_nome") && (
                                <div className="text-[12px] leading-5">
                                    <span className="font-bold">Nome do Sacado:</span>{" "}
                                    <span className="font-bold">{sacado.nome}</span>
                                </div>
                            )}

                            {v.has("sacado_endereco") && (
                                <div className="text-[12px] leading-5">
                                    <span className="font-bold">Endereço:</span> {sacado.endereco}
                                </div>
                            )}

                            {v.has("sacado_bairro_compl") && (
                                <div className="text-[12px] leading-5">
                                    <span className="font-bold">Bairro/Compl.:</span>{" "}
                                    {sacado.bairro} {sacado.compl ? ` ${sacado.compl}` : ""}
                                </div>
                            )}

                            {v.has("sacado_praca") && (
                                <div className="text-[12px] leading-5">
                                    <span className="font-bold">Praça do Pagto:</span>{" "}
                                    {sacado.pracaPagto}
                                </div>
                            )}

                            <div className="text-[12px] leading-5 flex gap-10 mt-1">
                                {v.has("sacado_cnpj") ? (
                                    <span>
                                        <span className="font-bold">CNPJ/CPF.:</span>{" "}
                                        {formatCNPJ(sacado.cnpj)}
                                    </span>
                                ) : null}
                                {v.has("sacado_ie") ? (
                                    <span>
                                        <span className="font-bold">I.Est:</span> {sacado.ie}
                                    </span>
                                ) : null}
                            </div>
                        </div>

                        {/* Lado direito: Vencimento / Valores */}
                        <div className="col-span-4 p-2">
                            <div className="grid grid-cols-2 gap-y-1 text-[12px] leading-5">
                                {v.has("fatura_vencimento") && (
                                    <>
                                        <div className="font-bold">Vencimento:</div>
                                        <div className="text-right font-bold">{fatura.vencimento}</div>
                                    </>
                                )}
                                {v.has("fatura_valor_bruto") && (
                                    <>
                                        <div>Valor Bruto:</div>
                                        <div className="text-right">R$ {n2(fatura.valorBruto)}</div>
                                    </>
                                )}
                                {v.has("fatura_valor_juros") && (
                                    <>
                                        <div>Valor Juros:</div>
                                        <div className="text-right">R$ {n2(fatura.valorJuros)}</div>
                                    </>
                                )}
                                {v.has("fatura_desconto") && (
                                    <>
                                        <div>Desconto:</div>
                                        <div className="text-right">R$ {n2(fatura.desconto)}</div>
                                    </>
                                )}
                                {v.has("fatura_valor_iss") && (
                                    <>
                                        <div>Valor ISS:</div>
                                        <div className="text-right">R$ {n2(fatura.valorISS)}</div>
                                    </>
                                )}
                                {v.has("fatura_valor_icms") && (
                                    <>
                                        <div>Valor ICMS:</div>
                                        <div className="text-right">R$ {n2(fatura.valorICMS)}</div>
                                    </>
                                )}
                            </div>

                            {v.has("fatura_valor_total") && (
                                <div className="mt-2 pt-2 border-t border-black flex items-center justify-between">
                                    <div className="font-bold">Valor Total:</div>
                                    <div className="font-bold">R$ {n2(fatura.valorTotal)}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ======================= VALOR EXTENSO ======================= */}
                {v.has("fatura_extenso") && (
                    <div className="mt-3 border border-black p-2">
                        <div className="flex gap-3">
                            <div className="font-bold w-[120px]">Valor por Extenso</div>
                            <div className="flex-1 font-bold uppercase">
                                {fatura.valorExtenso}
                            </div>
                        </div>

                        <div className="mt-1 text-[11px] font-mono">
                            {"*".repeat(110)}
                        </div>
                    </div>
                )}

                {/* ======================= ITENS FATURADOS (BORDA SÓ NO BLOCO) ======================= */}
                {/* ======================= ITENS FATURADOS (igual imagem 02) ======================= */}
                {v.has("itens_tabela") && (
                    <div className="mt-3">
                        {/* ✅ Borda só no TÍTULO */}
                        <div className="border border-black py-1 text-center font-bold text-[13px]">
                            Itens Faturados
                        </div>

                        {/* ✅ Conteúdo SEM borda, 2 colunas (itens soltos) */}
                        <div className="px-2 pt-2">
                            {(() => {
                                const left = (itens || []).filter((_, i) => i % 2 === 0);
                                const right = (itens || []).filter((_, i) => i % 2 === 1);

                                const Col = ({ list }) => (
                                    <div>
                                        {/* Header da coluna (sem caixa/borda) */}
                                        <div className="grid grid-cols-4 gap-2 text-[12px] font-semibold text-gray-700 border-b border-gray-400 pb-1">
                                            <div>Emissão</div>
                                            <div>Nº Docto</div>
                                            <div className="text-right">Vr. Frete</div>
                                            <div>Tipo</div>
                                        </div>

                                        {/* Linhas (sem borda) */}
                                        <div className="pt-1">
                                            {list.map((it, idx) => (
                                                <div key={idx} className="grid grid-cols-4 gap-2 text-[12px] py-[3px]">
                                                    <div>{it.emissao}</div>
                                                    <div>{it.docto}</div>
                                                    <div className="text-right">R$ {n2(it.vrFrete)}</div>
                                                    <div>{it.tipo}</div>
                                                </div>
                                            ))}

                                            {!list.length ? (
                                                <div className="text-[12px] text-gray-400 py-2"> </div>
                                            ) : null}
                                        </div>
                                    </div>
                                );

                                return (
                                    <div className="grid grid-cols-2 gap-10">
                                        <Col list={left} />
                                        <Col list={right} />
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                )}

                {/* ======================= OBSERVAÇÕES ======================= */}
                {v.has("observacoes") && (
                    <div className="mt-3 border border-black p-2">
                        <div className="text-center font-bold text-[13px] mb-2">
                            Observacoes
                        </div>
                        <div className="text-[12px] leading-5 whitespace-pre-wrap min-h-[120px]">
                            {observacoes}
                        </div>

                        {/* Assinatura no rodapé do box de observações (igual seus prints) */}
                        {v.has("assinatura") && (
                            <div className="mt-6 text-[12px]">
                                <div className="mb-4">Aceite: _____/_____/________</div>
                                <div className="border-t border-black pt-2 w-[320px] text-center">
                                    Assinatura do Sacado
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Rodapé técnico */}
                <div className="absolute right-0 bottom-0 text-[10px] text-gray-700">
                    Rel_Financeiro_Fatura
                </div>
            </div>
        </div>
    );
}

// ======================= EXPORT PDF (JS PDF) =======================
export async function exportFaturaPDF({ visibleFieldIds, doc }) {
    const v = new Set(visibleFieldIds || []);
    const empresa = doc?.empresa || {};
    const fatura = doc?.fatura || {};
    const sacado = doc?.sacado || {};
    const itens = doc?.itens || [];
    const observacoes = doc?.observacoes || "";

    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth();
    const marginL = 12;
    const marginR = 12;

    const tx = (x, y, s, opt) => pdf.text(String(s || ""), x, y, opt);
    const line = (x1, y1, x2, y2) => pdf.line(x1, y1, x2, y2);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);

    if (v.has("empresa_razao")) tx(marginL, 18, empresa.razao);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9.5);
    if (v.has("empresa_endereco")) tx(marginL, 23, empresa.endereco);

    const telEmail = [
        v.has("empresa_tel") ? `Tel.: ${empresa.tel || ""}` : "",
        v.has("empresa_email") ? `E-mail: ${empresa.email || ""}` : "",
    ]
        .filter(Boolean)
        .join("   ");
    if (telEmail) tx(marginL, 28, telEmail);

    const cnpjIe = [
        v.has("empresa_cnpj") ? `CNPJ.: ${formatCNPJ(empresa.cnpj)}` : "",
        v.has("empresa_ie") ? `I.E.: ${empresa.ie || ""}` : "",
    ]
        .filter(Boolean)
        .join("   ");
    if (cnpjIe) tx(marginL, 33, cnpjIe);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    if (v.has("fatura_numero")) {
        tx(pageW - marginR, 18, "Nº Fatura", { align: "right" });
        pdf.setFontSize(14);
        tx(pageW - marginR, 24, fatura.numero, { align: "right" });
    }
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    if (v.has("fatura_data"))
        tx(pageW - marginR, 31, `Data: ${fatura.data}`, { align: "right" });

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9.5);

    let y = 48;
    if (v.has("sacado_nome")) tx(marginL, y, `Nome do Sacado: ${sacado.nome || ""}`), (y += 5);
    if (v.has("sacado_endereco")) tx(marginL, y, `Endereço: ${sacado.endereco || ""}`), (y += 5);

    if (v.has("sacado_bairro_compl")) {
        const bc = `${sacado.bairro || ""}${sacado.compl ? ` ${sacado.compl}` : ""}`.trim();
        tx(marginL, y, `Bairro/Compl.: ${bc}`);
        y += 5;
    }
    if (v.has("sacado_praca")) tx(marginL, y, `Praça do Pagto: ${sacado.pracaPagto || ""}`), (y += 5);

    const cnpjSac = v.has("sacado_cnpj") ? `CNPJ/CPF.: ${formatCNPJ(sacado.cnpj)}` : "";
    const ieSac = v.has("sacado_ie") ? `I.Est: ${sacado.ie || ""}` : "";
    const lastLine = [cnpjSac, ieSac].filter(Boolean).join("   ");
    if (lastLine) tx(marginL, y, lastLine);

    const xVal = pageW - marginR;
    let yVal = 48;

    const rightLine = (label, value) => {
        tx(xVal - 45, yVal, label, { align: "right" });
        tx(xVal, yVal, value, { align: "right" });
        yVal += 5;
    };

    if (v.has("fatura_vencimento")) rightLine("Vencimento:", fatura.vencimento || "");
    if (v.has("fatura_valor_total")) rightLine("Valor Total:", `R$ ${n2(fatura.valorTotal)}`);
    if (v.has("fatura_valor_bruto")) rightLine("Valor Bruto:", `R$ ${n2(fatura.valorBruto)}`);
    if (v.has("fatura_valor_juros")) rightLine("Valor Juros:", `R$ ${n2(fatura.valorJuros)}`);
    if (v.has("fatura_desconto")) rightLine("Desconto:", `R$ ${n2(fatura.desconto)}`);
    if (v.has("fatura_valor_iss")) rightLine("Valor ISS:", `R$ ${n2(fatura.valorISS)}`);
    if (v.has("fatura_valor_icms")) rightLine("Valor ICMS:", `R$ ${n2(fatura.valorICMS)}`);

    if (v.has("fatura_extenso")) {
        const yExt = 83;
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9.5);
        tx(marginL, yExt, "Valor por Extenso");
        tx(marginL, yExt + 6, (fatura.valorExtenso || "").toUpperCase());
        pdf.setFont("courier", "normal");
        pdf.setFontSize(8);
        tx(marginL, yExt + 12, "*".repeat(90));
    }

    let startY = 105;
    if (v.has("itens_tabela")) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        tx(pageW / 2, startY, "Itens Faturados", { align: "center" });

        autoTable(pdf, {
            startY: startY + 4,
            head: [["Emissão", "Nº Docto", "Vr. Frete", "Tipo"]],
            body: (itens || []).map((it) => [
                it.emissao || "",
                it.docto || "",
                `R$ ${n2(it.vrFrete)}`,
                it.tipo || "",
            ]),
            theme: "grid",
            styles: { fontSize: 9, cellPadding: 2, lineWidth: 0.2, lineColor: 0 },
            headStyles: { fontStyle: "bold", textColor: 0 },
            columnStyles: {
                0: { halign: "center" },
                1: { halign: "center" },
                2: { halign: "right" },
                3: { halign: "center" },
            },
            margin: { left: marginL, right: marginR },
        });

        startY = (pdf.lastAutoTable?.finalY || startY + 25) + 8;
    }

    if (v.has("observacoes")) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        tx(pageW / 2, startY, "Observacoes", { align: "center" });

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9.5);

        const textW = pageW - marginL - marginR;
        const lines = pdf.splitTextToSize(observacoes || "", textW);
        tx(marginL, startY + 6, lines);
        startY += 6 + lines.length * 4.2 + 6;
    }

    if (v.has("assinatura")) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        tx(marginL, startY + 8, "Aceite: _____/_____/________");
        line(marginL, startY + 30, marginL + 80, startY + 30);
        pdf.setFontSize(9.5);
        tx(marginL + 40, startY + 36, "Assinatura do Sacado", { align: "center" });
    }

    pdf.save(`Fatura_${fatura.numero || "documento"}.pdf`);
}
