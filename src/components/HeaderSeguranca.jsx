// src/components/HeaderSeguranca.jsx
import {
    Bell,
    ChevronDown,
    Menu,
    UserRound,
    Building2,
    Lock,
    Settings,
    Image as ImageIcon,
    Calendar,
    Check
} from "lucide-react";

import Logo from "../assets/logo_mantran.png";

import { useNotificacao } from "../context/NotificacaoContext";
import { useMenuRapidoSeguranca } from "../context/MenuRapidoSegurancaContext";
import { useIconColor } from "../context/IconColorContext";
import { useFilial } from "../context/FilialContext";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UsuarioAlterarSenha from "../pages/UsuarioAlterarSenha";
import ModalTrocarFilial from "./ModalTrocarFilial";

// Ícone estilo Google Apps
function AppDotsIcon({ size = 20, color = "#b91c1c" }) {
    const dotSize = size / 5;
    const gap = dotSize * 0.8;

    return (
        <div
            style={{
                width: size,
                height: size,
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap,
            }}
        >
            {Array.from({ length: 9 }).map((_, i) => (
                <div
                    key={i}
                    style={{
                        width: dotSize,
                        height: dotSize,
                        backgroundColor: color,
                        borderRadius: "50%",
                    }}
                />
            ))}
        </div>
    );
}

export default function HeaderSeguranca({ toggleSidebar }) {
    const usuarioLogado = (localStorage.getItem("usuarioNome") || "Usuário").split(".")[0].toUpperCase();

    const [showNotifications, setShowNotifications] = useState(false);
    const [showAppsMenu, setShowAppsMenu] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showAlterarSenha, setShowAlterarSenha] = useState(false);
    const [showTrocarFilial, setShowTrocarFilial] = useState(false);

    const { filialAtiva } = useFilial();

    const navigate = useNavigate();

    const { notificacoes, marcarComoLido } = useNotificacao();

    // MENU RÁPIDO SEGURANÇA
    const { atalhos } = useMenuRapidoSeguranca();

    // CORES DINÂMICAS
    const { iconColor, footerIconColorHover } = useIconColor();

    // helpers hover
    const handleEnter = (e) =>
        e.currentTarget.classList.add(footerIconColorHover);

    const handleLeave = (e) =>
        e.currentTarget.classList.remove(footerIconColorHover);

    return (
        <>
            <header
                className="
                    flex justify-between items-center
                    bg-white shadow px-6 py-1.5 border-b h-[48px]
                    fixed top-0 left-0 right-0 z-50
                "
            >
                {/* ================= LADO ESQUERDO ================= */}
                <div className="flex items-center gap-5">
                    {/* BOTÃO SIDEBAR */}
                    <button
                        onClick={toggleSidebar}
                        className={`${iconColor} transition-colors`}
                        onMouseEnter={handleEnter}
                        onMouseLeave={handleLeave}
                    >
                        <Menu size={22} />
                    </button>

                    {/* LOGO */}
                    <img src={Logo} className="h-7" />

                    {/* MENU RÁPIDO SEGURANÇA */}
                    <div className={`flex gap-8 text-sm ml-6 ${iconColor}`}>
                        {atalhos.map((item) => (
                            <Link
                                key={item.id}
                                to={item.rota}
                                className="flex flex-col items-center cursor-pointer transition-colors"
                                onMouseEnter={handleEnter}
                                onMouseLeave={handleLeave}
                            >
                                <i className={`fa-solid ${item.icone} text-lg`} />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ================= LADO DIREITO ================= */}
                <div className="flex items-center gap-6">
                    {filialAtiva ? (
                        <div className="border-gray-300 rounded px-4 py-[3px] text-sm text-gray-400 font-semibold">
                            Filial {filialAtiva.codigo} – {filialAtiva.nome}
                        </div>
                    ) : (
                        <div className="bg-yellow-100 border border-yellow-300 rounded px-4 py-[3px] text-sm text-yellow-800">
                            Nenhuma filial selecionada
                        </div>
                    )}
                    {/* 🔔 NOTIFICAÇÕES */}
                    <div className="relative">
                        <button
                            className={`${iconColor} relative transition-colors`}
                            onMouseEnter={handleEnter}
                            onMouseLeave={handleLeave}
                            onClick={() => {
                                setShowNotifications(!showNotifications);
                                setShowAppsMenu(false);
                                setShowUserMenu(false);
                            }}
                        >
                            <Bell size={18} />

                            {notificacoes.some((n) => !n.lido) && (
                                <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] px-1 rounded-full">
                                    {notificacoes.filter((n) => !n.lido).length}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded shadow border z-50 max-h-96 overflow-auto">
                                <div className={`p-3 font-semibold border-b ${iconColor}`}>
                                    Lembretes da Agenda
                                </div>

                                {notificacoes.length === 0 ? (
                                    <p className="text-sm text-center text-gray-500 p-4">
                                        Nenhum lembrete
                                    </p>
                                ) : (
                                    notificacoes.map((n) => (
                                        <div
                                            key={n.id}
                                            className={`flex justify-between px-4 py-2 border-b text-sm
                                                ${n.lido
                                                    ? "text-gray-400"
                                                    : "text-gray-800 bg-gray-50"
                                                }`}
                                        >
                                            <div>
                                                <p className={`font-semibold ${iconColor}`}>
                                                    {n.titulo || n.texto}
                                                </p>

                                                {n.start && (
                                                    <p className="text-gray-700 text-xs">
                                                        {new Date(n.start).toLocaleString()}
                                                    </p>
                                                )}

                                                {n.start && (
                                                    <button
                                                        className={`${iconColor} text-xs transition-colors`}
                                                        onMouseEnter={handleEnter}
                                                        onMouseLeave={handleLeave}
                                                        onClick={() => {
                                                            navigate(`/agenda?data=${n.start}`);
                                                            setShowNotifications(false);
                                                        }}
                                                    >
                                                        Ver no calendário
                                                    </button>
                                                )}
                                            </div>

                                            {!n.lido && (
                                                <button
                                                    onClick={() => marcarComoLido(n.id)}
                                                    title="Marcar como lido"
                                                    className="
    ml-2
    w-6 h-6
    flex items-center justify-center
    rounded
    bg-red-600 hover:bg-red-700
    transition
    shrink-0
  "
                                                >
                                                    <Check size={14} className="text-white" />
                                                </button>

                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* MENU DE APPS */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowAppsMenu(!showAppsMenu);
                                setShowNotifications(false);
                                setShowUserMenu(false);
                            }}
                            className={`${iconColor} transition-colors`}
                            onMouseEnter={handleEnter}
                            onMouseLeave={handleLeave}
                        >
                            <AppDotsIcon size={18} />
                        </button>

                        {showAppsMenu && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded shadow-lg border z-50 p-3 grid grid-cols-3 gap-4">
                                {[
                                    { icon: "fa-shield-halved", label: "Segurança" },
                                    { icon: "fa-users", label: "Usuários" },
                                    { icon: "fa-user-lock", label: "Permissões" },
                                    { icon: "fa-chart-pie", label: "Relatórios" },
                                    { icon: "fa-folder-open", label: "Arquivos" },
                                ].map((item, idx) => (
                                    <button
                                        key={idx}
                                        className={`flex flex-col items-center ${iconColor} transition-colors`}
                                        onMouseEnter={handleEnter}
                                        onMouseLeave={handleLeave}
                                    >
                                        <i className={`fa-solid ${item.icon} text-xl`} />
                                        <span className="text-sm">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* MENU DO USUÁRIO */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowUserMenu(!showUserMenu);
                                setShowAppsMenu(false);
                                setShowNotifications(false);
                            }}
                            className={`flex items-center gap-2 ${iconColor} transition-colors`}
                            onMouseEnter={handleEnter}
                            onMouseLeave={handleLeave}
                        >
                            <UserRound size={18} />
                            <span className="uppercase">{usuarioLogado}</span>
                            <ChevronDown size={16} />
                        </button>

                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow-lg z-50 py-1">
                                <button
                                    onClick={() => setShowTrocarFilial(true)}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                    <Building2 className={iconColor} size={16} />
                                    Trocar Filial
                                </button>

                                <button
                                    onClick={() => setShowAlterarSenha(true)}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                    <Lock className={iconColor} size={16} />
                                    Alterar Senha
                                </button>

                                <button
                                    onClick={() => navigate("/perfil")}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                    <ImageIcon className={iconColor} size={16} />
                                    Perfil
                                </button>

                                <button
                                    onClick={() =>
                                        navigate("/modulo-seguranca/seguranca-parametros")
                                    }
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                    <Settings className={iconColor} size={16} />
                                    Configuração
                                </button>

                                <button
                                    onClick={() => navigate("/agenda")}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                    <Calendar className={iconColor} size={16} />
                                    Calendário
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* MODAL ALTERAR SENHA */}
            {showAlterarSenha && (
                <UsuarioAlterarSenha onClose={() => setShowAlterarSenha(false)} />
            )}

            {showTrocarFilial && (
                <ModalTrocarFilial open={showTrocarFilial} onClose={() => setShowTrocarFilial(false)} />
            )}
        </>
    );
}
