import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import InputBuscaCliente from "../components/InputBuscaCliente";
import { maskCNPJ } from "../utils/masks";

import {
  Search,
  Printer,
  Send,
  FileText,
  XCircle,
  RotateCcw,
  CheckSquare,
  Mail,
  StopCircle,
  ChevronDown,
} from "lucide-react";

// ===== Helpers padrão Mantran =====
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
      className={`
        border border-gray-300 rounded
        px-2 py-[2px] h-[26px] text-[13px]
        ${readOnly ? "bg-gray-200 text-gray-600" : "bg-white"}
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

export default function ConsultaSefazCte({ onClose }) {
  const isGlobalModal = !!onClose;
  const navigate = useNavigate();
  const modalRef = useRef(null);

  const focusNextTabIndex = (current) => {
    const next = modalRef.current?.querySelector(`[tabindex="${current + 1}"]`);
    if (next) next.focus();
  };

  const handleEnterAsTab = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      focusNextTabIndex(e.target.tabIndex);
    }
  };

  // Foco inicial ao abrir
  useEffect(() => {
    const timer = setTimeout(() => {
      const first = modalRef.current?.querySelector('[tabindex="1"]');
      if (first) first.focus();
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const [filtros, setFiltros] = useState({
    clienteCgc: "",
    clienteRazao: "",
    remetenteCgc: "",
    remetenteRazao: "",
    destinatarioCgc: "",
    destinatarioRazao: "",
  });

  const handleFiltroChange = (prefix) => (e) => {
    const val = e.target.value;
    setFiltros({
      ...filtros,
      [`${prefix}Cgc`]: val,
      [`${prefix}Razao`]: "", // Limpa razão ao mudar manual
    });
  };

  const handleSelectCliente = (prefix) => (emp) => {
    setFiltros({
      ...filtros,
      [`${prefix}Cgc`]: maskCNPJ(emp.cnpj),
      [`${prefix}Razao`]: emp.razao,
    });
  };

  const [selectedCount, setSelectedCount] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [showPrintMenu, setShowPrintMenu] = useState(false);
  const [showGNREMenu, setShowGNREMenu] = useState(false);
  const [showParametros, setShowParametros] = useState(false);

  // Estado para o modal de Cancelamento
  const [showCancel, setShowCancel] = useState(false);
  const [justificativa, setJustificativa] = useState("");

  // Estado para o modal da Carta de Correção
  const [showCCe, setShowCCe] = useState(false);
  const [cceItens, setCceItens] = useState([]);
  const [novoItem, setNovoItem] = useState({
    grupo: "",
    campo: "",
    conteudo: "",
    item: "",
  });

  // Função para adicionar item na grid
  const handleAddCCeItem = () => {
    if (!novoItem.grupo || !novoItem.campo || !novoItem.conteudo) {
      alert("⚠️ Preencha todos os campos obrigatórios antes de adicionar!");
      return;
    }
    setCceItens([...cceItens, novoItem]);
    setNovoItem({ grupo: "", campo: "", conteudo: "", item: "" });
  };

  // Função confirmar CCe
  const handleConfirmarCCe = () => {
    alert("✅ Carta de Correção gerada com sucesso!");
    setShowCCe(false);
  };

  const [printMenuDirection, setPrintMenuDirection] = useState("down");
  const [gnreMenuDirection, setGnreMenuDirection] = useState("down");

  const printRef = useRef(null);
  const gnreRef = useRef(null);

  // Itens simulados para tabela
  const data = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, idx) => ({
        id: idx,
        controle: `00025${idx}`,
        cte: `001${idx}`,
        emissao: "06/11/2025",
        status: "A",
        retorno: "100 - Autorizado o uso do CT-e",
        email: "Enviado",
        chave: "35251061069373006144550010025440331777658307",
        protocolo: `13525000${idx}`,
        recibo: `2510048${idx}`,
        cce: "01",
        protocoloCce: `98765${idx}`,
        qtdEmbalagens: idx === 0 ? 3 : 1, // mock: o primeiro CT-e tem 3 embalagens

      })),
    []
  );

  const [checkedItems, setCheckedItems] = useState(
    Array(data.length).fill(false)
  );



  // Controle de seleção individual
  const handleCheckboxChange = (index) => {
    const updated = [...checkedItems];
    updated[index] = !updated[index];
    setCheckedItems(updated);
    setSelectedCount(updated.filter(Boolean).length);
    setSelectAll(updated.every(Boolean));
  };

  // Alternar Selecionar Todos / Limpar Seleção
  const handleSelectAll = () => {
    if (selectAll) {
      setCheckedItems(Array(data.length).fill(false));
      setSelectedCount(0);
      setSelectAll(false);
    } else {
      setCheckedItems(Array(data.length).fill(true));
      setSelectedCount(data.length);
      setSelectAll(true);
    }
  };

  // Detecta se o menu deve abrir pra cima ou pra baixo
  useEffect(() => {
    const updateMenuDirection = () => {
      if (printRef.current) {
        const rect = printRef.current.getBoundingClientRect();
        setPrintMenuDirection(
          window.innerHeight - rect.bottom < 150 ? "up" : "down"
        );
      }
      if (gnreRef.current) {
        const rect = gnreRef.current.getBoundingClientRect();
        setGnreMenuDirection(
          window.innerHeight - rect.bottom < 150 ? "up" : "down"
        );
      }
    };
    updateMenuDirection();
    window.addEventListener("resize", updateMenuDirection);
    return () => window.removeEventListener("resize", updateMenuDirection);
  }, []);

  // Fecha menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        printRef.current &&
        !printRef.current.contains(e.target) &&
        gnreRef.current &&
        !gnreRef.current.contains(e.target)
      ) {
        setShowPrintMenu(false);
        setShowGNREMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // =============================
  // IMPRESSÃO: ETIQUETA CT-E
  // =============================
  const handlePrintEtiquetaCte = () => {
    const selecionados = data.filter((_, idx) => checkedItems[idx]);

    if (selecionados.length === 0) {
      alert("⚠️ Selecione pelo menos 1 CT-e na grid para imprimir a etiqueta.");
      return;
    }

    // regra: somente autorizado
    const naoAutorizados = selecionados.filter((r) => {
      const retorno = String(r.retorno || "").toLowerCase();
      const status = String(r.status || "").toUpperCase();
      const okPorStatus = status === "A";
      const okPorRetorno = retorno.includes("autorizado");
      return !(okPorStatus || okPorRetorno);
    });

    if (naoAutorizados.length > 0) {
      const lista = naoAutorizados
        .slice(0, 10)
        .map((r) => `CT-e ${r.cte} | ${r.retorno || r.status}`)
        .join("\n");

      alert(
        `⚠️ Existem CT-es selecionados que NÃO estão autorizados.\n\n` +
        `${lista}` +
        (naoAutorizados.length > 10 ? `\n... (+${naoAutorizados.length - 10})` : "")
      );
      return;
    }

    // navega para o relatório de etiqueta (você cria a rota no App.jsx)
    navigate("/relatorios/operacao/rel-etiqueta-ctrc", {
      state: {
        selectedCtes: selecionados.map((r) => ({
          // o relatório procura por: ctrc || CTRC || numero || nr_ctrc
          ctrc: r.cte, // aqui você está usando o nº CT-e como ctrc (mock). Se tiver CTRC real, troque pra ele.
          embalagemTotal: Number(r.qtdEmbalagens || 1),

          // opcionais (se depois você mapear no RelEtiquetaCTRC pra usar dados reais)
          emissao: r.emissao,
          retorno: r.retorno,
          chave: r.chave,
          protocolo: r.protocolo,
          recibo: r.recibo,
        })),

        labelConfig: {
          widthMm: 200,
          heightMm: 120,
          gapMm: 0,
          marginMm: 0,
          dpi: 203,
        },
      },
    });


  };

  // opções do menu imprimir (agora com ação na Etiqueta CT-e)
  const printOptions = [
    {
      label: "Impressão sem valores",
      onClick: () => {
        const selecionados = data.filter((_, idx) => checkedItems[idx]);

        if (selecionados.length === 0) {
          alert("⚠️ Selecione pelo menos 1 CT-e na grid para imprimir.");
          return;
        }

        // pega menor e maior controle da seleção
        const controles = selecionados.map((r) => r.controle);
        const controleIni = controles[0];
        const controleFim = controles[controles.length - 1];

        navigate("/relatorios/operacao/cte-sem-valores", {
          state: {
            controleIni,
            controleFim,
            filial: "001",
          },
        });
      },
    },
    {
      label: "Impressão CCE",
      onClick: () => {
        alert("🖨️ (mock) Impressão CCE");
      },
    },
    {
      label: "Impressão Etiqueta CT-e (Somente Autorizado)",
      onClick: handlePrintEtiquetaCte,
    },
    {
      label: "Download XML",
      onClick: () => {
        alert("⬇️ (mock) Download XML");
      },
    },
    {
      label: "Download PDF",
      onClick: () => {
        alert("⬇️ (mock) Download PDF");
      },
    },
    {
      label: "Download XML/PDF",
      onClick: () => {
        alert("⬇️ (mock) Download XML/PDF");
      },
    },
  ];

  return (
    <div
      className={
        isGlobalModal
          ? "fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          : "w-full h-full flex items-center justify-center"
      }
    >
      <div
        ref={modalRef}
        className="bg-white w-[1100px] rounded shadow-lg border border-gray-300 p-4 relative"
      >
        <h2 className="text-center text-red-700 font-semibold text-[14px] border-b pb-2">
          CONHECIMENTO ELETRÔNICO
        </h2>

        {/* === CARD 1 - Filtros === */}
        <div className="border border-gray-300 rounded p-3 bg-white mt-3">
          <div className="space-y-2">
            {/* LINHA 01 — FILTRO / CLIENTE */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-1">Filtrar CTe</Label>

              <Sel className="col-span-3 w-full">
                <option>TODOS</option>
                <option>AUTORIZADOS</option>
                <option>CANCELADOS</option>
                <option>REJEITADOS</option>
              </Sel>

              <Label className="col-span-2">Cliente</Label>

              {/* CNPJ */}
              <InputBuscaCliente
                className="col-span-2"
                label={null}
                value={filtros.clienteCgc}
                onChange={handleFiltroChange("cliente")}
                onSelect={(emp) => {
                  handleSelectCliente("cliente")(emp);
                  focusNextTabIndex(1);
                }}
                tabIndex={1}
              />

              {/* Razão Social — NÃO EDITÁVEL */}
              <Txt
                className="col-span-4 bg-gray-200"
                readOnly
                placeholder="Razão Social"
                value={filtros.clienteRazao}
                tabIndex={-1}
              />
            </div>

            {/* LINHA 02 — PERÍODO / REMETENTE */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-1">Período</Label>

              {/* Datas juntas = 3 colunas */}
              <div className="col-span-3 flex items-center gap-1 min-w-0">
                <Txt
                  type="date"
                  className="flex-1 min-w-0"
                  defaultValue="2025-11-06"
                  tabIndex={2}
                  onKeyDown={handleEnterAsTab}
                />
                <span className="text-[12px] text-gray-600 shrink-0">à</span>
                <Txt
                  type="date"
                  className="flex-1 min-w-0"
                  defaultValue="2025-11-06"
                  tabIndex={3}
                  onKeyDown={handleEnterAsTab}
                />
              </div>

              <Label className="col-span-2">Remetente</Label>

              {/* CNPJ */}
              <InputBuscaCliente
                className="col-span-2"
                label={null}
                value={filtros.remetenteCgc}
                onChange={handleFiltroChange("remetente")}
                onSelect={(emp) => {
                  handleSelectCliente("remetente")(emp);
                  focusNextTabIndex(4);
                }}
                tabIndex={4}
              />

              {/* Razão Social — NÃO EDITÁVEL */}
              <Txt
                className="col-span-4 bg-gray-200"
                readOnly
                placeholder="Razão Social"
                value={filtros.remetenteRazao}
                tabIndex={-1}
              />
            </div>

            {/* LINHA 03 — Nº CTe / DESTINATÁRIO */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-1">Nº CTe</Label>

              {/* Inicial + Final juntos */}
              <div className="col-span-3 flex items-center gap-1 min-w-0">
                <Txt
                  className="flex-1 min-w-0"
                  placeholder="Inicial"
                  tabIndex={5}
                  onKeyDown={handleEnterAsTab}
                />
                <span className="text-[12px] text-gray-600 shrink-0">à</span>
                <Txt
                  className="flex-1 min-w-0"
                  placeholder="Final"
                  tabIndex={6}
                  onKeyDown={handleEnterAsTab}
                />
              </div>

              <Label className="col-span-2">Destinatário</Label>

              {/* CNPJ */}
              <InputBuscaCliente
                className="col-span-2"
                label={null}
                value={filtros.destinatarioCgc}
                onChange={handleFiltroChange("destinatario")}
                onSelect={(emp) => {
                  handleSelectCliente("destinatario")(emp);
                  focusNextTabIndex(7);
                }}
                tabIndex={7}
              />

              {/* Razão Social — NÃO EDITÁVEL */}
              <Txt
                className="col-span-4 bg-gray-200"
                readOnly
                placeholder="Razão Social"
                value={filtros.destinatarioRazao}
                tabIndex={-1}
              />
            </div>

            {/* LINHA 04 — Nº CONTROLE / AÇÕES */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-1">Nº Controle</Label>

              {/* Inicial + Final juntos */}
              <div className="col-span-3 flex items-center gap-1 min-w-0">
                <Txt
                  className="flex-1 min-w-0"
                  placeholder="Inicial"
                  tabIndex={8}
                  onKeyDown={handleEnterAsTab}
                />
                <span className="text-[12px] text-gray-600 shrink-0">à</span>
                <Txt
                  className="flex-1 min-w-0"
                  placeholder="Final"
                  tabIndex={9}
                  onKeyDown={handleEnterAsTab}
                />
              </div>

              <Label className="col-span-2">Nº Viagem</Label>

              <Txt
                className="col-span-2"
                tabIndex={10}
                onKeyDown={handleEnterAsTab}
              />

              <div className="col-span-2 flex items-center gap-2">
                <label className="flex items-center gap-1 text-[12px] text-gray-700">
                  <input type="checkbox" className="accent-red-700" tabIndex={-1} />
                  Filtrar CTe c/ GNRE
                </label>
              </div>

              {/* Botão à direita */}
              <div className="col-span-2 flex justify-end">
                <button
                  className="border border-gray-300 rounded px-3 py-[4px] bg-gray-50 hover:bg-gray-100 flex items-center gap-1 text-sm outline-none focus:ring-2 focus:ring-red-200"
                  tabIndex={11}
                >
                  <Search size={14} className="text-blue-600" />
                  Pesquisar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* === CARD 2 - Grid === */}
        <div className="border border-gray-300 rounded p-2 bg-white mt-3">
          <div className="overflow-auto max-h-[260px]">
            <table className="min-w-[1200px] text-[12px] border">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-1 border">Chk</th>
                  <th className="p-1 border">Nº Controle</th>
                  <th className="p-1 border">Nº CTe</th>
                  <th className="p-1 border">Emissão</th>
                  <th className="p-1 border">Status</th>
                  <th className="p-1 border">Retorno Sefaz</th>
                  <th className="p-1 border">Email</th>
                  <th className="p-1 border">Chave CTe</th>
                  <th className="p-1 border">Protocolo</th>
                  <th className="p-1 border">Recibo</th>
                  <th className="p-1 border">Nº CCe</th>
                  <th className="p-1 border">Protocolo CCe</th>
                </tr>
              </thead>

              <tbody>
                {data.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="p-1 border text-center">
                      <input
                        type="checkbox"
                        checked={checkedItems[idx]}
                        onChange={() => handleCheckboxChange(idx)}
                        className="accent-red-700"
                      />
                    </td>
                    <td className="p-1 border text-center">{row.controle}</td>
                    <td className="p-1 border text-center">{row.cte}</td>
                    <td className="p-1 border text-center">{row.emissao}</td>
                    <td className="p-1 border text-center">{row.status}</td>
                    <td className="p-1 border text-left">{row.retorno}</td>
                    <td className="p-1 border text-center">{row.email}</td>
                    <td className="p-1 border text-center font-mono">{row.chave}</td>
                    <td className="p-1 border text-center">{row.protocolo}</td>
                    <td className="p-1 border text-center">{row.recibo}</td>
                    <td className="p-1 border text-center">{row.cce}</td>
                    <td className="p-1 border text-center">{row.protocoloCce}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Rodapé da Grid */}
          <div className="text-[12px] text-gray-700 flex justify-between mt-1">
            <span>Total de Registros: {data.length}</span>
            <span>
              Total Selecionado:{" "}
              <span className="text-red-700 font-semibold">{selectedCount}</span>
            </span>
            <label className="w-24 text-right text-[12px] text-gray-700 ml-[160px]">
              Qtd Página
            </label>
            <input
              type="number"
              defaultValue={50}
              className="border border-gray-300 rounded px-2 py-[2px] h-[26px] w-[70px] text-[13px] text-center"
            />
          </div>
        </div>

        {/* === CARD 3 - Botões === */}
        <div className="border-t border-gray-300 bg-white mt-3 pt-2 flex justify-between items-center text-[12px] relative">
          <div className="flex items-center gap-2">
            <button
              className="border border-gray-300 rounded px-3 py-1  hover:bg-gray-100 flex items-center gap-1"
              onClick={() => {
                if (onClose) onClose();
                else navigate("/");
              }}
            >
              <XCircle size={14} className="text-red-700" /> Fechar
            </button>
            <button
              onClick={handleSelectAll}
              className="border border-gray-300 rounded px-2 py-1 bg-gray-50 hover:bg-gray-100 flex items-center gap-1"
            >
              <CheckSquare size={14} className="text-green-700" />{" "}
              {selectAll ? "Limpar Seleção" : "Selecionar Todos"}
            </button>


          </div>

          {/* === BOTÕES LADO DIREITO === */}
          <div className="flex items-center gap-3">
            <button className="border border-gray-300 rounded px-3 py-1 bg-green-50 hover:bg-green-100 flex items-center gap-1">
              <Send size={14} className="text-green-600" /> Enviar
            </button>

            {/* === BOTÃO IMPRIMIR COM MENU === */}
            <div className="relative" ref={printRef}>
              <div className="flex">
                <button
                  onClick={() => setShowPrintMenu((v) => !v)}
                  className="border border-gray-300 rounded-l px-3 py-1 bg-gray-50 hover:bg-gray-100 flex items-center gap-1"
                >
                  <Printer size={14} className="text-red-700" /> Imprimir
                </button>
                <button
                  onClick={() => setShowPrintMenu((v) => !v)}
                  className="border border-gray-300 border-l-0 rounded-r px-2 py-1 bg-gray-50 hover:bg-gray-100 flex items-center justify-center"
                >
                  <ChevronDown size={14} />
                </button>
              </div>

              {showPrintMenu && (
                <div
                  className={`absolute right-0 w-[230px] bg-white border border-gray-300 rounded shadow-lg text-[12px] z-50 ${printMenuDirection === "up" ? "bottom-full mb-1" : "mt-1"
                    }`}
                >
                  {printOptions.map((opt, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setShowPrintMenu(false);
                        opt.onClick?.();
                      }}
                      className="px-3 py-[4px] hover:bg-gray-100 cursor-pointer"
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowCCe(true)}
              className="border border-gray-300 rounded px-3 py-1 bg-yellow-50 hover:bg-yellow-100 flex items-center gap-1"
            >
              <FileText size={14} className="text-yellow-600" /> CCe
            </button>

            <button className="border border-gray-300 rounded px-3 py-1 bg-yellow-50 hover:bg-yellow-100 flex items-center gap-1">
              <Mail size={14} className="text-yellow-600" /> E-mail
            </button>

            <button
              onClick={() => setShowCancel(true)}
              className="border border-gray-300 rounded px-3 py-1 bg-red-50 hover:bg-red-100 flex items-center gap-1"
            >
              <XCircle size={14} className="text-red-600" /> Cancelar
            </button>

            {/* === BOTÃO GNRE COM MENU === */}
            <div className="relative" ref={gnreRef}>
              <div className="flex">
                <button
                  onClick={() => alert("💰 Boleto gerado com sucesso!")}
                  className="border border-gray-300 rounded-l px-3 py-1 bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
                >
                  <StopCircle size={14} /> GNRE
                </button>
                <button
                  onClick={() => setShowGNREMenu((v) => !v)}
                  className="border border-gray-300 border-l-0 rounded-r px-2 py-1 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
                >
                  <ChevronDown size={14} />
                </button>
              </div>

              {showGNREMenu && (
                <div
                  className={`absolute right-0 w-[180px] bg-white border border-gray-300 rounded shadow-lg text-[12px] z-50 ${gnreMenuDirection === "up" ? "bottom-full mb-1" : "mt-1"
                    }`}
                >
                  <div
                    onClick={() => {
                      setShowParametros(true);
                      setShowGNREMenu(false);
                    }}
                    className="px-3 py-[4px] hover:bg-gray-100 cursor-pointer text-gray-700"
                  >
                    Parâmetros
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* === MODAL CANCELAMENTO === */}
        {showCancel && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[400px] rounded shadow-lg border border-gray-300 p-4">
              <h2 className="text-center text-red-700 font-semibold text-[14px] border-b pb-1 mb-3">
                Cancelar Conhecimento
              </h2>

              <p className="text-[12px] text-gray-700 mb-2">
                Digite a justificativa do cancelamento com no mínimo 15 caracteres
              </p>

              <input
                type="text"
                value={justificativa}
                onChange={(e) => setJustificativa(e.target.value)}
                className="border border-gray-300 rounded w-full h-[28px] text-[13px] px-2 mb-3"
                placeholder="Informe o motivo..."
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    if (justificativa.trim().length < 15) {
                      alert("⚠️ Justificativa deve ter no mínimo 15 caracteres.");
                      return;
                    }
                    alert("✅ CT-e Cancelado com sucesso!");
                    setJustificativa("");
                    setShowCancel(false);
                  }}
                  className="border border-gray-300 rounded px-3 py-[4px] bg-green-50 hover:bg-green-100 text-green-700 text-[13px]"
                >
                  OK
                </button>

                <button
                  onClick={() => setShowCancel(false)}
                  className="border border-gray-300 rounded px-3 py-[4px] hover:bg-gray-100 text-red-700 text-[13px]"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* === MODAL CARTA DE CORREÇÃO === */}
        {showCCe && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[800px] max-h-[90vh] overflow-auto rounded shadow-2xl border border-gray-300 p-4">
              <h2 className="text-center text-red-700 font-semibold text-[15px] border-b pb-1 mb-3">
                CARTA DE CORREÇÃO
              </h2>

              {/* === CARD 1 === */}
              <div className="border border-gray-300 rounded p-2 mb-3 bg-gray-50 text-[13px] text-gray-800 leading-tight">
                <p className="font-semibold mb-1">O que pode ser corrigido com a CC-e?</p>
                <p className="text-justify mb-2">
                  O CONVÊNIO SINIEF 06/89 veda a correção das seguintes informações relacionadas com o Fato Gerador do ICMS do CT-e:
                </p>
                <p className="text-justify">
                  “Art. 58-B: É permitida a utilização de carta de correção, para regularização de erro ocorrido na emissão de documentos fiscais relativos à prestação de serviço de transporte, desde que o erro não esteja relacionado com:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>as variáveis que determinam o valor do imposto tais como: base de cálculo, alíquota, diferença de preço, quantidade, valor da prestação;</li>
                  <li>a correção de dados cadastrais que implique mudança do emitente, tomador, remetente ou destinatário;</li>
                  <li>a data de emissão ou de saída.</li>
                </ul>
              </div>

              {/* === CARD 2 === */}
              <div className="border border-gray-300 rounded p-2 mb-3 bg-white text-[13px]">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="block text-[12px] text-gray-600">Grupo</label>
                    <select
                      value={novoItem.grupo}
                      onChange={(e) => setNovoItem({ ...novoItem, grupo: e.target.value })}
                      className="border border-gray-300 rounded w-full h-[26px] text-[13px] px-1"
                    >
                      <option value="">Selecione</option>
                      <option value="compl">compl</option>
                      <option value="infCarga">infCarga</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[12px] text-gray-600">Campo</label>
                    <select
                      value={novoItem.campo}
                      onChange={(e) => setNovoItem({ ...novoItem, campo: e.target.value })}
                      className="border border-gray-300 rounded w-full h-[26px] text-[13px] px-1"
                    >
                      <option value="">Selecione</option>
                      <option value="xObs">xObs</option>
                      <option value="vCarga">vCarga</option>
                    </select>
                  </div>
                </div>

                <div className="mb-2">
                  <label className="block text-[12px] text-gray-600">Conteúdo</label>
                  <input
                    type="text"
                    value={novoItem.conteudo}
                    onChange={(e) => setNovoItem({ ...novoItem, conteudo: e.target.value })}
                    className="border border-gray-300 rounded w-full h-[26px] text-[13px] px-2"
                    placeholder="Digite o conteúdo..."
                  />
                </div>

                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-[12px] text-gray-600">Item</label>
                    <input
                      type="text"
                      value={novoItem.item}
                      onChange={(e) => setNovoItem({ ...novoItem, item: e.target.value })}
                      className="border border-gray-300 rounded w-full h-[26px] text-[13px] px-2"
                      placeholder="Opcional"
                    />
                    <p className="text-[11px] text-gray-500 mt-[2px]">
                      Informar o campo item somente quando houver mais de um valor ex: Notas fiscais
                    </p>
                  </div>

                  <button
                    onClick={handleAddCCeItem}
                    className="flex items-center gap-1 border border-gray-300 rounded px-3 py-[5px] bg-green-50 hover:bg-green-100 text-green-700 text-[13px]"
                  >
                    ➕ Adicionar
                  </button>
                </div>
              </div>

              {/* === CARD 3 - GRID === */}
              <div className="border border-gray-300 rounded p-2 bg-white text-[12px]">
                <table className="min-w-full border-collapse">
                  <thead className="bg-gray-100 text-gray-700 border-b border-gray-300">
                    <tr>
                      {["Grupo", "Campo", "Valor", "Item"].map((col) => (
                        <th key={col} className="border px-2 py-[4px] text-left">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cceItens.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-2 text-gray-500">
                          Nenhum item adicionado
                        </td>
                      </tr>
                    ) : (
                      cceItens.map((it, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="border px-2 py-[4px]">{it.grupo}</td>
                          <td className="border px-2 py-[4px]">{it.campo}</td>
                          <td className="border px-2 py-[4px]">{it.conteudo}</td>
                          <td className="border px-2 py-[4px]">{it.item}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* === RODAPÉ === */}
              <div className="flex justify-end gap-2 mt-4 border-t pt-3">
                <button
                  onClick={() => setShowCCe(false)}
                  className="flex items-center gap-1 border border-gray-300 rounded px-3 py-[4px] hover:bg-gray-100 text-red-700 text-[13px]"
                >
                  <XCircle size={16} /> Fechar
                </button>
                <button
                  onClick={handleConfirmarCCe}
                  className="flex items-center gap-1 border border-gray-300 rounded px-3 py-[4px] bg-green-50 hover:bg-green-100 text-green-700 text-[13px]"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* === MODAL DE PARÂMETROS GNRE === */}
        {showParametros && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[450px] rounded shadow-lg border border-gray-300 p-4">
              <h2 className="text-center text-red-700 font-semibold text-[14px] border-b pb-1 mb-3">
                PARÂMETROS GNRE
              </h2>

              <div className="grid grid-cols-2 gap-2 text-[12px]">
                <label>Ambiente</label>
                <select className="border border-gray-300 rounded h-[24px] px-1 text-[12px]">
                  <option>HOMOLOGAÇÃO</option>
                  <option>PRODUÇÃO</option>
                </select>

                <label>Dias para Vencimento</label>
                <input
                  type="number"
                  defaultValue={10}
                  className="border border-gray-300 rounded h-[24px] px-1"
                />

                <label>Tipo Valor</label>
                <input
                  type="text"
                  defaultValue="11"
                  className="border border-gray-300 rounded h-[24px] px-1"
                />

                <label>Versão</label>
                <input
                  type="text"
                  defaultValue="2.00"
                  className="border border-gray-300 rounded h-[24px] px-1"
                />

                <label>Receita</label>
                <input
                  type="text"
                  defaultValue="100030"
                  className="border border-gray-300 rounded h-[24px] px-1"
                />

                <label>Detalhamento Receita</label>
                <input
                  type="text"
                  defaultValue="86"
                  className="border border-gray-300 rounded h-[24px] px-1"
                />

                <label>Desconto (%)</label>
                <input
                  type="text"
                  defaultValue="10,00"
                  className="border border-gray-300 rounded h-[24px] px-1"
                />

                <label>Convênio</label>
                <input
                  type="text"
                  defaultValue="123 TESTE 456"
                  className="border border-gray-300 rounded h-[24px] px-1"
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowParametros(false)}
                  className="border border-gray-300 rounded px-3 py-[4px] hover:bg-gray-100 text-red-700 text-[12px]"
                >
                  Fechar
                </button>
                <button
                  onClick={() => alert("✅ Parâmetros salvos com sucesso!")}
                  className="border border-gray-300 rounded px-3 py-[4px] hover:bg-green-100 text-green-700 text-[12px]"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
