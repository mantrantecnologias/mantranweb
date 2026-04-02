import { useEffect, useRef } from "react";
import Comex from "./Comex";
import InicioColetaModal from "./InicioColetaModal";
import EncerraColetaModal from "./EncerraColetaModal";
import { useIconColor } from "../context/IconColorContext";
import { useFilial } from "../context/FilialContext";
import { useColetaStore } from "../stores/useColetaStore";

import {
  XCircle,
  RotateCcw,
  PlusCircle,
  Edit,
  Trash2,
  Ban,
  Undo2,
  Send,
  Printer,
  Copy,
  FileText,
  Globe2,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import NotasFiscalModal from "./NotasFiscalModal";
import InputBuscaCliente from "../components/InputBuscaCliente";
import InputBuscaMotorista from "../components/InputBuscaMotorista";
import InputBuscaProduto from "../components/InputBuscaProduto";
import InputBuscaEmbalagem from "../components/InputBuscaEmbalagem";
import { maskCNPJ } from "../utils/masks";

function Label({ children, className = "" }) {
  return (
    <label
      className={`text-[12px] text-gray-600 flex items-center justify-end ${className}`}
    >
      {children}
    </label>
  );
}
function Txt({ className = "", readOnly = false, ...props }) {
  return (
    <input
      {...props}
      readOnly={readOnly}
      tabIndex={readOnly ? -1 : props.tabIndex}
      className={`
        border border-gray-300 rounded
        px-2 py-[2px] h-[26px] text-[13px]
        ${readOnly ? "bg-gray-100 text-gray-600" : "bg-white"}
        ${className}
      `}
    />
  );
}

function Sel({ children, className = "", ...rest }) {
  return (
    <select
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
}


export default function Coleta({ open }) {
  const { filialAtiva } = useFilial();
  const navigate = useNavigate();
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  // === ZUSTAND STORE ===
  const {
    dadosColeta,
    filtros,
    uiState,
    printState,
    selectedColetaNumero,
    confirmAction,
    formKey,

    // Actions
    updateDadosColeta,
    setDadosColeta,
    updateFiltros,
    setFiltros,
    updateUiState,
    updatePrintState,
    setActiveTab,
    toggleCollapse,
    setSelectedColetaNumero,
    setConfirmAction,
    limparFormulario,
    limparFiltros,
    resetStore,
  } = useColetaStore();

  // Destructure para facilitar uso
  const {
    activeTab,
    isCollapsed,
    showModalInicio,
    showModalEncerrar,
    showNotaFiscal,
    showComex,
    showPrintModal,
    showEtiquetaModal,
    modalMsg,
    confirmText,
    selectedStatus,
  } = uiState;

  const {
    printEmpresa,
    printFilial,
    printTipo,
    printNrInicial,
    printNrFinal,
    etqNrInicial,
    etqNrFinal,
  } = printState;

  // Sincroniza filial ativa com o store
  useEffect(() => {
    if (filialAtiva) {
      updateDadosColeta("filial", filialAtiva.codigo);
      updatePrintState("printFilial", filialAtiva.codigo);
    }
  }, [filialAtiva, updateDadosColeta, updatePrintState]);

  // Handlers genéricos
  const handleChange = (field) => (e) => {
    updateDadosColeta(field, e.target.value);
  };

  const handleCheckbox = (field) => (e) => {
    updateDadosColeta(field, e.target.checked);
  };

  const handleFiltroChange = (field) => (e) => {
    updateFiltros(field, e.target.value);
  };

  const handleUiChange = (field, value) => {
    updateUiState(field, value);
  };

  const handlePrintChange = (field) => (e) => {
    updatePrintState(field, e.target.value);
  };

  // === REF PARA NAVEGAÇÃO TAB/ENTER ===
  const pageRef = useRef(null);

  const focusNextTabIndex = (current) => {
    const next = pageRef.current?.querySelector(`[tabindex="${current + 1}"]`);
    if (next) next.focus();
  };

  const handleEnterAsTab = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      focusNextTabIndex(e.target.tabIndex);
    }
  };

  // Handler para o botão Incluir (tabIndex final)
  const handleIncluirKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Aqui você pode adicionar a lógica de inclusão
      console.log("Incluir Coleta acionado via Enter");
      // TODO: Chamar função de inclusão quando implementada
    }
  };

  return (
    <div
      ref={pageRef}
      key={formKey}
      className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 bg-gray-50 h-[calc(100vh-56px)] flex flex-col overflow-y-auto ${open ? "ml-[192px]" : "ml-[56px]"
        }`}
    >
      {/* Título */}
      <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
        CADASTRO DE COLETAS
      </h1>

      {/* Abas */}
      <div className="flex border-b border-gray-300 bg-white">
        <button
          onClick={() => setActiveTab("cadastro")}
          className={`px-4 py-1 text-sm font-medium border-t border-x rounded-t-md ${activeTab === "cadastro"
            ? "bg-white text-red-700 border-gray-300"
            : "bg-gray-100 text-gray-600 border-transparent"
            }`}
        >
          Cadastro
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

      {/* Conteúdo */}
      <div className="flex-1 p-1 bg-white border-x border-b border-gray-200 rounded-b-md flex flex-col gap-1 overflow-y-auto overflow-x-hidden">
        {activeTab === "cadastro" ? (
          <>
            {/* CARD 1 — Dados Principais */}
            <div className="border border-gray-300 rounded p-2 bg-white space-y-2">
              <h2 className="text-red-700 font-semibold text-[13px] mb-1">
                Dados Principais
              </h2>

              {/* LINHA 1 */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-1 text-right">Empresa</Label>
                <Sel className="col-span-5" value={dadosColeta.empresa} onChange={handleChange("empresa")}>
                  <option>001 - MANTRAN TRANSPORTES LTDA</option>
                </Sel>

                <Label className="col-span-1 text-right">Filial</Label>
                <Sel
                  className="col-span-5"
                  value={dadosColeta.filial}
                  disabled
                >
                  {filialAtiva && (
                    <option value={filialAtiva.codigo}>
                      {filialAtiva.codigo} - {filialAtiva.nome}
                    </option>
                  )}
                </Sel>

              </div>

              {/* LINHA 2 */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-1 text-right">Solicitação</Label>
                <Txt type="date" className="col-span-2" value={dadosColeta.dataSolicitacao} onChange={handleChange("dataSolicitacao")} readOnly tabIndex={-1} />


                <Txt type="time" className="col-span-1" value={dadosColeta.horaSolicitacao} onChange={handleChange("horaSolicitacao")} readOnly tabIndex={-1} />

                <Label className="col-span-1 text-right">Nº Solicitação</Label>
                <Txt className="col-span-1" value={dadosColeta.nrSolicitacao} onChange={handleChange("nrSolicitacao")} tabIndex={1} onKeyDown={handleEnterAsTab} />

                <Label className="col-span-1 text-right">Nº Viagem</Label>
                <Txt className="col-span-2" value={dadosColeta.nrViagem} onChange={handleChange("nrViagem")} tabIndex={2} onKeyDown={handleEnterAsTab} />
                <Label className="col-span-1 text-right">Nº Coleta</Label>
                <Txt className="col-span-2 bg-gray-200" readOnly value={dadosColeta.nrColeta} tabIndex={-1} />


              </div>

              {/* LINHA 3 */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-1 text-right">Cadastro</Label>
                <Txt type="date" className="col-span-2" value={dadosColeta.dataCadastro} onChange={handleChange("dataCadastro")} />

                <Label className="col-span-1 text-right">Alteração</Label>
                <Txt type="date" className="col-span-2" value={dadosColeta.dataAlteracao} onChange={handleChange("dataAlteracao")} />

                <Label className="col-span-1 text-right">Status</Label>
                <Txt
                  className="col-span-2 bg-gray-100 text-gray-600"
                  value={dadosColeta.status}
                  readOnly
                />
                <Label className="col-span-1 text-right">Operador</Label>
                <Txt className="col-span-2 bg-gray-200" readOnly value={dadosColeta.operador} />
              </div>

              {/* LINHA 4 */}
              <div className="grid grid-cols-12 gap-2 items-center">
                {/* Motorista (não editável) */}
                <Label className="col-span-1">Motorista</Label>
                <Txt
                  className="col-span-3 bg-gray-200" readOnly
                  value={dadosColeta.motorista}
                  tabIndex={-1}
                />
                {/* Placa (não editável) */}
                <Label className="col-span-1">Placa</Label>
                <Txt
                  className="col-span-1 text-center bg-gray-200" readOnly
                  value={dadosColeta.placa}
                  tabIndex={-1}
                />
                {/* Veículo Solicitado (combo) */}
                <Label className="col-span-1">Veículo Solicit.</Label>
                <Sel className="col-span-2" value={dadosColeta.veiculoSolicitado} onChange={handleChange("veiculoSolicitado")} tabIndex={3} onKeyDown={handleEnterAsTab}>
                  <option>3/4</option>
                  <option>Toco</option>
                  <option>Truck</option>
                  <option>Carreta</option>
                </Sel>



                {/* Divisão (combo) */}
                <Label className="col-span-1">Divisão</Label>
                <Sel className="col-span-2" value={dadosColeta.divisao} onChange={handleChange("divisao")} tabIndex={4} onKeyDown={handleEnterAsTab}>
                  <option>LOGÍSTICA</option>
                  <option>ADMINISTRATIVO</option>
                </Sel>
              </div>

            </div>


            {/* CARD 2 — Participantes */}
            <div className="border border-gray-300 rounded p-2 bg-white space-y-2">
              <h2 className="text-red-700 font-semibold text-[13px] mb-1">
                Participantes
              </h2>

              <div className="space-y-2">

                {/* Solicitante */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1 text-right">Solicitante</Label>
                  <InputBuscaCliente
                    className="col-span-2"
                    label={null}
                    value={dadosColeta.solicitanteCnpj}
                    onChange={handleChange("solicitanteCnpj")}
                    onSelect={(emp) => {
                      setDadosColeta({
                        solicitanteCnpj: maskCNPJ(emp.cnpj),
                        solicitanteRazao: emp.razao,
                        solicitanteCidade: emp.cidade || "",
                        solicitanteUf: emp.uf || ""
                      });
                      focusNextTabIndex(5);
                    }}
                    tabIndex={5}
                  />
                  <Txt className="col-span-5 bg-gray-200" readOnly placeholder="Razão Social" value={dadosColeta.solicitanteRazao} tabIndex={-1} />
                  <Txt className="col-span-3 bg-gray-200" readOnly placeholder="Cidade" value={dadosColeta.solicitanteCidade} tabIndex={-1} />
                  <Txt className="col-span-1 text-center bg-gray-200" readOnly maxLength={2} placeholder="UF" value={dadosColeta.solicitanteUf} tabIndex={-1} />
                </div>

                {/* Remetente */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1 text-right">Remetente</Label>
                  <InputBuscaCliente
                    className="col-span-2"
                    label={null}
                    value={dadosColeta.remetenteCnpj}
                    onChange={handleChange("remetenteCnpj")}
                    onSelect={(emp) => {
                      setDadosColeta({
                        remetenteCnpj: maskCNPJ(emp.cnpj),
                        remetenteRazao: emp.razao,
                        remetenteCidade: emp.cidade || "",
                        remetenteUf: emp.uf || ""
                      });
                      focusNextTabIndex(6);
                    }}
                    tabIndex={6}
                  />
                  <Txt className="col-span-5 bg-gray-200" readOnly placeholder="Razão Social" value={dadosColeta.remetenteRazao} tabIndex={-1} />
                  <Txt className="col-span-3 bg-gray-200" readOnly placeholder="Cidade" value={dadosColeta.remetenteCidade} tabIndex={-1} />
                  <Txt className="col-span-1 text-center bg-gray-200" readOnly maxLength={2} placeholder="UF" value={dadosColeta.remetenteUf} tabIndex={-1} />
                </div>

                {/* Expedidor */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1 text-right">Expedidor</Label>
                  <InputBuscaCliente
                    className="col-span-2"
                    label={null}
                    value={dadosColeta.expedidorCnpj}
                    onChange={handleChange("expedidorCnpj")}
                    onSelect={(emp) => {
                      setDadosColeta({
                        expedidorCnpj: maskCNPJ(emp.cnpj),
                        expedidorRazao: emp.razao,
                        expedidorCidade: emp.cidade || "",
                        expedidorUf: emp.uf || ""
                      });
                      focusNextTabIndex(7);
                    }}
                    tabIndex={7}
                  />
                  <Txt className="col-span-5 bg-gray-200" readOnly placeholder="Razão Social" value={dadosColeta.expedidorRazao} tabIndex={-1} />
                  <Txt className="col-span-3 bg-gray-200" readOnly placeholder="Cidade" value={dadosColeta.expedidorCidade} tabIndex={-1} />
                  <Txt className="col-span-1 text-center bg-gray-200" readOnly maxLength={2} placeholder="UF" value={dadosColeta.expedidorUf} tabIndex={-1} />
                </div>

                {/* Destinatário */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1 text-right">Destinatário</Label>
                  <InputBuscaCliente
                    className="col-span-2"
                    label={null}
                    value={dadosColeta.destinatarioCnpj}
                    onChange={handleChange("destinatarioCnpj")}
                    onSelect={(emp) => {
                      setDadosColeta({
                        destinatarioCnpj: maskCNPJ(emp.cnpj),
                        destinatarioRazao: emp.razao,
                        destinatarioCidade: emp.cidade || "",
                        destinatarioUf: emp.uf || ""
                      });
                      focusNextTabIndex(8);
                    }}
                    tabIndex={8}
                  />
                  <Txt className="col-span-5 bg-gray-200" readOnly placeholder="Razão Social" value={dadosColeta.destinatarioRazao} tabIndex={-1} />
                  <Txt className="col-span-3 bg-gray-200" readOnly placeholder="Cidade" value={dadosColeta.destinatarioCidade} tabIndex={-1} />
                  <Txt className="col-span-1 text-center bg-gray-200" readOnly maxLength={2} placeholder="UF" value={dadosColeta.destinatarioUf} tabIndex={-1} />
                </div>

              </div>
            </div>


            {/* CARD 3 — Detalhes da Coleta */}
            <div className="border border-gray-300 rounded p-2 bg-white space-y-2">
              <h2 className="text-red-700 font-semibold text-[13px] mb-1">
                Detalhes da Coleta
              </h2>

              {/* LINHA 1 — Data / Hora / Restrição / Contato / Funcionamento */}
              <div className="grid grid-cols-12 gap-2 items-center">

                {/* Data */}
                <Label className="col-span-1 text-right">Data</Label>
                <Txt type="date" className="col-span-2" value={dadosColeta.dataColeta} onChange={handleChange("dataColeta")} tabIndex={9} onKeyDown={handleEnterAsTab} />

                {/* Hora */}
                <Txt type="time" className="col-span-1" value={dadosColeta.horaColeta} onChange={handleChange("horaColeta")} tabIndex={10} onKeyDown={handleEnterAsTab} />

                {/* Restrição */}
                <Sel className="col-span-1" value={dadosColeta.restricao} onChange={handleChange("restricao")} tabIndex={11} onKeyDown={handleEnterAsTab}>
                  <option>ATÉ</option>
                  <option>ENTRE</option>
                  <option>DEPOIS</option>
                </Sel>

                {/* Contato */}
                <Label className="col-span-1 text-right">Contato</Label>
                <Txt className="col-span-2" value={dadosColeta.contato} onChange={handleChange("contato")} tabIndex={12} onKeyDown={handleEnterAsTab} />

                {/* Funcionamento */}
                <Label className="col-span-1 text-right">Funcion.</Label>

                <div className="col-span-2 flex items-center gap-1">
                  <Txt className="w-[60px]" value={dadosColeta.funcionamento1} onChange={handleChange("funcionamento1")} tabIndex={-1} />
                  <span className="text-xs">às</span>
                  <Txt className="w-[60px]" value={dadosColeta.funcionamento2} onChange={handleChange("funcionamento2")} tabIndex={-1} />
                  <span className="text-xs">-</span>
                  <Txt className="w-[60px]" value={dadosColeta.funcionamento3} onChange={handleChange("funcionamento3")} tabIndex={-1} />
                  <span className="text-xs">às</span>
                  <Txt className="w-[60px]" value={dadosColeta.funcionamento4} onChange={handleChange("funcionamento4")} tabIndex={-1} />
                </div>

              </div>



              {/* LINHA 2 — Local Entrega */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-1">Local</Label>
                <InputBuscaCliente
                  className="col-span-2"
                  label={null}
                  value={dadosColeta.localCnpj}
                  onChange={handleChange("localCnpj")}
                  onSelect={(emp) => {
                    setDadosColeta({
                      localCnpj: maskCNPJ(emp.cnpj),
                      localRazao: emp.razao,
                      cep: emp.cep || "",
                      cidade: emp.cidade || "",
                      uf: emp.uf || "",
                      bairro: emp.bairro || "",
                      endereco: emp.end || "",
                      numero: emp.numero || "",
                    });
                    focusNextTabIndex(13);
                  }}
                  tabIndex={13}
                />
                <Txt className="col-span-9 bg-gray-200" readOnly placeholder="Razão Social" value={dadosColeta.localRazao} tabIndex={-1} />
              </div>

              {/* LINHA 3 — CEP / Cidade / UF / Bairro */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-1">CEP</Label>
                <Txt className="col-span-2" placeholder="00000-000" value={dadosColeta.cep} onChange={handleChange("cep")} />

                <Label className="col-span-1">Cidade</Label>
                <Txt className="col-span-3" placeholder="Cidade" value={dadosColeta.cidade} onChange={handleChange("cidade")} />

                <Label className="col-span-1">UF</Label>
                <Txt className="col-span-1 text-center bg-gray-200" readOnly maxLength={2} value={dadosColeta.uf} onChange={handleChange("uf")} />

                <Label className="col-span-1">Bairro</Label>
                <Txt className="col-span-2" value={dadosColeta.bairro} onChange={handleChange("bairro")} />
              </div>

              {/* LINHA 4 — Endereço */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-1">Endereço</Label>
                <Txt className="col-span-9" placeholder="Rua / Avenida" value={dadosColeta.endereco} onChange={handleChange("endereco")} />

                <Label className="col-span-1">Nº</Label>
                <Txt className="col-span-1" value={dadosColeta.numero} onChange={handleChange("numero")} />
              </div>

              {/* LINHA 5 — Produto / Embalagem */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-1">Produto</Label>
                <InputBuscaProduto
                  className="col-span-1"
                  label={null}
                  value={dadosColeta.produtoCodigo}
                  onChange={handleChange("produtoCodigo")}
                  onSelect={(prod) => {
                    setDadosColeta({
                      produtoCodigo: prod.codigo,
                      produtoDesc: prod.nome
                    });
                    focusNextTabIndex(14);
                  }}
                  tabIndex={14}
                />
                <Txt className="col-span-4 bg-gray-200" readOnly placeholder="Descrição do Produto" value={dadosColeta.produtoDesc} tabIndex={-1} />

                <Label className="col-span-1">Embal.</Label>
                <InputBuscaEmbalagem
                  className="col-span-1"
                  label={null}
                  value={dadosColeta.embalagemCodigo}
                  onChange={handleChange("embalagemCodigo")}
                  onSelect={(emb) => {
                    setDadosColeta({
                      embalagemCodigo: emb.codigo,
                      embalagemDesc: emb.nome
                    });
                    focusNextTabIndex(15);
                  }}
                  tabIndex={15}
                />
                <Txt className="col-span-4 bg-gray-200" readOnly placeholder="Tipo de Embalagem" value={dadosColeta.embalagemDesc} tabIndex={-1} />
              </div>

              {/* LINHA 7 — Observação */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-1">Obs.</Label>
                <Txt className="col-span-11" placeholder="Observações sobre a coleta" value={dadosColeta.observacao} onChange={handleChange("observacao")} tabIndex={16} onKeyDown={handleEnterAsTab} />
              </div>

              {/* LINHA 8 — Container */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-1">Container</Label>

                <div className="col-span-11 flex items-center gap-4 text-[12px]">
                  <label className="flex items-center gap-1">
                    <input type="checkbox" checked={dadosColeta.cargaImo} onChange={handleCheckbox("cargaImo")} /> Carga IMO
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" checked={dadosColeta.reeferLigado} onChange={handleCheckbox("reeferLigado")} /> Reefer Ligado
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" checked={dadosColeta.padraoAlimento} onChange={handleCheckbox("padraoAlimento")} /> Padrão Alimento
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" checked={dadosColeta.motoristaCheck} onChange={handleCheckbox("motoristaCheck")} /> Motorista
                  </label>
                </div>
              </div>
            </div>

            {/* CARD 4 — Notas Fiscais */}
            <div className="border border-gray-300 rounded p-2 bg-white space-y-2">
              <h2 className="text-red-700 font-semibold text-[13px] mb-1">
                Notas Fiscais
              </h2>

              {/* Agrupar cada label + input em uma coluna */}
              <div className="grid grid-cols-9 gap-3 items-start text-[12px] text-gray-600">
                {/* Qtd NF Inf. + botão */}
                <div className="flex flex-col items-center">
                  <Label>Qtd NF Inf.</Label>
                  <div className="flex items-center gap-1">
                    <Txt className="w-[100px]" value={dadosColeta.qtdNfInf} onChange={handleChange("qtdNfInf")} tabIndex={17} onKeyDown={handleEnterAsTab} />
                    <button
                      title="Nota Fiscal"
                      onClick={() => handleUiChange("showNotaFiscal", true)}
                      className="border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded p-[3px] flex items-center justify-center"
                      tabIndex={-1}
                    >
                      <FileText size={16} className="text-red-700" />
                    </button>
                  </div>
                </div>

                {/* Qtd NF Real */}
                <div className="flex flex-col items-center">
                  <Label>Qtd NF Real</Label>
                  <Txt className="w-[100px] bg-gray-200" readOnly value={dadosColeta.qtdNfReal} onChange={handleChange("qtdNfReal")} tabIndex={-1} />
                </div>

                {/* Peso Inf. */}
                <div className="flex flex-col items-center">
                  <Label>Peso Inf.</Label>
                  <Txt className="w-[100px]" value={dadosColeta.pesoInf} onChange={handleChange("pesoInf")} tabIndex={18} onKeyDown={handleEnterAsTab} />
                </div>

                {/* Peso Real */}
                <div className="flex flex-col items-center">
                  <Label>Peso Real</Label>
                  <Txt className="w-[100px] bg-gray-200" readOnly value={dadosColeta.pesoReal} onChange={handleChange("pesoReal")} tabIndex={-1} />
                </div>

                {/* Vol Inf. */}
                <div className="flex flex-col items-center">
                  <Label>Vol Inf.</Label>
                  <Txt className="w-[100px]" value={dadosColeta.volInf} onChange={handleChange("volInf")} tabIndex={19} onKeyDown={handleEnterAsTab} />
                </div>

                {/* Vol Real */}
                <div className="flex flex-col items-center">
                  <Label>Vol Real</Label>
                  <Txt className="w-[100px] bg-gray-200" readOnly value={dadosColeta.volReal} onChange={handleChange("volReal")} tabIndex={-1} />
                </div>

                {/* Valor Inf. NF's */}
                <div className="flex flex-col items-center">
                  <Label>Valor Inf. NF's</Label>
                  <Txt className="w-[100px]" value={dadosColeta.valorInfNf} onChange={handleChange("valorInfNf")} tabIndex={20} onKeyDown={handleEnterAsTab} />
                </div>

                {/* Valor Real NF's */}
                <div className="flex flex-col items-center">
                  <Label>Valor Real NF's</Label>
                  <Txt className="w-[100px] bg-gray-200" readOnly value={dadosColeta.valorRealNf} onChange={handleChange("valorRealNf")} tabIndex={-1} />
                </div>

                {/* Vr Kg Coleta */}
                <div className="flex flex-col items-center">
                  <Label>Vr Kg Coleta</Label>
                  <Txt className="w-[100px]" value={dadosColeta.vrKgColeta} onChange={handleChange("vrKgColeta")} tabIndex={21} onKeyDown={handleEnterAsTab} />
                </div>
              </div>
            </div>





            {showNotaFiscal && (
              <NotasFiscalModal
                isOpen={showNotaFiscal}
                onClose={() => handleUiChange("showNotaFiscal", false)}
              />
            )}

            {/* Modal de COMEX */}
            {showComex && (
              <Comex
                isOpen={showComex}
                onClose={() => handleUiChange("showComex", false)}
              />
            )}
          </>
        ) : (
          <div className="flex  justify-center text-gray-500 italic h-full">
            {/* CONSULTA DE COLETAS */}
            {activeTab === "consulta" ? (
              <div className="flex-1 flex flex-col bg-white border-x border-b border-gray-200 rounded-b-md overflow-y-auto overflow-x-hidden pt-0">             {/* CARD 1 — Filtro de Pesquisa com colapso */}
                <div className="border border-gray-300 rounded p-2 bg-white mt-[4px] mx-2 mb-2 shadow-sm transition-all duration-300 ease-in-out">
                  <div
                    className="flex justify-between items-center cursor-pointer select-none"
                    onClick={toggleCollapse}
                  >
                    <h2 className="text-red-700 font-semibold text-[13px] mb-1">
                      Filtro de Pesquisa
                    </h2>
                    {isCollapsed ? (
                      <ChevronDown size={18} className="text-gray-600" />
                    ) : (
                      <ChevronUp size={18} className="text-gray-600" />
                    )}
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${isCollapsed ? "max-h-[95px]" : "max-h-[2000px]"
                      }`}
                  >
                    {/* LINHA 1 — Filial, Status */}
                    <div className="grid grid-cols-12 gap-2 text-[12px] mb-2">
                      <div className="col-span-6 flex items-center gap-2">
                        <label className="w-[60px] text-right">Filial</label>
                        <select className="flex-1 border border-gray-300 rounded px-2 h-[24px]" value={filtros.filialConsulta} onChange={handleFiltroChange("filialConsulta")}>
                          <option>008 - TRANSPORTADORA RODO IMPORT LTDA</option>
                          <option>001 - MATRIZ</option>
                        </select>
                      </div>
                      <div className="col-span-6 flex items-center gap-2">
                        <label className="w-[60px] text-right">Status</label>
                        <select className="flex-1 border border-gray-300 rounded px-2 h-[24px]" value={filtros.statusConsulta} onChange={handleFiltroChange("statusConsulta")}>
                          <option>TODOS</option>
                          <option>NÃO INICIADO</option>
                          <option>EM ANDAMENTO</option>
                          <option>ENCERRADA</option>
                        </select>
                      </div>
                    </div>

                    {/* LINHA 2 — Período, Motorista */}
                    <div className="grid grid-cols-12 gap-2 text-[12px] mb-2">
                      <div className="col-span-6 flex items-center gap-2">
                        <label className="w-[60px] text-right">Período</label>
                        <input
                          type="date"
                          value={filtros.periodoInicio}
                          onChange={handleFiltroChange("periodoInicio")}
                          className="border border-gray-300 rounded px-2 h-[24px] w-[130px]"
                        />
                        <span className="mx-1">até</span>
                        <input
                          type="date"
                          value={filtros.periodoFim}
                          onChange={handleFiltroChange("periodoFim")}
                          className="border border-gray-300 rounded px-2 h-[24px] w-[130px]"
                        />
                      </div>
                      <div className="col-span-6 flex items-center gap-2">
                        <label className="w-[70px] text-right">Motorista</label>
                        <InputBuscaMotorista
                          className="w-[130px]"
                          label={null}
                          value={filtros.motoristaCod}
                          onChange={handleFiltroChange("motoristaCod")}
                          onSelect={(mot) => setFiltros({
                            motoristaCod: mot.cnh,
                            motoristaNome: mot.nome
                          })}
                        />
                        <input
                          className="flex-1 border border-gray-300 rounded px-2 h-[24px] bg-gray-200"
                          readOnly
                          value={filtros.motoristaNome}
                        />
                      </div>
                    </div>

                    {/* LINHA 3 — Solicitante, Nº Coleta, CTRC */}
                    <div className="grid grid-cols-12 gap-2 text-[12px] mb-2">
                      <div className="col-span-5 flex items-center gap-2">
                        <label className="w-[70px] text-right">Solicitante</label>
                        <InputBuscaCliente
                          className="w-[150px]"
                          label={null}
                          value={filtros.solicitanteCnpjFiltro}
                          onChange={handleFiltroChange("solicitanteCnpjFiltro")}
                          onSelect={(emp) => setFiltros({
                            solicitanteCnpjFiltro: maskCNPJ(emp.cnpj),
                            solicitanteNomeFiltro: emp.razao
                          })}
                        />
                        <input
                          className="flex-1 border border-gray-300 rounded px-2 h-[24px] bg-gray-200"
                          readOnly
                          value={filtros.solicitanteNomeFiltro}
                          onChange={handleFiltroChange("solicitanteNomeFiltro")}
                        />
                      </div>
                      <div className="col-span-3 flex items-center gap-2">
                        <label className="w-[70px] text-right">Nº Coleta</label>
                        <input className="flex-1 border border-gray-300 rounded px-2 h-[24px]" value={filtros.nrColetaFiltro} onChange={handleFiltroChange("nrColetaFiltro")} />
                      </div>
                      <div className="col-span-4 flex items-center gap-2">
                        <label className="w-[50px] text-right">CTRC</label>
                        <select className="flex-1 border border-gray-300 rounded px-2 h-[24px]" value={filtros.ctrc} onChange={handleFiltroChange("ctrc")}>
                          <option>Ambos</option>
                          <option>Emitido</option>
                          <option>Não Emitido</option>
                        </select>
                      </div>
                    </div>

                    {/* LINHA 4 — Destinatário, Nº Solicitação */}
                    <div className="grid grid-cols-12 gap-2 text-[12px] mb-2">
                      <div className="col-span-8 flex items-center gap-2">
                        <label className="w-[70px] text-right">Destinatário</label>
                        <InputBuscaCliente
                          className="w-[150px]"
                          label={null}
                          value={filtros.destinatarioCnpjFiltro}
                          onChange={handleFiltroChange("destinatarioCnpjFiltro")}
                          onSelect={(emp) => setFiltros({
                            destinatarioCnpjFiltro: maskCNPJ(emp.cnpj),
                            destinatarioNomeFiltro: emp.razao
                          })}
                        />
                        <input
                          className="flex-1 border border-gray-300 rounded px-2 h-[24px] bg-gray-200"
                          readOnly
                          value={filtros.destinatarioNomeFiltro}
                          onChange={handleFiltroChange("destinatarioNomeFiltro")}
                        />
                      </div>
                      <div className="col-span-4 flex items-center gap-2">
                        <label className="w-[100px] text-right">Nº Solicitação</label>
                        <input className="flex-1 border border-gray-300 rounded px-2 h-[24px]" value={filtros.nrSolicitacaoFiltro} onChange={handleFiltroChange("nrSolicitacaoFiltro")} />
                      </div>
                    </div>

                    {/* LINHA 5 — Nº GMCI, Tipo, Nº Container, Carga IMO */}
                    <div className="grid grid-cols-12 gap-2 text-[12px] mb-2">
                      <div className="col-span-3 flex items-center gap-2">
                        <label className="w-[70px] text-right">Nº GMCI</label>
                        <input
                          className="flex-1 border border-gray-300 rounded px-2 h-[24px]"
                          value={filtros.nrGmci}
                          onChange={handleFiltroChange("nrGmci")}
                        />
                      </div>
                      <div className="col-span-3 flex items-center gap-2">
                        <label className="w-[40px] text-right">Tipo</label>
                        <select className="flex-1 border border-gray-300 rounded px-2 h-[24px]" value={filtros.tipo} onChange={handleFiltroChange("tipo")}>
                          <option>40 REEFER HIGH CUBIC</option>
                          <option>20 PÉS</option>
                          <option>DRY CARGO</option>
                        </select>
                      </div>
                      <div className="col-span-4 flex items-center gap-2">
                        <label className="w-[100px] text-right">Nº Container</label>
                        <input
                          className="flex-1 border border-gray-300 rounded px-2 h-[24px]"
                          value={filtros.nrContainer}
                          onChange={handleFiltroChange("nrContainer")}
                        />
                      </div>
                      <div className="col-span-2 flex items-center gap-2">
                        <label className="flex items-center gap-1">
                          <input type="checkbox" checked={filtros.cargaImoFiltro} onChange={(e) => updateFiltros("cargaImoFiltro", e.target.checked)} /> Carga IMO
                        </label>
                      </div>
                    </div>

                    {/* LINHA 6 — Nome Navio, Postergada, Com Postergada */}
                    <div className="grid grid-cols-12 gap-2 text-[12px] mb-2">
                      <div className="col-span-5 flex items-center gap-2">
                        <label className="w-[70px] text-right">Nome Navio</label>
                        <input
                          className="flex-1 border border-gray-300 rounded px-2 h-[24px]"
                          value={filtros.nomeNavio}
                          onChange={handleFiltroChange("nomeNavio")}
                        />
                      </div>
                      <div className="col-span-4 flex items-center gap-2">
                        <label className="w-[80px] text-right">Postergada</label>
                        <input
                          type="datetime-local"
                          value={filtros.postergada}
                          onChange={handleFiltroChange("postergada")}
                          className="flex-1 border border-gray-300 rounded px-2 h-[24px]"
                        />
                      </div>
                      <div className="col-span-3 flex items-center gap-2">
                        <label className="flex items-center gap-1">
                          <input type="checkbox" checked={filtros.comPostergada} onChange={(e) => updateFiltros("comPostergada", e.target.checked)} /> Com Postergada
                        </label>
                      </div>
                    </div>

                    {/* LINHA 7 — Botões */}
                    <div className="flex justify-end gap-2 mt-2">
                      <button className="border border-gray-300 text-[12px] px-3 py-[2px] rounded bg-gray-50 hover:bg-gray-100 flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-blue-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                        Pesquisar
                      </button>

                      <button onClick={limparFiltros} className="border border-gray-300 text-[12px] px-3 py-[2px] rounded bg-gray-50 hover:bg-gray-100 flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-orange-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 6h18M3 12h18M3 18h18"
                          />
                        </svg>
                        Limpar
                      </button>
                    </div>
                  </div>
                </div>

                {/* CARD 2 — Grid de Coletas */}
                <div className="border border-gray-300 rounded p-2 bg-white">
                  <h2 className="text-red-700 font-semibold text-[13px] mb-1">
                    Relação de Coletas
                  </h2>

                  <div className="border border-gray-300 rounded overflow-auto">
                    <table className="min-w-full text-[12px] text-gray-700 font-normal border-collapse">
                      <thead className="bg-gray-100 text-gray-700 border-b border-gray-300">
                        <tr className="text-center">
                          <th className="px-2 py-[4px] border-r w-[30px]">
                            <input type="checkbox" />
                          </th>
                          <th className="px-2 py-[4px] border-r">Status</th>
                          <th className="px-2 py-[4px] border-r">Filial</th>
                          <th className="px-2 py-[4px] border-r">Nº Coleta</th>
                          <th className="px-2 py-[4px] border-r">Data Coleta</th>
                          <th className="px-2 py-[4px] border-r">Cliente</th>
                          <th className="px-2 py-[4px] border-r">Cidade</th>
                          <th className="px-2 py-[4px] border-r">UF</th>
                          <th className="px-2 py-[4px] border-r">Motorista</th>
                          <th className="px-2 py-[4px]">Placa</th>
                        </tr>
                      </thead>

                      <tbody className="text-center">
                        {[
                          {
                            nrColeta: "185700",
                            status: "ENCERRADA",
                            cor: "text-green-700",
                            filial: "001",
                            dataColeta: "2025-10-14",
                            dataSolicitacao: "2025-10-14",
                            remetenteRazao: "HNK-ITU (1) MATRIZ",
                            remetenteCnpj: "50221019000136",
                            localRazao: "HNK-ITU (1) MATRIZ",
                            localCnpj: "50221019000136",
                            cidade: "ITU",
                            uf: "SP",
                            motorista: "ALAN DA COSTA",
                            placa: "RXW4156",
                            // Dados extras para o Cadastro
                            solicitanteRazao: "MANTRAN TRANSPORTES",
                            solicitanteCnpj: "04086814000141",
                            destinatarioRazao: "BEVANNI TRANSPORTES",
                            destinatarioCnpj: "16464947000193",
                            bairro: "ITAIM",
                            endereco: "AV PRIMO SCHINCARIOL",
                            numero: "1000",
                            cep: "13300003",
                            produtoDesc: "CERVEJA HEINEKEN 350ML",
                            embalagemDesc: "PALLETE",
                            qtdNfInf: "24",
                            pesoInf: "12500,000"
                          },
                          {
                            nrColeta: "185701",
                            status: "EM ANDAMENTO",
                            cor: "text-blue-700",
                            filial: "001",
                            dataColeta: "2025-10-15",
                            dataSolicitacao: "2025-10-15",
                            remetenteRazao: "AMBEV LOGISTICA",
                            remetenteCnpj: "12345678000199",
                            localRazao: "AMBEV LOGISTICA",
                            localCnpj: "12345678000199",
                            cidade: "RESENDE",
                            uf: "RJ",
                            motorista: "MARCIO RUIZ",
                            placa: "BCD1234",
                            bairro: "INDUSTRIAL",
                            endereco: "RODOVIA PRESD. DUTRA",
                            numero: "KM 10",
                            cep: "27510000",
                            produtoDesc: "CERVEJA SKOL 269ML",
                            embalagemDesc: "CAIXA",
                            qtdNfInf: "50",
                            pesoInf: "8400,000"
                          },
                          {
                            nrColeta: "185702",
                            status: "NÃO INICIADO",
                            cor: "text-red-700",
                            filial: "001",
                            dataColeta: "2025-10-16",
                            dataSolicitacao: "2025-10-16",
                            remetenteRazao: "BEV LOG TRANSPORTES",
                            remetenteCnpj: "98765432000100",
                            localRazao: "BEV LOG TRANSPORTES",
                            localCnpj: "98765432000100",
                            cidade: "SALVADOR",
                            uf: "BA",
                            motorista: "ALAN ROBERT",
                            placa: "ABC1234",
                            bairro: "ONDINA",
                            endereco: "AV OCEANICA",
                            numero: "200",
                            cep: "40000990",
                            produtoDesc: "AGUA MINERAL 500ML",
                            embalagemDesc: "FARDO",
                            qtdNfInf: "100",
                            pesoInf: "1500,000"
                          },
                        ].map((coleta, i) => (
                          <tr
                            key={i}
                            className="hover:bg-gray-50 border-t border-gray-200 cursor-pointer"
                            onDoubleClick={() => {
                              setDadosColeta({
                                ...coleta,
                                nrColeta: coleta.nrColeta,
                                remetenteRazao: coleta.remetenteRazao,
                                remetenteCnpj: coleta.remetenteCnpj,
                                localRazao: coleta.localRazao,
                                localCnpj: coleta.localCnpj,
                                dataColeta: coleta.dataColeta,
                                dataSolicitacao: coleta.dataSolicitacao,
                                cidade: coleta.cidade,
                                uf: coleta.uf,
                                motorista: coleta.motorista,
                                placa: coleta.placa,
                              });
                              setSelectedColetaNumero(coleta.nrColeta);
                              handleUiChange("selectedStatus", coleta.status);
                              setActiveTab("cadastro");
                            }}
                          >
                            <td className="px-2 py-[4px] border-r" onDoubleClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={selectedColetaNumero === coleta.nrColeta}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    handleUiChange("selectedStatus", coleta.status);
                                    setSelectedColetaNumero(coleta.nrColeta);
                                    updatePrintState("printNrInicial", coleta.nrColeta);
                                    updatePrintState("printNrFinal", coleta.nrColeta);
                                  } else {
                                    setSelectedColetaNumero("");
                                    handleUiChange("selectedStatus", null);
                                  }
                                }}
                                name="coleta"
                                className="cursor-pointer"
                              />
                            </td>
                            <td className={`px-2 py-[4px] font-semibold border-r ${coleta.cor}`}>
                              {coleta.status}
                            </td>
                            <td className="px-2 py-[4px] border-r">{coleta.filial}</td>
                            <td className="px-2 py-[4px] border-r">{coleta.nrColeta}</td>
                            <td className="px-2 py-[4px] border-r">{coleta.dataColeta.split('-').reverse().join('/')}</td>
                            <td className="px-2 py-[4px] border-r">{coleta.remetenteRazao}</td>
                            <td className="px-2 py-[4px] border-r">{coleta.cidade}</td>
                            <td className="px-2 py-[4px] border-r">{coleta.uf}</td>
                            <td className="px-2 py-[4px] border-r">{coleta.motorista}</td>
                            <td className="px-2 py-[4px]">{coleta.placa}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>


                {/* CARD 3 — Rodapé */}
                <div className="border border-gray-300 rounded p-2 bg-white flex items-center justify-between text-[12px]">
                  <span className="text-gray-600">Total de registros: 3</span>

                  <div className="flex gap-2">
                    <button
                      disabled={selectedStatus !== "NÃO INICIADO"}
                      onClick={() => selectedStatus === "NÃO INICIADO" && handleUiChange("showModalInicio", true)}
                      className={`border border-gray-300 px-3 py-[2px] rounded ${selectedStatus === "NÃO INICIADO"
                        ? "bg-blue-50 hover:bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                      Iniciar
                    </button>

                    <button
                      disabled={selectedStatus !== "EM ANDAMENTO"}
                      onClick={() => selectedStatus === "EM ANDAMENTO" && handleUiChange("showModalEncerrar", true)}
                      className={`border border-gray-300 px-3 py-[2px] rounded ${selectedStatus === "EM ANDAMENTO"
                        ? "bg-green-50 hover:bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                      Encerrar
                    </button>

                    <button className="border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-[2px] rounded">
                      Cancelar
                    </button>
                    <button className="border border-gray-300 bg-orange-50 hover:bg-orange-100 text-orange-700 px-3 py-[2px] rounded">
                      Estornar
                    </button>
                  </div>
                </div>
                <InicioColetaModal
                  isOpen={showModalInicio}
                  onClose={() => handleUiChange("showModalInicio", false)}
                />
                <EncerraColetaModal
                  isOpen={showModalEncerrar}
                  onClose={() => handleUiChange("showModalEncerrar", false)}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center text-gray-500 italic ">
                Tela de Cadastro — em construção
              </div>
            )}

          </div>
        )}
      </div>
      {/*  Rodapé */}


      <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">

        {/* FECHAR */}
        <button
          title="Fechar Tela"
          onClick={() => { resetStore(); navigate(-1); }}
          className={`flex flex-col items-center text-[11px] 
      ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
        >
          <XCircle size={18} />
          <span>Fechar</span>
        </button>

        {/* LIMPAR */}
        <button
          title="Limpar Tela"
          onClick={limparFormulario}
          className={`flex flex-col items-center text-[11px]
      ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
        >
          <RotateCcw size={18} />
          <span>Limpar</span>
        </button>

        {/* INCLUIR */}
        <button
          title="Incluir"
          tabIndex={22}
          onKeyDown={handleIncluirKeyDown}
          className={`flex flex-col items-center text-[11px]
      ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
        >
          <PlusCircle size={18} />
          <span>Incluir</span>
        </button>

        {/* ALTERAR */}
        <button
          title="Alterar"
          className={`flex flex-col items-center text-[11px]
      ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
        >
          <Edit size={18} />
          <span>Alterar</span>
        </button>

        {/* COMEX */}
        <button
          title="Comex"
          onClick={() => handleUiChange("showComex", true)}
          className={`flex flex-col items-center text-[11px]
      ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
        >
          <Globe2 size={18} />
          <span>Comex</span>
        </button>

        {/* DUPLICAR */}
        <button
          title="Duplicar Coleta"
          className={`flex flex-col items-center text-[11px]
      ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
        >
          <Copy size={18} />
          <span>Duplicar</span>
        </button>

        {/* ETIQUETAS EM LOTE */}
        <button
          title="Imprimir Etiquetas em Lote"
          onClick={() => {
            if (selectedColetaNumero) {
              updatePrintState("etqNrInicial", selectedColetaNumero);
              updatePrintState("etqNrFinal", selectedColetaNumero);
            }
            handleUiChange("showEtiquetaModal", true);
          }}
          className={`flex flex-col items-center text-[11px]
    ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
        >
          <FileText size={18} />
          <span>Etiquetas</span>
        </button>


        {/* IMPRIMIR COLETA */}
        <button
          title="Imprimir Coleta"
          onClick={() => {
            // se tiver uma coleta selecionada, já deixa preenchido
            if (selectedColetaNumero) {
              updatePrintState("printNrInicial", selectedColetaNumero);
              updatePrintState("printNrFinal", selectedColetaNumero);
            }
            handleUiChange("showPrintModal", true);
          }}
          className={`flex flex-col items-center text-[11px]
      ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
        >
          <Printer size={18} />
          <span>Imprimir</span>
        </button>

      </div>
      {showPrintModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40">
          <div className="w-[760px] max-w-[95vw] bg-white border border-gray-300 rounded shadow-lg">
            {/* Cabeçalho */}
            <div className="relative border-b border-gray-300 py-2">
              <div className="text-center text-red-700 font-semibold text-[13px]">
                IMPRESSÃO DE COLETAS
              </div>

              <button
                onClick={() => handleUiChange("showPrintModal", false)}
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-800"
                title="Fechar"
              >
                <XCircle size={18} />
              </button>
            </div>

            {/* Corpo */}
            <div className="p-3">
              {/* Linha 1 - Empresa / Filial */}
              <div className="grid grid-cols-12 gap-2 items-center mb-3">
                <Label className="col-span-1">Empresa</Label>
                <Sel
                  className="col-span-5"
                  value={printEmpresa}
                  onChange={handlePrintChange("printEmpresa")}
                >
                  <option value="001">001 - MANTRAN TRANSPORTES LTDA</option>
                  {/* depois você substitui por lista real */}
                </Sel>

                <Label className="col-span-1">Filial</Label>
                <Sel
                  className="col-span-5"
                  value={printFilial}
                  onChange={handlePrintChange("printFilial")}
                >
                  {filialAtiva ? (
                    <option value={filialAtiva.codigo}>
                      {filialAtiva.codigo} - {filialAtiva.nome}
                    </option>
                  ) : (
                    <option value="">Selecione</option>
                  )}
                </Sel>
              </div>

              {/* Linha 2 - Nº Inicial / Nº Final */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-1">Nº inicial</Label>
                <Txt
                  className="col-span-2"
                  value={printNrInicial}
                  onChange={handlePrintChange("printNrInicial")}
                />

                <Label className="col-span-1">Nº final</Label>
                <Txt
                  className="col-span-2"
                  value={printNrFinal}
                  onChange={handlePrintChange("printNrFinal")}
                />

                <div className="col-span-6" />
              </div>
            </div>

            {/* Rodapé do Modal */}
            <div className="border-t border-gray-300 bg-gray-50 p-2 flex items-center justify-between">
              {/* Esquerda: Tipo */}
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-gray-700">Tipo</span>
                <Sel
                  className="w-[180px]"
                  value={printTipo}
                  onChange={handlePrintChange("printTipo")}
                >
                  <option value="meia">Meia folha</option>
                  <option value="inteira">Folha inteira</option>
                </Sel>
              </div>

              {/* Direita: botões */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleUiChange("showPrintModal", false)}
                  className="border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 px-4 py-[2px] rounded text-[12px]"
                >
                  Fechar
                </button>

                <button
                  onClick={() => {
                    // validação simples
                    const ini = (printNrInicial || "").trim();
                    const fim = (printNrFinal || "").trim();

                    if (!ini || !fim) return;

                    handleUiChange("showPrintModal", false);

                    if (printTipo === "meia") {
                      navigate("/relatorios/operacao/coleta-meia-folha", {
                        state: { numeroOrdem: ini, templateId: "padrao" },
                      });
                    } else {
                      navigate("/relatorios/operacao/coleta-folha-inteira", {
                        state: { numeroOrdem: ini, templateId: "inteiro" },
                      });
                    }
                  }}
                  className="border border-gray-300 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-[2px] rounded text-[12px] flex items-center gap-2"
                >
                  <Printer size={16} />
                  Imprimir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEtiquetaModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40">
          <div className="w-[760px] max-w-[95vw] bg-white border border-gray-300 rounded shadow-lg">
            {/* Cabeçalho */}
            <div className="relative border-b border-gray-300 py-2">
              <div className="text-center text-red-700 font-semibold text-[13px]">
                IMPRESSÃO DE ETIQUETAS
              </div>

              <button
                onClick={() => handleUiChange("showEtiquetaModal", false)}
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-800"
                title="Fechar"
              >
                <XCircle size={18} />
              </button>
            </div>

            {/* Corpo */}
            <div className="p-3">
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-2">Nº inicial</Label>
                <Txt
                  className="col-span-3"
                  value={etqNrInicial}
                  onChange={handlePrintChange("etqNrInicial")}
                />

                <Label className="col-span-2">Nº final</Label>
                <Txt
                  className="col-span-3"
                  value={etqNrFinal}
                  onChange={handlePrintChange("etqNrFinal")}
                />
                <div className="col-span-2" />
              </div>
            </div>

            {/* Rodapé com 3 ícones */}
            <div className="border-t border-gray-300 bg-gray-50 p-2 flex items-center justify-end gap-4">
              {/* FECHAR */}
              <button
                title="Fechar Tela"
                onClick={() => handleUiChange("showEtiquetaModal", false)}
                className="flex flex-col items-center text-[11px] text-gray-700 hover:text-gray-900"
              >
                <Undo2 size={18} />
                <span>Fechar</span>
              </button>

              {/* CÓDIGO DE BARRAS */}
              <button
                title="Imprimir etiqueta com Código de Barras"
                onClick={() => {
                  const ini = (etqNrInicial || "").trim();
                  const fim = (etqNrFinal || "").trim();
                  if (!ini || !fim) return;

                  handleUiChange("confirmText", `Confirmar impressão de etiquetas (Código de Barras) de ${ini} a ${fim}?`);
                  setConfirmAction(() => {
                    handleUiChange("showEtiquetaModal", false);
                    handleUiChange("modalMsg", false);
                    navigate("/relatorios/operacao/etiquetas-coleta", {
                      state: { ini, fim, labelKind: "barcode", templateId: "auto" },
                    });
                  });
                  handleUiChange("modalMsg", true);
                }}
                className="flex flex-col items-center text-[11px] text-gray-700 hover:text-gray-900"
              >
                <FileText size={18} />
                <span>Barras</span>
              </button>

              {/* QRCODE */}
              <button
                title="Imprimir etiqueta com QRCode"
                onClick={() => {
                  const ini = (etqNrInicial || "").trim();
                  const fim = (etqNrFinal || "").trim();
                  if (!ini || !fim) return;

                  handleUiChange("confirmText", `Confirmar impressão de etiquetas (QRCode) de ${ini} a ${fim}?`);
                  setConfirmAction(() => {
                    handleUiChange("showEtiquetaModal", false);
                    handleUiChange("modalMsg", false);
                    navigate("/relatorios/operacao/etiquetas-coleta", {
                      state: { ini, fim, labelKind: "qrcode", templateId: "auto" },
                    });
                  });
                  handleUiChange("modalMsg", true);
                }}
                className="flex flex-col items-center text-[11px] text-gray-700 hover:text-gray-900"
              >
                <FileText size={18} />
                <span>QRCode</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {modalMsg && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 shadow-lg rounded border text-center w-[340px]">
            <p className="text-gray-800 font-semibold mb-4">
              {confirmText || "Confirmar ação?"}
            </p>

            <div className="flex justify-center gap-2">
              <button
                className="px-3 py-1 border border-gray-300 rounded"
                onClick={() => {
                  handleUiChange("modalMsg", false);
                  setConfirmAction(null);
                }}
              >
                Não
              </button>

              <button
                className="px-3 py-1 bg-red-700 text-white rounded"
                onClick={() => {
                  if (typeof confirmAction === "function") confirmAction();
                }}
              >
                Sim
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
