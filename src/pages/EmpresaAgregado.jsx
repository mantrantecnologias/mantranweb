import { useState } from "react";
import EmpresaAgregadoTabelaFrete from "./EmpresaAgregadoTabelaFrete";
import EmpresaAgregadoVeiculos from "./EmpresaAgregadoVeiculos";
import EmpresaAgregadoMotorista from "./EmpresaAgregadoMotorista";
import { useIconColor } from "../context/IconColorContext";
import InputBuscaCidade from "../components/InputBuscaCidade";




import {
  XCircle,
  RotateCcw,
  PlusCircle,
  Edit,
  Trash2,
  FileSpreadsheet,
  Users,
  Truck,
  CalendarDays,
  Search,
} from "lucide-react";

/* ===============================
    Helpers
=============================== */
function Label({ children, className = "" }) {
  return (
    <label
      className={`text-[12px] text-gray-700 flex items-center ${className}`}
    >
      {children}
    </label>
  );
}

function Txt({ className = "", readOnly, ...props }) {
  return (
    <input
      {...props}
      readOnly={readOnly}
      className={`
        border border-gray-300 rounded px-2 py-[2px] h-[26px] text-[13px]
        ${readOnly ? "bg-gray-200" : "bg-white"}
        ${className}
      `}
    />
  );
}


function Sel({ children, className = "", ...rest }) {
  return (
    <select
      {...rest}
      className={`border border-gray-300 rounded px-2 py-[2px] h-[26px] text-[13px] ${className}`}
    >
      {children}
    </select>
  );
}

/* ===============================
    Máscaras
=============================== */
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

const maskCEP = (v) =>
  onlyDigits(v)
    .slice(0, 8)
    .replace(/^(\d{5})(\d)/, "$1-$2");

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

/* ===============================
    ViaCEP
=============================== */
async function buscarCEP(cep) {
  try {
    const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const d = await r.json();
    if (!d.erro) {
      return {
        endereco: d.logradouro || "",
        bairro: d.bairro || "",
        cidade: d.localidade || "",
        uf: d.uf || "",
      };
    }
  } catch (e) {
    console.log("Erro CEP", e);
  }
  return {};
}

/* ===============================
    COMPONENTE PRINCIPAL
=============================== */
export default function EmpresaAgregado({ open }) {
  const [aba, setAba] = useState("cadastro");
  const [showAdicionais, setShowAdicionais] = useState(true);
  const [showTabelaFrete, setShowTabelaFrete] = useState(false);
  const [showVeiculos, setShowVeiculos] = useState(false);
  const [showMotoristas, setShowMotoristas] = useState(false);
  const {
    footerIconColorNormal,
    footerIconColorHover
  } = useIconColor();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const currentTab = parseInt(e.target.getAttribute("tabindex"));
      const nextTab = currentTab + 1;
      const nextEl = document.querySelector(`[tabindex="${nextTab}"]`);
      if (nextEl) nextEl.focus();
    }
  };

  /* ======== ESTADO DO CADASTRO ======== */
  const [tpDoc, setTpDoc] = useState("CNPJ");
  const [doc, setDoc] = useState("");
  const [dados, setDados] = useState({
    ie: "",
    rntrc: "",
    tipo: "Agregado",
    tpAgregado: "TAC",
    razao: "",
    cep: "",
    endereco: "",
    bairro: "",
    cidade: "",
    uf: "",
    fone1: "",
    fone2: "",
    contrato: "",
    desligamento: "",
    filialVinculo: "",
    banco: "",
    agencia: "",
    conta: "",
    pix: "",
    contato: "",
    favorecido: "",
    obs: "",
    pis: "",
    dependentes: "",
    ciot: "",
    pagBloq: "",
    rg: "",
    dtemissao: "",
    ufemissao: "",
    cpf: "",
    estadoCivil: "",
    nascimento: "",
    localNasc: "",
    sexo: "",
    tabelaFrete: "",
    tipoConta: "",
    capacitador: "",
  });

  const handleDocChange = (e) => {
    const v = e.target.value;
    setDoc(tpDoc === "CNPJ" ? maskCNPJ(v) : maskCPF(v));
  };

  const handleChange = async (e) => {
    let { name, value } = e.target;

    if (name === "cep") {
      value = maskCEP(value);
      if (onlyDigits(value).length === 8) {
        const cepData = await buscarCEP(onlyDigits(value));
        setDados((prev) => ({ ...prev, ...cepData }));
      }
    }

    if (name === "fone1" || name === "fone2") {
      value = maskPhone(value);
    }

    setDados((prev) => ({ ...prev, [name]: value }));
  };

  /* ======== LISTA PARA CONSULTA ======== */
  const [lista, setLista] = useState([
    {
      id: 1,
      tpDoc: "CNPJ",
      doc: "06.083.981/0001-42",
      razao: "FRIENDS TRANSPORTES E COMUNICAÇÕES EIREL",
      ie: "254708108188",
      endereco: "ROD BR 101 - KM 120 SALA1",
      bairro: "SAO VICENTE",
      cidade: "ITAJAI",
      cep: "88301-600",
      uf: "SC",
      contrato: "2025-01-12",
      desligamento: "",
      fone1: "(47) 99999-1111",
      fone2: "",
      banco: "237",
      agencia: "1234",
      conta: "98765-0",
      obs: "",
      tipo: "Agregado",
      tpAgregado: "TAC",
      pagBloq: "Não",
      favorecido: "FRIENDS TRANSPORTES",
      pis: "123456",
      dependentes: "2",
      nascimento: "1990-05-12",
      ciot: "123456789",
      tabelaFrete: "000000 - TABELA PADRÃO",
      dtIncl: "2025-01-01",
      situacao: "Ativos",
    },

    {
      id: 2,
      tpDoc: "CNPJ",
      doc: "91.444.750/0001-03",
      razao: "FRIGORIFICO LAGOEANSE LTDA",
      ie: "1140041964",
      endereco: "EST RS 030",
      bairro: "LAGOA DOS BARROS",
      cidade: "SANTO ANTONIO",
      cep: "95500-000",
      uf: "RS",
      contrato: "2025-02-01",
      desligamento: "",
      fone1: "(51) 99888-2222",
      fone2: "",
      banco: "001",
      agencia: "0001",
      conta: "12345-6",
      obs: "",
      tipo: "Agregado",
      tpAgregado: "ETC",
      pagBloq: "Não",
      favorecido: "FRIGORIFICO LAGOEANSE",
      pis: "654321",
      dependentes: "1",
      nascimento: "1985-01-20",
      ciot: "",
      tabelaFrete: "000001 - MARFRIG",
      dtIncl: "2025-01-05",
      situacao: "Ativos",
    },
  ]);



  const [filtros, setFiltros] = useState({
    razao: "",
    cidade: "",
    doc: "",
    tipo: "Todos",
    tpAgregado: "Todos",
    empresa: "Todos",
    situacao: "Todos",
    dtIncl: "",
    usarData: false,
  });

  const handlePesquisar = () => {
    const res = lista.filter((l) => {
      const condRazao =
        !filtros.razao ||
        l.razao?.toLowerCase().includes(filtros.razao.toLowerCase());

      const condCidade =
        !filtros.cidade ||
        l.cidade?.toLowerCase().includes(filtros.cidade.toLowerCase());

      const condDoc =
        !filtros.doc ||
        l.doc.replace(/\D+/g, "").includes(filtros.doc.replace(/\D+/g, ""));

      const condTipo =
        filtros.tipo === "Todos" || l.tipo === filtros.tipo;

      const condTpAgregado =
        filtros.tpAgregado === "Todos" || l.tpAgregado === filtros.tpAgregado;

      const condEmpresa =
        filtros.empresa === "Todos" ||
        (filtros.empresa === "Pessoa Física" && l.doc.replace(/\D+/g, "").length <= 11) ||
        (filtros.empresa === "Pessoa Jurídica" && l.doc.replace(/\D+/g, "").length > 11);

      const condSituacao =
        filtros.situacao === "Todos" || l.situacao === filtros.situacao;

      const condData =
        !filtros.usarData || l.dtIncl === filtros.dtIncl;

      return (
        condRazao &&
        condCidade &&
        condDoc &&
        condTipo &&
        condTpAgregado &&
        condEmpresa &&
        condSituacao &&
        condData
      );
    });

    setResultados(res);
  };

  const [resultados, setResultados] = useState([]);

  const handleIncluir = () => {
    const novo = {
      id: Date.now(),
      tpDoc,
      doc,
      ...dados,
      dtIncl: new Date().toISOString().slice(0, 10),
      situacao: "Ativos",
    };

    setLista((prev) => [...prev, novo]);
    alert("Registro incluído com sucesso!");
  };


  const handleExcluir = () => {
    setLista((prev) => prev.filter((i) => i.doc !== doc));
    alert("Registro removido!");
  };

  const handleLimpar = () => {
    setDoc("");
    setDados({
      ...Object.keys(dados).reduce((o, k) => ({ ...o, [k]: "" }), {}),
    });
  };

  const selecionarLinha = (item) => {
    setAba("cadastro");
    setTpDoc(item.tpDoc);
    setDoc(item.doc);
    setDados({ ...item });
  };

  /* ===============================
      RENDER
  ================================ */
  return (
    <div
      className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 bg-gray-50 h-[calc(100vh-56px)] flex flex-col ${open ? "ml-[192px]" : "ml-[56px]"
        }`}
    >
      <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
        EMPRESA AGREGADO
      </h1>

      {/* ======== ABAS ======== */}
      <div className="flex border-b bg-white">
        {["cadastro", "consulta"].map((t) => (
          <button
            key={t}
            onClick={() => setAba(t)}
            className={`px-4 py-1 text-sm font-medium border-t border-x rounded-t-md ${aba === t
              ? "bg-white text-red-700 border-gray-300"
              : "bg-gray-100 text-gray-600 border-transparent"
              } ${t !== "cadastro" ? "ml-1" : ""}`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {/* CONTAINER INTERNO */}
      <div className="flex flex-col flex-1 min-h-0">

        {/* CONTEÚDO COM SCROLL */}
        <div className="flex-1 overflow-y-auto p-3 bg-white border-x border-b border-gray-200 rounded-b-md">

          {/* ==================================================
                ABA CADASTRO
        ================================================== */}
          {aba === "cadastro" && (
            <>
              {/* ---------------------------------------------------
    CARD 1 - DADOS EMPRESA
--------------------------------------------------- */}
              <fieldset className="border border-gray-300 rounded px-3 pt-1 pb-3 mb-3 bg-white">
                <legend className="px-2 text-red-700 font-semibold text-[13px]">
                  Dados Empresa
                </legend>

                {/* ===== LINHA 1 ===== */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  {/* Tipo Documento */}
                  <Label className="col-span-1 justify-end">Doc</Label>
                  <Sel
                    className="col-span-1 w-full"
                    value={tpDoc}
                    onChange={(e) => {
                      setTpDoc(e.target.value);
                      setDoc("");
                    }}
                    onKeyDown={handleKeyDown}
                    tabIndex={1}
                  >
                    <option>CNPJ</option>
                    <option>CPF</option>
                  </Sel>

                  {/* Nº Documento */}
                  <Txt
                    className="col-span-2"
                    value={doc}
                    onChange={handleDocChange}
                    onKeyDown={handleKeyDown}
                    tabIndex={2}
                    placeholder={tpDoc}
                  />

                  <Label className="col-span-1 justify-end">IE</Label>
                  <Txt
                    className="col-span-2"
                    name="ie"
                    value={dados.ie}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    tabIndex={3}
                  />

                  <Label className="col-span-1 justify-end">RNTRC</Label>
                  <Txt
                    className="col-span-1"
                    name="rntrc"
                    value={dados.rntrc}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    tabIndex={4}
                  />

                  <Label className="col-span-1 justify-end">Tipo</Label>

                  {/* Wrapper dos dois selects ocupando 2 colunas */}
                  <div className="col-span-2 grid grid-cols-12 gap-2">
                    {/* Tipo (maior) */}
                    <Sel
                      className="col-span-7 w-full"
                      name="tipo"
                      value={dados.tipo}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      tabIndex={5}
                    >
                      <option>Agregado</option>
                      <option>Terceirizado</option>
                      <option>Cooperativa</option>
                    </Sel>

                    {/* TAC / ETC (menor) */}
                    <Sel
                      className="col-span-5 w-full text-center"
                      name="tpAgregado"
                      value={dados.tpAgregado}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      tabIndex={6}
                    >
                      <option>TAC</option>
                      <option>ETC</option>
                    </Sel>
                  </div>

                </div>

                {/* ===== LINHA 2 ===== */}
                <div className="grid grid-cols-12 gap-2 items-center mt-2">


                  <Label className="col-span-1 justify-end">Razão Social</Label>
                  <Txt
                    className="col-span-11"
                    name="razao"
                    value={dados.razao}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    tabIndex={7}
                  />
                </div>

                {/* ===== LINHA 3 ===== */}
                <div className="grid grid-cols-12 gap-2 items-center mt-2">
                  <Label className="col-span-1 justify-end">CEP</Label>
                  <Txt
                    className="col-span-1"
                    name="cep"
                    value={dados.cep}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    tabIndex={8}
                  />

                  <Label className="col-span-1 justify-end">Endereço</Label>
                  <Txt
                    className="col-span-6"
                    name="endereco"
                    value={dados.endereco}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    tabIndex={9}
                  />

                  <Label className="col-span-1 justify-end">Bairro</Label>
                  <Txt
                    className="col-span-2"
                    name="bairro"
                    value={dados.bairro}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    tabIndex={10}
                  />
                </div>

                {/* ===== LINHA 4 ===== */}
                <div className="grid grid-cols-12 gap-2 items-center mt-2">
                  <Label className="col-span-1 justify-end">Cidade</Label>
                  <InputBuscaCidade
                    label={null}
                    className="col-span-4"
                    value={dados.cidade}
                    onChange={(e) => setDados({ ...dados, cidade: e.target.value })}
                    onSelect={(city) => {
                      setDados((prev) => ({
                        ...prev,
                        cidade: city.nome,
                        cep: maskCEP(city.cep),
                        uf: city.uf,
                      }));
                      setTimeout(() => document.querySelector('[tabindex="12"]')?.focus(), 10);
                    }}
                    tabIndex={11}
                  />


                  <Txt
                    className="col-span-1 text-center bg-gray-200"
                    readOnly
                    name="uf"
                    maxLength={2}
                    value={dados.uf}
                    onChange={handleChange}
                  />

                  <Label className="col-span-1 justify-end">Fone</Label>
                  <Txt
                    className="col-span-2"
                    name="fone1"
                    value={dados.fone1}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    tabIndex={12}
                  />

                  <Label className="col-span-1 justify-end">Fone 2</Label>
                  <Txt
                    className="col-span-2"
                    name="fone2"
                    value={dados.fone2}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    tabIndex={13}
                  />
                </div>

                {/* ===== LINHA 5 ===== */}
                <div className="grid grid-cols-12 gap-2 items-center mt-2">
                  <Label className="col-span-1 justify-end">Contrato</Label>
                  <Txt
                    type="date"
                    className="col-span-2"
                    name="contrato"
                    value={dados.contrato}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    tabIndex={14}
                  />

                  <Label className="col-span-1 justify-end">Desligamento</Label>
                  <Txt
                    type="date"
                    className="col-span-2"
                    name="desligamento"
                    value={dados.desligamento}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    tabIndex={15}
                  />

                  <Label className="col-span-1 justify-end">Filial Vínculo</Label>

                  <Sel
                    className="col-span-5 w-full"
                    name="filialVinculo"
                    value={dados.filialVinculo}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    tabIndex={16}
                  >
                    <option value="">Selecione</option>
                    <option value="001">001 - MATRIZ</option>
                    <option value="002">002 - FILIAL SP</option>
                    <option value="003">003 - FILIAL BA</option>
                  </Sel>

                </div>

                {/* ===== LINHA 6 ===== */}
                <div className="grid grid-cols-12 gap-2 items-center mt-2">
                  <Label className="col-span-1 justify-end">Banco</Label>
                  <Txt
                    className="col-span-1"
                    name="banco"
                    maxLength={3}
                    value={dados.banco}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    tabIndex={17}
                  />

                  <Label className="col-span-1 justify-end">Agência</Label>
                  <Txt
                    className="col-span-2"
                    name="agencia"
                    maxLength={6}
                    value={dados.agencia}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    tabIndex={18}
                  />

                  <Label className="col-span-1 justify-end">Conta</Label>
                  <Txt
                    className="col-span-2"
                    name="conta"
                    maxLength={10}
                    value={dados.conta}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    tabIndex={19}
                  />

                  <Label className="col-span-1 justify-end">Pix</Label>
                  <Txt
                    className="col-span-3"
                    name="pix"
                    value={dados.pix}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    tabIndex={20}
                  />
                </div>

                {/* ===== LINHA 7 ===== */}
                <div className="grid grid-cols-12 gap-2 items-center mt-2">
                  <Label className="col-span-1 justify-end">Contato</Label>
                  <Txt
                    className="col-span-5"
                    name="contato"
                    value={dados.contato}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    tabIndex={21}
                  />

                  <Label className="col-span-1 justify-end">Favorecido</Label>
                  <Txt
                    className="col-span-5"
                    name="favorecido"
                    value={dados.favorecido}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    tabIndex={22}
                  />
                </div>

                {/* ===== LINHA 8 ===== */}
                <div className="grid grid-cols-12 gap-2 items-center mt-2">
                  <Label className="col-span-1 justify-end">Observação</Label>
                  <textarea
                    className="col-span-11 border border-gray-300 rounded px-2 py-1 text-[13px]"
                    name="obs"
                    rows={1}
                    value={dados.obs}
                    onChange={handleChange}
                  />
                </div>
              </fieldset>



              {/* ---------------------------------------------------
    CARD 2 - ADICIONAIS
--------------------------------------------------- */}
              <fieldset className="border border-gray-300 rounded mb-3">
                <legend
                  className="px-2 text-red-700 font-semibold flex items-center justify-between cursor-pointer select-none"
                  onClick={() => setShowAdicionais(!showAdicionais)}
                >
                  Adicionais
                  <span className="text-gray-500 text-sm">
                    {showAdicionais ? "▲" : "▼"}
                  </span>
                </legend>

                {showAdicionais && (
                  <div className="p-3 space-y-2 text-[13px]">

                    {/* ===== LINHA 1 ===== */}
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <Label className="col-span-1 justify-end">PIS</Label>
                      <Txt className="col-span-2" name="pis" value={dados.pis} onChange={handleChange} />


                      <Label className="col-span-1 justify-end">Nº Cartão CIOT</Label>
                      <Txt className="col-span-2" name="ciot" value={dados.ciot} onChange={handleChange} />

                      <Label className="col-span-2 justify-end">Pagto Bloq.</Label>
                      <Sel className="col-span-2 w-full" name="pagBloq" value={dados.pagBloq} onChange={handleChange}>
                        <option>Não</option>
                        <option>Sim</option>
                      </Sel>
                      <Label className="col-span-1 justify-end">Depend.</Label>
                      <Txt
                        className="col-span-1 text-center"
                        name="dependentes"
                        maxLength={2}
                        value={dados.dependentes}
                        onChange={handleChange}
                      />

                    </div>

                    {/* ===== LINHA 2 ===== */}
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <Label className="col-span-1 justify-end">RG</Label>
                      <Txt className="col-span-2" name="rg" value={dados.rg} onChange={handleChange} />
                      <Label className="col-span-1 justify-end">CPF</Label>
                      <Txt
                        className="col-span-2"
                        name="cpf"
                        value={dados.cpf}
                        onChange={(e) =>
                          setDados((p) => ({ ...p, cpf: maskCPF(e.target.value) }))
                        }
                      />
                      <Label className="col-span-2 justify-end">Dt. Emissão</Label>
                      <Txt
                        type="date"
                        className="col-span-2"
                        name="dtemissao"
                        value={dados.dtemissao}
                        onChange={handleChange}
                      />

                      <Label className="col-span-1 justify-end">UF</Label>
                      <Sel className="col-span-1 w-full" name="ufemissao" value={dados.ufemissao} onChange={handleChange}>
                        {[
                          "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
                          "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RO", "RR", "RS", "SC", "SP", "SE", "TO"
                        ].map((uf) => (
                          <option key={uf}>{uf}</option>
                        ))}
                      </Sel>


                    </div>

                    {/* ===== LINHA 3 ===== */}
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <Label className="col-span-1 justify-end">Nascimento</Label>
                      <Txt
                        type="date"
                        className="col-span-2"
                        name="nascimento"
                        value={dados.nascimento}
                        onChange={handleChange}
                      />

                      <Label className="col-span-1 justify-end">Local Nasc.</Label>
                      <Txt
                        className="col-span-5"
                        name="localNascCidade"
                        value={dados.localNascCidade}
                        onChange={handleChange}
                      />


                      <Txt
                        className="col-span-1 text-center"
                        name="localNascUF"
                        maxLength={2}
                        value={dados.localNascUF}
                        onChange={handleChange}
                      />

                      <Label className="col-span-1 justify-end">Sexo</Label>
                      <Sel className="col-span-1 w-full" name="sexo" value={dados.sexo} onChange={handleChange}>
                        <option>Masculino</option>
                        <option>Feminino</option>
                      </Sel>
                    </div>

                    {/* ===== LINHA 4 ===== */}
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <Label className="col-span-1 justify-end">Tipo Conta</Label>
                      <Sel className="col-span-2 w-full" name="tipoConta" value={dados.tipoConta} onChange={handleChange}>
                        <option>Conta Corrente</option>
                        <option>Poupança</option>
                        <option>PIX</option>
                      </Sel>

                      <Label className="col-span-1 justify-end">Tabela Frete</Label>
                      <Sel
                        className="col-span-5 w-full"
                        name="tabelaFrete"
                        value={dados.tabelaFrete}
                        onChange={handleChange}
                      >
                        <option value="000000">000000 - TABELA PADRÃO</option>
                        <option value="000001">000001 - MARFRIG EXPORTAÇÃO/MERCADO INTERNO</option>
                        <option value="000002">000002 - ZANCHETTA VENDA</option>
                        <option value="000003">000003 - TABELA LOGGI</option>
                        <option value="000004">000004 - HEINEKEN CANAIS ESPECIAIS</option>
                        <option value="000055">000055 - RODONAVES NATAL TESTE</option>
                        <option value="000056">000056 - RODONAVES NATAL</option>
                        <option value="000094">000094 - ADIMAX</option>
                      </Sel>
                    </div>

                  </div>
                )}
              </fieldset>





              {/* ---------------------------------------------------
                CARD 3 - BOTÕES ESPECIAIS
            --------------------------------------------------- */}
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => setShowTabelaFrete(true)}
                  className="border px-3 py-[4px] rounded flex items-center gap-1 text-sm hover:bg-gray-100"
                >
                  <FileSpreadsheet size={14} /> Tabela Frete
                </button>
                <button
                  onClick={() => setShowVeiculos(true)}
                  className="border px-3 py-[4px] rounded flex items-center gap-1 text-sm hover:bg-gray-100"
                >
                  <Truck size={14} /> Veículos
                </button>
                <button
                  onClick={() => setShowMotoristas(true)}
                  className="border px-3 py-[4px] rounded flex items-center gap-1 text-sm hover:bg-gray-100"
                >
                  <Users size={14} /> Motoristas
                </button>

                <button className="border px-3 py-[4px] rounded flex items-center gap-1 text-sm hover:bg-gray-100">
                  <FileSpreadsheet size={14} /> Conta Corrente
                </button>
                <button className="border px-3 py-[4px] rounded flex items-center gap-1 text-sm hover:bg-gray-100">
                  <CalendarDays size={14} /> Agend. Eventos
                </button>
              </div>

            </>
          )}

          {/* ==================================================
    ABA CONSULTA
================================================== */}
          {aba === "consulta" && (
            <>
              <fieldset className="border border-gray-300 rounded p-3 mb-3 w-full">
                <legend className="px-2 text-red-700 font-semibold">
                  Parâmetros
                </legend>

                <div className="space-y-2 text-[13px]">

                  {/* ===== LINHA 1 ===== */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 justify-end">Razão Social</Label>
                    <Txt
                      className="col-span-5"
                      value={filtros.razao}
                      onChange={(e) =>
                        setFiltros({ ...filtros, razao: e.target.value })
                      }
                    />

                    <Label className="col-span-1 justify-end">Cidade</Label>
                    <Txt
                      className="col-span-5"
                      value={filtros.cidade}
                      onChange={(e) =>
                        setFiltros({ ...filtros, cidade: e.target.value })
                      }
                    />
                  </div>

                  {/* ===== LINHA 2 ===== */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 justify-end">CPF/CNPJ</Label>
                    <Txt
                      className="col-span-2"
                      value={filtros.doc}
                      onChange={(e) =>
                        setFiltros({
                          ...filtros,
                          doc:
                            e.target.value.length <= 14
                              ? maskCPF(e.target.value)
                              : maskCNPJ(e.target.value),
                        })
                      }
                    />

                    <Label className="col-span-1 justify-end">Tipo</Label>
                    <Sel
                      className="col-span-2 w-full"
                      value={filtros.tipo}
                      onChange={(e) =>
                        setFiltros({ ...filtros, tipo: e.target.value })
                      }
                    >
                      <option>Todos</option>
                      <option>Agregado</option>
                      <option>Terceirizado</option>
                      <option>Cooperativa</option>
                    </Sel>

                    <Label className="col-span-1 justify-end">Tipo Agr.</Label>
                    <Sel
                      className="col-span-1 w-full"
                      value={filtros.tpAgregado}
                      onChange={(e) =>
                        setFiltros({ ...filtros, tpAgregado: e.target.value })
                      }
                    >
                      <option>Todos</option>
                      <option>TAC</option>
                      <option>ETC</option>
                    </Sel>

                    <Label className="col-span-1 justify-end">Empresa</Label>
                    <Sel
                      className="col-span-3 w-full"
                      value={filtros.empresa}
                      onChange={(e) =>
                        setFiltros({ ...filtros, empresa: e.target.value })
                      }
                    >
                      <option>Todos</option>
                      <option>Pessoa Física</option>
                      <option>Pessoa Jurídica</option>
                    </Sel>
                  </div>

                  {/* ===== LINHA 3 ===== */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-1 justify-end">Situação</Label>
                    <Sel
                      className="col-span-2 w-full"
                      value={filtros.situacao}
                      onChange={(e) =>
                        setFiltros({ ...filtros, situacao: e.target.value })
                      }
                    >
                      <option>Todos</option>
                      <option>Ativos</option>
                      <option>Inativos</option>
                    </Sel>

                    <Label className="col-span-1 justify-end">Dt Inclusão</Label>
                    <Txt
                      type="date"
                      className="col-span-2"
                      value={filtros.dtIncl}
                      onChange={(e) =>
                        setFiltros({ ...filtros, dtIncl: e.target.value })
                      }
                    />

                    <div className="col-span-2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filtros.usarData}
                        onChange={(e) =>
                          setFiltros({ ...filtros, usarData: e.target.checked })
                        }
                      />
                      <span>Utilizar Data</span>
                    </div>

                    {/* BOTÕES */}
                    <div className="col-span-4 flex justify-end gap-2">
                      <button className="border border-gray-300 rounded px-3 py-[4px] flex items-center gap-1 hover:bg-gray-100">
                        <FileSpreadsheet size={14} />
                        Exportar
                      </button>

                      <button
                        onClick={() => {
                          setFiltros({
                            razao: "",
                            cidade: "",
                            doc: "",
                            tipo: "Todos",
                            tpAgregado: "Todos",
                            empresa: "Todos",
                            situacao: "Todos",
                            dtIncl: "",
                            usarData: false,
                          });
                          setResultados([]);
                        }}
                        className="border border-gray-300 rounded px-3 py-[4px] flex items-center gap-1 hover:bg-gray-100"
                      >
                        <RotateCcw size={14} />
                        Limpar
                      </button>

                      <button
                        onClick={handlePesquisar}
                        className="border border-gray-300 rounded px-3 py-[4px] flex items-center gap-1 hover:bg-gray-100"
                      >
                        <Search size={14} />
                        Pesquisar
                      </button>
                    </div>
                  </div>

                </div>
              </fieldset>
            </>
          )}

          {/* ------------------------- GRID ------------------------- */}
          <fieldset className="border border-gray-300 rounded p-3 min-w-0">
            <legend className="px-2 text-red-700 font-semibold">
              Resultados
            </legend>

            <div className="block w-full min-w-0 border border-gray-300 rounded bg-white mt-2 max-h-[400px] overflow-auto">
              <table className="min-w-[1600px] text-[12px] border-collapse">
                <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
                  <tr>
                    {[
                      "CNPJ/CPF",
                      "Razão Social",
                      "IE",
                      "Endereço",
                      "Bairro",
                      "Cidade",
                      "CEP",
                      "UF",
                      "Contrato",
                      "Fone",
                      "Fone 2",
                      "DT Contrato",
                      "Desligamento",
                      "Banco",
                      "Agência",
                      "Conta",
                      "Observação",
                      "Tipo",
                      "Pg Bloq",
                      "Favorecido",
                      "PIS",
                      "Dependentes",
                      "Nascimento",
                      "CIOT",
                      "Tabela Frete",
                    ].map((h) => (
                      <th
                        key={h}
                        className="border px-2 py-1 whitespace-nowrap text-left"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {resultados.map((item, i) => (
                    <tr
                      key={item.id}
                      onClick={() => selecionarLinha(item)}
                      className={`cursor-pointer ${i % 2 === 0 ? "bg-orange-50" : "bg-white"
                        } hover:bg-gray-100`}
                    >
                      <td className="border px-2 whitespace-nowrap">{item.doc}</td>
                      <td className="border px-2 whitespace-nowrap">{item.razao}</td>
                      <td className="border px-2 whitespace-nowrap">{item.ie}</td>
                      <td className="border px-2 whitespace-nowrap">{item.endereco}</td>
                      <td className="border px-2 whitespace-nowrap">{item.bairro}</td>
                      <td className="border px-2 whitespace-nowrap">{item.cidade}</td>
                      <td className="border px-2 whitespace-nowrap">{item.cep}</td>
                      <td className="border px-2 whitespace-nowrap">{item.uf}</td>
                      <td className="border px-2 whitespace-nowrap">{item.contrato}</td>
                      <td className="border px-2 whitespace-nowrap">{item.fone1}</td>
                      <td className="border px-2 whitespace-nowrap">{item.fone2}</td>
                      <td className="border px-2 whitespace-nowrap"></td>
                      <td className="border px-2 whitespace-nowrap">{item.desligamento}</td>
                      <td className="border px-2 whitespace-nowrap">{item.banco}</td>
                      <td className="border px-2 whitespace-nowrap">{item.agencia}</td>
                      <td className="border px-2 whitespace-nowrap">{item.conta}</td>
                      <td className="border px-2 whitespace-nowrap">{item.obs}</td>
                      <td className="border px-2 whitespace-nowrap">{item.tipo}</td>
                      <td className="border px-2 whitespace-nowrap">{item.pagBloq}</td>
                      <td className="border px-2 whitespace-nowrap">{item.favorecido}</td>
                      <td className="border px-2 whitespace-nowrap">{item.pis}</td>
                      <td className="border px-2 whitespace-nowrap">{item.dependentes}</td>
                      <td className="border px-2 whitespace-nowrap">{item.nascimento}</td>
                      <td className="border px-2 whitespace-nowrap">{item.ciot}</td>
                      <td className="border px-2 whitespace-nowrap">{item.tabelaFrete}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-right text-[12px] mt-2 text-gray-600">
              Total de Registros: {resultados.length}
            </div>
          </fieldset>

        </div>



        {/* === CHAMADA DO MODAL TABELA FRETE === */}
        {showTabelaFrete && (
          <EmpresaAgregadoTabelaFrete
            onClose={() => setShowTabelaFrete(false)}
            cnpj={doc}
            razao={dados.razao}
          />
        )}

        {showVeiculos && (
          <EmpresaAgregadoVeiculos
            onClose={() => setShowVeiculos(false)}
            onCadastroVeiculo={() => {
              setShowVeiculos(false);     // fecha a lista
              alert("Abrir tela Veiculo.jsx");  // aqui você chama sua tela real
            }}
          />
        )}

        {showMotoristas && (
          <EmpresaAgregadoMotorista
            onClose={() => setShowMotoristas(false)}
            onCadastroMotorista={() => {
              setShowMotoristas(false);
              alert("Abrir tela CadastroMotorista.jsx");
            }}
            onContratoCooperativa={() => {
              alert("Abrir tela ContratoCooperativa.jsx");
            }}
          />
        )}
      </div>
      {/* ===================== RODAPÉ PADRÃO MANTRAN ===================== */}
      <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6 shrink-0">

        {/* FECHAR */}
        <button
          onClick={() => window.history.back()}
          className={`flex flex-col items-center text-[11px] transition 
            ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <XCircle size={20} />
          <span>Fechar</span>
        </button>

        {/* LIMPAR */}
        <button
          onClick={handleLimpar}
          className={`flex flex-col items-center text-[11px] transition 
            ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <RotateCcw size={20} />
          <span>Limpar</span>
        </button>

        {/* INCLUIR */}
        <button
          onClick={handleIncluir}
          title="Incluir Registro (Ctrl+I)"
          tabIndex={aba === "cadastro" ? 40 : 100}
          className={`flex flex-col items-center text-[11px] transition ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <PlusCircle size={18} />
          <span>Incluir</span>
        </button>

        {/* ALTERAR */}
        <button
          className={`flex flex-col items-center text-[11px] transition 
            ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <Edit size={20} />
          <span>Alterar</span>
        </button>

        {/* EXCLUIR */}
        <button
          onClick={handleExcluir}
          className={`flex flex-col items-center text-[11px] transition 
            ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <Trash2 size={20} />
          <span>Excluir</span>
        </button>

        {/* EXPORTAR EXCEL */}
        <button
          className={`flex flex-col items-center text-[11px] transition 
            ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <FileSpreadsheet size={20} />
          <span>Excel</span>
        </button>

      </div>


    </div >

  );
}
