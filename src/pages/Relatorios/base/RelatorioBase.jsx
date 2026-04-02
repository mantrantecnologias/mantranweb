// src/pages/Relatorios/base/RelatorioBase.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

/* =========================================================
   CONFIG A4 (aprox @96dpi)
========================================================= */
const PAGE = {
    portrait: { width: 794, height: 1123 },
    landscape: { width: 1123, height: 794 },
};

const PAGE_PADDING = 40;
const HEADER_HEIGHT = 110;
const TABLE_HEADER_HEIGHT = 32;
const FOOTER_HEIGHT = 40;
const ROW_HEIGHT = 28;

/* =========================================================
   HELPERS
========================================================= */
function safeGet(row, accessor) {
    if (typeof accessor === "function") return accessor(row);
    return row?.[accessor] ?? "";
}

function toText(val) {
    if (val === null || val === undefined) return "";
    return String(val);
}

function clamp(n, a, b) {
    return Math.min(Math.max(n, a), b);
}

function guessFilename(titulo) {
    const base = (titulo || "Relatorio")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w]+/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_+|_+$/g, "");
    return base || "Relatorio";
}

function guessImageFormat(logo) {
    const s = (logo || "").toLowerCase();
    if (s.includes("image/png")) return "PNG";
    if (s.includes("image/webp")) return "WEBP";
    if (s.includes("image/jpeg") || s.includes("image/jpg")) return "JPEG";
    return "PNG";
}

function uid() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/* =========================================================
   PERSISTÊNCIA (localStorage)
========================================================= */
function storageKey(reportKey) {
    return `mantran_relatorio_preset__${reportKey || "default"}`;
}

function loadPreset(reportKey) {
    try {
        const raw = localStorage.getItem(storageKey(reportKey));
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function savePreset(reportKey, preset) {
    try {
        localStorage.setItem(storageKey(reportKey), JSON.stringify(preset));
    } catch {
        // ignora
    }
}

function deletePreset(reportKey) {
    try {
        localStorage.removeItem(storageKey(reportKey));
    } catch {
        // ignora
    }
}

/* =========================================================
   RELATORIO BASE (MOTOR)
========================================================= */
export default function RelatorioBase({
    // identidade do relatório (pra salvar preset individual)
    reportKey = "RelatorioBase",

    titulo = "Relatório",
    periodo = "", // "dd/mm/aaaa a dd/mm/aaaa"
    logo = "", // base64/url
    orientation = "auto", // auto | portrait | landscape

    // colunas padrão Mantran (o que aparece por default)
    columns = [], // [{id,label,accessor,width,align}]
    rows = [],

    // catálogo completo (para personalização)
    // ✅ IMPORTANTE: passe aqui seus campos extras (GRIS, Advalorem, CST, CFOP...)
    // se não passar, o catálogo vira o próprio `columns`
    columnCatalog = null, // [{id,label,accessor,width,align, group?}]

    // detalhe (NF)
    detail, // { enabled, key, columns:[], toggleColumnId?: "ctrc" }

    // totais padrão (pode ser customizado pelo usuário na tela)
    totals = [], // [{id,label,type:"sum"|"count", accessor, format?:"money"}]

    // callbacks opcionais
    onExportPDF, // se passar, usa o seu; senão usa o default
    onExportExcel, // se passar, usa o seu; senão usa o default
    onClose, // se passar, botão Fechar chama; se não, usa history.back()

    // layout
    topOffsetPx = 56,     // altura do header fixo da aplicação
    stickyTopPx = 32,     // (você disse que ficou bom com 32)
    sidebarOffsetPx = undefined, // se setar número, ele força manual (override)

    sidebarOpen, // boolean (mesmo "open" do seu layout)
    sidebarWidthOpen = 208, // w-52
    sidebarWidthClosed = 56, // w-14
    sidebarGutterPx = 16, // ✅ o “colar” que você achou perfeito
}) {
    const pagesRef = useRef([]);
    const scrollRef = useRef(null);

    const [pageCurrent, setPageCurrent] = useState(1);
    const [jumpPage, setJumpPage] = useState("1");
    const [expanded, setExpanded] = useState(() => new Set());

    // impressão/exports
    const [printMode, setPrintMode] = useState(false);
    const [printIncludeDetail, setPrintIncludeDetail] = useState(true); // impressão/PDF/Excel

    // personalização
    const [configOpen, setConfigOpen] = useState(false);

    // drag state
    const [dragId, setDragId] = useState(null);

    // layout topo
    const [layoutMode, setLayoutMode] = useState("mantran"); // mantran | personalizado

    /* =====================================================
       0) CATÁLOGO COMPLETO (garante unicidade)
    ====================================================== */
    const fullCatalog = useMemo(() => {
        const base = Array.isArray(columnCatalog) && columnCatalog.length ? columnCatalog : columns;
        const seen = new Set();
        return (base || []).filter((c) => {
            if (!c?.id) return false;
            if (seen.has(c.id)) return false;
            seen.add(c.id);
            return true;
        });
    }, [columnCatalog, columns]);

    /* =====================================================
       0.1) PRESET SALVO
    ====================================================== */
    const presetLoaded = useMemo(() => loadPreset(reportKey), [reportKey]);

    /* =====================================================
       0.2) ESTADO DO PRESET APLICADO
       - selectedColumnIds: ordem e seleção
       - totalsConfig: o que soma/conta
       - setAsDefault: define se este preset vira padrão do relatório
    ====================================================== */
    const [selectedColumnIds, setSelectedColumnIds] = useState(() => {
        // se tiver preset e ele estiver como padrão, aplica; senão usa columns
        const p = loadPreset(reportKey);
        if (p?.setAsDefault && Array.isArray(p.selectedColumnIds) && p.selectedColumnIds.length) {
            return p.selectedColumnIds;
        }
        return (columns || []).map((c) => c.id);
    });

    const [totalsConfig, setTotalsConfig] = useState(() => {
        const p = loadPreset(reportKey);
        if (p?.setAsDefault && Array.isArray(p.totalsConfig)) return p.totalsConfig;
        return totals || [];
    });

    const [setAsDefault, setSetAsDefault] = useState(() => {
        const p = loadPreset(reportKey);
        return !!p?.setAsDefault;
    });

    // layoutMode inicial (se existe preset padrão, entra como personalizado)
    useEffect(() => {
        const p = loadPreset(reportKey);
        if (p?.setAsDefault) setLayoutMode("personalizado");
        else setLayoutMode("mantran");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reportKey]);
    /* =========================================================
   SIDEBAR OFFSET AUTOMÁTICO (acompanha Sidebar retrátil)
   - >= sm (640px): empurra layout (208/56) + gutter
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
        // 1) Se vier manual, respeita
        if (typeof sidebarOffsetPx === "number" && sidebarOffsetPx > 0) return sidebarOffsetPx;

        // 2) Se não informou aberto/fechado, não desloca
        if (typeof sidebarOpen !== "boolean") return 0;

        // 3) Mobile: sidebar overlay
        if (!isSmUp) return 0;

        const base = sidebarOpen ? sidebarWidthOpen : sidebarWidthClosed;

        // ✅ IGUAL DocumentoBase: cola no sidebar
        return Math.max(0, base - (Number(sidebarGutterPx) || 0));
    }, [sidebarOffsetPx, sidebarOpen, sidebarWidthOpen, sidebarWidthClosed, sidebarGutterPx, isSmUp]);



    /* =====================================================
       1) ORIENTAÇÃO (AUTO) - usa colunas ativas
    ====================================================== */
    const resolvedOrientation = useMemo(() => {
        if (orientation !== "auto") return orientation;

        const cols = selectedColumnIds
            .map((id) => fullCatalog.find((c) => c.id === id))
            .filter(Boolean);

        const totalWidth = cols.reduce((s, c) => s + (c.width || 110), 0);
        return totalWidth > 750 ? "landscape" : "portrait";
    }, [orientation, selectedColumnIds, fullCatalog]);

    const pageSize = PAGE[resolvedOrientation];

    /* =====================================================
       2) COLUNAS ATIVAS (conforme preset)
    ====================================================== */
    const activeColumns = useMemo(() => {
        const map = new Map(fullCatalog.map((c) => [c.id, c]));
        const ordered = [];
        selectedColumnIds.forEach((id) => {
            const c = map.get(id);
            if (c) ordered.push(c);
        });

        // fallback: se zerou tudo, volta pro padrão
        if (!ordered.length) return columns || [];
        return ordered;
    }, [selectedColumnIds, fullCatalog, columns]);

    /* =====================================================
       3) PAGINAÇÃO DE LINHAS (mestre)
    ====================================================== */
    const rowsPerPage = useMemo(() => {
        const usable =
            pageSize.height - PAGE_PADDING * 2 - HEADER_HEIGHT - TABLE_HEADER_HEIGHT - FOOTER_HEIGHT;
        return Math.max(8, Math.floor(usable / ROW_HEIGHT));
    }, [pageSize.height]);

    const pages = useMemo(() => {
        const result = [];
        for (let i = 0; i < rows.length; i += rowsPerPage) {
            result.push(rows.slice(i, i + rowsPerPage));
        }
        return result.length ? result : [[]];
    }, [rows, rowsPerPage]);

    const totalPages = pages.length;

    /* =====================================================
       4) EXPAND / COLLAPSE (por linha) - apenas na tela
    ====================================================== */
    const toggleRow = (rowId) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(rowId)) next.delete(rowId);
            else next.add(rowId);
            return next;
        });
    };

    const isExpanded = (rowId) => expanded.has(rowId);

    /* =====================================================
       5) NAVEGAÇÃO DE PÁGINA (scroll)
    ====================================================== */
    const goToPage = (p) => {
        const target = clamp(p, 1, totalPages);
        const ref = pagesRef.current[target - 1];
        const scroller = scrollRef.current;

        if (ref && scroller) {
            // scroll SOMENTE do container interno (não mexe no window)
            const top = Math.max(0, ref.offsetTop - 8);

            scroller.scrollTo({
                top,
                behavior: "smooth",
            });

            setPageCurrent(target);
            setJumpPage(String(target));
        }
    };


    /* =====================================================
       6) SCROLL -> detectar página atual
    ====================================================== */
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

    /* =====================================================
       7) IMPRIMIR
    ====================================================== */
    useEffect(() => {
        const after = () => setPrintMode(false);
        window.addEventListener("afterprint", after);
        return () => window.removeEventListener("afterprint", after);
    }, []);

    const handlePrint = () => {
        setPrintMode(true);
        setTimeout(() => window.print(), 80);
    };

    /* =====================================================
       8) TOTAIS (só no final) - usa totalsConfig
    ====================================================== */
    const totalsValues = useMemo(() => {
        const out = {};
        (totalsConfig || []).forEach((t) => {
            if (t.type === "count") out[t.id] = rows.length;
            if (t.type === "sum") {
                out[t.id] = rows.reduce((s, r) => s + (Number(r?.[t.accessor]) || 0), 0);
            }
        });
        return out;
    }, [totalsConfig, rows]);

    /* =====================================================
       9) EXPORT PDF (padrão)
       - usa activeColumns e totalsConfig
       - inclui/omite detalhes conforme printIncludeDetail
    ====================================================== */
    const exportPDFDefault = async () => {
        const file = `${guessFilename(titulo)}.pdf`;
        const pdf = new jsPDF({
            orientation: resolvedOrientation === "landscape" ? "landscape" : "portrait",
            unit: "mm",
            format: "a4",
        });

        const marginX = 10;
        const pageW = pdf.internal.pageSize.getWidth();
        const pageH = pdf.internal.pageSize.getHeight();

        const addHeader = (page, total) => {
            const topY = 10;

            // LOGO
            if (logo && logo.startsWith("data:")) {
                try {
                    const fmt = guessImageFormat(logo);
                    pdf.addImage(logo, fmt, marginX, topY, 42, 14);
                } catch {
                    // ignora
                }
            }

            // TÍTULO
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(14);
            pdf.text(titulo || "Relatório", pageW / 2, topY + 6, { align: "center" });

            // PERÍODO
            if (periodo) {
                pdf.setFont("helvetica", "normal");
                pdf.setFontSize(10);
                pdf.text(`Período ${periodo}`, pageW / 2, topY + 12, { align: "center" });
            }

            // PAGINAÇÃO
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(9);
            pdf.text(`Página ${page} de ${total}`, pageW - marginX, topY + 6, { align: "right" });
        };

        const masterCols = activeColumns;
        const masterHead = [masterCols.map((c) => c.label)];
        const makeMasterBody = (pageRows) =>
            pageRows.map((r) => masterCols.map((c) => toText(safeGet(r, c.accessor))));

        const detailEnabled = !!(detail?.enabled && detail?.key && detail?.columns?.length);
        const includeDet = !!(detailEnabled && printIncludeDetail);

        // paginação mestre no PDF
        const pdfPages = [];
        for (let i = 0; i < rows.length; i += rowsPerPage) {
            pdfPages.push(rows.slice(i, i + rowsPerPage));
        }
        const pdfTotalPages = pdfPages.length || 1;

        pdfPages.forEach((pageRows, idx) => {
            if (idx > 0) pdf.addPage();

            addHeader(idx + 1, pdfTotalPages);

            autoTable(pdf, {
                head: masterHead,
                body: makeMasterBody(pageRows),
                startY: 28,
                theme: "grid",
                styles: {
                    fontSize: 8.5,
                    cellPadding: 2,
                    valign: "middle",
                    lineWidth: 0.1,
                },
                headStyles: {
                    fillColor: [240, 240, 240],
                    textColor: 20,
                    fontStyle: "bold",
                },
                margin: { left: marginX, right: marginX },
                columnStyles: masterCols.reduce((acc, c, i) => {
                    if (c.align === "right") acc[i] = { halign: "right" };
                    return acc;
                }, {}),
            });

            let y = pdf.lastAutoTable?.finalY ?? 28;

            // detalhe por linha (NF)
            if (includeDet) {
                const dCols = detail.columns;
                const dHead = [["Relação Notas Fiscais do CTe", ...new Array(dCols.length - 1).fill("")]];
                const dHead2 = [dCols.map((c) => c.label)];

                for (const r of pageRows) {
                    const detRows = r?.[detail.key] || [];
                    if (!detRows.length) continue;

                    if (y > pageH - 40) {
                        pdf.addPage();
                        addHeader(idx + 1, pdfTotalPages);
                        y = 28;
                    }

                    autoTable(pdf, {
                        head: [dHead[0], dHead2[0]],
                        body: detRows.map((dr) => dCols.map((c) => toText(safeGet(dr, c.accessor)))),
                        startY: y + 2,
                        theme: "grid",
                        styles: {
                            fontSize: 8,
                            cellPadding: 2,
                            valign: "middle",
                            lineWidth: 0.1,
                        },
                        headStyles: {
                            fillColor: [230, 230, 230],
                            textColor: 20,
                            fontStyle: "bold",
                        },
                        margin: { left: marginX, right: marginX },
                        didParseCell: (data) => {
                            if (data.section === "head" && data.row.index === 0) {
                                data.cell.styles.fillColor = [255, 255, 255];
                                data.cell.styles.textColor = 20;
                                data.cell.styles.fontStyle = "bold";
                                data.cell.styles.halign = "left";
                            }
                        },
                        columnStyles: dCols.reduce((acc, c, i) => {
                            if (c.align === "right") acc[i] = { halign: "right" };
                            return acc;
                        }, {}),
                    });

                    y = pdf.lastAutoTable?.finalY ?? y + 8;

                    // totalizador das NFs (se existir peso/valorNF)
                    const totNFs = detRows.length;
                    const totPeso = detRows.reduce((s, x) => s + (Number(x.peso) || 0), 0);
                    const totValor = detRows.reduce((s, x) => s + (Number(x.valorNF) || 0), 0);

                    pdf.setFontSize(8.5);
                    pdf.setFont("helvetica", "bold");

                    const lineY = y + 5;
                    const colX = marginX;

                    pdf.text("Totais das NFs:", colX + 90, lineY);
                    pdf.text(String(totNFs), colX + 120, lineY, { align: "right" });
                    pdf.text(
                        totPeso.toLocaleString("pt-BR", { minimumFractionDigits: 3 }),
                        colX + 150,
                        lineY,
                        { align: "right" }
                    );
                    pdf.text(
                        totValor.toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
                        colX + 190,
                        lineY,
                        { align: "right" }
                    );

                    pdf.setFont("helvetica", "normal");
                    y = lineY + 6;
                }
            }

            // Totais gerais só na última página do PDF
            if (idx === pdfTotalPages - 1 && (totalsConfig || []).length) {
                const startY = Math.min((pdf.lastAutoTable?.finalY ?? 28) + 10, pageH - 25);
                pdf.setFontSize(9.5);
                pdf.setFont("helvetica", "bold");

                let x = marginX;
                let yTot = startY;

                (totalsConfig || []).forEach((t) => {
                    const val =
                        t.type === "count"
                            ? rows.length
                            : rows.reduce((s, r) => s + (Number(r?.[t.accessor]) || 0), 0);

                    const formatted =
                        t.format === "money"
                            ? `R$ ${Number(val || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                            : Number(val || 0).toLocaleString("pt-BR");

                    pdf.text(`${t.label}: ${formatted}`, x, yTot);
                    x += 60;
                    if (x > pageW - 60) {
                        x = marginX;
                        yTot += 6;
                    }
                });

                pdf.setFont("helvetica", "normal");
            }
        });

        pdf.save(file);
    };

    /* =====================================================
       10) EXPORT EXCEL (padrão)
       - usa activeColumns e totalsConfig
       - inclui/omite aba Notas conforme printIncludeDetail
    ====================================================== */
    const exportExcelDefault = () => {
        const file = `${guessFilename(titulo)}.xlsx`;
        const masterCols = activeColumns;

        // Mestre
        const wsMasterData = [
            masterCols.map((c) => c.label),
            ...rows.map((r) => masterCols.map((c) => safeGet(r, c.accessor))),
        ];
        const wsMaster = XLSX.utils.aoa_to_sheet(wsMasterData);

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, wsMaster, "CTRC");

        // Detalhe (Notas)
        const detailEnabled = !!(detail?.enabled && detail?.key && detail?.columns?.length);
        const includeDet = !!(detailEnabled && printIncludeDetail);

        if (includeDet) {
            const dCols = detail.columns;

            const masterKeyCol = detail.toggleColumnId || masterCols?.[0]?.id;
            const masterKeyAccessor =
                masterCols.find((c) => c.id === masterKeyCol)?.accessor || masterCols?.[0]?.accessor;

            const detHeader = ["CTRC", ...dCols.map((c) => c.label)];
            const detRows = [];

            rows.forEach((r) => {
                const ctrcVal = safeGet(r, masterKeyAccessor);
                const det = r?.[detail.key] || [];
                det.forEach((dr) => {
                    detRows.push([ctrcVal, ...dCols.map((c) => safeGet(dr, c.accessor))]);
                });

                // totalizador das NFs (se existirem campos peso/valorNF)
                if (det.length) {
                    const totNFs = det.length;
                    const totPeso = det.reduce((s, x) => s + (Number(x.peso) || 0), 0);
                    const totValor = det.reduce((s, x) => s + (Number(x.valorNF) || 0), 0);
                    detRows.push(["", "Totais das NFs:", totNFs, "", "", totPeso, totValor]);
                    detRows.push([]);
                }
            });

            const wsDet = XLSX.utils.aoa_to_sheet([detHeader, ...detRows]);
            XLSX.utils.book_append_sheet(wb, wsDet, "Notas");
        }

        // Totais (opcional) como última linha na aba CTRC
        if ((totalsConfig || []).length) {
            const totLine = [];
            (totalsConfig || []).forEach((t) => {
                const val =
                    t.type === "count"
                        ? rows.length
                        : rows.reduce((s, r) => s + (Number(r?.[t.accessor]) || 0), 0);

                const formatted =
                    t.format === "money"
                        ? `R$ ${Number(val || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                        : Number(val || 0).toLocaleString("pt-BR");

                totLine.push(`${t.label}: ${formatted}`);
            });

            const range = XLSX.utils.decode_range(wsMaster["!ref"]);
            const newRowIndex = range.e.r + 2;
            XLSX.utils.sheet_add_aoa(wsMaster, [[""], ["TOTAIS"], totLine], {
                origin: { r: newRowIndex, c: 0 },
            });
        }

        XLSX.writeFile(wb, file);
    };

    const handleExportPDF = () => {
        if (typeof onExportPDF === "function") return onExportPDF();
        return exportPDFDefault();
    };

    const handleExportExcel = () => {
        if (typeof onExportExcel === "function") return onExportExcel();
        return exportExcelDefault();
    };

    /* =====================================================
       11) FECHAR
    ====================================================== */
    const handleClose = () => {
        if (typeof onClose === "function") return onClose();
        window.history.back();
    };

    /* =====================================================
       12) PERSONALIZAÇÃO
       - adicionar/remover colunas
       - ordenar por drag
       - configurar totais
       - salvar preset (e opcionalmente como padrão)
    ====================================================== */
    const availableColumns = useMemo(() => {
        const selected = new Set(selectedColumnIds);
        return fullCatalog.filter((c) => !selected.has(c.id));
    }, [fullCatalog, selectedColumnIds]);

    const selectedColumns = useMemo(() => {
        const map = new Map(fullCatalog.map((c) => [c.id, c]));
        return selectedColumnIds.map((id) => map.get(id)).filter(Boolean);
    }, [selectedColumnIds, fullCatalog]);

    const addColumn = (id) => {
        setSelectedColumnIds((prev) => {
            if (prev.includes(id)) return prev;
            return [...prev, id];
        });
    };

    const removeColumn = (id) => {
        setSelectedColumnIds((prev) => prev.filter((x) => x !== id));
    };

    const moveColumn = (fromId, toId) => {
        setSelectedColumnIds((prev) => {
            const fromIdx = prev.indexOf(fromId);
            const toIdx = prev.indexOf(toId);
            if (fromIdx < 0 || toIdx < 0) return prev;

            const next = [...prev];
            next.splice(fromIdx, 1);
            next.splice(toIdx, 0, fromId);
            return next;
        });
    };

    const resetToMantranDefault = () => {
        setSelectedColumnIds((columns || []).map((c) => c.id));
        setTotalsConfig(totals || []);
        setSetAsDefault(false);
    };

    const saveUserPreset = () => {
        const preset = {
            id: uid(),
            savedAt: new Date().toISOString(),
            selectedColumnIds,
            totalsConfig,
            setAsDefault,
        };
        savePreset(reportKey, preset);
    };

    const applySavedPreset = () => {
        const p = loadPreset(reportKey);
        if (!p) return false;
        if (Array.isArray(p.selectedColumnIds) && p.selectedColumnIds.length) {
            setSelectedColumnIds(p.selectedColumnIds);
        }
        if (Array.isArray(p.totalsConfig)) setTotalsConfig(p.totalsConfig);
        setSetAsDefault(!!p.setAsDefault);
        return true;
    };

    /* =====================================================
       13) UI: TOTAIS EDITÁVEIS
    ====================================================== */
    const [newTotalType, setNewTotalType] = useState("sum"); // sum|count
    const [newTotalAccessor, setNewTotalAccessor] = useState("");
    const [newTotalLabel, setNewTotalLabel] = useState("");
    const [newTotalFormat, setNewTotalFormat] = useState("");

    const selectableNumericAccessors = useMemo(() => {
        const cols = fullCatalog.filter((c) => typeof c.accessor === "string");
        return cols.map((c) => ({ id: c.id, label: c.label, accessor: c.accessor }));
    }, [fullCatalog]);

    const addTotal = () => {
        if (newTotalType === "count") {
            const id = `count_${uid()}`;
            const label = newTotalLabel?.trim() || "Total";
            setTotalsConfig((prev) => [...prev, { id, label, type: "count" }]);
            setNewTotalLabel("");
            return;
        }

        // sum
        if (!newTotalAccessor) return;
        const id = `sum_${newTotalAccessor}_${uid()}`;
        const baseLabel =
            selectableNumericAccessors.find((x) => x.accessor === newTotalAccessor)?.label ||
            newTotalAccessor;

        const label = newTotalLabel?.trim() || `Total ${baseLabel}`;
        const format = newTotalFormat === "money" ? "money" : undefined;

        setTotalsConfig((prev) => [
            ...prev,
            { id, label, type: "sum", accessor: newTotalAccessor, ...(format ? { format } : {}) },
        ]);

        setNewTotalLabel("");
        setNewTotalAccessor("");
        setNewTotalFormat("");
    };

    const removeTotal = (id) => {
        setTotalsConfig((prev) => prev.filter((t) => t.id !== id));
    };

    /* =====================================================
       13.1) LAYOUT SELECT (topo)
    ====================================================== */
    const handleLayoutChange = (value) => {
        if (value === "mantran") {
            setLayoutMode("mantran");
            resetToMantranDefault();
            return;
        }

        // personalizado
        setLayoutMode("personalizado");
        const ok = applySavedPreset();
        if (!ok) {
            // não tem preset ainda: mantém como está, mas abre modal pra montar e salvar
            setConfigOpen(true);
        }
    };

    /* =====================================================
       14) RENDER
    ====================================================== */
    return (
        <div
            id="relatorio-print-root"
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
                        <b className="text-gray-700 truncate">{titulo}</b>
                        {periodo ? <span className="text-gray-500 truncate">(Período {periodo})</span> : null}
                    </div>

                    <div className="flex items-center gap-3 flex-wrap justify-end">
                        {/* ✅ Layout: Padrão/Personalizado */}
                        <div className="flex items-center gap-2 text-[12px] text-gray-600">
                            <span>Layout:</span>
                            <select
                                className="h-[28px] border border-gray-300 rounded px-2 text-[12px]"
                                value={layoutMode}
                                onChange={(e) => handleLayoutChange(e.target.value)}
                                title="Escolha o layout do relatório"
                            >
                                <option value="mantran">Padrão Mantran</option>
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

                        {/* ✅ Opção de impressão/exportação */}
                        {detail?.enabled ? (
                            <label className="flex items-center gap-2 text-[12px] text-gray-600 select-none">
                                <input
                                    type="checkbox"
                                    checked={printIncludeDetail}
                                    onChange={(e) => setPrintIncludeDetail(e.target.checked)}
                                />
                                Imprimir/Exportar com Notas
                            </label>
                        ) : null}

                        {/* ✅ Personalizar */}
                        <button
                            onClick={() => setConfigOpen(true)}
                            className="px-3 h-[28px] border border-gray-300 rounded text-[12px]"
                            title="Personalizar campos e totais"
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
                            onClick={handlePrint}
                            className="px-3 h-[28px] bg-red-700 text-white rounded text-[12px]"
                            title={printIncludeDetail ? "Imprime com detalhes de NF" : "Imprime sem detalhes de NF"}
                        >
                            Imprimir
                        </button>

                        <button
                            onClick={handleExportPDF}
                            className="px-3 h-[28px] border border-gray-300 rounded text-[12px]"
                            title={printIncludeDetail ? "Exportar PDF (com Notas)" : "Exportar PDF (sem Notas)"}
                        >
                            PDF
                        </button>

                        <button
                            onClick={handleExportExcel}
                            className="px-3 h-[28px] border border-gray-300 rounded text-[12px]"
                            title={printIncludeDetail ? "Exportar Excel (com Notas)" : "Exportar Excel (sem Notas)"}
                        >
                            Excel
                        </button>

                        {/* ✅ Fechar */}
                        <button
                            onClick={handleClose}
                            className="px-3 h-[28px] border border-gray-300 rounded text-[12px]"
                            title="Fechar relatório"
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
                style={{
                    height: `calc(100vh - ${topOffsetPx}px)`,
                }}
            >
                <div className="flex flex-col items-center gap-6 py-6">
                    {pages.map((pageRows, pageIndex) => (
                        <div
                            key={pageIndex}
                            ref={(el) => (pagesRef.current[pageIndex] = el)}
                            className="bg-white shadow"
                            style={{
                                width: pageSize.width,
                                minHeight: pageSize.height,
                                padding: PAGE_PADDING,
                            }}
                        >
                            {/* ============ HEADER REPETE EM TODAS ============ */}
                            <RelatorioHeader
                                logo={logo}
                                titulo={titulo}
                                periodo={periodo}
                                page={pageIndex + 1}
                                totalPages={totalPages}
                            />

                            {/* ============ TABELA ============ */}
                            <RelatorioTable
                                columns={activeColumns}
                                rows={pageRows}
                                detail={detail}
                                isExpanded={isExpanded}
                                toggleRow={toggleRow}
                                printMode={printMode}
                                printIncludeDetail={printIncludeDetail}
                            />

                            {/* ============ TOTAIS (SÓ NA ÚLTIMA) ============ */}
                            {pageIndex === totalPages - 1 && (totalsConfig || []).length > 0 && (
                                <div className="mt-4 border-t pt-2 text-[12px] flex flex-wrap gap-x-6 gap-y-1">
                                    {(totalsConfig || []).map((t) => {
                                        const val = totalsValues[t.id];
                                        const formatted =
                                            t.format === "money"
                                                ? `R$ ${Number(val || 0).toLocaleString("pt-BR", {
                                                    minimumFractionDigits: 2,
                                                })}`
                                                : Number(val || 0).toLocaleString("pt-BR");
                                        return (
                                            <div key={t.id}>
                                                <b>{t.label}:</b> {formatted}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* ============ FOOTER PÁGINA ============ */}
                            <div className="mt-2 text-[10px] text-gray-500 flex justify-between">
                                <span></span>
                                <span>
                                    {new Date().toLocaleString("pt-BR")} | Página {pageIndex + 1}/{totalPages}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ================= MODAL CAMPOS/TOTAIS ================= */}
            {configOpen && (
                <div className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/30" onClick={() => setConfigOpen(false)} />

                    <div className="absolute right-0 top-0 h-full w-[520px] bg-white shadow-xl flex flex-col">
                        <div className="p-4 border-b flex items-center justify-between">
                            <div className="flex flex-col">
                                <b className="text-[14px]">Personalizar Relatório</b>
                                <span className="text-[12px] text-gray-500">
                                    Arraste para ordenar, adicione/remova campos e configure totais.
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
                                            resetToMantranDefault();
                                            setLayoutMode("mantran");
                                        }}
                                        className="px-3 h-[28px] border border-gray-300 rounded text-[12px]"
                                        title="Voltar para o padrão Mantran"
                                    >
                                        Padrão Mantran
                                    </button>

                                    <button
                                        onClick={() => {
                                            saveUserPreset();
                                            setLayoutMode("personalizado");
                                            setConfigOpen(false);
                                        }}
                                        className="px-3 h-[28px] bg-red-700 text-white rounded text-[12px]"
                                        title="Salvar personalização"
                                    >
                                        Salvar
                                    </button>
                                </div>
                            </div>

                            {/* ======= COLUNAS ======= */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* disponíveis */}
                                <div className="border rounded">
                                    <div className="px-3 py-2 border-b bg-gray-50 text-[12px] font-semibold">
                                        Campos disponíveis ({availableColumns.length})
                                    </div>

                                    <div className="p-2 max-h-[260px] overflow-auto">
                                        {availableColumns.map((c) => (
                                            <div
                                                key={c.id}
                                                className="flex items-center justify-between gap-2 px-2 py-1 border-b last:border-b-0"
                                            >
                                                <div className="text-[12px] text-gray-700">
                                                    <b>{c.label}</b>
                                                    <div className="text-[11px] text-gray-400">{c.id}</div>
                                                </div>

                                                <button
                                                    onClick={() => addColumn(c.id)}
                                                    className="px-2 h-[26px] border border-gray-300 rounded text-[12px]"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        ))}

                                        {!availableColumns.length ? (
                                            <div className="p-3 text-[12px] text-gray-400">Nenhum campo disponível.</div>
                                        ) : null}
                                    </div>
                                </div>

                                {/* selecionadas */}
                                <div className="border rounded">
                                    <div className="px-3 py-2 border-b bg-gray-50 text-[12px] font-semibold">
                                        Campos selecionados ({selectedColumns.length})
                                    </div>

                                    <div className="p-2 max-h-[260px] overflow-auto">
                                        {selectedColumns.map((c) => (
                                            <div
                                                key={c.id}
                                                className={`flex items-center justify-between gap-2 px-2 py-1 border-b last:border-b-0 rounded ${dragId === c.id ? "bg-gray-100" : ""
                                                    }`}
                                                draggable
                                                onDragStart={() => setDragId(c.id)}
                                                onDragEnd={() => setDragId(null)}
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={() => {
                                                    if (!dragId || dragId === c.id) return;
                                                    moveColumn(dragId, c.id);
                                                    setDragId(null);
                                                }}
                                                title="Arraste para reordenar"
                                            >
                                                <div className="text-[12px] text-gray-700">
                                                    <b>{c.label}</b>
                                                    <div className="text-[11px] text-gray-400">{c.id}</div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <span className="text-[12px] text-gray-400 cursor-grab">☰</span>
                                                    <button
                                                        onClick={() => removeColumn(c.id)}
                                                        className="px-2 h-[26px] border border-gray-300 rounded text-[12px]"
                                                    >
                                                        –
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        {!selectedColumns.length ? (
                                            <div className="p-3 text-[12px] text-gray-400">
                                                Nenhum campo selecionado. Adicione pelo lado esquerdo.
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            {/* ======= TOTAIS ======= */}
                            <div className="mt-6 border rounded">
                                <div className="px-3 py-2 border-b bg-gray-50 text-[12px] font-semibold">
                                    Totais no rodapé
                                </div>

                                <div className="p-3">
                                    {/* lista */}
                                    {(totalsConfig || []).length ? (
                                        <div className="mb-3">
                                            {(totalsConfig || []).map((t) => (
                                                <div
                                                    key={t.id}
                                                    className="flex items-center justify-between gap-2 border-b last:border-b-0 py-2"
                                                >
                                                    <div className="text-[12px] text-gray-700">
                                                        <b>{t.label}</b>
                                                        <div className="text-[11px] text-gray-400">
                                                            {t.type === "count" ? "count" : `sum(${t.accessor})`}{" "}
                                                            {t.format ? `| ${t.format}` : ""}
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => removeTotal(t.id)}
                                                        className="px-2 h-[26px] border border-gray-300 rounded text-[12px]"
                                                    >
                                                        Remover
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="mb-3 text-[12px] text-gray-400">Nenhum total configurado.</div>
                                    )}

                                    {/* adicionar */}
                                    <div className="grid grid-cols-12 gap-2 items-end">
                                        <div className="col-span-3">
                                            <label className="text-[11px] text-gray-600">Tipo</label>
                                            <select
                                                className="w-full h-[32px] border border-gray-300 rounded px-2 text-[12px]"
                                                value={newTotalType}
                                                onChange={(e) => setNewTotalType(e.target.value)}
                                            >
                                                <option value="sum">Somatório</option>
                                                <option value="count">Contagem</option>
                                            </select>
                                        </div>

                                        <div className="col-span-4">
                                            <label className="text-[11px] text-gray-600">Campo (para somatório)</label>
                                            <select
                                                className="w-full h-[32px] border border-gray-300 rounded px-2 text-[12px]"
                                                value={newTotalAccessor}
                                                onChange={(e) => setNewTotalAccessor(e.target.value)}
                                                disabled={newTotalType !== "sum"}
                                            >
                                                <option value="">Selecione</option>
                                                {selectableNumericAccessors.map((a) => (
                                                    <option key={a.accessor} value={a.accessor}>
                                                        {a.label} ({a.accessor})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-span-3">
                                            <label className="text-[11px] text-gray-600">Formato</label>
                                            <select
                                                className="w-full h-[32px] border border-gray-300 rounded px-2 text-[12px]"
                                                value={newTotalFormat}
                                                onChange={(e) => setNewTotalFormat(e.target.value)}
                                                disabled={newTotalType !== "sum"}
                                            >
                                                <option value="">Normal</option>
                                                <option value="money">Moeda</option>
                                            </select>
                                        </div>

                                        <div className="col-span-2">
                                            <button
                                                onClick={addTotal}
                                                className="w-full h-[32px] bg-gray-900 text-white rounded text-[12px]"
                                            >
                                                Adicionar
                                            </button>
                                        </div>

                                        <div className="col-span-12">
                                            <label className="text-[11px] text-gray-600">Rótulo (opcional)</label>
                                            <input
                                                className="w-full h-[32px] border border-gray-300 rounded px-2 text-[12px]"
                                                value={newTotalLabel}
                                                onChange={(e) => setNewTotalLabel(e.target.value)}
                                                placeholder="Ex: Total Frete"
                                            />
                                        </div>
                                    </div>

                                    {/* info preset */}
                                    <div className="mt-4 text-[11px] text-gray-500 flex items-center justify-between gap-2">
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
                                                deletePreset(reportKey);
                                                setLayoutMode("mantran");
                                                resetToMantranDefault();
                                            }}
                                            className="px-2 h-[26px] border border-gray-300 rounded text-[11px]"
                                            title="Apaga o preset salvo deste relatório"
                                        >
                                            Limpar preset
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t flex items-center justify-between">
                            <div className="text-[11px] text-gray-500">
                                Dica: arraste os campos do lado direito para reordenar ✨
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
          body * { visibility: hidden !important; }

          #relatorio-print-root, #relatorio-print-root * {
            visibility: visible !important;
          }

          #relatorio-print-root {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding-left: 0 !important;
          }

          .bg-gray-200 { background: white !important; }
          .shadow { box-shadow: none !important; }

          .sticky { display: none !important; }
          .fixed { display: none !important; }

          .overflow-y-auto { overflow: visible !important; height: auto !important; }

          .bg-white.shadow { break-after: page; page-break-after: always; }
        }
      `}</style>
        </div>
    );
}

/* =========================================================
   HEADER
========================================================= */
function RelatorioHeader({ logo, titulo, periodo, page, totalPages }) {
    return (
        <div className="flex items-start mb-4">
            {/* LOGO */}
            <div className="w-[220px] h-[60px] flex items-center">
                {logo ? (
                    <img src={logo} alt="Logo" className="max-h-full max-w-full object-contain" />
                ) : (
                    <div className="text-gray-400 text-xs">SEM LOGO</div>
                )}
            </div>

            {/* TÍTULO */}
            <div className="flex-1 text-center">
                <h1 className="text-red-700 font-semibold text-[16px]">{titulo}</h1>
                {periodo ? <div className="text-[12px] text-gray-600">Período {periodo}</div> : null}
            </div>

            {/* PAGINAÇÃO */}
            <div className="text-xs text-gray-500 text-right">
                Página {page} de {totalPages}
            </div>
        </div>
    );
}

/* =========================================================
   TABELA (com + dentro da coluna definida em toggleColumnId)
========================================================= */
function RelatorioTable({ columns, rows, detail, isExpanded, toggleRow, printMode, printIncludeDetail }) {
    return (
        <table className="w-full border-collapse text-[12px]">
            <thead>
                <tr className="bg-gray-100">
                    {columns.map((col) => (
                        <th
                            key={col.id}
                            className={`border px-2 py-1 ${col.align === "right" ? "text-right" : ""}`}
                            style={{ width: col.width }}
                        >
                            {col.label}
                        </th>
                    ))}
                </tr>
            </thead>

            <tbody>
                {rows.map((row, idx) => {
                    const rowId = row.id ?? String(idx);

                    // ✅ 1) Detecta linhas de agrupamento (Filial / Classe / Qtde / Group)
                    const isGroup =
                        row?.__type === "filial" ||
                        row?.__type === "classe" ||
                        row?.__type === "qtde" ||
                        row?.__type === "group";

                    if (isGroup) {
                        // ✅ 2) Texto do agrupamento
                        const text =
                            row?.__type === "filial"
                                ? row.filialLabel || ""
                                : row?.__type === "classe"
                                    ? row.classeLabel || ""
                                    : row?.__type === "qtde"
                                        ? `Qtde: ${row.qtde ?? 0}`
                                        : row?.groupLabel || "";

                        // ✅ 3) Cor de fundo
                        const bg =
                            row?.__type === "filial"
                                ? "bg-gray-75"
                                : row?.__type === "classe"
                                    ? "bg-gray-50"
                                    : row?.__type === "qtde"
                                        ? "bg-gray-50"
                                        : "bg-gray-75"; // group

                        const font =
                            row?.__type === "filial" ? "font-semibold" :
                                row?.__type === "group" ? "font-semibold" :
                                    row?.__type === "classe" ? "font-medium" :
                                        "font-medium";

                        return (
                            <tr key={rowId} className={bg}>
                                {/* ✅ MESCLA A LINHA TODA */}
                                <td
                                    colSpan={columns.length}
                                    className={`border px-2 py-1 text-[12px] text-gray-800 ${font}`}
                                >
                                    {text}
                                </td>
                            </tr>
                        );
                    }


                    // ✅ 4) Linha normal continua igual
                    return (
                        <RelatorioRow
                            key={rowId}
                            row={row}
                            rowId={rowId}
                            columns={columns}
                            detail={detail}
                            expanded={printMode ? !!printIncludeDetail : isExpanded(rowId)}
                            toggleRow={toggleRow}
                            printMode={printMode}
                        />
                    );
                })}
            </tbody>

        </table>
    );
}

/* =========================================================
   LINHA (MESTRE + DETALHE)
========================================================= */
function RelatorioRow({ row, rowId, columns, detail, expanded, toggleRow, printMode }) {
    const hasDetail = !!(detail?.enabled && row?.[detail.key]?.length);

    return (
        <>
            <tr className="hover:bg-gray-50">
                {columns.map((col) => {
                    const value = safeGet(row, col.accessor);
                    const isToggleCol = detail?.enabled && detail?.toggleColumnId === col.id;

                    if (isToggleCol) {
                        return (
                            <td
                                key={col.id}
                                className={`border px-2 py-1 ${col.align === "right" ? "text-right" : ""}`}
                            >
                                <div className="flex items-center gap-2">
                                    {hasDetail && !printMode ? (
                                        <button
                                            className="w-[18px] h-[18px] border border-gray-500 text-[12px] leading-[16px] rounded text-center"
                                            onClick={() => toggleRow(rowId)}
                                            title={expanded ? "Recolher" : "Expandir"}
                                        >
                                            {expanded ? "-" : "+"}
                                        </button>
                                    ) : (
                                        <span className="w-[18px]" />
                                    )}
                                    <span className="font-medium">{value}</span>
                                </div>
                            </td>
                        );
                    }

                    return (
                        <td
                            key={col.id}
                            className={`border px-2 py-1 ${col.align === "right" ? "text-right" : ""}`}
                        >
                            {value}
                        </td>
                    );
                })}
            </tr>

            {/* DETALHE (NOTAS) */}
            {detail?.enabled && hasDetail && expanded && (
                <tr>
                    <td colSpan={columns.length} className="border p-2 bg-gray-50">
                        <RelatorioDetailTable columns={detail.columns} rows={row[detail.key]} />
                    </td>
                </tr>
            )}
        </>
    );
}

/* =========================================================
   SUBTABELA DETALHE (NOTAS) + TOTALIZADOR
========================================================= */
function RelatorioDetailTable({ columns, rows }) {
    const totais = useMemo(() => {
        const totalNFs = rows?.length || 0;
        const totalPeso = (rows || []).reduce((s, r) => s + (Number(r.peso) || 0), 0);
        const totalValor = (rows || []).reduce((s, r) => s + (Number(r.valorNF) || 0), 0);
        return { totalNFs, totalPeso, totalValor };
    }, [rows]);

    const has6 = (columns?.length || 0) >= 6;

    return (
        <table className="w-full border-collapse text-[11px]">
            <thead>
                <tr className="bg-white">
                    <th
                        colSpan={columns.length}
                        className="border border-gray-300 px-2 py-1 text-left font-semibold"
                    >
                        Relação Notas Fiscais do CTe
                    </th>
                </tr>
                <tr className="bg-gray-200">
                    {columns.map((c) => (
                        <th
                            key={c.id}
                            className={`border border-gray-300 px-2 py-1 ${c.align === "right" ? "text-right" : ""}`}
                        >
                            {c.label}
                        </th>
                    ))}
                </tr>
            </thead>

            <tbody>
                {(rows || []).map((r, i) => (
                    <tr key={i}>
                        {columns.map((c) => (
                            <td
                                key={c.id}
                                className={`border border-gray-300 px-2 py-1 ${c.align === "right" ? "text-right" : ""}`}
                            >
                                {safeGet(r, c.accessor)}
                            </td>
                        ))}
                    </tr>
                ))}

                {/* Totalizador igual ao print */}
                {has6 ? (
                    <tr className="bg-white">
                        <td colSpan={3} className="border border-gray-300 px-2 py-2 text-right font-semibold">
                            Totais das NFs:
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-right font-semibold">
                            {totais.totalNFs.toLocaleString("pt-BR")}
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-right font-semibold">
                            {totais.totalPeso.toLocaleString("pt-BR", { minimumFractionDigits: 3 })}
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-right font-semibold">
                            {totais.totalValor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </td>
                    </tr>
                ) : (
                    <tr className="bg-white">
                        <td
                            colSpan={columns.length}
                            className="border border-gray-300 px-2 py-2 text-right font-semibold"
                        >
                            Totais das NFs: {totais.totalNFs} | Peso:{" "}
                            {totais.totalPeso.toLocaleString("pt-BR", { minimumFractionDigits: 3 })} | Valor:{" "}
                            {totais.totalValor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
