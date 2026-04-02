// src/pages/Cidade.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIconColor } from "../context/IconColorContext";

import {
  XCircle,
  RotateCcw,
  PlusCircle,
  Edit,
  Trash2,
  MapPinned,
  Search,
} from "lucide-react";

import RegiaoModal from "./RegiaoModal";

/* ========================= Helpers ========================= */
function Label({ children, className = "" }) {
  return (
    <label className={`text-[12px] text-gray-700 ${className}`}>
      {children}
    </label>
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

/* ========================= Mocks ========================= */

const empresasMock = [
  { codigo: "001", nome: "001 - MANTRAN TRANSPORTES LTDA" },
  { codigo: "002", nome: "002 - OUTRA TRANSPORTES LTDA" },
];

const filiaisMock = [
  { codigo: "001", nome: "001 - TESTE MANTRAN" },
  { codigo: "002", nome: "002 - FILIAL CAMPINAS" },
];

const ufList = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

// lista base de cidades
const cidadesMockInicial = [
  {
    id: 1,
    empresa: "001",
    filial: "001",
    nomeCidade: "SÃO PAULO",
    uf: "SP",
    cepReferencia: "01000-000",
    cepInicial: "01000-000",
    cepFinal: "05999-999",
    paisIBGE: "1058",
    cidadeIBGE: "3550308",
    codDIPAM: "0001",
    codMetropolitano: "METRO-01",
    siglaPercurso: "SPCAP",
    aliquotaISS: "0,00",
    perimetroUrbano: true,
    localAtendimento: true,
    regiao: "capital",
  },
  {
    id: 2,
    empresa: "001",
    filial: "001",
    nomeCidade: "CAMPINAS",
    uf: "SP",
    cepReferencia: "13010-000",
    cepInicial: "13010-000",
    cepFinal: "13140-000",
    paisIBGE: "1058",
    cidadeIBGE: "3509502",
    codDIPAM: "0002",
    codMetropolitano: "INT-01",
    siglaPercurso: "INTER",
    aliquotaISS: "2,00",
    perimetroUrbano: false,
    localAtendimento: true,
    regiao: "interior",
  },
  {
    id: 3,
    empresa: "001",
    filial: "002",
    nomeCidade: "RIO DE JANEIRO",
    uf: "RJ",
    cepReferencia: "20000-000",
    cepInicial: "20000-000",
    cepFinal: "21999-999",
    paisIBGE: "1058",
    cidadeIBGE: "3304557",
    codDIPAM: "0003",
    codMetropolitano: "GDE-01",
    siglaPercurso: "GDE",
    aliquotaISS: "5,00",
    perimetroUrbano: true,
    localAtendimento: false,
    regiao: "grande",
  },
];

/* ========================= Utils ========================= */

const initialCadastro = {
  empresa: "001",
  filial: "001",
  nomeCidade: "",
  uf: "SP",
  cepReferencia: "",
  cepInicial: "",
  cepFinal: "",
  paisIBGE: "",
  cidadeIBGE: "",
  codDIPAM: "",
  codMetropolitano: "",
  siglaPercurso: "",
  aliquotaISS: "",
  perimetroUrbano: false,
  localAtendimento: false,
  regiao: "capital",
};

const initialFiltros = {
  nomeCidade: "",
  uf: "",
  cepReferencia: "",
  cepInicial: "",
  cepFinal: "",
  regiao: "todas",
};

function filtrarCidades(lista, filtros) {
  return lista.filter((c) => {
    if (
      filtros.nomeCidade &&
      !c.nomeCidade.toLowerCase().includes(filtros.nomeCidade.toLowerCase())
    )
      return false;

    if (filtros.uf && c.uf !== filtros.uf) return false;

    if (
      filtros.cepReferencia &&
      c.cepReferencia.replace(/\D/g, "") !==
        filtros.cepReferencia.replace(/\D/g, "")
    )
      return false;

    if (
      filtros.cepInicial &&
      c.cepInicial.replace(/\D/g, "") !== filtros.cepInicial.replace(/\D/g, "")
    )
      return false;

    if (
      filtros.cepFinal &&
      c.cepFinal.replace(/\D/g, "") !== filtros.cepFinal.replace(/\D/g, "")
    )
      return false;

    if (filtros.regiao !== "todas" && c.regiao !== filtros.regiao) return false;

    return true;
  });
}

/* ========================= Componente ========================= */

export default function Cidade({ open }) {
  const navigate = useNavigate();
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  const [activeTab, setActiveTab] = useState("cadastro");

  const [cadastro, setCadastro] = useState(initialCadastro);
  const [cidades, setCidades] = useState(cidadesMockInicial);
  const [selecionadoId, setSelecionadoId] = useState(null);

  const [filtros, setFiltros] = useState(initialFiltros);
  const [resultadoConsulta, setResultadoConsulta] = useState(
    filtrarCidades(cidadesMockInicial, initialFiltros)
  );

  const [regiaoModalOpen, setRegiaoModalOpen] = useState(false);

  /* ========= Handlers Cadastro ========= */

  const handleCadastroChange = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setCadastro((prev) => ({ ...prev, [field]: value }));
  };

  const handleLimparCadastro = () => {
    setCadastro(initialCadastro);
    setSelecionadoId(null);
  };

  const handleSelecionarDaGrid = (row) => {
    setSelecionadoId(row.id);
    setCadastro({
      empresa: row.empresa,
      filial: row.filial,
      nomeCidade: row.nomeCidade,
      uf: row.uf,
      cepReferencia: row.cepReferencia,
      cepInicial: row.cepInicial,
      cepFinal: row.cepFinal,
      paisIBGE: row.paisIBGE,
      cidadeIBGE: row.cidadeIBGE,
      codDIPAM: row.codDIPAM,
      codMetropolitano: row.codMetropolitano,
      siglaPercurso: row.siglaPercurso,
      aliquotaISS: row.aliquotaISS,
      perimetroUrbano: row.perimetroUrbano,
      localAtendimento: row.localAtendimento,
      regiao: row.regiao,
    });
    setActiveTab("cadastro");
  };

  const handleIncluir = () => {
    if (!cadastro.nomeCidade || !cadastro.uf) {
      alert("Informe pelo menos Nome da Cidade e UF.");
      return;
    }

    const novo = {
      id: Date.now(),
      ...cadastro,
    };

    const novaLista = [...cidades, novo];
    setCidades(novaLista);
    setResultadoConsulta(filtrarCidades(novaLista, filtros));
    handleLimparCadastro();
  };

  const handleAlterar = () => {
    if (!selecionadoId) {
      alert("Selecione um registro na grid (aba Consulta) para alterar.");
      return;
    }

    const novaLista = cidades.map((c) =>
      c.id === selecionadoId ? { ...c, ...cadastro } : c
    );

    setCidades(novaLista);
    setResultadoConsulta(filtrarCidades(novaLista, filtros));
    handleLimparCadastro();
  };

  const handleExcluir = () => {
    if (!selecionadoId) {
      alert("Selecione um registro na grid (aba Consulta) para excluir.");
      return;
    }

    if (!window.confirm("Confirma exclusão da cidade selecionada?")) return;

    const novaLista = cidades.filter((c) => c.id !== selecionadoId);
    setCidades(novaLista);
    setResultadoConsulta(filtrarCidades(novaLista, filtros));
    handleLimparCadastro();
  };

  /* ========= Handlers Consulta ========= */

  const handleFiltroChange = (field) => (e) => {
    const value =
      e.target.type === "radio" ? e.target.value : e.target.value;

    setFiltros((prev) => ({ ...prev, [field]: value }));
  };

  const handlePesquisar = () => {
    const filtrados = filtrarCidades(cidades, filtros);
    setResultadoConsulta(filtrados);
  };

  const handleLimparFiltros = () => {
    setFiltros(initialFiltros);
    setResultadoConsulta(filtrarCidades(cidades, initialFiltros));
  };

  /* ========= Helpers para descrição de Empresa/Filial ========= */

  const empresaDescricao = empresasMock.find(
    (e) => e.codigo === cadastro.empresa
  )?.nome;

  const filialDescricao = filiaisMock.find(
    (f) => f.codigo === cadastro.filial
  )?.nome;

  return (
    <div
      className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 bg-gray-50 h-[calc(100vh-56px)] flex flex-col ${
        open ? "ml-[192px]" : "ml-[56px]"
      }`}
    >
      {/* Título */}
      <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
        CADASTRO DE CIDADES
      </h1>

      {/* Abas */}
      <div className="flex border-b border-gray-300 bg-white">
        {["cadastro", "consulta"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1 text-sm font-medium border-t border-x rounded-t-md ${
              activeTab === tab
                ? "bg-white text-red-700 border-gray-300"
                : "bg-gray-100 text-gray-600 border-transparent"
            } ${tab !== "cadastro" ? "ml-1" : ""}`}
          >
            {tab === "cadastro" ? "Cadastro" : "Consulta"}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 p-3 bg-white border-x border-b border-gray-200 rounded-b-md overflow-y-auto flex flex-col gap-3">
        {/* ================= ABA CADASTRO ================= */}
        {activeTab === "cadastro" && (
          <>
            {/* CARD 1 - Parâmetros */}
            <fieldset className="border border-gray-300 rounded p-3 bg-white">
              <legend className="text-red-700 font-semibold text-[13px] px-2">
                Parâmetros
              </legend>

              <div className="space-y-2">
                {/* Linha 1 - Empresa, Filial */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1">Empresa</Label>
                  <Sel
                    className="col-span-5 w-full"
                    value={cadastro.empresa}
                    onChange={handleCadastroChange("empresa")}
                  >
                    {empresasMock.map((e) => (
                      <option key={e.codigo} value={e.codigo}>
                        {e.nome}
                      </option>
                    ))}
                  </Sel>

                  <Label className="col-span-1">Filial</Label>
                  <Sel
                    className="col-span-5 w-full"
                    value={cadastro.filial}
                    onChange={handleCadastroChange("filial")}
                  >
                    {filiaisMock.map((f) => (
                      <option key={f.codigo} value={f.codigo}>
                        {f.nome}
                      </option>
                    ))}
                  </Sel>
                </div>

                {/* Linha 2 - Nome Cidade, UF, CEPs */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1">Cidade</Label>
                  <Txt
                    className="col-span-5"
                    value={cadastro.nomeCidade}
                    onChange={handleCadastroChange("nomeCidade")}
                  />

                  <Label className="col-span-1">UF</Label>
                  <Sel
                    className="col-span-1 w-full"
                    value={cadastro.uf}
                    onChange={handleCadastroChange("uf")}
                  >
                    {ufList.map((uf) => (
                      <option key={uf} value={uf}>
                        {uf}
                      </option>
                    ))}
                  </Sel>

 {/* Card Região */}
                  <fieldset className="col-span-3 col-start-10 border border-gray-300 rounded px-2 py-1">
                    <legend className="text-[11px] px-1 text-gray-700">
                      Região
                    </legend>

                    <div className="flex items-center gap-4 text-[12px]">
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          value="capital"
                          checked={cadastro.regiao === "capital"}
                          onChange={handleCadastroChange("regiao")}
                          className="accent-red-700"
                        />
                        Capital
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          value="interior"
                          checked={cadastro.regiao === "interior"}
                          onChange={handleCadastroChange("regiao")}
                          className="accent-red-700"
                        />
                        Interior
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          value="grande"
                          checked={cadastro.regiao === "grande"}
                          onChange={handleCadastroChange("regiao")}
                          className="accent-red-700"
                        />
                        Grande
                      </label>
                    </div>
                  </fieldset>


                </div>

                <div className="grid grid-cols-12 gap-2 items-center">
                            

                  <Label className="col-span-1">CEP Ref.</Label>
                  <Txt
                    className="col-span-1"
                    value={cadastro.cepReferencia}
                    onChange={handleCadastroChange("cepReferencia")}
                    placeholder="00000-000"
                  />

                  <Label className="col-span-1">CEP Inicial</Label>
                  <Txt
                    className="col-span-1"
                    value={cadastro.cepInicial}
                    onChange={handleCadastroChange("cepInicial")}
                    placeholder="00000-000"
                  />

                  <Label className="col-span-1">CEP Final</Label>
                  <Txt
                    className="col-span-1"
                    value={cadastro.cepFinal}
                    onChange={handleCadastroChange("cepFinal")}
                    placeholder="00000-000"
                  />

                  <Label className="col-span-1">Sigla Percurso</Label>
                  <Txt
                    className="col-span-2"
                    value={cadastro.siglaPercurso}
                    onChange={handleCadastroChange("siglaPercurso")}
                  />

                  <Label className="col-span-1">Alíquota ISS</Label>
                  <Txt
                    className="col-span-2 text-right"
                    value={cadastro.aliquotaISS}
                    onChange={handleCadastroChange("aliquotaISS")}
                    placeholder="0,00"
                  />
                </div>

                {/* Linha 3 - País IBGE, Cidade IBGE, DIPAM, Metropolitano */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1">País IBGE</Label>
                  <Txt
                    className="col-span-2"
                    value={cadastro.paisIBGE}
                    onChange={handleCadastroChange("paisIBGE")}
                  />

                  <Label className="col-span-1">Cidade IBGE</Label>
                  <Txt
                    className="col-span-2"
                    value={cadastro.cidadeIBGE}
                    onChange={handleCadastroChange("cidadeIBGE")}
                  />

                  <Label className="col-span-2">Código DIPAM</Label>
                  <Txt
                    className="col-span-2"
                    value={cadastro.codDIPAM}
                    onChange={handleCadastroChange("codDIPAM")}
                  />

                  <Label className="col-span-1">Cód. Metro.</Label>
                  <Txt
                    className="col-span-1"
                    value={cadastro.codMetropolitano}
                    onChange={handleCadastroChange("codMetropolitano")}
                  />
                </div>

                {/* Linha 4 - Sigla Percurso, Aliquota ISS, flags + card Regiao */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  

                  {/* Flags */}
                  <div className="col-span-3 flex items-center gap-3">
                    <label className="flex items-center gap-1 text-[12px]">
                      <input
                        type="checkbox"
                        className="accent-red-700"
                        checked={cadastro.perimetroUrbano}
                        onChange={handleCadastroChange("perimetroUrbano")}
                      />
                      Perímetro Urbano
                    </label>

                    <label className="flex items-center gap-1 text-[12px]">
                      <input
                        type="checkbox"
                        className="accent-red-700"
                        checked={cadastro.localAtendimento}
                        onChange={handleCadastroChange("localAtendimento")}
                      />
                      Local de Atendimento
                    </label>
                  </div>

                                 </div>
              </div>
            </fieldset>

          
          </>
        )}

        {/* ================= ABA CONSULTA ================= */}
        {activeTab === "consulta" && (
          <>
            {/* CARD 1 - Parâmetros */}
            <fieldset className="border border-gray-300 rounded p-3 bg-white">
              <legend className="text-red-700 font-semibold text-[13px] px-2">
                Parâmetros
              </legend>

              <div className="space-y-2">
                {/* Linha 1 - Nome Cidade, UF */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1">Nome Cidade</Label>
                  <Txt
                    className="col-span-7"
                    value={filtros.nomeCidade}
                    onChange={handleFiltroChange("nomeCidade")}
                  />

                  <Label className="col-span-1">UF</Label>
                  <Sel
                    className="col-span-3 w-full"
                    value={filtros.uf}
                    onChange={handleFiltroChange("uf")}
                  >
                    <option value="">Todas</option>
                    {ufList.map((uf) => (
                      <option key={uf} value={uf}>
                        {uf}
                      </option>
                    ))}
                  </Sel>
                </div>

                {/* Linha 2 - CEPs + Região */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1">CEP Ref.</Label>
                  <Txt
                    className="col-span-2"
                    value={filtros.cepReferencia}
                    onChange={handleFiltroChange("cepReferencia")}
                    placeholder="00000-000"
                  />

                  <Label className="col-span-1">CEP Inicial</Label>
                  <Txt
                    className="col-span-2"
                    value={filtros.cepInicial}
                    onChange={handleFiltroChange("cepInicial")}
                    placeholder="00000-000"
                  />

                  <Label className="col-span-1">CEP Final</Label>
                  <Txt
                    className="col-span-2"
                    value={filtros.cepFinal}
                    onChange={handleFiltroChange("cepFinal")}
                    placeholder="00000-000"
                  />

                  {/* Card região filtros */}
                  <fieldset className="col-span-3 border border-gray-300 rounded px-2 py-1">
                    <legend className="text-[11px] px-1 text-gray-700">
                      Região
                    </legend>

                    <div className="flex items-center gap-3 text-[12px]">
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          value="todas"
                          checked={filtros.regiao === "todas"}
                          onChange={handleFiltroChange("regiao")}
                          className="accent-red-700"
                        />
                        Todas
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          value="capital"
                          checked={filtros.regiao === "capital"}
                          onChange={handleFiltroChange("regiao")}
                          className="accent-red-700"
                        />
                        Capital
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          value="interior"
                          checked={filtros.regiao === "interior"}
                          onChange={handleFiltroChange("regiao")}
                          className="accent-red-700"
                        />
                        Interior
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          value="grande"
                          checked={filtros.regiao === "grande"}
                          onChange={handleFiltroChange("regiao")}
                          className="accent-red-700"
                        />
                        Grande
                      </label>
                    </div>
                  </fieldset>
                </div>

                {/* Linha 3 - Botões de busca */}
                <div className="flex gap-2">
                  <button
                    className="border border-gray-300 rounded px-3 py-[4px] text-[12px] flex items-center gap-1 hover:bg-gray-100"
                    onClick={handlePesquisar}
                  >
                    <Search size={14} className="text-red-700" />
                    Pesquisar
                  </button>

                  <button
                    className="border border-gray-300 rounded px-3 py-[4px] text-[12px] flex items-center gap-1 hover:bg-gray-100"
                    onClick={handleLimparFiltros}
                  >
                    <RotateCcw size={14} className="text-red-700" />
                    Limpar Filtros
                  </button>
                </div>
              </div>
            </fieldset>

            {/* CARD 2 - Grid de cidades */}
            <fieldset className="border border-gray-300 rounded p-3 bg-white">
              <legend className="text-red-700 font-semibold text-[13px] px-2">
                Cidades
              </legend>

              <div className="border border-gray-200 rounded max-h-[360px] overflow-y-auto">
                <table className="w-full text-[12px]">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1 text-left">Nome</th>
                      <th className="border px-2 py-1 text-center">
                        CEP Ref.
                      </th>
                      <th className="border px-2 py-1 text-center">
                        CEP Inicial
                      </th>
                      <th className="border px-2 py-1 text-center">
                        CEP Final
                      </th>
                      <th className="border px-2 py-1 text-center">UF</th>
                      <th className="border px-2 py-1 text-right">
                        Alíquota ISS
                      </th>
                      <th className="border px-2 py-1 text-center">
                        Cód. Cidade IBGE
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultadoConsulta.map((row) => (
                      <tr
                        key={row.id}
                        className={`cursor-pointer hover:bg-red-100 ${
                          selecionadoId === row.id ? "bg-red-200" : ""
                        }`}
                        onClick={() => handleSelecionarDaGrid(row)}
                      >
                        <td className="border px-2 py-1">{row.nomeCidade}</td>
                        <td className="border px-2 py-1 text-center">
                          {row.cepReferencia}
                        </td>
                        <td className="border px-2 py-1 text-center">
                          {row.cepInicial}
                        </td>
                        <td className="border px-2 py-1 text-center">
                          {row.cepFinal}
                        </td>
                        <td className="border px-2 py-1 text-center">
                          {row.uf}
                        </td>
                        <td className="border px-2 py-1 text-right">
                          {row.aliquotaISS}
                        </td>
                        <td className="border px-2 py-1 text-center">
                          {row.cidadeIBGE}
                        </td>
                      </tr>
                    ))}

                    {resultadoConsulta.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="border px-2 py-2 text-center text-gray-500"
                        >
                          Nenhuma cidade encontrada com os filtros informados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </fieldset>
          </>
        )}
      </div>

      {/* Rodapé */}
      <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">
        {/* Fechar */}
        <button
          onClick={() => navigate(-1)}
          title="Fechar Tela"
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
        >
          <XCircle size={20} />
          <span>Fechar</span>
        </button>

        {/* Limpar (limpa cadastro e filtros) */}
        <button
          onClick={() => {
            handleLimparCadastro();
            handleLimparFiltros();
          }}
          title="Limpar Campos"
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
        >
          <RotateCcw size={20} />
          <span>Limpar</span>
        </button>

        {/* Incluir */}
        <button
          onClick={handleIncluir}
          title="Incluir Cidade"
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
        >
          <PlusCircle size={20} />
          <span>Incluir</span>
        </button>

        {/* Alterar */}
        <button
          onClick={handleAlterar}
          title="Alterar Cidade"
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
        >
          <Edit size={20} />
          <span>Alterar</span>
        </button>

        {/* Excluir */}
        <button
          onClick={handleExcluir}
          title="Excluir Cidade"
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
        >
          <Trash2 size={20} />
          <span>Excluir</span>
        </button>

        {/* Região (abre modal RegiaoModal.jsx) */}
        <button
          onClick={() => setRegiaoModalOpen(true)}
          title="Cadastro de Regiões"
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
        >
          <MapPinned size={20} />
          <span>Região</span>
        </button>
      </div>

      {/* Modal de Região */}
      <RegiaoModal
        open={regiaoModalOpen}
        onClose={() => setRegiaoModalOpen(false)}
      />
    </div>
  );
}
