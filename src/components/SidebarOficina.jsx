import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import UsuarioAlterarSenha from "../pages/UsuarioAlterarSenha";
import ModalTrocarFilial from "./ModalTrocarFilial";
import { useIconColor } from "../context/IconColorContext";

import {
    FileText,
    Wrench,
    Disc,
    Fuel,
    BarChart3,
    ChevronRight,
    UserCircle2,
    MessageSquare,
    CircleDot,
    Circle,
    X,
    LogOut,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function SidebarOficina({ open }) {
    const { iconColor } = useIconColor();

    const [activeMenu, setActiveMenu] = useState(null);
    const [activeSubMenu, setActiveSubMenu] = useState(null);

    const [chatOpen, setChatOpen] = useState(false);
    const [chatAtivo, setChatAtivo] = useState(null);
    const [novaMensagem, setNovaMensagem] = useState("");
    const [mensagens, setMensagens] = useState([]);
    const [showAlterarSenha, setShowAlterarSenha] = useState(false);
    const [showTrocarFilial, setShowTrocarFilial] = useState(false);

    const [usuarios, setUsuarios] = useState([
        { nome: "Mecânico 1", online: true, ultimaMsg: "Peça chegou?", naoLidas: 0 },
        { nome: "Gerente", online: false, ultimaMsg: "Aprovar OS 123", naoLidas: 0 },
        { nome: "Almoxarifado", online: true, ultimaMsg: "Estoque atualizado", naoLidas: 0 },
    ]);

    const [contatosComMensagensNaoLidas, setContatosComMensagensNaoLidas] = useState(0);

    const [socket, setSocket] = useState(null);
    const usuarioLogado = (localStorage.getItem("usuarioNome") || "Oficina").split(".")[0].toUpperCase();

    useEffect(() => {
        const socketURL =
            window.location.hostname === "localhost"
                ? "http://localhost:3001"
                : "https://mantranweb-backend.onrender.com";

        const s = io(socketURL, {
            transports: ["websocket"],
            reconnection: true,
        });

        setSocket(s);

        s.on("connect", () => {
            s.emit("userOnline", usuarioLogado);
        });

        s.on("usersOnline", (lista) => {
            setUsuarios((prev) =>
                prev.map((u) => ({ ...u, online: lista.includes(u.nome) }))
            );
        });

        s.on("novaMensagem", (msg) => {
            if (msg.de === usuarioLogado || msg.para === usuarioLogado) {
                setMensagens((prev) => {
                    const jaExiste = prev.some(
                        (m) =>
                            m.de === msg.de &&
                            m.para === msg.para &&
                            m.texto === msg.texto &&
                            m.hora === msg.hora
                    );
                    if (jaExiste) return prev;
                    return [...prev, msg];
                });

                setUsuarios((prev) => {
                    const atualizados = prev.map((u) => {
                        if (u.nome === (msg.de === usuarioLogado ? msg.para : msg.de)) {
                            return {
                                ...u,
                                ultimaMsg: msg.texto,
                                naoLidas:
                                    msg.para === usuarioLogado
                                        ? (u.naoLidas || 0) + 1
                                        : u.naoLidas,
                            };
                        }
                        return u;
                    });

                    const total = atualizados.filter((u) => u.naoLidas > 0).length;
                    setContatosComMensagensNaoLidas(total);

                    return atualizados;
                });
            }
        });
        return () => {
            s.off("usersOnline");
            s.off("novaMensagem");
            s.off("connect");
            s.off("disconnect");
            s.disconnect();
        };
    }, []);

    const toggleMenu = (menu) => {
        setActiveMenu(activeMenu === menu ? null : menu);
        setActiveSubMenu(null);
    };

    return (
        <>
            {/* SIDEBAR */}
            <aside
                className={`bg-white border-r border-gray-200 shadow-lg fixed left-0 top-[48px] 
                h-[calc(100vh-48px)] z-50 transition-all duration-300 
                ${open ? "w-52 translate-x-0" : "w-14 -translate-x-full sm:translate-x-0"}`}
            >
                {/* NAV */}
                <nav className="p-2 text-sm text-gray-700 relative">

                    {/* CADASTROS */}
                    <div
                        className="group relative"
                        onMouseEnter={() => setActiveMenu("cadastros")}
                        onMouseLeave={() => setActiveMenu(null)}
                    >
                        <button
                            onClick={() => toggleMenu("cadastros")}
                            className="flex items-center w-full px-2 py-2 hover:bg-gray-100 
                            rounded-md transition"
                        >
                            <FileText className={`w-5 h-5 ${iconColor}`} />
                            {open && (
                                <>
                                    <span className="ml-3 flex-1 text-left">Cadastros</span>
                                    <ChevronRight
                                        size={14}
                                        className={`text-gray-500 transition-transform 
                                        ${activeMenu === "cadastros" ? "rotate-90" : ""}`}
                                    />
                                </>
                            )}
                        </button>

                        {activeMenu === "cadastros" && (
                            <div className="absolute top-0 left-full bg-white border border-gray-200 
                            shadow-xl rounded-md w-52 p-1 z-[999]">
                                {[
                                    { label: "Veículos", rota: "/modulo-oficina/veiculo" },
                                    { label: "Motorista", rota: "/modulo-oficina/motorista" },
                                    { label: "Estoque", rota: "#" },
                                    { label: "Fornecedor", rota: "/modulo-oficina/fornecedor" },
                                    { label: "Fornecedor Produto", rota: "#" },
                                    { label: "Oficinas", rota: "/modulo-oficina/oficinas" },
                                ].map((item) => (
                                    <Link
                                        key={item.label}
                                        to={item.rota}
                                        className="block px-3 py-[2px] hover:bg-gray-100 rounded cursor-pointer text-gray-700"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* OFICINA */}
                    <div
                        className="group relative mt-1"
                        onMouseEnter={() => setActiveMenu("oficina")}
                        onMouseLeave={() => setActiveMenu(null)}
                    >
                        <button
                            onClick={() => toggleMenu("oficina")}
                            className="flex items-center w-full px-2 py-2 hover:bg-gray-100 
                            rounded-md transition"
                        >
                            <Wrench className={`w-5 h-5 ${iconColor}`} />

                            {open && (
                                <>
                                    <span className="ml-3 flex-1 text-left">Oficina</span>
                                    <ChevronRight
                                        size={14}
                                        className={`text-gray-500 transition-transform 
                                        ${activeMenu === "oficina" ? "rotate-90" : ""}`}
                                    />
                                </>
                            )}
                        </button>

                        {activeMenu === "oficina" && (
                            <div className="absolute top-0 left-full bg-white border border-gray-200 
                            shadow-xl rounded-md w-52 p-1 z-[999]">
                                {[
                                    { label: "Serviços", rota: "#" },
                                    { label: "Plano de Manutenção", rota: "#" },
                                    { label: "Ordem de Serviço", rota: "#" },
                                    { label: "Checklist", rota: "#" },
                                    { label: "Borderô de Despesa", rota: "#" },
                                    { label: "Requisição de Compra", rota: "#" },
                                ].map((item) => (
                                    <Link
                                        key={item.label}
                                        to={item.rota}
                                        className="block px-3 py-[2px] hover:bg-gray-100 rounded cursor-pointer text-gray-700"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* PNEUS */}
                    <div
                        className="group relative mt-1"
                        onMouseEnter={() => setActiveMenu("pneus")}
                        onMouseLeave={() => setActiveMenu(null)}
                    >
                        <button
                            onClick={() => toggleMenu("pneus")}
                            className="flex items-center w-full px-2 py-2 hover:bg-gray-100 
                            rounded-md transition"
                        >
                            <Disc className={`w-5 h-5 ${iconColor}`} />

                            {open && (
                                <>
                                    <span className="ml-3 flex-1 text-left">Pneus</span>
                                    <ChevronRight
                                        size={14}
                                        className={`text-gray-500 transition-transform 
                                        ${activeMenu === "pneus" ? "rotate-90" : ""}`}
                                    />
                                </>
                            )}
                        </button>

                        {activeMenu === "pneus" && (
                            <div className="absolute top-0 left-full bg-white border border-gray-200 
                            shadow-xl rounded-md w-64 p-1 z-[999]">
                                {[
                                    { label: "Marcas", rota: "#" },
                                    { label: "Modelos", rota: "#" },
                                    { label: "Dimensões", rota: "#" },
                                    { label: "Tipos", rota: "#" },
                                    { label: "Motivo de Sucateamento", rota: "#" },
                                    { label: "Bandas de Rodagem", rota: "#" },
                                    { label: "Pneus", rota: "#" },
                                    { label: "Recape de Pneus", rota: "#" },
                                    { label: "Medição de Sulco", rota: "#" },
                                    { label: "Consertos / Resulcagem", rota: "#" },
                                ].map((item) => (
                                    <Link
                                        key={item.label}
                                        to={item.rota}
                                        className="block px-3 py-[2px] hover:bg-gray-100 rounded cursor-pointer text-gray-700"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ABASTECIMENTO */}
                    <div
                        className="group relative mt-1"
                        onMouseEnter={() => setActiveMenu("abastecimento")}
                        onMouseLeave={() => setActiveMenu(null)}
                    >
                        <button
                            onClick={() => toggleMenu("abastecimento")}
                            className="flex items-center w-full px-2 py-2 hover:bg-gray-100 
                            rounded-md transition"
                        >
                            <Fuel className={`w-5 h-5 ${iconColor}`} />

                            {open && (
                                <>
                                    <span className="ml-3 flex-1 text-left">Abastecimento</span>
                                    <ChevronRight
                                        size={14}
                                        className={`text-gray-500 transition-transform 
                                        ${activeMenu === "abastecimento" ? "rotate-90" : ""}`}
                                    />
                                </>
                            )}
                        </button>

                        {activeMenu === "abastecimento" && (
                            <div className="absolute top-0 left-full bg-white border border-gray-200 
                            shadow-xl rounded-md w-60 p-1 z-[999]">
                                {[
                                    { label: "Tipos de Combustível", rota: "#" },
                                    { label: "Pontos de Abastecimento", rota: "/modulo-oficina/ponto-abastecimento" },
                                    { label: "Lançar Abastecimento", rota: "/modulo-oficina/abastecimento" },
                                ].map((item) => (
                                    <Link
                                        key={item.label}
                                        to={item.rota}
                                        className="block px-3 py-[2px] hover:bg-gray-100 rounded cursor-pointer text-gray-700"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RELATÓRIOS */}
                    <div
                        className="group relative mt-1"
                        onMouseEnter={() => setActiveMenu("relatorios")}
                        onMouseLeave={() => setActiveMenu(null)}
                    >
                        <button
                            onClick={() => toggleMenu("relatorios")}
                            className="flex items-center w-full px-2 py-2 hover:bg-gray-100 
                            rounded-md transition"
                        >
                            <BarChart3 className={`w-5 h-5 ${iconColor}`} />

                            {open && (
                                <>
                                    <span className="ml-3 flex-1 text-left">Relatório</span>
                                    <ChevronRight
                                        size={14}
                                        className={`text-gray-500 transition-transform 
                                        ${activeMenu === "relatorios" ? "rotate-90" : ""}`}
                                    />
                                </>
                            )}
                        </button>

                        {activeMenu === "relatorios" && (
                            <div className="absolute top-0 left-full bg-white border border-gray-200 
                            shadow-xl rounded-md w-60 p-1 z-[999]">
                                {[
                                    { label: "Veiculo", rota: "#" },
                                    { label: "Estoque", rota: "#" },
                                    { label: "Consumo Combustível", rota: "/modulo-oficina/relatorio-consumo-combustivel" },
                                    { label: "Abastecimento", rota: "#" },
                                    { label: "Pneus", rota: "#" },
                                ].map((item) => (
                                    <Link
                                        key={item.label}
                                        to={item.rota}
                                        className="block px-3 py-[2px] hover:bg-gray-100 rounded cursor-pointer text-gray-700"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* USUÁRIO */}
                    <div
                        className="group relative mt-1"
                        onMouseEnter={() => setActiveMenu("usuario")}
                        onMouseLeave={() => setActiveMenu(null)}
                    >
                        <button
                            onClick={() => toggleMenu("usuario")}
                            className="flex items-center w-full px-2 py-2 hover:bg-gray-100 
                                rounded-md transition"
                        >
                            <UserCircle2 className={`w-5 h-5 ${iconColor}`} />

                            {open && (
                                <>
                                    <span className="ml-3 flex-1 text-left">Usuário</span>
                                    <ChevronRight
                                        size={14}
                                        className={`text-gray-500 transition-transform 
                                            ${activeMenu === "usuario" ? "rotate-90" : ""}`}
                                    />
                                </>
                            )}
                        </button>

                        {activeMenu === "usuario" && (
                            <div className="absolute top-0 left-full bg-white border border-gray-200 
                                shadow-xl rounded-md w-56 p-1 z-[999]">
                                {["Trocar Filial", "Alterar Senha"].map((sub) => (
                                    <div
                                        key={sub}
                                        className="px-3 py-[2px] hover:bg-gray-100 rounded cursor-pointer"
                                        onClick={() => {
                                            if (sub === "Alterar Senha") setShowAlterarSenha(true);
                                            if (sub === "Trocar Filial") setShowTrocarFilial(true);
                                        }}
                                    >
                                        {sub}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* CHAT */}
                    <button
                        onClick={() => setChatOpen(!chatOpen)}
                        className="flex items-center w-full px-2 py-2 hover:bg-gray-100 
                            rounded-md mt-1 transition"
                    >
                        <MessageSquare className={`w-5 h-5 ${iconColor}`} />
                        {open && <span className="ml-3 flex-1 text-left">Chat</span>}

                        {contatosComMensagensNaoLidas > 0 && (
                            <span
                                className="absolute top-1 right-3 bg-red-600 text-white text-[10px] font-semibold
             w-4 h-4 flex items-center justify-center rounded-full shadow-md"
                            >
                                {contatosComMensagensNaoLidas}
                            </span>

                        )}
                    </button>
                </nav>

                {/* RODAPÉ - LOGOUT */}
                <div className="absolute bottom-4 left-0 w-full flex justify-center">
                    <button
                        onClick={() => {
                            if (window.opener) {
                                window.opener.postMessage({ action: "modulo-fechado" }, "*");
                            }
                            window.close();
                        }}
                        className="bg-red-700 hover:bg-red-800 text-white p-3 rounded-full shadow transition"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </aside >

            {/* MODAL ALTERAR SENHA */}
            {
                showAlterarSenha && (
                    <UsuarioAlterarSenha onClose={() => setShowAlterarSenha(false)} />
                )
            }

            {showTrocarFilial && (
                <ModalTrocarFilial open={showTrocarFilial} onClose={() => setShowTrocarFilial(false)} />
            )}

            {/* CHAT */}
            {chatOpen && (
                <div
                    className="fixed right-0 top-[48px] w-80 h-[calc(100vh-48px)]
    bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col"
                >
                    {/* Cabeçalho */}
                    <div className="flex justify-between items-center p-3 border-b">
                        <h2 className="font-semibold text-gray-700 text-sm">
                            {chatAtivo ? `Chat com ${chatAtivo.nome}` : "Mensagens"}
                        </h2>
                        <button
                            onClick={() =>
                                chatAtivo ? setChatAtivo(null) : setChatOpen(false)
                            }
                            className="text-red-700 hover:text-black"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* LISTA DE CONTATOS */}
                    {!chatAtivo && (
                        <div className="flex-1 overflow-y-auto">
                            {usuarios.map((u) => (
                                <div
                                    key={u.nome}
                                    onClick={() => {
                                        setChatAtivo(u);

                                        // zera não lidas do contato clicado
                                        setUsuarios((prev) => {
                                            const atualizados = prev.map((x) =>
                                                x.nome === u.nome ? { ...x, naoLidas: 0 } : x
                                            );

                                            const total = atualizados.filter(
                                                (x) => x.naoLidas > 0
                                            ).length;

                                            setContatosComMensagensNaoLidas(total);
                                            return atualizados;
                                        });
                                    }}
                                    className="relative flex items-center justify-between px-3 py-2
                       hover:bg-gray-50 cursor-pointer border-b"
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            {u.online ? (
                                                <CircleDot className="text-green-500 w-3 h-3" />
                                            ) : (
                                                <Circle className="text-gray-400 w-3 h-3" />
                                            )}
                                            <span className="font-medium text-sm">{u.nome}</span>
                                        </div>

                                        <div className="text-gray-500 text-xs truncate w-52">
                                            {u.ultimaMsg}
                                        </div>
                                    </div>

                                    {/* Badge individual */}
                                    {u.naoLidas > 0 && (
                                        <span
                                            className="absolute right-3 top-2 bg-red-600 text-white
                text-[10px] font-semibold w-4 h-4
                flex items-center justify-center rounded-full"
                                        >
                                            {u.naoLidas}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* CONVERSA ATIVA */}
                    {chatAtivo && (
                        <div className="flex-1 overflow-y-auto p-3 space-y-2">
                            {mensagens
                                .filter(
                                    (m) =>
                                        (m.de === usuarioLogado && m.para === chatAtivo.nome) ||
                                        (m.de === chatAtivo.nome && m.para === usuarioLogado)
                                )
                                .map((m, idx) => (
                                    <div
                                        key={idx}
                                        className={`max-w-[75%] px-3 py-2 rounded-lg text-sm
                ${m.de === usuarioLogado
                                                ? "bg-red-600 text-white ml-auto"
                                                : "bg-gray-200 text-gray-800 mr-auto"
                                            }`}
                                    >
                                        {m.texto}
                                        <div className="text-[10px] opacity-70 text-right">
                                            {m.hora}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
