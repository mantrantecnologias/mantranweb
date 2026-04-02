import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import UsuarioAlterarSenha from "../pages/UsuarioAlterarSenha";
import ModalTrocarFilial from "./ModalTrocarFilial";
import { useIconColor } from "../context/IconColorContext";

import {
    FileText,
    DollarSign,
    Receipt,
    BarChart3,
    ChevronRight,
    Headphones,
    UserCircle2,
    MessageSquare,
    CircleDot,
    Circle,
    Send,
    X,
    LogOut,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function SidebarFinanceiro({ open }) {
    const { iconColor } = useIconColor();

    const [activeMenu, setActiveMenu] = useState(null);
    const [activeSubMenu, setActiveSubMenu] = useState(null);

    const [chatOpen, setChatOpen] = useState(false);
    const [chatAtivo, setChatAtivo] = useState(null);
    const [novaMensagem, setNovaMensagem] = useState("");
    const [mostrarEmoji, setMostrarEmoji] = useState(false);
    const [mensagens, setMensagens] = useState([]);
    const [showAlterarSenha, setShowAlterarSenha] = useState(false);
    const [showTrocarFilial, setShowTrocarFilial] = useState(false);

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

    const [contatosComMensagensNaoLidas, setContatosComMensagensNaoLidas] = useState(0);

    const [socket, setSocket] = useState(null);
    const usuarioLogado = (localStorage.getItem("usuarioNome") || "Financeiro").split(".")[0].toUpperCase();

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

                // evita duplicar mensagem
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

                // atualiza ultimaMsg e naoLidas
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

                    // atualiza contador geral
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
                                    { label: "Banco", rota: "/modulo-financeiro/banco" },
                                    { label: "Agência", rota: "/modulo-financeiro/agencia" },
                                    { label: "Conta Corrente", rota: "/modulo-financeiro/conta-corrente" },
                                    { label: "Cliente", rota: "/modulo-financeiro/cliente" },
                                    { label: "Categoria", rota: "#" },
                                    { label: "CFOP", rota: "/modulo-financeiro/cfop" },
                                    { label: "Condição Pagamento", rota: "#" },
                                    { label: "Centro de Custo", rota: "#" },
                                    { label: "Produto", rota: "/modulo-financeiro/produto" },
                                    { label: "Moeda", rota: "#" },
                                    { label: "Fornecedor", rota: "/modulo-financeiro/fornecedor" },
                                    { label: "Fornecedor Produto", rota: "#" },
                                    { label: "Tipos de Pagamento", rota: "#" },
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

                    {/* FATURAMENTO */}
                    <div
                        className="group relative mt-1"
                        onMouseEnter={() => setActiveMenu("faturamento")}
                        onMouseLeave={() => setActiveMenu(null)}
                    >
                        <button
                            onClick={() => toggleMenu("faturamento")}
                            className="flex items-center w-full px-2 py-2 hover:bg-gray-100 
                            rounded-md transition"
                        >
                            <DollarSign className={`w-5 h-5 ${iconColor}`} />

                            {open && (
                                <>
                                    <span className="ml-3 flex-1 text-left">Faturamento</span>
                                    <ChevronRight
                                        size={14}
                                        className={`text-gray-500 transition-transform 
                                        ${activeMenu === "faturamento" ? "rotate-90" : ""}`}
                                    />
                                </>
                            )}
                        </button>

                        {activeMenu === "faturamento" && (
                            <div className="absolute top-0 left-full bg-white border border-gray-200 
                            shadow-xl rounded-md w-52 p-1 z-[999]">

                                {[
                                    { label: "Manual", rota: "/modulo-financeiro/faturamento" },
                                    { label: "Automático", rota: "/modulo-financeiro/faturamento-automatico" },
                                    { label: "Por Conhecimento", rota: "#" },
                                ].map((item) => (
                                    <Link
                                        key={item.label}
                                        to={item.rota}
                                        className="block px-3 py-[2px] hover:bg-gray-100 rounded cursor-pointer text-gray-700"
                                    >
                                        {item.label}
                                    </Link>
                                ))}

                                <div className="border-t border-gray-200 my-1"></div>

                                <Link
                                    to="/troca-portador"
                                    className="block px-3 py-[2px] hover:bg-gray-100 rounded cursor-pointer text-gray-700"
                                >
                                    Trocar Portador
                                </Link>

                                <Link
                                    to="/troca-cliente"
                                    className="block px-3 py-[2px] hover:bg-gray-100 rounded cursor-pointer text-gray-700"
                                >
                                    Trocar Cliente
                                </Link>

                                <Link
                                    to="/troca-status-ctrc"
                                    className="block px-3 py-[2px] hover:bg-gray-100 rounded cursor-pointer text-gray-700"
                                >
                                    Trocar Status CTRC
                                </Link>

                                <Link
                                    to="/troca-seguradora"
                                    className="block px-3 py-[2px] hover:bg-gray-100 rounded cursor-pointer text-gray-700"
                                >
                                    Trocar Seguradora
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* BOLETO */}
                    <div
                        className="group relative mt-1"
                        onMouseEnter={() => setActiveMenu("boleto")}
                        onMouseLeave={() => setActiveMenu(null)}
                    >
                        <button
                            onClick={() => toggleMenu("boleto")}
                            className="flex items-center w-full px-2 py-2 hover:bg-gray-100 
                            rounded-md transition"
                        >
                            <Receipt className={`w-5 h-5 ${iconColor}`} />

                            {open && (
                                <>
                                    <span className="ml-3 flex-1 text-left">Boleto</span>
                                    <ChevronRight
                                        size={14}
                                        className={`text-gray-500 transition-transform 
                                        ${activeMenu === "boleto" ? "rotate-90" : ""}`}
                                    />
                                </>
                            )}
                        </button>

                        {activeMenu === "boleto" && (
                            <div className="absolute top-0 left-full bg-white border border-gray-200 
                            shadow-xl rounded-md w-52 p-1 z-[999]">
                                <div className="px-3 py-[2px] hover:bg-gray-100 rounded cursor-pointer">
                                    Geração de Boleto/Remessa
                                </div>
                                <div className="px-3 py-[2px] hover:bg-gray-100 rounded cursor-pointer">
                                    Arquivo Retorno / Leitura
                                </div>
                            </div>
                        )}
                    </div>

                    {/* CONTAS A PAGAR */}
                    <div
                        className="group relative mt-1"
                        onMouseEnter={() => setActiveMenu("pagar")}
                        onMouseLeave={() => setActiveMenu(null)}
                    >
                        <button
                            onClick={() => toggleMenu("pagar")}
                            className="flex items-center w-full px-2 py-2 hover:bg-gray-100 
                            rounded-md transition"
                        >
                            <DollarSign className={`w-5 h-5 ${iconColor}`} />

                            {open && (
                                <>
                                    <span className="ml-3 flex-1 text-left">Contas a Pagar</span>
                                    <ChevronRight
                                        size={14}
                                        className={`text-gray-500 transition-transform 
                                        ${activeMenu === "pagar" ? "rotate-90" : ""}`}
                                    />
                                </>
                            )}
                        </button>

                        {activeMenu === "pagar" && (
                            <div className="absolute top-0 left-full bg-white border border-gray-200 
                            shadow-xl rounded-md w-60 p-1 z-[999]">
                                {[
                                    { label: "Títulos", rota: "/modulo-financeiro/contas-pagar" },
                                    { label: "Baixa de Títulos (Lote)", rota: "#" },
                                    { label: "Integração Banco", rota: "#" },
                                    { label: "Arquivo de Retorno", rota: "#" },
                                    { label: "Nota Fiscal - Compra", rota: "#" },
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

                    {/* CONTAS A RECEBER */}
                    <div
                        className="group relative mt-1"
                        onMouseEnter={() => setActiveMenu("receber")}
                        onMouseLeave={() => setActiveMenu(null)}
                    >
                        <button
                            onClick={() => toggleMenu("receber")}
                            className="flex items-center w-full px-2 py-2 hover:bg-gray-100 
                            rounded-md transition"
                        >
                            <DollarSign className={`w-5 h-5 ${iconColor}`} />

                            {open && (
                                <>
                                    <span className="ml-3 flex-1 text-left">Contas a Receber</span>
                                    <ChevronRight
                                        size={14}
                                        className={`text-gray-500 transition-transform 
                                        ${activeMenu === "receber" ? "rotate-90" : ""}`}
                                    />
                                </>
                            )}
                        </button>

                        {activeMenu === "receber" && (
                            <div className="absolute top-0 left-full bg-white border border-gray-200 
                            shadow-xl rounded-md w-60 p-1 z-[999]">

                                {[
                                    "Títulos",
                                    "Baixa de Título (Lote)",
                                    "Protesto de Duplicatas",
                                    "Cancelar Duplicatas",
                                ].map((item) => (
                                    <div
                                        key={item}
                                        className="px-3 py-[2px] hover:bg-gray-100 rounded cursor-pointer"
                                    >
                                        {item}
                                    </div>
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
                                    <span className="ml-3 flex-1 text-left">Relatórios</span>
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

                                {/* ==== RELATÓRIOS - CONTAS A PAGAR ==== */}
                                <div
                                    className="relative px-3 py-[2px] hover:bg-gray-100 rounded cursor-pointer"
                                    onMouseEnter={() => setActiveSubMenu("rel-pagar")}
                                >
                                    Contas a Pagar
                                    <ChevronRight size={13} className="absolute right-2 top-2" />
                                </div>

                                {activeSubMenu === "rel-pagar" && (
                                    <div className="absolute left-full top-0 bg-white border border-gray-200 
                                        shadow-xl rounded-md w-60 p-1 z-[999]">

                                        {[
                                            "Títulos em Aberto",
                                            "Títulos Pagos",
                                            "Categoria de Pagamentos",
                                            "Fluxo de Vencimentos",
                                            "Títulos Gerais",
                                        ].map((item) => (
                                            <div
                                                key={item}
                                                className="px-3 py-[2px] hover:bg-gray-100 rounded cursor-pointer"
                                            >
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* ==== RELATÓRIOS - CONTAS A RECEBER ==== */}
                                <div
                                    className="relative px-3 py-[2px] hover:bg-gray-100 rounded cursor-pointer"
                                    onMouseEnter={() => setActiveSubMenu("rel-receber")}
                                >
                                    Contas a Receber
                                    <ChevronRight size={13} className="absolute right-2 top-2" />
                                </div>

                                {activeSubMenu === "rel-receber" && (
                                    <div className="absolute left-full top-0 bg-white border border-gray-200 
                                        shadow-xl rounded-md w-60 p-1 z-[999]">

                                        {[
                                            "Títulos Recebidos",
                                            "Títulos em Aberto",
                                            "Duplicatas por Período",
                                            "Saldo de Clientes",
                                            "Doctos Recebidos",
                                            "Títulos Gerais",
                                        ].map((item) => (
                                            <div
                                                key={item}
                                                className="px-3 py-[2px] hover:bg-gray-100 rounded cursor-pointer"
                                            >
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* ==== RELATÓRIOS - FATURAMENTO ==== */}
                                <div
                                    className="relative px-3 py-[2px] hover:bg-gray-100 rounded cursor-pointer"
                                    onMouseEnter={() => setActiveSubMenu("rel-fat")}
                                >
                                    Faturamento
                                    <ChevronRight size={13} className="absolute right-2 top-2" />
                                </div>

                                {activeSubMenu === "rel-fat" && (
                                    <div className="absolute left-full top-0 bg-white border border-gray-200 
                                        shadow-xl rounded-md w-60 p-1 z-[999]">

                                        {[
                                            "Faturamento Geral",
                                            "Faturas Emitidas",
                                            "CTRCs não Faturados",
                                            "CTRCs por Cliente/Divisão",
                                            "Demonstrativo de Fatura",
                                            "Faturas por Portador",
                                            "Demonstrativo de Resultado",
                                            "Balancete",
                                        ].map((item) => (
                                            <div
                                                key={item}
                                                className="px-3 py-[2px] hover:bg-gray-100 rounded cursor-pointer"
                                            >
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="px-3 py-[2px] hover:bg-gray-100 rounded cursor-pointer">
                                    Fluxo de Caixa
                                </div>

                                <div className="px-3 py-[2px] hover:bg-gray-100 rounded cursor-pointer">
                                    Categorias
                                </div>

                                <div className="px-3 py-[2px] hover:bg-gray-100 rounded cursor-pointer">
                                    Histórico Financeiro
                                </div>

                                <div className="px-3 py-[2px] hover:bg-gray-100 rounded cursor-pointer">
                                    Fornecedor
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ORÇAMENTO */}
                    <Link
                        className="flex items-center w-full px-2 py-2 hover:bg-gray-100 rounded-md mt-1 text-gray-700 transition"
                        to="/modulo-financeiro/orcamento"
                    >
                        <BarChart3 className={`w-5 h-5 ${iconColor}`} />
                        {open && <span className="ml-3 text-left">Orçamento</span>}
                    </Link>

                    {/* SAC */}
                    <div
                        className="group relative mt-1"
                        onMouseEnter={() => setActiveMenu("sac")}
                        onMouseLeave={() => setActiveMenu(null)}
                    >
                        <button
                            onClick={() => toggleMenu("sac")}
                            className="flex items-center w-full px-2 py-2 hover:bg-gray-100 
                            rounded-md transition"
                        >
                            <Headphones className={`w-5 h-5 ${iconColor}`} />

                            {open && (
                                <>
                                    <span className="ml-3 flex-1 text-left">SAC</span>
                                    <ChevronRight
                                        size={14}
                                        className={`text-gray-500 transition-transform 
                                            ${activeMenu === "sac" ? "rotate-90" : ""}`}
                                    />
                                </>
                            )}
                        </button>

                        {activeMenu === "sac" && (
                            <div className="absolute top-0 left-full bg-white border border-gray-200 
                                shadow-xl rounded-md w-52 p-1 z-[999]">
                                <Link
                                    to="/modulo-financeiro/sac-notafiscal"
                                    className="block px-3 py-[2px] hover:bg-gray-100 rounded cursor-pointer text-gray-700"
                                >
                                    Nota Fiscal
                                </Link>
                                <Link
                                    to="/modulo-financeiro/sac-conhecimento"
                                    className="block px-3 py-[2px] hover:bg-gray-100 rounded cursor-pointer text-gray-700"
                                >
                                    Conhecimento
                                </Link>
                                <Link
                                    to="/modulo-financeiro/sac-coleta"
                                    className="block px-3 py-[2px] hover:bg-gray-100 rounded cursor-pointer text-gray-700"
                                >
                                    Coleta
                                </Link>
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

                    {/* DASHBOARD */}
                    <Link
                        to="/modulo-financeiro/dashboard"
                        className="flex items-center w-full px-2 py-2 hover:bg-gray-100 rounded-md mt-1 text-gray-700 transition"
                        onClick={() => setActiveMenu(null)}
                    >
                        <BarChart3 className={`w-5 h-5 ${iconColor}`} />
                        {open && <span className="ml-3 text-left">Dashboard</span>}
                    </Link>
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
