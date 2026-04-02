// src/pages/OperacaoShopee.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  XCircle,
  RotateCcw,
  PlusCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

/* ================= Helpers ================= */

function Label({ children, className = "" }) {
  return (
    <label
      className={`text-[12px] text-gray-700 flex items-center ${className}`}
    >
      {children}
    </label>
  );
}

function Txt(props) {
  return (
    <input
      {...props}
      className={
        "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full " +
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
        "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full " +
        className
      }
    >
      {children}
    </select>
  );
}

/* ================= Mocks ================= */

const mockEmpresas = [
  "001 - MANTRAN TRANSPORTES LTDA",
  "002 - OUTRA TRANSPORTADORA",
];

const mockFiliais = [
  "001 - MATRIZ",
  "002 - CAMPINAS",
  "007 - C R SILVA IDIOMAS",
];

const mockTiposOperacao = ["Last Mile", "Line Haul", "LH Hub"];

const mockTabelasFrete = [
  "000080 - TESTE NV API SHOPEE PACOTE",
  "000003 - TABELA LOGGI",
];

const mockTiposAgrupamento = [
  "PACOTE",
  "VOLUME",
  "NOTA FISCAL",
];

const mockTiposTabelaRegra = ["Cliente", "Tomador", "Recebedor"];

const mockOperacoesBase = [
  {
    id: "OP1",
    empresa: "001",
    filial: "001",
    tipoOperacao: "Last Mile",
    descricaoOperacao: "LAST MILE XPT",
    tabelaFrete: "000080 - TESTE NV API SHOPEE PACOTE",
    tabelaFreteAgregado: "000003 - TABELA LOGGI",
    tipoAgrupamento: "PACOTE",
    tomadorCnpj: "50221019000136",
    tomadorRazao: "HNK-ITU (1) MATRIZ",
    recebedorCnpj: "36901507000163",
    recebedorRazao: "BULL AGRO MATRIZ",
    nomeHub: "HUB CAMPINAS",
    processa: true,
  },
  {
    id: "OP2",
    empresa: "001",
    filial: "002",
    tipoOperacao: "Line Haul",
    descricaoOperacao: "LINE HAUL XPT",
    tabelaFrete: "000080 - TESTE NV API SHOPEE PACOTE",
    tabelaFreteAgregado: "",
    tipoAgrupamento: "VOLUME",
    tomadorCnpj: "11111111000111",
    tomadorRazao: "CLIENTE TESTE LTDA",
    recebedorCnpj: "22222222000122",
    recebedorRazao: "RECEBEDOR TESTE",
    nomeHub: "HUB RIO",
    processa: true,
  },
];

const mockRegrasBase = [
  {
    id: "R1",
    operacaoId: "OP1",
    sequencia: 1,
    regra: "Regra padrão cliente",
    tipoTabela: "Cliente",
    tabelaFrete: "000080 - TESTE NV API SHOPEE PACOTE",
  },
];

/* ================= Tela Principal ================= */

export default function OperacaoShopee({ open }) {
  const navigate = useNavigate();
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  const [abaAtiva, setAbaAtiva] = useState("operacao"); // operacao | regras | grid

  /* ======== Estado Operações ======== */
  const [operacoes, setOperacoes] = useState(mockOperacoesBase);
  const [selectedOperacaoIndex, setSelectedOperacaoIndex] = useState(0);

  const [formOperacao, setFormOperacao] = useState({
    empresa: mockOperacoesBase[0]?.empresa || "",
    filial: mockOperacoesBase[0]?.filial || "",
    tipoOperacao: mockOperacoesBase[0]?.tipoOperacao || "",
    descricaoOperacao: mockOperacoesBase[0]?.descricaoOperacao || "",
    tabelaFrete: mockOperacoesBase[0]?.tabelaFrete || "",
    tabelaFreteAgregado: mockOperacoesBase[0]?.tabelaFreteAgregado || "",
    tipoAgrupamento: mockOperacoesBase[0]?.tipoAgrupamento || "",
    tomadorCnpj: mockOperacoesBase[0]?.tomadorCnpj || "",
    tomadorRazao: mockOperacoesBase[0]?.tomadorRazao || "",
    recebedorCnpj: mockOperacoesBase[0]?.recebedorCnpj || "",
    recebedorRazao: mockOperacoesBase[0]?.recebedorRazao || "",
    nomeHub: mockOperacoesBase[0]?.nomeHub || "",
    processa: mockOperacoesBase[0]?.processa ?? true,
  });

  const handleCampoOperacao = (field) => (e) => {
    const value =
      field === "processa" ? e.target.checked : e.target.value;
    setFormOperacao((prev) => ({ ...prev, [field]: value }));
  };

  const limparOperacao = () => {
    setFormOperacao({
      empresa: "",
      filial: "",
      tipoOperacao: "",
      descricaoOperacao: "",
      tabelaFrete: "",
      tabelaFreteAgregado: "",
      tipoAgrupamento: "",
      tomadorCnpj: "",
      tomadorRazao: "",
      recebedorCnpj: "",
      recebedorRazao: "",
      nomeHub: "",
      processa: true,
    });
    setSelectedOperacaoIndex(null);
  };

  const incluirOperacao = () => {
    if (!formOperacao.empresa || !formOperacao.filial) {
      alert("Informe Empresa e Filial.");
      return;
    }

    const novaOp = {
      id: `OP-${Date.now()}`,
      ...formOperacao,
    };

    setOperacoes((prev) => [...prev, novaOp]);
    setSelectedOperacaoIndex(operacoes.length);
  };

  const alterarOperacao = () => {
    if (selectedOperacaoIndex === null) {
      alert("Selecione uma operação na grade.");
      return;
    }

    setOperacoes((prev) =>
      prev.map((op, idx) =>
        idx === selectedOperacaoIndex ? { ...op, ...formOperacao } : op
      )
    );
  };

  const excluirOperacao = () => {
    if (selectedOperacaoIndex === null) {
      alert("Selecione uma operação para excluir.");
      return;
    }
    if (!window.confirm("Deseja excluir esta operação?")) return;

    const operacao = operacoes[selectedOperacaoIndex];

    setOperacoes((prev) => prev.filter((_, idx) => idx !== selectedOperacaoIndex));
    setSelectedOperacaoIndex(null);
    setFormOperacao({
      empresa: "",
      filial: "",
      tipoOperacao: "",
      descricaoOperacao: "",
      tabelaFrete: "",
      tabelaFreteAgregado: "",
      tipoAgrupamento: "",
      tomadorCnpj: "",
      tomadorRazao: "",
      recebedorCnpj: "",
      recebedorRazao: "",
      nomeHub: "",
      processa: true,
    });

    // remove regras dessa operação
    setRegras((prev) => prev.filter((r) => r.operacaoId !== operacao.id));
    setSelectedRegraId(null);
  };

  const selecionarOperacao = (op, index) => {
    setSelectedOperacaoIndex(index);
    setFormOperacao({
      empresa: op.empresa,
      filial: op.filial,
      tipoOperacao: op.tipoOperacao,
      descricaoOperacao: op.descricaoOperacao,
      tabelaFrete: op.tabelaFrete,
      tabelaFreteAgregado: op.tabelaFreteAgregado,
      tipoAgrupamento: op.tipoAgrupamento,
      tomadorCnpj: op.tomadorCnpj,
      tomadorRazao: op.tomadorRazao,
      recebedorCnpj: op.recebedorCnpj,
      recebedorRazao: op.recebedorRazao,
      nomeHub: op.nomeHub,
      processa: op.processa,
    });
    // ao trocar operação, limpa seleção de regra
    setSelectedRegraId(null);
  };

  const operacaoSelecionada =
    selectedOperacaoIndex !== null
      ? operacoes[selectedOperacaoIndex]
      : null;

  /* ======== Estado Regras ======== */

  const [regras, setRegras] = useState(mockRegrasBase);
  const [selectedRegraId, setSelectedRegraId] = useState(null);

  const [formRegra, setFormRegra] = useState({
    sequencia: "1",
    regra: "",
    tipoTabela: mockTiposTabelaRegra[0],
    tabelaFrete: "",
  });

  const regrasDaOperacao = operacaoSelecionada
    ? regras.filter((r) => r.operacaoId === operacaoSelecionada.id)
    : [];

  const getNextSequencia = (operacaoId) => {
    const seqs = regras
      .filter((r) => r.operacaoId === operacaoId)
      .map((r) => Number(r.sequencia || 0));
    const maxSeq = seqs.length ? Math.max(...seqs) : 0;
    return maxSeq + 1;
  };

  // Atualiza sequência automática quando troca operação ou muda quantidade de regras,
  // mas só quando nenhuma regra está selecionada (modo inclusão)
  useEffect(() => {
    if (!operacaoSelecionada || selectedRegraId) return;
    const nextSeq = getNextSequencia(operacaoSelecionada.id);
    setFormRegra((prev) => ({ ...prev, sequencia: String(nextSeq) }));
  }, [operacaoSelecionada, regras.length, selectedRegraId]);

  const handleCampoRegra = (field) => (e) => {
    setFormRegra((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const limparRegra = () => {
    setSelectedRegraId(null);
    setFormRegra({
      sequencia: operacaoSelecionada
        ? String(getNextSequencia(operacaoSelecionada.id))
        : "",
      regra: "",
      tipoTabela: mockTiposTabelaRegra[0],
      tabelaFrete: "",
    });
  };

  const incluirRegra = () => {
    if (!operacaoSelecionada) {
      alert("Selecione uma operação na aba Grid Operação.");
      return;
    }
    if (!formRegra.regra) {
      alert("Informe a descrição da regra.");
      return;
    }

    const novaRegra = {
      id: `RG-${Date.now()}`,
      operacaoId: operacaoSelecionada.id,
      sequencia: Number(formRegra.sequencia || 0) || getNextSequencia(operacaoSelecionada.id),
      regra: formRegra.regra,
      tipoTabela: formRegra.tipoTabela,
      tabelaFrete: formRegra.tabelaFrete,
    };

    setRegras((prev) => [...prev, novaRegra]);
    setSelectedRegraId(null);
  };

  const alterarRegra = () => {
    if (!selectedRegraId) {
      alert("Selecione uma regra na grade para alterar.");
      return;
    }

    setRegras((prev) =>
      prev.map((r) =>
        r.id === selectedRegraId
          ? {
              ...r,
              regra: formRegra.regra,
              tipoTabela: formRegra.tipoTabela,
              tabelaFrete: formRegra.tabelaFrete,
            }
          : r
      )
    );
  };

  const excluirRegra = () => {
    if (!selectedRegraId) {
      alert("Selecione uma regra para excluir.");
      return;
    }
    if (!window.confirm("Deseja excluir esta regra?")) return;

    setRegras((prev) => prev.filter((r) => r.id !== selectedRegraId));
    setSelectedRegraId(null);
    limparRegra();
  };

  const selecionarRegra = (regra) => {
    setSelectedRegraId(regra.id);
    setFormRegra({
      sequencia: String(regra.sequencia),
      regra: regra.regra,
      tipoTabela: regra.tipoTabela,
      tabelaFrete: regra.tabelaFrete,
    });
  };

  /* ======== Rodapé – Dispatcher por Aba ======== */

  const handleFechar = () => navigate(-1);

  const handleLimpar = () => {
    if (abaAtiva === "regras") {
      limparRegra();
    } else {
      limparOperacao();
    }
  };

  const handleIncluir = () => {
    if (abaAtiva === "regras") {
      incluirRegra();
    } else {
      incluirOperacao();
    }
  };

  const handleAlterar = () => {
    if (abaAtiva === "regras") {
      alterarRegra();
    } else {
      alterarOperacao();
    }
  };

  const handleExcluir = () => {
    if (abaAtiva === "regras") {
      excluirRegra();
    } else {
      excluirOperacao();
    }
  };

  /* ============== Render ============== */

  return (
    <div
      className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 bg-gray-50
      h-[calc(100vh-56px)] flex flex-col
      ${open ? "ml-[192px]" : "ml-[56px]"}`}
    >
      {/* TÍTULO */}
      <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
        CADASTRO SHOPEE - OPERAÇÃO
      </h1>

      {/* CONTEÚDO */}
      <div className="flex-1 p-3 overflow-y-auto bg-white border-x border-b border-gray-300 rounded-b-md flex flex-col gap-3">
        {/* Abas */}
        <div className="border-b border-gray-200 mb-2 flex gap-2 text-[12px]">
          <button
            onClick={() => setAbaAtiva("operacao")}
            className={`px-3 py-1 rounded-t-md border-x border-t ${
              abaAtiva === "operacao"
                ? "border-gray-300 bg-white text-red-700 font-semibold"
                : "border-transparent bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Operação
          </button>
          <button
            onClick={() => setAbaAtiva("regras")}
            className={`px-3 py-1 rounded-t-md border-x border-t ${
              abaAtiva === "regras"
                ? "border-gray-300 bg-white text-red-700 font-semibold"
                : "border-transparent bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Regras
          </button>
          <button
            onClick={() => setAbaAtiva("grid")}
            className={`px-3 py-1 rounded-t-md border-x border-t ${
              abaAtiva === "grid"
                ? "border-gray-300 bg-white text-red-700 font-semibold"
                : "border-transparent bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Grid Operação
          </button>
        </div>

        {/* ===== ABA OPERAÇÃO ===== */}
        {abaAtiva === "operacao" && (
          <fieldset className="border border-gray-300 rounded p-3 bg-white">
            <legend className="px-2 text-red-700 font-semibold text-[13px]">
              Dados
            </legend>

            <div className="space-y-2">
              {/* Linha 1 - Empresa / Filial */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-2">Empresa</Label>
                <Sel
                  className="col-span-4"
                  value={formOperacao.empresa}
                  onChange={handleCampoOperacao("empresa")}
                >
                  <option value="">Selecione</option>
                  {mockEmpresas.map((e) => (
                    <option key={e}>{e}</option>
                  ))}
                </Sel>

                <Label className="col-span-2">Filial</Label>
                <Sel
                  className="col-span-4"
                  value={formOperacao.filial}
                  onChange={handleCampoOperacao("filial")}
                >
                  <option value="">Selecione</option>
                  {mockFiliais.map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </Sel>
              </div>

              {/* Linha 2 - Tipo Operação / Descrição */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-2">Tipo Operação</Label>
                <Sel
                  className="col-span-4"
                  value={formOperacao.tipoOperacao}
                  onChange={handleCampoOperacao("tipoOperacao")}
                >
                  <option value="">Selecione</option>
                  {mockTiposOperacao.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </Sel>

                <Label className="col-span-2">Descrição Operação</Label>
                <Txt
                  className="col-span-4"
                  value={formOperacao.descricaoOperacao}
                  onChange={handleCampoOperacao("descricaoOperacao")}
                />
              </div>

              {/* Linha 3 - Tabelas */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-2">Tabela Frete</Label>
                <Sel
                  className="col-span-4"
                  value={formOperacao.tabelaFrete}
                  onChange={handleCampoOperacao("tabelaFrete")}
                >
                  <option value="">Selecione</option>
                  {mockTabelasFrete.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </Sel>

                <Label className="col-span-2">Tabela Frete Agregado</Label>
                <Sel
                  className="col-span-4"
                  value={formOperacao.tabelaFreteAgregado}
                  onChange={handleCampoOperacao("tabelaFreteAgregado")}
                >
                  <option value="">Selecione</option>
                  {mockTabelasFrete.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </Sel>
              </div>

              {/* Linha 4 - Tipo Agrupamento */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-2">Tipo Agrupamento</Label>
                <Sel
                  className="col-span-4"
                  value={formOperacao.tipoAgrupamento}
                  onChange={handleCampoOperacao("tipoAgrupamento")}
                >
                  <option value="">Selecione</option>
                  {mockTiposAgrupamento.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </Sel>
              </div>

              {/* Linha 5 - Tomador */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-2">Tomador (PADRÃO)</Label>
                <Txt
                  className="col-span-3"
                  value={formOperacao.tomadorCnpj}
                  onChange={handleCampoOperacao("tomadorCnpj")}
                />
                <Txt
                  className="col-span-7 bg-gray-200"
                  readOnly
                  value={formOperacao.tomadorRazao}
                />
              </div>

              {/* Linha 6 - Recebedor */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-2">Recebedor (PADRÃO)</Label>
                <Txt
                  className="col-span-3"
                  value={formOperacao.recebedorCnpj}
                  onChange={handleCampoOperacao("recebedorCnpj")}
                />
                <Txt
                  className="col-span-7 bg-gray-200"
                  readOnly
                  value={formOperacao.recebedorRazao}
                />
              </div>

              {/* Linha 7 - Nome HUB / Processa */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-2">Nome HUB</Label>
                <Txt
                  className="col-span-4"
                  value={formOperacao.nomeHub}
                  onChange={handleCampoOperacao("nomeHub")}
                />

                <div className="col-span-2 flex items-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formOperacao.processa}
                      onChange={handleCampoOperacao("processa")}
                    />
                    <span>Processa</span>
                  </label>
                </div>
              </div>
            </div>
          </fieldset>
        )}

        {/* ===== ABA REGRAS ===== */}
        {abaAtiva === "regras" && (
          <>
            {/* CARD 1 - Regras */}
            <fieldset className="border border-gray-300 rounded p-3 bg-white">
              <legend className="px-2 text-red-700 font-semibold text-[13px]">
                Regras
              </legend>

              <div className="space-y-2">
                {/* Linha 1 - Sequência */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-2">Sequência Regra</Label>
                  <Txt
                    className="col-span-2 bg-gray-200 text-right"
                    readOnly
                    value={formRegra.sequencia}
                  />
                </div>

                {/* Linha 2 - Regra */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-2">Regra</Label>
                  <Txt
                    className="col-span-10"
                    value={formRegra.regra}
                    onChange={handleCampoRegra("regra")}
                  />
                </div>

                {/* Linha 3 - Tipo Tabela / Tabela Frete */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-2">Tipo Tabela</Label>
                  <Sel
                    className="col-span-3"
                    value={formRegra.tipoTabela}
                    onChange={handleCampoRegra("tipoTabela")}
                  >
                    {mockTiposTabelaRegra.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </Sel>

                  <Label className="col-span-2">Tabela Frete</Label>
                  <Sel
                    className="col-span-5"
                    value={formRegra.tabelaFrete}
                    onChange={handleCampoRegra("tabelaFrete")}
                  >
                    <option value="">Selecione</option>
                    {mockTabelasFrete.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </Sel>
                </div>
              </div>
            </fieldset>

            {/* CARD 2 - Grid Regras */}
            <fieldset className="border border-gray-300 rounded p-3 bg-white">
              <legend className="px-2 text-red-700 font-semibold text-[13px]">
                Regras da Operação
              </legend>

              <div className="border border-gray-200 rounded max-h-[280px] overflow-y-auto">
                <table className="w-full text-[12px]">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1 text-center">Empresa</th>
                      <th className="border px-2 py-1 text-center">Filial</th>
                      <th className="border px-2 py-1 text-center">
                        Sequência
                      </th>
                      <th className="border px-2 py-1 text-center">
                        Tp. Tabela
                      </th>
                      <th className="border px-2 py-1 text-center">
                        Nº Tabela Frete
                      </th>
                      <th className="border px-2 py-1 text-left">Regra</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regrasDaOperacao.map((r) => (
                      <tr
                        key={r.id}
                        className={`cursor-pointer hover:bg-red-100 ${
                          selectedRegraId === r.id ? "bg-red-200" : ""
                        }`}
                        onClick={() => selecionarRegra(r)}
                      >
                        <td className="border px-2 py-1 text-center">
                          {operacaoSelecionada?.empresa || ""}
                        </td>
                        <td className="border px-2 py-1 text-center">
                          {operacaoSelecionada?.filial || ""}
                        </td>
                        <td className="border px-2 py-1 text-center">
                          {r.sequencia}
                        </td>
                        <td className="border px-2 py-1 text-center">
                          {r.tipoTabela}
                        </td>
                        <td className="border px-2 py-1 text-center">
                          {r.tabelaFrete?.substring(0, 6)}
                        </td>
                        <td className="border px-2 py-1">{r.regra}</td>
                      </tr>
                    ))}

                    {regrasDaOperacao.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="border px-2 py-2 text-center text-gray-500"
                        >
                          Nenhuma regra cadastrada para esta operação.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </fieldset>
          </>
        )}

        {/* ===== ABA GRID OPERAÇÃO ===== */}
        {abaAtiva === "grid" && (
          <fieldset className="border border-gray-300 rounded p-3 bg-white">
            <legend className="px-2 text-red-700 font-semibold text-[13px]">
              Grid Operação
            </legend>

            <div className="border border-gray-200 rounded max-h-[360px] overflow-y-auto">
              <table className="w-full text-[12px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1 text-center">Empresa</th>
                    <th className="border px-2 py-1 text-center">Filial</th>
                    <th className="border px-2 py-1 text-left">Operação</th>
                    <th className="border px-2 py-1 text-left">Descrição</th>
                    <th className="border px-2 py-1 text-center">Processa</th>
                    <th className="border px-2 py-1 text-center">
                      Nº Tabela Frete
                    </th>
                    <th className="border px-2 py-1 text-center">
                      Nº Tabela Frete Agregado
                    </th>
                    <th className="border px-2 py-1 text-center">
                      TP Agrupamento
                    </th>
                    <th className="border px-2 py-1 text-center">
                      CNPJ Tomador
                    </th>
                    <th className="border px-2 py-1 text-center">
                      CNPJ Recebedor
                    </th>
                    <th className="border px-2 py-1 text-left">Nome HUB</th>
                  </tr>
                </thead>
                <tbody>
                  {operacoes.map((op, idx) => (
                    <tr
                      key={op.id}
                      className={`cursor-pointer hover:bg-red-100 ${
                        selectedOperacaoIndex === idx ? "bg-red-200" : ""
                      }`}
                      onClick={() => selecionarOperacao(op, idx)}
                    >
                      <td className="border px-2 py-1 text-center">
                        {op.empresa}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {op.filial}
                      </td>
                      <td className="border px-2 py-1">{op.tipoOperacao}</td>
                      <td className="border px-2 py-1">
                        {op.descricaoOperacao}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {op.processa ? "S" : "N"}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {op.tabelaFrete?.substring(0, 6)}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {op.tabelaFreteAgregado
                          ? op.tabelaFreteAgregado.substring(0, 6)
                          : ""}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {op.tipoAgrupamento}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {op.tomadorCnpj}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {op.recebedorCnpj}
                      </td>
                      <td className="border px-2 py-1">{op.nomeHub}</td>
                    </tr>
                  ))}
                  {operacoes.length === 0 && (
                    <tr>
                      <td
                        colSpan={11}
                        className="border px-2 py-2 text-center text-gray-500"
                      >
                        Nenhuma operação cadastrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </fieldset>
        )}
      </div>

      {/* RODAPÉ PRINCIPAL (compartilhado por todas as abas) */}
      <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">
        {/* Fechar */}
        <button
          onClick={handleFechar}
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
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
      </div>
    </div>
  );
}
