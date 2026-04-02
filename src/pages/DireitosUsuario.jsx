// src/pages/DireitosUsuario.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    XCircle,
    RotateCcw,
    PlusCircle,
    Edit,
    Trash2,
    Search,
} from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

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
const modulosMock = [
    "", "Operacional", "Financeiro", "Segurança", "Comercial",
    "Container", "Costado", "Baixa XML", "EDI API", "EDI Proceda",
    "EDI XML", "Fiscal", "Localize Cargas", "Monitoramento", "Oficina",
];

const usuariosMock = [
    "", "ADMIN", "ALINE", "AMANDA", "BELMAR", "CARLOSCADU",
    "CASSIA", "CRISTIANO", "DAIANA", "DANIEL", "DAVI",
    "FERNANDA", "FILIPE", "GABRIEL", "GUILHERME",
];

const perfisMock = ["", "ADMINISTRADOR", "GERENTE", "OPERACIONAL", "CONSULTA"];

const direitosMockBase = [
    { codigo: "7264", nome: "Acesso - Despesas Viagem Frotista", modulo: "Operacional" },
    { codigo: "2222", nome: "Acesso a Cadastro Cliente", modulo: "Operacional" },
    { codigo: "0001", nome: "Acesso ao Modulo Segurança", modulo: "Segurança" },
    { codigo: "8003", nome: "Acesso Financeiro", modulo: "Financeiro" },
    { codigo: "8019", nome: "Acesso Módulo Baixa XML", modulo: "Baixa XML" },
    { codigo: "8013", nome: "Acesso Módulo Comercial", modulo: "Comercial" },
    { codigo: "8023", nome: "Acesso Módulo Container", modulo: "Container" },
    { codigo: "8022", nome: "Acesso Módulo Costado", modulo: "Costado" },
    { codigo: "8008", nome: "Acesso Módulo EDI API", modulo: "EDI API" },
    { codigo: "8006", nome: "Acesso Módulo EDI Proceda", modulo: "EDI Proceda" },
    { codigo: "8007", nome: "Acesso Módulo EDI XML", modulo: "EDI XML" },
    { codigo: "8010", nome: "Acesso Módulo Fiscal", modulo: "Fiscal" },
    { codigo: "8017", nome: "Acesso Módulo Localize Cargas", modulo: "Localize Cargas" },
    { codigo: "8012", nome: "Acesso Módulo Monitoramento Serviço", modulo: "Monitoramento" },
    { codigo: "8009", nome: "Acesso Módulo Oficina", modulo: "Oficina" },
    { codigo: "8005", nome: "Acesso Módulo Operação", modulo: "Operacional" },
];

export default function DireitosUsuario({ open }) {
    const location = useLocation();
    const isSeguranca = location.pathname.startsWith("/modulo-seguranca");
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    /* ===== Parâmetros ===== */
    const usuarioFromState = location.state?.usuarioSelecionado || "";

    const [dados, setDados] = useState({
        nomeModulo: "",
        nomeDireito: "",
        codigoDireito: "",
        usuario: usuarioFromState,
        perfil: "",
        direitosPermitidos: false,
    });

    /* Atualiza se navegar com state diferente */
    useEffect(() => {
        if (usuarioFromState) {
            setDados((prev) => ({ ...prev, usuario: usuarioFromState }));
        }
    }, [usuarioFromState]);

    /* ===== Grid ===== */
    const [resultado, setResultado] = useState([]);
    const [selecionados, setSelecionados] = useState([]);
    const [pesquisou, setPesquisou] = useState(false);

    const [modalMsg, setModalMsg] = useState(null);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const currentTab = parseInt(e.target.getAttribute("tabindex"));
            const nextEl = document.querySelector(`[tabindex="${currentTab + 1}"]`);
            if (nextEl) nextEl.focus();
        }
    };

    /* ===== Ações ===== */
    const limpar = () => {
        setDados({
            nomeModulo: "", nomeDireito: "", codigoDireito: "",
            usuario: "", perfil: "", direitosPermitidos: false,
        });
        setResultado([]);
        setSelecionados([]);
        setPesquisou(false);
    };

    const pesquisar = () => {
        if (!dados.usuario) {
            setModalMsg({ tipo: "info", texto: "Selecione um Usuário para pesquisar!" });
            return;
        }

        const fModulo = dados.nomeModulo;
        const fNome = (dados.nomeDireito || "").trim().toLowerCase();
        const fCodigo = (dados.codigoDireito || "").trim().toLowerCase();

        const filtrado = direitosMockBase.filter((x) => {
            const okModulo = fModulo ? x.modulo === fModulo : true;
            const okNome = fNome ? x.nome.toLowerCase().includes(fNome) : true;
            const okCodigo = fCodigo ? x.codigo.toLowerCase().includes(fCodigo) : true;
            return okModulo && okNome && okCodigo;
        });

        setResultado(filtrado);
        setSelecionados([]);
        setPesquisou(true);
    };

    const selecionarTodos = () => {
        setSelecionados(resultado.map((_, i) => i));
    };

    const cancelarSelecao = () => {
        setSelecionados([]);
    };

    const toggleSelecionado = (idx) => {
        setSelecionados((prev) =>
            prev.includes(idx)
                ? prev.filter((i) => i !== idx)
                : [...prev, idx]
        );
    };

    const salvar = () => {
        if (!dados.usuario) {
            setModalMsg({ tipo: "info", texto: "Selecione um Usuário!" }); return;
        }
        setModalMsg({
            tipo: "confirm", texto: `Salvar direitos do usuário ${dados.usuario}?`,
            onYes: () => {
                setModalMsg({ tipo: "sucesso", texto: `Direitos do usuário ${dados.usuario} salvos com sucesso!` });
            },
        });
    };

    return (
        <div
            className={`transition-all duration-300 text-[13px] text-gray-700 
      bg-gray-50 flex flex-col
      ${isSeguranca
                    ? "mt-[-16px] ml-[-16px] h-[calc(100vh-48px)] w-[calc(100%+32px)]"
                    : `mt-[44px] h-[calc(100vh-56px)] ${open ? "ml-[192px]" : "ml-[56px]"}`
                }`}
        >
            <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                DIREITOS DE USUÁRIO
            </h1>

            <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md flex flex-col gap-3 overflow-y-auto">
                <div className="border border-gray-300 rounded p-3 bg-white flex flex-col gap-3">

                    <span className="text-[12px] text-gray-600 font-medium">Direitos Usuário</span>

                    {/* Parâmetros */}
                    <fieldset className="border border-gray-300 rounded p-3">
                        <legend className="px-2 text-red-700 font-semibold text-[13px]">Parâmetros</legend>

                        {/* Linha 1 - Nome Módulo | Usuário */}
                        <div className="grid grid-cols-12 gap-2 mb-2 items-center">
                            <Label className="col-span-1 justify-end">Nome Módulo</Label>
                            <Cmb
                                className="col-span-4"
                                value={dados.nomeModulo}
                                onChange={(e) => setDados({ ...dados, nomeModulo: e.target.value })}
                                tabIndex={1}
                                onKeyDown={handleKeyDown}
                            >
                                {modulosMock.map((m) => (
                                    <option key={m} value={m}>{m || "(Todos)"}</option>
                                ))}
                            </Cmb>
                            <div className="col-span-1" />
                            <Label className="col-span-1 justify-end">Usuário</Label>
                            <Cmb
                                className="col-span-4"
                                value={dados.usuario}
                                onChange={(e) => setDados({ ...dados, usuario: e.target.value })}
                                tabIndex={4}
                                onKeyDown={handleKeyDown}
                            >
                                {usuariosMock.map((u) => (
                                    <option key={u} value={u}>{u || "(Selecione)"}</option>
                                ))}
                            </Cmb>
                        </div>

                        {/* Linha 2 - Nome Direito | Perfil */}
                        <div className="grid grid-cols-12 gap-2 mb-2 items-center">
                            <Label className="col-span-1 justify-end">Nome Direito</Label>
                            <Txt
                                className="col-span-4"
                                value={dados.nomeDireito}
                                onChange={(e) => setDados({ ...dados, nomeDireito: e.target.value })}
                                tabIndex={2}
                                onKeyDown={handleKeyDown}
                            />
                            <div className="col-span-1" />
                            <Label className="col-span-1 justify-end">Perfil</Label>
                            <Cmb
                                className="col-span-4"
                                value={dados.perfil}
                                onChange={(e) => setDados({ ...dados, perfil: e.target.value })}
                                tabIndex={5}
                                onKeyDown={handleKeyDown}
                            >
                                {perfisMock.map((p) => (
                                    <option key={p} value={p}>{p || "(Nenhum)"}</option>
                                ))}
                            </Cmb>
                        </div>

                        {/* Linha 3 - Código Direito | Direitos Permitidos + Pesquisar */}
                        <div className="grid grid-cols-12 gap-2 mb-2 items-center">
                            <Label className="col-span-1 justify-end">Código Direito</Label>
                            <Txt
                                className="col-span-4"
                                value={dados.codigoDireito}
                                onChange={(e) => setDados({ ...dados, codigoDireito: e.target.value })}
                                tabIndex={3}
                                onKeyDown={handleKeyDown}
                            />
                            <div className="col-span-1" />
                            <div className="col-span-3">
                                <label className="flex items-center gap-1 text-[12px]">
                                    <Chk
                                        checked={dados.direitosPermitidos}
                                        onChange={(e) => setDados({ ...dados, direitosPermitidos: e.target.checked })}
                                        tabIndex={6}
                                    />
                                    Direitos Permitidos
                                </label>
                            </div>
                            <div className="col-span-2 flex justify-end">
                                <button
                                    onClick={pesquisar}
                                    tabIndex={7}
                                    className="border border-gray-300 rounded px-3 py-[4px] bg-gray-50 hover:bg-gray-100 text-[12px] flex items-center gap-1"
                                    title="Pesquisar"
                                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); pesquisar(); } }}
                                >
                                    <Search size={14} className="text-red-700" />
                                    Pesquisar
                                </button>
                            </div>
                        </div>
                    </fieldset>

                    {/* Grid */}
                    <fieldset className="border border-gray-300 rounded p-3">
                        <legend className="px-2 text-red-700 font-semibold text-[13px]">Lista de Direitos</legend>

                        <div className="border border-gray-300 rounded max-h-[320px] overflow-y-auto">
                            <table className="w-full text-[12px]">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border px-2 py-1 w-[30px]">Chk</th>
                                        <th className="border px-2 py-1">Código Direito</th>
                                        <th className="border px-2 py-1">Nome Direito</th>
                                        <th className="border px-2 py-1">Módulo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pesquisou && resultado.map((item, idx) => (
                                        <tr
                                            key={idx}
                                            className={`cursor-pointer hover:bg-red-100 ${selecionados.includes(idx) ? "bg-orange-100" : ""}`}
                                        >
                                            <td className="border px-2 py-1 text-center">
                                                <Chk
                                                    checked={selecionados.includes(idx)}
                                                    onChange={() => toggleSelecionado(idx)}
                                                />
                                            </td>
                                            <td className="border px-2 py-1">{item.codigo}</td>
                                            <td className="border px-2 py-1">{item.nome}</td>
                                            <td className="border px-2 py-1">{item.modulo}</td>
                                        </tr>
                                    ))}

                                    {!pesquisou && (
                                        <tr>
                                            <td colSpan={4} className="border px-2 py-2 text-center text-gray-500">
                                                Selecione um Usuário e clique em Pesquisar.
                                            </td>
                                        </tr>
                                    )}

                                    {pesquisou && resultado.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="border px-2 py-2 text-center text-gray-500">
                                                Nenhum registro encontrado.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Controles do grid */}
                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                                <span className="text-[12px] text-gray-600">Controle Grid</span>
                                <button
                                    onClick={selecionarTodos}
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

                            <div className="flex items-center gap-6">
                                <span className="text-[12px] text-gray-600">
                                    Total Registros: <strong>{resultado.length}</strong>
                                </span>
                                <span className="text-[12px] text-red-700">
                                    Registros Selecionados: <strong>{selecionados.length}</strong>
                                </span>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>

            {/* Rodapé */}
            <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">
                <button onClick={() => navigate(-1)} className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`} title="Fechar">
                    <XCircle size={20} /><span>Fechar</span>
                </button>
                <button onClick={limpar} className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`} title="Limpar">
                    <RotateCcw size={20} /><span>Limpar</span>
                </button>
                <button onClick={salvar} className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`} title="Salvar">
                    <PlusCircle size={20} /><span>Salvar</span>
                </button>
            </div>

            {/* ModalMsg padrão */}
            {modalMsg && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 shadow-lg rounded border text-center w-[300px]">
                        <p className={`font-bold mb-4 ${modalMsg.tipo === "sucesso" ? "text-green-700" : modalMsg.tipo === "confirm" ? "text-gray-800" : "text-red-700"}`}>
                            {modalMsg.texto}
                        </p>
                        {modalMsg.tipo === "confirm" ? (
                            <div className="flex justify-center gap-2">
                                <button className="px-3 py-1 bg-gray-300 rounded" onClick={() => setModalMsg(null)}>Não</button>
                                <button className="px-3 py-1 bg-red-700 text-white rounded" onClick={() => { const fn = modalMsg.onYes; setModalMsg(null); fn?.(); }}>Sim</button>
                            </div>
                        ) : (
                            <button className="px-3 py-1 bg-red-700 text-white rounded" onClick={() => setModalMsg(null)}>OK</button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
