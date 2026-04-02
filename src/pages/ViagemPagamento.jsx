import { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useIconColor } from "../context/IconColorContext";
import Draggable from "react-draggable";
import {
  XCircle,
  Search,
  Printer,
  CheckSquare,
  RotateCcw,
  FileText,
} from "lucide-react";

function Label({ children, className = "" }) {
  return <label className={`text-[12px] text-gray-700 ${className}`}>{children}</label>;
}
function Txt(props) {
  return (
    <input
      {...props}
      className={
        "border border-gray-300 rounded px-2 py-[3px] h-[26px] text-[13px] " +
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
        "border border-gray-300 rounded px-2 py-[3px] h-[26px] text-[13px] " +
        className
      }
    >
      {children}
    </select>
  );
}

export default function ViagemPagamento({ isOpen, onClose, isModal = true, open }) {
  const [habilitarTitulo, setHabilitarTitulo] = useState(false);
  const [tpConf, setTpConf] = useState("pendente");
  const nodeRef = useRef(null);
  const tituloRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  // ✅ Centraliza modal na abertura
  useEffect(() => {
    if (isModal && isOpen && nodeRef.current) {
      const modal = nodeRef.current;
      const height = modal.offsetHeight;
      const windowHeight = window.innerHeight;

      // centraliza perfeitamente na tela e evita corte
      const top = Math.max((windowHeight - height) / 2, 30);
      modal.style.top = `${top}px`;
      modal.style.left = "50%";
      modal.style.transform = "translateX(-50%)";
    }
  }, [isModal, isOpen]);


  // ---- GRID CARD 3: VIAGENS ----
  const [viagens, setViagens] = useState(
    [...Array(7)].map((_, i) => ({
      id: i + 1,
      chk: i < 2,
      filial: "001",
      sq: String(i).padStart(2, "0"),
      status: i === 1 ? "ENCERRADA" : i === 2 ? "EM ANDAMENTO" : "NÃO INICIADA",
      data: "20/10/2025",
      tabAgregado: i % 2 ? "000077" : "000083",
      motorista: "ALAN DA COSTA",
      placa: "RXW4I56",
      codVeic: "0035719",
      cpf: "02745328",
      bloqueio: i === 3 ? "S" : "N",
    }))
  );

  const totalViagens = viagens.length;
  const totalSelViagens = useMemo(
    () => viagens.filter((v) => v.chk).length,
    [viagens]
  );

  const selecionarTodasViagens = () =>
    setViagens((prev) => prev.map((v) => ({ ...v, chk: true })));
  const limparSelecaoViagens = () =>
    setViagens((prev) => prev.map((v) => ({ ...v, chk: false })));

  // ---- GRID CARD 5: Títulos Pendentes ----
  const [titulosPendentes] = useState(
    [...Array(1)].map((_, i) => ({
      id: i + 1,
      chk: false,
      empresa: "001",
      filial: "001",
      cpfCnpj: "01628446760",
      motorista: "ALAN DA COSTA",
      titulo: "2025000000" + i,
      parc: "1/1",
      inclusao: "29/10/2025",
      venc: "01/11/2025",
      valorParc: (150 + i * 10).toFixed(2),
      obs: i % 2 ? "—" : "Saldo de frete",
    }))
  );

  if (isModal && !isOpen) return null;

  const Content = (
    <div ref={containerRef} className={`p-3 text-[13px] text-gray-800 space-y-2 overflow-auto ${isModal ? "max-h-[80vh]" : "flex-1"}`}>

      {/* Linha superior: Card 1 + Card 2 */}
      <div className="grid grid-cols-12 gap-2">
        {/* === CARD 1: Filtros principais === */}
        <fieldset className="col-span-9 border border-gray-300 rounded p-2">
          <legend className="text-red-700 font-semibold px-2">Parâmetros</legend>

          {/* L1 */}
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-7 flex items-center gap-2">
              <Label>Filial</Label>
              <Sel className="flex-1 ml-[60px]">
                <option>001 - TESTE MANTRAN</option>
              </Sel>
            </div>
            <div className="col-span-5 flex items-center gap-2">
              <Label>Data</Label>
              <Txt type="date" className="w-[140px]" defaultValue="2025-10-01" />
              <Label>a</Label>
              <Txt type="date" className="w-[140px]" defaultValue="2025-10-31" />
            </div>
          </div>

          {/* L2 */}
          <div className="grid grid-cols-12 gap-2 items-center mt-2">
            <div className="col-span-7 flex items-center gap-2">
              <Label>Empresa</Label>

              <Txt
                className="w-[150px] text-center ml-[36px]"
                defaultValue="1646494700193"
              />

              <Txt
                className="flex-1 bg-gray-200 text-gray-700"
                defaultValue="BEVANNI TRANSPORTES LTDA"
                readOnly
              />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <Label>Tipo</Label>
              <Sel className="w-full">
                <option>Agregado</option>
                <option>Empresa</option>
              </Sel>
            </div>
            <div className="col-span-3 flex items-center gap-2 ">
              <label className="flex items-center gap-2 text-[12px] ml-[25px]">
                <input type="checkbox" /> Viagens c/ Protocolo Entrega
              </label>
            </div>
          </div>

          {/* L3 */}
          <div className="grid grid-cols-12 gap-2 items-center mt-2">
            <div className="col-span-7 flex items-center gap-2">
              <Label>Motorista</Label>
              <Txt className="w-[150px] text-center ml-[35px]" defaultValue="01628446760" />
              <Txt className="flex-1 bg-gray-200 text-gray-700" defaultValue="ALAN DA COSTA" readOnly />
            </div>
            <div className="col-span-5 flex items-center gap-2">
              <Label>CPF</Label>
              <Txt className="w-full text-center bg-gray-200" defaultValue="—" readOnly />
            </div>
          </div>

          {/* L4 */}
          <div className="grid grid-cols-12 gap-2 items-center mt-2">
            <div className="col-span-9 flex items-center gap-2">
              <Label>Tp. Conferência</Label>
              <Sel
                value={tpConf}
                onChange={(e) => setTpConf(e.target.value)}
                className="w-[400px]"
              >
                <option value="pendente">Viagem pendente de acerto</option>
                <option value="todas">Todas</option>
                <option value="encerrada">Encerradas</option>
              </Sel>
            </div>
            <div className="col-span-3 flex justify-end">
              <button
                className="border border-gray-300 rounded px-3 py-[6px] text-[13px] flex items-center gap-1 hover:bg-gray-100"
                onClick={() => alert("Pesquisar viagens")}
              >
                <Search size={16} className="text-red-700" />
                Pesquisar
              </button>
            </div>
          </div>
        </fieldset>

        {/* === CARD 2: Relatórios === */}
        <fieldset className="col-span-3 border border-gray-300 rounded p-2">
          <legend className="text-red-700 font-semibold px-2">Relatórios</legend>

          {[
            "RPA Conferência",
            "Conferência Geral",
            "Acerto de Contas",
            "Frete Subcontratado",
          ].map((t) => (
            <button
              key={t}
              className="w-full border border-gray-300 rounded px-3 py-[8px] text-[13px] flex items-center justify-center gap-2 hover:bg-gray-100 mt-1"
              onClick={() => alert(`Abrir relatório: ${t}`)}
            >
              <Printer size={16} className="text-red-700" /> {t}
            </button>
          ))}
        </fieldset>
      </div>

      {/* Linha do meio: Card 3 + Card 4 lado a lado */}
      <div className="grid grid-cols-12 gap-2">
        {/* === CARD 3: Viagens === */}
        <fieldset className="col-span-9 border border-gray-300 rounded p-2">
          <legend className="text-red-700 font-semibold px-2">
            Viagens — Total Selecionado: {totalSelViagens} de {totalViagens}
          </legend>

          <div className="min-w-0 max-h-[210px] overflow-y-auto border border-gray-200 rounded">
            <table className="w-full text-[12px]">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  {[
                    "Chk",
                    "Filial",
                    "SQ",
                    "Status",
                    "Data",
                    "Nº Tabela Agregado",
                    "Nome Motorista",
                    "Nº Placa",
                    "Veículo Tração",
                    "CPF",
                    "Bloqueio",
                  ].map((h) => (
                    <th key={h} className="border px-2 py-1 text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {viagens.map((v, i) => (
                  <tr
                    key={v.id}
                    className={i % 2 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}
                  >
                    <td className="border px-2 text-center">
                      <input
                        type="checkbox"
                        checked={v.chk}
                        onChange={() =>
                          setViagens((prev) =>
                            prev.map((x) =>
                              x.id === v.id ? { ...x, chk: !x.chk } : x
                            )
                          )
                        }
                      />
                    </td>
                    <td className="border px-2">{v.filial}</td>
                    <td className="border px-2">{v.sq}</td>
                    <td className="border px-2">{v.status}</td>
                    <td className="border px-2">{v.data}</td>
                    <td className="border px-2">{v.tabAgregado}</td>
                    <td className="border px-2">{v.motorista}</td>
                    <td className="border px-2">{v.placa}</td>
                    <td className="border px-2">{v.codVeic}</td>
                    <td className="border px-2">{v.cpf}</td>
                    <td className="border px-2">{v.bloqueio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </fieldset>

        {/* === CARD 4: Título (ações) === */}
        <fieldset className="col-span-3 border border-gray-300 rounded p-2">
          <legend className="text-red-700 font-semibold px-2">Título</legend>

          <div className="flex flex-col gap-2">
            <button
              className="border border-gray-300 rounded px-3 py-[8px] text-[13px] flex items-center justify-center gap-2 hover:bg-gray-100"
              onClick={selecionarTodasViagens}
            >
              <CheckSquare size={16} className="text-green-600" />
              Selecionar Todos
            </button>
            <button
              className="border border-gray-300 rounded px-3 py-[8px] text-[13px] flex items-center justify-center gap-2 hover:bg-gray-100"
              onClick={limparSelecaoViagens}
            >
              <RotateCcw size={16} className="text-red-600" />
              Limpar Seleção
            </button>
            <button
              className="border border-gray-300 rounded px-3 py-[8px] text-[13px] flex items-center justify-center gap-2 hover:bg-gray-100"
              onClick={() => setHabilitarTitulo((prev) => !prev)}

            >
              <FileText size={16} className="text-blue-700" />
              Geração de Título
            </button>
          </div>
        </fieldset>
      </div>

      {/* Linha inferior: Card 5 + Card 6 */}
      <div className="grid grid-cols-12 gap-2">
        {/* === CARD 5: Relação de Títulos Pendentes === */}
        <fieldset className="col-span-9 border border-gray-300 rounded p-2">
          <legend className="text-red-700 font-semibold px-2">
            Relação de Títulos Pendentes do Frotista / Agregado
          </legend>

          <div className="min-w-0 max-h-[180px] overflow-y-auto border border-gray-200 rounded">
            <table className="w-full text-[12px]">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  {[
                    "Chk",
                    "Empresa",
                    "Filial",
                    "CPF/CNPJ",
                    "Nome do Motorista",
                    "Nº Título",
                    "Parc.",
                    "Inclusão",
                    "Vencimento",
                    "Valor Parc.",
                    "Observação",
                  ].map((h) => (
                    <th key={h} className="border px-2 py-1 text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {titulosPendentes.map((t, i) => (
                  <tr
                    key={t.id}
                    className={i % 2 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}
                  >
                    <td className="border px-2 text-center">
                      <input type="checkbox" />
                    </td>
                    <td className="border px-2">{t.empresa}</td>
                    <td className="border px-2">{t.filial}</td>
                    <td className="border px-2">{t.cpfCnpj}</td>
                    <td className="border px-2">{t.motorista}</td>
                    <td className="border px-2">{t.titulo}</td>
                    <td className="border px-2">{t.parc}</td>
                    <td className="border px-2">{t.inclusao}</td>
                    <td className="border px-2">{t.venc}</td>
                    <td className="border px-2 text-right">{t.valorParc}</td>
                    <td className="border px-2">{t.obs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </fieldset>

        {/* === CARD 6: Parâmetros Pesquisa === */}
        <fieldset className="col-span-3 border border-gray-300 rounded p-2">
          <legend className="text-red-700 font-semibold px-2">
            Parâmetros Pesquisa
          </legend>

          <div className="flex flex-col gap-2">
            <button
              className="border border-gray-300 rounded px-3 py-[8px] text-[13px] flex items-center justify-center gap-2 hover:bg-gray-100"
              onClick={() => alert("Abrir consulta de Contas a Receber")}
            >
              <Search size={16} className="text-red-700" />
              Contas a Receber
            </button>

            <div className="flex items-center gap-4 px-2 mt-1">
              <label className="flex items-center gap-1 text-[12px]">
                <input type="radio" name="pjpf" defaultChecked /> Empr.
              </label>
              <label className="flex items-center gap-1 text-[12px]">
                <input type="radio" name="pjpf" /> Motor.
              </label>
            </div>
          </div>
        </fieldset>
      </div>

      {/* === CARD 7: Dados para Contas Pagar === */}
      {habilitarTitulo && (
        <fieldset className="border border-gray-300 rounded p-2">
          <legend className="text-red-700 font-semibold px-2">
            Dados para Contas Pagar
          </legend>

          {/* L1 */}
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-3 flex items-center gap-2">
              <Label>Nº Título</Label>
              <Txt ref={tituloRef} className="flex-1" defaultValue="20250000006" />
            </div>

            <div className="col-span-2 flex items-center gap-2">
              <Label>Descontos</Label>
              <Txt className="w-full text-right" defaultValue="0,00" />
            </div>

            <div className="col-span-4 flex items-center gap-2">
              <Label>Centro Custo</Label>
              <Txt className="w-[140px] text-center" defaultValue="0000000001" />
              <Txt className="flex-1" defaultValue="MANTRAN" />
            </div>

            <div className="col-span-3 flex items-center gap-2">
              <Label>Valor Pagar R$</Label>
              <Txt className="w-full text-right" defaultValue="0,00" />
            </div>
          </div>

          {/* L2 */}
          <div className="grid grid-cols-12 gap-2 items-center mt-2">
            <div className="col-span-3 flex items-center gap-2">
              <Label>Data Venc.</Label>
              <Txt type="date" className="w-full" defaultValue="2025-11-01" />
            </div>
            <div className="col-span-9 flex items-center gap-2">
              <Label>Observação</Label>
              <Txt className="flex-1" defaultValue="" />
            </div>
          </div>

          {/* L3 */}
          <div className="grid grid-cols-12 gap-2 items-center mt-2">
            <div className="col-span-5 grid grid-cols-12 gap-2 items-center">
              <div className="col-span-12 flex items-center gap-2">
                <Label>Evento</Label>
                <Txt className="w-[80px] text-center" defaultValue="028" />
                <Txt className="flex-1" defaultValue="SALDO DE FRETE" />
                <Txt className="w-[60px] text-center" defaultValue="D" />
              </div>
            </div>

            <div className="col-span-4 grid grid-cols-12 gap-2 items-center">
              <div className="col-span-12 flex items-center gap-2">
                <Label>Categoria</Label>
                <Txt className="w-[80px] text-center" defaultValue="100" />
                <Txt
                  className="flex-1"
                  defaultValue="DESPESAS COM FRETE COMPRA"
                />
              </div>
            </div>

            <div className="col-span-3 grid grid-cols-12 gap-2 items-center">
              <div className="col-span-12 flex items-center gap-2">
                <Label>Subcategoria</Label>
                <Txt className="w-[60px] text-center" defaultValue="3" />
                <Txt className="w-[130px]" defaultValue="SALDO DE FRETE" />
              </div>
            </div>
          </div>

          {/* L4 - Botões lado a lado */}
          <div className="flex justify-between mt-3">
            <button
              className="border border-gray-300 rounded px-3 py-[6px] text-[13px] flex items-center gap-1 hover:bg-gray-100"
              onClick={() => alert("Pesquisar")}
            >
              <Search size={16} className="text-red-700" />
              Pesquisar
            </button>

            <button
              className="border border-gray-300 rounded px-4 py-[8px] text-[13px] flex items-center gap-2 hover:bg-gray-100"
              onClick={() => {
                if (tituloRef.current) tituloRef.current.focus();
                if (containerRef.current) {
                  containerRef.current.scrollTo({
                    top: containerRef.current.scrollHeight,
                    behavior: "smooth",
                  });
                }
              }}
            >
              <CheckSquare size={16} className="text-green-700" />
              Quitar
            </button>
          </div>

        </fieldset>
      )}


    </div>
  );

  if (!isModal) {
    return (
      <div
        className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 bg-gray-50 h-[calc(100vh-56px)] flex flex-col ${open ? "ml-[192px]" : "ml-[56px]"
          }`}
      >
        <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
          Pagamento / Acerto de Contas
        </h1>
        {Content}

        {/* === CARD 5 - Rodapé === */}
        <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate(-1)}
              className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
            >
              <XCircle size={20} />
              <span>Fechar</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* === BACKDROP === */}
      <div
        className="fixed inset-0 bg-black/40 z-[99]"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      ></div>

      {/* === JANELA DRAGGABLE === */}
      <Draggable handle=".drag-handle" nodeRef={nodeRef}>
        <div
          ref={nodeRef}
          className="fixed left-1/2 -translate-x-1/2 z-[100] w-[1200px] max-w-[95vw] bg-white border border-gray-300 rounded shadow-2xl"
        >
          {/* HEADER */}
          <div className="drag-handle cursor-move select-none flex items-center justify-between px-3 py-2 border-b bg-white rounded-t">
            <h2 className="text-red-700 font-semibold text-[14px]">
              Acerto de Contas — Pagamentos
            </h2>
            <button
              onClick={onClose}
              className="flex items-center gap-1 text-red-700 hover:text-red-800 text-[12px]"
              title="Fechar"
            >
              <XCircle size={18} /> Fechar
            </button>
          </div>

          {/* CONTEÚDO */}
          {Content}
        </div>
      </Draggable>
    </>
  );
}
