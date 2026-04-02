// src/pages/EmpresaFilialParametro.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  XCircle,
  RotateCcw,
  PlusCircle,
  Edit,
  Trash2,
  Settings2,
  Truck,
} from "lucide-react";
import FilialParametro from "./filial/FilialParametro";
import { useIconColor } from "../context/IconColorContext";

/* ========= Helpers ========= */
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

/* ========= Modal Subcontratado ========= */
function SubcontratadoModal({ onClose }) {
  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 sm:left-14 lg:left-52 bg-black/40 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-lg w-[680px]">
        {/* TÍTULO */}
        <div className="text-center text-red-700 font-semibold border-b py-2 text-sm">
          Parâmetros Diferenciados para Subcontratado
        </div>

        {/* CONTEÚDO */}
        <div className="p-4 space-y-3 text-[13px]">
          {/* Linha 1 */}
          <div className="grid grid-cols-12 gap-2 items-center">
            <Label className="col-span-4">Operações Estaduais</Label>
            <Sel className="col-span-8">
              <option>5352 - PREST DE SERV DE TRANSPORTES A ESTABE</option>
              <option>5301 - OUTRA OPÇÃO</option>
            </Sel>
          </div>

          {/* Linha 2 */}
          <div className="grid grid-cols-12 gap-2 items-center">
            <Label className="col-span-4">Operações Interestaduais</Label>
            <Sel className="col-span-8">
              <option>6352 - PRESTACAO DE SERVICO DE TRANSPORTE A E</option>
              <option>6301 - OUTRA OPÇÃO</option>
            </Sel>
          </div>

          {/* Linha 3 */}
          <div className="grid grid-cols-12 gap-2 items-center">
            <Label className="col-span-4">CST</Label>
            <Sel className="col-span-8">
              <option>00 - Tributada integralmente</option>
              <option>20 - Com redução de base</option>
              <option>40 - Isenta</option>
            </Sel>
          </div>
        </div>

        {/* RODAPÉ */}
        <div className="border-t px-4 py-2 flex items-center">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-red-600 text-[12px]"
          >
            <span className="text-xl leading-none">←</span>
            <span>Fechar</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EmpresaFilialParametro({ open }) {
  const navigate = useNavigate();
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  const initialDados = {
    empresa: "001",
    filial: "001",
    vrBloqueio: "1000000,00",
    vrAviso: "1000000,00",
    indicaRedutor: "1,00",
    percJuros: "1,00",
    tabelaPadrao: "000000",
    tabelaContrato: false,
    condPagto: "00",
    tabelaColeta: "",
    baseCalculo: "",
    moeda: "REAL",
    mensSubstituicao: "",
    periodoFat: "Quinzenal",
    mensICMSIsento: "",
    mensISS: "",
    portador: "033 - BANCO SANTANDER SA",
    permitePesoValor0Cte: false,
    permitePesoValor0Mdfe: false,
    fatAutomatico: true,
    modeloCtrc: "Modelo Padrão 1",
    integracaoReceb: "",
    vrLimiteCteAuto: "",
    modeloColeta: "1/2 FOLHA (ESPELHO)",
    cnpjAutCte: "",
    tetoInss: "AGREGADO",
    respSeguro: "POR CONTA DO EMISSOR CTE",
    seguradoraPadrao: "001 - SOMPO SEGUROS",
    tipoFrete: "FATURADO",
  };

  const [aba, setAba] = useState("cadastro");
  const [showParametro, setShowParametro] = useState(false);
  const [showSubcontratado, setShowSubcontratado] = useState(false);

  // ✅ FORM CONTROLADO
  const [dados, setDados] = useState(initialDados);

  // ✅ LISTA + CRUD LOCAL
  const [lista, setLista] = useState([
    {
      empresa: "001",
      filial: "001",
      vrBloqueio: "1000000,00",
      vrAviso: "1000000,00",
      tabelaFrete: "000000",
      cond: "00",
      moeda: "REAL",
      sigla: "R$",
      indiceRedutor: "1,00",
      baseCalculo: "",
      substTrib: "",
      icmsIsento: "",
    },
  ]);

  // ✅ SELEÇÃO (chave composta empresa+filial)
  const [chaveSelecionada, setChaveSelecionada] = useState("");

  // ✅ Modal padrão (sucesso)
  const [modalMsg, setModalMsg] = useState("");
  const [modalColor, setModalColor] = useState("text-green-700");

  // ✅ Confirmação (Sim/Não)
  const [modalConfirm, setModalConfirm] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  const keyOf = (emp, fil) => `${String(emp || "").trim()}|${String(fil || "").trim()}`;

  const handleChange = (field) => (e) => {
    const isCheck = e.target.type === "checkbox";
    const value = isCheck ? e.target.checked : e.target.value;
    setDados((prev) => ({ ...prev, [field]: value }));
  };

  const handleLimpar = () => {
    setDados(initialDados);
    setChaveSelecionada("");
  };

  const selecionarLinha = (item) => {
    setChaveSelecionada(keyOf(item.empresa, item.filial));

    setDados((prev) => ({
      ...prev,
      empresa: item.empresa ?? prev.empresa,
      filial: item.filial ?? prev.filial,
      vrBloqueio: item.vrBloqueio ?? "",
      vrAviso: item.vrAviso ?? "",
      tabelaPadrao: item.tabelaFrete ?? "",
      condPagto: item.cond ?? "00",
      moeda: item.moeda ?? "REAL",
      indicaRedutor: item.indiceRedutor ?? "1,00",
      baseCalculo: item.baseCalculo ?? "",
      mensSubstituicao: item.substTrib ?? "",
      mensICMSIsento: item.icmsIsento ?? "",
    }));

    setAba("cadastro");
  };

  function toRowFromDados(d) {
    return {
      empresa: String(d.empresa || "").trim(),
      filial: String(d.filial || "").trim(),
      vrBloqueio: String(d.vrBloqueio || "").trim(),
      vrAviso: String(d.vrAviso || "").trim(),
      tabelaFrete: String(d.tabelaPadrao || "").trim(),
      cond: String(d.condPagto || "").trim(),
      moeda: String(d.moeda || "").trim(),
      sigla: d.moeda === "REAL" ? "R$" : "US$",
      indiceRedutor: String(d.indicaRedutor || "").trim(),
      baseCalculo: String(d.baseCalculo || "").trim(),
      substTrib: String(d.mensSubstituicao || "").trim(),
      icmsIsento: String(d.mensICMSIsento || "").trim(),
    };
  }

  const handleIncluir = () => {
    const emp = String(dados.empresa || "").trim();
    const fil = String(dados.filial || "").trim();
    if (!emp) return alert("Informe a empresa!");
    if (!fil) return alert("Informe a filial!");

    const k = keyOf(emp, fil);
    const jaExiste = lista.some((x) => keyOf(x.empresa, x.filial) === k);
    if (jaExiste) return alert("Já existe parâmetro para esta Empresa/Filial!");

    const row = toRowFromDados(dados);
    setLista((prev) => [...prev, row]);

    setModalColor("text-green-700");
    setModalMsg("Inclusão realizada com sucesso!");
    handleLimpar();
  };

  const handleAlterar = () => {
    const emp = String(dados.empresa || "").trim();
    const fil = String(dados.filial || "").trim();
    if (!emp || !fil) return alert("Selecione/informe Empresa e Filial para alterar!");

    const k = keyOf(emp, fil);
    const existe = lista.some((x) => keyOf(x.empresa, x.filial) === k);
    if (!existe) return alert("Não existe registro para esta Empresa/Filial. Use Incluir.");

    setConfirmMsg("Deseja alterar o Parâmetro da Filial?");
    setConfirmAction(() => () => {
      const row = toRowFromDados(dados);

      setLista((prev) =>
        prev.map((x) => (keyOf(x.empresa, x.filial) === k ? row : x))
      );

      setChaveSelecionada(k);
      setModalConfirm(false);

      setModalColor("text-green-700");
      setModalMsg("Alteração realizada com sucesso!");
    });
    setModalConfirm(true);
  };

  const handleExcluir = () => {
    const emp = String(dados.empresa || "").trim();
    const fil = String(dados.filial || "").trim();
    if (!emp || !fil) return alert("Selecione/informe Empresa e Filial para excluir!");

    const k = keyOf(emp, fil);
    const existe = lista.some((x) => keyOf(x.empresa, x.filial) === k);
    if (!existe) return alert("Registro não encontrado para excluir!");

    setConfirmMsg("Deseja excluir o Parâmetro da Filial?");
    setConfirmAction(() => () => {
      setLista((prev) => prev.filter((x) => keyOf(x.empresa, x.filial) !== k));

      setModalConfirm(false);
      setModalColor("text-green-700");
      setModalMsg("Exclusão realizada com sucesso!");

      handleLimpar();
    });
    setModalConfirm(true);
  };

  return (
    <div
      className={`mt-[44px] text-[13px] text-gray-700 bg-gray-50 h-[calc(100vh-56px)] flex flex-col ${open ? "ml-[192px]" : "ml-[56px]"
        }`}
    >
      {/* Título */}
      <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
        PARÂMETRO DE FILIAL
      </h1>

      {/* Abas */}
      <div className="flex border-b border-gray-300 bg-white">
        <button
          onClick={() => setAba("cadastro")}
          className={`px-4 py-1 text-sm font-medium border-t border-x rounded-t-md ${aba === "cadastro"
              ? "bg-white text-red-700 border-gray-300"
              : "bg-gray-100 text-gray-600 border-transparent"
            }`}
        >
          Cadastro
        </button>

        <button
          onClick={() => setAba("consulta")}
          className={`px-4 py-1 text-sm font-medium border-t border-x rounded-t-md ml-1 ${aba === "consulta"
              ? "bg-white text-red-700 border-gray-300"
              : "bg-gray-100 text-gray-600 border-transparent"
            }`}
        >
          Consulta
        </button>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 p-3 bg-white border-x border-b border-gray-200 rounded-b-md overflow-y-auto flex flex-col gap-3">
        {/* ABA CADASTRO */}
        {aba === "cadastro" && (
          <div className="space-y-2">
            {/* ===================== LINHA 1 ===================== */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-1">Código Empresa</Label>
              <Sel className="col-span-5" value={dados.empresa} onChange={handleChange("empresa")}>
                <option value="001">001 - MANTRAN TRANSPORTES LTDA</option>
                <option value="002">002 - OUTRA EMPRESA</option>
              </Sel>

              <Label className="col-span-1">Código Filial</Label>
              <Sel className="col-span-5" value={dados.filial} onChange={handleChange("filial")}>
                <option value="001">001 - TESTE MANTRAN</option>
                <option value="005">005 - FILIAL WMS</option>
              </Sel>
            </div>

            {/* ===================== LINHA 2 ===================== */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-1">VR. Bloqueio</Label>
              <Txt className="col-span-2" value={dados.vrBloqueio} onChange={handleChange("vrBloqueio")} />

              <Label className="col-span-1">Indica Redutor</Label>
              <Txt className="col-span-2" value={dados.indicaRedutor} onChange={handleChange("indicaRedutor")} />

              <Label className="col-span-1">Tabela Padrão</Label>
              <Txt className="col-span-2" value={dados.tabelaPadrao} onChange={handleChange("tabelaPadrao")} />

              <label className="col-span-3 flex items-center gap-1 text-[12px]">
                <input
                  type="checkbox"
                  checked={dados.tabelaContrato}
                  onChange={handleChange("tabelaContrato")}
                />
                Tabela com Regras de Contrato
              </label>
            </div>

            {/* ===================== LINHA 3 ===================== */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-1">VR. Aviso</Label>
              <Txt className="col-span-2" value={dados.vrAviso} onChange={handleChange("vrAviso")} />

              <Label className="col-span-1">% de Juros</Label>
              <Txt className="col-span-2" value={dados.percJuros} onChange={handleChange("percJuros")} />

              <Label className="col-span-1">Cond. Pagto</Label>
              <Sel className="col-span-2" value={dados.condPagto} onChange={handleChange("condPagto")}>
                <option value="00">00 - À Vista</option>
                <option value="30">30 - 30 dias</option>
                <option value="60">60 - 60 dias</option>
              </Sel>

              <Label className="col-span-1">Tabela Coleta</Label>
              <Txt className="col-span-2" value={dados.tabelaColeta} onChange={handleChange("tabelaColeta")} />
            </div>

            {/* ===================== LINHA 4 ===================== */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-1">Mens. Base Cálculo</Label>
              <Txt className="col-span-5" value={dados.baseCalculo} onChange={handleChange("baseCalculo")} />

              <Label className="col-span-1">Moeda</Label>
              <Sel className="col-span-5" value={dados.moeda} onChange={handleChange("moeda")}>
                <option value="REAL">REAL</option>
                <option value="DOLAR">DÓLAR</option>
              </Sel>
            </div>

            {/* ===================== LINHA 5 ===================== */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-1">Mens. Substituição</Label>
              <Txt
                className="col-span-5"
                value={dados.mensSubstituicao}
                onChange={handleChange("mensSubstituicao")}
              />

              <Label className="col-span-1">Período Faturamento</Label>
              <Sel className="col-span-5" value={dados.periodoFat} onChange={handleChange("periodoFat")}>
                <option value="Quinzenal">Quinzenal</option>
                <option value="Mensal">Mensal</option>
                <option value="Semanal">Semanal</option>
              </Sel>
            </div>

            {/* ===================== LINHA 6 ===================== */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-1">Mens. ICMS Isento</Label>
              <Txt
                className="col-span-5"
                value={dados.mensICMSIsento}
                onChange={handleChange("mensICMSIsento")}
              />

              <Label className="col-span-1">Portador</Label>
              <Sel className="col-span-5" value={dados.portador} onChange={handleChange("portador")}>
                <option value="033 - BANCO SANTANDER SA">033 - BANCO SANTANDER SA</option>
                <option value="001 - BANCO DO BRASIL">001 - BANCO DO BRASIL</option>
              </Sel>
            </div>

            {/* ===================== LINHA 7 ===================== */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-1">Mens. ISS</Label>
              <Txt className="col-span-5" value={dados.mensISS} onChange={handleChange("mensISS")} />

              <Label className="col-span-2">Permite Peso/Valor = 0</Label>

              <div className="col-span-2 flex gap-3">
                <label className="flex items-center gap-1 text-[12px]">
                  <input
                    type="checkbox"
                    checked={dados.permitePesoValor0Cte}
                    onChange={handleChange("permitePesoValor0Cte")}
                  />
                  CTe
                </label>
                <label className="flex items-center gap-1 text-[12px]">
                  <input
                    type="checkbox"
                    checked={dados.permitePesoValor0Mdfe}
                    onChange={handleChange("permitePesoValor0Mdfe")}
                  />
                  MDFe
                </label>
              </div>

              <Label className="col-span-1">Fat Automático?</Label>
              <div className="col-span-1 flex items-center">
                <input
                  type="checkbox"
                  checked={dados.fatAutomatico}
                  onChange={handleChange("fatAutomatico")}
                />
              </div>
            </div>

            {/* ===================== LINHA 8 ===================== */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-1">Modelo CTRC</Label>
              <Sel className="col-span-5" value={dados.modeloCtrc} onChange={handleChange("modeloCtrc")}>
                <option value="Modelo Padrão 1">Modelo Padrão 1</option>
              </Sel>

              <Label className="col-span-1">Tipo Frete</Label>
              <Sel className="col-span-5" value={dados.tipoFrete} onChange={handleChange("tipoFrete")}>
                <option value="FATURADO">FATURADO</option>
                <option value="A PAGAR">A PAGAR</option>
              </Sel>
            </div>

            {/* ===================== LINHA 9 ===================== */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-2">VR Limite CT-e Geração Automática</Label>
              <Txt
                className="col-span-4"
                value={dados.vrLimiteCteAuto}
                onChange={handleChange("vrLimiteCteAuto")}
              />

              <Label className="col-span-1">Modelo Coleta</Label>
              <Sel className="col-span-5" value={dados.modeloColeta} onChange={handleChange("modeloColeta")}>
                <option value="1/2 FOLHA (ESPELHO)">1/2 FOLHA (ESPELHO)</option>
              </Sel>
            </div>

            {/* ===================== LINHA 10 ===================== */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-2">CPF/CNPJ Aut.Cte</Label>
              <Txt className="col-span-4" value={dados.cnpjAutCte} onChange={handleChange("cnpjAutCte")} />

              <Label className="col-span-1">Teto INSS</Label>
              <Sel className="col-span-5" value={dados.tetoInss} onChange={handleChange("tetoInss")}>
                <option value="AGREGADO">AGREGADO</option>
                <option value="SUBCONTRATADO">SUBCONTRATADO</option>
              </Sel>
            </div>

            {/* ===================== LINHA 11 ===================== */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-2">Resp. Seguro</Label>
              <Sel className="col-span-4" value={dados.respSeguro} onChange={handleChange("respSeguro")}>
                <option value="POR CONTA DO EMISSOR CTE">POR CONTA DO EMISSOR CTE</option>
                <option value="POR CONTA DO TOMADOR">POR CONTA DO TOMADOR</option>
              </Sel>

              <Label className="col-span-1">Seguradora</Label>
              <Sel
                className="col-span-5"
                value={dados.seguradoraPadrao}
                onChange={handleChange("seguradoraPadrao")}
              >
                <option value="001 - SOMPO SEGUROS">001 - SOMPO SEGUROS</option>
              </Sel>
            </div>
          </div>
        )}

        {/* ABA CONSULTA */}
        {aba === "consulta" && (
          <div className="overflow-x-auto border rounded">
            <table className="w-full text-[12px]">
              <thead className="bg-gray-100">
                <tr>
                  {[
                    "Empresa",
                    "Filial",
                    "Valor Bloqueio",
                    "Valor Aviso",
                    "Tabela Frete",
                    "Cond.",
                    "Moeda",
                    "Sigla Moeda",
                    "Indice Redutor",
                    "Mens. Base Cálculo",
                    "Mens. Subst. Tributária",
                    "Mens. ICMS Isento",
                  ].map((h) => (
                    <th key={h} className="border px-2 py-1">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {lista.map((l, i) => {
                  const sel = keyOf(l.empresa, l.filial) === chaveSelecionada;
                  return (
                    <tr
                      key={i}
                      className={`hover:bg-red-100 cursor-pointer ${sel ? "bg-red-50" : ""}`}
                      onClick={() => selecionarLinha(l)}
                    >
                      {Object.values(l).map((v, idx) => (
                        <td key={idx} className="border px-2 py-1">
                          {v}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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

        {/* Limpar */}
        <button
          onClick={handleLimpar}
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <RotateCcw size={20} />
          <span>Limpar</span>
        </button>

        {/* Incluir */}
        <button
          onClick={handleIncluir}
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <PlusCircle size={20} />
          <span>Incluir</span>
        </button>

        {/* Alterar */}
        <button
          onClick={handleAlterar}
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <Edit size={20} />
          <span>Alterar</span>
        </button>

        {/* Excluir */}
        <button
          onClick={handleExcluir}
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <Trash2 size={20} />
          <span>Excluir</span>
        </button>

        {/* Parâmetros */}
        <button
          onClick={() => setShowParametro(true)}
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <Settings2 size={20} />
          <span>Parâmetros</span>
        </button>

        <button
          onClick={() => setShowSubcontratado(true)}
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <Truck size={20} />
          <span>Subcontratado</span>
        </button>
      </div>

      {/* Modal Parâmetro */}
      {showParametro && <FilialParametro onClose={() => setShowParametro(false)} />}

      {/* Modal Subcontratado */}
      {showSubcontratado && <SubcontratadoModal onClose={() => setShowSubcontratado(false)} />}

      {/* SUCESSO — modelo exatamente igual ao solicitado */}
      {modalMsg && (
        <div className="fixed top-0 bottom-0 right-0 left-0 sm:left-14 lg:left-52 bg-black bg-opacity-40 flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 shadow-lg rounded border text-center w-[300px]">
            <p className={`${modalColor} font-bold mb-4`}>{modalMsg}</p>
            <button
              className="px-3 py-1 bg-red-700 text-white rounded"
              onClick={() => setModalMsg("")}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* CONFIRMAÇÃO — padrão Sim / Não */}
      {modalConfirm && (
        <div className="fixed top-0 bottom-0 right-0 left-0 sm:left-14 lg:left-52 bg-black bg-opacity-40 flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 shadow-lg rounded border text-center w-[300px]">
            <p className="text-red-700 font-bold mb-4">{confirmMsg}</p>

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
