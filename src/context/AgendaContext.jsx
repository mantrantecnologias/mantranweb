// src/context/AgendaContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AgendaContext = createContext();

export function AgendaProvider({ children }) {
    const [eventos, setEventos] = useState([]);

    // Simulação de usuário logado (depois você integra com seu contexto real)
    const usuarioAtual = {
        id: 1,
        nome: "Usuário Demo",
        empresa: "001",
        grupo: "GERAL",
    };

    // Carregar eventos do LocalStorage
    useEffect(() => {
        const saved = localStorage.getItem("agendaEventos");
        if (saved) {
            try {
                setEventos(JSON.parse(saved));
            } catch (e) {
                console.error("Erro ao ler agendaEventos do localStorage", e);
            }
        }
    }, []);

    // Salvar eventos sempre que alterar
    useEffect(() => {
        localStorage.setItem("agendaEventos", JSON.stringify(eventos));
    }, [eventos]);

    function criarEvento(dados) {
        const novo = {
            id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
            usuarioId: usuarioAtual.id,
            empresa: usuarioAtual.empresa,
            grupo: dados.grupo || usuarioAtual.grupo,
            titulo: dados.titulo,
            start: dados.start,
            end: dados.end,
            tipo: dados.tipo || "Geral",
            visibilidade: dados.visibilidade || "usuario", // 'usuario' | 'grupo' | 'empresa'
            lembreteMinutosAntes: dados.lembreteMinutosAntes ?? 60,
            origem: dados.origem || null,       // ex: 'veiculo', 'motorista'
            referenciaId: dados.referenciaId || null, // ex: id do veículo
            criadoEm: new Date().toISOString(),
        };
        setEventos((prev) => [...prev, novo]);
        return novo;
    }

    function atualizarEvento(id, dados) {
        setEventos((prev) =>
            prev.map((ev) => (ev.id === id ? { ...ev, ...dados } : ev))
        );
    }

    function removerEvento(id) {
        setEventos((prev) => prev.filter((ev) => ev.id !== id));
    }

    // Filtrar eventos conforme permissões simples
    function getEventosVisiveis() {
        return eventos.filter((ev) => {
            if (ev.visibilidade === "empresa") {
                return ev.empresa === usuarioAtual.empresa;
            }
            if (ev.visibilidade === "grupo") {
                return ev.empresa === usuarioAtual.empresa && ev.grupo === usuarioAtual.grupo;
            }
            // 'usuario'
            return ev.usuarioId === usuarioAtual.id;
        });
    }

    const value = {
        usuarioAtual,
        eventos,
        getEventosVisiveis,
        criarEvento,
        atualizarEvento,
        removerEvento,
    };

    return (
        <AgendaContext.Provider value={value}>{children}</AgendaContext.Provider>
    );
}

export function useAgenda() {
    const ctx = useContext(AgendaContext);
    if (!ctx) {
        throw new Error("useAgenda deve ser usado dentro de AgendaProvider");
    }
    return ctx;
}
