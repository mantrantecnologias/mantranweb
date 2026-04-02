import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

/* =====================================================
   CONTEXT
===================================================== */
const MenuRapidoWMSContext = createContext();

/* =====================================================
   PADRÃO WMS (fonte única da verdade)
===================================================== */
export const PADRAO_WMS = [
    {
        id: "os-separacao",
        label: "OS",
        rota: "/modulo-wms/os-separacao",
        icone: "fa-file-lines",
        ativo: true,
    },
    {
        id: "nf-entrada",
        label: "NF Entrada",
        rota: "/modulo-wms/nf-entrada",
        icone: "fa-file-import",
        ativo: true,
    },
    {
        id: "nf-saida",
        label: "NF Saída",
        rota: "/modulo-wms/nf-saida",
        icone: "fa-file-export",
        ativo: true,
    },
    {
        id: "mapa",
        label: "Mapa",
        rota: "/wms/mapa",
        icone: "fa-map-location-dot",
        ativo: true,
    },
    {
        id: "graficos",
        label: "Gráficos",
        rota: "/wms/graficos",
        icone: "fa-chart-column",
        ativo: true,
    },
    {
        id: "parametros",
        label: "Parâmetros WMS",
        rota: "/wms/parametros",
        icone: "fa-gear",
        ativo: true,
    },
];

/* =====================================================
   CATÁLOGO COMPLETO WMS (combobox)
===================================================== */
export const CATALOGO_WMS = [
    ...PADRAO_WMS,

    // ===== PACKLIST / ORDEM =====
    {
        id: "packlist-nf",
        label: "Packlist Nota Fiscal",
        rota: "/wms/packlist-nota-fiscal",
        icone: "fa-box-open",
    },

    // ===== ESTOQUE =====
    {
        id: "inventario",
        label: "Inventário",
        rota: "/wms/inventario",
        icone: "fa-clipboard-list",
    },
    {
        id: "consultas",
        label: "Consultas",
        rota: "/wms/consultas",
        icone: "fa-magnifying-glass",
    },

    // ===== CLIENTE =====
    {
        id: "cliente-produto",
        label: "Cliente Produto",
        rota: "/wms/cliente-produto",
        icone: "fa-boxes-stacked",
    },
    {
        id: "cliente",
        label: "Cliente",
        rota: "/wms/cliente",
        icone: "fa-user",
    },

    // ===== TABELAS =====
    {
        id: "tabela-preco",
        label: "Tabela Preço",
        rota: "/wms/tabela-preco",
        icone: "fa-table",
    },
];

const STORAGE_KEY = "wms_menuRapido";

/* =====================================================
   PROVIDER
===================================================== */
export function MenuRapidoWMSProvider({ children }) {
    const [atalhos, setAtalhos] = useState(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return PADRAO_WMS;

            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed) || parsed.length === 0) {
                return PADRAO_WMS;
            }

            // 1. Sanitiza e ATUALIZA os que já existem no storage com a definição padrão (se houver)
            // Isso garante que se mudarmos a rota no código, o usuário receba a atualização.
            const stored = parsed.map((a) => {
                const def = PADRAO_WMS.find(p => p.id === a.id);
                if (def) {
                    // Se é um item padrão, forçamos os dados vitais (rota/label/icone) do código,
                    // mas mantemos a preferência do usuário (ativo)
                    return {
                        ...def,
                        ativo: a.ativo !== false // preserva preferência ou assume true
                    };
                }
                // Item customizado ou não-padrão
                return {
                    id: a.id ?? String(Date.now()),
                    label: a.label ?? "Atalho",
                    rota: a.rota ?? "/wms",
                    icone: a.icone ?? "fa-gear",
                    ativo: a.ativo !== false,
                };
            });

            // 2. Mescla novos itens do PADRAO_WMS que não estejam no storage
            const missingDefaults = PADRAO_WMS.filter(
                (def) => !stored.some((s) => s.id === def.id)
            );

            return [...stored, ...missingDefaults];
        } catch {
            return PADRAO_WMS;
        }
    });

    /* ================= PERSISTÊNCIA ================= */
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(atalhos));
    }, [atalhos]);

    /* =====================================================
       FUNÇÕES
    ===================================================== */

    // adiciona sem duplicar (rota = chave)
    const adicionarAtalho = (atalho) => {
        setAtalhos((prev) => {
            const existe = prev.some((a) => a.rota === atalho.rota);
            if (existe) {
                return prev.map((a) =>
                    a.rota === atalho.rota
                        ? { ...a, ...atalho, ativo: true }
                        : a
                );
            }
            return [...prev, { ...atalho, ativo: true }];
        });
    };

    // remove por ID ou ROTA
    const removerAtalho = (idOuRota) => {
        setAtalhos((prev) =>
            prev.filter((a) => a.id !== idOuRota && a.rota !== idOuRota)
        );
    };

    const atualizarAtalho = (idOuRota, novosDados) => {
        setAtalhos((prev) =>
            prev.map((a) =>
                a.id === idOuRota || a.rota === idOuRota
                    ? { ...a, ...novosDados }
                    : a
            )
        );
    };

    const toggleAtalho = (idOuRota) => {
        setAtalhos((prev) =>
            prev.map((a) =>
                a.id === idOuRota || a.rota === idOuRota
                    ? { ...a, ativo: !a.ativo }
                    : a
            )
        );
    };

    const restaurarPadrao = () => {
        setAtalhos(PADRAO_WMS);
    };

    const value = useMemo(
        () => ({
            atalhos,
            adicionarAtalho,
            removerAtalho,
            atualizarAtalho,
            toggleAtalho,
            restaurarPadrao,
            PADRAO_WMS,
            CATALOGO_WMS,
        }),
        [atalhos]
    );

    return (
        <MenuRapidoWMSContext.Provider value={value}>
            {children}
        </MenuRapidoWMSContext.Provider>
    );
}

/* =====================================================
   HOOK
===================================================== */
export function useMenuRapidoWMS() {
    return useContext(MenuRapidoWMSContext);
}
