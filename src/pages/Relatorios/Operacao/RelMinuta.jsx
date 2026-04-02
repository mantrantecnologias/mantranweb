// src/pages/Relatorios/Operacao/RelMinuta.jsx
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DocumentoBase from "../base/DocumentoBase";

/* =========================================================
   Helpers
========================================================= */
const onlyDigits = (s) => (s || "").replace(/\D/g, "");

const n2 = (v) =>
    Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 });

const n0 = (v) => Number(v || 0).toLocaleString("pt-BR");

function getDefaultTemplateId() {
    return "padrao";
}

/* =========================================================
   MOCK (troca por API depois)
========================================================= */
function mockMinuta(numero = "15.284") {
    return {
        templateId: "padrao",

        empresa: {
            nomeTopo: "W L S BARROS - RECIFE",
            enderecoTopo: "R ITAMARACA, 335 - RECIFE - PE",
            foneTopo: "(19)3273-1234",
        },

        minuta: {
            dataCadastro: "27/01/2026",
            numero,
        },

        cliente: {
            cnpj: "35912495000100",
            razao: "RODONAVES TRANSPORTES MULTIMODAL LTDA",
            endereco: "AV ALEXANDRE COLARES",
            numero: "500",
            bairro: "VILA JAGUARA",
            cidade: "SAO PAULO",
            uf: "SP",
        },

        remetente: {
            cnpj: "80078934000185",
            razao: "BISCOM BRASIL EXP E INP DE ACESSORIOS",
            endereco: "RUA AFONSO MEISTER",
            numero: "352",
            bairro: "GLORIA",
            cidade: "JOINVILLE",
            uf: "SC",
        },

        destinatario: {
            cnpj: "06626253063315",
            razao: "EMPREENDIMENTOS PAGUE MENOS SA",
            endereco: "RUA RIACHAO",
            numero: "807",
            bairro: "MURIBECA",
            cidade: "JABOATAO DOS GUARARARA",
            uf: "PE",
        },

        // coluna da direita (no seu PDF é “Recebedor”)
        redespacho: {
            nome: "DANILO GONCALVES DE MELO",
            endereco: "RUA GARULHOS",
            numero: "121",
            bairro: "CENTRO",
            cidade: "JABOATAO DOS GUARAR",
            uf: "PE",
        },

        motorista: {
            nome: "MARIA DO SOCORRO GOMES BARROS",
        },

        veiculo: {
            placa: "NXW855",
            isento: "ISENTO",
        },

        nota: {
            nf: "00038566",
            emissao: "27/01/2026",
            qtdeVol: 1,
            peso: 0.84,
            cubagem: 0.0,
            valorNF: 282.29,
        },

        valores: {
            cat: 0,
            despacho: 0,
            pedagio: 0,
            fretePeso: 400,
            freteValor: 0,
            coletaEntrega: 0,
            outros: 0,
            freteTotal: 400,
        },

        observacao: "DEDICADO",

        aviso:
            "Após a conferência física e protocolo de recebimento, a transportadora não se responsabiliza por quaisquer danos, falta e/ou, avarias que porventura vierem a ocorrer nas mercadorias entregues.\nPara sua segurança acompanhe o recebimento e conferência.",
    };
}

/* =========================================================
   PÁGINA
========================================================= */
export default function RelMinuta({ open }) {
    const navigate = useNavigate();
    const location = useLocation();

    const numeroMinuta = location?.state?.numeroMinuta || "15.284";
    const templateId = location?.state?.templateId || getDefaultTemplateId();
    const logo = localStorage.getItem("param_logoBg") || "";

    const doc = useMemo(() => {
        if (location?.state?.data) {
            return { ...location.state.data, templateId };
        }
        const d = mockMinuta(numeroMinuta);
        return { ...d, templateId };
    }, [location, numeroMinuta, templateId]);

    /* =========================================================
       +Campos (catálogo)
    ========================================================= */
    const fieldsCatalog = useMemo(
        () => [
            // topo / empresa
            { id: "top_empresa_nome", label: "Topo - Empresa (linha 1)", group: "Topo" },
            { id: "top_empresa_end", label: "Topo - Endereço (linha 2)", group: "Topo" },
            { id: "top_empresa_fone", label: "Topo - Fone (linha 3)", group: "Topo" },

            // box minuta
            { id: "minuta_data", label: "Minuta - Data Cadastro", group: "Minuta" },
            { id: "minuta_numero", label: "Minuta - Número", group: "Minuta" },

            // cliente
            { id: "cli_cnpj", label: "Cliente - CNPJ", group: "Cliente" },
            { id: "cli_razao", label: "Cliente - Razão Social", group: "Cliente" },
            { id: "cli_end", label: "Cliente - Endereço", group: "Cliente" },
            { id: "cli_num", label: "Cliente - Nº", group: "Cliente" },
            { id: "cli_bairro", label: "Cliente - Bairro", group: "Cliente" },
            { id: "cli_ciduf", label: "Cliente - Cidade/UF", group: "Cliente" },

            // remetente
            { id: "rem_cnpj", label: "Remetente - CNPJ", group: "Remetente" },
            { id: "rem_razao", label: "Remetente - Razão Social", group: "Remetente" },
            { id: "rem_end", label: "Remetente - Endereço", group: "Remetente" },
            { id: "rem_num", label: "Remetente - Nº", group: "Remetente" },
            { id: "rem_bairro", label: "Remetente - Bairro", group: "Remetente" },
            { id: "rem_ciduf", label: "Remetente - Cidade/UF", group: "Remetente" },

            // destinatário
            { id: "dst_cnpj", label: "Destinatário - CNPJ", group: "Destinatário" },
            { id: "dst_razao", label: "Destinatário - Razão Social", group: "Destinatário" },
            { id: "dst_end", label: "Destinatário - Endereço", group: "Destinatário" },
            { id: "dst_num", label: "Destinatário - Nº", group: "Destinatário" },
            { id: "dst_bairro", label: "Destinatário - Bairro", group: "Destinatário" },
            { id: "dst_ciduf", label: "Destinatário - Cidade/UF", group: "Destinatário" },

            // redespacho (recebedor)
            { id: "red_nome", label: "Redespacho - Nome", group: "Redespacho" },
            { id: "red_end", label: "Redespacho - Endereço", group: "Redespacho" },
            { id: "red_num", label: "Redespacho - Nº", group: "Redespacho" },
            { id: "red_bairro", label: "Redespacho - Bairro", group: "Redespacho" },
            { id: "red_ciduf", label: "Redespacho - Cidade/UF", group: "Redespacho" },

            // motorista/veículo
            { id: "mot_nome", label: "Motorista - Nome", group: "Motorista/Veículo" },
            { id: "vei_placa", label: "Veículo - Placa", group: "Motorista/Veículo" },
            { id: "vei_isento", label: "Veículo - Isento", group: "Motorista/Veículo" },

            // dados nota
            { id: "nf_nf", label: "Nota - Nº NF", group: "Nota Fiscal" },
            { id: "nf_emissao", label: "Nota - Emissão", group: "Nota Fiscal" },
            { id: "nf_qtde", label: "Nota - Qtde Vol", group: "Nota Fiscal" },
            { id: "nf_peso", label: "Nota - Peso NF", group: "Nota Fiscal" },
            { id: "nf_cub", label: "Nota - Cubagem", group: "Nota Fiscal" },
            { id: "nf_valor", label: "Nota - Valor NF", group: "Nota Fiscal" },

            // valores
            { id: "val_cat", label: "Valores - CAT", group: "Valores" },
            { id: "val_desp", label: "Valores - Despacho", group: "Valores" },
            { id: "val_ped", label: "Valores - Valor Pedágio", group: "Valores" },
            { id: "val_fpeso", label: "Valores - Frete Peso", group: "Valores" },
            { id: "val_fvalor", label: "Valores - Frete Valor", group: "Valores" },
            { id: "val_coleta", label: "Valores - Coleta/Entrega", group: "Valores" },
            { id: "val_outros", label: "Valores - Outros", group: "Valores" },
            { id: "val_total", label: "Valores - Valor Frete Total", group: "Valores" },

            // obs / rodapé
            { id: "obs", label: "Observação", group: "Rodapé" },
            { id: "aviso", label: "Texto de Aviso", group: "Rodapé" },
            { id: "rec", label: "Recebimento (Data/Ass.)", group: "Rodapé" },
        ],
        []
    );

    // ✅ tudo marcado por padrão
    const defaultVisibleFieldIds = useMemo(
        () => fieldsCatalog.map((f) => f.id),
        [fieldsCatalog]
    );

    const template = useMemo(() => {
        return {
            fieldsCatalog,
            defaultVisibleFieldIds,
            defaultOptions: { templateVariant: "padrao", copies: 1 },
            pages: [
                {
                    id: "p1",
                    render: ({ data, visibleFieldIds, logo, options }) => (
                        <MinutaTemplateA4
                            data={data}
                            visibleFieldIds={visibleFieldIds}
                            logo={logo}
                            options={options}
                        />
                    ),
                },
            ],
        };
    }, [fieldsCatalog, defaultVisibleFieldIds]);

    return (
        <DocumentoBase
            sidebarOpen={open}
            reportKey={`operacao.minuta.${templateId}`}
            title="MINUTA"
            logo={logo}
            orientation="portrait"
            templateId={templateId}
            template={template}
            data={doc}
            onClose={() => navigate(-1)}

        />
    );
}

/* =========================================================
   TEMPLATE A4 (2 VIAS NA MESMA FOLHA)
========================================================= */
function MinutaTemplateA4({ data, visibleFieldIds, logo }) {
    const renderVia = (key) => (
        <MinutaVia key={key} data={data} visibleFieldIds={visibleFieldIds} logo={logo} />
    );

    return (
        <div className="w-full h-full text-black">
            <style>{`
        @media print{
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          html, body { height: auto !important; }
          .no-break { break-inside: avoid; page-break-inside: avoid; }
          .no-page-after { break-after: avoid; page-break-after: avoid; }
        }
      `}</style>

            <div className="absolute left-[40px] top-[38px] right-[40px] bottom-[30px] overflow-hidden no-break no-page-after">
                {(() => {
                    const usableH = 1046;
                    const cutH = 18;
                    const viaH = Math.floor((usableH - cutH) / 2) - 6;

                    return (
                        <div className="h-full flex flex-col">
                            <div style={{ height: `${viaH}px` }} className="overflow-hidden">
                                {renderVia("via1")}
                            </div>

                            <div style={{ height: `${cutH}px` }} className="flex items-center">
                                <div className="w-full border-t border-dashed border-gray-400" />
                            </div>

                            <div style={{ height: `${viaH}px` }} className="overflow-hidden">
                                {renderVia("via2")}
                            </div>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
}

/* =========================================================
   VIA (layout compactado, sem torto, observação visível)
========================================================= */
function MinutaVia({ data, visibleFieldIds, logo }) {
    const v = new Set(visibleFieldIds || []);

    const emp = data?.empresa || {};
    const min = data?.minuta || {};
    const cli = data?.cliente || {};
    const rem = data?.remetente || {};
    const dst = data?.destinatario || {};
    const red = data?.redespacho || {};
    const mot = data?.motorista || {};
    const vei = data?.veiculo || {};
    const nf = data?.nota || {};
    const val = data?.valores || {};
    const obs = data?.observacao || "";
    const aviso = data?.aviso || "";

    // Mais compacto
    const Box = ({ children, className = "" }) => (
        <div className={`border border-black rounded-[8px] ${className}`}>{children}</div>
    );

    const Label = ({ children, w = 72 }) => (
        <div className="font-bold text-[9px] leading-[10px]" style={{ width: `${w}px` }}>
            {children}
        </div>
    );

    const KV = ({ id, label, value, wLabel = 72, className = "" }) => {
        if (!v.has(id)) return null;
        return (
            <div className={`flex items-center ${className}`}>
                {label ? <Label w={wLabel}>{label}</Label> : null}
                <div className="text-[9.5px] leading-[11px] font-medium truncate">
                    {value || ""}
                </div>
            </div>
        );
    };

    const Title = ({ children }) => (
        <div className="font-bold text-[11px] text-center py-[3px] border-b border-black">
            {children}
        </div>
    );

    return (
        <div className="w-full h-full">
            {/* ===== CABEÇALHO ===== */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                    <div className="w-[88px] h-[44px] flex items-center justify-start overflow-hidden">
                        {logo ? (
                            <img src={logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                        ) : null}
                    </div>

                    <div className="leading-[13px] pt-[2px]">
                        {v.has("top_empresa_nome") && (
                            <div className="font-extrabold text-[13px]">{emp.nomeTopo}</div>
                        )}
                        {v.has("top_empresa_end") && (
                            <div className="font-bold text-[10.5px]">{emp.enderecoTopo}</div>
                        )}
                        {v.has("top_empresa_fone") && (
                            <div className="text-[10.5px]">{emp.foneTopo}</div>
                        )}
                    </div>
                </div>

                {/* box MINUTA (menor) */}
                <Box className="w-[380px]">
                    <Title>MINUTA</Title>
                    <div className="px-3 py-2">
                        <div className="flex justify-between items-center">
                            {v.has("minuta_data") && (
                                <div className="flex items-center gap-2">
                                    <div className="font-bold text-[10.5px]">Data Cadastro</div>
                                    <div className="text-[10.5px] font-medium">{min.dataCadastro}</div>
                                </div>
                            )}

                            {v.has("minuta_numero") && (
                                <div className="text-right">
                                    <div className="font-bold text-[16px] leading-[18px]">
                                        Nº&nbsp;&nbsp;
                                        <span className="font-extrabold">{min.numero}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Box>
            </div>

            {/* ===== CLIENTE / REMETENTE ===== */}
            <Box className="mt-2">
                <div className="grid grid-cols-12">
                    {/* CLIENTE */}
                    <div className="col-span-6 px-3 py-2 border-r border-black">
                        <div className="font-bold text-[11px] mb-[2px]">Cliente:</div>
                        <div className="space-y-[1px]">
                            <KV id="cli_cnpj" label="CNPJ" value={cli.cnpj} />
                            <KV id="cli_razao" label="Razão Social" value={cli.razao} />
                            <div className="flex items-center gap-2">
                                {v.has("cli_end") && <KV id="cli_end" label="Endereço" value={cli.endereco} />}
                                {v.has("cli_num") && (
                                    <div className="flex items-center ml-auto">
                                        <Label w={18}>Nº</Label>
                                        <div className="text-[9.5px] leading-[11px] font-medium">{cli.numero}</div>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                {v.has("cli_bairro") && <KV id="cli_bairro" label="Bairro" value={cli.bairro} />}
                                {v.has("cli_ciduf") && (
                                    <div className="text-[9.5px] leading-[11px] font-medium">
                                        {cli.cidade} {cli.uf}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* REMETENTE */}
                    <div className="col-span-6 px-3 py-2">
                        <div className="font-bold text-[11px] mb-[2px] text-left">Remetente:</div>
                        <div className="space-y-[1px]">
                            <KV id="rem_cnpj" label="CNPJ" value={rem.cnpj} />
                            <KV id="rem_razao" label="Razão Social" value={rem.razao} />
                            <div className="flex items-center gap-2">
                                {v.has("rem_end") && <KV id="rem_end" label="Endereço" value={rem.endereco} />}
                                {v.has("rem_num") && (
                                    <div className="flex items-center ml-auto">
                                        <Label w={18}>Nº</Label>
                                        <div className="text-[9.5px] leading-[11px] font-medium">{rem.numero}</div>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                {v.has("rem_bairro") && <KV id="rem_bairro" label="Bairro" value={rem.bairro} />}
                                {v.has("rem_ciduf") && (
                                    <div className="text-[9.5px] leading-[11px] font-medium">
                                        {rem.cidade} {rem.uf}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Box>

            {/* ===== DESTINATÁRIO + REDESPACHO ===== */}
            <Box className="mt-2">
                <div className="grid grid-cols-12">
                    {/* DESTINATÁRIO */}
                    <div className="col-span-7 px-3 py-2 border-r border-black">
                        <div className="font-bold text-[11px] mb-[2px]">Destinatário:</div>
                        <div className="space-y-[1px]">
                            <KV id="dst_cnpj" label="CNPJ" value={dst.cnpj} />
                            <KV id="dst_razao" label="Razão Social" value={dst.razao} />
                            <div className="flex items-center gap-2">
                                {v.has("dst_end") && <KV id="dst_end" label="Endereço" value={dst.endereco} />}
                                {v.has("dst_num") && (
                                    <div className="flex items-center ml-auto">
                                        <Label w={18}>Nº</Label>
                                        <div className="text-[9.5px] leading-[11px] font-medium">{dst.numero}</div>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                {v.has("dst_bairro") && <KV id="dst_bairro" label="Bairro" value={dst.bairro} />}
                                {v.has("dst_ciduf") && (
                                    <div className="text-[9.5px] leading-[11px] font-medium">
                                        {dst.cidade} {dst.uf}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* REDESPACHO */}
                    <div className="col-span-5 px-3 py-2">
                        <div className="font-bold text-[11px] mb-[2px] text-left">REDESPACHO</div>
                        <div className="space-y-[1px]">
                            <KV id="red_nome" label="" value={red.nome} wLabel={0} />
                            <div className="flex items-center gap-2">
                                {v.has("red_end") && (
                                    <div className="text-[9.5px] leading-[11px] font-medium truncate">
                                        {red.endereco}
                                    </div>
                                )}
                                {v.has("red_num") && (
                                    <div className="text-[9.5px] leading-[11px] font-medium ml-auto">
                                        {red.numero}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                {v.has("red_bairro") && (
                                    <div className="text-[9.5px] leading-[11px] font-medium">{red.bairro}</div>
                                )}
                                {v.has("red_ciduf") && (
                                    <div className="text-[9.5px] leading-[11px] font-medium">
                                        {red.cidade} {red.uf}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Box>

            {/* ===== MOTORISTA / VEÍCULO ===== */}
            <Box className="mt-2">
                <div className="px-3 py-[6px] flex items-center gap-6">
                    {v.has("mot_nome") && (
                        <div className="flex items-center">
                            <Label w={62}>Motorista</Label>
                            <div className="text-[9.5px] leading-[11px] font-medium truncate">{mot.nome}</div>
                        </div>
                    )}

                    <div className="ml-auto flex items-center gap-4">
                        {v.has("vei_placa") && (
                            <div className="flex items-center">
                                <Label w={50}>Veículo</Label>
                                <div className="text-[9.5px] leading-[11px] font-medium">{vei.placa}</div>
                            </div>
                        )}
                        {v.has("vei_isento") && (
                            <div className="text-[9.5px] leading-[11px] font-extrabold">{vei.isento}</div>
                        )}
                    </div>
                </div>
            </Box>

            {/* ===== DADOS NOTA FISCAL ===== */}
            <div className="mt-2 px-1">
                <div className="font-bold text-[11px] mb-[2px]">Dados Nota Fiscal</div>

                <div className="grid grid-cols-12 text-[9.5px] gap-y-[1px]">
                    <div className="col-span-2">
                        <div className="font-bold">Nº NF</div>
                        {v.has("nf_nf") && <div className="font-medium">{nf.nf}</div>}
                    </div>
                    <div className="col-span-2">
                        <div className="font-bold">Emissão</div>
                        {v.has("nf_emissao") && <div className="font-medium">{nf.emissao}</div>}
                    </div>
                    <div className="col-span-2">
                        <div className="font-bold">Qtde Vol</div>
                        {v.has("nf_qtde") && <div className="font-medium">{n0(nf.qtdeVol)}</div>}
                    </div>
                    <div className="col-span-2">
                        <div className="font-bold">Peso NF</div>
                        {v.has("nf_peso") && <div className="font-medium">{n2(nf.peso)}</div>}
                    </div>
                    <div className="col-span-2">
                        <div className="font-bold">Cubagem</div>
                        {v.has("nf_cub") && <div className="font-medium">{n2(nf.cubagem)}</div>}
                    </div>
                    <div className="col-span-2">
                        <div className="font-bold">Valor NF</div>
                        {v.has("nf_valor") && <div className="font-medium">{n2(nf.valorNF)}</div>}
                    </div>
                </div>
            </div>

            {/* ===== TABELA VALORES (alinhada e menor) ===== */}
            <Box className="mt-2">
                <div className="grid" style={{ gridTemplateColumns: "repeat(7, 1fr) 170px" }}>
                    {[
                        ["val_cat", "CAT", n2(val.cat)],
                        ["val_desp", "Despacho", n2(val.despacho)],
                        ["val_ped", "Valor Pedágio", n2(val.pedagio)],
                        ["val_fpeso", "Frete Peso", n2(val.fretePeso)],
                        ["val_fvalor", "Frete Valor", n2(val.freteValor)],
                        ["val_coleta", "Coleta / Entrega", n2(val.coletaEntrega)],
                        ["val_outros", "Outros", n2(val.outros)],
                    ].map(([id, title, value], idx) =>
                        v.has(id) ? (
                            <div key={id} className={`px-2 py-[6px] ${idx < 7 ? "border-r border-black" : ""}`}>
                                <div className="font-bold text-[9px] leading-[10px]">{title}</div>
                                <div className="text-right text-[10px] font-medium leading-[12px]">{value}</div>
                            </div>
                        ) : (
                            <div key={id} className={`px-2 py-[6px] ${idx < 7 ? "border-r border-black" : ""}`} />
                        )
                    )}

                    <div className="px-2 py-[6px]">
                        {v.has("val_total") ? (
                            <>
                                <div className="font-bold text-[9px] leading-[10px]">Valor Frete Total</div>
                                <div className="text-right font-extrabold text-[18px] leading-[20px]">
                                    {n2(val.freteTotal)}
                                </div>
                            </>
                        ) : null}
                    </div>
                </div>
            </Box>

            {/* ===== OBS (sempre visível) ===== */}
            <Box className="mt-2">
                {v.has("obs") ? (
                    <div className="px-3 py-2 text-[10px] leading-[12px] min-h-[32px]">
                        <span className="font-bold">Observação:</span>{" "}
                        <span className="font-medium whitespace-pre-wrap break-words">{obs}</span>
                    </div>
                ) : null}
            </Box>

            {/* ===== AVISO + RECEBIMENTO ===== */}
            <Box className="mt-2">
                <div className="grid grid-cols-12">
                    <div className="col-span-5 px-3 py-2 text-[9px] leading-[11px] whitespace-pre-wrap">
                        {v.has("aviso") ? aviso : null}
                    </div>

                    <div className="col-span-7 px-3 py-2">
                        {v.has("rec") ? (
                            <div className="flex items-center gap-3">
                                <div className="font-bold text-[10px]">Data Recebimento:</div>
                                <div className="font-mono text-[10px]">____/____/______</div>

                                <div className="ml-auto flex items-center gap-2">
                                    <div className="font-bold text-[10px]">Ass.:</div>
                                    <div className="border-b border-black w-[200px]" />
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </Box>
        </div>
    );
}
