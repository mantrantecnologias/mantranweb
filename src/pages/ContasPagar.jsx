import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIconColor } from "../context/IconColorContext";

import {
    XCircle,
    RotateCcw,
    PlusCircle,
    Edit,
    Trash2,
    CalendarClock,
    Search,
    ChevronUp,
    ChevronDown,
    CheckSquare,
} from "lucide-react";

/* ========================= Helpers (padrão Conta.jsx) ========================= */
function Label({ children, className = "" }) {
    return (
        <label className={`text-[12px] text-gray-700 flex items-center ${className}`}>
            {children}
        </label>
    );
}

function Txt(props) {
    return (
        <input
            {...props}
            className={
                "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] " +
                (props.className || "")
            }
        />
    );
}

function Sel({ children, className = "", ...rest }) {
    return (
        <select
            {...rest}
            className={
                "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full " +
                className
            }
        >
            {children}
        </select>
    );
}

/* ========================= Data inteligente ========================= */
const getHojeISO = () => new Date().toISOString().slice(0, 10);

const fillTodayIfEmpty = (e) => {
    if (!e.target.value) e.target.value = getHojeISO();
};

const clearOnBackspace = (e) => {
    if (e.key === "Backspace") {
        e.preventDefault();
        e.target.value = "";
        e.target.dispatchEvent(new Event("input", { bubbles: true }));
        e.target.dispatchEvent(new Event("change", { bubbles: true }));
    }
};

const bindDateSmart = (onChange) => ({
    onFocus: fillTodayIfEmpty,
    onKeyDown: clearOnBackspace,
    onChange,
});

/* ========================= Mocks ========================= */
const empresasMock = [{ value: "001", label: "001 - MANTRAN TRANSPORTES LTDA" }];

const filiaisMock = [
    { value: "001", label: "001 - TESTE MANTRAN" },
    { value: "002", label: "002 - FILIAL 002" },
];

const condPgtoMock = [
    { value: "Mensal", label: "Mensal" },
    { value: "Quinzenal", label: "Quinzenal" },
    { value: "Semanal", label: "Semanal" },
];

const centroCustoMock = [
    { value: "Mantran", label: "Mantran" },
    { value: "Operacao", label: "Operação" },
];

const contasMock = [
    { value: "000000", label: "000000 - CAIXINHA INTERNO", banco: "999", agencia: "0000-0" },
    { value: "123456", label: "123456 - CONTA SANTANDER", banco: "033", agencia: "1234-5" },
];

const tipoPagtoMock = [
    { cod: "1", desc: "TRANSFERENCIA" },
    { cod: "2", desc: "BOLETO" },
];

const integrBancoMock = [
    { value: "", label: "" },
    { value: "SEM REMESSA", label: "SEM REMESSA" },
    { value: "COM REMESSA", label: "COM REMESSA" },
];

const titulosMock = [
    {
        id: 1,
        empresa: "001",
        filial: "001",
        cnpj: "58507468000157",
        fornecedor: "MULTIEXO IMPLEMENTOS RODOVIARIOS LTDA",
        titulo: "002004193220",
        parcela: "34",
        vencimento: "2025-02-02",
        inclusao: "2022-04-20",
        valor: 6177.43,
        saldo: 6177.43,
        pagamento: "",
        competencia: "2024-12-30",
        nf: "181563",
        nfSerie: "2",
        obs: "FINANCIAMENTO CDC BANCO RANDON",
    },
    {
        id: 2,
        empresa: "001",
        filial: "001",
        cnpj: "60746948000112",
        fornecedor: "BANCO BRADESCO SA",
        titulo: "001712144352",
        parcela: "50",
        vencimento: "2025-01-15",
        inclusao: "2020-12-17",
        valor: 7858.63,
        saldo: 7858.63,
        pagamento: "",
        competencia: "2024-11-11",
        nf: "",
        nfSerie: "",
        obs: "FINANCIAMENTO, CONTRATO",
    },
];

/* ========================= Format ========================= */
const formatNumero = (n) =>
    Number(n || 0).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

/* ========================= Component ========================= */
export default function ContasPagar({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    const [activeTab, setActiveTab] = useState("titulo");

    /* -------- Aba Título - dados -------- */
    const [dados, setDados] = useState({
        empresa: "001",
        filial: "001",

        fornecedorCnpj: "",
        fornecedorNome: "",

        nrTitulo: "",
        nrParcela: "",
        qtdParcela: "1",
        dtInclusao: "",
        dtCompetencia: "",

        dtVencimento: "",
        vrParcela: "",
        dtPrevisao: "",
        condPgto: "Mensal",
        flCompetenciaMensal: false,

        catCod: "",
        catDesc: "",
        subCatCod: "",
        subCatDesc: "",

        centroCusto: "Mantran",
        nrConta: "000000",
        banco: "999",
        agencia: "0000-0",

        nrNF: "",
        nrNFSerie: "",
        nrViagem: "",

        observacao: "",
    });

    const setField = (campo) => (e) => {
        const v = e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
        setDados((p) => ({ ...p, [campo]: v }));
    };

    /* auto banco/agencia conforme conta */
    useEffect(() => {
        const c = contasMock.find((x) => x.value === dados.nrConta);
        if (c) {
            setDados((p) => ({ ...p, banco: c.banco, agencia: c.agencia }));
        }
    }, [dados.nrConta]);

    /* -------- Card 2 pagamento -------- */
    const [isPagtoOpen, setIsPagtoOpen] = useState(false);
    const [pagto, setPagto] = useState({
        tipoPagtoCod: "1",
        tipoPagtoDesc: "TRANSFERENCIA",
        doctoPagto: "",

        dtBaixa: "",
        dtPagamento: "",
        vrDescto: "0,00",
        vrJaPago: "0,00",
        saldoTitulo: "0,00",

        vrJuros: "0,00",
        vrMulta: "0,00",
        vrBaixa: "0,00",
        totalPago: "0,00",
    });

    /* recalcula saldo mock quando muda vrParcela */
    useEffect(() => {
        const base = Number(String(dados.vrParcela || "0").replace(",", "."));
        setPagto((p) => ({ ...p, saldoTitulo: formatNumero(isNaN(base) ? 0 : base) }));
    }, [dados.vrParcela]);

    const handleBaixar = () => {
        const hoje = getHojeISO();
        setPagto((p) => ({ ...p, dtBaixa: hoje }));
        setModalMsg({ tipo: "sucesso", texto: "Baixa Realizada Com Sucesso!" });
    };

    const handleEstornar = () => {
        setModalMsg({
            tipo: "confirm", texto: "Deseja estornar a baixa deste título?", onYes: () => {
                setPagto((p) => ({ ...p, dtBaixa: "" }));
                setModalMsg({ tipo: "sucesso", texto: "Estorno realizado com sucesso!" });
            }
        });
    };

    /* -------- Card 3 MULTIPAG -------- */
    const [isMultipagOpen, setIsMultipagOpen] = useState(false);
    const multipagTabs = [
        "Transferência",
        "Títulos/Boletos",
        "PIX",
        "Conta Consumo/Tributo Cód. Barras",
        "FGTS",
        "GPS",
        "DARF/DETRAN",
        "DARF Simples",
        "GARE SP",
        "Folha Salarial",
    ];
    const [multipagTab, setMultipagTab] = useState("Transferência");

    const [multipag, setMultipag] = useState({
        pago: "NÃO",
        retorno: "",

        // Transferência
        tpLancTransfer: "Crédito em Conta Corrente/Salário",
        nossoNumero: "",
        finalidadeDoc: "Crédito em Conta",
        finalidadeTed: "Pagamento de Impostos, Tributos e Taxas",

        // Títulos/Boletos
        tpLancBoleto: "Liquidação de Títulos do Próprio Banco",
        codigoBarrasBoleto: "",

        // PIX
        tpChavePix: "CPF/CNPJ",
        chavePix: "",
        identPagtoPix: "",

        // Conta consumo / tributo
        tpLancConsumo: "Contas de Consumo",
        codBar1: "",
        codBar2: "",
        codBar3: "",
        codBar4: "",

        // FGTS
        tpLancFgts: "FGTS",
        lacre: "",
        digLacre: "",
        codReceitaFgts: "",

        // GPS
        tpLancGps: "GPS",
        codReceitaGps: "",
        vrOutrasEnt: "0,00",
        vrAtualMon: "0,00",

        // DARF/DETRAN
        tpLancDarf: "DARF",
        nrReferenciaDarf: "",
        periodoApuracaoDarf: "",
        vrJurosMultaDarf: "0,00",
        codReceitaDarf: "",

        // DARF Simples
        tpLancDarfSimples: "DARF Simples",
        vrJurosMultaDarfSimples: "0,00",
        periodoRefDarfSimples: "",
        vrRecBrutaAcum: "0,00",
        pcSobreRecBruta: "0,00",
        codReceitaDarfSimples: "",

        // GARE SP
        tpLancGare: "GARE SP - ICMS",
        dividaAtivaEtiqueta: "",
        nrParcelaNotif: "",
        periodoRefGare: "",
        vrReceitaGare: "0,00",
        vrJurosMultaGare: "0,00",
        ieCodMunDecl: "",
        codReceitaGare: "",

        // Folha
        tpLancFolha: "Crédito em Conta Corrente/Salário",
    });

    const setMP = (campo) => (e) => {
        const v = e.target.value;
        setMultipag((p) => ({ ...p, [campo]: v }));
    };

    /* -------- Modais -------- */
    const [modalMsg, setModalMsg] = useState(null);

    const [showModalParcelas, setShowModalParcelas] = useState(false);
    const [qtdAddParcelas, setQtdAddParcelas] = useState("");

    const [showModalReagenda, setShowModalReagenda] = useState(false);
    const [novoPrevPagto, setNovoPrevPagto] = useState("");

    /* -------- Aba Consulta -------- */
    const [consulta, setConsulta] = useState({
        empresa: "001",
        filial: "TODAS",

        vencDe: "",
        vencAte: "",
        incDe: "",
        incAte: "",
        pagDe: "",
        pagAte: "",

        fornCnpj: "",
        fornNome: "",
        valor: "",
        nrTitulo: "",
        nrViagem: "",

        pagos: "EM ABERTO",
        nrNF: "",
        nrNFSerie: "",
        integrBanco: "SEM REMESSA",
    });

    const setC = (campo) => (e) => setConsulta((p) => ({ ...p, [campo]: e.target.value }));

    const [listaTitulos, setListaTitulos] = useState([]);
    const [modoExcluir, setModoExcluir] = useState(false);
    const [selecionados, setSelecionados] = useState(new Set());

    const totalSelecionados = selecionados.size;

    const pesquisar = () => {
        setListaTitulos(titulosMock);
    };

    const limparConsulta = () => {
        setConsulta((p) => ({
            ...p,
            vencDe: "",
            vencAte: "",
            incDe: "",
            incAte: "",
            pagDe: "",
            pagAte: "",
            fornCnpj: "",
            fornNome: "",
            valor: "",
            nrTitulo: "",
            nrViagem: "",
            nrNF: "",
            nrNFSerie: "",
        }));
        setListaTitulos([]);
        setModoExcluir(false);
        setSelecionados(new Set());
    };

    const abrirNoTitulo = (row) => {
        setActiveTab("titulo");

        setDados((p) => ({
            ...p,
            empresa: row.empresa,
            filial: row.filial,
            fornecedorCnpj: row.cnpj,
            fornecedorNome: row.fornecedor,
            nrTitulo: row.titulo,
            nrParcela: row.parcela,
            dtVencimento: row.vencimento,
            dtInclusao: row.inclusao,
            vrParcela: formatNumero(row.valor),
            dtCompetencia: row.competencia,
            nrNF: row.nf || "",
            nrNFSerie: row.nfSerie || "",
            observacao: row.obs || "",
        }));
    };

    const toggleSelecionado = (id) => {
        setSelecionados((prev) => {
            const n = new Set(prev);
            if (n.has(id)) n.delete(id);
            else n.add(id);
            return n;
        });
    };

    const selecionarTodos = () => {
        if (selecionados.size === listaTitulos.length) {
            setSelecionados(new Set());
        } else {
            setSelecionados(new Set(listaTitulos.map((x) => x.id)));
        }
    };

    const confirmarExcluir = () => {
        if (totalSelecionados === 0) {
            setModalMsg({ tipo: "info", texto: "Selecione pelo menos 1 registro para excluir." });
            return;
        }

        setModalMsg({
            tipo: "confirm",
            texto: `Deseja excluir os ${totalSelecionados} registros selecionados?`,
            onYes: () => {
                setListaTitulos((prev) => prev.filter((x) => !selecionados.has(x.id)));
                setSelecionados(new Set());
                setModoExcluir(false);
                setModalMsg({ tipo: "sucesso", texto: "Registros excluídos com sucesso!" });
            },
        });
    };

    /* -------- Rodapé ações -------- */
    const handleLimparTela = () => {
        if (activeTab === "titulo") {
            setDados((p) => ({
                ...p,
                fornecedorCnpj: "",
                fornecedorNome: "",
                nrTitulo: "",
                nrParcela: "",
                qtdParcela: "1",
                dtInclusao: "",
                dtCompetencia: "",
                dtVencimento: "",
                vrParcela: "",
                dtPrevisao: "",
                condPgto: "Mensal",
                flCompetenciaMensal: false,
                catCod: "",
                catDesc: "",
                subCatCod: "",
                subCatDesc: "",
                nrConta: "000000",
                banco: "999",
                agencia: "0000-0",
                nrNF: "",
                nrNFSerie: "",
                nrViagem: "",
                observacao: "",
            }));
            setPagto((p) => ({
                ...p,
                doctoPagto: "",
                dtBaixa: "",
                dtPagamento: "",
                vrDescto: "0,00",
                vrJaPago: "0,00",
                vrJuros: "0,00",
                vrMulta: "0,00",
                vrBaixa: "0,00",
                totalPago: "0,00",
            }));
            setMultipag((p) => ({ ...p, retorno: "" }));
        } else {
            limparConsulta();
        }
    };

    const handleIncluir = () => {
        setModalMsg({ tipo: "sucesso", texto: "Registro incluído com sucesso! (mock)" });
    };

    const handleAlterar = () => {
        setModalMsg({ tipo: "sucesso", texto: "Registro alterado com sucesso! (mock)" });
    };

    const handleExcluir = () => {
        if (activeTab === "consulta") {
            setModoExcluir(true);
            return;
        }
        setModalMsg({ tipo: "info", texto: "Exclusão na Aba Título será via backend (mock)." });
    };

    const handleReagenda = () => {
        setNovoPrevPagto(dados.dtPrevisao || "");
        setShowModalReagenda(true);
    };

    /* saldo título (mock) */
    const saldoTituloCalc = useMemo(() => pagto.saldoTitulo, [pagto.saldoTitulo]);

    return (
        <div
            className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 bg-gray-50 h-[calc(100vh-56px)] flex flex-col ${open ? "ml-[192px]" : "ml-[56px]"
                }`}
        >
            {/* Título */}
            <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                CONTAS A PAGAR
            </h1>

            {/* Abas (mesmo padrão do Faturamento.jsx) */}
            <div className="flex border-b border-gray-300 bg-white">
                {["titulo", "consulta"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-1 text-sm font-medium border-t border-x rounded-t-md ${activeTab === tab
                            ? "bg-white text-red-700 border-gray-300"
                            : "bg-gray-100 text-gray-600 border-transparent"
                            } ${tab !== "titulo" ? "ml-1" : ""}`}
                    >
                        {tab === "titulo" ? "Título Conta Pagar" : "Consulta"}
                    </button>
                ))}
            </div>

            {/* Conteúdo */}
            <div className="flex-1 p-3 bg-white border-x border-b border-gray-200 rounded-b-md overflow-y-auto flex flex-col gap-2">
                {/* ======================= ABA TÍTULO ======================= */}
                {activeTab === "titulo" && (
                    <>
                        {/* CARD 1 - Informações do Título */}
                        <fieldset className="border border-gray-300 rounded p-3 bg-white">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                Informações do Título Contas Pagar
                            </legend>

                            <div className="space-y-2">
                                {/* Linha 1 */}
                                <div className="grid grid-cols-12 gap-2">
                                    <Label className="col-span-1 justify-end">Empresa</Label>
                                    <Sel
                                        className="col-span-5"
                                        value={dados.empresa}
                                        onChange={setField("empresa")}
                                    >
                                        {empresasMock.map((e) => (
                                            <option key={e.value} value={e.value}>
                                                {e.label}
                                            </option>
                                        ))}
                                    </Sel>

                                    <Label className="col-span-1 justify-end">Filial</Label>
                                    <Sel
                                        className="col-span-5"
                                        value={dados.filial}
                                        onChange={setField("filial")}
                                    >
                                        {filiaisMock.map((f) => (
                                            <option key={f.value} value={f.value}>
                                                {f.label}
                                            </option>
                                        ))}
                                    </Sel>
                                </div>

                                {/* Linha 2 */}
                                <div className="grid grid-cols-12 gap-2">
                                    <Label className="col-span-1 justify-end">Fornecedor</Label>
                                    <Txt
                                        className="col-span-2"
                                        value={dados.fornecedorCnpj}
                                        onChange={setField("fornecedorCnpj")}
                                    />
                                    <Txt
                                        className="col-span-8 bg-gray-200"
                                        readOnly
                                        value={dados.fornecedorNome}
                                        placeholder="Razão Social (não editável)"
                                    />
                                    <button
                                        title="Abrir modal do Fornecedor (futuro)"
                                        className="col-span-1 border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded h-[26px] text-[12px]"
                                    >
                                        ...
                                    </button>
                                </div>

                                {/* Linha 3 */}
                                <div className="grid grid-cols-12 gap-2">
                                    <Label className="col-span-1 justify-end">Nº Título</Label>
                                    <Txt className="col-span-2" value={dados.nrTitulo} onChange={setField("nrTitulo")} />

                                    <Label className="col-span-1 justify-end">Nº Parcela</Label>
                                    <Txt className="col-span-1" value={dados.nrParcela} onChange={setField("nrParcela")} />

                                    <Label className="col-span-1 justify-end">Qtd Parcela</Label>

                                    <Txt className="col-span-1" value={dados.qtdParcela} onChange={setField("qtdParcela")} />
                                    <button
                                        title="Adicionar parcelas"
                                        onClick={() => {
                                            setQtdAddParcelas("");
                                            setShowModalParcelas(true);
                                        }}
                                        className="border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded w-[28px] h-[26px] flex items-center justify-center"
                                    >
                                        <PlusCircle size={16} className="text-green-700" />
                                    </button>



                                    <Label className="col-span-1 justify-end">Competência</Label>
                                    <Txt
                                        type="date"
                                        className="col-span-2"
                                        value={dados.dtCompetencia}
                                        {...bindDateSmart(setField("dtCompetencia"))}
                                    />

                                    <label className="flex items-center gap-1 text-[12px]">
                                        <input
                                            type="checkbox"
                                            className="accent-red-700"
                                            checked={dados.flCompetenciaMensal}
                                            onChange={setField("flCompetenciaMensal")}
                                        />
                                        Mensal
                                    </label>

                                </div>

                                {/* Linha 4 */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-1 justify-end">Vencimento</Label>
                                    <Txt
                                        type="date"
                                        className="col-span-2"
                                        value={dados.dtVencimento}
                                        {...bindDateSmart(setField("dtVencimento"))}
                                    />

                                    <Label className="col-span-1 justify-end">Valor Parcela</Label>
                                    <Txt className="col-span-1 text-right" value={dados.vrParcela} onChange={setField("vrParcela")} />

                                    <Label className="col-span-1 justify-end">Previsão Pgto</Label>
                                    <Txt
                                        type="date"
                                        className="col-span-2"
                                        value={dados.dtPrevisao}
                                        {...bindDateSmart(setField("dtPrevisao"))}
                                    />

                                    <Label className="col-span-1 justify-end">Condição Pgto</Label>
                                    <Sel className="col-span-3" value={dados.condPgto} onChange={setField("condPgto")}>
                                        {condPgtoMock.map((c) => (
                                            <option key={c.value} value={c.value}>
                                                {c.label}
                                            </option>
                                        ))}
                                    </Sel>


                                </div>

                                {/* Linha 5 */}
                                <div className="grid grid-cols-12 gap-2">
                                    <Label className="col-span-1 justify-end">Categoria</Label>
                                    <Txt className="col-span-1" value={dados.catCod} onChange={setField("catCod")} />
                                    <Txt className="col-span-4 bg-gray-200" readOnly value={dados.catDesc} placeholder="Descrição (não editável)" />

                                    <Label className="col-span-1 justify-end">Subcategoria</Label>
                                    <Txt className="col-span-1" value={dados.subCatCod} onChange={setField("subCatCod")} />
                                    <Txt className="col-span-4 bg-gray-200" readOnly value={dados.subCatDesc} placeholder="Descrição (não editável)" />
                                </div>

                                {/* Linha 6 */}
                                <div className="grid grid-cols-12 gap-2">
                                    <Label className="col-span-1 justify-end">Centro Custo</Label>
                                    <Sel className="col-span-3" value={dados.centroCusto} onChange={setField("centroCusto")}>
                                        {centroCustoMock.map((c) => (
                                            <option key={c.value} value={c.value}>
                                                {c.label}
                                            </option>
                                        ))}
                                    </Sel>

                                    <Label className="col-span-1 justify-end">Nº Conta</Label>
                                    <Sel className="col-span-3" value={dados.nrConta} onChange={setField("nrConta")}>
                                        {contasMock.map((c) => (
                                            <option key={c.value} value={c.value}>
                                                {c.label}
                                            </option>
                                        ))}
                                    </Sel>

                                    <Label className="col-span-1 justify-end">Banco</Label>
                                    <Txt className="col-span-1 bg-gray-200 text-right" readOnly value={dados.banco} />

                                    <Label className="col-span-1 justify-end">Agência</Label>
                                    <Txt className="col-span-1 bg-gray-200 text-right" readOnly value={dados.agencia} />
                                </div>

                                {/* Linha 7 */}
                                <div className="grid grid-cols-12 gap-2">
                                    <Label className="col-span-1 justify-end">Nº Nota Fiscal</Label>
                                    <Txt className="col-span-2" value={dados.nrNF} onChange={setField("nrNF")} />

                                    <Label className="col-span-1 justify-end">Nº NF Série</Label>
                                    <Txt className="col-span-1" value={dados.nrNFSerie} onChange={setField("nrNFSerie")} />

                                    <Label className="col-span-1 justify-end">Nº Viagem</Label>
                                    <Txt className="col-span-2" value={dados.nrViagem} onChange={setField("nrViagem")} />
                                    <Label className="col-span-1 justify-end">Inclusão</Label>
                                    <Txt
                                        type="date"
                                        className="col-span-3 bg-gray-200"
                                        readOnly
                                        value={dados.dtInclusao}
                                        {...bindDateSmart(setField("dtInclusao"))}
                                    />

                                </div>

                                {/* Linha 8 */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-1 justify-end">Observação</Label>
                                    <Txt className="col-span-9" value={dados.observacao} onChange={setField("observacao")} />

                                    <div className="col-span-2 flex justify-end">
                                        <button
                                            className="border border-gray-300 rounded px-3 py-[4px] text-[12px] bg-gray-50 hover:bg-gray-100 flex items-center gap-1"
                                            title="Alterar (mock)"
                                            onClick={handleAlterar}
                                        >
                                            <CheckSquare size={16} className="text-red-700" />
                                            Alterar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </fieldset>

                        {/* CARD 2 - Informações do Pagamento (retrátil, inicia fechado) */}
                        <div className="border border-gray-300 rounded bg-white">
                            <div
                                className="flex justify-between items-center px-3 py-1 bg-gray-50 cursor-pointer select-none rounded-t"
                                onClick={() => setIsPagtoOpen((prev) => !prev)}
                            >
                                <h2 className="text-red-700 font-semibold text-[13px]">
                                    Informações do Pagamento do Título
                                </h2>
                                {isPagtoOpen ? (
                                    <ChevronUp size={16} className="text-gray-600" />
                                ) : (
                                    <ChevronDown size={16} className="text-gray-600" />
                                )}
                            </div>

                            <div
                                className={`overflow-hidden transition-all duration-500 ease-in-out ${isPagtoOpen ? "max-h-[400px]" : "max-h-[0px]"
                                    }`}
                            >
                                <div className="p-3 space-y-2">
                                    {/* Linha 1 */}
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                        <Label className="col-span-1 justify-end">Tipo Pagto</Label>
                                        <Txt
                                            className="col-span-1"
                                            value={pagto.tipoPagtoCod}
                                            onChange={(e) => {
                                                const cod = e.target.value;
                                                const obj = tipoPagtoMock.find((x) => x.cod === cod);
                                                setPagto((p) => ({
                                                    ...p,
                                                    tipoPagtoCod: cod,
                                                    tipoPagtoDesc: obj?.desc || "",
                                                }));
                                            }}
                                        />
                                        <Txt className="col-span-4 bg-gray-200" readOnly value={pagto.tipoPagtoDesc} />

                                        <Label className="col-span-1 justify-end">Docto Pgto</Label>
                                        <Txt
                                            className="col-span-5"
                                            value={pagto.doctoPagto}
                                            onChange={(e) => setPagto((p) => ({ ...p, doctoPagto: e.target.value }))}
                                        />
                                    </div>

                                    {/* Linha 2 */}
                                    <div className="grid grid-cols-12 gap-2 items-center">

                                        <Label className="col-span-1 justify-end">Pagamento</Label>
                                        <Txt
                                            type="date"
                                            className="col-span-2"
                                            value={pagto.dtPagamento}
                                            {...bindDateSmart((e) =>
                                                setPagto((p) => ({ ...p, dtPagamento: e.target.value }))
                                            )}
                                        />

                                        <Label className="col-span-1 justify-end">Valor Descto</Label>
                                        <Txt
                                            className="col-span-1 text-right"
                                            value={pagto.vrDescto}
                                            onChange={(e) => setPagto((p) => ({ ...p, vrDescto: e.target.value }))}
                                        />

                                        <Label className="col-span-2 justify-end">Valor Juros</Label>
                                        <Txt
                                            className="col-span-1 text-right"
                                            value={pagto.vrJuros}
                                            onChange={(e) => setPagto((p) => ({ ...p, vrJuros: e.target.value }))}
                                        />

                                        <Label className="col-span-1 justify-end">Valor Multa</Label>
                                        <Txt
                                            className="col-span-1 text-right"
                                            value={pagto.vrMulta}
                                            onChange={(e) => setPagto((p) => ({ ...p, vrMulta: e.target.value }))}
                                        />

                                        <Label className="col-span-1 justify-end">Valor Baixa</Label>
                                        <Txt
                                            className="col-span-1 text-right"
                                            value={pagto.vrBaixa}
                                            onChange={(e) => setPagto((p) => ({ ...p, vrBaixa: e.target.value }))}
                                        />



                                    </div>



                                    {/* Linha 3 */}
                                    <div className="grid grid-cols-12 gap-2 items-center">

                                        <Label className="col-span-1 justify-end">Baixa</Label>
                                        <Txt
                                            type="date"
                                            className="col-span-2 bg-gray-200"
                                            readOnly
                                            value={pagto.dtBaixa}
                                            onChange={() => { }}
                                        />



                                        <Label className="col-span-1 justify-end">Total Pago</Label>
                                        <Txt
                                            className="col-span-1 text-right bg-gray-200"
                                            readOnly
                                            value={pagto.totalPago}
                                            onChange={(e) => setPagto((p) => ({ ...p, totalPago: e.target.value }))}
                                        />
                                        <Label className="col-span-1 justify-end col-start-7">Valor Já Pago</Label>
                                        <Txt
                                            className="col-span-1 text-right bg-gray-200" readOnly
                                            value={pagto.vrJaPago}
                                            onChange={(e) => setPagto((p) => ({ ...p, vrJaPago: e.target.value }))}
                                        />

                                        <Label className="col-span-1 justify-end">Saldo Título</Label>
                                        <Txt className="col-span-1 bg-gray-200 text-right" readOnly value={saldoTituloCalc} />

                                        <button
                                            onClick={handleBaixar}
                                            className="border border-gray-300 rounded px-3 py-[4px] bg-gray-50 hover:bg-gray-100 text-[12px]"
                                        >
                                            Baixar
                                        </button>
                                        <button
                                            onClick={handleEstornar}
                                            className="border border-gray-300 rounded px-3 py-[4px] bg-gray-50 hover:bg-gray-100 text-[12px]"
                                        >
                                            Estornar
                                        </button>
                                    </div>


                                </div>
                            </div>
                        </div>

                        {/* CARD 3 - Integração MULTIPAG (retrátil, inicia fechado) */}
                        <div className="border border-gray-300 rounded bg-white">
                            <div
                                className="flex justify-between items-center px-3 py-1 bg-gray-50 cursor-pointer select-none rounded-t"
                                onClick={() => setIsMultipagOpen((prev) => !prev)}
                            >
                                <h2 className="text-red-700 font-semibold text-[13px]">Integração MULTIPAG</h2>
                                {isMultipagOpen ? (
                                    <ChevronUp size={16} className="text-gray-600" />
                                ) : (
                                    <ChevronDown size={16} className="text-gray-600" />
                                )}
                            </div>

                            <div
                                className={`overflow-hidden transition-all duration-500 ease-in-out ${isMultipagOpen ? "max-h-[520px]" : "max-h-[0px]"
                                    }`}
                            >
                                <div className="p-3">
                                    {/* Abas internas MULTIPAG (padrão simples do print) */}
                                    <div className="flex flex-wrap gap-3 border-b border-gray-300 pb-1 mb-2">
                                        {multipagTabs.map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setMultipagTab(t)}
                                                className={`text-[12px] px-1 ${multipagTab === t ? "font-semibold text-gray-800" : "text-gray-600"
                                                    }`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Conteúdo das abas */}
                                    {/* Transferência */}
                                    {multipagTab === "Transferência" && (
                                        <div className="space-y-2">
                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-1">Tp. Lançamento</Label>
                                                <Sel className="col-span-5" value={multipag.tpLancTransfer} onChange={setMP("tpLancTransfer")}>
                                                    <option>Crédito em Conta Corrente/Salário</option>
                                                    <option>Crédito em Conta</option>
                                                </Sel>

                                                <Label className="col-span-2 justify-end">Nosso Número</Label>
                                                <Txt className="col-span-4" value={multipag.nossoNumero} onChange={setMP("nossoNumero")} />
                                            </div>

                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-1">Finalidade DOC</Label>
                                                <Sel className="col-span-5" value={multipag.finalidadeDoc} onChange={setMP("finalidadeDoc")}>
                                                    <option>Crédito em Conta</option>
                                                    <option>Pagamento de Fornecedor</option>
                                                </Sel>

                                                <Label className="col-span-2 justify-end">Finalidade TED</Label>
                                                <Sel className="col-span-4" value={multipag.finalidadeTed} onChange={setMP("finalidadeTed")}>
                                                    <option>Pagamento de Impostos, Tributos e Taxas</option>
                                                    <option>Pagamento de Salários</option>
                                                </Sel>
                                            </div>

                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-1">Pago</Label>
                                                <Txt className="col-span-1 bg-gray-200" readOnly value={multipag.pago} />
                                                <Label className="col-span-1 col-start-8 justify-end">Retorno</Label>
                                                <Txt className="col-span-4" value={multipag.retorno} onChange={setMP("retorno")} />
                                            </div>
                                        </div>
                                    )}

                                    {/* Títulos/Boletos */}
                                    {multipagTab === "Títulos/Boletos" && (
                                        <div className="space-y-2">
                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-1">Tp. Lançamento</Label>
                                                <Sel className="col-span-5" value={multipag.tpLancBoleto} onChange={setMP("tpLancBoleto")}>
                                                    <option>Liquidação de Títulos do Próprio Banco</option>
                                                    <option>Liquidação de Títulos de Outros Bancos</option>
                                                </Sel>
                                            </div>

                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-1">Código Barras</Label>
                                                <Txt
                                                    className="col-span-11"
                                                    value={multipag.codigoBarrasBoleto}
                                                    onChange={setMP("codigoBarrasBoleto")}
                                                />
                                            </div>

                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-1">Pago</Label>
                                                <Txt className="col-span-1 bg-gray-200" readOnly value={multipag.pago} />
                                                <Label className="col-span-1">Retorno</Label>
                                                <Txt className="col-span-9" value={multipag.retorno} onChange={setMP("retorno")} />
                                            </div>
                                        </div>
                                    )}

                                    {/* PIX */}
                                    {multipagTab === "PIX" && (
                                        <div className="space-y-2">
                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-1">Tp. Chave Pix</Label>
                                                <Sel className="col-span-5" value={multipag.tpChavePix} onChange={setMP("tpChavePix")}>
                                                    <option>CPF/CNPJ</option>
                                                    <option>E-mail</option>
                                                    <option>Telefone</option>
                                                    <option>Chave Aleatória</option>
                                                </Sel>

                                                <Label className="col-span-1 justify-end">Chave Pix</Label>
                                                <Txt className="col-span-5" value={multipag.chavePix} onChange={setMP("chavePix")} />
                                            </div>

                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-1">Ident. Pagto</Label>
                                                <Txt className="col-span-11" value={multipag.identPagtoPix} onChange={setMP("identPagtoPix")} />
                                            </div>

                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-1">Pago</Label>
                                                <Txt className="col-span-1 bg-gray-200" readOnly value={multipag.pago} />
                                                <Label className="col-span-1">Retorno</Label>
                                                <Txt className="col-span-9" value={multipag.retorno} onChange={setMP("retorno")} />
                                            </div>
                                        </div>
                                    )}

                                    {/* Conta Consumo/Tributo */}
                                    {multipagTab === "Conta Consumo/Tributo Cód. Barras" && (
                                        <div className="space-y-2">
                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-1">Tp. Lançamento</Label>
                                                <Sel className="col-span-11" value={multipag.tpLancConsumo} onChange={setMP("tpLancConsumo")}>
                                                    <option>Contas de Consumo</option>
                                                    <option>Tributo</option>
                                                </Sel>
                                            </div>

                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-1">Código Barras</Label>
                                                <div className="col-span-11 grid grid-cols-12 gap-1">
                                                    <Txt className="col-span-3" value={multipag.codBar1} onChange={setMP("codBar1")} />
                                                    <Txt className="col-span-3" value={multipag.codBar2} onChange={setMP("codBar2")} />
                                                    <Txt className="col-span-3" value={multipag.codBar3} onChange={setMP("codBar3")} />
                                                    <Txt className="col-span-3" value={multipag.codBar4} onChange={setMP("codBar4")} />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-1">Pago</Label>
                                                <Txt className="col-span-1 bg-gray-200" readOnly value={multipag.pago} />
                                                <Label className="col-span-1">Retorno</Label>
                                                <Txt className="col-span-9" value={multipag.retorno} onChange={setMP("retorno")} />
                                            </div>
                                        </div>
                                    )}

                                    {/* FGTS */}
                                    {multipagTab === "FGTS" && (
                                        <div className="space-y-2">
                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-1">Tp. Lançamento</Label>
                                                <Sel className="col-span-11" value={multipag.tpLancFgts} onChange={setMP("tpLancFgts")}>
                                                    <option>FGTS</option>
                                                </Sel>
                                            </div>

                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-2">Lacre Conectividade Social</Label>
                                                <Txt className="col-span-4" value={multipag.lacre} onChange={setMP("lacre")} />

                                                <Label className="col-span-1">Dig. Lacre</Label>
                                                <Txt className="col-span-1" value={multipag.digLacre} onChange={setMP("digLacre")} />

                                                <Label className="col-span-2">Cód. Receita Tributo</Label>
                                                <Txt className="col-span-2" value={multipag.codReceitaFgts} onChange={setMP("codReceitaFgts")} />
                                            </div>

                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-1">Pago</Label>
                                                <Txt className="col-span-1 bg-gray-200" readOnly value={multipag.pago} />
                                                <Label className="col-span-1">Retorno</Label>
                                                <Txt className="col-span-9" value={multipag.retorno} onChange={setMP("retorno")} />
                                            </div>
                                        </div>
                                    )}

                                    {/* GPS */}
                                    {multipagTab === "GPS" && (
                                        <div className="space-y-2">
                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-1">Tp. Lançamento</Label>
                                                <Sel className="col-span-5" value={multipag.tpLancGps} onChange={setMP("tpLancGps")}>
                                                    <option>GPS</option>
                                                </Sel>

                                                <Label className="col-span-2 justify-end">Vr. Outras Entidades</Label>
                                                <Txt className="col-span-4 text-right" value={multipag.vrOutrasEnt} onChange={setMP("vrOutrasEnt")} />
                                            </div>

                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-1">Cód. Receita Tributo</Label>
                                                <Txt className="col-span-5" value={multipag.codReceitaGps} onChange={setMP("codReceitaGps")} />

                                                <Label className="col-span-2 justify-end ">Vr. Atualização Monetária</Label>
                                                <Txt className="col-span-4 text-right" value={multipag.vrAtualMon} onChange={setMP("vrAtualMon")} />

                                                <div className="col-span-4" />
                                            </div>

                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-1">Pago</Label>
                                                <Txt className="col-span-1 bg-gray-200" readOnly value={multipag.pago} />
                                                <Label className="col-span-1">Retorno</Label>
                                                <Txt className="col-span-9" value={multipag.retorno} onChange={setMP("retorno")} />
                                            </div>
                                        </div>
                                    )}

                                    {/* DARF/DETRAN */}
                                    {multipagTab === "DARF/DETRAN" && (
                                        <div className="space-y-2">
                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-1 ">Tp. Lançamento</Label>
                                                <Sel className="col-span-5" value={multipag.tpLancDarf} onChange={setMP("tpLancDarf")}>
                                                    <option>DARF</option>
                                                </Sel>

                                                <Label className="col-span-1 justify-end">Nº Referência</Label>
                                                <Txt className="col-span-5" value={multipag.nrReferenciaDarf} onChange={setMP("nrReferenciaDarf")} />
                                            </div>

                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-1">Data Apuração</Label>
                                                <Txt
                                                    type="date"
                                                    className="col-span-3"
                                                    value={multipag.periodoApuracaoDarf}
                                                    {...bindDateSmart(setMP("periodoApuracaoDarf"))}
                                                />

                                                <Label className="col-span-1 col-start-7">Vr. Juros / Multa</Label>
                                                <Txt
                                                    className="col-span-2 text-right"
                                                    value={multipag.vrJurosMultaDarf}
                                                    onChange={setMP("vrJurosMultaDarf")}
                                                />

                                                <Label className="col-span-2 justify-end">Cód. Receita Tributo</Label>
                                                <Txt className="col-span-1" value={multipag.codReceitaDarf} onChange={setMP("codReceitaDarf")} />
                                            </div>

                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-1">Pago</Label>
                                                <Txt className="col-span-1 bg-gray-200" readOnly value={multipag.pago} />
                                                <Label className="col-span-1">Retorno</Label>
                                                <Txt className="col-span-9" value={multipag.retorno} onChange={setMP("retorno")} />
                                            </div>
                                        </div>
                                    )}

                                    {/* DARF Simples */}
                                    {multipagTab === "DARF Simples" && (
                                        <div className="space-y-2">
                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-1">Tp. Lançamento</Label>
                                                <Sel className="col-span-4" value={multipag.tpLancDarfSimples} onChange={setMP("tpLancDarfSimples")}>
                                                    <option>DARF Simples</option>
                                                </Sel>

                                                <Label className="col-span-1">Vr. Juros / Multa</Label>
                                                <Txt
                                                    className="col-span-2 text-right"
                                                    value={multipag.vrJurosMultaDarfSimples}
                                                    onChange={setMP("vrJurosMultaDarfSimples")}
                                                />

                                                <Label className="col-span-2">Período Referência</Label>
                                                <Txt
                                                    type="date"
                                                    className="col-span-2"
                                                    value={multipag.periodoRefDarfSimples}
                                                    {...bindDateSmart(setMP("periodoRefDarfSimples"))}
                                                />
                                            </div>

                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-1">Vr. Rec. Bruta Acum</Label>
                                                <Txt className="col-span-3 text-right" value={multipag.vrRecBrutaAcum} onChange={setMP("vrRecBrutaAcum")} />

                                                <Label className="col-span-2 justify-end">Pc. Sobre Receita Bruta</Label>
                                                <Txt className="col-span-2 text-right" value={multipag.pcSobreRecBruta} onChange={setMP("pcSobreRecBruta")} />

                                                <Label className="col-span-2">Cód. Receita Tributo</Label>
                                                <Txt className="col-span-2" value={multipag.codReceitaDarfSimples} onChange={setMP("codReceitaDarfSimples")} />
                                            </div>

                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-1">Pago</Label>
                                                <Txt className="col-span-1 bg-gray-200" readOnly value={multipag.pago} />
                                                <Label className="col-span-1">Retorno</Label>
                                                <Txt className="col-span-9" value={multipag.retorno} onChange={setMP("retorno")} />
                                            </div>
                                        </div>
                                    )}

                                    {/* GARE SP */}
                                    {multipagTab === "GARE SP" && (
                                        <div className="space-y-2">
                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-1">Tp. Lançamento</Label>
                                                <Sel className="col-span-2" value={multipag.tpLancGare} onChange={setMP("tpLancGare")}>
                                                    <option>GARE SP - ICMS</option>
                                                </Sel>

                                                <Label className="col-span-2 justify-end">Dívida Ativa/Etiqueta</Label>
                                                <Txt className="col-span-1" value={multipag.dividaAtivaEtiqueta} onChange={setMP("dividaAtivaEtiqueta")} />

                                                <Label className="col-span-1 justify-end">Nº Parcela</Label>
                                                <Txt className="col-span-1" value={multipag.nrParcelaNotif} onChange={setMP("nrParcelaNotif")} />

                                                <Label className="col-span-2 justify-end">Período Referência</Label>
                                                <Txt
                                                    type="date"
                                                    className="col-span-2"
                                                    value={multipag.periodoRefGare}
                                                    {...bindDateSmart(setMP("periodoRefGare"))}
                                                />
                                            </div>

                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-1">Vr. Receita</Label>
                                                <Txt className="col-span-2 text-right" value={multipag.vrReceitaGare} onChange={setMP("vrReceitaGare")} />

                                                <Label className="col-span-2 justify-end">Vr. Juros/Multa</Label>
                                                <Txt className="col-span-1 text-right" value={multipag.vrJurosMultaGare} onChange={setMP("vrJurosMultaGare")} />

                                                <Label className="col-span-2 justify-end">IE/Cód. Município/Nº Declaração</Label>
                                                <Txt className="col-span-1" value={multipag.ieCodMunDecl} onChange={setMP("ieCodMunDecl")} />

                                                <Label className="col-span-2 justify-end">Cód. Receita Tributo</Label>
                                                <Txt className="col-span-1" value={multipag.codReceitaGare} onChange={setMP("codReceitaGare")} />
                                            </div>

                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-1">Pago</Label>
                                                <Txt className="col-span-1 bg-gray-200" readOnly value={multipag.pago} />
                                                <Label className="col-span-1">Retorno</Label>
                                                <Txt className="col-span-9" value={multipag.retorno} onChange={setMP("retorno")} />
                                            </div>
                                        </div>
                                    )}

                                    {/* Folha Salarial */}
                                    {multipagTab === "Folha Salarial" && (
                                        <div className="space-y-2">
                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-2">Tp. Lançamento</Label>
                                                <Sel className="col-span-10" value={multipag.tpLancFolha} onChange={setMP("tpLancFolha")}>
                                                    <option>Crédito em Conta Corrente/Salário</option>
                                                    <option>Crédito em Conta</option>
                                                </Sel>
                                            </div>

                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-1">Pago</Label>
                                                <Txt className="col-span-1 bg-gray-200" readOnly value={multipag.pago} />
                                                <Label className="col-span-1">Retorno</Label>
                                                <Txt className="col-span-9" value={multipag.retorno} onChange={setMP("retorno")} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* ======================= ABA CONSULTA ======================= */}
                {activeTab === "consulta" && (
                    <>
                        {/* CARD 1 - Parâmetros de Pesquisa */}
                        <fieldset className="border border-gray-300 rounded p-3 bg-white">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                Parâmetros de Pesquisa
                            </legend>

                            <div className="space-y-2">
                                {/* Linha 1 */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-1 justify-end">Empresa</Label>
                                    <Sel className="col-span-4" value={consulta.empresa} onChange={setC("empresa")}>
                                        {empresasMock.map((e) => (
                                            <option key={e.value} value={e.value}>
                                                {e.label}
                                            </option>
                                        ))}
                                    </Sel>

                                    <Label className="col-span-1 justify-end">Filial</Label>
                                    <Sel className="col-span-4" value={consulta.filial} onChange={setC("filial")}>
                                        <option value="TODAS">TODAS</option>
                                        {filiaisMock.map((f) => (
                                            <option key={f.value} value={f.value}>
                                                {f.label}
                                            </option>
                                        ))}
                                    </Sel>

                                    <div className="col-span-2 flex justify-end gap-2">
                                        <button
                                            onClick={pesquisar}
                                            className="border border-gray-300 rounded px-3 py-[4px] bg-gray-50 hover:bg-gray-100 text-[12px] flex items-center gap-1"
                                        >
                                            <Search size={14} className="text-red-700" />
                                            Pesquisar
                                        </button>
                                        <button
                                            onClick={limparConsulta}
                                            className="border border-gray-300 rounded px-3 py-[4px] bg-gray-50 hover:bg-gray-100 text-[12px] flex items-center gap-1"
                                        >
                                            <RotateCcw size={14} className="text-red-700" />
                                            Limpar
                                        </button>
                                    </div>
                                </div>

                                {/* Linha 2 - Períodos */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-1 justify-end">Vencimento</Label>
                                    <Txt type="date" className="col-span-2" value={consulta.vencDe} {...bindDateSmart(setC("vencDe"))} />
                                    <Txt type="date" className="col-span-2" value={consulta.vencAte} {...bindDateSmart(setC("vencAte"))} />


                                    <Label className="col-span-1 justify-end">Pagos</Label>
                                    <Txt type="date" className="col-span-2" value={consulta.pagDe} {...bindDateSmart(setC("pagDe"))} />
                                    <Txt type="date" className="col-span-2" value={consulta.pagAte} {...bindDateSmart(setC("pagAte"))} />
                                    <Label className="col-span-1 justify-end">Nº Viagem</Label>
                                    <Txt className="col-span-1" value={consulta.nrViagem} onChange={setC("nrViagem")} />
                                </div>

                                {/* Linha 3 */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-1 justify-end">Fornecedor</Label>
                                    <Txt className="col-span-2" value={consulta.fornCnpj} onChange={setC("fornCnpj")} />
                                    <Txt className="col-span-5 bg-gray-200" readOnly value={consulta.fornNome} placeholder="Razão Social (não editável)" />

                                    <Label className="col-span-1 justify-end">Valor Parc.</Label>
                                    <Txt className="col-span-1 text-right" value={consulta.valor} onChange={setC("valor")} />
                                    <Label className="col-span-1 justify-end">Pagos</Label>
                                    <Sel className="col-span-1" value={consulta.pagos} onChange={setC("pagos")}>
                                        <option>EM ABERTO</option>
                                        <option>PAGOS</option>
                                        <option>TODOS</option>
                                    </Sel>



                                </div>

                                {/* Linha 4 */}
                                <div className="grid grid-cols-12 gap-2 items-center">

                                    <Label className="col-span-1 justify-end">Nº Título</Label>
                                    <Txt className="col-span-2" value={consulta.nrTitulo} onChange={setC("nrTitulo")} />

                                    <Label className="col-span-1 justify-end">Inclusão</Label>
                                    <Txt type="date" className="col-span-2" value={consulta.incDe} {...bindDateSmart(setC("incDe"))} />
                                    <Txt type="date" className="col-span-2" value={consulta.incAte} {...bindDateSmart(setC("incAte"))} />
                                    <Label className="col-span-1 justify-end">Nº Nota Fiscal</Label>
                                    <Txt className="col-span-1" value={consulta.nrNF} onChange={setC("nrNF")} />

                                    <Label className="col-span-1 justify-end">Nº NF Série</Label>
                                    <Txt className="col-span-1" value={consulta.nrNFSerie} onChange={setC("nrNFSerie")} />

                                    <Label className="col-span-1 justify-end">Integr. Banco</Label>
                                    <Sel className="col-span-2" value={consulta.integrBanco} onChange={setC("integrBanco")}>
                                        {integrBancoMock.map((i) => (
                                            <option key={i.value} value={i.value}>
                                                {i.label}
                                            </option>
                                        ))}
                                    </Sel>
                                </div>
                            </div>
                        </fieldset>

                        {/* CARD 2 - Relação de Títulos */}
                        <fieldset className="border border-gray-300 rounded p-2 bg-white">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                Relação de Títulos a Pagar (duplo clique abre no Título)
                            </legend>

                            <div className="w-full overflow-x-auto">
                                <table className="min-w-[1200px] w-full text-[12px] border-collapse">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            {modoExcluir && <th className="border px-2 py-1 w-[40px]"></th>}
                                            <th className="border px-2 py-1">Empresa</th>
                                            <th className="border px-2 py-1">Filial</th>
                                            <th className="border px-2 py-1">CNPJ/CPF</th>
                                            <th className="border px-2 py-1">Fornecedor</th>
                                            <th className="border px-2 py-1">Título</th>
                                            <th className="border px-2 py-1">Nº Parcela</th>
                                            <th className="border px-2 py-1">Vencimento</th>
                                            <th className="border px-2 py-1">Inclusão</th>
                                            <th className="border px-2 py-1">Valor Parcela</th>
                                            <th className="border px-2 py-1">Saldo Título</th>
                                            <th className="border px-2 py-1">Pagamento</th>
                                            <th className="border px-2 py-1">Competência</th>
                                            <th className="border px-2 py-1">Nº NF</th>
                                            <th className="border px-2 py-1">NF Série</th>
                                            <th className="border px-2 py-1">Observação</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {listaTitulos.map((r) => (
                                            <tr
                                                key={r.id}
                                                className="hover:bg-green-100 cursor-pointer"
                                                onDoubleClick={() => abrirNoTitulo(r)}
                                            >
                                                {modoExcluir && (
                                                    <td className="border px-2 py-1 text-center">
                                                        <input
                                                            type="checkbox"
                                                            className="accent-red-700"
                                                            checked={selecionados.has(r.id)}
                                                            onChange={() => toggleSelecionado(r.id)}
                                                        />
                                                    </td>
                                                )}
                                                <td className="border px-2 py-1 text-center">{r.empresa}</td>
                                                <td className="border px-2 py-1 text-center">{r.filial}</td>
                                                <td className="border px-2 py-1 text-center">{r.cnpj}</td>
                                                <td className="border px-2 py-1">{r.fornecedor}</td>
                                                <td className="border px-2 py-1 text-center">{r.titulo}</td>
                                                <td className="border px-2 py-1 text-center">{r.parcela}</td>
                                                <td className="border px-2 py-1 text-center">{r.vencimento}</td>
                                                <td className="border px-2 py-1 text-center">{r.inclusao}</td>
                                                <td className="border px-2 py-1 text-right">{formatNumero(r.valor)}</td>
                                                <td className="border px-2 py-1 text-right">{formatNumero(r.saldo)}</td>
                                                <td className="border px-2 py-1 text-center">{r.pagamento}</td>
                                                <td className="border px-2 py-1 text-center">{r.competencia}</td>
                                                <td className="border px-2 py-1 text-center">{r.nf}</td>
                                                <td className="border px-2 py-1 text-center">{r.nfSerie}</td>
                                                <td className="border px-2 py-1">{r.obs}</td>
                                            </tr>
                                        ))}

                                        {listaTitulos.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={modoExcluir ? 17 : 16}
                                                    className="border px-2 py-2 text-center text-gray-500"
                                                >
                                                    Nenhum registro. Informe os filtros e clique em Pesquisar.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </fieldset>

                        {/* CARD 3 - Excluir (controle) */}
                        <div className="border border-gray-300 rounded bg-white p-2 flex items-center justify-end gap-2">
                            {!modoExcluir ? (
                                <button
                                    onClick={() => setModoExcluir(true)}
                                    className="border border-gray-300 rounded px-3 py-[4px] bg-gray-50 hover:bg-gray-100 text-[12px]"
                                >
                                    Excluir
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={selecionarTodos}
                                        className="border border-gray-300 rounded px-3 py-[4px] bg-gray-50 hover:bg-gray-100 text-[12px]"
                                    >
                                        {selecionados.size === listaTitulos.length ? "Limpar Seleção" : "Selecionar Todos"}
                                    </button>

                                    <button
                                        onClick={() => {
                                            setModoExcluir(false);
                                            setSelecionados(new Set());
                                        }}
                                        className="border border-gray-300 rounded px-3 py-[4px] bg-gray-50 hover:bg-gray-100 text-[12px]"
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        onClick={confirmarExcluir}
                                        className="border border-gray-300 rounded px-3 py-[4px] bg-gray-50 hover:bg-gray-100 text-[12px]"
                                    >
                                        Confirmar Excluir
                                    </button>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* ======================= Rodapé padrão ======================= */}
            <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">
                <button
                    onClick={() => navigate(-1)}
                    title="Fechar"
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                >
                    <XCircle size={20} />
                    <span>Fechar</span>
                </button>

                <button
                    onClick={handleLimparTela}
                    title="Limpar"
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                >
                    <RotateCcw size={20} />
                    <span>Limpar</span>
                </button>

                <button
                    onClick={handleIncluir}
                    title="Incluir"
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                >
                    <PlusCircle size={20} />
                    <span>Incluir</span>
                </button>

                <button
                    onClick={handleAlterar}
                    title="Alterar"
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                >
                    <Edit size={20} />
                    <span>Alterar</span>
                </button>

                <button
                    onClick={handleExcluir}
                    title="Excluir"
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                >
                    <Trash2 size={20} />
                    <span>Excluir</span>
                </button>

                <button
                    onClick={handleReagenda}
                    title="Re-Agenda"
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                >
                    <CalendarClock size={20} />
                    <span>Re-Agenda</span>
                </button>
            </div>

            {/* ======================= Modal: Adicionar Parcelas ======================= */}
            {showModalParcelas && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[420px] rounded shadow-lg border p-4">
                        <h2 className="text-[14px] font-semibold text-gray-800 mb-2">Adicionar parcelas</h2>
                        <p className="text-[13px] text-gray-700 mb-2">
                            Deseja realmente incluir novas parcelas ao título?
                        </p>
                        <p className="text-[13px] text-gray-700 mb-2">
                            Então informe a quantidade de parcelas que deseja adicionar:
                        </p>

                        <Txt
                            className="w-full"
                            value={qtdAddParcelas}
                            onChange={(e) => setQtdAddParcelas(e.target.value)}
                            autoFocus
                        />

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                className="border border-gray-300 rounded px-3 py-[4px] bg-gray-50 hover:bg-gray-100 text-[12px]"
                                onClick={() => setShowModalParcelas(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="border border-gray-300 rounded px-3 py-[4px] bg-gray-50 hover:bg-gray-100 text-[12px]"
                                onClick={() => {
                                    const add = parseInt(qtdAddParcelas || "0", 10);
                                    if (!add || add < 0) {
                                        setModalMsg({ tipo: "info", texto: "Informe uma quantidade válida." });
                                        return;
                                    }
                                    const atual = parseInt(dados.qtdParcela || "0", 10) || 0;
                                    setDados((p) => ({ ...p, qtdParcela: String(atual + add) }));
                                    setShowModalParcelas(false);
                                    setModalMsg({ tipo: "sucesso", texto: "Parcelas adicionadas com sucesso! (mock)" });
                                }}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ======================= Modal: Re-Agendamento ======================= */}
            {showModalReagenda && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[320px] rounded shadow-lg border p-4">
                        <h2 className="text-[14px] font-semibold text-gray-800 mb-3">Re-Agendamento</h2>

                        <div className="grid grid-cols-12 gap-2 items-center">
                            <Label className="col-span-4">Prev. Pagto</Label>
                            <Txt
                                type="date"
                                className="col-span-8"
                                value={novoPrevPagto}
                                {...bindDateSmart((e) => setNovoPrevPagto(e.target.value))}
                            />
                        </div>

                        <div className="flex justify-between mt-4">
                            <button
                                className="border border-gray-300 rounded px-3 py-[4px] bg-gray-50 hover:bg-gray-100 text-[12px]"
                                onClick={() => setShowModalReagenda(false)}
                            >
                                Voltar
                            </button>
                            <button
                                className="border border-gray-300 rounded px-3 py-[4px] bg-gray-50 hover:bg-gray-100 text-[12px]"
                                onClick={() => {
                                    setDados((p) => ({ ...p, dtPrevisao: novoPrevPagto }));
                                    setShowModalReagenda(false);
                                    setModalMsg({ tipo: "sucesso", texto: "Previsão de pagamento atualizada! (mock)" });
                                }}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ======================= ModalMsg padrão (sucesso/confirm/info) ======================= */}
            {modalMsg && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 shadow-lg rounded border text-center w-[320px]">
                        <p
                            className={`font-bold mb-4 ${modalMsg.tipo === "sucesso"
                                ? "text-green-700"
                                : modalMsg.tipo === "confirm"
                                    ? "text-gray-800"
                                    : "text-red-700"
                                }`}
                        >
                            {modalMsg.texto}
                        </p>

                        {modalMsg.tipo === "confirm" ? (
                            <div className="flex justify-center gap-2">
                                <button
                                    className="px-3 py-1 bg-gray-300 rounded"
                                    onClick={() => setModalMsg(null)}
                                >
                                    Não
                                </button>
                                <button
                                    className="px-3 py-1 bg-red-700 text-white rounded"
                                    onClick={() => {
                                        const fn = modalMsg.onYes;
                                        setModalMsg(null);
                                        fn?.();
                                    }}
                                >
                                    Sim
                                </button>
                            </div>
                        ) : (
                            <button
                                className="px-3 py-1 bg-red-700 text-white rounded"
                                onClick={() => setModalMsg(null)}
                            >
                                OK
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
