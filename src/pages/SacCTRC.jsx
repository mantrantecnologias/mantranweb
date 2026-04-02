// src/pages/SacCTRC.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Search, RotateCcw, XCircle } from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

/* =========================
   Helpers padrão Mantran
========================= */
function Label({ children, className = "" }) {
    return (
        <label
            className={`text-[12px] text-gray-700 flex items-center ${className}`}
        >
            {children}
        </label>
    );
}

function Txt({ className = "", ...rest }) {
    return (
        <input
            {...rest}
            readOnly={rest.readOnly ?? true}
            className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full bg-gray-200 ${className}`}
        />
    );
}

/* =========================
   MOCKS – APENAS PARA TESTE
========================= */
const mockCtrcs = [
    {
        ctrc: "264584",
        filial: "001 - TESTE MANTRAN",
        empresa: "001 - MANTRAN TRANSPORTES",
        dataEmissao: "25/11/2025",
        situacao: "CTRC IMPRESSO",
        nfServico: "",
        coleta: "264584",
        modalidade: "CIF",
        tipoFrete: "FATURADO",
        controle: "264733",
        fatura: "046505C",
        viagem: "079038",

        // ABA DADOS CLIENTE
        clienteCnpj: "5022019006762",
        clienteRazao: "HNK BR INDUSTRIA DE BEBIDAS LTDA RN",
        remetenteCnpj: "5022019006762",
        remetenteRazao: "HNK BR INDUSTRIA DE BEBIDAS LTDA RN",
        destinatarioCnpj: "05254597007352",
        destinatarioRazao: "HNK BR LOGISTICA E DISTRIBUICAO LTDA",
        consignatarioCnpj: "",
        consignatarioRazao: "",
        redespachoCnpj: "",
        redespachoRazao: "",
        faturamentoCnpj: "5022019006762",
        faturamentoRazao: "HNK BR INDUSTRIA DE BEBIDAS LTDA RN",
        observacoesCliente: "Entrega dentro do prazo.",
        dtInclusaoCliente: "25/11/2025",
        operadorInclusao: "SUPORTE",
        rotina: "SAC-CTRC",

        // ABA DADOS ENTREGA
        endEntrega: "RODOVIA BR101 KM110,8",
        filialDestino: "001",
        cidadeEntrega: "ALAGOINHAS",
        bairroEntrega: "NARANDIBA",
        ufEntrega: "BA",
        cepOrigem: "59148090",
        ocorrenciaEntrega: "001 - ENTREGUE",
        dtHoraBaixa: "04/12/2025 10:30",
        dtHoraChegada: "04/12/2025 09:50",
        operadorBaixa: "SUPORTE",
        dtEntregaEfetiva: "04/12/2025",
        nomeRecebedor: "JOÃO CLIENTE",
        rgRecebedor: "1234567-8",
        dtEstorno: "__/__/____",

        // ABA NOTAS FISCAIS
        notasFiscais: [
            {
                serie: "DTA",
                numero: "12345678",
                sit: "C",
                tipo: "N",
                dataEmissao: "25/11/2025",
                qtdeVol: "1,00",
                peso: "1,00",
                pesoCalc: "1,00",
                valor: "1,00",
                m3: "0,000",
                embalagem: "000 - CAIXA DE PAPELAO PAP",
                produto: "0000 - DIVERSOS",
                condContrato: "NORMAL",
            },
        ],

        // ABA MANIFESTO
        manifestos: [
            {
                manifesto: "043569",
                origem: "001",
                destino: "001",
                dataEmissao: "04/12/2025",
                tipoManifesto: "Entrega/Coleta",
                tracao: "0000004",
                viagem: "079038",
            },
        ],

        // ABA INFORMAÇÕES
        informacoes: [
            {
                filial: "001",
                ctrc: "264584",
                dtEmissao: "25/11/2025",
                situacao: "N",
                serie: "DTA",
                notaFiscal: "12345678",
                dtEntrega: "04/12/2025",
                dtConferencia: "__/__/____",
                dtTransm: "__/__/____",
                dtRetransm: "__/__/____",
                qtd: "0",
                ocorrencia: "001",
                controle: "264733",
            },
        ],

        // ABA VALORES (simplificado)
        pesoCalculo: "1,00",
        cepOrigemCalc: "56163000",
        cepDestino: "48000990",
        tarifa: "0",
        condContratoValores: "NORMAL",
        contratoValores: "000001",
        tabela: "000000",
        vigencia: "01/01/2018",
        codigoFiscal: "6932",

        fretePeso: "1,00",
        itr: "0,00",
        taxaColeta: "0,00",
        estacionamento: "0,00",
        imoAdesivagem: "0,00",
        desova: "0,00",
        retorno: "0,00",
        totalGeneralidades: "0,00",

        freteValor: "0,00",
        pedagio: "0,00",
        descarga: "0,00",
        emissaoDTA: "0,00",
        impostoSuspenso: "0,00",
        taxAgavero: "0,00",
        taxRefrigerada: "0,00",
        tipoImposto: "ICMS",
        cfopCst: "6932 90",

        despacho: "0,00",
        valorOutros: "0,00",
        estadia: "0,00",
        imoCargaPerigosa: "0,00",
        emissaoCTe: "0,00",
        cancelamento: "0,00",
        plataforma: "0,00",
        secCat: "0,00",
        taxaEntrega: "0,00",
        escolta: "0,00",
        monitoramento: "0,00",
        taxOva: "0,00",
        taxAnvisa: "0,00",
        noturno: "0,00",

        baseIss: "0,00",
        aliquotaIss: "0,00",
        valorIss: "0,00",

        baseIcms: "1,14",
        aliquotaIcms: "12,00",
        valorIcms: "0,14",

        icmsSt: "0,00",
        isentoIcms: "0,00",
        pisCofins: "0,00",

        freteCalculado: "1,00",
        totalFrete: "1,00",

        // ABA FATURAMENTO
        faturamento: [
            {
                emp: "001",
                numero: "046505C",
                dtEmissao: "04/12/2025",
                dtVencimento: "14/12/2025",
                valorFatura: "1,14",
                percDesconto: "0,00",
                valorDesconto: "0,00",
                percJuros: "0,00",
                valorMoraDia: "0,00",
                banco: "077",
                nomeBanco: "BANCO INTER SA",
                agencia: "",
                numeroBoleto: "",
            },
        ],

        // ABA COMEX – CAMPOS
        comex: {
            numeroContainer: "CONT-001",
            tipo: "20'",
            tara: "0",
            valorContainer: "0,00",
            armador: "ARMADOR EXEMPLO",
            exportador: "EXPORTADOR EXEMPLO",
            localEmbarque: "PORTO NATAL",
            localDesembarque: "PORTO SANTOS",
            terminalRetiradaCodigo: "003",
            terminalRetiradaNome: "RODRIMAR",
            terminalEntregaCodigo: "005",
            terminalEntregaNome: "SANTEL CUBATÃO",
            ctrcMaster: "MASTER-001",
            ctrcHouse: "HOUSE-001",
            nomeNavio: "NAVIO EXEMPLO",
            impostosSuspensos: "0,00",

            dataProgramacao: "__/__/____",
            devolveContainer: "__/__/____",
            chegadaCliente: "__/__/____",
            estacionouDoca: "__/__/____",
            inicioSanitizacao: "__/__/____",
            fimSanitizacao: "__/__/____",
            inicioCarregamento: "__/__/____",
            fimCarregamento: "__/__/____",
            liberacaoNotaFiscal: "__/__/____",
            saidaCliente: "__/__/____",
        },

        // ABA DOCS ÁDUA
        docsAduaCampos: {
            diDta: "20/1234567-8",
            referencia: "REF-001",
            reserva: "RSV-123",
            lacre: "LC98765",
            lacreCompl: "LC12345",
        },
        docsAduaLista: [
            {
                diDta: "20/1234567-8",
                processo: "1234567890",
                referencia: "REF-001",
                reserva: "RSV-123",
                lacre: "LC98765",
                lacreCompl: "LC12345",
                ctrcHouse: "HOUSE-001",
                nf: "12345678",
                nfSerie: "DTA",
                invoice: "INV-2025-001",
            },
        ],
    },
];

/* =========================
   COMPONENTE PRINCIPAL
========================= */

export default function SacCTRC({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();
    const { ctrc: ctrcParam } = useParams();


    const [filtros, setFiltros] = useState({
        empresa: "",
        filial: "",
        ctrc: "",
        serie: "",
        controle: "",
        minuta: "",
    });

    const [dados, setDados] = useState(null);
    const [activeTab, setActiveTab] = useState("cliente");
    const [mostrarParametros, setMostrarParametros] = useState(!ctrcParam);

    // Carrega automaticamente se veio CTRC pela URL
    useEffect(() => {
        if (ctrcParam) {
            setMostrarParametros(false); // <=== OCULTA O CARD 1
            const encontrado = mockCtrcs.find((c) => c.ctrc === ctrcParam);
            if (encontrado) {
                setDados(encontrado);
            } else {
                alert("CTRC não encontrado nos mocks.");
            }
        }
    }, [ctrcParam]);

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros((old) => ({ ...old, [name]: value }));
    };

    const pesquisar = () => {
        const numero = filtros.ctrc.trim();
        if (!numero) {
            alert("Informe o número do CTRC para pesquisar.");
            return;
        }

        const encontrado = mockCtrcs.find((c) => c.ctrc === numero);
        if (!encontrado) {
            alert("CTRC não encontrado nos mocks.");
            return;
        }

        setDados(encontrado);
    };

    const limpar = () => {
        setFiltros({
            empresa: "",
            filial: "",
            ctrc: "",
            serie: "",
            controle: "",
            minuta: "",
        });
        setDados(null);
        setActiveTab("cliente");
    };

    /* =========================
         RENDER
    ========================== */
    return (
        <div
            className={`transition-all duration-300 mt-[44px] text-[13px]
        h-[calc(100vh-56px)] flex flex-col bg-gray-50 text-gray-700
        ${open ? "ml-[192px]" : "ml-[56px]"}`}
        >
            {/* TÍTULO */}
            <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                SAC – CTRC
            </h1>

            {/* CONTEÚDO */}
            <div className="flex-1 p-3 overflow-y-auto bg-white border-x border-b border-gray-300 rounded-b-md space-y-3">

                {/* =========================
            CARD 1 - PARÂMETROS
           (só aparece se NÃO veio CTRC na rota)
        ========================== */}
                {mostrarParametros && (
                    <fieldset className="border border-gray-300 rounded p-3 bg-white">
                        <legend className="px-2 text-red-700 font-semibold text-[13px]">
                            Parâmetros de Pesquisa
                        </legend>

                        <div className="grid grid-cols-12 gap-2 mb-2">
                            <Label className="col-span-1">Empresa</Label>
                            <Txt
                                className="col-span-2"
                                readOnly={false}
                                value={filtros.empresa}
                                onChange={handleFiltroChange}
                                name="empresa"
                                classNameExtra=""
                            />

                            <Label className="col-span-1">Filial</Label>
                            <Txt
                                className="col-span-1"
                                readOnly={false}
                                value={filtros.filial}
                                onChange={handleFiltroChange}
                                name="filial"
                            />

                            <Label className="col-span-1">CTRC</Label>
                            <Txt
                                className="col-span-2"
                                readOnly={false}
                                value={filtros.ctrc}
                                onChange={handleFiltroChange}
                                name="ctrc"
                                onKeyDown={(e) => e.key === "Enter" && pesquisar()}
                            />

                            <Label className="col-span-1">Série</Label>
                            <Txt
                                className="col-span-1"
                                readOnly={false}
                                value={filtros.serie}
                                onChange={handleFiltroChange}
                                name="serie"
                            />

                            <Label className="col-span-1">Nº Controle</Label>
                            <Txt
                                className="col-span-1"
                                readOnly={false}
                                value={filtros.controle}
                                onChange={handleFiltroChange}
                                name="controle"
                            />

                            <Label className="col-span-1">Nº Minuta</Label>
                            <Txt
                                className="col-span-1"
                                readOnly={false}
                                value={filtros.minuta}
                                onChange={handleFiltroChange}
                                name="minuta"
                            />

                            <button
                                onClick={pesquisar}
                                className="col-span-1 flex items-center justify-center bg-red-700 text-white rounded hover:bg-red-800"
                            >
                                <Search size={18} />
                            </button>
                        </div>
                    </fieldset>
                )}

                {/* =========================
            CARD 2 - DADOS DO CTRC
        ========================== */}
                {dados && (
                    <fieldset className="border border-gray-300 rounded p-3 bg-white">
                        <legend className="px-2 text-red-700 font-semibold text-[13px]">
                            Dados do CTRC
                        </legend>

                        <div className="space-y-2">
                            {/* Linha 1 */}
                            <div className="grid grid-cols-12 gap-2">
                                <Label className="col-span-1">Filial</Label>
                                <Txt className="col-span-4" value={dados.filial} />

                                <Label className="col-span-1">NF Serviço</Label>
                                <Txt className="col-span-2" value={dados.nfServico} />

                                <Label className="col-span-1">Nº CTRC</Label>
                                <Txt className="col-span-3" value={dados.ctrc} />
                            </div>

                            {/* Linha 2 */}
                            <div className="grid grid-cols-12 gap-2">
                                <Label className="col-span-1">Empresa</Label>
                                <Txt className="col-span-4" value={dados.empresa} />

                                <Label className="col-span-1">Coleta</Label>
                                <Txt className="col-span-2" value={dados.coleta} />

                                <Label className="col-span-1">Controle</Label>
                                <Txt className="col-span-3" value={dados.controle} />
                            </div>

                            {/* Linha 3 */}
                            <div className="grid grid-cols-12 gap-2">
                                <Label className="col-span-1">Data Emissão</Label>
                                <Txt className="col-span-2" value={dados.dataEmissao} />

                                <Label className="col-span-1">Modalidade</Label>
                                <Txt className="col-span-1" value={dados.modalidade} />

                                <Label className="col-span-1">Tipo Frete</Label>
                                <Txt className="col-span-2" value={dados.tipoFrete} />

                                <Label className="col-span-1">Fatura</Label>
                                <Txt className="col-span-3" value={dados.fatura} />
                            </div>

                            {/* Linha 4 */}
                            <div className="grid grid-cols-12 gap-2">
                                <Label className="col-span-1">Situação</Label>
                                <Txt className="col-span-2" value={dados.situacao} />

                                <Label className="col-span-1">Viagem</Label>
                                <Txt className="col-span-1" value={dados.viagem} />
                            </div>
                        </div>
                    </fieldset>
                )}

                {/* =========================
            CARD 3 - ABAS
        ========================== */}
                {dados && (
                    <div className="border border-gray-300 rounded bg-white">
                        {/* Aba header */}
                        <div className="flex border-b bg-gray-50 text-[12px]">
                            {[
                                ["cliente", "Dados Cliente"],
                                ["entrega", "Dados Entrega"],
                                ["notas", "Notas Fiscais"],
                                ["manifesto", "Manifesto"],
                                ["informacoes", "Informações"],
                                ["valores", "Valores"],
                                ["faturamento", "Faturamento"],
                                ["comex", "Comex"],
                                ["docs", "Docs Ádua"],
                            ].map(([id, label]) => (
                                <button
                                    key={id}
                                    className={`px-3 py-1 border-r text-xs ${activeTab === id
                                        ? "bg-white text-red-700 font-semibold"
                                        : "bg-gray-100 hover:bg-gray-200"
                                        }`}
                                    onClick={() => setActiveTab(id)}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Conteúdo da aba */}
                        <div className="p-3">
                            {/* =======================
                  ABA DADOS CLIENTE
              ======================== */}
                            {activeTab === "cliente" && (
                                <div className="space-y-2">
                                    {[
                                        [
                                            "CGC/CPF Cliente",
                                            dados.clienteCnpj,
                                            "Cliente",
                                            dados.clienteRazao,
                                        ],
                                        [
                                            "CGC/CPF Remetente",
                                            dados.remetenteCnpj,
                                            "Remetente",
                                            dados.remetenteRazao,
                                        ],
                                        [
                                            "CGC/CPF Destinatário",
                                            dados.destinatarioCnpj,
                                            "Destinatário",
                                            dados.destinatarioRazao,
                                        ],
                                        [
                                            "CGC/CPF Consignatário",
                                            dados.consignatarioCnpj,
                                            "Consignatário",
                                            dados.consignatarioRazao,
                                        ],
                                        [
                                            "CGC/CPF Redespacho",
                                            dados.redespachoCnpj,
                                            "Redespacho",
                                            dados.redespachoRazao,
                                        ],
                                        [
                                            "CGC/CPF Faturamento",
                                            dados.faturamentoCnpj,
                                            "Faturamento",
                                            dados.faturamentoRazao,
                                        ],
                                    ].map(([l1, v1, l2, v2], idx) => (
                                        <div className="grid grid-cols-12 gap-2" key={idx}>
                                            <Label className="col-span-2">{l1}</Label>
                                            <Txt className="col-span-4" value={v1} />
                                            <Label className="col-span-2">{l2}</Label>
                                            <Txt className="col-span-4" value={v2} />
                                        </div>
                                    ))}

                                    {/* Observações */}
                                    <div className="grid grid-cols-12 gap-2 mt-2">
                                        <Label className="col-span-2">Observações</Label>
                                        <Txt
                                            className="col-span-10 h-[40px]"
                                            value={dados.observacoesCliente}
                                        />
                                    </div>

                                    {/* Inclusão / Operador / Rotina */}
                                    <div className="grid grid-cols-12 gap-2 mt-2">
                                        <Label className="col-span-2">Inclusão</Label>
                                        <Txt
                                            className="col-span-2"
                                            value={dados.dtInclusaoCliente}
                                        />

                                        <Label className="col-span-2">Operador Inclusão</Label>
                                        <Txt
                                            className="col-span-3"
                                            value={dados.operadorInclusao}
                                        />

                                        <Label className="col-span-1">Rotina</Label>
                                        <Txt className="col-span-2" value={dados.rotina} />
                                    </div>
                                </div>
                            )}

                            {/* =======================
                  ABA DADOS ENTREGA
              ======================== */}
                            {activeTab === "entrega" && (
                                <div className="space-y-2">
                                    <div className="grid grid-cols-12 gap-2">
                                        <Label className="col-span-2">End. Entrega</Label>
                                        <Txt className="col-span-6" value={dados.endEntrega} />

                                        <Label className="col-span-1">Bairro</Label>
                                        <Txt className="col-span-3" value={dados.bairroEntrega} />
                                    </div>

                                    <div className="grid grid-cols-12 gap-2">
                                        <Label className="col-span-2">Filial Destino</Label>
                                        <Txt className="col-span-2" value={dados.filialDestino} />

                                        <Label className="col-span-2">Cid. Entrega</Label>
                                        <Txt className="col-span-3" value={dados.cidadeEntrega} />

                                        <Label className="col-span-1">UF</Label>
                                        <Txt className="col-span-2" value={dados.ufEntrega} />
                                    </div>

                                    <div className="grid grid-cols-12 gap-2">
                                        <Label className="col-span-2">Cep Origem</Label>
                                        <Txt className="col-span-2" value={dados.cepOrigem} />

                                        <Label className="col-span-2">Ocorrência</Label>
                                        <Txt
                                            className="col-span-6"
                                            value={dados.ocorrenciaEntrega}
                                        />
                                    </div>

                                    <div className="grid grid-cols-12 gap-2">
                                        <Label className="col-span-2">Data / Hora Baixa</Label>
                                        <Txt className="col-span-2" value={dados.dtHoraBaixa} />

                                        <Label className="col-span-2">
                                            Data / Hora Chegada Cliente
                                        </Label>
                                        <Txt className="col-span-2" value={dados.dtHoraChegada} />
                                    </div>

                                    <div className="grid grid-cols-12 gap-2">
                                        <Label className="col-span-2">Operador Baixa</Label>
                                        <Txt
                                            className="col-span-2"
                                            value={dados.operadorBaixa}
                                        />

                                        <Label className="col-span-2">Entrega</Label>
                                        <Txt
                                            className="col-span-2"
                                            value={dados.dtEntregaEfetiva}
                                        />

                                        <Label className="col-span-1">Data Estorno</Label>
                                        <Txt className="col-span-3" value={dados.dtEstorno} />
                                    </div>

                                    <div className="grid grid-cols-12 gap-2">
                                        <Label className="col-span-2">Nome Recebedor</Label>
                                        <Txt
                                            className="col-span-6"
                                            value={dados.nomeRecebedor}
                                        />

                                        <Label className="col-span-1">RG Recebedor</Label>
                                        <Txt
                                            className="col-span-3"
                                            value={dados.rgRecebedor}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* =======================
                  ABA NOTAS FISCAIS
              ======================== */}
                            {activeTab === "notas" && (
                                <div>
                                    <div className="w-full overflow-x-auto border border-gray-300 rounded">
                                        <table className="min-w-max text-[13px] border-collapse w-full">
                                            <thead>
                                                <tr className="bg-gray-100 border-b border-gray-300 text-left">
                                                    <th className="p-1">Série</th>
                                                    <th className="p-1">Nr. NF</th>
                                                    <th className="p-1">Sít</th>
                                                    <th className="p-1">Tipo</th>
                                                    <th className="p-1">DT Emissão</th>
                                                    <th className="p-1">Qtde Vols</th>
                                                    <th className="p-1">Peso</th>
                                                    <th className="p-1">Peso Calc</th>
                                                    <th className="p-1">Valor</th>
                                                    <th className="p-1">M³</th>
                                                    <th className="p-1">Embalagem</th>
                                                    <th className="p-1">Produto</th>
                                                    <th className="p-1">Condição de Contrato</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dados.notasFiscais?.map((nf, i) => (
                                                    <tr
                                                        key={i}
                                                        className="border-b border-gray-200 bg-yellow-50/40"
                                                    >
                                                        <td className="p-1">{nf.serie}</td>
                                                        <td className="p-1">{nf.numero}</td>
                                                        <td className="p-1">{nf.sit}</td>
                                                        <td className="p-1">{nf.tipo}</td>
                                                        <td className="p-1">{nf.dataEmissao}</td>
                                                        <td className="p-1">{nf.qtdeVol}</td>
                                                        <td className="p-1">{nf.peso}</td>
                                                        <td className="p-1">{nf.pesoCalc}</td>
                                                        <td className="p-1">{nf.valor}</td>
                                                        <td className="p-1">{nf.m3}</td>
                                                        <td className="p-1">{nf.embalagem}</td>
                                                        <td className="p-1">{nf.produto}</td>
                                                        <td className="p-1">{nf.condContrato}</td>
                                                    </tr>
                                                ))}
                                                {(!dados.notasFiscais ||
                                                    dados.notasFiscais.length === 0) && (
                                                        <tr>
                                                            <td
                                                                colSpan={13}
                                                                className="p-2 text-center text-gray-500"
                                                            >
                                                                Nenhum documento encontrado.
                                                            </td>
                                                        </tr>
                                                    )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="mt-1 text-[12px] text-gray-700">
                                        {dados.notasFiscais?.length || 0} Documentos
                                    </div>
                                </div>
                            )}

                            {/* =======================
                  ABA MANIFESTO
              ======================== */}
                            {activeTab === "manifesto" && (
                                <div>
                                    <div className="w-full overflow-x-auto border border-gray-300 rounded">
                                        <table className="min-w-max text-[13px] border-collapse w-full">
                                            <thead>
                                                <tr className="bg-gray-100 border-b border-gray-300 text-left">
                                                    <th className="p-1">Manifesto</th>
                                                    <th className="p-1">Origem</th>
                                                    <th className="p-1">Destino</th>
                                                    <th className="p-1">DT Emissão</th>
                                                    <th className="p-1">Tipo do Manifesto</th>
                                                    <th className="p-1">Tração</th>
                                                    <th className="p-1">Nº Viagem</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dados.manifestos?.map((m, i) => (
                                                    <tr
                                                        key={i}
                                                        className="border-b border-gray-200 bg-yellow-50/40"
                                                    >
                                                        <td className="p-1">{m.manifesto}</td>
                                                        <td className="p-1">{m.origem}</td>
                                                        <td className="p-1">{m.destino}</td>
                                                        <td className="p-1">{m.dataEmissao}</td>
                                                        <td className="p-1">{m.tipoManifesto}</td>
                                                        <td className="p-1">{m.tracao}</td>
                                                        <td className="p-1">{m.viagem}</td>
                                                    </tr>
                                                ))}
                                                {(!dados.manifestos || dados.manifestos.length === 0) && (
                                                    <tr>
                                                        <td
                                                            colSpan={7}
                                                            className="p-2 text-center text-gray-500"
                                                        >
                                                            Nenhum manifesto encontrado.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="mt-1 text-[12px] text-gray-700">
                                        {dados.manifestos?.length || 0} Documentos
                                    </div>
                                </div>
                            )}

                            {/* =======================
                  ABA INFORMAÇÕES
              ======================== */}
                            {activeTab === "informacoes" && (
                                <div>
                                    <div className="w-full overflow-x-auto border border-gray-300 rounded bg-gray-200">
                                        <table className="min-w-max text-[13px] border-collapse w-full">
                                            <thead>
                                                <tr className="bg-gray-100 border-b border-gray-300 text-left">
                                                    <th className="p-1">Filial</th>
                                                    <th className="p-1">CTRC</th>
                                                    <th className="p-1">DT Emissão</th>
                                                    <th className="p-1">Sít</th>
                                                    <th className="p-1">Série</th>
                                                    <th className="p-1">Nota Fiscal</th>
                                                    <th className="p-1">DT Entrega</th>
                                                    <th className="p-1">DT Conferência</th>
                                                    <th className="p-1">DT Transm</th>
                                                    <th className="p-1">DT Retransm</th>
                                                    <th className="p-1">Qtd</th>
                                                    <th className="p-1">Ocorrência</th>
                                                    <th className="p-1">Controle</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dados.informacoes?.map((inf, i) => (
                                                    <tr
                                                        key={i}
                                                        className="border-b border-gray-200 bg-yellow-50/40"
                                                    >
                                                        <td className="p-1">{inf.filial}</td>
                                                        <td className="p-1">{inf.ctrc}</td>
                                                        <td className="p-1">{inf.dtEmissao}</td>
                                                        <td className="p-1">{inf.situacao}</td>
                                                        <td className="p-1">{inf.serie}</td>
                                                        <td className="p-1">{inf.notaFiscal}</td>
                                                        <td className="p-1">{inf.dtEntrega}</td>
                                                        <td className="p-1">{inf.dtConferencia}</td>
                                                        <td className="p-1">{inf.dtTransm}</td>
                                                        <td className="p-1">{inf.dtRetransm}</td>
                                                        <td className="p-1">{inf.qtd}</td>
                                                        <td className="p-1">{inf.ocorrencia}</td>
                                                        <td className="p-1">{inf.controle}</td>
                                                    </tr>
                                                ))}
                                                {(!dados.informacoes ||
                                                    dados.informacoes.length === 0) && (
                                                        <tr>
                                                            <td
                                                                colSpan={13}
                                                                className="p-2 text-center text-gray-500"
                                                            >
                                                                Nenhuma informação encontrada.
                                                            </td>
                                                        </tr>
                                                    )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="mt-1 text-[12px] text-gray-700">
                                        {dados.informacoes?.length || 0} Documentos
                                    </div>
                                </div>
                            )}

                            {/* =======================
    ABA VALORES
======================= */}
                            {activeTab === "valores" && (
                                <div className="space-y-4">

                                    {/* ------------------------
            BLOCO SUPERIOR (LINHA A LINHA)
        ------------------------ */}
                                    <div className="space-y-2">

                                        {/* Peso Cálculo / Cep Origem / Cep Destino */}
                                        <div className="grid grid-cols-12 gap-2">
                                            <Label className="col-span-1">Peso Cálculo</Label>
                                            <Txt className="col-span-2" value={dados.pesoCalculo} />

                                            <Label className="col-span-1">Cep Origem</Label>
                                            <Txt className="col-span-2" value={dados.cepOrigemCalc} />

                                            <Label className="col-span-1">Cep Destino</Label>
                                            <Txt className="col-span-2" value={dados.cepDestino} />
                                            <Label className="col-span-1">Código Fiscal</Label>
                                            <Txt className="col-span-2" value={dados.codigoFiscal} />
                                        </div>

                                        {/* Cond. Contrato / Contrato / Tabela */}
                                        <div className="grid grid-cols-12 gap-2">
                                            <Label className="col-span-1">Cond. Contrato</Label>
                                            <Txt className="col-span-2" value={dados.condContratoValores} />

                                            <Label className="col-span-1">Contrato</Label>
                                            <Txt className="col-span-2" value={dados.contratoValores} />

                                            <Label className="col-span-1">Tabela</Label>
                                            <Txt className="col-span-2" value={dados.tabela} />
                                            <Label className="col-span-1">Vigência</Label>
                                            <Txt className="col-span-2" value={dados.vigencia} />
                                        </div>


                                    </div>
                                    {/* Linha divisória suave */}
                                    <div className="w-full border-t border-gray-300 my-2" />

                                    {/* ------------------------
           4 COLUNAS DE TAXAS (col-span-3)
        ------------------------ */}
                                    <div className="grid grid-cols-12 gap-4">

                                        {/* Coluna 1 */}
                                        <div className="col-span-3 space-y-2">
                                            {[
                                                ["Frete Peso", dados.fretePeso],
                                                ["I.T.R.", dados.itr],
                                                ["Taxa Coleta", dados.taxaColeta],
                                                ["Estacionamento", dados.estacionamento],
                                                ["IMO Adesivagem", dados.imoAdesivagem],
                                                ["Taxa de Desova", dados.desova],
                                                ["Taxa Retorno", dados.retorno],
                                                ["Total Generalidades", dados.totalGeneralidades],
                                            ].map(([label, value], idx) => (
                                                <div key={idx} className="grid grid-cols-12 gap-2">
                                                    <Label className="col-span-6">{label}</Label>
                                                    <Txt className="col-span-6" value={value} />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Coluna 2 */}
                                        <div className="col-span-3 space-y-2">
                                            {[
                                                ["Frete Valor", dados.freteValor],
                                                ["Pedágio", dados.pedagio],
                                                ["Descarga", dados.descarga],
                                                ["Emissão DTA", dados.emissaoDTA],
                                                ["Imposto Suspenso", dados.impostoSuspenso],
                                                ["Taxa Agavero", dados.taxAgavero],
                                                ["Taxa Refrigerada", dados.taxRefrigerada],
                                                ["Tipo de Imposto", dados.tipoImposto],
                                            ].map(([label, value], idx) => (
                                                <div key={idx} className="grid grid-cols-12 gap-2">
                                                    <Label className="col-span-6">{label}</Label>
                                                    <Txt className="col-span-6" value={value} />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Coluna 3 */}
                                        <div className="col-span-3 space-y-2">
                                            {[
                                                ["Ad. Noturno", dados.noturno],
                                                ["Despacho", dados.despacho],
                                                ["Valor Outros", dados.valorOutros],
                                                ["Estadia", dados.estadia],
                                                ["IMO Carga Perigosa", dados.imoCargaPerigosa],
                                                ["Taxa Emissão CTe", dados.emissaoCTe],
                                                ["Taxa Cancelamento", dados.cancelamento],
                                                ["Taxa Plataforma", dados.plataforma],
                                            ].map(([label, value], idx) => (
                                                <div key={idx} className="grid grid-cols-12 gap-2">
                                                    <Label className="col-span-6">{label}</Label>
                                                    <Txt className="col-span-6" value={value} />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Coluna 4 */}
                                        <div className="col-span-3 space-y-2">
                                            {[
                                                ["Sec-Cat", dados.secCat],
                                                ["Taxa Entrega", dados.taxaEntrega],
                                                ["Escolta", dados.escolta],
                                                ["Monitoramento", dados.monitoramento],
                                                ["Taxa de Ova", dados.taxOva],
                                                ["Taxa Anvisa", dados.taxAnvisa],

                                            ].map(([label, value], idx) => (
                                                <div key={idx} className="grid grid-cols-12 gap-2">
                                                    <Label className="col-span-6">{label}</Label>
                                                    <Txt className="col-span-6" value={value} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="w-full border-t border-gray-300 my-2" />
                                    {/* ------------------------
           IMPOSTOS
        ------------------------ */}
                                    <div className="grid grid-cols-12 gap-4">

                                        {/* ISS */}
                                        <div className="col-span-3 space-y-2">
                                            <div className="grid grid-cols-12 gap-2">
                                                <Label className="col-span-6">Base de ISS</Label>
                                                <Txt className="col-span-6" value={dados.baseIss} />
                                            </div>
                                            <div className="grid grid-cols-12 gap-2">
                                                <Label className="col-span-6">Alíquota ISS</Label>
                                                <Txt className="col-span-6" value={dados.aliquotaIss} />
                                            </div>
                                            <div className="grid grid-cols-12 gap-2">
                                                <Label className="col-span-6">Valor do ISS</Label>
                                                <Txt className="col-span-6" value={dados.valorIss} />
                                            </div>
                                        </div>

                                        {/* ICMS */}
                                        <div className="col-span-3 space-y-2">
                                            <div className="grid grid-cols-12 gap-2">
                                                <Label className="col-span-6">Base ICMS</Label>
                                                <Txt className="col-span-6" value={dados.baseIcms} />
                                            </div>
                                            <div className="grid grid-cols-12 gap-2">
                                                <Label className="col-span-6">Alíquota ICMS</Label>
                                                <Txt className="col-span-6" value={dados.aliquotaIcms} />
                                            </div>
                                            <div className="grid grid-cols-12 gap-2">
                                                <Label className="col-span-6">Valor ICMS</Label>
                                                <Txt className="col-span-6" value={dados.valorIcms} />
                                            </div>
                                        </div>

                                        {/* Outros */}
                                        <div className="col-span-3 space-y-2">
                                            <div className="grid grid-cols-12 gap-2">
                                                <Label className="col-span-6">Valor ICMS ST</Label>
                                                <Txt className="col-span-6" value={dados.icmsSt} />
                                            </div>
                                            <div className="grid grid-cols-12 gap-2">
                                                <Label className="col-span-6">Isento ICMS</Label>
                                                <Txt className="col-span-6" value={dados.isentoIcms} />
                                            </div>
                                            <div className="grid grid-cols-12 gap-2">
                                                <Label className="col-span-6">PIS/COFINS</Label>
                                                <Txt className="col-span-6" value={dados.pisCofins} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* ------------------------
           TOTAIS
        ------------------------ */}
                                    <div className="grid grid-cols-12 mt-4">
                                        <div className="col-span-9" />
                                        <div className="col-span-3 text-right text-[14px] font-semibold">
                                            <div className="flex justify-between text-blue-700">
                                                <span>FRETE CALCULADO:</span>
                                                <span className="text-red-600">{dados.freteCalculado}</span>
                                            </div>

                                            <div className="flex justify-between text-blue-700 mt-1">
                                                <span>TOTAL DO FRETE:</span>
                                                <span className="text-red-600">{dados.totalFrete}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}


                            {/* =======================
                  ABA FATURAMENTO
              ======================== */}
                            {activeTab === "faturamento" && (
                                <div>
                                    <div className="w-full overflow-x-auto">
                                        <table className="w-full text-[13px] border border-gray-300">
                                            <thead>
                                                <tr className="bg-gray-100 border-b">
                                                    <th className="p-1 text-left">Emp</th>
                                                    <th className="p-1 text-left">Nº Fatura</th>
                                                    <th className="p-1 text-left">DT Emissão</th>
                                                    <th className="p-1 text-left">DT Vencimento</th>
                                                    <th className="p-1 text-left">Vl. da Fatura</th>
                                                    <th className="p-1 text-left">% Desconto</th>
                                                    <th className="p-1 text-left">Vl. Desconto</th>
                                                    <th className="p-1 text-left">% Juros</th>
                                                    <th className="p-1 text-left">Vl. Mora Dia</th>
                                                    <th className="p-1 text-left">Banco</th>
                                                    <th className="p-1 text-left">Nome do Banco</th>
                                                    <th className="p-1 text-left">Agencia</th>
                                                    <th className="p-1 text-left">Nº do Boleto</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dados.faturamento?.map((fat, idx) => (
                                                    <tr key={idx} className="border-b bg-yellow-50/40">
                                                        <td className="p-1">{fat.emp}</td>
                                                        <td className="p-1">{fat.numero}</td>
                                                        <td className="p-1">{fat.dtEmissao}</td>
                                                        <td className="p-1">{fat.dtVencimento}</td>
                                                        <td className="p-1">{fat.valorFatura}</td>
                                                        <td className="p-1">{fat.percDesconto}</td>
                                                        <td className="p-1">{fat.valorDesconto}</td>
                                                        <td className="p-1">{fat.percJuros}</td>
                                                        <td className="p-1">{fat.valorMoraDia}</td>
                                                        <td className="p-1">{fat.banco}</td>
                                                        <td className="p-1">{fat.nomeBanco}</td>
                                                        <td className="p-1">{fat.agencia}</td>
                                                        <td className="p-1">{fat.numeroBoleto}</td>
                                                    </tr>
                                                ))}
                                                {(!dados.faturamento ||
                                                    dados.faturamento.length === 0) && (
                                                        <tr>
                                                            <td
                                                                colSpan={13}
                                                                className="p-2 text-center text-gray-500"
                                                            >
                                                                Nenhum faturamento encontrado.
                                                            </td>
                                                        </tr>
                                                    )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* =======================
                  ABA COMEX (Opção B – 2 cards)
              ======================== */}
                            {activeTab === "comex" && (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-12 gap-4">
                                        {/* Card 1 - Dados do Container / locais */}
                                        <fieldset className="col-span-6 border border-gray-300 rounded p-3">
                                            <legend className="px-2 text-red-700 text-[13px]">
                                                Dados do Container
                                            </legend>

                                            <div className="space-y-2">
                                                <div className="grid grid-cols-12 gap-2">
                                                    <Label className="col-span-3">Nº Container</Label>
                                                    <Txt
                                                        className="col-span-3"
                                                        value={dados.comex.numeroContainer}
                                                    />
                                                    <Label className="col-span-1">Tipo</Label>
                                                    <Txt
                                                        className="col-span-2"
                                                        value={dados.comex.tipo}
                                                    />
                                                    <Label className="col-span-1">Tara</Label>
                                                    <Txt
                                                        className="col-span-2"
                                                        value={dados.comex.tara}
                                                    />
                                                </div>






                                                <div className="grid grid-cols-12 gap-2">
                                                    <Label className="col-span-3">Valor Container</Label>
                                                    <Txt
                                                        className="col-span-3"
                                                        value={dados.comex.valorContainer}
                                                    />

                                                    <Label className="col-span-3">
                                                        Impostos Suspensos
                                                    </Label>
                                                    <Txt
                                                        className="col-span-3"
                                                        value={dados.comex.impostosSuspensos}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-12 gap-2">
                                                    <Label className="col-span-3">Armador</Label>
                                                    <Txt
                                                        className="col-span-9"
                                                        value={dados.comex.armador}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-12 gap-2">
                                                    <Label className="col-span-3">Exportador</Label>
                                                    <Txt
                                                        className="col-span-9"
                                                        value={dados.comex.exportador}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-12 gap-2">
                                                    <Label className="col-span-3">Local Embarque</Label>
                                                    <Txt
                                                        className="col-span-9"
                                                        value={dados.comex.localEmbarque}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-12 gap-2">
                                                    <Label className="col-span-3">
                                                        Local Desembarque
                                                    </Label>
                                                    <Txt
                                                        className="col-span-9"
                                                        value={dados.comex.localDesembarque}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-12 gap-2">
                                                    <Label className="col-span-3">Terminal Retirada</Label>
                                                    <Txt
                                                        className="col-span-2"
                                                        value={dados.comex.terminalRetiradaCodigo}
                                                    />
                                                    <Txt
                                                        className="col-span-7"
                                                        value={dados.comex.terminalRetiradaNome}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-12 gap-2">
                                                    <Label className="col-span-3">Terminal Entrega</Label>
                                                    <Txt
                                                        className="col-span-2"
                                                        value={dados.comex.terminalEntregaCodigo}
                                                    />
                                                    <Txt
                                                        className="col-span-7"
                                                        value={dados.comex.terminalEntregaNome}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-12 gap-2">
                                                    <Label className="col-span-3">Nº CTRC Master</Label>
                                                    <Txt
                                                        className="col-span-3"
                                                        value={dados.comex.ctrcMaster}
                                                    />

                                                    <Label className="col-span-3">Nº CTRC House</Label>
                                                    <Txt
                                                        className="col-span-3"
                                                        value={dados.comex.ctrcHouse}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-12 gap-2">
                                                    <Label className="col-span-3">Nome Navio</Label>
                                                    <Txt
                                                        className="col-span-9"
                                                        value={dados.comex.nomeNavio}
                                                    />
                                                </div>


                                            </div>
                                        </fieldset>

                                        {/* Card 2 - Datas / eventos */}
                                        <fieldset className="col-span-6 border border-gray-300 rounded p-3">
                                            <legend className="px-2 text-red-700 text-[13px]">
                                                Eventos Comex
                                            </legend>

                                            <div className="space-y-2">
                                                {[
                                                    ["Data Programação", dados.comex.dataProgramacao],
                                                    ["Devolve Container", dados.comex.devolveContainer],
                                                    ["Chegada no Cliente", dados.comex.chegadaCliente],
                                                    ["Estacionou na Doca", dados.comex.estacionouDoca],
                                                    [
                                                        "Início Sanitização",
                                                        dados.comex.inicioSanitizacao,
                                                    ],
                                                    ["Término Sanitização", dados.comex.fimSanitizacao],
                                                    [
                                                        "Início Carregamento",
                                                        dados.comex.inicioCarregamento,
                                                    ],
                                                    [
                                                        "Término Carregamento",
                                                        dados.comex.fimCarregamento,
                                                    ],
                                                    [
                                                        "Liberação Nota Fiscal",
                                                        dados.comex.liberacaoNotaFiscal,
                                                    ],
                                                    ["Saída do Cliente", dados.comex.saidaCliente],
                                                ].map(([lab, val], i) => (
                                                    <div className="grid grid-cols-12 gap-2" key={i}>
                                                        <Label className="col-span-4">{lab}</Label>
                                                        <Txt className="col-span-4" value={val} />
                                                    </div>
                                                ))}
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                            )}

                            {/* =======================
                  ABA DOCS ÁDUA
              ======================== */}
                            {activeTab === "docs" && (
                                <div className="space-y-3">
                                    {/* Card de campos */}
                                    <fieldset className="border border-gray-300 rounded p-3">
                                        <legend className="px-2 text-red-700 text-[13px]">
                                            Documentos Aduaneiros
                                        </legend>

                                        <div className="space-y-2">
                                            <div className="grid grid-cols-12 gap-2">
                                                <Label className="col-span-2">Nº DI / DTA</Label>
                                                <Txt
                                                    className="col-span-4"
                                                    value={dados.docsAduaCampos.diDta}
                                                />

                                                <Label className="col-span-2">Nº Lacre</Label>
                                                <Txt
                                                    className="col-span-4"
                                                    value={dados.docsAduaCampos.lacre}
                                                />
                                            </div>

                                            <div className="grid grid-cols-12 gap-2">
                                                <Label className="col-span-2">Nº Referência</Label>
                                                <Txt
                                                    className="col-span-4"
                                                    value={dados.docsAduaCampos.referencia}
                                                />

                                                <Label className="col-span-2">Nº Lacre Compl.</Label>
                                                <Txt
                                                    className="col-span-4"
                                                    value={dados.docsAduaCampos.lacreCompl}
                                                />
                                            </div>

                                            <div className="grid grid-cols-12 gap-2">
                                                <Label className="col-span-2">Nº Reserva</Label>
                                                <Txt
                                                    className="col-span-4"
                                                    value={dados.docsAduaCampos.reserva}
                                                />
                                            </div>
                                        </div>
                                    </fieldset>

                                    {/* Grid inferior */}
                                    <div className="w-full overflow-x-auto border border-gray-300 rounded bg-gray-200">
                                        <table className="min-w-max text-[13px] border-collapse w-full">
                                            <thead>
                                                <tr className="bg-gray-100 border-b border-gray-300 text-left">
                                                    <th className="p-1">Nº DI / DTA</th>
                                                    <th className="p-1">Nº Processo DI</th>
                                                    <th className="p-1">Nº Referência</th>
                                                    <th className="p-1">Nº Reserva</th>
                                                    <th className="p-1">Nº Lacre</th>
                                                    <th className="p-1">Nº Lacre Compl.</th>
                                                    <th className="p-1">Nº CTRC House</th>
                                                    <th className="p-1">Nº NF</th>
                                                    <th className="p-1">Nº NF Série</th>
                                                    <th className="p-1">Nº Invoice</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dados.docsAduaLista?.map((d, i) => (
                                                    <tr
                                                        key={i}
                                                        className="border-b border-gray-200 bg-yellow-50/40"
                                                    >
                                                        <td className="p-1">{d.diDta}</td>
                                                        <td className="p-1">{d.processo}</td>
                                                        <td className="p-1">{d.referencia}</td>
                                                        <td className="p-1">{d.reserva}</td>
                                                        <td className="p-1">{d.lacre}</td>
                                                        <td className="p-1">{d.lacreCompl}</td>
                                                        <td className="p-1">{d.ctrcHouse}</td>
                                                        <td className="p-1">{d.nf}</td>
                                                        <td className="p-1">{d.nfSerie}</td>
                                                        <td className="p-1">{d.invoice}</td>
                                                    </tr>
                                                ))}
                                                {(!dados.docsAduaLista ||
                                                    dados.docsAduaLista.length === 0) && (
                                                        <tr>
                                                            <td
                                                                colSpan={10}
                                                                className="p-2 text-center text-gray-500"
                                                            >
                                                                Nenhum documento aduaneiro encontrado.
                                                            </td>
                                                        </tr>
                                                    )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="mt-1 text-[12px] text-gray-700">
                                        {dados.docsAduaLista?.length || 0} Documentos
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* RODAPÉ */}
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
        </div>
    );
}
