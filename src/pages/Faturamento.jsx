import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FaturamentoDoc from "./FaturamentoDoc";
import { useIconColor } from "../context/IconColorContext";

import {
  XCircle,
  RotateCcw,
  Settings,
  PlusCircle,
  Edit,
  Trash2,
  FileText,
  FileSpreadsheet,
  Printer,
  Copy,
  Download,
  ChevronUp,
  ChevronDown,
  CheckSquare,
  FileDown,
} from "lucide-react";

// ========================= Helpers =========================
function Label({ children, className = "" }) {
  return (
    <label className={`text-[12px] text-gray-700 ${className}`}>{children}</label>
  );
}

function Txt(props) {
  return (
    <input
      {...props}
      className={
        "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] " +
        (props.className || "")
      }
    />
  );
}

function Sel({ children, className = "", ...rest }) {
  return (
    <select
      {...rest}
      className={
        "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] " +
        className
      }
    >
      {children}
    </select>
  );
}

// helper simples p/ data de hoje em formato yyyy-MM-dd
const getHojeISO = () => new Date().toISOString().slice(0, 10);

// função para inputs type="date" não-controlados
const fillTodayIfEmpty = (e) => {
  if (!e.target.value) {
    e.target.value = getHojeISO();
  }
};

// helper parse numérico pt-BR
const parseNumero = (v) => {
  if (!v) return 0;
  return Number(v.toString().replace(/\./g, "").replace(",", ".")) || 0;
};

const formatNumero = (n) =>
  n.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function Faturamento({ open }) {
  const navigate = useNavigate();
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  const [activeTab, setActiveTab] = useState("fatura");


  const [showModalDesconto, setShowModalDesconto] = useState(false);
  const [modalDescontoValues, setModalDescontoValues] = useState({
    vrDesconto: "",
    percDesconto: "",
  });


  // controla qual subcard está ativo (aba Consulta)
  const [tipo, setTipo] = useState("fatura");

  // função que desabilita inputs conforme o tipo selecionado
  const disabled = (checkTipo) => tipo !== checkTipo;

  // mock básico da fatura atual
  const [numeroFatura, setNumeroFatura] = useState("046504C");
  const [cliente, setCliente] = useState({
    cnpj: "50221019000136",
    razao: "HNK BR INDUSTRIA DE BEBIDAS LTDA",
  });

  // valores da fatura (card 2)
  const [valores, setValores] = useState({
    totalTitulo: 283.01,
    valorAcerto: 0,
    baseISS: 0,
    valorISS: 0,
    valorICMS: 19.81,
    valorLiquido: 283.01,
    valorJurosDia: 0,
    percJuros: 0,
    vrDesconto: 0,
    percDesconto: 0,
  });

  // infos recebimento (card 4)
  const [recebimento, setRecebimento] = useState({
    conta: "",
    banco: "341",
    agencia: "",
    valorJaRecebido: 0,
    tipoPagtoCod: "0",
    tipoPagtoDesc: "REPOM CIOT",
    doctoPagto: "",
    valorDescto: 0,
    vrAbatimento: 0,
    descontoConcedido: 0,
    valorJuros: 0,
    valorMulta: 0,
    valorReceber: 283.01,
    totalRecebido: 0,
    observacaoBaixa: "",
  });

  const saldoTitulo = valores.totalTitulo;

  // retráteis
  const [isBaixaOpen, setIsBaixaOpen] = useState(false);
  const [isRecebOpen, setIsRecebOpen] = useState(false);

  // modais
  const [showDocs, setShowDocs] = useState(false);
  const [showMsgIncluir, setShowMsgIncluir] = useState(false);

  // Modal Alterar Vencimento
  const [showModalVencimento, setShowModalVencimento] = useState(false);
  const [novoVencimento, setNovoVencimento] = useState("");

  // Modal Alterar Valor Total Da Fatura
  const [showModalAlterarTotal, setShowModalAlterarTotal] = useState(false);
  const [modalNovoTotal, setModalNovoTotal] = useState("");



  // submenu rodapé
  const [showAlteracoesMenu, setShowAlteracoesMenu] = useState(false);
  const [showImprimirMenu, setShowImprimirMenu] = useState(false);

  // grid consulta – mocks
  const faturasMock = [
    {
      id: 1,
      empresa: "001",
      filial: "001",
      clienteFantasia: "HNK BR INDUSTRIA DE BEBIDAS LTDA",
      numero: "046504C",
      emissao: "21/11/2025",
      vencimento: "21/12/2025",
      recebimento: "",
      valor: 283.01,
      nossoNumero: "",
      integracao: "",
      cnpj: "50221019000136",
    },
    {
      id: 2,
      empresa: "001",
      filial: "001",
      clienteFantasia: "A A BARELLA",
      numero: "046503C",
      emissao: "13/10/2025",
      vencimento: "28/10/2025",
      recebimento: "",
      valor: 0,
      nossoNumero: "",
      integracao: "",
      cnpj: "00000000000000",
    },
  ];

  const [listaFaturas, setListaFaturas] = useState([]);

  {/* FUNÇÕES ALTERAÇÕES GERAIS */ }
  // quando mudar algum campo de valor de recebimento, recalcula Valor Receber
  const handleRecebimentoChange = (field) => (e) => {
    const value = e.target.value;
    setRecebimento((prev) => {
      const updated = { ...prev, [field]: value };
      const valorReceberCalc =
        saldoTitulo -
        parseNumero(updated.valorJaRecebido) -
        parseNumero(updated.valorDescto) -
        parseNumero(updated.vrAbatimento) -
        parseNumero(updated.descontoConcedido) +
        parseNumero(updated.valorJuros) +
        parseNumero(updated.valorMulta);

      return {
        ...updated,
        valorReceber: valorReceberCalc,
      };
    });
  };

  const handleAlterarTotal = () => {
    const novo = parseNumero(modalNovoTotal);

    setValores(prev => ({
      ...prev,
      totalTitulo: novo,
      valorLiquido: novo - prev.vrDesconto // mantém desconto aplicado
    }));

    setRecebimento(prev => ({
      ...prev,
      valorReceber: novo - valores.vrDesconto
    }));

    setShowModalAlterarTotal(false);
  };


  const handleAlterarVencimento = () => {
    if (!novoVencimento) {
      alert("Informe o novo vencimento!");
      return;
    }

    // Atualiza no card Informações da Fatura
    document.getElementById("inputVencimento").value = novoVencimento;

    setShowModalVencimento(false);
  };






  const handleAplicarDesconto = () => {
    const vr = parseNumero(modalDescontoValues.vrDesconto);
    const perc = parseNumero(modalDescontoValues.percDesconto);

    let valorDescontoCalculado = vr;

    // Se % desconto foi informado, recalcula VR desconto
    if (perc > 0) {
      valorDescontoCalculado = (valores.totalTitulo * perc) / 100;
    }

    // Novo valor líquido
    const novoValorLiquido = valores.totalTitulo - valorDescontoCalculado;

    // Atualiza valores da fatura
    setValores(prev => ({
      ...prev,
      vrDesconto: valorDescontoCalculado,
      percDesconto: perc,
      valorLiquido: novoValorLiquido,
    }));

    // Atualiza automaticamente o Valor Receber
    setRecebimento(prev => ({
      ...prev,
      valorReceber: novoValorLiquido,
    }));

    setShowModalDesconto(false);
  };

  const handlePesquisarConsulta = () => {
    // simples: carrega os mocks
    setListaFaturas(faturasMock);
  };

  const handleSelecionarFatura = (fat) => {
    setActiveTab("fatura");
    setNumeroFatura(fat.numero);
    setCliente((prev) => ({
      ...prev,
      cnpj: fat.cnpj,
      razao: fat.clienteFantasia,
    }));
    setValores((prev) => ({
      ...prev,
      totalTitulo: fat.valor,
      valorLiquido: fat.valor,
    }));
    setRecebimento((prev) => ({
      ...prev,
      valorReceber: fat.valor,
    }));
  };

  const handleLimpar = () => {
    // limpa campos principais (mock simples)
    setCliente({
      cnpj: "",
      razao: "",
    });
    setValores({
      totalTitulo: 0,
      valorAcerto: 0,
      baseISS: 0,
      valorISS: 0,
      valorICMS: 0,
      valorLiquido: 0,
      valorJurosDia: 0,
      percJuros: 0,
      vrDesconto: 0,
      percDesconto: 0,
    });
    setRecebimento({
      conta: "",
      banco: "",
      agencia: "",
      valorJaRecebido: 0,
      tipoPagtoCod: "",
      tipoPagtoDesc: "",
      doctoPagto: "",
      valorDescto: 0,
      vrAbatimento: 0,
      descontoConcedido: 0,
      valorJuros: 0,
      valorMulta: 0,
      valorReceber: 0,
      totalRecebido: 0,
      observacaoBaixa: "",
    });
  };

  const handleConfirmarIncluir = () => {
    // ao clicar em Incluir no rodapé → abre modal de confirmação
    setShowMsgIncluir(true);
  };

  const handleMsgOk = () => {
    // fecha modal de "Fatura Incluída" e abre Documentos
    setShowMsgIncluir(false);
    setShowDocs(true);
  };

  const handleUpdateTotais = ({ totalTitulo, valorLiquido }) => {
    setValores((prev) => ({
      ...prev,
      totalTitulo,
      valorLiquido,
    }));
    setRecebimento((prev) => ({
      ...prev,
      valorReceber: totalTitulo,
    }));
  };

  return (
    <div
      className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 bg-gray-50 h-[calc(100vh-56px)] flex flex-col ${open ? "ml-[192px]" : "ml-[56px]"
        }`}
    >
      {/* Título */}
      <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
        FATURAMENTO
      </h1>

      {/* Abas */}
      <div className="flex border-b border-gray-300 bg-white">
        {["fatura", "consulta"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1 text-sm font-medium border-t border-x rounded-t-md ${activeTab === tab
                ? "bg-white text-red-700 border-gray-300"
                : "bg-gray-100 text-gray-600 border-transparent"
              } ${tab !== "fatura" ? "ml-1" : ""}`}
          >
            {tab === "fatura" ? "Fatura" : "Consulta"}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 p-3 bg-white border-x border-b border-gray-200 rounded-b-md overflow-y-auto flex flex-col gap-2">
        {/* ======================= ABA FATURA ======================= */}
        {activeTab === "fatura" && (
          <>
            {/* FIELDSET - Informações da Fatura */}
            <fieldset className="border border-gray-300 rounded p-3 bg-white">
              <legend className="text-red-700 font-semibold text-[13px] px-2">
                Informações da Fatura
              </legend>

              <div className="space-y-2">
                {/* Linha 1 - GRID 12 COLUNAS */}
                <div className="grid grid-cols-12 gap-2 w-full">
                  {/* Empresa */}
                  <div className="col-span-3 flex items-center">
                    <Label className="min-w-[70px] mr-1">Empresa</Label>
                    <Sel className="w-full">
                      <option>001 - MANTRAN TRANSPORTES LTDA</option>
                    </Sel>
                  </div>

                  {/* Filial */}
                  <div className="col-span-3 flex items-center">
                    <Label className="min-w-[50px] mr-1 text-right">
                      Filial
                    </Label>
                    <Sel className="w-full">
                      <option>001 - TESTE MANTRAN</option>
                    </Sel>
                  </div>

                  {/* Emissão */}
                  <div className="col-span-3 flex items-center">
                    <Label className="min-w-[70px] mr-1 text-right">
                      Emissão
                    </Label>
                    <Txt
                      type="date"
                      className="w-full"
                      onFocus={fillTodayIfEmpty}
                    />
                  </div>

                  {/* Nº Fatura */}
                  <div className="col-span-3 flex items-center justify-end">
                    <Label className="min-w-[90px] mr-1 text-right">
                      Nº Fatura
                    </Label>
                    <Txt
                      className="w-full max-w-[140px] bg-gray-200 text-right"
                      readOnly
                      value={numeroFatura}
                    />
                  </div>
                </div>

                {/* Linha 2 */}
                <div className="grid grid-cols-12 gap-2 w-full">
                  {/* Cliente (label + CNPJ) */}
                  <div className="col-span-2 flex items-center">
                    <Label className="min-w-[70px] mr-1">Cliente</Label>
                    <Txt
                      className="w-full"
                      value={cliente.cnpj}
                      onChange={(e) =>
                        setCliente((prev) => ({
                          ...prev,
                          cnpj: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* Razão Social + botão editar */}
                  <div className="col-span-4 flex items-center gap-1">
                    <Txt
                      className="flex-1 bg-gray-200"
                      readOnly
                      value={cliente.razao}
                    />
                    <button
                      title="Abrir cadastro do Cliente"
                      className="border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded w-[26px] h-[24px] flex items-center justify-center"
                    >
                      <i className="fa-solid fa-pen text-red-600 text-[11px]" />
                    </button>
                  </div>

                  {/* Tipo Cliente */}
                  <div className="col-span-3 flex items-center justify-end">
                    <Label className="min-w-[90px] mr-1 text-right">
                      Tipo Cliente
                    </Label>
                    <Txt
                      className="w-full max-w-[130px] bg-gray-200"
                      readOnly
                      defaultValue="CORRENTISTA"
                    />
                  </div>

                  {/* Status */}
                  <div className="col-span-3 flex items-center justify-end">
                    <Label className="min-w-[60px] mr-1 text-right">
                      Status
                    </Label>
                    <Txt
                      className="w-full max-w-[200px] bg-gray-200"
                      readOnly
                      defaultValue="3 - FAT. MÊS ANTERIOR"
                    />
                  </div>
                </div>

                {/* Linha 3 */}
                <div className="grid grid-cols-12 gap-2 w-full">
                  {/* Categoria */}
                  <div className="col-span-2 flex items-center">
                    <Label className="min-w-[70px] mr-1">Categoria</Label>
                    <Txt className="w-full" defaultValue="17" />
                  </div>

                  {/* Desc categoria */}
                  <div className="col-span-4 flex items-center">
                    <Txt
                      className="w-full bg-gray-200"
                      readOnly
                      defaultValue="RECEITAS OPERACIONAIS"
                    />
                  </div>

                  {/* Subcategoria */}
                  <div className="col-span-2 flex items-center justify-end">
                    <Label className="mr-1 text-right">Subcategoria</Label>
                    <Txt className="w-full" defaultValue="1" />
                  </div>

                  {/* Descrição subcategoria */}
                  <div className="col-span-4 flex items-center">
                    <Txt
                      className="w-full bg-gray-200"
                      readOnly
                      defaultValue="SERVIÇOS"
                    />
                  </div>
                </div>

                {/* Linha 4 */}
                <div className="grid grid-cols-12 gap-2 w-full">
                  {/* Portador */}
                  <div className="col-span-3 flex items-center">
                    <Label className="min-w-[70px] mr-1">Portador</Label>
                    <Sel className="w-full">
                      <option>001 - BANCO DO BRASIL S.A.</option>
                    </Sel>
                  </div>

                  {/* Centro Custo */}
                  <div className="col-span-3 flex items-center justify-end">
                    <Label className="mr-1 text-right">Centro Custo</Label>
                    <Sel className="w-full max-w-[200px]">
                      <option>MANTRAN</option>
                    </Sel>
                  </div>

                  {/* Data Integr. */}
                  <div className="col-span-3 flex items-center gap-1">
                    <Label className="text-right">Data Integr.</Label>
                    <Txt
                      type="date"
                      className="flex-1"
                      onFocus={fillTodayIfEmpty}
                    />
                  </div>

                  {/* Agência */}
                  <div className="col-span-3 flex items-center gap-1">
                    <Label className="text-right">Agência</Label>
                    <Txt className="flex-1 bg-gray-200" readOnly />
                  </div>
                </div>

                {/* Linha 5 */}
                <div className="grid grid-cols-12 gap-2 w-full items-center">
                  {/* Vencimento */}
                  <div className="col-span-3 flex items-center gap-1">
                    <Label className="min-w-[70px]">Vencimento</Label>
                    <Txt
                      id="inputVencimento"
                      type="date"
                      className="flex-1"
                      onFocus={fillTodayIfEmpty}
                    />
                  </div>

                  {/* Cond Pagto */}
                  <div className="col-span-3 flex items-center justify-end">
                    <Label className="min-w-[130px] mr-1 text-right">
                      Condição Pagto.
                    </Label>
                    <Sel className="w-full">
                      <option>30 - 30 DIAS</option>
                    </Sel>
                  </div>

                  {/* Checkbox */}
                  <div className="col-span-6 flex justify-end">
                    <label className="flex items-center gap-1 text-[12px] whitespace-nowrap">
                      <input type="checkbox" className="accent-red-700" />
                      Reter ICMS na Fatura
                    </label>
                  </div>
                </div>

                {/* Linha 6 - Observação */}
                <div className="grid grid-cols-12 items-center gap-2 w-full">
                  <Label className="col-span-2">Observação</Label>
                  <Txt className="col-span-10" defaultValue="TESTE" />
                </div>

                {/* Linha 7 */}
                <div className="grid grid-cols-12 items-center gap-2 w-full">
                  <div className="col-span-3 flex items-center">
                    <Label>Alteração</Label>
                    <Txt
                      type="date"
                      className="ml-2 bg-gray-200 flex-1"
                      readOnly
                      defaultValue={getHojeISO()}
                    />
                  </div>

                  <div className="col-span-3 flex items-center justify-end">
                    <Label className="mr-1 text-right">Contestação</Label>
                    <Txt
                      type="date"
                      className="w-full max-w-[160px] bg-gray-200"
                      readOnly
                      defaultValue={getHojeISO()}
                    />
                  </div>

                  <div className="col-span-6 flex items-center justify-end">
                    <Label className="mr-1 text-right">Operador</Label>
                    <Txt
                      className="w-full max-w-[160px] bg-gray-200"
                      readOnly
                      defaultValue="SUPORTE"
                    />
                  </div>
                </div>
              </div>
            </fieldset>

            {/* FIELDSET - Valores da Fatura */}
            <fieldset className="border border-gray-300 rounded p-3 bg-white">
              <legend className="text-red-700 font-semibold text-[13px] px-2">
                Valores da Fatura
              </legend>

              <div className="space-y-2">
                {/* LINHA 1 */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1 text-right">
                    Total Título
                  </Label>
                  <Txt
                    className="col-span-1 text-right bg-gray-200"
                    readOnly
                    value={formatNumero(valores.totalTitulo)}
                  />

                  <Label className="col-span-1 text-right">
                    Valor Acerto
                  </Label>
                  <Txt
                    className="col-span-1 text-right bg-gray-200"
                    readOnly
                    value={formatNumero(valores.valorAcerto)}
                  />

                  <Label className="col-span-1 text-right">Base ISS</Label>
                  <Txt
                    className="col-span-1 text-right bg-gray-200"
                    readOnly
                    value={formatNumero(valores.baseISS)}
                  />

                  <Label className="col-span-1 text-right">Valor ISS</Label>
                  <Txt
                    className="col-span-1 text-right bg-gray-200"
                    readOnly
                    value={formatNumero(valores.valorISS)}
                  />

                  <Label className="col-span-1 text-right">Valor ICMS</Label>
                  <Txt
                    className="col-span-1 text-right bg-gray-200"
                    readOnly
                    value={formatNumero(valores.valorICMS)}
                  />

                  <Label className="col-span-1 text-right">
                    Valor Líquido
                  </Label>
                  <Txt
                    className="col-span-1 text-right bg-gray-200"
                    readOnly
                    value={formatNumero(valores.valorLiquido)}
                  />

                  {/* Espaço restante para bater 12 colunas */}
                  <div className="col-span-3"></div>
                </div>

                {/* LINHA 2 */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1 text-right">Juros/Dia</Label>
                  <Txt
                    className="col-span-1 text-right bg-gray-200"
                    readOnly
                    defaultValue="0,00"
                  />

                  <Label className="col-span-1 text-right">% Juros</Label>
                  <Txt
                    className="col-span-1 text-right bg-gray-200"
                    readOnly
                    defaultValue="0,00"
                  />

                  <Label className="col-span-1 text-right">Vr. Desconto</Label>
                  <Txt
                    className="col-span-1 text-right bg-gray-200"
                    readOnly
                    value={formatNumero(valores.vrDesconto)}
                  />


                  <Label className="col-span-1 text-right">% Desconto</Label>
                  <Txt
                    className="col-span-1 text-right bg-gray-200"
                    readOnly
                    value={formatNumero(valores.percDesconto)}
                  />

                  {/* Botão confirmar desconto */}
                  <div className="col-span-4 flex justify-end">
                    <button
                      className="border border-gray-300 rounded px-3 py-[4px] text-[12px] bg-gray-50 hover:bg-gray-100 flex items-center gap-1"
                      title="Confirmar Desconto"
                    >
                      <CheckSquare size={16} className="text-red-700" />
                      Confirmar Desconto
                    </button>
                  </div>
                </div>
              </div>
            </fieldset>

            {/* CARD 3 - Informação da Baixa da Fatura (retrátil) */}
            <div className="border border-gray-300 rounded bg-white">
              <div
                className="flex justify-between items-center px-3 py-1 bg-gray-50 cursor-pointer select-none rounded-t"
                onClick={() => setIsBaixaOpen((prev) => !prev)}
              >
                <h2 className="text-red-700 font-semibold text-[13px]">
                  Informações da Baixa da Fatura
                </h2>
                {isBaixaOpen ? (
                  <ChevronUp size={16} className="text-gray-600" />
                ) : (
                  <ChevronDown size={16} className="text-gray-600" />
                )}
              </div>

              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${isBaixaOpen ? "max-h-[260px]" : "max-h-[0px]"
                  }`}
              >
                <div className="p-3 space-y-2">
                  {/* LINHA 1 */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 text-right">
                      Nosso Número
                    </Label>
                    <Txt className="col-span-2 bg-gray-200" readOnly />

                    <Label className="col-span-2 text-right">Nº Borderô</Label>
                    <Txt className="col-span-2" />

                    <Label className="col-span-3 text-right">
                      Data Remessa
                    </Label>
                    <Txt
                      type="date"
                      className="col-span-2 bg-gray-200"
                      readOnly
                      defaultValue={getHojeISO()}
                    />
                  </div>

                  {/* LINHA 2 */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 text-right">Id. Boleto</Label>
                    <Txt className="col-span-2 bg-gray-200" readOnly />

                    <Label className="col-span-2 text-right">Protesto</Label>
                    <Txt
                      type="date"
                      className="col-span-2 bg-gray-200"
                      readOnly
                    />

                    <Label className="col-span-3 text-right">
                      Operador Protesto
                    </Label>
                    <Txt className="col-span-2 bg-gray-200" readOnly />
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 4 - Informações do Recebimento do Título (retrátil) */}
            <div className="border border-gray-300 rounded bg-white">
              <div
                className="flex justify-between items-center px-3 py-1 bg-gray-50 cursor-pointer select-none rounded-t"
                onClick={() => setIsRecebOpen((prev) => !prev)}
              >
                <h2 className="text-red-700 font-semibold text-[13px]">
                  Informações do Recebimento do Título
                </h2>
                {isRecebOpen ? (
                  <ChevronUp size={16} className="text-gray-600" />
                ) : (
                  <ChevronDown size={16} className="text-gray-600" />
                )}
              </div>

              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${isRecebOpen ? "max-h-[900px]" : "max-h-[0px]"
                  }`}
              >
                <div className="p-3 space-y-3">
                  {/* LINHA 1 */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 text-right">Nº Conta</Label>
                    <Sel
                      className="col-span-2"
                      value={recebimento.conta}
                      onChange={(e) =>
                        setRecebimento((prev) => ({
                          ...prev,
                          conta: e.target.value,
                        }))
                      }
                    >
                      <option value="">Selecione...</option>
                      <option value="12345-6">12345-6</option>
                      <option value="98765-0">98765-0</option>
                    </Sel>

                    <Label className="col-span-2 text-right">Banco</Label>
                    <Txt
                      className="col-span-1 bg-gray-200"
                      readOnly
                      value={recebimento.banco}
                    />

                    <Label className="col-span-1 text-right">Agência</Label>
                    <Txt
                      className="col-span-1 bg-gray-200"
                      readOnly
                      value={recebimento.agencia}
                    />

                    <Label className="col-span-2 text-right">
                      Saldo Título
                    </Label>
                    <Txt
                      className="col-span-1 bg-gray-200 text-right"
                      readOnly
                      value={formatNumero(saldoTitulo)}
                    />

                    {/* Botões */}
                    <div className="col-span-1 flex gap-1 justify-end">
                      <button className="border border-gray-300 rounded px-2 py-[3px] bg-gray-50 hover:bg-gray-100 text-[12px]">
                        Baixar
                      </button>
                      <button className="border border-gray-300 rounded px-2 py-[3px] bg-gray-50 hover:bg-gray-100 text-[12px]">
                        Estornar
                      </button>
                    </div>
                  </div>

                  {/* LINHA 2 */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 text-right">
                      Tipo Pagto.
                    </Label>
                    <Txt
                      className="col-span-1"
                      value={recebimento.tipoPagtoCod}
                      onChange={(e) =>
                        setRecebimento((prev) => ({
                          ...prev,
                          tipoPagtoCod: e.target.value,
                        }))
                      }
                    />
                    <Txt
                      className="col-span-1 bg-gray-200"
                      readOnly
                      value={recebimento.tipoPagtoDesc}
                    />

                    <Label className="col-span-2 text-right">
                      Docto Pagto.
                    </Label>
                    <Txt
                      className="col-span-3"
                      value={recebimento.doctoPagto}
                      onChange={(e) =>
                        setRecebimento((prev) => ({
                          ...prev,
                          doctoPagto: e.target.value,
                        }))
                      }
                    />

                    <Label className="col-span-2 text-right">
                      Valor já Recebido
                    </Label>
                    <Txt
                      className="col-span-2 text-right"
                      value={recebimento.valorJaRecebido}
                      onChange={handleRecebimentoChange("valorJaRecebido")}
                    />
                  </div>

                  {/* LINHA 3 */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 text-right">
                      Recebimento
                    </Label>
                    <Txt
                      type="date"
                      className="col-span-2"
                      onFocus={fillTodayIfEmpty}
                    />

                    <Label className="col-span-2 text-right">
                      Valor Descto.
                    </Label>
                    <Txt
                      className="col-span-1 text-right"
                      value={recebimento.valorDescto}
                      onChange={handleRecebimentoChange("valorDescto")}
                    />

                    <Label className="col-span-4 text-right">
                      Vr. Abatimento
                    </Label>
                    <Txt
                      className="col-span-2 text-right"
                      value={recebimento.vrAbatimento}
                      onChange={handleRecebimentoChange("vrAbatimento")}
                    />
                  </div>

                  {/* LINHA 4 */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 text-right">
                      Desconto Concedido
                    </Label>
                    <Txt
                      className="col-span-2 text-right"
                      value={recebimento.descontoConcedido}
                      onChange={handleRecebimentoChange("descontoConcedido")}
                    />

                    <Label className="col-span-2 text-right">
                      Valor Juros
                    </Label>
                    <Txt
                      className="col-span-1 text-right"
                      value={recebimento.valorJuros}
                      onChange={handleRecebimentoChange("valorJuros")}
                    />

                    <Label className="col-span-1 text-right">
                      Valor Multa
                    </Label>
                    <Txt
                      className="col-span-1 text-right"
                      value={recebimento.valorMulta}
                      onChange={handleRecebimentoChange("valorMulta")}
                    />

                    <Label className="col-span-2 text-right">
                      Valor Receber
                    </Label>
                    <Txt
                      className="col-span-2 text-right bg-gray-200"
                      readOnly
                      value={formatNumero(recebimento.valorReceber || 0)}
                    />
                  </div>

                  {/* LINHA 5 */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 text-right">
                      Operador Baixa
                    </Label>
                    <Txt
                      className="col-span-2 bg-gray-200"
                      readOnly
                      defaultValue="SUPORTE"
                    />

                    <Label className="col-span-2 text-right">
                      Data Baixa
                    </Label>
                    <Txt
                      type="date"
                      className="col-span-2 bg-gray-200"
                      onFocus={fillTodayIfEmpty}
                      readOnly
                    />

                    <Label className="col-span-3 text-right">
                      Total Recebido
                    </Label>
                    <Txt
                      className="col-span-2 text-right bg-gray-200"
                      readOnly
                      value={formatNumero(recebimento.totalRecebido || 0)}
                    />
                  </div>

                  {/* LINHA 6 - OBSERVAÇÃO */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 text-right">
                      Observ. Baixa
                    </Label>
                    <Txt
                      className="col-span-11"
                      value={recebimento.observacaoBaixa}
                      onChange={(e) =>
                        setRecebimento((prev) => ({
                          ...prev,
                          observacaoBaixa: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ======================= ABA CONSULTA ======================= */}
        {activeTab === "consulta" && (
          <>
            {/* CARD 1 - Parâmetros de Pesquisa */}
            <div className="border border-gray-300 rounded bg-white p-3 space-y-3">
              {/* Linha 1 - Empresa / Filial / Botões */}
              <div className="grid grid-cols-12 gap-2 items-center">
                {/* Empresa */}
                <div className="col-span-4 flex items-center gap-2">
                  <Label className="min-w-[70px]">Empresa</Label>
                  <Sel className="w-full">
                    <option>001 - MANTRAN TRANSPORTES LTDA</option>
                  </Sel>
                </div>

                {/* Filial */}
                <div className="col-span-4 flex items-center gap-2">
                  <Label className="min-w-[50px] text-right">Filial</Label>
                  <Sel className="w-full">
                    <option>TODAS</option>
                    <option>001 - TESTE MANTRAN</option>
                  </Sel>
                </div>

                {/* Botões */}
                <div className="col-span-4 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setListaFaturas([])}
                    className="border border-gray-300 rounded px-3 py-[4px] bg-gray-50 hover:bg-gray-100 text-[12px] flex items-center gap-1"
                  >
                    <RotateCcw size={14} className="text-red-700" />
                    Limpar
                  </button>

                  <button
                    onClick={handlePesquisarConsulta}
                    className="border border-gray-300 rounded px-3 py-[4px] bg-gray-50 hover:bg-gray-100 text-[12px] flex items-center gap-1"
                  >
                    <Printer size={14} className="text-red-700" />
                    Pesquisar
                  </button>
                </div>
              </div>

              {/* Subcards Consulta */}
              <div className="grid grid-cols-12 gap-2">
                {/* FATURA */}
                <fieldset className="col-span-12 md:col-span-6 border border-gray-300 rounded p-3 bg-gray-50">
                  <legend className="text-[12px] px-1 flex items-center gap-1 text-gray-700">
                    <input
                      type="radio"
                      name="tipoConsulta"
                      className="accent-red-700"
                      checked={tipo === "fatura"}
                      onChange={() => setTipo("fatura")}
                    />
                    Fatura
                  </legend>

                  <div className="mt-2 space-y-2">
                    {/* Linha 1 - Cliente + Razão Social */}
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <Label className="col-span-2">Cliente</Label>
                      <Txt
                        className="col-span-3"
                        disabled={disabled("fatura")}
                      />
                      <Txt
                        className="col-span-7 bg-gray-200"
                        disabled={disabled("fatura")}
                        placeholder="Razão Social"
                        readOnly
                      />
                    </div>

                    {/* Linha 2 - Nº Fatura / Período */}
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <Label className="col-span-2">Nº Fatura</Label>
                      <Txt
                        className="col-span-3"
                        disabled={disabled("fatura")}
                      />

                      <Label className="col-span-1 text-right">Período</Label>
                      <Txt
                        type="date"
                        className="col-span-3"
                        disabled={disabled("fatura")}
                      />
                      <Txt
                        type="date"
                        className="col-span-3"
                        disabled={disabled("fatura")}
                      />
                    </div>

                    {/* Linha 3 - Apenas em Aberto */}
                    <div className="grid grid-cols-12 mt-1">
                      <div className="col-span-12 flex justify-end">
                        <label className="flex items-center gap-1 text-[11px]">
                          <input
                            type="checkbox"
                            disabled={disabled("fatura")}
                            className="accent-red-700"
                          />
                          Apenas em Aberto
                        </label>
                      </div>
                    </div>
                  </div>
                </fieldset>

                {/* CONHECIMENTO */}
                <fieldset className="col-span-12 md:col-span-3 border border-gray-300 rounded p-2 bg-gray-50">
                  <legend className="text-[12px] px-1 flex items-center gap-1 text-gray-700">
                    <input
                      type="radio"
                      name="tipoConsulta"
                      className="accent-red-700"
                      checked={tipo === "conhecimento"}
                      onChange={() => setTipo("conhecimento")}
                    />
                    Conhecimento
                  </legend>

                  <div className="space-y-1 mt-1">
                    <div className="flex items-center gap-1">
                      <Label className="w-[70px]">Nº Controle</Label>
                      <Txt
                        className="flex-1"
                        disabled={disabled("conhecimento")}
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <Label className="w-[70px]">Nº CTe</Label>
                      <Txt
                        className="flex-1"
                        disabled={disabled("conhecimento")}
                      />
                    </div>
                  </div>
                </fieldset>

                {/* MINUTA + NF SERVIÇO */}
                <div className="col-span-12 md:col-span-3 flex flex-col gap-2">
                  {/* Minuta */}
                  <fieldset className="border border-gray-300 rounded p-2 bg-gray-50">
                    <legend className="text-[12px] px-1 flex items-center gap-1 text-gray-700">
                      <input
                        type="radio"
                        name="tipoConsulta"
                        className="accent-red-700"
                        checked={tipo === "minuta"}
                        onChange={() => setTipo("minuta")}
                      />
                      Minuta
                    </legend>

                    <div className="grid grid-cols-12 items-center gap-2 mt-1">
                      <Label className="col-span-4">Nº Minuta</Label>
                      <Txt
                        className="col-span-8"
                        disabled={disabled("minuta")}
                      />
                    </div>
                  </fieldset>

                  {/* NF Serviço */}
                  <fieldset className="border border-gray-300 rounded p-2 bg-gray-50">
                    <legend className="text-[12px] px-1 flex items-center gap-1 text-gray-700">
                      <input
                        type="radio"
                        name="tipoConsulta"
                        className="accent-red-700"
                        checked={tipo === "nfse"}
                        onChange={() => setTipo("nfse")}
                      />
                      NF Serviço
                    </legend>

                    <div className="grid grid-cols-12 items-center gap-2 mt-1">
                      <Label className="col-span-4">Nº NF</Label>
                      <Txt
                        className="col-span-8"
                        disabled={disabled("nfse")}
                      />
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>

            {/* CARD 2 - Relação de Faturas */}
            <div className="border border-gray-300 rounded bg-white p-2">
              <table className="w-full text-[12px] border">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="border p-1">Empresa</th>
                    <th className="border p-1">Filial</th>
                    <th className="border p-1">Cliente Fantasia</th>
                    <th className="border p-1">Nº Fatura</th>
                    <th className="border p-1">Emissão</th>
                    <th className="border p-1">Vencimento</th>
                    <th className="border p-1">Recebimento</th>
                    <th className="border p-1">Vr. Fatura</th>
                    <th className="border p-1">Nosso Número</th>
                    <th className="border p-1">Integração</th>
                  </tr>
                </thead>
                <tbody>
                  {listaFaturas.map((fat) => (
                    <tr
                      key={fat.id}
                      className="hover:bg-green-100 cursor-pointer"
                      onDoubleClick={() => handleSelecionarFatura(fat)}
                    >
                      <td className="border p-1 text-center">{fat.empresa}</td>
                      <td className="border p-1 text-center">{fat.filial}</td>
                      <td className="border p-1">{fat.clienteFantasia}</td>
                      <td className="border p-1 text-center">{fat.numero}</td>
                      <td className="border p-1 text-center">{fat.emissao}</td>
                      <td className="border p-1 text-center">
                        {fat.vencimento}
                      </td>
                      <td className="border p-1 text-center">
                        {fat.recebimento}
                      </td>
                      <td className="border p-1 text-right">
                        {formatNumero(fat.valor)}
                      </td>
                      <td className="border p-1 text-center">
                        {fat.nossoNumero}
                      </td>
                      <td className="border p-1 text-center">
                        {fat.integracao}
                      </td>
                    </tr>
                  ))}

                  {listaFaturas.length === 0 && (
                    <tr>
                      <td
                        colSpan={10}
                        className="border p-2 text-center text-gray-500"
                      >
                        Nenhuma fatura localizada. Informe os filtros e clique
                        em Pesquisar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="mt-1 text-[12px] flex justify-between">
                <span>
                  Total de Registros: <strong>{listaFaturas.length}</strong>
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Rodapé */}
      <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">
        {/* Fechar */}
        <button
          onClick={() => navigate(-1)}
          title="Fechar Tela"
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
        >
          <XCircle size={20} />
          <span>Fechar</span>
        </button>

        {/* Limpar */}
        <button
          onClick={handleLimpar}
          title="Limpar Campos"
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
        >
          <RotateCcw size={20} />
          <span>Limpar</span>
        </button>

        {/* Incluir */}
        <button
          onClick={handleConfirmarIncluir}
          title="Incluir Fatura"
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
        >
          <PlusCircle size={20} />
          <span>Incluir</span>
        </button>

        {/* Alterar */}
        <button
          title="Alterar Fatura"
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
        >
          <Edit size={20} />
          <span>Alterar</span>
        </button>

        {/* Excluir */}
        <button
          title="Excluir Fatura"
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
        >
          <Trash2 size={20} />
          <span>Excluir</span>
        </button>

        {/* Documentos da Fatura */}
        <button
          onClick={() => setShowDocs(true)}
          title="Documentos da Fatura"
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
        >
          <FileText size={20} />
          <span>Documentos</span>
        </button>

        {/* Relatório de Rateio */}
        <button
          title="Relatório de Rateio"
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
        >
          <FileSpreadsheet size={20} />
          <span>Rel. Rateio</span>
        </button>

        {/* Alterações Gerais */}
        <div className="relative">
          <button
            onClick={() => setShowAlteracoesMenu((prev) => !prev)}
            title="Alterações Gerais"
            className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
          >
            <Settings size={20} />
            <span>Alterações</span>
          </button>


          {showAlteracoesMenu && (
            <div className="absolute bottom-[44px] left-1/2 -translate-x-1/2 bg-white border border-gray-300 shadow-lg rounded-md text-[12px] min-w-[230px] py-1 z-50">
              {[
                "Desconto",
                "Alterar Vencimento",
                "Trocar Portador",
                "Contestação",
                "Trocar Devedor",
                "Trocar Tipo Fatura",
                "Alterar Valor Total da Fatura",
                "Alterar Data Emissão",
                "Estornar Integração SAP",
              ].map((opt) => (
                <button
                  key={opt}
                  className="w-full text-left px-3 py-[3px] hover:bg-gray-100"
                  onClick={() => {
                    if (opt === "Desconto") {
                      setShowAlteracoesMenu(false);
                      setModalDescontoValues({
                        vrDesconto: valores.vrDesconto,
                        percDesconto: valores.percDesconto,
                      });
                      setShowModalDesconto(true);

                    } else if (opt === "Alterar Valor Total da Fatura") {
                      setShowAlteracoesMenu(false);
                      setModalNovoTotal(valores.totalTitulo);
                      setShowModalAlterarTotal(true);

                    } else {
                      alert(`Opção '${opt}' selecionada (mock).`);
                      setShowAlteracoesMenu(false);
                    }
                  }}


                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Imprimir */}
        <div className="relative">
          <button
            onClick={() => setShowImprimirMenu((prev) => !prev)}
            title="Imprimir"
            className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
          >
            <Printer size={20} />
            <span>Imprimir</span>
          </button>

          {showImprimirMenu && (
            <div className="absolute bottom-[44px] left-1/2 -translate-x-1/2 bg-white border border-gray-300 shadow-lg rounded-md text-[12px] min-w-[180px] py-1 z-50">
              {["Relatório Sintético", "Relatório Analítico"].map((opt) => (
                <button
                  key={opt}
                  className="w-full text-left px-3 py-[3px] hover:bg-gray-100"
                  onClick={() => {
                    navigate("/relatorios/faturamento/fatura", {
                      state: { numeroFatura }
                    });
                    setShowImprimirMenu(false);
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* PDF */}
        <button
          title="Gerar PDF"
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
        >
          <FileDown size={20} />
          <span>PDF</span>
        </button>

        {/* Excel */}
        <button
          title="Exportar Excel"
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
        >
          <FileSpreadsheet size={20} />
          <span>Excel</span>
        </button>

        {/* Word */}
        <button
          title="Exportar Word"
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
        >
          <FileText size={20} />
          <span>Word</span>
        </button>

        {/* Impressão em Lote */}
        <button
          title="Impressão em Lote"
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
        >
          <Copy size={20} />
          <span>Imp. Lote</span>
        </button>
      </div>

      {/* Modal mensagem Incluir */}
      {showMsgIncluir && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-xl w-[360px] p-4">
            <h2 className="text-[14px] font-semibold text-gray-800 mb-3">
              Fatura Incluída
            </h2>
            <p className="text-[13px] mb-4">
              Incluída Fatura Nº{" "}
              <span className="font-bold">{numeroFatura}</span>
            </p>
            <div className="flex justify-end">
              <button
                onClick={handleMsgOk}
                className="px-4 py-1 rounded bg-red-700 text-white text-[13px] hover:bg-red-800"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Documentos da Fatura */}
      {showDocs && (
        <FaturamentoDoc
          numeroFatura={numeroFatura}
          onClose={() => setShowDocs(false)}
          onUpdateTotais={handleUpdateTotais}
        />
      )}

      {/* MODAIS INTERNO */}
      {showModalDesconto && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[360px] rounded-md shadow-xl p-4">

            <h2 className="text-[14px] font-semibold text-gray-800 mb-3">
              Aplicar Desconto
            </h2>

            {/* VR Desconto */}
            <div className="mb-2">
              <Label>Vr. Desconto</Label>
              <Txt
                className="w-full text-right"
                value={modalDescontoValues.vrDesconto}
                onChange={(e) =>
                  setModalDescontoValues(prev => ({
                    ...prev,
                    vrDesconto: e.target.value
                  }))
                }
              />
            </div>

            {/* Perc. Desconto */}
            <div className="mb-4">
              <Label>% Desconto</Label>
              <Txt
                className="w-full text-right"
                value={modalDescontoValues.percDesconto}
                onChange={(e) =>
                  setModalDescontoValues(prev => ({
                    ...prev,
                    percDesconto: e.target.value
                  }))
                }
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 border rounded text-[13px]"
                onClick={() => setShowModalDesconto(false)}
              >
                Cancelar
              </button>

              <button
                className="px-3 py-1 bg-red-700 text-white rounded text-[13px]"
                onClick={handleAplicarDesconto}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}


      {showModalVencimento && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[360px] rounded-md shadow-xl p-4">

            <h2 className="text-[14px] font-semibold text-gray-800 mb-3">
              Alterar Vencimento
            </h2>

            <div className="mb-4">
              <Label>Novo Vencimento</Label>
              <Txt
                type="date"
                className="w-full"
                value={novoVencimento}
                onChange={(e) => setNovoVencimento(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 border rounded text-[13px]"
                onClick={() => setShowModalVencimento(false)}
              >
                Voltar
              </button>

              <button
                className="px-3 py-1 bg-red-700 text-white rounded text-[13px]"
                onClick={handleAlterarVencimento}
              >
                Alterar
              </button>
            </div>
          </div>
        </div>
      )}



      {showModalAlterarTotal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[360px] rounded-md shadow-xl p-4">

            <h2 className="text-[14px] font-semibold text-gray-800 mb-3">
              Alterar Total do Título
            </h2>

            {/* Total Atual */}
            <div className="mb-2">
              <Label>Total do Título</Label>
              <Txt
                className="w-full text-right bg-gray-200"
                readOnly
                value={formatNumero(valores.totalTitulo)}
              />
            </div>

            {/* Novo Total */}
            <div className="mb-4">
              <Label>Novo Total Título</Label>
              <Txt
                className="w-full text-right"
                value={modalNovoTotal}
                onChange={(e) => setModalNovoTotal(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 border rounded text-[13px]"
                onClick={() => setShowModalAlterarTotal(false)}
              >
                Voltar
              </button>

              <button
                className="px-3 py-1 bg-red-700 text-white rounded text-[13px]"
                onClick={handleAlterarTotal}
              >
                Alterar
              </button>
            </div>

          </div>
        </div>
      )}


    </div>
  );
}
