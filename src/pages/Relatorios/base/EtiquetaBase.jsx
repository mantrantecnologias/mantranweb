// src/pages/Relatorios/base/EtiquetaBase.jsx
import { useEffect, useMemo, useRef, useState } from "react";

/* =========================================================
   HELPERS
========================================================= */
function clamp(n, a, b) {
    return Math.min(Math.max(n, a), b);
}

function uid() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function onlyDigits(s) {
    return String(s || "").replace(/\D/g, "");
}

/* =========================================================
   PERSISTÊNCIA (localStorage) - por reportKey + templateId + labelKind
========================================================= */
function storageKey(reportKey, templateId, labelKind) {
    return `mantran_etiqueta_preset__${reportKey || "default"}__${templateId || "default"}__${labelKind || "default"}`;
}

function loadPreset(reportKey, templateId, labelKind) {
    try {
        const raw = localStorage.getItem(storageKey(reportKey, templateId, labelKind));
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function savePreset(reportKey, templateId, labelKind, preset) {
    try {
        localStorage.setItem(storageKey(reportKey, templateId, labelKind), JSON.stringify(preset));
    } catch {
        // ignora
    }
}

function deletePreset(reportKey, templateId, labelKind) {
    try {
        localStorage.removeItem(storageKey(reportKey, templateId, labelKind));
    } catch {
        // ignora
    }
}

/* =========================================================
   EtiquetaBase
   - preview/print de etiquetas (HTML)
   - tamanho variável (mm) configurável no modal
   - layout padrão vs personalizado
   - campos por zonas (group) + drag
   - passa logo para o template (igual DocumentoBase)
   - ✅ layout alinhado ao Sidebar igual DocumentoBase
========================================================= */
export default function EtiquetaBase({
    reportKey = "etiquetas.base",

    // identificação do template (ex: "100x150", "80x50")
    templateId = "default",

    // tipo de etiqueta (ex: "barcode" | "qrcode")
    labelKind = "default",

    // tamanho inicial vindo do relatório/tela (default)
    labelConfig = {
        widthMm: 100,
        heightMm: 150,
        gapMm: 0,
        marginMm: 0,
        dpi: 203,
    },

    // logo (base64/url) opcional
    logo = "",

    // template:
    // {
    //   fieldsCatalog: [{ id, label, group?, required? }],
    //   defaultVisibleFieldIds?: [...],
    //   zones?: [{ id, label }],
    //   defaultOptions?: { ... },
    //   renderLabel: ({ item, index, total, visibleFieldIds, options, zones, activeFieldsByZone, labelConfig, logo, labelKind }) => JSX
    // }
    template,

    // lista de etiquetas (cada item = 1 etiqueta)
    items = [],

    // callbacks
    onClose,
    onBeforePrint,
    onAfterPrint,

    /* =========================
       ✅ LAYOUT (igual DocumentoBase)
    ========================= */
    topOffsetPx = 56,
    stickyTopPx = 32,
    sidebarOffsetPx = undefined,

    sidebarOpen, // boolean (recebe o mesmo "open" do seu layout)
    sidebarWidthOpen = 208, // w-52 do Sidebar.jsx
    sidebarWidthClosed = 56, // w-14 do Sidebar.jsx
    sidebarGutterPx = 16, // ✅ aproxima do sidebar (mesmo padrão do DocumentoBase)
}) {
    const scrollRef = useRef(null);

    const presetLoaded = useMemo(
        () => loadPreset(reportKey, templateId, labelKind),
        [reportKey, templateId, labelKind]
    );

    const fieldsCatalog = useMemo(() => template?.fieldsCatalog || [], [template]);

    const defaultVisibleFieldIds = useMemo(() => {
        if (Array.isArray(template?.defaultVisibleFieldIds) && template.defaultVisibleFieldIds.length) {
            return template.defaultVisibleFieldIds;
        }
        return fieldsCatalog.map((f) => f.id);
    }, [template, fieldsCatalog]);

    // ====== MODOS ======
    const [layoutMode, setLayoutMode] = useState("padrao"); // padrao | personalizado
    const [configOpen, setConfigOpen] = useState(false);

    // ====== REQUIRED ======
    const requiredIds = useMemo(() => {
        return (fieldsCatalog || []).filter((f) => f?.required).map((f) => f.id);
    }, [fieldsCatalog]);

    // ====== CAMPOS VISÍVEIS ======
    const [visibleFieldIds, setVisibleFieldIds] = useState(() => {
        const p = loadPreset(reportKey, templateId, labelKind);
        if (p?.setAsDefault && Array.isArray(p.visibleFieldIds) && p.visibleFieldIds.length) {
            return p.visibleFieldIds;
        }
        return defaultVisibleFieldIds;
    });

    const visibleSet = useMemo(() => {
        const s = new Set(visibleFieldIds || []);
        requiredIds.forEach((id) => s.add(id));
        return s;
    }, [visibleFieldIds, requiredIds]);

    // ====== OPÇÕES (genéricas) ======
    const defaultOptions = useMemo(() => {
        const base = { variant: "padrao", copies: 1 };
        const t =
            template?.defaultOptions && typeof template.defaultOptions === "object"
                ? template.defaultOptions
                : {};
        return { ...base, ...t };
    }, [template]);

    const [options, setOptions] = useState(() => {
        const p = loadPreset(reportKey, templateId, labelKind);
        if (p?.setAsDefault && p?.options && typeof p.options === "object") {
            return { ...defaultOptions, ...p.options };
        }
        return { ...defaultOptions };
    });

    const [setAsDefault, setSetAsDefault] = useState(() => {
        const p = loadPreset(reportKey, templateId, labelKind);
        return !!p?.setAsDefault;
    });

    // ====== TAMANHO DA ETIQUETA (EDITÁVEL NO MODAL) ======
    const [labelCfg, setLabelCfg] = useState(() => {
        const p = loadPreset(reportKey, templateId, labelKind);
        const base = { ...labelConfig };
        if (p?.setAsDefault && p?.labelConfig && typeof p.labelConfig === "object") {
            return { ...base, ...p.labelConfig };
        }
        return base;
    });

    const widthMm = Number(labelCfg?.widthMm || 100);
    const heightMm = Number(labelCfg?.heightMm || 150);
    const gapMm = Number(labelCfg?.gapMm || 0);
    const marginMm = Number(labelCfg?.marginMm || 0);
    const dpi = Number(labelCfg?.dpi || 203);

    useEffect(() => {
        const p = loadPreset(reportKey, templateId, labelKind);
        if (p?.setAsDefault) setLayoutMode("personalizado");
        else setLayoutMode("padrao");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reportKey, templateId, labelKind]);

    /* =========================================================
       ✅ SIDEBAR OFFSET AUTOMÁTICO (igual DocumentoBase)
       - >= sm (640px): empurra layout (208/56) "colando" no sidebar via -gutter
       - < sm: sidebar overlay, então offset = 0
    ========================================================= */
    const [isSmUp, setIsSmUp] = useState(() => {
        if (typeof window === "undefined") return true;
        return window.matchMedia("(min-width: 640px)").matches;
    });

    useEffect(() => {
        if (typeof window === "undefined") return;

        const mq = window.matchMedia("(min-width: 640px)");
        const onChange = () => setIsSmUp(mq.matches);

        onChange();

        if (mq.addEventListener) mq.addEventListener("change", onChange);
        else mq.addListener(onChange);

        return () => {
            if (mq.removeEventListener) mq.removeEventListener("change", onChange);
            else mq.removeListener(onChange);
        };
    }, []);

    const effectiveSidebarOffsetPx = useMemo(() => {
        // Se vier manual, respeita
        if (typeof sidebarOffsetPx === "number" && sidebarOffsetPx > 0) return sidebarOffsetPx;

        // Se não informou aberto/fechado, não desloca
        if (typeof sidebarOpen !== "boolean") return 0;

        // Mobile: sidebar overlay
        if (!isSmUp) return 0;

        const base = sidebarOpen ? sidebarWidthOpen : sidebarWidthClosed;

        // ✅ MESMO DO DocumentoBase: "cola" no sidebar com -gutter
        return Math.max(0, base - (Number(sidebarGutterPx) || 0));
    }, [
        sidebarOffsetPx,
        sidebarOpen,
        sidebarWidthOpen,
        sidebarWidthClosed,
        sidebarGutterPx,
        isSmUp,
    ]);

    /* =========================================================
       ZONAS
       1) template.zones (manual)
       2) automático pelo campo.group
    ========================================================= */
    const zones = useMemo(() => {
        if (Array.isArray(template?.zones) && template.zones.length) return template.zones;

        const groups = new Map();
        (fieldsCatalog || []).forEach((f) => {
            const g = f?.group || "Geral";
            if (!groups.has(g)) groups.set(g, { id: g, label: g });
        });

        return Array.from(groups.values());
    }, [template, fieldsCatalog]);

    const fieldMap = useMemo(() => {
        const m = new Map();
        (fieldsCatalog || []).forEach((f) => {
            if (f?.id) m.set(f.id, f);
        });
        return m;
    }, [fieldsCatalog]);

    const defaultOrderByZone = useMemo(() => {
        const out = {};
        (zones || []).forEach((z) => {
            out[z.id] = (fieldsCatalog || [])
                .filter((f) => (f?.group || "Geral") === z.id)
                .map((f) => f.id);
        });
        return out;
    }, [zones, fieldsCatalog]);

    const [orderByZone, setOrderByZone] = useState(() => {
        const p = loadPreset(reportKey, templateId, labelKind);
        if (p?.setAsDefault && p?.orderByZone && typeof p.orderByZone === "object") return p.orderByZone;
        return defaultOrderByZone;
    });

    useEffect(() => {
        const p = loadPreset(reportKey, templateId, labelKind);

        if (p?.setAsDefault && p?.orderByZone) setOrderByZone(p.orderByZone);
        else setOrderByZone(defaultOrderByZone);

        if (p?.setAsDefault && p?.options) setOptions({ ...defaultOptions, ...p.options });
        else setOptions({ ...defaultOptions });

        if (p?.setAsDefault && p?.labelConfig) setLabelCfg({ ...labelConfig, ...p.labelConfig });
        else setLabelCfg({ ...labelConfig });

        if (p?.setAsDefault && Array.isArray(p?.visibleFieldIds) && p.visibleFieldIds.length) {
            setVisibleFieldIds(p.visibleFieldIds);
            setSetAsDefault(true);
            setLayoutMode("personalizado");
        } else {
            setVisibleFieldIds(defaultVisibleFieldIds);
            setSetAsDefault(false);
            setLayoutMode("padrao");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reportKey, templateId, labelKind]);

    const activeFieldsByZone = useMemo(() => {
        const out = {};
        (zones || []).forEach((z) => {
            const zoneId = z.id;
            const order = Array.isArray(orderByZone?.[zoneId]) ? orderByZone[zoneId] : [];
            const inZone = (fieldsCatalog || []).filter((f) => (f?.group || "Geral") === zoneId);

            const ordered = [];
            const seen = new Set();

            order.forEach((id) => {
                const f = fieldMap.get(id);
                if (f && (f.group || "Geral") === zoneId && visibleSet.has(id)) {
                    ordered.push(f);
                    seen.add(id);
                }
            });

            inZone.forEach((f) => {
                if (visibleSet.has(f.id) && !seen.has(f.id)) ordered.push(f);
            });

            out[zoneId] = ordered;
        });

        return out;
    }, [zones, orderByZone, fieldsCatalog, fieldMap, visibleSet]);

    // Modal (drag)
    const [dragId, setDragId] = useState(null);

    const moveFieldWithinZone = (zoneId, fromId, toId) => {
        setOrderByZone((prev) => {
            const next = { ...(prev || {}) };
            const list = Array.isArray(next[zoneId]) ? [...next[zoneId]] : [];

            const ensure = (id) => {
                if (!list.includes(id)) list.push(id);
            };
            ensure(fromId);
            ensure(toId);

            const fromIdx = list.indexOf(fromId);
            const toIdx = list.indexOf(toId);
            if (fromIdx < 0 || toIdx < 0) return prev;

            list.splice(fromIdx, 1);
            list.splice(toIdx, 0, fromId);
            next[zoneId] = list;
            return next;
        });
    };

    const toggleField = (fieldId, on) => {
        const f = fieldMap.get(fieldId);
        if (!f) return;
        if (f.required) return;

        setVisibleFieldIds((prev) => {
            const s = new Set(prev || []);
            if (on) s.add(fieldId);
            else s.delete(fieldId);
            return Array.from(s);
        });
    };

    const fieldsByZone = useMemo(() => {
        const out = {};
        (zones || []).forEach((z) => {
            out[z.id] = (fieldsCatalog || []).filter((f) => (f?.group || "Geral") === z.id);
        });
        return out;
    }, [zones, fieldsCatalog]);

    const enabledByZone = useMemo(() => {
        const out = {};
        (zones || []).forEach((z) => {
            out[z.id] = (fieldsByZone[z.id] || []).filter((f) => visibleSet.has(f.id));
        });
        return out;
    }, [zones, fieldsByZone, visibleSet]);

    const disabledByZone = useMemo(() => {
        const out = {};
        (zones || []).forEach((z) => {
            out[z.id] = (fieldsByZone[z.id] || []).filter((f) => !visibleSet.has(f.id));
        });
        return out;
    }, [zones, fieldsByZone, visibleSet]);

    /* =========================================================
       PRESET (salvar / aplicar / reset)
    ========================================================= */
    const resetToDefault = () => {
        setVisibleFieldIds(defaultVisibleFieldIds);
        setOrderByZone(defaultOrderByZone);
        setOptions({ ...defaultOptions });
        setLabelCfg({ ...labelConfig });
        setSetAsDefault(false);
    };

    const applySavedPreset = () => {
        const p = loadPreset(reportKey, templateId, labelKind);
        if (!p) return false;

        if (Array.isArray(p.visibleFieldIds) && p.visibleFieldIds.length) {
            setVisibleFieldIds(p.visibleFieldIds);
        }
        if (p.orderByZone && typeof p.orderByZone === "object") {
            setOrderByZone(p.orderByZone);
        }
        if (p.options && typeof p.options === "object") {
            setOptions({ ...defaultOptions, ...p.options });
        }
        if (p.labelConfig && typeof p.labelConfig === "object") {
            setLabelCfg({ ...labelConfig, ...p.labelConfig });
        }

        setSetAsDefault(!!p.setAsDefault);
        return true;
    };

    const saveUserPreset = () => {
        const preset = {
            id: uid(),
            savedAt: new Date().toISOString(),
            visibleFieldIds: Array.from(new Set([...(visibleFieldIds || []), ...requiredIds])),
            orderByZone,
            options,
            setAsDefault,
            labelConfig: {
                widthMm,
                heightMm,
                gapMm,
                marginMm,
                dpi,
            },
            labelKind,
        };
        savePreset(reportKey, templateId, labelKind, preset);
    };

    const handleLayoutChange = (value) => {
        if (value === "padrao") {
            setLayoutMode("padrao");
            resetToDefault();
            return;
        }
        setLayoutMode("personalizado");
        const ok = applySavedPreset();
        if (!ok) setConfigOpen(true);
    };

    const handleClose = () => {
        if (typeof onClose === "function") return onClose();
        window.history.back();
    };

    const handlePrint = async () => {
        try {
            if (typeof onBeforePrint === "function") {
                await onBeforePrint({
                    options,
                    visibleFieldIds: Array.from(visibleSet),
                    labelConfig: { widthMm, heightMm, gapMm, marginMm, dpi },
                    labelKind,
                });
            }
        } catch {
            // ignora
        }

        setTimeout(() => window.print(), 50);

        setTimeout(() => {
            try {
                if (typeof onAfterPrint === "function") onAfterPrint();
            } catch {
                // ignora
            }
        }, 200);
    };

    const renderLabel = template?.renderLabel;

    const fallbackRender = ({ item, index, total }) => (
        <div className="w-full h-full p-[3mm] text-[12px]">
            <div className="font-bold">Etiqueta</div>
            <div className="text-[11px] text-gray-600">
                #{index + 1} de {total}
            </div>
            <pre className="text-[10px] whitespace-pre-wrap mt-2">{JSON.stringify(item, null, 2)}</pre>
        </div>
    );

    const safeItems = Array.isArray(items) ? items : [];

    return (
        <div
            id="etiqueta-print-root"
            className="w-full"
            style={{
                paddingLeft: effectiveSidebarOffsetPx ? `${effectiveSidebarOffsetPx}px` : undefined,
                transition: "padding-left 300ms ease",
            }}
        >
            {/* ================= TOOLBAR ================= */}
            <div
                className="sticky z-40 bg-white border-b border-gray-300"
                style={{
                    top: `${stickyTopPx}px`,
                    left: effectiveSidebarOffsetPx ? `${effectiveSidebarOffsetPx}px` : 0,
                    transition: "left 300ms ease",
                }}
            >
                <div className="px-4 py-2 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <b className="text-[13px] text-gray-800 truncate">Etiquetas</b>
                        <div className="text-[11px] text-gray-500 truncate">
                            template: <b>{templateId}</b> • {widthMm}x{heightMm}mm • tipo: <b>{labelKind}</b> • itens:{" "}
                            <b>{safeItems.length}</b>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap justify-end">
                        {/* Layout */}
                        <div className="flex items-center gap-2 text-[12px] text-gray-600">
                            <span>Layout:</span>
                            <select
                                className="h-[28px] border border-gray-300 rounded px-2 text-[12px]"
                                value={layoutMode}
                                onChange={(e) => handleLayoutChange(e.target.value)}
                            >
                                <option value="padrao">Padrão</option>
                                <option value="personalizado">Personalizado</option>
                            </select>

                            {presetLoaded?.savedAt ? (
                                <span className="text-[11px] text-gray-400">
                                    {new Date(presetLoaded.savedAt).toLocaleString("pt-BR")}
                                    {presetLoaded?.setAsDefault ? " (padrão)" : ""}
                                </span>
                            ) : (
                                <span className="text-[11px] text-gray-400">sem preset</span>
                            )}
                        </div>

                        {/* + Campos */}
                        <button
                            onClick={() => setConfigOpen(true)}
                            className="px-3 h-[28px] border border-gray-300 rounded text-[12px]"
                            title="Personalizar campos, tamanho e opções"
                        >
                            + Campos
                        </button>

                        {/* Imprimir */}
                        <button
                            onClick={handlePrint}
                            className="px-3 h-[28px] bg-red-700 text-white rounded text-[12px]"
                            title="Imprimir etiquetas"
                        >
                            Imprimir
                        </button>

                        {/* Fechar */}
                        <button
                            onClick={handleClose}
                            className="px-3 h-[28px] border border-gray-300 rounded text-[12px]"
                            title="Fechar"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>

            {/* ================= VIEWPORT ================= */}
            <div
                ref={scrollRef}
                className="bg-gray-200 w-full overflow-y-auto"
                style={{ height: `calc(100vh - ${topOffsetPx}px)` }}
            >
                <div className="flex flex-col items-center gap-4 py-6">
                    {safeItems.map((item, idx) => (
                        <div
                            key={item?.id ? String(item.id) : `${idx}-${onlyDigits(JSON.stringify(item || {})).slice(0, 12)}`}
                            className="etiqueta-page bg-white shadow relative"
                            style={{
                                width: `${widthMm}mm`,
                                height: `${heightMm}mm`,
                            }}
                        >
                            <div className="absolute inset-0">
                                {typeof renderLabel === "function"
                                    ? renderLabel({
                                        item,
                                        index: idx,
                                        total: safeItems.length,
                                        visibleFieldIds: Array.from(visibleSet),
                                        options,
                                        setOptions,
                                        zones,
                                        activeFieldsByZone,
                                        labelConfig: { widthMm, heightMm, gapMm, marginMm, dpi },
                                        logo,
                                        labelKind,
                                    })
                                    : fallbackRender({ item, index: idx, total: safeItems.length })}
                            </div>
                        </div>
                    ))}

                    {!safeItems.length ? <div className="text-[12px] text-gray-600">Nenhuma etiqueta para exibir.</div> : null}
                </div>
            </div>

            {/* ================= MODAL CAMPOS/OPÇÕES ================= */}
            {configOpen && (
                <div className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/30" onClick={() => setConfigOpen(false)} />

                    <div className="absolute right-0 top-0 h-full w-[560px] bg-white shadow-xl flex flex-col">
                        <div className="p-4 border-b flex items-center justify-between">
                            <div className="flex flex-col">
                                <b className="text-[14px]">Personalizar Etiqueta</b>
                                <span className="text-[12px] text-gray-500">
                                    Campos, ordem, tamanho (mm) e opções. Salve para fixar no template atual.
                                </span>
                            </div>

                            <button
                                onClick={() => setConfigOpen(false)}
                                className="px-3 h-[30px] border border-gray-300 rounded text-[12px]"
                            >
                                X
                            </button>
                        </div>

                        <div className="p-4 flex-1 overflow-auto">
                            {/* salvar como padrão */}
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <label className="flex items-center gap-2 text-[12px] text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={setAsDefault}
                                        onChange={(e) => setSetAsDefault(e.target.checked)}
                                    />
                                    Definir meu layout como padrão (para {templateId} • {labelKind})
                                </label>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            resetToDefault();
                                            setLayoutMode("padrao");
                                        }}
                                        className="px-3 h-[28px] border border-gray-300 rounded text-[12px]"
                                        title="Voltar ao padrão"
                                    >
                                        Padrão
                                    </button>

                                    <button
                                        onClick={() => {
                                            saveUserPreset();
                                            setLayoutMode("personalizado");
                                            setConfigOpen(false);
                                        }}
                                        className="px-3 h-[28px] bg-red-700 text-white rounded text-[12px]"
                                        title="Salvar"
                                    >
                                        Salvar
                                    </button>
                                </div>
                            </div>

                            {/* ======= TAMANHO (mm) ======= */}
                            <div className="mb-6 border rounded">
                                <div className="px-3 py-2 border-b bg-gray-50 text-[12px] font-semibold">
                                    Tamanho da etiqueta (mm)
                                </div>

                                <div className="p-3 grid grid-cols-12 gap-2 items-end">
                                    <div className="col-span-3">
                                        <label className="text-[11px] text-gray-600">Largura</label>
                                        <input
                                            className="w-full h-[32px] border border-gray-300 rounded px-2 text-[12px] text-center"
                                            value={String(widthMm)}
                                            onChange={(e) =>
                                                setLabelCfg((prev) => ({
                                                    ...(prev || {}),
                                                    widthMm: clamp(Number(e.target.value || "0"), 10, 300),
                                                }))
                                            }
                                        />
                                    </div>

                                    <div className="col-span-3">
                                        <label className="text-[11px] text-gray-600">Altura</label>
                                        <input
                                            className="w-full h-[32px] border border-gray-300 rounded px-2 text-[12px] text-center"
                                            value={String(heightMm)}
                                            onChange={(e) =>
                                                setLabelCfg((prev) => ({
                                                    ...(prev || {}),
                                                    heightMm: clamp(Number(e.target.value || "0"), 10, 300),
                                                }))
                                            }
                                        />
                                    </div>

                                    <div className="col-span-3">
                                        <label className="text-[11px] text-gray-600">Margem</label>
                                        <input
                                            className="w-full h-[32px] border border-gray-300 rounded px-2 text-[12px] text-center"
                                            value={String(marginMm)}
                                            onChange={(e) =>
                                                setLabelCfg((prev) => ({
                                                    ...(prev || {}),
                                                    marginMm: clamp(Number(e.target.value || "0"), 0, 20),
                                                }))
                                            }
                                        />
                                    </div>

                                    <div className="col-span-3">
                                        <label className="text-[11px] text-gray-600">Gap</label>
                                        <input
                                            className="w-full h-[32px] border border-gray-300 rounded px-2 text-[12px] text-center"
                                            value={String(gapMm)}
                                            onChange={(e) =>
                                                setLabelCfg((prev) => ({
                                                    ...(prev || {}),
                                                    gapMm: clamp(Number(e.target.value || "0"), 0, 20),
                                                }))
                                            }
                                        />
                                    </div>

                                    <div className="col-span-12 text-[11px] text-gray-500">
                                        Isso controla o preview e o <b>@page size</b> no print. (DPI fica guardado para futuro ZPL.)
                                    </div>
                                </div>
                            </div>

                            {/* ======= OPÇÕES (genéricas) ======= */}
                            <div className="mb-6 border rounded">
                                <div className="px-3 py-2 border-b bg-gray-50 text-[12px] font-semibold">Opções</div>

                                <div className="p-3 grid grid-cols-12 gap-2 items-end">
                                    <div className="col-span-7">
                                        <label className="text-[11px] text-gray-600">Variação</label>
                                        <select
                                            className="w-full h-[32px] border border-gray-300 rounded px-2 text-[12px]"
                                            value={options?.variant || "padrao"}
                                            onChange={(e) =>
                                                setOptions((prev) => ({
                                                    ...(prev || {}),
                                                    variant: e.target.value,
                                                }))
                                            }
                                        >
                                            <option value="padrao">Padrão</option>
                                            <option value="compacta">Compacta</option>
                                            <option value="detalhada">Detalhada</option>
                                        </select>
                                    </div>

                                    <div className="col-span-5">
                                        <label className="text-[11px] text-gray-600">Cópias</label>
                                        <select
                                            className="w-full h-[32px] border border-gray-300 rounded px-2 text-[12px]"
                                            value={String(options?.copies ?? 1)}
                                            onChange={(e) =>
                                                setOptions((prev) => ({
                                                    ...(prev || {}),
                                                    copies: clamp(Number(e.target.value || "1"), 1, 10),
                                                }))
                                            }
                                        >
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </select>
                                    </div>

                                    <div className="col-span-12 text-[11px] text-gray-500">Se o template não usar, pode ignorar.</div>
                                </div>
                            </div>

                            {/* ======= ZONAS ======= */}
                            <div className="flex flex-col gap-4">
                                {(zones || []).map((z) => {
                                    const enabledList = enabledByZone[z.id] || [];
                                    const disabledList = disabledByZone[z.id] || [];

                                    return (
                                        <div key={z.id} className="border rounded">
                                            <div className="px-3 py-2 border-b bg-gray-50 text-[12px] font-semibold flex items-center justify-between">
                                                <span>{z.label || z.id}</span>
                                                <span className="text-[11px] text-gray-500">
                                                    {enabledList.length} selecionados | {disabledList.length} disponíveis
                                                </span>
                                            </div>

                                            <div className="p-3 grid grid-cols-2 gap-3">
                                                {/* Selecionados */}
                                                <div className="border rounded">
                                                    <div className="px-2 py-2 border-b bg-white text-[12px] font-semibold">
                                                        Selecionados
                                                    </div>

                                                    <div className="p-2 max-h-[240px] overflow-auto">
                                                        {enabledList.map((f) => (
                                                            <div
                                                                key={f.id}
                                                                className={`flex items-center justify-between gap-2 px-2 py-1 border-b last:border-b-0 rounded ${dragId === f.id ? "bg-gray-100" : ""
                                                                    }`}
                                                                draggable
                                                                onDragStart={() => setDragId(f.id)}
                                                                onDragEnd={() => setDragId(null)}
                                                                onDragOver={(e) => e.preventDefault()}
                                                                onDrop={() => {
                                                                    if (!dragId || dragId === f.id) return;
                                                                    moveFieldWithinZone(z.id, dragId, f.id);
                                                                    setDragId(null);
                                                                }}
                                                                title="Arraste para reordenar dentro desta área"
                                                            >
                                                                <div className="text-[12px] text-gray-700">
                                                                    <b>{f.label}</b>
                                                                    <div className="text-[11px] text-gray-400">
                                                                        {f.id}
                                                                        {f.required ? " • obrigatório" : ""}
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[12px] text-gray-400 cursor-grab">☰</span>
                                                                    <button
                                                                        onClick={() => toggleField(f.id, false)}
                                                                        disabled={!!f.required}
                                                                        className={`px-2 h-[26px] border rounded text-[12px] ${f.required
                                                                                ? "border-gray-200 text-gray-300 cursor-not-allowed"
                                                                                : "border-gray-300"
                                                                            }`}
                                                                        title={f.required ? "Campo obrigatório" : "Remover"}
                                                                    >
                                                                        –
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}

                                                        {!enabledList.length ? (
                                                            <div className="p-3 text-[12px] text-gray-400">
                                                                Nenhum campo selecionado nesta área.
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                {/* Disponíveis */}
                                                <div className="border rounded">
                                                    <div className="px-2 py-2 border-b bg-white text-[12px] font-semibold">Disponíveis</div>

                                                    <div className="p-2 max-h-[240px] overflow-auto">
                                                        {disabledList.map((f) => (
                                                            <div
                                                                key={f.id}
                                                                className="flex items-center justify-between gap-2 px-2 py-1 border-b last:border-b-0"
                                                            >
                                                                <div className="text-[12px] text-gray-700">
                                                                    <b>{f.label}</b>
                                                                    <div className="text-[11px] text-gray-400">{f.id}</div>
                                                                </div>

                                                                <button
                                                                    onClick={() => toggleField(f.id, true)}
                                                                    className="px-2 h-[26px] border border-gray-300 rounded text-[12px]"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        ))}

                                                        {!disabledList.length ? (
                                                            <div className="p-3 text-[12px] text-gray-400">
                                                                Nenhum campo disponível nesta área.
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* info preset */}
                            <div className="mt-6 text-[11px] text-gray-500 flex items-center justify-between gap-2">
                                <div>
                                    {presetLoaded ? (
                                        <span>
                                            Último preset salvo: {new Date(presetLoaded.savedAt).toLocaleString("pt-BR")}{" "}
                                            {presetLoaded.setAsDefault ? "(padrão)" : ""}
                                        </span>
                                    ) : (
                                        <span>Nenhum preset salvo ainda.</span>
                                    )}
                                </div>

                                <button
                                    onClick={() => {
                                        deletePreset(reportKey, templateId, labelKind);
                                        setLayoutMode("padrao");
                                        resetToDefault();
                                    }}
                                    className="px-2 h-[26px] border border-gray-300 rounded text-[11px]"
                                    title="Apaga preset do template atual"
                                >
                                    Limpar preset
                                </button>
                            </div>
                        </div>

                        <div className="p-4 border-t flex items-center justify-between">
                            <div className="text-[11px] text-gray-500">
                                Dica: arraste os campos dentro de cada área para reordenar ✨
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setConfigOpen(false)}
                                    className="px-3 h-[30px] border border-gray-300 rounded text-[12px]"
                                >
                                    Cancelar
                                </button>

                                <button
                                    onClick={() => {
                                        saveUserPreset();
                                        setLayoutMode("personalizado");
                                        setConfigOpen(false);
                                    }}
                                    className="px-3 h-[30px] bg-red-700 text-white rounded text-[12px]"
                                >
                                    Salvar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= PRINT CSS ================= */}
            <style>{`
@media print {
  @page {
    size: ${widthMm}mm ${heightMm}mm;
    margin: ${marginMm}mm;
  }

  html, body {
    margin: 0 !important;
    padding: 0 !important;
  }

  /* some com toolbar / modal / overlays */
  .sticky, .fixed { display: none !important; }

  /* remove fundo cinza e sombras */
  .bg-gray-200 { background: #fff !important; }
  .shadow { box-shadow: none !important; }

  /* tira scroll no print */
  .overflow-y-auto { overflow: visible !important; height: auto !important; }

  /* garante que o print não leva padding do sidebar */
  #etiqueta-print-root {
    padding-left: 0 !important;
    left: 0 !important;
  }

  /* cada etiqueta vira uma página */
  .etiqueta-page {
    width: ${widthMm}mm !important;
    height: ${heightMm}mm !important;
    margin: 0 !important;
    break-after: page !important;
    page-break-after: always !important;
  }

  .etiqueta-page:last-of-type {
    break-after: auto !important;
    page-break-after: auto !important;
  }

  /* remove espaçamentos do container */
  .gap-4 { gap: ${gapMm}mm !important; }
  .py-6 { padding-top: 0 !important; padding-bottom: 0 !important; }
}
`}</style>
        </div>
    );
}
