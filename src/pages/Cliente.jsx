import { useState } from "react";
import CobrancaBancariaModal from "./CobrancaBancariaModal";
import ClienteContato from "./ClienteContato";
import ClienteAgenda from "./ClienteAgenda";
import ClienteContrato from "./ClienteContrato";
import ClienteTabelaFrete from "./ClienteTabelaFrete";
import { useNavigate } from "react-router-dom";
import { useIconColor } from "../context/IconColorContext";



import {
  XCircle,
  RotateCcw,
  PlusCircle,
  Edit,
  Trash2,
  FileSpreadsheet,
  Users,
  Search,
  FileText,
  Briefcase,
  BookUser,
  Phone,
  CalendarDays,
  FileUp,
} from "lucide-react";

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

export default function Cliente({ open }) {
  const [activeTab, setActiveTab] = useState("cliente");
  const [showParametros, setShowParametros] = useState(false);
  const navigate = useNavigate();

  // 🏠 Endereço (ViaCEP)
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [showCobranca, setShowCobranca] = useState(false);
  const [showContato, setShowContato] = useState(false);
  const [showAgenda, setShowAgenda] = useState(false);
  const [showContrato, setShowContrato] = useState(false);
  const [showTabelaFrete, setShowTabelaFrete] = useState(false);
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();


  async function buscarEndereco(valorCep) {
    try {
      const resp = await fetch(`https://viacep.com.br/ws/${valorCep}/json/`);
      const data = await resp.json();
      if (!data.erro) {
        setEndereco(data.logradouro || "");
        setBairro(data.bairro || "");
        setCidade(data.localidade || "");
        setUf(data.uf || "");
      }
    } catch (e) {
      console.error("Erro ao buscar CEP:", e);
    }
  }


  // 🔧 ESTADOS E FUNÇÕES DO CARD 1
  const [tpDoc, setTpDoc] = useState("CNPJ");
  const [estrangeiro, setEstrangeiro] = useState(false);
  const [doc, setDoc] = useState("");
  const [fone1, setFone1] = useState("");
  const [fone2, setFone2] = useState("");
  const [operacao, setOperacao] = useState("NORMAL");
  // Estados para a aba de consulta
  const [filtros, setFiltros] = useState({
    filial: "TODAS",
    cidade: "",
    uf: "",
    tipoCliente: "Todos",
    tipoDoc: "CNPJ",
    doc: "",
    fantasia: "",
    razao: "",
  });
  const [resultados, setResultados] = useState([]);

  // Simulação de base local (substituir depois por fetch real)
  const baseClientes = [
    {
      filial: "001",
      doc: "50.221.019/0001-36",
      fantasia: "HNK ITU",
      razao: "HNK BR INDUSTRIA DE BEBIDAS LTDA",
      cidade: "ITU",
      uf: "SP",
      tipo: "Correntista",
    },
    {
      filial: "002",
      doc: "12.345.678/0001-90",
      fantasia: "NATURA",
      razao: "NATURA COSMÉTICOS LTDA",
      cidade: "CAJAMAR",
      uf: "SP",
      tipo: "Eventual",
    },
  ];

  const handlePesquisar = () => {
    const f = filtros;
    const filtrados = baseClientes.filter((c) =>
      (f.filial === "TODAS" || c.filial === f.filial) &&
      (f.cidade === "" || c.cidade.toLowerCase().includes(f.cidade.toLowerCase())) &&
      (f.uf === "" || c.uf.toLowerCase() === f.uf.toLowerCase()) &&
      (f.tipoCliente === "Todos" || c.tipo === f.tipoCliente) &&
      (f.doc === "" || c.doc.replace(/\D/g, "").includes(f.doc.replace(/\D/g, ""))) &&
      (f.fantasia === "" || c.fantasia.toLowerCase().includes(f.fantasia.toLowerCase())) &&
      (f.razao === "" || c.razao.toLowerCase().includes(f.razao.toLowerCase()))
    );
    setResultados(filtrados);
  };

  const handleLimpar = () => {
    setFiltros({
      filial: "TODAS",
      cidade: "",
      uf: "",
      tipoCliente: "Todos",
      tipoDoc: "CNPJ",
      doc: "",
      fantasia: "",
      razao: "",
    });
    setResultados([]);
  };



  const onlyDigits = (v = "") => v.replace(/\D+/g, "");

  const maskCNPJ = (v) =>
    onlyDigits(v)
      .slice(0, 14)
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
      .replace(/(\d{4})(\d)/, "$1-$2");

  const maskCPF = (v) =>
    onlyDigits(v)
      .slice(0, 11)
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  const maskPhone = (v) => {
    v = onlyDigits(v).slice(0, 11);
    if (v.length <= 10)
      return v
        .replace(/^(\d{0,2})/, "($1")
        .replace(/^\((\d{2})(\d{0,4})/, "($1) $2")
        .replace(/^\((\d{2})\) (\d{4})(\d{0,4})/, "($1) $2-$3");
    return v
      .replace(/^(\d{0,2})/, "($1")
      .replace(/^\((\d{2})(\d{0,5})/, "($1) $2")
      .replace(/^\((\d{2})\) (\d{5})(\d{0,4})/, "($1) $2-$3");
  };

  const handleDocChange = (e) => {
    const v = e.target.value;
    if (estrangeiro) return setDoc(v);
    setDoc(tpDoc === "CNPJ" ? maskCNPJ(v) : maskCPF(v));
  };

  const toggleParametros = () => setShowParametros(!showParametros);


  return (
    <div
      className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 bg-gray-50 h-[calc(100vh-56px)] flex flex-col ${open ? "ml-[192px]" : "ml-[56px]"
        }`}
    >
      <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
        CADASTRO DE CLIENTE
      </h1>

      {/* === ABAS === */}
      <div className="flex border-b border-gray-300 bg-white">
        {["cliente", "consulta"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1 text-sm font-medium border-t border-x rounded-t-md ${activeTab === tab
              ? "bg-white text-red-700 border-gray-300"
              : "bg-gray-100 text-gray-600 border-transparent"
              } ${tab !== "cliente" ? "ml-1" : ""}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* === CONTEÚDO === */}
      <div className="flex-1 p-3 bg-white border-x border-b border-gray-200 rounded-b-md overflow-y-auto flex flex-col gap-2">

        {/* === ABA CLIENTE === */}
        {activeTab === "cliente" && (
          <>
            {/* === CARD 1 - DADOS CLIENTE === */}
            <div className="border border-gray-300 rounded p-3 bg-white space-y-2 w-full">

              {/* === LINHA 1 — FILIAL / TIPO / DOCUMENTO === */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-1">Filial</Label>
                <Sel className="col-span-5 w-full">
                  <option>001 - MANTRAN TRANSPORTES</option>
                  <option>002 - FILIAL EXEMPLO</option>
                </Sel>

                <Label className="col-span-1">Tp. Cliente</Label>
                <Sel className="col-span-1 w-full">
                  <option>Correntista</option>
                  <option>Eventual</option>
                </Sel>

                <div className="col-span-1 flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={estrangeiro}
                    onChange={(e) => setEstrangeiro(e.target.checked)}
                  />
                  <span className="text-[12px]">Estrang.</span>
                </div>

                <div className="col-span-3 col-start-10 flex items-center gap-1 min-w-0">
                  <Sel
                    className="w-[80px]"
                    value={tpDoc}
                    onChange={(e) => {
                      setTpDoc(e.target.value);
                      setDoc("");
                    }}
                    disabled={estrangeiro}
                  >
                    <option value="CNPJ">CNPJ</option>
                    <option value="CPF">CPF</option>
                  </Sel>

                  <Txt
                    className="flex-1 min-w-0"
                    placeholder={estrangeiro ? "Documento Livre" : tpDoc}
                    value={doc}
                    onChange={handleDocChange}
                    inputMode="numeric"
                  />
                </div>
              </div>

              {/* === LINHA 2 — RAZÃO / FANTASIA === */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-1">Razão Social</Label>
                <Txt className="col-span-5" />

                <Label className="col-span-1">Fantasia</Label>
                <Txt className="col-span-5" />
              </div>

              {/* === LINHA 3 — INSCRIÇÕES / COMISSÕES === */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-1">Inscr. Estadual</Label>
                <Txt className="col-span-2" />

                <Label className="col-span-1">Inscr. Municipal</Label>
                <Txt className="col-span-2" />

                <Label className="col-span-1">% Comissão</Label>
                <Txt className="col-span-1 text-right" inputMode="decimal" />

                <Label className="col-span-2">% Redução ICMS</Label>
                <Txt className="col-span-2 text-right" inputMode="decimal" />
              </div>

              {/* === LINHA 4 — CEP / CIDADE / UF / BAIRRO === */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-1">CEP</Label>
                <Txt
                  className="col-span-2"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                />

                <Label className="col-span-1">Cidade</Label>
                <Txt className="col-span-4" value={cidade} />

                <Txt className="col-span-1 text-center bg-gray-200" readOnly value={uf} />

                <Label className="col-span-1">Bairro</Label>
                <Txt className="col-span-2" value={bairro} />
              </div>

              {/* === LINHA 5 — ENDEREÇO === */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-1">Endereço</Label>
                <Txt className="col-span-6" value={endereco} />

                <Label className="col-span-1">Nº</Label>
                <Txt className="col-span-1 text-center" />

                <Label className="col-span-1">Compl</Label>
                <Txt className="col-span-2" />
              </div>

              {/* === LINHA 6 — EMAIL (NOVA) === */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-1">E-mail</Label>
                <Txt
                  className="col-span-11"
                  placeholder="email@cliente.com.br"
                  inputMode="email"
                />
              </div>

              {/* === LINHA 7 — FONES / ATIV. ECONÔMICA === */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-1">Fone</Label>
                <Txt className="col-span-2" value={fone1} />

                <Label className="col-span-1">Fone 2</Label>
                <Txt className="col-span-2" value={fone2} />

                <Label className="col-span-2">Ativ. Econômica</Label>
                <Sel className="col-span-4 w-full">
                  <option>0001 - SERVIÇO DA MESMA NATUREZA TRAN</option>
                  <option>0002 - ESTAB. INDUSTRIAL NORMAL</option>
                </Sel>
              </div>

              {/* === LINHA 8 — TIPO / SITUAÇÃO / OPERAÇÃO / ICMS === */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-1">Tipo de Carga</Label>
                <Sel className="col-span-2">
                  <option>Mista</option>
                  <option>Fracionada</option>
                  <option>Fechada</option>
                </Sel>

                <Label className="col-span-1">Situação</Label>
                <Sel className="col-span-2">
                  <option>NORMAL</option>
                  <option>INATIVO</option>
                </Sel>

                <Label className="col-span-1">Operação</Label>
                <Sel className="col-span-2">
                  <option>NORMAL</option>
                  <option>BLOQUEADO</option>
                </Sel>

                <Label className="col-span-1">Cond. ICMS</Label>
                <Sel className="col-span-2">
                  <option>Regime de Estimativa</option>
                  <option>Isento</option>
                </Sel>
              </div>

              {/* === LINHA 9 — SEGURADORA / FLAGS / VENDEDOR === */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-1">Seguradora</Label>
                <Sel className="col-span-2">
                  <option>002 - LIBERTY</option>
                  <option>003 - PORTO</option>
                </Sel>

                <div className="col-span-2 flex gap-3 col-start-5 justify-start">
                  <label className="flex items-center gap-1">
                    <input type="checkbox" /> RCF-DC
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" /> RCTR-C
                  </label>
                </div>
                <Label className="col-span-1">Tabela Juros</Label>
                <Sel className="col-span-2">
                  <option> </option>
                  <option>0.00% Juros + Multa de R$ 0.00</option>
                  <option>2.00% Juros + Multa de R$ 0.00</option>
                </Sel>
                <Label className="col-span-1">Vendedor</Label>
                <Txt className="col-span-2" />
              </div>

              {/* === LINHA 10 — TABELA / FRETE / PROTESTO === */}

              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-1">Cód. Cliente</Label>
                <Txt className="col-span-2" />

                <Label className="col-span-1">Cód. Contábil</Label>
                <Txt className="col-span-2" />

                <Label className="col-span-1">Cta Reduzida</Label>
                <Txt className="col-span-2" />

                <Label className="col-span-1">Cta Compl.</Label>
                <Txt className="col-span-2" />
              </div>

              {/* === LINHA 12 — PRAZO / FLAGS / FATURA === */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-1">Prazo Entrega</Label>

                <div className="col-span-2 flex items-center gap-4 min-w-0">
                  {/* Prazo (Horas) */}
                  <div className="flex items-center gap-1 min-w-0">
                    <Txt className="w-[60px] text-right" />
                    <span className="text-[12px] text-gray-600 shrink-0">Hr.</span>
                  </div>

                  {/* Flags */}
                  <label className="flex items-center gap-1 text-[12px] shrink-0">
                    <input type="checkbox" /> Rede
                  </label>

                  <label className="flex items-center gap-1 text-[12px] shrink-0">
                    <input type="checkbox" /> Varejo
                  </label>
                </div>

                <Label className="col-span-1">Vr. Frete Adic.</Label>
                <Txt className="col-span-2 text-right" />
                <Label className="col-span-1 col-start-10">Mod. Fatura Dif.</Label>
                <Txt className="col-span-2" />
              </div>

              {/* === LINHA 13 — OBSERVAÇÃO === */}
              <div className="grid grid-cols-12 gap-2">
                <Label className="col-span-1">Observação</Label>
                <textarea className="col-span-10 border border-gray-300 rounded px-2 py-1" />
              </div>

              {/* === LINHA 14 — INFO FIXA CTe === */}
              <div className="grid grid-cols-12 gap-2">
                <Label className="col-span-1">Info. Fixa CT-e</Label>
                <textarea className="col-span-10 border border-gray-300 rounded px-2 py-1" />
              </div>

            </div>



            {/* === CARD 2 - PARÂMETROS === */}
            <div className="border border-gray-300 rounded bg-white">
              {/* Cabeçalho do card */}
              <div
                onClick={toggleParametros}
                className="flex justify-between items-center px-3 py-1 bg-gray-50 cursor-pointer select-none rounded-t"
              >
                <h2 className="text-red-700 font-semibold text-[13px]">Parâmetros</h2>
                <span className="text-[12px] text-gray-600">
                  {showParametros ? "Ocultar ▲" : "Exibir ▼"}
                </span>
              </div>

              {/* Conteúdo expansível */}
              {showParametros && (
                <div className="p-3 grid grid-cols-4 gap-x-4 gap-y-1 text-[13px]">
                  {[
                    "Cobrar Reentrega",
                    "Inclusão via EDI",
                    "Exibir Tomador",
                    "Apenas CTRC de Serviço",
                    "Localidade Adicional",
                    "Desmonstrativo CTe/NF",
                    "Entrega Diferenciada",
                    "Mostrar observação cliente",
                    "Não permite taxa de coleta CTe Manual",
                    "Origem Frete na Filial",
                    "Destacar ICMS Exportação",
                    "End. entrega observação EDI",
                    "Agrupar CTe por Coleta",
                    "Reter ICMS na emissão da fatura",
                    "Embutir ICMS Analiticamente",
                    "Utiliza crédito de combustível",
                    "ISS Retido",
                    "Considerar Valor Recebimento XML (MultiCTe)",
                    "Gerar CTRC Automático (Serviço)",
                  ].map((label) => (
                    <label key={label} className="flex items-center gap-2 whitespace-nowrap">
                      <input type="checkbox" className="accent-red-700" />
                      {label}
                    </label>
                  ))}
                </div>
              )}

              {/* Linha inferior fixa (status dinâmico) */}
              <div className="border-t border-gray-200 p-2 text-[12px] flex justify-between text-gray-600">
                <div>
                  Status:{" "}
                  <span
                    className={`font-semibold ${operacao === "NORMAL"
                      ? "text-green-700"
                      : operacao === "BLOQUEADO"
                        ? "text-red-700"
                        : "text-gray-500"
                      }`}
                  >
                    {operacao === "NORMAL"
                      ? "Ativo"
                      : operacao === "BLOQUEADO"
                        ? "Bloqueado"
                        : "Indefinido"}
                  </span>
                </div>
                <div>Operador: ADMIN</div>
                <div>Cadastro: 11/11/2025</div>
                <div>Atualização: 11/11/2025</div>
              </div>

            </div>



            {/* === MODAL DE COBRANÇA BANCÁRIA === */}
            <CobrancaBancariaModal
              isOpen={showCobranca}
              onClose={() => setShowCobranca(false)}
            />

            {/* === MODAL DE CONTATO === */}
            <ClienteContato
              isOpen={showContato}
              onClose={() => setShowContato(false)}
            />

            {/* === MODAL DE AGENDA === */}
            <ClienteAgenda
              isOpen={showAgenda}
              onClose={() => setShowAgenda(false)}
            />


            {/* === MODAL DE CONTRATO === */}
            <ClienteContrato
              isOpen={showContrato}
              onClose={() => setShowContrato(false)}
            />

            {/* === MODAL DE TABELA FRETE === */}
            <ClienteTabelaFrete
              isOpen={showTabelaFrete}
              onClose={() => setShowTabelaFrete(false)}
            />

          </>
        )}

        {/* === ABA CONSULTA === */}
        {activeTab === "consulta" && (
          <>
            {/* === CARD DE FILTROS === */}
            <fieldset className="border border-gray-300 rounded p-3 bg-white">
              <legend className="text-red-700 font-semibold px-2 text-[13px]">
                Parâmetros de Pesquisa
              </legend>

              {/* === LINHA 1 — FILIAL / CIDADE / UF / TIPO CLIENTE === */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-1">Filial</Label>
                <Sel
                  className="col-span-3 w-full"
                  value={filtros.filial}
                  onChange={(e) => setFiltros({ ...filtros, filial: e.target.value })}
                >
                  <option>TODAS</option>
                  <option>001 - MANTRAN TECNOLOGIAS LTDA ME</option>
                  <option>002 - MANTRAN TECNOLOGIAS VALINHOS</option>
                </Sel>

                <Label className="col-span-1">Cidade</Label>
                <Txt
                  className="col-span-3"
                  value={filtros.cidade}
                  onChange={(e) => setFiltros({ ...filtros, cidade: e.target.value })}
                />

                <Label className="col-span-1">UF</Label>
                <Sel
                  className="col-span-1 w-full"
                  value={filtros.uf}
                  onChange={(e) =>
                    setFiltros({
                      ...filtros,
                      uf: e.target.value,
                    })
                  }
                >
                  <option value=""></option>
                  <option value="AC">AC</option>
                  <option value="AL">AL</option>
                  <option value="AP">AP</option>
                  <option value="AM">AM</option>
                  <option value="BA">BA</option>
                  <option value="CE">CE</option>
                  <option value="DF">DF</option>
                  <option value="ES">ES</option>
                  <option value="GO">GO</option>
                  <option value="MA">MA</option>
                  <option value="MT">MT</option>
                  <option value="MS">MS</option>
                  <option value="MG">MG</option>
                  <option value="PA">PA</option>
                  <option value="PB">PB</option>
                  <option value="PR">PR</option>
                  <option value="PE">PE</option>
                  <option value="PI">PI</option>
                  <option value="RJ">RJ</option>
                  <option value="RN">RN</option>
                  <option value="RS">RS</option>
                  <option value="RO">RO</option>
                  <option value="RR">RR</option>
                  <option value="SC">SC</option>
                  <option value="SP">SP</option>
                  <option value="SE">SE</option>
                  <option value="TO">TO</option>
                </Sel>


                <Label className="col-span-1">Tipo Cliente</Label>
                <Sel
                  className="col-span-1 w-full"
                  value={filtros.tipoCliente}
                  onChange={(e) =>
                    setFiltros({ ...filtros, tipoCliente: e.target.value })
                  }
                >
                  <option>Todos</option>
                  <option>Eventual</option>
                  <option>Correntista</option>
                </Sel>
              </div>

              {/* === LINHA 2 — DOCUMENTO / FANTASIA / RAZÃO === */}
              <div className="grid grid-cols-12 gap-2 items-center mt-2">
                <Label className="col-span-1">Documento</Label>

                {/* Tipo + Número juntos */}
                <div className="col-span-3 flex items-center gap-1 min-w-0">
                  <Sel
                    className="w-[80px]"
                    value={filtros.tipoDoc}
                    onChange={(e) =>
                      setFiltros({ ...filtros, tipoDoc: e.target.value })
                    }
                  >
                    <option value="CNPJ">CNPJ</option>
                    <option value="CPF">CPF</option>
                  </Sel>

                  <Txt
                    className="flex-1 min-w-0"
                    value={filtros.doc}
                    placeholder={
                      filtros.tipoDoc === "CNPJ"
                        ? "00.000.000/0000-00"
                        : "000.000.000-00"
                    }
                    onChange={(e) =>
                      setFiltros({ ...filtros, doc: e.target.value })
                    }
                  />
                </div>

                <Label className="col-span-1">Fantasia</Label>
                <Txt
                  className="col-span-3"
                  value={filtros.fantasia}
                  onChange={(e) =>
                    setFiltros({ ...filtros, fantasia: e.target.value })
                  }
                />

                <Label className="col-span-1">Razão Social</Label>
                <Txt
                  className="col-span-3"
                  value={filtros.razao}
                  onChange={(e) =>
                    setFiltros({ ...filtros, razao: e.target.value })
                  }
                />
              </div>

              {/* === LINHA 3 — AÇÕES === */}
              <div className="grid grid-cols-12 gap-2 mt-3">
                <div className="col-span-12 flex justify-end gap-2">
                  <button
                    onClick={handleLimpar}
                    className="flex items-center gap-1 border border-gray-300 rounded px-3 py-[4px] text-[12px] hover:bg-gray-100"
                  >
                    <RotateCcw size={14} /> Limpar
                  </button>

                  <button
                    onClick={handlePesquisar}
                    className="flex items-center gap-1 border border-gray-300 rounded px-3 py-[4px] text-[12px] hover:bg-gray-100 text-red-700"
                  >
                    <Search size={14} /> Pesquisar
                  </button>
                </div>
              </div>
            </fieldset>


            {/* === GRID DE RESULTADOS === */}
            <fieldset className="border border-gray-300 rounded p-3 mt-2">
              <legend className="text-red-700 font-semibold px-2">Clientes</legend>

              <div className="border border-gray-300 rounded max-h-[400px] overflow-auto mt-2">
                <table className="min-w-full text-[12px] border-collapse">
                  <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
                    <tr>
                      {[
                        "Filial",
                        "CNPJ/CPF",
                        "Fantasia",
                        "Razão Social",
                        "Cidade",
                        "UF",
                        "Tp Cliente",
                      ].map((col) => (
                        <th key={col} className="border px-2 py-1 text-left">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="text-center text-gray-400 italic py-2 border"
                        >
                          Nenhum registro encontrado
                        </td>
                      </tr>
                    ) : (
                      resultados.map((c, i) => (
                        <tr
                          key={i}
                          onClick={() => setActiveTab("cliente")}
                          className="hover:bg-gray-50 cursor-pointer"
                        >
                          <td className="border px-2 py-1">{c.filial}</td>
                          <td className="border px-2 py-1">{c.doc}</td>
                          <td className="border px-2 py-1">{c.fantasia}</td>
                          <td className="border px-2 py-1">{c.razao}</td>
                          <td className="border px-2 py-1">{c.cidade}</td>
                          <td className="border px-2 py-1">{c.uf}</td>
                          <td className="border px-2 py-1">{c.tipo}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="text-[12px] text-gray-600 mt-2 text-right">
                Total de Registros: {resultados.length}
              </div>
            </fieldset>
          </>
        )}



      </div>
      {/* === RODAPÉ FIXO VISÍVEL AO FINAL === */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-2 flex justify-between mt-auto z-10 shadow-[0_-2px_4px_rgba(0,0,0,0.05)]">
        <div className="flex gap-3">
          {[
            { icon: XCircle, label: "Fechar", action: () => navigate(-1) },

            { icon: RotateCcw, label: "Limpar" },
            { icon: PlusCircle, label: "Incluir" },
            { icon: Edit, label: "Alterar" },
            { icon: Trash2, label: "Excluir" },
          ].map(({ icon: Icon, label, action }) => (
            <button
              key={label}
              onClick={action}
              className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}

            >

              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Botões à direita */}
        <div className="flex gap-3">
          {[
            { icon: FileText, label: "Cobrança Bancária", action: () => setShowCobranca(true) },
            { icon: BookUser, label: "Contato", action: () => setShowContato(true) },
            { icon: CalendarDays, label: "Agenda", action: () => setShowAgenda(true) },
            { icon: Briefcase, label: "Contrato", action: () => setShowContrato(true) },
            { icon: FileSpreadsheet, label: "Tabela Frete", action: () => setShowTabelaFrete(true) },
            { icon: FileUp, label: "Exportar Excel" },
          ].map(({ icon: Icon, label, action }) => (
            <button
              key={label}
              onClick={action}
              className={`flex items-center gap-1 text-[13px] ${footerIconColorNormal} hover:${footerIconColorHover}`}

            >
              <Icon size={16} />
              {label}
            </button>
          ))}

        </div>
      </div>
    </div>
  );
}
