// src/pages/Relatorios/base/DocumentoBase.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import jsPDF from "jspdf";

/* =========================================================
   CONFIG A4 (aprox @96dpi) - mesmo padrão do RelatorioBase
========================================================= */
const PAGE = {
    portrait: { width: 794, height: 1123 },
    landscape: { width: 1123, height: 794 },
};

function clamp(n, a, b) {
    return Math.min(Math.max(n, a), b);
}

function guessFilename(name) {
    const base = (name || "Documento")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w]+/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_+|_+$/g, "");
    return base || "Documento";
}

function uid() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/* =========================================================
   PERSISTÊNCIA (localStorage) - por reportKey + templateId
========================================================= */
function storageKey(reportKey, templateId) {
    return `mantran_documento_preset__${reportKey || "default"}__${templateId || "default"}`;
}

function loadPreset(reportKey, templateId) {
    try {
        const raw = localStorage.getItem(storageKey(reportKey, templateId));
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function savePreset(reportKey, templateId, preset) {
    try {
        localStorage.setItem(storageKey(reportKey, templateId), JSON.stringify(preset));
    } catch {
        // ignora
    }
}

function deletePreset(reportKey, templateId) {
    try {
        localStorage.removeItem(storageKey(reportKey, templateId));
    } catch {
        // ignora
    }
}

/* =========================================================
   DOCUMENTO BASE (UNIFICADO)
   - pages (como o atual) + modal avançado (zonas/opções/drag)
========================================================= */
export default function DocumentoBase({
    reportKey = "DocumentoBase",

    // topo
    title = "Documento",
    logo = "",
    orientation = "portrait", // portrait | landscape

    topOffsetPx = 56,
    stickyTopPx = 32,
    sidebarOffsetPx = undefined,

    sidebarOpen, // boolean (recebe o mesmo "open" do seu layout)
    sidebarWidthOpen = 208, // w-52 do Sidebar.jsx
    sidebarWidthClosed = 56, // w-14 do Sidebar.jsx
    sidebarGutterPx = 16, // ajuste fino: aproxima o relatório do sidebar
    // templateId permite trocar layout por cliente
    templateId = "default",

    // template (novo padrão)
    // template = {
    //   pages: [{ id:"p1", render: ({data, visibleFieldIds, options, ...}) => <.../> }],
    //   fieldsCatalog: [{ id, label, group? , required? }],
    //   defaultVisibleFieldIds: [...],
    //   zones?: [{id,label}],
    //   defaultOptions?: { templateVariant, copies, ... }
    // }
    template,

    // dados do documento (objeto)
    data,

    // exportações
    onClose,
    onExportPDF, // se quiser custom
    onExportPDFBatch, // lote separado (opcional)
}) {
    const scrollRef = useRef(null);
    const pagesRef = useRef([]);

    const pageSize = PAGE[orientation] || PAGE.portrait;

    const presetLoaded = useMemo(
        () => loadPreset(reportKey, templateId),
        [reportKey, templateId]

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

    // ====== CAMPOS VISÍVEIS ======
    const [visibleFieldIds, setVisibleFieldIds] = useState(() => {
        const p = loadPreset(reportKey, templateId);
        if (p?.setAsDefault && Array.isArray(p.visibleFieldIds) && p.visibleFieldIds.length) {
            return p.visibleFieldIds;
        }
        return defaultVisibleFieldIds;
    });

    // ====== REQUIRED ======
    const requiredIds = useMemo(() => {
        return (fieldsCatalog || []).filter((f) => f?.required).map((f) => f.id);
    }, [fieldsCatalog]);

    const visibleSet = useMemo(() => {
        const s = new Set(visibleFieldIds || []);
        // required sempre ligado
        requiredIds.forEach((id) => s.add(id));
        return s;
    }, [visibleFieldIds, requiredIds]);

    // ====== OPÇÕES DO DOCUMENTO (Modelo / Vias / etc) ======
    const defaultOptions = useMemo(() => {
        // padrão compatível com seu print: modelo + vias
        const base = { templateVariant: "padrao", copies: 1 };
        const t = template?.defaultOptions && typeof template.defaultOptions === "object"
            ? template.defaultOptions
            : {};
        return { ...base, ...t };
    }, [template]);

    const [options, setOptions] = useState(() => {
        const p = loadPreset(reportKey, templateId);
        if (p?.setAsDefault && p?.options && typeof p.options === "object") {
            return { ...defaultOptions, ...p.options };
        }
        return { ...defaultOptions };
    });

    const [setAsDefault, setSetAsDefault] = useState(() => {
        const p = loadPreset(reportKey, templateId);
        return !!p?.setAsDefault;
    });

    useEffect(() => {
        const p = loadPreset(reportKey, templateId);
        if (p?.setAsDefault) setLayoutMode("personalizado");
        else setLayoutMode("padrao");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reportKey, templateId]);

    /* =========================================================
       SIDEBAR OFFSET AUTOMÁTICO (acompanha Sidebar retrátil)
       - >= sm (640px): empurra layout (208/56)
       - < sm: sidebar é overlay, então offset = 0
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
        return Math.max(0, base - sidebarGutterPx);
    }, [sidebarOffsetPx, sidebarOpen, sidebarWidthOpen, sidebarWidthClosed, isSmUp]);


    const pages = useMemo(() => {
        const list = template?.pages || [];
        return list.length ? list : [{ id: "p1", render: () => <div /> }];
    }, [template]);

    const totalPages = pages.length;

    const [pageCurrent, setPageCurrent] = useState(1);
    const [jumpPage, setJumpPage] = useState("1");

    const goToPage = (p) => {
        const target = clamp(p, 1, totalPages);
        const ref = pagesRef.current[target - 1];
        if (ref && scrollRef.current) {
            ref.scrollIntoView({ behavior: "smooth", block: "start" });
            setPageCurrent(target);
            setJumpPage(String(target));
        }
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const onScroll = () => {
            let best = 1;
            let bestDist = Infinity;

            pagesRef.current.forEach((ref, idx) => {
                if (!ref) return;
                const rect = ref.getBoundingClientRect();
                const dist = Math.abs(rect.top - 110);
                if (dist < bestDist) {
                    bestDist = dist;
                    best = idx + 1;
                }
            });

            setPageCurrent(best);
            setJumpPage(String(best));
        };

        el.addEventListener("scroll", onScroll, { passive: true });
        return () => el.removeEventListener("scroll", onScroll);
    }, []);
    /* =========================================================
       ZONAS (áreas) - 2 jeitos:
       1) template.zones (manual)
       2) automático pelo campo.group (ex: "Emitente", "Fatura", etc)
    ========================================================= */

    const zones = useMemo(() => {
        // Se veio manual, usa
        if (Array.isArray(template?.zones) && template.zones.length) return template.zones;

        // Auto: cria zonas por "group"
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

    // Ordem padrão por zona (a ordem do catálogo)
    const defaultOrderByZone = useMemo(() => {
        const out = {};
        (zones || []).forEach((z) => {
            out[z.id] = (fieldsCatalog || [])
                .filter((f) => (f?.group || "Geral") === z.id)
                .map((f) => f.id);
        });
        return out;
    }, [zones, fieldsCatalog]);

    // Ordem por zona persistida
    const [orderByZone, setOrderByZone] = useState(() => {
        const p = loadPreset(reportKey, templateId);
        if (p?.setAsDefault && p?.orderByZone && typeof p.orderByZone === "object") return p.orderByZone;
        return defaultOrderByZone;
    });

    // Quando muda reportKey/templateId, re-hidrata ordem e opções
    useEffect(() => {
        const p = loadPreset(reportKey, templateId);
        if (p?.setAsDefault && p?.orderByZone) setOrderByZone(p.orderByZone);
        else setOrderByZone(defaultOrderByZone);

        if (p?.setAsDefault && p?.options) setOptions({ ...defaultOptions, ...p.options });
        else setOptions({ ...defaultOptions });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reportKey, templateId]);

    // Campos ativos por zona seguindo a ordem
    const activeFieldsByZone = useMemo(() => {
        const out = {};
        (zones || []).forEach((z) => {
            const zoneId = z.id;
            const order = Array.isArray(orderByZone?.[zoneId]) ? orderByZone[zoneId] : [];
            const inZone = (fieldsCatalog || []).filter((f) => (f?.group || "Geral") === zoneId);

            const ordered = [];
            const seen = new Set();

            // primeiro, respeita a ordem salva
            order.forEach((id) => {
                const f = fieldMap.get(id);
                if (f && (f.group || "Geral") === zoneId && visibleSet.has(id)) {
                    ordered.push(f);
                    seen.add(id);
                }
            });

            // depois, adiciona faltantes
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
        setSetAsDefault(false);
    };

    const applySavedPreset = () => {
        const p = loadPreset(reportKey, templateId);
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
        };
        savePreset(reportKey, templateId, preset);
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
    /* =========================================================
       PDF handlers
    ========================================================= */
    const exportPDFDefault = async () => {
        const pdf = new jsPDF({ orientation, unit: "mm", format: "a4" });
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.text(title || "Documento", 105, 20, { align: "center" });

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.text("Gerador PDF não implementado para este template ainda.", 105, 40, { align: "center" });

        pdf.save(`${guessFilename(title)}.pdf`);
    };

    const handleExportPDF = () => {
        // IMPORTANTE: seu RelFatura chama onExportPDF({ visibleFieldIds, data })
        if (typeof onExportPDF === "function") {
            return onExportPDF({ visibleFieldIds: Array.from(visibleSet), data, options });
        }
        return exportPDFDefault();
    };

    const handleExportBatch = () => {
        if (typeof onExportPDFBatch === "function") return onExportPDFBatch({ options });
        alert("Lote: implemente onExportPDFBatch nesse documento (ou a gente faz no próximo passo).");
    };

    return (
        <div
            id="documento-print-root"
            className="w-full"
            style={{
                paddingLeft: effectiveSidebarOffsetPx ? `${effectiveSidebarOffsetPx}px` : undefined,
                transition: "padding-left 300ms ease",
            }}
        >

            {/* ================= TOOLBAR FIXA ================= */}
            <div
                className="sticky z-40 bg-white border-b border-gray-300"
                style={{
                    top: `${stickyTopPx}px`,
                    left: effectiveSidebarOffsetPx ? `${effectiveSidebarOffsetPx}px` : 0,
                    transition: "left 300ms ease",
                }}
            >

                <div className="px-4 py-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-[12px] text-gray-600 min-w-0">
                        <b className="text-gray-700 truncate">{title}</b>
                        <span className="text-[11px] text-gray-400 truncate">template: {templateId}</span>
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
                            title="Personalizar campos e opções"
                        >
                            + Campos
                        </button>

                        {/* Página */}
                        <div className="flex items-center gap-2 text-[12px] text-gray-600">
                            <span>Página</span>
                            <input
                                className="border border-gray-300 rounded px-2 h-[26px] w-[64px] text-center text-[13px]"
                                value={jumpPage}
                                onChange={(e) => setJumpPage(e.target.value.replace(/\D/g, ""))}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") goToPage(Number(jumpPage || "1"));
                                }}
                            />
                            <span>de {totalPages}</span>

                            <button
                                className="border border-gray-300 rounded px-2 h-[26px] text-[12px]"
                                onClick={() => goToPage(pageCurrent - 1)}
                            >
                                ◀
                            </button>
                            <button
                                className="border border-gray-300 rounded px-2 h-[26px] text-[12px]"
                                onClick={() => goToPage(pageCurrent + 1)}
                            >
                                ▶
                            </button>
                        </div>

                        {/* Ações */}
                        <button
                            onClick={() => window.print()}
                            className="px-3 h-[28px] bg-red-700 text-white rounded text-[12px]"
                            title="Imprimir"
                        >
                            Imprimir
                        </button>

                        <button
                            onClick={handleExportPDF}
                            className="px-3 h-[28px] border border-gray-300 rounded text-[12px]"
                            title="Gerar PDF"
                        >
                            PDF
                        </button>

                        <button
                            onClick={handleExportBatch}
                            className="px-3 h-[28px] border border-gray-300 rounded text-[12px]"
                            title="PDF em lote"
                        >
                            Lote
                        </button>

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

            {/* ================= VIEWPORT COM SCROLL ================= */}
            <div
                ref={scrollRef}
                className="bg-gray-200 w-full overflow-y-auto"
                style={{ height: `calc(100vh - ${topOffsetPx}px)` }}
            >
                <div className="documento-pages flex flex-col items-center gap-6 py-6">

                    {pages.map((p, pageIndex) => (
                        <div
                            key={p.id || pageIndex}
                            ref={(el) => (pagesRef.current[pageIndex] = el)}
                            className="documento-page bg-white shadow relative"
                            style={{
                                width: pageSize.width,
                                minHeight: pageSize.height,
                            }}
                        >
                            <div className="absolute inset-0">
                                {typeof p.render === "function"
                                    ? p.render({
                                        data,
                                        visibleFieldIds: Array.from(visibleSet),
                                        options,
                                        setOptions,
                                        // extras úteis
                                        pageIndex,
                                        totalPages,
                                        logo,
                                        zones,
                                        activeFieldsByZone,
                                    })
                                    : null}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* ================= MODAL CAMPOS/OPÇÕES ================= */}
            {configOpen && (
                <div className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/30" onClick={() => setConfigOpen(false)} />

                    <div className="absolute right-0 top-0 h-full w-[560px] bg-white shadow-xl flex flex-col">
                        <div className="p-4 border-b flex items-center justify-between">
                            <div className="flex flex-col">
                                <b className="text-[14px]">Personalizar Documento</b>
                                <span className="text-[12px] text-gray-500">
                                    Habilite/desabilite campos, reordene por área e ajuste opções.
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
                                    Definir meu layout como padrão
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

                            {/* ======= OPÇÕES DO DOCUMENTO ======= */}
                            <div className="mb-6 border rounded">
                                <div className="px-3 py-2 border-b bg-gray-50 text-[12px] font-semibold">
                                    Opções do documento
                                </div>

                                <div className="p-3 grid grid-cols-12 gap-2 items-end">
                                    <div className="col-span-7">
                                        <label className="text-[11px] text-gray-600">Modelo</label>
                                        <select
                                            className="w-full h-[32px] border border-gray-300 rounded px-2 text-[12px]"
                                            value={options?.templateVariant || "padrao"}
                                            onChange={(e) =>
                                                setOptions((prev) => ({
                                                    ...(prev || {}),
                                                    templateVariant: e.target.value,
                                                }))
                                            }
                                        >
                                            <option value="padrao">Padrão</option>
                                            <option value="espelho">Espelho (2 vias)</option>
                                            <option value="inteiro">Folha inteira</option>
                                        </select>
                                    </div>

                                    <div className="col-span-5">
                                        <label className="text-[11px] text-gray-600">Vias</label>
                                        <select
                                            className="w-full h-[32px] border border-gray-300 rounded px-2 text-[12px]"
                                            value={String(options?.copies ?? 1)}
                                            onChange={(e) =>
                                                setOptions((prev) => ({
                                                    ...(prev || {}),
                                                    copies: Number(e.target.value || "1"),
                                                }))
                                            }
                                        >
                                            <option value="1">1 via</option>
                                            <option value="2">2 vias</option>
                                        </select>
                                    </div>

                                    <div className="col-span-12 text-[11px] text-gray-500">
                                        Dica: você pode ignorar essas opções no template se não fizer sentido.
                                    </div>
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
                                                    <div className="px-2 py-2 border-b bg-white text-[12px] font-semibold">
                                                        Disponíveis
                                                    </div>

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
                                        deletePreset(reportKey, templateId);
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
  /* 1) Esconde tudo e imprime só o documento */
  body * { visibility: hidden !important; }

  #documento-print-root,
  #documento-print-root * {
    visibility: visible !important;
  }

  /* 2) Ancora o documento no topo (mata sidebar/paddings/scroll layout) */
  #documento-print-root {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    padding-left: 0 !important;
    transition: none !important;
  }

  /* 3) Página e margens */
  @page {
    size: A4 ${orientation === "landscape" ? "landscape" : "portrait"};
    margin: 0;
  }

  html, body {
    margin: 0 !important;
    padding: 0 !important;
    height: auto !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* 4) some com toolbar/modal/overlays */
  .sticky, .fixed { display: none !important; }

  /* 5) remove “cenário” de tela */
  .bg-gray-200 { background: white !important; }
  .shadow { box-shadow: none !important; }

  /* 6) desarma scroll container */
  .overflow-y-auto { overflow: visible !important; height: auto !important; }

  /* 7) no print: nada de flex centralizando com gap */
  .documento-pages {
    display: block !important;
    padding: 0 !important;
    margin: 0 !important;
    gap: 0 !important;
  }

  /* 8) Quebra de página: uma página por folha */
  .documento-page {
    margin: 0 !important;
    break-after: page !important;
    page-break-after: always !important;
  }

  .documento-page:last-of-type {
    break-after: auto !important;
    page-break-after: auto !important;
  }
}
`}</style>




        </div>
    );
}
