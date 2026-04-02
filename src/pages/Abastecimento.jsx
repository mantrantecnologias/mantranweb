// src/pages/Abastecimento.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
    XCircle,
    RotateCcw,
    PlusCircle,
    Edit,
    Trash2,
    Search,
    ExternalLink,
    Fuel,
    Droplet,
} from "lucide-react";

import { useIconColor } from "../context/IconColorContext";
import InputBuscaMotorista from "../components/InputBuscaMotorista";
import InputBuscaVeiculo from "../components/InputBuscaVeiculo";
import InputBuscaPontoAbastecimento from "../components/InputBuscaPontoAbastecimento";

/* ========================= Helpers (padrão do projeto) ========================= */
function Label({ children, className = "" }) {
    return (
        <label className={`text-[12px] text-gray-700 flex items-center ${className}`}>
            {children}
        </label>
    );
}

function Txt({ className = "", readOnly = false, tabIndex, ...props }) {
    return (
        <input
            {...props}
            readOnly={readOnly}
            tabIndex={readOnly ? -1 : tabIndex}
            className={[
                "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px]",
                "w-full",
                readOnly ? "bg-gray-200 text-gray-600" : "bg-white",
                className,
            ].join(" ")}
        />
    );
}

function Sel({ className = "", tabIndex, disabled, ...props }) {
    return (
        <select
            {...props}
            disabled={disabled}
            tabIndex={disabled ? -1 : tabIndex}
            className={[
                "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px]",
                "w-full bg-white",
                disabled ? "bg-gray-200 text-gray-600" : "",
                className,
            ].join(" ")}
        />
    );
}

function Chk({ className = "", tabIndex, ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            tabIndex={props.disabled ? -1 : tabIndex}
            className={["h-[16px] w-[16px]", className].join(" ")}
        />
    );
}

/* ========================= Utils ========================= */
const onlyDigits = (s) => String(s || "").replace(/\D/g, "");
const n2 = (v) => Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
const n3 = (v) => Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 3 });
const fmtDateBR = (yyyy_mm_dd) => {
    if (!yyyy_mm_dd) return "";
    const [y, m, d] = String(yyyy_mm_dd).split("-");
    if (!y || !m || !d) return "";
    return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
};
const fmtTime = (hhmm) => {
    const s = String(hhmm || "").replace(/\D/g, "");
    if (!s) return "";
    const h = s.slice(0, 2).padEnd(2, "0");
    const m = s.slice(2, 4).padEnd(2, "0");
    return `${h}:${m}`;
};
const nowYYYYMMDD = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
};
const nowHHMM = () => {
    const d = new Date();
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
};

/* =========================================================
   DateInput / TimeInput (padrão inteligente solicitado)
   - Focus: preenche com data/hora atual
   - Backspace: limpa tudo
   - Aceita dígitos (TimeInput)
========================================================= */
function DateInput({ campo, dados, setDados, tabIndex, onKeyDown, className = "" }) {
    const val = dados?.[campo] || "";

    return (
        <input
            type="date"
            value={val}
            tabIndex={tabIndex}
            onKeyDown={onKeyDown}
            onFocus={() => {
                if (!dados?.[campo]) setDados((p) => ({ ...p, [campo]: nowYYYYMMDD() }));
            }}
            onChange={(e) => setDados((p) => ({ ...p, [campo]: e.target.value }))}
            onKeyUp={(e) => {
                if (e.key === "Backspace") setDados((p) => ({ ...p, [campo]: "" }));
            }}
            className={[
                "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full bg-white",
                className,
            ].join(" ")}
        />
    );
}

function TimeInput({ campo, dados, setDados, tabIndex, onKeyDown, className = "" }) {
    const val = dados?.[campo] || "";

    return (
        <input
            value={val}
            tabIndex={tabIndex}
            onKeyDown={onKeyDown}
            onFocus={() => {
                if (!dados?.[campo]) setDados((p) => ({ ...p, [campo]: nowHHMM() }));
            }}
            onChange={(e) => {
                const digits = String(e.target.value || "").replace(/\D/g, "").slice(0, 4);
                const h = digits.slice(0, 2);
                const m = digits.slice(2, 4);
                const txt = digits.length <= 2 ? h : `${h}:${m}`;
                setDados((p) => ({ ...p, [campo]: txt }));
            }}
            onKeyUp={(e) => {
                if (e.key === "Backspace") setDados((p) => ({ ...p, [campo]: "" }));
            }}
            onBlur={() => {
                const digits = String(val || "").replace(/\D/g, "");
                if (!digits) return;
                const h = digits.slice(0, 2).padEnd(2, "0");
                const m = digits.slice(2, 4).padEnd(2, "0");
                setDados((p) => ({ ...p, [campo]: `${h}:${m}` }));
            }}
            placeholder="hh:mm"
            className={[
                "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full bg-white",
                className,
            ].join(" ")}
        />
    );
}

/* ========================= Mocks ========================= */
const filialOpts = [
    { value: "001", label: "001 - TESTE MANTRAN" },
    { value: "002", label: "002 - FILIAL LITORAL" },
];

const combustivelOpts = [
    { value: "000023", label: "000023 - DIESEL S10" },
    { value: "000025", label: "000025 - GASOLINA" },
    { value: "000026", label: "000026 - ETANOL" },
];

const bombaOptsMock = [
    { value: "01", label: "01 - BOMBA 1" },
    { value: "02", label: "02 - BOMBA 2" },
];

const viagemOptsMock = [
    { value: "", label: "" },
    { value: "VIA001", label: "VIA001" },
    { value: "VIA002", label: "VIA002" },
];

const abastecimentosMockBase = [
    {
        id: 1,
        filial: "001",

        motoristaCnpj: "01075346891",
        motoristaNome: "DANIEL ALVARENGA BATISTA",

        veiculoCod: "0003065",
        veiculoDesc: "EVO1623 - VOLVO/FH 440 4X2T - CAVALO TRUCADO - CUBATAO",
        placa: "EVO1623",

        viagem: "",

        kmAnterior: 0,
        kmAtual: 98,

        postoCnpj: "13041121000123",
        postoRazao: "VTA",

        bomba: "01",
        combustivel: "000023",

        odometroAtual: 680,
        nfReq: "133251",
        numeroItem: "1",

        dt: "2025-09-30",
        hr: "14:17",

        qtdLitros: 50,
        valorLitro: 6,
        valorAbastecimento: 300,

        tanqueCheio: false,
    },
    {
        id: 2,
        filial: "001",
        motoristaCnpj: "01628446760",
        motoristaNome: "ALAN DA COSTA",
        veiculoCod: "0035719",
        veiculoDesc: "RXW4156 - CAVALO MEC - CAVALO TRUCADO - ITAJAI",
        placa: "RXW4156",
        viagem: "",
        kmAnterior: 0,
        kmAtual: 5,

        postoCnpj: "13041121000123",
        postoRazao: "VTA",
        bomba: "01",
        combustivel: "000025",
        odometroAtual: 5,
        nfReq: "133251",
        numeroItem: "1",
        dt: "2026-01-21",
        hr: "09:22",
        qtdLitros: 10,
        valorLitro: 8,
        valorAbastecimento: 80,
        tanqueCheio: true,
    },
];

export default function Abastecimento({ open }) {
    const location = useLocation();
    const isOficina = location.pathname.startsWith("/modulo-oficina");
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    /* ===== Abas ===== */
    const [activeTab, setActiveTab] = useState("cadastro"); // cadastro | consulta

    /* ===== Lista (mock) ===== */
    const [lista, setLista] = useState(abastecimentosMockBase);

    /* ===== Cadastro ===== */
    const [cad, setCad] = useState({
        id: null,

        filial: "001",

        motoristaCnpj: "",
        motoristaNome: "",

        veiculoCod: "",
        veiculoDesc: "",
        placa: "",

        viagem: "",

        kmAnterior: "0",
        kmAtual: "",

        postoCnpj: "",
        postoRazao: "",

        bomba: "",
        combustivel: "",

        odometroAtual: "0",
        nfReq: "",
        numeroItem: "1",

        dt: "",
        hr: "",

        qtdLitros: "",
        valorLitro: "",
        valorAbastecimento: "0",

        tanqueCheio: false,
    });

    const setF = (campo) => (e) => {
        const v = e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
        setCad((p) => ({ ...p, [campo]: v }));
    };

    /* ===== Navigation Handler (TAB natural + ENTER avançando por tabindex) ===== */
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            const ti = e.target.getAttribute("tabindex");
            if (!ti) return;
            e.preventDefault();
            const currentTab = parseInt(ti, 10);
            const nextTab = currentTab + 1;
            const nextEl = document.querySelector(`[tabindex="${nextTab}"]`);
            if (nextEl) nextEl.focus();
        }
    };

    /* ===== Cálculo automático Valor Abastecimento ===== */
    useEffect(() => {
        const q = Number(String(cad.qtdLitros || "").replace(",", "."));
        const v = Number(String(cad.valorLitro || "").replace(",", "."));
        if (!q || !v) {
            setCad((p) => ({ ...p, valorAbastecimento: "0" }));
            return;
        }
        const total = q * v;
        setCad((p) => ({ ...p, valorAbastecimento: String(total) }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cad.qtdLitros, cad.valorLitro]);

    /* ===== Consulta ===== */
    const [cons, setCons] = useState({
        filial: "001",

        motoristaCnpj: "",
        motoristaNome: "",

        combustivel: "",

        veiculoCod: "",
        veiculoDesc: "",

        dtIni: "",
        dtFim: "",

        postoCnpj: "",
        postoRazao: "",
    });

    const setC = (campo) => (e) => setCons((p) => ({ ...p, [campo]: e.target.value }));
    const [resultado, setResultado] = useState([]); // só aparece depois do Pesquisar

    /* ===== Modais / mensagens ===== */
    const [modalMsg, setModalMsg] = useState(null);

    /* ===== Limpar ===== */
    const limparCadastro = () => {
        setCad({
            id: null,

            filial: "001",

            motoristaCnpj: "",
            motoristaNome: "",

            veiculoCod: "",
            veiculoDesc: "",
            placa: "",

            viagem: "",

            kmAnterior: "0",
            kmAtual: "",

            postoCnpj: "",
            postoRazao: "",

            bomba: "",
            combustivel: "",

            odometroAtual: "0",
            nfReq: "",
            numeroItem: "1",

            dt: "",
            hr: "",

            qtdLitros: "",
            valorLitro: "",
            valorAbastecimento: "0",

            tanqueCheio: false,
        });
    };

    const limparConsulta = () => {
        setCons({
            filial: "001",
            motoristaCnpj: "",
            motoristaNome: "",
            combustivel: "",
            veiculoCod: "",
            veiculoDesc: "",
            dtIni: "",
            dtFim: "",
            postoCnpj: "",
            postoRazao: "",
        });
        setResultado([]);
    };

    /* ===== Ações (principal) ===== */
    const acaoPesquisar = () => {
        const filial = (cons.filial || "").trim();
        const motCnpj = onlyDigits(cons.motoristaCnpj || "");
        const motNome = (cons.motoristaNome || "").trim().toLowerCase();
        const comb = (cons.combustivel || "").trim();
        const veicCod = (cons.veiculoCod || "").trim();
        const veicDesc = (cons.veiculoDesc || "").trim().toLowerCase();
        const dtIni = cons.dtIni || "";
        const dtFim = cons.dtFim || "";
        const postoCnpj = onlyDigits(cons.postoCnpj || "");
        const postoRaz = (cons.postoRazao || "").trim().toLowerCase();

        const filtrado = lista.filter((x) => {
            const okFilial = filial ? x.filial === filial : true;

            const okMotCnpj = motCnpj ? onlyDigits(x.motoristaCnpj).includes(motCnpj) : true;
            const okMotNome = motNome ? String(x.motoristaNome || "").toLowerCase().includes(motNome) : true;

            const okComb = comb ? String(x.combustivel || "") === comb : true;

            const okVeicCod = veicCod ? String(x.veiculoCod || "").includes(veicCod) : true;
            const okVeicDesc = veicDesc ? String(x.veiculoDesc || "").toLowerCase().includes(veicDesc) : true;

            const okPostoCnpj = postoCnpj ? onlyDigits(x.postoCnpj).includes(postoCnpj) : true;
            const okPostoRaz = postoRaz ? String(x.postoRazao || "").toLowerCase().includes(postoRaz) : true;

            const okDtIni = dtIni ? String(x.dt || "") >= dtIni : true;
            const okDtFim = dtFim ? String(x.dt || "") <= dtFim : true;

            return (
                okFilial &&
                okMotCnpj &&
                okMotNome &&
                okComb &&
                okVeicCod &&
                okVeicDesc &&
                okPostoCnpj &&
                okPostoRaz &&
                okDtIni &&
                okDtFim
            );
        });

        setResultado(filtrado);
    };

    const abrirCadastro = (row) => {
        setCad({
            ...cad,
            ...row,
            kmAnterior: String(row.kmAnterior ?? "0"),
            kmAtual: String(row.kmAtual ?? ""),
            odometroAtual: String(row.odometroAtual ?? "0"),
            numeroItem: String(row.numeroItem ?? "1"),
            qtdLitros: String(row.qtdLitros ?? ""),
            valorLitro: String(row.valorLitro ?? ""),
            valorAbastecimento: String(row.valorAbastecimento ?? "0"),
        });
        setActiveTab("cadastro");
    };

    const acaoIncluir = () => {
        setModalMsg({
            tipo: "confirm",
            texto: "Confirma a Inclusão?",
            onYes: () => {
                const novo = {
                    ...cad,
                    id: Date.now(),
                    kmAnterior: Number(String(cad.kmAnterior || "0").replace(",", ".")) || 0,
                    kmAtual: Number(String(cad.kmAtual || "0").replace(",", ".")) || 0,
                    odometroAtual: Number(String(cad.odometroAtual || "0").replace(",", ".")) || 0,
                    qtdLitros: Number(String(cad.qtdLitros || "0").replace(",", ".")) || 0,
                    valorLitro: Number(String(cad.valorLitro || "0").replace(",", ".")) || 0,
                    valorAbastecimento: Number(String(cad.valorAbastecimento || "0").replace(",", ".")) || 0,
                };
                setLista((prev) => [novo, ...prev]);
                setModalMsg({ tipo: "sucesso", texto: "Abastecimento incluído com sucesso! (mock)" });
            },
        });
    };

    const acaoAlterar = () => {
        if (!cad.id) {
            setModalMsg({ tipo: "info", texto: "Selecione um registro para alterar." });
            return;
        }
        setModalMsg({
            tipo: "confirm",
            texto: "Confirma a Alteração?",
            onYes: () => {
                setLista((prev) => prev.map((x) => (x.id === cad.id ? { ...x, ...cad } : x)));
                setModalMsg({ tipo: "sucesso", texto: "Abastecimento alterado com sucesso! (mock)" });
            },
        });
    };

    const acaoExcluir = () => {
        if (!cad.id) {
            setModalMsg({ tipo: "info", texto: "Selecione um registro para excluir." });
            return;
        }
        setModalMsg({
            tipo: "confirm",
            texto: "Confirma a Exclusão?",
            onYes: () => {
                setLista((prev) => prev.filter((x) => x.id !== cad.id));
                limparCadastro();
                setModalMsg({ tipo: "sucesso", texto: "Abastecimento excluído com sucesso! (mock)" });
            },
        });
    };

    /* ===== Enter no último botão (Incluir) ===== */
    const onKeyDownIncluir = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            acaoIncluir();
        }
    };

    /* ===== Toggle Tanque Parcial/Cheio ===== */
    const toggleTanque = () => setCad((p) => ({ ...p, tanqueCheio: !p.tanqueCheio }));

    /* ===== Atalhos para abrir telas por ícone (mock) ===== */
    const abrirMotorista = () =>
        setModalMsg({
            tipo: "info",
            texto: `Abrir Motorista.jsx (mock) para: ${cad.motoristaCnpj || "(vazio)"}`,
        });

    const abrirVeiculo = () =>
        setModalMsg({
            tipo: "info",
            texto: `Abrir Veiculo.jsx (mock) para: ${cad.veiculoCod || "(vazio)"}`,
        });

    const abrirPosto = () =>
        setModalMsg({
            tipo: "info",
            texto: `Abrir PontoAbastecimento.jsx (mock) para: ${cad.postoCnpj || "(vazio)"}`,
        });

    /* ===== Título ===== */
    const tituloTopo = useMemo(() => "ABASTECIMENTO", []);

    /* ===== Ao trocar para consulta, não exibir automaticamente a grid ===== */
    useEffect(() => {
        if (activeTab === "consulta") {
            // padrão: resultado vazio até Pesquisar
        }
    }, [activeTab]);

    /* ===== Campos não editáveis ===== */
    const motoristaNomeReadOnly = true;
    const veiculoDescReadOnly = true;
    const kmAnteriorReadOnly = true;
    const postoRazaoReadOnly = true;
    const odometroAtualReadOnly = true;

    /* ===== Render continua na Parte 2 ===== */
    return (
        <div
            className={`
        transition-all duration-300 text-[13px] text-gray-700 bg-gray-50
        flex flex-col
        ${isOficina
                    ? "mt-[-16px] ml-[-16px] h-[calc(100vh-48px)] w-[calc(100%+32px)]"
                    : `mt-[44px] h-[calc(100vh-56px)] ${open ? "ml-[192px]" : "ml-[56px]"}`
                }
      `}
        >
            <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                {tituloTopo}
            </h1>

            {/* Abas */}
            <div className="flex border-b border-gray-300 bg-white">
                {[
                    { key: "cadastro", label: "Cadastro" },
                    { key: "consulta", label: "Consulta" },
                ].map((t, idx) => (
                    <button
                        key={t.key}
                        onClick={() => setActiveTab(t.key)}
                        className={`px-4 py-1 text-sm font-medium border-t border-x rounded-t-md ${activeTab === t.key
                            ? "bg-white text-red-700 border-gray-300"
                            : "bg-gray-100 text-gray-600 border-transparent"
                            } ${idx > 0 ? "ml-1" : ""}`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Conteúdo */}
            <div className="flex-1 p-3 bg-white border-x border-b border-gray-200 rounded-b-md overflow-y-auto flex flex-col gap-2">
                {/* ========================= ABA CADASTRO ========================= */}
                {activeTab === "cadastro" && (
                    <>
                        {/* 2 cards lado a lado */}
                        <div className="grid grid-cols-12 gap-2">
                            {/* Card 1 - Veiculo */}
                            <fieldset className="border border-gray-300 rounded p-3 bg-white col-span-6">
                                <legend className="px-2 text-red-700 font-semibold text-[13px]">Veículo</legend>

                                <div className="space-y-2">
                                    {/* Linha 1 - Filial */}
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                        <Label className="col-span-2 justify-end">Filial</Label>
                                        <Sel
                                            className="col-span-10"
                                            value={cad.filial}
                                            onChange={setF("filial")}
                                            tabIndex={1}
                                            onKeyDown={handleKeyDown}
                                        >
                                            {filialOpts.map((o) => (
                                                <option key={o.value} value={o.value}>
                                                    {o.label}
                                                </option>
                                            ))}
                                        </Sel>
                                    </div>

                                    {/* Linha 2 - Motorista (InputBuscaMotorista + nome bloqueado + ícone) */}
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                        <Label className="col-span-2 justify-end">Motorista</Label>
                                        <div className="col-span-3">
                                            <InputBuscaMotorista
                                                label={null}
                                                value={cad.motoristaCnpj}
                                                onChange={setF("motoristaCnpj")}
                                                onSelect={(mot) => {
                                                    setCad((p) => ({
                                                        ...p,
                                                        motoristaCnpj: mot.cnh,
                                                        motoristaNome: mot.nome,
                                                        // Preenche veículo se existir
                                                        veiculoCod: mot.tracaoCodigo || p.veiculoCod,
                                                        veiculoDesc: mot.tracaoDesc || p.veiculoDesc,
                                                    }));
                                                    // Foca no próximo campo (veículo ou botão de abrir motorista)
                                                    setTimeout(() => document.querySelector('[tabindex="3"]')?.focus(), 10);
                                                }}
                                                tabIndex={2}
                                                placeholder="CNH ou Nome"
                                            />
                                        </div>
                                        <Txt
                                            className="col-span-6 bg-gray-200"
                                            value={cad.motoristaNome}
                                            onChange={setF("motoristaNome")}
                                            readOnly={motoristaNomeReadOnly}
                                            tabIndex={-1}
                                        />
                                        <button
                                            onClick={abrirMotorista}
                                            tabIndex={3}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    abrirMotorista();
                                                } else {
                                                    handleKeyDown(e);
                                                }
                                            }}
                                            className="col-span-1 border border-gray-300 rounded h-[26px] flex items-center justify-center bg-gray-50 hover:bg-gray-100"
                                            title="Abrir Motorista"
                                        >
                                            <ExternalLink size={16} className="text-red-700" />
                                        </button>
                                    </div>

                                    {/* Linha 3 - Veículo (InputBuscaVeiculo + desc bloqueado + ícone) */}
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                        <Label className="col-span-2 justify-end">Veículo</Label>
                                        <div className="col-span-3">
                                            <InputBuscaVeiculo
                                                label={null}
                                                value={cad.veiculoCod}
                                                onChange={setF("veiculoCod")}
                                                onSelect={(veic) => {
                                                    setCad((p) => ({
                                                        ...p,
                                                        veiculoCod: veic.codigo,
                                                        veiculoDesc: `${veic.placa} - ${veic.modelo} - ${veic.classe}`,
                                                        placa: veic.placa,
                                                    }));
                                                    // Foca no próximo campo (viagem ou botão de abrir veículo)
                                                    setTimeout(() => document.querySelector('[tabindex="5"]')?.focus(), 10);
                                                }}
                                                tabIndex={4}
                                                placeholder="Código ou Placa"
                                            />
                                        </div>
                                        <Txt
                                            className="col-span-6 bg-gray-200"
                                            value={cad.veiculoDesc}
                                            onChange={setF("veiculoDesc")}
                                            readOnly={veiculoDescReadOnly}
                                            tabIndex={-1}
                                        />
                                        <button
                                            onClick={abrirVeiculo}
                                            tabIndex={5}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    abrirVeiculo();
                                                } else {
                                                    handleKeyDown(e);
                                                }
                                            }}
                                            className="col-span-1 border border-gray-300 rounded h-[26px] flex items-center justify-center bg-gray-50 hover:bg-gray-100"
                                            title="Abrir Veículo"
                                        >
                                            <ExternalLink size={16} className="text-red-700" />
                                        </button>
                                    </div>

                                    {/* Linha 4 - Viagem */}
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                        <Label className="col-span-2 justify-end">Viagem</Label>
                                        <Sel
                                            className="col-span-10"
                                            value={cad.viagem}
                                            onChange={setF("viagem")}
                                            tabIndex={6}
                                            onKeyDown={handleKeyDown}
                                        >
                                            {viagemOptsMock.map((o) => (
                                                <option key={o.value} value={o.value}>
                                                    {o.label}
                                                </option>
                                            ))}
                                        </Sel>
                                    </div>

                                    {/* Linha 5 - KM Anterior (bloq), KM Atual */}
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                        <Label className="col-span-2 justify-end">KM Anterior</Label>
                                        <Txt
                                            className="col-span-4 bg-gray-200 text-right"
                                            value={cad.kmAnterior}
                                            readOnly={kmAnteriorReadOnly}
                                            tabIndex={-1}
                                        />
                                        <Label className="col-span-2 justify-end">KM Atual</Label>
                                        <Txt
                                            className="col-span-4 text-right"
                                            value={cad.kmAtual}
                                            onChange={setF("kmAtual")}
                                            tabIndex={7}
                                            onKeyDown={handleKeyDown}
                                        />
                                    </div>
                                </div>
                            </fieldset>

                            {/* Card 2 - Posto */}
                            <fieldset className="border border-gray-300 rounded p-3 bg-white col-span-6">
                                <legend className="px-2 text-red-700 font-semibold text-[13px]">Posto</legend>

                                <div className="space-y-2">
                                    {/* Linha 1 - Posto (InputBuscaPontoAbastecimento + razao bloqueado + ícone) */}
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                        <Label className="col-span-2 justify-end">Posto</Label>
                                        <div className="col-span-3">
                                            <InputBuscaPontoAbastecimento
                                                label={null}
                                                value={cad.postoCnpj}
                                                onChange={setF("postoCnpj")}
                                                onSelect={(ponto) => {
                                                    setCad((p) => ({
                                                        ...p,
                                                        postoCnpj: ponto.cnpj,
                                                        postoRazao: ponto.fantasia,
                                                    }));
                                                    setTimeout(() => document.querySelector('[tabindex="9"]')?.focus(), 10);
                                                }}
                                                tabIndex={8}
                                                placeholder="CNPJ ou Fantasia"
                                            />
                                        </div>
                                        <Txt
                                            className="col-span-6 bg-gray-200"
                                            value={cad.postoRazao}
                                            onChange={setF("postoRazao")}
                                            readOnly={postoRazaoReadOnly}
                                            tabIndex={-1}
                                        />
                                        <button
                                            onClick={abrirPosto}
                                            tabIndex={9}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    abrirPosto();
                                                } else {
                                                    handleKeyDown(e);
                                                }
                                            }}
                                            className="col-span-1 border border-gray-300 rounded h-[26px] flex items-center justify-center bg-gray-50 hover:bg-gray-100"
                                            title="Abrir Posto"
                                        >
                                            <ExternalLink size={16} className="text-red-700" />
                                        </button>
                                    </div>

                                    {/* Linha 2 - Bomba, Combustível */}
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                        <Label className="col-span-2 justify-end">Bomba</Label>
                                        <Sel
                                            className="col-span-4"
                                            value={cad.bomba}
                                            onChange={setF("bomba")}
                                            tabIndex={10}
                                            onKeyDown={handleKeyDown}
                                        >
                                            <option value=""></option>
                                            {bombaOptsMock.map((o) => (
                                                <option key={o.value} value={o.value}>
                                                    {o.label}
                                                </option>
                                            ))}
                                        </Sel>

                                        <Label className="col-span-2 justify-end">Combustível</Label>
                                        <Sel
                                            className="col-span-4"
                                            value={cad.combustivel}
                                            onChange={setF("combustivel")}
                                            tabIndex={11}
                                            onKeyDown={handleKeyDown}
                                        >
                                            <option value=""></option>
                                            {combustivelOpts.map((o) => (
                                                <option key={o.value} value={o.value}>
                                                    {o.label}
                                                </option>
                                            ))}
                                        </Sel>
                                    </div>

                                    {/* Linha 3 - Odômetro Atual (bloq), NF/Requisição */}
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                        <Label className="col-span-2 justify-end">Odômetro Atual</Label>
                                        <Txt
                                            className="col-span-4 bg-gray-200 text-right"
                                            value={cad.odometroAtual}
                                            readOnly={odometroAtualReadOnly}
                                            tabIndex={-1}
                                        />
                                        <Label className="col-span-2 justify-end">NF/Requisição</Label>
                                        <Txt
                                            className="col-span-4"
                                            value={cad.nfReq}
                                            onChange={setF("nfReq")}
                                            tabIndex={12}
                                            onKeyDown={handleKeyDown}
                                        />
                                    </div>

                                    {/* Linha 4 - Data/Hora, Número Item */}
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                        <Label className="col-span-2 justify-end">Data</Label>
                                        <DateInput
                                            campo="dt"
                                            dados={cad}
                                            setDados={setCad}
                                            tabIndex={13}
                                            onKeyDown={handleKeyDown}
                                            className="col-span-3"
                                        />
                                        <Label className="col-span-1 justify-end">Hora</Label>
                                        <TimeInput
                                            campo="hr"
                                            dados={cad}
                                            setDados={setCad}
                                            tabIndex={14}
                                            onKeyDown={handleKeyDown}
                                            className="col-span-2"
                                        />

                                        <Label className="col-span-2 justify-end">Número Item</Label>
                                        <Txt
                                            className="col-span-2 text-center"
                                            value={cad.numeroItem}
                                            onChange={setF("numeroItem")}
                                            tabIndex={15}
                                            onKeyDown={handleKeyDown}
                                        />
                                    </div>
                                </div>
                            </fieldset>
                        </div>

                        {/* Card 3 - Cálculo */}
                        <fieldset className="border border-gray-300 rounded p-3 bg-white">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">Cálculo Abastecimento</legend>

                            <div className="grid grid-cols-12 gap-2 items-center">
                                <Label className="col-span-1 justify-end">Qtd Litros</Label>
                                <Txt
                                    className="col-span-1 text-right"
                                    value={cad.qtdLitros}
                                    onChange={setF("qtdLitros")}
                                    tabIndex={16}
                                    onKeyDown={handleKeyDown}
                                />

                                <Label className="col-span-2 justify-end">Valor por Litro</Label>
                                <Txt
                                    className="col-span-2 text-right"
                                    value={cad.valorLitro}
                                    onChange={setF("valorLitro")}
                                    tabIndex={17}
                                    onKeyDown={handleKeyDown}
                                />

                                <Label className="col-span-2 justify-end">Valor Abastecimento</Label>
                                <Txt
                                    className="col-span-2 bg-gray-200 text-right"
                                    value={n2(cad.valorAbastecimento)}
                                    readOnly
                                    tabIndex={-1}
                                />

                                <button
                                    onClick={toggleTanque}
                                    tabIndex={18}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            toggleTanque();
                                        } else {
                                            handleKeyDown(e);
                                        }
                                    }}
                                    className="col-span-2 border border-gray-300 rounded px-3 py-[4px] bg-gray-50 hover:bg-gray-100 text-[12px] flex items-center justify-center gap-2"
                                    title="Tanque"
                                >
                                    {cad.tanqueCheio ? (
                                        <>
                                            <Fuel size={16} className="text-red-700" />
                                            Tanque Cheio
                                        </>
                                    ) : (
                                        <>
                                            <Droplet size={16} className="text-red-700" />
                                            Tanque Parcial
                                        </>
                                    )}
                                </button>
                            </div>


                        </fieldset>
                    </>
                )}

                {/* ========================= ABA CONSULTA ========================= */}
                {activeTab === "consulta" && (
                    <>
                        {/* Card 1 - Parâmetros */}
                        <fieldset className="border border-gray-300 rounded p-3 bg-white">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">Parâmetros de Pesquisa</legend>

                            <div className="space-y-2">
                                {/* Linha 1 - Filial, Motorista (2 textbox) */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-1 justify-end">Filial</Label>
                                    <Sel
                                        className="col-span-4"
                                        value={cons.filial}
                                        onChange={setC("filial")}
                                        tabIndex={30}
                                        onKeyDown={handleKeyDown}
                                    >
                                        {filialOpts.map((o) => (
                                            <option key={o.value} value={o.value}>
                                                {o.label}
                                            </option>
                                        ))}
                                    </Sel>

                                    <Label className="col-span-1 justify-end">Motorista</Label>
                                    <div className="col-span-2">
                                        <InputBuscaMotorista
                                            label={null}
                                            value={cons.motoristaCnpj}
                                            onChange={setC("motoristaCnpj")}
                                            onSelect={(mot) => {
                                                setCons((p) => ({
                                                    ...p,
                                                    motoristaCnpj: mot.cnh,
                                                    motoristaNome: mot.nome,
                                                }));
                                                setTimeout(() => document.querySelector('[tabindex="32"]')?.focus(), 10);
                                            }}
                                            tabIndex={31}
                                            placeholder="CNH"
                                        />
                                    </div>
                                    <Txt
                                        className="col-span-4 bg-gray-200"
                                        value={cons.motoristaNome}
                                        onChange={setC("motoristaNome")}
                                        readOnly
                                        tabIndex={-1}
                                    />
                                </div>

                                {/* Linha 2 - Combustível, Veículo (2 textbox) */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-1 justify-end">Combustível</Label>
                                    <Sel
                                        className="col-span-4"
                                        value={cons.combustivel}
                                        onChange={setC("combustivel")}
                                        tabIndex={32}
                                        onKeyDown={handleKeyDown}
                                    >
                                        <option value=""></option>
                                        {combustivelOpts.map((o) => (
                                            <option key={o.value} value={o.value}>
                                                {o.label}
                                            </option>
                                        ))}
                                    </Sel>

                                    <Label className="col-span-1 justify-end">Veículo</Label>
                                    <div className="col-span-2">
                                        <InputBuscaVeiculo
                                            label={null}
                                            value={cons.veiculoCod}
                                            onChange={setC("veiculoCod")}
                                            onSelect={(veic) => {
                                                setCons((p) => ({
                                                    ...p,
                                                    veiculoCod: veic.codigo,
                                                    veiculoDesc: `${veic.placa} - ${veic.modelo} - ${veic.classe}`,
                                                }));
                                                setTimeout(() => document.querySelector('[tabindex="34"]')?.focus(), 10);
                                            }}
                                            tabIndex={33}
                                            placeholder="Código"
                                        />
                                    </div>
                                    <Txt
                                        className="col-span-4 bg-gray-200"
                                        value={cons.veiculoDesc}
                                        onChange={setC("veiculoDesc")}
                                        readOnly
                                        tabIndex={-1}
                                    />
                                </div>

                                {/* Linha 3 - Período (4 cols), Posto (2 textbox) */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-1 justify-end">Período</Label>
                                    <div className="col-span-4 grid grid-cols-12 gap-2">
                                        <DateInput
                                            campo="dtIni"
                                            dados={cons}
                                            setDados={setCons}
                                            tabIndex={34}
                                            onKeyDown={handleKeyDown}
                                            className="col-span-6"
                                        />
                                        <Label className="col-span-1 justify-end text-[12px] text-gray-600">Até</Label>
                                        <DateInput
                                            campo="dtFim"
                                            dados={cons}
                                            setDados={setCons}
                                            tabIndex={35}
                                            onKeyDown={handleKeyDown}
                                            className="col-span-5"
                                        />
                                    </div>

                                    <Label className="col-span-1 justify-end">Posto</Label>
                                    <div className="col-span-2">
                                        <InputBuscaPontoAbastecimento
                                            label={null}
                                            value={cons.postoCnpj}
                                            onChange={setC("postoCnpj")}
                                            onSelect={(ponto) => {
                                                setCons((p) => ({
                                                    ...p,
                                                    postoCnpj: ponto.cnpj,
                                                    postoRazao: ponto.fantasia,
                                                }));
                                                setTimeout(() => document.querySelector('[tabindex="37"]')?.focus(), 10);
                                            }}
                                            tabIndex={36}
                                            placeholder="CNPJ"
                                        />
                                    </div>
                                    <Txt
                                        className="col-span-4 bg-gray-200"
                                        readOnly
                                        value={cons.postoRazao}
                                        onChange={setC("postoRazao")}
                                        tabIndex={37}
                                        onKeyDown={handleKeyDown}
                                    />
                                </div>

                                {/* Linha 4 - Botão Pesquisar alinhado direita */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <div className="col-span-12 flex justify-end gap-2">
                                        <button
                                            onClick={acaoPesquisar}
                                            tabIndex={38}
                                            className="border border-gray-300 rounded px-3 py-[4px] bg-gray-50 hover:bg-gray-100 text-[12px] flex items-center gap-1"
                                            title="Pesquisar"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    acaoPesquisar();
                                                }
                                            }}
                                        >
                                            <Search size={14} className="text-red-700" />
                                            Pesquisar
                                        </button>

                                        <button
                                            onClick={limparConsulta}
                                            className="border border-gray-300 rounded px-3 py-[4px] bg-gray-50 hover:bg-gray-100 text-[12px] flex items-center gap-1"
                                            title="Limpar"
                                        >
                                            <RotateCcw size={14} className="text-red-700" />
                                            Limpar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </fieldset>

                        {/* Card 2 - Grid */}
                        <fieldset className="border border-gray-300 rounded p-2 bg-white min-w-0">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                Resultado (clique para abrir no Cadastro)
                            </legend>

                            <div className="w-full overflow-x-auto">
                                <table className="min-w-[1500px] w-full text-[12px] border-collapse">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border px-2 py-1">Filial</th>
                                            <th className="border px-2 py-1">Data/Hora</th>
                                            <th className="border px-2 py-1">Local do Abastecimento</th>
                                            <th className="border px-2 py-1">Qtde Litros</th>
                                            <th className="border px-2 py-1">Valor</th>
                                            <th className="border px-2 py-1">Kilometragem</th>
                                            <th className="border px-2 py-1">Placa</th>
                                            <th className="border px-2 py-1">Motorista</th>
                                            <th className="border px-2 py-1">NF/Requisição</th>
                                            <th className="border px-2 py-1">CNPJ Posto</th>
                                            <th className="border px-2 py-1">Combustível</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {(resultado.length ? resultado : []).map((r) => (
                                            <tr
                                                key={r.id}
                                                className="hover:bg-green-100 cursor-pointer"
                                                onClick={() => abrirCadastro(r)}
                                                title="Clique para abrir no Cadastro"
                                            >
                                                <td className="border px-2 py-1 text-center">{r.filial}</td>
                                                <td className="border px-2 py-1 text-center">
                                                    {fmtDateBR(r.dt)} {r.hr}
                                                </td>
                                                <td className="border px-2 py-1">{r.postoRazao}</td>
                                                <td className="border px-2 py-1 text-right">{n3(r.qtdLitros)}</td>
                                                <td className="border px-2 py-1 text-right">{n2(r.valorLitro)}</td>
                                                <td className="border px-2 py-1 text-right">{r.kmAtual}</td>
                                                <td className="border px-2 py-1 text-center">{r.placa}</td>
                                                <td className="border px-2 py-1">{r.motoristaNome}</td>
                                                <td className="border px-2 py-1 text-center">{r.nfReq}</td>
                                                <td className="border px-2 py-1 text-center">{r.postoCnpj}</td>
                                                <td className="border px-2 py-1 text-center">{r.combustivel}</td>
                                            </tr>
                                        ))}

                                        {resultado.length === 0 && (
                                            <tr>
                                                <td colSpan={11} className="border px-2 py-2 text-center text-gray-500">
                                                    Clique em Pesquisar para exibir os registros.
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

            {/* ========================= Rodapé padrão =========================
          Requisito: último botão no TAB/ENTER = Incluir (Enter abre confirmação)
          Visual: Fechar, Limpar, Incluir, Alterar, Excluir
          DOM: Incluir por último
      */}
            <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">
                <button
                    onClick={() => navigate(-1)}
                    className={`order-1 flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                    title="Fechar"
                >
                    <XCircle size={20} />
                    <span>Fechar</span>
                </button>

                <button
                    onClick={() => {
                        if (activeTab === "cadastro") limparCadastro();
                        else limparConsulta();
                    }}
                    className={`order-2 flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                    title="Limpar"
                >
                    <RotateCcw size={20} />
                    <span>Limpar</span>
                </button>

                <button
                    onClick={acaoAlterar}
                    className={`order-4 flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                    title="Alterar"
                >
                    <Edit size={20} />
                    <span>Alterar</span>
                </button>

                <button
                    onClick={acaoExcluir}
                    className={`order-5 flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                    title="Excluir"
                >
                    <Trash2 size={20} />
                    <span>Excluir</span>
                </button>

                {/* Incluir por último no DOM (TAB/ENTER) */}
                <button
                    onClick={acaoIncluir}
                    onKeyDown={onKeyDownIncluir}
                    tabIndex={19}
                    className={`order-3 flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                    title="Incluir"
                >
                    <PlusCircle size={20} />
                    <span>Incluir</span>
                </button>
            </div>

            {/* ========================= ModalMsg padrão (usado por tudo) ========================= */}
            {modalMsg && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 shadow-lg rounded border text-center w-[300px]">
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
                                <button className="px-3 py-1 bg-gray-300 rounded" onClick={() => setModalMsg(null)}>
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
                            <button className="px-3 py-1 bg-red-700 text-white rounded" onClick={() => setModalMsg(null)}>
                                OK
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
