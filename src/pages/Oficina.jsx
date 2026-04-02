// src/pages/Oficina.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { XCircle, RotateCcw, PlusCircle, Edit, Trash2, Search } from "lucide-react";
import InputBuscaCidade from "../components/InputBuscaCidade";
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

/* ========================= Mocks ========================= */
const oficinasMockBase = [
    {
        id: 1,
        cnpj: "03066991000101",
        ie: "283044439115",
        controleEstoque: true,

        razao: "FREIOS CASQUEIROS EIRELI",
        fantasia: "FREIOS CASQUEIRO",

        endereco: "AVENIDA NOSSA SENHORA DE FATIMA, 290",
        bairro: "JARDIM CASQUEIRO",

        cep: "11500-000",
        cidade: "CUBATAO",
        uf: "SP",

        ddd1: "13",
        fone1: "33634952",
        ddd2: "19",
        fone2: "74212546",

        email: "VERA.KINJO@FREIOSCASQUEIRO.COM.BR",
    },
    {
        id: 2,
        cnpj: "10545575000143",
        ie: "",
        controleEstoque: false,
        razao: "OFICINA TESTE LTDA",
        fantasia: "OFICINA TESTE",
        endereco: "RUA DAS FLORES, 123",
        bairro: "CENTRO",
        cep: "13000-000",
        cidade: "CAMPINAS",
        uf: "SP",
        ddd1: "19",
        fone1: "999999999",
        ddd2: "",
        fone2: "",
        email: "contato@oficinateste.com.br",
    },
];

/* ========================= Utils ========================= */
const onlyDigits = (s) => String(s || "").replace(/\D/g, "");
const fmtFone = (ddd, fone) => {
    const d = onlyDigits(ddd);
    const f = onlyDigits(fone);
    if (!d && !f) return "";
    return `${d}${d ? " " : ""}${f}`;
};

export default function Oficina({ open }) {
    const location = useLocation();
    const isOficina = location.pathname.startsWith("/modulo-oficina");
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    /* ===== Abas ===== */
    const [activeTab, setActiveTab] = useState("cadastro"); // cadastro | consulta

    /* ===== Lista (mock) ===== */
    const [lista, setLista] = useState(oficinasMockBase);

    /* ===== Cadastro ===== */
    const [cad, setCad] = useState({
        id: null,
        cnpj: "",
        ie: "",
        controleEstoque: false,

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
    });

    const setF = (campo) => (e) => {
        const v = e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
        setCad((p) => ({ ...p, [campo]: v }));
    };

    /* Cidade/UF bloqueados (preenchidos via busca) */
    const cidadeReadOnly = true;
    const ufReadOnly = true;

    /* ===== Navigation Handler ===== */
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const currentTab = parseInt(e.target.getAttribute("tabindex"));
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

    const [resultado, setResultado] = useState([]); // só aparece depois de Pesquisar

    /* ===== Modais / mensagens ===== */
    const [modalMsg, setModalMsg] = useState(null);

    /* ===== Limpar ===== */
    const limparCadastro = () => {
        setCad({
            id: null,
            cnpj: "",
            ie: "",
            controleEstoque: false,
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
        });
    };

    const limparConsulta = () => {
        setCons({ cnpj: "", razao: "", fantasia: "", cidade: "" });
        setResultado([]);
    };

    /* ===== Ações ===== */
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
        setCad({ ...row });
        setActiveTab("cadastro");
    };

    const acaoIncluir = () => {
        setModalMsg({
            tipo: "confirm",
            texto: "Confirma a Inclusão?",
            onYes: () => {
                const novo = { ...cad, id: Date.now() };
                setLista((prev) => [novo, ...prev]);
                setModalMsg({ tipo: "sucesso", texto: "Oficina incluída com sucesso! (mock)" });
            },
        });
    };

    const acaoAlterar = () => {
        if (!cad.id) {
            setModalMsg({ tipo: "info", texto: "Selecione uma oficina para alterar." });
            return;
        }
        setLista((prev) => prev.map((x) => (x.id === cad.id ? { ...cad } : x)));
        setModalMsg({ tipo: "sucesso", texto: "Oficina alterada com sucesso! (mock)" });
    };

    const acaoExcluir = () => {
        if (!cad.id) {
            setModalMsg({ tipo: "info", texto: "Selecione uma oficina para excluir." });
            return;
        }
        setModalMsg({
            tipo: "confirm",
            texto: "Deseja excluir esta oficina?",
            onYes: () => {
                setLista((prev) => prev.filter((x) => x.id !== cad.id));
                limparCadastro();
                setModalMsg({ tipo: "sucesso", texto: "Oficina excluída com sucesso! (mock)" });
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
    const tituloTopo = useMemo(() => "OFICINA", []);

    /* ===== Fones exibidos (linha de visualização) ===== */
    const foneVis1 = useMemo(() => fmtFone(cad.ddd1, cad.fone1), [cad.ddd1, cad.fone1]);
    const foneVis2 = useMemo(() => fmtFone(cad.ddd2, cad.fone2), [cad.ddd2, cad.fone2]);

    /* ===== Ajuste: ao trocar para consulta, não exibir automaticamente a grid ===== */
    useEffect(() => {
        if (activeTab === "consulta") {
            // mantém resultado como está; por padrão fica vazio até clicar Pesquisar
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
                    <fieldset className="border border-gray-300 rounded p-3 bg-white">
                        <legend className="px-2 text-red-700 font-semibold text-[13px]">Cadastro</legend>

                        <div className="space-y-2">
                            {/* Linha 1 - CNPJ, IE, Controle Estoque */}
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
                                    className="col-span-3"
                                    value={cad.ie}
                                    onChange={setF("ie")}
                                    tabIndex={2}
                                    onKeyDown={handleKeyDown}
                                />

                                <div className="col-span-2 flex items-center gap-2">
                                    <Chk
                                        checked={cad.controleEstoque}
                                        onChange={setF("controleEstoque")}
                                        tabIndex={3}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <span className="text-[12px] text-gray-700">Controle Estoque</span>
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

                            {/* Linha 3 - Endereço */}
                            <div className="grid grid-cols-12 gap-2 items-center">
                                <Label className="col-span-1 justify-end">Endereço</Label>
                                <Txt
                                    className="col-span-11"
                                    value={cad.endereco}
                                    onChange={setF("endereco")}
                                    tabIndex={6}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>

                            {/* Linha 4 - Bairro, Fone (visual), Fone 2 (visual) */}
                            <div className="grid grid-cols-12 gap-2 items-center">
                                <Label className="col-span-1 justify-end">Bairro</Label>
                                <Txt
                                    className="col-span-5"
                                    value={cad.bairro}
                                    onChange={setF("bairro")}
                                    tabIndex={7}
                                    onKeyDown={handleKeyDown}
                                />


                            </div>

                            {/* Linha 5 - Cidade (CEP, Cidade, UF) - Cidade/UF bloqueados */}
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
                                        // Pequeno delay para garantir que o DOM atualizou antes do foco
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

                            {/* Linha 6 - Fone 1 (DDD + Telefone), Fone 2 (DDD + Telefone) */}
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

                            {/* Linha 7 - Email */}
                            <div className="grid grid-cols-12 gap-2 items-center">
                                <Label className="col-span-1 justify-end">E-mail</Label>
                                <Txt
                                    className="col-span-11"
                                    value={cad.email}
                                    onChange={setF("email")}
                                    tabIndex={13}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                        </div>
                    </fieldset>
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
                                        tabIndex={20}
                                        onKeyDown={handleKeyDown}
                                    />

                                    <Label className="col-span-2 justify-end">Razão Social</Label>
                                    <Txt
                                        className="col-span-5"
                                        value={cons.razao}
                                        onChange={setC("razao")}
                                        tabIndex={21}
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
                                        tabIndex={22}
                                        onKeyDown={handleKeyDown}
                                    />

                                    <Label className="col-span-1 justify-end col-start-7">Cidade</Label>
                                    <Txt
                                        className="col-span-3"
                                        value={cons.cidade}
                                        onChange={setC("cidade")}
                                        tabIndex={23}
                                        onKeyDown={handleKeyDown}
                                    />

                                    <div className="col-span-2 flex justify-end gap-2">
                                        <button
                                            onClick={acaoPesquisar}
                                            tabIndex={24}
                                            className="border border-gray-300 rounded px-3 py-[4px] bg-gray-50 hover:bg-gray-100 text-[12px] flex items-center gap-1"
                                            title="Pesquisar"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
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
                                <table className="min-w-[980px] w-full text-[12px] border-collapse">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border px-2 py-1">CNPJ</th>
                                            <th className="border px-2 py-1">Inscr. Estadual</th>
                                            <th className="border px-2 py-1">Controle</th>
                                            <th className="border px-2 py-1">Fantasia</th>
                                            <th className="border px-2 py-1">Razão Social</th>
                                            <th className="border px-2 py-1">Cidade</th>
                                            <th className="border px-2 py-1">UF</th>
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
                                                    {r.controleEstoque ? "Sim" : "Não"}
                                                </td>
                                                <td className="border px-2 py-1">{r.fantasia}</td>
                                                <td className="border px-2 py-1">{r.razao}</td>
                                                <td className="border px-2 py-1">{r.cidade}</td>
                                                <td className="border px-2 py-1 text-center">{r.uf}</td>
                                            </tr>
                                        ))}

                                        {resultado.length === 0 && (
                                            <tr>
                                                <td colSpan={7} className="border px-2 py-2 text-center text-gray-500">
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
          Requisito: último botão no TAB/ENTER = Incluir (e Enter abre confirmação).
          Visualmente fica: Fechar, Limpar, Incluir, Alterar, Excluir
          No DOM fica Incluir por último, mas usamos order-* pra manter a visual.
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

                {/* Incluir por último no DOM (TAB/ENTER), mas visualmente em 3º */}
                <button
                    onClick={acaoIncluir}
                    onKeyDown={onKeyDownIncluir}
                    tabIndex={14}
                    className={`order-3 flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                    title="Incluir"
                >
                    <PlusCircle size={20} />
                    <span>Incluir</span>
                </button>
            </div>

            {/* ========================= ModalMsg padrão ========================= */}
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
