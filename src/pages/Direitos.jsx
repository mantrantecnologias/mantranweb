// src/pages/Direitos.jsx
import { useState } from "react";
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

function Cmb({ className = "", tabIndex, children, ...props }) {
    return (
        <select
            {...props}
            tabIndex={tabIndex}
            className={[
                "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full bg-white",
                className,
            ].join(" ")}
        >
            {children}
        </select>
    );
}

/* ========================= Mocks ========================= */
const modulosMock = [
    "", "Financeiro", "Operacional", "Segurança", "Comercial",
    "Container", "Costado", "Baixa XML", "EDI API", "EDI Proceda",
    "EDI XML", "Fiscal", "Localize Cargas", "Monitoramento", "Oficina",
];

const direitosMockBase = [
    { codigo: "1256", nome: "Parâmetro Transferir Notas Entre Filiais", modulo: "Financeiro" },
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
];

export default function Direitos({ open }) {
    const location = useLocation();
    const isSeguranca = location.pathname.startsWith("/modulo-seguranca");
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    const [lista, setLista] = useState(direitosMockBase);
    const [dados, setDados] = useState({ codigo: "", nome: "", modulo: "" });
    const [editIndex, setEditIndex] = useState(null);
    const [modalMsg, setModalMsg] = useState(null);
    const [resultado, setResultado] = useState(direitosMockBase);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const currentTab = parseInt(e.target.getAttribute("tabindex"));
            const nextEl = document.querySelector(`[tabindex="${currentTab + 1}"]`);
            if (nextEl) nextEl.focus();
        }
    };

    const limpar = () => {
        setDados({ codigo: "", nome: "", modulo: "" });
        setEditIndex(null);
    };

    const pesquisar = () => {
        const filtroCodigo = (dados.codigo || "").trim().toLowerCase();
        const filtroNome = (dados.nome || "").trim().toLowerCase();
        const filtroModulo = dados.modulo;

        const filtrado = lista.filter((x) => {
            const okCodigo = filtroCodigo ? x.codigo.toLowerCase().includes(filtroCodigo) : true;
            const okNome = filtroNome ? x.nome.toLowerCase().includes(filtroNome) : true;
            const okModulo = filtroModulo ? x.modulo === filtroModulo : true;
            return okCodigo && okNome && okModulo;
        });

        setResultado(filtrado);
    };

    const incluir = () => {
        if (!dados.codigo || !dados.nome) {
            setModalMsg({ tipo: "info", texto: "Informe Código e Nome do Direito!" }); return;
        }
        setModalMsg({
            tipo: "confirm", texto: "Confirma a Inclusão?",
            onYes: () => {
                const novo = { ...dados };
                setLista((prev) => [...prev, novo]);
                setResultado((prev) => [...prev, novo]);
                limpar();
                setModalMsg({ tipo: "sucesso", texto: "Direito incluído com sucesso!" });
            },
        });
    };

    const alterar = () => {
        if (editIndex === null) { setModalMsg({ tipo: "info", texto: "Selecione um registro!" }); return; }
        const nova = [...lista]; nova[editIndex] = { ...dados }; setLista(nova);
        setResultado(nova);
        limpar();
        setModalMsg({ tipo: "sucesso", texto: "Direito alterado com sucesso!" });
    };

    const excluir = () => {
        if (editIndex === null) { setModalMsg({ tipo: "info", texto: "Selecione um registro!" }); return; }
        setModalMsg({
            tipo: "confirm", texto: "Deseja excluir este direito?",
            onYes: () => {
                const nova = lista.filter((_, i) => i !== editIndex);
                setLista(nova); setResultado(nova); limpar();
                setModalMsg({ tipo: "sucesso", texto: "Direito excluído com sucesso!" });
            },
        });
    };

    const selecionar = (item, index) => { setDados({ ...item }); setEditIndex(index); };

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
                CADASTRO DE DIREITOS
            </h1>

            <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md flex flex-col gap-3 overflow-y-auto">
                <div className="border border-gray-300 rounded p-3 bg-white flex flex-col gap-3">

                    {/* Parâmetros */}
                    <fieldset className="border border-gray-300 rounded p-3">
                        <legend className="px-2 text-red-700 font-semibold text-[13px]">Parâmetros</legend>

                        <div className="grid grid-cols-12 gap-2 mb-2">
                            <Label className="col-span-1 justify-end">Código Direito</Label>
                            <Txt
                                className="col-span-4"
                                value={dados.codigo}
                                onChange={(e) => setDados({ ...dados, codigo: e.target.value })}
                                tabIndex={1}
                                onKeyDown={handleKeyDown}
                            />

                            <div className="col-span-2 col-start-11 flex justify-end">
                                <button
                                    onClick={pesquisar}
                                    tabIndex={4}
                                    className="border border-gray-300 rounded px-3 py-[4px] bg-gray-50 hover:bg-gray-100 text-[12px] flex items-center gap-1"
                                    title="Pesquisar"
                                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); pesquisar(); } }}
                                >
                                    <Search size={14} className="text-red-700" />
                                    Pesquisar
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-12 gap-2 mb-2">
                            <Label className="col-span-1 justify-end">Nome Direito</Label>
                            <Txt
                                className="col-span-4"
                                value={dados.nome}
                                onChange={(e) => setDados({ ...dados, nome: e.target.value })}
                                tabIndex={2}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        <div className="grid grid-cols-12 gap-2 mb-2">
                            <Label className="col-span-1 justify-end">Nome Módulo</Label>
                            <Cmb
                                className="col-span-4"
                                value={dados.modulo}
                                onChange={(e) => setDados({ ...dados, modulo: e.target.value })}
                                tabIndex={3}
                                onKeyDown={handleKeyDown}
                            >
                                {modulosMock.map((m) => (
                                    <option key={m} value={m}>{m || "(Todos)"}</option>
                                ))}
                            </Cmb>
                        </div>
                    </fieldset>

                    {/* Grid */}
                    <fieldset className="border border-gray-300 rounded p-3">
                        <legend className="px-2 text-red-700 font-semibold text-[13px]">Lista de Direitos</legend>

                        <div className="border border-gray-300 rounded max-h-[380px] overflow-y-auto">
                            <table className="w-full text-[12px]">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border px-2 py-1">Código Direito</th>
                                        <th className="border px-2 py-1">Nome Direito</th>
                                        <th className="border px-2 py-1">Módulo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultado.map((item, idx) => (
                                        <tr
                                            key={idx}
                                            onClick={() => selecionar(item, idx)}
                                            className={`cursor-pointer hover:bg-red-100 ${editIndex === idx ? "bg-orange-100" : ""}`}
                                        >
                                            <td className="border px-2 py-1">{item.codigo}</td>
                                            <td className="border px-2 py-1">{item.nome}</td>
                                            <td className="border px-2 py-1">{item.modulo}</td>
                                        </tr>
                                    ))}
                                    {resultado.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="border px-2 py-2 text-center text-gray-500">
                                                Nenhum registro encontrado.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </fieldset>
                </div>
            </div>

            {/* Rodapé */}
            <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">
                <button onClick={() => navigate(-1)} className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`} title="Fechar">
                    <XCircle size={20} /><span>Fechar</span>
                </button>
                <button onClick={() => { limpar(); setResultado(lista); }} className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`} title="Limpar">
                    <RotateCcw size={20} /><span>Limpar</span>
                </button>
                <button onClick={incluir} className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`} title="Incluir">
                    <PlusCircle size={20} /><span>Incluir</span>
                </button>
                <button onClick={alterar} className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`} title="Alterar">
                    <Edit size={20} /><span>Alterar</span>
                </button>
                <button onClick={excluir} className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`} title="Excluir">
                    <Trash2 size={20} /><span>Excluir</span>
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
