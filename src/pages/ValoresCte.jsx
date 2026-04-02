import { useEffect, useMemo, useState } from "react";
import { XCircle, Save, ChevronDown, ChevronUp } from "lucide-react";

/* ===== Helpers de moeda (pt-BR) ===== */
const toNumber = (s) => {
  if (s == null) return 0;
  const only = String(s).replace(/[^\d,]/g, "").replace(",", ".");
  const n = parseFloat(only);
  return isNaN(n) ? 0 : n;
};
const toBR = (n) =>
  (isNaN(n) ? 0 : n).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

/* ===== Componentes AUX ===== */
function Label({ children, className = "" }) {
  return (
    <label className={`text-[12px] text-gray-700 ${className}`}>{children}</label>
  );
}

/** Input de moeda formatado **/
function MoneyInput({ value, onChange, className = "", ...rest }) {
  const [inner, setInner] = useState(value ?? "0,00");

  useEffect(() => {
    if (value !== inner) setInner(value);
  }, [value]);

  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^\d,]/g, "");
    const fixed = raw.replace(/,+/g, ",");
    setInner(fixed);
    onChange?.(fixed);
  };

  const handleBlur = () => {
    const formatted = toBR(toNumber(inner));
    setInner(formatted);
    onChange?.(formatted);
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      value={inner}
      onChange={handleChange}
      onBlur={handleBlur}
      className={`border border-gray-300 rounded px-2 py-[2px] h-[24px] text-[13px] text-right text-black ${className}`}

      {...rest}
    />
  );
}

function Text({ className = "", ...rest }) {
  return (
    <input
      {...rest}
      className={`border border-gray-300 rounded px-2 py-[2px] h-[24px] text-[13px] ${className}`}
    />
  );
}

/* ================== COMPONENTE ================== */
export default function ValoresCte({ onClose }) {
  const [valorCombinado, setValorCombinado] = useState("0,00");
  // === Lê taxas selecionadas dos parâmetros ===
  const [taxasDisponiveis, setTaxasDisponiveis] = useState([]);

  useEffect(() => {
    const taxasSalvas = JSON.parse(localStorage.getItem("param_taxas_ativas")) || [];

    setTaxasDisponiveis(taxasSalvas);
  }, []);

  // Se não houver seleção salva, mostra todas as taxas
  const todasTaxas = [
    "FretePeso", "Frete Valor", "Advalorem", "Despacho", "Cat", "ITR", "Pedágio",
    "Ademe", "Outros", "Taxa Entrega", "Taxa Coleta", "Descarga", "Gris", "Estadia",
    "Escolta", "Estacionamento", "Emissão DTA", "Valor Ajudante", "Imo Carga Perigosa", "Monitoramento",
    "Imo Adesivagem", "Imposto Suspenso", "Dev. Container", "Taxa Emissao CTe", "Taxa Ova", "Taxa Desova",
    "Taxa Agravo", "Frete Morto", "Taxa Cancelamento", "Taxa Anvisa", "Taxa Refrigerada", "Taxa Plataforma", "Ad. Noturno",
    "TRT",
  ];

  // Exibe apenas as taxas selecionadas, ou todas se nada foi salvo
  const taxaKeys = taxasDisponiveis.length > 0 ? taxasDisponiveis : todasTaxas;

  const [taxas, setTaxas] = useState(() =>
    Object.fromEntries(taxaKeys.map((k) => [k, "0,00"]))
  );


  const [codigoFiscal, setCodigoFiscal] = useState("");
  const [cst, setCst] = useState("");
  const subtotal = useMemo(
    () => toBR(Object.values(taxas).reduce((acc, v) => acc + toNumber(v), 0)),
    [taxas]
  );
  const totalFrete = subtotal;
  const [taxasExpandidas, setTaxasExpandidas] = useState(true);

  const [impostos, setImpostos] = useState({
    baseISS: "0,00",
    baseICMS: "0,00",
    aliqISS: "0,00",
    aliqICMS: "18,00",
    valorISS: "0,00",
    valorICMS: "0,00",
    substTrib: "0,00",
    isentoICMS: "0,00",
  });
  const [observacao, setObservacao] = useState("");
  const setTaxa = (k, v) => setTaxas((prev) => ({ ...prev, [k]: v }));
  const setImp = (k, v) => setImpostos((p) => ({ ...p, [k]: v }));

  // Controle do modal de carga
  const [showCarga, setShowCarga] = useState(false);
  const [caracteristica, setCaracteristica] = useState("");
  const [subCnpj, setSubCnpj] = useState("");
  const [subRazao, setSubRazao] = useState("");
  const [prodCod, setProdCod] = useState("");
  const [prodDesc, setProdDesc] = useState("");

  const handleGravar = () => {
    alert("💾 Valores gravados com sucesso!");
    onClose?.();
  };

  // Define qual linha mostrar (1=ISS, 2=ICMS, 3=Isento)
  const linhaExibida = 2;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[900px] max-h-[90vh] overflow-auto rounded shadow-2xl border border-gray-300 p-4">
        <h2 className="text-center text-red-700 font-semibold text-[15px] border-b pb-1 mb-3">
          VALORES DO FRETE
        </h2>

        {/* ---------- CARD 1 ---------- */}
        <fieldset className="border border-gray-300 rounded p-3 bg-white mb-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Label>Total do Frete</Label>
              <MoneyInput value={totalFrete} readOnly className="w-[110px] bg-gray-50" />
            </div>
            <div className="flex items-center gap-2">
              <Label>Valor Combinado</Label>
              <MoneyInput value={valorCombinado} onChange={setValorCombinado} className="w-[110px]" />
            </div>
          </div>
        </fieldset>

        {/* ---------- CARD 2 - TAXAS (mantido) ---------- */}
        <fieldset className="border border-gray-300 rounded p-0 bg-white mb-3">
          <div className="flex items-center justify-between px-3 py-2">
            <legend className="text-red-700 font-semibold px-2">Taxas</legend>
            <button
              onClick={() => setTaxasExpandidas((v) => !v)}
              className="text-[12px] text-red-700 flex items-center gap-1"
            >
              {taxasExpandidas ? (
                <>
                  <ChevronUp size={14} /> Mostrar menos
                </>
              ) : (
                <>
                  <ChevronDown size={14} /> Mostrar mais
                </>
              )}
            </button>
          </div>

          <div
            className={`px-3 transition-all duration-300 overflow-hidden ${
              taxasExpandidas ? "max-h-[2000px]" : "max-h-[165px]"
            }`}
          >
            <div className="grid grid-cols-3 gap-x-6 gap-y-1 pb-3">
              {taxaKeys.map((k) => (
                <div key={k} className="flex items-center justify-between">
                  <Label className="truncate w-[160px]">
                    {k.replace(/([A-Z])/g, " $1").replace("IMO", "IMO").replace("ICMS", "ICMS")}
                  </Label>
                  <MoneyInput value={taxas[k]} onChange={(v) => setTaxa(k, v)} className="w-[90px]" />
                </div>
              ))}
            </div>
          </div>

          <div className="px-3 py-2 border-t bg-white sticky bottom-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Label>Código Fiscal</Label>
                <Text value="5353" onChange={(e) => setCodigoFiscal(e.target.value)} className="w-[80px] text-center" />
                <Label className="ml-2">CST</Label>
                <Text value="00" onChange={(e) => setCst(e.target.value)} className="w-[50px] text-center" />
              </div>
              <div className="flex items-center gap-2">
                <Label className="font-semibold">Subtotal</Label>
                <MoneyInput value={subtotal} readOnly className="w-[110px] bg-gray-50 font-semibold" />
              </div>
            </div>
          </div>
        </fieldset>

        {/* ---------- CARD 3 - IMPOSTOS SIMPLIFICADO ---------- */}
        <fieldset className="border border-gray-300 rounded p-3 bg-white mb-3">
          <legend className="text-red-700 font-semibold px-2">Impostos</legend>

          {linhaExibida === 1 && (
            <div className="flex gap-3 mb-2">
              <Label>Base ISS</Label>
              <MoneyInput value={impostos.baseISS} onChange={(v) => setImp("baseISS", v)} className="w-[90px]" />
              <Label>Aliq. ISS</Label>
              <MoneyInput value={impostos.aliqISS} onChange={(v) => setImp("aliqISS", v)} className="w-[90px]" />
              <Label>Valor ISS</Label>
              <MoneyInput value={impostos.valorISS} onChange={(v) => setImp("valorISS", v)} className="w-[90px]" />
            </div>
          )}

          {linhaExibida === 2 && (
            <div className="flex gap-3 mb-2">
              <Label>Base ICMS</Label>
              <MoneyInput value={impostos.baseICMS} onChange={(v) => setImp("baseICMS", v)} className="w-[90px]" />
              <Label>Aliq. ICMS</Label>
              <MoneyInput value={impostos.aliqICMS} onChange={(v) => setImp("aliqICMS", v)} className="w-[90px]" />
              <Label>Valor ICMS</Label>
              <MoneyInput value={impostos.valorICMS} onChange={(v) => setImp("valorICMS", v)} className="w-[90px]" />
            </div>
          )}

          {linhaExibida === 3 && (
            <div className="flex gap-3 mb-2">
              <Label>Subst. Trib.</Label>
              <MoneyInput value={impostos.substTrib} onChange={(v) => setImp("substTrib", v)} className="w-[90px]" />
              <Label>Isento ICMS</Label>
              <MoneyInput value={impostos.isentoICMS} onChange={(v) => setImp("isentoICMS", v)} className="w-[90px]" />
            </div>
          )}

          <div>
            <Label className="block mb-1">Observação</Label>
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="w-full h-[90px] border border-gray-300 rounded p-2 text-[13px]"
            />
          </div>
        </fieldset>

        {/* ---------- CARD 4 - RODAPÉ ---------- */}
        <fieldset className="border border-gray-300 rounded p-3 bg-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Label>Nº Cotação</Label>
              <select className="border border-gray-300 rounded h-[26px] text-[13px] px-1 text-black">

                <option>000001</option>
              </select>
              <Text className="w-[80px]" />

              <button
                onClick={() => setShowCarga(true)}
                className="ml-4 border border-gray-300 rounded px-3 py-[4px] text-[12px] hover:bg-gray-100 text-red-700"
              >
                Inf. da Carga
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex items-center gap-1 border border-gray-300 rounded px-3 py-[4px] hover:bg-gray-100 text-red-700 text-[13px]"
              >
                <XCircle size={16} /> Fechar
              </button>
              <button
                onClick={handleGravar}
                className="flex items-center gap-1 border border-gray-300 rounded px-3 py-[4px] hover:bg-gray-100 text-green-700 text-[13px]"
              >
                <Save size={16} /> Gravar e Fechar
              </button>
            </div>
          </div>
        </fieldset>
      </div>

      {/* ---------- MODAL INF. CARGA ---------- */}
      {showCarga && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[600px] p-5 rounded shadow-lg border border-gray-300">
            <h3 className="text-red-700 font-semibold text-[15px] mb-3 border-b pb-1">
              Informações da Carga
            </h3>

            <div className="space-y-2">
              <div>
                <Label>Características da Carga</Label>
                <Text value={caracteristica} onChange={(e) => setCaracteristica(e.target.value)} className="w-full" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Subcontratado (CNPJ)</Label>
                  <Text value={subCnpj} onChange={(e) => setSubCnpj(e.target.value)} className="w-full" />
                </div>
                <div>
                  <Label>Razão Social</Label>
                  <Text value={subRazao} onChange={(e) => setSubRazao(e.target.value)} className="w-full" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Prod. Predominante (Código)</Label>
                  <Text value={prodCod} onChange={(e) => setProdCod(e.target.value)} className="w-full" />
                </div>
                <div>
                  <Label>Descrição</Label>
                  <Text value={prodDesc} onChange={(e) => setProdDesc(e.target.value)} className="w-full" />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowCarga(false)}
                className="border border-gray-300 rounded px-3 py-[4px] hover:bg-gray-100 text-red-700 text-[13px]"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
