import { mockNotificacoesFinanceiro } from "../mocks/mockNotificacoesFinanceiro";
import { mockNotificacoesOperacional } from "../mocks/mockNotificacoesOperacional";

// Flag global de mock (depois vira false)
const USE_MOCK = true;

/**
 * Retorna notificações conforme o módulo/perfil
 */
export function getNotificacoes({ modulo }) {
    if (!USE_MOCK) {
        // FUTURO: chamada real da API
        // return api.get(`/notificacoes?modulo=${modulo}`);
    }

    if (modulo === "financeiro") {
        return Promise.resolve(mockNotificacoesFinanceiro);
    }

    if (modulo === "operacional") {
        return Promise.resolve(mockNotificacoesOperacional);
    }

    return Promise.resolve([]);
}

/**
 * Marca notificação como lida
 */
export function marcarComoLida(notificacaoId, modulo) {
    if (!USE_MOCK) {
        // FUTURO: PUT /notificacoes/{id}/lida
    }

    const lista =
        modulo === "financeiro"
            ? mockNotificacoesFinanceiro
            : mockNotificacoesOperacional;

    const notif = lista.find((n) => n.id === notificacaoId);
    if (notif) notif.lida = true;

    return Promise.resolve({ success: true });
}

/**
 * Retorna somente não lidas
 */
export function getNotificacoesNaoLidas({ modulo }) {
    return getNotificacoes({ modulo }).then((lista) =>
        lista.filter((n) => !n.lida)
    );
}
