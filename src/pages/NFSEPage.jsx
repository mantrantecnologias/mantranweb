import { useState, useRef, useEffect, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import ConsultaNFSE from "./ConsultaNFSE";
import NFSEDoc from "./NFSEDoc"; // <-- modal de documentos
import { useIconColor } from "../context/IconColorContext";
import InputBuscaCliente from "../components/InputBuscaCliente";
import { maskCNPJ } from "../utils/masks";
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
} from "lucide-react";
import { useNFSEStore } from "../stores/useNFSEStore";

function Label({ children, className = "" }) {
  return (
    <label className={`text-[12px] text-gray-600 ${className}`}>{children}</label>
  );
}
const Txt = forwardRef((props, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      className={
        "border border-gray-300 rounded px-2 py-[2px] h-[26px] " +
        (props.className || "")
      }
    />
  );
});
const Sel = forwardRef(({ children, className = "", ...rest }, ref) => {
  return (
    <select
      ref={ref}
      {...rest}
      className={
        "border border-gray-300 rounded px-2 py-[2px] h-[26px] " + className
      }
    >
      {children}
    </select>
  );
});

/* ===========================
   MOCK DE NOTAS NFSE
=========================== */
const nfseMock = [
  {
    id: 1,
    emp: "001",
    fil: "001",
    nf: "056555",
    serie: "5",
    dtISO: "2025-01-20",
    dtExib: "20/01/2025 00:00:00",
    cgc: "42446277004694",
    cliente: "SHPX LOGISTICA LTDA",
    valor: "0,00",
  },
  {
    id: 2,
    emp: "001",
    fil: "001",
    nf: "000274",
    serie: "1",
    dtISO: "2025-04-04",
    dtExib: "04/04/2025 00:00:00",
    cgc: "42446277000273",
    cliente: "SHPX LOGISTICA LTDA",
    valor: "0,00",
  },
  {
    id: 3,
    emp: "001",
    fil: "001",
    nf: "000274",
    serie: "1",
    dtISO: "2025-01-16",
    dtExib: "16/01/2025 00:00:00",
    cgc: "50221019000136",
    cliente: "HNK-ITU (1) MATRIZ",
    valor: "0,00",
  },
  {
    id: 4,
    emp: "001",
    fil: "001",
    nf: "000272",
    serie: "1",
    dtISO: "2025-05-06",
    dtExib: "06/05/2025 00:00:00",
    cgc: "0525495700651",
    cliente: "HNK-ITAJAI",
    valor: "100,00",
  },
  {
    id: 5,
    emp: "001",
    fil: "001",
    nf: "000001",
    serie: "005",
    dtISO: "2025-05-07",
    dtExib: "07/05/2025 00:00:00",
    cgc: "50221019000136",
    cliente: "HNK-ITU (1) MATRIZ",
    valor: "120,00",
  },
];

/* Helper para converter dtISO (yyyy-MM-dd) em string para input date */
function isoOrDefault(dtISO, fallback) {
  return dtISO || fallback;
}

export default function NFSEPage({ open }) {
  const navigate = useNavigate();
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  // === STORE ZUSTAND ===
  const {
    dadosNFSE,
    updateDadosNFSE,
    setDadosNFSE,
    filtros,
    updateFiltros,
    uiState,
    updateUiState,
    setActiveTab,
    setItens,
    limparFormulario,
    setFiltros
  } = useNFSEStore();

  const { activeTab, showDoc, showConsultaNFSE, selectedNF } = uiState;
  const { itens } = dadosNFSE; // Itens ficam dentro de dadosNFSE

  const setShowDoc = (val) => updateUiState("showDoc", val);
  const setShowConsultaNFSE = (val) => updateUiState("showConsultaNFSE", val);

  // === REFS PARA NAVEGAÇÃO ===
  const nrNotaRef = useRef(null);
  const serieRef = useRef(null);
  const divisaoRef = useRef(null);
  const clienteRef = useRef(null);
  const naturezaRef = useRef(null);
  const tipoServicoRef = useRef(null);
  const btnIncluirCard2Ref = useRef(null);
  const btnIncluirRodapeRef = useRef(null);

  // Foco inicial no campo Nº NF ao carregar
  useEffect(() => {
    if (activeTab === "cadastro" && nrNotaRef.current) {
      nrNotaRef.current.focus();
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

  // Helper change
  const handleChange = (field) => (e) => {
    updateDadosNFSE(field, e.target.value);
  };

  // Helper checkbox
  const handleCheck = (field) => (e) => {
    updateDadosNFSE(field, e.target.checked);
  };

  const cadastroKey = selectedNF
    ? `${selectedNF.emp}-${selectedNF.fil}-${selectedNF.nf}-${selectedNF.serie}`
    : "novo";

  const [resultadoConsulta, setResultadoConsulta] = useState(nfseMock);
  const [linhaSelecionadaId, setLinhaSelecionadaId] = useState(null);

  // ====== ITENS DA NF (CARD 2) ======
  // Itens vêm do store agora

  // chamado pelo modal NFSEDoc ao confirmar
  const handleConfirmItensModal = (itensDoModal) => {
    // itensDoModal deve ser um array de itens no mesmo formato do estado itens
    setItens(itensDoModal || []);
    setLinhaSelecionadaId(null);
  };

  const handleExcluirItemCard2 = () => {
    if (!linhaSelecionadaId) return;
    const novosItens = itens.filter((i) => i.id !== linhaSelecionadaId);
    setItens(novosItens);
    setLinhaSelecionadaId(null);
  };


  const handleFiltroChange = (campo) => (e) => {
    updateFiltros(campo, e.target.value);
  };

  const handlePesquisar = () => {
    let dados = [...nfseMock];

    if (filtros.empresa) {
      dados = dados.filter((n) => n.emp === filtros.empresa);
    }
    if (filtros.filial) {
      dados = dados.filter((n) => n.fil === filtros.filial);
    }
    if (filtros.nf) {
      dados = dados.filter((n) =>
        n.nf.toLowerCase().includes(filtros.nf.toLowerCase())
      );
    }
    if (filtros.serie) {
      dados = dados.filter((n) =>
        n.serie.toLowerCase().includes(filtros.serie.toLowerCase())
      );
    }
    if (filtros.cgc) {
      dados = dados.filter((n) =>
        n.cgc.toLowerCase().includes(filtros.cgc.toLowerCase())
      );
    }
    if (filtros.cliente) {
      dados = dados.filter((n) =>
        n.cliente.toLowerCase().includes(filtros.cliente.toLowerCase())
      );
    }

    if (filtros.dtInicio) {
      dados = dados.filter((n) => n.dtISO >= filtros.dtInicio);
    }
    if (filtros.dtFim) {
      dados = dados.filter((n) => n.dtISO <= filtros.dtFim);
    }

    setResultadoConsulta(dados);
  };

  const handleSelecionarNota = (row) => {
    // Ao selecionar nota, popula o store com dados mockados dessa nota
    // Mapeamento simples para exemplo
    const novosDados = {
      empresa: row.emp,
      filial: row.fil,
      nrNota: row.nf,
      serie: row.serie,
      dataCadastro: row.dtISO,
      clienteCnpj: row.cgc,
      clienteRazao: row.cliente,
      // outros campos poderiam ser mapeados se existissem no mock...
    };
    setDadosNFSE(novosDados);

    // Atualiza UI
    updateUiState("selectedNF", row);
    setActiveTab("cadastro");
  };

  // navigate e useIconColor já chamados no início

  return (
    <div
      className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 bg-gray-50 h-[calc(100vh-56px)] flex flex-col ${open ? "ml-[192px]" : "ml-[56px]"
        }`}
    >
      {/* Título */}
      <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
        NOTA FISCAL DE SERVIÇO (NFSE)
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
      <div className="flex flex-col flex-1 min-h-0">
        {activeTab === "cadastro" ? (
          <>
            <fieldset
              key={cadastroKey}
              className="border border-gray-300 rounded p-3 bg-white space-y-3"
            >
              <legend className="px-2 text-red-700 font-semibold text-[13px]">
                Dados da Nota Fiscal
              </legend>

              {/* ================= Linha 01 ================= */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-1 flex items-center justify-end">Empresa</Label>
                <Sel
                  className="col-span-4 w-full"
                  value={dadosNFSE.empresa}
                  onChange={handleChange("empresa")}
                >
                  <option value="001">001 - MANTRAN TRANSPORTES LTDA</option>
                </Sel>

                <Label className="col-span-1 flex items-center justify-end">Filial</Label>
                <Sel
                  className="col-span-4 w-full"
                  value={dadosNFSE.filial}
                  onChange={handleChange("filial")}
                >
                  <option value="001">001 - TESTE MANTRAN</option>
                </Sel>
                <Label className="col-span-1 flex items-center justify-end">Cadastro</Label>
                <Txt
                  type="date"
                  className="col-span-1 bg-gray-200" readOnly
                  value={dadosNFSE.dataCadastro}
                  onChange={handleChange("dataCadastro")}
                />



              </div>

              {/* ================= Linha 02 ================= */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-1 flex items-center justify-end">Nº NF</Label>
                {/* ===== Nº NF + Série (ocupam 2 colunas no grid principal) ===== */}
                <div className="col-span-2 grid grid-cols-3 gap-2 items-center">

                  {/* Nº NF */}
                  <Txt
                    ref={nrNotaRef}
                    className="col-span-2 text-center"
                    maxLength={6}
                    value={dadosNFSE.nrNota}
                    onChange={handleChange("nrNota")}
                    tabIndex={1}
                    onKeyDown={(e) => handleKeyDown(e, serieRef)}
                  />

                  {/* Série */}
                  <Txt
                    ref={serieRef}
                    className="col-span-1 text-center"
                    maxLength={3}
                    value={dadosNFSE.serie}
                    onChange={handleChange("serie")}
                    tabIndex={2}
                    onKeyDown={(e) => handleKeyDown(e, divisaoRef)}
                  />

                </div>

                <Label className="col-span-1 flex items-center justify-end">Nº NFSE</Label>
                <Txt className="col-span-1 text-center bg-gray-200" readOnly value={dadosNFSE.nrNFSE} />
                <Label className="col-span-1 flex items-center justify-end">Divisão</Label>
                <Sel
                  ref={divisaoRef}
                  className="col-span-2 w-full"
                  value={dadosNFSE.divisao}
                  onChange={handleChange("divisao")}
                  tabIndex={3}
                  onKeyDown={(e) => handleKeyDown(e, clienteRef)}
                >
                  <option>1054 - LEO CAMPINAS</option>
                  <option>1500 - LEO CD</option>
                </Sel>
                <Label className="col-span-1 flex items-center justify-end ">CFOP</Label>
                <Txt className="col-span-1 text-center" maxLength={4} value={dadosNFSE.cfop} onChange={handleChange("cfop")} />
                <Label className="col-span-1 flex items-center justify-end">Fatura</Label>
                <Txt className="col-span-1 text-center bg-gray-200" maxLength={9} readOnly value={dadosNFSE.fatura} />


              </div>

              {/* ================= Linha 03 ================= */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-1 flex items-center justify-end">Cliente</Label>

                <InputBuscaCliente
                  ref={clienteRef}
                  className="col-span-2"
                  label={null}
                  value={dadosNFSE.clienteCnpj}
                  onChange={handleChange("clienteCnpj")}
                  onSelect={(emp) => {
                    setDadosNFSE({
                      clienteCnpj: maskCNPJ(emp.cnpj),
                      clienteRazao: emp.razao,
                      clienteCidade: emp.cidade || "",
                      clienteUf: emp.uf || ""
                    });
                    // Após selecionar, foca no próximo campo
                    setTimeout(() => {
                      if (naturezaRef?.current) {
                        naturezaRef.current.focus();
                      }
                    }, 100);
                  }}
                  tabIndex={4}
                  onKeyDown={(e) => handleKeyDown(e, naturezaRef)}
                />

                <Txt
                  className="col-span-4 bg-gray-200"
                  readOnly
                  placeholder="Razão Social"
                  value={dadosNFSE.clienteRazao}
                  onChange={handleChange("clienteRazao")}
                  tabIndex={-1}
                />

                <Txt
                  className="col-span-4 bg-gray-200"
                  readOnly
                  placeholder="Cidade"
                  value={dadosNFSE.clienteCidade}
                  tabIndex={-1}
                />

                <Txt
                  className="col-span-1 text-center bg-gray-200"
                  readOnly
                  placeholder="UF"
                  value={dadosNFSE.clienteUf}
                  tabIndex={-1}
                />
              </div>

              {/* ================= Linha 04 ================= */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-1 flex items-center justify-end">Natureza</Label>
                <Sel
                  ref={naturezaRef}
                  className="col-span-4 w-full"
                  value={dadosNFSE.natureza}
                  onChange={handleChange("natureza")}
                  tabIndex={5}
                  onKeyDown={(e) => handleKeyDown(e, tipoServicoRef)}
                >
                  <option>PRESTAÇÃO DE SERVIÇO</option>
                  <option>DEVOLUÇÃO DE SERVIÇO</option>
                </Sel>

                <Label className="col-span-1 flex items-center justify-end">
                  Tipo Serv.
                </Label>
                <Sel
                  ref={tipoServicoRef}
                  className="col-span-4 w-full"
                  value={dadosNFSE.tipoServico}
                  onChange={handleChange("tipoServico")}
                  tabIndex={6}
                  onKeyDown={(e) => handleKeyDown(e, btnIncluirCard2Ref)}
                >
                  <option>TRANSPORTES</option>
                  <option>SERVIÇOS GERAIS</option>
                  <option>REEMBOLSO</option>
                  <option>REEMBOLSO ARMAZÉM</option>
                  <option>REEMBOLSO DESCARGA</option>
                  <option>ESCOLTA</option>
                </Sel>

                <Label className="col-span-1 flex items-center justify-end">
                  Cancelamento
                </Label>
                <Txt
                  className="col-span-1 text-center bg-gray-200 text-gray-600"
                  readOnly
                  value={dadosNFSE.cancelamento}
                  tabIndex={-1}
                />
              </div>
            </fieldset>


            {/* --- CARD 2 — NOVO LAYOUT (GRID + BOTÕES) --- */}
            <div className="border border-gray-300 rounded p-2 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-red-700 font-semibold text-[13px]">
                  Itens da Nota Fiscal de Serviço
                </h2>

                <div className="flex gap-2">
                  {/* Incluir abre NFSEDoc */}
                  <button
                    ref={btnIncluirCard2Ref}
                    type="button"
                    onClick={() => setShowDoc(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setShowDoc(true);
                      }
                    }}
                    className="flex items-center gap-1 border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded px-2 py-[3px] text-[12px]"
                    title="Incluir itens via documentos"
                    tabIndex={7}
                  >
                    <PlusCircle size={15} className="text-green-700" />
                    <span>Incluir</span>
                  </button>

                  {/* Excluir item selecionado */}
                  <button
                    type="button"
                    onClick={handleExcluirItemCard2}
                    className="flex items-center gap-1 border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded px-2 py-[3px] text-[12px]"
                    title="Excluir item selecionado"
                  >
                    <Trash2 size={15} className="text-red-700" />
                    <span>Excluir</span>
                  </button>
                </div>
              </div>

              {/* Grid de itens */}
              <div className="border border-gray-300 rounded overflow-auto max-h-[260px]">
                <table className="min-w-full text-[12px] border-collapse">
                  <thead className="bg-gray-100 border-b border-gray-300 text-gray-700">
                    <tr>
                      <th className="px-2 py-1 border-r text-left">
                        Descrição do Item
                      </th>
                      <th className="px-2 py-1 border-r text-center">Qtde</th>
                      <th className="px-2 py-1 border-r text-center">Valor</th>
                      <th className="px-2 py-1 border-r text-center">
                        Total Item
                      </th>
                      <th className="px-2 py-1 text-center">Natureza</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itens.map((linha) => (
                      <tr
                        key={linha.id}
                        className={`cursor-pointer ${linhaSelecionadaId === linha.id
                          ? "bg-blue-50"
                          : "hover:bg-gray-50"
                          }`}
                        onClick={() => setLinhaSelecionadaId(linha.id)}
                      >
                        <td className="border-t border-gray-200 px-2 py-[3px]">
                          {linha.descricao}
                        </td>
                        <td className="border-t border-gray-200 px-2 py-[3px] text-center">
                          {linha.qtde}
                        </td>
                        <td className="border-t border-gray-200 px-2 py-[3px] text-center">
                          {linha.valor}
                        </td>
                        <td className="border-t border-gray-200 px-2 py-[3px] text-center">
                          {linha.total}
                        </td>
                        <td className="border-t border-gray-200 px-2 py-[3px] text-center">
                          {linha.natureza}
                        </td>
                      </tr>
                    ))}

                    {itens.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="border-t border-gray-200 px-2 py-2 text-center text-gray-500"
                        >
                          Nenhum item lançado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ================= CARD 3 — TRIBUTAÇÕES ================= */}
            <fieldset className="border border-gray-300 rounded p-3 bg-white">
              <legend className="px-2 text-red-700 font-semibold text-[13px]">
                Tributações da Nota Fiscal de Serviço
              </legend>

              {/* ================= LINHA 1 ================= */}
              <div className="grid grid-cols-12 gap-2 items-center text-[12px] mb-2">

                <Label className="col-span-1 flex items-center justify-end">% VR Líquido</Label>
                <Txt className="col-span-1 text-center bg-gray-200" readOnly value={dadosNFSE.percVrLiquido} />

                <Label className="col-span-1 flex items-center justify-end">Trib. ISS</Label>
                <Sel className="col-span-2 w-full" value={dadosNFSE.tribIss} onChange={handleChange("tribIss")}>
                  <option>EXIGÍVEL</option>
                  <option>NÃO INCIDÊNCIA</option>
                  <option>ISENÇÃO</option>
                  <option>EXPORTAÇÃO</option>
                  <option>IMUNIDADE</option>
                  <option>EXIGIBILIDADE SUSPENSA</option>
                </Sel>

                <div className="col-span-1 flex items-center justify-center gap-2">
                  <input type="checkbox" className="w-4 h-4" checked={dadosNFSE.retido} onChange={handleCheck("retido")} />
                  <span className="text-[12px] text-gray-700">Retido?</span>
                </div>

                <Label className="col-span-1 flex items-center justify-end">VR ISSQN</Label>
                <Txt className="col-span-1 text-center bg-gray-200" readOnly value={dadosNFSE.vrIssqn} />

                <Label className="col-span-1 flex items-center justify-end">% PIS</Label>
                <Txt className="col-span-1 text-center" value={dadosNFSE.percPis} onChange={handleChange("percPis")} />

                <Label className="col-span-1 flex items-center justify-end">% COFINS</Label>
                <Txt className="col-span-1 text-center" value={dadosNFSE.percCofins} onChange={handleChange("percCofins")} />
              </div>

              {/* ================= LINHA 2 ================= */}
              <div className="grid grid-cols-12 gap-2 items-center text-[12px] mb-2">

                <Label className="col-span-1 flex items-center justify-end">Total Serviço</Label>
                <Txt className="col-span-1 text-center bg-gray-200" readOnly value={dadosNFSE.totalServico} />

                <Label className="col-span-1 flex items-center justify-end">% IRRF</Label>
                <Txt className="col-span-1 text-center bg-gray-200" readOnly value={dadosNFSE.percIrrf} />

                <Label className="col-span-1 flex items-center justify-end">Valor IRRF</Label>
                <Txt className="col-span-1 text-center bg-gray-200" readOnly value={dadosNFSE.valorIrrf} />

                <Label className="col-span-1 flex items-center justify-end">% ISSQN</Label>
                <Txt className="col-span-1 text-center" value={dadosNFSE.percIssqn} onChange={handleChange("percIssqn")} />

                <Sel className="col-span-4 w-full" value={dadosNFSE.tipoTributacao} onChange={handleChange("tipoTributacao")}>
                  <option>
                    Operação Tributável (Base de cálculo = Valor da Operação)
                  </option>
                  <option>
                    Operação Tributável (Alíquota diferenciada)
                  </option>
                  <option>
                    Operação Tributável (Qtd x Alíquota por unidade)
                  </option>
                  <option>
                    Tributação monofásica (alíquota zero)
                  </option>
                  <option>Substituição Tributária</option>
                  <option>Operação Isenta</option>
                </Sel>


              </div>

              {/* ================= LINHA 3 ================= */}
              <div className="grid grid-cols-12 gap-2 items-center text-[12px]">
                <Label className="col-span-1 flex items-center justify-end">Observação</Label>
                <Txt
                  className="col-span-11"
                  placeholder="Digite aqui observações adicionais..."
                  value={dadosNFSE.observacao}
                  onChange={handleChange("observacao")}
                />
              </div>
            </fieldset>

          </>
        ) : (
          <>
            {/* --- CONSULTA (SEM ALTERAÇÃO) --- */}
            {/* CARD 1 - Filtros */}
            <fieldset className="border border-gray-300 rounded p-3 bg-white">
              <legend className="px-2 text-red-700 font-semibold text-[13px]">
                Parâmetros de Pesquisa
              </legend>

              {/* LINHA 1 - Empresa / Filial */}
              <div className="grid grid-cols-12 gap-2 mb-2">
                <Label className="col-span-1 flex items-center justify-end">
                  Empresa
                </Label>
                <Sel
                  className="col-span-5 w-full"
                  value={filtros.empresa}
                  onChange={handleFiltroChange("empresa")}
                >
                  <option value="001">001 - MANTRAN TRANSPORTES LTDA</option>
                </Sel>

                <Label className="col-span-1 flex items-center justify-end">
                  Filial
                </Label>
                <Sel
                  className="col-span-5 w-full"
                  value={filtros.filial}
                  onChange={handleFiltroChange("filial")}
                >
                  <option value="001">001 - MANTRAN TECNOLOGIAS LTDA ME</option>
                  <option value="002">002 - MANTRAN TECNOLOGIAS FILIAL 002</option>
                  <option value="003">003 - MANTRAN TECNOLOGIAS FILIAL 003</option>
                </Sel>
              </div>

              {/* LINHA 2 - Nº NF / Série / Cliente / Período */}
              <div className="grid grid-cols-12 gap-2 mb-2">
                <Label className="col-span-1 flex items-center justify-end">
                  Nº NF
                </Label>
                <Txt
                  className="col-span-1 text-center"
                  value={filtros.nf}
                  onChange={handleFiltroChange("nf")}
                />


                <Txt
                  className="col-span-1 text-center"
                  maxLength={3}
                  value={filtros.serie}
                  onChange={handleFiltroChange("serie")}
                />

                <Label className="col-span-1 flex items-center justify-end">
                  Cliente
                </Label>
                <InputBuscaCliente
                  className="col-span-2"
                  label={null}
                  value={filtros.cgc}
                  onChange={handleFiltroChange("cgc")}
                  onSelect={(emp) => setFiltros({
                    cgc: maskCNPJ(emp.cnpj),
                    cliente: emp.razao
                  })}
                />

                <Txt
                  className="col-span-3 bg-gray-200"
                  readOnly
                  maxLength={50}
                  placeholder="Razão Social"
                  value={filtros.cliente}
                  onChange={handleFiltroChange("cliente")}
                />

                <Label className="col-span-1 flex items-center justify-end">
                  Período
                </Label>
                <Txt
                  type="date"
                  className="col-span-1"
                  value={filtros.dtInicio}
                  onChange={handleFiltroChange("dtInicio")}
                />

                <Txt
                  type="date"
                  className="col-span-1"
                  value={filtros.dtFim}
                  onChange={handleFiltroChange("dtFim")}
                />
              </div>

              {/* LINHA 3 - BOTÃO PESQUISAR */}
              <div className="flex justify-end mt-2">
                <button
                  onClick={handlePesquisar}
                  className="border border-gray-300 bg-gray-50 hover:bg-gray-100
                 rounded px-4 h-[28px] text-[12px] text-gray-700 font-medium"
                >
                  Pesquisar
                </button>
              </div>
            </fieldset>


            {/* CARD 2 - Grid */}
            <div className="border border-gray-300 rounded p-2 bg-white flex flex-col">
              <h2 className="text-red-700 font-semibold text-[13px] mb-1">
                Relação de Notas Fiscais de Serviço
              </h2>

              <div className="border border-gray-300 rounded overflow-auto">
                <table className="min-w-full text-[12px] border-collapse">
                  <thead className="bg-gray-100 border-b border-gray-300 text-gray-700">
                    <tr>
                      <th className="px-2 py-1 border-r">Empresa</th>
                      <th className="px-2 py-1 border-r">Filial</th>
                      <th className="px-2 py-1 border-r">Nº NF</th>
                      <th className="px-2 py-1 border-r">Série</th>
                      <th className="px-2 py-1 border-r">DT Cadastro</th>
                      <th className="px-2 py-1 border-r">CGC</th>
                      <th className="px-2 py-1 border-r">Cliente</th>
                      <th className="px-2 py-1">Valor NF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultadoConsulta.map((row, i) => (
                      <tr
                        key={row.id}
                        className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        onClick={() => handleSelecionarNota(row)}
                      >
                        <td className="border-t border-gray-200 px-2 py-[3px] text-center">
                          {row.emp}
                        </td>
                        <td className="border-t border-gray-200 px-2 py-[3px] text-center">
                          {row.fil}
                        </td>
                        <td className="border-t border-gray-200 px-2 py-[3px] text-center">
                          {row.nf}
                        </td>
                        <td className="border-t border-gray-200 px-2 py-[3px] text-center">
                          {row.serie}
                        </td>
                        <td className="border-t border-gray-200 px-2 py-[3px] text-center">
                          {row.dtExib}
                        </td>
                        <td className="border-t border-gray-200 px-2 py-[3px] text-center">
                          {row.cgc}
                        </td>
                        <td className="border-t border-gray-200 px-2 py-[3px]">
                          {row.cliente}
                        </td>
                        <td className="border-t border-gray-200 px-2 py-[3px] text-right">
                          {row.valor}
                        </td>
                      </tr>
                    ))}
                    {resultadoConsulta.length === 0 && (
                      <tr>
                        <td
                          colSpan={8}
                          className="text-center text-gray-500 py-2"
                        >
                          Nenhum registro encontrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Total de Notas */}
              <div className="flex justify-between items-center mt-1 text-[12px] text-gray-700">
                <span>Total de Notas: {resultadoConsulta.length}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* RODAPÉ - sempre visível (como Motorista) */}
      <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">
        {/* FECHAR */}
        <button
          onClick={() => { limparFormulario(); navigate(-1); }}
          title="Fechar Tela"
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
        >
          <XCircle size={18} />
          <span>Fechar</span>
        </button>

        {/* LIMPAR */}
        <button
          onClick={limparFormulario}
          title="Limpar Tela"
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
        >
          <RotateCcw size={18} />
          <span>Limpar</span>
        </button>

        {/* INCLUIR */}
        <button
          ref={btnIncluirRodapeRef}
          title="Incluir"
          tabIndex={8}
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              // Aqui será chamado o comando de inclusão
              console.log("Incluindo NFSE...");
            }
          }}
        >
          <PlusCircle size={18} />
          <span>Incluir</span>
        </button>

        {/* ALTERAR */}
        <button
          title="Alterar"
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
        >
          <Edit size={18} />
          <span>Alterar</span>
        </button>

        {/* EXCLUIR */}
        <button
          title="Excluir"
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
        >
          <Trash2 size={18} />
          <span>Excluir</span>
        </button>

        {/* CANCELAR */}
        <button
          title="Cancelar"
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
        >
          <Ban size={18} />
          <span>Cancelar</span>
        </button>

        {/* ESTORNAR */}
        <button
          title="Estornar"
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
        >
          <Undo2 size={18} />
          <span>Estornar</span>
        </button>

        {/* ENVIAR */}
        <button
          onClick={() => setShowConsultaNFSE(true)}
          title="Enviar"
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
        >
          <Send size={18} />
          <span>Enviar</span>
        </button>

        {/* IMPRIMIR */}
        <button
          title="Imprimir"
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
        >
          <Printer size={18} />
          <span>Imprimir</span>
        </button>
      </div>

      {/* Modais */}
      {showConsultaNFSE && (
        <ConsultaNFSE
          isOpen={showConsultaNFSE}
          onClose={() => setShowConsultaNFSE(false)}
        />
      )}


      {showDoc && (
        <NFSEDoc
          isOpen={showDoc}
          onClose={() => setShowDoc(false)}
          onConfirm={(item) => setItens([...itens, item])}
          btnIncluirRodapeRef={btnIncluirRodapeRef}
        />
      )}


    </div>
  );
}
