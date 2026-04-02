// src/pages/ParametroOficina.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

import { useIconColor } from "../context/IconColorContext";
import { useMenuRapidoOficina } from "../context/MenuRapidoOficinaContext";

export default function ParametroOficina({ onClose }) {
    const navigate = useNavigate();

    // =============================
    // DEFINIR MÓDULO OFICINA ATIVO
    // =============================
    useEffect(() => {
        localStorage.setItem("mantran_modulo", "oficina");
    }, []);

    const handleClose = () => {
        if (onClose) onClose();
        else navigate(-1);
    };

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

        backgroundImage,
        setBackgroundImage,

        // Usaremos defaults locais para este componente, pois o Context pode ter 'orange'
        // Mas o usuário pediu Blue para esta tela/módulo agora.
    } = useIconColor();

    const {
        atalhos,
        adicionarAtalho,
        removerAtalho,
        restaurarPadrao,
        CATALOGO_OFICINA,
    } = useMenuRapidoOficina();

    // DEFAULTS ESPECÍFICOS SOLICITADOS PELO USUÁRIO
    const DEFAULT_OFICINA_ICON = "text-blue-700";
    const DEFAULT_OFICINA_FOOTER_NORMAL = "text-blue-700";
    const DEFAULT_OFICINA_FOOTER_HOVER = "text-blue-900";

    // =============================
    // ESTADOS
    // =============================
    const [modoCards, setModoCards] = useState(false);
    const [exibirDashboard, setExibirDashboard] = useState(true);
    const [corFundo, setCorFundo] = useState("#f3f4f6");

    // =============================
    // ABAS
    // =============================
    const [abaAtiva, setAbaAtiva] = useState("geral"); // geral | visual | menu | dashboard | notificacoes

    // =============================
    // CONFIG DASHBOARD (NOVO)
    // =============================
    const [dashboardConfig, setDashboardConfig] = useState(() => {
        const saved = localStorage.getItem("ofi_dashboard_config");
        if (saved) return JSON.parse(saved);
        return {
            kpis: true,
            chartConsumo: true,
            chartServicos: true,
            bombaInterna: true,
            donutStatusOS: true,
            desvioVeiculo: true,
            agendamentos: true,
            custoMensal: true,
            servicosRecentes: true,
        };
    });

    const toggleDashboardItem = (key) => {
        setDashboardConfig((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    // =============================
    // NOTIFICAÇÕES (Parametros Exemplo)
    // =============================
    const [notifManutencoes, setNotifManutencoes] = useState(true);
    const [notifEstoqueBaixo, setNotifEstoqueBaixo] = useState(true);

    const coresBase = [
        { value: "red", label: "Vermelho" },
        { value: "blue", label: "Azul" },
        { value: "emerald", label: "Verde" },
        { value: "amber", label: "Laranja" },
        { value: "slate", label: "Cinza" },
        { value: "pink", label: "Rosa" },
        { value: "indigo", label: "Índigo" },
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
        // Persiste com prefixo da oficina (já tratado no Context pelo mantran_modulo, mas garantindo)
        localStorage.setItem("oficina_iconColor", classe);
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
        localStorage.setItem("oficina_footerNormal", classe);
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
        localStorage.setItem("oficina_footerHover", classe);
    };

    // =============================
    // PADRÃO (CORES)
    // =============================
    const restaurarCoresPadrao = () => {
        // Restaura para os Roxo/Azul solicitados
        setIconColor(DEFAULT_OFICINA_ICON);
        setFooterIconColorNormal(DEFAULT_OFICINA_FOOTER_NORMAL);
        setFooterIconColorHover(DEFAULT_OFICINA_FOOTER_HOVER);

        setCorBase("blue");
        setIntensidade("700");

        setFooterBase("blue");
        setFooterInt("700");

        setFooterHoverBase("blue");
        setFooterHoverInt("900");
    };

    // =====================================
    // SALVAR / RESETAR
    // =====================================
    const salvar = () => {
        localStorage.setItem("oficina_exibirDashboard", exibirDashboard);
        localStorage.setItem("oficina_corFundo", corFundo);
        // Dashboard Config
        localStorage.setItem("ofi_dashboard_config", JSON.stringify(dashboardConfig));
        alert("Parâmetros da Oficina salvos!");
    };

    const limpar = () => {
        setExibirDashboard(true);
        setCorFundo("#f3f4f6");
        restaurarCoresPadrao();
        setBackgroundImage(null);
        restaurarPadrao(); // menu rápido
        // Dashboard Config Reset
        const defaultConfig = {
            kpis: true,
            chartConsumo: true,
            chartServicos: true,
            bombaInterna: true,
            donutStatusOS: true,
            desvioVeiculo: true,
            agendamentos: true,
            custoMensal: true,
            servicosRecentes: true,
        };
        setDashboardConfig(defaultConfig);
        localStorage.setItem("ofi_dashboard_config", JSON.stringify(defaultConfig));
        alert("Parâmetros restaurados.");
    };

    // =============================
    // COMPONENTS
    // =============================
    const TabButton = ({ id, icon: Icon, label }) => {
        const ativo = abaAtiva === id;
        return (
            <button
                type="button"
                onClick={() => setAbaAtiva(id)}
                className={`
          px-3 py-2 text-[13px] flex items-center gap-2 border-b-2 transition
          ${ativo ? "border-blue-700 text-blue-700 font-semibold" : "border-transparent text-gray-600 hover:text-blue-700"}
        `}
            >
                <Icon size={16} />
                {label}
            </button>
        );
    };

    const abaGeral = (
        <>
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

            <div className="flex items-center gap-3">
                <label className="w-[160px] text-right text-sm font-medium">
                    Cor de Fundo:
                </label>
                <input
                    type="color"
                    value={corFundo}
                    onChange={(e) => setCorFundo(e.target.value)}
                    className="w-[60px] h-[28px] border rounded"
                />
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
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = () => setBackgroundImage(reader.result);
                            reader.readAsDataURL(file);
                        }
                    }}
                />
                <button
                    type="button"
                    className="text-xs border px-2 py-[2px] rounded text-red-700"
                    onClick={() => setBackgroundImage(null)}
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
                        <option key={c.value} value={c.value}>{c.label}</option>
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
                    onClick={restaurarCoresPadrao}
                    className="text-xs text-blue-700 hover:text-blue-900 underline ml-2"
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
                        <option key={c.value} value={c.value}>{c.label}</option>
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
                        <option key={c.value} value={c.value}>{c.label}</option>
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
        <div className="flex items-start gap-3 mt-2">
            <div className="flex-1">
                <div className="border border-gray-300 rounded bg-white p-3 shadow-inner h-[50vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-2">
                        {CATALOGO_OFICINA.map((op) => {
                            const rotaNormalizada = op.rota?.startsWith("/modulo-oficina")
                                ? op.rota
                                : `/modulo-oficina${op.rota?.startsWith("/") ? op.rota : `/${op.rota || ""}`}`;

                            const ativo = atalhos.some((a) => a.rota === rotaNormalizada);

                            return (
                                <label
                                    key={op.id}
                                    className={`
                                        flex items-center gap-2 p-2 rounded cursor-pointer text-sm border
                                        ${ativo ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200 hover:bg-gray-50"}
                                    `}
                                >
                                    <input
                                        type="checkbox"
                                        checked={ativo}
                                        onChange={(e) => {
                                            if (e.target.checked) adicionarAtalho(op);
                                            else removerAtalho(rotaNormalizada);
                                        }}
                                    />
                                    <i className={`fa-solid ${op.icone} text-gray-700`} />
                                    <span className="flex-1">{op.label}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
                <div className="mt-2 text-right">
                    <button
                        type="button"
                        onClick={restaurarPadrao}
                        className="text-xs text-blue-700 hover:text-blue-900 underline"
                    >
                        Restaurar Padrão
                    </button>
                </div>
            </div>
        </div>
    );

    const abaNotificacoes = (
        <div className="border border-gray-300 rounded bg-white p-4 shadow-sm space-y-3">
            <h2 className="text-[14px] font-semibold text-blue-700 border-b pb-2 flex items-center gap-2">
                <Bell size={16} /> Notificações da Oficina
            </h2>
            <label className="flex items-center gap-2 text-sm">
                <input
                    type="checkbox"
                    checked={notifManutencoes}
                    onChange={(e) => setNotifManutencoes(e.target.checked)}
                />
                Notificar manutenções preventivas vencendo
            </label>
            <label className="flex items-center gap-2 text-sm">
                <input
                    type="checkbox"
                    checked={notifEstoqueBaixo}
                    onChange={(e) => setNotifEstoqueBaixo(e.target.checked)}
                />
                Notificar estoque mínimo atingido
            </label>
        </div>
    );

    const abaDashboard = (
        <div className="border border-gray-300 rounded bg-white p-4 shadow-sm space-y-3">
            <h2 className="text-[14px] font-semibold text-blue-700 border-b pb-2 flex items-center gap-2">
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
                        checked={dashboardConfig.chartConsumo}
                        onChange={() => toggleDashboardItem("chartConsumo")}
                    />
                    Gráfico: Consumo de Combustível
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input
                        type="checkbox"
                        checked={dashboardConfig.chartServicos}
                        onChange={() => toggleDashboardItem("chartServicos")}
                    />
                    Gráfico: Serviços por Tipo
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input
                        type="checkbox"
                        checked={dashboardConfig.bombaInterna}
                        onChange={() => toggleDashboardItem("bombaInterna")}
                    />
                    Bomba Interna
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input
                        type="checkbox"
                        checked={dashboardConfig.donutStatusOS}
                        onChange={() => toggleDashboardItem("donutStatusOS")}
                    />
                    Donut: Status das OS
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input
                        type="checkbox"
                        checked={dashboardConfig.desvioVeiculo}
                        onChange={() => toggleDashboardItem("desvioVeiculo")}
                    />
                    Consumo: Desvio por Veículo
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input
                        type="checkbox"
                        checked={dashboardConfig.agendamentos}
                        onChange={() => toggleDashboardItem("agendamentos")}
                    />
                    Próximos Agendamentos
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input
                        type="checkbox"
                        checked={dashboardConfig.custoMensal}
                        onChange={() => toggleDashboardItem("custoMensal")}
                    />
                    Custo Mensal (Oficina)
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input
                        type="checkbox"
                        checked={dashboardConfig.servicosRecentes}
                        onChange={() => toggleDashboardItem("servicosRecentes")}
                    />
                    Serviços Recentes
                </label>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="w-[720px] bg-gray-100 rounded shadow-lg border border-gray-300 flex flex-col">
                {/* HEADER */}
                <div className="bg-gradient-to-r from-blue-800 to-black text-white px-4 py-2 rounded-t flex items-center justify-between">
                    <h1 className="text-sm font-semibold flex items-center gap-2">
                        <Settings2 size={16} /> PARÂMETROS DA OFICINA
                    </h1>
                    <button onClick={handleClose} className="hover:text-gray-300 flex items-center gap-1">
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

                {/* CONTEÚDO */}
                <div className="p-4 overflow-auto max-h-[70vh]">
                    <div className="space-y-3">
                        {abaAtiva === "geral" && abaGeral}
                        {abaAtiva === "visual" && abaVisual}
                        {abaAtiva === "menu" && abaMenuRapido}
                        {abaAtiva === "dashboard" && abaDashboard}
                        {abaAtiva === "notificacoes" && abaNotificacoes}
                    </div>
                </div>

                {/* RODAPÉ */}
                <div className="flex justify-between bg-white px-4 py-2 border-t rounded-b">
                    <button
                        type="button"
                        onClick={limpar}
                        className="text-red-700 hover:text-red-800 text-sm flex items-center gap-1"
                    >
                        <RotateCcw size={14} /> Limpar
                    </button>
                    <button
                        type="button"
                        onClick={salvar}
                        className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                    >
                        <CheckCircle size={14} /> Salvar
                    </button>
                </div>
            </div>
        </div>
    );
}
