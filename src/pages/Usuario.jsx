// src/pages/Usuario.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { XCircle, RotateCcw, PlusCircle, Edit, Trash2, Search, Eye, EyeOff, Shield } from "lucide-react";
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

function Cmb({ className = "", readOnly = false, tabIndex, children, ...props }) {
    return (
        <select
            {...props}
            disabled={readOnly}
            tabIndex={readOnly ? -1 : tabIndex}
            className={[
                "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full",
                readOnly ? "bg-gray-200 text-gray-600" : "bg-white",
                className,
            ].join(" ")}
        >
            {children}
        </select>
    );
}

/* ========================= Mocks ========================= */
const empresasMock = [
    { codigo: "001", nome: "MANTRAN TRANSPORTES LTDA" },
];

const filiaisMock = [
    { codEmpresa: "001", codFilial: "001", razao: "TESTE MANTRAN", cnpj: "04036814000141", cidade: "VALINHOS" },
    { codEmpresa: "001", codFilial: "002", razao: "TESTE MANTRAN", cnpj: "04036814000141", cidade: "SANTO ANDRE" },
    { codEmpresa: "001", codFilial: "003", razao: "TESTE MANTRAN", cnpj: "04036814000141", cidade: "SANTO ANDRE" },
    { codEmpresa: "001", codFilial: "004", razao: "TESTE MANTRAN", cnpj: "22818018000152", cidade: "EXTREMA" },
    { codEmpresa: "001", codFilial: "005", razao: "FILIAL WMS", cnpj: "35755293000100", cidade: "SANTO ANDRE" },
    { codEmpresa: "001", codFilial: "006", razao: "TESTE MANTRAN", cnpj: "03007331007226", cidade: "BARUERI" },
    { codEmpresa: "001", codFilial: "007", razao: "C R SILVA IDIOMAS", cnpj: "10545575000143", cidade: "SUMARE" },
    { codEmpresa: "001", codFilial: "008", razao: "TRANSPORTADORA RODO IMPORT LTDA", cnpj: "02200717000102", cidade: "CAMPINAS" },
];

const departamentosMock = [
    { value: "", label: "" },
    { value: "DIRETORIA", label: "DIRETORIA" },
    { value: "FINANCEIRO", label: "FINANCEIRO" },
    { value: "OPERACAO", label: "OPERAÇÃO" },
    { value: "TI", label: "TI" },
    { value: "RH", label: "RH" },
    { value: "COMERCIAL", label: "COMERCIAL" },
];

const cargosMock = [
    { value: "", label: "" },
    { value: "DIRETORIA", label: "DIRETORIA" },
    { value: "GERENTE", label: "GERENTE" },
    { value: "ANALISTA", label: "ANALISTA" },
    { value: "ASSISTENTE", label: "ASSISTENTE" },
    { value: "ESTAGIARIO", label: "ESTAGIÁRIO" },
];

const gruposMock = [
    { value: "", label: "" },
    { value: "OPERACIONAL", label: "OPERACIONAL" },
    { value: "ADMINISTRATIVO", label: "ADMINISTRATIVO" },
    { value: "GERENCIAL", label: "GERENCIAL" },
    { value: "DIRETORIA", label: "DIRETORIA" },
];

const usuariosMockBase = [
    {
        id: 1, usuario: "AMANDA", nomeCompleto: "AMANDA DIAS ANDRADE", senha: "123456",
        empresa: "001", filial: "001", departamento: "OPERACAO", cargo: "ANALISTA",
        email: "amanda@mantran.com.br", grupo: "OPERACIONAL",
        acessoTodasFiliais: false, marcarPerfil: false, mantranWeb: false,
        connexVia: false, connexRodoviario: false, connexLTL: false, connexOTA: false,
        desativarEm: "", dataCadastro: "01/06/2022 00:00:00", dataDesativacao: "",
        filiaisAcesso: ["001", "002"],
    },
    {
        id: 2, usuario: "BELMAR", nomeCompleto: "Belmar Homolog", senha: "123456",
        empresa: "001", filial: "001", departamento: "TI", cargo: "GERENTE",
        email: "belmar@mantran.com.br", grupo: "GERENCIAL",
        acessoTodasFiliais: true, marcarPerfil: false, mantranWeb: true,
        connexVia: false, connexRodoviario: false, connexLTL: false, connexOTA: false,
        desativarEm: "", dataCadastro: "", dataDesativacao: "",
        filiaisAcesso: [],
    },
    {
        id: 3, usuario: "CASSIA", nomeCompleto: "CASSIA MACHADO", senha: "123456",
        empresa: "001", filial: "001", departamento: "FINANCEIRO", cargo: "ANALISTA",
        email: "cassia@mantran.com.br", grupo: "ADMINISTRATIVO",
        acessoTodasFiliais: false, marcarPerfil: false, mantranWeb: false,
        connexVia: false, connexRodoviario: false, connexLTL: false, connexOTA: false,
        desativarEm: "", dataCadastro: "01/06/2022 00:00:00", dataDesativacao: "",
        filiaisAcesso: ["001"],
    },
    {
        id: 4, usuario: "CRISTIANO", nomeCompleto: "CRISTIANO ALVES", senha: "123456",
        empresa: "001", filial: "001", departamento: "OPERACAO", cargo: "ASSISTENTE",
        email: "cristiano@mantran.com.br", grupo: "OPERACIONAL",
        acessoTodasFiliais: false, marcarPerfil: false, mantranWeb: false,
        connexVia: false, connexRodoviario: false, connexLTL: false, connexOTA: false,
        desativarEm: "", dataCadastro: "25/01/2023 00:00:00", dataDesativacao: "",
        filiaisAcesso: ["001", "003"],
    },
    {
        id: 5, usuario: "DAIANA", nomeCompleto: "DAIANA", senha: "123456",
        empresa: "001", filial: "001", departamento: "RH", cargo: "ASSISTENTE",
        email: "daiana@mantran.com.br", grupo: "ADMINISTRATIVO",
        acessoTodasFiliais: false, marcarPerfil: false, mantranWeb: false,
        connexVia: false, connexRodoviario: false, connexLTL: false, connexOTA: false,
        desativarEm: "", dataCadastro: "28/06/2018 00:00:00", dataDesativacao: "",
        filiaisAcesso: ["001"],
    },
    {
        id: 6, usuario: "DAVI", nomeCompleto: "DAVI LIMA", senha: "123456",
        empresa: "001", filial: "001", departamento: "TI", cargo: "ANALISTA",
        email: "davi@mantran.com.br", grupo: "OPERACIONAL",
        acessoTodasFiliais: false, marcarPerfil: false, mantranWeb: false,
        connexVia: false, connexRodoviario: false, connexLTL: false, connexOTA: false,
        desativarEm: "", dataCadastro: "28/01/2021 00:00:00", dataDesativacao: "23/02/2022 00:00:00",
        filiaisAcesso: ["001"],
    },
];

/* ========================= Utils ========================= */
const fmtDateBR = (isoStr) => {
    if (!isoStr) return "";
    // já veio no formato dd/mm/aaaa...
    if (isoStr.includes("/")) return isoStr;
    const d = new Date(isoStr);
    if (isNaN(d)) return isoStr;
    return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR");
};

export default function Usuario({ open }) {
    const location = useLocation();
    const isSeguranca = location.pathname.startsWith("/modulo-seguranca");
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    /* ===== Abas ===== */
    const [activeTab, setActiveTab] = useState("cadastro");

    /* ===== Lista (mock) ===== */
    const [lista, setLista] = useState(usuariosMockBase);

    /* ===== Cadastro ===== */
    const [cad, setCad] = useState({
        id: null,
        usuario: "",
        nomeCompleto: "",
        senha: "",
        confirmaSenha: "",
        email: "",

        empresa: "001",
        filial: "001",
        departamento: "",
        cargo: "",
        desativarEm: "",
        grupo: "",

        acessoTodasFiliais: false,
        marcarPerfil: false,
        mantranWeb: false,

        connexVia: false,
        connexRodoviario: false,
        connexLTL: false,
        connexOTA: false,

        filiaisAcesso: [],
    });

    const [showSenha, setShowSenha] = useState(false);

    const setF = (campo) => (e) => {
        const v = e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
        setCad((p) => ({ ...p, [campo]: v }));
    };

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

    /* ===== Filiais de Acesso ===== */
    const toggleFilial = (codFilial) => {
        setCad((p) => {
            const atual = p.filiaisAcesso || [];
            const nova = atual.includes(codFilial)
                ? atual.filter((f) => f !== codFilial)
                : [...atual, codFilial];
            return { ...p, filiaisAcesso: nova };
        });
    };

    const selecionarTodas = () => {
        setCad((p) => ({ ...p, filiaisAcesso: filiaisMock.map((f) => f.codFilial) }));
    };

    const cancelarSelecao = () => {
        setCad((p) => ({ ...p, filiaisAcesso: [] }));
    };

    /* ===== Consulta ===== */
    const [cons, setCons] = useState({
        empresa: "001",
        filial: "001",
        usuario: "",
        departamento: "",
        cargo: "",
        grupo: "",
        consultarDesativados: false,
    });

    const setC = (campo) => (e) => {
        const v = e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
        setCons((p) => ({ ...p, [campo]: v }));
    };

    const [resultado, setResultado] = useState([]);
    const [selecionados, setSelecionados] = useState([]);

    /* ===== Modais / mensagens ===== */
    const [modalMsg, setModalMsg] = useState(null);

    /* ===== Limpar ===== */
    const limparCadastro = () => {
        setCad({
            id: null,
            usuario: "",
            nomeCompleto: "",
            senha: "",
            confirmaSenha: "",
            email: "",
            empresa: "001",
            filial: "001",
            departamento: "",
            cargo: "",
            desativarEm: "",
            grupo: "",
            acessoTodasFiliais: false,
            marcarPerfil: false,
            mantranWeb: false,
            connexVia: false,
            connexRodoviario: false,
            connexLTL: false,
            connexOTA: false,
            filiaisAcesso: [],
        });
    };

    const limparConsulta = () => {
        setCons({
            empresa: "001",
            filial: "001",
            usuario: "",
            departamento: "",
            cargo: "",
            grupo: "",
            consultarDesativados: false,
        });
        setResultado([]);
        setSelecionados([]);
    };

    /* ===== Ações ===== */
    const acaoPesquisar = () => {
        const filtroUsuario = (cons.usuario || "").trim().toLowerCase();
        const filtroDept = cons.departamento;
        const filtroCargo = cons.cargo;
        const filtroGrupo = cons.grupo;

        const filtrado = lista.filter((x) => {
            const okUsuario = filtroUsuario ? String(x.usuario || "").toLowerCase().includes(filtroUsuario) : true;
            const okDept = filtroDept ? x.departamento === filtroDept : true;
            const okCargo = filtroCargo ? x.cargo === filtroCargo : true;
            const okGrupo = filtroGrupo ? x.grupo === filtroGrupo : true;
            const okDesativado = cons.consultarDesativados ? true : !x.dataDesativacao;
            return okUsuario && okDept && okCargo && okGrupo && okDesativado;
        });

        setResultado(filtrado);
        setSelecionados([]);
    };

    const abrirCadastro = (row) => {
        setCad({ ...row, confirmaSenha: row.senha });
        setActiveTab("cadastro");
    };

    const acaoIncluir = () => {
        if (!cad.usuario.trim()) {
            setModalMsg({ tipo: "info", texto: "Informe o Usuário." });
            return;
        }
        if (cad.senha !== cad.confirmaSenha) {
            setModalMsg({ tipo: "info", texto: "Senhas não conferem." });
            return;
        }
        setModalMsg({
            tipo: "confirm",
            texto: "Confirma a Inclusão?",
            onYes: () => {
                const novo = { ...cad, id: Date.now(), dataCadastro: new Date().toLocaleString("pt-BR"), dataDesativacao: "" };
                setLista((prev) => [novo, ...prev]);
                setModalMsg({ tipo: "sucesso", texto: "Usuário incluído com sucesso!" });
            },
        });
    };

    const acaoAlterar = () => {
        if (!cad.id) {
            setModalMsg({ tipo: "info", texto: "Selecione um usuário para alterar." });
            return;
        }
        if (cad.senha !== cad.confirmaSenha) {
            setModalMsg({ tipo: "info", texto: "Senhas não conferem." });
            return;
        }
        setLista((prev) => prev.map((x) => (x.id === cad.id ? { ...cad } : x)));
        setModalMsg({ tipo: "sucesso", texto: "Usuário alterado com sucesso!" });
    };

    const acaoExcluir = () => {
        if (!cad.id) {
            setModalMsg({ tipo: "info", texto: "Selecione um usuário para excluir." });
            return;
        }
        setModalMsg({
            tipo: "confirm",
            texto: "Deseja excluir este usuário?",
            onYes: () => {
                setLista((prev) => prev.filter((x) => x.id !== cad.id));
                limparCadastro();
                setModalMsg({ tipo: "sucesso", texto: "Usuário excluído com sucesso!" });
            },
        });
    };

    const acaoExcluirLote = () => {
        if (selecionados.length === 0) {
            setModalMsg({ tipo: "info", texto: "Selecione pelo menos um usuário." });
            return;
        }
        setModalMsg({
            tipo: "confirm",
            texto: `Deseja excluir ${selecionados.length} usuário(s)?`,
            onYes: () => {
                setLista((prev) => prev.filter((x) => !selecionados.includes(x.id)));
                setResultado((prev) => prev.filter((x) => !selecionados.includes(x.id)));
                setSelecionados([]);
                setModalMsg({ tipo: "sucesso", texto: "Usuários excluídos com sucesso!" });
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
    const tituloTopo = useMemo(() => "CADASTRO DE USUÁRIO", []);

    /* ===== Empresa/Filial labels ===== */
    const empresaLabel = useMemo(() => {
        const emp = empresasMock.find((e) => e.codigo === cad.empresa);
        return emp ? `${emp.codigo} - ${emp.nome}` : "";
    }, [cad.empresa]);

    const filialLabel = useMemo(() => {
        const fil = filiaisMock.find((f) => f.codFilial === cad.filial && f.codEmpresa === cad.empresa);
        return fil ? `${fil.codEmpresa}${fil.codFilial} - ${fil.razao}` : "";
    }, [cad.empresa, cad.filial]);

    return (
        <div
            className={`
        transition-all duration-300 text-[13px] text-gray-700 bg-gray-50
        flex flex-col
        ${isSeguranca
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
                    { key: "cadastro", label: "Cadastro Usuário" },
                    { key: "consulta", label: "Consulta Usuário" },
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
                        <fieldset className="border border-gray-300 rounded p-3 bg-white">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">Cadastro</legend>

                            <div className="space-y-2">
                                {/* Linha 1 - Usuário | Empresa */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-1 justify-end">Usuário</Label>
                                    <Txt
                                        className="col-span-4"
                                        value={cad.usuario}
                                        onChange={setF("usuario")}
                                        tabIndex={1}
                                        onKeyDown={handleKeyDown}
                                    />

                                    <Label className="col-span-1 justify-end">Empresa</Label>
                                    <Cmb
                                        className="col-span-5"
                                        value={cad.empresa}
                                        onChange={setF("empresa")}
                                        readOnly
                                    >
                                        {empresasMock.map((e) => (
                                            <option key={e.codigo} value={e.codigo}>{e.codigo} - {e.nome}</option>
                                        ))}
                                    </Cmb>
                                </div>

                                {/* Linha 2 - Nome Completo | Filial */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-1 justify-end">Nome Completo</Label>
                                    <Txt
                                        className="col-span-4"
                                        value={cad.nomeCompleto}
                                        onChange={setF("nomeCompleto")}
                                        tabIndex={2}
                                        onKeyDown={handleKeyDown}
                                    />

                                    <Label className="col-span-1 justify-end">Filial</Label>
                                    <Cmb
                                        className="col-span-5"
                                        value={cad.filial}
                                        onChange={setF("filial")}
                                        readOnly
                                    >
                                        {filiaisMock.filter(f => f.codEmpresa === cad.empresa).map((f) => (
                                            <option key={f.codFilial} value={f.codFilial}>{f.codEmpresa}{f.codFilial} - {f.razao}</option>
                                        ))}
                                    </Cmb>
                                </div>

                                {/* Linha 3 - Senha | Departamento */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-1 justify-end">Senha</Label>
                                    <div className="col-span-4 relative">
                                        <Txt
                                            type={showSenha ? "text" : "password"}
                                            value={cad.senha}
                                            onChange={setF("senha")}
                                            tabIndex={3}
                                            onKeyDown={handleKeyDown}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowSenha(!showSenha)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            tabIndex={-1}
                                        >
                                            {showSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>

                                    <Label className="col-span-1 justify-end">Departamento</Label>
                                    <Cmb
                                        className="col-span-5"
                                        value={cad.departamento}
                                        onChange={setF("departamento")}
                                        tabIndex={7}
                                        onKeyDown={handleKeyDown}
                                    >
                                        {departamentosMock.map((d) => (
                                            <option key={d.value} value={d.value}>{d.label}</option>
                                        ))}
                                    </Cmb>
                                </div>

                                {/* Linha 4 - Confirma Senha | Cargo */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-1 justify-end">Confirma Senha</Label>
                                    <Txt
                                        className="col-span-4"
                                        type="password"
                                        value={cad.confirmaSenha}
                                        onChange={setF("confirmaSenha")}
                                        tabIndex={4}
                                        onKeyDown={handleKeyDown}
                                    />

                                    <Label className="col-span-1 justify-end">Cargo</Label>
                                    <Cmb
                                        className="col-span-5"
                                        value={cad.cargo}
                                        onChange={setF("cargo")}
                                        tabIndex={8}
                                        onKeyDown={handleKeyDown}
                                    >
                                        {cargosMock.map((c) => (
                                            <option key={c.value} value={c.value}>{c.label}</option>
                                        ))}
                                    </Cmb>
                                </div>

                                {/* Linha 5 - E-mail | Desativar em + Grupos */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-1 justify-end">E-mail</Label>
                                    <Txt
                                        className="col-span-4"
                                        value={cad.email}
                                        onChange={setF("email")}
                                        tabIndex={5}
                                        onKeyDown={handleKeyDown}
                                    />

                                    <Label className="col-span-1 justify-end">Desativar em</Label>
                                    <Txt
                                        className="col-span-2"
                                        type="date"
                                        value={cad.desativarEm}
                                        onChange={setF("desativarEm")}
                                        tabIndex={9}
                                        onKeyDown={handleKeyDown}
                                    />

                                    <Label className="col-span-1 justify-end">Grupos</Label>
                                    <Cmb
                                        className="col-span-2"
                                        value={cad.grupo}
                                        onChange={setF("grupo")}
                                        tabIndex={10}
                                        onKeyDown={handleKeyDown}
                                    >
                                        {gruposMock.map((g) => (
                                            <option key={g.value} value={g.value}>{g.label}</option>
                                        ))}
                                    </Cmb>
                                </div>

                                {/* Linha 6 - Checkboxes */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <div className="col-span-5 flex items-center gap-4 ml-1">
                                        <label className="flex items-center gap-1 text-[12px]">
                                            <Chk
                                                checked={cad.acessoTodasFiliais}
                                                onChange={setF("acessoTodasFiliais")}
                                                tabIndex={6}
                                            />
                                            Permitir Acesso a Todas as Filiais
                                        </label>

                                        <label className="flex items-center gap-1 text-[12px]">
                                            <Chk
                                                checked={cad.marcarPerfil}
                                                onChange={setF("marcarPerfil")}
                                            />
                                            Marcar como Perfil
                                        </label>

                                        <label className="flex items-center gap-1 text-[12px]">
                                            <Chk
                                                checked={cad.mantranWeb}
                                                onChange={setF("mantranWeb")}
                                            />
                                            Mantran Web
                                        </label>
                                    </div>

                                    <Label className="col-span-1 justify-end">Usuário Connex</Label>
                                    <div className="col-span-6 flex items-center gap-4">
                                        <label className="flex items-center gap-1 text-[12px]">
                                            <Chk checked={cad.connexVia} onChange={setF("connexVia")} />
                                            Via
                                        </label>
                                        <label className="flex items-center gap-1 text-[12px]">
                                            <Chk checked={cad.connexRodoviario} onChange={setF("connexRodoviario")} />
                                            Rodoviário
                                        </label>
                                        <label className="flex items-center gap-1 text-[12px]">
                                            <Chk checked={cad.connexLTL} onChange={setF("connexLTL")} />
                                            LTL
                                        </label>
                                        <label className="flex items-center gap-1 text-[12px]">
                                            <Chk checked={cad.connexOTA} onChange={setF("connexOTA")} />
                                            OTA
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </fieldset>

                        {/* FILIAIS DE ACESSO */}
                        <fieldset className="border border-gray-300 rounded p-3 bg-white">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">Filiais de Acesso</legend>

                            <div className="w-full overflow-x-auto">
                                <table className="min-w-[780px] w-full text-[12px] border-collapse">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border px-2 py-1 w-[30px]">Chk</th>
                                            <th className="border px-2 py-1">Código Empresa</th>
                                            <th className="border px-2 py-1">Código Filial</th>
                                            <th className="border px-2 py-1">Razão Social</th>
                                            <th className="border px-2 py-1">CNPJ</th>
                                            <th className="border px-2 py-1">Cidade</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filiaisMock.filter(f => f.codEmpresa === cad.empresa).map((f, idx) => (
                                            <tr
                                                key={f.codFilial}
                                                className={`hover:bg-green-100 cursor-pointer ${idx === 0 ? "bg-orange-100" : ""}`}
                                            >
                                                <td className="border px-2 py-1 text-center">
                                                    <Chk
                                                        checked={(cad.filiaisAcesso || []).includes(f.codFilial)}
                                                        onChange={() => toggleFilial(f.codFilial)}
                                                    />
                                                </td>
                                                <td className="border px-2 py-1 text-center">{f.codEmpresa}</td>
                                                <td className="border px-2 py-1 text-center">{f.codFilial}</td>
                                                <td className="border px-2 py-1">{f.razao}</td>
                                                <td className="border px-2 py-1 text-center">{f.cnpj}</td>
                                                <td className="border px-2 py-1">{f.cidade}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={selecionarTodas}
                                    className="border border-gray-300 rounded px-3 py-[4px] bg-gray-50 hover:bg-gray-100 text-[12px] flex items-center gap-1"
                                >
                                    ✅ Selecionar Todos
                                </button>
                                <button
                                    onClick={cancelarSelecao}
                                    className="border border-gray-300 rounded px-3 py-[4px] bg-gray-50 hover:bg-gray-100 text-[12px] flex items-center gap-1"
                                >
                                    ❌ Cancelar Seleção
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
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                Parâmetros de Pesquisa
                            </legend>

                            <div className="space-y-2">
                                {/* Linha 1 - Empresa | Departamento */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-1 justify-end">Empresa</Label>
                                    <Cmb
                                        className="col-span-5"
                                        value={cons.empresa}
                                        onChange={setC("empresa")}
                                        tabIndex={20}
                                        onKeyDown={handleKeyDown}
                                    >
                                        {empresasMock.map((e) => (
                                            <option key={e.codigo} value={e.codigo}>{e.codigo} - {e.nome}</option>
                                        ))}
                                    </Cmb>

                                    <Label className="col-span-1 justify-end">Departamento</Label>
                                    <Cmb
                                        className="col-span-5"
                                        value={cons.departamento}
                                        onChange={setC("departamento")}
                                        tabIndex={23}
                                        onKeyDown={handleKeyDown}
                                    >
                                        {departamentosMock.map((d) => (
                                            <option key={d.value} value={d.value}>{d.label}</option>
                                        ))}
                                    </Cmb>
                                </div>

                                {/* Linha 2 - Filial | Cargo */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-1 justify-end">Filial</Label>
                                    <Cmb
                                        className="col-span-5"
                                        value={cons.filial}
                                        onChange={setC("filial")}
                                        tabIndex={21}
                                        onKeyDown={handleKeyDown}
                                    >
                                        <option value="">Todas</option>
                                        {filiaisMock.filter(f => f.codEmpresa === cons.empresa).map((f) => (
                                            <option key={f.codFilial} value={f.codFilial}>{f.codEmpresa}{f.codFilial} - {f.razao}</option>
                                        ))}
                                    </Cmb>

                                    <Label className="col-span-1 justify-end">Cargo</Label>
                                    <Cmb
                                        className="col-span-5"
                                        value={cons.cargo}
                                        onChange={setC("cargo")}
                                        tabIndex={24}
                                        onKeyDown={handleKeyDown}
                                    >
                                        {cargosMock.map((c) => (
                                            <option key={c.value} value={c.value}>{c.label}</option>
                                        ))}
                                    </Cmb>
                                </div>

                                {/* Linha 3 - Usuário | Grupo + Ações */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-1 justify-end">Usuário</Label>
                                    <Txt
                                        className="col-span-5"
                                        value={cons.usuario}
                                        onChange={setC("usuario")}
                                        tabIndex={22}
                                        onKeyDown={handleKeyDown}
                                    />

                                    <Label className="col-span-1 justify-end">Grupo</Label>
                                    <Cmb
                                        className="col-span-2"
                                        value={cons.grupo}
                                        onChange={setC("grupo")}
                                        tabIndex={25}
                                        onKeyDown={handleKeyDown}
                                    >
                                        {gruposMock.map((g) => (
                                            <option key={g.value} value={g.value}>{g.label}</option>
                                        ))}
                                    </Cmb>

                                    <div className="col-span-3 flex justify-end items-center gap-2">
                                        <label className="flex items-center gap-1 text-[12px]">
                                            <Chk
                                                checked={cons.consultarDesativados}
                                                onChange={setC("consultarDesativados")}
                                            />
                                            Consultar Desativados
                                        </label>
                                    </div>
                                </div>

                                {/* Linha 4 - Botões */}
                                <div className="flex justify-end gap-2 mt-1">
                                    <button
                                        onClick={limparConsulta}
                                        className="border border-gray-300 rounded px-3 py-[4px] bg-gray-50 hover:bg-gray-100 text-[12px] flex items-center gap-1"
                                        title="Limpar"
                                    >
                                        <RotateCcw size={14} className="text-red-700" />
                                        Limpar
                                    </button>

                                    <button
                                        onClick={acaoExcluirLote}
                                        className="border border-gray-300 rounded px-3 py-[4px] bg-gray-50 hover:bg-gray-100 text-[12px] flex items-center gap-1"
                                        title="Excluir Lote"
                                    >
                                        <Trash2 size={14} className="text-red-700" />
                                        Excluir Lote
                                    </button>

                                    <button
                                        onClick={acaoPesquisar}
                                        tabIndex={26}
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
                                </div>
                            </div>
                        </fieldset>

                        {/* Card 2 - Grid */}
                        <fieldset className="border border-gray-300 rounded p-2 bg-white">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                Resultado (clique para abrir no Cadastro)
                            </legend>

                            <div className="w-full overflow-x-auto">
                                <table className="min-w-[780px] w-full text-[12px] border-collapse">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border px-2 py-1 w-[30px]">Chk</th>
                                            <th className="border px-2 py-1">Empresa</th>
                                            <th className="border px-2 py-1">Usuário</th>
                                            <th className="border px-2 py-1">Nome Completo</th>
                                            <th className="border px-2 py-1">Data Cadastro</th>
                                            <th className="border px-2 py-1">Data Desativação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(resultado.length ? resultado : []).map((r, idx) => (
                                            <tr
                                                key={r.id}
                                                className={`hover:bg-green-100 cursor-pointer ${idx === 0 ? "bg-orange-100" : ""}`}
                                                onClick={() => abrirCadastro(r)}
                                                title="Clique para abrir no Cadastro"
                                            >
                                                <td className="border px-2 py-1 text-center" onClick={(e) => e.stopPropagation()}>
                                                    <Chk
                                                        checked={selecionados.includes(r.id)}
                                                        onChange={() => {
                                                            setSelecionados((prev) =>
                                                                prev.includes(r.id)
                                                                    ? prev.filter((x) => x !== r.id)
                                                                    : [...prev, r.id]
                                                            );
                                                        }}
                                                    />
                                                </td>
                                                <td className="border px-2 py-1 text-center">{r.empresa}</td>
                                                <td className="border px-2 py-1">{r.usuario}</td>
                                                <td className="border px-2 py-1">{r.nomeCompleto}</td>
                                                <td className="border px-2 py-1 text-center">{r.dataCadastro}</td>
                                                <td className="border px-2 py-1 text-center">{r.dataDesativacao}</td>
                                            </tr>
                                        ))}

                                        {resultado.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="border px-2 py-2 text-center text-gray-500">
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

            {/* ========================= Rodapé padrão ========================= */}
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

                <button
                    onClick={() => {
                        if (!cad.usuario.trim()) {
                            setModalMsg({ tipo: "info", texto: "Selecione um usuário para abrir Direitos." });
                            return;
                        }
                        navigate("/modulo-seguranca/direitos-usuarios", {
                            state: { usuarioSelecionado: cad.usuario },
                        });
                    }}
                    className={`order-6 flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                    title="Direitos"
                >
                    <Shield size={20} />
                    <span>Direitos</span>
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
