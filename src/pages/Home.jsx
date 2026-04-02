import { useState } from "react";
import Dashboard from "../pages/Dashboard"; // ✅ caminho correto
import {
  Bell,
  Menu,
  Truck,
  FileSpreadsheet,
  FileText,
  ClipboardList,
  FileStack,
  ChevronDown,
  UserRound,
  Lock,
  Building2,
  RefreshCcw,
  Image as ImageIcon,
  CheckCircle,
} from "lucide-react";
import Logo from "../assets/logo_mantran.png";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Nova viagem registrada", read: false },
    { id: 2, text: "CT-e autorizado com sucesso", read: false },
    { id: 3, text: "Coleta atribuída ao motorista", read: false },
  ]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // ✅ Controle do Dashboard
  const [showDashboard, setShowDashboard] = useState(
    localStorage.getItem("hideDashboard") !== "true"
  );

  return (
    <div className="w-screen h-screen flex flex-col bg-gradient-to-b from-gray-50 via-white to-gray-200 overflow-hidden">
      {/* HEADER */}
      <header className="w-full bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6 py-2 fixed top-0 left-0 z-50">
        <div className="flex items-center gap-3">
          <button
            className="p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="text-gray-700" size={22} />
          </button>
          <img src={Logo} alt="Mantran Logo" className="h-8" />
        </div>

        <nav className="flex items-center gap-8 text-sm text-red-700 font-medium ml-6 flex-grow">
          <div className="flex flex-col items-center cursor-pointer hover:text-red-800">
            <Truck size={22} />
            <span>Viagem</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:text-red-800">
            <FileSpreadsheet size={22} />
            <span>NFSe</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:text-red-800">
            <FileText size={22} />
            <span>CTe</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:text-red-800">
            <ClipboardList size={22} />
            <span>Coleta</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:text-red-800">
            <FileStack size={22} />
            <span>Manifesto</span>
          </div>
        </nav>

        <div className="flex items-center gap-6">
          <div className="relative">
            <button
              className="p-2 hover:bg-gray-100 rounded-full relative"
              onClick={() => setNotifOpen(!notifOpen)}
            >
              <Bell className="text-red-700" size={22} />
              {notifications.some((n) => !n.read) && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg border border-gray-200 rounded-lg z-50">
                <div className="p-2 text-gray-700 font-semibold border-b text-sm">
                  Notificações
                </div>
                <ul className="max-h-60 overflow-y-auto text-sm">
                  {notifications.map((n) => (
                    <li
                      key={n.id}
                      className={`p-3 flex items-center justify-between gap-2 hover:bg-gray-50 ${
                        n.read ? "text-gray-400" : "text-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Bell
                          size={16}
                          className={n.read ? "text-gray-400" : "text-red-700"}
                        />
                        {n.text}
                      </div>
                      {!n.read && (
                        <button
                          className="text-xs text-red-700 hover:text-red-800 flex items-center gap-1"
                          onClick={() => markAsRead(n.id)}
                        >
                          <CheckCircle size={14} /> Lido
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
                <button
                  className="text-xs w-full text-center py-2 border-t hover:bg-gray-50 text-red-700 font-medium"
                  onClick={markAllAsRead}
                >
                  ✅ Marcar todas como lidas
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              className="flex items-center gap-2 text-sm text-gray-800 font-semibold hover:text-red-700"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <UserRound className="text-red-700" size={18} />
              SUPORTE
              <ChevronDown size={16} className="text-gray-500" />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-md z-50">
                <ul className="text-sm text-gray-700">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                    <RefreshCcw className="text-red-700" size={16} /> Trocar Usuário
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                    <Building2 className="text-red-700" size={16} /> Trocar Filial
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                    <Lock className="text-red-700" size={16} /> Alterar Senha
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                    <ImageIcon className="text-red-700" size={16} /> Alterar Foto
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
  <CheckCircle className="text-red-700" size={16} /> Configuração
</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 pt-14 flex justify-center items-center text-gray-500 italic relative">
        {showDashboard ? (
          <Dashboard
            onClose={() => {
              setShowDashboard(false);
              if (document.getElementById("hideDashboardFlag")?.checked) {
                localStorage.setItem("hideDashboard", "true");
              }
            }}
          />
        ) : (
          <span>Selecione uma opção acima para começar</span>
        )}
      </main>
    </div>
  );
}
