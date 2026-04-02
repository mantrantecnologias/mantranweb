// src/pages/WMSNFEntrada.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIconColor } from "../context/IconColorContext";

import {
    XCircle,
    RotateCcw,
    PlusCircle,
    Edit,
    Trash2,
    CalendarClock,
    AlertTriangle,
    Boxes,
    FileText,
    Search,
    Truck,
    PackageSearch,
    ChevronUp,
    ChevronDown,
} from "lucide-react";


/* ========================= Helpers (padrão Mantran) ========================= */
function Label({ children, className = "" }) {
    return (
        <label
            className={`text-[12px] text-gray-700 flex items-center ${className}`}
        >
            {children}
        </label>
    );
}

function Txt(props) {
    return (
        <input
            {...props}
            className={
                "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full " +
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

/* ========================= Data inteligente (focus preenche / backspace limpa) ========================= */
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

/* ========================= Format helpers ========================= */
const parseNumero = (v) => {
    if (v === null || v === undefined || v === "") return 0;
    const s = String(v).trim();
    // aceita "1.234,56" ou "1234.56"
    const norm = s.includes(",") ? s.replace(/\./g, "").replace(",", ".") : s;
    const n = Number(norm);
    return Number.isFinite(n) ? n : 0;
};

const formatNumero = (n) =>
    Number(n || 0).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

const formatDataBR = (iso) => {
    if (!iso) return "";
    const [y, m, d] = String(iso).split("-");
    if (!y || !m || !d) return iso;
    return `${d}/${m}/${y}`;
};

/* ========================= Mocks ========================= */
const empresasMock = [{ value: "001", label: "001 - MANTRAN TRANSPORTES LTDA" }];

const filiaisMock = [
    { value: "001", label: "001 - TESTE MANTRAN" },
    { value: "002", label: "002 - FILIAL 002" },
];

const situacoesMock = [
    { value: "", label: "Todas" },
    { value: "Em Recebimento", label: "Em Recebimento" },
    { value: "Aguardando Liberação", label: "Aguardando Liberação" },
    { value: "Finalizada", label: "Finalizada" },
];

const freteMock = [
    { value: "Sem Frete", label: "Sem Frete" },
    { value: "CIF", label: "CIF" },
    { value: "FOB", label: "FOB" },
];

const tipoVolumeMock = [
    { value: "CX", label: "CX" },
    { value: "FD", label: "FD" },
    { value: "PLT", label: "PLT" },
];

const tipoProdutoMock = [
    { value: "LEITE CONDENSADO", label: "LEITE CONDENSADO" },
    { value: "LATICINIOS", label: "LATICINIOS" },
    { value: "REFRIGERADO", label: "REFRIGERADO" },
];

const nfsConsultaMock = [
    {
        id: 1,
        status: "Aguardando Liberação",
        empresa: "001",
        filial: "001",
        nrNF: "268969",
        serie: "1",
        data: "2025-12-10",
        cnpj: "02089969003474",
        cliente: "LATICINIOS BELA VIST",
        agenda: "0",
        qtVol: 168,
        tpVol: "CX",
        operador: "SUPORTE",
        cidade: "ARARAQUARA",
        uf: "SP",
    },
    {
        id: 2,
        status: "Aguardando Liberação",
        empresa: "001",
        filial: "001",
        nrNF: "268388",
        serie: "1",
        data: "2025-12-10",
        cnpj: "02089969003474",
        cliente: "LATICINIOS BELA VIST",
        agenda: "0",
        qtVol: 3,
        tpVol: "CX",
        operador: "SUPORTE",
        cidade: "ARARAQUARA",
        uf: "SP",
    },
];

const itensNFMock = [
    {
        nrItem: 2,
        cod: "000000000000010319",
        desc: "LEITE SEMIDESNAT. PIRACANJUBA 12X1L EDGE",
        lote: "0268969002",
        cor: "",
        venc: "1900-01-01",
        qtd: 30,
        vrUnit: 51.96,
        cst: "010",
        ncm: "04012010",
        etiqueta: "",
        qtdDiv: 0,
        // extras p/ somas transporte (mock)
        qtVol: 30,
        pesoBruto: 2173.39,
        pesoLiq: 2078.32,
    },
    {
        nrItem: 3,
        cod: "000000000000010318",
        desc: "LEITE DESNATADO PIRACANJUBA 12X1L EDGE",
        lote: "0268969003",
        cor: "",
        venc: "1900-01-01",
        qtd: 20,
        vrUnit: 51.96,
        cst: "010",
        ncm: "04012010",
        etiqueta: "",
        qtdDiv: 0,
        qtVol: 20,
        pesoBruto: 0,
        pesoLiq: 0,
    },
];

/* ========================= Modal genérico (modalMsg) ========================= */
function ModalMsg({ modal, onClose }) {
    if (!modal) return null;

    const isConfirm = modal.tipo === "confirm";
    const isSucesso = modal.tipo === "sucesso";
    const isInfo = modal.tipo === "info";

    const corTexto = isSucesso
        ? "text-green-700"
        : isConfirm
            ? "text-red-700"
            : "text-gray-800";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 shadow-lg rounded border text-center w-[320px]">
                <p className={`${corTexto} font-bold mb-4`}>{modal.texto}</p>

                <div className="flex justify-center gap-2">
                    {isConfirm ? (
                        <>
                            <button
                                className="px-3 py-1 bg-gray-200 rounded border"
                                onClick={() => onClose()}
                            >
                                Não
                            </button>
                            <button
                                className="px-3 py-1 bg-red-700 text-white rounded"
                                onClick={() => {
                                    modal.onYes?.();
                                    onClose();
                                }}
                            >
                                Sim
                            </button>
                        </>
                    ) : (
                        <button
                            className="px-3 py-1 bg-red-700 text-white rounded"
                            onClick={() => {
                                onClose();
                                modal.onOk?.();
                            }}
                        >
                            OK
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ========================= Modal Itens (ver todos) ========================= */
function ModalTodosItens({ open, onClose, itens, onSelect }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[1200px] max-w-[96vw] rounded-md shadow-lg border border-gray-300">
                <h2 className="text-center text-red-700 font-semibold py-2 text-sm border-b border-gray-300">
                    ITENS DA NOTA FISCAL
                </h2>

                <div className="p-3">
                    <div className="border border-gray-300 rounded max-h-[65vh] overflow-y-auto">
                        <table className="w-full text-[12px]">
                            <thead className="bg-gray-100 sticky top-0">
                                <tr>
                                    {[
                                        "Nº Item",
                                        "Código",
                                        "Descrição",
                                        "Lote",
                                        "Cor",
                                        "Venc.",
                                        "Qtd",
                                        "VR Unit.",
                                        "CST",
                                        "NCM",
                                        "Etiqueta",
                                        "Qtd Diverg.",
                                    ].map((h) => (
                                        <th key={h} className="border px-2 py-1 text-left">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {itens.map((it, idx) => (
                                    <tr
                                        key={idx}
                                        className="cursor-pointer hover:bg-red-100"
                                        onClick={() => {
                                            onSelect?.(it);
                                            onClose();
                                        }}
                                    >
                                        <td className="border px-2 py-1 text-center">{it.nrItem}</td>
                                        <td className="border px-2 py-1">{it.cod}</td>
                                        <td className="border px-2 py-1">{it.desc}</td>
                                        <td className="border px-2 py-1">{it.lote}</td>
                                        <td className="border px-2 py-1">{it.cor}</td>
                                        <td className="border px-2 py-1 text-center">
                                            {formatDataBR(it.venc)}
                                        </td>
                                        <td className="border px-2 py-1 text-right">
                                            {formatNumero(it.qtd)}
                                        </td>
                                        <td className="border px-2 py-1 text-right">
                                            {formatNumero(it.vrUnit)}
                                        </td>
                                        <td className="border px-2 py-1 text-center">{it.cst}</td>
                                        <td className="border px-2 py-1 text-center">{it.ncm}</td>
                                        <td className="border px-2 py-1">{it.etiqueta}</td>
                                        <td className="border px-2 py-1 text-right">
                                            {formatNumero(it.qtdDiv)}
                                        </td>
                                    </tr>
                                ))}
                                {itens.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={12}
                                            className="border px-2 py-6 text-center text-gray-500"
                                        >
                                            Sem itens.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end gap-2 mt-3">
                        <button
                            className="px-4 py-1 text-[13px] rounded border border-gray-300 hover:bg-gray-100"
                            onClick={onClose}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ========================= Modal Ocorrência (imagem 5 + produto + qtd) ========================= */
function ModalOcorrencia({ open, onClose, nfInfo, produtoAtual }) {
    const [form, setForm] = useState({
        dtDivergencia: getHojeISO(),
        descDivergencia: "",
        descSolucao: "",
        produto: "",
        qtd: "",
    });

    useEffect(() => {
        if (open) {
            setForm((p) => ({
                ...p,
                dtDivergencia: getHojeISO(),
                produto: produtoAtual?.desc ? `${produtoAtual.cod} - ${produtoAtual.desc}` : "",
                qtd: produtoAtual?.qtd ? String(produtoAtual.qtd) : "",
                descDivergencia: "",
                descSolucao: "",
            }));
        }
    }, [open, produtoAtual]);

    if (!open) return null;

    const setF = (campo) => (e) => setForm((p) => ({ ...p, [campo]: e.target.value }));

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[980px] max-w-[96vw] rounded-md shadow-lg border border-gray-300">
                <h2 className="text-center text-red-700 font-semibold py-2 text-sm border-b border-gray-300">
                    OCORRÊNCIA DE RECEBIMENTO DE MATERIAL
                </h2>

                <div className="p-3 space-y-3">
                    <fieldset className="border border-gray-300 rounded p-3 bg-white">
                        <legend className="px-2 text-red-700 font-semibold text-[13px]">
                            Dados
                        </legend>

                        <div className="space-y-2">
                            <div className="grid grid-cols-12 gap-2 items-center">
                                <Label className="col-span-1 justify-end">Cliente</Label>
                                <Txt className="col-span-2 bg-gray-200" readOnly value={nfInfo.clienteCnpj} />
                                <Txt className="col-span-6 bg-gray-200" readOnly value={nfInfo.clienteNome} />
                                <Label className="col-span-1 justify-end">Data</Label>
                                <Txt
                                    type="date"
                                    className="col-span-2"
                                    value={form.dtDivergencia}
                                    {...bindDateSmart(setF("dtDivergencia"))}
                                />
                            </div>

                            <div className="grid grid-cols-12 gap-2 items-center">
                                <Label className="col-span-1 justify-end">NF</Label>
                                <Txt className="col-span-2 bg-gray-200" readOnly value={nfInfo.nrNF} />
                                <Label className="col-span-1 justify-end">Série</Label>
                                <Txt className="col-span-1 bg-gray-200" readOnly value={nfInfo.serie} />
                                <Label className="col-span-1 justify-end">Produto</Label>
                                <Txt className="col-span-6" value={form.produto} onChange={setF("produto")} />
                            </div>

                            <div className="grid grid-cols-12 gap-2 items-center">
                                <Label className="col-span-1 justify-end">Qtde</Label>
                                <Txt className="col-span-2" value={form.qtd} onChange={setF("qtd")} />
                            </div>

                            <div className="grid grid-cols-12 gap-2 items-start">
                                <Label className="col-span-2">Descrição da Divergência</Label>
                                <textarea
                                    className="col-span-10 border border-gray-300 rounded p-2 text-[13px] h-[120px]"
                                    value={form.descDivergencia}
                                    onChange={setF("descDivergencia")}
                                />
                            </div>

                            <div className="grid grid-cols-12 gap-2 items-start">
                                <Label className="col-span-2">Descrição da Solução</Label>
                                <textarea
                                    className="col-span-10 border border-gray-300 rounded p-2 text-[13px] h-[120px]"
                                    value={form.descSolucao}
                                    onChange={setF("descSolucao")}
                                />
                            </div>
                        </div>
                    </fieldset>
                </div>

                <div className="flex justify-end gap-2 px-4 py-2 border-t border-gray-300 bg-gray-50">
                    <button
                        className="px-4 py-1 text-[13px] rounded border border-gray-300 hover:bg-gray-100"
                        onClick={onClose}
                    >
                        Fechar
                    </button>
                    <button
                        className="px-4 py-1 text-[13px] rounded bg-red-700 text-white hover:bg-red-800"
                        onClick={() => onClose()}
                    >
                        Salvar (mock)
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ========================= Modal Comex (interno) ========================= */
function ModalComex({ open, onClose, clienteNome }) {
    const [form, setForm] = useState({
        nomeNavio: "",
        nrReserva: "",
        nrViagem: "",
        imo: false,
        nvoCC: "",
        portoDest: "",
    });

    useEffect(() => {
        if (open) {
            setForm({
                nomeNavio: "",
                nrReserva: "",
                nrViagem: "",
                imo: false,
                nvoCC: "",
                portoDest: "",
            });
        }
    }, [open]);

    if (!open) return null;

    const setF = (campo) => (e) => {
        const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setForm((p) => ({ ...p, [campo]: v }));
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[1100px] max-w-[96vw] rounded-md shadow-lg border border-gray-300">
                <h2 className="text-center text-red-700 font-semibold py-2 text-sm border-b border-gray-300">
                    INFORMAÇÕES COMEX
                </h2>

                <div className="p-3 space-y-3">
                    <fieldset className="border border-gray-300 rounded p-3 bg-white">
                        <legend className="px-2 text-red-700 font-semibold text-[13px]">
                            Dados
                        </legend>

                        <div className="space-y-2">
                            <div className="grid grid-cols-12 gap-2 items-center">
                                <Label className="col-span-2">Nome Navio</Label>
                                <Txt className="col-span-4" value={form.nomeNavio} onChange={setF("nomeNavio")} />

                                <Label className="col-span-2">Nº Reserva</Label>
                                <Txt className="col-span-4" value={form.nrReserva} onChange={setF("nrReserva")} />
                            </div>

                            <div className="grid grid-cols-12 gap-2 items-center">
                                <Label className="col-span-2">Nº Viagem</Label>
                                <Txt className="col-span-3" value={form.nrViagem} onChange={setF("nrViagem")} />

                                <div className="col-span-2 flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        className="accent-red-700"
                                        checked={form.imo}
                                        onChange={setF("imo")}
                                    />
                                    <span className="text-[12px] text-gray-700">IMO</span>
                                </div>

                                <Label className="col-span-2">NVOCC</Label>
                                <Txt
                                    className="col-span-3"
                                    value={form.nvoCC}
                                    onChange={setF("nvoCC")}
                                    placeholder={clienteNome || ""}
                                />
                            </div>

                            <div className="grid grid-cols-12 gap-2 items-center">
                                <Label className="col-span-2">Porto Dest.</Label>
                                <Txt className="col-span-4" value={form.portoDest} onChange={setF("portoDest")} />
                            </div>
                        </div>
                    </fieldset>
                </div>

                <div className="flex justify-end gap-2 px-4 py-2 border-t border-gray-300 bg-gray-50">
                    <button
                        className="px-4 py-1 text-[13px] rounded border border-gray-300 hover:bg-gray-100"
                        onClick={onClose}
                    >
                        Fechar
                    </button>
                    <button
                        className="px-4 py-1 text-[13px] rounded bg-red-700 text-white hover:bg-red-800"
                        onClick={onClose}
                    >
                        Salvar (mock)
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ========================= Tela Principal ========================= */
export default function WMSNFEntrada({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    const [activeTab, setActiveTab] = useState("nota"); // "nota" | "consulta"

    /* Retráteis */

    const [isTranspOpen, setIsTranspOpen] = useState(true);

    /* Modais */
    const [modalMsg, setModalMsg] = useState(null);
    const [showTodosItens, setShowTodosItens] = useState(false);
    const [showOcorrencia, setShowOcorrencia] = useState(false);
    const [showComex, setShowComex] = useState(false);

    /* ============ Card 1 - Dados Nota ============ */
    const [nota, setNota] = useState({
        empresa: "001",
        filial: "001",
        agenda: "0",

        clienteCnpj: "02089969003474",
        clienteNome: "LATICINIOS BELA VIST",
        clienteCidade: "ARARAQUARA",
        clienteUF: "SP",

        nrNF: "268969",
        serie: "1",
        chave: "",
        emissao: "2025-06-07",
        recebto: "2025-12-10",

        temperatura: "0,00",
        nrPedido: "",
    });

    const setN = (campo) => (e) =>
        setNota((p) => ({ ...p, [campo]: e.target.value }));

    /* ============ Card 2 - Item ============ */
    const [item, setItem] = useState({
        produtoCod: "",
        produtoDesc: "",

        nrLote: "",
        validade: "",
        itemArmazenado: "NÃO",
        nrItem: "",

        qtdItem: "",
        vrUnit: "",
        cst: "",
        totalItem: "0,00",

        ncm: "",
        unidade: "UN",
        corCod: "",
        corDesc: "",
    });

    const setI = (campo) => (e) =>
        setItem((p) => ({ ...p, [campo]: e.target.value }));

    /* Seleção grid */
    const [selectedIndex, setSelectedIndex] = useState(null);

    /* Grid itens */
    const [itens, setItens] = useState(itensNFMock);

    useEffect(() => {
        // recalcula total item (mock)
        const total = parseNumero(item.qtdItem) * parseNumero(item.vrUnit);
        setItem((p) => ({ ...p, totalItem: formatNumero(total) }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item.qtdItem, item.vrUnit]);

    const totalNF = useMemo(() => {
        return itens.reduce((acc, it) => acc + Number(it.qtd || 0) * Number(it.vrUnit || 0), 0);
    }, [itens]);

    const somaQtVol = useMemo(() => {
        return itens.reduce((acc, it) => acc + Number(it.qtVol || 0), 0);
    }, [itens]);

    const somaPesoBruto = useMemo(() => {
        return itens.reduce((acc, it) => acc + Number(it.pesoBruto || 0), 0);
    }, [itens]);

    const somaPesoLiq = useMemo(() => {
        return itens.reduce((acc, it) => acc + Number(it.pesoLiq || 0), 0);
    }, [itens]);

    /* ============ Card 4 - Transporte ============ */
    const [transp, setTransp] = useState({
        transpCnpj: "07821734110",
        transpNome: "RODOBALDO DUENAS RODRIGUEZ",
        transpCidade: "PADRE BERNARDO",
        transpUF: "GO",

        frete: "Sem Frete",
        placa: "",
        placaUF: "",
        cubagem: "0",
        pesoBruto: "0,00",
        marca: "",

        qtVolume: "0,00",
        tipoVolume: "CX",
        tipoProduto: "LEITE CONDENSADO",
        pesoLiquido: "0,00",

        observacao: "",
    });

    useEffect(() => {
        setTransp((p) => ({
            ...p,
            qtVolume: formatNumero(somaQtVol),
            pesoBruto: formatNumero(somaPesoBruto),
            pesoLiquido: formatNumero(somaPesoLiq),
        }));
    }, [somaQtVol, somaPesoBruto, somaPesoLiq]);

    const setT = (campo) => (e) =>
        setTransp((p) => ({ ...p, [campo]: e.target.value }));

    /* refs p/ “enter no último campo” */
    const lastFieldRef = useRef(null);

    const limparItem = () => {
        setItem({
            produtoCod: "",
            produtoDesc: "",
            nrLote: "",
            validade: "",
            itemArmazenado: "NÃO",
            nrItem: "",
            qtdItem: "",
            vrUnit: "",
            cst: "",
            totalItem: "0,00",
            ncm: "",
            unidade: "UN",
            corCod: "",
            corDesc: "",
        });
        setSelectedIndex(null);
    };

    const carregarItemDoGrid = (it, idx) => {
        setSelectedIndex(idx);
        setItem({
            produtoCod: it.cod || "",
            produtoDesc: it.desc || "",
            nrLote: it.lote || "",
            validade: it.venc || "",
            itemArmazenado: "NÃO",
            nrItem: String(it.nrItem ?? ""),
            qtdItem: String(it.qtd ?? ""),
            vrUnit: String(it.vrUnit ?? ""),
            cst: it.cst || "",
            totalItem: formatNumero(Number(it.qtd || 0) * Number(it.vrUnit || 0)),
            ncm: it.ncm || "",
            unidade: it.unid || "UN",
            corCod: it.cor || "",
            corDesc: "", // mock
        });
    };

    const incluirItem = () => {
        // validação mínima mock
        if (!item.produtoCod || !item.produtoDesc) {
            setModalMsg({ tipo: "info", texto: "Informe o Produto (Código e Descrição)." });
            return;
        }
        if (!item.qtdItem) {
            setModalMsg({ tipo: "info", texto: "Informe a Qtd do Item." });
            return;
        }

        const novoNrItem =
            itens.length > 0 ? Number(itens[itens.length - 1].nrItem) + 1 : 1;

        const qtd = parseNumero(item.qtdItem);
        const vrUnit = parseNumero(item.vrUnit);

        const novo = {
            nrItem: Number(item.nrItem || novoNrItem),
            cod: item.produtoCod,
            desc: item.produtoDesc,
            lote: item.nrLote,
            cor: item.corCod,
            venc: item.validade,
            qtd,
            vrUnit,
            cst: item.cst,
            ncm: item.ncm,
            etiqueta: "",
            qtdDiv: 0,
            // extras p/ transporte (mock)
            qtVol: qtd,
            pesoBruto: 0,
            pesoLiq: 0,
        };

        setItens((prev) => [...prev, novo]);
        setModalMsg({ tipo: "sucesso", texto: "Item incluído com sucesso! (mock)" });
        limparItem();
    };

    const alterarItem = () => {
        if (selectedIndex === null) {
            setModalMsg({ tipo: "info", texto: "Selecione um item na grade para alterar." });
            return;
        }

        setItens((prev) =>
            prev.map((it, idx) => {
                if (idx !== selectedIndex) return it;

                const qtd = parseNumero(item.qtdItem);
                const vrUnit = parseNumero(item.vrUnit);

                return {
                    ...it,
                    nrItem: Number(item.nrItem || it.nrItem),
                    cod: item.produtoCod,
                    desc: item.produtoDesc,
                    lote: item.nrLote,
                    cor: item.corCod,
                    venc: item.validade,
                    qtd,
                    vrUnit,
                    cst: item.cst,
                    ncm: item.ncm,
                    qtVol: qtd, // mock
                };
            })
        );

        setModalMsg({ tipo: "sucesso", texto: "Item alterado com sucesso! (mock)" });
        limparItem();
    };

    const excluirItem = () => {
        if (selectedIndex === null) {
            setModalMsg({ tipo: "info", texto: "Selecione um item na grade para excluir." });
            return;
        }

        setModalMsg({
            tipo: "confirm",
            texto: "Deseja excluir o item selecionado?",
            onYes: () => {
                setItens((prev) => prev.filter((_, idx) => idx !== selectedIndex));
                limparItem();
                setModalMsg({ tipo: "sucesso", texto: "Item excluído com sucesso! (mock)" });
            },
        });
    };

    /* Enter/Tab no último campo do Card 2 */
    const onLastFieldKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            incluirItem();
            return;
        }
        if (e.key === "Tab") {
            // inclui e deixa o fluxo de TAB acontecer
            setTimeout(() => incluirItem(), 0);
        }
    };

    /* ============ Aba Consulta ============ */
    const [filtro, setFiltro] = useState({
        empresa: "001",
        filial: "001",
        buscarTodasFiliais: false,

        clienteCnpj: "",
        clienteNome: "",
        situacao: "Em Recebimento",

        produtoCod: "",
        produtoDesc: "",

        nrNF: "",
        agenda: "",

        dtEmissaoDe: "",
        dtEmissaoAte: "",
        usarData: true,
    });

    const setF = (campo) => (e) => {
        const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setFiltro((p) => ({ ...p, [campo]: v }));
    };

    const [listaConsulta, setListaConsulta] = useState([]);

    const pesquisar = () => {
        // mock simples: aplica filtros básicos
        const res = nfsConsultaMock.filter((x) => {
            if (filtro.empresa && x.empresa !== filtro.empresa) return false;
            if (!filtro.buscarTodasFiliais && filtro.filial && x.filial !== filtro.filial) return false;

            if (filtro.nrNF && String(x.nrNF) !== String(filtro.nrNF)) return false;
            if (filtro.agenda && String(x.agenda) !== String(filtro.agenda)) return false;

            if (filtro.clienteCnpj && String(x.cnpj) !== String(filtro.clienteCnpj)) return false;

            if (filtro.situacao && filtro.situacao !== "" && x.status !== filtro.situacao)
                ; // status/ situação nem sempre 1:1, então deixei solto (mock)

            if (filtro.usarData) {
                const de = filtro.dtEmissaoDe ? new Date(filtro.dtEmissaoDe) : null;
                const ate = filtro.dtEmissaoAte ? new Date(filtro.dtEmissaoAte) : null;
                const dt = new Date(x.data);
                if (de && dt < de) return false;
                if (ate && dt > ate) return false;
            }

            return true;
        });

        setListaConsulta(res);
    };

    const abrirNF = (row) => {
        // carrega nota (mock)
        setNota((p) => ({
            ...p,
            empresa: row.empresa,
            filial: row.filial,
            agenda: row.agenda,
            clienteCnpj: row.cnpj,
            clienteNome: row.cliente,
            clienteCidade: row.cidade || p.clienteCidade,
            clienteUF: row.uf || p.clienteUF,
            nrNF: row.nrNF,
            serie: row.serie,
            emissao: row.data,
            recebto: getHojeISO(),
        }));

        setItens(itensNFMock); // mock
        limparItem();

        setActiveTab("nota");
    };

    /* ============ Rodapé - ações globais ============ */
    const handleFechar = () => navigate(-1);

    const handleLimpar = () => {
        if (activeTab === "nota") {
            setNota((p) => ({
                ...p,
                clienteCnpj: "",
                clienteNome: "",
                clienteCidade: "",
                clienteUF: "",
                nrNF: "",
                serie: "",
                chave: "",
                emissao: "",
                recebto: "",
                temperatura: "",
                nrPedido: "",
                agenda: p.agenda || "0",
            }));
            setItens([]);
            limparItem();
            setTransp((p) => ({
                ...p,
                transpCnpj: "",
                transpNome: "",
                transpCidade: "",
                transpUF: "",
                frete: "Sem Frete",
                placa: "",
                placaUF: "",
                cubagem: "0",
                marca: "",
                tipoVolume: "CX",
                tipoProduto: "LEITE CONDENSADO",
                observacao: "",
            }));
            setModalMsg({ tipo: "sucesso", texto: "Tela limpa com sucesso! (mock)" });
            return;
        }

        setFiltro((p) => ({
            ...p,
            clienteCnpj: "",
            clienteNome: "",
            situacao: "Em Recebimento",
            produtoCod: "",
            produtoDesc: "",
            nrNF: "",
            agenda: "",
            dtEmissaoDe: "",
            dtEmissaoAte: "",
            usarData: true,
            buscarTodasFiliais: false,
        }));
        setListaConsulta([]);
        setModalMsg({ tipo: "sucesso", texto: "Filtros limpos com sucesso! (mock)" });
    };

    const handleIncluirNF = () => {
        setModalMsg({ tipo: "sucesso", texto: "Nota Fiscal incluída com sucesso! (mock)" });
    };

    const handleAlterarNF = () => {
        setModalMsg({ tipo: "sucesso", texto: "Nota Fiscal alterada com sucesso! (mock)" });
    };

    const handleExcluirNF = () => {
        setModalMsg({
            tipo: "confirm",
            texto: "Deseja excluir esta Nota Fiscal?",
            onYes: () => setModalMsg({ tipo: "sucesso", texto: "Nota Fiscal excluída com sucesso! (mock)" }),
        });
    };

    const handleLiberarAgenda = () => {
        // mock agenda (exemplo)
        const novaAgenda = String(Math.floor(Math.random() * 9000) + 1000);
        setNota((p) => ({ ...p, agenda: novaAgenda }));
        setModalMsg({ tipo: "info", texto: `Agenda liberada: ${novaAgenda}` });
    };

    const nfInfoParaOcorrencia = useMemo(
        () => ({
            clienteCnpj: nota.clienteCnpj,
            clienteNome: nota.clienteNome,
            nrNF: nota.nrNF,
            serie: nota.serie,
        }),
        [nota]
    );

    const produtoAtual = useMemo(() => {
        if (selectedIndex === null) return null;
        return itens[selectedIndex] || null;
    }, [selectedIndex, itens]);

    return (
        <>
            <div
                className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 bg-gray-50 h-[calc(100vh-56px)] flex flex-col ${open ? "ml-[192px]" : "ml-[56px]"
                    }`}
            >
                {/* Título */}
                <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                    Nota Fiscal Entrada
                </h1>

                {/* Abas */}
                <div className="flex border-b border-gray-300 bg-white">
                    {["nota", "consulta"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1 text-sm font-medium border-t border-x rounded-t-md ${activeTab === tab
                                ? "bg-white text-red-700 border-gray-300"
                                : "bg-gray-100 text-gray-600 border-transparent"
                                } ${tab !== "nota" ? "ml-1" : ""}`}
                        >
                            {tab === "nota" ? "Nota Fiscal" : "Consulta"}
                        </button>
                    ))}
                </div>

                {/* Conteúdo */}
                <div className="flex-1 p-3 bg-white border-x border-b border-gray-200 rounded-b-md overflow-y-auto flex flex-col gap-2 min-h-0">
                    {/* ======================= ABA NOTA FISCAL ======================= */}
                    {activeTab === "nota" && (
                        <>
                            {/* CARD 1 - Dados da Nota */}
                            <fieldset className="border border-gray-300 rounded p-3 bg-white">
                                <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                    Dados da Nota
                                </legend>

                                <div className="space-y-2">
                                    {/* Linha 1 */}
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                        <Label className="col-span-1 justify-end">Empresa</Label>
                                        <Sel
                                            className="col-span-4"
                                            value={nota.empresa}
                                            onChange={setN("empresa")}
                                        >
                                            {empresasMock.map((e) => (
                                                <option key={e.value} value={e.value}>
                                                    {e.label}
                                                </option>
                                            ))}
                                        </Sel>

                                        <Label className="col-span-1 justify-end">Filial</Label>
                                        <Sel
                                            className="col-span-4"
                                            value={nota.filial}
                                            onChange={setN("filial")}
                                        >
                                            {filiaisMock.map((f) => (
                                                <option key={f.value} value={f.value}>
                                                    {f.label}
                                                </option>
                                            ))}
                                        </Sel>

                                        <Label className="col-span-1 justify-end">Agenda</Label>
                                        <Txt
                                            className="col-span-1 bg-gray-200 text-center"
                                            readOnly
                                            value={nota.agenda}
                                        />
                                    </div>

                                    {/* Linha 2 */}
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                        <Label className="col-span-1 justify-end">Cliente</Label>
                                        <Txt
                                            className="col-span-2"
                                            value={nota.clienteCnpj}
                                            onChange={setN("clienteCnpj")}
                                        />
                                        <Txt
                                            className="col-span-6 bg-gray-200"
                                            readOnly
                                            value={nota.clienteNome}
                                        />
                                        <Txt
                                            className="col-span-2 bg-gray-200"
                                            readOnly
                                            value={nota.clienteCidade}
                                        />
                                        <Txt
                                            className="col-span-1 bg-gray-200 text-center"
                                            readOnly
                                            value={nota.clienteUF}
                                        />
                                    </div>

                                    {/* Linha 3 */}
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                        <Label className="col-span-1 justify-end">Número NF</Label>
                                        <Txt className="col-span-1" value={nota.nrNF} onChange={setN("nrNF")} />

                                        <Label className="col-span-1 justify-end">Série</Label>
                                        <Txt className="col-span-1 text-center" value={nota.serie} onChange={setN("serie")} />

                                        <Label className="col-span-1 justify-end">Chave</Label>
                                        <Txt className="col-span-3" value={nota.chave} onChange={setN("chave")} />

                                        <Label className="col-span-1 justify-end">Emissão</Label>
                                        <Txt
                                            type="date"
                                            className="col-span-1"
                                            value={nota.emissao}
                                            {...bindDateSmart(setN("emissao"))}
                                        />

                                        <Label className="col-span-1 justify-end">Recebto</Label>
                                        <Txt
                                            type="date"
                                            className="col-span-1"
                                            value={nota.recebto}
                                            {...bindDateSmart(setN("recebto"))}
                                        />
                                    </div>

                                    {/* Linha 4 */}
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                        <Label className="col-span-1 justify-end">Nº Pedido</Label>
                                        <Txt className="col-span-1" value={nota.nrPedido} onChange={setN("nrPedido")} />

                                        <Label className="col-span-1 justify-end">Temperatura</Label>
                                        <Txt className="col-span-1 text-right" value={nota.temperatura} onChange={setN("temperatura")} />



                                    </div>
                                </div>
                            </fieldset>

                            {/* CARD 2 - Itens da Nota Fiscal */}
                            <fieldset className="border border-gray-300 rounded p-3 bg-white">
                                <legend className="px-2 text-red-700 font-semibold text-[13px] flex items-center gap-2">
                                    Itens da Nota Fiscal
                                </legend>

                                {/* Ações do Card */}


                                <fieldset className="border border-gray-300 rounded p-3 bg-white">
                                    <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                        Item
                                    </legend>

                                    <div className="space-y-2">
                                        {/* Linha 1 */}
                                        <div className="grid grid-cols-12 gap-2 items-center">
                                            <Label className="col-span-1 justify-end">Produto</Label>
                                            <Txt
                                                className="col-span-2"
                                                value={item.produtoCod}
                                                onChange={setI("produtoCod")}
                                                placeholder="Código"
                                            />
                                            <Txt
                                                className="col-span-4 bg-gray-200"
                                                readOnly
                                                value={item.produtoDesc}
                                                placeholder="Descrição"
                                            />
                                            <Label className="col-span-1 justify-end">Nº Lote</Label>
                                            <Txt
                                                className="col-span-2"
                                                value={item.nrLote}
                                                onChange={setI("nrLote")}
                                            />

                                            <button
                                                className="border border-gray-300 rounded px-3 py-1 text-[12px] hover:bg-gray-100 flex items-center gap-2 col-span-2"
                                                onClick={() => setShowTodosItens(true)}
                                                title="Ver todos os itens"
                                            >
                                                <PackageSearch size={16} className="text-red-700" />
                                                Ver todos
                                            </button>
                                        </div>

                                        {/* Linha 2 */}
                                        <div className="grid grid-cols-12 gap-2 items-center">
                                            <Label className="col-span-1 justify-end">Validade</Label>
                                            <Txt
                                                type="date"
                                                className="col-span-2"
                                                value={item.validade}
                                                {...bindDateSmart(setI("validade"))}
                                            />

                                            <Label className="col-span-2 justify-end">Item Armazenado</Label>
                                            <Txt
                                                className="col-span-2 bg-gray-200 text-center"
                                                readOnly
                                                value={item.itemArmazenado}
                                            />

                                            <Label className="col-span-1 justify-end">Nº Item</Label>
                                            <Txt
                                                className="col-span-1 bg-gray-200 text-center"
                                                readOnly
                                                value={item.nrItem}
                                            />

                                            <Label className="col-span-1 justify-end">Unidade</Label>
                                            <Sel
                                                className="col-span-2"
                                                value={item.unidade}
                                                onChange={setI("unidade")}
                                            >
                                                <option value="UN">UN</option>
                                                <option value="CX">CX</option>
                                                <option value="FD">FD</option>
                                            </Sel>
                                        </div>

                                        {/* Linha 3 */}
                                        <div className="grid grid-cols-12 gap-2 items-center">
                                            <Label className="col-span-1 justify-end">Qtd Item</Label>
                                            <Txt
                                                className="col-span-2 text-right"
                                                value={item.qtdItem}
                                                onChange={setI("qtdItem")}
                                            />

                                            <Label className="col-span-2 justify-end">Valor Unitário</Label>
                                            <Txt
                                                className="col-span-2 text-right"
                                                value={item.vrUnit}
                                                onChange={setI("vrUnit")}
                                            />

                                            <Label className="col-span-1 justify-end">CST</Label>
                                            <Txt
                                                className="col-span-1 text-center"
                                                value={item.cst}
                                                onChange={setI("cst")}
                                            />

                                            <Label className="col-span-1 justify-end">Total Item</Label>
                                            <Txt
                                                className="col-span-2 bg-gray-200 text-right"
                                                readOnly
                                                value={item.totalItem}
                                            />
                                        </div>

                                        {/* Linha 4 */}
                                        <div className="grid grid-cols-12 gap-2 items-center">
                                            <Label className="col-span-1 justify-end">NCM</Label>
                                            <Txt
                                                className="col-span-2 text-center"
                                                value={item.ncm}
                                                onChange={setI("ncm")}
                                            />

                                            <Label className="col-span-2 justify-end">Cor</Label>
                                            <Sel
                                                className="col-span-2"
                                                value={item.corCod}
                                                onChange={setI("corCod")}
                                                onKeyDown={onLastFieldKeyDown}
                                                ref={lastFieldRef}
                                            >
                                                <option value="">Selecione</option>
                                                <option value="001">001 - BRANCO</option>
                                                <option value="002">002 - AZUL</option>
                                                <option value="003">003 - VERMELHO</option>
                                                <option value="004">004 - VERDE</option>
                                            </Sel>

                                            <div className="col-span-5 flex justify-end gap-2">
                                                <button
                                                    className="border border-gray-300 rounded px-3 py-1 text-[12px] hover:bg-gray-100 flex items-center gap-2"
                                                    onClick={limparItem}
                                                    type="button"
                                                >
                                                    <RotateCcw size={16} className="text-red-700" />
                                                    Limpar
                                                </button>

                                                <button
                                                    className="border border-gray-300 rounded px-3 py-1 text-[12px] hover:bg-gray-100 flex items-center gap-2"
                                                    onClick={alterarItem}
                                                    type="button"
                                                >
                                                    <Edit size={16} className="text-orange-600" />
                                                    Alterar
                                                </button>

                                                <button
                                                    className="border border-gray-300 rounded px-3 py-1 text-[12px] hover:bg-gray-100 flex items-center gap-2"
                                                    onClick={excluirItem}
                                                    type="button"
                                                >
                                                    <Trash2 size={16} className="text-red-700" />
                                                    Remover
                                                </button>

                                                <button
                                                    className="border border-gray-300 rounded px-3 py-1 text-[12px] hover:bg-gray-100 flex items-center gap-2"
                                                    onClick={incluirItem}
                                                    type="button"
                                                >
                                                    <PlusCircle size={16} className="text-green-700" />
                                                    Incluir
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                            </fieldset>


                            {/* CARD 3 - Grid Itens (min-h-0) */}
                            <fieldset className="border border-gray-300 rounded p-3 bg-white mb-3">

                                <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                    Itens da Nota (Grade)
                                </legend>

                                <div className="border border-gray-300 rounded max-h-[320px] overflow-y-auto min-h-0">
                                    <table className="w-full text-[12px]">
                                        <thead className="bg-gray-100 sticky top-0">
                                            <tr>
                                                {[
                                                    "NR_Item",
                                                    "Código",
                                                    "Descrição",
                                                    "Lote",
                                                    "Cor",
                                                    "Vencimento",
                                                    "Qtd",
                                                    "Valor Unit.",
                                                    "CST",
                                                    "NCM",
                                                    "Etiqueta",
                                                    "Qtd Divergência",
                                                ].map((h) => (
                                                    <th key={h} className="border px-2 py-1 text-left">
                                                        {h}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {itens.map((it, idx) => (
                                                <tr
                                                    key={idx}
                                                    className={`cursor-pointer hover:bg-red-100 ${selectedIndex === idx ? "bg-red-200" : ""
                                                        }`}
                                                    onClick={() => carregarItemDoGrid(it, idx)}
                                                >
                                                    <td className="border px-2 py-1 text-center">{it.nrItem}</td>
                                                    <td className="border px-2 py-1">{it.cod}</td>
                                                    <td className="border px-2 py-1">{it.desc}</td>
                                                    <td className="border px-2 py-1">{it.lote}</td>
                                                    <td className="border px-2 py-1">{it.cor}</td>
                                                    <td className="border px-2 py-1 text-center">
                                                        {formatDataBR(it.venc)}
                                                    </td>
                                                    <td className="border px-2 py-1 text-right">
                                                        {formatNumero(it.qtd)}
                                                    </td>
                                                    <td className="border px-2 py-1 text-right">
                                                        {formatNumero(it.vrUnit)}
                                                    </td>
                                                    <td className="border px-2 py-1 text-center">{it.cst}</td>
                                                    <td className="border px-2 py-1 text-center">{it.ncm}</td>
                                                    <td className="border px-2 py-1">{it.etiqueta}</td>
                                                    <td className="border px-2 py-1 text-right">
                                                        {formatNumero(it.qtdDiv)}
                                                    </td>
                                                </tr>
                                            ))}

                                            {itens.length === 0 && (
                                                <tr>
                                                    <td
                                                        colSpan={12}
                                                        className="border px-2 py-6 text-center text-gray-500"
                                                    >
                                                        Sem itens cadastrados.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex justify-end mt-2">
                                    <div className="flex items-center gap-2 whitespace-nowrap">
                                        <span className="text-[12px] text-gray-700 font-semibold">
                                            Total NF
                                        </span>
                                        <Txt
                                            className="w-[140px] bg-gray-200 text-right"
                                            readOnly
                                            value={formatNumero(totalNF)}
                                        />
                                    </div>
                                </div>

                            </fieldset>

                            {/* CARD 4 - Transporte (Retrátil) */}
                            <div className="border border-gray-300 rounded bg-white">
                                <div className="flex items-center justify-between px-3 py-2 border-b border-gray-300 bg-gray-50">
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="border border-gray-300 rounded w-[26px] h-[24px] flex items-center justify-center hover:bg-gray-100"
                                            onClick={() => setIsTranspOpen((p) => !p)}
                                            title="Expandir/Recolher"
                                        >
                                            {isTranspOpen ? (
                                                <ChevronUp size={16} className="text-red-700" />
                                            ) : (
                                                <ChevronDown size={16} className="text-red-700" />
                                            )}
                                        </button>
                                        <span className="text-red-700 font-semibold text-[13px]">
                                            Dados Transporte
                                        </span>
                                    </div>
                                </div>

                                {isTranspOpen && (
                                    <div className="p-3">
                                        <fieldset className="border border-gray-300 rounded p-3 bg-white">
                                            <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                                Transporte
                                            </legend>

                                            <div className="space-y-2">
                                                {/* Linha 1 */}
                                                <div className="grid grid-cols-12 gap-2 items-center">
                                                    <Label className="col-span-1 justify-end">Transportadora</Label>
                                                    <Txt
                                                        className="col-span-2"
                                                        value={transp.transpCnpj}
                                                        onChange={setT("transpCnpj")}
                                                    />
                                                    <Txt
                                                        className="col-span-5 bg-gray-200"
                                                        readOnly
                                                        value={transp.transpNome}
                                                    />
                                                    <Txt
                                                        className="col-span-3 bg-gray-200"
                                                        readOnly
                                                        value={transp.transpCidade}
                                                    />
                                                    <Txt
                                                        className="col-span-1 bg-gray-200 text-center"
                                                        readOnly
                                                        value={transp.transpUF}
                                                    />
                                                </div>

                                                {/* Linha 2 */}
                                                <div className="grid grid-cols-12 gap-2 items-center">
                                                    <Label className="col-span-1 justify-end">Frete</Label>
                                                    <Sel className="col-span-2" value={transp.frete} onChange={setT("frete")}>
                                                        {freteMock.map((f) => (
                                                            <option key={f.value} value={f.value}>
                                                                {f.label}
                                                            </option>
                                                        ))}
                                                    </Sel>

                                                    <Label className="col-span-1 justify-end">Placa</Label>
                                                    <Txt className="col-span-2" value={transp.placa} onChange={setT("placa")} />

                                                    <Label className="col-span-1 justify-end">UF</Label>
                                                    <Txt className="col-span-1 text-center" value={transp.placaUF} onChange={setT("placaUF")} />

                                                    <Label className="col-span-1 justify-end">Cubagem</Label>
                                                    <Txt className="col-span-1 text-right" value={transp.cubagem} onChange={setT("cubagem")} />

                                                    <Label className="col-span-1 justify-end">Peso Bruto</Label>
                                                    <Txt className="col-span-1 bg-gray-200 text-right" readOnly value={transp.pesoBruto} />


                                                </div>

                                                {/* Linha 3 */}
                                                <div className="grid grid-cols-12 gap-2 items-center">
                                                    <Label className="col-span-1 justify-end">QT Volume</Label>
                                                    <Txt className="col-span-2 bg-gray-200 text-right" readOnly value={transp.qtVolume} />

                                                    <Label className="col-span-1 justify-end">Tipo Volume</Label>
                                                    <Sel className="col-span-2" value={transp.tipoVolume} onChange={setT("tipoVolume")}>
                                                        {tipoVolumeMock.map((t) => (
                                                            <option key={t.value} value={t.value}>
                                                                {t.label}
                                                            </option>
                                                        ))}
                                                    </Sel>

                                                    <Label className="col-span-2 justify-end">Tipo Produto</Label>
                                                    <Sel className="col-span-2" value={transp.tipoProduto} onChange={setT("tipoProduto")}>
                                                        {tipoProdutoMock.map((t) => (
                                                            <option key={t.value} value={t.value}>
                                                                {t.label}
                                                            </option>
                                                        ))}
                                                    </Sel>

                                                    <Label className="col-span-1 justify-end">Peso Líquido</Label>
                                                    <Txt className="col-span-1 bg-gray-200 text-right" readOnly value={transp.pesoLiquido} />
                                                </div>

                                                {/* Linha 4 */}
                                                <div className="grid grid-cols-12 gap-2 items-center">
                                                    <Label className="col-span-1 justify-end">Observação</Label>
                                                    <Txt className="col-span-11" value={transp.observacao} onChange={setT("observacao")} />
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* ======================= ABA CONSULTA ======================= */}
                    {activeTab === "consulta" && (
                        <>
                            {/* Card 1 - Parâmetros */}
                            <fieldset className="border border-gray-300 rounded p-3 bg-white">
                                <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                    Parâmetros de Pesquisa
                                </legend>

                                <div className="space-y-2">
                                    {/* Linha 1 */}
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                        <Label className="col-span-1 justify-end">Empresa</Label>
                                        <Sel
                                            className="col-span-4"
                                            value={filtro.empresa}
                                            onChange={setF("empresa")}
                                        >
                                            {empresasMock.map((e) => (
                                                <option key={e.value} value={e.value}>
                                                    {e.label}
                                                </option>
                                            ))}
                                        </Sel>

                                        <Label className="col-span-1 justify-end">Filial</Label>
                                        <Sel
                                            className="col-span-4"
                                            value={filtro.filial}
                                            onChange={setF("filial")}
                                            disabled={filtro.buscarTodasFiliais}
                                        >
                                            {filiaisMock.map((f) => (
                                                <option key={f.value} value={f.value}>
                                                    {f.label}
                                                </option>
                                            ))}
                                        </Sel>

                                        <div className="col-span-2 flex items-center gap-2 justify-end">
                                            <input
                                                type="checkbox"
                                                className="accent-red-700"
                                                checked={filtro.buscarTodasFiliais}
                                                onChange={setF("buscarTodasFiliais")}
                                            />
                                            <span className="text-[12px] text-gray-700 whitespace-nowrap">
                                                Buscar por todas filiais
                                            </span>
                                        </div>
                                    </div>

                                    {/* Linha 2 */}
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                        <Label className="col-span-1 justify-end">Cliente</Label>
                                        <Txt className="col-span-2" value={filtro.clienteCnpj} onChange={setF("clienteCnpj")} />
                                        <Txt className="col-span-6 bg-gray-200" readOnly value={filtro.clienteNome} />
                                        <Label className="col-span-1 justify-end">Situação</Label>
                                        <Sel className="col-span-2" value={filtro.situacao} onChange={setF("situacao")}>
                                            {situacoesMock.map((s) => (
                                                <option key={s.value} value={s.value}>
                                                    {s.label}
                                                </option>
                                            ))}
                                        </Sel>
                                    </div>

                                    {/* Linha 3 */}
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                        <Label className="col-span-1 justify-end">Produto</Label>
                                        <Txt className="col-span-2" value={filtro.produtoCod} onChange={setF("produtoCod")} />
                                        <Txt className="col-span-6 bg-gray-200" readOnly value={filtro.produtoDesc} />
                                        <Label className="col-span-1 justify-end">Agenda</Label>
                                        <Txt className="col-span-2" value={filtro.agenda} onChange={setF("agenda")} />

                                    </div>

                                    {/* Linha 4 */}
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                        <Label className="col-span-1 justify-end">Nº NF</Label>
                                        <Txt className="col-span-2" value={filtro.nrNF} onChange={setF("nrNF")} />


                                        <Label className="col-span-1 justify-end">Data Emissão</Label>
                                        <Txt
                                            type="date"
                                            className="col-span-2"
                                            value={filtro.dtEmissaoDe}
                                            {...bindDateSmart(setF("dtEmissaoDe"))}
                                            disabled={!filtro.usarData}
                                        />
                                        <Label className="col-span-1 justify-center">até</Label>
                                        <Txt
                                            type="date"
                                            className="col-span-2"
                                            value={filtro.dtEmissaoAte}
                                            {...bindDateSmart(setF("dtEmissaoAte"))}
                                            disabled={!filtro.usarData}
                                        />



                                        <button
                                            className="border border-gray-300 rounded px-4 py-1 text-[13px] hover:bg-gray-100 flex items-center gap-2 col-start-11 col-span-2"
                                            onClick={pesquisar}
                                        >
                                            <Search size={16} className="text-red-700" />
                                            Pesquisar
                                        </button>

                                    </div>
                                </div>
                            </fieldset>

                            {/* Card 2 - Grid */}
                            <fieldset className="border border-gray-300 rounded p-3 bg-white min-h-0">
                                <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                    Registros
                                </legend>

                                <div className="border border-gray-300 rounded max-h-[420px] overflow-y-auto min-h-0">
                                    <table className="w-full text-[12px]">
                                        <thead className="bg-gray-100 sticky top-0">
                                            <tr>
                                                {[
                                                    "Status NF",
                                                    "Empresa",
                                                    "Filial",
                                                    "Nº NF",
                                                    "NF Série",
                                                    "Data",
                                                    "CPF/CNPJ",
                                                    "Cliente",
                                                    "Agenda",
                                                    "QT Vol.",
                                                    "Tipo de vol",
                                                    "Operador",
                                                ].map((h) => (
                                                    <th key={h} className="border px-2 py-1 text-left">
                                                        {h}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {listaConsulta.map((row) => (
                                                <tr
                                                    key={row.id}
                                                    className="cursor-pointer hover:bg-red-100"
                                                    onClick={() => abrirNF(row)}
                                                    title="Abrir na Aba Nota Fiscal"
                                                >
                                                    <td className="border px-2 py-1">{row.status}</td>
                                                    <td className="border px-2 py-1 text-center">{row.empresa}</td>
                                                    <td className="border px-2 py-1 text-center">{row.filial}</td>
                                                    <td className="border px-2 py-1 text-center">{row.nrNF}</td>
                                                    <td className="border px-2 py-1 text-center">{row.serie}</td>
                                                    <td className="border px-2 py-1 text-center">{formatDataBR(row.data)}</td>
                                                    <td className="border px-2 py-1">{row.cnpj}</td>
                                                    <td className="border px-2 py-1">{row.cliente}</td>
                                                    <td className="border px-2 py-1 text-center">{row.agenda}</td>
                                                    <td className="border px-2 py-1 text-right">{formatNumero(row.qtVol)}</td>
                                                    <td className="border px-2 py-1 text-center">{row.tpVol}</td>
                                                    <td className="border px-2 py-1">{row.operador}</td>
                                                </tr>
                                            ))}

                                            {listaConsulta.length === 0 && (
                                                <tr>
                                                    <td
                                                        colSpan={12}
                                                        className="border px-2 py-6 text-center text-gray-500"
                                                    >
                                                        Nenhum registro. Clique em Pesquisar (mock).
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </fieldset>
                        </>
                    )}
                </div>

                {/* Rodapé */}
                <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">

                    <button
                        onClick={handleFechar}
                        className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                    >
                        <XCircle size={20} />
                        <span>Fechar</span>
                    </button>

                    <button
                        onClick={handleLimpar}
                        className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                    >
                        <RotateCcw size={20} />
                        <span>Limpar</span>
                    </button>

                    <button
                        onClick={handleIncluirNF}
                        className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                    >
                        <PlusCircle size={20} />
                        <span>Incluir</span>
                    </button>

                    <button
                        onClick={handleAlterarNF}
                        className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                    >
                        <Edit size={20} />
                        <span>Alterar</span>
                    </button>

                    <button
                        onClick={handleExcluirNF}
                        className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                    >
                        <Trash2 size={20} />
                        <span>Excluir</span>
                    </button>

                    <button
                        onClick={handleLiberarAgenda}
                        className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                    >
                        <CalendarClock size={20} />
                        <span>Agenda</span>
                    </button>

                    <button
                        onClick={() => setShowOcorrencia(true)}
                        className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                    >
                        <AlertTriangle size={20} />
                        <span>Ocorr.</span>
                    </button>

                    <button
                        onClick={() => setShowComex(true)}
                        className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                    >
                        <Truck size={20} />
                        <span>Comex</span>
                    </button>

                </div>

            </div>

            {/* Modais */}
            <ModalMsg modal={modalMsg} onClose={() => setModalMsg(null)} />

            <ModalTodosItens
                open={showTodosItens}
                onClose={() => setShowTodosItens(false)}
                itens={itens}
                onSelect={(it) => {
                    const idx = itens.findIndex((x) => x.nrItem === it.nrItem && x.cod === it.cod);
                    if (idx >= 0) carregarItemDoGrid(it, idx);
                }}
            />

            <ModalOcorrencia
                open={showOcorrencia}
                onClose={() => setShowOcorrencia(false)}
                nfInfo={nfInfoParaOcorrencia}
                produtoAtual={produtoAtual}
            />

            <ModalComex
                open={showComex}
                onClose={() => setShowComex(false)}
                clienteNome={nota.clienteNome}
            />
        </>
    );
}
