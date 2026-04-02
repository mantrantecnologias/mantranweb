import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputBuscaCliente from "../components/InputBuscaCliente";
import InputBuscaMotorista from "../components/InputBuscaMotorista";
import InputBuscaVeiculo from "../components/InputBuscaVeiculo";
import InputBuscaCidade from "../components/InputBuscaCidade";
import InputBuscaCorretora from "../components/InputBuscaCorretora";
import { maskCNPJ, onlyDigits } from "../utils/masks";
import CustosAdicionaisModal from "./CustosAdicionaisModal";
import NotasFiscalModal from "./NotasFiscalModal";
import ValoresCte from "./ValoresCte";
import NotaFiscalCte from "./NotaFiscalCte";
import Comex from "./Comex";
import ConsultaSefazCte from "./ConsultaSefazCte";
import CteComplementar from "./CteComplementar";
import CteSubstituicao from "./CteSubstituicao";
import CteSubcontratado from "./CteSubcontratado";
import { useIconColor } from "../context/IconColorContext";
import { useCTeStore } from "../stores/useCTeStore";

import {
  XCircle,
  RotateCcw,
  PlusCircle,
  Edit,
  Trash2,
  FileText,
  DollarSign,
  Globe2,
  FileSpreadsheet,
  Printer,
  Copy,
  Zap,
  Search,
  Pencil,
} from "lucide-react";


// Helpers simples para consistência
function Label({ children, className = "" }) {
  return (
    <label
      className={`flex items-center text-[12px] text-gray-600 ${className}`}
    >
      {children}
    </label>
  );
}

function Txt(props) {
  return (
    <input
      {...props}
      className={
        "border border-gray-300 rounded px-1 py-[2px] h-[26px] " +
        (props.className || "")
      }
    />
  );
}
function Sel({ children, className = "", ...rest }) {
  return (
    <select
      {...rest}
      className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] ${className}`}
    >
      {children}
    </select>
  );
}

// Ícone lápis reutilizável
function IconeLapis({
  title = "",
  onClick,
  variant = "lapis", // "lapis" | "raio"
}) {
  const isRaio = variant === "raio";

  return (
    <button
      onClick={onClick}
      title={title}
      className={`border border-gray-300 rounded w-[24px] h-[22px] flex items-center justify-center
        ${isRaio ? "bg-yellow-50 hover:bg-yellow-100" : "bg-gray-50 hover:bg-gray-100"}
      `}
    >
      {isRaio ? (
        <Zap size={14} className="text-yellow-600" />
      ) : (
        <Pencil size={14} className="text-gray-600" />
      )}
    </button>
  );
}

function isoToBR(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export default function CTePage({ open }) {
  const navigate = useNavigate();
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  // === ZUSTAND STORE ===
  const {
    dadosCTe,
    filtros,
    uiState,
    listaConsulta,
    dadosFiltrados,
    selecionados,
    cteSelecionado,
    activeTab,
    formKey,

    // Actions
    updateDadosCTe,
    setDadosCTe,
    updateFiltros,
    setFiltros,
    updateUiState,
    setCteSelecionado,
    setSelecionados,
    toggleSelecionado,
    selectAll,
    clearSelection,
    carregarDadosMock,
    setActiveTab,
    limparFormulario,
    incrementFormKey
  } = useCTeStore();

  const controleRef = useRef(null);

  // Destructuring UI State para facilitar uso no JSX
  const {
    showCustos,
    showNotaFiscal,
    showComex,
    showValoresCte,
    showNotaFiscalCte,
    showConsultaSefaz,
    showComplementar,
    showSubstituicao,
    showDocs,
    showPrintMenu,
    showPrintLote,
    loteIni,
    loteFim,
    filialPrint,
    showCheckboxes
  } = uiState;

  const sidebarWidth = open ? "192px" : "56px";

  // Carrega mock se vazio (simula fetch inicial)
  useEffect(() => {
    if (dadosFiltrados.length === 0) {
      carregarDadosMock();
    }
  }, []);

  // Auto-foco no campo Controle ao iniciar/limpar (quando o component remonta via formKey)
  useEffect(() => {
    const firstInput = document.querySelector('[tabindex="1"]');
    if (firstInput) firstInput.focus();
  }, []);

  // === REGRA DE NEGÓCIO: SINCRONIZAÇÃO DE ORIGEM ===
  // Se houver Expedidor, usa os dados dele. Caso contrário, usa do Remetente.
  useEffect(() => {
    if (dadosCTe.expedidorCgc) {
      setDadosCTe({
        origemCidade: dadosCTe.expedidorCidade,
        origemUf: dadosCTe.expedidorUf,
        cepOrigem: dadosCTe.expedidorCep
      });
    } else if (dadosCTe.remetenteCgc) {
      setDadosCTe({
        origemCidade: dadosCTe.remetenteCidade,
        origemUf: dadosCTe.remetenteUf,
        cepOrigem: dadosCTe.remetenteCep
      });
    }

    // --- Sincronização de Entrega ---
    if (dadosCTe.recebedorCgc) {
      setDadosCTe({
        destinoCidade: dadosCTe.recebedorCidade,
        destinoUf: dadosCTe.recebedorUf,
        cepDestinoCalc: dadosCTe.recebedorCep,
        endEntrega: dadosCTe.recebedorEnd,
        bairroEntrega: dadosCTe.recebedorBairro
      });
    } else if (dadosCTe.destinatarioCgc) {
      setDadosCTe({
        destinoCidade: dadosCTe.destinatarioCidade,
        destinoUf: dadosCTe.destinatarioUf,
        cepDestinoCalc: dadosCTe.destinatarioCep,
        endEntrega: dadosCTe.destinatarioEnd,
        bairroEntrega: dadosCTe.destinatarioBairro
      });
    }
  }, [
    dadosCTe.expedidorCgc, dadosCTe.remetenteCgc, dadosCTe.expedidorCidade, dadosCTe.remetenteCidade,
    dadosCTe.recebedorCgc, dadosCTe.destinatarioCgc, dadosCTe.recebedorCidade, dadosCTe.destinatarioCidade,
    dadosCTe.recebedorEnd, dadosCTe.destinatarioEnd
  ]);

  // Handlers genéricos
  const handleChange = (field) => (e) => {
    updateDadosCTe(field, e.target.value);
  };

  const handleParticipanteChange = (prefix) => (e) => {
    const val = e.target.value;
    const updates = { [`${prefix}Cgc`]: val };

    // Se mudou manualmente o código, as informações da seleção anterior perdem a validade
    updates[`${prefix}Razao`] = "";
    updates[`${prefix}Cidade`] = "";
    updates[`${prefix}Uf`] = "";
    if (Object.keys(dadosCTe).includes(`${prefix}Cep`)) updates[`${prefix}Cep`] = "";
    if (Object.keys(dadosCTe).includes(`${prefix}End`)) updates[`${prefix}End`] = "";
    if (Object.keys(dadosCTe).includes(`${prefix}Bairro`)) updates[`${prefix}Bairro`] = "";

    setDadosCTe(updates);
  };

  const handleCodigoChange = (codeField, descField) => (e) => {
    const val = e.target.value;
    setDadosCTe({
      [codeField]: val,
      [descField]: ""
    });
  };

  const handleCidadeChange = (prefix, cepField) => (e) => {
    const val = e.target.value;
    setDadosCTe({
      [`${prefix}Cidade`]: val,
      [`${prefix}Uf`]: "",
      [cepField]: ""
    });
  };

  const focusNextTabIndex = (current) => {
    const next = document.querySelector(`[tabindex="${current + 1}"]`);
    if (next) next.focus();
  };

  const handleEnterAsTab = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      focusNextTabIndex(e.target.tabIndex);
    }
  };

  const handleFiltroChange = (field) => (e) => {
    updateFiltros(field, e.target.value);
  };

  const handleUiChange = (field, value) => {
    updateUiState(field, value);
  };

  const handleLimpar = () => {
    limparFormulario();
    setTimeout(() => {
      const firstInput = document.querySelector('[tabindex="1"]');
      if (firstInput) firstInput.focus();
    }, 100);
  };

  // === Impressão DACTE Sem Valor (Lote) ===
  const handleImprimirLoteDacteSemValor = () => {
    const filial = filialPrint.split(" - ")[0]?.trim();
    const ini = String(loteIni || "").trim();
    const fim = String(loteFim || "").trim();

    if (!filial) {
      alert("Informe a Filial.");
      return;
    }
    if (!ini || !fim) {
      alert("Informe Nº inicial e Nº final.");
      return;
    }

    const onlyDigits = (s) => String(s || "").replace(/\D/g, "");
    const iniD = onlyDigits(ini);
    const fimD = onlyDigits(fim);

    if (!iniD || !fimD) {
      alert("Nº inicial e final devem conter números.");
      return;
    }

    if (Number(fimD) < Number(iniD)) {
      alert("Nº final deve ser maior ou igual ao Nº inicial.");
      return;
    }

    handleUiChange("showPrintLote", false);
    handleUiChange("showPrintMenu", false);

    navigate("/relatorios/operacao/cte-sem-valores", {
      state: {
        filial,
        controleIni: iniD,
        controleFim: fimD,
      },
    });
  };

  const abrirCte = (registro) => {
    setCteSelecionado(registro);
    setDadosCTe(registro);
    setActiveTab("cte");
  };

  const toggleSelecionarTodos = () => {
    if (selecionados.length === dadosFiltrados.length) {
      clearSelection();
    } else {
      selectAll(dadosFiltrados.length);
    }
  };

  const handlePesquisar = () => {
    carregarDadosMock();
  };

  const handleExcluir = () => {
    if (selecionados.length === 0) {
      alert("Selecione pelo menos um CT-e para excluir.");
      return;
    }
    if (window.confirm("Deseja realmente excluir os CT-es selecionados?")) {
      console.log("CT-es excluídos:", selecionados);
      clearSelection();
    }
  };

  const abrirModal = (nome) => {
    if (nome === "custos") handleUiChange("showCustos", true);
    else if (nome === "notaFiscal") handleUiChange("showNotaFiscal", true);
    else if (nome === "controle") alert("Abrir modal de Controle");
    else if (nome === "motorista") alert("Abrir modal de Motorista");
    else if (nome === "tracao") alert("Abrir modal de Tração");
    else if (nome === "reboque") alert("Abrir modal de Reboque");
    else if (nome === "cliente") alert("Abrir modal de Cliente");
    else if (nome === "remetente") alert("Abrir modal de Remetente");
    else if (nome === "destinatario") alert("Abrir modal de Destinatário");
    else if (nome === "expedidor") alert("Abrir modal de Expedidor");
    else if (nome === "recebedor") alert("Abrir modal de Recebedor");
    else if (nome === "seguradora") alert("Abrir modal de Seguradora");
    else console.log("Abrir modal:", nome);
  };

  return (
    <div
      key={formKey}
      className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 bg-gray-50 h-[calc(100vh-56px)] flex flex-col ${open ? "ml-[192px]" : "ml-[56px]"
        }`}
    >
      <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
        CONHECIMENTO
      </h1>

      <div className="flex border-b border-gray-300 bg-white">
        <button
          onClick={() => setActiveTab("cte")}
          className={`px-4 py-1 text-sm font-medium border-t border-x rounded-t-md ${activeTab === "cte"
            ? "bg-white text-red-700 border-gray-300"
            : "bg-gray-100 text-gray-600 border-transparent"
            }`}
        >
          CTe
        </button>
        <button
          onClick={() => setActiveTab("consulta")}
          className={`px-4 py-1 text-sm font-medium border-t border-x rounded-t-md ml-1 ${activeTab === "consulta"
            ? "bg-white text-red-700 border-gray-300"
            : "bg-gray-100 text-gray-600 border-transparent"
            }`}
        >
          Consulta
        </button>
      </div>

      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 overflow-y-auto px-2">

          {activeTab === "cte" ? (
            <>
              <fieldset className="border border-gray-300 rounded px-3 pt-1 pb-3 bg-white space-y-2">

                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1 flex items-center justify-end">Empresa</Label>
                  <Sel className="col-span-3 w-full" value={dadosCTe.filial} onChange={handleChange("filial")} tabIndex={-1}>
                    <option value="002 - RODOVIÁRIO VTA LTDA EPP">002 - RODOVIÁRIO VTA LTDA EPP</option>
                  </Sel>

                  <Label className="col-span-1 flex items-center justify-end">Filial</Label>
                  <Sel
                    className="col-span-3 w-full"
                    value={uiState.filialPrint}
                    onChange={(e) => handleUiChange("filialPrint", e.target.value)}
                    tabIndex={-1}
                  >
                    <option>002 - RODOVIÁRIO VTA LTDA EPP</option>
                  </Sel>

                  <Label className="col-span-1 flex items-center justify-end">Tipo</Label>
                  <Sel
                    className="col-span-1 w-full"
                    value={dadosCTe.tipo}
                    onChange={(e) => {
                      const valor = e.target.value;
                      updateDadosCTe("tipo", valor);
                      if (valor.startsWith("1")) handleUiChange("showComplementar", true);
                      else if (valor.startsWith("3")) handleUiChange("showSubstituicao", true);
                    }}
                    tabIndex={-1}
                  >
                    <option>0 - Normal</option>
                    <option>1 - Complementar</option>
                    <option>3 - Substituição</option>
                    <option>4 - Simplificado</option>
                  </Sel>

                  <Label className="col-span-1 flex items-center justify-end">Controle</Label>

                  <div className="col-span-1 flex items-center gap-1">
                    <Txt
                      className="w-full"
                      value={dadosCTe.controle}
                      onChange={handleChange("controle")}
                      onKeyDown={handleEnterAsTab}
                      tabIndex={1}
                    />
                    <IconeLapis
                      title="Enviar"
                      variant="raio"
                      onClick={() => abrirModal("controle")}
                      tabIndex={-1}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1 justify-end">Data</Label>
                  <Txt
                    type="date"
                    className="col-span-1"
                    value={dadosCTe.data}
                    onChange={handleChange("data")}
                    tabIndex={-1}
                  />

                  <Label className="col-span-1 justify-end">Tipo Carga</Label>
                  <Sel className="col-span-1 w-full" value={dadosCTe.tipoCarga} onChange={handleChange("tipoCarga")} tabIndex={-1}>
                    <option>Fracionada</option>
                    <option>Fechada</option>
                  </Sel>

                  <Label className="col-span-1 justify-end">Coleta</Label>
                  <Txt className="col-span-1" value={dadosCTe.coleta} onChange={handleChange("coleta")} onKeyDown={handleEnterAsTab} tabIndex={2} />

                  <Label className="col-span-1 justify-end">Viagem</Label>
                  <Txt className="col-span-1" value={dadosCTe.viagem} onChange={handleChange("viagem")} onKeyDown={handleEnterAsTab} tabIndex={3} />

                  <Label className="col-span-1 justify-end">Minuta</Label>
                  <Txt className="col-span-1" value={dadosCTe.minuta} onChange={handleChange("minuta")} onKeyDown={handleEnterAsTab} tabIndex={4} />

                  <Label className="col-span-1 justify-end">Nº CTe</Label>

                  <div className="col-span-1 flex items-center gap-1 min-w-0">
                    <Txt
                      className="flex-1 min-w-0"
                      value={cteSelecionado ? cteSelecionado[3] : ""}
                      readOnly
                    />
                    <Txt
                      className="w-[36px] text-center bg-gray-200"
                      readOnly
                      value={dadosCTe.serie}
                      title="Série"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1 justify-end">Motorista</Label>

                  <InputBuscaMotorista
                    className="col-span-1"
                    label={null}
                    value={dadosCTe.motoristaCnh}
                    onChange={handleCodigoChange("motoristaCnh", "motoristaNome")}
                    tabIndex={5}
                    onSelect={(mot) => {
                      const updates = {
                        motoristaCnh: mot.cnh,
                        motoristaNome: mot.nome
                      };

                      // Vínculo automático de veículos
                      if (mot.tracaoCodigo) {
                        updates.tracaoCodigo = mot.tracaoCodigo;
                        updates.tracaoDesc = mot.tracaoDesc;
                      }
                      if (mot.reboqueCodigo) {
                        updates.reboqueCodigo = mot.reboqueCodigo;
                        updates.reboqueDesc = mot.reboqueDesc;
                      }

                      setDadosCTe(updates);
                      focusNextTabIndex(5);
                    }}
                  />

                  <div className="col-span-4 flex items-center gap-1 min-w-0">
                    <Txt
                      className="flex-1 min-w-0 bg-gray-200"
                      readOnly
                      value={dadosCTe.motoristaNome}
                      tabIndex={-1}
                    />
                    <IconeLapis
                      title="Motorista"
                      onClick={() => abrirModal("motorista")}
                      tabIndex={-1}
                    />
                  </div>
                  <Label className="col-span-1 justify-end">Nº Romaneio</Label>
                  <Txt className="col-span-1" value={dadosCTe.romaneio} onChange={handleChange("romaneio")} onKeyDown={handleEnterAsTab} tabIndex={6} />
                  <Label className="col-span-1 justify-end">Veículo Solicit.</Label>
                  <Sel className="col-span-3 w-full" value={dadosCTe.veiculoSolicitado} onChange={handleChange("veiculoSolicitado")} onKeyDown={handleEnterAsTab} tabIndex={7}>
                    <option>3/4</option>
                    <option>Truck</option>
                    <option>Toco</option>
                    <option>Cavalo Mecânico</option>
                    <option>Vuc</option>
                  </Sel>
                </div>

                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1 justify-end">Tração</Label>
                  <InputBuscaVeiculo
                    className="col-span-1"
                    label={null}
                    tipoUtilizacao="T"
                    value={dadosCTe.tracaoCodigo}
                    onChange={handleCodigoChange("tracaoCodigo", "tracaoDesc")}
                    tabIndex={8}
                    onSelect={(v) => {
                      setDadosCTe({
                        tracaoCodigo: v.codigo,
                        tracaoDesc: `${v.placa} - ${v.modelo} - ${v.classe}`
                      });
                      focusNextTabIndex(8);
                    }}
                  />

                  <div className="col-span-4 flex items-center gap-1 min-w-0">
                    <Txt
                      className="flex-1 min-w-0 bg-gray-200"
                      readOnly
                      value={dadosCTe.tracaoDesc}
                      tabIndex={-1}
                    />
                    <IconeLapis
                      title="Tração"
                      onClick={() => abrirModal("tracao")}
                      tabIndex={-1}
                    />
                  </div>

                  <Label className="col-span-1 justify-end">Reboque</Label>
                  <InputBuscaVeiculo
                    className="col-span-1"
                    label={null}
                    tipoUtilizacao="R"
                    value={dadosCTe.reboqueCodigo}
                    onChange={handleCodigoChange("reboqueCodigo", "reboqueDesc")}
                    tabIndex={9}
                    onSelect={(v) => {
                      setDadosCTe({
                        reboqueCodigo: v.codigo,
                        reboqueDesc: `${v.placa} - ${v.modelo} - ${v.classe}`
                      });
                      focusNextTabIndex(9);
                    }}
                  />

                  <div className="col-span-4 flex items-center gap-1 min-w-0">
                    <Txt
                      className="flex-1 min-w-0 bg-gray-200"
                      readOnly
                      value={dadosCTe.reboqueDesc}
                      tabIndex={-1}
                    />
                    <IconeLapis
                      title="Reboque"
                      onClick={() => abrirModal("reboque")}
                      tabIndex={-1}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-2 items-center">
                </div>

              </fieldset>

              <fieldset className="border border-gray-300 rounded px-3 pt-1 pb-3 bg-white">
                <legend className="px-2 text-red-700 font-semibold text-[13px]">
                  Participantes
                </legend>

                <div className="space-y-2 text-[13px]">

                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 justify-end">Cliente</Label>
                    <InputBuscaCliente
                      className="col-span-2"
                      label={null}
                      value={dadosCTe.clienteCgc}
                      onChange={handleParticipanteChange("cliente")}
                      tabIndex={10}
                      onSelect={(emp) => {
                        const updates = {
                          clienteCgc: maskCNPJ(emp.cnpj),
                          clienteRazao: emp.razao,
                          clienteCidade: emp.cidade || "",
                          clienteUf: emp.uf || ""
                        };

                        // Vínculo automático de seguradora
                        if (emp.seguradoraCodigo) {
                          updates.seguradoraCgc = emp.seguradoraCodigo;
                          updates.seguradoraRazao = emp.seguradoraNome;
                        }

                        setDadosCTe(updates);
                        focusNextTabIndex(10);
                      }}
                    />
                    <Txt className="col-span-4 bg-gray-200" value={dadosCTe.clienteRazao} readOnly tabIndex={-1} />
                    <Txt className="col-span-3 bg-gray-200" value={dadosCTe.clienteCidade} readOnly tabIndex={-1} />
                    <Txt className="col-span-1 text-center bg-gray-200" value={dadosCTe.clienteUf} readOnly tabIndex={-1} />
                    <div className="col-span-1 flex justify-center">
                      <button title="Editar Cliente" onClick={() => abrirModal("cliente")} className="border border-gray-300 rounded w-[26px] h-[26px] flex items-center justify-center hover:bg-gray-100" tabIndex={-1}><Edit size={14} /></button>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 justify-end">Remetente</Label>
                    <div className="col-span-2 flex items-center gap-1">
                      <InputBuscaCliente
                        className="flex-1"
                        label={null}
                        value={dadosCTe.remetenteCgc}
                        onChange={handleParticipanteChange("remetente")}
                        tabIndex={11}
                        onSelect={(emp) => {
                          setDadosCTe({
                            remetenteCgc: maskCNPJ(emp.cnpj),
                            remetenteRazao: emp.razao,
                            remetenteCidade: emp.cidade || "",
                            remetenteUf: emp.uf || "",
                            remetenteCep: emp.cep || ""
                          });
                          focusNextTabIndex(11);
                        }}
                      />
                      <button
                        title="Notas Fiscais"
                        onClick={() => abrirModal("notaFiscal")}
                        className="border border-gray-300 rounded w-[26px] h-[26px] flex items-center justify-center hover:bg-gray-100 shrink-0"
                        tabIndex={12}
                      >
                        <FileText size={14} className="text-red-700" />
                      </button>
                    </div>
                    <Txt className="col-span-4 bg-gray-200" value={dadosCTe.remetenteRazao} readOnly tabIndex={-1} />
                    <Txt className="col-span-3 bg-gray-200" value={dadosCTe.remetenteCidade} readOnly tabIndex={-1} />
                    <Txt className="col-span-1 text-center bg-gray-200" value={dadosCTe.remetenteUf} readOnly tabIndex={-1} />
                    <div className="col-span-1 flex justify-center">
                      <button title="Editar Remetente" onClick={() => abrirModal("remetente")} className="border border-gray-300 rounded w-[26px] h-[26px] flex items-center justify-center hover:bg-gray-100" tabIndex={-1}><Edit size={14} /></button>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 justify-end">Destinatário</Label>
                    <InputBuscaCliente
                      className="col-span-2"
                      label={null}
                      value={dadosCTe.destinatarioCgc}
                      onChange={handleParticipanteChange("destinatario")}
                      tabIndex={13}
                      onSelect={(emp) => {
                        setDadosCTe({
                          destinatarioCgc: maskCNPJ(emp.cnpj),
                          destinatarioRazao: emp.razao,
                          destinatarioCidade: emp.cidade || "",
                          destinatarioUf: emp.uf || "",
                          destinatarioCep: emp.cep || "",
                          destinatarioEnd: emp.end || "",
                          destinatarioBairro: emp.bairro || ""
                        });
                        focusNextTabIndex(13);
                      }}
                    />
                    <Txt className="col-span-4 bg-gray-200" value={dadosCTe.destinatarioRazao} readOnly tabIndex={-1} />
                    <Txt className="col-span-3 bg-gray-200" value={dadosCTe.destinatarioCidade} readOnly tabIndex={-1} />
                    <Txt className="col-span-1 text-center bg-gray-200" value={dadosCTe.destinatarioUf} readOnly tabIndex={-1} />
                    <div className="col-span-1 flex justify-center">
                      <button title="Editar Destinatário" onClick={() => abrirModal("destinatario")} className="border border-gray-300 rounded w-[26px] h-[26px] flex items-center justify-center hover:bg-gray-100" tabIndex={-1}><Edit size={14} /></button>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 justify-end">Expedidor</Label>
                    <InputBuscaCliente
                      className="col-span-2"
                      label={null}
                      value={dadosCTe.expedidorCgc}
                      onChange={handleParticipanteChange("expedidor")}
                      tabIndex={14}
                      onSelect={(emp) => {
                        setDadosCTe({
                          expedidorCgc: maskCNPJ(emp.cnpj),
                          expedidorRazao: emp.razao,
                          expedidorCidade: emp.cidade || "",
                          expedidorUf: emp.uf || "",
                          expedidorCep: emp.cep || "",
                          expedidorEnd: emp.end || "",
                          expedidorBairro: emp.bairro || ""
                        });
                        focusNextTabIndex(14);
                      }}
                    />
                    <Txt className="col-span-4 bg-gray-200" value={dadosCTe.expedidorRazao} readOnly tabIndex={-1} />
                    <Txt className="col-span-3 bg-gray-200" value={dadosCTe.expedidorCidade} readOnly tabIndex={-1} />
                    <Txt className="col-span-1 text-center bg-gray-200" value={dadosCTe.expedidorUf} readOnly tabIndex={-1} />
                    <div className="col-span-1 flex justify-center">
                      <button title="Editar Expedidor" onClick={() => abrirModal("expedidor")} className="border border-gray-300 rounded w-[26px] h-[26px] flex items-center justify-center hover:bg-gray-100" tabIndex={-1}><Edit size={14} /></button>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 justify-end">Recebedor</Label>
                    <InputBuscaCliente
                      className="col-span-2"
                      label={null}
                      value={dadosCTe.recebedorCgc}
                      onChange={handleParticipanteChange("recebedor")}
                      tabIndex={15}
                      onSelect={(emp) => {
                        setDadosCTe({
                          recebedorCgc: maskCNPJ(emp.cnpj),
                          recebedorRazao: emp.razao,
                          recebedorCidade: emp.cidade || "",
                          recebedorUf: emp.uf || "",
                          recebedorCep: emp.cep || "",
                          recebedorEnd: emp.end || "",
                          recebedorBairro: emp.bairro || ""
                        });
                        focusNextTabIndex(15);
                      }}
                    />
                    <Txt className="col-span-4 bg-gray-200" value={dadosCTe.recebedorRazao} readOnly tabIndex={-1} />
                    <Txt className="col-span-3 bg-gray-200" value={dadosCTe.recebedorCidade} readOnly tabIndex={-1} />
                    <Txt className="col-span-1 text-center bg-gray-200" value={dadosCTe.recebedorUf} readOnly tabIndex={-1} />
                    <div className="col-span-1 flex justify-center">
                      <button title="Editar Recebedor" onClick={() => abrirModal("recebedor")} className="border border-gray-300 rounded w-[26px] h-[26px] flex items-center justify-center hover:bg-gray-100" tabIndex={-1}><Edit size={14} /></button>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 justify-end">Seguradora</Label>
                    <div className="col-span-2 flex items-center gap-1">
                      <InputBuscaCorretora
                        className="w-full"
                        label={null}
                        value={dadosCTe.seguradoraCgc}
                        onChange={handleCodigoChange("seguradoraCgc", "seguradoraRazao")}
                        tabIndex={16}
                        onSelect={(item) => {
                          setDadosCTe({
                            seguradoraCgc: item.codigo,
                            seguradoraRazao: item.nome
                          });
                          focusNextTabIndex(16);
                        }}
                      />
                    </div>
                    <Txt className="col-span-4 bg-gray-200" value={dadosCTe.seguradoraRazao} readOnly tabIndex={-1} />
                    <Txt className="col-span-3 bg-gray-200" value="" readOnly tabIndex={-1} />
                    <Txt className="col-span-1 text-center bg-gray-200" value="" readOnly tabIndex={-1} />
                    <div className="col-span-1 flex justify-center">
                      <button title="Editar Seguradora" onClick={() => abrirModal("seguradora")} className="border border-gray-300 rounded w-[26px] h-[26px] flex items-center justify-center hover:bg-gray-100" tabIndex={-1}><Edit size={14} /></button>
                    </div>
                  </div>

                </div>
              </fieldset>

              <fieldset className="border border-gray-300 rounded px-3 pt-1 pb-3 bg-white space-y-2">
                <legend className="px-2 text-red-700 font-semibold text-[13px]">
                  Entrega e Modalidade
                </legend>

                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1 justify-end">End. Entrega</Label>
                  <Txt className="col-span-6" value={dadosCTe.endEntrega} onChange={handleChange("endEntrega")} onKeyDown={handleEnterAsTab} tabIndex={17} />

                  <Txt className="col-span-1" value={dadosCTe.numeroEntrega} onChange={handleChange("numeroEntrega")} tabIndex={-1} />

                  <Label className="col-span-1 justify-end">Bairro</Label>
                  <Txt className="col-span-3" value={dadosCTe.bairroEntrega} onChange={handleChange("bairroEntrega")} onKeyDown={handleEnterAsTab} tabIndex={18} />
                </div>

                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1 justify-end">Origem</Label>
                  <InputBuscaCidade
                    className="col-span-2"
                    label={null}
                    value={dadosCTe.origemCidade}
                    onChange={handleCidadeChange("origem", "cepOrigem")}
                    tabIndex={19}
                    onSelect={(cid) => {
                      setDadosCTe({
                        origemCidade: cid.nome,
                        origemUf: cid.uf,
                        cepOrigem: cid.cep
                      });
                      focusNextTabIndex(19);
                    }}
                  />

                  <Txt className="col-span-1 text-center bg-gray-200" readOnly value={dadosCTe.origemUf} tabIndex={-1} />

                  <Label className="col-span-1 justify-end">Cidade Entrega</Label>
                  <InputBuscaCidade
                    className="col-span-2"
                    label={null}
                    value={dadosCTe.destinoCidade}
                    onChange={handleCidadeChange("destino", "cepDestinoCalc")}
                    tabIndex={20}
                    onSelect={(cid) => {
                      setDadosCTe({
                        destinoCidade: cid.nome,
                        destinoUf: cid.uf,
                        cepDestinoCalc: cid.cep
                      });
                      focusNextTabIndex(20);
                    }}
                  />

                  <Txt className="col-span-1 text-center bg-gray-200" readOnly value={dadosCTe.destinoUf} tabIndex={-1} />
                  <Label className="col-span-1 justify-end">Divisão/Loja</Label>
                  <Sel className="col-span-3 w-full" value={dadosCTe.divisaoLoja} onChange={handleChange("divisaoLoja")} onKeyDown={handleEnterAsTab} tabIndex={21}>
                    <option>1054 - Leo Campinas</option>
                    <option>1500 - Leo CD</option>
                  </Sel>
                </div>

                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1 justify-end">Modalidade</Label>
                  <Sel className="col-span-2 w-full" value={dadosCTe.modalidade} onChange={handleChange("modalidade")}>
                    <option>C-CIF</option>
                    <option>F-FOB</option>
                  </Sel>

                  <Label className="col-span-1 justify-end">Tp. Frete</Label>
                  <Sel className="col-span-2 w-full bg-gray-200" disabled value={dadosCTe.tipoFrete}>
                    <option>F - FATURADO</option>
                  </Sel>

                  <Label className="col-span-1 justify-end">Rota</Label>
                  <Sel className="col-span-1 w-full bg-gray-200" disabled>
                    <option></option>
                  </Sel>

                  <Label className="col-span-1 justify-end">Tipo</Label>
                  <Txt
                    className="col-span-1 text-center bg-gray-200"
                    readOnly
                    value={dadosCTe.tipo}
                    tabIndex={-1}
                  />

                  <Label className="col-span-1 justify-end">Situação</Label>
                  <Txt
                    className="col-span-1 bg-gray-200"
                    readOnly
                    value={dadosCTe.situacao}
                    tabIndex={-1}
                  />
                </div>

                <div className="grid grid-cols-12 gap-2 items-center">
                </div>
              </fieldset>

              <fieldset className="border border-gray-300 rounded px-3 pt-1 pb-3 bg-white space-y-2">
                <legend className="px-2 text-red-700 font-semibold text-[13px]">
                  Dados Complementares
                </legend>

                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1 justify-end">Centro Custo</Label>
                  <Sel className="col-span-2 w-full" value={dadosCTe.centroCusto} onChange={handleChange("centroCusto")} onKeyDown={handleEnterAsTab} tabIndex={22}>
                    <option>Operacional</option>
                    <option>Administrativo</option>
                    <option>Financeiro</option>
                    <option>Comercial</option>
                  </Sel>

                  <div className="col-span-1 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="cargaImo"
                      checked={dadosCTe.cargaImo}
                      onChange={(e) => updateDadosCTe("cargaImo", e.target.checked)}
                      className="w-4 h-4 accent-red-700"
                      tabIndex={-1}
                    />
                    <Label htmlFor="cargaImo" className="justify-start">
                      Carga IMO
                    </Label>
                  </div>

                  <div className="col-span-2 flex justify-center">
                    <button
                      onClick={() => handleUiChange("showCustos", true)}
                      className="border border-gray-300 bg-white hover:bg-red-50 text-red-700 rounded px-3 h-[26px] text-[12px]"
                      tabIndex={23}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleUiChange("showCustos", true);
                          focusNextTabIndex(23);
                        }
                      }}
                    >
                      Custos Adicionais
                    </button>
                  </div>

                  <Label className="col-span-1 justify-end">Tab. Frete</Label>
                  <Sel className="col-span-2 w-full" value={dadosCTe.tabFrete} onChange={handleChange("tabFrete")} onKeyDown={handleEnterAsTab} tabIndex={24}>
                    <option>000083 - TESTE HNK</option>
                    <option>000084 - MATRIZ</option>
                    <option>000085 - CLIENTES MG</option>
                  </Sel>
                  <Label className="col-span-1 justify-end">Modal</Label>
                  <Sel className="col-span-2 w-full" value={dadosCTe.modal} onChange={handleChange("modal")} onKeyDown={handleEnterAsTab} tabIndex={25}>
                    <option>01 - Rodoviário</option>
                    <option>02 - Aéreo</option>
                    <option>06 - Multimodal</option>
                  </Sel>
                </div>

                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1 justify-end">CEP Origem</Label>
                  <Txt
                    className="col-span-2 text-center bg-gray-200"
                    readOnly
                    value={dadosCTe.cepOrigem}
                    tabIndex={-1}
                  />

                  <Label className="col-span-1 justify-end">CEP Dest. Cálc</Label>
                  <Txt
                    className="col-span-2 text-center bg-gray-200"
                    readOnly
                    value={dadosCTe.cepDestinoCalc}
                    tabIndex={-1}
                  />

                  <Label className="col-span-1 justify-end">Peso Cálc.</Label>
                  <Txt className="col-span-2 text-center bg-gray-200" readOnly value={dadosCTe.pesoCalc} onChange={handleChange("pesoCalc")} tabIndex={-1} />
                  <Label className="col-span-1 justify-end">Tp. Serviço</Label>

                  <div className="col-span-2 flex items-center gap-2 min-w-0">
                    <Sel
                      className="flex-1 min-w-0"
                      value={dadosCTe.tpServico}
                      onChange={(e) => updateDadosCTe("tpServico", e.target.value.split(" ")[0])}
                      onKeyDown={handleEnterAsTab}
                      tabIndex={26}
                    >
                      <option value="0">0 - Frete Normal</option>
                      <option value="1">1 - Subcontratado</option>
                      <option value="2">2 - Redespacho</option>
                      <option value="3">3 - Redespacho Intermediário</option>
                      <option value="4">4 - Serv. Vinc. Multimodal</option>
                    </Sel>

                    <button
                      onClick={() => handleUiChange("showDocs", true)}
                      disabled={!["1", "2", "3", "4"].includes(dadosCTe.tpServico)}
                      className={`border border-gray-300 rounded px-2 h-[26px] text-[12px] whitespace-nowrap shrink-0
      ${["1", "2", "3", "4"].includes(dadosCTe.tpServico)
                          ? "bg-white hover:bg-red-50 text-red-700"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                      Docs
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1 justify-end">Ocorrência</Label>
                  <Txt className="col-span-2 bg-gray-200" readOnly value={dadosCTe.ocorrencia} onChange={handleChange("ocorrencia")} tabIndex={-1} />

                  <Label className="col-span-1 justify-end">Seguro</Label>
                  <Sel className="col-span-2 w-full" value={dadosCTe.seguro} onChange={handleChange("seguro")} onKeyDown={handleEnterAsTab} tabIndex={27}>
                    <option>4 - Por conta do Emissor CTe</option>
                  </Sel>

                  <Label className="col-span-1 justify-end">Chave CTe</Label>
                  <Txt
                    className="col-span-3 bg-gray-200 text-[12px]"
                    readOnly
                    value={dadosCTe.chaveCte}
                    tabIndex={-1}
                  />

                  <Label className="col-span-1 justify-end">Tarifa</Label>
                  <Txt className="col-span-1 text-center" value={dadosCTe.tarifa} onChange={handleChange("tarifa")} onKeyDown={handleEnterAsTab} tabIndex={28} />
                </div>

                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1 justify-end">Cadastro</Label>
                  <Txt type="date" className="col-span-1 bg-gray-200" readOnly value={dadosCTe.dataCadastro} tabIndex={-1} />

                  <Label className="col-span-1 justify-end">Atualizado</Label>
                  <Txt type="date" className="col-span-1 bg-gray-200" readOnly value={dadosCTe.dataAtualizacao} tabIndex={-1} />

                  <Label className="col-span-1 justify-end">Prev. Entrega</Label>
                  <Txt type="date" className="col-span-1" value={dadosCTe.prevEntrega} onChange={handleChange("prevEntrega")} tabIndex={-1} />

                  <Label className="col-span-1 justify-end">Operador</Label>
                  <Txt
                    className="col-span-1 bg-gray-200"
                    readOnly
                    value={dadosCTe.operador}
                    tabIndex={-1}
                  />

                  <Label className="col-span-1 justify-end">Nº Cotação</Label>
                  <Txt className="col-span-1 bg-gray-200" readOnly value={dadosCTe.numCotacao} tabIndex={-1} />

                  <Label className="col-span-1 justify-end">Nº Fatura</Label>
                  <Txt className="col-span-1 bg-gray-200" readOnly value={dadosCTe.numFatura} tabIndex={-1} />
                </div>
              </fieldset>

              <div className="border border-gray-300 text-green-700 bg-white text-center py-1 px-3 mt-2 text-[12px] font-semibold rounded">
                Averbado em <span className="text-green-700 font-semibold">15/10/2025</span> com o Nº Averbação:{" "}
                <span className="text-green-700 font-semibold">06513102504086140001415700100005880134</span> e Protocolo:{" "}
                <span className="text-green-700 font-semibold">TESTE</span>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col gap-2 p-3 bg-white border-x border-b border-gray-200 rounded-b-md overflow-y-auto">

              <fieldset className="border border-gray-300 rounded px-3 pt-1 pb-3 bg-white space-y-2">
                <legend className="px-2 text-red-700 font-semibold text-[13px]">
                  Parâmetros de Pesquisa
                </legend>

                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1 justify-end">Empresa</Label>
                  <Sel className="col-span-5 w-full">
                    <option>001 - MANTRAN TRANSPORTES LTDA</option>
                  </Sel>

                  <Label className="col-span-1 justify-end">Filial</Label>
                  <Sel className="col-span-5 w-full">
                    <option>001 - TESTE MANTRAN</option>
                  </Sel>
                </div>

                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1 justify-end">Remetente</Label>
                  <InputBuscaCliente
                    className="col-span-2"
                    label={null}
                    value={filtros.remetenteCgc}
                    onChange={handleFiltroChange("remetenteCgc")}
                    onSelect={(emp) => setFiltros({
                      remetenteCgc: maskCNPJ(emp.cnpj),
                      remetenteRazao: emp.razao
                    })}
                  />

                  <Txt
                    className="col-span-3 bg-gray-200"
                    readOnly
                    value={filtros.remetenteRazao}
                    onChange={handleFiltroChange("remetenteRazao")}
                  />

                  <Label className="col-span-1 justify-end">Motorista</Label>
                  <InputBuscaMotorista
                    className="col-span-2"
                    label={null}
                    value={filtros.motoristaCnh}
                    onChange={handleFiltroChange("motoristaCnh")}
                    onSelect={(mot) => setFiltros({
                      motoristaCnh: mot.cnh,
                      motoristaNome: mot.nome
                    })}
                  />

                  <Txt
                    className="col-span-3 bg-gray-200"
                    readOnly
                    value={filtros.motoristaNome}
                    onChange={handleFiltroChange("motoristaNome")}
                  />
                </div>

                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1 justify-end">Destinatário</Label>
                  <InputBuscaCliente
                    className="col-span-2"
                    label={null}
                    value={filtros.destinatarioCgc}
                    onChange={handleFiltroChange("destinatarioCgc")}
                    onSelect={(emp) => setFiltros({
                      destinatarioCgc: maskCNPJ(emp.cnpj),
                      destinatarioRazao: emp.razao
                    })}
                  />

                  <Txt
                    className="col-span-3 bg-gray-200"
                    readOnly
                    value={filtros.destinatarioRazao}
                    onChange={handleFiltroChange("destinatarioRazao")}
                  />

                  <Label className="col-span-1 justify-end">Veículo</Label>
                  <InputBuscaVeiculo
                    className="col-span-2"
                    label={null}
                    tipoUtilizacao="T"
                    value={filtros.veiculoPlaca}
                    onChange={handleFiltroChange("veiculoPlaca")}
                    onSelect={(v) => setFiltros({
                      veiculoPlaca: v.placa,
                      veiculoDesc: `${v.placa} - ${v.modelo} - ${v.classe}`
                    })}
                  />

                  <Txt
                    className="col-span-3 bg-gray-200"
                    readOnly
                    value={filtros.veiculoDesc}
                  />
                </div>

                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1 justify-end">Período</Label>

                  <Txt
                    type="date"
                    className="col-span-2"
                    defaultValue="2025-10-14"
                  />

                  <Txt
                    type="date"
                    className="col-span-1"
                    defaultValue="2025-10-20"
                  />

                  <Label className="col-span-1 justify-end">Data de</Label>

                  <Sel className="col-span-1 w-full">
                    <option>Cadastro</option>
                    <option>Emissão</option>
                    <option>Atualização</option>
                  </Sel>

                  <Label className="col-span-1 justify-end">Nº Controle</Label>
                  <Txt className="col-span-1" />

                  <Label className="col-span-1 justify-end">Nº Impresso</Label>
                  <Txt className="col-span-1" defaultValue="54623" />
                  <Label className="col-span-1 justify-end">Nº Viagem</Label>
                  <Txt className="col-span-1" />
                </div>

                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1 justify-end">Tracking</Label>
                  <Txt className="col-span-2" />
                  <Label className="col-span-2 justify-end">Averbação</Label>
                  <Sel className="col-span-1 w-full">
                    <option>TODOS</option>
                    <option>Sim</option>
                    <option>Não</option>
                  </Sel>
                  <Label className="col-span-1 justify-end">Operador</Label>
                  <Sel className="col-span-2 w-full">
                    <option>TODOS</option>
                  </Sel>

                  <Label className="col-span-2 justify-end">Status</Label>
                  <Sel className="col-span-1 w-full">
                    <option>T - Todos</option>
                    <option>I - Impresso</option>
                    <option>A - Autorizado</option>
                    <option>C - Cancelado</option>
                    <option>E - Rejeitado</option>
                  </Sel>
                </div>

                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-12 flex justify-end gap-2">
                    <button className="border border-gray-300 text-[12px] px-4 py-[2px] rounded bg-gray-50 hover:bg-gray-100">
                      Limpar
                    </button>
                    <button
                      onClick={handlePesquisar}
                      className="border border-gray-300 text-[12px] px-4 py-[2px] rounded bg-blue-50 hover:bg-blue-100 text-blue-700"
                    >
                      Pesquisar
                    </button>
                  </div>
                </div>
              </fieldset>

              <div className="border border-gray-300 rounded p-2 bg-white">
                <h2 className="text-red-700 font-semibold text-[13px] mb-1">
                  Relação de Conhecimentos Emitidos
                </h2>

                <div className="border border-gray-300 rounded overflow-auto">
                  <table className="min-w-full text-[12px] border-collapse">
                    <thead className="bg-gray-100 text-gray-700 border-b border-gray-300">
                      <tr>
                        {showCheckboxes && <th className="px-2 py-1 border-r w-[30px] text-center">✓</th>}
                        <th className="px-2 py-1 border-r">Empresa</th>
                        <th className="px-2 py-1 border-r">Filial</th>
                        <th className="px-2 py-1 border-r">St.</th>
                        <th className="px-2 py-1 border-r">Nº Controle</th>
                        <th className="px-2 py-1 border-r">Nº Impresso</th>
                        <th className="px-2 py-1 border-r">Série</th>
                        <th className="px-2 py-1 border-r">Retorno SEFAZ</th>
                        <th className="px-2 py-1 border-r">Dt. Emissão</th>
                        <th className="px-2 py-1 border-r">Dt. Últ. Atualização</th>
                        <th className="px-2 py-1 border-r">Remetente [Fantasia]</th>
                        <th className="px-2 py-1 border-r">Destinatário [Fantasia]</th>
                        <th className="px-2 py-1 border-r">Endereço Entrega</th>
                        <th className="px-2 py-1">Cidade Entrega</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dadosFiltrados.length === 0 ? (
                        <tr>
                          <td colSpan={14} className="text-center py-4 text-gray-400">
                            Nenhum registro encontrado
                          </td>
                        </tr>
                      ) : (
                        dadosFiltrados.map((r, i) => (
                          <tr
                            key={i}
                            className="hover:bg-gray-50 cursor-pointer"
                            onDoubleClick={() => abrirCte(r)}
                          >
                            {showCheckboxes && (
                              <td className="border-t border-gray-200 px-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={selecionados.includes(i)}
                                  onChange={() => toggleSelecionado(i)}
                                />
                              </td>
                            )}
                            <td className="border-t border-gray-200 px-2 py-[3px]">{r.empresa}</td>
                            <td className="border-t border-gray-200 px-2 py-[3px]">{r.filial}</td>
                            <td className="border-t border-gray-200 px-2 py-[3px]">{r.situacao?.charAt(0)}</td>
                            <td className="border-t border-gray-200 px-2 py-[3px]">{r.controle}</td>
                            <td className="border-t border-gray-200 px-2 py-[3px]">{r.impresso}</td>
                            <td className="border-t border-gray-200 px-2 py-[3px]">{r.serie}</td>
                            <td className="border-t border-gray-200 px-2 py-[3px] truncate max-w-[150px]" title={r.retornoSefaz}>
                              {r.retornoSefaz}
                            </td>
                            <td className="border-t border-gray-200 px-2 py-[3px]">{isoToBR(r.data)}</td>
                            <td className="border-t border-gray-200 px-2 py-[3px]">{isoToBR(r.dataAtualizacao)}</td>
                            <td className="border-t border-gray-200 px-2 py-[3px]">{r.remetenteRazao}</td>
                            <td className="border-t border-gray-200 px-2 py-[3px]">{r.destinatarioRazao}</td>
                            <td className="border-t border-gray-200 px-2 py-[3px]">{r.destinatarioEnd}</td>
                            <td className="border-t border-gray-200 px-2 py-[3px]">{r.destinoCidade}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border border-gray-300 rounded p-2 bg-white flex items-center justify-between text-[12px]">
                <span className="text-gray-600">Total de registros: {dadosFiltrados.length}</span>

                {!showCheckboxes ? (
                  <button
                    onClick={() => handleUiChange("showCheckboxes", true)}
                    className="border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-[2px] rounded"
                  >
                    ⚙️ Ações
                  </button>
                ) : (
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    <button
                      onClick={toggleSelecionarTodos}
                      className="border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 px-2 py-[2px] rounded"
                    >
                      {selecionados.length === dadosFiltrados.length
                        ? "☐ Limpar Seleção"
                        : "☑ Selecionar Todos"}

                    </button>

                    <button className="border border-gray-300 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 px-3 py-[2px] rounded">
                      ✏️ Alterar Status
                    </button>

                    <button
                      onClick={() => {
                        handleUiChange("showCheckboxes", false);
                        clearSelection();
                      }}
                      className="border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-[2px] rounded"
                    >
                      🔙 Cancelar
                    </button>

                    <button className="border border-gray-300 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-[2px] rounded">
                      🔄 Manifestar
                    </button>

                    <button className="border border-gray-300 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-[2px] rounded">
                      📨 Env. Sefaz
                    </button>

                    <button className="border border-gray-300 bg-orange-50 hover:bg-orange-100 text-orange-700 px-3 py-[2px] rounded">
                      🔐 Averbar
                    </button>

                    <button
                      onClick={handleExcluir}
                      className="border border-gray-300 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-[2px] rounded"
                    >
                      ❌ Excluir
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => { limparFormulario(); navigate(-1); }}
              className={`flex flex-col items-center text-[11px] cursor-pointer ${footerIconColorNormal} hover:${footerIconColorHover}`}
            >
              <XCircle size={18} />
              <span>Fechar</span>
            </button>

            <div
              onClick={handleLimpar}
              className={`flex flex-col items-center text-[11px] cursor-pointer ${footerIconColorNormal} hover:${footerIconColorHover}`}
            >
              <RotateCcw size={18} />
              <span>Limpar</span>
            </div>

            <div
              onClick={handleLimpar}
              className={`flex flex-col items-center text-[11px] cursor-pointer ${footerIconColorNormal} hover:${footerIconColorHover}`}
            >
              <PlusCircle size={18} />
              <span>Incluir</span>
            </div>

            <div
              className={`flex flex-col items-center text-[11px] cursor-pointer ${footerIconColorNormal} hover:${footerIconColorHover}`}
            >
              <Edit size={18} />
              <span>Alterar</span>
            </div>

            <div
              className={`flex flex-col items-center text-[11px] cursor-pointer ${footerIconColorNormal} hover:${footerIconColorHover}`}
            >
              <Trash2 size={18} />
              <span>Excluir</span>
            </div>

            <button
              onClick={() => handleUiChange("showNotaFiscalCte", true)}
              className={`flex flex-col items-center text-[11px] cursor-pointer ${footerIconColorNormal} hover:${footerIconColorHover}`}
            >
              <FileText size={18} />
              <span>Nota Fiscal</span>
            </button>

            <button
              onClick={() => handleUiChange("showValoresCte", true)}
              className={`flex flex-col items-center text-[11px] cursor-pointer ${footerIconColorNormal} hover:${footerIconColorHover}`}
            >
              <DollarSign size={18} />
              <span>Valores</span>
            </button>

            <button
              onClick={() => handleUiChange("showComex", true)}
              className={`flex flex-col items-center text-[11px] cursor-pointer ${footerIconColorNormal} hover:${footerIconColorHover}`}
            >
              <Globe2 size={18} />
              <span>Comex</span>
            </button>

            <div
              className={`flex flex-col items-center text-[11px] cursor-pointer ${footerIconColorNormal} hover:${footerIconColorHover}`}
            >
              <FileSpreadsheet size={18} />
              <span>GNRE</span>
            </div>

            <div className="relative">
              {showPrintMenu && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white border border-gray-300 shadow-lg rounded w-48 z-50">
                  <ul className="py-1 text-xs text-gray-700">
                    {[
                      "Espelho CTe",
                      "Dacte Sem Valores",
                      "Etiqueta",
                      "Minuta de Retirada",
                      "Minuta de Devolução",
                    ].map((item, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-left"
                        onClick={() => {
                          handleUiChange("showPrintMenu", false);

                          const controle = dadosCTe.controle;
                          const filial = dadosCTe.filial;

                          if (item === "Espelho CTe") {
                            if (!controle || !filial) {
                              alert("Informe Filial e Controle para imprimir o Espelho do CT-e.");
                              return;
                            }

                            navigate("/relatorios/operacao/cte-espelho", {
                              state: { controle, filial },
                            });
                            return;
                          }

                          if (item === "Dacte Sem Valores") {
                            const filial = filialPrint.split(" - ")[0]?.trim();

                            if (!filial) {
                              alert("Informe a Filial para imprimir o DACTE Sem Valor.");
                              return;
                            }
                            handleUiChange("loteIni", "");
                            handleUiChange("loteFim", "");
                            handleUiChange("showPrintLote", true);
                            return;
                          }
                          console.log("Imprimir:", item, { controle, filial });
                        }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                onClick={() => handleUiChange("showPrintMenu", !showPrintMenu)}
                className={`flex flex-col items-center text-[11px] cursor-pointer ${footerIconColorNormal} hover:${footerIconColorHover}`}
              >
                <Printer size={18} />
                <span>Imprimir</span>
              </button>
            </div>

            <div
              className={`flex flex-col items-center text-[11px] cursor-pointer ${footerIconColorNormal} hover:${footerIconColorHover}`}
            >
              <Copy size={18} />
              <span>Duplicar</span>
            </div>

            <button
              onClick={() => handleUiChange("showConsultaSefaz", true)}
              className={`flex flex-col items-center text-[11px] cursor-pointer ${footerIconColorNormal} hover:${footerIconColorHover}`}
            >
              <Search size={18} />
              <span>Sefaz</span>
            </button>

          </div>
        </div>
      </div>

      {showCustos && <CustosAdicionaisModal onClose={() => handleUiChange("showCustos", false)} />}
      {
        showNotaFiscal && (
          <NotasFiscalModal
            isOpen={showNotaFiscal}
            onClose={() => {
              handleUiChange("showNotaFiscal", false);
              focusNextTabIndex(12);
            }}
          />
        )
      }

      {showComex && <Comex onClose={() => handleUiChange("showComex", false)} />}

      {showValoresCte && <ValoresCte onClose={() => handleUiChange("showValoresCte", false)} />}

      {showNotaFiscalCte && <NotaFiscalCte onClose={() => handleUiChange("showNotaFiscalCte", false)} />}

      {showConsultaSefaz && <ConsultaSefazCte onClose={() => handleUiChange("showConsultaSefaz", false)} />}

      {
        showComplementar && (
          <CteComplementar onClose={() => handleUiChange("showComplementar", false)} />
        )
      }

      {
        showSubstituicao && (
          <CteSubstituicao onClose={() => handleUiChange("showSubstituicao", false)} />
        )
      }
      {
        showPrintLote && (
          <div className="fixed inset-0 z-[80] bg-black/40 flex items-center justify-center p-4">
            <div className="w-full max-w-[720px] bg-white rounded border border-gray-300 shadow-xl overflow-hidden">
              <div className="text-center text-red-700 font-semibold py-2 text-[13px] border-b border-gray-300">
                IMPRESSÃO DE DACTE SEM VALOR
              </div>

              <div className="p-3 bg-gray-50">
                <fieldset className="border border-gray-300 rounded p-3 bg-white">
                  <legend className="px-2 text-gray-700 font-semibold text-[12px]">
                    Parâmetros
                  </legend>

                  <div className="grid grid-cols-12 gap-2 items-center mt-2">
                    <Label className="col-span-5 justify-end">
                      Informe a numeração inicial e final do DACTE:
                    </Label>

                    <Label className="col-span-1 justify-end">Nº Impresso</Label>
                    <Txt
                      className="col-span-2 text-center"
                      value={loteIni}
                      onChange={(e) => handleUiChange("loteIni", e.target.value)}
                      placeholder="000151"
                      maxLength={12}
                    />

                    <Label className="col-span-1 justify-center text-center">Até</Label>
                    <Txt
                      className="col-span-2 text-center"
                      value={loteFim}
                      onChange={(e) => handleUiChange("loteFim", e.target.value)}
                      placeholder="000154"
                      maxLength={12}
                    />

                    <div className="col-span-1" />
                  </div>
                </fieldset>
              </div>

              <div className="border-t border-gray-300 bg-white py-1 px-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleUiChange("showPrintLote", false)}
                    className={`flex flex-col items-center text-[11px] cursor-pointer ${footerIconColorNormal} hover:${footerIconColorHover}`}
                  >
                    <XCircle size={18} />
                    <span>Fechar</span>
                  </button>

                  <button
                    onClick={handleImprimirLoteDacteSemValor}
                    className={`flex flex-col items-center text-[11px] cursor-pointer ${footerIconColorNormal} hover:${footerIconColorHover}`}
                    title="Imprimir"
                  >
                    <Printer size={18} />
                    <span>Imprimir</span>
                  </button>
                </div>

                <div className="text-[11px] text-gray-500">
                  Informe o intervalo para gerar 1 folha por CT-e
                </div>
              </div>
            </div>
          </div>
        )
      }

      {
        showDocs && (
          <CteSubcontratado
            tpServico={dadosCTe.tpServico}
            onClose={() => handleUiChange("showDocs", false)}
          />
        )
      }

    </div >
  );
}
