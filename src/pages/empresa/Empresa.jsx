import { useState, useEffect } from "react";
import EmpresaParametro from "./EmpresaParametro";
import EmpresaCIOT from "./EmpresaCIOT";
import EmpresaModulos from "./EmpresaModulos";
import { useIconColor } from "../../context/IconColorContext";
import InputBuscaCidade from "../../components/InputBuscaCidade";
import { EmpresaService } from "../../services/EmpresaService";
import EmpresaModel from "../../models/empresa/EmpresaModel";
import { successMessage, errorMessage, infoMessage, confirmMessage } from "../../components/Mensagem";

import {
  XCircle,
  RotateCcw,
  PlusCircle,
  Edit,
  Trash2,
  Settings,
  Waypoints,
  Boxes, // Ícone do botão Módulos
  Loader2,
} from "lucide-react";

/* =============================
   Helpers visuais padrão Mantran
============================= */
function Label({ children, className = "" }) {
  return <label className={`text-[12px] text-gray-600 ${className}`}>{children}</label>;
}

function Txt(props) {
  return (
    <input
      {...props}
      className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] ${props.className || ""
        }`}
    />
  );
}

/* =============================
   Máscaras
============================= */
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

/* =============================
   Componente Principal
============================= */
export default function Empresa({ open }) {

  // ===== MODELO CADASTRO =====
  const [model, setModel] = useState(new EmpresaModel());
  const [loadingGrid, setLoadingGrid] = useState(false); // Indica se a grid está carregando os dados da API

  const handleChangeModel = (field, value) => {
    setModel((prev) => ({ ...prev, [field]: value }));
  };

  // 🔹 Lista de empresas para a grid
  const [lista, setLista] = useState([]);

  // useEffect para buscar os dados da API
  // Função para carregar empresas da API (reutilizável)
  const carregarEmpresas = async () => {
    setLoadingGrid(true);
    try {
      const resp = await EmpresaService.BuscarTodas();
      if (resp?.sucesso && resp.data) {
        const arrayEmpresas = Array.isArray(resp.data) ? resp.data : (resp.data.lista || []);
        const listaFormatada = arrayEmpresas.map(emp => new EmpresaModel(emp));
        setLista(listaFormatada);
      }
    } finally {
      setLoadingGrid(false);
    }
  };

  useEffect(() => {
    carregarEmpresas();
  }, []);

  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  const [showParametro, setShowParametro] = useState(false);
  const [showCIOT, setShowCIOT] = useState(false);
  const [showModulos, setShowModulos] = useState(false);

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (e.target.name === "cgc_CPF" && model.cgc_CPF) {
        try {
          const resp = await EmpresaService.BuscarEmpresaHubDesenvolvedor(model);
          if (resp?.sucesso && resp?.data) {
            setModel(new EmpresaModel(resp.data));
          } else {
            try {
              const erro = typeof resp?.erros === "string" ? JSON.parse(resp.erros) : resp?.erros;
              if (erro?.errorCode === "VALIDATION_ERROR") {
                infoMessage(erro.message);
              } else {
                errorMessage(erro?.message || "Erro ao buscar empresa no Hub Desenvolvedor.");
              }
            } catch {
              errorMessage(resp?.erros || "Erro ao buscar empresa no Hub Desenvolvedor.");
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

  const handleLimpar = () => {
    setModel(new EmpresaModel());
  };

  const handleIncluir = async () => {
    if (!model.cd_Empresa) return infoMessage("Informe o código!");
    const result = await confirmMessage("Confirmar Inclusão", "Deseja realmente incluir esta empresa?");
    if (!result.isConfirmed) return;

    try {
      const resp = await EmpresaService.IncluirEmpresa(model);
      if (resp?.sucesso) {
        successMessage(resp.data || "Empresa incluída com sucesso!");
        handleLimpar();
      } else {
        // Tentar parsear o erro retornado pela API (JSON com errorCode e message)
        try {
          const erro = typeof resp?.erros === "string" ? JSON.parse(resp.erros) : resp?.erros;
          if (erro?.errorCode === "VALIDATION_ERROR") {
            infoMessage(erro.message);
          } else {
            errorMessage(erro?.message || "Erro ao incluir empresa.");
          }
        } catch {
          errorMessage(resp?.erros || "Erro ao incluir empresa.");
        }
      }
      await carregarEmpresas();
    } catch { }
  };

  const handleAlterar = async () => {
    if (!model.cd_Empresa) return infoMessage("Selecione uma empresa para alterar!");
    const result = await confirmMessage("Confirmar Alteração", "Deseja realmente alterar esta empresa?");
    if (!result.isConfirmed) return;

    try {
      const resp = await EmpresaService.AlterarEmpresa(model);
      if (resp?.sucesso) {
        successMessage(resp.data || "Empresa alterada com sucesso!");
        handleLimpar();
      } else {
        try {
          const erro = typeof resp?.erros === "string" ? JSON.parse(resp.erros) : resp?.erros;
          if (erro?.errorCode === "VALIDATION_ERROR") {
            infoMessage(erro.message);
          } else {
            errorMessage(erro?.message || "Erro ao alterar empresa.");
          }
        } catch {
          errorMessage(resp?.erros || "Erro ao alterar empresa.");
        }
      }
      await carregarEmpresas();
    } catch { }
  };

  const handleExcluir = async () => {
    if (!model.cd_Empresa) return infoMessage("Selecione uma empresa para excluir!");
    const result = await confirmMessage("Confirmar Exclusão", `Deseja realmente excluir a empresa ${model.cd_Empresa}?`);
    if (!result.isConfirmed) return;

    try {
      const resp = await EmpresaService.ExcluirEmpresa(model);
      if (resp?.sucesso) {
        successMessage(resp.data || "Empresa excluída com sucesso!");
        handleLimpar();
      } else {
        try {
          const erro = typeof resp?.erros === "string" ? JSON.parse(resp.erros) : resp?.erros;
          if (erro?.errorCode === "VALIDATION_ERROR") {
            infoMessage(erro.message);
          } else {
            errorMessage(erro?.message || "Erro ao excluir empresa.");
          }
        } catch {
          errorMessage(resp?.erros || "Erro ao excluir empresa.");
        }
      }
      await carregarEmpresas();
    } catch { }
  };

  const selecionarItem = (item) => setModel({ ...item });

  return (
    <div
      className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 bg-gray-50 flex flex-col h-[calc(100vh-56px)] ${open ? "ml-[192px]" : "ml-[56px]"
        }`}
    >
      <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
        EMPRESA
      </h1>

      <div className="flex-1 p-3 overflow-y-auto bg-white border-x border-b border-gray-300">
        {/* === CARD 1 === */}
        <fieldset className="border border-gray-300 rounded px-3 pt-1 pb-3 mb-3">
          <legend className="px-2 text-red-700 font-semibold">Parâmetros</legend>

          {/* Código / Sigla / CNPJ */}
          <div className="grid grid-cols-3 gap-4 mb-2">
            <div className="flex items-center gap-2">
              <Label className="w-20">Código</Label>
              <Txt
                name="cd_Empresa"
                value={model.cd_Empresa}
                onChange={(e) => handleChangeModel("cd_Empresa", e.target.value)}
                onKeyDown={handleKeyDown}
                tabIndex={1}
                className="flex-1 ml-[45px]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Label className="w-20">Sigla</Label>
              <Txt
                name="sigla"
                value={model.sigla}
                onChange={(e) => handleChangeModel("sigla", e.target.value)}
                onKeyDown={handleKeyDown}
                tabIndex={2}
                className="flex-1"
              />
            </div>

            <div className="flex items-center gap-2">
              <Label className="w-16">CNPJ</Label>
              <Txt
                name="cgc_CPF"
                value={model.cgc_CPF}
                onChange={(e) => handleChangeModel("cgc_CPF", maskCNPJ(e.target.value))}
                onKeyDown={handleKeyDown}
                tabIndex={3}
                className="flex-1"
              />
            </div>
          </div>

          {/* Razão */}
          <div className="flex items-center gap-2 mb-2">
            <Label className="w-32">Razão Social</Label>
            <Txt
              name="razao_Social"
              value={model.razao_Social}
              onChange={(e) => handleChangeModel("razao_Social", e.target.value)}
              onKeyDown={handleKeyDown}
              tabIndex={4}
              className="flex-1 ml-[-3px]"
            />
          </div>

          {/* Fantasia / IE */}
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="flex items-center gap-2">
              <Label className="w-20">Fantasia</Label>
              <Txt
                name="fantasia"
                value={model.fantasia}
                onChange={(e) => handleChangeModel("fantasia", e.target.value)}
                onKeyDown={handleKeyDown}
                tabIndex={5}
                className="flex-1 ml-[45px]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Label className="w-10">IE</Label>
              <Txt
                name="ie"
                value={model.ie}
                onChange={(e) => handleChangeModel("ie", e.target.value)}
                onKeyDown={handleKeyDown}
                tabIndex={6}
                className="flex-1"
              />
            </div>
          </div>

          {/* CEP / Endereço */}
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="flex items-center gap-2">
              <Label className="w-16">CEP</Label>
              <Txt
                name="cep"
                value={model.cep}
                onChange={(e) => handleChangeModel("cep", maskCEP(e.target.value))}
                onKeyDown={handleKeyDown}
                tabIndex={7}
                className="flex-1 ml-[60px]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Label className="w-24">Endereço</Label>
              <Txt
                name="endereco"
                value={model.endereco}
                onChange={(e) => handleChangeModel("endereco", e.target.value)}
                onKeyDown={handleKeyDown}
                tabIndex={8}
                className="flex-1"
              />
            </div>
          </div>

          {/* Cidade / UF / Bairro */}
          <div className="grid grid-cols-[1fr_80px_1fr] gap-4 mb-2">
            <div className="flex items-center gap-2">
              <Label className="w-20">Cidade</Label>
              <InputBuscaCidade
                label={null}
                value={model.cidade}
                onChange={(e) => handleChangeModel("cidade", e.target.value)}
                onSelect={(city) => {
                  setModel((prev) => ({
                    ...prev,
                    cidade: city.nome,
                    cep: maskCEP(city.cep),
                    uf: city.uf,
                  }));
                  setTimeout(() => document.querySelector('[tabindex="10"]')?.focus(), 10);
                }}
                tabIndex={9}
                className="flex-1 ml-[45px]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Label className="w-10">UF</Label>
              <Txt
                name="uf"
                maxLength={2}
                value={model.uf}
                onChange={(e) => handleChangeModel("uf", e.target.value)}
                className="w-full text-center bg-gray-200"
                readOnly
              />
            </div>

            <div className="flex items-center gap-2">
              <Label className="w-16">Bairro</Label>
              <Txt
                name="bairro"
                value={model.bairro}
                onChange={(e) => handleChangeModel("bairro", e.target.value)}
                onKeyDown={handleKeyDown}
                tabIndex={10}
                className="flex-1"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-2 mb-2">
            <Label className="w-16">Email</Label>
            <Txt
              name="e_Mail"
              value={model.e_Mail}
              onChange={(e) => handleChangeModel("e_Mail", e.target.value)}
              onKeyDown={handleKeyDown}
              tabIndex={11}
              className="flex-1 ml-[60px]"
            />
          </div>

          {/* Telefone */}
          <div className="flex items-center gap-2">
            <Label className="w-16">Fone</Label>
            <Txt
              name="fone"
              value={model.fone}
              onChange={(e) => handleChangeModel("fone", maskPhone(e.target.value))}
              onKeyDown={handleKeyDown}
              tabIndex={12}
              className="flex-1 ml-[60px]"
            />
          </div>
        </fieldset>

        {/* === GRID === */}
        <fieldset className="border border-gray-300 rounded px-3 pt-1 pb-3 min-w-0">
          <legend className="px-2 text-red-700 font-semibold">Registros</legend>

          <div className="overflow-x-auto">
            <table className="w-full text-[12px] mt-2 ">
              <thead className="bg-gray-100 border">
                <tr>
                  {[
                    "Código",
                    "Sigla",
                    "CGC/CPF",
                    "IE",
                    "Razão Social",
                    "Fantasia",
                    "Endereço",
                    "Bairro",
                    "Cidade",
                    "UF",
                    "CEP",
                    "Fone",
                    "E-mail",
                  ].map((c) => (
                    <th key={c} className="border px-1 py-[4px] text-left whitespace-nowrap ">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loadingGrid ? (
                  <tr>
                    <td colSpan="13" className="text-center py-8 text-gray-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="animate-spin text-red-600" size={28} />
                        <span>Carregando empresas...</span>
                      </div>
                    </td>
                  </tr>
                ) : lista.length === 0 ? (
                  <tr>
                    <td colSpan="13" className="text-center py-4 text-gray-400">
                      Nenhuma empresa encontrada.
                    </td>
                  </tr>
                ) : (
                  lista.map((item, i) => (
                    <tr
                      key={i}
                      className="hover:bg-red-50 cursor-pointer"
                      onClick={() => selecionarItem(item)}
                    >
                      <td className="border px-1 whitespace-nowrap">{item.cd_Empresa}</td>
                      <td className="border px-1 whitespace-nowrap">{item.sigla}</td>
                      <td className="border px-1 whitespace-nowrap">{item.cgc_CPF}</td>
                      <td className="border px-1 whitespace-nowrap">{item.ie}</td>
                      <td className="border px-1 whitespace-nowrap">{item.razao_Social}</td>
                      <td className="border px-1 whitespace-nowrap">{item.fantasia}</td>
                      <td className="border px-1 whitespace-nowrap">{item.endereco}</td>
                      <td className="border px-1 whitespace-nowrap">{item.bairro}</td>
                      <td className="border px-1 whitespace-nowrap">{item.cidade}</td>
                      <td className="border px-1 whitespace-nowrap">{item.uf}</td>
                      <td className="border px-1 whitespace-nowrap">{item.cep}</td>
                      <td className="border px-1 whitespace-nowrap">{item.fone}</td>
                      <td className="border px-1 whitespace-nowrap">{item.e_Mail}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </fieldset>
      </div>

      {/* ================= FOOTER FIXO ================== */}
      <div className="bg-white border-t border-gray-200 p-2 flex items-center gap-4 z-10 shadow-[0_-2px_4px_rgba(0,0,0,0.05)] overflow-x-auto whitespace-nowrap">
        {/* AÇÕES (TODOS À ESQUERDA - UNIFICADOS) */}
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
          tabIndex={13}
          className={`flex flex-col items-center text-[11px] transition ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <PlusCircle size={18} />
          <span>Incluir</span>
        </button>

        <button
          onClick={handleAlterar}
          title="Alterar"
          className={`flex flex-col items-center text-[11px] transition ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <Edit size={18} />
          <span>Alterar</span>
        </button>

        <button
          onClick={handleExcluir}
          title="Excluir"
          className={`flex flex-col items-center text-[11px] transition ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <Trash2 size={18} />
          <span>Excluir</span>
        </button>

        <button
          onClick={() => setShowParametro(true)}
          title="Parâmetros"
          className={`flex flex-col items-center text-[11px] transition ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <Settings size={18} />
          <span>Parâmetros</span>
        </button>

        <button
          onClick={() => setShowCIOT(true)}
          title="CIOT"
          className={`flex flex-col items-center text-[11px] transition ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <Waypoints size={18} />
          <span>CIOT</span>
        </button>

        <button
          onClick={() => setShowModulos(true)}
          title="Módulos"
          className={`flex flex-col items-center text-[11px] transition ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <Boxes size={18} />
          <span>Módulos</span>
        </button>
      </div>

      {/* MODAIS */}
      {showParametro && <EmpresaParametro empresa={model} onClose={() => setShowParametro(false)} />}
      {showCIOT && <EmpresaCIOT onClose={() => setShowCIOT(false)} />}

      {showModulos && <EmpresaModulos onClose={() => setShowModulos(false)} />}
    </div>
  );
}
