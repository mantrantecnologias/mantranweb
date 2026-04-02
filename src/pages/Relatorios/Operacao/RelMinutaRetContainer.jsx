// src/pages/Relatorios/Operacao/RelMinutaRetContainer.jsx
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DocumentoBase from "../base/DocumentoBase";

/* =========================================================
   Helpers
========================================================= */
const onlyDigits = (s) => (s || "").replace(/\D/g, "");

const formatCPF = (cpf) => {
    const d = onlyDigits(cpf);
    if (d.length !== 11) return cpf || "";
    return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

const n2 = (v) =>
    Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 });

function getDefaultTemplateId() {
    return "padrao";
}

/* =========================================================
   MOCK (troca por API / payload vindo da tela depois)
========================================================= */
function mockMinutaRetContainer(numeroMinuta = "122226") {
    return {
        templateId: "padrao",

        empresa: {
            nome: "BELMAR TRANSPORTES",
            cnpj: "08.011.564/0001-31",
            fone: "013 32298800",
        },

        ret: {
            terminal: "TRANSTECWORLD SANTOS",
            endereco:
                "AVENIDA ALBERT SCHWEITZER, 1610 - CEP 11095-520 - ALEMOA - SANTOS",
            textoSolicitacao:
                "Solicitamos gentilmente a liberação do equipamento, conforme dados abaixo:",

            transportadora: "BELMAR TRANSPORTES",
            contato: "MARCELO ZINHANI",

            exportador: "CHOCOLATES GAROTO S.A",
            booking: "76669071",

            tipoEquipamento: "40 REEFER HIGH CUBIC",
            quantidade: 1,
            pesoCargaKg: 13106.83,
            navio: "DALIAN EXPRESS",
            armador: "HAPAG-LLOYD BRASIL AGENCIAMENTO MARITIMO LTDA",

            motorista: "MARCELO ZINHANI",
            celular: "",

            cpf: "13092060822",
            cnh: "02625129359",
            placaCavalo: "BXF0A21",
            placaCarreta: "IBV0F30",
            idNextel: "",

            numeroMinuta,
        },
    };
}

/* =========================================================
   PÁGINA
========================================================= */
export default function RelMinutaRetContainer({ open }) {
    const navigate = useNavigate();
    const location = useLocation();

    // pode vir da tela (state.data) ou cair no mock
    const numeroMinuta =
        location?.state?.numeroMinuta ||
        location?.state?.data?.ret?.numeroMinuta ||
        "122226";

    const templateId = location?.state?.templateId || getDefaultTemplateId();
    const logo = localStorage.getItem("param_logoBg") || "";

    const doc = useMemo(() => {
        if (location?.state?.data) return { ...location.state.data, templateId };
        const d = mockMinutaRetContainer(numeroMinuta);
        return { ...d, templateId };
    }, [location, numeroMinuta, templateId]);

    /* =========================================================
       +Campos (catálogo) - por CAMPO (não por zona)
    ========================================================= */
    const fieldsCatalog = useMemo(
        () => [
            // topo
            { id: "logo", label: "Logo (Topo Esquerda)", group: "Topo" },
            { id: "titulo", label: "Título do Documento", group: "Topo" },
            { id: "cnpj_topo", label: "CNPJ (Topo)", group: "Topo" },
            { id: "num_minuta", label: "Nº Minuta (Topo Direita)", group: "Topo" },
            { id: "via_label_topo", label: "VIA (Topo Direita)", group: "Topo" },

            // zona 1
            { id: "terminal", label: "Terminal", group: "Zona 1 - Terminal" },
            { id: "endereco", label: "Endereço", group: "Zona 1 - Terminal" },

            // texto
            { id: "texto_solic", label: "Texto Solicitação", group: "Texto" },

            // zona 2
            { id: "transportadora", label: "Transportadora", group: "Zona 2 - Dados" },
            { id: "contato", label: "Contato", group: "Zona 2 - Dados" },
            { id: "exportador", label: "Exportador", group: "Zona 2 - Dados" },

            { id: "booking", label: "Booking", group: "Zona 2 - Dados" },
            { id: "tipo", label: "Tipo de Equipamento", group: "Zona 2 - Dados" },

            { id: "quantidade", label: "Quantidade", group: "Zona 2 - Dados" },
            { id: "peso", label: "Peso Carga (KG)", group: "Zona 2 - Dados" },
            { id: "navio", label: "Navio", group: "Zona 2 - Dados" },

            { id: "armador", label: "Armador", group: "Zona 2 - Dados" },

            // zona 3 motorista
            {
                id: "motorista",
                label: "Motorista",
                group: "Zona 3 - Motorista/Veículo",
            },
            {
                id: "celular",
                label: "Celular",
                group: "Zona 3 - Motorista/Veículo",
            },
            { id: "cpf", label: "CPF", group: "Zona 3 - Motorista/Veículo" },
            { id: "cnh", label: "CNH", group: "Zona 3 - Motorista/Veículo" },
            {
                id: "placa_cavalo",
                label: "Placa Cavalo",
                group: "Zona 3 - Motorista/Veículo",
            },
            {
                id: "placa_carreta",
                label: "Placa Carreta",
                group: "Zona 3 - Motorista/Veículo",
            },
            {
                id: "id_nextel",
                label: "ID Nextel",
                group: "Zona 3 - Motorista/Veículo",
            },

            // zona 4 recebimento
            {
                id: "recebimento",
                label: "Recebimento (Data/Ass.)",
                group: "Zona 4 - Recebimento",
            },
        ],
        []
    );

    // tudo marcado por padrão (você remove campo a campo)
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
                        <RetContainerTemplateA4
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
            reportKey={`operacao.minuta_retirada_container.${templateId}`}
            title="MINUTA DE RETIRADA DE CONTAINER"
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
function RetContainerTemplateA4({ data, visibleFieldIds, logo }) {
    const renderVia = (key, viaText) => (
        <RetContainerVia
            key={key}
            data={data}
            visibleFieldIds={visibleFieldIds}
            logo={logo}
            viaText={viaText}
        />
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
                                {renderVia("via1", "VIA 1: VIA TRANSPORTADORA")}
                            </div>

                            <div style={{ height: `${cutH}px` }} className="flex items-center">
                                <div className="w-full border-t border-dashed border-gray-400" />
                            </div>

                            <div style={{ height: `${viaH}px` }} className="overflow-hidden">
                                {renderVia("via2", "VIA 2: VIA TERMINAL")}
                            </div>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
}

/* =========================================================
   VIA
========================================================= */
function RetContainerVia({ data, visibleFieldIds, logo, viaText }) {
    const v = new Set(visibleFieldIds || []);

    const emp = data?.empresa || {};
    const ret = data?.ret || {};

    const OuterBox = ({ children, className = "" }) => (
        <div className={`border border-black rounded-[18px] ${className}`}>
            {children}
        </div>
    );

    const InnerBox = ({ children, className = "" }) => (
        <div className={`border border-black rounded-[12px] ${className}`}>
            {children}
        </div>
    );

    const KV = ({
        id,
        label,
        value,
        labelClass = "",
        valueClass = "",
        right = false,
    }) => {
        if (!v.has(id)) return null;
        return (
            <div className="grid grid-cols-12 gap-2 items-center">
                <div className={`col-span-3 font-bold text-[11px] ${labelClass}`}>
                    {label}
                </div>
                <div
                    className={`col-span-9 text-[11px] font-medium ${right ? "text-right" : ""
                        } ${valueClass}`}
                >
                    {value || ""}
                </div>
            </div>
        );
    };

    // 2 colunas dentro de uma zona
    const KV2 = ({
        left,
        right,
        className = "",
        leftSpan = 6,
        rightSpan = 6,
    }) => (
        <div className={`grid grid-cols-12 gap-3 ${className}`}>
            <div className={`col-span-${leftSpan}`}>{left}</div>
            <div className={`col-span-${rightSpan}`}>{right}</div>
        </div>
    );

    const renderLogo = () => {
        if (!v.has("logo")) return null;
        // espaço do logo sempre existe (com ou sem imagem)
        // se tiver logo, mostra; se não, mantém um "slot" vazio.
        const has = !!logo;
        return (
            <div className="w-[130px] h-[44px] flex items-center">
                {has ? (
                    <img
                        src={logo}
                        alt="Logo"
                        className="max-h-[44px] max-w-[130px] object-contain"
                    />
                ) : (
                    <div className="w-[130px] h-[44px]" />
                )}
            </div>
        );
    };

    return (
        <div className="w-full h-full">
            <OuterBox className="h-full">
                {/* =========================
            TOPO
        ========================== */}
                <div className="px-4 pt-3">
                    <div className="grid grid-cols-12 items-start gap-2">
                        <div className="col-span-3">{renderLogo()}</div>

                        <div className="col-span-6 text-center">
                            {v.has("titulo") ? (
                                <div className="font-extrabold text-[14px]">
                                    MINUTA DE RETIRADA DE CONTAINER
                                </div>
                            ) : null}
                        </div>

                        <div className="col-span-3 text-right">
                            {v.has("num_minuta") ? (
                                <div className="leading-tight">
                                    <div className="text-[11px] font-bold">Nº Minuta:</div>
                                    <div className="text-[18px] font-extrabold">
                                        {ret.numeroMinuta || ""}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    <div className="mt-1 grid grid-cols-12 items-center gap-2">
                        <div className="col-span-6">
                            {v.has("cnpj_topo") ? (
                                <div className="text-[11px] font-bold">
                                    CNPJ: {emp.cnpj || ""}
                                </div>
                            ) : null}
                        </div>

                        <div className="col-span-6 text-right">
                            {v.has("via_label_topo") ? (
                                <div className="text-[11px] font-bold">{viaText}</div>
                            ) : null}
                        </div>
                    </div>
                </div>

                {/* linha separadora do topo */}
                <div className="mt-2 border-t border-black" />

                {/* =========================
            CONTEÚDO
        ========================== */}
                <div className="px-4 pt-3 pb-3">
                    {/* ZONA 1 - Terminal/Endereço */}
                    <InnerBox className="p-3">
                        <KV2
                            left={
                                <KV
                                    id="terminal"
                                    label="Terminal :"
                                    value={ret.terminal}
                                    valueClass="truncate"
                                />
                            }
                            right={
                                <KV
                                    id="endereco"
                                    label="Endereço:"
                                    value={ret.endereco}
                                    valueClass="truncate"
                                />
                            }
                        />
                    </InnerBox>

                    {/* Texto solicitação */}
                    {v.has("texto_solic") ? (
                        <div className="mt-2 text-[11px] font-medium">
                            {ret.textoSolicitacao || ""}
                        </div>
                    ) : null}

                    {/* ZONA 2 - Dados principais */}
                    <InnerBox className="p-3 mt-2">
                        {/* Transportadora / Contato */}
                        <KV2
                            left={
                                <KV
                                    id="transportadora"
                                    label="Transportadora:"
                                    value={ret.transportadora}
                                />
                            }
                            right={<KV id="contato" label="Contato:" value={ret.contato} />}
                        />

                        {/* Exportador */}
                        <div className="mt-1">
                            <KV id="exportador" label="Exportador:" value={ret.exportador} />
                        </div>

                        {/* Booking / Tipo */}
                        <div className="mt-1">
                            <KV2
                                left={<KV id="booking" label="Booking:" value={ret.booking} />}
                                right={
                                    <KV
                                        id="tipo"
                                        label="Tipo:"
                                        value={ret.tipoEquipamento}
                                    />
                                }
                            />
                        </div>

                        {/* Quantidade / Peso / Navio */}
                        <div className="mt-1 grid grid-cols-12 gap-3">
                            <div className="col-span-4">
                                <KV
                                    id="quantidade"
                                    label="Quantidade:"
                                    value={ret.quantidade !== undefined ? String(ret.quantidade) : ""}
                                />
                            </div>
                            <div className="col-span-4">
                                <KV
                                    id="peso"
                                    label="Peso:"
                                    value={
                                        ret.pesoCargaKg !== undefined && ret.pesoCargaKg !== ""
                                            ? n2(ret.pesoCargaKg)
                                            : ""
                                    }
                                />
                            </div>
                            <div className="col-span-4">
                                <KV id="navio" label="Navio:" value={ret.navio} />
                            </div>
                        </div>

                        {/* Armador */}
                        <div className="mt-1">
                            <KV id="armador" label="Armador:" value={ret.armador} />
                        </div>
                    </InnerBox>

                    {/* ZONA 3 - Motorista */}
                    <InnerBox className="p-3 mt-2">
                        {/* Motorista / Celular */}
                        <KV2
                            left={
                                <KV id="motorista" label="Motorista:" value={ret.motorista} />
                            }
                            right={<KV id="celular" label="Celular:" value={ret.celular} />}
                        />

                        {/* CPF / Placa Cavalo */}
                        <div className="mt-1">
                            <KV2
                                left={<KV id="cpf" label="CPF:" value={formatCPF(ret.cpf)} />}
                                right={
                                    <KV
                                        id="placa_cavalo"
                                        label="Placa Cavalo:"
                                        value={ret.placaCavalo}
                                    />
                                }
                            />
                        </div>

                        {/* CNH / Placa Carreta */}
                        <div className="mt-1">
                            <KV2
                                left={<KV id="cnh" label="CNH:" value={ret.cnh} />}
                                right={
                                    <KV
                                        id="placa_carreta"
                                        label="Placa Carreta:"
                                        value={ret.placaCarreta}
                                    />
                                }
                            />
                        </div>

                        {/* ID Nextel */}
                        {v.has("id_nextel") ? (
                            <div className="mt-1">
                                <KV id="id_nextel" label="ID Nextel:" value={ret.idNextel} />
                            </div>
                        ) : null}
                    </InnerBox>

                    {/* ZONA 4 - Recebimento (ÚLTIMO BLOCO DA VIA) */}
                    {v.has("recebimento") ? (
                        <InnerBox className="p-3 mt-2">
                            <div className="flex items-center gap-4 text-[11px]">
                                <div className="font-bold">Data Recebimento:</div>
                                <div className="font-mono">_____/_____/______</div>

                                <div className="ml-auto flex items-center gap-2">
                                    <div className="font-bold">Ass.:</div>
                                    <div className="border-b border-black w-[320px]" />
                                </div>
                            </div>
                        </InnerBox>
                    ) : null}

                    {/* NÃO exibir rodapé de empresa aqui (como você pediu) */}
                </div>
            </OuterBox>
        </div>
    );
}
