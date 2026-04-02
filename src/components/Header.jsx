import {
  Bell,
  ChevronDown,
  Menu,
  UserRound,
  Building2,
  Lock,
  Settings,
  Image as ImageIcon,
  Calendar
} from "lucide-react";

import Logo from "../assets/logo_mantran.png";
import { useNotificacao } from "../context/NotificacaoContext";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UsuarioAlterarSenha from "../pages/UsuarioAlterarSenha";
import ModalTrocarFilial from "./ModalTrocarFilial";
import { useIconColor } from "../context/IconColorContext";
import { useMenuRapido } from "../context/MenuRapidoContext";
import { useFilial } from "../context/FilialContext";

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
        gap: gap,
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

export default function Header({ toggleSidebar }) {
  const usuarioLogado = (localStorage.getItem("usuarioNome") || "Suporte").split(".")[0].toUpperCase();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showAppsMenu, setShowAppsMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAlterarSenha, setShowAlterarSenha] = useState(false);
  const [showTrocarFilial, setShowTrocarFilial] = useState(false);
  const { filialAtiva } = useFilial();

  // Notificações REAIS da Agenda
  const { notificacoes, marcarComoLido } = useNotificacao();

  const navigate = useNavigate();
  const { iconColor } = useIconColor();
  const { atalhos } = useMenuRapido();

  return (
    <>
      <header className="flex justify-between items-center bg-white shadow-sm px-6 py-1.5 border-b h-[48px] fixed top-0 left-0 right-0 z-50">

        {/* LADO ESQUERDO */}
        <div className="flex items-center gap-5">

          <button
            onClick={toggleSidebar}
            className={`text-gray-700 hover:text-black ${iconColor}`}
          >
            <Menu size={20} />
          </button>

          <img src={Logo} alt="Mantran" className="h-7" />

          {/* MENU RÁPIDO */}
          <div className={`flex gap-8 text-sm ml-6 ${iconColor}`}>
            {atalhos.slice(0, 7).map((item) => (
              <Link
                key={item.id}
                to={item.rota}
                className="flex flex-col items-center cursor-pointer hover:text-black"
              >
                <i className={`fa-solid ${item.icone} text-lg`} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>



        {/* LADO DIREITO */}
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
              className={`${iconColor} hover:text-black relative`}
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowAppsMenu(false);
                setShowUserMenu(false);
              }}
            >
              <Bell size={18} />

              {/* BADGE — só notificações NÃO lidas */}
              {notificacoes.some(n => !n.lido) && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] px-1 rounded-full">
                  {notificacoes.filter(n => !n.lido).length}
                </span>
              )}
            </button>

            {/* DROPDOWN */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded shadow-lg border z-50 max-h-96 overflow-auto">

                <div className="p-3 font-semibold border-b text-gray-700">
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
                      className={`flex items-center justify-between px-4 py-2 border-b text-sm ${n.lido ? "text-gray-400 bg-white" : "text-gray-800 bg-gray-50"
                        }`}
                    >
                      <div>
                        <p className="font-semibold text-red-700">{n.titulo || n.texto}</p>

                        {n.start && (
                          <p className="text-gray-700 text-xs">
                            {new Date(n.start).toLocaleString()}
                          </p>
                        )}

                        {n.start && (
                          <button
                            className="text-blue-600 text-xs hover:underline"
                            onClick={() => {
                              navigate(`/agenda?data=${n.start}`);
                              setShowNotifications(false);
                            }}
                          >
                            Ver no calendário
                          </button>
                        )}
                      </div>

                      {/* Botão lateral */}
                      {/* Botão lateral compacto vermelho com tooltip */}
                      {!n.lido && (
                        <button
                          onClick={() => marcarComoLido(n.id)}
                          title="Marcar como Lido"
                          className="
      ml-2 
      bg-red-500 hover:bg-red-600 
      text-white 
      rounded 
      px-1.5 py-[2px]
      text-xs
      shadow-sm
      transition
    "
                        >
                          ✓
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
              className={`${iconColor} hover:text-black flex items-center justify-center`}
              style={{ height: "20px" }}
            >
              <AppDotsIcon size={18} />
            </button>

            {showAppsMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded shadow-lg border z-50 p-3 grid grid-cols-3 gap-4">
                {[
                  { icon: "fa-truck-fast", label: "Operação" },
                  { icon: "fa-money-check-dollar", label: "Financeiro" },
                  { icon: "fa-chart-pie", label: "BI Relatórios" },
                  { icon: "fa-key", label: "Segurança" },
                  { icon: "fa-file-contract", label: "EDI" },
                  { icon: "fa-chart-column", label: "Indicadores" },
                  { icon: "fa-box", label: "Container" },
                  { icon: "fa-screwdriver-wrench", label: "Oficina" },
                  { icon: "fa-file-circle-check", label: "Baixa XML" },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    className="flex flex-col items-center text-red-700 hover:text-black text-sm"
                  >
                    <i className={`fa-solid ${item.icon} text-xl`} />
                    <span>{item.label}</span>
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
                setShowNotifications(false);
                setShowAppsMenu(false);
              }}
              className="flex items-center gap-2 text-gray-700 hover:text-black"
            >
              <UserRound className={iconColor} size={18} />
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
                  onClick={() => navigate("/parametros")}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                >
                  <Settings className={iconColor} size={16} />
                  Configuração
                </button>

                {/* CALENDÁRIO */}
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

      {showAlterarSenha && (
        <UsuarioAlterarSenha onClose={() => setShowAlterarSenha(false)} />
      )}

      {showTrocarFilial && (
        <ModalTrocarFilial open={showTrocarFilial} onClose={() => setShowTrocarFilial(false)} />
      )}
    </>
  );
}
