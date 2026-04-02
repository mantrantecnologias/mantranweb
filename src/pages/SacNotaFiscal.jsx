// src/pages/SacNotaFiscal.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, XCircle, RotateCcw, ChevronDown, ChevronRight } from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

/* =============================
   Helpers padrão Mantran
============================= */
function Label({ children, className = "" }) {
    return (
        <label className={`text-[12px] text-gray-700 flex items-center ${className}`}>
            {children}
        </label>
    );
}

function Txt({ className = "", ...rest }) {
    return (
        <input
            {...rest}
            className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full ${className}`}
        />
    );
}

function formatarDataISO(iso) {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
}

/* =============================
   MOCK de Notas Fiscais
============================= */
const mockNotas = [
    {
        numero: "12345678",
        serie: "DTA",
        emissao: "2025-11-25",
        qtd: 1,
        peso: "1,00",
        valor: "1,00",
        m3: "1,00",
        embalagem: "CAIXA",
        produto: "CAIXA PAPELÃO / DIVERSOS",

        empresa: "001",
        coleta: "264584",
        situacao: "COLETADA",
        dataCTRC: "2025-11-25",
        minuta: "123",
        fatura: "000025C",

        ctrc: "264733",

        // Participantes
        cnpjCliente: "50.220.190/0676-2",
        razaoCliente: "HNK BR INDUSTRIA DE BEBIDAS LTDA RN",
        cidadeCliente: "NATAL",
        ufCliente: "RN",

        cnpjRemetente: "50.220.190/0676-2",
        razaoRemetente: "HNK BR INDUSTRIA DE BEBIDAS LTDA RN",
        cidadeRemetente: "NATAL",
        ufRemetente: "RN",

        cnpjDestinatario: "05.254.957/0073-52",
        razaoDestinatario: "HNK BR LOGISTICA E DISTRIBUICAO LTDA",
        cidadeDestinatario: "SALVADOR",
        ufDestinatario: "BA",

        cnpjConsignatario: "",
        razaoConsignatario: "",
        cidadeConsignatario: "",
        ufConsignatario: "",

        cnpjRedespacho: "",
        razaoRedespacho: "",
        cidadeRedespacho: "",
        ufRedespacho: "",

        modalidade: "CIF",
        condContrato: "NORMAL",
        tipoFrete: "FATURADO",

        endereco: "RODOVIA BR101 KM110,8",
        bairro: "NARANDIBA",
        cidadeEntrega: "ALAGOINHAS",
        uf: "BA",
        cidadeOrigem: "PARNAMIRIM",
        observacao: "Nenhuma observação.",

        placa: "XXX0A00",
        motorista: "JOÃO DA SILVA",
        ocorrenciaAtual: "COLETADO",

        ocorrencias: [
            {
                data: "2025-11-26",
                hora: "10:20",
                placa: "XXX0A00",
                motorista: "JOÃO",
                codigo: "01",
                descricao: "COLETADO",
                manifesto: "123",
                viagem: "456",
            },
        ],

        // CTes vinculados (para o modal CTRC/Minuta)
        ctes: [
            {
                filial: "001 - TESTE MANTRAN",
                ctrcControle: "264733",
                ctrcImpresso: "264584",
                dataEmissao: "2025-11-25",
                tipo: "N",
            },
        ],
    },

    /* ================================================
       MOCK COM DUPLICIDADE → número 102030 (DOIS REGISTROS)
    ================================================= */
    {
        numero: "102030",
        serie: "1",
        emissao: "2025-10-10",
        qtd: 3,
        peso: "150,00",
        valor: "2.500,00",
        m3: "12,50",
        embalagem: "PALLET",
        produto: "BEBIDAS",

        empresa: "002",
        coleta: "987654",
        situacao: "EM TRANSITO",
        dataCTRC: "2025-10-11",
        minuta: "555",
        fatura: "000025C",

        ctrc: "450001",

        // Participantes diferentes para aparecer no modal
        cnpjCliente: "11.111.111/0001-11",
        razaoCliente: "CLIENTE ABC LOGÍSTICA",
        cidadeCliente: "RECIFE",
        ufCliente: "PE",

        cnpjRemetente: "22.222.222/0001-22",
        razaoRemetente: "REMETENTE XPTO COMÉRCIO",
        cidadeRemetente: "JABOATÃO",
        ufRemetente: "PE",

        cnpjDestinatario: "33.333.333/0001-33",
        razaoDestinatario: "DESTINATÁRIO EXPRESS",
        cidadeDestinatario: "MACEIÓ",
        ufDestinatario: "AL",

        cnpjConsignatario: "",
        razaoConsignatario: "",
        cidadeConsignatario: "",
        ufConsignatario: "",

        cnpjRedespacho: "",
        razaoRedespacho: "",
        cidadeRedespacho: "",
        ufRedespacho: "",

        modalidade: "FOB",
        condContrato: "PROMOCIONAL",
        tipoFrete: "A FATURAR",

        endereco: "AV. BRASIL, 1500",
        bairro: "CENTRO",
        cidadeEntrega: "MACEIÓ",
        uf: "AL",
        cidadeOrigem: "RECIFE",
        observacao: "Carga frágil.",

        placa: "ABC1D23",
        motorista: "CARLOS SANTOS",
        ocorrenciaAtual: "EM TRANSITO",

        ocorrencias: [],

        ctes: [
            {
                filial: "002 - MATRIZ",
                ctrcControle: "450001",
                ctrcImpresso: "450001",
                dataEmissao: "2025-10-10",
                tipo: "N",
            },
        ],
    },

    /* SEGUNDA NOTA 102030 PARA GERAR MODAL */
    {
        numero: "102030",
        serie: "2",
        emissao: "2025-10-12",
        qtd: 1,
        peso: "20,00",
        valor: "850,00",
        m3: "1,20",
        embalagem: "CAIXA",
        produto: "ELETRÔNICOS",

        empresa: "003",
        coleta: "222222",
        situacao: "COLETADA",
        dataCTRC: "2025-10-12",
        minuta: "556",
        fatura: "000025C",

        ctrc: "450050",

        // Mudamos o CNPJ/RAZÃO para aparecer no modal
        cnpjCliente: "44.444.444/0001-44",
        razaoCliente: "CLIENTE DIGITAL LTDA",
        cidadeCliente: "ARACAJU",
        ufCliente: "SE",

        cnpjRemetente: "55.555.555/0001-55",
        razaoRemetente: "REMETENTE IMPORTAÇÃO",
        cidadeRemetente: "ARACAJU",
        ufRemetente: "SE",

        cnpjDestinatario: "66.666.666/0001-66",
        razaoDestinatario: "DESTINATÁRIO BRASIL LTDA",
        cidadeDestinatario: "SALVADOR",
        ufDestinatario: "BA",

        cnpjConsignatario: "",
        razaoConsignatario: "",
        cidadeConsignatario: "",
        ufConsignatario: "",

        cnpjRedespacho: "",
        razaoRedespacho: "",
        cidadeRedespacho: "",
        ufRedespacho: "",

        modalidade: "CIF",
        condContrato: "PADRÃO",
        tipoFrete: "FATURADO",

        endereco: "RUA DA LUZ, 100",
        bairro: "CENTRO",
        cidadeEntrega: "SALVADOR",
        uf: "BA",
        cidadeOrigem: "ARACAJU",
        observacao: "Produto sensível.",

        placa: "XYZ9Z99",
        motorista: "MÁRIO",
        ocorrenciaAtual: "COLETADA",

        ocorrencias: [],

        ctes: [
            {
                filial: "003 - FILIAL SALVADOR",
                ctrcControle: "450050",
                ctrcImpresso: "450050",
                dataEmissao: "2025-10-12",
                tipo: "N",
            },
        ],
    },
];


/* =============================
   Modal Seleção Nota Fiscal
============================= */
function ModalSelecaoNF({ lista, onSelect, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[450px] rounded-md shadow-lg border border-gray-300">
                <h2 className="text-center text-red-700 font-semibold py-2 text-sm border-b">
                    Selecionar Nota Fiscal
                </h2>

                <div className="p-3 max-h-[300px] overflow-y-auto">
                    <table className="w-full text-[13px]">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-1">CNPJ</th>
                                <th className="text-left py-1">Razão Social</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lista.map((nf, idx) => (
                                <tr
                                    key={idx}
                                    className="cursor-pointer hover:bg-red-100"
                                    onClick={() => onSelect(nf)}
                                >
                                    <td className="py-1">{nf.cnpjRemetente}</td>
                                    <td className="py-1">{nf.razaoRemetente || "Remetente"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end px-4 py-2 border-t bg-gray-50">
                    <button
                        className="px-4 py-1 text-[13px] rounded border border-gray-300 hover:bg-gray-100"
                        onClick={onClose}
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}

/* =============================
   Modal CTRC / Minuta
============================= */
function ModalCTRC({ lista, onSelect, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[650px] rounded-md shadow-lg border border-gray-300">
                <h2 className="text-red-700 font-semibold py-2 text-center border-b text-sm">
                    Conhecimentos da Nota Fiscal
                </h2>

                <div className="p-3 max-h-[350px] overflow-y-auto">
                    <table className="w-full text-[13px] border">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="p-1 text-left">Filial</th>
                                <th className="p-1 text-left">Nº CTRC Controle</th>
                                <th className="p-1 text-left">Nº CTRC Impresso</th>
                                <th className="p-1 text-left">Data Emissão</th>
                                <th className="p-1 text-left">Tipo CTRC</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lista.map((c, idx) => (
                                <tr
                                    key={idx}
                                    className="border-b hover:bg-red-100 cursor-pointer"
                                    onClick={() => onSelect(c)}
                                >
                                    <td className="p-1">{c.filial}</td>
                                    <td className="p-1">{c.ctrcControle}</td>
                                    <td className="p-1">{c.ctrcImpresso}</td>
                                    <td className="p-1">{formatarDataISO(c.dataEmissao)}</td>
                                    <td className="p-1">{c.tipo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end px-4 py-2 border-t bg-gray-50">
                    <button
                        className="px-4 py-1 text-[13px] rounded border border-gray-300 hover:bg-gray-100"
                        onClick={onClose}
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}

/* =============================
   Tela Principal
============================= */
export default function SacNotaFiscal({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    const [numeroNF, setNumeroNF] = useState("");
    const [dados, setDados] = useState(null);
    const [modalListaNF, setModalListaNF] = useState(null);
    const [modalCTRC, setModalCTRC] = useState(null);

    // Retráteis
    const [openParticipantes, setOpenParticipantes] = useState(true);
    const [openEndereco, setOpenEndereco] = useState(true);

    /* =============================
         Função Pesquisar
      ============================= */
    const pesquisar = () => {
        if (!numeroNF.trim()) return alert("Informe o número da Nota Fiscal.");

        const encontrados = mockNotas.filter((n) => n.numero === numeroNF.trim());

        if (encontrados.length === 0) return alert("Nenhuma Nota Fiscal encontrada.");

        if (encontrados.length === 1) return setDados(encontrados[0]);

        setModalListaNF(encontrados);
    };

    const limpar = () => {
        setNumeroNF("");
        setDados(null);
    };

    const selecionarNF = (nf) => {
        setModalListaNF(null);
        setDados(nf);
    };

    const abrirModalCTRC = () => {
        if (!dados?.ctes?.length) return alert("Nenhum CTRC vinculado.");
        setModalCTRC(dados.ctes);
    };

    /* =============================
         Render
      ============================= */
    return (
        <div
            className={`transition-all duration-300 mt-[44px] text-[13px]
                h-[calc(100vh-56px)] flex flex-col bg-gray-50 text-gray-700
                ${open ? "ml-[192px]" : "ml-[56px]"}`}
        >
            {/* Título */}
            <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                SAC – Nota Fiscal
            </h1>

            {/* Conteúdo */}
            <div className="flex-1 p-3 overflow-y-auto bg-white border-x border-b border-gray-300 rounded-b-md space-y-3">

                {/* =============================
                   PARÂMETROS
                ============================= */}
                <fieldset className="border border-gray-300 rounded p-3 bg-white">
                    <legend className="px-2 text-red-700 font-semibold text-[13px]">
                        Parâmetros de Pesquisa
                    </legend>

                    <div className="grid grid-cols-12 gap-2 items-center">
                        <Label className="col-span-1">Número NF</Label>
                        <Txt
                            className="col-span-2"
                            value={numeroNF}
                            onChange={(e) => setNumeroNF(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && pesquisar()}
                        />

                        <button
                            onClick={pesquisar}
                            className="col-span-1 flex items-center justify-center bg-red-700 text-white rounded hover:bg-red-800"
                        >
                            <Search size={18} />
                        </button>
                    </div>
                </fieldset>

                {/* =============================
                   DADOS DA NF
                ============================= */}
                {dados && (
                    <fieldset className="border border-gray-300 rounded p-3 bg-white">
                        <legend className="px-2 text-red-700 font-semibold text-[13px]">
                            Dados da Nota Fiscal
                        </legend>

                        <div className="space-y-2">

                            {/* ========================
                                Linha 1
                            ======================== */}
                            <div className="grid grid-cols-12 gap-2">
                                <Label className="col-span-1">Número NF</Label>
                                <Txt className="col-span-2 bg-gray-200" readOnly value={dados.numero} />

                                <Label className="col-span-1">Série</Label>
                                <Txt className="col-span-1 bg-gray-200" readOnly value={dados.serie} />

                                <Label className="col-span-1">Emissão</Label>
                                <Txt className="col-span-2 bg-gray-200" readOnly value={formatarDataISO(dados.emissao)} />

                                <Label className="col-span-1">Qtd</Label>
                                <Txt className="col-span-1 bg-gray-200" readOnly value={dados.qtd} />

                                <Label className="col-span-1">Peso</Label>
                                <Txt className="col-span-1 bg-gray-200" readOnly value={dados.peso} />
                            </div>

                            {/* ========================
                                Linha 2
                            ======================== */}
                            <div className="grid grid-cols-12 gap-2">
                                <Label className="col-span-1">Valor</Label>
                                <Txt className="col-span-2 bg-gray-200" readOnly value={dados.valor} />

                                <Label className="col-span-1">M³</Label>
                                <Txt className="col-span-1 bg-gray-200" readOnly value={dados.m3} />

                                <Label className="col-span-1">Embalagem</Label>
                                <Txt className="col-span-2 bg-gray-200" readOnly value={dados.embalagem} />

                                <Label className="col-span-1">Produto</Label>
                                <Txt className="col-span-3 bg-gray-200" readOnly value={dados.produto} />
                            </div>

                            {/* ========================
                                Linha 3
                            ======================== */}
                            <div className="grid grid-cols-12 gap-2">
                                <Label className="col-span-1">Situação</Label>
                                <Txt className="col-span-2 bg-gray-200" readOnly value={dados.situacao} />

                                <Label className="col-span-1">Coleta</Label>
                                <Txt className="col-span-1 bg-gray-200" readOnly value={dados.coleta} />

                                <Label className="col-span-1">Minuta</Label>
                                <Txt className="col-span-1 bg-gray-200" readOnly value={dados.minuta} />

                                <Label className="col-span-1">Fatura</Label>
                                <Txt className="col-span-1 bg-gray-200" readOnly value={dados.fatura} />

                                {/* Botão CTRC / Minuta */}
                                <button
                                    className="col-span-2 bg-blue-600 text-white rounded text-[12px] hover:bg-blue-700"
                                    onClick={abrirModalCTRC}
                                >
                                    CTRC / Minuta
                                </button>
                            </div>

                            {/* ========================
                                Linha 4
                            ======================== */}
                            <div className="grid grid-cols-12 gap-2">
                                <Label className="col-span-1">CTRC</Label>
                                <Txt readOnly className="col-span-2 bg-gray-200" value={dados.ctrc} />

                                <Label className="col-span-1">Data CTRC</Label>
                                <Txt readOnly className="col-span-2 bg-gray-200" value={formatarDataISO(dados.dataCTRC)} />
                            </div>
                        </div>
                    </fieldset>
                )}

                {/* =============================
                   CARD PARTICIPANTES
                ============================= */}
                {dados && (
                    <fieldset className="border border-gray-300 rounded bg-white">
                        <legend
                            className="px-2 text-red-700 font-semibold text-[13px] flex items-center cursor-pointer select-none"
                            onClick={() => setOpenParticipantes(!openParticipantes)}
                        >
                            {openParticipantes ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            <span className="ml-1">Participantes</span>
                        </legend>

                        {openParticipantes && (
                            <div className="p-3 space-y-2">

                                {/* ===== CLIENTE ===== */}
                                <div className="grid grid-cols-12 gap-2">
                                    <Label className="col-span-1">Cliente</Label>
                                    <Txt readOnly className="col-span-2 bg-gray-200" value={dados.cnpjCliente} />
                                    <Txt readOnly className="col-span-6 bg-gray-200" value={dados.razaoCliente} />
                                    <Txt readOnly className="col-span-2 bg-gray-200" value={dados.cidadeCliente} />
                                    <Txt readOnly className="col-span-1 bg-gray-200" value={dados.ufCliente} />
                                </div>

                                {/* ===== REMETENTE ===== */}
                                <div className="grid grid-cols-12 gap-2">
                                    <Label className="col-span-1">Remetente</Label>
                                    <Txt readOnly className="col-span-2 bg-gray-200" value={dados.cnpjRemetente} />
                                    <Txt readOnly className="col-span-6 bg-gray-200" value={dados.razaoRemetente} />
                                    <Txt readOnly className="col-span-2 bg-gray-200" value={dados.cidadeRemetente} />
                                    <Txt readOnly className="col-span-1 bg-gray-200" value={dados.ufRemetente} />
                                </div>

                                {/* ===== DESTINATÁRIO ===== */}
                                <div className="grid grid-cols-12 gap-2">
                                    <Label className="col-span-1">Destinatário</Label>
                                    <Txt readOnly className="col-span-2 bg-gray-200" value={dados.cnpjDestinatario} />
                                    <Txt readOnly className="col-span-6 bg-gray-200" value={dados.razaoDestinatario} />
                                    <Txt readOnly className="col-span-2 bg-gray-200" value={dados.cidadeDestinatario} />
                                    <Txt readOnly className="col-span-1 bg-gray-200" value={dados.ufDestinatario} />
                                </div>

                                {/* ===== CONSIGNATÁRIO ===== */}
                                <div className="grid grid-cols-12 gap-2">
                                    <Label className="col-span-1">Consignatário</Label>
                                    <Txt readOnly className="col-span-2 bg-gray-200" value={dados.cnpjConsignatario} />
                                    <Txt readOnly className="col-span-6 bg-gray-200" value={dados.razaoConsignatario} />
                                    <Txt readOnly className="col-span-2 bg-gray-200" value={dados.cidadeConsignatario} />
                                    <Txt readOnly className="col-span-1 bg-gray-200" value={dados.ufConsignatario} />
                                </div>

                                {/* ===== REDESPACHO ===== */}
                                <div className="grid grid-cols-12 gap-2">
                                    <Label className="col-span-1">Redespacho</Label>
                                    <Txt readOnly className="col-span-2 bg-gray-200" value={dados.cnpjRedespacho} />
                                    <Txt readOnly className="col-span-6 bg-gray-200" value={dados.razaoRedespacho} />
                                    <Txt readOnly className="col-span-2 bg-gray-200" value={dados.cidadeRedespacho} />
                                    <Txt readOnly className="col-span-1 bg-gray-200" value={dados.ufRedespacho} />
                                </div>

                            </div>
                        )}
                    </fieldset>
                )}

                {/* =============================
                   CARD ENDEREÇO
                ============================= */}
                {dados && (
                    <fieldset className="border border-gray-300 rounded bg-white">
                        <legend
                            className="px-2 text-red-700 font-semibold text-[13px] flex items-center cursor-pointer select-none"
                            onClick={() => setOpenEndereco(!openEndereco)}
                        >
                            {openEndereco ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            <span className="ml-1">Endereço</span>
                        </legend>

                        {openEndereco && (
                            <div className="p-3 space-y-2">
                                <div className="grid grid-cols-12 gap-2">
                                    <Label className="col-span-1">Endereço</Label>
                                    <Txt readOnly className="col-span-6 bg-gray-200" value={dados.endereco} />

                                    <Label className="col-span-1">Bairro</Label>
                                    <Txt readOnly className="col-span-4 bg-gray-200" value={dados.bairro} />
                                </div>

                                <div className="grid grid-cols-12 gap-2">
                                    <Label className="col-span-1">Cidade Entrega</Label>
                                    <Txt readOnly className="col-span-4 bg-gray-200" value={dados.cidadeEntrega} />

                                    <Label className="col-span-1">UF</Label>
                                    <Txt readOnly className="col-span-1 bg-gray-200" value={dados.uf} />

                                    <Label className="col-span-1">Cidade Origem</Label>
                                    <Txt readOnly className="col-span-3 bg-gray-200" value={dados.cidadeOrigem} />

                                    <Txt readOnly className="col-span-1 bg-gray-200" value={dados.uf} />
                                </div>

                                <div className="grid grid-cols-12 gap-2">
                                    <Label className="col-span-1">Observação</Label>
                                    <Txt readOnly className="col-span-11 bg-gray-200" value={dados.observacao} />
                                </div>
                            </div>
                        )}
                    </fieldset>
                )}

                {/* =============================
                   CARD OCORRÊNCIAS
                ============================= */}
                {dados && (
                    <fieldset className="border border-gray-300 rounded p-3 bg-white">
                        <legend className="px-2 text-red-700 font-semibold text-[13px]">
                            Ocorrências
                        </legend>

                        <table className="w-full text-[13px] border">
                            <thead>
                                <tr className="bg-gray-100 border-b">
                                    <th className="p-1 text-left">Data</th>
                                    <th className="p-1 text-left">Hora</th>
                                    <th className="p-1 text-left">Placa</th>
                                    <th className="p-1 text-left">Motorista</th>
                                    <th className="p-1 text-left">Código</th>
                                    <th className="p-1 text-left">Descrição</th>
                                    <th className="p-1 text-left">Manifesto</th>
                                    <th className="p-1 text-left">Viagem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dados.ocorrencias?.map((o, idx) => (
                                    <tr key={idx} className="border-b">
                                        <td className="p-1">{formatarDataISO(o.data)}</td>
                                        <td className="p-1">{o.hora}</td>
                                        <td className="p-1">{o.placa}</td>
                                        <td className="p-1">{o.motorista}</td>
                                        <td className="p-1">{o.codigo}</td>
                                        <td className="p-1">{o.descricao}</td>
                                        <td className="p-1">{o.manifesto}</td>
                                        <td className="p-1">{o.viagem}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </fieldset>
                )}
            </div>

            {/* =============================
                RODAPÉ
            ============================= */}
            <div className="flex justify-start gap-4 px-4 py-2 border-t bg-white">
                <button
                    className={`flex items-center gap-1 px-3 py-1 rounded border border-gray-300 ${footerIconColorNormal} hover:${footerIconColorHover}`}
                    onClick={limpar}
                >
                    <RotateCcw size={16} /> Limpar
                </button>

                <button
                    className={`flex items-center gap-1 px-3 py-1 rounded border border-gray-300 ${footerIconColorNormal} hover:${footerIconColorHover}`}
                    onClick={() => navigate(-1)}
                >
                    <XCircle size={16} /> Fechar
                </button>
            </div>

            {/* =============================
                MODAIS
            ============================= */}
            {modalListaNF && (
                <ModalSelecaoNF
                    lista={modalListaNF}
                    onSelect={selecionarNF}
                    onClose={() => setModalListaNF(null)}
                />
            )}

            {modalCTRC && (
                <ModalCTRC
                    lista={modalCTRC}
                    onSelect={(linha) => {
                        navigate(`/sacctrc/${linha.ctrcImpresso}`);
                    }}
                    onClose={() => setModalCTRC(null)}
                />
            )}
        </div>
    );
}
