import { createContext, useContext, useEffect, useState } from "react";
import { useAgenda } from "./AgendaContext";

const NotificacaoContext = createContext();

export function useNotificacao() {
    return useContext(NotificacaoContext);
}

export function NotificacaoProvider({ children }) {
    const { getEventosVisiveis } = useAgenda();
    const [notificacoes, setNotificacoes] = useState([]);

    useEffect(() => {
        verificarNotificacoes();

        const interval = setInterval(() => verificarNotificacoes(), 30 * 1000);
        return () => clearInterval(interval);
    }, [getEventosVisiveis]);

    // ======================================
    // 🔔 VERIFICA TODAS AS NOTIFICAÇÕES
    // ======================================
    function verificarNotificacoes() {
        const agora = new Date();

        const rawModulo =
            localStorage.getItem("mantran_modulo") || "operacao";

        // 🔥 NORMALIZA O NOME DO MÓDULO
        const moduloAtivo =
            rawModulo === "operacional" ? "operacao" : rawModulo;

        const notificacoesAgenda = gerarNotificacoesAgenda(agora);
        const notificacoesFinanceiro = gerarNotificacoesFinanceiro();

        const todas = [...notificacoesAgenda, ...notificacoesFinanceiro];

        // 🔒 FILTRO FINAL POR MÓDULO
        const filtradas = todas.filter(
            (n) => !n.modulos || n.modulos.includes(moduloAtivo)
        );

        setNotificacoes((prev) =>
            filtradas.map((n) => {
                const existente = prev.find((p) => p.id === n.id);
                return {
                    ...n,
                    lido: existente?.lido ?? false,
                };
            })
        );
    }

    // ======================================
    // 📅 NOTIFICAÇÕES DA AGENDA
    // ======================================
    function gerarNotificacoesAgenda(agora) {
        const eventos = getEventosVisiveis();

        return eventos
            .filter((ev) => ev.lembreteMinutosAntes > 0)
            .filter((ev) => {
                const eventoData = new Date(ev.start);
                const lembreteData = new Date(
                    eventoData.getTime() - ev.lembreteMinutosAntes * 60000
                );
                return lembreteData <= agora && eventoData >= agora;
            })
            .map((ev) => ({
                id: `agenda-${ev.id}`,
                titulo: ev.titulo,
                start: ev.start,
                tipo: ev.tipo,
                origem: "agenda",
                modulos: ["operacao", "financeiro"], // 👈 aparece nos dois
            }));
    }

    // ======================================
    // 💰 NOTIFICAÇÕES DO FINANCEIRO (SISTEMA)
    // ======================================
    function gerarNotificacoesFinanceiro() {
        const lista = [];

        const notifContasHoje =
            localStorage.getItem("fin_notif_contas_hoje") !== "false";

        const notifContasVencidas =
            localStorage.getItem("fin_notif_contas_vencidas") === "true";

        const notifCertificados =
            localStorage.getItem("fin_notif_certificados") !== "false";

        const diasCert =
            Number(localStorage.getItem("fin_notif_cert_dias")) || 30;

        // 🔴 CONTAS A PAGAR — SOMENTE FINANCEIRO
        if (notifContasHoje) {
            lista.push({
                id: "fin-contas-hoje",
                titulo: "Contas a pagar vencendo hoje",
                origem: "financeiro",
                modulos: ["financeiro"], // 👈 REGRA APLICADA
            });
        }

        if (notifContasVencidas) {
            lista.push({
                id: "fin-contas-vencidas",
                titulo: "Existem contas a pagar vencidas",
                origem: "financeiro",
                modulos: ["financeiro"], // 👈 REGRA APLICADA
            });
        }

        // 🟢 CERTIFICADOS — OPERACAO + FINANCEIRO
        if (notifCertificados) {
            lista.push({
                id: "fin-certificados",
                titulo: `Certificados vencendo em até ${diasCert} dias`,
                origem: "financeiro",
                modulos: ["operacao", "financeiro"], // 👈 APARECE NOS DOIS
            });
        }

        return lista;
    }

    // ======================================
    // ✔️ MARCAR COMO LIDO
    // ======================================
    function marcarComoLido(id) {
        setNotificacoes((prev) =>
            prev.map((n) =>
                n.id === id ? { ...n, lido: true } : n
            )
        );
    }

    return (
        <NotificacaoContext.Provider
            value={{ notificacoes, marcarComoLido }}
        >
            {children}
        </NotificacaoContext.Provider>
    );
}
