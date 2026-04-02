// Mock dos parâmetros do módulo Financeiro
// Simula o que futuramente virá da API

const mockParametroFinanceiro = {
    notificacoes: {
        // Regra fixa do sistema
        contasVencemHoje: true,

        // Configuráveis pelo usuário
        permitirContasVencidas: false,
        permitirAvisoAntesVencimento: true,
        diasAntecedencia: 3
    }
};

// Simula GET
export function getParametroFinanceiro() {
    return Promise.resolve(mockParametroFinanceiro);
}

// Simula SAVE
export function saveParametroFinanceiro(novosDados) {
    Object.assign(mockParametroFinanceiro, novosDados);
    return Promise.resolve({ success: true });
}

export default mockParametroFinanceiro;
