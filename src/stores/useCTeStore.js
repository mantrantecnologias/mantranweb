import { create } from 'zustand';

const getHojeISO = () => new Date().toISOString().slice(0, 10);

// Estado inicial dos dados do CTe (valores padrão visualizados no componente)
const initialDadosCTe = {
    // Cabeçalho / Identificação
    filial: "",
    tipo: "0 - Normal",
    controle: "",
    data: getHojeISO(),
    tipoCarga: "",
    coleta: "",
    viagem: "",
    minuta: "",
    serie: "001",

    // Motorista
    motoristaCnh: "",
    motoristaNome: "",

    // Veículos
    romaneio: "",
    veiculoSolicitado: "",
    tracaoCodigo: "",
    tracaoDesc: "",
    reboqueCodigo: "",
    reboqueDesc: "",

    // Participantes
    clienteCgc: "",
    clienteRazao: "",
    clienteCidade: "",
    clienteUf: "",

    remetenteCgc: "",
    remetenteRazao: "",
    remetenteCidade: "",
    remetenteUf: "",
    remetenteCep: "",

    destinatarioCgc: "",
    destinatarioRazao: "",
    destinatarioCidade: "",
    destinatarioUf: "",
    destinatarioCep: "",
    destinatarioEnd: "",
    destinatarioBairro: "",

    expedidorCgc: "",
    expedidorRazao: "",
    expedidorCidade: "",
    expedidorUf: "",
    expedidorCep: "",
    expedidorEnd: "",
    expedidorBairro: "",

    recebedorCgc: "",
    recebedorRazao: "",
    recebedorCidade: "",
    recebedorUf: "",
    recebedorCep: "",
    recebedorEnd: "",
    recebedorBairro: "",

    seguradoraCgc: "",
    seguradoraRazao: "",

    // Entrega e Modalidade
    endEntrega: "",
    numeroEntrega: "",
    bairroEntrega: "",

    origemCidade: "",
    origemUf: "",
    destinoCidade: "",
    destinoUf: "",
    divisaoLoja: "",

    modalidade: "C-CIF",
    tipoFrete: "F - FATURADO",
    rota: "",
    tipo: "N",
    situacao: "",

    // Dados Complementares
    centroCusto: "",
    cargaImo: false,
    tabFrete: "",
    modal: "01 - Rodoviário",

    cepOrigem: "",
    cepDestinoCalc: "",
    pesoCalc: "",
    tpServico: "0", // 0 - Frete Normal

    ocorrencia: "",
    seguro: "4 - Por conta do Emissor CTe",
    chaveCte: "",
    tarifa: "",

    // Datas e outros
    dataCadastro: "",
    dataAtualizacao: "",
    prevEntrega: "",
    operador: "",
    numCotacao: "",
    numFatura: "",
};



const initialFiltros = {
    // Filtros da aba Consulta
    remetenteCgc: "",
    remetenteRazao: "",
    destinatarioCgc: "",
    destinatarioRazao: "",
    motoristaCnh: "",
    motoristaNome: "",
    veiculoPlaca: "",
    veiculoDesc: "",
};

const initialUiState = {
    // Modais
    showCustos: false,
    showNotaFiscal: false,
    showComex: false,
    showValoresCte: false,
    showNotaFiscalCte: false,
    showConsultaSefaz: false,
    showComplementar: false,
    showSubstituicao: false,
    showDocs: false,
    showPrintMenu: false,
    showPrintLote: false,

    // Impressão Lote
    loteIni: "",
    loteFim: "",
    filialPrint: "002",

    // Checkboxes grid
    showCheckboxes: false,
};

// Mock de dados para a grid
// Mock de dados para a grid
const dadosMock = [
    {
        empresa: "001",
        filial: "001",
        situacao: "I - Impresso",
        controle: "058840",
        impresso: "000001",
        serie: "001",
        retornoSefaz: "Autorizado o uso do CT-e",
        data: "2025-10-15",
        dataAtualizacao: "2025-10-15",
        remetenteCgc: "04086814000141",
        remetenteRazao: "MANTRAN TRANSPORTES LTDA",
        remetenteCidade: "JUNDIAI",
        remetenteUf: "SP",
        destinatarioCgc: "16464947000193",
        destinatarioRazao: "BEVANNI TRANSPORTES LTDA",
        destinatarioCidade: "SAO PAULO",
        destinatarioUf: "SP",
        destinatarioEnd: "RUA AUGUSTA, 500",
        destinoCidade: "SAO PAULO",
        destinoUf: "SP",
        motoristaCnh: "123456789",
        motoristaNome: "ALAN BRYAN",
        tracaoCodigo: "V001",
        tracaoDesc: "ABC-1234 - SCANIA - Cavalo",
    },
    {
        empresa: "001",
        filial: "001",
        situacao: "I - Impresso",
        controle: "058839",
        impresso: "000002",
        serie: "001",
        retornoSefaz: "Autorizado o uso do CT-e",
        data: "2025-10-15",
        dataAtualizacao: "2025-10-15",
        remetenteCgc: "04086814000141",
        remetenteRazao: "MANTRAN TRANSPORTES LTDA",
        destinatarioCgc: "12345678000199",
        destinatarioRazao: "AMBEV LOGISTICA LTDA",
        destinatarioCidade: "RESENDE",
        destinatarioUf: "RJ",
        destinatarioEnd: "RODOVIA PRESIDENTE DUTRA, KM 10",
        destinoCidade: "RESENDE",
        destinoUf: "RJ",
    },
];

export const useCTeStore = create((set) => ({
    // States
    dadosCTe: { ...initialDadosCTe },
    filtros: { ...initialFiltros },
    uiState: { ...initialUiState },

    // Consulta
    listaConsulta: [], // Começa vazia
    dadosFiltrados: [], // Começa vazia (era setado no mock)
    selecionados: [], // Checkboxes
    cteSelecionado: null,

    // Aba ativa
    activeTab: "cte",

    // Chave para resetar campos não-controlados (se necessário)
    formKey: 0,

    // --- ACTIONS ---

    // Atualiza um campo específico do CTe
    updateDadosCTe: (field, value) =>
        set((state) => ({
            dadosCTe: { ...state.dadosCTe, [field]: value }
        })),

    setDadosCTe: (obj) =>
        set((state) => ({
            dadosCTe: { ...state.dadosCTe, ...obj }
        })),

    // Atualiza filtros
    updateFiltros: (field, value) =>
        set((state) => ({
            filtros: { ...state.filtros, [field]: value }
        })),

    setFiltros: (obj) =>
        set((state) => ({
            filtros: { ...state.filtros, ...obj }
        })),

    // Atualiza estado de UI
    updateUiState: (field, value) =>
        set((state) => ({
            uiState: { ...state.uiState, [field]: value }
        })),

    // Seleção de CTe na grid
    setCteSelecionado: (registro) => set({ cteSelecionado: registro }),

    // Grid Checkboxes
    setSelecionados: (novosSelecionados) => set({ selecionados: novosSelecionados }),
    toggleSelecionado: (index) =>
        set((state) => {
            const current = state.selecionados;
            const exists = current.includes(index);
            return {
                selecionados: exists
                    ? current.filter((i) => i !== index)
                    : [...current, index]
            };
        }),
    selectAll: (totalLength) => set({ selecionados: Array.from({ length: totalLength }, (_, i) => i) }),
    clearSelection: () => set({ selecionados: [] }),

    // Pesquisa Mock (carregar dados)
    carregarDadosMock: () => set({ dadosFiltrados: dadosMock }),

    // Navegação de Abas
    setActiveTab: (tab) => set({ activeTab: tab }),

    // Reset para estado inicial
    limparFormulario: () => set({
        dadosCTe: { ...initialDadosCTe, data: getHojeISO() },
        filtros: { ...initialFiltros },
        uiState: { ...initialUiState },
        cteSelecionado: null,
        formKey: Date.now(),
    }),

    // Incrementa formKey
    incrementFormKey: () => set((state) => ({ formKey: state.formKey + 1 })),
}));
