import { create } from 'zustand';

const getHojeISO = () => new Date().toISOString().slice(0, 10);

// ========================
// ESTADO INICIAL - DADOS DA VIAGEM (aba Viagem)
// ========================
const initialDadosViagem = {
    // Viagem
    nrViagem: "",
    manifesto: "",
    coleta: "",
    tipoCarga: "Fracionada",
    empresa: "001 - MANTRAN TRANSPORTES LTDA",
    filial: "001 - MANTRAN TRANSPORTES LTDA",
    divisao: "Logística",

    // Origem
    clienteCnpj: "",
    clienteRazao: "",
    expedidorCnpj: "",
    expedidorRazao: "",
    remetenteCnpj: "",
    remetenteRazao: "",
    origemCep: "",
    origemCidade: "",
    origemUf: "",
    tabelaFrete: "000083 - TABELA TESTE HNK",
    tipoTabela: "CEVA",
    rateioFrete: false,
    veiculoSolicitado: "01 - UTILITÁRIO",

    // Destino
    destinatarioCnpj: "",
    destinatarioRazao: "",
    destinoCep: "",
    destinoCidade: "",
    destinoUf: "",

    // Motorista / Veículos
    motoristaCnh: "",
    motoristaNome: "",
    agregado: "",
    kmInicial: "0",
    tracaoCodigo: "",
    tracaoPlaca: "",
    tracaoTipo: "",
    reboqueCodigo: "",
    reboquePlaca: "",
    recebedorCnpj: "",
    recebedorRazao: "",
    kmAtual: "0",
    classeCodigo: "",
    classeNome: "",

    // Datas
    dataCadastro: getHojeISO(),
    dataInicioPrev: getHojeISO(),
    horaInicioPrev: "",
    dataChegadaPrev: getHojeISO(),
    horaChegadaPrev: "",
    kmFinal: "0",

    // Observação
    observacao: "",
    tabelaAgregado: "",
};

// ========================
// ESTADO INICIAL - FILTROS
// ========================
const initialFiltros = {
    // Aba Consulta
    filialOrigem: "001 - TESTE MANTRAN",
    tipoCarga: "TODAS",
    nrViagem: "",
    status: "TODOS",
    clienteCnpj: "",
    clienteRazao: "",
    apenasAgregados: false,
    nrSolicitacao: "",
    remetenteCnpj: "",
    remetenteRazao: "",
    origemCep: "",
    origemCidade: "",
    origemUf: "",
    destinatarioCnpj: "",
    destinatarioRazao: "",
    destinoCep: "",
    destinoCidade: "",
    destinoUf: "",
    agregadoCnpj: "",
    agregadoRazao: "",
    divisao: "TODAS",
    viagensSemFrete: false,
    motoristaCnh: "",
    motoristaNome: "",
    veiculoCodigo: "",
    veiculoPlaca: "",
    veiculoDesc: "",
    periodoDe: "2025-10-01",
    periodoAte: getHojeISO(),
    dtInicioPrev: false,
    ctrc: "",
    coleta: "",

    // Aba Doctos (Adicionar CTRCs)
    docClienteCnpj: "",
    docClienteRazao: "",
    docPeriodoDe: "2025-10-01",
    docPeriodoAte: getHojeISO(),
    docRemetenteCnpj: "",
    docRemetenteRazao: "",
    docNaoEncerrados: false,
    docIncluirCancelados: false,
    docFilial: "TODAS",
    docTipoDocs: "Coleta",
    docNrDoc: "",
    docViagem: "",

    // Aba Entregas
    entregasFilial: "001 - ENTREGATEX LOGISTICA E TECNOLO",
    entregasOcorrencia: "0",
    entregasVeiculoCodigo: "",
    entregasVeiculoDesc: "",
    entregasMotoristaCnh: "",
    entregasMotoristaNome: "",
    entregasPeriodoDe: getHojeISO(),
    entregasPeriodoAte: getHojeISO(),
};

// ========================
// ESTADO INICIAL - UI (modais, abas)
// ========================
const initialUiState = {
    activeTab: "viagem",
    openNotas: false,
    modalMontarCteOpen: false,
    modalOpen: false,
    modalEncerrarOpen: false,
    modalPagamentoOpen: false,
    modalCustosOpen: false,
    modalInicioOpen: false,
    modalMontarMinutaOpen: false,
    modalDespesaOpen: false,
    modalMonitoramentoOpen: false,
};

// ========================
// ZUSTAND STORE
// ========================
export const useViagemStore = create((set) => ({
    // State
    dadosViagem: { ...initialDadosViagem },
    filtros: { ...initialFiltros },
    uiState: { ...initialUiState },

    // Actions - Dados da Viagem
    updateDadosViagem: (field, value) =>
        set((state) => ({
            dadosViagem: { ...state.dadosViagem, [field]: value }
        })),

    setDadosViagem: (obj) =>
        set((state) => ({
            dadosViagem: { ...state.dadosViagem, ...obj }
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

    // Actions - Form
    limparFormulario: () =>
        set({
            dadosViagem: { ...initialDadosViagem },
            filtros: { ...initialFiltros },
        }),

    // Action - Reset completo
    resetStore: () =>
        set({
            dadosViagem: { ...initialDadosViagem },
            filtros: { ...initialFiltros },
            uiState: { ...initialUiState },
        }),
}));
