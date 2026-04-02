import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import UsuarioAlterarSenha from "../pages/UsuarioAlterarSenha";
import ModalTrocarFilial from "./ModalTrocarFilial";
import { useIconColor } from "../context/IconColorContext";
import { Link } from "react-router-dom";

import {
    Boxes,
    Users,
    Warehouse,
    Map,
    ClipboardList,
    Package,
    FileText,
    BarChart3,
    UploadCloud,
    ChevronRight,
    UserCircle2,
    MessageSquare,
    CircleDot,
    Circle,
    Send,
    LogOut,
    X,
} from "lucide-react";

export default function SidebarWMS({ open }) {
    const { iconColor } = useIconColor();

    const [activeMenu, setActiveMenu] = useState(null);
    const [activeSubMenu, setActiveSubMenu] = useState(null);

    /* ===================== CHAT (PADRÃO MANTRAN) ===================== */
    const [chatOpen, setChatOpen] = useState(false);
    const [chatAtivo, setChatAtivo] = useState(null);
    const [novaMensagem, setNovaMensagem] = useState("");
    const [mostrarEmoji, setMostrarEmoji] = useState(false);
    const [mensagens, setMensagens] = useState([]);
    const [showAlterarSenha, setShowAlterarSenha] = useState(false);
    const [showTrocarFilial, setShowTrocarFilial] = useState(false);
    const [contatosComMensagensNaoLidas, setContatosComMensagensNaoLidas] = useState(0);

    const [usuarios, setUsuarios] = useState([
        { nome: "Alan", online: true, ultimaMsg: "Olá, tudo bem?", naoLidas: 0 },
        { nome: "Admin", online: false, ultimaMsg: "CT-e finalizado com sucesso", naoLidas: 0 },
        { nome: "Fernanda", online: true, ultimaMsg: "Pode revisar o frete?", naoLidas: 0 },
        { nome: "Filipe", online: true, ultimaMsg: "Conferi a coleta 👍", naoLidas: 0 },
        { nome: "Gabriel", online: false, ultimaMsg: "Atualizando dados...", naoLidas: 0 },
        { nome: "Guilherme", online: true, ultimaMsg: "Nova viagem liberada", naoLidas: 0 },
        { nome: "Daniel", online: false, ultimaMsg: "Aguardando retorno", naoLidas: 0 },
        { nome: "Marcio", online: false, ultimaMsg: "", naoLidas: 0 },
        { nome: "Raul", online: false, ultimaMsg: "", naoLidas: 0 },
        { nome: "Marisa", online: false, ultimaMsg: "", naoLidas: 0 },
    ]);

    const [socket, setSocket] = useState(null);
    const usuarioLogado = (localStorage.getItem("usuarioNome") || "WMS").split(".")[0].toUpperCase();

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
                    const atualizados = prev.map((u) =>
                        u.nome === (msg.de === usuarioLogado ? msg.para : msg.de)
                            ? {
                                ...u,
                                ultimaMsg: msg.texto,
                                naoLidas:
                                    msg.para === usuarioLogado
                                        ? (u.naoLidas || 0) + 1
                                        : u.naoLidas,
                            }
                            : u
                    );

                    setContatosComMensagensNaoLidas(
                        atualizados.filter((u) => u.naoLidas > 0).length
                    );

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

    const enviarMensagem = () => {
        if (!novaMensagem.trim() || !chatAtivo) return;

        const msg = {
            de: usuarioLogado,
            para: chatAtivo.nome,
            texto: novaMensagem.trim(),
            hora: new Date().toLocaleTimeString("pt-BR", { hour12: false }),
        };

        socket?.emit("novaMensagem", msg);
        setMensagens((prev) => [...prev, msg]);
        setNovaMensagem("");
    };

    const toggleMenu = (menu) => {
        setActiveMenu(activeMenu === menu ? null : menu);
        setActiveSubMenu(null);
    };

    return (
        <>
            {/* ================= SIDEBAR ================= */}
            <aside
                className={`bg-white border-r border-gray-200 shadow-lg fixed left-0 top-[48px]
                h-[calc(100vh-48px)] z-50 transition-all duration-300
                ${open ? "w-52" : "w-14"}`}
            >
                <nav className="p-2 text-sm text-gray-700">

                    {/* CADASTRO */}
                    <Menu icon={Boxes} label="Cadastro" menuKey="cadastro" items={[
                        "Empresa",
                        "Filial",
                        "Produto",
                        "Embalagem",
                        "Unidade Medida",
                        "Tipo Palete",
                        "Tabela de Cores",
                        "Cliente Produto",
                    ]} />

                    <MenuSimples icon={Users} label="Cliente" />

                    <Menu icon={Warehouse} label="Armazém" menuKey="armazem" items={[
                        "Depósito",
                        "Área",
                        "Endereço",
                        "Operador",
                        {
                            label: "Recebimento",
                            children: [
                                "Status NF Entrada",
                                "Agenda de Recebimento",
                                "Painel Conferência Entrada",
                                "Divergência Entrada",
                            ],
                        },
                        {
                            label: "Expedição",
                            children: [
                                "OS Carregamento",
                                "OS Carregamento CrossDocking",
                                "OS Carregamento Embalagem",
                                "Painel Separação Saída",
                                "Conferência Embarque",
                            ],
                        },
                        "Movimentação Armazém",
                        "Tabela Preço Armazenamento",
                        "Cobrança Armazenamento",
                    ]} />

                    <MenuSimples icon={Map} label="Mapa" />

                    <Menu icon={ClipboardList} label="Ordem de Serviço" menuKey="os" items={[
                        "Packlist Entrada",
                        "Packlist Nota Fiscal",
                        { label: "Separação Saída", to: "/modulo-wms/os-separacao" },
                        "Pedido Carga",
                    ]} />

                    <Menu icon={Package} label="Estoque" menuKey="estoque" items={[
                        "Consultas",
                        "Inventário Inicial",
                        "Inventário",
                        "Correção Estoque",
                    ]} />

                    <Menu icon={FileText} label="Nota Fiscal" menuKey="nf" items={[
                        { label: "Entrada", to: "/modulo-wms/nf-entrada" },
                        { label: "Saída", to: "/modulo-wms/nf-saida" },
                        "Parâmetros NFe",
                        "NFe CCE",
                    ]} />

                    <Menu icon={BarChart3} label="Relatórios" menuKey="rel" items={[
                        {
                            label: "Estoque Armazém",
                            children: [
                                "Estoque Analítico / Sintético",
                                "Movimentação",
                                "Notas Fiscais",
                                "Estoque em Trânsito",
                                "Rastreabilidade Produto",
                                "Reserva Liberada",
                                "Produto Cliente",
                            ],
                        },
                        "Etiqueta Conferência",
                        "Etiqueta Endereçamento",
                    ]} />

                    <Menu icon={UploadCloud} label="XML" menuKey="xml" items={[
                        "Importação de Nota",
                        "Importação de Notas em Lote",
                    ]} />

                    <MenuSimples icon={BarChart3} label="Gráficos" />

                    <Menu
                        icon={UserCircle2}
                        label="Usuário"
                        menuKey="usuario"
                        items={[
                            {
                                label: "Trocar Filial",
                                action: () => setShowTrocarFilial(true),
                            },
                            {
                                label: "Alterar Senha",
                                action: () => setShowAlterarSenha(true),
                            },
                        ]}
                    />

                    {/* CHAT */}
                    <button
                        onClick={() => setChatOpen(!chatOpen)}
                        className="flex items-center w-full px-2 py-2 hover:bg-gray-100 rounded-md mt-1 relative"
                    >
                        <MessageSquare className={`w-5 h-5 ${iconColor}`} />
                        {open && <span className="ml-3">Chat</span>}
                        {contatosComMensagensNaoLidas > 0 && (
                            <span className="absolute right-2 top-1 bg-red-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                                {contatosComMensagensNaoLidas}
                            </span>
                        )}
                    </button>
                </nav>

                {/* LOGOUT */}
                <div className="absolute bottom-4 w-full flex justify-center">
                    <button
                        onClick={() => window.close()}
                        className="bg-red-700 hover:bg-red-800 text-white p-3 rounded-full"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </aside>

            {showAlterarSenha && (
                <UsuarioAlterarSenha onClose={() => setShowAlterarSenha(false)} />
            )}

            {showTrocarFilial && (
                <ModalTrocarFilial open={showTrocarFilial} onClose={() => setShowTrocarFilial(false)} />
            )}

            {/* ================= PAINEL CHAT ================= */}
            {chatOpen && (
                <div
                    className="fixed right-0 top-[48px] w-80 h-[calc(100vh-48px)]
    bg-white border-l border-gray-200 shadow-2xl z-40 flex flex-col"
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

                                        // zera mensagens não lidas do contato
                                        setUsuarios((prev) => {
                                            const atualizados = prev.map((x) =>
                                                x.nome === u.nome ? { ...x, naoLidas: 0 } : x
                                            );

                                            setContatosComMensagensNaoLidas(
                                                atualizados.filter((x) => x.naoLidas > 0).length
                                            );

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
                                            {u.ultimaMsg || " "}
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
                        <>
                            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
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
                                                    : "bg-white text-gray-800 mr-auto shadow"
                                                }`}
                                        >
                                            {m.texto}
                                            <div className="text-[10px] opacity-70 text-right">
                                                {m.hora}
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            {/* INPUT */}
                            <div className="flex items-center gap-2 border-t p-2 relative">
                                <input
                                    value={novaMensagem}
                                    onChange={(e) => setNovaMensagem(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && enviarMensagem()}
                                    className="flex-1 border rounded px-2 py-1 text-sm"
                                    placeholder={`Mensagem para ${chatAtivo.nome}`}
                                />

                                <button
                                    onClick={() => setMostrarEmoji(!mostrarEmoji)}
                                    className="text-lg"
                                >
                                    😊
                                </button>

                                {mostrarEmoji && (
                                    <div className="absolute bottom-14 right-10 z-50">
                                        <EmojiPicker
                                            onEmojiClick={(e) => {
                                                setNovaMensagem((prev) => prev + e.emoji);
                                                setMostrarEmoji(false);
                                            }}
                                        />
                                    </div>
                                )}

                                <button
                                    onClick={enviarMensagem}
                                    className="bg-red-700 hover:bg-red-800 text-white p-2 rounded"
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

        </>
    );

    /* ================= COMPONENTES AUXILIARES ================= */

    function Menu({ icon: Icon, label, menuKey, items }) {
        return (
            <div
                className="group relative mt-1"
                onMouseEnter={() => setActiveMenu(menuKey)}
                onMouseLeave={() => {
                    setActiveMenu(null);
                    setActiveSubMenu(null);
                }}
            >
                <button
                    onClick={() => toggleMenu(menuKey)}
                    className="flex items-center w-full px-2 py-2 hover:bg-gray-100 rounded-md"
                >
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                    {open && (
                        <>
                            <span className="ml-3 flex-1 text-left">{label}</span>
                            <ChevronRight
                                size={14}
                                className={`transition-transform ${activeMenu === menuKey ? "rotate-90" : ""}`}
                            />
                        </>
                    )}
                </button>

                {activeMenu === menuKey && (
                    <div className="absolute top-0 left-full bg-white border shadow-xl rounded-md w-56 p-1 z-[999]">
                        {items.map((item) =>
                            typeof item === "string" ? (
                                <div key={item} className="px-3 py-[2px] hover:bg-gray-100 rounded">
                                    {item}
                                </div>
                            ) : item.to ? (
                                <Link
                                    key={item.label}
                                    to={item.to}
                                    className="block px-3 py-[2px] hover:bg-gray-100 rounded text-gray-700"
                                    onClick={() => toggleMenu(menuKey)} // fecha submenu se quiser
                                >
                                    {item.label}
                                </Link>
                            ) : item.action ? (
                                <button
                                    key={item.label}
                                    onClick={item.action}
                                    className="w-full text-left px-3 py-[2px] hover:bg-gray-100 rounded"
                                >
                                    {item.label}
                                </button>
                            ) : (
                                <div
                                    key={item.label}
                                    className="relative px-3 py-[2px] hover:bg-gray-100 rounded"
                                    onMouseEnter={() => setActiveSubMenu(item.label)}
                                >
                                    {item.label}
                                    <ChevronRight size={13} className="absolute right-2 top-2" />

                                    {activeSubMenu === item.label && (
                                        <div className="absolute left-full top-0 bg-white border shadow-xl rounded-md w-64 p-1">
                                            {item.children.map((sub) => (
                                                <div key={sub} className="px-3 py-[2px] hover:bg-gray-100 rounded">
                                                    {sub}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        );
    }

    function MenuSimples({ icon: Icon, label }) {
        return (
            <button className="flex items-center w-full px-2 py-2 hover:bg-gray-100 rounded-md mt-1">
                <Icon className={`w-5 h-5 ${iconColor}`} />
                {open && <span className="ml-3">{label}</span>}
            </button>
        );
    }
}
