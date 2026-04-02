// src/pages/Relatorios/Operacao/RelEspelhoCte.jsx
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DocumentoBase from "../base/DocumentoBase";

/* =========================================================
   Helpers
========================================================= */
const onlyDigits = (s) => (s || "").replace(/\D/g, "");

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

const n2 = (v) => Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
const n3 = (v) => Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 3 });

function getDefaultTemplateId() {
    return "padrao";
}

/* =========================================================
   MOCK (trocar pela WebApi depois)
========================================================= */
function mockCTe({ controle, filial } = {}) {
    return {
        emitente: {
            fantasia: "TESTE MANTRAN",
            razaoTopo: "MANTRAN TECNOLOGIAS",
            endereco1: "RUA LOURDES",
            cep: "09015340",
            cnpj: "04086814000141",
        },

        dacte: {
            titulo: "DACTE - Sem valor fiscal",
            subtitulo: "Documento Auxiliar do Conhecimento de Transporte Eletrônico",
            modalLabel: "MODAL",
            modal: "Rodoviário",
            modelo: "57",
            serie: "009",
            controle: controle || "265525",
            dataHoraEmissao: "21/01/2026 00:00:00",
            controleFisco: "",
            chaveAcessoLabel: "Chave de acesso para consulta de autenticidade no site www.cte.fazenda.gov.br",
            chaveAcesso: "35260104086814000141570090003004481630030429",
            protocoloLabel: "PROTOCOLO DE AUTORIZAÇÃO DE USO",
            protocolo: "",
        },

        infosTopo: {
            tipoCTe: "Normal",
            tipoServico: "Normal",
            indicadorGlobalizado: "NÃO",
            infoCTeGlobalizado: "",
            cfopNatureza: { cfop: "6352", natureza: "" },
            origemPrestacao: "ITU",
            destinoPrestacao: "SALVADOR",
        },

        remetente: {
            nome: "HNK BR INDUSTRIA DE BEBIDAS LTDA",
            endereco: "AVENIDA PRIMO SCHINCARIOL",
            bairro: "ITAIM",
            cep: "13312900",
            municipio: "ITU",
            ie: "387000650117",
            cnpjCpf: "50221019000136",
            fone: "",
        },

        destinatario: {
            nome: "HNK BR LOGISTICA E DISTRIBUICAO LTDA A.",
            endereco: "AV JEQUITAIÁ",
            bairro: "AGUA DE MENINOS",
            cep: "",
            municipio: "SALVADOR",
            ie: "074570489",
            cnpjCpf: "05254957005651",
            fone: "000000000",
        },

        consignatario: {
            nome: "HNK BR INDUSTRIA DE BEBIDAS LTDA",
            endereco: "AVENIDA PRIMO SCHINCARIOL",
            bairro: "ITAIM",
            cep: "09015340",
            municipio: "AVENIDA PRIMO SCHINCARIOL",
            ie: "387000650117",
            cnpjCpf: "50221019000136",
            fone: "",
        },

        redespacho: {
            nome: "HNK BR BEBIDAS LTDA",
            endereco: "AV JEQUITAIÁ",
            bairro: "COMERCIO",
            cep: "40015035",
            municipio: "SALVADOR",
            ie: "203733796",
            cnpjCpf: "02864417003909",
            fone: "",
        },

        cargaResumo: {
            quantidadeVolumes: 3,
            pesoBruto: 322.0,
            valorMercadoria: 1540.0,
            seguradora: "LIBERTY SEGUROS",
            numeroApolice: "",
            numeroAverbacao: "",
        },

        componentes: {
            linhas: [
                { a: "FRETE PESO", av: 1.0, b: "PEDAGIO", bv: 7.0, c: "AD VALOREM", cv: 3.0, d: "CAT", dv: 5.0 },
                { a: "DESPACHO", av: 4.0, b: "TAXA COLETA", bv: 11.0, c: "TAXA ENTREGA", cv: 10.0, d: "DESCARGA", dv: 12.0 },
                { a: "GRIS", av: 13.0, b: "ESCOLTA", bv: 15.0, c: "OUTROS", cv: 9.0, d: "VALOR ISS", dv: 0.0 },
            ],
            valorTotalServico: 630.0,
            valorAReceber: 630.0,
        },

        imposto: {
            situacaoTributaria: "",
            baseCalculo: 630.0,
            aliquota: 7.0,
            valorICMS: 44.1,
            percRedBC: "",
            icmsST: "",
        },

        nfs: [{ nf: "19203030", serie: "DTA", chave: "", volumes: 3, peso: 322.0, valor: 1540.0 }],

        observacoes: "OBSERVACAO CTE",

        motoristaVeiculo: {
            placa1: "RXW4156",
            tipo1: "CAVALO MEC",
            uf1: "SC",
            placa2: "",
            tipo2: "",
            uf2: "",
            motorista: "ALAN DA COSTA",
        },

        modalRodoviario: {
            rntrc: "45659402",
            lotacao: "",
            prevEntrega: "",
            lei: "ESSE CONHECIMENTO DE TRANSPORTE ATENDE À LEGISLAÇÃO DE TRANSPORTE RODOVIÁRIO EM VIGOR",
        },

        aduaneiras: {
            noContainer: "1,00",
            tipoContainer: "20 DRY",
            devolucao: "20 DRY",
            lacre: "4,00",
            lacreComplementar: "",
            navio: "CAP SAN MALEAS",
            noDI: "4,00",
            retirada: "RODRIMAR",
            nMaster: "",
            localEmbarque: "LIBRA PORT",
            reserva: "13,00",
            noReferencia: "13,00",
            entrega: "SATEL CUBATAO",
            ctrcHouse: "",
            localDesembarque: "SANTOS BRASIL",
            participacoes: "PARTICIPACOES",
            grid: [{ di: "18/2123132156", referencia: "12213", reserva: "21321", lacre: "21321", house: "" }],
        },

        declaracaoFinal: {
            texto:
                "DECLARO QUE RECEBI OS VOLUMES DESTE CONHECIMENTO DE TRANSPORTE EM PERFEITO ESTADO PELO QUE DOU POR CUMPRIDO O PRESENTE CONTRATO DE TRANSPORTE",
            nomeRG: "",
            assinatura: "",
            chegada: "",
            saida: "",
            controle: controle || "265525",
            serie: "009",
        },

        filtro: { filial: filial || "001", controle: controle || "265525" },
    };
}

/* =========================================================
   COMPONENTE
========================================================= */
export default function RelEspelhoCte({ open }) {
    const navigate = useNavigate();
    const location = useLocation();

    const { controle, filial } = location?.state || {};
    const templateId = getDefaultTemplateId();

    const doc = useMemo(() => mockCTe({ controle, filial }), [controle, filial]);
    const logo = localStorage.getItem("param_logoBg") || "";

    const template = useMemo(() => EspelhoCTeTemplate(), []);

    return (
        <DocumentoBase
            sidebarOpen={open}
            reportKey={`operacao.cte_espelho.${templateId}`}
            title="ESPELHO CTE"
            logo={logo}
            orientation="portrait" // ✅ A4 Retrato
            templateId={templateId}
            template={template}
            data={doc}
            onClose={() => navigate(-1)}

        />
    );
}

/* =========================================================
   TEMPLATE + CATÁLOGO (+Campos)
========================================================= */
function EspelhoCTeTemplate() {
    // ✅ Catálogo por áreas + campos individuais
    // Se o DocumentoBase suportar "group", ele agrupa.
    // Se não suportar, pelo menos fica organizado por prefixo.
    const fieldsCatalog = [
        // LOGO / EMITENTE
        { id: "sec.emitente", label: "Logo / Emitente", group: "Logo / Emitente" },
        { id: "emitente.fantasia", label: "Fantasia", group: "Logo / Emitente" },
        { id: "emitente.razaoTopo", label: "Razão topo", group: "Logo / Emitente" },
        { id: "emitente.endereco1", label: "Endereço", group: "Logo / Emitente" },
        { id: "emitente.cep", label: "CEP", group: "Logo / Emitente" },
        { id: "emitente.cnpj", label: "CNPJ", group: "Logo / Emitente" },

        // DACTE / CHAVE
        { id: "sec.dacte", label: "DACTE / Chave", group: "DACTE / Chave" },
        { id: "dacte.titulo", label: "Título", group: "DACTE / Chave" },
        { id: "dacte.subtitulo", label: "Subtítulo", group: "DACTE / Chave" },
        { id: "dacte.modal", label: "Modal", group: "DACTE / Chave" },
        { id: "dacte.modelo", label: "Modelo", group: "DACTE / Chave" },
        { id: "dacte.serie", label: "Série", group: "DACTE / Chave" },
        { id: "dacte.controle", label: "Controle", group: "DACTE / Chave" },
        { id: "dacte.dataHoraEmissao", label: "Data/Hora Emissão", group: "DACTE / Chave" },
        { id: "dacte.chaveAcesso", label: "Chave de Acesso", group: "DACTE / Chave" },
        { id: "dacte.protocolo", label: "Protocolo", group: "DACTE / Chave" },

        // TOPO INFO
        { id: "sec.topo", label: "Informações do CT-e", group: "Informações do CT-e" },
        { id: "infosTopo.tipoCTe", label: "Tipo CT-e", group: "Informações do CT-e" },
        { id: "infosTopo.tipoServico", label: "Tipo Serviço", group: "Informações do CT-e" },
        { id: "infosTopo.indicadorGlobalizado", label: "Indicador Globalizado", group: "Informações do CT-e" },
        { id: "infosTopo.infoCTeGlobalizado", label: "Info Globalizado", group: "Informações do CT-e" },
        { id: "infosTopo.cfopNatureza", label: "CFOP", group: "Informações do CT-e" },
        { id: "infosTopo.origemPrestacao", label: "Origem Prestação", group: "Informações do CT-e" },
        { id: "infosTopo.destinoPrestacao", label: "Destino Prestação", group: "Informações do CT-e" },

        // REMETENTE
        { id: "sec.remetente", label: "Remetente", group: "Remetente" },
        { id: "remetente.nome", label: "Nome", group: "Remetente" },
        { id: "remetente.endereco", label: "Endereço", group: "Remetente" },
        { id: "remetente.bairro", label: "Bairro", group: "Remetente" },
        { id: "remetente.cep", label: "CEP", group: "Remetente" },
        { id: "remetente.municipio", label: "Município", group: "Remetente" },
        { id: "remetente.ie", label: "IE", group: "Remetente" },
        { id: "remetente.cnpjCpf", label: "CNPJ/CPF", group: "Remetente" },
        { id: "remetente.fone", label: "Fone", group: "Remetente" },

        // DESTINATÁRIO
        { id: "sec.destinatario", label: "Destinatário", group: "Destinatário" },
        { id: "destinatario.nome", label: "Nome", group: "Destinatário" },
        { id: "destinatario.endereco", label: "Endereço", group: "Destinatário" },
        { id: "destinatario.bairro", label: "Bairro", group: "Destinatário" },
        { id: "destinatario.cep", label: "CEP", group: "Destinatário" },
        { id: "destinatario.municipio", label: "Município", group: "Destinatário" },
        { id: "destinatario.ie", label: "IE", group: "Destinatário" },
        { id: "destinatario.cnpjCpf", label: "CNPJ/CPF", group: "Destinatário" },
        { id: "destinatario.fone", label: "Fone", group: "Destinatário" },

        // CONSIGNATÁRIO
        { id: "sec.consignatario", label: "Consignatário", group: "Consignatário" },
        { id: "consignatario.nome", label: "Nome", group: "Consignatário" },
        { id: "consignatario.endereco", label: "Endereço", group: "Consignatário" },
        { id: "consignatario.bairro", label: "Bairro", group: "Consignatário" },
        { id: "consignatario.cep", label: "CEP", group: "Consignatário" },
        { id: "consignatario.municipio", label: "Município", group: "Consignatário" },
        { id: "consignatario.ie", label: "IE", group: "Consignatário" },
        { id: "consignatario.cnpjCpf", label: "CNPJ/CPF", group: "Consignatário" },
        { id: "consignatario.fone", label: "Fone", group: "Consignatário" },

        // REDESPACHO
        { id: "sec.redespacho", label: "Redespacho", group: "Redespacho" },
        { id: "redespacho.nome", label: "Nome", group: "Redespacho" },
        { id: "redespacho.endereco", label: "Endereço", group: "Redespacho" },
        { id: "redespacho.bairro", label: "Bairro", group: "Redespacho" },
        { id: "redespacho.cep", label: "CEP", group: "Redespacho" },
        { id: "redespacho.municipio", label: "Município", group: "Redespacho" },
        { id: "redespacho.ie", label: "IE", group: "Redespacho" },
        { id: "redespacho.cnpjCpf", label: "CNPJ/CPF", group: "Redespacho" },
        { id: "redespacho.fone", label: "Fone", group: "Redespacho" },

        // VALORES / FRETE
        { id: "sec.valores", label: "Valores do Frete", group: "Valores do Frete" },
        { id: "cargaResumo", label: "Resumo Carga/Seguro", group: "Valores do Frete" },
        { id: "componentes", label: "Componentes do Serviço", group: "Valores do Frete" },
        { id: "imposto", label: "Imposto", group: "Valores do Frete" },

        // NOTA FISCAL
        { id: "sec.nf", label: "Dados da Nota Fiscal", group: "Dados da Nota Fiscal" },
        { id: "nfs", label: "Tabela de NF", group: "Dados da Nota Fiscal" },

        // MOTORISTA
        { id: "sec.motorista", label: "Motorista", group: "Motorista" },
        { id: "motoristaVeiculo", label: "Motorista/Veículo", group: "Motorista" },
        { id: "modalRodoviario", label: "Info Modal Rodoviário", group: "Motorista" },

        // ADUANEIRAS
        { id: "sec.aduaneiras", label: "Informações Aduaneiras", group: "Informações Aduaneiras" },
        { id: "aduaneiras", label: "Bloco Aduaneiras", group: "Informações Aduaneiras" },

        // OBS/DECLARAÇÃO
        { id: "sec.obs", label: "Observações", group: "Observações" },
        { id: "observacoes", label: "Texto Observações", group: "Observações" },
        { id: "sec.declaracao", label: "Declaração Final", group: "Declaração Final" },
        { id: "declaracaoFinal", label: "Declaração", group: "Declaração Final" },
    ];

    // ✅ Por padrão, mostra tudo (mas organizado)
    const defaultVisibleFieldIds = fieldsCatalog.map((x) => x.id);

    const pages = [
        {
            id: "p1",
            render: (ctx) => <EspelhoPage {...ctx} />,
        },
    ];

    return { pages, fieldsCatalog, defaultVisibleFieldIds };
}

/* =========================================================
   Layout blocks (compactados p/ caber 1 folha)
========================================================= */
function OuterBox({ children, className = "" }) {
    // ✅ compacta e evita “vazar” visualmente
    return (
        <div className={`w-full h-full p-[6px] ${className}`}>
            <div className="w-full h-full border border-black overflow-hidden">{children}</div>
        </div>
    );
}

function Box({ children, className = "" }) {
    return <div className={`border border-black ${className}`}>{children}</div>;
}

function HLine({ className = "" }) {
    return <div className={`border-t border-black ${className}`} />;
}

function TitleBar({ children, className = "" }) {
    return (
        <div className={`text-[9px] font-bold text-center border-b border-black py-[1px] ${className}`}>
            {children}
        </div>
    );
}

function LabelVal({ label, value, className = "" }) {
    return (
        <div className={`text-[8.5px] leading-[1.12] ${className}`}>
            <span className="font-bold">{label}</span>{" "}
            <span>{value || ""}</span>
        </div>
    );
}

/* =========================================================
   Helper: visibilidade por campo (em tempo real)
   (fallback se o DocumentoBase não passar nada)
========================================================= */
function makeVis(ctx) {
    const arr =
        ctx?.visibleFieldIds ||
        ctx?.layout?.visibleFieldIds ||
        ctx?.selectedFieldIds ||
        ctx?.layout?.selectedFieldIds ||
        [];

    const set = new Set(Array.isArray(arr) ? arr : []);
    const hasAny = set.size > 0;

    const on = (id) => {
        if (!hasAny) return true; // se DocumentoBase não manda nada, mostra tudo
        return set.has(id);
    };

    // seção liga se: sec.* ligado ou algum campo dela ligado
    const secOn = (secId, ids = []) => {
        if (!hasAny) return true;
        if (set.has(secId)) return true;
        return ids.some((x) => set.has(x));
    };

    return { on, secOn };
}

/* =========================================================
   PÁGINA
========================================================= */
function EspelhoPage(ctx) {
    const data = ctx?.data || {};
    const v = makeVis(ctx);

    const e = data?.emitente || {};
    const d = data?.dacte || {};
    const topo = data?.infosTopo || {};
    const remet = data?.remetente || {};
    const dest = data?.destinatario || {};
    const cons = data?.consignatario || {};
    const redes = data?.redespacho || {};
    const carga = data?.cargaResumo || {};
    const comps = data?.componentes || {};
    const imp = data?.imposto || {};
    const nfs = data?.nfs || [];
    const mot = data?.motoristaVeiculo || {};
    const rod = data?.modalRodoviario || {};
    const adu = data?.aduaneiras || {};
    const dec = data?.declaracaoFinal || {};

    return (
        <OuterBox>
            {/* ===================================================
         TOPO (corrigido: NÃO estica o Emitente)
         Agora é:
         1) Linha: Emitente (esq) + Cabeçalho DACTE (dir)
         2) Caixa full: Controle Fisco
         3) Caixa full: Chave Acesso
         4) Caixa full: Protocolo
      =================================================== */}
            {(v.secOn("sec.emitente", [
                "emitente.fantasia", "emitente.razaoTopo", "emitente.endereco1", "emitente.cep", "emitente.cnpj"
            ]) || v.secOn("sec.dacte", [
                "dacte.titulo", "dacte.subtitulo", "dacte.modal", "dacte.modelo", "dacte.serie", "dacte.controle", "dacte.dataHoraEmissao"
            ])) && (
                    <div className="grid grid-cols-2 gap-0">
                        {/* ESQ: LOGO/EMITENTE (não estica mais) */}
                        {v.secOn("sec.emitente", [
                            "emitente.fantasia", "emitente.razaoTopo", "emitente.endereco1", "emitente.cep", "emitente.cnpj"
                        ]) && (
                                <Box className="p-2">
                                    {/* logo (área) */}
                                    <div className="leading-[0.95]">
                                        <div className="text-[28px] font-extrabold">
                                            <span className="text-black">MAN</span>
                                            <span className="text-red-600">T</span>
                                            <span className="text-black">RAN</span>
                                        </div>
                                        <div className="text-red-600 text-[14px] font-extrabold">TECNOLOGIAS</div>
                                    </div>

                                    {/* emitente (campos) */}
                                    {v.on("emitente.fantasia") && <div className="mt-[3px] text-[10px] font-bold">{e.fantasia}</div>}
                                    {v.on("emitente.endereco1") && <div className="mt-[1px] text-[9px] font-bold">{e.endereco1}</div>}
                                    {v.on("emitente.cep") && <div className="mt-[1px] text-[9px] font-bold">{e.cep}</div>}
                                    {v.on("emitente.cnpj") && <div className="mt-[1px] text-[9px] font-bold">{e.cnpj}</div>}
                                </Box>
                            )}

                        {/* DIR: Cabeçalho DACTE */}
                        {v.secOn("sec.dacte", [
                            "dacte.titulo", "dacte.subtitulo", "dacte.modal", "dacte.modelo", "dacte.serie", "dacte.controle", "dacte.dataHoraEmissao"
                        ]) && (
                                <Box className="p-2">
                                    {v.on("dacte.titulo") && <div className="text-center text-[14px] font-bold">{d.titulo}</div>}
                                    {v.on("dacte.subtitulo") && <div className="text-center text-[8px] font-bold mt-[2px]">{d.subtitulo}</div>}

                                    <div className="grid grid-cols-4 gap-0 mt-[4px] text-[8.5px]">
                                        <div className="col-span-3">
                                            <div className="grid grid-cols-3">
                                                <div className="p-1">
                                                    <div className="font-bold">MODELO</div>
                                                    <div>{d.modelo}</div>
                                                </div>
                                                <div className="p-1">
                                                    <div className="font-bold">SÉRIE</div>
                                                    <div>{d.serie}</div>
                                                </div>
                                                <div className="p-1 ">
                                                    <div className="font-bold">Controle</div>
                                                    <div>{d.controle}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-1 text-right pl-2">
                                            <div className="font-bold">{d.modalLabel}</div>
                                            <div className="font-bold text-[10px]">{d.modal}</div>
                                        </div>
                                    </div>

                                    {v.on("dacte.dataHoraEmissao") && (
                                        <div className="mt-[3px] text-[8.5px]">
                                            <div className="font-bold">DATA E HORA DE EMISSÃO</div>
                                            <div>{d.dataHoraEmissao}</div>
                                        </div>
                                    )}
                                </Box>
                            )}
                    </div>
                )}

            {/* CONTROLE DO FISCO */}
            {v.on("dacte.controleFisco") !== false && (
                <Box className="p-0">
                    <div className="text-center text-[8.5px] py-[4px]">CONTROLE DO FISCO</div>
                </Box>
            )}

            {/* CHAVE DE ACESSO */}
            {v.on("dacte.chaveAcesso") && (
                <Box className="p-0">
                    <div className="text-center text-[7.8px] py-[2px]">{d.chaveAcessoLabel}</div>
                    <div className="text-center text-[13px] font-bold py-[4px]">{d.chaveAcesso}</div>
                </Box>
            )}

            {/* PROTOCOLO */}
            {v.on("dacte.protocolo") !== false && (
                <Box className="p-0">
                    <div className="text-center text-[9px] font-bold py-[4px]">{d.protocoloLabel}</div>
                </Box>
            )}

            {/* ===================================================
         INFO TOPO
      =================================================== */}
            {v.secOn("sec.topo", [
                "infosTopo.tipoCTe", "infosTopo.tipoServico", "infosTopo.indicadorGlobalizado", "infosTopo.infoCTeGlobalizado",
                "infosTopo.cfopNatureza", "infosTopo.origemPrestacao", "infosTopo.destinoPrestacao"
            ]) && (
                    <>
                        <div className="grid grid-cols-2 gap-0">
                            <Box className="p-0">
                                <div className="grid grid-cols-2">
                                    <div className="border-r border-black">
                                        <div className="text-[9px] font-bold text-center">TIPO DO CT-E.</div>
                                        <div className="text-[9px] text-center pb-[1px]">{topo.tipoCTe}</div>
                                    </div>
                                    <div>
                                        <div className="text-[9px] font-bold text-center">TIPO DO SERVIÇO</div>
                                        <div className="text-[9px] text-center pb-[1px]">{topo.tipoServico}</div>
                                    </div>
                                </div>

                                <HLine />

                                <div className="grid grid-cols-2">
                                    <div className="border-r border-black p-1">
                                        <LabelVal label="Indicador do CT-e Globalizado." value={topo.indicadorGlobalizado} />
                                    </div>
                                    <div className="p-1">
                                        <LabelVal label="Informações do CT-e Globalizado" value={topo.infoCTeGlobalizado} />
                                    </div>
                                </div>

                                <HLine />

                                <div className="p-1">
                                    <LabelVal label="CFOP - NATUREZA DA OPERAÇÃO" value={topo.cfopNatureza?.cfop} />
                                </div>
                            </Box>

                            <Box className="p-0">
                                <div className="h-full" />
                            </Box>
                        </div>

                        <div className="grid grid-cols-2 gap-0">
                            <Box className="p-1">
                                <div className="text-[9px] font-bold">ORIGEM DA PRESTAÇÃO</div>
                                <div className="text-[9px]">{topo.origemPrestacao}</div>
                            </Box>
                            <Box className="p-1">
                                <div className="text-[9px] font-bold">DESTINO DA PRESTAÇÃO</div>
                                <div className="text-[9px]">{topo.destinoPrestacao}</div>
                            </Box>
                        </div>
                    </>
                )}

            {/* ===================================================
         PARTICIPANTES
      =================================================== */}
            <div className="grid grid-cols-2 gap-0">
                {/* REMETENTE */}
                {v.secOn("sec.remetente", [
                    "remetente.nome", "remetente.endereco", "remetente.bairro", "remetente.cep", "remetente.municipio",
                    "remetente.ie", "remetente.cnpjCpf", "remetente.fone"
                ]) && (
                        <Box className="p-1">
                            <LabelVal label="REMETENTE:" value={remet.nome} />
                            {v.on("remetente.endereco") && <LabelVal label="ENDEREÇO:" value={remet.endereco} />}
                            <div className="grid grid-cols-2">
                                {v.on("remetente.bairro") && <LabelVal label="BAIRRO:" value={remet.bairro} />}
                                {v.on("remetente.cep") && <LabelVal label="CEP:" value={formatCEP(remet.cep)} className="text-right" />}
                            </div>
                            <div className="grid grid-cols-2">
                                {v.on("remetente.municipio") && <LabelVal label="MUNICÍPIO:" value={remet.municipio} />}
                                {v.on("remetente.ie") && <LabelVal label="IE:" value={remet.ie} className="text-right" />}
                            </div>
                            <div className="grid grid-cols-2">
                                {v.on("remetente.cnpjCpf") && <LabelVal label="CNPJ / CPF:" value={formatCNPJCPF(remet.cnpjCpf)} />}
                                {v.on("remetente.fone") && <LabelVal label="FONE:" value={remet.fone} className="text-right" />}
                            </div>
                        </Box>
                    )}

                {/* DESTINATÁRIO */}
                {v.secOn("sec.destinatario", [
                    "destinatario.nome", "destinatario.endereco", "destinatario.bairro", "destinatario.cep", "destinatario.municipio",
                    "destinatario.ie", "destinatario.cnpjCpf", "destinatario.fone"
                ]) && (
                        <Box className="p-1">
                            <LabelVal label="DESTINATÁRIO:" value={dest.nome} />
                            {v.on("destinatario.endereco") && <LabelVal label="ENDEREÇO:" value={dest.endereco} />}
                            <div className="grid grid-cols-2">
                                {v.on("destinatario.bairro") && <LabelVal label="BAIRRO:" value={dest.bairro} />}
                                {v.on("destinatario.cep") && <LabelVal label="CEP:" value={formatCEP(dest.cep)} className="text-right" />}
                            </div>
                            <div className="grid grid-cols-2">
                                {v.on("destinatario.municipio") && <LabelVal label="MUNICÍPIO:" value={dest.municipio} />}
                                {v.on("destinatario.ie") && <LabelVal label="IE:" value={dest.ie} className="text-right" />}
                            </div>
                            <div className="grid grid-cols-2">
                                {v.on("destinatario.cnpjCpf") && <LabelVal label="CNPJ / CPF:" value={formatCNPJCPF(dest.cnpjCpf)} />}
                                {v.on("destinatario.fone") && <LabelVal label="FONE:" value={dest.fone} className="text-right" />}
                            </div>
                        </Box>
                    )}
            </div>

            <div className="grid grid-cols-2 gap-0">
                {/* CONSIGNATÁRIO */}
                {v.secOn("sec.consignatario", [
                    "consignatario.nome", "consignatario.endereco", "consignatario.bairro", "consignatario.cep", "consignatario.municipio",
                    "consignatario.ie", "consignatario.cnpjCpf", "consignatario.fone"
                ]) && (
                        <Box className="p-1">
                            <LabelVal label="CONSIGNATÁRIO:" value={cons.nome} />
                            {v.on("consignatario.endereco") && <LabelVal label="ENDEREÇO:" value={cons.endereco} />}
                            <div className="grid grid-cols-2">
                                {v.on("consignatario.bairro") && <LabelVal label="BAIRRO:" value={cons.bairro} />}
                                {v.on("consignatario.cep") && <LabelVal label="CEP:" value={formatCEP(cons.cep)} className="text-right" />}
                            </div>
                            <div className="grid grid-cols-2">
                                {v.on("consignatario.municipio") && <LabelVal label="MUNICÍPIO:" value={cons.municipio} />}
                                {v.on("consignatario.ie") && <LabelVal label="IE:" value={cons.ie} className="text-right" />}
                            </div>
                            <div className="grid grid-cols-2">
                                {v.on("consignatario.cnpjCpf") && <LabelVal label="CNPJ / CPF:" value={formatCNPJCPF(cons.cnpjCpf)} />}
                                {v.on("consignatario.fone") && <LabelVal label="FONE:" value={cons.fone} className="text-right" />}
                            </div>
                        </Box>
                    )}

                {/* REDESPACHO */}
                {v.secOn("sec.redespacho", [
                    "redespacho.nome", "redespacho.endereco", "redespacho.bairro", "redespacho.cep", "redespacho.municipio",
                    "redespacho.ie", "redespacho.cnpjCpf", "redespacho.fone"
                ]) && (
                        <Box className="p-1">
                            <LabelVal label="REDESPACHO:" value={redes.nome} />
                            {v.on("redespacho.endereco") && <LabelVal label="ENDEREÇO:" value={redes.endereco} />}
                            <div className="grid grid-cols-2">
                                {v.on("redespacho.bairro") && <LabelVal label="BAIRRO:" value={redes.bairro} />}
                                {v.on("redespacho.cep") && <LabelVal label="CEP:" value={formatCEP(redes.cep)} className="text-right" />}
                            </div>
                            <div className="grid grid-cols-2">
                                {v.on("redespacho.municipio") && <LabelVal label="MUNICÍPIO:" value={redes.municipio} />}
                                {v.on("redespacho.ie") && <LabelVal label="IE:" value={redes.ie} className="text-right" />}
                            </div>
                            <div className="grid grid-cols-2">
                                {v.on("redespacho.cnpjCpf") && <LabelVal label="CNPJ / CPF:" value={formatCNPJCPF(redes.cnpjCpf)} />}
                                {v.on("redespacho.fone") && <LabelVal label="FONE:" value={redes.fone} className="text-right" />}
                            </div>
                        </Box>
                    )}
            </div>

            {/* ===================================================
         VALORES / FRETE
      =================================================== */}
            {v.secOn("sec.valores", ["cargaResumo", "componentes", "imposto"]) && (
                <>
                    {v.on("cargaResumo") && (
                        <div className="grid grid-cols-6 gap-0">
                            <Box className="col-span-1 p-1">
                                <div className="text-[8px]">QUANTIDADE VOLUMES</div>
                                <div className="text-[9px]">{carga.quantidadeVolumes}</div>
                            </Box>
                            <Box className="col-span-1 p-1">
                                <div className="text-[8px]">PESO BRUTO</div>
                                <div className="text-[9px]">{n3(carga.pesoBruto)}</div>
                            </Box>
                            <Box className="col-span-1 p-1">
                                <div className="text-[8px]">VALOR MERCADORIA</div>
                                <div className="text-[9px]">{n2(carga.valorMercadoria)}</div>
                            </Box>

                            <Box className="col-span-3 p-1">
                                <div className="grid grid-cols-3 gap-0">
                                    <div className="col-span-1">
                                        <div className="text-[8px]">NOME SEGURADORA</div>
                                        <div className="text-[9px]">{carga.seguradora}</div>
                                    </div>
                                    <div className="col-span-1">
                                        <div className="text-[8px]">NÚMERO APÓLICE</div>
                                        <div className="text-[9px]">{carga.numeroApolice}</div>
                                    </div>
                                    <div className="col-span-1">
                                        <div className="text-[8px]">NÚMERO AVERBAÇÃO</div>
                                        <div className="text-[9px]">{carga.numeroAverbacao}</div>
                                    </div>
                                </div>
                            </Box>
                        </div>
                    )}

                    {v.on("componentes") && (
                        <Box className="p-0">
                            <TitleBar>COMPONENTES DO VALOR DA PRESTAÇÃO DO SERVIÇO</TitleBar>

                            <div className="grid grid-cols-6 gap-0">
                                <div className="col-span-5">
                                    <div className="grid grid-cols-4 gap-0 text-[8.5px]">
                                        {comps.linhas?.map((ln, i) => (
                                            <div key={i} className="col-span-4 grid grid-cols-4 border-t border-black">
                                                <div className="p-1 border-r border-black">
                                                    <div>{ln.a}</div>
                                                    <div className="text-right">{n2(ln.av)}</div>
                                                </div>
                                                <div className="p-1 border-r border-black">
                                                    <div>{ln.b}</div>
                                                    <div className="text-right">{n2(ln.bv)}</div>
                                                </div>
                                                <div className="p-1 border-r border-black">
                                                    <div>{ln.c}</div>
                                                    <div className="text-right">{n2(ln.cv)}</div>
                                                </div>
                                                <div className="p-1">
                                                    <div>{ln.d}</div>
                                                    <div className="text-right">{n2(ln.dv)}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="col-span-1 border-l border-black text-[8.5px]">
                                    <div className="p-1 border-b border-black">
                                        <div>VALOR TOTAL DO SERVIÇO</div>
                                        <div className="text-right text-[9px] font-bold">{n2(comps.valorTotalServico)}</div>
                                    </div>
                                    <div className="p-1">
                                        <div>VALOR A RECEBER</div>
                                        <div className="text-right text-[9px] font-bold">{n2(comps.valorAReceber)}</div>
                                    </div>
                                </div>
                            </div>
                        </Box>
                    )}

                    {v.on("imposto") && (
                        <Box className="p-0">
                            <TitleBar>INFORMAÇÕES RELATIVAS AO IMPOSTO</TitleBar>

                            <div className="grid grid-cols-12 gap-0 text-[8.5px]">
                                <div className="col-span-3 p-1 border-r border-black">
                                    <div>SITUAÇÃO TRIBUTÁRIA</div>
                                    <div className="text-[9px]">{imp.situacaoTributaria}</div>
                                </div>

                                <div className="col-span-3 p-1 border-r border-black">
                                    <div>BASE DE CÁLCULO</div>
                                    <div className="text-right text-[9px]">{n2(imp.baseCalculo)}</div>
                                </div>

                                <div className="col-span-1 p-1 border-r border-black">
                                    <div>ALIQ. ICMS</div>
                                    <div className="text-right text-[9px]">{n2(imp.aliquota)}</div>
                                </div>

                                <div className="col-span-2 p-1 border-r border-black">
                                    <div>VALOR DO ICMS</div>
                                    <div className="text-right text-[9px]">{n2(imp.valorICMS)}</div>
                                </div>

                                <div className="col-span-2 p-1 border-r border-black">
                                    <div>% RED. BC. CÁLC.</div>
                                    <div className="text-right text-[9px]">{imp.percRedBC}</div>
                                </div>

                                <div className="col-span-1 p-1">
                                    <div>ICMS ST</div>
                                    <div className="text-right text-[9px]">{imp.icmsST}</div>
                                </div>
                            </div>

                            {/* NOTA FISCAL dentro do imposto (como no espelho) */}
                            {v.on("nfs") && (
                                <>
                                    <HLine />

                                    <div className="grid grid-cols-12 gap-0 text-[8.5px]">
                                        <div className="col-span-1 p-1">N° NF</div>
                                        <div className="col-span-1 p-1">SÉRIE</div>
                                        <div className="col-span-5 p-1">CHAVE NF</div>
                                        <div className="col-span-1 p-1 text-center">VOLUMES</div>
                                        <div className="col-span-2 p-1 text-center">PESO</div>
                                        <div className="col-span-2 p-1 text-center">VALOR MERCADORIA</div>
                                    </div>

                                    {nfs.map((nf, i) => (
                                        <div key={i} className="grid grid-cols-12 gap-0 text-[8.5px] border-t border-black">
                                            <div className="col-span-1 p-1">{nf.nf}</div>
                                            <div className="col-span-1 p-1">{nf.serie}</div>
                                            <div className="col-span-5 p-1">{nf.chave}</div>
                                            <div className="col-span-1 p-1 text-center">{nf.volumes}</div>
                                            <div className="col-span-2 p-1 text-center">{n3(nf.peso)}</div>
                                            <div className="col-span-2 p-1 text-center">{n2(nf.valor)}</div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </Box>
                    )}
                </>
            )}

            {/* ===================================================
         OBS / MOTORISTA
      =================================================== */}
            <div className="grid grid-cols-2 gap-0">
                {v.secOn("sec.obs", ["observacoes"]) && (
                    <Box className="p-0">
                        <TitleBar>OBSERVAÇÕES</TitleBar>
                        <div className="p-2 text-[9px] text-center">{data?.observacoes}</div>
                    </Box>
                )}

                {v.secOn("sec.motorista", ["motoristaVeiculo"]) && (
                    <Box className="p-0">
                        <TitleBar>MOTORISTA / VEÍCULO</TitleBar>
                        <div className="p-2 text-[8.5px] leading-[1.2]">
                            <div className="grid grid-cols-3">
                                <div className="col-span-1">PLACA VEÍCULO</div>
                                <div className="col-span-1 text-center">{mot.placa1}</div>
                                <div className="col-span-1 text-right">
                                    <span className="font-bold">TIPO</span> {mot.tipo1}{" "}
                                    <span className="font-bold">UF</span> {mot.uf1}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 mt-2">
                                <div className="col-span-1">PLACA VEÍCULO</div>
                                <div className="col-span-1 text-center">{mot.placa2 || ""}</div>
                                <div className="col-span-1 text-right">
                                    <span className="font-bold">TIPO</span> {mot.tipo2}{" "}
                                    <span className="font-bold">UF</span> {mot.uf2}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 mt-2">
                                <div className="col-span-1 font-bold">MOTORISTA</div>
                                <div className="col-span-2 text-left">{mot.motorista}</div>
                            </div>
                        </div>
                    </Box>
                )}
            </div>

            {/* MODAL RODOVIÁRIO */}
            {v.on("modalRodoviario") && (
                <Box className="p-0">
                    <TitleBar>INFORMAÇÕES ESPECÍFICAS DO MODAL RODOVIÁRIO - CARGA FRACIONADA</TitleBar>

                    <div className="grid grid-cols-12 gap-0 text-[8.5px]">
                        <div className="col-span-3 p-1 border-r border-black">
                            <div>RNTRC DA EMPRESA</div>
                            <div className="text-[9px]">{rod.rntrc}</div>
                        </div>

                        <div className="col-span-1 p-1 border-r border-black">
                            <div>LOTAÇÃO</div>
                            <div className="text-[9px]">{rod.lotacao}</div>
                        </div>

                        <div className="col-span-3 p-1 border-r border-black">
                            <div>DATA PREVISTA DE ENTREGA</div>
                            <div className="text-[9px]">{rod.prevEntrega}</div>
                        </div>

                        <div className="col-span-5 p-1">
                            <div className="text-center text-[7.8px]">{rod.lei}</div>
                        </div>
                    </div>
                </Box>
            )}

            {/* ADUANEIRAS */}
            {v.secOn("sec.aduaneiras", ["aduaneiras"]) && v.on("aduaneiras") && (
                <Box className="p-0">
                    <TitleBar>INFORMAÇÕES ADUANEIRAS</TitleBar>

                    <div className="p-2 text-[8.5px] leading-[1.2]">
                        <div className="grid grid-cols-12 gap-2">
                            <div className="col-span-2">No. CONTAINER: <b>{adu.noContainer}</b></div>
                            <div className="col-span-2">TIPO CONTAINER: <b>{adu.tipoContainer}</b></div>
                            <div className="col-span-2">DEVOLUÇÃO CONTAINER: <b>{adu.devolucao}</b></div>
                            <div className="col-span-2">LACRE: <b>{adu.lacre}</b></div>
                            <div className="col-span-4">LACRE COMPLEMENTAR: <b>{adu.lacreComplementar}</b></div>

                            <div className="col-span-3">NAVIO: <b>{adu.navio}</b></div>
                            <div className="col-span-2">No. DI: <b>{adu.noDI}</b></div>
                            <div className="col-span-3">RETIRADA: <b>{adu.retirada}</b></div>
                            <div className="col-span-2">N. MASTER: <b>{adu.nMaster}</b></div>
                            <div className="col-span-2">LOCAL EMBARQUE: <b>{adu.localEmbarque}</b></div>

                            <div className="col-span-2">RESERVA: <b>{adu.reserva}</b></div>
                            <div className="col-span-2">No. REFERENCIA: <b>{adu.noReferencia}</b></div>
                            <div className="col-span-3">ENTREGA: <b>{adu.entrega}</b></div>
                            <div className="col-span-2">CTRC HOUSE: <b>{adu.ctrcHouse}</b></div>
                            <div className="col-span-3 text-right">LOCAL DESEMBARQUE: <b>{adu.localDesembarque}</b> {adu.participacoes}</div>
                        </div>
                    </div>

                    <HLine />
                    <div className="grid grid-cols-5 gap-0 text-[8.5px]">
                        <div className="p-1 text-center">N° DI</div>
                        <div className="p-1 text-center">N° REFERÊNCIA</div>
                        <div className="p-1 text-center">N° RESERVA</div>
                        <div className="p-1 text-center">N° LACRE</div>
                        <div className="p-1 text-center">N° CTRC HOUSE</div>
                    </div>

                    {adu.grid?.map((r, i) => (
                        <div key={i} className="grid grid-cols-5 gap-0 text-[8.5px] border-t border-black">
                            <div className="p-1">{r.di}</div>
                            <div className="p-1">{r.referencia}</div>
                            <div className="p-1">{r.reserva}</div>
                            <div className="p-1">{r.lacre}</div>
                            <div className="p-1">{r.house}</div>
                        </div>
                    ))}
                </Box>
            )}

            {/* DECLARAÇÃO FINAL */}
            {v.secOn("sec.declaracao", ["declaracaoFinal"]) && v.on("declaracaoFinal") && (
                <Box className="p-0">
                    <div className="border-b border-black text-[8.5px] text-center font-bold py-1">
                        {dec.texto}
                    </div>

                    <div className="grid grid-cols-12 gap-0 text-[8.5px]">
                        <div className="col-span-3 p-2 border-r border-black">
                            <div className="font-bold">NOME / RG</div>
                            <div className="mt-3">{dec.nomeRG}</div>
                        </div>

                        <div className="col-span-4 p-2 border-r border-black">
                            <div className="font-bold">ASSINATURA / CARIMBO</div>
                            <div className="mt-3">{dec.assinatura}</div>
                        </div>

                        <div className="col-span-2 p-2 border-r border-black">
                            <div className="font-bold text-center">CHEGADA DATA / HORA</div>
                            <div className="mt-3 text-center">{dec.chegada}</div>
                        </div>

                        <div className="col-span-2 p-2 border-r border-black">
                            <div className="font-bold text-center">SAÍDA DATA / HORA</div>
                            <div className="mt-3 text-center">{dec.saida}</div>
                        </div>

                        <div className="col-span-1 p-0">
                            <div className="h-full grid grid-rows-2">
                                <div className="border-b border-black flex items-center justify-center text-[13px] font-bold">
                                    {dec.controle}
                                </div>
                                <div className="flex items-center justify-center text-[12px] font-bold">
                                    {dec.serie}
                                </div>
                            </div>
                        </div>
                    </div>
                </Box>
            )}
        </OuterBox>
    );
}
