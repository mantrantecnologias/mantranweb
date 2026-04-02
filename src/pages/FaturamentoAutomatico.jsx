import { useState } from "react";
import { useIconColor } from "../context/IconColorContext";
import { useNavigate } from "react-router-dom";
import {
  XCircle,
  RotateCcw,
  CheckSquare,
} from "lucide-react";

/* ========================= Helpers ========================= */
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
        "border border-gray-300 rounded px-2 py-[2px] h-[26px] text-[13px] w-full " +
        (props.className || "")
      }
    />
  );
}

function Sel({ children, className = "", ...rest }) {
  return (
    <select
      {...rest}
      className={`border border-gray-300 rounded px-2 py-[2px] h-[26px] text-[13px] w-full ${className}`}
    >
      {children}
    </select>
  );
}

/* ============================================================
    TELA PRINCIPAL
============================================================ */
export default function FaturamentoAutomatico({ open }) {
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();
  const navigate = useNavigate();
  const [empresa, setEmpresa] = useState("");
  const [filial, setFilial] = useState("");
  const [dtIni, setDtIni] = useState("");
  const [dtFim, setDtFim] = useState("");
  const [somentePre, setSomentePre] = useState(false);

  const [dtFat, setDtFat] = useState("");
  const [multa, setMulta] = useState("");
  const [dtVenc, setDtVenc] = useState("");
  const [juros, setJuros] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [condPgto, setCondPgto] = useState("");

  const [fatIni, setFatIni] = useState("");
  const [fatFim, setFatFim] = useState("");
  const [totalGeradas, setTotalGeradas] = useState("");

  const [progress, setProgress] = useState(0);
  const [msgProgresso, setMsgProgresso] = useState("");
  const [gerando, setGerando] = useState(false);

  /* =============================
      MOCK PARA TESTE DINÂMICO
  ============================== */
  function mockBuscarConhecimentos() {
    if (!dtIni || !dtFim) return 0;

    const d1 = new Date(dtIni);
    const d2 = new Date(dtFim);
    const diff = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));

    if (diff <= 10) return 7;
    if (diff <= 40) return 15;
    return 30;
  }

  /* =============================
      GERAR FATURAS
  ============================== */
  const handleGerar = async () => {
    const qtd = mockBuscarConhecimentos();

    if (qtd === 0) {
      alert("Nenhum conhecimento encontrado com os filtros informados!");
      return;
    }

    if (!window.confirm(`Existem ${qtd} registros. Deseja prosseguir?`)) return;

    setGerando(true);
    setProgress(0);
    setMsgProgresso("");

    let inicio = 1;
    let fim = qtd;

    for (let i = 1; i <= qtd; i++) {
      await new Promise((r) => setTimeout(r, 300));

      setProgress(Math.round((i / qtd) * 100));
      setMsgProgresso(
        `Gerando a Fatura ${String(i).padStart(6, "0")}C de ${String(qtd).padStart(6, "0")}C`
      );
    }

    const fatIniFmt = String(inicio).padStart(6, "0") + "C";
    const fatFimFmt = String(fim).padStart(6, "0") + "C";

    alert(`Faturas Geradas!\n\nInicial: ${fatIniFmt}\nFinal: ${fatFimFmt}`);

    setFatIni(fatIniFmt);
    setFatFim(fatFimFmt);
    setTotalGeradas(qtd);

    setGerando(false);
    setMsgProgresso("");
  };

  /* =============================
      LIMPAR CAMPOS
  ============================== */
  const handleLimpar = () => {
    setDtIni("");
    setDtFim("");
    setDtFat("");
    setDtVenc("");
    setMulta("");
    setJuros("");

    setFatIni("");
    setFatFim("");
    setTotalGeradas("");
  };

  return (
    <div
      className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 bg-gray-50 h-[calc(100vh-56px)] flex flex-col ${
        open ? "ml-[192px]" : "ml-[56px]"
      }`}
    >
      {/* TÍTULO PADRÃO */}
      <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
        FATURAMENTO AUTOMÁTICO
      </h1>

      {/* CONTEÚDO CENTRAL */}
      <div className="flex-1 overflow-y-auto p-3 bg-white border-x border-b border-gray-200 rounded-b-md flex flex-col gap-3">

        {/* ======================= CARD PARÂMETROS ======================= */}
        <fieldset className="border border-gray-300 rounded p-3 bg-gray-50">
          <legend className="text-red-700 font-semibold text-[13px] px-2">
            Parâmetros
          </legend>

          <div className="grid grid-cols-12 gap-3 mt-2">
            {/* Linha 1 */}
            <div className="col-span-6">
              <Label>Empresa para Faturamento</Label>
              <Sel value={empresa} onChange={(e) => setEmpresa(e.target.value)}>
                <option value="">001 - MANTRAN TRANSPORTES LTDA</option>
              </Sel>
            </div>

            {/* Linha 2 */}
            <div className="col-span-6">
              <Label>Filial para Faturamento</Label>
              <Sel value={filial} onChange={(e) => setFilial(e.target.value)}>
                <option value="">001 - MANTRAN TECNOLOGIAS LTDA ME</option>
                <option value="">002 - MANTRAN TECNOLOGIAS VALINHOS</option>
                <option value="">TODAS</option>
              </Sel>
            </div>

         {/* Linha 3 */}
<div className="col-span-12 grid grid-cols-12 gap-3">

  {/* 4 colunas */}
  <div className="col-span-3">
    <Label>Conhecimentos Emitidos de</Label>
    <Txt
      type="date"
      value={dtIni}
      onChange={(e) => setDtIni(e.target.value)}
    />
  </div>

  {/* 4 colunas */}
  <div className="col-span-3">
    <Label>Até</Label>
    <Txt
      type="date"
      value={dtFim}
      onChange={(e) => setDtFim(e.target.value)}
    />
  </div>

  {/* 4 colunas */}
  <div className="col-span-4 flex items-center gap-2 mt-5">
    <input
      type="checkbox"
      checked={somentePre}
      onChange={(e) => setSomentePre(e.target.checked)}
      className="accent-red-700"
    />
    <Label>Somente com Pré-Fatura</Label>
  </div>

</div>


            {/* Linha 4 */}
            <div className="col-span-12 grid grid-cols-12 gap-3">
              <div className="col-span-3">
                <Label>Data de Faturamento</Label>
                <Txt type="date" value={dtFat} onChange={(e) => setDtFat(e.target.value)} />
              </div>

                   <div className="col-span-3">
                <Label>Data de Vencimento</Label>
                <Txt type="date" value={dtVenc} onChange={(e) => setDtVenc(e.target.value)} />
              </div>

              <div className="col-span-3">
                <Label>Multa</Label>
                <Txt type="number" value={multa} onChange={(e) => setMulta(e.target.value)} />
              </div>
            

                     
         

              <div className="col-span-3">
                <Label>Juros</Label>
                <Txt type="number" value={juros} onChange={(e) => setJuros(e.target.value)} />
              </div>
           </div>

            {/* Linha 6 */}
            
<div className="col-span-12 grid grid-cols-12 gap-3">

  {/* Período de Faturamento – 3 colunas */}
  <div className="col-span-3">
    <Label>Período de Faturamento</Label>
    <Sel value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
      <option value="">Todos</option>
      <option value="D">Diário</option>
      <option value="S">Semanal</option>
      <option value="10">Decendial</option>
      <option value="15">Quinzenal</option>
      <option value="M">Mensal</option>
    </Sel>
  </div>

  {/* Condição de Pagamento – 3 colunas */}
  <div className="col-span-3">
    <Label>Condição de Pagamento</Label>
    <Sel value={condPgto} onChange={(e) => setCondPgto(e.target.value)}>
      <option value="">Todos</option>
      <option value="00">00 - Carteira</option>
      <option value="15">15 - 15 Dias</option>
    </Sel>
  </div>
  </div>
            {/* Linha 8 */}
            <div className="col-span-12 grid grid-cols-12 gap-3">
              <div className="col-span-4">
                <Label>Nº Fatura (Início)</Label>
                <Txt readOnly className="bg-gray-200" value={fatIni} />
              </div>
              <div className="col-span-4">
                <Label>Nº Fatura (Fim)</Label>
                <Txt readOnly className="bg-gray-200" value={fatFim} />
              </div>
              <div className="col-span-4">
                <Label>Total Geradas</Label>
                <Txt readOnly className="bg-gray-200" value={totalGeradas} />
              </div>
            </div>
          </div>
        </fieldset>

        {/* ======================= CARD PROGRESSO ======================= */}
        <div className="border border-gray-300 rounded p-3 bg-white">
          <Label>Progresso</Label>

          <div className="w-full h-4 bg-gray-300 rounded mt-1 overflow-hidden">
            <div
              className="h-full bg-red-700 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {gerando && (
            <div className="text-[12px] text-gray-700 mt-1">{msgProgresso}</div>
          )}
        </div>
      </div>

      {/* ======================= RODAPÉ ======================= */}
      <div className="flex gap-3 p-2 bg-gray-50 border-t border-gray-300">

      <button
  onClick={() => navigate(-1)}
  title="Fechar Tela"
  className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
>
  <XCircle size={20} />
  <span>Fechar</span>
</button>

       <button
  onClick={handleLimpar}
  title="Limpar Campos"
  className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
>
  <RotateCcw size={20} />
  <span>Limpar</span>
</button>

       <button
  onClick={handleGerar}
  disabled={gerando}
  title="Gerar Faturas"
  className={`flex flex-col items-center text-[11px] ${
    gerando ? "opacity-40 cursor-not-allowed" : `${footerIconColorNormal} hover:${footerIconColorHover}`
  } transition`}
>
  <CheckSquare size={20} />
  <span>Gerar</span>
</button>

      </div>
    </div>
  );
}
