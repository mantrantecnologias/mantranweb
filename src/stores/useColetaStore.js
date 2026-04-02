import { create } from 'zustand';

const getHojeISO = () => new Date().toISOString().slice(0, 10);
const getHoraAtual = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5); // formato HH:MM
};

// ========================
// ESTADO INICIAL - DADOS DA COLETA (aba Cadastro)
// ========================
const initialDadosColeta = {
    // Dados Principais
    empresa: "001 - MANTRAN TRANSPORTES LTDA",
    filial: "",
    dataSolicitacao: getHojeISO(),
    horaSolicitacao: getHoraAtual(),
    nrSolicitacao: "",
    nrViagem: "",
    nrColeta: "",
    dataCadastro: getHojeISO(),
    dataAlteracao: getHojeISO(),
    status: "",
    operador: "SUPORTE",
    motorista: "",
    placa: "",
    veiculoSolicitado: "3/4",
    divisao: "LOGÍSTICA",

    // Participantes (CNPJ/CPF + razão + cidade + UF)
    solicitanteCnpj: "",
    solicitanteRazao: "",
    solicitanteCidade: "",
    solicitanteUf: "",
    remetenteCnpj: "",
    remetenteRazao: "",
    remetenteCidade: "",
    remetenteUf: "",
    expedidorCnpj: "",
    expedidorRazao: "",
    expedidorCidade: "",
    expedidorUf: "",
    destinatarioCnpj: "",
    destinatarioRazao: "",
    destinatarioCidade: "",
    destinatarioUf: "",

    // Detalhes da Coleta
    dataColeta: getHojeISO(),
    horaColeta: "",
    restricao: "ATÉ",
    contato: "",
    funcionamento1: "08:00",
    funcionamento2: "12:00",
    funcionamento3: "13:00",
    funcionamento4: "18:00",
    localCnpj: "",
    localRazao: "",
    cep: "",
    cidade: "",
    uf: "",
    bairro: "",
    endereco: "",
    numero: "",
    produtoCodigo: "",
    produtoDesc: "",
    embalagemCodigo: "",
    embalagemDesc: "",
    observacao: "",

    // Checkboxes
    cargaImo: false,
    reeferLigado: false,
    padraoAlimento: false,
    motoristaCheck: false,

    // Notas Fiscais
    qtdNfInf: "0",
    qtdNfReal: "0",
    pesoInf: "0,000",
    pesoReal: "0",
    volInf: "0,00",
    volReal: "0,000",
    valorInfNf: "0,00",
    valorRealNf: "0,000",
    vrKgColeta: "0,00",
};

// ========================
// ESTADO INICIAL - FILTROS (aba Consulta)
// ========================
const initialFiltros = {
    filialConsulta: "",
    statusConsulta: "TODOS",
    periodoInicio: getHojeISO(),
    periodoFim: getHojeISO(),
    motoristaCod: "",
    motoristaNome: "",
    solicitanteCnpjFiltro: "",
    solicitanteNomeFiltro: "",
    nrColetaFiltro: "",
    ctrc: "Ambos",
    destinatarioCnpjFiltro: "",
    destinatarioNomeFiltro: "",
    nrSolicitacaoFiltro: "",
    nrGmci: "",
    tipo: "40 REEFER HIGH CUBIC",
    nrContainer: "",
    cargaImoFiltro: false,
    nomeNavio: "",
    postergada: "",
    comPostergada: false,
};

// ========================
// ESTADO INICIAL - UI (modais, abas)
// ========================
const initialUiState = {
    activeTab: "cadastro", // "cadastro" | "consulta"
    isCollapsed: false, // colapso do filtro na consulta
    showModalInicio: false,
    showModalEncerrar: false,
    showNotaFiscal: false,
    showComex: false,
    showPrintModal: false,
    showEtiquetaModal: false,
    modalMsg: false,
    confirmText: "",
    selectedStatus: null,
};

// ========================
// ESTADO INICIAL - IMPRESSÃO
// ========================
const initialPrintState = {
    printEmpresa: "001",
    printFilial: "",
    printTipo: "meia",
    printNrInicial: "",
    printNrFinal: "",
    etqNrInicial: "",
    etqNrFinal: "",
};

// ========================
// ZUSTAND STORE
// ========================
export const useColetaStore = create((set) => ({
    // State
    dadosColeta: { ...initialDadosColeta },
    filtros: { ...initialFiltros },
    uiState: { ...initialUiState },
    printState: { ...initialPrintState },
    listaConsulta: [],
    selecionados: [],
    selectedColetaNumero: "",
    confirmAction: null,
    formKey: 0,

    // Actions - Dados da Coleta
    updateDadosColeta: (field, value) =>
        set((state) => ({
            dadosColeta: { ...state.dadosColeta, [field]: value }
        })),

    setDadosColeta: (obj) =>
        set((state) => ({
            dadosColeta: { ...state.dadosColeta, ...obj }
        })),

    // Actions - Filtros
    updateFiltros: (field, value) =>
        set((state) => ({
            filtros: { ...state.filtros, [field]: value }
        })),

    setFiltros: (obj) =>
        set((state) => ({
            filtros: { ...state.filtros, ...obj }
        })),

    // Actions - UI State
    updateUiState: (field, value) =>
        set((state) => ({
            uiState: { ...state.uiState, [field]: value }
        })),

    setActiveTab: (tab) =>
        set((state) => ({
            uiState: { ...state.uiState, activeTab: tab }
        })),

    toggleCollapse: () =>
        set((state) => ({
            uiState: { ...state.uiState, isCollapsed: !state.uiState.isCollapsed }
        })),

    // Actions - Print State
    updatePrintState: (field, value) =>
        set((state) => ({
            printState: { ...state.printState, [field]: value }
        })),

    // Actions - Seleção
    setSelecionados: (arr) => set({ selecionados: arr }),

    setSelectedColetaNumero: (num) => set({ selectedColetaNumero: num }),

    setConfirmAction: (fn) => set({ confirmAction: fn }),

    // Actions - Consulta
    setListaConsulta: (arr) => set({ listaConsulta: arr }),

    // Actions - Form
    limparFormulario: () =>
        set({
            dadosColeta: { ...initialDadosColeta },
            selectedColetaNumero: "",
            formKey: Date.now(),
        }),

    limparFiltros: () =>
        set({
            filtros: { ...initialFiltros },
        }),

    incrementFormKey: () =>
        set((state) => ({ formKey: state.formKey + 1 })),

    // Action - Reset completo
    resetStore: () =>
        set({
            dadosColeta: { ...initialDadosColeta },
            filtros: { ...initialFiltros },
            uiState: { ...initialUiState },
            printState: { ...initialPrintState },
            listaConsulta: [],
            selecionados: [],
            selectedColetaNumero: "",
            confirmAction: null,
            formKey: 0,
        }),
}));
