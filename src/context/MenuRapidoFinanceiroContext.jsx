import { createContext, useContext, useState, useEffect } from "react";

// ===============================
// CATÁLOGO COMPLETO DO FINANCEIRO
// ===============================
const atalhosCatalogoFinanceiro = [
    // Financeiro base (PADRÃO)
    { id: "contas-pagar", label: "Contas a Pagar", rota: "/contas-pagar", icone: "fa-money-bill" },
    { id: "contas-receber", label: "Contas a Receber", rota: "/financeiro-receber", icone: "fa-file-invoice-dollar" },
    { id: "fluxo-caixa", label: "Fluxo de Caixa", rota: "/financeiro-fluxo", icone: "fa-chart-line" },
    { id: "faturamento", label: "Faturamento", rota: "/faturamento", icone: "fa-receipt" },
    { id: "boletos", label: "Boletos", rota: "/financeiro-boletos", icone: "fa-barcode" },

    // Cadastros / Apoio
    { id: "cliente", label: "Cliente", rota: "/cliente", icone: "fa-user-tie" },
    { id: "fornecedor", label: "Fornecedor", rota: "/fornecedor", icone: "fa-truck-field" },
    { id: "categoria", label: "Categoria", rota: "/categoria", icone: "fa-tags" },
    { id: "contas", label: "Contas", rota: "/conta", icone: "fa-building-columns" },

    // Financeiro avançado
    { id: "remessa", label: "Remessa", rota: "/remessa", icone: "fa-paper-plane" },
    { id: "retorno", label: "Retorno", rota: "/retorno", icone: "fa-rotate-left" },
];

// ===============================
// IDS PADRÃO (OS 5 FIXOS)
// ===============================
const IDS_PADRAO_FINANCEIRO = [
    "contas-pagar",
    "contas-receber",
    "fluxo-caixa",
    "faturamento",
    "boletos",
];

// ===============================
// NORMALIZAÇÃO CENTRAL DE ROTAS
// ===============================
function normalizarRotaFinanceira(rota) {
    if (!rota) return "/modulo-financeiro";

    const r = rota.startsWith("/") ? rota : `/${rota}`;
    return r.startsWith("/modulo-financeiro") ? r : `/modulo-financeiro${r}`;
}

const MenuRapidoFinanceiroContext = createContext();

// ===============================
// PROVIDER
// ===============================
export function MenuRapidoFinanceiroProvider({ children }) {
    const [atalhos, setAtalhos] = useState(() => {
        try {
            const salvo = localStorage.getItem("menuRapido_financeiro");
            const base = salvo ? JSON.parse(salvo) : null;

            if (Array.isArray(base) && base.length > 0) {
                return base.map(a => ({
                    ...a,
                    rota: normalizarRotaFinanceira(a.rota),
                }));
            }

            // fallback → padrões
            return atalhosCatalogoFinanceiro
                .filter(a => IDS_PADRAO_FINANCEIRO.includes(a.id))
                .map(a => ({
                    ...a,
                    rota: normalizarRotaFinanceira(a.rota),
                }));
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem("menuRapido_financeiro", JSON.stringify(atalhos));
    }, [atalhos]);

    // ===============================
    // AÇÕES
    // ===============================
    const adicionarAtalho = (atalho) => {
        setAtalhos(prev => {
            const rota = normalizarRotaFinanceira(atalho.rota);
            if (prev.some(a => a.rota === rota)) return prev;

            return [...prev, { ...atalho, rota }];
        });
    };

    const removerAtalho = (rota) => {
        const rotaNorm = normalizarRotaFinanceira(rota);
        setAtalhos(prev => prev.filter(a => a.rota !== rotaNorm));
    };

    // 🔁 RESTAURAR PADRÃO (APENAS OS 5)
    const restaurarPadrao = () => {
        const padrao = atalhosCatalogoFinanceiro
            .filter(a => IDS_PADRAO_FINANCEIRO.includes(a.id))
            .map(a => ({
                ...a,
                rota: normalizarRotaFinanceira(a.rota),
            }));

        setAtalhos(padrao);
    };

    return (
        <MenuRapidoFinanceiroContext.Provider
            value={{
                atalhos,
                adicionarAtalho,
                removerAtalho,
                restaurarPadrao,
                CATALOGO_FINANCEIRO: atalhosCatalogoFinanceiro,
            }}
        >
            {children}
        </MenuRapidoFinanceiroContext.Provider>
    );
}

// ===============================
// HOOK
// ===============================
export function useMenuRapidoFinanceiro() {
    const ctx = useContext(MenuRapidoFinanceiroContext);
    if (ctx) return ctx;

    // fallback defensivo (evita tela branca)
    return {
        atalhos: [],
        adicionarAtalho: () => { },
        removerAtalho: () => { },
        restaurarPadrao: () => { },
        CATALOGO_FINANCEIRO: atalhosCatalogoFinanceiro,
    };
}
