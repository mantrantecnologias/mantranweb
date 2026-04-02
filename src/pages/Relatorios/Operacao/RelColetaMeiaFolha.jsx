// src/pages/Relatorios/Operacao/RelColetaMeiaFolha.jsx
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DocumentoBase from "../base/DocumentoBase";

/* =========================================================
   Helpers simples (mesmo estilo do RelFatura)
========================================================= */
const onlyDigits = (s) => (s || "").replace(/\D/g, "");

const formatCNPJ = (cnpj) => {
    const d = onlyDigits(cnpj);
    if (d.length !== 14) return cnpj || "";
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(
        8,
        12
    )}-${d.slice(12, 14)}`;
};

const formatCPF = (cpf) => {
    const d = onlyDigits(cpf);
    if (d.length !== 11) return cpf || "";
    return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9, 11)}`;
};

const n2 = (v) =>
    Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 });

function getDefaultTemplateId() {
    return "padrao";
}

/* =========================================================
   MOCK (depois você troca por API)
   Estrutura baseada no seu PDF de Ordem de Coleta.
========================================================= */
function mockColeta(numero = "207439") {
    return {
        templateId: "padrao",
        empresa: {
            razao: "DIFALUX TRANSPORTES LTDA ME",
            cnpj: "04086814000141",
            ie: "121611082117",
            endereco: "RUA LOURDES 169",
            cep: "09015340",
            cidade: "SANTO ANDRE",
            uf: "SP",
            fone: "(11)27541140",
            fax: "(11)27537282",
        },

        ordem: {
            numero,
            dataSolicitacao: "29 de janeiro de 2026",
            coletarEm: "29 de janeiro de 2026",
            horarioColeta: "",
            dataProgramacao: "",
        },

        cliente: {
            nome: "MULTI OPTICA DISTRIBUIDORA LTDA",
            endereco: "R. DA ALEGRIA, 250-262",
            numero: "250",
            complemento: "BRAS",
            cep: "03043010",
            cidade: "SAO PAULO",
            uf: "SP",
            cnpj: "30260871002230",
            ie: "147135367110",
        },

        despachante: {
            nome: "PGL BRASIL LTDA",
            endereco: "AVENIDA DOUTOR LINO DE MORAES LEME",
            numero: "1138",
            complemento: "2 ANDAR",
            cep: "04360000",
            cidade: "SAO PAULO",
            uf: "SP",
            cnpj: "04503292000136",
            ie: "141360527114",
        },

        localColeta: {
            nome: "AEROPORTO INTERNACIONAL DE VIRACOPOS",
            endereco: "ROD. SANTOS DUMONT",
            numero: "66",
            complemento: "PRQUE VIRCOPO",
            cep: "13100000",
            cidade: "CAMPINAS",
            uf: "SP",
            cnpj: "00352294002679",
            ie: "ISENTO",
        },

        destinatario: {
            nome: "LOGEYES ARMAZEM GERAL LTDA",
            endereco: "AVENIDA AMERICO RIBEIRO DOS SANTOS",
            numero: "SN",
            complemento: "",
            cep: "13181715",
            cidade: "SUMARE",
            uf: "SP",
            cnpj: "43823543000111",
            ie: "671512612119",
        },

        carga: {
            quantidade: 4,
            pesoBruto: 591.0,
            especie: "VOLUMES",
            notaFiscal: "00004042",
            valor: 641828.86,
            referencia: "",
            observacao: "MSB0011/26",
            natCarga: "DI",
            nfs: "00004042,00004043,00004044",
            di_dta: "26/0168660-9",
            master: "04521841201",
            house: "1071938685",
            container: "",
            navio: "",
            bl: "",
        },

        motorista: {
            nome: "ISAIAS MIGUEL DA SILVA",
            cnh: "02828934450",
            cpf: "06673080833",
            rg: "175379996",
            placaVeiculo: "CXA6J97",
            placaCarreta: "",
        },

        aviso:
            "Após a conferência física e protocolo de recebimento, a transportadora não se responsabiliza por quaisquer danos, falta e / ou avarias que porventura vierem a ocorrer nas mercadorias entregues.\nPara sua segurança acompanhe o recebimento e conferência.",

        rodape: {
            dataRecebimento: "____/____/______",
            assinatura: "__________________________",
        },
    };
}

/* =========================================================
   PÁGINA
========================================================= */
export default function RelColetaMeiaFolha({ open }) {
    const navigate = useNavigate();
    const location = useLocation();

    const numeroOrdem = location?.state?.numeroOrdem || "207439";
    const templateId = location?.state?.templateId || getDefaultTemplateId();

    const logo = localStorage.getItem("param_logoBg") || "";

    const doc = useMemo(() => {
        const d = mockColeta(numeroOrdem);
        return { ...d, templateId };
    }, [numeroOrdem, templateId]);

    /* =========================================================
       Catálogo de campos (para +Campos do DocumentoBase)
    ========================================================= */
    const fieldsCatalog = useMemo(() => {
        return [
            // Empresa / Cabeçalho
            { id: "empresa_razao", label: "Empresa - Razão", group: "Cabeçalho" },
            { id: "empresa_cnpj_ie", label: "Empresa - CNPJ/IE", group: "Cabeçalho" },
            { id: "empresa_endereco", label: "Empresa - Endereço", group: "Cabeçalho" },
            { id: "empresa_cep_cidade", label: "Empresa - CEP/Cidade/UF", group: "Cabeçalho" },
            { id: "empresa_fone_fax", label: "Empresa - Fone/Fax", group: "Cabeçalho" },

            // Ordem
            { id: "ordem_numero", label: "Ordem - Número", group: "Ordem" },
            { id: "ordem_data_solic", label: "Ordem - Data Solicitação", group: "Ordem" },
            { id: "ordem_coletar_em", label: "Ordem - Coletar em", group: "Ordem" },
            { id: "ordem_horario", label: "Ordem - Horário Coleta", group: "Ordem" },
            { id: "ordem_programacao", label: "Ordem - Data Programação", group: "Ordem" },

            // Partes
            { id: "cliente", label: "Cliente (bloco)", group: "Partes" },
            { id: "despachante", label: "Despachante (bloco)", group: "Partes" },
            { id: "local_coleta", label: "Local da Coleta (bloco)", group: "Partes" },
            { id: "destinatario", label: "Destinatário (bloco)", group: "Partes" },

            // Carga / Motorista
            { id: "carga", label: "Dados da Carga (bloco)", group: "Carga/Motorista" },
            { id: "motorista", label: "Dados do Motorista (bloco)", group: "Carga/Motorista" },

            // Observações / Aviso
            { id: "observacao_nf", label: "Observação + NFs", group: "Rodapé" },
            { id: "aviso", label: "Texto de Aviso", group: "Rodapé" },
            { id: "recebimento_assinatura", label: "Recebimento/Assinatura", group: "Rodapé" },
        ];
    }, []);

    const defaultVisibleFieldIds = useMemo(() => {
        return [
            "empresa_razao",
            "empresa_cnpj_ie",
            "empresa_endereco",
            "empresa_cep_cidade",
            "empresa_fone_fax",

            "ordem_numero",
            "ordem_data_solic",
            "ordem_coletar_em",
            "ordem_horario",
            "ordem_programacao",

            "cliente",
            "despachante",
            "local_coleta",
            "destinatario",

            "carga",
            "motorista",

            "observacao_nf",
            "aviso",
            "recebimento_assinatura",
        ];
    }, []);

    /* =========================================================
       Template para o DocumentoBase
       - templateVariant:
           "padrao"  => meia folha (2 vias na mesma página)
           "inteiro" => folha inteira (1 via)
       - copies:
           por enquanto não multiplica página aqui (DocumentoBase já tem o seletor),
           mas deixei a estrutura pronta pra você evoluir.
    ========================================================= */
    const template = useMemo(() => {
        return {
            fieldsCatalog,
            defaultVisibleFieldIds,
            defaultOptions: {
                templateVariant: "padrao",
                copies: 1,
            },
            pages: [
                {
                    id: "p1",
                    render: ({ data, visibleFieldIds, logo, options }) => (
                        <ColetaTemplateA4
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
            reportKey={`operacao.coleta.meiafolha.${templateId}`}
            title="ORDEM DE COLETA"
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
   TEMPLATE A4 (HTML)
   - meia folha (2 vias) igual ao seu PDF
   - reserva para logo no topo esquerdo
   - mesmas bordas (grid com bordas pretas)
========================================================= */
function ColetaTemplateA4({ data, visibleFieldIds, logo, options }) {
    const v = new Set(visibleFieldIds || []);
    const variant = options?.templateVariant || "padrao"; // padrao | inteiro | espelho (não usamos aqui)

    const renderVia = (key) => (
        <OrdemColetaMeiaFolha
            key={key}
            data={data}
            visibleFieldIds={visibleFieldIds}
            logo={logo}
        />
    );

    return (
        <div className="w-full h-full text-[11px] text-black no-print-page">
            <style>{`
  @media print {
    /* evita “página branca” por overflow mínimo */
    html, body { height: auto !important; }
    .no-print-break { break-inside: avoid; page-break-inside: avoid; }
    .no-print-page { page-break-after: avoid; break-after: avoid; }
  }
`}</style>

            {/* Área útil A4 (margens visuais como no RelFatura) */}
            <div className="absolute left-[40px] top-[38px] right-[40px] bottom-[30px] overflow-hidden">



                {variant === "inteiro" ? (
                    <div className="h-full">
                        <div className="h-full flex items-start">
                            {/* Uma via ocupando mais área (aqui usamos o mesmo componente,
                  mas sem “duplicar” e sem a linha pontilhada) */}
                            <div className="w-full">
                                <OrdemColetaMeiaFolha
                                    data={data}
                                    visibleFieldIds={visibleFieldIds}
                                    logo={logo}
                                    fullHeight
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col">
                        {(() => {
                            // Altura total A4 do DocumentoBase ~ 1123px
                            // Área útil definida por você: top 38 e bottom 30 => 1123 - 38 - 30 = 1055
                            const usableH = 1046;

                            // espaço do corte (linha pontilhada + respiro)
                            const cutH = 20;

                            // altura de cada via (metade exata)
                            const viaH = Math.floor((usableH - cutH) / 2) - 8; // folga anti-quebra no print


                            return (
                                <>
                                    {/* VIA 1 - altura fixa */}
                                    <div style={{ height: `${viaH}px` }} className="overflow-hidden">
                                        {renderVia("via1")}
                                    </div>

                                    {/* CORTE - altura fixa */}
                                    <div style={{ height: `${cutH}px` }} className="flex items-center">
                                        <div className="w-full border-t border-dashed border-gray-500" />
                                    </div>

                                    {/* VIA 2 - altura fixa */}
                                    <div style={{ height: `${viaH}px` }} className="overflow-hidden">
                                        {renderVia("via2")}
                                    </div>
                                </>
                            );
                        })()}
                    </div>

                )}



            </div>
        </div>
    );
}

/* =========================================================
   BLOCO MEIA-FOLHA
   - Layout em “tabela” com bordas
   - Logo com espaço no topo esquerdo
========================================================= */
function OrdemColetaMeiaFolha({ data, visibleFieldIds, logo, fullHeight = false }) {
    const v = new Set(visibleFieldIds || []);
    const emp = data?.empresa || {};
    const ord = data?.ordem || {};
    const cli = data?.cliente || {};
    const des = data?.despachante || {};
    const lc = data?.localColeta || {};
    const dst = data?.destinatario || {};
    const carga = data?.carga || {};
    const mot = data?.motorista || {};
    const aviso = data?.aviso || "";
    const rod = data?.rodape || {};

    return (
        <div className={`w-full h-full flex flex-col min-h-0`}>

            {/* ================= HEADER (2 caixas lado a lado) ================= */}
            <div className="border border-black">
                <div className="grid grid-cols-12">
                    {/* Caixa esquerda: empresa + logo */}
                    <div className="col-span-8 border-r border-black p-2">
                        <div className="flex items-start gap-2">
                            {/* Reserva para LOGO (topo esquerdo) */}
                            <div className="w-[130px] h-[44px] flex items-center justify-start overflow-hidden">
                                {logo ? (
                                    <img
                                        src={logo}
                                        alt="Logo"
                                        className="max-w-full max-h-full object-contain"
                                    />
                                ) : null}
                            </div>

                            <div className="flex-1 min-w-0 leading-[14px]">
                                {v.has("empresa_razao") && (
                                    <div className="font-bold text-[12px] truncate">{emp.razao}</div>
                                )}

                                {v.has("empresa_cnpj_ie") && (
                                    <div className="text-[11px]">
                                        CNPJ: {formatCNPJ(emp.cnpj)}{" "}
                                        <span className="ml-3">Inscr. Estadual: {emp.ie}</span>
                                    </div>
                                )}

                                {v.has("empresa_endereco") && (
                                    <div className="text-[11px]">{emp.endereco}</div>
                                )}

                                {v.has("empresa_cep_cidade") && (
                                    <div className="text-[11px]">
                                        CEP: {emp.cep}{" "}
                                        <span className="ml-3">
                                            {emp.cidade} {emp.uf}
                                        </span>
                                    </div>
                                )}

                                {v.has("empresa_fone_fax") && (
                                    <div className="text-[11px]">
                                        Fone: {emp.fone} <span className="ml-3">Fax: {emp.fax}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Caixa direita: ordem */}
                    <div className="col-span-4 p-2">
                        {v.has("ordem_numero") && (
                            <div className="font-bold text-[12px] text-right">
                                ORDEM DE COLETA Nº {ord.numero}
                            </div>
                        )}

                        <div className="mt-1 text-[11px] leading-[14px]">
                            {v.has("ordem_data_solic") && (
                                <div className="flex justify-between">
                                    <span className="font-semibold">Data Solicitação:</span>
                                    <span>{ord.dataSolicitacao}</span>
                                </div>
                            )}

                            {v.has("ordem_coletar_em") && (
                                <div className="flex justify-between">
                                    <span className="font-semibold">Coletar em:</span>
                                    <span>{ord.coletarEm}</span>
                                </div>
                            )}

                            {v.has("ordem_horario") && (
                                <div className="flex justify-between">
                                    <span className="font-semibold">Horário Coleta:</span>
                                    <span>{ord.horarioColeta}</span>
                                </div>
                            )}

                            {v.has("ordem_programacao") && (
                                <div className="flex justify-between">
                                    <span className="font-semibold">Data Programação:</span>
                                    <span>{ord.dataProgramacao}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= QUADRO PRINCIPAL (tabela) ================= */}
            <div className="border border-black border-t-0">
                <div className="grid grid-cols-12 text-[11px]">
                    {/* Linha 1: Cliente / Despachante */}
                    <CellBlock
                        left
                        title="Cliente"
                        enabled={v.has("cliente")}
                        cols={6}
                        content={[
                            ["Endereço", `${cli.endereco}`, "Nº", cli.numero],
                            ["Complemento", `${cli.complemento}`, "CEP", cli.cep],
                            ["Cidade", `${cli.cidade}`, "Estado", cli.uf],
                            ["CNPJ", formatCNPJ(cli.cnpj), "IE", cli.ie],
                        ]}
                    />
                    <CellBlock
                        title="Despachante"
                        enabled={v.has("despachante")}
                        cols={6}
                        content={[
                            ["Endereço", `${des.endereco}`, "Nº", des.numero],
                            ["Complemento", `${des.complemento}`, "CEP", des.cep],
                            ["Cidade", `${des.cidade}`, "Estado", des.uf],
                            ["CNPJ", formatCNPJ(des.cnpj), "IE", des.ie],
                        ]}
                    />

                    {/* Linha 2: Local Coleta / Destinatário */}
                    <CellBlock
                        left
                        title="Local da Coleta"
                        enabled={v.has("local_coleta")}
                        cols={6}
                        content={[
                            ["Endereço", `${lc.endereco}`, "Nº", lc.numero],
                            ["Complemento", `${lc.complemento}`, "CEP", lc.cep],
                            ["Cidade", `${lc.cidade}`, "Estado", lc.uf],
                            ["CNPJ", formatCNPJ(lc.cnpj), "IE", lc.ie],
                        ]}
                    />
                    <CellBlock
                        title="Destinatário"
                        enabled={v.has("destinatario")}
                        cols={6}
                        content={[
                            ["Endereço", `${dst.endereco}`, "Nº", dst.numero],
                            ["Complemento", `${dst.complemento}`, "CEP", dst.cep],
                            ["Cidade", `${dst.cidade}`, "Estado", dst.uf],
                            ["CNPJ", formatCNPJ(dst.cnpj), "Inscr. Estadual", dst.ie],
                        ]}
                    />

                    {/* Linha 3: Carga / Motorista */}
                    <CellBlock
                        left
                        title="DADOS DA CARGA"
                        enabled={v.has("carga")}
                        cols={6}
                        content={[
                            ["Quantidade", String(carga.quantidade || ""), "DI/DTA", carga.di_dta],
                            ["Peso Bruto", n2(carga.pesoBruto), "Master", carga.master],
                            ["Espécie", carga.especie, "House", carga.house],
                            ["Nota Fiscal", carga.notaFiscal, "Container", carga.container],
                            ["Valor", `R$ ${n2(carga.valor)}`, "Navio", carga.navio],
                            ["Referência", carga.referencia, "BL", carga.bl],
                        ]}
                    />
                    <CellBlock
                        title="DADOS DO MOTORISTA"
                        enabled={v.has("motorista")}
                        cols={6}
                        content={[
                            ["Motorista", mot.nome, "CNH", mot.cnh],
                            ["CPF", formatCPF(mot.cpf), "RG", mot.rg],
                            ["Placa Veículo", mot.placaVeiculo, "Placa Carreta", mot.placaCarreta],
                        ]}
                    />

                    {/* Observação + NFs */}
                    <div className="col-span-12 border-t border-black p-2">
                        {v.has("observacao_nf") ? (
                            <div className="text-[11px] leading-[14px]">
                                <b>Observação:</b>{" "}
                                {carga.observacao ? carga.observacao : ""}{" "}
                                <span className="ml-4">
                                    <b>NFs:</b> {carga.nfs || ""}
                                </span>{" "}
                                <span className="ml-4">
                                    <b>Nat. Carga:</b> {carga.natCarga || ""}
                                </span>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* ================= TEXTO / ASSINATURA ================= */}
            <div className="flex-1 min-h-0 overflow-hidden border border-black border-t-0 p-2 flex flex-col">

                {v.has("aviso") ? (
                    <div
                        className="text-[10.5px] leading-[14px] whitespace-pre-wrap overflow-hidden"
                        style={{ maxHeight: "70px" }}   // 👈 trava o aviso
                    >
                        {aviso}
                    </div>
                ) : null}


                <div
                    className="mt-auto pt-2 text-[11px] flex items-end justify-between gap-4 overflow-hidden"
                    style={{ height: "26px" }}   // trava a altura do rodapé
                >

                    {v.has("recebimento_assinatura") ? (
                        <>
                            <div>
                                <b>Data Recebimento:</b> {rod.dataRecebimento}
                            </div>
                            <div className="flex-1 text-right">
                                <b>Ass.:</b> {rod.assinatura}
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

/* =========================================================
   Bloco de célula (lado esquerdo com borda vertical)
========================================================= */
function CellBlock({ title, enabled, cols = 6, content = [], left = false }) {
    return (
        <div
            className={[
                `col-span-${cols}`,
                left ? "border-r border-black" : "",
                "border-t border-black p-2",
            ].join(" ")}
        >
            {enabled ? (
                <div className="text-[11px] leading-[14px]">
                    <div className="font-semibold mb-1">{title}: <span className="font-bold">{(content?.[0]?.[1] || "").trim()}</span></div>

                    {/* linhas no estilo “Label: valor   Label: valor” */}
                    <div className="grid grid-cols-12 gap-x-2 gap-y-[2px]">
                        {content.map((row, idx) => (
                            <RowKV key={idx} row={row} />
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
}

function RowKV({ row }) {
    const [l1, v1, l2, v2] = row;

    return (
        <>
            {/* label 1 */}
            <div className="col-span-3 text-[10px] text-gray-800">{l1}:</div>
            <div className="col-span-3 font-medium truncate">{v1 || ""}</div>

            {/* label 2 */}
            <div className="col-span-2 text-[10px] text-gray-800">{l2}:</div>
            <div className="col-span-4 font-medium truncate">{v2 || ""}</div>
        </>
    );
}
