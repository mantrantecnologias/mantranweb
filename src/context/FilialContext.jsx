import { createContext, useContext, useEffect, useState } from "react";

const FilialContext = createContext(null);

const STORAGE_KEY = "mantran_filial_ativa";

export function FilialProvider({ children }) {
    const [filialAtiva, setFilialAtiva] = useState(null);

    // 🔄 Carrega filial do localStorage ao iniciar
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setFilialAtiva(JSON.parse(stored));
            } catch {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    }, []);

    // ✅ Define filial ativa
    function setFilial(filial) {
        setFilialAtiva(filial);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filial));
    }

    // ❌ Limpa filial ativa
    function limparFilial() {
        setFilialAtiva(null);
        localStorage.removeItem(STORAGE_KEY);
    }

    return (
        <FilialContext.Provider
            value={{
                filialAtiva,
                setFilial,
                limparFilial,
            }}
        >
            {children}
        </FilialContext.Provider>
    );
}

// Hook padrão
export function useFilial() {
    const context = useContext(FilialContext);
    if (!context) {
        throw new Error("useFilial deve ser usado dentro de FilialProvider");
    }
    return context;
}
