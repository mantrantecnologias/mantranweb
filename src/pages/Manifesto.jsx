import { useEffect, useRef, forwardRef, useState } from "react";
import ManifestoDocs from "./ManifestoDocs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrafficLight } from "@fortawesome/free-solid-svg-icons";
import ConsultaSefazMDFe from "../pages/ConsultaSefazMDFe";
import BaixaManifesto from "../pages/BaixaManifesto";
import PercursoModal from "../pages/PercursoModal";
import ManifestoCargaPerigosa from "../pages/ManifestoCargaPerigosa";
import ManifestoSeguro from "../pages/ManifestoSeguro";
import ManifestoInfoComplementar from "../pages/ManifestoInfoComplementar";
import { useIconColor } from "../context/IconColorContext";
import { useManifestoStore } from "../stores/useManifestoStore";
import InputBuscaCliente from "../components/InputBuscaCliente";
import InputBuscaMotorista from "../components/InputBuscaMotorista";
import InputBuscaVeiculo from "../components/InputBuscaVeiculo";
import InputBuscaCidade from "../components/InputBuscaCidade";
import { maskCNPJ } from "../utils/masks";
import {
  XCircle,
  RotateCcw,
  PlusCircle,
  Edit,
  Trash2,
  Printer,
  Copy,
  Search,
  ChevronUp,
  ChevronDown,
  FileText,
  FileSpreadsheet,
  Download,
  Globe2,
  HelpCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Helpers padrão (iguais ao CTePage.jsx)
function Label({ children, className = "" }) {
  return (
    <label
      className={`text-[12px] text-gray-600 flex items-center justify-end ${className}`}
    >
      {children}
    </label>
  );
}


const Txt = forwardRef(({ className = "", readOnly = false, ...props }, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      readOnly={readOnly}
      className={`
        border border-gray-300 rounded
        px-2 py-[2px] h-[26px] text-[13px]
        ${readOnly ? "bg-gray-100 text-gray-600" : "bg-white"}
        ${className}
      `}
    />
  );
});

const Sel = forwardRef(({ children, className = "", ...rest }, ref) => {
  return (
    <select
      ref={ref}
      {...rest}
      className={`
        border border-gray-300 rounded
        px-2 py-[2px] h-[26px] text-[13px] bg-white
        ${className}
      `}
    >
      {children}
    </select>
  );
});
// Ícone de lápis
function IconeLapis({ onClick, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded w-[24px] h-[22px] flex items-center justify-center"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#555"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-[13px] h-[13px]"
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
      </svg>
    </button>
  );
}

export default function Manifesto({ open }) {
  const navigate = useNavigate();
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  // === ZUSTAND STORE ===
  const {
    dadosManifesto,
    uiState,
    filtros,
    selecionados,
    formKey,
    mockManifestos,

    // Actions
    updateDadosManifesto,
    updateUiState,
    updateFiltros,
    setActiveTab,
    toggleCollapse,
    toggleSelecionado,
    selectAll,
    clearSelection,
    limparFormulario,
    setDadosManifesto,
    setFiltros,
    resetStore,
    carregarManifestoSelecionado,
  } = useManifestoStore();

  // Estado local para controlar exibição da grid de consulta
  const [showGridConsulta, setShowGridConsulta] = useState(false);
  const [resultadosFiltrados, setResultadosFiltrados] = useState([]);

  // Função para aplicar filtros e pesquisar
  const handlePesquisar = () => {
    let resultados = [...mockManifestos];

    // Filtro por Motorista (nome)
    if (filtros.motoristaNome && filtros.motoristaNome.trim() !== "") {
      resultados = resultados.filter(m =>
        m.motorista.toUpperCase().includes(filtros.motoristaNome.toUpperCase())
      );
    }

    // Filtro por Veículo (placa)
    if (filtros.veiculoDesc && filtros.veiculoDesc.trim() !== "") {
      const placaBusca = filtros.veiculoDesc.split(" ")[0].toUpperCase();
      resultados = resultados.filter(m =>
        m.placa.toUpperCase().includes(placaBusca)
      );
    }

    // Filtro por Nº Manifesto
    if (filtros.nrManifestoFiltro && filtros.nrManifestoFiltro.trim() !== "") {
      resultados = resultados.filter(m =>
        m.nrManifesto.includes(filtros.nrManifestoFiltro)
      );
    }

    // Filtro por Nº MDF-e
    if (filtros.nrMdfeFiltro && filtros.nrMdfeFiltro.trim() !== "") {
      resultados = resultados.filter(m =>
        m.nrMdfe.includes(filtros.nrMdfeFiltro)
      );
    }

    // Filtro por Filial
    if (filtros.filialVinculo && filtros.filialVinculo !== "" && !filtros.filialVinculo.startsWith("001")) {
      const filialCod = filtros.filialVinculo.split(" ")[0];
      resultados = resultados.filter(m =>
        m.filial.includes(filialCod)
      );
    }

    setResultadosFiltrados(resultados);
    setShowGridConsulta(true);
  };

  // Destructure uiState para facilitar uso
  const {
    activeTab,
    isPercursoOpen,
    isSeguroOpen,
    isDocsOpen,
    isModalOpen,
    isInfoComplOpen,
    isCargaPerigosaOpen,
    isBaixaOpen,
    isCollapsedFilial,
    isCollapsedConsulta,
    isCollapsedEntregas,
    statusTransito,
  } = uiState;

  const sidebarWidth = open ? "192px" : "56px";

  // === REFS PARA NAVEGAÇÃO ===
  const filialOrigemRef = useRef(null);
  const tipoCargaRef = useRef(null);
  const motoristaRef = useRef(null);
  const tracaoRef = useRef(null);
  const reboqueRef = useRef(null);
  const reboque2Ref = useRef(null);
  const localCargaRef = useRef(null);
  const localDescargaRef = useRef(null);
  const remetenteRef = useRef(null);
  const destinatarioRef = useRef(null);
  const btnIncluirRef = useRef(null);

  // Foco inicial em Filial Origem ao abrir aba manifesto
  useEffect(() => {
    if (activeTab === "manifesto" && filialOrigemRef.current) {
      setTimeout(() => filialOrigemRef.current.focus(), 100);
    }
  }, [activeTab]);

  // Handler para navegar com Enter
  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextRef?.current) {
        nextRef.current.focus();
      }
    }
  };

  // Handlers genéricos
  const handleChange = (field) => (e) => {
    updateDadosManifesto(field, e.target.value);
  };

  const handleUiChange = (field, value) => {
    updateUiState(field, value);
  };

  const handleCheckboxChange = (index) => {
    toggleSelecionado(index);
  };

  const handleStatusTransito = () => {
    const next = statusTransito === "verde"
      ? "amarelo"
      : statusTransito === "amarelo"
        ? "vermelho"
        : "verde";
    updateUiState("statusTransito", next);
  };

  return (
    <div
      key={formKey}
      className="transition-all duration-300 mt-[44px] text-[13px] text-gray-700 bg-gray-50 h-[calc(100vh-56px)] flex flex-col"
    >

      <div
        className={`transition-all duration-300 ${open ? "ml-[192px]" : "ml-[56px]"
          } flex flex-col h-full`}
      >


        {/* Título */}
        <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
          MANIFESTO
        </h1>

        {/* Abas */}
        <div className="flex border-b border-gray-300 bg-white">
          {["manifesto", "consulta", "entregas"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1 text-sm font-medium border-t border-x rounded-t-md ${activeTab === tab
                ? "bg-white text-red-700 border-gray-300"
                : "bg-gray-100 text-gray-600 border-transparent"
                } ${tab !== "manifesto" ? "ml-1" : ""}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 px-3 pt-3 pb-0 bg-white border-x border-b border-gray-200 rounded-b-md overflow-y-auto flex flex-col gap-2">
          {/* ===================== ABA MANIFESTO ===================== */}
          {activeTab === "manifesto" && (
            <>
              {/* CARD 1 - Dados da Filial */}
              <div className="border border-gray-300 rounded bg-white">
                {/* Cabeçalho */}
                <div
                  className="flex justify-between items-center px-3 py-1 bg-gray-50 cursor-pointer select-none rounded-t"
                  onClick={() => toggleCollapse("isCollapsedFilial")}
                >
                  <h2 className="text-red-700 font-semibold text-[13px]">
                    Dados da Filial
                  </h2>
                  {isCollapsedFilial ? (
                    <ChevronDown size={16} className="text-gray-600" />
                  ) : (
                    <ChevronUp size={16} className="text-gray-600" />
                  )}
                </div>

                {/* Conteúdo */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${isCollapsedFilial ? "max-h-[120px]" : "max-h-[1000px]"
                    }`}
                >
                  <div className="px-3 pt-1 pb-3 space-y-2">

                    {/* LINHA 01 */}
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <Label className="col-span-1 justify-end">Nº Manifesto</Label>
                      <Txt className="col-span-1" value={dadosManifesto.nrManifesto} onChange={handleChange("nrManifesto")} />



                      <Label className="col-span-1 justify-end col-start-4">Nº MDF-e</Label>
                      <Txt className="col-span-1" value={dadosManifesto.nrMdfe} onChange={handleChange("nrMdfe")} />

                      <Label className="col-span-1 justify-end">Tp. Manifesto</Label>
                      <div className="col-span-3 flex items-center gap-4">
                        <label className="flex items-center gap-1 text-[12px]">
                          <input
                            type="radio"
                            name="tpManifesto"
                            checked={dadosManifesto.tpManifesto === "coletaEntrega"}
                            onChange={() => updateDadosManifesto("tpManifesto", "coletaEntrega")}
                          />
                          Coleta / Entrega
                        </label>
                        <label className="flex items-center gap-1 text-[12px]">
                          <input
                            type="radio"
                            name="tpManifesto"
                            checked={dadosManifesto.tpManifesto === "transferencia"}
                            onChange={() => updateDadosManifesto("tpManifesto", "transferencia")}
                          />
                          Transferência
                        </label>
                      </div>

                      <div className="col-span-3 flex justify-end">
                        <button
                          className="border border-gray-300 rounded px-3 py-[2px] text-[12px] flex items-center gap-1 hover:bg-gray-100"
                        >
                          <i className="fa-solid fa-paper-plane text-red-600"></i>
                          Enviar MDF-e
                        </button>
                      </div>
                    </div>

                    {/* LINHA 02 */}
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <Label className="col-span-1 justify-end">Empresa</Label>
                      <Sel className="col-span-4 w-full" value={dadosManifesto.empresa} onChange={handleChange("empresa")}>
                        <option>001 - MANTRAN TRANSPORTES LTDA</option>
                      </Sel>

                      <Label className="col-span-1 justify-end">Filial Destino</Label>
                      <Sel className="col-span-4 w-full" value={dadosManifesto.filialDestino} onChange={handleChange("filialDestino")}>
                        <option>001 - TESTE MANTRAN</option>
                      </Sel>

                      <div className="col-span-2 flex justify-end">
                        <button
                          className="border border-gray-300 rounded px-3 py-[2px] text-[12px] flex items-center gap-1 hover:bg-gray-100"
                        >
                          <i className="fa-solid fa-truck text-red-600"></i>
                          Entregas
                        </button>
                      </div>
                    </div>

                    {/* LINHA 03 */}
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <Label className="col-span-1 justify-end">Filial Emitente</Label>
                      <Sel className="col-span-4 w-full" value={dadosManifesto.filialEmitente} onChange={handleChange("filialEmitente")}>
                        <option>001 - TESTE MANTRAN</option>
                      </Sel>

                      <Label className="col-span-1 justify-end">Filial Trânsito</Label>
                      <Sel className="col-span-4 w-full" value={dadosManifesto.filialTransito} onChange={handleChange("filialTransito")}>
                        <option>001 - TESTE MANTRAN</option>
                      </Sel>

                      <div className="col-span-2 flex justify-end">
                        <button
                          onClick={() => handleUiChange("isCargaPerigosaOpen", true)}
                          className="border border-gray-300 rounded px-3 py-[2px] text-[12px] flex items-center gap-1 hover:bg-gray-100"
                        >
                          <i className="fa-solid fa-triangle-exclamation text-yellow-500"></i>
                          Carga Perigosa
                        </button>
                      </div>
                    </div>

                    {/* LINHA 04 */}
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <Label className="col-span-1 justify-end">Nº Lacres</Label>
                      <Txt className="col-span-2" value={dadosManifesto.nrLacres} onChange={handleChange("nrLacres")} />

                      <Label className="col-span-1 justify-end">Cargas Soltas</Label>
                      <Txt className="col-span-1 text-center" value={dadosManifesto.cargasSoltas} onChange={handleChange("cargasSoltas")} />

                      <Label className="col-span-1 justify-end">Acerto Conta</Label>
                      <Txt className="col-span-2 bg-gray-200" readOnly value={dadosManifesto.acertoConta} onChange={handleChange("acertoConta")} />
                      <Label className="col-span-1 justify-end">Data</Label>
                      <Txt className="col-span-1 bg-gray-200" readOnly value={dadosManifesto.dataManifesto} />
                    </div>

                    {/* LINHA 05 */}
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <Label className="col-span-1 justify-end">Observação</Label>
                      <Txt className="col-span-11" value={dadosManifesto.observacao} onChange={handleChange("observacao")} />
                    </div>

                    {/* LINHA 06 */}
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <Label className="col-span-1 justify-end">Chave MDF-e</Label>
                      <Txt className="col-span-5 bg-gray-200" readOnly value={dadosManifesto.chaveMdfe} onChange={handleChange("chaveMdfe")} />

                      <Label className="col-span-1 justify-end">Protocolo</Label>
                      <Txt className="col-span-2 bg-gray-200" readOnly value={dadosManifesto.protocolo} onChange={handleChange("protocolo")} />

                      <Label className="col-span-1 justify-end">Status</Label>
                      <Txt className="col-span-2 bg-gray-200" readOnly value={dadosManifesto.status} onChange={handleChange("status")} />
                    </div>

                  </div>
                </div>
              </div>




              {/* CARD 2 - Dados da Viagem */}
              <div className="border border-gray-300 rounded bg-white">
                {/* Cabeçalho */}
                <div className="flex justify-between items-center px-3 py-1 bg-gray-50 rounded-t">
                  <h2 className="text-red-700 font-semibold text-[13px]">
                    Dados da Viagem
                  </h2>
                </div>

                {/* Conteúdo */}
                <div className="px-3 pt-1 pb-3 space-y-2">

                  {/* LINHA 1 */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 justify-end">Filial Origem</Label>
                    <Sel
                      ref={filialOrigemRef}
                      className="col-span-5"
                      value={dadosManifesto.filialOrigem}
                      onChange={handleChange("filialOrigem")}
                      tabIndex={1}
                      onKeyDown={(e) => handleKeyDown(e, tipoCargaRef)}
                    >
                      <option>001 - MANTRAN TECNOLOGIAS LTDA ME</option>
                    </Sel>

                    <Label className="col-span-1  justify-end">Tipo Carga</Label>
                    <Sel
                      ref={tipoCargaRef}
                      className="col-span-2"
                      value={dadosManifesto.tipoCarga}
                      onChange={handleChange("tipoCarga")}
                      tabIndex={2}
                      onKeyDown={(e) => handleKeyDown(e, motoristaRef)}
                    >
                      <option>0 - FECHADA</option>
                      <option>1 - FRACIONADA</option>
                    </Sel>

                    <Label className="col-span-2 justify-end">Nº Viagem</Label>
                    <Txt className="col-span-1 bg-gray-200" readOnly value={dadosManifesto.nrViagem} />


                  </div>

                  {/* LINHA 2 */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 justify-end">Motorista</Label>

                    {/* Documento + botão + nome */}
                    <div className="col-span-5 flex items-center gap-1 min-w-0">
                      <InputBuscaMotorista
                        ref={motoristaRef}
                        className="w-[120px]"
                        label={null}
                        value={dadosManifesto.motoristaCodigo}
                        onChange={handleChange("motoristaCodigo")}
                        tabIndex={3}
                        onSelect={(mot) => {
                          setDadosManifesto({
                            motoristaCodigo: mot.cnh,
                            motoristaNome: mot.nome,
                            // Auto-preenche veículos do motorista
                            tracaoCodigo: mot.tracaoCodigo || "",
                            tracaoDesc: mot.tracaoDesc || "",
                            reboqueCodigo: mot.reboqueCodigo || "",
                            reboqueDesc: mot.reboqueDesc || ""
                          });
                          // Foca no próximo campo (tabIndex 4 = Tração)
                          setTimeout(() => {
                            const next = document.querySelector('[tabindex="4"]');
                            if (next) next.focus();
                          }, 100);
                        }}
                      />

                      {/* Nome */}
                      <Txt
                        className="flex-1 bg-gray-200"
                        readOnly
                        value={dadosManifesto.motoristaNome}
                      />

                      {/* Ícone pequeno, fora do cálculo */}
                      <button
                        className="border border-gray-300 rounded hover:bg-gray-100 
               h-[26px] w-[30px] flex items-center justify-center shrink-0"
                      >
                        <i className="fa-solid fa-pen text-red-600 text-[12px]"></i>
                      </button>
                    </div>


                    <Label className="col-span-1 justify-end">Prev. Entrega</Label>
                    <Txt type="date" className="col-span-2" value={dadosManifesto.prevEntrega} onChange={handleChange("prevEntrega")} />

                    <Label className="col-span-2 justify-end">Km Atual</Label>
                    <Txt className="col-span-1 text-center" value={dadosManifesto.kmAtual} onChange={handleChange("kmAtual")} />
                  </div>

                  {/* LINHA 3 */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 justify-end">Tração</Label>

                    <div className="col-span-5 flex items-center gap-1 min-w-0">
                      <InputBuscaVeiculo
                        ref={tracaoRef}
                        className="w-[120px]"
                        label={null}
                        tipoUtilizacao="T"
                        value={dadosManifesto.tracaoCodigo}
                        onChange={handleChange("tracaoCodigo")}
                        tabIndex={4}
                        onSelect={(v) => {
                          setDadosManifesto({
                            tracaoCodigo: v.codigo,
                            tracaoDesc: `${v.placa} - ${v.modelo} - ${v.classe}`
                          });
                          setTimeout(() => {
                            const next = document.querySelector('[tabindex="5"]');
                            if (next) next.focus();
                          }, 100);
                        }}
                      />

                      {/* Nome */}
                      <Txt
                        className="flex-1 bg-gray-200"
                        readOnly
                        value={dadosManifesto.tracaoDesc}
                      />

                      {/* Ícone pequeno, fora do cálculo */}
                      <button
                        className="border border-gray-300 rounded hover:bg-gray-100 
               h-[26px] w-[30px] flex items-center justify-center shrink-0"
                      >
                        <i className="fa-solid fa-pen text-red-600 text-[12px]"></i>
                      </button>
                    </div>

                    <Label className="col-span-1 justify-end">Capacidade</Label>
                    <div className="col-span-2 flex items-center gap-1 min-w-0">
                      {/* Campo */}
                      <Txt
                        className="flex-1 min-w-0 text-center"
                        value={dadosManifesto.capacidade}
                        onChange={handleChange("capacidade")}
                      />

                      {/* Unidade fixa */}
                      <span className="text-[12px] text-gray-600 shrink-0">
                        Kg
                      </span>
                    </div>


                    <Label className="col-span-2 justify-end">Km Início</Label>
                    <Txt className="col-span-1 text-center" value={dadosManifesto.kmInicio} onChange={handleChange("kmInicio")} />
                  </div>

                  {/* LINHA 4 */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 justify-end">Reboque</Label>

                    <div className="col-span-5 flex items-center gap-1 min-w-0">
                      <InputBuscaVeiculo
                        ref={reboqueRef}
                        className="w-[120px]"
                        label={null}
                        tipoUtilizacao="R"
                        value={dadosManifesto.reboqueCodigo}
                        onChange={handleChange("reboqueCodigo")}
                        tabIndex={5}
                        onSelect={(v) => {
                          setDadosManifesto({
                            reboqueCodigo: v.codigo,
                            reboqueDesc: `${v.placa} - ${v.modelo} - ${v.classe}`
                          });
                          setTimeout(() => {
                            const next = document.querySelector('[tabindex="6"]');
                            if (next) next.focus();
                          }, 100);
                        }}
                      />

                      {/* Descrição */}
                      <Txt
                        className="flex-1 bg-gray-200"
                        readOnly
                        value={dadosManifesto.reboqueDesc}
                      />

                      {/* Ícone fixo (fora do cálculo de largura) */}
                      <button
                        className="border border-gray-300 rounded hover:bg-gray-100
               h-[26px] w-[30px] flex items-center justify-center shrink-0"
                      >
                        <i className="fa-solid fa-pen text-red-600 text-[12px]"></i>
                      </button>
                    </div>

                    <Label className="col-span-1 justify-end">Frete Combinado</Label>
                    <div className="col-span-2 flex items-center gap-1 min-w-0">
                      {/* Campo */}
                      <Txt className="flex-1 min-w-0" value={dadosManifesto.freteCombinado} onChange={handleChange("freteCombinado")} />

                      {/* Ícone fixo */}
                      <button
                        className="border border-gray-300 rounded hover:bg-gray-100
               h-[26px] w-[30px] flex items-center justify-center shrink-0"
                      >
                        <i className="fa-solid fa-pen text-orange-500 text-[12px]"></i>
                      </button>
                    </div>


                    <Label className="col-span-2 justify-end">Km Final</Label>
                    <Txt className="col-span-1 text-center" value={dadosManifesto.kmFinal} onChange={handleChange("kmFinal")} />
                  </div>

                  {/* LINHA 5 */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 justify-end">Reboque 2</Label>

                    <div className="col-span-5 flex items-center gap-1 min-w-0">
                      <InputBuscaVeiculo
                        ref={reboque2Ref}
                        className="w-[120px]"
                        label={null}
                        tipoUtilizacao="R"
                        value={dadosManifesto.reboque2Codigo}
                        onChange={handleChange("reboque2Codigo")}
                        tabIndex={6}
                        onSelect={(v) => {
                          setDadosManifesto({
                            reboque2Codigo: v.codigo,
                            reboque2Desc: `${v.placa} - ${v.modelo} - ${v.classe}`
                          });
                          setTimeout(() => {
                            const next = document.querySelector('[tabindex="7"]');
                            if (next) next.focus();
                          }, 100);
                        }}
                      />

                      {/* Descrição */}
                      <Txt
                        className="flex-1 bg-gray-200"
                        readOnly
                        value={dadosManifesto.reboque2Desc}
                      />

                      {/* Ícone fixo */}
                      <button
                        className="border border-gray-300 rounded hover:bg-gray-100
               h-[26px] w-[30px] flex items-center justify-center shrink-0"
                      >
                        <i className="fa-solid fa-pen text-red-600 text-[12px]"></i>
                      </button>
                    </div>


                    <Label className="col-span-1 justify-end">Tab. Agregado</Label>
                    <div className="col-span-5 flex items-center gap-1">
                      <Txt className="flex-1" value={dadosManifesto.tabAgregado} onChange={handleChange("tabAgregado")} />
                      <button className="border border-gray-300 rounded hover:bg-gray-100 h-[26px] flex items-center justify-center">
                        <i className="fa-solid fa-dollar-sign text-green-600 text-[12px]"></i>
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              <fieldset className="border border-gray-300 rounded px-3 pt-1 pb-3 bg-white">
                <legend className="px-2 text-red-700 font-semibold text-[13px]">
                  Informações Complementares
                </legend>

                {/* LINHA 01 — LOCAL CARGA + AÇÕES */}
                <div className="grid grid-cols-12 gap-2 mb-2">
                  <Label className="col-span-1">Local Carga</Label>

                  <InputBuscaCidade
                    label={null}
                    className="col-span-2"
                    value={dadosManifesto.localCargaCep}
                    onChange={handleChange("localCargaCep")}
                    tabIndex={7}
                    placeholder="Cidade ou CEP"
                    onSelect={(cid) => {
                      setDadosManifesto({
                        localCargaCep: cid.cep,
                        localCargaCidade: cid.nome,
                        localCargaUf: cid.uf
                      });
                      setTimeout(() => {
                        const next = document.querySelector('[tabindex="8"]');
                        if (next) next.focus();
                      }, 100);
                    }}
                  />

                  <Txt
                    className="col-span-5 bg-gray-200"
                    readOnly
                    value={dadosManifesto.localCargaCidade}
                    tabIndex={-1}
                  />

                  <Txt
                    className="col-span-1 text-center bg-gray-200"
                    readOnly
                    value={dadosManifesto.localCargaUf}
                    tabIndex={-1}
                  />

                  {/* Botões */}
                  <div className="col-span-3 flex justify-end gap-2">
                    <button
                      title="Percurso"
                      onClick={() => handleUiChange("isPercursoOpen", true)}
                      className="border border-gray-300 rounded hover:bg-gray-100
                   px-3 h-[26px] flex items-center gap-1 text-[12px]"
                    >
                      <i className="fa-solid fa-route text-green-600"></i>
                      Percurso
                    </button>

                    <button
                      title="Seguro"
                      onClick={() => handleUiChange("isSeguroOpen", true)}
                      className="border border-gray-300 rounded hover:bg-gray-100
                   px-3 h-[26px] flex items-center gap-1 text-[12px]"
                    >
                      <i className="fa-solid fa-shield-halved text-orange-500"></i>
                      Seguro
                    </button>

                    <button
                      title="Informações Complementares"
                      onClick={() => handleUiChange("isInfoComplOpen", true)}
                      className="border border-gray-300 rounded hover:bg-gray-100
                   px-3 h-[26px] flex items-center gap-1 text-[12px]"
                    >
                      <i className="fa-solid fa-circle-info text-blue-500"></i>
                      Info. Compl.
                    </button>
                  </div>
                </div>

                {/* LINHA 02 — LOCAL DESCARGA / ROTA / DISTÂNCIA */}
                <div className="grid grid-cols-12 gap-2 mb-2">
                  <Label className="col-span-1">Local Descarga</Label>

                  <InputBuscaCidade
                    label={null}
                    className="col-span-2"
                    value={dadosManifesto.localDescargaCep}
                    onChange={handleChange("localDescargaCep")}
                    tabIndex={8}
                    placeholder="Cidade ou CEP"
                    onSelect={(cid) => {
                      setDadosManifesto({
                        localDescargaCep: cid.cep,
                        localDescargaCidade: cid.nome,
                        localDescargaUf: cid.uf
                      });
                      setTimeout(() => {
                        const next = document.querySelector('[tabindex="9"]');
                        if (next) next.focus();
                      }, 100);
                    }}
                  />

                  <Txt
                    className="col-span-5 bg-gray-200"
                    readOnly
                    value={dadosManifesto.localDescargaCidade}
                    tabIndex={-1}
                  />

                  <Txt
                    className="col-span-1 text-center bg-gray-200"
                    readOnly
                    value={dadosManifesto.localDescargaUf}
                    tabIndex={-1}
                  />

                  <Label className="col-span-1">Rota</Label>

                  <Sel className="col-span-2 w-full" value={dadosManifesto.rota} onChange={handleChange("rota")}>
                    <option>SP x BA</option>
                  </Sel>
                </div>

                {/* LINHA 03 — REMETENTE */}
                <div className="grid grid-cols-12 gap-2 mb-2">
                  <Label className="col-span-1">Remetente</Label>

                  <InputBuscaCliente
                    ref={remetenteRef}
                    className="col-span-2"
                    label={null}
                    value={dadosManifesto.remetenteCodigo}
                    onChange={handleChange("remetenteCodigo")}
                    tabIndex={9}
                    onSelect={(emp) => {
                      setDadosManifesto({
                        remetenteCodigo: maskCNPJ(emp.cnpj),
                        remetenteRazao: emp.razao,
                        // Preenche Local Carga com dados do Remetente
                        localCargaCep: emp.cep || "",
                        localCargaCidade: emp.cidade || "",
                        localCargaUf: emp.uf || ""
                      });
                      setTimeout(() => {
                        const next = document.querySelector('[tabindex="10"]');
                        if (next) next.focus();
                      }, 100);
                    }}
                  />

                  <Txt
                    className="col-span-8 bg-gray-200"
                    readOnly
                    value={dadosManifesto.remetenteRazao}
                  />

                  <button
                    title="Editar Remetente"
                    className="col-span-1 border border-gray-300 rounded hover:bg-gray-100
                 h-[26px] flex items-center justify-center"
                  >
                    <i className="fa-solid fa-pen text-red-600 text-[12px]"></i>
                  </button>
                </div>

                {/* LINHA 04 — DESTINATÁRIO */}
                <div className="grid grid-cols-12 gap-2">
                  <Label className="col-span-1">Destinatário</Label>

                  <InputBuscaCliente
                    ref={destinatarioRef}
                    className="col-span-2"
                    label={null}
                    value={dadosManifesto.destinatarioCodigo}
                    onChange={handleChange("destinatarioCodigo")}
                    tabIndex={10}
                    onSelect={(emp) => {
                      setDadosManifesto({
                        destinatarioCodigo: maskCNPJ(emp.cnpj),
                        destinatarioRazao: emp.razao,
                        // Preenche Local Descarga com dados do Destinatário
                        localDescargaCep: emp.cep || "",
                        localDescargaCidade: emp.cidade || "",
                        localDescargaUf: emp.uf || ""
                      });
                      setTimeout(() => {
                        const next = document.querySelector('[tabindex="11"]');
                        if (next) next.focus();
                      }, 100);
                    }}
                  />

                  <Txt
                    className="col-span-8 bg-gray-200"
                    readOnly
                    value={dadosManifesto.destinatarioRazao}
                  />

                  <button
                    title="Editar Destinatário"
                    className="col-span-1 border border-gray-300 rounded hover:bg-gray-100
                 h-[26px] flex items-center justify-center"
                  >
                    <i className="fa-solid fa-pen text-red-600 text-[12px]"></i>
                  </button>
                </div>
              </fieldset>


              {/* CARD 4 - Averbação */}
              <div className="border border-gray-300 rounded px-3 pt-1 pb-3 bg-white">
                <div className="grid grid-cols-12 gap-2 items-center mb-2">
                  <Label className="col-span-1">Cadastro</Label>

                  <Txt
                    type="date"
                    className="col-span-2 bg-gray-200"
                    readOnly
                    value={dadosManifesto.dataCadastro}
                    onChange={handleChange("dataCadastro")}
                  />

                  <Label className="col-span-2">Usuário</Label>

                  <Txt
                    className="col-span-2 bg-gray-200"
                    readOnly
                    value={dadosManifesto.usuario}
                  />

                  <Label className="col-span-2">Protocolo</Label>

                  <Txt
                    className="col-span-3 bg-gray-200"
                    readOnly
                    value={dadosManifesto.protocoloAverbacao}
                  />
                </div>

                {/* Linha de Averbação */}
                <p className="text-[12px] text-green-900 bg-green-200 py-1 px-2 text-center rounded">
                  Averbado em{" "}
                  <span className="font-semibold">15/10/2025</span>{" "}
                  com o Nº Averbação:{" "}
                  <span className="font-mono">
                    06513102504086140001415700100005880134
                  </span>{" "}
                  e Protocolo:{" "}
                  <span className="font-semibold">TESTE</span>
                </p>
              </div>








            </>
          )}

          {/* ===================== ABA CONSULTA ===================== */}
          {activeTab === "consulta" && (
            <>
              {/* CARD 1 - Filtro de Pesquisa (Expansível) */}
              <div className="border border-gray-300 rounded bg-white">
                {/* Cabeçalho */}
                <div
                  className="flex justify-between items-center px-3 py-1 bg-gray-50 cursor-pointer select-none rounded-t"
                  onClick={() => toggleCollapse("isCollapsedConsulta")}
                >
                  <h2 className="text-red-700 font-semibold text-[13px]">
                    Filtro de Pesquisa
                  </h2>
                  {isCollapsedConsulta ? (
                    <ChevronDown size={18} className="text-gray-600" />
                  ) : (
                    <ChevronUp size={18} className="text-gray-600" />
                  )}
                </div>

                {/* Conteúdo */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${isCollapsedConsulta ? "max-h-[40px]" : "max-h-[800px]"
                    }`}
                >
                  <div className="px-3 pt-1 pb-3 space-y-2">

                    {/* LINHA 01 */}
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <Label className="col-span-1">Filial Vínculo</Label>
                      <Sel className="col-span-5 w-full" value={filtros.filialVinculo} onChange={(e) => updateFiltros("filialVinculo", e.target.value)}>
                        <option>001 - MANTRAN TECNOLOGIAS LTDA ME</option>
                        <option>002 - MANTRAN TECNOLOGIAS FILIAL 002</option>
                      </Sel>

                      <Label className="col-span-1">Ocorrência</Label>
                      <Sel className="col-span-5 w-full" value={filtros.ocorrencia} onChange={(e) => updateFiltros("ocorrencia", e.target.value)}>
                        <option>Todos</option>
                        <option>Manifesto Baixado</option>
                        <option>Encerrado</option>
                      </Sel>
                    </div>

                    <div className="grid grid-cols-12 gap-2 items-center">
                      <Label className="col-span-1">Veículo</Label>

                      <InputBuscaVeiculo
                        className="col-span-1"
                        label={null}
                        tipoUtilizacao="T"
                        value={filtros.veiculoCodigo}
                        onChange={(e) => updateFiltros("veiculoCodigo", e.target.value)}
                        onSelect={(v) => setFiltros({
                          veiculoCodigo: v.codigo,
                          veiculoDesc: `${v.placa} - ${v.modelo} - ${v.classe}`
                        })}
                      />

                      <Txt
                        className="col-span-4 bg-gray-200"
                        readOnly
                        placeholder="Descrição / Placa"
                        value={filtros.veiculoDesc}
                      />

                      <Label className="col-span-1">Motorista</Label>

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

                      {/* Nome — NÃO EDITÁVEL */}
                      <Txt
                        className="col-span-3 bg-gray-200"
                        readOnly
                        placeholder="Nome do Motorista"
                        value={filtros.motoristaNome}
                      />
                    </div>


                    {/* LINHA 03 */}
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <Label className="col-span-1">Período</Label>
                      <Txt
                        type="date"
                        className="col-span-2"
                        value={filtros.periodoInicio}
                        onChange={(e) => updateFiltros("periodoInicio", e.target.value)}
                      />

                      <Label className="col-span-1 text-center">Até</Label>
                      <Txt
                        type="date"
                        className="col-span-2"
                        value={filtros.periodoFim}
                        onChange={(e) => updateFiltros("periodoFim", e.target.value)}
                      />

                      <Label className="col-span-1">Nº Manifesto</Label>
                      <Txt className="col-span-1" value={filtros.nrManifestoFiltro} onChange={(e) => updateFiltros("nrManifestoFiltro", e.target.value)} />

                      <Label className="col-span-1">Nº MDF-e</Label>
                      <Txt className="col-span-1" value={filtros.nrMdfeFiltro} onChange={(e) => updateFiltros("nrMdfeFiltro", e.target.value)} />
                    </div>

                  </div>
                </div>
              </div>



              {/* CARD 2 - Botões (alinhados à direita) */}
              <div className="border border-gray-300 rounded px-3 pt-1 pb-3 bg-white flex justify-end gap-3">
                <button
                  className="border border-gray-300 rounded px-3 py-1 bg-gray-50 hover:bg-gray-100 flex items-center gap-1 text-sm"
                  title="Imprimir"
                >
                  <Printer size={14} className="text-red-700" /> Imprimir
                </button>

                <button
                  className="border border-gray-300 rounded px-3 py-1 bg-gray-50 hover:bg-gray-100 flex items-center gap-1 text-sm"
                  title="Imprimir CTRB"
                >
                  <FileSpreadsheet size={14} className="text-red-700" /> Imprimir CTRB
                </button>

                <button
                  className="border border-gray-300 rounded px-3 py-1 bg-gray-50 hover:bg-gray-100 flex items-center gap-1 text-sm"
                  title="Baixar Manifesto"
                >
                  <FileText size={14} className="text-red-700" /> Baixar Manif.
                </button>

                <button
                  className="border border-gray-300 rounded px-3 py-1 bg-gray-50 hover:bg-gray-100 flex items-center gap-1 text-sm"
                  title="Pesquisar"
                  onClick={handlePesquisar}
                >
                  <Search size={14} className="text-red-700" /> Pesquisar
                </button>
              </div>


              {/* CARD 3 - Grid */}
              {showGridConsulta && (
                <div className="border border-gray-300 rounded px-3 pt-1 pb-3 bg-white overflow-auto">
                  <table className="min-w-[1400px] text-[12px] border">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        <th className="p-1 border">Sel</th>
                        <th className="p-1 border">Filial</th>
                        <th className="p-1 border">Manifesto</th>
                        <th className="p-1 border">MDFe</th>
                        <th className="p-1 border">Emissão</th>
                        <th className="p-1 border">Placa</th>
                        <th className="p-1 border">Nome</th>
                        <th className="p-1 border">Qtd CTRC</th>
                        <th className="p-1 border">Qtd Vol</th>
                        <th className="p-1 border">Peso Total</th>
                        <th className="p-1 border">VR Frete</th>
                        <th className="p-1 border">Frete Total</th>
                        <th className="p-1 border">Data Baixa</th>
                        <th className="p-1 border">TP Veiculo</th>
                        <th className="p-1 border">Retorno Sefaz</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultadosFiltrados.map((m, idx) => (
                        <tr
                          key={m.id}
                          className={`cursor-pointer hover:bg-gray-50 ${selecionados.includes(m.id) ? "bg-red-50" : ""}`}
                          onDoubleClick={() => carregarManifestoSelecionado(m.id)}
                        >
                          <td className="p-1 border text-center">
                            <input
                              type="checkbox"
                              checked={selecionados.includes(m.id)}
                              onChange={() => handleCheckboxChange(m.id)}
                              className="cursor-pointer accent-red-700"
                            />
                          </td>
                          <td className="p-1 border text-center">{m.filial}</td>
                          <td className="p-1 border text-center">{m.nrManifesto}</td>
                          <td className="p-1 border text-center">{m.nrMdfe}</td>
                          <td className="p-1 border text-center">{m.dataManifesto}</td>
                          <td className="p-1 border text-center">{m.placa}</td>
                          <td className="p-1 border">{m.motorista}</td>
                          <td className="p-1 border text-center">{m.qtdCtrc}</td>
                          <td className="p-1 border text-center">{m.qtdVol}</td>
                          <td className="p-1 border text-right">{m.pesoTotal}</td>
                          <td className="p-1 border text-right">{m.vrFrete}</td>
                          <td className="p-1 border text-right">{m.freteTotal}</td>
                          <td className="p-1 border text-center">{m.dataBaixa}</td>
                          <td className="p-1 border text-center">{m.tpVeiculo}</td>
                          <td className="p-1 border">{m.retornoSefaz}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* CARD 4 - Totais */}
              {showGridConsulta && (
                <div className="border border-gray-300 rounded px-3 pt-1 pb-3 bg-white flex justify-between text-[12px]">
                  <span>Total de Registros: {resultadosFiltrados.length}</span>
                  <span>
                    Total Selecionados:{" "}
                    <span className="text-red-700 font-semibold">{selecionados.length}</span>
                  </span>
                </div>
              )}
            </>
          )}

          {/* ===================== ABA ENTREGAS ===================== */}
          {activeTab === "entregas" && (
            <>
              {/* CARD 1 - Filtro de Entregas (Expansível) */}
              <div className="border border-gray-300 rounded bg-white">
                {/* Cabeçalho */}
                <div
                  className="flex justify-between items-center px-3 py-1 bg-gray-50 cursor-pointer select-none rounded-t"
                  onClick={() => toggleCollapse("isCollapsedEntregas")}
                >
                  <h2 className="text-red-700 font-semibold text-[13px]">
                    Filtro de Entregas
                  </h2>
                  {isCollapsedEntregas ? (
                    <ChevronDown size={18} className="text-gray-600" />
                  ) : (
                    <ChevronUp size={18} className="text-gray-600" />
                  )}
                </div>

                {/* Conteúdo */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${isCollapsedEntregas ? "max-h-[45px]" : "max-h-[800px]"
                    }`}
                >
                  <div className="px-3 pt-1 pb-3 space-y-2">

                    {/* LINHA 01 */}
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <Label className="col-span-1">Filial Vínculo</Label>
                      <Sel className="col-span-5 w-full">
                        <option>001 - MANTRAN TECNOLOGIAS LTDA ME</option>
                        <option>002 - MANTRAN TECNOLOGIAS FILIAL VALINHOS</option>
                      </Sel>

                      <Label className="col-span-2">Ocorrência</Label>
                      <Sel className="col-span-4 w-full">
                        <option>Todos</option>
                        <option>Manifesto Baixado</option>
                        <option>Em Trânsito</option>
                        <option>Entregue</option>
                      </Sel>
                    </div>

                    {/* LINHA 02 */}
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <Label className="col-span-1">Veículo</Label>

                      <InputBuscaVeiculo
                        className="col-span-1"
                        label={null}
                        tipoUtilizacao="T"
                        value={filtros.veiculoCodigoEntregas}
                        onChange={(e) => updateFiltros("veiculoCodigoEntregas", e.target.value)}
                        onSelect={(v) => setFiltros({
                          veiculoCodigoEntregas: v.codigo,
                          veiculoDescEntregas: `${v.placa} - ${v.modelo} - ${v.classe}`
                        })}
                      />

                      {/* Descrição (não editável) */}
                      <Txt
                        className="col-span-4 bg-gray-200"
                        readOnly
                        placeholder="Descrição / Placa"
                        value={filtros.veiculoDescEntregas}
                      />

                      <Label className="col-span-2">Motorista</Label>

                      <InputBuscaMotorista
                        className="col-span-1"
                        label={null}
                        value={filtros.motoristaCnhEntregas}
                        onChange={(e) => updateFiltros("motoristaCnhEntregas", e.target.value)}
                        onSelect={(mot) => setFiltros({
                          motoristaCnhEntregas: mot.cnh,
                          motoristaNomeEntregas: mot.nome
                        })}
                      />

                      {/* Nome (não editável) */}
                      <Txt
                        className="col-span-3 bg-gray-200"
                        readOnly
                        placeholder="Nome do Motorista"
                        value={filtros.motoristaNomeEntregas}
                      />
                    </div>

                    {/* LINHA 03 */}
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <Label className="col-span-1">Período</Label>

                      <Txt
                        type="date"
                        className="col-span-2"
                        defaultValue="2025-10-24"
                      />

                      <Label className="col-span-1 text-center">Até</Label>

                      <Txt
                        type="date"
                        className="col-span-2"
                        defaultValue="2025-10-24"
                      />

                      {/* Espaço vazio para empurrar */}
                      <div className="col-span-2" />

                      {/* Botões à direita */}
                      <div className="col-span-4 flex justify-end gap-2">
                        <button className="border border-gray-300 rounded px-3 py-1 bg-gray-50 hover:bg-gray-100 flex items-center gap-1">
                          <FileText size={14} className="text-red-700" />
                          <span>Rel. Ocorrência</span>
                        </button>

                        <button className="border border-gray-300 rounded px-3 py-1 bg-gray-50 hover:bg-gray-100 flex items-center gap-1">
                          <Search size={14} className="text-red-700" />
                          <span>Pesquisar</span>
                        </button>
                      </div>
                    </div>


                  </div>
                </div>
              </div>





              {/* CARD 3 - Grid */}
              <div className="border border-gray-300 rounded px-3 pt-1 pb-3 bg-white">
                <table className="w-full text-[12px] border">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="p-1 border">Sel</th>
                      <th className="p-1 border">CTe</th>
                      <th className="p-1 border">Destinatário</th>
                      <th className="p-1 border">Cidade</th>
                      <th className="p-1 border">UF</th>
                      <th className="p-1 border">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-1 border text-center">
                        <input type="checkbox" />
                      </td>
                      <td className="p-1 border text-center">002420</td>
                      <td className="p-1 border">HNK BR LOGÍSTICA</td>
                      <td className="p-1 border text-center">SALVADOR</td>
                      <td className="p-1 border text-center">BA</td>
                      <td className="p-1 border text-center">Entregue</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* CARD 4 - Totais */}
              <div className="border border-gray-300 rounded px-3 pt-1 pb-3 bg-white flex justify-between text-[12px]">
                <span>Total de Registros: 1</span>
                <span>Total Selecionados: 0</span>
              </div>
            </>
          )}


        </div> {/* 👈 FECHOU O WRAPPER */}
        {/* RODAPÉ FIXO – PADRÃO MANTRAN */}
        <div
          className="border-t border-gray-300 bg-white"
        >


          {/* CONTAINER INTERNO (alinha com conteúdo) */}
          <div className="flex items-center gap-6 pl-9 pr-0 py-1">




            {/* Fechar */}
            <button
              onClick={() => { resetStore(); navigate(-1); }}
              title="Fechar Tela"
              className={`flex flex-col items-center text-[11px] 
      ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
            >
              <XCircle size={20} />
              <span>Fechar</span>
            </button>

            {/* Limpar */}
            <button
              title="Limpar Campos"
              onClick={limparFormulario}
              className={`flex flex-col items-center text-[11px] 
      ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
            >
              <RotateCcw size={20} />
              <span>Limpar</span>
            </button>

            {/* Incluir */}
            <button
              ref={btnIncluirRef}
              title="Incluir Manifesto"
              tabIndex={11}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  // Executa a ação de inclusão
                  alert("Incluir Manifesto executado!");
                }
              }}
              onClick={() => {
                // Executa a ação de inclusão
                alert("Incluir Manifesto executado!");
              }}
              className={`flex flex-col items-center text-[11px] 
      ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
            >
              <PlusCircle size={20} />
              <span>Incluir</span>
            </button>

            {/* Alterar */}
            <button
              title="Alterar Manifesto"
              className={`flex flex-col items-center text-[11px] 
      ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
            >
              <Edit size={20} />
              <span>Alterar</span>
            </button>

            {/* Excluir */}
            <button
              title="Excluir Manifesto"
              className={`flex flex-col items-center text-[11px] 
      ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
            >
              <Trash2 size={20} />
              <span>Excluir</span>
            </button>

            {/* Imprimir */}
            <button
              title="Imprimir Manifesto"
              className={`flex flex-col items-center text-[11px] 
      ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
            >
              <Printer size={20} />
              <span>Imprimir</span>
            </button>

            {/* Consulta Sefaz */}
            <button
              title="Consulta Sefaz"
              onClick={() => handleUiChange("isModalOpen", true)}
              className={`flex flex-col items-center text-[11px]
      ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
            >
              <Search size={20} />
              <span>Sefaz</span>
            </button>

            {/* Baixar */}
            <button
              title="Baixar Manifesto"
              onClick={() => handleUiChange("isBaixaOpen", true)}
              className={`flex flex-col items-center text-[11px]
      ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
            >
              <Download size={20} />
              <span>Baixar</span>
            </button>

            {/* Docs */}
            <button
              title="Documentos Vinculados"
              onClick={() => handleUiChange("isDocsOpen", true)}
              className={`flex flex-col items-center text-[11px]
      ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
            >
              <FileText size={20} />
              <span>Docs</span>
            </button>

            {/* Trânsito (semaforo) */}
            <button
              title={`Status de Trânsito (${statusTransito.toUpperCase()})`}
              onClick={handleStatusTransito}
              className={`flex flex-col items-center text-[11px]
      ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
            >
              <FontAwesomeIcon
                icon={faTrafficLight}
                className={`text-[18px] ${statusTransito === "verde"
                  ? "text-green-600"
                  : statusTransito === "amarelo"
                    ? "text-yellow-500"
                    : "text-red-600"
                  }`}
              />
              <span>Trânsito</span>
            </button>

            {/* Dúvidas */}
            <button
              title="Ajuda e Dúvidas"
              className={`flex flex-col items-center text-[11px]
      ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
            >
              <HelpCircle size={20} />
              <span>Dúvidas</span>
            </button>

          </div>
        </div>
        {/* === MODAL DE CONSULTA SEFAZ === */}
        {isModalOpen && (
          <ConsultaSefazMDFe onClose={() => handleUiChange("isModalOpen", false)} />
        )}
        {/* === MODAL DE DOCUMENTOS === */}
        {isDocsOpen && <ManifestoDocs onClose={() => handleUiChange("isDocsOpen", false)} />}
        {/* === MODAL DE BAIXA DE MANIFESTO === */}
        {isBaixaOpen && <BaixaManifesto onClose={() => handleUiChange("isBaixaOpen", false)} />}
        {/* === MODAL DE PERCURSO === */}
        {isPercursoOpen && <PercursoModal onClose={() => handleUiChange("isPercursoOpen", false)} />}
        {/* === MODAL DE SEGURO === */}
        {isSeguroOpen && <ManifestoSeguro onClose={() => handleUiChange("isSeguroOpen", false)} />}
        {/* === MODAL DE CARGA PERIGOSA === */}
        {isCargaPerigosaOpen && (
          <ManifestoCargaPerigosa onClose={() => handleUiChange("isCargaPerigosaOpen", false)} />
        )}


        {/* === MODAL DE INFORMAÇÕES COMPLEMENTARES === */}
        {isInfoComplOpen && (
          <ManifestoInfoComplementar onClose={() => handleUiChange("isInfoComplOpen", false)} />
        )}
      </div>


    </div>
  );
}



