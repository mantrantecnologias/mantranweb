import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useIconColor } from "../context/IconColorContext";

import VeiculoVencimentos from "./VeiculoVencimentos";
import VeiculoRastreador from "./VeiculoRastreador";
import VeiculoAdicionais from "./VeiculoAdicionais";
import VeiculoPreventiva from "./VeiculoPreventiva";
import VeiculoGris from "./VeiculoGris";
import InputBuscaAgregado from "../components/InputBuscaAgregado";
import InputBuscaCidade from "../components/InputBuscaCidade";

import {
  XCircle,
  RotateCcw,
  PlusCircle,
  Edit,
  Trash2,
  FileSpreadsheet,
} from "lucide-react";

/* ===============================
   Helpers
=============================== */
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

/* ===============================
   Máscaras
=============================== */
const onlyDigits = (v = "") => v.replace(/\D+/g, "");


// KM com milhar
const maskKM = (v) => {
  v = v.replace(/\D/g, "");
  return v.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};



const maskCNPJ = (v) =>
  onlyDigits(v)
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
    .replace(/(\d{4})(\d)/, "$1-$2");

const maskPlaca = (v) =>
  v
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 7);

const maskMes = (v) =>
  onlyDigits(v)
    .slice(0, 2)
    .replace(/^(\d{2})/, "$1");

const maskDate = (v) => {
  v = onlyDigits(v).slice(0, 8);
  if (v.length <= 2) return v;
  if (v.length <= 4) return v.replace(/^(\d{2})(\d{0,2})/, "$1/$2");
  return v.replace(/^(\d{2})(\d{2})(\d{0,4})/, "$1/$2/$3");
};

/* ===============================
   Componente principal
=============================== */

export default function Veiculo({ open }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isOficina = location.pathname.startsWith("/modulo-oficina");
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const currentTab = parseInt(e.target.getAttribute("tabindex"));
      const nextTab = currentTab + 1;
      const nextEl = document.querySelector(`[tabindex="${nextTab}"]`);
      if (nextEl) nextEl.focus();
    }
  };

  // Aba atual
  const [aba, setAba] = useState("cadastro");

  // Estado do cadastro
  const [cadastro, setCadastro] = useState({
    codigo: "",
    placa: "",
    cnpjProprietario: "",
    razaoProprietario: "",
    tipo: "F", // F = Frota, A = Agregado
    descricao: "",
    ano: "",
    qtdEixos: "",
    contratacao: "",
    rntrc: "",
    cidadeLic: "",
    ufLic: "",
    tracaoReboque: "T", // T = Tração, R = Reboque
    licenciado: false,
    marca: "",
    kmAtual: "",
    certPropriedade: "",
    chassi: "",
    modelo: "TRACAO",
    renavam: "",
    classe: "BITRUCK",
    combustivel: "DIESEL",
    mesLic: "",
    validadeLic: "",
    carroceria: "BAU FECHADO",
    filialVinculo: "001 - TESTE MANTRAN",
    numTag: "",
    desligamento: "",
    observacao: "",
    operador: localStorage.getItem("usuarioNome") || "SUPORTE",
  });

  // Modais
  const [showVencimentos, setShowVencimentos] = useState(false);
  const [showRastreador, setShowRastreador] = useState(false);
  const [showAdicionais, setShowAdicionais] = useState(false);
  const [showPreventiva, setShowPreventiva] = useState(false);
  const [showGris, setShowGris] = useState(false);

  // ===================== GRID CONSULTA =====================
  const [filtros, setFiltros] = useState({
    codigo: "",
    placa: "",
    descricao: "",
    tipoVeiculo: "TODOS",
    proprietarioCnpj: "",
    proprietarioNome: "",
    situacao: "TODOS",
  });

  const [veiculos, setVeiculos] = useState([
    {
      id: 1,
      emp: "001",
      filial: "001",
      codigo: "0000001",
      placa: "RENSJ17",
      descricao: "VW 24280 CRM 6X2",
      utilizacao: "T",
      tipo: "F",
      rntrc: "54151655",
      classe: "BITRUCK",
      modelo: "TRACAO",
      mesLic: "11",
      licenciado: "N",
      validadeLic: "25/10/2024",
      operador: "SUPORTE",
      proprietarioCnpj: "04.086.814/0001-41",
      proprietarioNome: "TESTE MANTRAN",
      ativo: true,
    },
    {
      id: 2,
      emp: "001",
      filial: "001",
      codigo: "0000002",
      placa: "EFPW258",
      descricao: "HYUNDAI HR HDB",
      utilizacao: "T",
      tipo: "F",
      rntrc: "56928900",
      classe: "TRUCK",
      modelo: "IMPLEMENTO",
      mesLic: "04",
      licenciado: "S",
      validadeLic: "01/04/2026",
      operador: "SUPORTE",
      proprietarioCnpj: "12.345.678/0001-00",
      proprietarioNome: "TRANSPORTES XPTO LTDA",
      ativo: true,
    },
    {
      id: 3,
      emp: "001",
      filial: "001",
      codigo: "0000003",
      placa: "JDF2C22",
      descricao: "VW/8.160 DRC 4X2",
      utilizacao: "T",
      tipo: "A",
      rntrc: "55510588",
      classe: "CAVALO 30,5",
      modelo: "IMPLEMENTO",
      mesLic: "01",
      licenciado: "N",
      validadeLic: "25/12/2024",
      operador: "SUPORTE",
      proprietarioCnpj: "22.222.222/0001-22",
      proprietarioNome: "AGREGADO SILVA",
      ativo: false,
    },
  ]);

  const [resultadoConsulta, setResultadoConsulta] = useState(veiculos);
  const totalRegistros = resultadoConsulta.length;

  const aplicarFiltros = () => {
    const lista = veiculos.filter((v) => {
      if (
        filtros.codigo &&
        !v.codigo.toLowerCase().includes(filtros.codigo.toLowerCase())
      )
        return false;
      if (
        filtros.placa &&
        !v.placa.toLowerCase().includes(filtros.placa.toLowerCase())
      )
        return false;
      if (
        filtros.descricao &&
        !v.descricao.toLowerCase().includes(filtros.descricao.toLowerCase())
      )
        return false;
      if (
        filtros.tipoVeiculo !== "TODOS" &&
        v.tipo !== (filtros.tipoVeiculo === "FROTA" ? "F" : "A")
      )
        return false;
      if (
        filtros.proprietarioCnpj &&
        !v.proprietarioCnpj
          .toLowerCase()
          .includes(filtros.proprietarioCnpj.toLowerCase())
      )
        return false;
      if (
        filtros.proprietarioNome &&
        !v.proprietarioNome
          .toLowerCase()
          .includes(filtros.proprietarioNome.toLowerCase())
      )
        return false;
      if (filtros.situacao === "ATIVOS" && !v.ativo) return false;
      if (filtros.situacao === "INATIVOS" && v.ativo) return false;
      return true;
    });
    setResultadoConsulta(lista);
  };

  const limparFiltros = () => {
    setFiltros({
      codigo: "",
      placa: "",
      descricao: "",
      tipoVeiculo: "TODOS",
      proprietarioCnpj: "",
      proprietarioNome: "",
      situacao: "TODOS",
    });
    setResultadoConsulta(veiculos);
  };

  const carregarCadastro = (v) => {
    setCadastro((prev) => ({
      ...prev,
      codigo: v.codigo,
      placa: v.placa,
      tipo: v.tipo,
      descricao: v.descricao,
      rntrc: v.rntrc,
      classe: v.classe,
      modelo: v.modelo,
      mesLic: v.mesLic,
      validadeLic: v.validadeLic,
      licenciado: v.licenciado === "S",
      operador: v.operador,
    }));
    setAba("cadastro");
  };

  const limparCadastro = () => {
    setCadastro((prev) => ({
      ...prev,
      codigo: "",
      placa: "",
      tipo: "F",
      cnpjProprietario: "",
      razaoProprietario: "",
      descricao: "",
      ano: "",
      qtdEixos: "",
      contratacao: "",
      rntrc: "",
      cidadeLic: "",
      ufLic: "",
      tracaoReboque: "T",
      licenciado: false,
      marca: "",
      kmAtual: "",
      certPropriedade: "",
      chassi: "",
      modelo: "",
      renavam: "",
      classe: "",
      combustivel: "DIESEL",
      mesLic: "",
      validadeLic: "",
      carroceria: "",
      filialVinculo: "",
      numTag: "",
      desligamento: "",
      observacao: "",
    }));
  };

  const hoje = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString("pt-BR");
  }, []);

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

      {/* TÍTULO */}
      <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
        VEÍCULO
      </h1>

      {/* ABAS */}
      <div className="flex border-b border-gray-300 bg-white">
        {["cadastro", "consulta"].map((tab) => (
          <button
            key={tab}
            onClick={() => setAba(tab)}
            className={`px-4 py-1 text-sm font-medium border-t border-x rounded-t-md ${aba === tab
              ? "bg-white text-red-700 border-gray-300"
              : "bg-gray-100 text-gray-600 border-transparent"
              } ${tab !== "cadastro" ? "ml-1" : ""}`}
          >
            {tab === "cadastro" ? "Cadastro" : "Consulta"}
          </button>
        ))}
      </div>

      {/* CONTEÚDO */}
      <div className="flex-1 p-3 bg-white border-x border-b border-gray-200 rounded-b-md overflow-y-auto flex flex-col gap-2 pb-[88px]">

        {/* ==================================================
            ABA CADASTRO
        ================================================== */}
        {aba === "cadastro" && (
          <>
            {/* CARD 1 – Dados do Veículo */}
            <fieldset className="border border-gray-300 rounded px-3 pt-1 pb-3">
              {/* Linha 1 */}
              <div className="grid grid-cols-12 gap-4 items-center">

                {/* Código */}
                <div className="col-span-2 flex items-center gap-1">
                  <Label>Código</Label>
                  <Txt
                    className="w-full text-center ml-[60px]"
                    value={cadastro.codigo}
                    onChange={(e) => setCadastro({ ...cadastro, codigo: e.target.value })}
                    onKeyDown={handleKeyDown}
                    tabIndex={1}
                  />
                </div>

                {/* Placa */}
                <div className="col-span-2 flex items-center gap-1">
                  <Label className="ml-[40px]">Placa</Label>
                  <Txt
                    className="w-full text-center"
                    maxLength={7}
                    value={cadastro.placa}
                    onChange={(e) =>
                      setCadastro({ ...cadastro, placa: maskPlaca(e.target.value) })
                    }
                    onKeyDown={handleKeyDown}
                    tabIndex={2}
                  />
                </div>

                {/* Tipo */}
                <div className="col-span-2 flex items-center gap-1">
                  <Label className="ml-[45px]">Tipo</Label>
                  <Sel
                    className="w-full"
                    value={cadastro.tipo}
                    onChange={(e) => setCadastro({ ...cadastro, tipo: e.target.value })}
                    onKeyDown={handleKeyDown}
                    tabIndex={3}
                  >
                    <option value="F">FROTA</option>
                    <option value="A">AGREGADO</option>
                  </Sel>
                </div>

                {/* Descrição */}
                <div className="col-span-4 flex items-center gap-1">
                  <Label className="ml-[30px]">Descrição</Label>
                  <Txt
                    className="flex-1"
                    value={cadastro.descricao}
                    onChange={(e) =>
                      setCadastro({ ...cadastro, descricao: e.target.value })
                    }
                    onKeyDown={handleKeyDown}
                    tabIndex={4}
                  />
                </div>

                {/* Licenciado - Agora no final da linha 1 */}
                <div className="col-span-2 flex justify-end">
                  <label className="flex items-center gap-1 text-[12px]">
                    <input
                      type="checkbox"
                      checked={cadastro.licenciado}
                      onChange={(e) =>
                        setCadastro({ ...cadastro, licenciado: e.target.checked })
                      }
                      onKeyDown={handleKeyDown}
                      tabIndex={5}
                    />
                    Licenciado
                  </label>
                </div>
              </div>


              {/* Linha 2 */}
              <div className="grid grid-cols-12 gap-4 mt-2 items-center">

                {/* Ano */}
                <div className="col-span-2 flex items-center gap-1">
                  <Label >Ano</Label>
                  <Txt
                    className="w-full text-center ml-[77px]"
                    maxLength={4}
                    value={cadastro.ano}
                    onChange={(e) => setCadastro({ ...cadastro, ano: onlyDigits(e.target.value) })}
                    onKeyDown={handleKeyDown}
                    tabIndex={6}
                  />
                </div>

                {/* Qtd Eixos */}
                <div className="col-span-2 flex items-center gap-1">
                  <Label className="ml-[15px]">Qtd. Eixos</Label>
                  <Txt
                    className="w-[60px] text-center"
                    maxLength={2}
                    value={cadastro.qtdEixos}
                    onChange={(e) => setCadastro({ ...cadastro, qtdEixos: onlyDigits(e.target.value) })}
                    onKeyDown={handleKeyDown}
                    tabIndex={7}
                  />
                </div>

                {/* Contratação */}
                <div className="col-span-3 flex items-center gap-1">
                  <Label className="ml-[5px]">Contratação</Label>
                  <Txt
                    type="date"
                    className="w-full"
                    value={cadastro.contratacao}
                    onChange={(e) => setCadastro({ ...cadastro, contratacao: e.target.value })}
                    onKeyDown={handleKeyDown}
                    tabIndex={8}
                  />
                </div>

                {/* RNTRC */}
                <div className="col-span-3 flex items-center gap-1">
                  <Label className="ml-[40px]">RNTRC</Label>
                  <Txt
                    className="w-[140px] text-center"
                    maxLength={8}
                    value={cadastro.rntrc}
                    onChange={(e) => setCadastro({ ...cadastro, rntrc: onlyDigits(e.target.value) })}
                    onKeyDown={handleKeyDown}
                    tabIndex={9}
                  />
                </div>

                {/* Tipo Utilização - FINAL DA LINHA */}
                <div className="col-span-2 flex justify-end items-center gap-4">
                  <Label>Utilização</Label>

                  <label className="flex items-center gap-1 text-[12px]">
                    <input
                      type="radio"
                      name="tracaoReboque"
                      checked={cadastro.tracaoReboque === "T"}
                      onChange={() => setCadastro({ ...cadastro, tracaoReboque: "T" })}
                      onKeyDown={handleKeyDown}
                      tabIndex={10}
                    /> Tração
                  </label>

                  <label className="flex items-center gap-1 text-[12px]">
                    <input
                      type="radio"
                      name="tracaoReboque"
                      checked={cadastro.tracaoReboque === "R"}
                      onChange={() => setCadastro({ ...cadastro, tracaoReboque: "R" })}
                      onKeyDown={handleKeyDown}
                      tabIndex={11}
                    /> Reboque
                  </label>
                </div>
              </div>

              {/* Linha 3 */}
              <div className="grid grid-cols-12 gap-4 mt-2 items-center">

                {/* Proprietário */}
                <div className="col-span-6 flex items-center gap-1">
                  <Label>Proprietário</Label>
                  <InputBuscaAgregado
                    label={null}
                    className="w-[175px] ml-[35px]"
                    value={cadastro.cnpjProprietario}
                    onChange={(e) =>
                      setCadastro({ ...cadastro, cnpjProprietario: e.target.value })
                    }
                    onSelect={(item) => {
                      setCadastro((prev) => ({
                        ...prev,
                        cnpjProprietario: maskCNPJ(item.documento),
                        razaoProprietario: item.nome,
                      }));
                      setTimeout(() => document.querySelector('[tabindex="13"]')?.focus(), 10);
                    }}
                    tabIndex={12}
                  />

                  <Txt
                    className="flex-1 bg-gray-100"
                    placeholder="Razão Social"
                    readOnly
                    value={cadastro.razaoProprietario}
                  />
                </div>

                {/* Cidade + UF — FINAL DA LINHA */}
                <div className="col-span-6 flex items-center justify-end gap-1">
                  <Label className="ml-[45px]">Cidade</Label>
                  <InputBuscaCidade
                    label={null}
                    className="w-full"
                    value={cadastro.cidadeLic}
                    onChange={(e) => setCadastro({ ...cadastro, cidadeLic: e.target.value })}
                    onSelect={(city) => {
                      setCadastro((prev) => ({
                        ...prev,
                        cidadeLic: city.nome,
                        ufLic: city.uf,
                      }));
                      setTimeout(() => document.querySelector('[tabindex="14"]')?.focus(), 10);
                    }}
                    tabIndex={13}
                  />

                  <Txt
                    className="w-[50px] text-center bg-gray-100"
                    readOnly
                    maxLength={2}
                    value={cadastro.ufLic}
                  />
                </div>
              </div>

              {/* Linha 4 */}
              <div className="grid grid-cols-12 gap-2 mt-2 items-center">

                <div className="col-span-4 flex items-center gap-1">
                  <Label >Marca</Label>
                  <Txt
                    className="flex-1 ml-[65px]"
                    value={cadastro.marca}
                    onChange={(e) => setCadastro({ ...cadastro, marca: e.target.value })}
                    onKeyDown={handleKeyDown}
                    tabIndex={14}
                  />
                </div>

                <div className="col-span-2 flex items-center gap-1">
                  <Label className="min-w-[70px]">KM Atual</Label>
                  <Txt
                    className="w-full text-right"
                    value={maskKM(cadastro.kmAtual)}
                    onChange={(e) =>
                      setCadastro({ ...cadastro, kmAtual: onlyDigits(e.target.value) })
                    }
                    onKeyDown={handleKeyDown}
                    tabIndex={15}
                  />
                </div>

                <div className="col-span-6 flex items-center gap-2">
                  <Label className="ml-[35px]" >Nº Chassi</Label>
                  <Txt
                    className="flex-1"
                    value={cadastro.chassi}
                    onChange={(e) =>
                      setCadastro({ ...cadastro, chassi: e.target.value })
                    }
                    onKeyDown={handleKeyDown}
                    tabIndex={16}
                  />
                </div>

              </div>

              {/* Linha 5 */}
              <div className="grid grid-cols-12 gap-2 mt-2 items-center">

                <div className="col-span-4 flex items-center gap-1">
                  <Label>Classe</Label>
                  <Sel
                    className="flex-1 ml-[60px]"
                    value={cadastro.classe}
                    onChange={(e) => setCadastro({ ...cadastro, classe: e.target.value })}
                    onKeyDown={handleKeyDown}
                    tabIndex={17}
                  >
                    <option value="01">UTILITARIO</option>
                    <option value="02">VAN</option>
                    <option value="03">3/4</option>
                    <option value="04">TOCO</option>
                    <option value="05">TRUCK</option>
                    <option value="06">VUC</option>
                    <option value="07">BI-TRUCK</option>
                  </Sel>
                </div>

                <Label> Combustível</Label>
                <Sel
                  className="w-full"
                  value={cadastro.combustivel}
                  onChange={(e) =>
                    setCadastro({
                      ...cadastro,
                      combustivel: e.target.value,
                    })
                  }
                  onKeyDown={handleKeyDown}
                  tabIndex={18}
                >
                  <option>DIESEL</option>
                  <option>GASOLINA</option>
                  <option>ETANOL</option>
                  <option>GNV</option>
                  <option>ELÉTRICO</option>
                </Sel>


                <div className="col-span-6 flex items-center gap-1 justify-end">
                  <Label className="ml-[35px]">Carroceria</Label>
                  <Sel
                    className="flex-1"
                    value={cadastro.carroceria}
                    onChange={(e) => setCadastro({ ...cadastro, carroceria: e.target.value })}
                    onKeyDown={handleKeyDown}
                    tabIndex={19}
                  >
                    <option value="01">BAU FECHADO</option>
                    <option value="02">BAU SIDER</option>
                    <option value="03">BAU FRIGORIFICO</option>
                    <option value="04">SEM CARROCERIA</option>
                    <option value="05">CARR ABERTA</option>
                    <option value="06">PORTA CONTAINER</option>
                    <option value="07">TRAC/CAV.TRATOR</option>
                    <option value="08">BAU PLATAFORMA</option>
                  </Sel>
                </div>
              </div>


              {/* Linha 6 */}
              <div className="grid grid-cols-12 gap-2 mt-2 items-center">

                {/* Modelo – mesma largura da Carroceria */}
                <div className="col-span-6 flex items-center gap-1">
                  <Label>Modelo</Label>
                  <Sel
                    className="flex-1 ml-[60px]"
                    value={cadastro.modelo}
                    onChange={(e) => setCadastro({ ...cadastro, modelo: e.target.value })}
                    onKeyDown={handleKeyDown}
                    tabIndex={20}
                  >
                    <option value="003">XRE 300</option>
                    <option value="01">TRACAO</option>
                    <option value="02">IMPLEMENTO</option>
                  </Sel>
                </div>

                {/* Renavam – mesma largura e posição do bloco Mês/Validade */}
                <div className="col-span-6 flex items-center gap-2">
                  <Label className="ml-[35px]">Renavam</Label>

                  <Txt
                    className="flex-1"
                    value={cadastro.renavam}
                    onChange={(e) =>
                      setCadastro({ ...cadastro, renavam: onlyDigits(e.target.value) })
                    }
                    onKeyDown={handleKeyDown}
                    tabIndex={21}
                  />
                </div>

              </div>


              {/* Linha 7 */}
              <div className="grid grid-cols-12 gap-2 mt-2 items-center">

                <div className="col-span-6 flex items-center gap-1">
                  <Label>Filial de Vínculo</Label>
                  <Sel
                    className="flex-1 ml-[14px]"
                    value={cadastro.filialVinculo}
                    onChange={(e) =>
                      setCadastro({
                        ...cadastro,
                        filialVinculo: e.target.value,
                      })
                    }
                    onKeyDown={handleKeyDown}
                    tabIndex={22}
                  >
                    <option>001 - TESTE MANTRAN</option>
                  </Sel>
                </div>

                {/* Mês + Validade Licenciamento — AGORA ATÉ O FINAL */}
                <div className="col-span-6 flex items-center gap-2 justify-end">
                  <Label className="ml-[35px] min-w-[200px]">
                    Mês / Validade Licenciamento
                  </Label>

                  {/* Mês */}
                  <Txt
                    className="w-[50px] text-center"
                    maxLength={2}
                    value={cadastro.mesLic}
                    onChange={(e) =>
                      setCadastro({ ...cadastro, mesLic: maskMes(e.target.value) })
                    }
                    onKeyDown={handleKeyDown}
                    tabIndex={23}
                  />

                  {/* Validade → agora EXPANDE até o final */}
                  <Txt
                    className="flex-1 text-center"
                    maxLength={10}
                    value={cadastro.validadeLic}
                    onChange={(e) =>
                      setCadastro({
                        ...cadastro,
                        validadeLic: maskDate(e.target.value),
                      })
                    }
                    onKeyDown={handleKeyDown}
                    tabIndex={24}
                  />
                </div>

              </div>


              {/* Linha 8 */}
              <div className="grid grid-cols-12 gap-2 mt-2 items-center">



                <div className="col-span-6 flex items-center gap-1">
                  <Label className="min-w-[70px]" >Nº TAG</Label>
                  <Txt
                    className="w-full ml-[30px]"
                    value={cadastro.numTag}
                    onChange={(e) =>
                      setCadastro({
                        ...cadastro,
                        numTag: e.target.value,
                      })
                    }
                    onKeyDown={handleKeyDown}
                    tabIndex={25}
                  />
                </div>
                <div className="col-span-6 flex items-center gap-1">
                  <Label className="ml-[30px]">Desligamento</Label>
                  <Txt
                    type="date"
                    className="w-full"
                    value={cadastro.desligamento}
                    onChange={(e) =>
                      setCadastro({
                        ...cadastro,
                        desligamento: e.target.value,
                      })
                    }
                    onKeyDown={handleKeyDown}
                    tabIndex={26}
                  />
                </div>
              </div>

              {/* Linha 10 */}
              <div className="grid grid-cols-12 gap-2 mt-2 items-center">
                <div className="col-span-9 flex items-center gap-1">
                  <Label>Observação</Label>
                  <Txt
                    className="flex-1 ml-[35px]"
                    value={cadastro.observacao}
                    onChange={(e) =>
                      setCadastro({
                        ...cadastro,
                        observacao: e.target.value,
                      })
                    }
                    onKeyDown={handleKeyDown}
                    tabIndex={27}
                  />
                </div>
                <div className="col-span-3 flex items-center gap-1 justify-end">
                  <Label>Operador</Label>
                  <Txt
                    className="w-[120px] text-center bg-gray-100"
                    readOnly
                    value={cadastro.operador}
                  />
                </div>
              </div>
            </fieldset>

            {/* CARD 2 – Botões especiais */}
            <fieldset className="border border-gray-300 rounded px-3 pt-1 pb-3 mt-2">
              <legend className="text-red-700 font-semibold px-2">
                Informações Adicionais
              </legend>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowVencimentos(true)}
                  className="border px-3 py-[4px] rounded flex items-center gap-1 text-sm hover:bg-gray-100"
                >
                  Vencimentos
                </button>
                <button
                  onClick={() => setShowRastreador(true)}
                  className="border px-3 py-[4px] rounded flex items-center gap-1 text-sm hover:bg-gray-100"
                >
                  Rastreador
                </button>
                <button
                  onClick={() => setShowAdicionais(true)}
                  className="border px-3 py-[4px] rounded flex items-center gap-1 text-sm hover:bg-gray-100"
                >
                  Adicionais
                </button>
                <button
                  onClick={() => setShowPreventiva(true)}
                  className="border px-3 py-[4px] rounded flex items-center gap-1 text-sm hover:bg-gray-100"
                >
                  Preventiva
                </button>
                <button
                  onClick={() => setShowGris(true)}
                  className="border px-3 py-[4px] rounded flex items-center gap-1 text-sm hover:bg-gray-100"
                >
                  GRIS
                </button>
              </div>
            </fieldset>


          </>
        )}

        {/* ==================================================
            ABA CONSULTA
        ================================================== */}
        {aba === "consulta" && (
          <div className="flex flex-col gap-2">


            {/* CARD 1 – Parâmetros */}
            <fieldset className="border border-gray-300 rounded p-2 flex-[0.45]">
              <legend className="text-red-700 font-semibold px-2">
                Parâmetros
              </legend>

              <div className="space-y-1 text-[12px]">
                {/* Linha 1 */}
                <div className="flex items-center gap-1">
                  <Label className="w-[60px] text-right">Código</Label>
                  <Txt
                    className="w-[120px] text-center ml-[13px]"
                    value={filtros.codigo}
                    onChange={(e) =>
                      setFiltros({ ...filtros, codigo: e.target.value })
                    }
                  />

                  <Label className="w-[80px] text-right">Placa</Label>
                  <Txt
                    className="w-[160px] text-center"
                    value={filtros.placa}
                    onChange={(e) =>
                      setFiltros({ ...filtros, placa: e.target.value })
                    }
                  />

                  <Label className="w-[70px] text-right">Descrição</Label>
                  <Txt
                    className="flex-1"
                    value={filtros.descricao}
                    onChange={(e) =>
                      setFiltros({ ...filtros, descricao: e.target.value })
                    }
                  />
                </div>

                {/* Linha 2 */}
                <div className="flex items-center gap-1 mt-1">
                  <Label className="w-[60px] text-right">Tipo</Label>
                  <Sel
                    className="w-[120px] ml-[13px] "
                    value={filtros.tipoVeiculo}
                    onChange={(e) =>
                      setFiltros({
                        ...filtros,
                        tipoVeiculo: e.target.value,
                      })
                    }
                  >
                    <option value="TODOS">TODOS</option>
                    <option value="FROTA">FROTA</option>
                    <option value="AGREGADO">AGREGADO</option>
                  </Sel>

                  <Label className="w-[320px] text-right">Proprietário</Label>
                  <Txt
                    className="w-[160px]"
                    placeholder="CNPJ"
                    value={filtros.proprietarioCnpj}
                    onChange={(e) =>
                      setFiltros({
                        ...filtros,
                        proprietarioCnpj: maskCNPJ(e.target.value),
                      })
                    }
                  />
                  <Txt
                    className="flex-1 bg-gray-100"
                    placeholder="Nome do Proprietário"
                    readOnly
                    value={filtros.proprietarioNome}
                    onChange={() => { }}
                  />
                </div>

                {/* Linha 3 */}
                <div className="flex items-center gap-2 mt-1">
                  <Label className="w-[60px] text-right">Filtro</Label>
                  <Sel
                    className="w-[120px] ml-[10px]"
                    value={filtros.situacao}
                    onChange={(e) =>
                      setFiltros({ ...filtros, situacao: e.target.value })
                    }
                  >
                    <option value="TODOS">TODOS</option>
                    <option value="ATIVOS">ATIVOS</option>
                    <option value="INATIVOS">INATIVOS</option>
                  </Sel>

                  <div className="flex-1 flex justify-end gap-2">
                    <button
                      className="border border-gray-300 rounded px-3 py-[4px] text-[12px] hover:bg-gray-100"
                      title="Exportar Excel"
                    >
                      Exportar
                    </button>
                    <button
                      onClick={limparFiltros}
                      className="border border-gray-300 rounded px-3 py-[4px] text-[12px] hover:bg-gray-100"
                    >
                      Limpar
                    </button>
                    <button
                      onClick={aplicarFiltros}
                      className="border border-gray-300 rounded px-3 py-[4px] text-[12px] hover:bg-gray-100"
                    >
                      Pesquisar
                    </button>
                  </div>
                </div>
              </div>
            </fieldset>

            {/* CARD 2 – Grid */}
            <fieldset className="border border-gray-300 rounded p-2 flex-1">
              <legend className="text-red-700 font-semibold px-2">
                Veículos
              </legend>

              <div className="overflow-auto mt-1">
                <table className="min-w-full border text-[12px]">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      {[
                        "Emp.",
                        "Filial",
                        "Cód. Veículo",
                        "Placa",
                        "Descrição",
                        "Tp. Utilização",
                        "Tp. Veículo",
                        "RNTRC",
                        "Classe",
                        "Modelo",
                        "Mês Licenciamento",
                        "Licenciado",
                        "Validade Licenciado",
                        "Operador",
                      ].map((h) => (
                        <th key={h} className="border px-2 py-1 text-left">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {resultadoConsulta.map((v) => (
                      <tr
                        key={v.id}
                        className="hover:bg-blue-50 cursor-pointer"
                        onClick={() => carregarCadastro(v)}
                      >
                        <td className="border px-2 py-1">{v.emp}</td>
                        <td className="border px-2 py-1">{v.filial}</td>
                        <td className="border px-2 py-1">{v.codigo}</td>
                        <td className="border px-2 py-1">{v.placa}</td>
                        <td className="border px-2 py-1">{v.descricao}</td>
                        <td className="border px-2 py-1">{v.utilizacao}</td>
                        <td className="border px-2 py-1">
                          {v.tipo === "F" ? "FROTA" : "AGREGADO"}
                        </td>
                        <td className="border px-2 py-1">{v.rntrc}</td>
                        <td className="border px-2 py-1">{v.classe}</td>
                        <td className="border px-2 py-1">{v.modelo}</td>
                        <td className="border px-2 py-1">{v.mesLic}</td>
                        <td className="border px-2 py-1">{v.licenciado}</td>
                        <td className="border px-2 py-1">{v.validadeLic}</td>
                        <td className="border px-2 py-1">{v.operador}</td>
                      </tr>
                    ))}
                    {resultadoConsulta.length === 0 && (
                      <tr>
                        <td
                          colSpan={14}
                          className="border px-2 py-2 text-center text-gray-500"
                        >
                          Nenhum registro encontrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-1 text-[12px] text-gray-700">
                Total de Registros:{" "}
                <span className="font-semibold">{totalRegistros}</span>
              </div>
            </fieldset>
          </div>
        )}
      </div>


      {/* ================= RODAPÉ FIXO ================= */}
      <div className="sticky bottom-0 bg-white border-t border-gray-300 p-2 flex items-center justify-between mt-auto z-10 shadow-[0_-2px_4px_rgba(0,0,0,0.05)]">

        {/* Ícones esquerda */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate(-1)}
            className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
          >
            <XCircle size={20} />
            <span>Fechar</span>
          </button>

          <button
            onClick={limparCadastro}
            className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
          >
            <RotateCcw size={20} />
            <span>Limpar</span>
          </button>

          <button
            onClick={() => alert("Incluindo...")}
            className={`flex flex-col items-center text-[11px] transition ${footerIconColorNormal} hover:${footerIconColorHover}`}
            tabIndex={aba === "cadastro" ? 30 : 101}
          >
            <PlusCircle size={20} />
            <span>Incluir</span>
          </button>

          <button
            className={`flex flex-col items-center text-[11px] transition ${footerIconColorNormal} hover:${footerIconColorHover}`}
            tabIndex={aba === "cadastro" ? 31 : 102}
          >
            <Edit size={20} />
            <span>Alterar</span>
          </button>

          <button
            className={`flex flex-col items-center text-[11px] transition ${footerIconColorNormal} hover:${footerIconColorHover}`}
            tabIndex={aba === "cadastro" ? 32 : 103}
          >
            <Trash2 size={20} />
            <span>Excluir</span>
          </button>

          <button
            className={`flex flex-col items-center text-[11px] transition ${footerIconColorNormal} hover:${footerIconColorHover}`}
            tabIndex={aba === "cadastro" ? 33 : 104}
          >
            <FileSpreadsheet size={20} />
            <span>Excel</span>
          </button>
        </div>

        {/* Operador / Data */}
        <div className="flex items-center gap-2 text-[12px] text-gray-700">
          <Label>Operador</Label>
          <Txt className="w-[150px] text-center bg-gray-100" readOnly value={cadastro.operador} />
          <Txt className="w-[100px] text-center bg-gray-100" readOnly value={hoje} />
        </div>


      </div>

      {/* ===================== MODAIS ===================== */}
      {
        showVencimentos && (
          <VeiculoVencimentos onClose={() => setShowVencimentos(false)} />
        )
      }
      {
        showRastreador && (
          <VeiculoRastreador onClose={() => setShowRastreador(false)} />
        )
      }
      {
        showAdicionais && (
          <VeiculoAdicionais onClose={() => setShowAdicionais(false)} />
        )
      }
      {
        showPreventiva && (
          <VeiculoPreventiva onClose={() => setShowPreventiva(false)} />
        )
      }
      {showGris && <VeiculoGris onClose={() => setShowGris(false)} />}
    </div>
  );
}
