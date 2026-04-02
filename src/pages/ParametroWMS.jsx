// src/pages/ParametroWMS.jsx
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

import {
    ChevronLeft,
    CheckCircle,
    RotateCcw,
    XCircle,
    LayoutGrid,
    Palette,
    Settings2,
} from "lucide-react";

import { useIconColor } from "../context/IconColorContext";
import { useMenuRapidoWMS } from "../context/MenuRapidoWMSContext";

export default function ParametroWMS({ onClose }) {
    const navigate = useNavigate();

    // =============================
    // DEFINIR MÓDULO WMS ATIVO
    // =============================
    useEffect(() => {
        localStorage.setItem("mantran_modulo", "wms");
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

        DEFAULT_ICON_COLOR,
        DEFAULT_FOOTER_NORMAL,
        DEFAULT_FOOTER_HOVER,
    } = useIconColor();

    const {
        atalhos,
        adicionarAtalho,
        removerAtalho,
        restaurarPadrao,
        CATALOGO_WMS,
    } = useMenuRapidoWMS();

    // =============================
    // ESTADOS
    // =============================
    const [modoCards, setModoCards] = useState(false);
    const [exibirDashboard, setExibirDashboard] = useState(true);
    const [corFundo, setCorFundo] = useState("#f3f4f6");
    const [showMenuRapido, setShowMenuRapido] = useState(false);

    // =============================
    // CORES BASE
    // =============================
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

    const atualizarCorIcones = (cor, nivel) => {
        const classe = `text-${cor}-${nivel}`;
        setCorBase(cor);
        setIntensidade(nivel);
        setIconColor(classe);
        localStorage.setItem("wms_iconColor", classe);
    };

    const restaurarIconesPadrao = () => {
        setIconColor(DEFAULT_ICON_COLOR);
        setCorBase(DEFAULT_ICON_COLOR.split("-")[1]);
        setIntensidade(DEFAULT_ICON_COLOR.split("-")[2]);
        localStorage.setItem("wms_iconColor", DEFAULT_ICON_COLOR);
    };

    // ============== RODAPÉ NORMAL ==============
    const [footerBase, setFooterBase] = useState(footerIconColorNormal.split("-")[1]);
    const [footerInt, setFooterInt] = useState(footerIconColorNormal.split("-")[2]);

    const atualizarRodapeNormal = (cor, nivel) => {
        const classe = `text-${cor}-${nivel}`;
        setFooterBase(cor);
        setFooterInt(nivel);
        setFooterIconColorNormal(classe);
        localStorage.setItem("wms_footerNormal", classe);
    };

    const restaurarRodapeNormalPadrao = () => {
        setFooterIconColorNormal(DEFAULT_FOOTER_NORMAL);
        setFooterBase(DEFAULT_FOOTER_NORMAL.split("-")[1]);
        setFooterInt(DEFAULT_FOOTER_NORMAL.split("-")[2]);
        localStorage.setItem("wms_footerNormal", DEFAULT_FOOTER_NORMAL);
    };

    // ============== RODAPÉ HOVER ===============
    const [footerHoverBase, setFooterHoverBase] = useState(
        footerIconColorHover.split("-")[1]
    );
    const [footerHoverInt, setFooterHoverInt] = useState(
        footerIconColorHover.split("-")[2]
    );

    const atualizarRodapeHover = (cor, nivel) => {
        const classe = `text-${cor}-${nivel}`;
        setFooterHoverBase(cor);
        setFooterHoverInt(nivel);
        setFooterIconColorHover(classe);
        localStorage.setItem("wms_footerHover", classe);
    };

    const restaurarRodapeHoverPadrao = () => {
        setFooterIconColorHover(DEFAULT_FOOTER_HOVER);
        setFooterHoverBase(DEFAULT_FOOTER_HOVER.split("-")[1]);
        setFooterHoverInt(DEFAULT_FOOTER_HOVER.split("-")[2]);
        localStorage.setItem("wms_footerHover", DEFAULT_FOOTER_HOVER);
    };

    // =============================
    // SALVAR / LIMPAR
    // =============================
    const salvar = () => {
        localStorage.setItem("wms_exibirDashboard", exibirDashboard);
        localStorage.setItem("wms_corFundo", corFundo);
        alert("Parâmetros do WMS salvos!");
    };

    const limpar = () => {
        setExibirDashboard(true);
        setCorFundo("#f3f4f6");

        restaurarIconesPadrao();
        restaurarRodapeNormalPadrao();
        restaurarRodapeHoverPadrao();

        restaurarPadrao();
        alert("Parâmetros do WMS restaurados.");
    };

    // =============================
    // CARD
    // =============================
    const Card = ({ title, children }) => (
        <div className="border border-gray-300 rounded bg-white p-4 shadow-sm space-y-2">
            <h2 className="text-[14px] font-semibold text-red-700 border-b pb-1">
                {title}
            </h2>
            {children}
        </div>
    );

    // =============================
    // CAMPOS
    // =============================
    const campos = (
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

            {/* MENU RÁPIDO */}
            <div className="mt-4 flex items-start gap-3">
                <label className="w-[160px] text-right text-sm font-medium text-gray-700 pt-1">
                    Menu Rápido:
                </label>

                <div className="relative flex-1">
                    <button
                        onClick={() => setShowMenuRapido((prev) => !prev)}
                        className="w-full border border-gray-300 rounded px-3 py-[6px] bg-white text-left text-sm flex justify-between items-center"
                    >
                        Selecionar Atalhos
                        <span className="text-gray-500">▼</span>
                    </button>

                    {showMenuRapido && (
                        <div className="absolute z-50 bg-white border border-gray-300 rounded w-full mt-1 shadow-lg max-h-32 overflow-y-auto p-2">
                            {CATALOGO_WMS.map((op) => {
                                const ativo = atalhos.some((a) => a.rota === op.rota);
                                return (
                                    <label
                                        key={op.id}
                                        className="flex items-center gap-2 p-1 hover:bg-gray-100 cursor-pointer text-sm"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={ativo}
                                            onChange={(e) =>
                                                e.target.checked
                                                    ? adicionarAtalho(op)
                                                    : removerAtalho(op.rota)
                                            }
                                        />
                                        <i className={`fa-solid ${op.icone}`} />
                                        {op.label}
                                    </label>
                                );
                            })}
                        </div>
                    )}
                </div>

                <button
                    onClick={restaurarPadrao}
                    className="text-xs text-red-700 hover:text-red-900 underline mt-[6px]"
                >
                    Restaurar Padrão
                </button>
            </div>

            {/* COR DOS ÍCONES */}
            <div className="flex items-center gap-3 mt-4">
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
                    onClick={restaurarIconesPadrao}
                    className="text-xs border px-2 py-[2px] rounded hover:bg-gray-100"
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

                <button
                    onClick={restaurarRodapeNormalPadrao}
                    className="text-xs border px-2 py-[2px] rounded hover:bg-gray-100"
                >
                    Padrão
                </button>
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
                    onChange={(e) =>
                        atualizarRodapeHover(footerHoverBase, e.target.value)
                    }
                />

                <Palette size={20} className={`text-${footerHoverBase}-${footerHoverInt}`} />

                <button
                    onClick={restaurarRodapeHoverPadrao}
                    className="text-xs border px-2 py-[2px] rounded hover:bg-gray-100"
                >
                    Padrão
                </button>
            </div>
        </>
    );

    // =============================
    // RENDER
    // =============================
    return createPortal(
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
            <div className="w-[720px] bg-gray-100 rounded shadow-lg border border-gray-300 flex flex-col">
                <div className="bg-gradient-to-r from-red-700 to-black text-white px-4 py-2 rounded-t flex items-center justify-between">
                    <h1 className="text-sm font-semibold flex items-center gap-2">
                        <Settings2 size={16} /> PARÂMETROS DO WMS
                    </h1>

                    <button
                        onClick={handleClose}
                        className="hover:text-gray-300 flex items-center gap-1"
                    >
                        <XCircle size={18} /> Fechar
                    </button>
                </div>

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

                <div className="p-4 overflow-auto max-h-[70vh]">
                    {modoCards ? (
                        <div className="space-y-3">
                            <Card title="Configurações">{campos}</Card>

                            <div className="flex justify-between">
                                <button
                                    onClick={() => setModoCards(false)}
                                    className="flex items-center gap-1 text-sm text-gray-700 hover:text-red-700"
                                >
                                    <ChevronLeft size={14} /> Voltar
                                </button>

                                <button
                                    onClick={salvar}
                                    className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                >
                                    <CheckCircle size={14} /> Salvar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">{campos}</div>
                    )}
                </div>

                <div className="flex justify-between bg-white px-4 py-2 border-t rounded-b">
                    <button
                        onClick={limpar}
                        className="text-red-700 hover:text-red-800 text-sm flex items-center gap-1"
                    >
                        <RotateCcw size={14} /> Limpar
                    </button>

                    {!modoCards && (
                        <button
                            onClick={salvar}
                            className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                        >
                            <CheckCircle size={14} /> Salvar
                        </button>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
