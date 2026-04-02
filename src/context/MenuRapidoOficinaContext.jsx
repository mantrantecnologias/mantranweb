import { createContext, useContext, useState, useEffect } from "react";

// ===============================
// CATÁLOGO COMPLETO DA OFICINA
// ===============================
const atalhosCatalogoOficina = [
    // Oficina base (PADRÃO)
    { id: "ordem-servico", label: "Ordem de Serviço", rota: "/ordem-servico", icone: "fa-wrench" },
    { id: "veiculos", label: "Veículos", rota: "/veiculo", icone: "fa-truck" },
    { id: "estoque", label: "Estoque", rota: "/estoque", icone: "fa-boxes-stacked" },

    // Cadastros
    { id: "motorista", label: "Motorista", rota: "/motorista", icone: "fa-id-card" },
    { id: "fornecedor", label: "Fornecedor", rota: "/fornecedor", icone: "fa-truck-field" },

    // Pneus
    { id: "pneus", label: "Pneus", rota: "/pneus", icone: "fa-circle-dot" },

    // Abastecimento
    { id: "abastecimento", label: "Abastecimento", rota: "/abastecimento", icone: "fa-gas-pump" },

    // Home da Oficina (Oficina.jsx)
    { id: "oficinas", label: "Oficina", rota: "/oficinas", icone: "fa-house" },
];

// ===============================
// IDS PADRÃO (OS 3 FIXOS)
// ===============================
const IDS_PADRAO_OFICINA = [
    "ordem-servico",
    "veiculos",
    "estoque",
];

// ===============================
// NORMALIZAÇÃO CENTRAL DE ROTAS
// ===============================
function normalizarRotaOficina(rota) {
    if (!rota) return "/modulo-oficina";

    // Fix legado: se vier "lancamento-abastecimento", normaliza para "abastecimento"
    if (rota.includes("lancamento-abastecimento")) {
        rota = "/abastecimento";
    }

    const r = rota.startsWith("/") ? rota : `/${rota}`;
    return r.startsWith("/modulo-oficina") ? r : `/modulo-oficina${r}`;
}

const MenuRapidoOficinaContext = createContext();

// ===============================
// PROVIDER
// ===============================
export function MenuRapidoOficinaProvider({ children }) {
    const [atalhos, setAtalhos] = useState(() => {
        try {
            const salvo = localStorage.getItem("menuRapido_oficina");
            const base = salvo ? JSON.parse(salvo) : null;

            if (Array.isArray(base) && base.length > 0) {
                return base.map(a => ({
                    ...a,
                    rota: normalizarRotaOficina(a.rota),
                }));
            }

            // fallback → padrões
            return atalhosCatalogoOficina
                .filter(a => IDS_PADRAO_OFICINA.includes(a.id))
                .map(a => ({
                    ...a,
                    rota: normalizarRotaOficina(a.rota),
                }));
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem("menuRapido_oficina", JSON.stringify(atalhos));
    }, [atalhos]);

    // ===============================
    // AÇÕES
    // ===============================
    const adicionarAtalho = (atalho) => {
        setAtalhos(prev => {
            const rota = normalizarRotaOficina(atalho.rota);
            if (prev.some(a => a.rota === rota)) return prev;

            return [...prev, { ...atalho, rota }];
        });
    };

    const removerAtalho = (rota) => {
        const rotaNorm = normalizarRotaOficina(rota);
        setAtalhos(prev => prev.filter(a => a.rota !== rotaNorm));
    };

    // 🔁 RESTAURAR PADRÃO
    const restaurarPadrao = () => {
        const padrao = atalhosCatalogoOficina
            .filter(a => IDS_PADRAO_OFICINA.includes(a.id))
            .map(a => ({
                ...a,
                rota: normalizarRotaOficina(a.rota),
            }));

        setAtalhos(padrao);
    };

    return (
        <MenuRapidoOficinaContext.Provider
            value={{
                atalhos,
                adicionarAtalho,
                removerAtalho,
                restaurarPadrao,
                CATALOGO_OFICINA: atalhosCatalogoOficina,
            }}
        >
            {children}
        </MenuRapidoOficinaContext.Provider>
    );
}

// ===============================
// HOOK
// ===============================
export function useMenuRapidoOficina() {
    const ctx = useContext(MenuRapidoOficinaContext);
    if (ctx) return ctx;

    // fallback defensivo
    return {
        atalhos: [],
        adicionarAtalho: () => { },
        removerAtalho: () => { },
        restaurarPadrao: () => { },
        CATALOGO_OFICINA: atalhosCatalogoOficina,
    };
}
