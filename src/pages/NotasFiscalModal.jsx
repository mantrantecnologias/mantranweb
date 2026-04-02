import { useMemo, useState, useRef, useEffect } from "react";
import { XCircle, RotateCcw, PlusCircle, Edit, Trash2 } from "lucide-react";
import InputBuscaProduto from "../components/InputBuscaProduto";
import InputBuscaEmbalagem from "../components/InputBuscaEmbalagem";

/* ================= HELPERS PADRÃO ================= */
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
      className={`border border-gray-300 rounded px-2 py-[2px] h-[26px] text-[13px] bg-white ${className}`}
    >
      {children}
    </select>
  );
}

/* ================= UTIL ================= */
function isoToBR(iso) {
  if (!iso) return "";
  // aceita "YYYY-MM-DD" e "YYYY-MM-DD HH:mm:ss"
  const [d, t] = String(iso).split(" ");
  const [y, m, day] = d.split("-");
  return t ? `${day}/${m}/${y} ${t}` : `${day}/${m}/${y}`;
}

function inPeriod(dtIso, de, ate) {
  // dtIso pode ter tempo
  if (!dtIso) return true;
  const d = dtIso.slice(0, 10); // YYYY-MM-DD
  if (de && d < de) return false;
  if (ate && d > ate) return false;
  return true;
}

function getHojeISO() {
  return new Date().toISOString().split("T")[0];
}

/* ================= COMPONENTE ================= */
export default function NotaFiscalModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  const [dta, setDta] = useState(false);
  const [idxSelecionado, setIdxSelecionado] = useState(null);
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

  // Foco inicial
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        const first = modalRef.current?.querySelector('[tabindex="1"]');
        if (first) first.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Card 1
  const [dados, setDados] = useState({
    chave: "",
    numero: "",
    serie: "",
    emissao: getHojeISO(),
    volume: "",
    peso: "",
    valor: "",
    tipo: "N",
    icms: "",
    // Linha 4 (2 textbox emb e prod)
    emb: "",
    embDesc: "EMBALAGEM PADRÃO",
    prod: "",
    prodDesc: "PRODUTO PADRÃO",
    // Campos extras que existiam no layout antigo (mantidos como inputs vazios)
    situacaoNF: "C",
    idVol: "",
    m3: "",
    pesoCalc: "",
    m3Peso: "",
    qtPallets: "",
  });

  // Card 2 (Grid de notas adicionadas)
  const [notas, setNotas] = useState([]);

  // Card 3 filtros
  const [filtros3, setFiltros3] = useState({
    filial: "TODAS",
    calculoPor: "PERIODO", // DATA | PERIODO (mock)
    periodoDe: "",
    periodoAte: "",
    veicCodigo: "",
    veicDesc: "PLACA/VEÍCULO (mock)",
    divisao: "",
  });

  // Card 3 registros + seleção
  const [registros3, setRegistros3] = useState([]);
  const [selecionados3, setSelecionados3] = useState([]);
  console.log("NotaFiscalModal isOpen:", isOpen);



  /* ================= MOCK BASE (CARD 3) ================= */
  const mockBase3 = useMemo(
    () => [
      {
        id: 101,
        filial: "001",
        numero: "00185702",
        serie: "C",
        vols: 2,
        pesoNF: 120.5,
        valorNF: 980.3,
        prod: "0000",
        emb: "000",
        dtEmissao: "2025-10-13 12:37:31",
        destinatario: "19900000005992",
        origemNF: "0",
        veiculo: "123",
        divisao: "1054",
      },
      {
        id: 102,
        filial: "002",
        numero: "00185704",
        serie: "C",
        vols: 1,
        pesoNF: 80,
        valorNF: 450,
        prod: "0000",
        emb: "000",
        dtEmissao: "2025-10-14 10:14:26",
        destinatario: "50221019006762",
        origemNF: "0",
        veiculo: "123",
        divisao: "1500",
      },
      {
        id: 103,
        filial: "022",
        numero: "00185709",
        serie: "C",
        vols: 3,
        pesoNF: 210.2,
        valorNF: 1500.0,
        prod: "0000",
        emb: "000",
        dtEmissao: "2025-12-16 17:00:03",
        destinatario: "00000000099701",
        origemNF: "0",
        veiculo: "777",
        divisao: "1054",
      },
      {
        id: 104,
        filial: "022",
        numero: "00185710",
        serie: "C",
        vols: 4,
        pesoNF: 95.75,
        valorNF: 760.0,
        prod: "0001",
        emb: "001",
        dtEmissao: "2025-12-18 08:22:10",
        destinatario: "11222333000199",
        origemNF: "1",
        veiculo: "777",
        divisao: "1500",
      },
      {
        id: 105,
        filial: "001",
        numero: "00185711",
        serie: "C",
        vols: 2,
        pesoNF: 50,
        valorNF: 300,
        prod: "0002",
        emb: "001",
        dtEmissao: "2025-11-02 09:10:00",
        destinatario: "55443322000111",
        origemNF: "0",
        veiculo: "123",
        divisao: "1054",
      },
      {
        id: 106,
        filial: "002",
        numero: "00185712",
        serie: "C",
        vols: 1,
        pesoNF: 10,
        valorNF: 99.9,
        prod: "0000",
        emb: "000",
        dtEmissao: "2025-10-01 14:40:55",
        destinatario: "99887766000155",
        origemNF: "0",
        veiculo: "999",
        divisao: "1500",
      },
      {
        id: 107,
        filial: "022",
        numero: "00185713",
        serie: "C",
        vols: 6,
        pesoNF: 320,
        valorNF: 2450,
        prod: "0003",
        emb: "002",
        dtEmissao: "2025-12-20 19:30:00",
        destinatario: "10101010000101",
        origemNF: "1",
        veiculo: "777",
        divisao: "1054",
      },
      {
        id: 108,
        filial: "022",
        numero: "00185714",
        serie: "C",
        vols: 1,
        pesoNF: 15,
        valorNF: 150,
        prod: "0004",
        emb: "002",
        dtEmissao: "2025-12-21 11:05:30",
        destinatario: "20202020000102",
        origemNF: "0",
        veiculo: "888",
        divisao: "1500",
      },
    ],
    []
  );

  /* ================= FUNÇÕES CARD 1 ================= */
  const limparCard1 = () => {
    setDados((p) => ({
      ...p,
      chave: "",
      numero: "",
      serie: "",
      emissao: getHojeISO(),
      volume: "",
      peso: "",
      valor: "",
      tipo: "N",
      icms: "",
      emb: "",
      embDesc: "EMBALAGEM PADRÃO",
      prod: "",
      prodDesc: "PRODUTO PADRÃO",
      situacaoNF: "C",
      idVol: "",
      m3: "",
      pesoCalc: "",
      m3Peso: "",
      qtPallets: "",
    }));
    setIdxSelecionado(null);
    setDta(false);
  };

  const incluirOuAlterarCard1 = () => {
    // valida mínima
    if (!String(dados.numero || "").trim()) return;

    const item = {
      // Card2 precisa manter os campos da grid
      serie: dados.serie || "",
      numero: dados.numero || "",
      volume: dados.volume || "0",
      emissao: dados.emissao || "",
      peso: dados.peso || "0",
      valor: dados.valor || "0",
      cubagem: dados.m3 || "0",
      pesoCalc: dados.pesoCalc || dados.peso || "0",
      emb: dados.emb || "",
      prod: dados.prod || "",
      descVol: "",

      // manter campos para edição
      chave: dados.chave || "",
      tipo: dados.tipo || "N",
      icms: dados.icms || "",
      embDesc: dados.embDesc || "",
      prodDesc: dados.prodDesc || "",
      situacaoNF: dados.situacaoNF || "C",
      idVol: dados.idVol || "",
      m3Peso: dados.m3Peso || "",
      qtPallets: dados.qtPallets || "",
    };

    setNotas((prev) => {
      if (idxSelecionado !== null && prev[idxSelecionado]) {
        const copia = [...prev];
        copia[idxSelecionado] = item;
        return copia;
      }
      return [...prev, item];
    });

    limparCard1();
  };

  const excluirCard2 = () => {
    if (idxSelecionado === null) return;
    setNotas((prev) => prev.filter((_, i) => i !== idxSelecionado));
    limparCard1();
  };

  const carregarCard1DoCard2 = (row, index) => {
    setIdxSelecionado(index);
    setDados((p) => ({
      ...p,
      chave: row.chave || "",
      numero: row.numero || "",
      serie: row.serie || "",
      emissao: row.emissao || "",
      volume: row.volume || "",
      peso: row.peso || "",
      valor: row.valor || "",
      tipo: row.tipo || "N",
      icms: row.icms || "",
      emb: row.emb || "",
      embDesc: row.embDesc || "EMBALAGEM PADRÃO",
      prod: row.prod || "",
      prodDesc: row.prodDesc || "PRODUTO PADRÃO",
      situacaoNF: row.situacaoNF || "C",
      idVol: row.idVol || "",
      m3: row.cubagem || "",
      pesoCalc: row.pesoCalc || "",
      m3Peso: row.m3Peso || "",
      qtPallets: row.qtPallets || "",
    }));
  };

  /* ================= TOTAIS CARD 2 ================= */
  const totaisCard2 = useMemo(() => {
    const t = {
      vols: 0,
      peso: 0,
      totalNF: 0,
      pesoCalc: 0,
      qtNFs: notas.length,
      pesoInfo: 0,
    };

    for (const n of notas) {
      t.vols += Number(n.volume || 0);
      t.peso += Number(n.peso || 0);
      t.totalNF += Number(n.valor || 0);
      t.pesoCalc += Number(n.pesoCalc || 0);
      t.pesoInfo += Number(n.peso || 0);
    }
    return t;
  }, [notas]);

  /* ================= FUNÇÕES CARD 3 ================= */
  const limparCard3 = () => {
    setFiltros3({
      filial: "TODAS",
      calculoPor: "PERIODO",
      periodoDe: "",
      periodoAte: "",
      veicCodigo: "",
      veicDesc: "PLACA/VEÍCULO (mock)",
      divisao: "",
    });
    setRegistros3([]);
    setSelecionados3([]);
  };

  const pesquisarCard3 = () => {
    // filtro mock conforme solicitado
    const f = filtros3;

    const filtrado = mockBase3.filter((r) => {
      const okFilial = f.filial === "TODAS" ? true : r.filial === f.filial;

      const okPeriodo = inPeriod(r.dtEmissao, f.periodoDe, f.periodoAte);

      const okVeic = f.veicCodigo ? String(r.veiculo) === String(f.veicCodigo) : true;

      const okDiv = f.divisao ? String(r.divisao) === String(f.divisao) : true;

      return okFilial && okPeriodo && okVeic && okDiv;
    });

    setRegistros3(filtrado);
    setSelecionados3([]);
  };

  const toggleSelecionar = (id) => {
    setSelecionados3((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelecionarTodos = () => {
    if (selecionados3.length === registros3.length) {
      setSelecionados3([]);
    } else {
      setSelecionados3(registros3.map((r) => r.id));
    }
  };

  const adicionarSelecionadosNoCard2 = () => {
    if (selecionados3.length === 0) return;

    const selecionados = registros3.filter((r) => selecionados3.includes(r.id));

    setNotas((prev) => [
      ...prev,
      ...selecionados.map((r) => ({
        serie: r.serie || "",
        numero: r.numero || "",
        volume: String(r.vols ?? "0"),
        emissao: r.dtEmissao ? r.dtEmissao.slice(0, 10) : "",
        peso: String(r.pesoNF ?? "0"),
        valor: String(r.valorNF ?? "0"),
        cubagem: "0",
        pesoCalc: String(r.pesoNF ?? "0"),
        emb: r.emb || "",
        prod: r.prod || "",
        descVol: "",
        chave: "",
        tipo: "N",
        icms: "",
        embDesc: "EMBALAGEM (mock)",
        prodDesc: "PRODUTO (mock)",
        situacaoNF: "C",
        idVol: "",
        m3Peso: "",
        qtPallets: "",
      })),
    ]);

    setSelecionados3([]);
  };

  /* ================= RODAPÉ ICONES ================= */
  const btnCls = "flex flex-col items-center text-[11px] text-red-700 hover:text-red-900";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 text-[13px]">
      <div
        ref={modalRef}
        className="bg-white w-[1150px] rounded shadow-lg border border-gray-300 p-3"
      >
        {/* Cabeçalho */}
        <div className="flex justify-between items-center border-b pb-1 mb-2">
          <h2 className="text-[14px] font-semibold text-gray-700">Notas Fiscais</h2>

        </div>

        {/* ================= CARD 1 ================= */}
        <fieldset className="border border-gray-300 rounded p-3">
          <legend className="px-2 text-red-700 font-semibold text-[13px]">
            Inclusão Manual
          </legend>

          {/* LINHA 1 */}
          <div className="grid grid-cols-12 gap-2 mb-2">
            <Label className="col-span-1">Chave</Label>
            <Txt
              className="col-span-4 w-full"
              readOnly={dta}
              value={dados.chave}
              onChange={(e) => setDados((p) => ({ ...p, chave: e.target.value }))}
              tabIndex={dta ? -1 : 1}
              onKeyDown={handleEnterAsTab}
            />

            {/* CONJUNTO 7 COLS */}
            <div className="col-span-7 grid grid-cols-7 gap-2">
              <div className="col-span-1 flex items-center justify-start">
                <label className="flex items-center gap-1 text-[12px] text-gray-600">
                  <input
                    type="checkbox"
                    className="w-3 h-3"
                    checked={dta}
                    onChange={(e) => {
                      const on = e.target.checked;
                      setDta(on);
                      if (on) {
                        setDados((p) => ({ ...p, chave: p.chave, serie: p.serie }));
                      }
                    }}
                    tabIndex={-1}
                  />{" "}
                  DTA
                </label>
              </div>

              <Label className="col-span-1">Nº</Label>
              <Txt
                className="col-span-1 w-full"
                maxLength={9}
                value={dados.numero}
                onChange={(e) => setDados((p) => ({ ...p, numero: e.target.value }))}
                tabIndex={2}
                onKeyDown={handleEnterAsTab}
              />

              <Label className="col-span-1">Série</Label>
              <Txt
                className="col-span-1 w-full"
                maxLength={3}
                readOnly={dta}
                value={dados.serie}
                onChange={(e) => setDados((p) => ({ ...p, serie: e.target.value }))}
                tabIndex={dta ? -1 : 3}
                onKeyDown={handleEnterAsTab}
              />

              <Txt
                type="date"
                className="col-span-2 w-full"
                value={dados.emissao}
                onChange={(e) => setDados((p) => ({ ...p, emissao: e.target.value }))}
                tabIndex={4}
                onKeyDown={handleEnterAsTab}
              />
            </div>
          </div>

          {/* LINHA 2 */}
          <div className="grid grid-cols-12 gap-2 mb-2">
            <Label className="col-span-1">Vol.</Label>
            <Txt
              type="number"
              className="col-span-1 w-full"
              value={dados.volume}
              onChange={(e) => setDados((p) => ({ ...p, volume: e.target.value }))}
              tabIndex={5}
              onKeyDown={handleEnterAsTab}
            />

            <Label className="col-span-1">Peso</Label>
            <Txt
              className="col-span-1 w-full"
              value={dados.peso}
              onChange={(e) => setDados((p) => ({ ...p, peso: e.target.value }))}
              tabIndex={6}
              onKeyDown={handleEnterAsTab}
            />

            <Label className="col-span-1">Valor</Label>
            <Txt
              className="col-span-1 w-full"
              value={dados.valor}
              onChange={(e) => setDados((p) => ({ ...p, valor: e.target.value }))}
              tabIndex={7}
              onKeyDown={handleEnterAsTab}
            />

            <Label className="col-span-1">Situação NF</Label>
            <Sel
              className="col-span-2 w-full"
              value={dados.situacaoNF}
              onChange={(e) => setDados((p) => ({ ...p, situacaoNF: e.target.value }))}
              tabIndex={8}
              onKeyDown={handleEnterAsTab}
            >
              <option value="C">C - Coletada</option>
              <option value="E">E - Emitida</option>
            </Sel>

            <Label className="col-span-1">ID Vol.</Label>
            <Txt
              className="col-span-2 w-full"
              value={dados.idVol}
              onChange={(e) => setDados((p) => ({ ...p, idVol: e.target.value }))}
              tabIndex={9}
              onKeyDown={handleEnterAsTab}
            />
          </div>

          {/* LINHA 3 */}
          <div className="grid grid-cols-12 gap-2 mb-2">
            <Label className="col-span-1">M³</Label>
            <Txt
              className="col-span-1 w-full"
              value={dados.m3}
              onChange={(e) => setDados((p) => ({ ...p, m3: e.target.value }))}
              tabIndex={10}
              onKeyDown={handleEnterAsTab}
            />

            <Label className="col-span-1">Peso Calc.</Label>
            <Txt
              className="col-span-1 w-full"
              value={dados.pesoCalc}
              onChange={(e) => setDados((p) => ({ ...p, pesoCalc: e.target.value }))}
              tabIndex={11}
              onKeyDown={handleEnterAsTab}
            />

            <Label className="col-span-1">Tipo</Label>
            <Txt
              className="col-span-1 w-full text-center"
              value={dados.tipo}
              onChange={(e) => setDados((p) => ({ ...p, tipo: e.target.value }))}
              tabIndex={12}
              onKeyDown={handleEnterAsTab}
            />

            <Label className="col-span-1">M³ → Peso</Label>
            <Txt
              className="col-span-1 w-full"
              value={dados.m3Peso}
              onChange={(e) => setDados((p) => ({ ...p, m3Peso: e.target.value }))}
              tabIndex={13}
              onKeyDown={handleEnterAsTab}
            />

            <Label className="col-span-1">QT Pallets</Label>
            <Txt
              className="col-span-1 w-full"
              value={dados.qtPallets}
              onChange={(e) => setDados((p) => ({ ...p, qtPallets: e.target.value }))}
              tabIndex={14}
              onKeyDown={handleEnterAsTab}
            />

            <Label className="col-span-1">ICMS</Label>
            <Txt
              className="col-span-1 w-full"
              value={dados.icms}
              onChange={(e) => setDados((p) => ({ ...p, icms: e.target.value }))}
              tabIndex={15}
              onKeyDown={handleEnterAsTab}
            />
          </div>

          {/* LINHA 4 */}
          <div className="grid grid-cols-12 gap-2">
            <Label className="col-span-1">Emb.</Label>
            <InputBuscaEmbalagem
              className="col-span-1"
              label={null}
              value={dados.emb}
              onChange={(e) => setDados((p) => ({ ...p, emb: e.target.value }))}
              onSelect={(emb) => {
                setDados((p) => ({
                  ...p,
                  emb: emb.codigo,
                  embDesc: emb.nome
                }));
                focusNextTabIndex(16);
              }}
              tabIndex={16}
            />
            <Txt className="col-span-4 w-full" readOnly value={dados.embDesc} tabIndex={-1} />

            <Label className="col-span-1">Prod.</Label>
            <InputBuscaProduto
              className="col-span-1"
              label={null}
              value={dados.prod}
              onChange={(e) => setDados((p) => ({ ...p, prod: e.target.value }))}
              onSelect={(prod) => {
                setDados((p) => ({
                  ...p,
                  prod: prod.codigo,
                  prodDesc: prod.nome
                }));
                // Auto-incluir após selecionar e focar próximo (o "incluir" pode ser automático ou via Enter no botão de ação se houvesse um, mas aqui o foco vai pro próximo índice livre)
                setTimeout(() => incluirOuAlterarCard1(), 100);
                focusNextTabIndex(17);
              }}
              tabIndex={17}
            />
            <Txt className="col-span-4 w-full" readOnly value={dados.prodDesc} tabIndex={-1} />
          </div>
        </fieldset>

        {/* ================= CARD 2 ================= */}
        <div className="mt-3 border border-gray-300 rounded overflow-hidden">
          <div className="grid grid-cols-11 bg-gray-100 border-b border-gray-300 text-[12px] font-semibold text-gray-700 text-center">
            <div className="py-[3px] border-r">Série</div>
            <div className="py-[3px] border-r">Nº Nota</div>
            <div className="py-[3px] border-r">Vols</div>
            <div className="py-[3px] border-r">DT Emissão</div>
            <div className="py-[3px] border-r">Peso NF</div>
            <div className="py-[3px] border-r">Valor NF</div>
            <div className="py-[3px] border-r">Vol. M³</div>
            <div className="py-[3px] border-r">Cub/Peso Calc</div>
            <div className="py-[3px] border-r">Emb.</div>
            <div className="py-[3px] border-r">Prod.</div>
            <div className="py-[3px]">Descrição Vol.</div>
          </div>

          {notas.length > 0 ? (
            notas.map((n, i) => (
              <div
                key={i}
                onClick={() => carregarCard1DoCard2(n, i)}
                className={`grid grid-cols-11 border-t border-gray-200 text-[12px] text-center cursor-pointer
                ${idxSelecionado === i ? "bg-red-100" : "hover:bg-gray-50"}`}
              >
                <div className="py-[3px] border-r">{n.serie}</div>
                <div className="py-[3px] border-r">{n.numero}</div>
                <div className="py-[3px] border-r">{n.volume}</div>
                <div className="py-[3px] border-r">
                  {isoToBR(n.emissao)}
                </div>

                <div className="py-[3px] border-r">{n.peso}</div>
                <div className="py-[3px] border-r">{n.valor}</div>
                <div className="py-[3px] border-r">{n.cubagem}</div>
                <div className="py-[3px] border-r">{n.pesoCalc}</div>
                <div className="py-[3px] border-r">{n.emb}</div>
                <div className="py-[3px] border-r">{n.prod}</div>
                <div className="py-[3px]">{n.descVol}</div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-2 text-[12px]">
              Nenhuma nota adicionada.
            </div>
          )}
        </div>

        {/* Totais Card 2 (novo padrão solicitado) */}
        <div className="grid grid-cols-12 gap-2 mt-2 border-t border-gray-300 pt-2 text-[12px] text-gray-700">
          <Label className="col-span-1">Vols.</Label>
          <Txt readOnly className="col-span-1 text-right" value={totaisCard2.vols} />

          <Label className="col-span-1">Peso</Label>
          <Txt readOnly className="col-span-1 text-right" value={totaisCard2.peso.toFixed(2)} />

          <Label className="col-span-1">Total NF</Label>
          <Txt readOnly className="col-span-1 text-right" value={totaisCard2.totalNF.toFixed(2)} />

          <Label className="col-span-1">Peso Calc.</Label>
          <Txt readOnly className="col-span-1 text-right" value={totaisCard2.pesoCalc.toFixed(2)} />

          <Label className="col-span-1">QT NFs</Label>
          <Txt readOnly className="col-span-1 text-right" value={totaisCard2.qtNFs} />

          <Label className="col-span-1">Peso Info</Label>
          <Txt readOnly className="col-span-1 text-right" value={totaisCard2.pesoInfo.toFixed(2)} />
        </div>

        {/* ================= CARD 3 ================= */}
        <fieldset className="border border-gray-300 rounded p-3 mt-3 text-[13px] bg-white">
          <legend className="px-2 text-red-700 font-semibold text-[13px]">
            Notas Fiscais do Remetente
          </legend>

          {/* Linha 1 - Filial, Calculo por e Período */}
          <div className="grid grid-cols-12 gap-2 mb-2">
            <Label className="col-span-1">Filial</Label>
            <Sel
              className="col-span-4 w-full"
              value={filtros3.filial}
              onChange={(e) => setFiltros3((p) => ({ ...p, filial: e.target.value }))}
            >
              <option value="TODAS">TODAS</option>
              <option value="001">001 - Mantran Tecnologias</option>
              <option value="002">002 - Mantran Logística</option>
              <option value="022">003 - Mantran Transportes </option>
            </Sel>

            <Label className="col-span-1">Cálculo</Label>
            <Sel
              className="col-span-1 w-full"
              value={filtros3.calculoPor}
              onChange={(e) => setFiltros3((p) => ({ ...p, calculoPor: e.target.value }))}
            >
              <option>B - Bruto </option>
              <option>C - Cubagem</option>
              <option>P - Pallets </option>
              <option>N - % NF</option>
            </Sel>

            <Label className="col-span-1">Período</Label>
            <Txt
              type="date"
              className="col-span-2 w-full"
              value={filtros3.periodoDe}
              onChange={(e) => setFiltros3((p) => ({ ...p, periodoDe: e.target.value }))}
            />
            <Txt
              type="date"
              className="col-span-2 w-full"
              value={filtros3.periodoAte}
              onChange={(e) => setFiltros3((p) => ({ ...p, periodoAte: e.target.value }))}
            />
          </div>

          {/* Linha 2 - Veículo (2 textbox), Divisão, Limpar, Pesquisar */}
          <div className="grid grid-cols-12 gap-2 mb-3">
            <Label className="col-span-1">Veículo</Label>
            <Txt
              className="col-span-1 w-full"
              value={filtros3.veicCodigo}
              onChange={(e) => setFiltros3((p) => ({ ...p, veicCodigo: e.target.value }))}
            />
            <Txt className="col-span-3 w-full" readOnly value={filtros3.veicDesc} />

            <Label className="col-span-1">Divisão</Label>
            <Sel
              className="col-span-2 w-full"
              value={filtros3.divisao}
              onChange={(e) => setFiltros3((p) => ({ ...p, divisao: e.target.value }))}
            >
              <option value=""></option>
              <option value="1054">1054 - Leo Campinas</option>
              <option value="1500">1500 - Leo CD</option>
            </Sel>

            <button
              onClick={limparCard3}
              className="col-span-2 border border-gray-400 rounded px-2 py-[2px] text-[12px] hover:bg-gray-100"
            >
              Limpar
            </button>

            <button
              onClick={pesquisarCard3}
              className="col-span-2 border border-blue-500 text-blue-600 rounded px-2 py-[2px] text-[12px] hover:bg-blue-50"
            >
              Pesquisar
            </button>
          </div>

          {/* GRID PLACEHOLDER (imagem 1) */}
          <div className="border border-gray-300 rounded overflow-hidden">
            <div className="grid grid-cols-12 bg-gray-100 border-b border-gray-300 text-[12px] font-semibold text-gray-700 text-center">
              <div className="py-[3px] border-r col-span-1">Selecione</div>
              <div className="py-[3px] border-r col-span-1">Nº Nota</div>
              <div className="py-[3px] border-r col-span-1">Série</div>
              <div className="py-[3px] border-r col-span-1">Vols</div>
              <div className="py-[3px] border-r col-span-1">Peso NF</div>
              <div className="py-[3px] border-r col-span-1">Valor NF</div>
              <div className="py-[3px] border-r col-span-1">Prod.</div>
              <div className="py-[3px] border-r col-span-1">Emb.</div>
              <div className="py-[3px] border-r col-span-2">DT Emissão</div>
              <div className="py-[3px] border-r col-span-1">Destinatário</div>
              <div className="py-[3px] col-span-1">Origem NF</div>
            </div>

            {registros3.length > 0 ? (
              registros3.map((r) => {
                const marcado = selecionados3.includes(r.id);
                return (
                  <div
                    key={r.id}
                    className={`grid grid-cols-12 border-t border-gray-200 text-[12px] text-center hover:bg-gray-50 cursor-pointer
                    ${marcado ? "bg-blue-50" : ""}`}
                    onClick={() => toggleSelecionar(r.id)}
                  >
                    <div className="py-[3px] border-r col-span-1 flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={marcado}
                        onChange={() => toggleSelecionar(r.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="py-[3px] border-r col-span-1 ">
                      {r.numero}
                    </div>
                    <div className="py-[3px] border-r col-span-1">{r.serie}</div>
                    <div className="py-[3px] border-r col-span-1">{r.vols}</div>
                    <div className="py-[3px] border-r col-span-1">{Number(r.pesoNF).toFixed(2)}</div>
                    <div className="py-[3px] border-r col-span-1">{Number(r.valorNF).toFixed(2)}</div>
                    <div className="py-[3px] border-r col-span-1">{r.prod}</div>
                    <div className="py-[3px] border-r col-span-1">{r.emb}</div>
                    <div className="py-[3px] border-r col-span-2">{isoToBR(r.dtEmissao)}</div>
                    <div className="py-[3px] border-r col-span-1">{r.destinatario}</div>
                    <div className="py-[3px] col-span-1">{r.origemNF}</div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-gray-500 py-2 text-[12px]">
                Nenhum registro encontrado.
              </div>
            )}
          </div>

          {/* Linha abaixo: botão Selecionar Todos/Limpar Seleção + totals + Adicionar */}
          <div className="mt-2 flex items-center justify-between text-[12px]">
            <button
              onClick={toggleSelecionarTodos}
              className="border border-gray-400 rounded px-3 py-[2px] hover:bg-gray-100 flex items-center gap-2"
            >
              <span className="text-red-700 font-semibold">
                {selecionados3.length > 0 ? "Limpar Seleção" : "Selecionar Todos"}
              </span>
            </button>

            <div className="flex items-center gap-3">
              <span>Total Registros</span>
              <Txt
                readOnly
                className="w-[60px] text-right"
                value={registros3.length}
              />
              <span>Registros Selecionados</span>
              <Txt
                readOnly
                className="w-[60px] text-right"
                value={selecionados3.length}
              />
            </div>

            <button
              onClick={adicionarSelecionadosNoCard2}
              className="bg-green-600 text-white px-4 py-[2px] rounded hover:bg-green-700 text-[13px]"
            >
              + Adicionar
            </button>
          </div>
        </fieldset>

        {/* ================= RODAPÉ FINAL ================= */}
        <div className="border-t border-gray-300 bg-white py-2 px-3 flex items-center gap-6 text-red-700 mt-3">
          <button className={btnCls} title="Fechar" onClick={onClose}>
            <XCircle size={18} strokeWidth={1.8} />
            <span>Fechar</span>
          </button>

          <button className={btnCls} title="Limpar Card 1" onClick={limparCard1}>
            <RotateCcw size={18} strokeWidth={1.8} />
            <span>Limpar</span>
          </button>

          <button className={btnCls} title="Incluir" onClick={incluirOuAlterarCard1}>
            <PlusCircle size={18} strokeWidth={1.8} />
            <span>Incluir</span>
          </button>

          <button className={btnCls} title="Alterar" onClick={incluirOuAlterarCard1}>
            <Edit size={18} strokeWidth={1.8} />
            <span>Alterar</span>
          </button>

          <button className={btnCls} title="Excluir" onClick={excluirCard2}>
            <Trash2 size={18} strokeWidth={1.8} />
            <span>Excluir</span>
          </button>
        </div>
      </div>
    </div>
  );
}
