import { createContext, useContext, useState, useEffect } from "react";

// ===============================
// CATÁLOGO COMPLETO DO SEGURANÇA
// ===============================
const atalhosCatalogoSeguranca = [
    // Segurança base (PADRÃO)
    { id: "usuario", label: "Usuário", rota: "/usuario-seguranca", icone: "fa-user" },
    { id: "cargos", label: "Cargos", rota: "/cargos", icone: "fa-id-badge" },
    { id: "departamentos", label: "Departamentos", rota: "/departamentos", icone: "fa-building" },
    { id: "grupos", label: "Grupos", rota: "/grupos", icone: "fa-users-rectangle" },
    { id: "direitos", label: "Direitos", rota: "/direitos", icone: "fa-shield-halved" },

    // Cadastros extras
    { id: "servidor", label: "Servidor", rota: "/servidor", icone: "fa-server" },
    { id: "usuario-web", label: "Usuário Web", rota: "/usuario-web", icone: "fa-globe" },
    { id: "celulares", label: "Celulares", rota: "/celulares", icone: "fa-mobile-screen-button" },
];

// ===============================
// IDS PADRÃO (OS 5 FIXOS)
// ===============================
const IDS_PADRAO_SEGURANCA = [
    "usuario",
    "cargos",
    "departamentos",
    "grupos",
    "direitos",
];

// ===============================
// NORMALIZAÇÃO CENTRAL DE ROTAS
// ===============================
function normalizarRotaSeguranca(rota) {
    if (!rota) return "/modulo-seguranca";

    const r = rota.startsWith("/") ? rota : `/${rota}`;
    return r.startsWith("/modulo-seguranca") ? r : `/modulo-seguranca${r}`;
}

const MenuRapidoSegurancaContext = createContext();

// ===============================
// PROVIDER
// ===============================
export function MenuRapidoSegurancaProvider({ children }) {
    const [atalhos, setAtalhos] = useState(() => {
        try {
            const salvo = localStorage.getItem("menuRapido_seguranca");
            const base = salvo ? JSON.parse(salvo) : null;

            if (Array.isArray(base) && base.length > 0) {
                return base.map(a => ({
                    ...a,
                    rota: normalizarRotaSeguranca(a.rota),
                }));
            }

            // fallback → padrões
            return atalhosCatalogoSeguranca
                .filter(a => IDS_PADRAO_SEGURANCA.includes(a.id))
                .map(a => ({
                    ...a,
                    rota: normalizarRotaSeguranca(a.rota),
                }));
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem("menuRapido_seguranca", JSON.stringify(atalhos));
    }, [atalhos]);

    // ===============================
    // AÇÕES
    // ===============================
    const adicionarAtalho = (atalho) => {
        setAtalhos(prev => {
            const rota = normalizarRotaSeguranca(atalho.rota);
            if (prev.some(a => a.rota === rota)) return prev;

            return [...prev, { ...atalho, rota }];
        });
    };

    const removerAtalho = (rota) => {
        const rotaNorm = normalizarRotaSeguranca(rota);
        setAtalhos(prev => prev.filter(a => a.rota !== rotaNorm));
    };

    // 🔁 RESTAURAR PADRÃO (APENAS OS 5)
    const restaurarPadrao = () => {
        const padrao = atalhosCatalogoSeguranca
            .filter(a => IDS_PADRAO_SEGURANCA.includes(a.id))
            .map(a => ({
                ...a,
                rota: normalizarRotaSeguranca(a.rota),
            }));

        setAtalhos(padrao);
    };

    return (
        <MenuRapidoSegurancaContext.Provider
            value={{
                atalhos,
                adicionarAtalho,
                removerAtalho,
                restaurarPadrao,
                CATALOGO_SEGURANCA: atalhosCatalogoSeguranca,
            }}
        >
            {children}
        </MenuRapidoSegurancaContext.Provider>
    );
}

// ===============================
// HOOK
// ===============================
export function useMenuRapidoSeguranca() {
    const ctx = useContext(MenuRapidoSegurancaContext);
    if (ctx) return ctx;

    // fallback defensivo (evita tela branca)
    return {
        atalhos: [],
        adicionarAtalho: () => { },
        removerAtalho: () => { },
        restaurarPadrao: () => { },
        CATALOGO_SEGURANCA: atalhosCatalogoSeguranca,
    };
}
