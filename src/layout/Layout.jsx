import { useState } from "react";
import Sidebar from "../navigation/Sidebar";
import Topbar from "../navigation/Topbar";

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Topbar fixa no topo */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Topbar />
      </div>

      {/* Área principal com sidebar + conteúdo */}
      <div className="flex flex-1 pt-[48px]">
        {/* Sidebar fixa à esquerda */}
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

        {/* Conteúdo principal */}
        <main className="flex-1 overflow-auto p-4 bg-gray-50 min-h-[calc(100vh-48px)]">
          {children}
        </main>
      </div>

      {/* Rodapé */}
      <footer className="border-t-2 border-red-700 bg-red-50 text-red-900 text-center py-1 text-[13px] font-semibold">
        Averbado em 16/10/2025 com o Nº Averbação: 05886122518022248000119570010000420050 e
        Protocolo: 05886122518022248000119570010000420050
      </footer>
    </div>
  );
}
