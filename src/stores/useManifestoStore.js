import { create } from 'zustand';

// Retorna data atual no formato DD/MM/YYYY
const getHojeBR = () => {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    return `${dia}/${mes}/${ano}`;
};

const getHojeISO = () => new Date().toISOString().slice(0, 10);

// ========================
// ESTADO INICIAL - DADOS DO MANIFESTO
// ========================
const initialDadosManifesto = {
    // Dados da Filial
    nrManifesto: "",
    nrMdfe: "",
    tpManifesto: "coletaEntrega", // "coletaEntrega" | "transferencia"
    empresa: "001 - MANTRAN TRANSPORTES LTDA",
    filialDestino: "001 - TESTE MANTRAN",
    filialEmitente: "001 - TESTE MANTRAN",
    filialTransito: "001 - TESTE MANTRAN",
    nrLacres: "",
    cargasSoltas: "0",
    acertoConta: "",
    dataManifesto: getHojeBR(),
    observacao: "",
    chaveMdfe: "",
    protocolo: "",
    status: "",

    // Dados da Viagem
    filialOrigem: "001 - MANTRAN TECNOLOGIAS LTDA ME",
    tipoCarga: "0 - FECHADA",
    nrViagem: "",
    motoristaCodigo: "",
    motoristaNome: "",
    prevEntrega: getHojeISO(),
    kmAtual: "0",
    tracaoCodigo: "",
    tracaoDesc: "",
    capacidade: "",
    kmInicio: "0",
    reboqueCodigo: "",
    reboqueDesc: "",
    freteCombinado: "",
    kmFinal: "0",
    reboque2Codigo: "",
    reboque2Desc: "",
    tabAgregado: "",

    // Informações Complementares
    localCargaCep: "",
    localCargaCidade: "",
    localCargaUf: "",
    localDescargaCep: "",
    localDescargaCidade: "",
    localDescargaUf: "",
    rota: "",
    remetenteCodigo: "",
    remetenteRazao: "",
    destinatarioCodigo: "",
    destinatarioRazao: "",

    // Averbação
    dataCadastro: "",
    usuario: "",
    protocoloAverbacao: "",
};

// ========================
// ESTADO INICIAL - UI (modais, abas, colapsos)
// ========================
const initialUiState = {
    activeTab: "manifesto", // "manifesto" | "consulta" | "entregas"
    isPercursoOpen: false,
    isSeguroOpen: false,
    isDocsOpen: false,
    isModalOpen: false, // Modal genérico
    isInfoComplOpen: false,
    isCargaPerigosaOpen: false,
    isBaixaOpen: false,
    isCollapsedFilial: false,
    isCollapsedConsulta: false,
    isCollapsedEntregas: false,
    statusTransito: "verde", // "verde" | "amarelo" | "vermelho"
};

// ========================
// ESTADO INICIAL - FILTROS DE CONSULTA
// ========================
const initialFiltros = {
    filialVinculo: "",
    ocorrencia: "Todos",
    veiculoCodigo: "",
    veiculoDesc: "",
    motoristaCnh: "",
    motoristaNome: "",
    periodoInicio: getHojeISO(),
    periodoFim: getHojeISO(),
    nrManifestoFiltro: "",
    nrMdfeFiltro: "",
    // Filtros específicos da aba Entregas
    motoristaCnhEntregas: "",
    motoristaNomeEntregas: "",
    veiculoCodigoEntregas: "",
    veiculoDescEntregas: "",
};

// ========================
// ZUSTAND STORE
// ========================
export const useManifestoStore = create((set) => ({
    // State
    dadosManifesto: { ...initialDadosManifesto },
    uiState: { ...initialUiState },
    filtros: { ...initialFiltros },
    listaConsulta: [],
    dadosFiltrados: [],
    selecionados: [],
    manifestoSelecionado: null,
    formKey: 0,

    // Actions - Dados do Manifesto
    updateDadosManifesto: (field, value) =>
        set((state) => ({
            dadosManifesto: { ...state.dadosManifesto, [field]: value }
        })),

    setDadosManifesto: (obj) =>
        set((state) => ({
            dadosManifesto: { ...state.dadosManifesto, ...obj }
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

    toggleCollapse: (field) =>
        set((state) => ({
            uiState: { ...state.uiState, [field]: !state.uiState[field] }
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

    // Actions - Seleção
    setSelecionados: (arr) => set({ selecionados: arr }),

    toggleSelecionado: (index) =>
        set((state) => {
            const exists = state.selecionados.includes(index);
            return {
                selecionados: exists
                    ? state.selecionados.filter((i) => i !== index)
                    : [...state.selecionados, index]
            };
        }),

    selectAll: (length) =>
        set({ selecionados: Array.from({ length }, (_, i) => i) }),

    clearSelection: () => set({ selecionados: [] }),

    setManifestoSelecionado: (m) => set({ manifestoSelecionado: m }),

    // Actions - Grid/Consulta
    setDadosFiltrados: (arr) => set({ dadosFiltrados: arr }),
    setListaConsulta: (arr) => set({ listaConsulta: arr }),

    carregarDadosMock: () => {
        const mock = [
            ["001", "001", "I", "043559", "000588", "1", "100 - Autorizado", "15/10/2025", "15/10/2025", "HNK BR INDUSTRIA", "CERVEJARIAS KAISER", "RUA TESTE 123", "CAMPINAS"],
            ["001", "001", "A", "043560", "000589", "1", "100 - Autorizado", "16/10/2025", "16/10/2025", "HNK BR INDUSTRIA", "CERVEJARIAS KAISER", "RUA EXEMPLO 456", "SÃO PAULO"],
        ];
        set({ dadosFiltrados: mock, listaConsulta: mock });
    },

    // Mock de manifestos para consulta
    mockManifestos: [
        {
            id: 0,
            nrManifesto: "043581",
            filial: "001",
            motorista: "ALAN DA COSTA",
            dataManifesto: "23/01/2026",
            status: "ENCERRADO",
            nrMdfe: "001379",
            empresa: "001 - MANTRAN TRANSPORTES LTDA",
            filialOrigem: "001 - MANTRAN TECNOLOGIAS LTDA ME",
            filialDestino: "002 - VTA",
            filialEmitente: "001 - TESTE MANTRAN",
            filialTransito: "001 - TESTE MANTRAN",
            tipoCarga: "0 - FECHADA",
            motoristaCodigo: "12345",
            motoristaNome: "ALAN DA COSTA",
            tracaoCodigo: "000001",
            tracaoDesc: "ABC1234 - SCANIA R450",
            reboqueCodigo: "000005",
            reboqueDesc: "AGT1234 - RANDON",
            kmAtual: "125000",
            kmInicio: "1.000",
            kmFinal: "0.000",
            prevEntrega: "24/10/2025",
            capacidade: "30000",
            nrLacres: "LAC001, LAC002",
            cargasSoltas: "5",
            observacao: "Carga frágil - manuseio cuidadoso",
            chaveMdfe: "35251004086140001415800000137014862727725302",
            protocolo: "135250004853457",
            localCargaCep: "13010-001",
            localCargaCidade: "CAMPINAS",
            localCargaUf: "SP",
            localDescargaCep: "01310-100",
            localDescargaCidade: "SÃO PAULO",
            localDescargaUf: "SP",
            rota: "SP-01",
            remetenteCodigo: "12345678000190",
            remetenteRazao: "HNK BR INDÚSTRIA LTDA",
            destinatarioCodigo: "98765432000121",
            destinatarioRazao: "CERVEJARIAS KAISER S.A.",
            dataCadastro: "20/10/2025",
            usuario: "ADMIN",
            protocoloAverbacao: "AVB-2025-001370",
            acertoConta: "AC-001",
            // Novos campos para a Grid
            placa: "ABC1234",
            qtdCtrc: "1",
            qtdVol: "109",
            pesoTotal: "0.00",
            vrFrete: "0.00",
            freteTotal: "1540",
            dataBaixa: "",
            tpVeiculo: "A",
            retornoSefaz: "100 - Autorizado o uso do MDF-e",
        },
        {
            id: 1,
            nrManifesto: "043580",
            filial: "001",
            motorista: "ALAN DA COSTA",
            dataManifesto: "21/01/2026",
            status: "EM TRANSITO",
            nrMdfe: "001379",
            empresa: "001 - MANTRAN TRANSPORTES LTDA",
            filialOrigem: "001 - MANTRAN TECNOLOGIAS LTDA ME",
            filialDestino: "003 - VALINHOS",
            filialEmitente: "001 - TESTE MANTRAN",
            filialTransito: "002 - VTA",
            tipoCarga: "1 - GRANEL SÓLIDO",
            motoristaCodigo: "67890",
            motoristaNome: "ALAN DA COSTA",
            tracaoCodigo: "003",
            tracaoDesc: "RKW4156 - VOLVO FH 540",
            reboqueCodigo: "004",
            reboqueDesc: "JKL-3456 - GUERRA",
            kmAtual: "85000",
            kmInicio: "1.000",
            kmFinal: "0.000",
            prevEntrega: "25/10/2025",
            capacidade: "28000",
            nrLacres: "LAC003",
            cargasSoltas: "0",
            observacao: "Transferência entre filiais",
            chaveMdfe: "35251004086140001415800000137114862727725303",
            protocolo: "135250004853458",
            localCargaCep: "13400-001",
            localCargaCidade: "PIRACICABA",
            localCargaUf: "SP",
            localDescargaCep: "13270-000",
            localDescargaCidade: "VALINHOS",
            localDescargaUf: "SP",
            rota: "SP-02",
            remetenteCodigo: "11223344000155",
            remetenteRazao: "DISTRIBUIDORA ABC LTDA",
            destinatarioCodigo: "55667788000199",
            destinatarioRazao: "COMÉRCIO XYZ S.A.",
            dataCadastro: "22/10/2025",
            usuario: "OPERADOR",
            protocoloAverbacao: "AVB-2025-001371",
            acertoConta: "",
            // Novos campos para a Grid
            placa: "RKW4156",
            qtdCtrc: "3",
            qtdVol: "322",
            pesoTotal: "114.77",
            vrFrete: "755.88",
            freteTotal: "0.00",
            dataBaixa: "",
            tpVeiculo: "A",
            retornoSefaz: "100 - Autorizado o uso do MDF-e",
        },
        {
            id: 2,
            nrManifesto: "043579",
            filial: "001",
            motorista: "ALAN DA SILVA BARRETO",
            dataManifesto: "19/01/2026",
            status: "ENCERRADO",
            nrMdfe: "001378",
            empresa: "001 - MANTRAN TRANSPORTES LTDA",
            filialOrigem: "001 - MANTRAN TECNOLOGIAS LTDA ME",
            filialDestino: "001 - TESTE MANTRAN",
            filialEmitente: "001 - TESTE MANTRAN",
            filialTransito: "001 - TESTE MANTRAN",
            tipoCarga: "0 - FECHADA",
            motoristaCodigo: "11111",
            motoristaNome: "ALAN DA SILVA BARRETO",
            tracaoCodigo: "005",
            tracaoDesc: "DJC3886 - MERCEDES ACTROS",
            reboqueCodigo: "",
            reboqueDesc: "",
            kmAtual: "95000",
            kmInicio: "2.000",
            kmFinal: "0.000",
            prevEntrega: "20/01/2026",
            capacidade: "25000",
            nrLacres: "",
            cargasSoltas: "1",
            observacao: "",
            chaveMdfe: "35251004086140001415800000137814862727725304",
            protocolo: "135250004853459",
            localCargaCep: "13010-001",
            localCargaCidade: "CAMPINAS",
            localCargaUf: "SP",
            localDescargaCep: "01310-100",
            localDescargaCidade: "SÃO PAULO",
            localDescargaUf: "SP",
            rota: "SP-03",
            remetenteCodigo: "99887766000144",
            remetenteRazao: "INDÚSTRIA TESTE LTDA",
            destinatarioCodigo: "44556677000188",
            destinatarioRazao: "LOGÍSTICA EXPRESS S.A.",
            dataCadastro: "18/01/2026",
            usuario: "SUPERVISOR",
            protocoloAverbacao: "AVB-2026-001378",
            acertoConta: "",
            // Novos campos para a Grid
            placa: "DJC3886",
            qtdCtrc: "1",
            qtdVol: "1",
            pesoTotal: "12.991",
            vrFrete: "114.77",
            freteTotal: "755.88",
            dataBaixa: "",
            tpVeiculo: "A",
            retornoSefaz: "100 - Autorizado o uso do MDF-e",
        },
        {
            id: 3,
            nrManifesto: "043578",
            filial: "001",
            motorista: "ADRIANO BENTO DA SILVA",
            dataManifesto: "19/01/2026",
            status: "ENCERRADO",
            nrMdfe: "001377",
            empresa: "001 - MANTRAN TRANSPORTES LTDA",
            filialOrigem: "001 - MANTRAN TECNOLOGIAS LTDA ME",
            filialDestino: "001 - TESTE MANTRAN",
            filialEmitente: "001 - TESTE MANTRAN",
            filialTransito: "001 - TESTE MANTRAN",
            tipoCarga: "0 - FECHADA",
            motoristaCodigo: "22222",
            motoristaNome: "ADRIANO BENTO DA SILVA",
            tracaoCodigo: "006",
            tracaoDesc: "RLY1F82 - SCANIA R500",
            reboqueCodigo: "",
            reboqueDesc: "",
            kmAtual: "110000",
            kmInicio: "1.000",
            kmFinal: "0.000",
            prevEntrega: "20/01/2026",
            capacidade: "32000",
            nrLacres: "",
            cargasSoltas: "1",
            observacao: "",
            chaveMdfe: "35251004086140001415800000137714862727725305",
            protocolo: "135250004853460",
            localCargaCep: "13400-001",
            localCargaCidade: "PIRACICABA",
            localCargaUf: "SP",
            localDescargaCep: "13270-000",
            localDescargaCidade: "VALINHOS",
            localDescargaUf: "SP",
            rota: "SP-04",
            remetenteCodigo: "11112222000133",
            remetenteRazao: "TRANSPORTES UNIDOS LTDA",
            destinatarioCodigo: "33334444000177",
            destinatarioRazao: "ARMAZÉM CENTRAL S.A.",
            dataCadastro: "18/01/2026",
            usuario: "ADMIN",
            protocoloAverbacao: "AVB-2026-001377",
            acertoConta: "",
            // Novos campos para a Grid
            placa: "RLY1F82",
            qtdCtrc: "1",
            qtdVol: "107",
            pesoTotal: "112.913",
            vrFrete: "0.00",
            freteTotal: "5290.72",
            dataBaixa: "",
            tpVeiculo: "F",
            retornoSefaz: "135 - Manifesto Encerrado",
        },
        {
            id: 4,
            nrManifesto: "043576",
            filial: "001",
            motorista: "ADRIANO BENTO DA SILVA",
            dataManifesto: "15/01/2026",
            status: "ENCERRADO",
            nrMdfe: "001376",
            empresa: "001 - MANTRAN TRANSPORTES LTDA",
            filialOrigem: "001 - MANTRAN TECNOLOGIAS LTDA ME",
            filialDestino: "001 - TESTE MANTRAN",
            filialEmitente: "001 - TESTE MANTRAN",
            filialTransito: "001 - TESTE MANTRAN",
            tipoCarga: "0 - FECHADA",
            motoristaCodigo: "22222",
            motoristaNome: "ADRIANO BENTO DA SILVA",
            tracaoCodigo: "006",
            tracaoDesc: "RLY1F82 - SCANIA R500",
            reboqueCodigo: "",
            reboqueDesc: "",
            kmAtual: "108000",
            kmInicio: "1.000",
            kmFinal: "0.000",
            prevEntrega: "16/01/2026",
            capacidade: "32000",
            nrLacres: "",
            cargasSoltas: "1",
            observacao: "",
            chaveMdfe: "35251004086140001415800000137614862727725306",
            protocolo: "135250004853461",
            localCargaCep: "13010-001",
            localCargaCidade: "CAMPINAS",
            localCargaUf: "SP",
            localDescargaCep: "01310-100",
            localDescargaCidade: "SÃO PAULO",
            localDescargaUf: "SP",
            rota: "SP-05",
            remetenteCodigo: "55556666000122",
            remetenteRazao: "FÁBRICA NACIONAL LTDA",
            destinatarioCodigo: "77778888000111",
            destinatarioRazao: "DISTRIBUIÇÃO RÁPIDA S.A.",
            dataCadastro: "14/01/2026",
            usuario: "OPERADOR",
            protocoloAverbacao: "AVB-2026-001376",
            acertoConta: "",
            // Novos campos para a Grid
            placa: "RLY1F82",
            qtdCtrc: "1",
            qtdVol: "107",
            pesoTotal: "112.913",
            vrFrete: "0.00",
            freteTotal: "5290.72",
            dataBaixa: "",
            tpVeiculo: "A",
            retornoSefaz: "135 - Manifesto Encerrado",
        }
    ],

    // Ação para carregar manifesto selecionado nos dados
    carregarManifestoSelecionado: (id) => set((state) => {
        const mock = state.mockManifestos.find(m => m.id === id);
        if (!mock) return state;
        return {
            dadosManifesto: {
                ...state.dadosManifesto,
                nrManifesto: mock.nrManifesto,
                nrMdfe: mock.nrMdfe,
                empresa: mock.empresa,
                filialOrigem: mock.filialOrigem,
                filialDestino: mock.filialDestino,
                filialEmitente: mock.filialEmitente,
                filialTransito: mock.filialTransito,
                tipoCarga: mock.tipoCarga,
                motoristaCodigo: mock.motoristaCodigo,
                motoristaNome: mock.motoristaNome,
                tracaoCodigo: mock.tracaoCodigo,
                tracaoDesc: mock.tracaoDesc,
                reboqueCodigo: mock.reboqueCodigo,
                reboqueDesc: mock.reboqueDesc,
                kmAtual: mock.kmAtual,
                kmInicio: mock.kmInicio,
                kmFinal: mock.kmFinal,
                prevEntrega: mock.prevEntrega,
                capacidade: mock.capacidade,
                nrLacres: mock.nrLacres,
                cargasSoltas: mock.cargasSoltas,
                observacao: mock.observacao,
                chaveMdfe: mock.chaveMdfe,
                protocolo: mock.protocolo,
                status: mock.status,
                dataManifesto: mock.dataManifesto,
                localCargaCep: mock.localCargaCep,
                localCargaCidade: mock.localCargaCidade,
                localCargaUf: mock.localCargaUf,
                localDescargaCep: mock.localDescargaCep,
                localDescargaCidade: mock.localDescargaCidade,
                localDescargaUf: mock.localDescargaUf,
                rota: mock.rota,
                remetenteCodigo: mock.remetenteCodigo,
                remetenteRazao: mock.remetenteRazao,
                destinatarioCodigo: mock.destinatarioCodigo,
                destinatarioRazao: mock.destinatarioRazao,
                dataCadastro: mock.dataCadastro,
                usuario: mock.usuario,
                protocoloAverbacao: mock.protocoloAverbacao,
                acertoConta: mock.acertoConta,
            },
            uiState: { ...state.uiState, activeTab: "manifesto" },
            manifestoSelecionado: mock,
        };
    }),

    limparFormulario: () =>
        set((state) => ({
            dadosManifesto: {
                ...initialDadosManifesto,
                dataManifesto: getHojeBR(), // Atualiza a data para a atual
            },
            manifestoSelecionado: null,
            formKey: Date.now(),
        })),

    incrementFormKey: () =>
        set((state) => ({ formKey: state.formKey + 1 })),

    // Action - Reset completo
    resetStore: () =>
        set({
            dadosManifesto: { ...initialDadosManifesto },
            uiState: { ...initialUiState },
            filtros: { ...initialFiltros },
            listaConsulta: [],
            dadosFiltrados: [],
            selecionados: [],
            manifestoSelecionado: null,
            formKey: 0,
        }),
}));
