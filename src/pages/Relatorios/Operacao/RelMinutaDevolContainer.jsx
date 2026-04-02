// src/pages/Relatorios/Operacao/RelMinutaDevolContainer.jsx
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DocumentoBase from "../base/DocumentoBase";

/* =========================================================
   Helpers
========================================================= */
const onlyDigits = (s) => (s || "").replace(/\D/g, "");
const n2 = (v) =>
    Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 });

function getDefaultTemplateId() {
    return "padrao";
}

/* =========================================================
   MOCK (troca por API / payload vindo da tela depois)
========================================================= */
function mockMinutaDevolContainer(numeroMinuta = "122226") {
    return {
        templateId: "padrao",
        empresa: {
            nome: "MANTRAN TRANSPORTES",
            cnpj: "10.545.575/0001-31",
            fone: "013 32298800",
        },
        devol: {
            terminal: "DP WORLD - EMBRAPORT EMPRESA BRAS. TERMINAIS PORT",
            endereco: "ESTRADA PARTICULAR CODESP, S/N // BAIRRO: ILHA BARNABE",
            textoSolicitacao:
                "Solicitamos gentilmente a recepção do equipamento, conforme dados abaixo:",
            transportadora: "BELMAR TRANSPORTES",
            contato: "MARCELO ZINHANI",
            importador: "CHOCOLATES GAROTO S.A",
            container: "HLXU8804394",
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
export default function RelMinutaDevolContainer({ open }) {
    const navigate = useNavigate();
    const location = useLocation();

    const numeroMinuta =
        location?.state?.numeroMinuta ||
        location?.state?.data?.devol?.numeroMinuta ||
        location?.state?.data?.devol?.numeroConhecimento || // compat antigo
        "122226";

    const templateId = location?.state?.templateId || getDefaultTemplateId();
    const logo = localStorage.getItem("param_logoBg") || "";

    const doc = useMemo(() => {
        if (location?.state?.data) {
            const incoming = { ...location.state.data, templateId };
            const devol = incoming?.devol || {};
            if (!devol.numeroMinuta && devol.numeroConhecimento) {
                incoming.devol = { ...devol, numeroMinuta: devol.numeroConhecimento };
            }
            return incoming;
        }
        const d = mockMinutaDevolContainer(numeroMinuta);
        return { ...d, templateId };
    }, [location, numeroMinuta, templateId]);

    /* =========================================================
       +Campos (catálogo) - AGORA É POR CAMPO (não por zona)
    ========================================================= */
    const fieldsCatalog = useMemo(
        () => [
            // TOPO
            { id: "logo", label: "Logo", group: "Topo" },
            { id: "titulo", label: "Título", group: "Topo" },
            { id: "cnpj_topo", label: "CNPJ (Topo)", group: "Topo" },
            { id: "via_topo", label: "Via (Topo)", group: "Topo" },
            { id: "num_minuta", label: "Nº Minuta", group: "Topo" },

            // ZONA 1
            { id: "terminal", label: "Terminal", group: "Zona 1" },
            { id: "endereco", label: "Endereço", group: "Zona 1" },
            { id: "texto_solic", label: "Texto Solicitação", group: "Entre Zonas" },

            // ZONA 2
            { id: "transportadora", label: "Transportadora", group: "Zona 2" },
            { id: "contato", label: "Contato", group: "Zona 2" },
            { id: "importador", label: "Importador", group: "Zona 2" },
            { id: "container", label: "Container", group: "Zona 2" },
            { id: "tipo", label: "Tipo Equipamento", group: "Zona 2" },
            { id: "quantidade", label: "Quantidade", group: "Zona 2" },
            { id: "peso", label: "Peso Carga (KG)", group: "Zona 2" },
            { id: "navio", label: "Navio", group: "Zona 2" },
            { id: "armador", label: "Armador", group: "Zona 2" },

            // ZONA 3
            { id: "motorista", label: "Motorista", group: "Zona 3" },
            { id: "celular", label: "Celular", group: "Zona 3" },
            { id: "cpf", label: "CPF", group: "Zona 3" },
            { id: "placa_cavalo", label: "Placa Cavalo", group: "Zona 3" },
            { id: "cnh", label: "CNH", group: "Zona 3" },
            { id: "placa_carreta", label: "Placa Carreta", group: "Zona 3" },
            { id: "id_nextel", label: "ID Nextel", group: "Zona 3" },

            // ZONA 4
            { id: "recebimento", label: "Data Recebimento / Ass.", group: "Zona 4" },
        ],
        []
    );

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
                    render: ({ data, visibleFieldIds, logo }) => (
                        <DevolContainerTemplateA4
                            data={data}
                            visibleFieldIds={visibleFieldIds}
                            logo={logo}
                        />
                    ),
                },
            ],
        };
    }, [fieldsCatalog, defaultVisibleFieldIds]);

    return (
        <DocumentoBase
            sidebarOpen={open}
            reportKey={`operacao.minuta_devol_container.${templateId}`}
            title="MINUTA DE DEVOLUÇÃO DE CONTAINER"
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
function DevolContainerTemplateA4({ data, visibleFieldIds, logo }) {
    const renderVia = (key, viaText) => (
        <DevolContainerVia
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
   VIA (com 4 caixas internas e visibilidade POR CAMPO)
========================================================= */
function DevolContainerVia({ data, visibleFieldIds, logo, viaText }) {
    const v = new Set(visibleFieldIds || []);
    const emp = data?.empresa || {};
    const devol = data?.devol || {};
    const cpfRaw = onlyDigits(devol.cpf);

    const hasAny = (ids) => ids.some((id) => v.has(id));

    const Outer = ({ children }) => (
        <div className="border border-black rounded-[14px] h-full overflow-hidden">
            {children}
        </div>
    );

    const Box = ({ children }) => (
        <div className="border border-black rounded-[10px] px-4 py-3">
            {children}
        </div>
    );

    const TwoCol = ({
        idA,
        leftLabel,
        leftValue,
        idB,
        rightLabel,
        rightValue,
    }) => {
        const showLeft = v.has(idA);
        const showRight = v.has(idB);
        if (!showLeft && !showRight) return null;

        return (
            <div className="grid grid-cols-12 gap-3 text-[11px] leading-[16px]">
                <div className="col-span-6 flex gap-2">
                    <span className="font-bold min-w-[120px]">{leftLabel}</span>
                    <span className="flex-1">{showLeft ? leftValue || "" : ""}</span>
                </div>
                <div className="col-span-6 flex gap-2">
                    <span className="font-bold min-w-[120px]">{rightLabel}</span>
                    <span className="flex-1">{showRight ? rightValue || "" : ""}</span>
                </div>
            </div>
        );
    };

    const OneLine = ({ id, label, value }) => {
        if (!v.has(id)) return null;
        return (
            <div className="flex gap-2 text-[11px] leading-[16px]">
                <span className="font-bold min-w-[120px]">{label}</span>
                <span className="flex-1">{value || ""}</span>
            </div>
        );
    };

    const Header = () => (
        <div className="px-4 py-3 border-b border-black">
            <div className="grid grid-cols-12 items-center">
                {/* Logo espaço (esquerda) */}
                <div className="col-span-3 flex items-center justify-start">
                    <div className="w-[92px] h-[42px] border border-transparent">
                        {v.has("logo") && logo ? (
                            <img
                                src={logo}
                                alt="logo"
                                className="max-h-[42px] max-w-[92px] object-contain"
                            />
                        ) : null}
                    </div>
                </div>

                {/* Título (centro) */}
                <div className="col-span-6 text-center font-extrabold text-[14px]">
                    {v.has("titulo") ? "MINUTA DE DEVOLUÇÃO DE CONTAINER" : ""}
                </div>

                {/* Nº Minuta (direita) */}
                <div className="col-span-3 text-right">
                    {v.has("num_minuta") ? (
                        <div className="text-[11px] font-bold">
                            Nº Minuta:
                            <div className="text-[16px] font-extrabold leading-[16px]">
                                {devol.numeroMinuta || ""}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* CNPJ (esq) + VIA (dir) */}
            <div className="mt-2 flex items-center justify-between text-[11px]">
                {v.has("cnpj_topo") ? (
                    <div className="font-bold">CNPJ: {emp.cnpj || ""}</div>
                ) : (
                    <div />
                )}

                {v.has("via_topo") ? (
                    <div className="font-bold">{viaText}</div>
                ) : null}
            </div>
        </div>
    );

    // ids por zona (para decidir se a caixa aparece)
    const Z1 = ["terminal", "endereco"];
    const Z2 = [
        "transportadora",
        "contato",
        "importador",
        "container",
        "tipo",
        "quantidade",
        "peso",
        "navio",
        "armador",
    ];
    const Z3 = [
        "motorista",
        "celular",
        "cpf",
        "placa_cavalo",
        "cnh",
        "placa_carreta",
        "id_nextel",
    ];
    const Z4 = ["recebimento"];

    return (
        <div className="w-full h-full">
            <Outer>
                <Header />

                <div className="px-5 pt-4 space-y-3">
                    {/* Caixa 1 (Zona 1) */}
                    {hasAny(Z1) ? (
                        <Box>
                            <TwoCol
                                idA="terminal"
                                leftLabel="Terminal :"
                                leftValue={devol.terminal}
                                idB="endereco"
                                rightLabel="Endereço:"
                                rightValue={devol.endereco}
                            />
                        </Box>
                    ) : null}

                    {/* Texto solicitação (fora das caixas) */}
                    {v.has("texto_solic") ? (
                        <div className="text-[11px] leading-[16px]">
                            {devol.textoSolicitacao || ""}
                        </div>
                    ) : null}

                    {/* Caixa 2 (Zona 2) */}
                    {hasAny(Z2) ? (
                        <Box>
                            <TwoCol
                                idA="transportadora"
                                leftLabel="Transportadora:"
                                leftValue={devol.transportadora}
                                idB="contato"
                                rightLabel="Contato:"
                                rightValue={devol.contato}
                            />

                            <OneLine id="importador" label="Importador:" value={devol.importador} />

                            <TwoCol
                                idA="container"
                                leftLabel="Container:"
                                leftValue={devol.container}
                                idB="tipo"
                                rightLabel="Tipo de Equipamento:"
                                rightValue={devol.tipoEquipamento}
                            />

                            {/* Quantidade - Peso - Navio (mesma linha) */}
                            {hasAny(["quantidade", "peso", "navio"]) ? (
                                <div className="grid grid-cols-12 gap-3 text-[11px] leading-[16px] mt-1">
                                    <div className="col-span-4 flex gap-2">
                                        <span className="font-bold min-w-[95px]">Quantidade:</span>
                                        <span>{v.has("quantidade") ? devol.quantidade ?? "" : ""}</span>
                                    </div>

                                    <div className="col-span-4 flex gap-2 justify-center">
                                        <span className="font-bold">Peso Carga: KG</span>
                                        <span>
                                            {v.has("peso")
                                                ? devol.pesoCargaKg !== undefined
                                                    ? n2(devol.pesoCargaKg)
                                                    : ""
                                                : ""}
                                        </span>
                                    </div>

                                    <div className="col-span-4 flex gap-2 justify-end">
                                        <span className="font-bold">Navio:</span>
                                        <span>{v.has("navio") ? devol.navio || "" : ""}</span>
                                    </div>
                                </div>
                            ) : null}

                            <OneLine id="armador" label="Armador:" value={devol.armador} />
                        </Box>
                    ) : null}

                    {/* Caixa 3 (Zona Motorista) */}
                    {hasAny(Z3) ? (
                        <Box>
                            <TwoCol
                                idA="motorista"
                                leftLabel="Motorista:"
                                leftValue={devol.motorista}
                                idB="celular"
                                rightLabel="Celular:"
                                rightValue={devol.celular || ""}
                            />

                            <TwoCol
                                idA="cpf"
                                leftLabel="CPF:"
                                leftValue={v.has("cpf") ? (cpfRaw || devol.cpf || "") : ""}
                                idB="placa_cavalo"
                                rightLabel="Placa Cavalo:"
                                rightValue={devol.placaCavalo || ""}
                            />

                            <TwoCol
                                idA="cnh"
                                leftLabel="CNH:"
                                leftValue={devol.cnh || ""}
                                idB="placa_carreta"
                                rightLabel="Placa Carreta:"
                                rightValue={devol.placaCarreta || ""}
                            />

                            <OneLine id="id_nextel" label="ID Nextel:" value={devol.idNextel} />
                        </Box>
                    ) : null}

                    {/* Caixa 4 (Recebimento) - ÚLTIMA COISA DA VIA */}
                    {hasAny(Z4) ? (
                        <Box>
                            <div className="flex items-center justify-between text-[11px] leading-[16px]">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold">Data Recebimento:</span>
                                    <span className="font-mono">_____/_____/______</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold">Ass.:</span>
                                    <span className="font-mono">
                                        __________________________________________________
                                    </span>
                                </div>
                            </div>
                        </Box>
                    ) : null}
                </div>
            </Outer>
        </div>
    );
}
