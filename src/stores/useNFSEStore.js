import { create } from 'zustand';

// Itens iniciam vazios (tela limpa)
const initialItens = [];

// Função para obter data atual no formato ISO (YYYY-MM-DD)
const getDataAtual = () => {
    const hoje = new Date();
    return hoje.toISOString().split('T')[0];
};

const initialDadosNFSE = {
    // Linha 1
    empresa: "001",
    filial: "001",
    dataCadastro: getDataAtual(), // Data atual

    // Linha 2
    nrNota: "",
    serie: "",
    divisao: "1054 - LEO CAMPINAS",
    cfop: "",
    fatura: "",
    nrNFSE: "", // Campo readOnly no form

    // Linha 3 (Cliente)
    clienteCnpj: "",
    clienteRazao: "",
    clienteCidade: "",
    clienteUf: "",

    // Linha 4
    natureza: "PRESTAÇÃO DE SERVIÇO",
    tipoServico: "TRANSPORTES",
    cancelamento: "", // Inicia em branco

    // Itens
    itens: [...initialItens],

    // Tributações (Card 3)
    percVrLiquido: "0",
    tribIss: "EXIGÍVEL",
    retido: false,
    vrIssqn: "0",
    percPis: "0,00",
    percCofins: "0,00",
    totalServico: "0",
    percIrrf: "0",
    valorIrrf: "0",
    percIssqn: "0",
    tipoTributacao: "Operação Tributável (Base de cálculo = Valor da Operação)",
    observacao: "",
};

const initialFiltros = {
    empresa: "001",
    filial: "001",
    nf: "",
    serie: "",
    cgc: "",
    cliente: "",
    dtInicio: "2025-01-01",
    dtFim: "2025-10-20",
};

const initialUiState = {
    activeTab: "cadastro",
    showDoc: false, // Modal de itens
    showConsultaNFSE: false, // Modal de consulta
    selectedNF: null, // Nota selecionada na consulta
};

export const useNFSEStore = create((set) => ({
    // State
    dadosNFSE: { ...initialDadosNFSE },
    filtros: { ...initialFiltros },
    uiState: { ...initialUiState },

    // Actions - Dados
    updateDadosNFSE: (field, value) =>
        set((state) => ({
            dadosNFSE: { ...state.dadosNFSE, [field]: value }
        })),

    setDadosNFSE: (dados) =>
        set((state) => ({
            dadosNFSE: { ...state.dadosNFSE, ...dados }
        })),

    // Actions - Filtros
    updateFiltros: (field, value) =>
        set((state) => ({
            filtros: { ...state.filtros, [field]: value }
        })),

    setFiltros: (filtros) =>
        set((state) => ({
            filtros: { ...state.filtros, ...filtros }
        })),

    // Actions - UI
    updateUiState: (field, value) =>
        set((state) => ({
            uiState: { ...state.uiState, [field]: value }
        })),

    setActiveTab: (tab) =>
        set((state) => ({
            uiState: { ...state.uiState, activeTab: tab }
        })),

    // Actions - Itens
    setItens: (itens) =>
        set((state) => ({
            dadosNFSE: { ...state.dadosNFSE, itens }
        })),

    // Reset
    limparFormulario: () =>
        set({
            dadosNFSE: { ...initialDadosNFSE, dataCadastro: getDataAtual() }, // Atualiza data para atual
            uiState: { ...initialUiState, activeTab: "cadastro" } // Mantém na aba cadastro
        }),

    resetStore: () =>
        set({
            dadosNFSE: { ...initialDadosNFSE },
            filtros: { ...initialFiltros },
            uiState: { ...initialUiState },
        }),
}));
