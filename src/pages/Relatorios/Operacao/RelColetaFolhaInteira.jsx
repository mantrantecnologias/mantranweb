// src/pages/Relatorios/Operacao/RelColetaFolhaInteira.jsx
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DocumentoBase from "../base/DocumentoBase";

/* =========================================================
   Helpers
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

function getDefaultTemplateId() {
    return "inteiro";
}

/* =========================================================
   MOCK (troca por API depois)
========================================================= */
function mockColeta(numero = "006913") {
    return {
        templateId: "inteiro",

        empresa: {
            razao: "MC TRANSP ROD CARGA LOG LTDA",
            endereco: "EST DA SERVIDAO",
            municipio: "SUMARE",
            cep: "13177427",
            uf: "SP",
            fone: "(19)38642603",
            fax: "",
            cgc: "19326067000149",
            ie: "671169290114",
        },

        ordem: {
            numero,
            dataSolicitacao: "28/01/2026",
            horaSolicitacao: "18:12",
            solicitacaoCliente: "",
            coletarEm: "29/01/2026",
            ateAs: "12:00",
        },

        remetente: {
            nome: "3M DO BRASIL LTDA - RIB PRETO",
            endereco: "RODOVIA RIBEIRAO PRETO ARARAQUARA KM 07",
            cidade: "RIBEIRAO PRETO",
            contato: "",
            cgcCpf: "45985371003395",
            bairro: "B PAULISTA",
            estado: "SP",
            osn: "",
            cotacao: "",
            observacao: "LACRE VAZIO 015160   LACRE MC 015877   PE143/2026-B",
        },

        destinatario: {
            nome: "EMBRAPORT - EMPRESA BRASILEIRA DE TERM. P",
            cgcCpf: "02805610000279",
            endereco: "ESTRADA PARTICULAR CODESP",
            numero: "",
            bairro: "ILHA BARNABE",
            municipio: "GUARUJA",
            estado: "SP",
        },

        motorista: {
            veiculo: "CAVALO",
            placa: "GIX5B01",
            carretaPlaca: "CUH0C18",

            nome: "SEBASTIAO JOAQUIM DOMINGUES",
            cpf: "09697715840",
            cnh: "01788815476",
            categoria: "E",

            pesoInformado: "0,00",
            volInformado: "0",
            rg: "20451116",
            produto: "CONTAINERS",
        },

        aduaneiras: {
            container: "HASU4867188",
            tipoContainer: "40 HIGH CUBIC",
            navio: "MALIAKOS",
            embarque: "DP WORLD",
            retirada: "ARIVALDO APARECIDO MORAES & CIA LTDA",

            di: "",
            ref: "PE143/2026-B",
            reserva: "264123410",

            lacreComplementar: "",
            master: "",
            desembarque: "CAVALO",
            entrega: "DP WORLD",
            depContainer: "",
            lacre: "",
            house: "ML-BR1577495",
        },

        tracking: {
            dataChegadaCliente: "",
            autorizacaoCarregamento: "",
            inicioCarregamento: "",
            fimCarregamento: "",
            dataSaidaCliente: "",
        },
    };
}

/* =========================================================
   PÁGINA
========================================================= */
export default function RelColetaFolhaInteira({ open }) {
    const navigate = useNavigate();
    const location = useLocation();

    const numeroOrdem = location?.state?.numeroOrdem || "006913";
    const templateId = location?.state?.templateId || getDefaultTemplateId();
    const logo = localStorage.getItem("param_logoBg") || "";

    const doc = useMemo(() => {
        const d = mockColeta(numeroOrdem);
        return { ...d, templateId };
    }, [numeroOrdem, templateId]);

    /* =========================================================
       +Campos (catálogo por zona)
  ========================================================= */
    const fieldsCatalog = useMemo(() => {
        return [
            // ===== TRANSPORTADORA
            { id: "emp_razao", label: "Empresa - Razão", group: "Transportadora" },
            { id: "emp_endereco", label: "Empresa - Endereço", group: "Transportadora" },
            { id: "emp_municipio", label: "Empresa - Município", group: "Transportadora" },
            { id: "emp_cep", label: "Empresa - CEP", group: "Transportadora" },
            { id: "emp_uf", label: "Empresa - UF", group: "Transportadora" },
            { id: "emp_fone", label: "Empresa - Fone", group: "Transportadora" },
            { id: "emp_fax", label: "Empresa - Fax", group: "Transportadora" },
            { id: "emp_cgc", label: "Empresa - CGC", group: "Transportadora" },
            { id: "emp_ie", label: "Empresa - IE", group: "Transportadora" },

            { id: "ord_data_hora", label: "Ordem - Data/Hora Solicitação", group: "Transportadora" },
            { id: "ord_solic_cliente", label: "Ordem - Nº Solicitação Cliente", group: "Transportadora" },
            { id: "ord_coletar", label: "Ordem - Coletar em / Até às", group: "Transportadora" },

            // ===== REMETENTE
            { id: "rem_nome", label: "Remetente - Nome", group: "Remetente" },
            { id: "rem_endereco", label: "Remetente - Endereço", group: "Remetente" },
            { id: "rem_cidade", label: "Remetente - Cidade", group: "Remetente" },
            { id: "rem_osn", label: "Remetente - Nº OSN", group: "Remetente" },
            { id: "rem_bairro", label: "Remetente - Bairro", group: "Remetente" },
            { id: "rem_contato", label: "Remetente - Contato", group: "Remetente" },
            { id: "rem_cotacao", label: "Remetente - Nº Cotação", group: "Remetente" },
            { id: "rem_estado", label: "Remetente - Estado", group: "Remetente" },
            { id: "rem_obs", label: "Remetente - Observação", group: "Remetente" },

            // ===== DESTINATÁRIO
            { id: "dst_nome", label: "Destinatário - Nome", group: "Destinatário" },
            { id: "dst_cgc", label: "Destinatário - CGC/CPF", group: "Destinatário" },
            { id: "dst_endereco", label: "Destinatário - Endereço", group: "Destinatário" },
            { id: "dst_numero", label: "Destinatário - Nº", group: "Destinatário" },
            { id: "dst_bairro", label: "Destinatário - Bairro", group: "Destinatário" },
            { id: "dst_municipio", label: "Destinatário - Município", group: "Destinatário" },
            { id: "dst_estado", label: "Destinatário - Estado", group: "Destinatário" },

            // ===== MOTORISTA/VEÍCULO
            { id: "mot_veiculo", label: "Motorista - Veículo", group: "Motorista/Veículo" },
            { id: "mot_placa", label: "Motorista - Placa", group: "Motorista/Veículo" },
            { id: "mot_carreta", label: "Motorista - Carreta Placa", group: "Motorista/Veículo" },

            { id: "mot_nome", label: "Motorista - Nome", group: "Motorista/Veículo" },
            { id: "mot_cpf", label: "Motorista - CPF", group: "Motorista/Veículo" },
            { id: "mot_cnh", label: "Motorista - CNH", group: "Motorista/Veículo" },
            { id: "mot_categoria", label: "Motorista - Categoria", group: "Motorista/Veículo" },

            { id: "mot_peso", label: "Motorista - Peso Informado", group: "Motorista/Veículo" },
            { id: "mot_vol", label: "Motorista - Vol Informado", group: "Motorista/Veículo" },
            { id: "mot_rg", label: "Motorista - RG", group: "Motorista/Veículo" },
            { id: "mot_produto", label: "Motorista - Produto", group: "Motorista/Veículo" },

            // ===== ADUANEIRAS
            { id: "adu_container", label: "Aduaneiras - Nº Container", group: "Aduaneiras" },
            { id: "adu_tipo_container", label: "Aduaneiras - Tipo Container", group: "Aduaneiras" },
            { id: "adu_navio", label: "Aduaneiras - Nome Navio", group: "Aduaneiras" },
            { id: "adu_embarque", label: "Aduaneiras - Embarque", group: "Aduaneiras" },
            { id: "adu_retirada", label: "Aduaneiras - Retirada", group: "Aduaneiras" },
            { id: "adu_di", label: "Aduaneiras - Nº DI", group: "Aduaneiras" },
            { id: "adu_ref", label: "Aduaneiras - Nº Ref.", group: "Aduaneiras" },
            { id: "adu_reserva", label: "Aduaneiras - Nº Reserva", group: "Aduaneiras" },
            { id: "adu_lacre_comp", label: "Aduaneiras - Lacre Complementar", group: "Aduaneiras" },
            { id: "adu_master", label: "Aduaneiras - Nº Master", group: "Aduaneiras" },
            { id: "adu_desembarque", label: "Aduaneiras - Desembarque", group: "Aduaneiras" },
            { id: "adu_entrega", label: "Aduaneiras - Entrega", group: "Aduaneiras" },
            { id: "adu_dep_container", label: "Aduaneiras - Dep. Container", group: "Aduaneiras" },
            { id: "adu_lacre", label: "Aduaneiras - Nº Lacre", group: "Aduaneiras" },
            { id: "adu_house", label: "Aduaneiras - Nº House", group: "Aduaneiras" },

            // ===== TRACKING
            { id: "trk_chegada", label: "Tracking - Data Chegada Cliente", group: "Tracking" },
            { id: "trk_aut", label: "Tracking - Autorização Carregamento", group: "Tracking" },
            { id: "trk_inicio", label: "Tracking - Início Carregamento", group: "Tracking" },
            { id: "trk_fim", label: "Tracking - Fim do Carregamento", group: "Tracking" },
            { id: "trk_saida", label: "Tracking - Data Saída do Cliente", group: "Tracking" },
            { id: "trk_ass", label: "Tracking - Ass. Motorista", group: "Tracking" },
        ];
    }, []);

    // ✅ IMPORTANTE: vem tudo marcado por padrão
    const defaultVisibleFieldIds = useMemo(() => {
        return fieldsCatalog.map((f) => f.id);
    }, [fieldsCatalog]);

    const template = useMemo(() => {
        return {
            fieldsCatalog,
            defaultVisibleFieldIds,
            defaultOptions: { templateVariant: "inteiro", copies: 1 },
            pages: [
                {
                    id: "p1",
                    render: ({ data, visibleFieldIds, logo }) => (
                        <ColetaFolhaInteiraTemplate
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
            reportKey={`operacao.coleta.folhainteira.${templateId}`}
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
========================================================= */
function ColetaFolhaInteiraTemplate({ data, visibleFieldIds, logo }) {
    return (
        <div className="w-full h-full text-[11px] text-black">
            {/* ✅ força cores no print/pdf */}
            <style>{`
        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          html, body { height: auto !important; }
        }
      `}</style>

            <div className="absolute left-[40px] top-[38px] right-[40px] bottom-[30px] overflow-hidden">
                <OrdemColetaInteira data={data} visibleFieldIds={visibleFieldIds} logo={logo} />
            </div>
        </div>
    );
}

/* =========================================================
   BLOCO PRINCIPAL – FOLHA INTEIRA
========================================================= */
function OrdemColetaInteira({ data, visibleFieldIds, logo }) {
    const v = new Set(visibleFieldIds || []);

    const emp = data?.empresa || {};
    const ord = data?.ordem || {};
    const rem = data?.remetente || {};
    const dst = data?.destinatario || {};
    const mot = data?.motorista || {};
    const adu = data?.aduaneiras || {};
    const trk = data?.tracking || {};

    const Box = ({ children, className = "" }) => (
        <div className={`border border-black ${className}`}>{children}</div>
    );

    const SectionTitle = ({ children }) => (
        <div
            className="text-black text-center font-bold text-[11px] py-[2px]"
            style={{ backgroundColor: "#d1d5db" }} // ✅ garante no print/pdf
        >
            {children}
        </div>
    );

    const LineRow = ({ children }) => (
        <div className="px-2 py-[2px] flex items-center gap-4">{children}</div>
    );

    // ✅ labels em NEGRITO
    const Field = ({ id, label, value, w = 90, className = "" }) => {
        if (!v.has(id)) return null;
        return (
            <div className={`flex items-center ${className}`}>
                <div className="text-[10px] font-bold text-black" style={{ width: `${w}px` }}>
                    {label}
                </div>
                <div className="font-medium truncate">{value || ""}</div>
            </div>
        );
    };

    const BlankDate = () => <span className="font-mono">____/____/______</span>;
    const BlankTime = () => <span className="font-mono">____:____</span>;

    const InputBox = ({ w = 62, h = 22 }) => (
        <div className="border border-black" style={{ width: `${w}px`, height: `${h}px` }} />
    );

    const SignLine = ({ w = 120 }) => (
        <div className="border-b border-black" style={{ width: `${w}px` }} />
    );

    return (
        <div className="w-full h-full text-black">
            {/* ===== CABEÇALHO ===== */}
            <div className="flex items-start justify-between mb-1">
                <div className="w-[150px] h-[46px] flex items-center justify-start overflow-hidden">
                    {logo ? (
                        <img src={logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                    ) : null}
                </div>

                <div className="flex-1 text-center pt-2">
                    <div className="font-bold text-[14px]">ORDEM DE COLETA</div>
                </div>

                {/* ✅ Nº maior que o resto */}
                <div className="w-[190px] text-right pt-1 pr-1">
                    <span className="font-bold text-[13px]">Nº</span>{" "}
                    <span className="font-extrabold text-[18px]">{ord.numero}</span>
                </div>
            </div>

            {/* ===== TRANSPORTADORA ===== */}
            <Box>
                <SectionTitle>TRANSPORTADORA</SectionTitle>

                <div className="grid grid-cols-12">
                    <div className="col-span-8 px-2 py-[2px]">
                        <LineRow>
                            <Field id="emp_razao" label="Empresa:" value={emp.razao} w={72} className="flex-1" />
                        </LineRow>
                        <LineRow>
                            <Field id="emp_endereco" label="Endereço:" value={emp.endereco} w={72} className="flex-1" />
                        </LineRow>

                        <LineRow>
                            <Field id="emp_municipio" label="Município:" value={emp.municipio} w={72} />
                            <Field id="emp_cep" label="CEP:" value={emp.cep} w={38} />
                            <Field id="emp_uf" label="UF:" value={emp.uf} w={26} />
                        </LineRow>

                        <LineRow>
                            <Field id="emp_fone" label="Fone:" value={emp.fone} w={38} />
                            <Field id="emp_fax" label="FAX:" value={emp.fax} w={34} />
                            <Field id="emp_cgc" label="C.G.C.:" value={formatCNPJ(emp.cgc)} w={46} />
                            <Field id="emp_ie" label="I.E:" value={emp.ie} w={26} />
                        </LineRow>
                    </div>

                    <div className="col-span-4 px-2 py-[2px]">
                        <LineRow>
                            <Field
                                id="ord_data_hora"
                                label="Data Solicitação"
                                value={`${ord.dataSolicitacao || ""} ${ord.horaSolicitacao || ""}`}
                                w={110}
                            />
                        </LineRow>

                        <LineRow>
                            <Field
                                id="ord_solic_cliente"
                                label="Nº Solicitação Cliente"
                                value={ord.solicitacaoCliente}
                                w={130}
                            />
                        </LineRow>

                        <LineRow>
                            <Field
                                id="ord_coletar"
                                label="Coletar em:"
                                value={`${ord.coletarEm || ""} Até às ${ord.ateAs || ""}`}
                                w={72}
                            />
                        </LineRow>
                    </div>
                </div>
            </Box>

            {/* ===== REMETENTE ===== */}
            <Box className="mt-2">
                <SectionTitle>REMETENTE</SectionTitle>

                <LineRow>
                    <Field id="rem_nome" label="Remetente" value={rem.nome} w={72} className="flex-1" />
                    <Field id="rem_cidade" label="Cidade" value={rem.cidade} w={42} />
                    <Field id="rem_estado" label="Estado" value={rem.estado} w={42} />
                </LineRow>

                <LineRow>
                    <Field id="rem_endereco" label="Endereço" value={rem.endereco} w={72} className="flex-1" />
                    <Field id="rem_bairro" label="Bairro" value={rem.bairro} w={46} />
                </LineRow>

                <LineRow>
                    <Field id="rem_contato" label="Contato" value={rem.contato} w={48} />
                    <Field id="rem_osn" label="Nº OSN" value={rem.osn} w={46} />
                    <Field id="rem_cotacao" label="Nº Cotação" value={rem.cotacao} w={70} />
                </LineRow>

                <LineRow>
                    <Field id="rem_obs" label="Observação" value={rem.observacao} w={72} className="flex-1" />
                </LineRow>
            </Box>

            {/* ===== DESTINATÁRIO ===== */}
            <Box className="mt-2">
                <SectionTitle>DESTINATÁRIO</SectionTitle>

                <LineRow>
                    <Field id="dst_nome" label="Destinatário" value={dst.nome} w={78} className="flex-1" />
                    <Field id="dst_cgc" label="CGC/CPF" value={formatCNPJ(dst.cgcCpf)} w={58} />
                </LineRow>

                <LineRow>
                    <Field id="dst_endereco" label="Endereço" value={dst.endereco} w={78} className="flex-1" />
                    <Field id="dst_numero" label="Nº" value={dst.numero} w={22} />
                    <Field id="dst_bairro" label="Bairro" value={dst.bairro} w={44} />
                </LineRow>

                <LineRow>
                    <Field id="dst_municipio" label="Município" value={dst.municipio} w={78} className="flex-1" />
                    <Field id="dst_estado" label="Estado" value={dst.estado} w={44} />
                </LineRow>
            </Box>

            {/* ===== MOTORISTA / VEÍCULO ===== */}
            <Box className="mt-2">
                <SectionTitle>DADOS MOTORISTA / VEÍCULO</SectionTitle>

                <LineRow>
                    <Field id="mot_veiculo" label="Veículo" value={mot.veiculo} w={54} />
                    <Field id="mot_placa" label="Placa" value={mot.placa} w={42} />
                    <Field id="mot_carreta" label="Carreta Placa" value={mot.carretaPlaca} w={86} />
                </LineRow>

                <LineRow>
                    <Field id="mot_nome" label="Motorista" value={mot.nome} w={66} className="flex-1" />
                    <Field id="mot_cpf" label="CPF" value={formatCPF(mot.cpf)} w={32} />
                    <Field id="mot_cnh" label="CNH" value={mot.cnh} w={32} />
                    <Field id="mot_categoria" label="Categoria" value={mot.categoria} w={58} />
                </LineRow>

                <LineRow>
                    <Field id="mot_peso" label="Peso Informado" value={mot.pesoInformado} w={90} />
                    <Field id="mot_vol" label="Vol Informado" value={mot.volInformado} w={84} />
                    <Field id="mot_rg" label="RG" value={mot.rg} w={26} />
                    <Field id="mot_produto" label="Produto" value={mot.produto} w={48} />
                </LineRow>
            </Box>

            {/* ===== ADUANEIRAS ===== */}
            <Box className="mt-2">
                <SectionTitle>INFORMAÇÕES ADUANEIRAS</SectionTitle>

                <div className="grid grid-cols-12 px-2 py-[2px] gap-y-[2px]">
                    <div className="col-span-6">
                        <LineRow>
                            <Field id="adu_container" label="Nº Container" value={adu.container} w={92} />
                            <Field id="adu_tipo_container" label="Tipo" value={adu.tipoContainer} w={32} />
                        </LineRow>

                        <LineRow>
                            <Field id="adu_navio" label="Nome Navio" value={adu.navio} w={92} />
                        </LineRow>

                        <LineRow>
                            <Field id="adu_embarque" label="Embarque" value={adu.embarque} w={92} />
                        </LineRow>

                        <LineRow>
                            <Field id="adu_retirada" label="Retirada" value={adu.retirada} w={92} />
                        </LineRow>

                        <LineRow>
                            <Field id="adu_di" label="Nº DI" value={adu.di} w={46} />
                            <Field id="adu_ref" label="Nº Ref." value={adu.ref} w={58} />
                            <Field id="adu_reserva" label="Nº Reserva" value={adu.reserva} w={82} />
                        </LineRow>
                    </div>

                    <div className="col-span-6">
                        <LineRow>
                            <Field id="adu_lacre_comp" label="Lacre Complementar" value={adu.lacreComplementar} w={120} />
                            <Field id="adu_master" label="Master" value={adu.master} w={46} />
                        </LineRow>

                        <LineRow>
                            <Field id="adu_desembarque" label="Desembarque" value={adu.desembarque} w={92} />
                            <Field id="adu_entrega" label="Entrega" value={adu.entrega} w={54} />
                        </LineRow>

                        <LineRow>
                            <Field id="adu_dep_container" label="Dep. Container" value={adu.depContainer} w={92} />
                            <Field id="adu_lacre" label="Nº Lacre" value={adu.lacre} w={58} />
                            <Field id="adu_house" label="House" value={adu.house} w={44} />
                        </LineRow>
                    </div>
                </div>
            </Box>

            {/* ===== RETIRADA / RECEBIMENTO ===== */}
            <Box className="mt-2">
                <div className="grid grid-cols-12">
                    <div className="col-span-6 px-2 py-[2px]">
                        <div className="font-bold text-[11px] py-[2px]">
                            RETIRADA DA CARGA - (Preenchimento Manual)
                        </div>

                        <LineRow>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold">Qde NFs:</span>
                                <InputBox />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold">Qde Volumes:</span>
                                <InputBox />
                            </div>
                        </LineRow>

                        <div className="mt-4 flex justify-between px-6">
                            <div className="text-center">
                                <SignLine w={120} />
                                <div className="text-[10px] mt-1 font-bold">Motorista</div>
                            </div>
                            <div className="text-center">
                                <SignLine w={120} />
                                <div className="text-[10px] mt-1 font-bold">Expedição</div>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-6 px-2 py-[2px]">
                        <div className="font-bold text-[11px] py-[2px] text-center">
                            RECEBIMENTO NO DEPÓSITO (Preenchimento Manual)
                        </div>

                        <div className="flex flex-col items-end gap-2 mt-1">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold">Qde Volumes:</span>
                                <InputBox />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold">Qde NFs:</span>
                                <InputBox />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold">Peso Aferido:</span>
                                <InputBox />
                            </div>
                        </div>

                        <div className="mt-4 flex justify-center">
                            <div className="text-center">
                                <SignLine w={160} />
                                <div className="text-[10px] mt-1 font-bold">Recebimento</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Box>

            {/* ===== TRACKING ===== */}
            <Box className="mt-2">
                <SectionTitle>INFORMAÇÕES DE TRACKING</SectionTitle>

                <div className="px-2 py-2 grid grid-cols-12">
                    <div className="col-span-9">
                        <div className="space-y-2">
                            {v.has("trk_chegada") && (
                                <div className="flex items-center gap-3">
                                    <div className="w-[190px] text-[10px] font-bold">DATA CHEGADA CLIENTE</div>
                                    <BlankDate />
                                    <div className="ml-4 w-[40px] text-[10px] font-bold">Hora:</div>
                                    <BlankTime />
                                </div>
                            )}

                            {v.has("trk_aut") && (
                                <div className="flex items-center gap-3">
                                    <div className="w-[190px] text-[10px] font-bold">AUTORIZAÇÃO CARREGAMENTO</div>
                                    <BlankDate />
                                    <div className="ml-4 w-[40px] text-[10px] font-bold">Hora:</div>
                                    <BlankTime />
                                </div>
                            )}

                            {v.has("trk_inicio") && (
                                <div className="flex items-center gap-3">
                                    <div className="w-[190px] text-[10px] font-bold">INÍCIO CARREGAMENTO</div>
                                    <BlankDate />
                                    <div className="ml-4 w-[40px] text-[10px] font-bold">Hora:</div>
                                    <BlankTime />
                                </div>
                            )}

                            {v.has("trk_fim") && (
                                <div className="flex items-center gap-3">
                                    <div className="w-[190px] text-[10px] font-bold">FIM DO CARREGAMENTO</div>
                                    <BlankDate />
                                    <div className="ml-4 w-[40px] text-[10px] font-bold">Hora:</div>
                                    <BlankTime />
                                </div>
                            )}

                            {v.has("trk_saida") && (
                                <div className="flex items-center gap-3">
                                    <div className="w-[190px] text-[10px] font-bold">DATA SAÍDA DO CLIENTE</div>
                                    <BlankDate />
                                    <div className="ml-4 w-[40px] text-[10px] font-bold">Hora:</div>
                                    <BlankTime />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-span-3 flex items-end justify-center">
                        {v.has("trk_ass") ? (
                            <div className="text-center pb-1">
                                <SignLine w={110} />
                                <div className="text-[10px] mt-1 font-bold">ASS. MOTORISTA</div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </Box>
        </div>
    );
}
