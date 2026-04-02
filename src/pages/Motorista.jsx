import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useIconColor } from "../context/IconColorContext";

// Modais (vamos criar depois)
import MotoristaCNH from "./MotoristaCNH";
import Pessoal from "./MotoristaPessoal";
import Fiscal from "./MotoristaFiscal";
import Trabalhista from "./MotoristaTrabalhista";
import Bancario from "./MotoristaBancario";
import Ocorrencia from "./MotoristaOcorrencia";
import Gris from "./MotoristaGris";
import Apisul from "./MotoristaApisul";

import {
  XCircle,
  RotateCcw,
  PlusCircle,
  Edit,
  Trash2,
  Search,
  FileSpreadsheet,
} from "lucide-react";

/* ===========================
   Helpers padrão
=========================== */
function Label({ children, className = "" }) {
  return (
    <label className={`text-[12px] text-gray-600 ${className}`}>{children}</label>
  );
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

function Sel({ children, className = "", ...rest }) {
  return (
    <select
      {...rest}
      className={
        "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] " +
        className
      }
    >
      {children}
    </select>
  );
}

/* ===========================
   Dados mockados para Consulta
=========================== */
const motoristasMock = [
  {
    id: 1,
    filial: "001",
    cnh: "12345678900",
    apelido: "JOÃO",
    nome: "JOÃO DA SILVA",
    cpf: "111.222.333-44",
    rg: "12.345.678-9",
    cnpjEmpresa: "12.345.678/0001-90",
    razaoEmpresa: "EMPRESA TESTE LTDA",
    placa: "ABC1D23",
    dataInclusao: "2025-01-10",
    dataDesligamento: "",
    tipo: "Frota",
    celular: "(11) 99999-0000",
  },
  {
    id: 2,
    filial: "002",
    cnh: "98765432100",
    apelido: "CARLOS",
    nome: "CARLOS PEREIRA",
    cpf: "555.666.777-88",
    rg: "98.765.432-1",
    cnpjEmpresa: "98.765.432/0001-55",
    razaoEmpresa: "TRANSPORTES EXEMPLO S/A",
    placa: "XYZ9Z99",
    dataInclusao: "2025-02-05",
    dataDesligamento: "2025-04-01",
    tipo: "Agregado",
    celular: "(11) 98888-7777",
  },
];

/* ===========================
   Form inicial Cadastro
=========================== */
const initialForm = {
  tipoMotorista: "Frota",
  cpfCnpj: "",
  funcao: "M",

  cnh: "",
  categoria: "",
  validadeCnh: "",

  apelido: "",
  nome: "",

  dataNasc: "",
  sexo: "",

  cep: "",
  endereco: "",
  numero: "",

  bairro: "",
  cidade: "",
  uf: "",

  celular: "",
  telefone: "",
  radio: "",
  idRadio: "",

  cnpjEmpresa: "",
  razaoEmpresa: "",
  filial: "",

  veiculoCodigo: "",
  veiculoDescricao: "",
  centroCusto: "",

  reboqueCodigo: "",
  reboqueDescricao: "",
  email: "",

  observacao: "",

  inclusao: new Date().toISOString().slice(0, 10),
  desligamento: "",
};

export default function Motorista({ open }) {
  const location = useLocation();
  const isOficina = location.pathname.startsWith("/modulo-oficina");
  const [activeTab, setActiveTab] = useState("cadastro");
  const [form, setForm] = useState(initialForm);
  const [filtros, setFiltros] = useState({
    cpf: "",
    rg: "",
    apelido: "",
    nome: "",
    cnpjEmpresa: "",
    razaoEmpresa: "",
    veiculoCodigo: "",
    veiculoDescricao: "",
    status: "T", // Todos / Ativos / Inativos
    tipoMotorista: "T", // Todos / Frota / Agregado
    funcao: "T", // Todos / Motorista / Ajudante
    dtInicio: "",
    dtFim: "",
  });
  const [resultadoConsulta, setResultadoConsulta] = useState(motoristasMock);
  const [selectedId, setSelectedId] = useState(null);

  const { footerIconColorNormal, footerIconColorHover } = useIconColor();
  const navigate = useNavigate();

  // Estados modais
  const [showCNH, setShowCNH] = useState(false);
  const [showPessoal, setShowPessoal] = useState(false);
  const [showFiscal, setShowFiscal] = useState(false);
  const [showTrabalhista, setShowTrabalhista] = useState(false);
  const [showBancario, setShowBancario] = useState(false);
  const [showOcorrencia, setShowOcorrencia] = useState(false);
  const [showGris, setShowGris] = useState(false);
  const [showApisul, setShowApisul] = useState(false);

  /* ===========================
     Helpers de estado
  =========================== */
  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleFiltroChange = (field) => (e) => {
    setFiltros((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // CEP com "busca automática" (placeholder para futura integração)
  const handleCepBlur = () => {
    if (!form.cep || form.cep.replace(/\D/g, "").length < 8) return;

    // Futuramente aqui você chama o backend/Correios.
    // Por enquanto, vamos só preencher algo de exemplo se os campos estiverem vazios.
    setForm((prev) => ({
      ...prev,
      endereco: prev.endereco || "Rua Exemplo",
      bairro: prev.bairro || "Centro",
      cidade: prev.cidade || "São Paulo",
      uf: prev.uf || "SP",
    }));
  };

  /* ===========================
     Ações Rodapé
  =========================== */
  const handleLimparCadastro = () => {
    setForm({
      ...initialForm,
      inclusao: new Date().toISOString().slice(0, 10),
    });
    setSelectedId(null);
  };

  const handleIncluir = () => {
    // Futuro: enviar para backend
    alert("Incluir motorista (futuro backend)");
  };

  const handleAlterar = () => {
    if (!selectedId) {
      alert("Selecione um motorista na aba Consulta ou preencha e salve como novo.");
      return;
    }
    alert(`Alterar motorista ID ${selectedId} (futuro backend)`);
  };

  const handleExcluir = () => {
    if (!selectedId) {
      alert("Selecione um motorista para excluir.");
      return;
    }
    if (window.confirm("Deseja realmente excluir este motorista?")) {
      alert(`Excluir motorista ID ${selectedId} (futuro backend)`);
    }
  };

  /* ===========================
     Ações Consulta
  =========================== */
  const handleLimparConsulta = () => {
    setFiltros({
      cpf: "",
      rg: "",
      apelido: "",
      nome: "",
      cnpjEmpresa: "",
      razaoEmpresa: "",
      veiculoCodigo: "",
      veiculoDescricao: "",
      status: "T",
      tipoMotorista: "T",
      funcao: "T",
      dtInicio: "",
      dtFim: "",
    });
    setResultadoConsulta(motoristasMock);
  };

  const handlePesquisar = () => {
    let dados = [...motoristasMock];

    if (filtros.cpf) {
      dados = dados.filter((m) =>
        m.cpf.toLowerCase().includes(filtros.cpf.toLowerCase())
      );
    }
    if (filtros.rg) {
      dados = dados.filter((m) =>
        m.rg.toLowerCase().includes(filtros.rg.toLowerCase())
      );
    }
    if (filtros.apelido) {
      dados = dados.filter((m) =>
        m.apelido.toLowerCase().includes(filtros.apelido.toLowerCase())
      );
    }
    if (filtros.nome) {
      dados = dados.filter((m) =>
        m.nome.toLowerCase().includes(filtros.nome.toLowerCase())
      );
    }
    if (filtros.cnpjEmpresa) {
      dados = dados.filter((m) =>
        m.cnpjEmpresa.toLowerCase().includes(filtros.cnpjEmpresa.toLowerCase())
      );
    }
    if (filtros.razaoEmpresa) {
      dados = dados.filter((m) =>
        m.razaoEmpresa.toLowerCase().includes(filtros.razaoEmpresa.toLowerCase())
      );
    }
    if (filtros.veiculoDescricao) {
      dados = dados.filter((m) =>
        m.placa.toLowerCase().includes(filtros.veiculoDescricao.toLowerCase())
      );
    }
    if (filtros.tipoMotorista !== "T") {
      dados = dados.filter((m) => m.tipo === filtros.tipoMotorista);
    }
    if (filtros.status !== "T") {
      if (filtros.status === "A") {
        dados = dados.filter((m) => !m.dataDesligamento);
      } else if (filtros.status === "I") {
        dados = dados.filter((m) => !!m.dataDesligamento);
      }
    }

    // Período pela data de inclusão (mock simples)
    if (filtros.dtInicio) {
      dados = dados.filter((m) => m.dataInclusao >= filtros.dtInicio);
    }
    if (filtros.dtFim) {
      dados = dados.filter((m) => m.dataInclusao <= filtros.dtFim);
    }

    setResultadoConsulta(dados);
  };

  const handleSelecionarMotorista = (motorista) => {
    setSelectedId(motorista.id);
    setForm((prev) => ({
      ...prev,
      tipoMotorista: motorista.tipo,
      cpfCnpj: motorista.cpf,
      apelido: motorista.apelido,
      nome: motorista.nome,
      cnh: motorista.cnh,
      cnpjEmpresa: motorista.cnpjEmpresa,
      razaoEmpresa: motorista.razaoEmpresa,
      veiculoDescricao: motorista.placa,
      inclusao: motorista.dataInclusao,
      desligamento: motorista.dataDesligamento || "",
      celular: motorista.celular,
    }));
    setActiveTab("cadastro");
  };

  const ufs = [
    "",
    "AC",
    "AL",
    "AM",
    "AP",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MG",
    "MS",
    "MT",
    "PA",
    "PB",
    "PE",
    "PI",
    "PR",
    "RJ",
    "RN",
    "RO",
    "RR",
    "RS",
    "SC",
    "SE",
    "SP",
    "TO",
  ];

  return (
    <div
      className={`
        transition-all duration-300 text-[13px] text-gray-700 bg-gray-50 flex flex-col
        ${isOficina
          ? "mt-[-16px] ml-[-16px] h-[calc(100vh-48px)] w-[calc(100%+32px)]"
          : `mt-[44px] h-[calc(100vh-56px)] ${open ? "ml-[192px]" : "ml-[56px]"}`
        }
      `}
    >
      {/* Título */}
      <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
        MOTORISTA
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
      <div className="flex-1 p-3 bg-white border-x border-b border-gray-200 rounded-b-md flex flex-col gap-2 overflow-y-auto overflow-x-hidden">
        {activeTab === "cadastro" ? (
          <>
            {/* CARD 1 - Cadastro (Linhas 1 a 13) */}
            <div className="border border-gray-300 rounded p-2 bg-white space-y-2">

              {/* Linha 1 */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="text-right col-span-1">Tipo Motorista</Label>
                <Sel className="col-span-2" value={form.tipoMotorista} onChange={handleChange("tipoMotorista")}>
                  <option value="Frota">Frota</option>
                  <option value="Agregado">Agregado</option>
                </Sel>

                <Label className="text-right col-span-1">CPF</Label>
                <Txt className="col-span-2" value={form.cpfCnpj} onChange={handleChange("cpfCnpj")} />

                <Label className="text-right col-span-1">Data Nasc.</Label>
                <Txt type="date" className="col-span-2" value={form.dataNasc} onChange={handleChange("dataNasc")} />

                <Label className="text-right col-span-1">Função</Label>
                <div className="col-span-2 flex gap-4">
                  <label className="flex items-center gap-1 text-[12px]">
                    <input type="radio" value="M" checked={form.funcao === "M"} onChange={handleChange("funcao")} />
                    Motorista
                  </label>
                  <label className="flex items-center gap-1 text-[12px]">
                    <input type="radio" value="A" checked={form.funcao === "A"} onChange={handleChange("funcao")} />
                    Ajudante
                  </label>
                </div>
              </div>

              {/* Linha 2 */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="text-right col-span-1">CNH</Label>
                <Txt className="col-span-2" value={form.cnh} onChange={handleChange("cnh")} />

                <Label className="text-right col-span-1">Categoria</Label>
                <Sel className="col-span-2" value={form.categoria} onChange={handleChange("categoria")}>
                  <option></option><option>A</option><option>B</option><option>C</option><option>D</option><option>E</option>
                </Sel>

                <Label className="text-right col-span-1">Sexo</Label>
                <Sel className="col-span-2" value={form.sexo} onChange={handleChange("sexo")}>
                  <option></option><option value="M">Masculino</option><option value="F">Feminino</option>
                </Sel>

                <Label className="text-right col-span-1">Validade</Label>
                <Txt type="date" className="col-span-2" value={form.validadeCnh} onChange={handleChange("validadeCnh")} />
              </div>



              {/* Linha 3 */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="text-right col-span-1">Apelido</Label>
                <Txt className="col-span-2" value={form.apelido} onChange={handleChange("apelido")} />

                <Label className="text-right col-span-1">Nome Motorista</Label>
                <Txt className="col-span-6" value={form.nome} onChange={handleChange("nome")} />
              </div>

              {/* Linha 4 */}
              <div className="grid grid-cols-12 gap-2 items-center">





              </div>

              {/* Linha 6 */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="text-right col-span-1">CEP</Label>
                <Txt className="col-span-2" value={form.cep} onChange={handleChange("cep")} onBlur={handleCepBlur} />

                <Label className="text-right col-span-1">Endereço</Label>
                <Txt className="col-span-6" value={form.endereco} onChange={handleChange("endereco")} />

                <Label className="text-right col-span-1">Nº</Label>
                <Txt className="col-span-1" value={form.numero} onChange={handleChange("numero")} />
              </div>

              {/* Linha 7 */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="text-right col-span-1">Bairro</Label>
                <Txt className="col-span-2" value={form.bairro} onChange={handleChange("bairro")} />

                <Label className="text-right col-span-1">Cidade</Label>
                <Txt className="col-span-6" value={form.cidade} onChange={handleChange("cidade")} />

                <Label className="text-right col-span-1">UF</Label>
                <Sel className="col-span-1" value={form.uf} onChange={handleChange("uf")}>
                  {ufs.map(uf => <option key={uf}>{uf}</option>)}
                </Sel>
              </div>

              {/* Linha 8 */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="text-right col-span-1">Celular</Label>
                <Txt className="col-span-2" value={form.celular} onChange={handleChange("celular")} />

                <Label className="text-right col-span-1">Telefone</Label>
                <Txt className="col-span-3" value={form.telefone} onChange={handleChange("telefone")} />

                <Label className="text-right col-span-2">Radio</Label>
                <Txt className="col-span-1" value={form.radio} onChange={handleChange("radio")} />

                <Label className="text-right col-span-1">ID Radio</Label>
                <Txt className="col-span-1" value={form.idRadio} onChange={handleChange("idRadio")} />


              </div>

              {/* Linha 9 */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="text-right col-span-1">CNPJ Empresa</Label>
                <Txt className="col-span-2" placeholder="CNPJ" value={form.cnpjEmpresa} onChange={handleChange("cnpjEmpresa")} />

                <Txt className="col-span-4" value={form.razaoEmpresa} placeholder="Razão Social" onChange={handleChange("razaoEmpresa")} />

                <Label className="text-right col-span-2">Filial</Label>
                <Sel className="col-span-3" value={form.filial} onChange={handleChange("filial")}>
                  <option></option><option value="001">001 - MANTRAN TECNOLOGIAS LTDA ME</option>
                  <option value="002">002 - MANTRAN TECNOLOGIAS VALINHOS</option>
                </Sel>
              </div>

              {/* Linha 10 */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="text-right col-span-1">Veículo</Label>
                <Txt className="col-span-2" placeholder="Código" value={form.veiculoCodigo} onChange={handleChange("veiculoCodigo")} />
                <Txt className="col-span-4" placeholder="Placa / Descrição" value={form.veiculoDescricao} onChange={handleChange("veiculoDescricao")} />

                <Label className="text-right col-span-2">Centro Custo</Label>
                <Sel className="col-span-3" value={form.centroCusto} onChange={handleChange("centroCusto")}>
                  <option></option><option>Operacional</option><option>Administrativo</option><option>Financeiro</option>
                </Sel>
              </div>

              {/* Linha 11 */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="text-right col-span-1">Reboque</Label>
                <Txt className="col-span-2" placeholder="Código" value={form.reboqueCodigo} onChange={handleChange("reboqueCodigo")} />
                <Txt className="col-span-4" placeholder="Placa / Descrição" value={form.reboqueDescricao} onChange={handleChange("reboqueDescricao")} />
                <Label className="text-right col-span-2">Desligamento</Label>
                <Txt type="date" className="col-span-3" value={form.desligamento} onChange={handleChange("desligamento")} />


              </div>

              {/* Linha 12 */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="text-right col-span-1">Observação</Label>

                <textarea
                  rows={1}
                  className="col-span-11 border border-gray-300 rounded px-1 py-[2px] text-[13px] h-[26px] resize-none"
                  value={form.observacao}
                  onChange={(e) =>
                    setForm({ ...form, observacao: e.target.value })
                  }
                />
              </div>
            </div>


            <div className="flex flex-wrap gap-3 items-center">

              <button
                title="Documentação e CNH (Comissão, 1ª Habilitação, RENACH, Espelho CNH, MOPP)"
                onClick={() => setShowCNH(true)}
                className="border border-gray-300 rounded px-3 h-[28px] text-[12px] bg-white hover:bg-red-50 text-red-700 shadow-sm"
              >
                CNH
              </button>

              <button
                title="Dados Pessoais (Pais, Dependentes, PIS, Grau de instrução)"
                onClick={() => setShowPessoal(true)}
                className="border border-gray-300 rounded px-3 h-[28px] text-[12px] bg-white hover:bg-red-50 text-red-700 shadow-sm"
              >
                Pessoal
              </button>

              <button
                title="Financeiro / Impostos (INSS, ISS, Sest/Senat, eSocial, Score, Conta Contábil)"
                onClick={() => setShowFiscal(true)}
                className="border border-gray-300 rounded px-3 h-[28px] text-[12px] bg-white hover:bg-red-50 text-red-700 shadow-sm"
              >
                Fiscal
              </button>

              <button
                title="Informações Trabalhistas (CTPS, Série, Matrícula, Cargo, eSocial)"
                onClick={() => setShowTrabalhista(true)}
                className="border border-gray-300 rounded px-3 h-[28px] text-[12px] bg-white hover:bg-red-50 text-red-700 shadow-sm"
              >
                Trabalhista
              </button>

              <button
                title="Dados Bancários (Banco, Agência, Conta Corrente)"
                onClick={() => setShowBancario(true)}
                className="border border-gray-300 rounded px-3 h-[28px] text-[12px] bg-white hover:bg-red-50 text-red-700 shadow-sm"
              >
                Bancário
              </button>

              <button
                title="Ocorrências do Motorista"
                onClick={() => setShowOcorrencia(true)}
                className="border border-gray-300 rounded px-3 h-[28px] text-[12px] bg-white hover:bg-red-50 text-red-700 shadow-sm"
              >
                Ocorrência
              </button>

              <button
                title="Informações de GRIS"
                onClick={() => setShowGris(true)}
                className="border border-gray-300 rounded px-3 h-[28px] text-[12px] bg-white hover:bg-red-50 text-red-700 shadow-sm"
              >
                GRIS
              </button>

              <button
                title="Dados APISUL / Seguro"
                onClick={() => setShowApisul(true)}
                className="border border-gray-300 rounded px-3 h-[28px] text-[12px] bg-white hover:bg-red-50 text-red-700 shadow-sm"
              >
                APISUL
              </button>

              {/* ➤ CAMPO INCLUSÃO ALINHADO À DIREITA */}
              <div className="ml-auto flex items-center gap-2">
                <Label className="text-right">Inclusão</Label>
                <Txt
                  type="date"
                  readOnly
                  className="w-[150px] bg-gray-200 text-gray-700 cursor-not-allowed"
                  value={form.inclusao}
                />
              </div>

            </div>

          </>
        ) : (
          // ===================== ABA CONSULTA =====================
          <>
            {/* CARD 1 - Pesquisar */}
            <div className="border border-gray-300 rounded p-2 bg-white space-y-2">
              <h2 className="text-red-700 font-semibold text-[13px] mb-1">
                Parâmetros de Pesquisa
              </h2>

              {/* Linha 1 - CPF, RG, Apelido, Nome */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-1 text-right">CPF</Label>
                <Txt
                  className="col-span-2"
                  value={filtros.cpf}
                  onChange={handleFiltroChange("cpf")}
                  placeholder="___.___.___-__"
                />


                <Label className="col-span-1 text-right">Apelido</Label>
                <Txt
                  className="col-span-2"
                  value={filtros.apelido}
                  onChange={handleFiltroChange("apelido")}
                />

                <Label className="col-span-1 text-right">Nome</Label>
                <Txt
                  className="col-span-5"
                  value={filtros.nome}
                  onChange={handleFiltroChange("nome")}
                />
              </div>

              {/* Linha 2 - CNPJ Empresa, Razao, Veículo */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-1 text-right">CNPJ Empresa</Label>
                <Txt
                  className="col-span-2"
                  value={filtros.cnpjEmpresa}
                  onChange={handleFiltroChange("cnpjEmpresa")}
                />

                <Txt
                  className="col-span-3"
                  value={filtros.razaoEmpresa}
                  onChange={handleFiltroChange("razaoEmpresa")}
                  placeholder="Razão Social"
                />

                <Label className="col-span-1 text-right">Veículo</Label>

                {/* Código */}
                <Txt
                  className="col-span-2"
                  value={filtros.veiculoCodigo}
                  onChange={handleFiltroChange("veiculoCodigo")}
                  placeholder="Código"
                />

                {/* Placa / Descrição */}
                <Txt
                  className="col-span-3"
                  value={filtros.veiculoDescricao}
                  onChange={handleFiltroChange("veiculoDescricao")}
                  placeholder="Placa / Descrição"
                />
              </div>


              {/* Linha 3 - Status, Motorista, Função, Data Incl., Botões */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-1 text-right">Dt. Inclusão</Label>
                <Txt
                  type="date"
                  className="col-span-1"
                  value={filtros.dtInicio}
                  onChange={handleFiltroChange("dtInicio")}
                />
                <span className="text-center text-[12px]">até</span>
                <Txt
                  type="date"
                  className="col-span-1"
                  value={filtros.dtFim}
                  onChange={handleFiltroChange("dtFim")}
                />
                <Label className="col-span-1 text-right">Status</Label>
                <Sel
                  className="col-span-1"
                  value={filtros.status}
                  onChange={handleFiltroChange("status")}
                >
                  <option value="T">Todos</option>
                  <option value="A">Ativos</option>
                  <option value="I">Inativos</option>
                </Sel>

                <Label className="col-span-1 text-right">Motorista</Label>
                <Sel
                  className="col-span-2"
                  value={filtros.tipoMotorista}
                  onChange={handleFiltroChange("tipoMotorista")}
                >
                  <option value="T">Todos</option>
                  <option value="Frota">Frota</option>
                  <option value="Agregado">Agregado</option>
                </Sel>

                <Label className="col-span-1 text-right">Função</Label>
                <Sel
                  className="col-span-2"
                  value={filtros.funcao}
                  onChange={handleFiltroChange("funcao")}
                >
                  <option value="T">Todos</option>
                  <option value="M">Motorista</option>
                  <option value="A">Ajudante</option>
                </Sel>


              </div>

              {/* Botões Exportar, Limpar, Pesquisar */}
              <div className="flex justify-end gap-2 pt-1">
                <button className="flex items-center gap-1 border border-gray-300 rounded px-3 h-[26px] text-[12px] bg-white hover:bg-gray-100 text-gray-700 shadow-sm">
                  <FileSpreadsheet size={14} />
                  Exportar
                </button>
                <button
                  onClick={handleLimparConsulta}
                  className="flex items-center gap-1 border border-gray-300 rounded px-3 h-[26px] text-[12px] bg-white hover:bg-gray-100 text-gray-700 shadow-sm"
                >
                  Limpar
                </button>
                <button
                  onClick={handlePesquisar}
                  className="flex items-center gap-1 border border-gray-300 rounded px-3 h-[26px] text-[12px] bg-blue-50 hover:bg-blue-100 text-blue-700 shadow-sm"
                >
                  <Search size={14} />
                  Pesquisar
                </button>
              </div>
            </div>

            {/* CARD 2 - Grid */}
            <div className="border border-gray-300 rounded p-2 bg-white">
              <h2 className="text-red-700 font-semibold text-[13px] mb-1">
                Relação de Motoristas
              </h2>

              <div className="border border-gray-300 rounded overflow-auto max-h-[350px]">
                <table className="min-w-full text-[12px] border-collapse">
                  <thead className="bg-gray-100 text-gray-700 border-b border-gray-300">
                    <tr>
                      <th className="px-2 py-1 border-r">Filial</th>
                      <th className="px-2 py-1 border-r">CNH</th>
                      <th className="px-2 py-1 border-r">Apelido</th>
                      <th className="px-2 py-1 border-r">Nome</th>
                      <th className="px-2 py-1 border-r">CPF</th>
                      <th className="px-2 py-1 border-r">RG</th>
                      <th className="px-2 py-1 border-r">CNPJ Empresa</th>
                      <th className="px-2 py-1 border-r">Placa</th>
                      <th className="px-2 py-1 border-r">Dt. Inclusão</th>
                      <th className="px-2 py-1 border-r">Dt. Deslig.</th>
                      <th className="px-2 py-1 border-r">Tipo</th>
                      <th className="px-2 py-1">Celular</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultadoConsulta.map((m) => (
                      <tr
                        key={m.id}
                        className={`cursor-pointer hover:bg-gray-50 ${selectedId === m.id ? "bg-red-50" : ""
                          }`}
                        onClick={() => handleSelecionarMotorista(m)}
                      >
                        <td className="border-t border-gray-200 px-2 py-[3px]">
                          {m.filial}
                        </td>
                        <td className="border-t border-gray-200 px-2 py-[3px]">
                          {m.cnh}
                        </td>
                        <td className="border-t border-gray-200 px-2 py-[3px]">
                          {m.apelido}
                        </td>
                        <td className="border-t border-gray-200 px-2 py-[3px]">
                          {m.nome}
                        </td>
                        <td className="border-t border-gray-200 px-2 py-[3px]">
                          {m.cpf}
                        </td>
                        <td className="border-t border-gray-200 px-2 py-[3px]">
                          {m.rg}
                        </td>
                        <td className="border-t border-gray-200 px-2 py-[3px]">
                          {m.cnpjEmpresa}
                        </td>
                        <td className="border-t border-gray-200 px-2 py-[3px]">
                          {m.placa}
                        </td>
                        <td className="border-t border-gray-200 px-2 py-[3px]">
                          {m.dataInclusao}
                        </td>
                        <td className="border-t border-gray-200 px-2 py-[3px]">
                          {m.dataDesligamento}
                        </td>
                        <td className="border-t border-gray-200 px-2 py-[3px]">
                          {m.tipo}
                        </td>
                        <td className="border-t border-gray-200 px-2 py-[3px]">
                          {m.celular}
                        </td>
                      </tr>
                    ))}
                    {resultadoConsulta.length === 0 && (
                      <tr>
                        <td
                          colSpan={12}
                          className="text-center text-gray-500 py-2"
                        >
                          Nenhum registro encontrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Total de registros */}
              <div className="mt-1 text-[12px] text-gray-600">
                Total de registros: {resultadoConsulta.length}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Rodapé */}
      <div className="border-t border-gray-300 bg-white py-1 px-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* FECHAR */}
          <button
            onClick={() => navigate(-1)}
            className={`flex flex-col items-center text-[11px] cursor-pointer ${footerIconColorNormal} hover:${footerIconColorHover}`}
          >
            <XCircle size={18} />
            <span>Fechar</span>
          </button>

          {/* LIMPAR */}
          <button
            onClick={handleLimparCadastro}
            className={`flex flex-col items-center text-[11px] cursor-pointer ${footerIconColorNormal} hover:${footerIconColorHover}`}
          >
            <RotateCcw size={18} />
            <span>Limpar</span>
          </button>

          {/* INCLUIR */}
          <button
            onClick={handleIncluir}
            className={`flex flex-col items-center text-[11px] cursor-pointer ${footerIconColorNormal} hover:${footerIconColorHover}`}
          >
            <PlusCircle size={18} />
            <span>Incluir</span>
          </button>

          {/* ALTERAR */}
          <button
            onClick={handleAlterar}
            className={`flex flex-col items-center text-[11px] cursor-pointer ${footerIconColorNormal} hover:${footerIconColorHover}`}
          >
            <Edit size={18} />
            <span>Alterar</span>
          </button>

          {/* EXCLUIR */}
          <button
            onClick={handleExcluir}
            className={`flex flex-col items-center text-[11px] cursor-pointer ${footerIconColorNormal} hover:${footerIconColorHover}`}
          >
            <Trash2 size={18} />
            <span>Excluir</span>
          </button>
        </div>
      </div>

      {/* Modais (placeholders, vamos implementar depois) */}
      {showCNH && <MotoristaCNH onClose={() => setShowCNH(false)} />}
      {showPessoal && <Pessoal onClose={() => setShowPessoal(false)} />}
      {showFiscal && <Fiscal onClose={() => setShowFiscal(false)} />}
      {showTrabalhista && (
        <Trabalhista onClose={() => setShowTrabalhista(false)} />
      )}
      {showBancario && <Bancario onClose={() => setShowBancario(false)} />}
      {showOcorrencia && (
        <Ocorrencia onClose={() => setShowOcorrencia(false)} />
      )}
      {showGris && <Gris onClose={() => setShowGris(false)} />}
      {showApisul && <Apisul onClose={() => setShowApisul(false)} />}
    </div>
  );
}
