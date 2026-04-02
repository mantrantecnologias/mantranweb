import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useIconColor } from "../../context/IconColorContext";
import FilialParametro from "./FilialParametro";
import FilialNumeracao from "./FilialNumeracao";
import InputBuscaCidade from "../../components/InputBuscaCidade";
import { FilialService } from "../../services/FilialService";
import { EmpresaService } from "../../services/EmpresaService";
import FilialModel from "../../models/filial/FilialModel";
import {
  errorMessage,
  successMessage,
  infoMessage,
  confirmMessage,
} from "../../components/Mensagem";

import {
  XCircle,
  RotateCcw,
  PlusCircle,
  Edit,
  Trash2,
  SlidersHorizontal,
  FileText,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

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

/* ========================= Máscaras (padrão Empresa.jsx) ========================= */
const onlyDigits = (v = "") => v.replace(/\D+/g, "");

const maskCNPJ = (v) =>
  onlyDigits(v)
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
    .replace(/(\d{4})(\d)/, "$1-$2");

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

/* ========================= Buscar CEP ========================= */
async function buscarCEP(cep, setFilial) {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (!data.erro) {
      setFilial((prev) => ({
        ...prev,
        endereco: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        uf: data.uf || "",
      }));
    }
  } catch (err) {
    console.log("Erro ao buscar CEP:", err);
  }
}


/* ========================= Component ========================= */

export default function Filial({ open }) {
  const navigate = useNavigate();
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  const [activeTab, setActiveTab] = useState("cadastro");
  const [model, setModel] = useState(new FilialModel());
  const [empresas, setEmpresas] = useState([]);
  const [lista, setLista] = useState([]);

  // ✅ Modais auxiliares
  const [showParametroModal, setShowParametroModal] = useState(false);
  const [showNumeracaoModal, setShowNumeracaoModal] = useState(false);

  // ✅ Mensagens (sucesso/confirm/erro)
  const [modalMsg, setModalMsg] = useState("");
  const [modalColor, setModalColor] = useState("text-green-700");
  const [modalConfirm, setModalConfirm] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  // ✅ Estados para cards retráteis
  const [showTributos, setShowTributos] = useState(true);
  const [showDocumentos, setShowDocumentos] = useState(true);

  useEffect(() => {
    carregarEmpresas();
    carregarFiliais();
    
    // ✅ Define a empresa padrão no modelo ao iniciar
    const codEmpresa = localStorage.getItem("usuarioEmpresa") || "";
    if (codEmpresa) {
        setModel(prev => {
            const m = new FilialModel(prev);
            m.cd_Empresa = codEmpresa;
            return m;
        });
    }
  }, []);

  const carregarEmpresas = async () => {
    try {
      const resp = await EmpresaService.BuscarTodas();
      if (resp?.sucesso && resp?.data) {
        // ✅ Função auxiliar para buscar campo de forma case-insensitive e parcial
        const findVal = (obj, targetKey) => {
            const keys = Object.keys(obj);
            const lowTarget = targetKey.toLowerCase();
            // Match exato
            const exact = keys.find(k => k.toLowerCase() === lowTarget);
            if (exact) return obj[exact];
            // Match parcial (ex: "razao" em "razao_Social")
            const partial = keys.find(k => k.toLowerCase().includes(lowTarget.split('_')[0]));
            if (partial) return obj[partial];
            return undefined;
        };

        setEmpresas(resp.data.map(e => ({
            cd_Empresa: findVal(e, "cd_Empresa") || findVal(e, "cd_Empresa_Referencia") || "",
            razao_Social: findVal(e, "razao_Social") || findVal(e, "nome") || findVal(e, "fantasia") || ""
        })));
      }
    } catch (err) {
      console.error("Erro ao carregar empresas:", err);
    }
  };

  const carregarFiliais = async () => {
    try {
      const codEmpresa = localStorage.getItem("usuarioEmpresa") || "";
      const resp = await FilialService.BuscarTodas({ cd_Empresa: codEmpresa });
      if (resp?.sucesso && resp?.data) {
        // ✅ Mapeia através do FilialModel para garantir nomes de propriedades consistentes (cd_Filial)
        setLista(resp.data.map(f => new FilialModel(f)));
      } else {
        errorMessage(resp?.erros || "Erro ao carregar lista de filiais.");
      }
    } catch (err) {
      errorMessage("Falha de comunicação.");
    }
  };



  const isChecked = (val) => val === "S";
  const toggleCheckbox = (field) => {
    setModel((prev) => ({
      ...prev,
      [field]: prev[field] === "S" ? "N" : "S",
    }));
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      // ✅ Busca no Hub Desenvolvedor se for o campo de CNPJ
      if (e.target.name === "cgc" && model.cgc) {
        try {
          const resp = await FilialService.BuscarFilialHubDesenvolvedor(model);
          if (resp?.sucesso && resp?.data) {
            setModel(new FilialModel(resp.data));
          } else {
            try {
              const erro = typeof resp?.erros === "string" ? JSON.parse(resp.erros) : resp?.erros;
              if (erro?.errorCode === "VALIDATION_ERROR") {
                infoMessage(erro.message);
              } else {
                errorMessage(erro?.message || "Erro ao buscar filial no Hub Desenvolvedor.");
              }
            } catch {
              errorMessage(resp?.erros || "Erro ao buscar filial no Hub Desenvolvedor.");
            }
          }
        } catch {
          errorMessage("Falha de comunicação com o servidor.");
        }
      }

      const currentTab = parseInt(e.target.getAttribute("tabindex"));
      const nextTab = currentTab + 1;
      const nextEl = document.querySelector(`[tabindex="${nextTab}"]`);
      if (nextEl) nextEl.focus();
    }
  };

  const handleChangeModel = (field, value) => {
    setModel((prev) => ({ ...prev, [field]: value }));
  };

  const handleLimpar = () => {
    const cleanModel = new FilialModel();
    cleanModel.cd_Empresa = localStorage.getItem("usuarioEmpresa") || "";
    setModel(cleanModel);
    carregarFiliais();
  };

  const handleSelecionarFilial = async (row) => {
    try {
      // ✅ Garantir que enviamos o modelo com o código correto da grid
      const modelBusca = new FilialModel(row);
      
      // Se por acaso cd_Filial veio vazio da modelagem, força o que está na linha
      if (!modelBusca.cd_Filial && row.cd_Filial) modelBusca.cd_Filial = row.cd_Filial;
      if (!modelBusca.cd_Empresa) modelBusca.cd_Empresa = row.cd_Empresa || localStorage.getItem("usuarioEmpresa") || "";

      const resp = await FilialService.BuscarFilial(modelBusca);
      if (resp?.sucesso && resp?.data) {
        setModel(new FilialModel(resp.data));
        setActiveTab("cadastro");
      } else {
        errorMessage(resp?.erros || "Erro ao buscar detalhes da filial.");
      }
    } catch {
      errorMessage("Falha de comunicação.");
    }
  };

  const handleIncluir = async () => {
    try {
      if (!model.cd_Filial) return infoMessage("Informe o código!");

      const result = await confirmMessage("Confirmar Inclusão", "Deseja realmente incluir esta filial?");
      if (!result.isConfirmed) return;

      const modelToSave = { 
        ...model, 
        cd_Empresa: model.cd_Empresa || localStorage.getItem("usuarioEmpresa") || "" 
      };
      
      const resp = await FilialService.IncluirFilial(modelToSave);
      if (resp?.sucesso) {
        successMessage(resp.data || "Filial incluída com sucesso!");
        handleLimpar();
        carregarFiliais();
      } else {
        const erro = typeof resp?.erros === "string" ? JSON.parse(resp.erros) : resp?.erros;
        errorMessage(erro?.message || "Erro ao incluir filial.");
      }
    } catch {
      errorMessage("Falha de comunicação.");
    }
  };

  const handleAlterar = async () => {
    try {
      if (!model.cd_Filial) return infoMessage("Selecione uma filial para alterar!");

      const result = await confirmMessage("Confirmar Alteração", "Deseja realmente alterar esta filial?");
      if (result.isConfirmed) {
        const resp = await FilialService.AlterarFilial(model);
        if (resp?.sucesso) {
          successMessage(resp.data || "Filial alterada com sucesso!");
          carregarFiliais();
        } else {
          const erro = typeof resp?.erros === "string" ? JSON.parse(resp.erros) : resp?.erros;
          errorMessage(erro?.message || "Erro ao alterar filial.");
        }
      }
    } catch {
      errorMessage("Falha de comunicação.");
    }
  };

  const handleExcluir = async () => {
    try {
      if (!model.cd_Filial) return infoMessage("Selecione uma filial para excluir!");

      const result = await confirmMessage("Confirmar Exclusão", `Deseja realmente excluir a filial ${model.cd_Filial}?`);
      if (result.isConfirmed) {
        const resp = await FilialService.ExcluirFilial(model);
        if (resp?.sucesso) {
          successMessage(resp.data || "Filial excluída com sucesso!");
          handleLimpar();
          carregarFiliais();
        } else {
          const erro = typeof resp?.erros === "string" ? JSON.parse(resp.erros) : resp?.erros;
          errorMessage(erro?.message || "Erro ao excluir filial.");
        }
      }
    } catch {
      errorMessage("Falha de comunicação.");
    }
  };




  return (
    <div
      className={`mt-[44px] text-[13px] text-gray-700 bg-gray-50 h-[calc(100vh-56px)] flex flex-col ${open ? "ml-[192px]" : "ml-[56px]"
        }`}
    >
      {/* Título */}
      <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
        CADASTRO FILIAL
      </h1>

      {/* Abas */}
      <div className="flex border-b border-gray-300 bg-white">
        {["cadastro", "consulta"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1 text-sm font-medium border-t border-x rounded-t-md ${activeTab === tab
              ? "bg-white text-red-700 border-gray-300"
              : "bg-gray-100 text-gray-600 border-transparent"
              } ${tab !== "cadastro" ? "ml-1" : ""}`}
          >
            {tab === "cadastro" ? "Filial" : "Consulta"}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 p-3 bg-white border-x border-b border-gray-200 rounded-b-md overflow-y-auto flex flex-col gap-3">
        {/* ================================== ABA CADASTRO ================================== */}
        {activeTab === "cadastro" && (
          <>
            {/* CARD 1 - Dados principais */}
            <fieldset className="border border-gray-300 rounded px-3 pt-1 pb-3 bg-white">
              <legend className="text-red-700 font-semibold text-[13px] px-2">
                Dados da Filial
              </legend>

              <div className="space-y-2">
                {/* Linha 1 - Código, CNPJ, Sigla, Empresa */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1">Código</Label>
                  <Txt
                    className="col-span-1 text-center"
                    value={model.cd_Filial}
                    onChange={(e) => handleChangeModel("cd_Filial", e.target.value)}
                    onKeyDown={handleKeyDown}
                    tabIndex={1}
                  />

                  <Label className="col-span-1">CNPJ</Label>
                  <Txt
                    name="cgc"
                    className="col-span-2"
                    value={maskCNPJ(model.cgc)}
                    onChange={(e) => handleChangeModel("cgc", onlyDigits(e.target.value))}
                    onKeyDown={handleKeyDown}
                    tabIndex={2}
                    placeholder="00.000.000/0000-00"
                  />

                  <Label className="col-span-1">Sigla</Label>
                  <Txt
                    className="col-span-1 text-center"
                    value={model.sigla}
                    onChange={(e) => handleChangeModel("sigla", e.target.value)}
                    onKeyDown={handleKeyDown}
                    tabIndex={3}
                  />

                  <Label className="col-span-1">Empresa</Label>
                  <Sel
                    className="col-span-4"
                    value={model.cd_Empresa}
                    onChange={(e) => handleChangeModel("cd_Empresa", e.target.value)}
                    onKeyDown={handleKeyDown}
                    tabIndex={4}
                  >
                    <option value="">Selecione a Empresa...</option>
                    {empresas.map((emp) => (
                      <option key={emp.cd_Empresa} value={emp.cd_Empresa}>
                        {emp.cd_Empresa} - {emp.razao_Social}
                      </option>
                    ))}
                  </Sel>
                </div>

                {/* Linha 2 - Razão Social e IE */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1">Razão Social</Label>
                  <Txt
                    className="col-span-7"
                    value={model.nome}
                    onChange={(e) => handleChangeModel("nome", e.target.value)}
                    onKeyDown={handleKeyDown}
                    tabIndex={5}
                  />
                  <Label className="col-span-1">IE</Label>
                  <Txt
                    className="col-span-3"
                    value={model.ie}
                    onChange={(e) => handleChangeModel("ie", e.target.value)}
                    onKeyDown={handleKeyDown}
                    tabIndex={6}
                  />
                </div>

                {/* Linha 3 - CEP, Endereço, Nº */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1">CEP</Label>
                  <Txt
                    className="col-span-2"
                    value={maskCEP(model.cep)}
                    onChange={(e) => {
                      const val = onlyDigits(e.target.value);
                      handleChangeModel("cep", val);
                      if (val.length === 8) {
                        buscarCEP(val, (data) => {
                           if (typeof data === "function") {
                             setModel(prev => ({...prev, ...data(prev)}));
                           } else {
                             setModel(prev => ({...prev, ...data}));
                           }
                        });
                      }
                    }}
                    onKeyDown={handleKeyDown}
                    tabIndex={6}
                    placeholder="00000-000"
                  />

                  <Label className="col-span-1">Endereço</Label>
                  <Txt
                    className="col-span-6"
                    value={model.endereco}
                    onChange={(e) => handleChangeModel("endereco", e.target.value)}
                    onKeyDown={handleKeyDown}
                    tabIndex={7}
                  />

                  <Label className="col-span-1">Nº</Label>
                  <Txt
                    className="col-span-1 text-center"
                    value={model.numero}
                    onChange={(e) => handleChangeModel("numero", e.target.value)}
                    onKeyDown={handleKeyDown}
                    tabIndex={8}
                  />
                </div>

                {/* Linha 4 - Cidade, UF, Bairro */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1">Cidade</Label>
                  <InputBuscaCidade
                    label={null}
                    className="col-span-4"
                    value={model.cidade}
                    onChange={(e) => handleChangeModel("cidade", e.target.value)}
                    onSelect={(city) => {
                      setModel((prev) => ({
                        ...prev,
                        cidade: city.nome,
                        cep: onlyDigits(city.cep),
                        uf: city.uf,
                      }));
                      setTimeout(() => document.querySelector('[tabindex="10"]')?.focus(), 10);
                    }}
                    tabIndex={9}
                  />

                  <Label className="col-span-1">UF</Label>
                  <Txt
                    className="col-span-1 text-center bg-gray-200"
                    readOnly
                    value={model.uf}
                  />

                  <Label className="col-span-1">Bairro</Label>
                  <Txt
                    className="col-span-4"
                    value={model.bairro}
                    onChange={(e) => handleChangeModel("bairro", e.target.value)}
                    onKeyDown={handleKeyDown}
                    tabIndex={10}
                  />
                </div>

                {/* Linha 5 - CNAE, IM */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1">CNAE</Label>
                  <Txt
                    className="col-span-3"
                    value={model.cnae}
                    onChange={(e) => handleChangeModel("cnae", e.target.value)}
                    onKeyDown={handleKeyDown}
                    tabIndex={11}
                  />

                  <Label className="col-span-1">I.M</Label>
                  <Txt
                    className="col-span-7"
                    value={model.i_Municipal}
                    onChange={(e) => handleChangeModel("i_Municipal", e.target.value)}
                    onKeyDown={handleKeyDown}
                    tabIndex={12}
                  />
                </div>

                {/* Linha 6 - Email / Email Ocor */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1">E-mail</Label>
                  <Txt
                    className="col-span-5"
                    value={model.e_Mail}
                    onChange={(e) => handleChangeModel("e_Mail", e.target.value)}
                    onKeyDown={handleKeyDown}
                    tabIndex={13}
                  />

                  <Label className="col-span-1">E-mail Ocor</Label>
                  <Txt
                    className="col-span-5"
                    value={model.e_Mail_Ocorrencia}
                    onChange={(e) => handleChangeModel("e_Mail_Ocorrencia", e.target.value)}
                    onKeyDown={handleKeyDown}
                    tabIndex={14}
                  />
                </div>

                {/* Linha 7 - Fones e PIX */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1">Fone</Label>
                  <Txt
                    className="col-span-2"
                    value={maskPhone(model.fone)}
                    onChange={(e) => handleChangeModel("fone", onlyDigits(e.target.value))}
                    onKeyDown={handleKeyDown}
                    tabIndex={15}
                    placeholder="(00) 00000-0000"
                  />

                  <Label className="col-span-1">Fone 2</Label>
                  <Txt
                    className="col-span-2"
                    value={maskPhone(model.fax)}
                    onChange={(e) => handleChangeModel("fax", onlyDigits(e.target.value))}
                    onKeyDown={handleKeyDown}
                    tabIndex={16}
                    placeholder="(00) 00000-0000"
                  />
                  <Label className="col-span-1">PIX</Label>
                  <Txt
                    className="col-span-5"
                    value={model.pix}
                    onChange={(e) => handleChangeModel("pix", e.target.value)}
                    onKeyDown={handleKeyDown}
                    tabIndex={17}
                  />
                </div>

                {/* Linha 8 - Envio, Receb., Autotrac */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1">Envio</Label>
                  <Txt
                    className="col-span-3"
                    value={model.diretorio_Envio}
                    onChange={(e) => handleChangeModel("diretorio_Envio", e.target.value)}
                    onKeyDown={handleKeyDown}
                    tabIndex={18}
                  />

                  <Label className="col-span-1">Receb.</Label>
                  <Txt
                    className="col-span-3"
                    value={model.diretorio_Recebimento}
                    onChange={(e) => handleChangeModel("diretorio_Recebimento", e.target.value)}
                    onKeyDown={handleKeyDown}
                    tabIndex={19}
                  />

                  <Label className="col-span-1">Autotrac</Label>
                  <Txt
                    className="col-span-3"
                    value={model.diretorio_Autotrac}
                    onChange={(e) => handleChangeModel("diretorio_Autotrac", e.target.value)}
                    onKeyDown={handleKeyDown}
                    tabIndex={20}
                  />
                </div>

                {/* Linha 9 - Apólice, OTM, ANTT */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1">Nº Apólice</Label>
                  <Txt
                    className="col-span-3"
                    value={model.nr_Apolice}
                    onChange={(e) => handleChangeModel("nr_Apolice", e.target.value)}
                    onKeyDown={handleKeyDown}
                    tabIndex={21}
                  />

                  <Label className="col-span-1">Cód. OTM</Label>
                  <Txt
                    className="col-span-2"
                    value={model.cd_OTM}
                    onChange={(e) => handleChangeModel("cd_OTM", e.target.value)}
                    onKeyDown={handleKeyDown}
                    tabIndex={22}
                  />

                  <Label className="col-span-1">Nº ANTT</Label>
                  <Txt
                    className="col-span-3"
                    value={model.nr_ANTT}
                    onChange={(e) => handleChangeModel("nr_ANTT", e.target.value)}
                    onKeyDown={handleKeyDown}
                    tabIndex={23}
                  />
                  <label className="flex items-center gap-1 text-[12px]">
                    <input
                      type="checkbox"
                      className="accent-red-700"
                      checked={isChecked(model.fl_Filial_Terceiros)}
                      onChange={() => toggleCheckbox("fl_Filial_Terceiros")}
                    />
                    Filial Terceiros
                  </label>
                </div>
              </div>
            </fieldset>

            {/* CARD 2 - Tributos (retrátil) */}
            <div className="border border-gray-300 rounded bg-white">
              <div
                className="flex justify-between items-center px-3 py-1 bg-gray-50 cursor-pointer select-none rounded-t"
                onClick={() => setShowTributos((prev) => !prev)}
              >
                <h2 className="text-red-700 font-semibold text-[13px]">Tributos</h2>
                {showTributos ? (
                  <ChevronUp size={16} className="text-gray-600" />
                ) : (
                  <ChevronDown size={16} className="text-gray-600" />
                )}
              </div>

              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${showTributos ? "max-h-[800px]" : "max-h-[0px]"
                  }`}
              >
                <div className="p-3 grid grid-cols-12 gap-3 text-[12px]">

                  {/* ================= TRIBUTAÇÃO ================= */}
                  <fieldset className="border border-gray-300 rounded p-2 col-span-3">
                    <legend className="px-1 text-[11px] font-semibold">TRIBUTAÇÃO</legend>

                    <div className="grid grid-cols-12 gap-2 mt-1">
                      <label className="col-span-12 flex items-center gap-1">
                        <input type="radio" name="tributacao" className="accent-red-700" />
                        Optante Simples Nacional
                      </label>

                      <label className="col-span-12 flex items-center gap-1">
                        <input type="radio" name="tributacao" className="accent-red-700" />
                        Lucro Real
                      </label>

                      <label className="col-span-12 flex items-center gap-1">
                        <input
                          type="radio"
                          name="tributacao"
                          className="accent-red-700"
                          defaultChecked
                        />
                        Lucro Presumido
                      </label>
                    </div>
                  </fieldset>

                  {/* ================= OUTROS TRIBUTOS ================= */}
                  <fieldset className="border border-gray-300 rounded p-2 col-span-3">
                    <legend className="px-1 text-[11px] font-semibold">OUTROS TRIBUTOS</legend>

                    <div className="grid grid-cols-12 gap-2 mt-1">

                      {/* Linha 1 */}
                      <div className="col-span-12 grid grid-cols-12 gap-2 items-center">
                        <span className="col-span-4">% KG Col.</span>
                        <Txt className="col-span-2 text-right" defaultValue="0,000" />

                        <span className="col-span-4">% Entrega</span>
                        <Txt className="col-span-2 text-right" defaultValue="0,00" />
                      </div>

                      {/* Linha 2 */}
                      <div className="col-span-12 grid grid-cols-12 gap-2 items-center">
                        <span className="col-span-6">% Total Tributos - IBPT</span>
                        <Txt className="col-span-2 text-right" defaultValue="0,00" />
                      </div>

                    </div>
                  </fieldset>

                  {/* ================= IMPOSTO ================= */}
                  <fieldset className="border border-gray-300 rounded p-2 col-span-3">
                    <legend className="px-1 text-[11px] font-semibold">IMPOSTO</legend>

                    <div className="grid grid-cols-12 gap-2 mt-1">

                      {/* Linha 1 */}
                      <div className="col-span-12 grid grid-cols-12 gap-2 items-center">
                        <span className="col-span-4">PIS</span>
                        <Txt className="col-span-2 text-right" defaultValue="0,00" />

                        <span className="col-span-4">Cofins</span>
                        <Txt className="col-span-2 text-right" defaultValue="0,00" />
                      </div>

                      {/* Linha 2 */}
                      <div className="col-span-12 grid grid-cols-12 gap-2 items-center">
                        <span className="col-span-4">Sest/Senat</span>
                        <Txt className="col-span-2 text-right" defaultValue="2,50" />

                        <span className="col-span-4">ISS</span>
                        <Txt className="col-span-2 text-right" defaultValue="0,00" />
                      </div>

                      {/* Linha 3 */}
                      <div className="col-span-12 grid grid-cols-12 gap-2 items-center">
                        <span className="col-span-4">CSSL</span>
                        <Txt className="col-span-2 text-right" defaultValue="0,00" />

                        <span className="col-span-4">IR</span>
                        <Txt className="col-span-2 text-right" defaultValue="0,00" />
                      </div>

                    </div>
                  </fieldset>

                  {/* ================= COLETA ================= */}
                  <fieldset className="border border-gray-300 rounded p-2 col-span-3">
                    <legend className="px-1 text-[11px] font-semibold">COLETA</legend>

                    <div className="grid grid-cols-12 gap-2 mt-1">

                      <div className="col-span-12 flex items-center gap-2">
                        <span>Valor Coleta</span>
                        <Txt className="w-[100px] text-right" defaultValue="10,00" />
                      </div>

                      <label className="col-span-12 flex items-center gap-2">
                        <input type="checkbox" className="accent-red-700" defaultChecked />
                        Rateio
                      </label>

                    </div>
                  </fieldset>

                </div>
              </div>
            </div>


            {/* CARD 3 - Documentos / Regras (retrátil) */}
            <div className="border border-gray-300 rounded bg-white">
              <div
                className="flex justify-between items-center px-3 py-1 bg-gray-50 cursor-pointer select-none rounded-t"
                onClick={() => setShowDocumentos((prev) => !prev)}
              >
                <h2 className="text-red-700 font-semibold text-[13px]">
                  Documentos / Regras
                </h2>
                {showDocumentos ? (
                  <ChevronUp size={16} className="text-gray-600" />
                ) : (
                  <ChevronDown size={16} className="text-gray-600" />
                )}
              </div>

              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${showDocumentos ? "max-h-[600px]" : "max-h-[0px]"
                  }`}
              >
                {/* === GRID DE 12 COLUNAS PARA OS CARDS === */}
                <div className="p-3 grid grid-cols-12 gap-3 text-[12px]">

                  {/* CTE */}
                  <fieldset className="border border-gray-300 rounded p-2 col-span-6">
                    <legend className="px-1 text-[11px] font-semibold">CTE</legend>

                    {/* GRID INTERNO COM 2 COLUNAS */}
                    <div className="grid grid-cols-2 gap-4 mt-1">

                      {/* COLUNA 1 */}
                      <div className="space-y-1">
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            className="accent-red-700"
                            checked={isChecked(model.fl_Fatura_CTRC_Sem_Baixa)}
                            onChange={() => toggleCheckbox("fl_Fatura_CTRC_Sem_Baixa")}
                          />
                          Permite Faturar CTe sem Baixa
                        </label>

                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            className="accent-red-700"
                            checked={isChecked(model.fl_Rateia_Divisao)}
                            onChange={() => toggleCheckbox("fl_Rateia_Divisao")}
                          />
                          Fazer Rateio por Loja/Divisão
                        </label>

                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            className="accent-red-700"
                            checked={isChecked(model.fl_Contingencia_CTe)}
                            onChange={() => toggleCheckbox("fl_Contingencia_CTe")}
                          />
                          Emitir CTe/MDFe em Contingência
                        </label>

                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            className="accent-red-700"
                            checked={isChecked(model.fl_LIMPA_TELA_CTE)}
                            onChange={() => toggleCheckbox("fl_LIMPA_TELA_CTE")}
                          />
                          Permite Alterar Valores do CTe
                        </label>

                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            className="accent-red-700"
                            checked={isChecked(model.fl_ICMS_no_Frete)}
                            onChange={() => toggleCheckbox("fl_ICMS_no_Frete")}
                          />
                          Não Cobrar ICMS dentro da UF
                        </label>
                      </div>

                      {/* COLUNA 2 */}
                      <div className="space-y-1">
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            className="accent-red-700"
                            checked={isChecked(model.fl_Baixa_por_NF)}
                            onChange={() => toggleCheckbox("fl_Baixa_por_NF")}
                          />
                          Controlar Baixa de Docs por NF
                        </label>

                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            className="accent-red-700"
                            checked={isChecked(model.fl_NR_CTRC_Auto)}
                            onChange={() => toggleCheckbox("fl_NR_CTRC_Auto")}
                          />
                          Numeração Automática CTRC
                        </label>

                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            className="accent-red-700"
                            checked={isChecked(model.fl_ICMS_Isento)}
                            onChange={() => toggleCheckbox("fl_ICMS_Isento")}
                          />
                          Isento ICMS tomador dentro do Estado
                        </label>

                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            className="accent-red-700"
                            checked={isChecked(model.fl_NF_Servico)}
                            onChange={() => toggleCheckbox("fl_NF_Servico")}
                          />
                          Emite Nota Fiscal de Serviço
                        </label>

                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            className="accent-red-700"
                            checked={isChecked(model.fl_Taxa_Coleta_Sem_Coleta)}
                            onChange={() => toggleCheckbox("fl_Taxa_Coleta_Sem_Coleta")}
                          />
                          Cobrar taxa de coleta sem geração de coleta
                        </label>
                      </div>

                    </div>
                  </fieldset>

                  {/* ================== CARD VIAGEM ================== */}
                  <fieldset className="border border-gray-300 rounded p-2 col-span-3">
                    <legend className="px-1 text-[11px] font-semibold">VIAGEM</legend>

                    <div className="space-y-1 mt-1">
                      <label className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          className="accent-red-700"
                          checked={isChecked(model.fl_Tabela_Agregado)}
                          onChange={() => toggleCheckbox("fl_Tabela_Agregado")}
                        />
                        Permite Tabela de Agregado p/ Frotista
                      </label>

                      <label className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          className="accent-red-700"
                          checked={isChecked(model.fl_Inicia_Viagem)}
                          onChange={() => toggleCheckbox("fl_Inicia_Viagem")}
                        />
                        Inicia Viagem com outra em Andamento
                      </label>

                      <label className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          className="accent-red-700"
                          checked={isChecked(model.fl_Bloqueia_Desp_Sem_Saldo)}
                          onChange={() => toggleCheckbox("fl_Bloqueia_Desp_Sem_Saldo")}
                        />
                        Não permitir despesa de viagem sem saldo
                      </label>

                      <label className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          className="accent-red-700"
                          checked={isChecked(model.fl_NR_Viagem_Auto)}
                          onChange={() => toggleCheckbox("fl_NR_Viagem_Auto")}
                        />
                        Numeração Automática Viagem
                      </label>

                      <label className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          className="accent-red-700"
                          checked={isChecked(model.fl_Inicia_Viagem_Coleta)}
                          onChange={() => toggleCheckbox("fl_Inicia_Viagem_Coleta")}
                        />
                        Inicia Viagem na Coleta
                      </label>
                    </div>
                  </fieldset>

                  {/* ================== CARD OUTROS ================== */}
                  <fieldset className="border border-gray-300 rounded p-2 col-span-3">
                    <legend className="px-1 text-[11px] font-semibold">OUTROS</legend>

                    <div className="space-y-1 mt-1">
                      <label className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          className="accent-red-700"
                          checked={isChecked(model.fl_Fatura_Minuta)}
                          onChange={() => toggleCheckbox("fl_Fatura_Minuta")}
                        />
                        Permite Faturamento de Minutas
                      </label>

                      <label className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          className="accent-red-700"
                          checked={isChecked(model.fl_Numeracao_Fatura_Filial)}
                          onChange={() => toggleCheckbox("fl_Numeracao_Fatura_Filial")}
                        />
                        Numeração de Fatura por Filial
                      </label>

                      <label className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          className="accent-red-700"
                          checked={isChecked(model.fl_Acerto_Contas_Protocolo)}
                          onChange={() => toggleCheckbox("fl_Acerto_Contas_Protocolo")}
                        />
                        Acerto de Conta Mediante Protocolo Entrega
                      </label>

                      <label className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          className="accent-red-700"
                          checked={isChecked(model.fl_Limpa_Tela_Contas_Pagar)}
                          onChange={() => toggleCheckbox("fl_Limpa_Tela_Contas_Pagar")}
                        />
                        Limpar Tela Contas Pagar
                      </label>

                      <label className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          className="accent-red-700"
                          checked={isChecked(model.fl_Mostra_Apolice_CTe)}
                          onChange={() => toggleCheckbox("fl_Mostra_Apolice_CTe")}
                        />
                        Mostrar Apólice Cte
                      </label>
                    </div>
                  </fieldset>

                </div>
              </div>
            </div>

          </>
        )}

        {/* ================================== ABA CONSULTA ================================== */}
        {activeTab === "consulta" && (
          <div className="flex flex-col gap-3 h-full overflow-hidden">
            <fieldset className="flex-1 border border-gray-300 rounded bg-white p-3 shadow-sm overflow-hidden flex flex-col">
              <legend className="px-2 text-red-700 font-bold">Registros</legend>
              
              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-[12px] border-collapse">
                  <thead className="bg-gray-100 text-gray-700 sticky top-0 shadow-sm">
                    <tr>
                      <th className="border p-2 text-left">Cód. Filial</th>
                      <th className="border p-2 text-left">Sigla</th>
                      <th className="border p-2 text-left">CGC</th>
                      <th className="border p-2 text-left">IE</th>
                      <th className="border p-2 text-left">Nome</th>
                      <th className="border p-2 text-left">Endereço</th>
                      <th className="border p-2 text-left">Cidade</th>
                      <th className="border p-2 text-left">CEP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {lista.length > 0 ? (
                      lista.map((f, idx) => (
                        <tr
                          key={f.cd_Filial || idx}
                          className="hover:bg-red-50 cursor-pointer transition"
                          onClick={() => handleSelecionarFilial(f)}
                        >
                          <td className="border px-2 py-1 text-center font-medium">{f.cd_Filial}</td>
                          <td className="border px-2 py-1 text-center">{f.sigla}</td>
                          <td className="border px-2 py-1 text-center whitespace-nowrap">{maskCNPJ(f.cgc)}</td>
                          <td className="border px-2 py-1 text-center">{f.ie}</td>
                          <td className="border px-2 py-1">{f.nome}</td>
                          <td className="border px-2 py-1">{f.endereco}</td>
                          <td className="border px-2 py-1">{f.cidade}</td>
                          <td className="border px-2 py-1 text-center">{maskCEP(f.cep)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="text-center py-4 text-gray-500 italic">
                          Nenhuma filial encontrada.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </fieldset>
          </div>
        )}
      </div>

      {/* ================= FOOTER FIXO ================== */}
      <div className="bg-white border-t border-gray-200 p-2 flex items-center gap-6 z-10 shadow-[0_-2px_4px_rgba(0,0,0,0.05)]">
        {/* AÇÕES (TODOS À ESQUERDA) */}

          <button
            onClick={() => window.history.back()}
            title="Fechar"
            className={`flex flex-col items-center text-[11px] transition ${footerIconColorNormal} hover:${footerIconColorHover}`}
          >
            <XCircle size={18} />
            <span>Fechar</span>
          </button>

          <button
            onClick={handleLimpar}
            title="Limpar"
            className={`flex flex-col items-center text-[11px] transition ${footerIconColorNormal} hover:${footerIconColorHover}`}
          >
            <RotateCcw size={18} />
            <span>Limpar</span>
          </button>

          <button
            onClick={handleIncluir}
            title="Incluir"
            tabIndex={25}
            className={`flex flex-col items-center text-[11px] transition ${footerIconColorNormal} hover:${footerIconColorHover}`}
          >

            <PlusCircle size={18} />
            <span>Incluir</span>
          </button>

          {/* Alterar */}
          <button
            onClick={handleAlterar}
            title="Alterar Filial"
            className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
          >
            <Edit size={20} />
            <span>Alterar</span>
          </button>

          {/* Excluir */}
          <button
            onClick={handleExcluir}
            title="Excluir Filial"

            className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
          >
            <Trash2 size={20} />
            <span>Excluir</span>
          </button>

          {/* Parametro */}
          <button
            onClick={() => setShowParametroModal(true)}
            title="Parâmetros da Filial"
            className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
          >
            <SlidersHorizontal size={20} />
            <span>Parâmetro</span>
          </button>

          {/* Alterar Nº Documentos */}
          <button
            onClick={() => setShowNumeracaoModal(true)}
            title="Alterar Numeração de Documentos"
            className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
          >
            <FileText size={20} />
            <span>Alt. Nº Doc.</span>
          </button>

        {/* Modal Parâmetros */}
        {showParametroModal && (
          <FilialParametro 
            cd_Filial={model.cd_Filial} 
            onClose={() => setShowParametroModal(false)} 
          />
        )}

        {/* Modal Numeração */}
        {showNumeracaoModal && (
          <FilialNumeracao 
            model={model} 
            setModel={setModel} 
            onClose={() => setShowNumeracaoModal(false)} 
          />
        )}
      </div>
      {/* SUCESSO — modelo exatamente igual ao solicitado */}
      {modalMsg && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 shadow-lg rounded border text-center w-[300px]">
            <p className={`${modalColor} font-bold mb-4`}>
              {modalMsg}
            </p>
            <button
              className="px-3 py-1 bg-red-700 text-white rounded"
              onClick={() => {
                setModalMsg("");
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* CONFIRMAÇÃO — padrão Sim / Não */}
      {modalConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 shadow-lg rounded border text-center w-[300px]">
            <p className="text-red-700 font-bold mb-4">
              {confirmMsg}
            </p>

            <div className="flex justify-center gap-4">
              <button
                className="px-3 py-1 bg-red-700 text-white rounded"
                onClick={() => confirmAction && confirmAction()}
              >
                Sim
              </button>

              <button
                className="px-3 py-1 bg-gray-400 text-white rounded"
                onClick={() => setModalConfirm(false)}
              >
                Não
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
