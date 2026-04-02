import { useState, useEffect } from "react";
import ViagemDespesa from "./ViagemDespesa";
import ViagemCustosOperacionais from "./ViagemCustosOperacionais";
import ViagemInicio from "./ViagemInicio";
import ViagemEncerramento from "./ViagemEncerramento";
import { useNavigate } from "react-router-dom";
import ViagemMontarCte from "./ViagemMontarCte";
import ViagemMontarMinuta from "./ViagemMontarMinuta";
import ViagemPagamento from "./ViagemPagamento";
import ViagemMonitoramento from "./ViagemMonitoramento";
import { useIconColor } from "../context/IconColorContext";
import { useViagemStore } from "../stores/useViagemStore";
import InputBuscaCliente from "../components/InputBuscaCliente";
import InputBuscaMotorista from "../components/InputBuscaMotorista";
import InputBuscaVeiculo from "../components/InputBuscaVeiculo";
import { maskCNPJ } from "../utils/masks";
import InputBuscaCidade from "../components/InputBuscaCidade";



import {
  XCircle,
  Fuel,
  CheckCircle,
  RotateCcw,
  PlayCircle,
  PlusCircle,
  Edit,
  Trash2,
  Pencil,
  Printer,
  Copy,
  Search,
  FileText,
  FileSpreadsheet,
  Download,
  Truck,
  DollarSign,
  MapPin,
  Eraser,
  RefreshCcw,
  UserCheck,
  PanelBottom,
} from "lucide-react";



function Label({ children, className = "" }) {
  return (
    <label
      className={`text-[12px] text-gray-700 flex items-center ${className}`}
    >
      {children}
    </label>
  );
}
function Txt({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`border border-gray-300 rounded px-2 py-[2px] h-[26px] text-[13px] w-full ${className}`}
    />
  );
}
function Sel({ children, className = "", ...rest }) {
  return (
    <select
      {...rest}
      className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full ${className}`}
    >
      {children}
    </select>
  );
}


export default function Viagem({ open }) {
  const navigate = useNavigate();
  const {
    footerIconColorNormal,
    footerIconColorHover
  } = useIconColor();

  // === ZUSTAND STORE ===
  const {
    dadosViagem, setDadosViagem, updateDadosViagem,
    filtros, setFiltros, updateFiltros,
    uiState, updateUiState, setActiveTab, limparFormulario
  } = useViagemStore();
  const {
    activeTab,
    openNotas,
    modalMontarCteOpen,
    modalEncerrarOpen,
    modalPagamentoOpen,
    modalCustosOpen,
    modalInicioOpen,
    modalMontarMinutaOpen,
    modalDespesaOpen,
    modalMonitoramentoOpen,
  } = uiState;

  // Helpers para setar modais
  const setModalMontarCteOpen = (val) => updateUiState("modalMontarCteOpen", val);
  const setModalEncerrarOpen = (val) => updateUiState("modalEncerrarOpen", val);
  const setModalPagamentoOpen = (val) => updateUiState("modalPagamentoOpen", val);
  const setModalCustosOpen = (val) => updateUiState("modalCustosOpen", val);
  const setModalInicioOpen = (val) => updateUiState("modalInicioOpen", val);
  const setModalMontarMinutaOpen = (val) => updateUiState("modalMontarMinutaOpen", val);
  const setModalDespesaOpen = (val) => updateUiState("modalDespesaOpen", val);
  const setModalMonitoramentoOpen = (val) => updateUiState("modalMonitoramentoOpen", val);
  const setOpenNotas = (val) => updateUiState("openNotas", val);

  // Helper para atualizar campos do formulário
  const handleChange = (field) => (e) => {
    updateDadosViagem(field, e.target.value);
  };

  // Estados locais que não precisam persistir
  const [valorFrete, setValorFrete] = useState(0);
  const [custoViagem, setCustoViagem] = useState(0);

  const lucratividade = valorFrete
    ? (((valorFrete - custoViagem) / valorFrete) * 100).toFixed(2)
    : 0;


  // Estados para o grid de adição e documentos da viagem
  const [docsAdicao, setDocsAdicao] = useState(
    [...Array(8)].map((_, i) => ({
      id: i,
      empresa: "001",
      filial: "001",
      razao: "HNK BR IND. BEBIDAS LTDA",
      controle: `0588${i}`,
      impresso: `0588${i}`,
      emissao: "20/10/2025",
      selecionado: false,
    }))
  );

  const [docsViagem, setDocsViagem] = useState([
    // Mock inicial para evitar tela vazia e testar layout
    {
      id: 1,
      empresa: "001",
      filial: "001",
      razao: "HNK BR IND. BEBIDAS LTDA",
      controle: "123456",
      impresso: "123456",
      emissao: "20/10/2025",
      selecionado: false,
    }
  ]);

  // Notas Fiscais (inicia vazio)
  const [notasFiscais, setNotasFiscais] = useState([]);

  // Despesas (inicia vazio ou com mock para evitar crash)
  const [despesas, setDespesas] = useState([
    // Mock opcional para teste
    {
      id: 1,
      valor: 150.00,
      descricao: "Descarga",
      data: "20/10/2025",
      tipo: "Despesa Viagem",
      selecionado: false
    }
  ] || []);

  const handleAdicionarDespesa = () => {
    setModalDespesaOpen(true);
  };

  const handleRemoverDespesa = () => {
    setDespesas((prev) => prev.filter((d) => !d.selecionado));
  };

  // === GRID CONSULTA ===
  const [gridConsulta, setGridConsulta] = useState(
    [...Array(10)].map((_, i) => ({
      id: i,
      nrViagem: `07903${i}`,
      status: i === 2 ? "EM ANDAMENTO" : i === 5 ? "ENCERRADA" : i === 7 ? "CANCELADA" : "NÃO INICIADA",
      selecionado: false,
      filial: "001",
      sq: "1",
      tracaoPlaca: i % 2 === 0 ? "RXW4I56" : "ABC1234",
      reboquePlaca: i % 2 === 0 ? "RKW3E53" : "XYZ9876",
      motoristaNome: i % 2 === 0 ? "ALAN DA COSTA" : "JOAO DA SILVA",
      motoristaCnh: i % 2 === 0 ? "01628446760" : "12345678900",
      origemCidade: i % 2 === 0 ? "ITU" : "SAO PAULO",
      origemUf: "SP",
      destinoCidade: i % 2 === 0 ? "SALVADOR" : "RIO DE JANEIRO",
      destinoUf: i % 2 === 0 ? "BA" : "RJ",
      dataViagem: "20/10/2025",
      horaViagem: "16:31",
      remetenteRazao: "HNK BR IND. BEBIDAS LTDA",
      destinatarioRazao: i % 2 === 0 ? "HNK BR IND. BEBIDAS LTDA RN" : "CLIENTE FINAL LTDA",
      pagadorFrete: "HNK BR IND. BEBIDAS LTDA",
      tipoCarga: "CARGA",
      nrFicha: "1",
      dtAcerto: "26/10/2025",
      nrAcerto: "123",
      nrColeta: "185704",
      tpMot: "TP01",
      vrFrete: i % 2 === 0 ? "1.250,00" : "2.500,00",
      freteAgregado: i % 2 === 0 ? "950,00" : "1.800,00",
      // Dados para preenchimento ao clicar
      clienteCnpj: "00000000000191", clienteRazao: "CLIENTE PADRAO",
      remetenteCnpj: "11111111000191",
      destinatarioCnpj: "22222222000191",
      tracaoCodigo: "100", reboqueCodigo: "200",
    }))
  );

  // Contadores
  const totalConsulta = gridConsulta.length;
  const totalSelConsulta = gridConsulta.filter((x) => x.selecionado).length;

  // Funções
  const selecionarTodosConsulta = () =>
    setGridConsulta((prev) => prev.map((x) => ({ ...x, selecionado: true })));

  const limparSelecaoConsulta = () =>
    setGridConsulta((prev) => prev.map((x) => ({ ...x, selecionado: false })));



  // === EFEITOS DE SINCRONIZAÇÃO (Endereço) ===
  // 1. Origem: Expedidor > Remetente
  //    Se tem expedidor, usa ele. Se não, usa remetente.
  //    Se ambos vazios, limpa (ou mantém o que o usuário digitou manualmente? 
  //    Regra CTePage: Sync forçado).
  useEffect(() => {
    if (dadosViagem.expedidorCnpj) {
      // Se tem expedidor, força dados dele na origem
      setDadosViagem({
        origemCidade: dadosViagem.expedidorCidade,
        origemUf: dadosViagem.expedidorUf,
        origemCep: dadosViagem.expedidorCep
      });
    } else if (dadosViagem.remetenteCnpj) {
      // Se não tem expedidor mas tem remetente, usa remetente
      setDadosViagem({
        origemCidade: dadosViagem.remetenteCidade,
        origemUf: dadosViagem.remetenteUf,
        origemCep: dadosViagem.remetenteCep
      });
    }
  }, [
    dadosViagem.expedidorCnpj, dadosViagem.expedidorCidade, dadosViagem.expedidorUf, dadosViagem.expedidorCep,
    dadosViagem.remetenteCnpj, dadosViagem.remetenteCidade, dadosViagem.remetenteUf, dadosViagem.remetenteCep
  ]);

  // 2. Destino: Recebedor > Destinatário (como Origem)
  useEffect(() => {
    if (dadosViagem.recebedorCnpj) {
      setDadosViagem({
        destinoCidade: dadosViagem.recebedorCidade,
        destinoUf: dadosViagem.recebedorUf,
        destinoCep: dadosViagem.recebedorCep
      });
    } else if (dadosViagem.destinatarioCnpj) {
      setDadosViagem({
        destinoCidade: dadosViagem.destinatarioCidade,
        destinoUf: dadosViagem.destinatarioUf,
        destinoCep: dadosViagem.destinatarioCep
      });
    }
  }, [
    dadosViagem.recebedorCnpj, dadosViagem.recebedorCidade, dadosViagem.recebedorUf, dadosViagem.recebedorCep,
    dadosViagem.destinatarioCnpj, dadosViagem.destinatarioCidade, dadosViagem.destinatarioUf, dadosViagem.destinatarioCep
  ]);

  // === INIT ===
  useEffect(() => {
    // Garante datas preenchidas ao abrir
    if (!dadosViagem.dataViagem) {
      const hoje = new Date().toISOString().slice(0, 10);
      const hora = new Date().toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
      setDadosViagem({
        dataViagem: hoje,
        horaViagem: hora,
        // Inicio/Chegada Previstos também? 
        dtInicioPrev: hoje,
        hrInicioPrev: hora,
        dtChegadaPrev: hoje,
        hrChegadaPrev: hora
      });
    }

    // Foco no primeiro campo (Cliente) 
    setTimeout(() => {
      const el = document.querySelector('[tabindex="1"]');
      if (el) el.focus();
    }, 100);
  }, []);


  // === HANDLERS === 

  // Tab Index Navigation
  const focusNextTabIndex = (current) => {
    // procura o próximo tabindex
    // A ordem solicitada: 
    // 1-Cliente, 2-Expedidor, 3-Remetente, 4-Origem(Busca), 
    // 5-TabFrete, 6-VeiculoSolicitado, 
    // 7-Destinatario, 8-CidadeDest(Busca), 
    // 9-Motorista, 10-Tracao, 11-Reboque, 
    // 12-InicioPrev, 13-HoraIni, 14-ChegadaPrev, 15-HoraCheg, 
    // 16-Observacao, 17-BtnIncluir
    const next = document.querySelector(`[tabindex="${Number(current) + 1}"]`);
    if (next) next.focus();
  };

  const handleEnterAsTab = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const current = e.target.getAttribute("tabindex");
      if (current) focusNextTabIndex(current);
    }
  };

  // Limpar
  const handleLimparTudo = () => {
    limparFormulario();

    // Reseta datas para agora
    const hoje = new Date().toISOString().slice(0, 10);
    const hora = new Date().toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });

    setDadosViagem({
      dataViagem: hoje,
      horaViagem: hora,
      dtInicioPrev: hoje,
      hrInicioPrev: hora,
      dtChegadaPrev: hoje,
      hrChegadaPrev: hora,

      // Campos de participantes
      clienteCnpj: "", clienteRazao: "",
      expedidorCnpj: "", expedidorRazao: "", expedidorCep: "", expedidorCidade: "",
      remetenteCnpj: "", remetenteRazao: "", remetenteCep: "", remetenteCidade: "",
      destinatarioCnpj: "", destinatarioRazao: "", destinatarioCep: "", destinatarioCidade: "",

      // Campos veiculo/mot
      motoristaCnh: "", motoristaNome: "",
      tracaoCodigo: "", tracaoPlaca: "",
      reboqueCodigo: "", reboquePlaca: "",

      // Address
      origemCep: "", origemCidade: "", origemUf: "",
      destinoCep: "", destinoCidade: "", destinoUf: "",

      veiculoSolicitado: "",
      observacao: ""
    });

    // Limpar grids e valores calculados
    setDocsViagem([]);
    setDespesas([]);
    setNotasFiscais([]);
    setValorFrete(0);
    setCustoViagem(0);
    // Se existir docsAdicao ou gridConsulta, talvez não precise limpar, ou sim?
    // User disse: "Card Ações e Notas Fiscais que já deve abrir em branco" -> docsViagem é o card de documentos/notas.

    // Foco em Cliente
    setTimeout(() => {
      const el = document.querySelector('[tabindex="1"]');
      if (el) el.focus();
    }, 100);
  };

  // Handler genérico para limpar nome se mudar código manualmente
  const handleCodigoChange = (prefix) => (e) => {
    const val = e.target.value;
    // Se digitou algo, atualiza só o código. 
    // Se limpar, limpa tudo.
    const updates = { [`${prefix}Cnpj`]: val };

    // Limpa dados atrelados para forçar nova busca
    updates[`${prefix}Razao`] = "";
    if (prefix === "expedidor" || prefix === "remetente" || prefix === "destinatario") {
      updates[`${prefix}Cidade`] = "";
      updates[`${prefix}Uf`] = "";
      updates[`${prefix}Cep`] = "";
    }
    setDadosViagem(updates);
  };

  const handleIncluir = () => {
    alert("Incluir Viagem (Simulação)");
  };

  const handleDoubleClickConsulta = (row) => {
    setDadosViagem({
      nrViagem: row.nrViagem,
      dataViagem: row.dataViagem,
      horaViagem: row.horaViagem,
      filial: row.filial,

      // Participantes
      clienteCnpj: row.clienteCnpj,
      clienteRazao: row.clienteRazao || row.pagadorFrete,
      remetenteCnpj: row.remetenteCnpj,
      remetenteRazao: row.remetenteRazao,
      destinatarioCnpj: row.destinatarioCnpj,
      destinatarioRazao: row.destinatarioRazao,

      // Endereços (mockados na grid)
      origemCidade: row.origemCidade,
      origemUf: row.origemUf,
      origemCep: "13300000", // CEP Mock
      destinoCidade: row.destinoCidade,
      destinoUf: row.destinoUf,
      destinoCep: "40000000", // CEP Mock

      // Motorista / Veiculo
      motoristaCnh: row.motoristaCnh,
      motoristaNome: row.motoristaNome,
      tracaoCodigo: row.tracaoCodigo,
      tracaoPlaca: row.tracaoPlaca,
      tracaoTipo: "Frota", // Mock
      reboqueCodigo: row.reboqueCodigo,
      reboquePlaca: row.reboquePlaca,

      // Outros
      tipoCarga: row.tipoCarga === "FRACIONADA" || row.tipoCarga === "FARINHA" ? "Fracionada" : "Fechada",
      manifesto: "12345", // Mock
      coleta: row.nrColeta,
      empresa: "001 - MANTRAN TRANSPORTES LTDA",
      divisao: "Logística",

      // Manter datas prev = datas reais p/ simulação
      dtInicioPrev: row.dataViagem,
      hrInicioPrev: row.horaViagem,
      dtChegadaPrev: row.dataViagem,
      hrChegadaPrev: "18:00",

      observacao: `Viagem carregada via duplo clique na grid. ID: ${row.id}`,

      // Resetar outros campos que não estao na grid
      expedidorCnpj: "", expedidorRazao: "",
    });
    setActiveTab("viagem");
  };

  // Totais da aba Doctos (Cálculos simples para evitar crash)
  const qtDocs = docsViagem ? docsViagem.length : 0;
  // Mock de valores para exemplo (multiplicando qtde por valor fixo)
  const totalVrMercadoria = qtDocs * 1000;
  const totalFrete = qtDocs * 125;

  const todosSelecionados = docsViagem.length > 0 && docsViagem.every((doc) => doc.selecionado);

  const handleToggleSelecionarTodos = () => {
    setDocsViagem((prev) =>
      prev.map((doc) => ({ ...doc, selecionado: !todosSelecionados }))
    );
  };

  const handleRemover = () => {
    setDocsViagem((prev) => prev.filter((doc) => !doc.selecionado));
  };





  return (
    <div
      className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 bg-gray-50 h-[calc(100vh-56px)] flex flex-col ${open ? "ml-[192px]" : "ml-[56px]"
        }`}
    >
      {/* TÍTULO */}
      <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
        VIAGEM
      </h1>

      {/* ABAS */}
      <div className="flex border-b border-gray-300 bg-white">
        {["viagem", "consulta", "doctos", "despesas", "entregas", "ficha"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1 text-sm font-medium border-t border-x rounded-t-md ${activeTab === tab
              ? "bg-white text-red-700 border-gray-300"
              : "bg-gray-100 text-gray-600 border-transparent"
              } ${tab !== "viagem" ? "ml-1" : ""}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* CONTAINER INTERNO (conteúdo + rodapé) */}
      <div className="flex flex-col flex-1 min-h-0">

        {/* CONTEÚDO COM SCROLL */}
        <div className="flex-1 overflow-y-auto px-2 pb-2">


          {/* ===================== ABA VIAGEM ===================== */}
          {activeTab === "viagem" && (
            <>
              {/* === CARD 1 - Dados da Viagem === */}
              <fieldset className="border border-gray-300 rounded px-3 pt-1 pb-3 bg-white">
                <legend className="px-2 text-red-700 font-semibold text-[13px]">
                  Viagem
                </legend>
                {/* Linha 1 */}
                <div className="grid grid-cols-12 gap-2 items-center">

                  {/* Nº Viagem */}
                  <Label className="col-span-1 flex items-center justify-end">
                    Nº Viagem
                  </Label>

                  {/* BLOCO ÚNICO: Nº Viagem + Seq + Transferência + Botão */}
                  <div className="col-span-3 grid grid-cols-8 gap-1 items-center">

                    {/* Nº Viagem (≈6 caracteres) */}
                    <Txt
                      className="col-span-3 bg-gray-200 text-center"
                      readOnly
                      value={dadosViagem.nrViagem}
                    />

                    {/* Seq (1 caractere) */}
                    <Txt
                      className="col-span-1 bg-gray-200 text-center"
                      readOnly
                      maxLength={1}
                    />

                    {/* Transferência */}
                    <Txt
                      className="col-span-3 bg-gray-200 text-center"
                      defaultValue="Transferência"
                      readOnly
                    />

                    {/* Botão + */}
                    <div className="col-span-1 flex items-center justify-center">
                      <button
                        title="Adicionar"
                        className="border border-gray-300 rounded p-[4px] hover:bg-gray-100 flex items-center justify-center"
                      >
                        <PlusCircle size={16} className="text-green-600" />
                      </button>
                    </div>

                  </div>

                  {/* Manifesto */}
                  <Label className="col-span-1 flex items-center justify-end">
                    Manifesto
                  </Label>
                  <Txt className="col-span-1" value={dadosViagem.manifesto} onChange={handleChange("manifesto")} />

                  {/* Coleta */}
                  <Label className="col-span-1 flex items-center justify-end">
                    Coleta
                  </Label>
                  <Txt className="col-span-1" value={dadosViagem.coleta} onChange={handleChange("coleta")} />

                  {/* Status */}
                  <Label className="col-span-1 flex items-center justify-end">Tipo Carga</Label>
                  <Sel className="col-span-1 w-full" value={dadosViagem.tipoCarga} onChange={handleChange("tipoCarga")}>
                    <option>Fracionada</option>
                    <option>Fechada</option>
                  </Sel>
                  <Txt
                    className="col-span-2 text-center bg-gray-200 font-medium"
                    defaultValue="Em Andamento"
                    readOnly
                  />

                </div>



                {/* Linha 2 */}
                <div className="grid grid-cols-12 gap-2 mt-2 items-center">

                  {/* Empresa */}
                  <Label className="col-span-1 flex items-center justify-end">Empresa</Label>
                  <Sel className="col-span-3 w-full" value={dadosViagem.empresa} onChange={handleChange("empresa")}>
                    <option>001 - MANTRAN TRANSPORTES LTDA</option>
                  </Sel>

                  {/* Filial */}
                  <Label className="col-span-1 flex items-center justify-end">Filial</Label>
                  <Sel className="col-span-3 w-full" value={dadosViagem.filial} onChange={handleChange("filial")}>
                    <option>001 - MANTRAN TRANSPORTES LTDA</option>
                  </Sel>

                  {/* Tipo Carga */}


                  {/* Divisão */}
                  <Label className="col-span-2 flex items-center justify-end">Divisão</Label>
                  <Sel className="col-span-2 w-full" value={dadosViagem.divisao} onChange={handleChange("divisao")}>
                    <option>Logística</option>
                    <option>Administrativo</option>
                  </Sel>
                </div>

                {/* Linha 3 */}
                <div className="grid grid-cols-12 gap-2 mt-2 items-center">

                </div>
              </fieldset>



              {/* === CARD 2 - Origem === */}
              <fieldset className="border border-gray-300 rounded px-3 pt-1 pb-3 bg-white">
                <legend className="px-2 text-red-700 font-semibold text-[13px]">
                  Origem
                </legend>
                {/* Linha 1 */}
                <div className="grid grid-cols-12 gap-2 items-center">

                  {/* Cliente */}
                  <Label className="col-span-1 flex items-center justify-end">
                    Cliente
                  </Label>

                  {/* BLOCO ÚNICO: CNPJ + Razão Social */}
                  <div className="col-span-5 grid grid-cols-7 gap-2 items-center">
                    <InputBuscaCliente
                      className="col-span-2"
                      label={null}
                      value={dadosViagem.clienteCnpj}
                      onChange={handleCodigoChange("cliente")}
                      tabIndex={1}
                      onSelect={(emp) => {
                        setDadosViagem({
                          clienteCnpj: maskCNPJ(emp.cnpj),
                          clienteRazao: emp.razao
                          // Cliente não afeta endereço nesta tela (geralmente só pagador)
                        });
                        focusNextTabIndex(1);
                      }}
                      onKeyDown={handleEnterAsTab}
                    />

                    {/* Razão Social */}
                    <Txt
                      className="col-span-5 bg-gray-200"
                      readOnly
                      placeholder="Razão Social"
                      value={dadosViagem.clienteRazao}
                      tabIndex={-1}
                    />
                  </div>


                  {/* Expedidor */}
                  <Label className="col-span-1 flex items-center justify-end">
                    Expedidor
                  </Label>

                  {/* BLOCO ÚNICO: CNPJ + Razão Social */}
                  <div className="col-span-5 grid grid-cols-7 gap-2 items-center">
                    <InputBuscaCliente
                      className="col-span-2"
                      label={null}
                      value={dadosViagem.expedidorCnpj}
                      onChange={handleCodigoChange("expedidor")}
                      tabIndex={2}
                      onSelect={(emp) => {
                        setDadosViagem({
                          expedidorCnpj: maskCNPJ(emp.cnpj),
                          expedidorRazao: emp.razao,
                          expedidorCidade: emp.cidade,
                          expedidorUf: emp.uf,
                          expedidorCep: emp.cep
                        });
                        focusNextTabIndex(2);
                      }}
                      onKeyDown={handleEnterAsTab}
                    />

                    {/* Razão Social */}
                    <Txt
                      className="col-span-5 bg-gray-200"
                      readOnly
                      placeholder="Razão Social"
                      value={dadosViagem.expedidorRazao}
                      tabIndex={-1}
                    />
                  </div>


                </div>

                {/* Linha 2 */}
                <div className="grid grid-cols-12 gap-2 mt-2 items-center">

                  {/* Remetente */}
                  <Label className="col-span-1 flex items-center justify-end">
                    Remetente
                  </Label>

                  {/* BLOCO ÚNICO: CNPJ + Razão Social */}
                  <div className="col-span-5 grid grid-cols-7 gap-2 items-center">
                    <InputBuscaCliente
                      className="col-span-2"
                      label={null}
                      value={dadosViagem.remetenteCnpj}
                      onChange={handleCodigoChange("remetente")}
                      tabIndex={3}
                      onSelect={(emp) => {
                        setDadosViagem({
                          remetenteCnpj: maskCNPJ(emp.cnpj),
                          remetenteRazao: emp.razao,
                          remetenteCidade: emp.cidade,
                          remetenteUf: emp.uf,
                          remetenteCep: emp.cep
                        });
                        focusNextTabIndex(3);
                      }}
                      onKeyDown={handleEnterAsTab}
                    />

                    {/* Razão Social */}
                    <Txt
                      className="col-span-5 bg-gray-200"
                      readOnly
                      placeholder="Razão Social"
                      value={dadosViagem.remetenteRazao}
                      tabIndex={-1}
                    />
                  </div>


                  {/* Origem */}
                  <Label className="col-span-1 flex items-center justify-end">
                    Origem
                  </Label>

                  <div className="col-span-5 grid grid-cols-6 gap-2 items-center">
                    <InputBuscaCidade
                      className="col-span-2"
                      label={null}
                      placeholder="CEP"
                      value={dadosViagem.origemCep}
                      tabIndex={4}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDadosViagem({
                          origemCep: val,
                          origemCidade: val ? dadosViagem.origemCidade : "",
                          origemUf: val ? dadosViagem.origemUf : ""
                        });
                      }}
                      onSelect={(cid) => {
                        setDadosViagem({
                          origemCidade: cid.nome,
                          origemUf: cid.uf,
                          origemCep: cid.cep
                        });
                        focusNextTabIndex(4);
                      }}
                      onKeyDown={handleEnterAsTab}
                    />
                    <Txt className="col-span-3 bg-gray-200" readOnly placeholder="Cidade" value={dadosViagem.origemCidade} />
                    <Txt className="col-span-1 text-center bg-gray-200" readOnly placeholder="UF" value={dadosViagem.origemUf} />
                  </div>

                </div>


                {/* Linha 3 */}
                <div className="grid grid-cols-12 gap-2 mt-2 items-center">

                  {/* Tabela Frete */}
                  <Label className="col-span-1 flex items-center justify-end">
                    Tab. Frete
                  </Label>

                  {/* BLOCO ÚNICO: Tabela + Tipo + Rateio */}
                  <div className="col-span-4 grid grid-cols-7 gap-2 items-center">

                    {/* Tabela Frete */}
                    <Sel className="col-span-4" tabIndex={5} onKeyDown={handleEnterAsTab}>
                      <option>000083 - TABELA TESTE HNK</option>
                    </Sel>

                    {/* Tipo */}
                    <Sel className="col-span-2" tabIndex={-1}>
                      <option>CEVA</option>
                      <option>GB</option>
                      <option>NF</option>
                    </Sel>

                    {/* Rateio */}
                    <div className="col-span-1 flex items-center">
                      <label className="flex items-center gap-1 text-[12px] whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={dadosViagem.rateioFrete}
                          onChange={(e) => updateDadosViagem("rateioFrete", e.target.checked)}
                          tabIndex={-1}
                        />
                        Rateio Frete(Contrato)
                      </label>
                    </div>

                  </div>

                  {/* Veículo Solicitado */}
                  <Label className="col-span-1 col-start-7 flex items-center justify-end">
                    Veículo
                  </Label>
                  <Sel className="col-span-3" value={dadosViagem.veiculoSolicitado} onChange={handleChange("veiculoSolicitado")} tabIndex={6} onKeyDown={handleEnterAsTab}>
                    <option>01 - UTILITÁRIO</option>
                    <option>02 - VAN</option>
                    <option>03 - 3/4</option>
                    <option>04 - TOCO</option>
                    <option>05 - TRUCK</option>
                    <option>06 - BITRUCK</option>
                    <option>07 - CAVALO MECÂNICO</option>
                    <option>08 - CAVALO TRUCADO</option>
                  </Sel>

                  {/* Botão Custos Adicionais — ALINHADO À DIREITA */}
                  <div className="col-span-2 flex justify-end">
                    <button className="border border-gray-300 text-gray-700 hover:bg-gray-100 rounded px-3 py-[4px] flex items-center gap-1" tabIndex={-1}>
                      <DollarSign size={14} className="text-red-700" />
                      Custos Adicionais
                    </button>
                  </div>

                </div>

              </fieldset>


              {/* === CARD 3 - Destino === */}
              <fieldset className="border border-gray-300 rounded px-3 pt-1 pb-3 bg-white">
                <legend className="px-2 text-red-700 font-semibold text-[13px]">
                  Destino
                </legend>

                {/* Linha 1 */}
                <div className="grid grid-cols-12 gap-2 items-center">

                  {/* Destinatário */}
                  <Label className="col-span-1 flex items-center justify-end">
                    Destinatário
                  </Label>

                  {/* BLOCO Destinatário: CNPJ (14) + Razão Social (RO) + Lápis */}
                  <div className="col-span-5 grid grid-cols-12 gap-2 items-center">
                    <InputBuscaCliente
                      className="col-span-3"
                      label={null}
                      value={dadosViagem.destinatarioCnpj}
                      onChange={handleCodigoChange("destinatario")}
                      tabIndex={7}
                      onSelect={(emp) => {
                        setDadosViagem({
                          destinatarioCnpj: maskCNPJ(emp.cnpj),
                          destinatarioRazao: emp.razao,
                          destinatarioCidade: emp.cidade,
                          destinatarioUf: emp.uf,
                          destinatarioCep: emp.cep
                        });
                        focusNextTabIndex(7);
                      }}
                      onKeyDown={handleEnterAsTab}
                    />

                    {/* Razão Social (não editável) */}
                    <Txt
                      className="col-span-8 bg-gray-200"
                      readOnly
                      placeholder="Razão Social"
                      value={dadosViagem.destinatarioRazao}
                      tabIndex={-1}
                    />

                    {/* Lápis – no final do bloco */}
                    <div className="col-span-1 flex justify-start">
                      <button
                        title="Selecionar Destinatário"
                        className="border border-gray-300 rounded p-[4px] hover:bg-gray-100"
                        tabIndex={-1}
                      >
                        <Pencil size={14} className="text-red-700" />
                      </button>
                    </div>
                  </div>


                  {/* Cidade Destino */}
                  <Label className="col-span-1 flex items-center justify-end">
                    Cidade Dest.
                  </Label>

                  <div className="col-span-5 grid grid-cols-6 gap-2 items-center">
                    <InputBuscaCidade
                      className="col-span-2"
                      label={null}
                      placeholder="CEP"
                      value={dadosViagem.destinoCep}
                      tabIndex={8}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDadosViagem({
                          destinoCep: val,
                          destinoCidade: val ? dadosViagem.destinoCidade : "",
                          destinoUf: val ? dadosViagem.destinoUf : ""
                        });
                      }}
                      onSelect={(cid) => {
                        setDadosViagem({
                          destinoCidade: cid.nome,
                          destinoUf: cid.uf,
                          destinoCep: cid.cep
                        });
                        focusNextTabIndex(8);
                      }}
                      onKeyDown={handleEnterAsTab}
                    />
                    <Txt className="col-span-3 bg-gray-200" readOnly placeholder="Cidade" value={dadosViagem.destinoCidade} />
                    <Txt className="col-span-1 bg-gray-200 text-center" readOnly placeholder="UF" value={dadosViagem.destinoUf} />
                  </div>

                </div>


                {/* ===== Linha 2 - Motorista + Agregado + KM Inicial + Nº Ficha ===== */}
                <div className="grid grid-cols-12 gap-2 mt-2 items-center">

                  {/* Motorista */}
                  <Label className="col-span-1 flex items-center justify-end">
                    Motorista
                  </Label>

                  {/* BLOCO Motorista: CNH (14) + Nome (RO) + Lápis */}
                  <div className="col-span-5 grid grid-cols-12 gap-2 items-center">
                    <InputBuscaMotorista
                      className="col-span-3"
                      label={null}
                      value={dadosViagem.motoristaCnh}
                      onChange={(e) => {
                        // Limpa nome/veiculos se mudar CNH manualmente
                        const val = e.target.value;
                        setDadosViagem({
                          ...dadosViagem,
                          motoristaCnh: val,
                          motoristaNome: "",
                          tracaoCodigo: "", tracaoPlaca: "", tracaoTipo: "",
                          reboqueCodigo: "", reboquePlaca: ""
                        });
                      }}
                      tabIndex={9}
                      onSelect={(mot) => {
                        const updates = {
                          motoristaCnh: mot.cnh,
                          motoristaNome: mot.nome
                        };
                        // Vínculo automático de veículo
                        if (mot.tracaoCodigo) {
                          updates.tracaoCodigo = mot.tracaoCodigo;
                          updates.tracaoPlaca = mot.tracaoDesc || "PLACA-MOCK";
                          updates.tracaoTipo = "Frota";
                        }
                        if (mot.reboqueCodigo) {
                          updates.reboqueCodigo = mot.reboqueCodigo;
                          updates.reboquePlaca = mot.reboqueDesc || "REBOQUE-MOCK";
                        }
                        setDadosViagem(updates);
                        focusNextTabIndex(9);
                      }}
                      onKeyDown={handleEnterAsTab}
                    />

                    {/* Nome do Motorista (não editável) */}
                    <Txt
                      className="col-span-8 bg-gray-200"
                      readOnly
                      placeholder="Nome do Motorista"
                      value={dadosViagem.motoristaNome}
                      tabIndex={-1}
                    />

                    {/* Lápis – agora no FINAL real do bloco */}
                    <div className="col-span-1 flex justify-start">
                      <button
                        title="Selecionar Motorista"
                        className="border border-gray-300 rounded p-[4px] hover:bg-gray-100"
                        tabIndex={-1}
                      >
                        <Pencil size={14} className="text-red-700" />
                      </button>
                    </div>
                  </div>


                  {/* Agregado (SEM LABEL) */}
                  <div className="col-span-3 grid grid-cols-6 gap-1 items-center">

                    {/* Agregado (não editável) */}
                    <Txt
                      className="col-span-5 bg-gray-200"
                      readOnly
                      placeholder="Agregado"
                      tabIndex={-1}
                    />

                    {/* Lápis */}
                    <div className="col-span-1 flex justify-start ">
                      <button
                        title="Selecionar Agregado"
                        className="border border-gray-300 rounded p-[4px] hover:bg-gray-100"
                        tabIndex={-1}
                      >
                        <Pencil size={14} className="text-red-700" />
                      </button>
                    </div>
                  </div>

                  {/* KM Inicial + Trocar Empresa */}
                  <Label className="col-span-1 flex items-center justify-end">
                    KM Inicial
                  </Label>

                  <div className="col-span-2 grid grid-cols-3 gap-1 items-center">

                    {/* KM Inicial */}
                    <Txt
                      className="col-span-2 text-center"
                      placeholder="0"
                      tabIndex={-1}
                    />

                    {/* Trocar Empresa (ícone) */}
                    <div className="col-span-1 flex justify-center">
                      <button
                        title="Trocar Empresa Agregado"
                        className="border border-gray-300 rounded p-[4px] hover:bg-gray-100"
                        tabIndex={-1}
                      >
                        <RefreshCcw size={14} className="text-blue-700" />
                      </button>
                    </div>
                  </div>



                </div>



                {/* ===== Linha 3 - Tração + Reboque ===== */}
                <div className="grid grid-cols-12 gap-2 items-center mt-2">

                  {/* Tração */}
                  <Label className="col-span-1 flex items-center justify-end">
                    Tração
                  </Label>

                  {/* BLOCO Tração: Código + Descrição + Tipo + Lápis */}
                  <div className="col-span-5 grid grid-cols-12  gap-2 items-center">
                    <InputBuscaVeiculo
                      className="col-span-3"
                      label={null}
                      tipoUtilizacao="T"
                      value={dadosViagem.tracaoCodigo}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDadosViagem({ tracaoCodigo: val, tracaoPlaca: "", tracaoTipo: "" });
                      }}
                      tabIndex={10}
                      onSelect={(v) => {
                        const updates = {
                          tracaoCodigo: v.codigo,
                          tracaoPlaca: `${v.placa} - ${v.modelo} - ${v.classe}`,
                          tracaoTipo: "Frota"
                        };
                        setDadosViagem(updates);
                        focusNextTabIndex(10);
                      }}
                      onKeyDown={handleEnterAsTab}
                    />

                    {/* Placa / Descrição (não editável) */}
                    <Txt
                      className="col-span-5 bg-gray-200"
                      readOnly
                      placeholder="Placa / Descrição"
                      value={dadosViagem.tracaoPlaca}
                      tabIndex={-1}
                    />

                    {/* Tipo (não editável) */}
                    <Txt
                      className="col-span-3 bg-gray-200 text-center"
                      readOnly
                      placeholder="Tipo"
                      value={dadosViagem.tracaoTipo}
                      tabIndex={-1}
                    />

                    {/* Lápis */}
                    <div className="col-span-1 flex justify-start">
                      <button
                        title="Selecionar Tração"
                        className="border border-gray-300 rounded p-[4px] hover:bg-gray-100"
                        tabIndex={-1}
                      >
                        <Pencil size={14} className="text-red-700" />
                      </button>
                    </div>
                  </div>

                  {/* Reboque */}
                  <Label className="col-span-1 flex items-center justify-end">
                    Reboque
                  </Label>

                  {/* BLOCO Reboque: Código + Descrição + Lápis */}
                  <div className="col-span-5 grid grid-cols-7 gap-2 items-center">
                    <InputBuscaVeiculo
                      className="col-span-2"
                      label={null}
                      tipoUtilizacao="R"
                      value={dadosViagem.reboqueCodigo}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDadosViagem({ reboqueCodigo: val, reboquePlaca: "" });
                      }}
                      tabIndex={11}
                      onSelect={(v) => {
                        const updates = {
                          reboqueCodigo: v.codigo,
                          reboquePlaca: `${v.placa} - ${v.modelo} - ${v.classe}`
                        };
                        setDadosViagem(updates);
                        focusNextTabIndex(11);
                      }}
                      onKeyDown={handleEnterAsTab}
                    />

                    {/* Placa / Descrição (não editável) */}
                    <Txt
                      className="col-span-4 bg-gray-200"
                      readOnly
                      placeholder="Placa / Descrição"
                      value={dadosViagem.reboquePlaca}
                      tabIndex={-1}
                    />

                    <div className="col-span-1 flex justify-start">
                      <button
                        title="Selecionar Reboque"
                        className="border border-gray-300 rounded p-[4px] hover:bg-gray-100"
                        tabIndex={-1}
                      >
                        <Pencil size={14} className="text-red-700" />
                      </button>
                    </div>
                  </div>

                </div>





                {/* ===== Linha 4 - Recebedor ===== */}
                <div className="grid grid-cols-12 gap-2 items-center mt-2">

                  {/* Recebedor */}
                  <Label className="col-span-1 flex items-center justify-end">
                    Recebedor
                  </Label>

                  {/* BLOCO Recebedor: CNPJ + Razão Social (RO) + Lápis */}
                  <div className="col-span-5 grid grid-cols-12 gap-2 items-center">
                    <InputBuscaCliente
                      className="col-span-3"
                      label={null}
                      value={dadosViagem.recebedorCnpj}
                      onChange={handleCodigoChange("recebedor")}
                      tabIndex={12}
                      onSelect={(emp) => {
                        setDadosViagem({
                          recebedorCnpj: maskCNPJ(emp.cnpj),
                          recebedorRazao: emp.razao,
                          recebedorCidade: emp.cidade,
                          recebedorUf: emp.uf,
                          recebedorCep: emp.cep
                        });
                        focusNextTabIndex(12);
                        // O useEffect cuidará da sync com destinoCidade
                      }}
                    />

                    {/* Razão Social (não editável) */}
                    <Txt
                      className="col-span-8 bg-gray-200"
                      readOnly
                      placeholder="Razão Social"
                      value={dadosViagem.recebedorRazao}
                    />

                    {/* Lápis */}
                    <div className="col-span-1 flex justify-start">
                      <button
                        title="Selecionar Recebedor"
                        className="border border-gray-300 rounded p-[4px] hover:bg-gray-100"
                      >
                        <Pencil size={14} className="text-red-700" />
                      </button>
                    </div>
                  </div>

                  {/* KM Atual */}
                  <Label className="col-span-1 flex items-center justify-end">
                    Km Atual
                  </Label>

                  <Txt
                    className="col-span-1 text-center"
                    value={dadosViagem.kmAtual}
                    onChange={handleChange("kmAtual")}
                  />

                  {/* Classe */}
                  <Label className="col-span-1 flex items-center justify-end">
                    Classe
                  </Label>

                  <Txt
                    className="col-span-1 text-center bg-gray-200"
                    readOnly
                    defaultValue="13"
                  />

                  <Txt
                    className="col-span-2 bg-gray-200"
                    readOnly
                    placeholder="Classe Veículo"
                    defaultValue="CAVALO TRUCADO"
                  />

                </div>


                {/* ===== Linha 5 - Datas / KM Final ===== */}
                <div className="grid grid-cols-12 gap-2 items-center mt-2">

                  {/* BLOCO ESQUERDO: Cadastro + Início Prev. + Hora */}
                  <Label className="col-span-1 flex items-center justify-end">
                    Cadastro
                  </Label>

                  <div className="col-span-5 grid grid-cols-12 gap-2 items-center">

                    {/* Cadastro */}
                    <Txt
                      type="date"
                      className="col-span-4"
                      value={dadosViagem.dataCadastro}
                      onChange={handleChange("dataCadastro")}
                    />

                    {/* Label Início Prev. */}
                    <Label className="col-span-3 flex items-center justify-end">
                      Início Prev.
                    </Label>

                    {/* Data Início */}
                    <Txt
                      type="date"
                      className="col-span-3"
                      value={dadosViagem.dataInicioPrev}
                      onChange={handleChange("dataInicioPrev")}
                      tabIndex={13}
                      onKeyDown={handleEnterAsTab}
                    />

                    {/* Hora */}
                    <Txt
                      type="time"
                      className="col-span-2"
                      value={dadosViagem.horaInicioPrev}
                      onChange={handleChange("horaInicioPrev")}
                      tabIndex={14}
                      onKeyDown={handleEnterAsTab}
                    />

                  </div>


                  {/* Chegada Prev. (Data + Hora) */}
                  <Label className="col-span-1 flex items-center justify-end">
                    Chegada Prev.
                  </Label>
                  <div className="col-span-3 grid grid-cols-4 gap-2 items-center">
                    <Txt type="date" className="col-span-3" value={dadosViagem.dataChegadaPrev} onChange={handleChange("dataChegadaPrev")} tabIndex={15} onKeyDown={handleEnterAsTab} />
                    <Txt type="time" className="col-span-1" value={dadosViagem.horaChegadaPrev} onChange={handleChange("horaChegadaPrev")} tabIndex={16} onKeyDown={handleEnterAsTab} />
                  </div>

                  {/* KM Final */}
                  <Label className="col-span-1 flex items-center justify-end">
                    KM Final
                  </Label>
                  <Txt className="col-span-1 text-center" value={dadosViagem.kmFinal} onChange={handleChange("kmFinal")} />

                </div>


                {/* ===== Linha 6 - Observação + Tab. Agregado ===== */}
                <div className="grid grid-cols-12 gap-2 items-center mt-2">

                  {/* Observação */}
                  <Label className="col-span-1 flex items-center justify-end">
                    Observação
                  </Label>

                  <Txt
                    className="col-span-11"
                    placeholder="Observações gerais da viagem"
                    value={dadosViagem.observacao}
                    onChange={handleChange("observacao")}
                    tabIndex={17}
                    onKeyDown={handleEnterAsTab}
                  />

                  {/* Tabela Agregado */}
                  <Label className="col-span-1 flex items-center justify-end">
                    Tab. Agreg.
                  </Label>

                  {/* BLOCO Tab. Agregado: Combo + Ícone */}
                  <div className="col-span-5 grid grid-cols-12 gap-2 items-center">
                    <Sel className="col-span-11" tabIndex={-1}>
                      <option>000077 - TABELA AGREGADO</option>
                    </Sel>

                    <div className="col-span-1 flex justify-end">
                      <button
                        title="Trocar Tabela Agregado"
                        className="border border-gray-300 rounded p-[4px] hover:bg-gray-100 text-blue-700"
                        tabIndex={-1}
                      >
                        <FileSpreadsheet size={14} />
                      </button>
                    </div>
                  </div>

                </div>






              </fieldset>

              {/* === CARD 4 - Ações === */}
              <fieldset className="border border-gray-300 rounded px-3 pt-1 pb-3 mt-3 bg-white">
                <legend className="px-2 text-red-700 font-semibold text-[13px]">
                  Ações
                </legend>

                <div className="grid grid-cols-12 gap-2 items-center">

                  {/* Lucratividade */}
                  <Label className="col-span-1 flex items-center justify-end">
                    Lucratividade
                  </Label>
                  <Txt
                    className={`col-span-1 text-center font-semibold bg-gray-200 ${lucratividade >= 0
                      ? "text-green-700 border-green-300"
                      : "text-red-700 border-red-300"
                      }`}
                    value={lucratividade ? `${lucratividade}%` : ""}
                    readOnly
                  />

                  {/* Peso Total */}
                  <Label className="col-span-1 flex items-center justify-end">
                    Peso Total
                  </Label>
                  <Txt
                    className="col-span-1 text-right bg-gray-200"
                    defaultValue="0"
                    readOnly
                  />

                  {/* Custo Viagem */}
                  <Label className="col-span-1 flex items-center justify-end">
                    Custo Viagem
                  </Label>
                  <Txt
                    className="col-span-1 text-right bg-gray-200"
                    readOnly
                    value={custoViagem ? custoViagem.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }) : ""}
                  />

                  {/* Valor Frete */}
                  <Label className="col-span-1 flex items-center justify-end">
                    Valor Frete
                  </Label>
                  <Txt
                    className="col-span-1 text-right bg-gray-200"
                    readOnly
                    value={valorFrete ? valorFrete.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }) : ""}
                  />

                  {/* Espaço */}
                  <div className="col-span-1" />

                  {/* Botões */}
                  <div className="col-span-3 flex justify-end gap-2">

                    <button
                      onClick={() => setModalMontarMinutaOpen(true)}
                      className="flex items-center gap-1 border border-gray-300 rounded px-3 py-[5px] text-[12px] hover:bg-gray-100"
                      title="Montar Minuta"
                    >
                      <FileText size={14} />
                      Montar Minuta
                    </button>

                    <button
                      onClick={() => setModalMontarCteOpen(true)}
                      className="flex items-center gap-1 border border-gray-300 rounded px-3 py-[5px] text-[12px] hover:bg-gray-100"
                      title="Montar CTe"
                    >
                      <Truck size={14} className="text-red-700" />
                      Montar CTe
                    </button>


                  </div>

                </div>
              </fieldset>



              {/* === CARD 5 - Notas Fiscais === */}
              <fieldset className="border border-gray-300 rounded px-3 pt-1 pb-3 mt-3 bg-white">

                {/* Legend clicável */}
                <legend
                  className="px-2 text-red-700 font-semibold text-[13px] cursor-pointer select-none flex items-center gap-1"
                  onClick={() => setOpenNotas(!openNotas)}
                >
                  {openNotas ? "▼" : "▶"} Notas Fiscais
                </legend>

                {/* Conteúdo (somente quando aberto) */}
                {openNotas && (
                  <div className="overflow-auto mt-2">

                    <table className="min-w-full border text-[12px]">
                      <thead className="bg-gray-100 text-gray-700">
                        <tr>
                          {[
                            "Filial",
                            "Nº NF",
                            "Série",
                            "Tipo Doc",
                            "Nº Controle",
                            "Nº Impresso",
                            "CNPJ Remetente",
                            "Data Emissão",
                          ].map((h) => (
                            <th key={h} className="border px-2 py-1 text-left">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {notasFiscais.map((nf, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="border px-2 py-1">{nf.filial}</td>
                            <td className="border px-2 py-1">{nf.nf}</td>
                            <td className="border px-2 py-1">{nf.serie}</td>
                            <td className="border px-2 py-1">{nf.tipo}</td>
                            <td className="border px-2 py-1">{nf.controle}</td>
                            <td className="border px-2 py-1">{nf.impresso}</td>
                            <td className="border px-2 py-1">{nf.remetente}</td>
                            <td className="border px-2 py-1">{nf.emissao}</td>
                          </tr>
                        ))}
                        {notasFiscais.length === 0 && (
                          <tr>
                            <td colSpan={8} className="text-center py-2 text-gray-500 italic">
                              Nenhuma nota fiscal vinculada.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                  </div>
                )}

              </fieldset>




            </>
          )}


          {/* ===================== ABA CONSULTA ===================== */}
          {activeTab === "consulta" && (
            <div className="flex flex-row gap-2">
              {/* ====== CARD 1 - FILTROS (PADRÃO GRID 12) ====== */}
              <fieldset className="border border-gray-300 rounded px-3 pt-1 pb-3 bg-white">
                <legend className="text-red-700 font-semibold px-2 text-[13px]">Filtros</legend>

                <div className="space-y-2 text-[12px]">

                  {/* Linha 1 */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 justify-end">Filial Origem</Label>
                    <Sel className="col-span-3 w-full">
                      <option>001 - TESTE MANTRAN</option>
                    </Sel>

                    <Label className="col-span-1 justify-end">Tp. Carga</Label>
                    <Sel className="col-span-2 w-full">
                      <option>TODAS</option>
                      <option>FRACIONADA</option>
                      <option>FECHADA</option>
                    </Sel>

                    <Label className="col-span-1 justify-end">Nº Viagem</Label>
                    <Txt
                      className="col-span-1 text-center"
                      value={filtros.nrViagem}
                      onChange={(e) => updateFiltros("nrViagem", e.target.value)}
                    />
                    <Label className="col-span-1 justify-end">Status</Label>
                    <Sel
                      className="col-span-2 w-full"
                      value={filtros.status}
                      onChange={(e) => updateFiltros("status", e.target.value)}
                    >
                      <option>TODOS</option>
                      <option>NÃO INICIADA</option>
                      <option>EM ANDAMENTO</option>
                      <option>ENCERRADA</option>
                    </Sel>


                  </div>

                  {/* Linha 2 */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 justify-end">Cliente</Label>
                    <InputBuscaCliente
                      className="col-span-2"
                      label={null}
                      value={filtros.clienteCnpj}
                      onChange={(e) => updateFiltros("clienteCnpj", e.target.value)}
                      onSelect={(emp) => setFiltros({
                        clienteCnpj: maskCNPJ(emp.cnpj),
                        clienteRazao: emp.razao
                      })}
                    />
                    <Txt className="col-span-4 bg-gray-200" readOnly placeholder="Razão Social" value={filtros.clienteRazao} />

                    <div className="col-span-2 flex items-center gap-2 justify-end">
                      <label className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={filtros.apenasAgregados}
                          onChange={(e) => updateFiltros("apenasAgregados", e.target.checked)}
                        />
                        Apenas Agregados
                      </label>
                    </div>
                    <Label className="col-span-2 justify-end">Nº Solicitação</Label>
                    <Txt
                      className="col-span-1 text-center"
                      value={filtros.nrSolicitacao}
                      onChange={(e) => updateFiltros("nrSolicitacao", e.target.value)}
                    />
                  </div>

                  {/* Linha 3 */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 justify-end">Remetente</Label>
                    <InputBuscaCliente
                      className="col-span-2"
                      label={null}
                      value={filtros.remetenteCnpj}
                      onChange={(e) => updateFiltros("remetenteCnpj", e.target.value)}
                      onSelect={(emp) => setFiltros({
                        remetenteCnpj: maskCNPJ(emp.cnpj),
                        remetenteRazao: emp.razao
                      })}
                    />
                    <Txt className="col-span-4 bg-gray-200" readOnly placeholder="Razão Social" value={filtros.remetenteRazao} />

                    <Label className="col-span-1 justify-end">Origem</Label>
                    <InputBuscaCidade
                      className="col-span-1"
                      label={null}
                      placeholder="CEP"
                      value={filtros.origemCep}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateFiltros("origemCep", val);
                        if (!val) {
                          setFiltros({ ...filtros, origemCep: "", origemCidade: "", origemUf: "" });
                        }
                      }}
                      onSelect={(cid) => setFiltros({
                        origemCidade: cid.nome,
                        origemUf: cid.uf,
                        origemCep: cid.cep
                      })}
                    />
                    <Txt className="col-span-2 bg-gray-200" readOnly placeholder="Cidade" value={filtros.origemCidade} />
                    <Txt className="col-span-1 text-center bg-gray-200" readOnly placeholder="UF" value={filtros.origemUf} />
                  </div>

                  {/* Linha 4 */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 justify-end">Destinatário</Label>
                    <InputBuscaCliente
                      className="col-span-2"
                      label={null}
                      value={filtros.destinatarioCnpj}
                      onChange={(e) => updateFiltros("destinatarioCnpj", e.target.value)}
                      onSelect={(emp) => setFiltros({
                        destinatarioCnpj: maskCNPJ(emp.cnpj),
                        destinatarioRazao: emp.razao
                      })}
                    />
                    <Txt className="col-span-4 bg-gray-200" readOnly placeholder="Razão Social" value={filtros.destinatarioRazao} />

                    <Label className="col-span-1 justify-end">Destino</Label>
                    <InputBuscaCidade
                      className="col-span-1"
                      label={null}
                      placeholder="CEP"
                      value={filtros.destinoCep}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateFiltros("destinoCep", val);
                        if (!val) {
                          setFiltros({ ...filtros, destinoCep: "", destinoCidade: "", destinoUf: "" });
                        }
                      }}
                      onSelect={(cid) => setFiltros({
                        destinoCidade: cid.nome,
                        destinoUf: cid.uf,
                        destinoCep: cid.cep
                      })}
                    />
                    <Txt className="col-span-2 bg-gray-200" readOnly placeholder="Cidade" value={filtros.destinoCidade} />
                    <Txt className="col-span-1 text-center bg-gray-200" readOnly placeholder="UF" value={filtros.destinoUf} />
                  </div>

                  {/* Linha 5 */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 justify-end">Agregado</Label>
                    <Txt className="col-span-2 text-center" placeholder="CNPJ" />
                    <Txt className="col-span-4 bg-gray-200" readOnly placeholder="Nome do Agregado" />

                    <Label className="col-span-1 justify-end">Divisão</Label>
                    <Sel className="col-span-2 w-full">
                      <option>TODAS</option>
                      <option>LOGÍSTICA</option>
                      <option>ADMINISTRATIVO</option>
                    </Sel>
                    <div className="col-span-2 flex items-center gap-2 justify-end">
                      <label className="flex items-center gap-1">
                        <input type="checkbox" />
                        Viagens s/ Frete
                      </label>
                    </div>
                  </div>

                  {/* Linha 6 */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 justify-end">Motorista</Label>
                    <InputBuscaMotorista
                      className="col-span-2"
                      label={null}
                      value={filtros.motoristaCnh}
                      onChange={(e) => updateFiltros("motoristaCnh", e.target.value)}
                      onSelect={(mot) => setFiltros({
                        motoristaCnh: mot.cnh,
                        motoristaNome: mot.nome
                      })}
                    />
                    <Txt className="col-span-4 bg-gray-200" readOnly placeholder="Nome do Motorista" value={filtros.motoristaNome} />

                    <Label className="col-span-1 justify-end">Veículo</Label>
                    <InputBuscaVeiculo
                      className="col-span-1"
                      label={null}
                      tipoUtilizacao="T"
                      value={filtros.veiculoCodigo}
                      onChange={(e) => updateFiltros("veiculoCodigo", e.target.value)}
                      onSelect={(v) => setFiltros({
                        veiculoCodigo: v.codigo,
                        veiculoPlaca: v.placa
                      })}
                    />
                    <Txt className="col-span-3 bg-gray-200" readOnly value={filtros.veiculoPlaca} />
                  </div>

                  {/* Linha 7 */}
                  <div className="grid grid-cols-12 gap-2 items-center">

                    {/* Label Período */}
                    <Label className="col-span-1 flex items-center justify-end">
                      Período
                    </Label>

                    {/* BLOCO ÚNICO – tudo dentro de 5 colunas */}
                    <div className="col-span-5 grid grid-cols-12 gap-2 items-center">

                      {/* Data inicial */}
                      <Txt
                        type="date"
                        className="col-span-5"
                        value={filtros.periodoDe}
                        onChange={(e) => updateFiltros("periodoDe", e.target.value)}
                      />

                      {/* Data final */}
                      <Txt
                        type="date"
                        className="col-span-5"
                        value={filtros.periodoAte}
                        onChange={(e) => updateFiltros("periodoAte", e.target.value)}
                      />

                      {/* Checkbox */}
                      <label className="col-span-2 flex items-center gap-1 text-[12px] whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={filtros.dtInicioPrev}
                          onChange={(e) => updateFiltros("dtInicioPrev", e.target.checked)}
                        />
                        Dt. Início Prev.
                      </label>

                    </div>




                    <Label className="col-span-2 justify-end">CTRC</Label>
                    <Txt className="col-span-1 text-center" />


                    <Label className="col-span-2 justify-end">Coleta</Label>
                    <Txt className="col-span-1 text-center" />



                    {/* Se quiser manter Nº Solicitação na mesma linha, substitui os 3 campos finais por: 
          Label col-span-2 + Txt col-span-2 (mas estoura 12).
          Recomendo colocar Nº Solicitação numa Linha 8 (fica perfeito). */}
                  </div>

                  {/* Linha 8 (recomendado p/ não estourar colunas) */}
                  <div className="grid grid-cols-12 gap-2 items-center">

                    <div className="col-span-9" />
                  </div>

                </div>
              </fieldset>




              {/* ====== CARD 2 - BOTÕES LATERAIS ====== */}
              <div className="flex flex-col gap-2 w-[140px]">
                <button className="border border-gray-300 bg-white hover:bg-gray-100 rounded py-2 text-[13px] text-gray-700 flex items-center justify-center gap-2">
                  <Search size={16} className="text-red-700" />
                  Pesquisar
                </button>

                <button className="border border-gray-300 bg-white hover:bg-gray-100 rounded py-2 text-[13px] text-gray-700 flex items-center justify-center gap-2">
                  <Eraser size={16} className="text-red-700" />
                  Limpar
                </button>

                <button className="border border-gray-300 bg-white hover:bg-gray-100 rounded py-2 text-[13px] text-gray-700 flex items-center justify-center gap-2">
                  <Truck size={16} className="text-red-700" />
                  Tracking
                </button>
              </div>
            </div>
          )}

          {/* ====== CARD 3 - GRID PRINCIPAL ====== */}
          {activeTab === "consulta" && (
            <div className="mt-2 border border-gray-300 rounded bg-white overflow-auto">
              <table className="min-w-[2200px] text-[12px] border-collapse">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    {[
                      "CK",
                      "Status",
                      "Filial",
                      "Nº Viagem",
                      "SQ",
                      "Tração",
                      "Reboque",
                      "Motorista",
                      "Origem",
                      "Destino",
                      "Início Viagem",
                      "Remetente",
                      "Destinatário",
                      "Pagador Frete",
                      "CNH",
                      "Carga",
                      "Nº Ficha",
                      "Dt. Acerto",
                      "Nº Acerto",
                      "Nº Coleta",
                      "Tp. Mot.",
                      "Vr. Frete",
                      "Frete Agregado",
                    ].map((h) => (
                      <th key={h} className="border px-2 py-1 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {gridConsulta.map((row, i) => {
                    const corStatus =
                      row.status === "NÃO INICIADA"
                        ? "text-red-600"
                        : row.status === "EM ANDAMENTO"
                          ? "text-blue-600"
                          : row.status === "ENCERRADA"
                            ? "text-green-600"
                            : row.status === "CANCELADA"
                              ? "text-black"
                              : "text-gray-700";

                    return (
                      <tr
                        key={row.id}
                        onDoubleClick={() => handleDoubleClickConsulta(row)}
                        className={`cursor-pointer ${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
                      >
                        <td className="border text-center px-2">
                          <input
                            type="checkbox"
                            checked={row.selecionado}
                            onChange={() =>
                              setGridConsulta((prev) =>
                                prev.map((x) =>
                                  x.id === row.id
                                    ? { ...x, selecionado: !x.selecionado }
                                    : x
                                )
                              )
                            }
                          />
                        </td>
                        <td className={`border px-2 font-semibold ${corStatus}`}>
                          {row.status}
                        </td>
                        <td className="border px-2">{row.filial}</td>
                        <td className="border px-2">{row.nrViagem}</td>
                        <td className="border px-2">{row.sq}</td>
                        <td className="border px-2">{row.tracaoPlaca}</td>
                        <td className="border px-2">{row.reboquePlaca}</td>
                        <td className="border px-2">{row.motoristaNome}</td>
                        <td className="border px-2">{row.origemCidade}</td>
                        <td className="border px-2">{row.destinoCidade}</td>
                        <td className="border px-2">{row.dataViagem} {row.horaViagem}</td>
                        <td className="border px-2">{row.remetenteRazao}</td>
                        <td className="border px-2">{row.destinatarioRazao}</td>
                        <td className="border px-2">{row.pagadorFrete}</td>
                        <td className="border px-2">{row.motoristaCnh}</td>
                        <td className="border px-2">{row.tipoCarga}</td>
                        <td className="border px-2">{row.nrFicha}</td>
                        <td className="border px-2">{row.dtAcerto}</td>
                        <td className="border px-2">{row.nrAcerto}</td>
                        <td className="border px-2">{row.nrColeta}</td>
                        <td className="border px-2">{row.tpMot}</td>
                        <td className="border px-2 text-right">{row.vrFrete}</td>
                        <td className="border px-2 text-right">{row.freteAgregado}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ====== CARD 4 - TOTAL / BOTÕES ====== */}
          {activeTab === "consulta" && (
            <div className="flex justify-between items-center mt-2 flex-wrap">
              <div className="text-[13px] text-gray-700">
                Total Selecionados: <b>{totalSelConsulta}</b> de <b>{totalConsulta}</b>
              </div>

              <div className="flex flex-wrap justify-between w-full mt-2">
                {/* === Botões à esquerda === */}
                <div className="flex gap-2">
                  <button
                    onClick={selecionarTodosConsulta}
                    className="border border-gray-300 rounded px-3 py-1 hover:bg-gray-100 text-[13px] flex items-center gap-1"
                  >
                    <CheckCircle size={14} className="text-green-600" />
                    Selecionar Todos
                  </button>
                  <button
                    onClick={limparSelecaoConsulta}
                    className="border border-gray-300 rounded px-3 py-1 hover:bg-gray-100 text-[13px] flex items-center gap-1"
                  >
                    <RotateCcw size={14} className="text-red-600" />
                    Limpar Seleção
                  </button>
                </div>

                {/* === Botões à direita === */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setModalInicioOpen(true)}
                    className="border border-gray-300 rounded px-3 py-1 hover:bg-gray-100 text-[13px] flex items-center gap-1 text-black-600"
                  >
                    <PlayCircle size={14} className="text-red-700" />
                    Iniciar
                  </button>
                  <button
                    onClick={() => setModalEncerrarOpen(true)}
                    className="border border-gray-300 rounded px-3 py-1 hover:bg-gray-100 text-[13px] flex items-center gap-1 text-black-600"
                  >
                    <CheckCircle size={14} className="text-green-600" />
                    Encerrar
                  </button>
                  <button className="border border-gray-300 rounded px-3 py-1 hover:bg-gray-100 text-[13px] flex items-center gap-1 text-black-600">
                    <XCircle size={14} className="text-red-700" />
                    Cancelar
                  </button>
                  <button className="border border-gray-300 rounded px-3 py-1 hover:bg-gray-100 text-[13px] flex items-center gap-1 text-black-600">
                    <RotateCcw size={14} className="text-red-700" />
                    Estornar
                  </button>
                  <button className="border border-gray-300 rounded px-3 py-1 hover:bg-gray-100 text-[13px] flex items-center gap-1 text-black-600">
                    <Trash2 size={14} className="text-red-700" />
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          )}



          {/* ===================== ABA DOCTOS ===================== */}


          {activeTab === "doctos" && (
            <div className="flex flex-col gap-2 p-2 min-w-0">
              {/* <div className="flex flex-row gap-2"> */}
              {/* === CARD 1 - Documentos da Viagem === */}
              <fieldset className="border border-gray-300 rounded px-3 pt-1 pb-3 w-full min-w-0">
                <legend className="text-red-700 font-semibold px-2">
                  Documentos da Viagem
                </legend>

                {/* ===== GRID COM ROLAGEM ===== */}
                <div className="block border border-gray-300 rounded bg-white mt-2 max-h-[300px] overflow-x-auto overflow-y-auto">
                  <table className="min-w-[2400px] text-[12px] border-collapse">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        {[
                          "OK",
                          "St.",
                          "Emp.",
                          "Filial Doc.",
                          "Razão Social Destinatário",
                          "Nº Controle",
                          "Nº Impresso",
                          "Dt. Emissão",
                          "Vols",
                          "Peso Real",
                          "Valor Frete",
                          "Tp Cif/Fob",
                          "Vr. Mercadoria",
                          "Data Entrega",
                          "Série CT",
                          "Manifesto",
                          "VR ICMS",
                          "Status",
                          "Doc",
                          "Chave CTe",
                          "Filial Viagem",
                          "Substituído",
                        ].map((h) => (
                          <th key={h} className="border px-2 py-1 whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {docsViagem.map((doc) => (
                        <tr
                          key={doc.id}
                          className={`${doc.selecionado ? "bg-green-50" : "bg-white"
                            } hover:bg-gray-100 transition`}
                        >
                          <td className="border text-center">
                            <input
                              type="checkbox"
                              checked={doc.selecionado}
                              onChange={() =>
                                setDocsViagem((prev) =>
                                  prev.map((d) =>
                                    d.id === doc.id
                                      ? { ...d, selecionado: !d.selecionado }
                                      : d
                                  )
                                )
                              }
                            />
                          </td>
                          <td className="border text-center">I</td>
                          <td className="border text-center">{doc.empresa}</td>
                          <td className="border text-center">{doc.filial}</td>
                          <td className="border px-2">{doc.razao}</td>
                          <td className="border text-center">{doc.controle}</td>
                          <td className="border text-center">{doc.impresso}</td>
                          <td className="border text-center">{doc.emissao}</td>
                          <td className="border text-right">1,000</td>
                          <td className="border text-right">1,000</td>
                          <td className="border text-right">125,00</td>
                          <td className="border text-center">CIF</td>
                          <td className="border text-right">1,00</td>
                          <td className="border text-center">--</td>
                          <td className="border text-center">001</td>
                          <td className="border text-center">--</td>
                          <td className="border text-right">8,75</td>
                          <td className="border text-center">I</td>
                          <td className="border text-center">CT</td>
                          <td className="border text-center font-mono">--</td>
                          <td className="border text-center">001</td>
                          <td className="border text-center"></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* === LEGENDA DE STATUS + BOTÕES === */}
                <div className="flex items-center gap-3 mt-2 text-[12px] flex-wrap">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-300 border"></div>
                    <span>Não Iniciada</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-400 border"></div>
                    <span>Entregues</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-400 border"></div>
                    <span>Circs c/ IDR</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-400 border"></div>
                    <span>Não Entregues</span>
                  </div>

                  <div className="flex items-center gap-2 ml-auto flex-wrap">
                    {/* Selecionar/Limpar Todos */}
                    <button
                      onClick={handleToggleSelecionarTodos}
                      className="border border-gray-300 rounded px-3 py-1 hover:bg-gray-100 text-[13px] flex items-center gap-1"
                    >
                      {todosSelecionados ? (
                        <>
                          <RotateCcw size={14} className="text-red-600" />
                          Limpar Seleção
                        </>
                      ) : (
                        <>
                          <CheckCircle size={14} className="text-green-600" />
                          Selecionar Todos
                        </>
                      )}
                    </button>

                    {/* Outros botões */}
                    <button className="border border-gray-300 rounded px-3 py-1 hover:bg-gray-100 text-[13px]">
                      Minuta
                    </button>
                    <button className="border border-gray-300 rounded px-3 py-1 hover:bg-gray-100 text-[13px]">
                      Baixar
                    </button>
                    <button className="border border-gray-300 rounded px-3 py-1 hover:bg-gray-100 text-[13px]">
                      Manifestar
                    </button>
                    <button className="border border-gray-300 rounded px-3 py-1 hover:bg-gray-100 text-[13px]">
                      Imprimir
                    </button>
                    <button className="border border-gray-300 rounded px-3 py-1 hover:bg-gray-100 text-[13px]">
                      SEFAZ
                    </button>

                    {/* Remover */}
                    <button
                      onClick={handleRemover}
                      className="border border-gray-300 rounded px-3 py-1 hover:bg-red-50 text-[13px] text-red-600 flex items-center gap-1"
                    >
                      <Trash2 size={14} />
                      Remover
                    </button>
                  </div>
                </div>

                {/* === TOTAIS === */}
                <div className="grid grid-cols-12 gap-2 items-center mt-3 text-[12px]">

                  {/* QT Docs */}
                  <Label className="col-span-1 justify-end">QT Docs</Label>
                  <Txt
                    className="col-span-1 text-center bg-gray-200"
                    value={qtDocs}
                    readOnly
                  />

                  {/* Vr. Mercadoria */}
                  <Label className="col-span-1 justify-end">Vr. Mercadoria</Label>
                  <Txt
                    className="col-span-1 text-right bg-gray-200"
                    value={totalVrMercadoria.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                    readOnly
                  />

                  {/* Frete */}
                  <Label className="col-span-1 justify-end">Frete</Label>
                  <Txt
                    className="col-span-1 text-right bg-gray-200"
                    value={totalFrete.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                    readOnly
                  />

                  {/* Cubagem */}
                  <Label className="col-span-1 justify-end">Cubagem</Label>
                  <Txt
                    className="col-span-1 text-right bg-gray-200"
                    value="0"
                    readOnly
                  />

                  {/* Frete Peso */}
                  <Label className="col-span-1 justify-end">Frete Peso</Label>
                  <Txt
                    className="col-span-1 text-right bg-gray-200"
                    value="125,00"
                    readOnly
                  />

                  {/* Frete Líquido */}
                  <Label className="col-span-1 justify-end">Frete Líquido</Label>
                  <Txt
                    className="col-span-1 text-right bg-gray-200"
                    value="116,25"
                    readOnly
                  />

                </div>



              </fieldset>



              {/* === CARD 2 - Adicionar CTRC's === */}
              <fieldset className="border border-gray-300 rounded px-3 pt-1 pb-3 w-full min-w-0">
                <legend className="text-red-700 font-semibold px-2">
                  Adicionar CTRC's na Viagem
                </legend>

                <div className="flex flex-col gap-2 mb-2">

                  {/* ===== LINHA 1 ===== */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 justify-end">Cliente</Label>
                    <InputBuscaCliente
                      className="col-span-2"
                      label={null}
                      value={filtros.docClienteCnpj}
                      onChange={(e) => updateFiltros("docClienteCnpj", e.target.value)}
                      onSelect={(emp) => setFiltros({
                        docClienteCnpj: maskCNPJ(emp.cnpj),
                        docClienteRazao: emp.razao
                      })}
                    />
                    <Txt className="col-span-4 bg-gray-200" placeholder="Razão Social" readOnly value={filtros.docClienteRazao} />

                    <Label className="col-span-1 justify-end">Período</Label>
                    <Txt
                      type="date"
                      className="col-span-2"
                      value={filtros.docPeriodoDe}
                      onChange={(e) => updateFiltros("docPeriodoDe", e.target.value)}
                    />
                    <Txt
                      type="date"
                      className="col-span-2"
                      value={filtros.docPeriodoAte}
                      onChange={(e) => updateFiltros("docPeriodoAte", e.target.value)}
                    />
                  </div>

                  {/* ===== LINHA 2 ===== */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 justify-end">Remetente</Label>
                    <InputBuscaCliente
                      className="col-span-2"
                      label={null}
                      value={filtros.docRemetenteCnpj}
                      onChange={(e) => updateFiltros("docRemetenteCnpj", e.target.value)}
                      onSelect={(emp) => setFiltros({
                        docRemetenteCnpj: maskCNPJ(emp.cnpj),
                        docRemetenteRazao: emp.razao
                      })}
                    />
                    <Txt className="col-span-4 bg-gray-200" placeholder="Razão Social" readOnly value={filtros.docRemetenteRazao} />

                    <div className="col-span-2 col-start-9 flex items-center gap-2">
                      <label className="flex items-center gap-1 text-[12px]">
                        <input
                          type="checkbox"
                          checked={filtros.docNaoEncerrados}
                          onChange={(e) => updateFiltros("docNaoEncerrados", e.target.checked)}
                        />
                        Doctos não encerrados
                      </label>
                    </div>

                    <div className="col-span-2 flex items-center gap-2">
                      <label className="flex items-center gap-1 text-[12px]">
                        <input
                          type="checkbox"
                          checked={filtros.docIncluirCancelados}
                          onChange={(e) => updateFiltros("docIncluirCancelados", e.target.checked)}
                        />
                        Incluir Cancelados
                      </label>
                    </div>
                  </div>

                  {/* ===== LINHA 3 ===== */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 justify-end">Filial</Label>
                    <Sel className="col-span-3 w-full">
                      <option>TODAS</option>
                    </Sel>

                    <Label className="col-span-1 justify-end">Tipo Docs</Label>
                    <Sel className="col-span-2 w-full">
                      <option>Coleta</option>
                      <option>CTe - Impresso</option>
                      <option>CTe - Controle</option>
                      <option>Minuta</option>
                      <option>Doc Ant</option>
                    </Sel>
                    <Label className="col-span-1 justify-end">Nº Doc.</Label>
                    <Txt
                      className="col-span-1"
                      value={filtros.docNrDoc}
                      onChange={(e) => updateFiltros("docNrDoc", e.target.value)}
                    />
                    <Label className="col-span-1 justify-end">Viagem</Label>
                    <Txt
                      className="col-span-1"
                      value={filtros.docViagem}
                      onChange={(e) => updateFiltros("docViagem", e.target.value)}
                    />


                  </div>

                  {/* ===== LINHA 4 - BOTÕES ===== */}
                  <div className="grid grid-cols-12 gap-2 items-center mt-1">
                    <div className="col-span-12 flex justify-end gap-2">
                      <button className="border border-gray-300 bg-white hover:bg-gray-100 rounded px-4 py-[4px] text-[13px] text-gray-700">
                        Protocolos
                      </button>

                      <button className="border border-gray-300 bg-white hover:bg-gray-100 rounded px-4 py-[4px] text-[13px] text-gray-700">
                        Pesquisar
                      </button>
                    </div>
                  </div>

                </div>



                {/* ===== GRID DE ADIÇÃO ===== */}
                <div className="block w-full min-w-0 border border-gray-300 rounded bg-white mt-2 max-h-[300px] overflow-auto">
                  <table className="min-w-[2400px] text-[12px] border-collapse">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        {[
                          "Empresa",
                          "Filial",
                          "Razão Social",
                          "Nº Controle",
                          "Nº Impresso",
                          "Data Emissão",
                          "Volume",
                          "Peso",
                          "VR Frete",
                          "Tipo Cif/Fob",
                          "VR Mercadoria",
                          "Data Entrega",
                          "Data Baixa",
                          "Nº Viagem",
                          "Situação",
                          "Tipo Docto",
                          "Nº Coleta",
                          "Cód. Ocorrência",
                          "Desc. Ocorrência",
                        ].map((h) => (
                          <th key={h} className="border px-2 py-1 whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {docsAdicao.map((doc, i) => (
                        <tr
                          key={doc.id}
                          className={`${i % 2 === 0 ? "bg-orange-50" : "bg-white"} hover:bg-gray-100`}
                        >
                          <td className="border text-center">
                            <input
                              type="checkbox"
                              checked={doc.selecionado}
                              onChange={() => {
                                setDocsAdicao((prev) =>
                                  prev.map((d) =>
                                    d.id === doc.id ? { ...d, selecionado: !d.selecionado } : d
                                  )
                                );
                              }}
                            />
                          </td>
                          <td className="border text-center">{doc.empresa}</td>
                          <td className="border text-center">{doc.filial}</td>
                          <td className="border px-2">{doc.razao}</td>
                          <td className="border text-center">{doc.controle}</td>
                          <td className="border text-center">{doc.impresso}</td>
                          <td className="border text-center">{doc.emissao}</td>
                          <td className="border text-right">{(i + 1) * 3}</td>
                          <td className="border text-right">{(i + 1) * 3},000</td>
                          <td className="border text-right">100,00</td>
                          <td className="border text-center">C</td>
                          <td className="border text-right">3,00</td>
                          <td className="border text-center">--</td>
                          <td className="border text-center">--</td>
                          <td className="border text-center">Impresso</td>
                          <td className="border text-center">CT</td>
                          <td className="border text-center">18570{i}</td>
                          <td className="border text-center">--</td>
                          <td className="border text-center">--</td>
                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>
              </fieldset>

              {/* === CARD FINAL - Botões Rodapé === */}
              <fieldset className="border border-gray-300 rounded px-3 pt-1 pb-3 w-full mt-2 bg-white">
                <div className="flex justify-between items-center">
                  {/* Lado esquerdo */}
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setDocsAdicao((prev) => prev.map((d) => ({ ...d, selecionado: true })))
                      }
                      className="border border-gray-300 rounded px-3 py-1 hover:bg-gray-100 flex items-center gap-1 text-[13px]"
                    >
                      Selecionar Todos
                    </button>

                    <button
                      onClick={() =>
                        setDocsAdicao((prev) => prev.map((d) => ({ ...d, selecionado: false })))
                      }
                      className="border border-gray-300 rounded px-3 py-1 hover:bg-gray-100 flex items-center gap-1 text-[13px]"
                    >
                      Limpar Seleção
                    </button>
                  </div>

                  {/* Lado direito */}
                  <div>
                    <button
                      onClick={() => {
                        const selecionados = docsAdicao.filter((d) => d.selecionado);
                        setDocsViagem((prev) => [...prev, ...selecionados]);
                        setDocsAdicao((prev) =>
                          prev.map((d) => ({ ...d, selecionado: false }))
                        );
                      }}
                      className="border border-gray-300 rounded px-3 py-1 hover:bg-gray-100 flex items-center gap-1 text-[13px] text-green-700 font-medium"
                    >
                      <PlusCircle size={14} className="text-green-700" />
                      Adicionar
                    </button>
                  </div>
                </div>
              </fieldset>

            </div>
          )}

          {/* ===================== ABA DESPESAS ===================== */}
          {activeTab === "despesas" && (
            <div className="flex flex-col gap-3 p-2 min-w-0">

              {/* === CARD 1 - Valores de Frete de Terceiros === */}
              <fieldset className="border border-gray-300 rounded px-3 pt-1 pb-3 bg-white">
                <legend className="text-red-700 font-semibold px-2">
                  Valores de Frete de Terceiros
                </legend>

                <div className="space-y-2">

                  {/* ===== LINHA 1 ===== */}
                  <div className="grid grid-cols-12 gap-2 items-center">

                    {/* CIOT – ocupa 3 colunas no total */}
                    <Label className="col-span-1 justify-end">CIOT</Label>

                    <div className="col-span-2 flex items-center gap-1">
                      <Txt className="flex-1" />
                      <button
                        type="button"
                        title="CIOT"
                        className="border border-gray-300 rounded px-2 py-[4px] hover:bg-gray-100"
                      >
                        <DollarSign size={14} className="text-green-600" />
                      </button>
                    </div>


                    {/* === BLOCO TRIBUTOS + TOTAL (limite 9 colunas) === */}
                    <div className="col-span-9 grid grid-cols-10 gap-2 items-center">

                      {/* Sest/Senat */}
                      <Label className="col-span-1 justify-end">Sest/Senat</Label>
                      <Txt className="col-span-1 text-right" defaultValue="0" />

                      {/* INSS */}
                      <Label className="col-span-1 justify-end">INSS</Label>
                      <Txt className="col-span-1 text-right" defaultValue="0" />

                      {/* IRRF */}
                      <Label className="col-span-1 justify-end">IRRF</Label>
                      <Txt className="col-span-1 text-right" defaultValue="0" />

                      {/* Descarga */}
                      <Label className="col-span-1 justify-end">Descarga</Label>
                      <Txt className="col-span-1 text-right" defaultValue="0,00" />

                      {/* Valor Total (destaque) */}
                      <Label className="col-span-1 justify-end font-semibold">
                        Valor Total
                      </Label>
                      <Txt
                        className="col-span-1 text-right bg-gray-200 font-semibold"
                        defaultValue="1.450,00"
                        readOnly
                      />
                    </div>

                  </div>

                  {/* ===== LINHA 2 ===== */}
                  <div className="grid grid-cols-12 gap-2 items-center">

                    <Label className="col-span-1 justify-end">Frete Tabela</Label>
                    <Txt className="col-span-2 text-right" defaultValue="1.450,00" />

                    {/* === BLOCO (9 COLUNAS) === */}
                    <div className="col-span-9 grid grid-cols-10 gap-2 items-center">
                      {/* Cooperativa */}
                      <Label className="col-span-1 justify-end">Cooperativa</Label>
                      <Txt className="col-span-1 text-right" defaultValue="0" />



                      {/* Adiantamento */}
                      <Label className="col-span-1 justify-end">Adiantamento</Label>
                      <Txt className="col-span-1 text-right" defaultValue="0" />

                      {/* Adicional */}
                      <Label className="col-span-1 justify-end">Adicional</Label>
                      <Txt className="col-span-1 text-right" defaultValue="0,00" />

                      {/* Pacotes */}
                      <Label className="col-span-3 justify-end">Pacotes</Label>
                      <div className="col-span-1 flex gap-1">
                        <Txt className="w-1/2 text-right" defaultValue="0" />
                        <Txt className="w-1/2 text-right" defaultValue="0" />
                      </div>

                    </div>

                  </div>

                  {/* ===== LINHA 3 ===== */}
                  <div className="grid grid-cols-12 gap-2 items-center">

                    <Label className="col-span-1 justify-end">Nº CTRB</Label>
                    <Txt className="col-span-1 text-center" defaultValue="079032" />
                    <Txt className="col-span-1 text-center" defaultValue="1" />
                    <div className="col-span-9 grid grid-cols-10 gap-2 items-center">


                      <Label className="col-span-1 justify-end">Pedágio</Label>
                      <Txt className="col-span-1" />

                      <Txt className="col-span-3 bg-gray-200" readOnly placeholder="Descrição do pedágio..." />

                      <Label className="col-span-1 justify-end">Nº Comp.</Label>
                      <Txt className="col-span-2" />

                      <Label className="col-span-1 justify-end">Vr. Pedágio</Label>
                      <Txt className="col-span-1 text-right" defaultValue="0,00" />
                    </div>

                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button
                      type="button"
                      title="Alterar"
                      className="border border-gray-300 rounded px-3 py-[4px] text-[12px] hover:bg-gray-100 flex items-center gap-1 text-red-700"
                    >
                      <Edit size={14} />
                      Alterar
                    </button>
                  </div>
                </div>
              </fieldset>



              {/* === CARD 2 - Despesas Diversas === */}
              <fieldset className="border border-gray-300 rounded px-3 pt-1 pb-3 bg-white">
                <legend className="text-red-700 font-semibold px-2">
                  Despesas Diversas
                </legend>

                <div className="space-y-2 text-[12px]">

                  {/* ===== LINHA 1 ===== */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 justify-end">Dt. Acerto Conta</Label>
                    <Txt type="date" className="col-span-2" />

                    <Label className="col-span-1 col-start-10 justify-end">Saldo Ficha</Label>
                    <Txt
                      className="col-span-2 text-right bg-gray-200"
                      value={(Array.isArray(despesas) ? despesas.reduce((acc, d) => acc + (d && d.valor ? Number(d.valor) : 0), 0) : 0).toFixed(2)}
                      readOnly
                    />
                  </div>

                  {/* ===== LINHA 2 ===== */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 justify-end">Cidade Origem</Label>
                    <Txt className="col-span-4 bg-gray-200" readOnly />
                    <Txt className="col-span-1 text-center bg-gray-200" readOnly />

                    <Label className="col-span-1 col-start-7 justify-end">Cidade Destino</Label>
                    <Txt className="col-span-4 bg-gray-200" readOnly />
                    <Txt className="col-span-1 text-center bg-gray-200" readOnly />
                  </div>

                  {/* ===== LINHA 3 ===== */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    {/* Label Data (1 coluna) */}
                    <Label className="col-span-1 flex items-center justify-end">
                      Data
                    </Label>

                    {/* BLOCO: Data + Hora + Botão (5 colunas) */}
                    <div className="col-span-5 grid grid-cols-5 gap-2 items-center">

                      {/* Data */}
                      <Txt
                        type="date"
                        className="col-span-2"
                      />

                      {/* Hora */}
                      <Txt
                        type="time"
                        className="col-span-1"
                      />

                      {/* Botão Abastecimento (ícone) */}
                      <button
                        title="Abastecimento"
                        className="col-span-2 border border-gray-300 rounded py-[4px] hover:bg-gray-100 flex items-center justify-center"
                      >
                        <Fuel size={16} className="text-red-700" />
                      </button>

                    </div>


                    <Label className="col-span-1 justify-end">Filial</Label>
                    <Txt className="col-span-1 bg-gray-200" readOnly />
                    <Label className="col-span-1  col-start-10 justify-end">Nº Frota</Label>
                    <Txt className="col-span-2 bg-gray-200" readOnly />
                  </div>

                  {/* ===== LINHA 4 ===== */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 justify-end">Evento</Label>
                    <Txt className="col-span-1 text-center " />
                    <Txt className="col-span-3 bg-gray-200" defaultValue="" readOnly />
                    <Txt className="col-span-1 text-center bg-gray-200" defaultValue="" readOnly />

                    <Label className="col-span-1 justify-end">Complemento</Label>
                    <Txt className="col-span-5 " />
                  </div>

                  {/* ===== LINHA 5 ===== */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 justify-end">Categoria</Label>
                    <Txt className="col-span-1 text-center " />
                    <Txt className="col-span-4 bg-gray-200" />

                    <Label className="col-span-1 justify-end">Sub Categoria</Label>
                    <Txt className="col-span-1 text-center " />
                    <Txt className="col-span-4 bg-gray-200" />
                  </div>

                  {/* ===== LINHA 6 ===== */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 justify-end">Tipo Pagto</Label>
                    <Txt className="col-span-1 text-center" />
                    <Txt className="col-span-4 bg-gray-200" defaultValue="" readOnly />

                    <Label className="col-span-1 justify-end">Status Viagem</Label>
                    <Txt className="col-span-5 bg-gray-200" defaultValue="" readOnly />
                  </div>

                  {/* ===== LINHA 7 ===== */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 justify-end">Valor</Label>
                    <Txt className="col-span-2 text-right" />

                    <Label className="col-span-1 col-start-7 justify-end">Conta Corrente</Label>
                    <Txt className="col-span-2 text-center bg-gray-200" defaultValue="000000" readOnly />
                    <Txt className="col-span-1 text-center bg-gray-200" defaultValue="999" readOnly />
                    <Txt className="col-span-2 text-center bg-gray-200" defaultValue="0000-0" readOnly />
                  </div>

                  {/* ===== LINHA 8 - BOTÕES ===== */}
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setModalDespesaOpen(true)}
                      className="border border-gray-300 rounded px-3 py-[4px] text-[12px] flex items-center gap-1 text-green-700"
                    >
                      <DollarSign size={14} />
                      Pagamento
                    </button>

                    <button className="border border-gray-300 rounded px-3 py-[4px] text-[12px] flex items-center gap-1 text-red-600 hover:bg-gray-100">
                      <RotateCcw size={14} />
                      Estornar
                    </button>
                  </div>

                </div>
              </fieldset>

              {/* === CARD 3 - GRID DE DESPESAS === */}
              <fieldset className="border border-gray-300 rounded px-3 pt-1 pb-3 bg-white w-full min-w-0">
                <legend className="text-red-700 font-semibold px-2">Lista de Despesas</legend>

                <div className="block border border-gray-300 rounded bg-white mt-2 max-h-[300px] overflow-x-auto overflow-y-auto">

                  <table className="min-w-[2200px] text-[12px] border-collapse">
                    <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
                      <tr>
                        {[
                          "✓", // checkbox
                          "Nº Título",
                          "Data Lancto",
                          "Hora Lancto",
                          "Data Venc.",
                          "Data Pagto",
                          "Cód. Evento",
                          "Descrição do Evento",
                          "D_C",
                          "Complemento",
                          "Cód. Pagto",
                          "Descrição Pagto",
                          "Valor Lancto",
                          "Observação",
                          "Cidade Origem",
                          "UF",
                          "Cidade Entrega",
                          "UF",
                          "Nº Viagem",
                          "Cód. CNH",
                          "Placa Veículo",
                          "Cat.",
                          "Sub.",
                          "SQ",
                        ].map((h) => (
                          <th
                            key={h}
                            className="border px-2 py-1 text-center whitespace-nowrap bg-gray-100"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {Array.isArray(despesas) && despesas.map((d, i) => {
                        if (!d) return null;
                        return (
                          <tr
                            key={d.id || i}
                            className={`${i % 2 === 0 ? "bg-orange-50" : "bg-white"
                              } hover:bg-gray-100`}
                          >
                            <td className="border text-center">
                              <input
                                type="checkbox"
                                checked={!!d.selecionado}
                                onChange={() =>
                                  setDespesas((prev) =>
                                    prev.map((x) =>
                                      x.id === d.id
                                        ? { ...x, selecionado: !x.selecionado }
                                        : x
                                    )
                                  )
                                }
                              />
                            </td>
                            <td className="border text-center">0001</td>
                            <td className="border text-center">{d.data || "--"}</td>
                            <td className="border text-center">12:23:50</td>
                            <td className="border text-center">--</td>
                            <td className="border text-center">--</td>
                            <td className="border text-center">001</td>
                            <td className="border px-2">{d.tipo || ""}</td>
                            <td className="border text-center">D</td>
                            <td className="border px-2">{d.descricao || ""}</td>
                            <td className="border text-center">2</td>
                            <td className="border text-center">DÉBITO</td>
                            <td className="border text-right">
                              {Number(d.valor || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </td>
                            <td className="border text-left">TESTE</td>
                            <td className="border text-left">CAMPINAS</td>
                            <td className="border text-center">SP</td>
                            <td className="border text-left">JUNDIAÍ</td>
                            <td className="border text-center">SP</td>
                            <td className="border text-center">079032</td>
                            <td className="border text-center">01628446760</td>
                            <td className="border text-center">RXW4I56</td>
                            <td className="border text-center">100</td>
                            <td className="border text-center">2</td>
                            <td className="border text-center">{i + 1}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </fieldset>


              {/* === CARD 4 - BOTÕES === */}
              <fieldset className="border border-gray-300 rounded px-3 pt-1 pb-3 bg-white mt-3">
                <div className="flex justify-between items-center flex-wrap gap-2">

                  {/* === BOTÕES À ESQUERDA === */}
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setModalCustosOpen(true)}
                      className="border border-gray-300 rounded px-3 py-1 hover:bg-gray-100 text-[13px] flex items-center gap-1"
                    >
                      <DollarSign size={14} className="text-yellow-600" />
                      Custos Operacionais
                    </button>
                    <button className="border border-gray-300 rounded px-3 py-1 hover:bg-gray-100 text-[13px] flex items-center gap-1">
                      <FileText size={14} className="text-gray-700" />
                      Observação
                    </button>
                    <button
                      onClick={() => navigate("/relatorios/operacao/viagem-ctrb")}
                      className="border border-gray-300 rounded px-3 py-1 hover:bg-gray-100 text-[13px] flex items-center gap-1"
                    >
                      <Printer size={14} className="text-blue-600" />
                      Imprimir
                    </button>
                  </div>

                  {/* === BOTÕES À DIREITA === */}
                  <div className="flex gap-2 flex-wrap ml-auto">
                    <button className="border border-gray-300 rounded px-3 py-1 hover:bg-gray-100 text-[13px] text-green-700 flex items-center gap-1">
                      <CheckCircle size={14} />
                      Encerrar
                    </button>
                    <button className="border border-gray-300 rounded px-3 py-1 hover:bg-gray-100 text-[13px] text-yellow-600 flex items-center gap-1">
                      <RotateCcw size={14} />
                      Reabrir
                    </button>
                    <button
                      onClick={handleAdicionarDespesa}
                      className="border border-gray-300 rounded px-3 py-1 hover:bg-gray-100 text-[13px] text-green-700 flex items-center gap-1"
                    >
                      <PlusCircle size={14} />
                      Adicionar
                    </button>

                    <button
                      onClick={handleRemoverDespesa}
                      className="border border-gray-300 rounded px-3 py-1 hover:bg-gray-100 text-[13px] text-red-600 flex items-center gap-1"
                    >
                      <Trash2 size={14} />
                      Remover
                    </button>

                    <button className="border border-gray-300 rounded px-3 py-1 hover:bg-gray-100 text-[13px] text-gray-700 flex items-center gap-1">
                      <RotateCcw size={14} />
                      Limpar
                    </button>
                  </div>
                </div>
              </fieldset>
            </div>
          )}

          {/* ===================== ABA ENTREGAS ===================== */}
          {activeTab === "entregas" && (
            <>
              {/* === CARD 1 E CARD 2 - FILTROS === */}
              <div className="flex gap-3">
                {/* === CARD 1 - FILTROS === */}
                <fieldset className="border border-gray-300 rounded px-3 pt-1 pb-3 bg-white flex-1">
                  <legend className="text-red-700 font-semibold px-2">Filtros</legend>

                  <div className="flex flex-col gap-2 text-[13px]">

                    {/* === Linha 1 - Filial / Ocorrência === */}
                    <div className="grid grid-cols-12 gap-2 items-center">

                      {/* Filial */}
                      <Label className="col-span-1 flex items-center justify-end">
                        Filial
                      </Label>
                      <Sel
                        className="col-span-5 w-full"
                        value={filtros.entregasFilial}
                        onChange={(e) => updateFiltros("entregasFilial", e.target.value)}
                      >
                        <option>001 - ENTREGATEX LOGISTICA E TECNOLO</option>
                      </Sel>

                      {/* Ocorrência */}
                      <Label className="col-span-1 flex items-center justify-end">
                        Ocorrência
                      </Label>
                      <Txt
                        className="col-span-2 text-center bg-gray-200" readOnly
                        value={filtros.entregasOcorrencia}
                      />
                    </div>

                    {/* === Linha 2 - Veículo / Motorista === */}
                    <div className="grid grid-cols-12 gap-2 items-center">

                      {/* Veículo */}
                      <Label className="col-span-1 flex items-center justify-end">
                        Veículo
                      </Label>

                      <div className="col-span-5 grid grid-cols-5 gap-2 items-center">
                        <InputBuscaVeiculo
                          className="col-span-1"
                          label={null}
                          tipoUtilizacao="T"
                          value={filtros.entregasVeiculoCodigo}
                          onChange={(e) => updateFiltros("entregasVeiculoCodigo", e.target.value)}
                          onSelect={(v) => setFiltros({
                            entregasVeiculoCodigo: v.codigo,
                            entregasVeiculoDesc: v.placa
                          })}
                        />

                        {/* Placa / Descrição (não editável) */}
                        <Txt
                          className="col-span-4 bg-gray-200"
                          readOnly
                          value={filtros.entregasVeiculoDesc}
                        />
                      </div>

                      {/* Motorista */}
                      <Label className="col-span-1 flex items-center justify-end">
                        Motorista
                      </Label>

                      <div className="col-span-5 grid grid-cols-5 gap-2 items-center">
                        <InputBuscaMotorista
                          className="col-span-1"
                          label={null}
                          value={filtros.entregasMotoristaCnh}
                          onChange={(e) => updateFiltros("entregasMotoristaCnh", e.target.value)}
                          onSelect={(mot) => setFiltros({
                            entregasMotoristaCnh: mot.cnh,
                            entregasMotoristaNome: mot.nome
                          })}
                        />

                        {/* Nome (não editável) */}
                        <Txt
                          className="col-span-4 bg-gray-200"
                          readOnly
                          value={filtros.entregasMotoristaNome}
                        />
                      </div>
                    </div>

                    {/* === Linha 3 - Período === */}
                    <div className="grid grid-cols-12 gap-2 items-center">

                      <Label className="col-span-1 flex items-center justify-end">
                        Período
                      </Label>

                      <div className="col-span-5 grid grid-cols-5 gap-2 items-center">
                        <Txt
                          type="date"
                          className="col-span-2"
                          value={filtros.entregasPeriodoDe}
                          onChange={(e) => updateFiltros("entregasPeriodoDe", e.target.value)}
                        />
                        <Label className="col-span-1 flex items-center justify-center">
                          até
                        </Label>
                        <Txt
                          type="date"
                          className="col-span-2"
                          value={filtros.entregasPeriodoAte}
                          onChange={(e) => updateFiltros("entregasPeriodoAte", e.target.value)}
                        />
                      </div>

                    </div>

                  </div>
                </fieldset>


                {/* === CARD 2 - BOTÕES === */}
                <fieldset className="border border-gray-300 rounded px-3 pt-1 pb-3 bg-white w-[150px] flex flex-col justify-start items-stretch gap-2">
                  <legend className="text-red-700 font-semibold px-2">Ações</legend>

                  <button className="border border-gray-300 bg-white hover:bg-gray-100 rounded py-2 text-[13px] text-gray-700 flex items-center justify-center gap-2">
                    <Search size={16} className="text-red-700" />
                    Pesquisar
                  </button>

                  <button className="border border-gray-300 bg-white hover:bg-gray-100 rounded py-2 text-[13px] text-gray-700 flex items-center justify-center gap-2">
                    <FileSpreadsheet size={16} className="text-blue-700" />
                    Rel Ocorrência
                  </button>
                </fieldset>
              </div>


              {/* === CARD 3 - GRID === */}
              <fieldset className="border border-gray-300 rounded px-3 pt-1 pb-3 bg-white mt-3 flex-1 min-h-0">
                <legend className="text-red-700 font-semibold px-2">Entregas da Viagem</legend>

                {/* 🔹 Grid com rolagem interna apenas nela */}
                <div className="flex-1 min-h-[300px] max-h-[400px] overflow-auto border border-gray-200 rounded min-w-0">
                  <table className="w-full text-[12px] border-collapse">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                      <tr>
                        {[
                          "Filial",
                          "Nº Documento",
                          "Tipo Documento",
                          "Nº Placa",
                          "Motorista",
                          "Cliente",
                          "Destinatário",
                          "Cidade Entrega",
                          "UF",
                          "DT Entrega Fim",
                          "HR Entrega Fim",
                          "Cód. Ocorrência",
                          "Descrição Ocorrência",
                        ].map((h) => (
                          <th key={h} className="border px-2 py-1 text-left whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(10)].map((_, i) => (
                        <tr
                          key={i}
                          className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"
                            } hover:bg-red-50 cursor-pointer transition`}
                        >
                          <td className="border px-2 py-1 text-center">001</td>
                          <td className="border px-2 py-1 text-center">{`18570${i}`}</td>
                          <td className="border px-2 py-1 text-center">CT</td>
                          <td className="border px-2 py-1 text-center">RXW4I56</td>
                          <td className="border px-2 py-1">ALAN DA COSTA</td>
                          <td className="border px-2 py-1">HNK-ITU (1) MATRIZ</td>
                          <td className="border px-2 py-1">HNK-ITU (1) MATRIZ</td>
                          <td className="border px-2 py-1">SALVADOR</td>
                          <td className="border px-2 py-1 text-center">BA</td>
                          <td className="border px-2 py-1 text-center">03/01/2025</td>
                          <td className="border px-2 py-1 text-center">15:45</td>
                          <td className="border px-2 py-1 text-center">2</td>
                          <td className="border px-2 py-1 text-left">Descarga Parcial</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Rodapé de total */}
                <div className="flex justify-between items-center mt-2 text-[13px] text-gray-700">
                  <div>
                    Total de Registros Exibidos: <b>10</b>
                  </div>
                </div>
              </fieldset>
            </>
          )}

          {/* ===================== ABA FICHA VIAGEM ===================== */}
          {activeTab === "ficha" && (
            <div className="flex flex-col gap-3 p-2">
              {/* === LINHA SUPERIOR (CARD 1 + CARD 2) === */}
              <div className="flex gap-3">
                {/* === CARD 1 - FILTROS === */}
                <fieldset className="border border-gray-300 rounded px-3 pt-1 pb-3 bg-white flex-1">
                  <legend className="text-red-700 font-semibold px-2">
                    Filtros
                  </legend>

                  <div className="flex flex-col gap-2 text-[13px]">
                    {/* === Linha 1 - Filial / Motorista === */}
                    <div className="grid grid-cols-12 gap-2 items-center">
                      {/* Filial à esquerda */}
                      <div className="col-span-7 flex items-center gap-2">
                        <Label className="whitespace-nowrap">Filial</Label>
                        <Sel className="flex-1">
                          <option>001 - TESTE MANTRAN</option>
                        </Sel>
                      </div>

                      {/* Motorista à direita */}
                      <div className="col-span-5 flex items-center gap-2 justify-end">
                        <Label>Motorista</Label>
                        <Txt className="w-[130px] text-center" />
                        <Txt
                          className="flex-1"
                        />
                      </div>
                    </div>

                    {/* === Linha 2 - Status Ficha / Período === */}
                    <div className="grid grid-cols-12 gap-2 items-center">
                      {/* Status Ficha à esquerda */}
                      <div className="col-span-7 flex items-center gap-2">
                        <Label className="whitespace-nowrap">Status Ficha</Label>
                        <Sel className="flex-1">
                          <option>ABERTA</option>
                          <option>ENCERRADA</option>
                          <option>TODAS</option>
                        </Sel>
                      </div>

                      {/* Período à direita */}
                      <div className="col-span-5 flex items-center gap-2 justify-end">
                        <Label>Período</Label>
                        <Txt type="date" className="w-[140px]" />
                        <Label>Até</Label>
                        <Txt type="date" className="w-[140px]" />
                      </div>
                    </div>
                  </div>
                </fieldset>

                {/* === CARD 2 - BOTÕES === */}
                <fieldset className="border border-gray-300 rounded px-3 pt-1 pb-3 bg-white w-[150px] flex flex-col justify-start items-stretch gap-2">
                  <legend className="text-red-700 font-semibold px-2">Ações</legend>

                  <button className="border border-gray-300 bg-white hover:bg-gray-100 rounded py-2 text-[13px] text-gray-700 flex items-center justify-center gap-2">
                    <Search size={16} className="text-red-700" />
                    Pesquisar
                  </button>

                  <button className="border border-gray-300 bg-white hover:bg-gray-100 rounded py-2 text-[13px] text-gray-700 flex items-center justify-center gap-2">
                    <Printer size={16} className="text-blue-700" />
                    Imprimir
                  </button>
                </fieldset>
              </div>

              {/* === CARD 3 - GRID === */}
              <fieldset className="border border-gray-300 rounded px-3 pt-1 pb-3 bg-white">
                <legend className="text-red-700 font-semibold px-2">
                  Fichas de Viagem
                </legend>

                <div className="border border-gray-300 rounded bg-white max-h-[300px] overflow-y-auto overflow-x-auto min-w-0">
                  <table className="min-w-[1000px] text-[12px] border-collapse">
                    <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
                      <tr>
                        {[
                          "Status Ficha",
                          "Nº Viagem",
                          "Motorista",
                          "Valor Crédito",
                          "Valor Débito",
                          "Saldo Atual",
                          "Data Fechamento",
                        ].map((h) => (
                          <th
                            key={h}
                            className="border px-2 py-1 text-left whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {[
                        {
                          status: "ENCERRADA",
                          viagem: "035417",
                          motorista: "FERNANDO JOSE NASCIMENTO BIAO",
                          credito: "0,00",
                          debito: "100,00",
                          saldo: "-100",
                          fechamento: "17/01/2024 00:00:00",
                        },
                        {
                          status: "ABERTA",
                          viagem: "035418",
                          motorista: "FERNANDO JOSE NASCIMENTO BIAO",
                          credito: "0,00",
                          debito: "100,00",
                          saldo: "-100",
                          fechamento: "",
                        },
                        {
                          status: "ABERTA",
                          viagem: "039126",
                          motorista: "MATHEUS VINICIUS",
                          credito: "0,00",
                          debito: "10,00",
                          saldo: "-10",
                          fechamento: "",
                        },
                      ].map((row, i) => (
                        <tr
                          key={i}
                          className="hover:bg-gray-100 transition"
                        >
                          <td className="border px-2 whitespace-nowrap">
                            {row.status}
                          </td>

                          <td className="border px-2 text-center whitespace-nowrap">
                            {row.viagem}
                          </td>

                          <td
                            className="border px-2 whitespace-nowrap"
                            title={row.motorista}
                          >
                            {row.motorista}
                          </td>

                          <td className="border px-2 text-right whitespace-nowrap">
                            {row.credito}
                          </td>

                          <td className="border px-2 text-right whitespace-nowrap">
                            {row.debito}
                          </td>

                          <td className="border px-2 text-right whitespace-nowrap">
                            {row.saldo}
                          </td>

                          <td className="border px-2 text-center whitespace-nowrap">
                            {row.fechamento || "--"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>


                {/* === TOTAL DE REGISTROS === */}
                <div className="text-[13px] text-gray-700 mt-2">
                  Total de Registros: <b>3</b>
                </div>
              </fieldset>
            </div>
          )}

        </div>



        {/* === CARD 6 - Rodapé === */}
        <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center justify-between">

          {/* === ÍCONES DE AÇÃO (à esquerda) === */}
          <div className="flex items-center gap-5">

            {/* Fechar */}
            <button
              onClick={() => { limparFormulario(); navigate(-1); }}
              title="Fechar Tela"
              className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
            >
              <XCircle size={20} />
              <span>Fechar</span>
            </button>

            {/* Limpar (Atualiza data e limpa campos) */}
            <button
              onClick={handleLimparTudo}
              title="Limpar Campos"
              className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
              tabIndex={-1}
            >
              <RotateCcw size={20} />
              <span>Limpar</span>
            </button>

            {/* Incluir */}
            <button
              onClick={handleIncluir}
              title="Incluir Viagem"
              className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
              tabIndex={18}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleIncluir();
                }
              }}
            >
              <PlusCircle size={20} />
              <span>Incluir</span>
            </button>

            {/* Alterar */}
            <button
              title="Alterar Viagem"
              className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
              tabIndex={-1}
            >
              <Edit size={20} />
              <span>Alterar</span>
            </button>

            {/* Excluir */}
            <button
              title="Excluir Viagem"
              className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
              tabIndex={-1}
            >
              <Trash2 size={20} />
              <span>Excluir</span>
            </button>

            {/* Pagamento */}
            <button
              onClick={() => setModalPagamentoOpen(true)}
            >
              <DollarSign size={20} />
              <span>Pagto</span>
            </button>

            {/* Monitoramento */}
            <button
              onClick={() => setModalMonitoramentoOpen(true)}
              title="Monitoramento"
              className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
            >
              <MapPin size={20} />
              <span>Monitorar</span>
            </button>

            {/* Buonny */}
            <button
              title="Buonny"
              className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
            >
              <UserCheck size={20} />
              <span>Buonny</span>
            </button>


          </div>

          {/* === OPERADOR E DATA (à direita) === */}
          <div className="flex items-center gap-2 text-[12px] text-gray-700">
            <Label>Operador</Label>
            <Txt className="w-[150px] text-center bg-gray-100" readOnly />
            <Txt className="w-[100px] text-center bg-gray-100" readOnly />
          </div>
        </div>



        {/* === MODAIS === */}


        {modalDespesaOpen && (
          <ViagemDespesa
            isOpen={modalDespesaOpen}
            onClose={() => setModalDespesaOpen(false)}
          />
        )}

        {modalCustosOpen && (
          <ViagemCustosOperacionais
            isOpen={modalCustosOpen}
            onClose={() => setModalCustosOpen(false)}
          />
        )}

        {modalEncerrarOpen && (
          <ViagemEncerramento
            isOpen={modalEncerrarOpen}
            onClose={() => setModalEncerrarOpen(false)}
            onConfirm={(dados) => console.log("Encerramento da viagem:", dados)}
          />
        )}


        {modalMontarCteOpen && (
          <ViagemMontarCte
            isOpen={modalMontarCteOpen}
            onClose={() => setModalMontarCteOpen(false)}
          />
        )}

        {modalPagamentoOpen && (
          <ViagemPagamento
            isOpen={modalPagamentoOpen}
            onClose={() => setModalPagamentoOpen(false)}
          />
        )}

        {modalMonitoramentoOpen && (
          <ViagemMonitoramento
            onClose={() => setModalMonitoramentoOpen(false)}
          />
        )}

        {modalMontarMinutaOpen && (
          <ViagemMontarMinuta
            isOpen={modalMontarMinutaOpen}
            onClose={() => setModalMontarMinutaOpen(false)}
          />
        )}

        {modalInicioOpen && (
          <ViagemInicio
            isOpen={modalInicioOpen}
            onClose={() => setModalInicioOpen(false)}
            onConfirm={(dados) => console.log("Início da viagem:", dados)}
          />
        )}

      </div>
    </div>
  );
}


