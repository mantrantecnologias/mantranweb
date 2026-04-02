// src/pages/PontoAbastecimento.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
    XCircle,
    RotateCcw,
    PlusCircle,
    Edit,
    Trash2,
    Search,
    PackageSearch,
    Fuel,
} from "lucide-react";

import InputBuscaCidade from "../components/InputBuscaCidade";
import InputBuscaEstoque from "../components/InputBuscaEstoque";
import { useIconColor } from "../context/IconColorContext";

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
const fmtFone = (ddd, fone) => {
    const d = onlyDigits(ddd);
    const f = onlyDigits(fone);
    if (!d && !f) return "";
    return `${d}${d ? " " : ""}${f}`;
};

/* ========================= Mocks ========================= */
// Catálogo mock de produtos (para preencher descrição ao digitar código)
const produtosCatalogoMock = [
    { codigo: "000025", descricao: "GASOLINA" },
    { codigo: "000026", descricao: "ETANOL" },
    { codigo: "000027", descricao: "DIESEL S10" },
    { codigo: "000028", descricao: "ARLA 32" },
];

const pontosMockBase = [
    {
        id: 1,
        cnpj: "51302065000122",
        ie: "123456789",
        bombaInterna: true,

        razao: "AUTO POSTO SACI LTDA",
        fantasia: "POSTO SACI",

        endereco: "RUA TESTE, 100",
        bairro: "CENTRO",

        cep: "13000-000",
        cidade: "CAMPINAS",
        uf: "SP",

        ddd1: "19",
        fone1: "33334444",
        ddd2: "19",
        fone2: "99998888",

        email: "contato@postosaci.com.br",
        contato: "JOÃO",

        banco: "033",
        agencia: "1234",
        conta: "98765",

        produtos: [{ codigo: "000025", descricao: "GASOLINA" }],

        bombas: [
            {
                bomba: "01",
                descricao: "BOMBA INTERNA",
                odometro: "0,000",
                produto: "GASOLINA",
            },
        ],
    },
    {
        id: 2,
        cnpj: "10545575000143",
        ie: "",
        bombaInterna: false,

        razao: "POSTO EXEMPLO LTDA",
        fantasia: "POSTO EXEMPLO",

        endereco: "AV BRASIL, 500",
        bairro: "JARDINS",

        cep: "11500-000",
        cidade: "CUBATAO",
        uf: "SP",

        ddd1: "13",
        fone1: "33634952",
        ddd2: "",
        fone2: "",

        email: "financeiro@postoexemplo.com.br",
        contato: "MARIA",

        banco: "",
        agencia: "",
        conta: "",

        produtos: [
            { codigo: "000025", descricao: "GASOLINA" },
            { codigo: "000026", descricao: "ETANOL" },
        ],

        bombas: [],
    },
];

export default function PontoAbastecimento({ open }) {
    const location = useLocation();
    const isOficina = location.pathname.startsWith("/modulo-oficina");
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    /* ===== Abas ===== */
    const [activeTab, setActiveTab] = useState("cadastro"); // cadastro | consulta

    /* ===== Lista (mock) ===== */
    const [lista, setLista] = useState(pontosMockBase);

    /* ===== Cadastro ===== */
    const [cad, setCad] = useState({
        id: null,

        cnpj: "",
        ie: "",
        bombaInterna: false,

        razao: "",
        fantasia: "",

        endereco: "",
        bairro: "",

        cep: "",
        cidade: "",
        uf: "",

        ddd1: "",
        fone1: "",
        ddd2: "",
        fone2: "",

        email: "",
        contato: "",

        banco: "",
        agencia: "",
        conta: "",

        produtos: [],
        bombas: [],
    });

    const setF = (campo) => (e) => {
        const v = e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
        setCad((p) => ({ ...p, [campo]: v }));
    };

    /* Cidade/UF bloqueados (preenchidos via busca) */
    const cidadeReadOnly = true;
    const ufReadOnly = true;

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

    /* ===== Consulta ===== */
    const [cons, setCons] = useState({
        cnpj: "",
        razao: "",
        fantasia: "",
        cidade: "",
    });

    const setC = (campo) => (e) => setCons((p) => ({ ...p, [campo]: e.target.value }));
    const [resultado, setResultado] = useState([]); // só aparece depois do Pesquisar

    /* ===== Modais / mensagens ===== */
    const [modalMsg, setModalMsg] = useState(null);

    /* ===== Modal Produtos ===== */
    const [modalProdutosOpen, setModalProdutosOpen] = useState(false);

    const [prodCad, setProdCad] = useState({
        codigo: "",
        descricao: "",
    });
    const [prodSelCodigo, setProdSelCodigo] = useState(null); // selecionado na grid

    const setP = (campo) => (e) => setProdCad((p) => ({ ...p, [campo]: e.target.value }));

    const limparProdCard = () => {
        setProdCad({ codigo: "", descricao: "" });
        setProdSelCodigo(null);
    };

    const preencherDescPorCodigo = (codigo) => {
        const cod = String(codigo || "").padStart(6, "0");
        const achou = produtosCatalogoMock.find((x) => x.codigo === cod);
        return achou?.descricao || "";
    };

    const abrirModalProdutos = () => {
        if (!cad.cnpj || !cad.razao) {
            setModalMsg({
                tipo: "info",
                texto: "Preencha CNPJ e Razão Social antes de abrir Produtos.",
            });
            return;
        }
        limparProdCard();
        setModalProdutosOpen(true);
    };

    const selecionarProduto = (row) => {
        setProdSelCodigo(row.codigo);
        setProdCad({ codigo: row.codigo, descricao: row.descricao });
    };

    const acaoProdIncluir = () => {
        setModalMsg({
            tipo: "confirm",
            texto: "Confirma a Inclusão?",
            onYes: () => {
                const codigo = String(prodCad.codigo || "").trim();
                if (!codigo) {
                    setModalMsg({ tipo: "info", texto: "Informe o Código do Produto." });
                    return;
                }
                const cod = codigo.padStart(6, "0");
                const descricao = prodCad.descricao || preencherDescPorCodigo(cod);

                if (!descricao) {
                    setModalMsg({ tipo: "info", texto: "Produto não encontrado no catálogo (mock)." });
                    return;
                }

                setCad((p) => {
                    const ja = (p.produtos || []).some((x) => x.codigo === cod);
                    if (ja) return p;
                    return { ...p, produtos: [{ codigo: cod, descricao }, ...(p.produtos || [])] };
                });

                setModalMsg({ tipo: "sucesso", texto: "Produto incluído com sucesso! (mock)" });
                limparProdCard();
            },
        });
    };

    const acaoProdAlterar = () => {
        if (!prodSelCodigo) {
            setModalMsg({ tipo: "info", texto: "Selecione um produto na grid para alterar." });
            return;
        }

        setModalMsg({
            tipo: "confirm",
            texto: "Confirma a Alteração?",
            onYes: () => {
                const codigo = String(prodCad.codigo || "").trim().padStart(6, "0");
                const descricao = prodCad.descricao || preencherDescPorCodigo(codigo);

                if (!codigo || !descricao) {
                    setModalMsg({ tipo: "info", texto: "Código/Descrição inválidos." });
                    return;
                }

                setCad((p) => ({
                    ...p,
                    produtos: (p.produtos || []).map((x) =>
                        x.codigo === prodSelCodigo ? { codigo, descricao } : x
                    ),
                }));

                setModalMsg({ tipo: "sucesso", texto: "Produto alterado com sucesso! (mock)" });
                limparProdCard();
            },
        });
    };

    const acaoProdExcluir = () => {
        if (!prodSelCodigo) {
            setModalMsg({ tipo: "info", texto: "Selecione um produto na grid para excluir." });
            return;
        }

        setModalMsg({
            tipo: "confirm",
            texto: "Confirma a Exclusão?",
            onYes: () => {
                setCad((p) => ({
                    ...p,
                    produtos: (p.produtos || []).filter((x) => x.codigo !== prodSelCodigo),
                }));
                setModalMsg({ tipo: "sucesso", texto: "Produto excluído com sucesso! (mock)" });
                limparProdCard();
            },
        });
    };

    /* ===== Modal Bombas ===== */
    const [modalBombasOpen, setModalBombasOpen] = useState(false);

    const [bombaCad, setBombaCad] = useState({
        bomba: "",
        produto: "GASOLINA",
        descricao: "",
        odometro: "0,000",
        novoOdometro: "0,000",
    });
    const [bombaSel, setBombaSel] = useState(null); // selecionado na grid (bomba)

    const setB = (campo) => (e) => setBombaCad((p) => ({ ...p, [campo]: e.target.value }));

    const limparBombaCard = () => {
        setBombaCad({
            bomba: "",
            produto: "GASOLINA",
            descricao: "",
            odometro: "0,000",
            novoOdometro: "0,000",
        });
        setBombaSel(null);
    };

    const abrirModalBombas = () => {
        if (!cad.bombaInterna) return; // só abre se flag ativa
        if (!cad.cnpj || !cad.razao) {
            setModalMsg({
                tipo: "info",
                texto: "Preencha CNPJ e Razão Social antes de abrir Bombas.",
            });
            return;
        }
        limparBombaCard();
        setModalBombasOpen(true);
    };

    const selecionarBomba = (row) => {
        setBombaSel(row.bomba);
        setBombaCad({
            bomba: row.bomba,
            produto: row.produto || "GASOLINA",
            descricao: row.descricao || "",
            odometro: row.odometro || "0,000",
            novoOdometro: row.odometro || "0,000",
        });
    };

    const acaoBombaIncluir = () => {
        setModalMsg({
            tipo: "confirm",
            texto: "Confirma a Inclusão?",
            onYes: () => {
                const b = String(bombaCad.bomba || "").trim();
                if (!b) {
                    setModalMsg({ tipo: "info", texto: "Informe o Código da Bomba." });
                    return;
                }
                const descricao = String(bombaCad.descricao || "").trim();
                if (!descricao) {
                    setModalMsg({ tipo: "info", texto: "Informe a Descrição da Bomba." });
                    return;
                }

                const novo = {
                    bomba: b,
                    produto: bombaCad.produto || "GASOLINA",
                    descricao,
                    odometro: bombaCad.odometro || "0,000",
                };

                setCad((p) => {
                    const ja = (p.bombas || []).some((x) => String(x.bomba) === String(b));
                    if (ja) return p;
                    return { ...p, bombas: [novo, ...(p.bombas || [])] };
                });

                setModalMsg({ tipo: "sucesso", texto: "Bomba incluída com sucesso! (mock)" });
                limparBombaCard();
            },
        });
    };

    const acaoBombaAlterar = () => {
        if (!bombaSel) {
            setModalMsg({ tipo: "info", texto: "Selecione uma bomba na grid para alterar." });
            return;
        }
        setModalMsg({
            tipo: "confirm",
            texto: "Confirma a Alteração?",
            onYes: () => {
                const b = String(bombaCad.bomba || "").trim();
                if (!b) {
                    setModalMsg({ tipo: "info", texto: "Informe o Código da Bomba." });
                    return;
                }
                const descricao = String(bombaCad.descricao || "").trim();
                if (!descricao) {
                    setModalMsg({ tipo: "info", texto: "Informe a Descrição da Bomba." });
                    return;
                }

                const atualizado = {
                    bomba: b,
                    produto: bombaCad.produto || "GASOLINA",
                    descricao,
                    odometro: bombaCad.novoOdometro || bombaCad.odometro || "0,000",
                };

                setCad((p) => ({
                    ...p,
                    bombas: (p.bombas || []).map((x) =>
                        String(x.bomba) === String(bombaSel) ? atualizado : x
                    ),
                }));

                setModalMsg({ tipo: "sucesso", texto: "Bomba alterada com sucesso! (mock)" });
                limparBombaCard();
            },
        });
    };

    const acaoBombaExcluir = () => {
        if (!bombaSel) {
            setModalMsg({ tipo: "info", texto: "Selecione uma bomba na grid para excluir." });
            return;
        }
        setModalMsg({
            tipo: "confirm",
            texto: "Confirma a Exclusão?",
            onYes: () => {
                setCad((p) => ({
                    ...p,
                    bombas: (p.bombas || []).filter((x) => String(x.bomba) !== String(bombaSel)),
                }));
                setModalMsg({ tipo: "sucesso", texto: "Bomba excluída com sucesso! (mock)" });
                limparBombaCard();
            },
        });
    };

    /* ===== Limpar ===== */
    const limparCadastro = () => {
        setCad({
            id: null,

            cnpj: "",
            ie: "",
            bombaInterna: false,

            razao: "",
            fantasia: "",

            endereco: "",
            bairro: "",

            cep: "",
            cidade: "",
            uf: "",

            ddd1: "",
            fone1: "",
            ddd2: "",
            fone2: "",

            email: "",
            contato: "",

            banco: "",
            agencia: "",
            conta: "",

            produtos: [],
            bombas: [],
        });
    };

    const limparConsulta = () => {
        setCons({ cnpj: "", razao: "", fantasia: "", cidade: "" });
        setResultado([]);
    };

    /* ===== Ações (principal) ===== */
    const acaoPesquisar = () => {
        const cnpj = onlyDigits(cons.cnpj || "").toLowerCase();
        const razao = (cons.razao || "").trim().toLowerCase();
        const fantasia = (cons.fantasia || "").trim().toLowerCase();
        const cidade = (cons.cidade || "").trim().toLowerCase();

        const filtrado = lista.filter((x) => {
            const okCnpj = cnpj ? onlyDigits(x.cnpj).includes(cnpj) : true;
            const okRazao = razao ? String(x.razao || "").toLowerCase().includes(razao) : true;
            const okFantasia = fantasia
                ? String(x.fantasia || "").toLowerCase().includes(fantasia)
                : true;
            const okCidade = cidade ? String(x.cidade || "").toLowerCase().includes(cidade) : true;
            return okCnpj && okRazao && okFantasia && okCidade;
        });

        setResultado(filtrado);
    };

    const abrirCadastro = (row) => {
        setCad({
            ...row,
            produtos: Array.isArray(row.produtos) ? row.produtos : [],
            bombas: Array.isArray(row.bombas) ? row.bombas : [],
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
                    produtos: cad.produtos || [],
                    bombas: cad.bombas || [],
                };
                setLista((prev) => [novo, ...prev]);
                setModalMsg({ tipo: "sucesso", texto: "Ponto de Abastecimento incluído com sucesso! (mock)" });
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
                setLista((prev) => prev.map((x) => (x.id === cad.id ? { ...cad } : x)));
                setModalMsg({ tipo: "sucesso", texto: "Ponto de Abastecimento alterado com sucesso! (mock)" });
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
                setModalMsg({ tipo: "sucesso", texto: "Ponto de Abastecimento excluído com sucesso! (mock)" });
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

    /* ===== Título ===== */
    const tituloTopo = useMemo(() => "PONTO DE ABASTECIMENTO", []);

    /* ===== Fones exibidos (linha de visualização, se você quiser usar depois) ===== */
    const foneVis1 = useMemo(() => fmtFone(cad.ddd1, cad.fone1), [cad.ddd1, cad.fone1]);
    const foneVis2 = useMemo(() => fmtFone(cad.ddd2, cad.fone2), [cad.ddd2, cad.fone2]);

    /* ===== Ajuste: ao trocar para consulta, não exibir automaticamente a grid ===== */
    useEffect(() => {
        if (activeTab === "consulta") {
            // por padrão fica vazio até clicar Pesquisar
        }
    }, [activeTab]);

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
                        {/* Card 1 - Cadastro */}
                        <fieldset className="border border-gray-300 rounded p-3 bg-white">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">Cadastro</legend>

                            <div className="space-y-2">
                                {/* Linha 1 - CNPJ, IE, Bomba Interna */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-1 justify-end">CNPJ</Label>
                                    <Txt
                                        className="col-span-3"
                                        value={cad.cnpj}
                                        onChange={setF("cnpj")}
                                        placeholder="Somente dígitos"
                                        tabIndex={1}
                                        onKeyDown={handleKeyDown}
                                    />

                                    <Label className="col-span-2 justify-end col-start-6">IE</Label>
                                    <Txt
                                        className="col-span-2"
                                        value={cad.ie}
                                        onChange={setF("ie")}
                                        tabIndex={2}
                                        onKeyDown={handleKeyDown}
                                    />

                                    <div className="col-span-3 flex items-center gap-2">
                                        <Chk
                                            checked={cad.bombaInterna}
                                            onChange={setF("bombaInterna")}
                                            tabIndex={3}
                                            onKeyDown={handleKeyDown}
                                        />
                                        <span className="text-[12px] text-gray-700">Bomba Interna</span>
                                    </div>
                                </div>

                                {/* Linha 2 - Razão, Fantasia */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-1 justify-end">Razão Social</Label>
                                    <Txt
                                        className="col-span-5"
                                        value={cad.razao}
                                        onChange={setF("razao")}
                                        tabIndex={4}
                                        onKeyDown={handleKeyDown}
                                    />

                                    <Label className="col-span-1 justify-end">Fantasia</Label>
                                    <Txt
                                        className="col-span-5"
                                        value={cad.fantasia}
                                        onChange={setF("fantasia")}
                                        tabIndex={5}
                                        onKeyDown={handleKeyDown}
                                    />
                                </div>

                                {/* Linha 3 - Endereço, Bairro */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-1 justify-end">Endereço</Label>
                                    <Txt
                                        className="col-span-7"
                                        value={cad.endereco}
                                        onChange={setF("endereco")}
                                        tabIndex={6}
                                        onKeyDown={handleKeyDown}
                                    />

                                    <Label className="col-span-1 justify-end">Bairro</Label>
                                    <Txt
                                        className="col-span-3"
                                        value={cad.bairro}
                                        onChange={setF("bairro")}
                                        tabIndex={7}
                                        onKeyDown={handleKeyDown}
                                    />
                                </div>

                                {/* Linha 4 - Cidade (CEP, Cidade, UF) - Cidade/UF bloqueados */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-1 justify-end">Cidade</Label>

                                    <InputBuscaCidade
                                        className="col-span-2 text-center"
                                        label={null}
                                        value={cad.cep}
                                        onChange={setF("cep")}
                                        tabIndex={8}
                                        onSelect={(cid) => {
                                            setCad((p) => ({
                                                ...p,
                                                cidade: cid.nome,
                                                uf: cid.uf,
                                                cep: cid.cep,
                                            }));
                                            setTimeout(() => document.querySelector('[tabindex="9"]')?.focus(), 10);
                                        }}
                                    />

                                    <Txt
                                        className="col-span-7 bg-gray-200"
                                        value={cad.cidade}
                                        onChange={setF("cidade")}
                                        readOnly={cidadeReadOnly}
                                        tabIndex={-1}
                                    />

                                    <Txt
                                        className="col-span-2 text-center bg-gray-200"
                                        value={cad.uf}
                                        onChange={setF("uf")}
                                        readOnly={ufReadOnly}
                                        tabIndex={-1}
                                    />
                                </div>

                                {/* Linha 5 - Fone 1 (DDD + Telefone), Fone 2 (DDD + Telefone) */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-1 justify-end">Fone 1</Label>
                                    <Txt
                                        className="col-span-1 text-center"
                                        placeholder="DDD"
                                        value={cad.ddd1}
                                        onChange={setF("ddd1")}
                                        tabIndex={9}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <Txt
                                        className="col-span-4"
                                        placeholder="Telefone"
                                        value={cad.fone1}
                                        onChange={setF("fone1")}
                                        tabIndex={10}
                                        onKeyDown={handleKeyDown}
                                    />

                                    <Label className="col-span-1 justify-end">Fone 2</Label>
                                    <Txt
                                        className="col-span-1 text-center"
                                        placeholder="DDD"
                                        value={cad.ddd2}
                                        onChange={setF("ddd2")}
                                        tabIndex={11}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <Txt
                                        className="col-span-4"
                                        placeholder="Telefone"
                                        value={cad.fone2}
                                        onChange={setF("fone2")}
                                        tabIndex={12}
                                        onKeyDown={handleKeyDown}
                                    />
                                </div>

                                {/* Linha 6 - Email, Contato */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-1 justify-end">E-mail</Label>
                                    <Txt
                                        className="col-span-5"
                                        value={cad.email}
                                        onChange={setF("email")}
                                        tabIndex={13}
                                        onKeyDown={handleKeyDown}
                                    />

                                    <Label className="col-span-1 justify-end">Contato</Label>
                                    <Txt
                                        className="col-span-5"
                                        value={cad.contato}
                                        onChange={setF("contato")}
                                        tabIndex={14}
                                        onKeyDown={handleKeyDown}
                                    />
                                </div>

                                {/* Linha 7 - Banco, Agência, Nº Conta */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-1 justify-end">Banco</Label>
                                    <Txt
                                        className="col-span-2"
                                        value={cad.banco}
                                        onChange={setF("banco")}
                                        tabIndex={15}
                                        onKeyDown={handleKeyDown}
                                    />

                                    <Label className="col-span-1 justify-end">Agência</Label>
                                    <Txt
                                        className="col-span-2"
                                        value={cad.agencia}
                                        onChange={setF("agencia")}
                                        tabIndex={16}
                                        onKeyDown={handleKeyDown}
                                    />

                                    <Label className="col-span-1 justify-end">Nº Conta</Label>
                                    <Txt
                                        className="col-span-5"
                                        value={cad.conta}
                                        onChange={setF("conta")}
                                        tabIndex={17}
                                        onKeyDown={handleKeyDown}
                                    />
                                </div>
                            </div>
                        </fieldset>

                        {/* Card 2 - Controle de Estoque */}
                        <fieldset className="border border-gray-300 rounded p-3 bg-white">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                Controle de Estoque
                            </legend>

                            <div className="grid grid-cols-12 gap-2 items-center">
                                <Label className="col-span-1 justify-end">Produtos</Label>

                                <button
                                    onClick={abrirModalProdutos}
                                    tabIndex={18}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            abrirModalProdutos();
                                        } else {
                                            handleKeyDown(e);
                                        }
                                    }}
                                    className="col-span-3 border border-gray-300 rounded px-3 py-[4px] bg-gray-50 hover:bg-gray-100 text-[12px] flex items-center gap-1"
                                    title="Produtos"
                                >
                                    <PackageSearch size={14} className="text-red-700" />
                                    Produtos
                                </button>

                                <div className="col-span-8 text-[12px] text-gray-600 flex items-center gap-2">
                                    <span className="text-gray-700 font-semibold">Itens:</span>
                                    <span className="text-gray-600">{cad.produtos?.length || 0}</span>
                                    <span className="text-gray-400">|</span>
                                    <span className="text-gray-500">
                                        {cad.produtos?.slice(0, 3).map((x) => x.descricao).join(", ")}
                                        {cad.produtos?.length > 3 ? "..." : ""}
                                    </span>
                                </div>
                            </div>

                            {/* BOTÃO BOMBAS (ativo só se Bomba Interna = true) */}
                            <div className="grid grid-cols-12 gap-2 items-center mt-2">
                                <Label className="col-span-1 justify-end">Bombas</Label>

                                <button
                                    onClick={abrirModalBombas}
                                    disabled={!cad.bombaInterna}
                                    tabIndex={cad.bombaInterna ? 20 : -1}
                                    onKeyDown={(e) => {
                                        if (!cad.bombaInterna) return;
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            abrirModalBombas();
                                        } else {
                                            handleKeyDown(e);
                                        }
                                    }}
                                    className={[
                                        "col-span-3 border border-gray-300 rounded px-3 py-[4px] text-[12px] flex items-center gap-1",
                                        cad.bombaInterna ? "bg-gray-50 hover:bg-gray-100" : "bg-gray-200 text-gray-500 cursor-not-allowed",
                                    ].join(" ")}
                                    title={cad.bombaInterna ? "Bombas" : "Ative 'Bomba Interna' para liberar"}
                                >
                                    <Fuel size={14} className="text-red-700" />
                                    Bombas
                                </button>

                                <div className="col-span-8 text-[12px] text-gray-600 flex items-center gap-2">
                                    <span className="text-gray-700 font-semibold">Itens:</span>
                                    <span className="text-gray-600">{cad.bombas?.length || 0}</span>
                                    <span className="text-gray-400">|</span>
                                    <span className="text-gray-500">
                                        {cad.bombas?.slice(0, 2).map((x) => `${x.bomba}-${x.descricao}`).join(", ")}
                                        {cad.bombas?.length > 2 ? "..." : ""}
                                    </span>
                                </div>
                            </div>

                            {/* Uma prévia simples (opcional, ajuda a visualizar sem abrir modal) */}
                            <div className="mt-2 w-full overflow-x-auto">
                                <table className="min-w-[700px] w-full text-[12px] border-collapse">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border px-2 py-1 w-[120px]">Código</th>
                                            <th className="border px-2 py-1">Descrição</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(cad.produtos || []).map((p) => (
                                            <tr key={p.codigo}>
                                                <td className="border px-2 py-1 text-center">{p.codigo}</td>
                                                <td className="border px-2 py-1">{p.descricao}</td>
                                            </tr>
                                        ))}
                                        {(cad.produtos || []).length === 0 && (
                                            <tr>
                                                <td colSpan={2} className="border px-2 py-2 text-center text-gray-500">
                                                    Nenhum produto vinculado.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </fieldset>
                    </>
                )}

                {/* ========================= ABA CONSULTA ========================= */}
                {activeTab === "consulta" && (
                    <>
                        {/* Card 1 - Parâmetros */}
                        <fieldset className="border border-gray-300 rounded p-3 bg-white">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                Parâmetros de Pesquisa
                            </legend>

                            <div className="space-y-2">
                                {/* Linha 1 - CNPJ, Razão Social */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-1 justify-end">CNPJ</Label>
                                    <Txt
                                        className="col-span-4"
                                        value={cons.cnpj}
                                        onChange={setC("cnpj")}
                                        tabIndex={30}
                                        onKeyDown={handleKeyDown}
                                    />

                                    <Label className="col-span-2 justify-end">Razão Social</Label>
                                    <Txt
                                        className="col-span-5"
                                        value={cons.razao}
                                        onChange={setC("razao")}
                                        tabIndex={31}
                                        onKeyDown={handleKeyDown}
                                    />
                                </div>

                                {/* Linha 2 - Fantasia, Cidade, Pesquisar */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-1 justify-end">Fantasia</Label>
                                    <Txt
                                        className="col-span-4"
                                        value={cons.fantasia}
                                        onChange={setC("fantasia")}
                                        tabIndex={32}
                                        onKeyDown={handleKeyDown}
                                    />

                                    <Label className="col-span-1 justify-end col-start-7">Cidade</Label>
                                    <Txt
                                        className="col-span-3"
                                        value={cons.cidade}
                                        onChange={setC("cidade")}
                                        tabIndex={33}
                                        onKeyDown={handleKeyDown}
                                    />

                                    <div className="col-span-2 flex justify-end gap-2">
                                        <button
                                            onClick={acaoPesquisar}
                                            tabIndex={34}
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
                        <fieldset className="border border-gray-300 rounded p-2 bg-white">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                Resultado (clique para abrir no Cadastro)
                            </legend>

                            <div className="w-full overflow-x-auto">
                                <table className="min-w-[1100px] w-full text-[12px] border-collapse">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border px-2 py-1">CNPJ</th>
                                            <th className="border px-2 py-1">IE</th>
                                            <th className="border px-2 py-1">Bomba Interna</th>
                                            <th className="border px-2 py-1">Fantasia</th>
                                            <th className="border px-2 py-1">Razão Social</th>
                                            <th className="border px-2 py-1">Cidade</th>
                                            <th className="border px-2 py-1">UF</th>
                                            <th className="border px-2 py-1">Contato</th>
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
                                                <td className="border px-2 py-1 text-center">{r.cnpj}</td>
                                                <td className="border px-2 py-1 text-center">{r.ie}</td>
                                                <td className="border px-2 py-1 text-center">
                                                    {r.bombaInterna ? "Sim" : "Não"}
                                                </td>
                                                <td className="border px-2 py-1">{r.fantasia}</td>
                                                <td className="border px-2 py-1">{r.razao}</td>
                                                <td className="border px-2 py-1">{r.cidade}</td>
                                                <td className="border px-2 py-1 text-center">{r.uf}</td>
                                                <td className="border px-2 py-1">{r.contato}</td>
                                            </tr>
                                        ))}

                                        {resultado.length === 0 && (
                                            <tr>
                                                <td colSpan={8} className="border px-2 py-2 text-center text-gray-500">
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
          DOM: Incluir por último, com order-3.
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

            {/* ========================= Modal Produtos (interno) ========================= */}
            {modalProdutosOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white shadow-lg rounded border w-[980px] max-w-[95vw] max-h-[90vh] flex flex-col">
                        <div className="border-b border-gray-300 px-4 py-2">
                            <h2 className="text-red-700 font-semibold text-[14px] text-center">
                                Produtos do Ponto de Abastecimento
                            </h2>
                        </div>

                        <div className="p-3 overflow-y-auto flex flex-col gap-2">
                            {/* Card 1 - Dados + item */}
                            <fieldset className="border border-gray-300 rounded p-3 bg-white">
                                <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                    Item do Estoque
                                </legend>

                                <div className="space-y-2">
                                    {/* Linha 1 - CGC/CPF (CNPJ + Razão Social) bloqueados */}
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                        <Label className="col-span-1 justify-end">CGC/CPF</Label>
                                        <Txt
                                            className="col-span-2 bg-gray-200"
                                            value={cad.cnpj}
                                            readOnly
                                            tabIndex={-1}
                                        />
                                        <Txt
                                            className="col-span-9 bg-gray-200"
                                            value={cad.razao}
                                            readOnly
                                            tabIndex={-1}
                                        />
                                    </div>

                                    {/* Linha 2 - Cod.Produto + Descrição (bloqueada) */}
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                        <Label className="col-span-1 justify-end">Cod.Produto</Label>
                                        <InputBuscaEstoque
                                            className="col-span-2"
                                            label={null}
                                            value={prodCad.codigo}
                                            onChange={setP("codigo")}
                                            onSelect={(item) => {
                                                setProdCad((p) => ({ ...p, codigo: item.codigo, descricao: item.descricao }));
                                                setTimeout(() => document.querySelector('[tabindex="102"]')?.focus(), 10); // foca botão incluir
                                            }}
                                            tabIndex={101}
                                            placeholder="000025"
                                        />
                                        <Label className="col-span-1 justify-end">Descrição</Label>
                                        <Txt
                                            className="col-span-8 bg-gray-200"
                                            value={prodCad.descricao}
                                            readOnly
                                            tabIndex={-1}
                                        />
                                    </div>
                                </div>
                            </fieldset>

                            {/* Card 2 - Grid */}
                            <fieldset className="border border-gray-300 rounded p-2 bg-white">
                                <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                    Itens
                                </legend>

                                <div className="w-full overflow-x-auto">
                                    <table className="min-w-[700px] w-full text-[12px] border-collapse">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="border px-2 py-1 w-[140px]">Código</th>
                                                <th className="border px-2 py-1">Descrição</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(cad.produtos || []).map((p) => (
                                                <tr
                                                    key={p.codigo}
                                                    className={`cursor-pointer hover:bg-green-100 ${prodSelCodigo === p.codigo ? "bg-green-50" : ""
                                                        }`}
                                                    onClick={() => selecionarProduto(p)}
                                                    title="Clique para carregar no Card 1"
                                                >
                                                    <td className="border px-2 py-1 text-center">{p.codigo}</td>
                                                    <td className="border px-2 py-1">{p.descricao}</td>
                                                </tr>
                                            ))}

                                            {(cad.produtos || []).length === 0 && (
                                                <tr>
                                                    <td colSpan={2} className="border px-2 py-2 text-center text-gray-500">
                                                        Nenhum item cadastrado.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </fieldset>
                        </div>

                        {/* Rodapé modal (Incluir por último no DOM) */}
                        <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">
                            <button
                                onClick={() => setModalProdutosOpen(false)}
                                className={`order-1 flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                                title="Fechar"
                            >
                                <XCircle size={20} />
                                <span>Fechar</span>
                            </button>

                            <button
                                onClick={limparProdCard}
                                className={`order-2 flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                                title="Limpar"
                            >
                                <RotateCcw size={20} />
                                <span>Limpar</span>
                            </button>

                            <button
                                onClick={acaoProdAlterar}
                                className={`order-4 flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                                title="Alterar"
                            >
                                <Edit size={20} />
                                <span>Alterar</span>
                            </button>

                            <button
                                onClick={acaoProdExcluir}
                                className={`order-5 flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                                title="Excluir"
                            >
                                <Trash2 size={20} />
                                <span>Excluir</span>
                            </button>

                            <button
                                onClick={acaoProdIncluir}
                                tabIndex={102}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        acaoProdIncluir();
                                    }
                                }}
                                className={`order-3 flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                                title="Incluir"
                            >
                                <PlusCircle size={20} />
                                <span>Incluir</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================= Modal Bombas (interno) ========================= */}
            {modalBombasOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white shadow-lg rounded border w-[980px] max-w-[95vw] max-h-[90vh] flex flex-col">
                        <div className="border-b border-gray-300 px-4 py-2">
                            <h2 className="text-red-700 font-semibold text-[14px] text-center">
                                Bombas do Posto de Abastecimento
                            </h2>
                        </div>

                        <div className="p-3 overflow-y-auto flex flex-col gap-2">
                            {/* Card 1 - Dados + item */}
                            <fieldset className="border border-gray-300 rounded p-3 bg-white">
                                <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                    Cadastro de Bombas
                                </legend>

                                <div className="space-y-2">
                                    {/* Linha 1 - CGC/CPF (CNPJ + Razão Social) bloqueados */}
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                        <Label className="col-span-1 justify-end">CGC/CPF</Label>
                                        <Txt className="col-span-2 bg-gray-200" value={cad.cnpj} readOnly tabIndex={-1} />
                                        <Txt className="col-span-9 bg-gray-200" value={cad.razao} readOnly tabIndex={-1} />
                                    </div>

                                    {/* Linha 2 - Cod. Bomba, Produto (combo) */}
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                        <Label className="col-span-1 justify-end">Cod. Bomba</Label>
                                        <Txt
                                            className="col-span-2 text-center"
                                            value={bombaCad.bomba}
                                            onChange={setB("bomba")}
                                            tabIndex={201}
                                            onKeyDown={handleKeyDown}
                                            placeholder="01"
                                        />

                                        <Label className="col-span-1 justify-end">Produto</Label>
                                        <select
                                            className="col-span-8 border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full bg-white"
                                            value={bombaCad.produto}
                                            onChange={setB("produto")}
                                            tabIndex={202}
                                            onKeyDown={handleKeyDown}
                                        >
                                            <option value="GASOLINA">GASOLINA</option>
                                            <option value="DIESEL">DIESEL</option>
                                            <option value="ETANOL">ETANOL</option>
                                        </select>
                                    </div>

                                    {/* Linha 3 - Descrição */}
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                        <Label className="col-span-1 justify-end">Descrição</Label>
                                        <Txt
                                            className="col-span-11"
                                            value={bombaCad.descricao}
                                            onChange={setB("descricao")}
                                            tabIndex={203}
                                            onKeyDown={handleKeyDown}
                                            placeholder="BOMBA INTERNA"
                                        />
                                    </div>

                                    {/* Linha 4 - Odômetro, Novo Odômetro */}
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                        <Label className="col-span-1 justify-end">Odômetro</Label>
                                        <Txt
                                            className="col-span-2 text-center"
                                            value={bombaCad.odometro}
                                            onChange={setB("odometro")}
                                            tabIndex={204}
                                            onKeyDown={handleKeyDown}
                                        />

                                        <Label className="col-span-2 justify-end col-start-6">Novo Odômetro</Label>
                                        <Txt
                                            className="col-span-2 text-center"
                                            value={bombaCad.novoOdometro}
                                            onChange={setB("novoOdometro")}
                                            tabIndex={205}
                                            onKeyDown={handleKeyDown}
                                        />

                                        <div className="col-span-5 text-[12px] text-gray-500 flex items-center">
                                            (Ao alterar, será gravado o Novo Odômetro)
                                        </div>
                                    </div>
                                </div>
                            </fieldset>

                            {/* Card 2 - Grid */}
                            <fieldset className="border border-gray-300 rounded p-2 bg-white">
                                <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                    Itens
                                </legend>

                                <div className="w-full overflow-x-auto">
                                    <table className="min-w-[900px] w-full text-[12px] border-collapse">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="border px-2 py-1 w-[120px]">Bomba</th>
                                                <th className="border px-2 py-1">Descrição da Bomba</th>
                                                <th className="border px-2 py-1 w-[160px]">Odômetro Bomba</th>
                                                <th className="border px-2 py-1 w-[160px]">Produto</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(cad.bombas || []).map((b) => (
                                                <tr
                                                    key={b.bomba}
                                                    className={`cursor-pointer hover:bg-green-100 ${String(bombaSel) === String(b.bomba) ? "bg-green-50" : ""
                                                        }`}
                                                    onClick={() => selecionarBomba(b)}
                                                    title="Clique para carregar no Card 1"
                                                >
                                                    <td className="border px-2 py-1 text-center">{b.bomba}</td>
                                                    <td className="border px-2 py-1">{b.descricao}</td>
                                                    <td className="border px-2 py-1 text-center">{b.odometro}</td>
                                                    <td className="border px-2 py-1">{b.produto}</td>
                                                </tr>
                                            ))}

                                            {(cad.bombas || []).length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="border px-2 py-2 text-center text-gray-500">
                                                        Nenhuma bomba cadastrada.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </fieldset>
                        </div>

                        {/* Rodapé modal (Incluir por último no DOM) */}
                        <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">
                            <button
                                onClick={() => setModalBombasOpen(false)}
                                className={`order-1 flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                                title="Fechar"
                            >
                                <XCircle size={20} />
                                <span>Fechar</span>
                            </button>

                            <button
                                onClick={limparBombaCard}
                                className={`order-2 flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                                title="Limpar"
                            >
                                <RotateCcw size={20} />
                                <span>Limpar</span>
                            </button>

                            <button
                                onClick={acaoBombaAlterar}
                                className={`order-4 flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                                title="Alterar"
                            >
                                <Edit size={20} />
                                <span>Alterar</span>
                            </button>

                            <button
                                onClick={acaoBombaExcluir}
                                className={`order-5 flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                                title="Excluir"
                            >
                                <Trash2 size={20} />
                                <span>Excluir</span>
                            </button>

                            <button
                                onClick={acaoBombaIncluir}
                                tabIndex={206}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        acaoBombaIncluir();
                                    }
                                }}
                                className={`order-3 flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                                title="Incluir"
                            >
                                <PlusCircle size={20} />
                                <span>Incluir</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
