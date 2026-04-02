// src/pages/SacColeta.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

function Txt({ className = "", readOnly = true, ...rest }) {
    return (
        <input
            {...rest}
            readOnly={readOnly}
            className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full ${readOnly ? "bg-gray-200" : "bg-white"
                } ${className}`}
        />
    );
}

function Sel({ children, className = "", disabled = false, ...rest }) {
    return (
        <select
            {...rest}
            disabled={disabled}
            className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full ${disabled ? "bg-gray-200" : "bg-white"
                } ${className}`}
        >
            {children}
        </select>
    );
}

/* =========================
   MOCKS – APENAS PARA TESTE
========================= */

const mockColetas = [
    {
        id: "185708",
        status: "EM ANDAMENTO",
        filial: "001",
        empresaCodigo: "001",
        empresaDescricao: "001 - TESTE MANTRAN",
        dtSolicitacao: "06/11/2025",
        horaSolicitacao: "12:25",
        dtCadastro: "06/11/2025",
        tipo: "Solicitada",
        nrSolicitacao: "0000001",
        nrColeta: "185708",
        nfServico: "",
        viagem: "000123",
        operador: "Suporte",
        dtAlteracao: "05/12/2025",
        inicioColetaData: "06/11/2025",
        inicioColetaHora: "12:25",
        motoristaCodigo: "01628446760",
        motoristaNome: "ALAN DA COSTA",
        divisao: "Suporte",
        tracaoCodigo: "0035719",
        tracaoDescricao: "RXW4156 - TRUCK",
        reboqueCodigo: "0034811",
        reboqueDescricao: "RKW3E53 - TOCO",

        /* --------- ABA DADOS COLETA --------- */
        solicitanteCodigo: "5022019000136",
        solicitanteNome: "HNK BR INDUSTRIA DE BEBIDAS LT",
        solicitanteUf: "SP",

        localColetaCodigo: "5022019000136",
        localColetaNome: "HNK BR INDUSTRIA DE BEBIDAS LT",
        localColetaUf: "SP",

        enderecoColeta: "AVENIDA PRIMO SCHINCARIOL",
        numeroColeta: "02222",
        bairroColeta: "ITAIM",
        cidadeColeta: "ITU",
        ufColeta: "SP",
        cepColeta: "13312900",
        dataColeta: "06/11/2025",
        horaColeta: "12:25",

        produtoDescricao: "DIVERSOS",
        embalagemCodigo: "0000",
        embalagemDescricao: "CAIXA",
        localEntregaCodigo: "0000000099701",
        localEntregaDescricao: "EXTERIOR",
        cepEntrega: "07000",
        numeroEntrega: "02222",
        ufEntrega: "SP",

        enderecoEntrega: "AVENIDA PRIMO SCHINCARIOL",
        bairroEntrega: "ITAIM",
        cidadeEntrega: "ITU",
        ufEntrega2: "SP",

        observacoes: "Coleta programada para cliente HNK BR.",
        dtEncerra: "__/__/____",
        recebidoPor: "",
        nrRgRecebedor: "",

        pesoInf: "0,00",
        pesoReal: "1,00",
        volInf: "0",
        volReal: "1",
        vlrInfNfs: "0,00",
        vlrRealNfs: "1,00",
        vlrKgColeta: "0,00",
        vlrFrete: "0,00",

        /* --------- ABA COMEX --------- */
        comex: {
            numeroContainer: "BICU1234567",
            tipo: "20 FLAT RACK",
            impostosSuspensos: "100",
            valorContainer: "1500",
            tara: "2500",

            armadorCodigo: "10",
            armadorNome: "MSC DO BRASIL",
            exportador: "MSC PULV COMER",

            localEmbarqueCodigo: "001",
            localEmbarqueDescricao: "LIBRA PORT",
            localDesembarqueCodigo: "002",
            localDesembarqueDescricao: "SANTOS BRASIL",

            terminalRetiradaCodigo: "003",
            terminalRetiradaDescricao: "RODRIMAR",
            terminalEntregaCodigo: "005",
            terminalEntregaDescricao: "SATEL CUBATAO",

            ctrcMaster: "25564",
            ctrcHouse: "0001",
            nomeNavio: "CAPE TOWN - AFRICA DO SUL",
            diDtaNumero: "18/142312313",
            processoDi: "15123132",
            referencia: "2132",
            reserva: "21321",
            lacre: "1321",
            lacreCompl: "3131",
            nf: "00012313",
            nfSerie: "DTA",
            invoice: "32132",

            dataProgramacao: "15/12/2025 08:00:00",
            chegadaCliente: "__/__/____",
            inicioSanitizacao: "__/__/____",
            fimSanitizacao: "__/__/____",
            inicioCarregamento: "__/__/____",
            fimCarregamento: "__/__/____",
            liberacaoNotaFiscal: "__/__/____",
            devolveContainer: "24/12/2025 18:00:00",
            saidaCliente: "__/__/____",
        },

        /* --------- ABA NOTA FISCAL --------- */
        notasFiscais: [
            {
                serie: "1",
                numero: "00012313",
                vols: "1",
                dtEmissao: "13/10/2025",
                pesoNf: "1",
                valorNf: "1",
                volM3: "1",
                cubPesoCalc: "0",
                embalagem: "000",
                produto: "0000",
                descricaoVol: "PAPELAO PAP",
                idVolume: "00012313",
                tipoNf: "N",
                situacaoNf: "I",
                condContrato: "",
                qtPallets: "0",
                vrIcms: "0",
                pesoInformado: "0",
                nrViagem: "",
                valorFreteNf: "0",
                tpEntrega: "",
                divisao: "",
                freteCliente: "",
                chaveNfe: "",
            },
        ],

        /* --------- ABA CONHECIMENTO --------- */
        conhecimentos: [
            {
                empresa: "001",
                filial: "001",
                serie: "001",
                ctrcControle: "264761",
                ctrcImpresso: "264711",
                emissao: "05/12/2025",
                destinatario: "EXTERIOR",
                volume: "1",
                pesoNf: "1",
                pesoCalculo: "1",
                vrMercadoria: "0",
                vrFrete: "1",
                dtEntrega: "__/__/____",
                hrEntrega: "__:__:__",
            },
        ],

        /* --------- ABA MANIFESTO --------- */
        manifestos: [
            {
                empresa: "001",
                filial: "001",
                numeroManifesto: "000123",
                tipo: "Entrega/Coleta",
                emissao: "05/12/2025",
            },
        ],
    },
];

/* =========================
   COMPONENTE PRINCIPAL
========================= */

export default function SacColeta({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    const [abaPrincipal, setAbaPrincipal] = useState("consulta");
    const [activeSubTab, setActiveSubTab] = useState("dados");
    const [coletaSelecionada, setColetaSelecionada] = useState(null);

    const [filtros, setFiltros] = useState({
        filialOrigem: "",
        dtIni: "",
        dtFim: "",
        solicitante: "",
        destinatario: "",
        status: "TODOS",
        motorista: "",
        nrColeta: "",
        nrSolicitacao: "",
        tipoCte: "Com CTRC",
    });

    const [resultados, setResultados] = useState(mockColetas);

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros((old) => ({ ...old, [name]: value }));
    };

    const pesquisar = () => {
        const lista = mockColetas.filter((c) => {
            if (
                filtros.status !== "TODOS" &&
                filtros.status &&
                c.status !== filtros.status
            )
                return false;

            if (
                filtros.nrColeta &&
                !c.nrColeta.includes(filtros.nrColeta.trim())
            )
                return false;

            if (
                filtros.solicitante &&
                !c.solicitanteNome
                    .toUpperCase()
                    .includes(filtros.solicitante.toUpperCase())
            )
                return false;

            return true;
        });

        if (lista.length === 0) {
            alert("Nenhuma coleta encontrada nos mocks.");
        }

        setResultados(lista);
    };

    const limpar = () => {
        setFiltros({
            filialOrigem: "",
            dtIni: "",
            dtFim: "",
            solicitante: "",
            destinatario: "",
            status: "TODOS",
            motorista: "",
            nrColeta: "",
            nrSolicitacao: "",
            tipoCte: "Com CTRC",
        });
        setResultados(mockColetas);
        setColetaSelecionada(null);
        setAbaPrincipal("consulta");
        setActiveSubTab("dados");
    };

    const selecionarColeta = (coleta) => {
        setColetaSelecionada(coleta);
        setAbaPrincipal("coleta");
        setActiveSubTab("dados");
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
                SAC – Coleta
            </h1>

            {/* CONTEÚDO */}
            <div className="flex-1 p-3 overflow-y-auto bg-white border-x border-b border-gray-300 rounded-b-md space-y-3">
                {/* ABAS PRINCIPAIS */}
                <div className="flex border-b mb-2 text-[12px]">
                    {[
                        ["coleta", "Coleta"],
                        ["consulta", "Consulta"],
                    ].map(([id, label]) => (
                        <button
                            key={id}
                            className={`px-3 py-1 border-r text-xs ${abaPrincipal === id
                                ? "bg-white text-red-700 font-semibold"
                                : "bg-gray-100 hover:bg-gray-200"
                                }`}
                            onClick={() => setAbaPrincipal(id)}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* =========================
            ABA CONSULTA
        ========================== */}
                {abaPrincipal === "consulta" && (
                    <>
                        {/* CARD 1 - PARÂMETROS */}
                        <fieldset className="border border-gray-300 rounded p-3 bg-white">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                Parâmetros de Pesquisa
                            </legend>

                            {/* Linha 1 */}
                            <div className="grid grid-cols-12 gap-2 mb-2">
                                <Label className="col-span-2">Filial de Origem</Label>
                                <Sel
                                    name="filialOrigem"
                                    value={filtros.filialOrigem}
                                    onChange={handleFiltroChange}
                                    className="col-span-3"
                                    disabled={false}
                                >
                                    <option value="">Todas</option>
                                    <option value="001">001 - TESTE MANTRAN</option>
                                </Sel>

                                <Label className="col-span-2">Status Coleta</Label>
                                <Sel
                                    name="status"
                                    value={filtros.status}
                                    onChange={handleFiltroChange}
                                    className="col-span-3"
                                    disabled={false}
                                >
                                    <option value="TODOS">TODOS</option>
                                    <option value="EM ANDAMENTO">EM ANDAMENTO</option>
                                    <option value="ENCERRADA">ENCERRADA</option>
                                </Sel>

                                <button
                                    onClick={pesquisar}
                                    className="col-span-2 flex items-center justify-center bg-red-700 text-white rounded hover:bg-red-800"
                                >
                                    <Search size={18} />
                                    <span className="ml-1 text-[12px]">Pesquisar</span>
                                </button>
                            </div>

                            {/* Linha 2 - Período */}
                            <div className="grid grid-cols-12 gap-2 mb-2">
                                <Label className="col-span-2">Período Coleta</Label>
                                <Txt
                                    className="col-span-2"
                                    name="dtIni"
                                    readOnly={false}
                                    value={filtros.dtIni}
                                    onChange={handleFiltroChange}
                                    placeholder="__/__/____"
                                />
                                <Label className="col-span-1 flex justify-center">Até</Label>
                                <Txt
                                    className="col-span-2"
                                    name="dtFim"
                                    readOnly={false}
                                    value={filtros.dtFim}
                                    onChange={handleFiltroChange}
                                    placeholder="__/__/____"
                                />

                                <Label className="col-span-2">Motorista</Label>
                                <Txt
                                    className="col-span-3"
                                    name="motorista"
                                    readOnly={false}
                                    value={filtros.motorista}
                                    onChange={handleFiltroChange}
                                />
                            </div>

                            {/* Linha 3 - Solicitante / Destinatário */}
                            <div className="grid grid-cols-12 gap-2 mb-2">
                                <Label className="col-span-2">Solicitante</Label>
                                <Txt
                                    className="col-span-4"
                                    name="solicitante"
                                    readOnly={false}
                                    value={filtros.solicitante}
                                    onChange={handleFiltroChange}
                                />

                                <Label className="col-span-2">Destinatário</Label>
                                <Txt
                                    className="col-span-4"
                                    name="destinatario"
                                    readOnly={false}
                                    value={filtros.destinatario}
                                    onChange={handleFiltroChange}
                                />
                            </div>

                            {/* Linha 4 - Nº Viagem / Coleta / Solicitação / Tipo CTe */}
                            <div className="grid grid-cols-12 gap-2">
                                <Label className="col-span-2">Nº Viagem</Label>
                                <Txt
                                    className="col-span-2"
                                    readOnly={false}
                                    name="nrViagem"
                                    value={filtros.nrViagem || ""}
                                    onChange={handleFiltroChange}
                                />

                                <Label className="col-span-1">Nº Coleta</Label>
                                <Txt
                                    className="col-span-2"
                                    readOnly={false}
                                    name="nrColeta"
                                    value={filtros.nrColeta}
                                    onChange={handleFiltroChange}
                                />

                                <Label className="col-span-1">Nº Solicitação</Label>
                                <Txt
                                    className="col-span-2"
                                    readOnly={false}
                                    name="nrSolicitacao"
                                    value={filtros.nrSolicitacao}
                                    onChange={handleFiltroChange}
                                />

                                <Label className="col-span-1">CTRC</Label>
                                <Sel
                                    name="tipoCte"
                                    value={filtros.tipoCte}
                                    onChange={handleFiltroChange}
                                    className="col-span-1"
                                    disabled={false}
                                >
                                    <option>Com CTRC</option>
                                    <option>Sem CTRC</option>
                                </Sel>
                            </div>
                        </fieldset>

                        {/* CARD 2 - GRID RESULTADOS */}
                        <fieldset className="border border-gray-300 rounded p-3 bg-white">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                Coletas Localizadas
                            </legend>

                            <div className="w-full overflow-x-auto border border-gray-300 rounded bg-gray-50">
                                <table className="min-w-max text-[13px] border-collapse w-full">
                                    <thead>
                                        <tr className="bg-gray-100 border-b border-gray-300 text-left">
                                            <th className="p-1">Status Coleta</th>
                                            <th className="p-1">Filial</th>
                                            <th className="p-1">Nº Coleta</th>
                                            <th className="p-1">Data Coleta</th>
                                            <th className="p-1">Nome Cliente (Fantasia)</th>
                                            <th className="p-1">Endereço da Coleta</th>
                                            <th className="p-1">Bairro Coleta</th>
                                            <th className="p-1">Cidade Coleta</th>
                                            <th className="p-1">UF</th>
                                            <th className="p-1">Nome Motorista</th>
                                            <th className="p-1">Nº Placa</th>
                                            <th className="p-1">Frete Coleta</th>
                                            <th className="p-1">CT Controle</th>
                                            <th className="p-1">Tipo CTe</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resultados.map((c) => (
                                            <tr
                                                key={c.id}
                                                className={`border-b border-gray-200 cursor-pointer hover:bg-yellow-100 ${coletaSelecionada?.id === c.id
                                                    ? "bg-yellow-200"
                                                    : "bg-white"
                                                    }`}
                                                onClick={() => selecionarColeta(c)}
                                            >
                                                <td className="p-1">{c.status}</td>
                                                <td className="p-1">{c.filial}</td>
                                                <td className="p-1">{c.nrColeta}</td>
                                                <td className="p-1">{c.dataColeta}</td>
                                                <td className="p-1">{c.solicitanteNome}</td>
                                                <td className="p-1">{c.enderecoColeta}</td>
                                                <td className="p-1">{c.bairroColeta}</td>
                                                <td className="p-1">{c.cidadeColeta}</td>
                                                <td className="p-1">{c.ufColeta}</td>
                                                <td className="p-1">{c.motoristaNome}</td>
                                                <td className="p-1">{c.tracaoDescricao}</td>
                                                <td className="p-1">{c.vlrFrete}</td>
                                                <td className="p-1">264733</td>
                                                <td className="p-1">N</td>
                                            </tr>
                                        ))}

                                        {resultados.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={14}
                                                    className="p-2 text-center text-gray-500"
                                                >
                                                    Nenhuma coleta localizada.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </fieldset>
                    </>
                )}

                {/* =========================
            ABA COLETA
        ========================== */}
                {abaPrincipal === "coleta" && (
                    <>
                        {!coletaSelecionada && (
                            <div className="text-[13px] text-red-700">
                                Nenhuma coleta selecionada. Utilize a aba &quot;Consulta&quot;
                                para pesquisar.
                            </div>
                        )}

                        {coletaSelecionada && (
                            <>
                                {/* CARD 1 – DADOS BÁSICOS DA COLETA */}
                                <fieldset className="border border-gray-300 rounded p-3 bg-white">
                                    <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                        Dados da Coleta
                                    </legend>

                                    <div className="space-y-2">
                                        {/* Linha 1 */}
                                        <div className="grid grid-cols-12 gap-2">
                                            <Label className="col-span-1">Dt. Solic.</Label>
                                            <Txt
                                                className="col-span-1"
                                                value={coletaSelecionada.dtSolicitacao}
                                            />

                                            <Label className="col-span-1">Hora</Label>
                                            <Txt
                                                className="col-span-1"
                                                value={coletaSelecionada.horaSolicitacao}
                                            />

                                            <Label className="col-span-1">Nº Sol.</Label>
                                            <Txt
                                                className="col-span-1"
                                                value={coletaSelecionada.nrSolicitacao}
                                            />

                                            <Label className="col-span-1">Nº Coleta</Label>
                                            <Txt
                                                className="col-span-1"
                                                value={coletaSelecionada.nrColeta}
                                            />
                                            <Label className="col-span-1">NF Serviço</Label>
                                            <Txt
                                                className="col-span-1"
                                                value={coletaSelecionada.nfServico}
                                            />


                                            <Label className="col-span-1">Filial</Label>
                                            <Txt
                                                className="col-span-1"
                                                value={coletaSelecionada.filial}
                                            />
                                        </div>

                                        {/* Linha 2 */}
                                        <div className="grid grid-cols-12 gap-2">
                                            <Label className="col-span-1">Cadastro</Label>
                                            <Txt
                                                className="col-span-1"
                                                value={coletaSelecionada.dtCadastro}
                                            />

                                            <Label className="col-span-1">Alterada</Label>
                                            <Txt
                                                className="col-span-1"
                                                value={coletaSelecionada.dtAlteracao}
                                            />

                                            <Label className="col-span-1">Viagem</Label>
                                            <Txt
                                                className="col-span-1"
                                                value={coletaSelecionada.viagem}
                                            />
                                            <Label className="col-span-1">Tipo</Label>
                                            <Txt
                                                className="col-span-2"
                                                value={coletaSelecionada.tipo}
                                            />

                                            <Label className="col-span-1">Status</Label>
                                            <Txt
                                                className="col-span-2 text-red-700 font-semibold"
                                                value={coletaSelecionada.status}
                                            />


                                        </div>

                                        {/* Linha 3 */}
                                        <div className="grid grid-cols-12 gap-2">

                                            <Label className="col-span-1">Início</Label>
                                            <Txt
                                                className="col-span-1"
                                                value={coletaSelecionada.inicioColetaData}
                                            />

                                            <Label className="col-span-1">Hs</Label>
                                            <Txt
                                                className="col-span-1"
                                                value={coletaSelecionada.inicioColetaHora}
                                            />
                                            <Label className="col-span-1">Divisão</Label>
                                            <Txt
                                                className="col-span-2"
                                                value={coletaSelecionada.divisao}
                                            />
                                            <Label className="col-span-1 col-start-10">Operador</Label>
                                            <Txt
                                                className="col-span-2"
                                                value={coletaSelecionada.operador}
                                            />
                                        </div>

                                        {/* Linha 4 */}
                                        <div className="grid grid-cols-12 gap-2">

                                            {/* MOTORISTA */}
                                            <Label className="col-span-1">Motorista</Label>
                                            {/* CNH / Código do Motorista */}
                                            <Txt
                                                className="col-span-1"
                                                value={coletaSelecionada.motoristaCodigo}
                                            />
                                            {/* Nome do Motorista */}
                                            <Txt
                                                className="col-span-3"
                                                value={coletaSelecionada.motoristaNome}
                                            />

                                            {/* TRAÇÃO */}
                                            <Label className="col-span-1">Tração</Label>
                                            {/* Placa / Descrição */}
                                            <Txt
                                                className="col-span-2"
                                                value={coletaSelecionada.tracaoDescricao}
                                            />


                                            <Label className="col-span-1">Reboque</Label>

                                            {/* Placa / Descrição */}
                                            <Txt
                                                className="col-span-3"
                                                value={coletaSelecionada.reboqueDescricao}
                                            />

                                            {/* Espaço para fechar 12 colunas e manter alinhamento */}
                                            <div className="col-span-6"></div>
                                        </div>

                                    </div>
                                </fieldset>

                                {/* CARD 2 – ABAS DETALHES */}
                                <div className="border border-gray-300 rounded bg-white">
                                    {/* Header das abas */}
                                    <div className="flex border-b bg-gray-50 text-[12px]">
                                        {[
                                            ["dados", "Dados Coleta"],
                                            ["comex", "Comex"],
                                            ["notas", "Nota Fiscal"],
                                            ["conhecimento", "Conhecimento"],
                                            ["manifesto", "Manifesto"],
                                        ].map(([id, label]) => (
                                            <button
                                                key={id}
                                                className={`px-3 py-1 border-r text-xs ${activeSubTab === id
                                                    ? "bg-white text-red-700 font-semibold"
                                                    : "bg-gray-100 hover:bg-gray-200"
                                                    }`}
                                                onClick={() => setActiveSubTab(id)}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Conteúdo da aba */}
                                    <div className="p-3">
                                        {/* ===== ABA DADOS COLETA ===== */}
                                        {activeSubTab === "dados" && (
                                            <div className="space-y-2">
                                                {/* Solicitante */}
                                                <div className="grid grid-cols-12 gap-2">
                                                    <Label className="col-span-1">Solicitante</Label>
                                                    <Txt
                                                        className="col-span-2"
                                                        value={coletaSelecionada.solicitanteCodigo}
                                                    />
                                                    <Txt
                                                        className="col-span-7"
                                                        value={coletaSelecionada.solicitanteNome}
                                                    />
                                                    <Txt
                                                        className="col-span-2"
                                                        value={coletaSelecionada.solicitanteUf}
                                                    />
                                                </div>

                                                {/* Local Coleta */}
                                                <div className="grid grid-cols-12 gap-2">
                                                    <Label className="col-span-1">Local Coleta</Label>
                                                    <Txt
                                                        className="col-span-2"
                                                        value={coletaSelecionada.localColetaCodigo}
                                                    />
                                                    <Txt
                                                        className="col-span-7"
                                                        value={coletaSelecionada.localColetaNome}
                                                    />
                                                    <Txt
                                                        className="col-span-2"
                                                        value={coletaSelecionada.localColetaUf}
                                                    />
                                                </div>

                                                {/* Endereço / Nº / Bairro / Cidade / UF / CEP / Data / Hora */}
                                                <div className="grid grid-cols-12 gap-2">
                                                    <Label className="col-span-1">Endereço</Label>
                                                    <Txt
                                                        className="col-span-5"
                                                        value={coletaSelecionada.enderecoColeta}
                                                    />
                                                    <Label className="col-span-1">Nº</Label>
                                                    <Txt
                                                        className="col-span-1"
                                                        value={coletaSelecionada.numeroColeta}
                                                    />
                                                    <Label className="col-span-1">Bairro</Label>
                                                    <Txt
                                                        className="col-span-3"
                                                        value={coletaSelecionada.bairroColeta}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-12 gap-2">
                                                    <Label className="col-span-1">Cidade</Label>
                                                    <Txt
                                                        className="col-span-3"
                                                        value={coletaSelecionada.cidadeColeta}
                                                    />
                                                    <Label className="col-span-1">UF</Label>
                                                    <Txt
                                                        className="col-span-1"
                                                        value={coletaSelecionada.ufColeta}
                                                    />
                                                    <Label className="col-span-1">CEP</Label>
                                                    <Txt
                                                        className="col-span-1"
                                                        value={coletaSelecionada.cepColeta}
                                                    />
                                                    <Label className="col-span-1">Data Coleta</Label>
                                                    <Txt
                                                        className="col-span-1"
                                                        value={coletaSelecionada.dataColeta}
                                                    />
                                                    <Label className="col-span-1">Hora Coleta</Label>
                                                    <Txt
                                                        className="col-span-1"
                                                        value={coletaSelecionada.horaColeta}
                                                    />
                                                </div>

                                                {/* Produto / Embalagem */}
                                                <div className="grid grid-cols-12 gap-2">
                                                    <Label className="col-span-1">Produto</Label>
                                                    <Txt
                                                        className="col-span-5"
                                                        value={coletaSelecionada.produtoDescricao}
                                                    />

                                                    <Label className="col-span-1">Embalagem</Label>
                                                    <Txt
                                                        className="col-span-1"
                                                        value={coletaSelecionada.embalagemCodigo}
                                                    />
                                                    <Txt
                                                        className="col-span-4"
                                                        value={coletaSelecionada.embalagemDescricao}
                                                    />
                                                </div>

                                                {/* Local Entrega */}
                                                <div className="grid grid-cols-12 gap-2">
                                                    <Label className="col-span-1">Local Entrega</Label>
                                                    <Txt
                                                        className="col-span-2"
                                                        value={coletaSelecionada.localEntregaCodigo}
                                                    />
                                                    <Txt
                                                        className="col-span-3"
                                                        value={coletaSelecionada.localEntregaDescricao}
                                                    />
                                                    <Label className="col-span-1">Cidade</Label>
                                                    <Txt
                                                        className="col-span-3"
                                                        value={coletaSelecionada.cidadeEntrega}
                                                    />
                                                    <Label className="col-span-1">UF</Label>
                                                    <Txt
                                                        className="col-span-1"
                                                        value={coletaSelecionada.ufEntrega2}
                                                    />



                                                </div>

                                                {/* Endereço Entrega */}
                                                <div className="grid grid-cols-12 gap-2">
                                                    <Label className="col-span-1">Endereço</Label>
                                                    <Txt
                                                        className="col-span-5"
                                                        value={coletaSelecionada.enderecoEntrega}
                                                    />
                                                    <Label className="col-span-1">Nº</Label>
                                                    <Txt
                                                        className="col-span-1"
                                                        value={coletaSelecionada.numeroEntrega}
                                                    />
                                                    <Label className="col-span-1">Bairro</Label>
                                                    <Txt
                                                        className="col-span-3"
                                                        value={coletaSelecionada.bairroEntrega}
                                                    />

                                                </div>

                                                {/* Observações */}
                                                <div className="grid grid-cols-12 gap-2">
                                                    <Label className="col-span-1">Observações</Label>
                                                    <Txt
                                                        className="col-span-11 h-[40px]"
                                                        value={coletaSelecionada.observacoes}
                                                    />
                                                </div>

                                                {/* DT Encerra / Recebido por / Nº RG */}
                                                <div className="grid grid-cols-12 gap-2">
                                                    <Label className="col-span-1">DT Encerra</Label>
                                                    <Txt
                                                        className="col-span-2"
                                                        value={coletaSelecionada.dtEncerra}
                                                    />

                                                    <Label className="col-span-1">Recebido por</Label>
                                                    <Txt
                                                        className="col-span-4"
                                                        value={coletaSelecionada.recebidoPor}
                                                    />

                                                    <Label className="col-span-1">Nº RG</Label>
                                                    <Txt
                                                        className="col-span-3"
                                                        value={coletaSelecionada.nrRgRecebedor}
                                                    />
                                                </div>

                                                {/* Linha divisória suave */}
                                                <div className="w-full border-t border-gray-300 my-2" />

                                                {/* Pesos / Valores */}
                                                <div className="grid grid-cols-12 gap-2">
                                                    <Label className="col-span-1">Peso Inf.</Label>
                                                    <Txt
                                                        className="col-span-1"
                                                        value={coletaSelecionada.pesoInf}
                                                    />
                                                    <Label className="col-span-1">Peso Real</Label>
                                                    <Txt
                                                        className="col-span-1"
                                                        value={coletaSelecionada.pesoReal}
                                                    />
                                                    <Label className="col-span-1">Vol Inf.</Label>
                                                    <Txt
                                                        className="col-span-1"
                                                        value={coletaSelecionada.volInf}
                                                    />
                                                    <Label className="col-span-1">Vol Real</Label>
                                                    <Txt
                                                        className="col-span-1"
                                                        value={coletaSelecionada.volReal}
                                                    />
                                                    <Label className="col-span-1">Valor Inf. NFs</Label>
                                                    <Txt
                                                        className="col-span-1"
                                                        value={coletaSelecionada.vlrInfNfs}
                                                    />
                                                    <Label className="col-span-1">Valor Real NFs</Label>
                                                    <Txt
                                                        className="col-span-1"
                                                        value={coletaSelecionada.vlrRealNfs}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-12 gap-2">
                                                    <Label className="col-span-1">Vlr Kg Coleta</Label>
                                                    <Txt
                                                        className="col-span-1"
                                                        value={coletaSelecionada.vlrKgColeta}
                                                    />
                                                    <Label className="col-span-1">Valor Frete</Label>
                                                    <Txt
                                                        className="col-span-1"
                                                        value={coletaSelecionada.vlrFrete}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* ===== ABA COMEX ===== */}
                                        {activeSubTab === "comex" && (
                                            <div className="space-y-2">
                                                {/* Linha 1 */}
                                                <div className="grid grid-cols-12 gap-2">
                                                    <Label className="col-span-1">Nº Container</Label>
                                                    <Txt
                                                        className="col-span-2"
                                                        value={coletaSelecionada.comex.numeroContainer}
                                                    />
                                                    <Label className="col-span-1">Tipo</Label>
                                                    <Txt
                                                        className="col-span-2"
                                                        value={coletaSelecionada.comex.tipo}
                                                    />
                                                    <Label className="col-span-1">Imp. Susp.</Label>
                                                    <Txt
                                                        className="col-span-1"
                                                        value={
                                                            coletaSelecionada.comex.impostosSuspensos
                                                        }
                                                    />
                                                    <Label className="col-span-1">Vr Container</Label>
                                                    <Txt
                                                        className="col-span-1"
                                                        value={coletaSelecionada.comex.valorContainer}
                                                    />
                                                    <Label className="col-span-1">Tara</Label>
                                                    <Txt
                                                        className="col-span-1"
                                                        value={coletaSelecionada.comex.tara}
                                                    />
                                                </div>

                                                {/* Linha 2 – Armador / Exportador */}
                                                <div className="grid grid-cols-12 gap-2">
                                                    <Label className="col-span-1">Armador</Label>
                                                    <Txt
                                                        className="col-span-1"
                                                        value={coletaSelecionada.comex.armadorCodigo}
                                                    />
                                                    <Txt
                                                        className="col-span-4"
                                                        value={coletaSelecionada.comex.armadorNome}
                                                    />
                                                    <Label className="col-span-1">Exportador</Label>
                                                    <Txt
                                                        className="col-span-5"
                                                        value={coletaSelecionada.comex.exportador}
                                                    />
                                                </div>

                                                {/* Local Embarque / Desembarque */}
                                                <div className="grid grid-cols-12 gap-2">
                                                    <Label className="col-span-1">
                                                        Local Embarque
                                                    </Label>
                                                    <Txt
                                                        className="col-span-2"
                                                        value={
                                                            coletaSelecionada.comex.localEmbarqueCodigo
                                                        }
                                                    />
                                                    <Txt
                                                        className="col-span-3"
                                                        value={
                                                            coletaSelecionada.comex
                                                                .localEmbarqueDescricao
                                                        }
                                                    />
                                                    <Label className="col-span-1">
                                                        Local Desembarque
                                                    </Label>
                                                    <Txt
                                                        className="col-span-2"
                                                        value={
                                                            coletaSelecionada.comex
                                                                .localDesembarqueCodigo
                                                        }
                                                    />
                                                    <Txt
                                                        className="col-span-3"
                                                        value={
                                                            coletaSelecionada.comex
                                                                .localDesembarqueDescricao
                                                        }
                                                    />
                                                </div>

                                                {/* Terminal retirada / entrega */}
                                                <div className="grid grid-cols-12 gap-2">
                                                    <Label className="col-span-1">
                                                        Terminal Retirada
                                                    </Label>
                                                    <Txt
                                                        className="col-span-2"
                                                        value={
                                                            coletaSelecionada.comex
                                                                .terminalRetiradaCodigo
                                                        }
                                                    />
                                                    <Txt
                                                        className="col-span-3"
                                                        value={
                                                            coletaSelecionada.comex
                                                                .terminalRetiradaDescricao
                                                        }
                                                    />
                                                    <Label className="col-span-1">
                                                        Terminal Entrega
                                                    </Label>
                                                    <Txt
                                                        className="col-span-2"
                                                        value={
                                                            coletaSelecionada.comex
                                                                .terminalEntregaCodigo
                                                        }
                                                    />
                                                    <Txt
                                                        className="col-span-3"
                                                        value={
                                                            coletaSelecionada.comex
                                                                .terminalEntregaDescricao
                                                        }
                                                    />
                                                </div>

                                                {/* CTRC Master / House / Navio */}
                                                <div className="grid grid-cols-12 gap-2">
                                                    <Label className="col-span-1">Nº CTRC Master</Label>
                                                    <Txt
                                                        className="col-span-2"
                                                        value={coletaSelecionada.comex.ctrcMaster}
                                                    />
                                                    <Label className="col-span-1">Nº CTRC House</Label>
                                                    <Txt
                                                        className="col-span-2"
                                                        value={coletaSelecionada.comex.ctrcHouse}
                                                    />
                                                    <Label className="col-span-1">Nome Navio</Label>
                                                    <Txt
                                                        className="col-span-5"
                                                        value={coletaSelecionada.comex.nomeNavio}
                                                    />
                                                </div>

                                                {/* GRID Docs DI / DTA */}
                                                <div className="w-full overflow-x-auto border border-gray-300 rounded bg-gray-200 mt-2">
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
                                                            <tr className="border-b border-gray-200 bg-yellow-50/40">
                                                                <td className="p-1">
                                                                    {coletaSelecionada.comex.diDtaNumero}
                                                                </td>
                                                                <td className="p-1">
                                                                    {coletaSelecionada.comex.processoDi}
                                                                </td>
                                                                <td className="p-1">
                                                                    {coletaSelecionada.comex.referencia}
                                                                </td>
                                                                <td className="p-1">
                                                                    {coletaSelecionada.comex.reserva}
                                                                </td>
                                                                <td className="p-1">
                                                                    {coletaSelecionada.comex.lacre}
                                                                </td>
                                                                <td className="p-1">
                                                                    {coletaSelecionada.comex.lacreCompl}
                                                                </td>
                                                                <td className="p-1">
                                                                    {coletaSelecionada.comex.ctrcHouse}
                                                                </td>
                                                                <td className="p-1">
                                                                    {coletaSelecionada.comex.nf}
                                                                </td>
                                                                <td className="p-1">
                                                                    {coletaSelecionada.comex.nfSerie}
                                                                </td>
                                                                <td className="p-1">
                                                                    {coletaSelecionada.comex.invoice}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>

                                                {/* Datas de programação */}
                                                <div className="grid grid-cols-12 gap-2 mt-2">
                                                    <Label className="col-span-2">Data Programação</Label>
                                                    <Txt
                                                        className="col-span-2"
                                                        value={coletaSelecionada.comex.dataProgramacao}
                                                    />

                                                    <Label className="col-span-2">Devolve Container</Label>
                                                    <Txt
                                                        className="col-span-2"
                                                        value={coletaSelecionada.comex.devolveContainer}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-12 gap-2">
                                                    <Label className="col-span-2">
                                                        Chegada no Cliente
                                                    </Label>
                                                    <Txt
                                                        className="col-span-2"
                                                        value={coletaSelecionada.comex.chegadaCliente}
                                                    />
                                                    <Label className="col-span-2">
                                                        Estacionou na Doca
                                                    </Label>
                                                    <Txt
                                                        className="col-span-2"
                                                        value={coletaSelecionada.comex.estacionouDoca}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-12 gap-2">
                                                    <Label className="col-span-2">
                                                        Início Sanitização
                                                    </Label>
                                                    <Txt
                                                        className="col-span-2"
                                                        value={coletaSelecionada.comex.inicioSanitizacao}
                                                    />
                                                    <Label className="col-span-2">
                                                        Término Sanitização
                                                    </Label>
                                                    <Txt
                                                        className="col-span-2"
                                                        value={coletaSelecionada.comex.fimSanitizacao}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-12 gap-2">
                                                    <Label className="col-span-2">
                                                        Início Carregamento
                                                    </Label>
                                                    <Txt
                                                        className="col-span-2"
                                                        value={coletaSelecionada.comex.inicioCarregamento}
                                                    />
                                                    <Label className="col-span-2">
                                                        Término Carregamento
                                                    </Label>
                                                    <Txt
                                                        className="col-span-2"
                                                        value={coletaSelecionada.comex.fimCarregamento}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-12 gap-2">
                                                    <Label className="col-span-2">
                                                        Liberação Nota Fiscal
                                                    </Label>
                                                    <Txt
                                                        className="col-span-2"
                                                        value={coletaSelecionada.comex.liberacaoNotaFiscal}
                                                    />
                                                    <Label className="col-span-2">Saída do Cliente</Label>
                                                    <Txt
                                                        className="col-span-2"
                                                        value={coletaSelecionada.comex.saidaCliente}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* ===== ABA NOTA FISCAL ===== */}
                                        {activeSubTab === "notas" && (
                                            <div>
                                                <div className="w-full overflow-x-auto border border-gray-300 rounded">
                                                    <table className="min-w-max text-[13px] border-collapse w-full">
                                                        <thead>
                                                            <tr className="bg-gray-100 border-b border-gray-300 text-left">
                                                                <th className="p-1">Série</th>
                                                                <th className="p-1">Nº Nota</th>
                                                                <th className="p-1">Vols</th>
                                                                <th className="p-1">DT Emissão</th>
                                                                <th className="p-1">Peso NF</th>
                                                                <th className="p-1">Valor NF</th>
                                                                <th className="p-1">Vol M³</th>
                                                                <th className="p-1">Cub/Peso p/Calc</th>
                                                                <th className="p-1">Emb.</th>
                                                                <th className="p-1">Prod.</th>
                                                                <th className="p-1">Descrição Vol</th>
                                                                <th className="p-1">ID Volume</th>
                                                                <th className="p-1">Tipo NF</th>
                                                                <th className="p-1">Situação NF</th>
                                                                <th className="p-1">Cond. Contrato</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {coletaSelecionada.notasFiscais.map((nf, i) => (
                                                                <tr
                                                                    key={i}
                                                                    className="border-b border-gray-200 bg-yellow-50/40"
                                                                >
                                                                    <td className="p-1">{nf.serie}</td>
                                                                    <td className="p-1">{nf.numero}</td>
                                                                    <td className="p-1">{nf.vols}</td>
                                                                    <td className="p-1">{nf.dtEmissao}</td>
                                                                    <td className="p-1">{nf.pesoNf}</td>
                                                                    <td className="p-1">{nf.valorNf}</td>
                                                                    <td className="p-1">{nf.volM3}</td>
                                                                    <td className="p-1">{nf.cubPesoCalc}</td>
                                                                    <td className="p-1">{nf.embalagem}</td>
                                                                    <td className="p-1">{nf.produto}</td>
                                                                    <td className="p-1">{nf.descricaoVol}</td>
                                                                    <td className="p-1">{nf.idVolume}</td>
                                                                    <td className="p-1">{nf.tipoNf}</td>
                                                                    <td className="p-1">{nf.situacaoNf}</td>
                                                                    <td className="p-1">{nf.condContrato}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}

                                        {/* ===== ABA CONHECIMENTO ===== */}
                                        {activeSubTab === "conhecimento" && (
                                            <div>
                                                <div className="w-full overflow-x-auto border border-gray-300 rounded">
                                                    <table className="min-w-max text-[13px] border-collapse w-full">
                                                        <thead>
                                                            <tr className="bg-gray-100 border-b border-gray-300 text-left">
                                                                <th className="p-1">Empresa</th>
                                                                <th className="p-1">Filial</th>
                                                                <th className="p-1">Série</th>
                                                                <th className="p-1">CTRC Controle</th>
                                                                <th className="p-1">CTRC Impresso</th>
                                                                <th className="p-1">Emissão</th>
                                                                <th className="p-1">Destinatário</th>
                                                                <th className="p-1">Volume</th>
                                                                <th className="p-1">Peso NF</th>
                                                                <th className="p-1">Peso Cálculo</th>
                                                                <th className="p-1">Vr Mercadoria</th>
                                                                <th className="p-1">Vr Frete</th>
                                                                <th className="p-1">DT Entrega</th>
                                                                <th className="p-1">HR Entrega</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {coletaSelecionada.conhecimentos.map((cn, i) => (
                                                                <tr
                                                                    key={i}
                                                                    className="border-b border-gray-200 bg-yellow-50/40"
                                                                >
                                                                    <td className="p-1">{cn.empresa}</td>
                                                                    <td className="p-1">{cn.filial}</td>
                                                                    <td className="p-1">{cn.serie}</td>
                                                                    <td className="p-1">{cn.ctrcControle}</td>
                                                                    <td className="p-1">{cn.ctrcImpresso}</td>
                                                                    <td className="p-1">{cn.emissao}</td>
                                                                    <td className="p-1">{cn.destinatario}</td>
                                                                    <td className="p-1">{cn.volume}</td>
                                                                    <td className="p-1">{cn.pesoNf}</td>
                                                                    <td className="p-1">{cn.pesoCalculo}</td>
                                                                    <td className="p-1">{cn.vrMercadoria}</td>
                                                                    <td className="p-1">{cn.vrFrete}</td>
                                                                    <td className="p-1">{cn.dtEntrega}</td>
                                                                    <td className="p-1">{cn.hrEntrega}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}

                                        {/* ===== ABA MANIFESTO ===== */}
                                        {activeSubTab === "manifesto" && (
                                            <div>
                                                <div className="w-full overflow-x-auto border border-gray-300 rounded">
                                                    <table className="min-w-max text-[13px] border-collapse w-full">
                                                        <thead>
                                                            <tr className="bg-gray-100 border-b border-gray-300 text-left">
                                                                <th className="p-1">Empresa</th>
                                                                <th className="p-1">Filial</th>
                                                                <th className="p-1">Nº Manifesto</th>
                                                                <th className="p-1">Tipo</th>
                                                                <th className="p-1">Emissão</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {coletaSelecionada.manifestos.map((m, i) => (
                                                                <tr
                                                                    key={i}
                                                                    className="border-b border-gray-200 bg-yellow-50/40"
                                                                >
                                                                    <td className="p-1">{m.empresa}</td>
                                                                    <td className="p-1">{m.filial}</td>
                                                                    <td className="p-1">{m.numeroManifesto}</td>
                                                                    <td className="p-1">{m.tipo}</td>
                                                                    <td className="p-1">{m.emissao}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </>
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
