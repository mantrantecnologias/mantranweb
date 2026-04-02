import { create } from 'zustand';

const getHojeISO = () => new Date().toISOString().slice(0, 10);
const getHoraAtual = () => {
    const now = new Date();
    return now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

// Estado inicial dos dados da minuta
const initialDadosMinuta = {
    numero: "",
    dataMinuta: getHojeISO(),
    horaMinuta: getHoraAtual(),
    nrColeta: "",
    nrSolicitacao: "",
    tipoVeiculo: "VAN",

    motoristaCnh: "",
    motoristaNome: "",
    motoristaCpf: "",
    motoristaCelular: "",

    // Cliente
    clienteCnpj: "",
    clienteRazao: "",
    clienteCidade: "",
    clienteUf: "",

    // Remetente
    remetenteCnpj: "",
    remetenteRazao: "",
    remetenteCidade: "",
    remetenteUf: "",
    remetenteCep: "",

    // Destinatário
    destinatarioCnpj: "",
    destinatarioRazao: "",
    destinatarioCidade: "",
    destinatarioUf: "",
    destinatarioCep: "",

    // Expedidor
    expedidorCnpj: "",
    expedidorRazao: "",
    expedidorCidade: "",
    expedidorUf: "",
    expedidorCep: "",

    // Recebedor
    recebedorCnpj: "",
    recebedorRazao: "",
    recebedorCidade: "",
    recebedorUf: "",
    recebedorCep: "",

    // Cidade Origem / Destino (calculados)
    cidadeOrigemCep: "",
    cidadeOrigemNome: "",
    cidadeOrigemUf: "",
    cidadeDestinoCep: "",
    cidadeDestinoNome: "",
    cidadeDestinoUf: "",

    tracaoCodigo: "",
    tracaoPlacaDesc: "",
    reboqueCodigo: "",
    reboquePlacaDesc: "",

    // Valores do Frete
    peso: "",
    volume: "",
    vrMercadoria: "",
    observacao: "",
    fretePeso: "0,00",
    freteValor: "0,00",
    despacho: "0,00",
    cat: "0,00",
    pedagio: "0,00",
    gris: "0,00",
    valorOutros: "0,00",
    vrPernoite: "0,00",
    taxaColeta: "0,00",
    adval: "0,00",
    ajudante: "0,00",
    dta: "0,00",
    taxaEntrega: "0,00",
    escolta: "0,00",
    estadia: "0,00",
    estaciona: "0,00",
};

const initialFiltros = {
    filial: "001 - TESTE MANTRAN",
    status: "SEM CTRC",
    periodoDe: "2025-05-01",
    periodoAte: getHojeISO(),
    solicitacao: "",
    motoristaCnh: "",
    motoristaNome: "",
    remetenteCnpj: "",
    remetenteRazao: "",
    numeroMinuta: "",
    dataTipo: "Solicitação",
    destinatarioCnpj: "",
    destinatarioRazao: "",
    baixada: "TODAS",
    faturada: "TODAS",
    semViagem: false,
};

export const useMinutaStore = create((set) => ({
    // Dados do formulário da minuta
    dadosMinuta: { ...initialDadosMinuta },

    // Filtros da aba consulta
    filtros: { ...initialFiltros },

    // Lista de resultados da consulta
    listaConsulta: [],

    // Aba ativa
    activeTab: "cadastro",

    // Chave para resetar campos não-controlados
    formKey: 0,

    // Actions
    setDadosMinuta: (dados) =>
        set((state) => ({
            dadosMinuta: { ...state.dadosMinuta, ...dados }
        })),

    updateDadosMinuta: (field, value) =>
        set((state) => ({
            dadosMinuta: { ...state.dadosMinuta, [field]: value }
        })),

    setFiltros: (filtros) =>
        set((state) => ({
            filtros: { ...state.filtros, ...filtros }
        })),

    updateFiltros: (field, value) =>
        set((state) => ({
            filtros: { ...state.filtros, [field]: value }
        })),

    setListaConsulta: (lista) => set({ listaConsulta: lista }),

    setActiveTab: (tab) => set({ activeTab: tab }),

    incrementFormKey: () => set((state) => ({ formKey: state.formKey + 1 })),

    // Limpar formulário (retorna ao estado inicial - ambas as abas)
    limparFormulario: () => set({
        dadosMinuta: {
            ...initialDadosMinuta,
            dataMinuta: getHojeISO(),
            horaMinuta: getHoraAtual(),
        },
        filtros: { ...initialFiltros },
        listaConsulta: [],
        formKey: Date.now(),
    }),

    // Reset completo
    resetStore: () => set({
        dadosMinuta: {
            ...initialDadosMinuta,
            dataMinuta: getHojeISO(),
            horaMinuta: getHoraAtual(),
        },
        filtros: { ...initialFiltros },
        listaConsulta: [],
        activeTab: "cadastro",
        formKey: Date.now(),
    }),
}));
