// src/pages/Parametro.jsx
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  CheckCircle,
  RotateCcw,
  XCircle,
  LayoutGrid,
  Palette,
  Settings2,
  Bell,
  SlidersHorizontal,
  Image as ImageIcon,
  ListChecks,
} from "lucide-react";

import { useMenuRapido } from "../context/MenuRapidoContext";
import { useIconColor } from "../context/IconColorContext";
import ParametroTaxa from "./ParametroTaxa";

export default function Parametro() {
  // =============================
  // DEFINIR MÓDULO OPERAÇÃO
  // =============================
  useEffect(() => {
    localStorage.setItem("mantran_modulo", "operacao");
  }, []);

  // =============================
  // CONTEXTOS
  // =============================
  const {
    iconColor,
    setIconColor,

    footerIconColorNormal,
    footerIconColorHover,
    setFooterIconColorNormal,
    setFooterIconColorHover,

    DEFAULT_ICON_COLOR,
    DEFAULT_FOOTER_NORMAL,
    DEFAULT_FOOTER_HOVER,
  } = useIconColor();

  const {
    atalhos,
    adicionarAtalho,
    removerAtalho,
    restaurarPadrao,
  } = useMenuRapido();

  // Opções do menu rápido (Fixo para este arquivo)
  const opcoesMenuRapido = [
    { label: "Viagem", rota: "/viagem", icone: "fa-truck-fast" },
    { label: "NFSe", rota: "/nfse", icone: "fa-file-invoice" },
    { label: "CTe", rota: "/cte", icone: "fa-file-lines" },
    { label: "Coleta", rota: "/coleta", icone: "fa-boxes-packing" },
    { label: "Manifesto", rota: "/manifesto", icone: "fa-file-contract" },
    { label: "Minuta", rota: "/minuta", icone: "fa-file-pen" },
    { label: "Veículo", rota: "/veiculo", icone: "fa-truck" },
    { label: "Motorista", rota: "/motorista", icone: "fa-id-card" },
    { label: "Agregado", rota: "/empresa-agregado", icone: "fa-people-carry-box" },
    { label: "Cliente", rota: "/cliente", icone: "fa-user-tie" },
    { label: "Fatura", rota: "/faturamento", icone: "fa-file-invoice-dollar" },
    { label: "Dashboard", rota: "/dashboard-shopee", icone: "fa-chart-line" },
  ];

  // =============================
  // CONFIGURAÇÃO DASHBOARD (NOVO)
  // =============================
  const [dashboardConfig, setDashboardConfig] = useState(() => {
    const saved = localStorage.getItem("op_dashboard_config");
    if (saved) return JSON.parse(saved);
    return {
      kpis: true,
      chartTendencia: true,
      chartPendencias: true,
      donutsDia: true,
      donutMes: true,
      donutOcorrencias: true,
      listaFila: true,
    };
  });

  const toggleDashboardItem = (key) => {
    setDashboardConfig((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // =============================
  // ESTADOS
  // =============================
  const [modoCards, setModoCards] = useState(false);
  const [exibirDashboard, setExibirDashboard] = useState(
    localStorage.getItem("param_exibirDashboard") !== "false"
  );
  const [corFundo, setCorFundo] = useState(
    localStorage.getItem("param_corFundo") || "#f3f4f6"
  );

  const [abrirModalTaxas, setAbrirModalTaxas] = useState(false);

  // ABAS (NOVO)
  const [abaAtiva, setAbaAtiva] = useState("geral"); // geral | visual | menu | notificacoes

  // =============================
  // NOTIFICAÇÕES (NOVO)
  // =============================
  // "Notificações do Operação"
  const [notifOperacao, setNotifOperacao] = useState(
    localStorage.getItem("op_notif_operacao") !== "false"
  );

  // "Notificar Vencimento de Certificados"
  const [notifCertificados, setNotifCertificados] = useState(
    localStorage.getItem("op_notif_certificados") !== "false"
  );
  const [diasAntecedenciaCert, setDiasAntecedenciaCert] = useState(
    Number(localStorage.getItem("op_notif_cert_dias") || 30)
  );

  const coresBase = [
    { value: "red", label: "Vermelho" },
    { value: "blue", label: "Azul" },
    { value: "emerald", label: "Verde" },
    { value: "amber", label: "Laranja" },
    { value: "slate", label: "Cinza" },
    { value: "pink", label: "Rosa" },
  ];

  // ================= ICONES =================
  const [corBase, setCorBase] = useState(iconColor.split("-")[1]);
  const [intensidade, setIntensidade] = useState(iconColor.split("-")[2]);

  useEffect(() => {
    if (!iconColor) return;
    const [, cor, nivel] = iconColor.split("-");
    setCorBase(cor);
    setIntensidade(nivel);
  }, [iconColor]);

  const atualizarCorIcones = (cor, nivel) => {
    const classe = `text-${cor}-${nivel}`;
    setCorBase(cor);
    setIntensidade(nivel);
    setIconColor(classe);
    localStorage.setItem("op_iconColor", classe);
  };

  // ============== RODAPÉ NORMAL =============
  const [footerBase, setFooterBase] = useState(
    footerIconColorNormal.split("-")[1]
  );
  const [footerInt, setFooterInt] = useState(
    footerIconColorNormal.split("-")[2]
  );

  useEffect(() => {
    if (!footerIconColorNormal) return;
    const [, cor, nivel] = footerIconColorNormal.split("-");
    setFooterBase(cor);
    setFooterInt(nivel);
  }, [footerIconColorNormal]);

  const atualizarRodapeNormal = (cor, nivel) => {
    const classe = `text-${cor}-${nivel}`;
    setFooterBase(cor);
    setFooterInt(nivel);
    setFooterIconColorNormal(classe);
    localStorage.setItem("op_footerNormal", classe);
  };

  // ============== RODAPÉ HOVER =============
  const [footerHoverBase, setFooterHoverBase] = useState(
    footerIconColorHover.split("-")[1]
  );
  const [footerHoverInt, setFooterHoverInt] = useState(
    footerIconColorHover.split("-")[2]
  );

  useEffect(() => {
    if (!footerIconColorHover) return;
    const [, cor, nivel] = footerIconColorHover.split("-");
    setFooterHoverBase(cor);
    setFooterHoverInt(nivel);
  }, [footerIconColorHover]);

  const atualizarRodapeHover = (cor, nivel) => {
    const classe = `text-${cor}-${nivel}`;
    setFooterHoverBase(cor);
    setFooterHoverInt(nivel);
    setFooterIconColorHover(classe);
    localStorage.setItem("op_footerHover", classe);
  };

  // =============================
  // PADRÃO (CORES)
  // =============================
  const restaurarCoresPadrao = () => {
    setIconColor(DEFAULT_ICON_COLOR);
    setFooterIconColorNormal(DEFAULT_FOOTER_NORMAL);
    setFooterIconColorHover(DEFAULT_FOOTER_HOVER);

    setCorBase(DEFAULT_ICON_COLOR.split("-")[1]);
    setIntensidade(DEFAULT_ICON_COLOR.split("-")[2]);

    setFooterBase(DEFAULT_FOOTER_NORMAL.split("-")[1]);
    setFooterInt(DEFAULT_FOOTER_NORMAL.split("-")[2]);

    setFooterHoverBase(DEFAULT_FOOTER_HOVER.split("-")[1]);
    setFooterHoverInt(DEFAULT_FOOTER_HOVER.split("-")[2]);
  };

  // =====================================
  // SALVAR / RESETAR
  // =====================================
  const salvarParametros = () => {
    localStorage.setItem("param_exibirDashboard", exibirDashboard);
    localStorage.setItem("param_corFundo", corFundo);

    // Dashboard Config
    localStorage.setItem("op_dashboard_config", JSON.stringify(dashboardConfig));

    // Notificações
    localStorage.setItem("op_notif_operacao", String(notifOperacao));
    localStorage.setItem("op_notif_certificados", String(notifCertificados));
    localStorage.setItem("op_notif_cert_dias", String(diasAntecedenciaCert));

    alert("✅ Parâmetros do Operação salvos!");
  };

  const limparParametros = () => {
    setExibirDashboard(true);
    setCorFundo("#f3f4f6");
    restaurarCoresPadrao();

    // Logo
    localStorage.removeItem("param_logoBg");
    // Notificações
    setNotifOperacao(true);
    setNotifCertificados(true);
    setDiasAntecedenciaCert(30);

    localStorage.setItem("op_notif_operacao", "true");
    localStorage.setItem("op_notif_certificados", "true");
    localStorage.setItem("op_notif_cert_dias", "30");

    // Dashboard Config Reset
    const defaultConfig = {
      kpis: true,
      chartTendencia: true,
      chartPendencias: true,
      donutsDia: true,
      donutMes: true,
      donutOcorrencias: true,
      listaFila: true,
    };
    setDashboardConfig(defaultConfig);
    localStorage.setItem("op_dashboard_config", JSON.stringify(defaultConfig));

    restaurarPadrao(); // menu rápido

    alert("Parâmetros restaurados.");
  };

  // =============================
  // COMPONENTE CARD / ABA
  // =============================
  const Card = ({ title, children }) => (
    <div className="border border-gray-300 rounded bg-white p-4 shadow-sm space-y-2">
      <h2 className="text-[14px] font-semibold text-red-700 border-b pb-1">
        {title}
      </h2>
      {children}
    </div>
  );

  const TabButton = ({ id, icon: Icon, label }) => {
    const ativo = abaAtiva === id;
    return (
      <button
        type="button"
        onClick={() => setAbaAtiva(id)}
        className={`
          px-3 py-2 text-[13px] flex items-center gap-2 border-b-2 transition
          ${ativo ? "border-red-700 text-red-700 font-semibold" : "border-transparent text-gray-600 hover:text-red-700"}
        `}
      >
        <Icon size={16} />
        {label}
      </button>
    );
  };

  // =============================
  // CONTEÚDOS POR ABA
  // =============================

  const abaGeral = (
    <>
      {/* DASHBOARD */}
      <div className="flex items-center gap-3">
        <label className="w-[160px] text-right text-sm font-medium text-gray-700">
          Exibir Dashboard:
        </label>
        <input
          type="checkbox"
          checked={exibirDashboard}
          onChange={(e) => setExibirDashboard(e.target.checked)}
        />
      </div>

      {/* TAXAS DO CTE */}
      <div className="flex items-center gap-3 mt-3">
        <label className="w-[160px] text-right text-sm font-medium text-gray-700">
          Taxas do CT-e:
        </label>
        <button
          onClick={() => setAbrirModalTaxas(true)}
          className="flex items-center gap-1 border border-gray-300 rounded px-2 py-[4px] text-red-700 hover:bg-gray-100 text-sm"
        >
          <Settings2 size={14} /> Selecionar Taxas
        </button>
      </div>

      {/* COR DE FUNDO */}
      <div className="flex items-center gap-3 mt-3">
        <label className="w-[160px] text-right text-sm font-medium">
          Cor de Fundo:
        </label>
        <input
          type="color"
          value={corFundo}
          onChange={(e) => setCorFundo(e.target.value)}
          className="w-[60px] h-[28px] border rounded"
        />
        <div className="px-4 py-2 rounded text-sm" style={{ backgroundColor: corFundo }}>
          Exemplo
        </div>
      </div>
    </>
  );

  const abaVisual = (
    <>
      {/* LOGO FUNDO */}
      <div className="flex items-center gap-3">
        <label className="w-[160px] text-right text-sm font-medium">
          Logo de Fundo:
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
              localStorage.setItem("param_logoBg", reader.result);
              alert("✅ Logo salva com sucesso!");
            };
            reader.readAsDataURL(file);
          }}
          className="text-[13px]"
        />

        <button
          type="button"
          className="text-xs border px-2 py-[2px] rounded text-red-700 hover:bg-gray-100"
          onClick={() => {
            localStorage.removeItem("param_logoBg");
            alert("Logo removida.");
          }}
        >
          Remover
        </button>
      </div>

      {/* ICONES */}
      <div className="flex items-center gap-3 mt-3">
        <label className="w-[160px] text-right text-sm font-medium text-gray-700">
          Cor dos Ícones:
        </label>
        <select
          value={corBase}
          onChange={(e) => atualizarCorIcones(e.target.value, intensidade)}
          className="border rounded px-2 py-[4px] text-[13px]"
        >
          {coresBase.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <input
          type="range"
          min="100"
          max="900"
          step="100"
          value={intensidade}
          onChange={(e) => atualizarCorIcones(corBase, e.target.value)}
        />
        <Palette size={20} className={`text-${corBase}-${intensidade}`} />
        <button
          type="button"
          onClick={() => atualizarCorIcones("red", "700")}
          className="text-xs text-red-700 hover:text-red-900 underline ml-2"
        >
          Padrão
        </button>
      </div>

      {/* RODAPÉ NORMAL */}
      <div className="flex items-center gap-3 mt-3">
        <label className="w-[160px] text-right text-sm font-medium text-gray-700">
          Rodapé (Normal):
        </label>
        <select
          value={footerBase}
          onChange={(e) => atualizarRodapeNormal(e.target.value, footerInt)}
          className="border rounded px-2 py-[4px] text-[13px]"
        >
          {coresBase.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <input
          type="range"
          min="100"
          max="900"
          step="100"
          value={footerInt}
          onChange={(e) => atualizarRodapeNormal(footerBase, e.target.value)}
        />
        <Palette size={20} className={`text-${footerBase}-${footerInt}`} />
      </div>

      {/* RODAPÉ HOVER */}
      <div className="flex items-center gap-3 mt-3">
        <label className="w-[160px] text-right text-sm font-medium text-gray-700">
          Rodapé (Hover):
        </label>
        <select
          value={footerHoverBase}
          onChange={(e) => atualizarRodapeHover(e.target.value, footerHoverInt)}
          className="border rounded px-2 py-[4px] text-[13px]"
        >
          {coresBase.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <input
          type="range"
          min="100"
          max="900"
          step="100"
          value={footerHoverInt}
          onChange={(e) => atualizarRodapeHover(footerHoverBase, e.target.value)}
        />
        <Palette size={20} className={`text-${footerHoverBase}-${footerHoverInt}`} />
      </div>
    </>
  );

  const abaMenuRapido = (
    <div className="border border-gray-300 rounded bg-white p-3 shadow-inner h-[50vh] overflow-y-auto mt-2">
      <div className="grid grid-cols-2 gap-2">
        {opcoesMenuRapido.map((op, idx) => {
          const ativo = atalhos.some((a) => a.rota === op.rota);
          return (
            <label
              key={idx}
              className={`
                flex items-center gap-2 p-2 rounded cursor-pointer text-sm border
                ${ativo ? "bg-red-50 border-red-300" : "bg-white border-gray-200 hover:bg-gray-50"}
              `}
            >
              <input
                type="checkbox"
                checked={ativo}
                onChange={(e) => {
                  if (e.target.checked) {
                    adicionarAtalho({ ...op, id: Date.now() });
                  } else {
                    removerAtalho(op.rota);
                  }
                }}
              />
              <i className={`fa-solid ${op.icone} text-gray-700`} />
              <span className="flex-1">{op.label}</span>
            </label>
          );
        })}
      </div>
      <div className="mt-2 text-right">
        <button
          type="button"
          onClick={restaurarPadrao}
          className="text-xs text-red-700 hover:text-red-900 underline"
        >
          Restaurar Padrão
        </button>
      </div>
    </div>
  );

  const abaDashboard = (
    <div className="border border-gray-300 rounded bg-white p-4 shadow-sm space-y-3">
      <h2 className="text-[14px] font-semibold text-red-700 border-b pb-2 flex items-center gap-2">
        <LayoutGrid size={16} /> Configuração do Dashboard
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
          <input
            type="checkbox"
            checked={dashboardConfig.kpis}
            onChange={() => toggleDashboardItem("kpis")}
          />
          KPIs (Cards Superiores)
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
          <input
            type="checkbox"
            checked={dashboardConfig.chartTendencia}
            onChange={() => toggleDashboardItem("chartTendencia")}
          />
          Gráfico: Tendência CT-e
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
          <input
            type="checkbox"
            checked={dashboardConfig.chartPendencias}
            onChange={() => toggleDashboardItem("chartPendencias")}
          />
          Gráfico: Pendências por Tipo
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
          <input
            type="checkbox"
            checked={dashboardConfig.donutsDia}
            onChange={() => toggleDashboardItem("donutsDia")}
          />
          Gráficos: Totais do Dia
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
          <input
            type="checkbox"
            checked={dashboardConfig.donutMes}
            onChange={() => toggleDashboardItem("donutMes")}
          />
          Gráfico: CT-e do Mês
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
          <input
            type="checkbox"
            checked={dashboardConfig.donutOcorrencias}
            onChange={() => toggleDashboardItem("donutOcorrencias")}
          />
          Gráfico: Ocorrências
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
          <input
            type="checkbox"
            checked={dashboardConfig.listaFila}
            onChange={() => toggleDashboardItem("listaFila")}
          />
          Lista: Fila de Pendências
        </label>
      </div>
    </div>
  );

  const abaNotificacoes = (
    <div className="border border-gray-300 rounded bg-white p-4 shadow-sm space-y-3">
      <h2 className="text-[14px] font-semibold text-red-700 border-b pb-2 flex items-center gap-2">
        <Bell size={16} /> Notificações do Operação
      </h2>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={notifOperacao}
          onChange={(e) => setNotifOperacao(e.target.checked)}
        />
        Notificações do Operação
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={notifCertificados}
          onChange={(e) => setNotifCertificados(e.target.checked)}
        />
        Notificar vencimento de certificados
      </label>

      <div className="flex items-center gap-3 text-sm">
        <span className="w-[160px] text-right font-medium text-gray-700">
          Avisar com:
        </span>
        <input
          type="number"
          className="border border-gray-300 rounded h-8 px-2 text-sm text-right w-[90px]"
          value={diasAntecedenciaCert}
          min={0}
          onChange={(e) => setDiasAntecedenciaCert(Number(e.target.value) || 0)}
        />
        <span className="text-gray-600">dias de antecedência</span>
      </div>
    </div>
  );

  const camposPorAba = (
    <>
      {abaAtiva === "geral" && abaGeral}
      {abaAtiva === "visual" && abaVisual}
      {abaAtiva === "menu" && abaMenuRapido}
      {abaAtiva === "dashboard" && abaDashboard}
      {abaAtiva === "notificacoes" && abaNotificacoes}
    </>
  );

  // =============================
  // RENDER FINAL
  // =============================
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-[720px] bg-gray-100 rounded shadow-lg border border-gray-300 flex flex-col">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-red-700 to-black text-white px-4 py-2 rounded-t flex items-center justify-between">
          <h1 className="text-sm font-semibold flex items-center gap-2">
            <Settings2 size={16} /> PARÂMETROS DO OPERAÇÃO
          </h1>

          <button
            onClick={() => window.history.back()}
            className="hover:text-gray-300 flex items-center gap-1"
          >
            <XCircle size={18} /> Fechar
          </button>
        </div>

        {/* ABAS */}
        <div className="bg-white border-b border-gray-300 px-2 flex gap-1">
          <TabButton id="geral" icon={SlidersHorizontal} label="Geral" />
          <TabButton id="visual" icon={ImageIcon} label="Visual" />
          <TabButton id="menu" icon={ListChecks} label="Menu Rápido" />
          <TabButton id="dashboard" icon={LayoutGrid} label="Dashboard" />
          <TabButton id="notificacoes" icon={Bell} label="Notificações" />
        </div>

        {/* MODO CARDS */}
        <div className="flex justify-end p-2 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={modoCards}
              onChange={(e) => setModoCards(e.target.checked)}
            />
            <LayoutGrid size={16} className="text-red-700" />
            Exibir por Cards
          </label>
        </div>

        {/* CONTEÚDO */}
        <div className="p-4 overflow-auto max-h-[70vh]">
          {modoCards ? (
            <div className="space-y-3">
              <Card title="Configurações">{camposPorAba}</Card>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setModoCards(false)}
                  className="flex items-center gap-1 text-sm text-gray-700 hover:text-red-700"
                >
                  <ChevronLeft size={14} /> Voltar
                </button>

                <button
                  type="button"
                  onClick={salvarParametros}
                  className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  <CheckCircle size={14} /> Salvar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">{camposPorAba}</div>
          )}
        </div>

        {/* RODAPÉ */}
        <div className="flex justify-between bg-white px-4 py-2 border-t rounded-b">
          <button
            type="button"
            onClick={limparParametros}
            className="text-red-700 hover:text-red-800 text-sm flex items-center gap-1"
          >
            <RotateCcw size={14} /> Limpar
          </button>

          {!modoCards && (
            <button
              type="button"
              onClick={salvarParametros}
              className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
            >
              <CheckCircle size={14} /> Salvar
            </button>
          )}
        </div>
      </div>

      {abrirModalTaxas && (
        <ParametroTaxa onClose={() => setAbrirModalTaxas(false)} />
      )}
    </div>
  );
}
