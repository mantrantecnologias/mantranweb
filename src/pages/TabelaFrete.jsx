import { useState, useEffect } from "react";
import TabelaFreteTarifa from "./TabelaFreteTarifa";
import TabelaFreteIncluirTarifa from "./TabelaFreteIncluirTarifa";
import TabelaFreteIncluirFaixa from "./TabelaFreteIncluirFaixa";
import TabelaFretePercurso from "./TabelaFretePercurso";
import TabelaFreteReajuste from "./TabelaFreteReajuste";
import TabelaFreteImportacao from "./TabelaFreteImportacao";
import { useIconColor } from "../context/IconColorContext";


import {
  XCircle,
  RotateCcw,
  PlusCircle,
  Edit,
  Trash2,
  FileSpreadsheet,
  Upload,
  DollarSign,
  Truck,
  Settings,
  Navigation2,
  Percent,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Label({ children, className = "" }) {
  return <label className={`text-[12px] text-gray-600 ${className}`}>{children}</label>;
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
function Sel({ children, ...rest }) {
  return (
    <select
      {...rest}
      className="border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px]"
    >
      {children}
    </select>
  );
}

const parseData = (d) => {
  if (!d) return "";
  const [dia, mes, ano] = d.split("/");
  return `${ano}-${mes}-${dia}`;
};

export default function TabelaFrete({ open }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tabelas");

  // State do formulário (Card 1 principal)
  const [form, setForm] = useState({
    tabela: "001230",
    descricao: "TABELA PADRAO",
    inicio: "2018-01-01",
    termino: "2099-12-31",
    tipo: "C", // C - Cliente, A - Agregado
  });

  // Handler genérico
  const setF = (campo) => (e) => setForm(p => ({ ...p, [campo]: e.target.value }));

  // Função para abrir registro da grid
  const abrirTabela = (dados) => {
    setForm({
      tabela: dados.tabela,
      descricao: dados.descricao,
      inicio: parseData(dados.inicio),
      termino: parseData(dados.termino),
      tipo: dados.tipo
    });
    setActiveTab("tabelas");
  };

  const [copiar, setCopiar] = useState("nao");
  const [mostrarTarifa, setMostrarTarifa] = useState(false);
  const [mostrarIncluirTarifa, setMostrarIncluirTarifa] = useState(false);
  const [mostrarIncluirFaixa, setMostrarIncluirFaixa] = useState(false);
  const [mostrarPercurso, setMostrarPercurso] = useState(false);
  const [mostrarReajuste, setMostrarReajuste] = useState(false);
  const [mostrarImportacao, setMostrarImportacao] = useState(false);
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  useEffect(() => {
    const abrirPercurso = () => setMostrarPercurso(true);
    window.addEventListener("abrirPercurso", abrirPercurso);
    return () => window.removeEventListener("abrirPercurso", abrirPercurso);
  }, []);


  useEffect(() => {
    const abrirIncluirTarifa = () => setMostrarIncluirTarifa(true);
    const abrirIncluirFaixa = () => setMostrarIncluirFaixa(true);

    window.addEventListener("abrirIncluirTarifa", abrirIncluirTarifa);
    window.addEventListener("abrirIncluirFaixa", abrirIncluirFaixa);

    return () => {
      window.removeEventListener("abrirIncluirTarifa", abrirIncluirTarifa);
      window.removeEventListener("abrirIncluirFaixa", abrirIncluirFaixa);
    };
  }, []);

  useEffect(() => {
    const abrirModal = () => setMostrarIncluirTarifa(true);
    window.addEventListener("abrirIncluirTarifa", abrirModal);
    return () => window.removeEventListener("abrirIncluirTarifa", abrirModal);
  }, []);

  // === LÓGICA DA ABA CONSULTA ===
  const [filtroDescricao, setFiltroDescricao] = useState("");
  const [filtroTipoTabela, setFiltroTipoTabela] = useState("");
  const [filtroTipos, setFiltroTipos] = useState([]);
  const [filtroDataInicio, setFiltroDataInicio] = useState("");
  const [filtroDataFim, setFiltroDataFim] = useState("");
  const [filtroVigencia, setFiltroVigencia] = useState("vigentes");

  const tabelas = [
    { empresa: "001", tabela: "000001", descricao: "TABELA PADRAO", inicio: "01/01/2018", termino: "12/12/2026", faixas: 6, cubagem: 300, tpFrete: "Peso", tipo: "C" },
    { empresa: "001", tabela: "000002", descricao: "TABELA VENDA", inicio: "01/03/2024", termino: "30/06/2024", faixas: 2, cubagem: 300, tpFrete: "Veiculo", tipo: "A" },
    { empresa: "001", tabela: "000009", descricao: "IMPORTAÇÃO COMPRA", inicio: "01/01/2024", termino: "04/01/2025", faixas: 5, cubagem: 300, tpFrete: "NF", tipo: "O" },
    { empresa: "001", tabela: "000014", descricao: "TABELA HNK", inicio: "01/01/2018", termino: "12/12/2026", faixas: 6, cubagem: 300, tpFrete: "Peso", tipo: "C" },
    { empresa: "001", tabela: "000016", descricao: "TABELA MARFRIG", inicio: "10/12/2023", termino: "30/06/2026", faixas: 2, cubagem: 300, tpFrete: "Cubagem", tipo: "A" },
    { empresa: "001", tabela: "000020", descricao: "TABELA CASAS BAHIA", inicio: "03/07/2022", termino: "04/12/2025", faixas: 5, cubagem: 300, tpFrete: "NF", tipo: "O" },
    { empresa: "001", tabela: "000025", descricao: "TABELA SAMSUNG", inicio: "01/01/2018", termino: "12/12/2026", faixas: 6, cubagem: 300, tpFrete: "Cubagem", tipo: "C" },
    { empresa: "001", tabela: "000032", descricao: "TABELA JFK", inicio: "01/01/2025", termino: "30/06/2026", faixas: 2, cubagem: 300, tpFrete: "Veiculo", tipo: "A" },
    { empresa: "001", tabela: "000040", descricao: "TABELA MAGAZINE LUIZA", inicio: "01/04/2024", termino: "04/12/2025", faixas: 5, cubagem: 300, tpFrete: "Palets", tipo: "O" },
  ];

  const toggleTipoFiltro = (tipo) => {
    setFiltroTipos((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
    );
  };

  const handleLimpar = () => {
    setFiltroDescricao("");
    setFiltroTipoTabela("");
    setFiltroTipos([]);
    setFiltroDataInicio("");
    setFiltroDataFim("");
    setFiltroVigencia("vigentes");
  };

  const handleLimparForm = () => {
    setForm({
      tabela: "",
      descricao: "",
      inicio: "",
      termino: "",
      tipo: "C",
    });
  };

  const tabelasFiltradas = tabelas.filter((t) => {
    const descMatch = t.descricao.toLowerCase().includes(filtroDescricao.toLowerCase());
    const tipoMatch = !filtroTipoTabela || t.tipo === filtroTipoTabela;
    const tipoTabelaMatch = filtroTipos.length === 0 || filtroTipos.includes(t.tpFrete);
    const inicioOk = !filtroDataInicio || new Date(t.inicio) >= new Date(filtroDataInicio);
    const fimOk = !filtroDataFim || new Date(t.termino) <= new Date(filtroDataFim);
    return descMatch && tipoMatch && tipoTabelaMatch && inicioOk && fimOk;
  });


  return (
    <div
      className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 bg-gray-50 h-[calc(100vh-56px)] flex flex-col ${open ? "ml-[192px]" : "ml-[56px]"
        }`}
    >
      {/* ====== TÍTULO ====== */}
      <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
        TABELA DE FRETE
      </h1>

      {/* ====== ABAS ====== */}
      <div className="flex border-b border-gray-300 bg-white">
        {["tabelas", "consulta"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1 text-sm font-medium border-t border-x rounded-t-md ${activeTab === tab
              ? "bg-white text-red-700 border-gray-300"
              : "bg-gray-100 text-gray-600 border-transparent"
              } ${tab !== "tabelas" ? "ml-1" : ""}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ====== CONTEÚDO ====== */}
      <div className="flex-1 p-3 bg-white border-x border-b border-gray-200 rounded-b-md overflow-y-auto flex flex-col gap-3">

        {/* ===================== ABA TABELAS ===================== */}
        {activeTab === "tabelas" && (
          <>
            {/* === CARD 1 - Dados da Tabela === */}
            <fieldset className="border border-gray-300 rounded p-3">
              <legend className="text-red-700 font-semibold px-2">Dados Principais</legend>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <Label>Tabela</Label>
                  <Txt value={form.tabela} onChange={setF("tabela")} className="w-[80px] text-center" />
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <Label>Descrição</Label>
                  <Txt value={form.descricao} onChange={setF("descricao")} className="flex-1" />
                </div>
                <div className="flex items-center gap-2">
                  <Label>Tipo</Label>
                  <Sel value={form.tipo} onChange={setF("tipo")} className="w-[120px]">
                    <option value="C">C - Cliente</option>
                    <option value="A">A - Agregado</option>
                    <option value="O">O - Outros</option>
                  </Sel>
                </div>
                <div className="flex items-center gap-2">
                  <Label>Vigência</Label>
                  <Txt type="date" value={form.inicio} onChange={setF("inicio")} />
                  <span className="text-gray-500">a</span>
                  <Txt type="date" value={form.termino} onChange={setF("termino")} />
                </div>
              </div>
            </fieldset>

            {/* === CARD 2 - Valores e Taxas === */}
            <fieldset className="border border-gray-300 rounded p-2 mt-0">

              <div className="grid grid-cols-4 gap-4">
                {/* ==== COLUNA 1 ==== */}
                <div className="flex flex-col gap-[4px]">
                  {[
                    "Valor Despacho",
                    "CAT",
                    "ADEME %NF",
                    "Vr. Mínimo ADEME",
                    "% Desc. Devolução",
                    "% Sobre Frete Comb.",
                    "Taxa Emissão DTA",
                    "% Dific. Acesso TDA",
                    "Taxa Ajudante",
                    "% Taxa ANVISA",
                    "Vr. ANVISA",
                    "% Peso Excedente",
                    "Vr. KM Rodado",
                  ].map((label, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <Label className="whitespace-nowrap mr-2">{label}</Label>
                      <Txt className="w-[110px] text-right" defaultValue="0,00" />
                    </div>
                  ))}
                </div>

                {/* ==== COLUNA 2 ==== */}
                <div className="flex flex-col gap-[4px]">
                  {[
                    "Valor ITR",
                    "Rateio Pedágio 100 Kg",
                    "Fração Pedágio 100 Kg",
                    "Faixa Pedágio",
                    "Valor Mínimo Frete",
                    "Alíquota PIS",
                    "% Desc. Advalorem",
                    "Vr. Min. Dific. Acesso",
                    "Taxa Emissão CTRC",
                    "% Taxa Cancelamento",
                    "% Extra Frete",
                    "Vr. Carga Refrigerada",
                    "Qtde. KM Franquia",
                  ].map((label, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <Label className="whitespace-nowrap mr-2">{label}</Label>
                      <Txt className="w-[110px] text-right" defaultValue="0,00" />
                    </div>
                  ))}
                </div>

                {/* ==== COLUNA 3 ==== */}
                <div className="flex flex-col gap-[4px]">
                  {[
                    "Vr. Mínimo Total Frete",
                    "Vr. Mínimo Devolução",
                    "Vr. Mínimo Reentrega",
                    "Vr. Mínimo Seguro",
                    "% Sobre Frete NF",
                    "Alíquota Cofins",
                    "Valor KM Excedente",
                    "% Restrição Trans-TRT",
                    "% Impostos Suspensos",
                    "% Taxa Frete Morto",
                    "% Taxa Frete Retorno",
                    "Carga Refrigerada",
                    "% Montoramento",
                  ].map((label, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <Label className="whitespace-nowrap mr-2">{label}</Label>
                      <Txt className="w-[110px] text-right" defaultValue="0,00" />
                    </div>
                  ))}
                </div>

                {/* ==== COLUNA 4 ==== */}
                <div className="flex flex-col gap-[4px]">
                  {[
                    "% Desc. Reentrega",
                    "Gris (% Sobre NF)",
                    "Vr. Mínimo GRIS",
                    "Fator conv. M³/P/Kg",
                    "Faixa ITR",
                    "% Dific. Entrega-TDE",
                    "Vr. Min. Dific. Entrega",
                    "TX Dev. Canhoto-TDC",
                    "% VR IMO (Carga Perigosa)",
                    "Vr. IMO (Carga Perigosa)",
                    "Vr. IMO (Adeisivagem)",
                    "% Ad. Dias Não-Úteis",
                  ].map((label, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <Label className="whitespace-nowrap mr-2">{label}</Label>
                      <Txt
                        className={`w-[110px] text-right ${label === "Fator conv. M³/P/Kg"
                          ? "font-semibold text-gray-800 bg-gray-50"
                          : ""
                          }`}
                        defaultValue={label === "Fator conv. M³/P/Kg" ? "300,00" : "0,00"}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </fieldset>

            {/* === LINHA COM 2 CARDS === */}
            <div className="flex gap-2 mt-0">
              {/* === CARD 3 - Informações Rateio === */}
              <fieldset className="border border-gray-300 rounded p-3 flex-[2]">
                <legend className="text-red-700 font-semibold px-2">Informações Rateio</legend>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1">
                      <input type="checkbox" defaultChecked />
                      Rateio Frete
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="checkbox" defaultChecked />
                      Rateio Pedágio
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="checkbox" defaultChecked />
                      Rateio Frete ADV
                    </label>
                  </div>

                  <Sel className="w-[220px]">
                    <option>P - Rateio por Peso</option>
                    <option>V - Rateio por Valor</option>
                    <option>D - Rateio por Distância</option>
                  </Sel>
                </div>
              </fieldset>

              {/* === CARD 4 - Informações Peso === */}
              <fieldset className="border border-gray-300 rounded p-3 flex-[1.2]">
                <legend className="text-red-700 font-semibold px-2">Informações Peso</legend>

                <div className="flex items-center justify-start gap-6">
                  <label className="flex items-center gap-1">
                    <input type="checkbox" />
                    Somar tara ao peso
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" />
                    Arredonda Peso
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" />
                    Peso Excedente
                  </label>
                </div>
              </fieldset>
            </div>



            {/* === CARD 6 - Informações Adicionais === */}
            <fieldset className="border border-gray-300 rounded p-2 mt-0">
              <legend className="text-red-700 font-semibold px-2">Informações Adicionais</legend>

              <div className="flex items-center justify-between px-2">
                <label className="flex items-center gap-1">
                  <input type="checkbox" defaultChecked />
                  Faixa de CEP por referência (Padrão)
                </label>

                <label className="flex items-center gap-1">
                  <input type="checkbox" />
                  Assumir frete mínimo líquido
                </label>

                <label className="flex items-center gap-1">
                  <input type="checkbox" />
                  Não calc. % IMO peso excedente
                </label>

                <label className="flex items-center gap-1">
                  <input type="checkbox" />
                  Pedágio já pago pelo Cliente. Não embute valor no Frete
                </label>
              </div>
            </fieldset>


            {/* === CARD 7 e 8 lado a lado === */}
            <div className="flex gap-2 mt-3">
              {/* === CARD 7 - Tipo de Tabela === */}
              <fieldset className="border border-gray-300 rounded p-3 flex-[2]">
                <legend className="text-red-700 font-semibold px-2">Tipo de Tabela</legend>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-1">
                      <input type="radio" name="tipoTabela" defaultChecked /> Faixa Peso
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="tipoTabela" /> Cubagem
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="tipoTabela" /> Paletes
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="tipoTabela" /> % Sobre NF
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="tipoTabela" /> Tipo de Veículo
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="tipoTabela" /> KM
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label className="whitespace-nowrap">Qt. Fx Peso</Label>
                    <Txt className="w-[60px] text-center" defaultValue="4" />
                  </div>
                </div>
              </fieldset>

              {/* === CARD 8 - Ações === */}
              <fieldset className="border border-gray-300 rounded p-3 mt-0">
                <legend className="text-red-700 font-semibold px-2">Outras Taxas</legend>

                <div className="flex items-center justify-between gap-2">
                  {[
                    { icon: FileSpreadsheet, label: "Plataforma" },
                    { icon: Percent, label: "Agravo" },
                    { icon: DollarSign, label: "Incentivo" },
                    { icon: Truck, label: "Empresa" },
                    { icon: Settings, label: "Estadia" },
                  ].map(({ icon: Icon, label }) => (
                    <button
                      key={label}
                      className="flex items-center gap-2 border border-gray-300 rounded px-3 py-1.5 text-[13px] hover:bg-gray-100 text-gray-700 transition"
                    >
                      <Icon size={15} className="text-red-700" />
                      {label}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>


            {/* === CARD 9 - Adicionais === */}
            <fieldset className="border border-gray-300 rounded p-3">
              <legend className="text-red-700 font-semibold px-2">Adicionais</legend>
              <div className="grid grid-cols-4 gap-2">
                <div className="flex items-center gap-2 col-span-2">
                  <Label>Observação</Label>
                  <Txt className="flex-1" />
                </div>
                <div className="flex items-center gap-2">
                  <Label>Operador</Label>
                  <Txt className="w-full text-center bg-gray-100" defaultValue="SUPORTE" readOnly />
                </div>
                <div className="flex items-center gap-2">
                  <Label>Inclusão</Label>
                  <Txt className="w-full text-center bg-gray-100" defaultValue="04/11/2025" readOnly />
                </div>
              </div>
            </fieldset>
          </>
        )}

        {/* ===================== ABA CONSULTA ===================== */}
        {activeTab === "consulta" && (
          <>
            <div className="flex gap-3">
              {/* === CARD 1 - FILTROS === */}
              <fieldset className="border border-gray-300 rounded p-3 flex-[2]">
                <legend className="text-red-700 font-semibold px-2">Filtros</legend>

                <div className="flex items-center gap-2 mb-2">
                  <Label className="w-[90px] text-right">Descrição</Label>
                  <Txt
                    type="text"
                    placeholder="Pesquisar descrição..."
                    value={filtroDescricao}
                    onChange={(e) => setFiltroDescricao(e.target.value)}
                    className="flex-1"
                  />
                  <Sel
                    value={filtroTipoTabela}
                    onChange={(e) => setFiltroTipoTabela(e.target.value)}
                    className="w-[180px]"
                  >
                    <option value="">Todos</option>
                    <option value="C">C - Cliente</option>
                    <option value="A">A - Agregado</option>
                    <option value="O">O - Compra</option>
                  </Sel>
                </div>

                <div className="flex flex-wrap gap-4 pl-[90px]">
                  {["Peso", "Cubagem", "Palets", "% Sobre NF", "Veiculo", "Km"].map((tipo) => (
                    <label key={tipo} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={filtroTipos.includes(tipo)}
                        onChange={() => toggleTipoFiltro(tipo)}
                      />
                      {tipo}
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* === CARD 2 - PERÍODO === */}
              <fieldset className="border border-gray-300 rounded p-3 flex-[1.5]">
                <legend className="text-red-700 font-semibold px-2">Período de Vigência</legend>

                <div className="flex items-center gap-2 mb-2">
                  <Label className="w-[60px] text-right">De</Label>
                  <Txt
                    type="date"
                    value={filtroDataInicio}
                    onChange={(e) => setFiltroDataInicio(e.target.value)}
                  />
                  <Label className="w-[40px] text-right">Até</Label>
                  <Txt
                    type="date"
                    value={filtroDataFim}
                    onChange={(e) => setFiltroDataFim(e.target.value)}
                  />
                </div>

                <div className="flex gap-4 justify-center">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="vigencia"
                      value="vigentes"
                      checked={filtroVigencia === "vigentes"}
                      onChange={(e) => setFiltroVigencia(e.target.value)}
                    />
                    Somente Vigentes
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="vigencia"
                      value="vencidas"
                      checked={filtroVigencia === "vencidas"}
                      onChange={(e) => setFiltroVigencia(e.target.value)}
                    />
                    Vencidas / Não Vigentes
                  </label>
                </div>
              </fieldset>

              {/* === CARD 3 - BOTÕES === */}
              <fieldset className="border border-gray-300 rounded p-3 flex-[0.8] flex flex-col justify-center items-center gap-3">
                <button
                  onClick={() => { }}
                  className="flex items-center gap-2 border border-gray-300 rounded px-4 py-1 hover:bg-gray-100 text-red-700 text-sm font-medium"
                >
                  <Navigation2 size={16} /> Pesquisar
                </button>
                <button
                  onClick={handleLimpar}
                  className="flex items-center gap-2 border border-gray-300 rounded px-4 py-1 hover:bg-gray-100 text-red-700 text-sm font-medium"
                >
                  <RotateCcw size={16} /> Limpar
                </button>
              </fieldset>
            </div>

            {/* === CARD 4 - GRID === */}
            <fieldset className="border border-gray-300 rounded p-0 mt-3 overflow-hidden">
              <legend className="text-red-700 font-semibold px-2">Resultados</legend>
              <table className="min-w-full border-collapse text-[13px]">
                <thead className="bg-gray-200 text-gray-800 font-semibold text-center">
                  <tr>
                    <th className="border border-gray-300 px-2 py-1">Empresa</th>
                    <th className="border border-gray-300 px-2 py-1">Tabela</th>
                    <th className="border border-gray-300 px-2 py-1">Descrição</th>
                    <th className="border border-gray-300 px-2 py-1">Início</th>
                    <th className="border border-gray-300 px-2 py-1">Término</th>
                    <th className="border border-gray-300 px-2 py-1">Faixas</th>
                    <th className="border border-gray-300 px-2 py-1">Cubagem</th>
                    <th className="border border-gray-300 px-2 py-1">TP Frete</th>
                    <th className="border border-gray-300 px-2 py-1">Tabela</th>
                  </tr>
                </thead>
                <tbody>
                  {tabelasFiltradas.map((t, i) => (
                    <tr
                      key={i}
                      onClick={() => abrirTabela(t)}
                      className={`text-center cursor-pointer ${i % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-orange-100`}
                    >
                      <td className="border border-gray-300 px-2 py-[3px]">{t.empresa}</td>
                      <td className="border border-gray-300 px-2 py-[3px]">{t.tabela}</td>
                      <td className="border border-gray-300 px-2 py-[3px]">{t.descricao}</td>
                      <td className="border border-gray-300 px-2 py-[3px]">{t.inicio}</td>
                      <td className="border border-gray-300 px-2 py-[3px]">{t.termino}</td>
                      <td className="border border-gray-300 px-2 py-[3px]">{t.faixas}</td>
                      <td className="border border-gray-300 px-2 py-[3px]">{t.cubagem}</td>
                      <td className="border border-gray-300 px-2 py-[3px]">{t.tpFrete}</td>
                      <td className="border border-gray-300 px-2 py-[3px]">{t.tipo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-right text-[12px] px-3 py-1 bg-gray-50 border-t border-gray-300">
                Total de Registros: {tabelasFiltradas.length}
              </div>
            </fieldset>
          </>
        )}


      </div>
      {/* ===================== RODAPÉ ===================== */}
      <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center justify-between text-red-700 
  sticky bottom-0 left-0 right-0 z-50 shadow-md">

        <div className="flex items-center gap-5 text-red-700">
          {[
            { icon: XCircle, label: "Fechar", action: () => navigate(-1) },
            { icon: RotateCcw, label: "Limpar", action: handleLimparForm },
            { icon: PlusCircle, label: "Incluir" },
            { icon: Edit, label: "Alterar" },
            { icon: Trash2, label: "Excluir" },
            { icon: DollarSign, label: "Tarifa", action: () => setMostrarTarifa(true) },
            { icon: Navigation2, label: "Percurso", action: () => window.dispatchEvent(new CustomEvent("abrirPercurso")) },
            { icon: Percent, label: "Reajuste", action: () => setMostrarReajuste(true) },
            { icon: Upload, label: "Importar", action: () => setMostrarImportacao(true) },
          ].map(({ icon: Icon, label, action }) => (
            <button
              key={label}
              onClick={action}
              title={label}
              className={`flex flex-col items-center text-[11px] transition ${footerIconColorNormal} hover:${footerIconColorHover}`}

            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}

          {mostrarTarifa && (
            <TabelaFreteTarifa
              open={open}
              onClose={() => setMostrarTarifa(false)}
            />
          )}

          {mostrarIncluirTarifa && (
            <TabelaFreteIncluirTarifa onClose={() => setMostrarIncluirTarifa(false)} />
          )}

          {mostrarIncluirFaixa && (
            <TabelaFreteIncluirFaixa onClose={() => setMostrarIncluirFaixa(false)} />
          )}

          {mostrarPercurso && (
            <TabelaFretePercurso onClose={() => setMostrarPercurso(false)} />
          )}

          {mostrarReajuste && (
            <TabelaFreteReajuste onClose={() => setMostrarReajuste(false)} />
          )}


          {mostrarImportacao && (
            <TabelaFreteImportacao onClose={() => setMostrarImportacao(false)} />
          )}

        </div>
      </div>
    </div>
  );
}
