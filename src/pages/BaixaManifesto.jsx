// src/pages/BaixaManifesto.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, RotateCcw, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

/* ==========================
   COMPONENTES BÁSICOS
   ========================== */
function Label({ children, className = "" }) {
  return (
    <label className={`text-[12px] text-gray-700 flex items-center ${className}`}>
      {children}
    </label>
  );
}

function Txt({ className = "", ...rest }) {
  return (
    <input
      {...rest}
      className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] ${className}`}
    />
  );
}

function Sel({ children, className = "", ...rest }) {
  return (
    <select
      {...rest}
      className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] ${className}`}
    >
      {children}
    </select>
  );
}

/* ==========================
   CAMPOS DE DATA / HORA
   (Padrão inteligente + calendário)
   ========================== */
function DateInput({ campo, dados, setDados, className = "" }) {
  const handleFocus = () => {
    if (!dados[campo]) {
      const agora = new Date();
      const ano = agora.getFullYear();
      const mes = String(agora.getMonth() + 1).padStart(2, "0");
      const dia = String(agora.getDate()).padStart(2, "0");
      setDados((prev) => ({ ...prev, [campo]: `${ano}-${mes}-${dia}` }));
    }
  };

  const handleChange = (e) => {
    setDados((prev) => ({ ...prev, [campo]: e.target.value }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      setDados((prev) => ({ ...prev, [campo]: "" }));
    }
  };

  return (
    <input
      type="date"
      value={dados[campo] || ""}
      onFocus={handleFocus}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full ${className}`}
    />
  );
}

function TimeInput({ campo, dados, setDados, className = "" }) {
  const somenteDigitos = (valor) => valor.replace(/\D/g, "");

  const formatarHora = (valor) => {
    let v = somenteDigitos(valor);
    if (v.length > 2) {
      v = v.replace(/^(\d{2})(\d)/, "$1:$2");
    }
    return v.slice(0, 5);
  };

  const completarHora = (valor) => {
    let v = somenteDigitos(valor);
    if (v.length === 0) return "";
    if (v.length === 1) return `0${v}:00`;
    if (v.length === 2) return `${v}:00`;
    if (v.length === 3) return `${v.slice(0, 2)}:${v.slice(2).padEnd(2, "0")}`;
    if (v.length === 4) return `${v.slice(0, 2)}:${v.slice(2)}`;
    return v.slice(0, 2) + ":" + v.slice(2, 4);
  };

  const handleFocus = () => {
    if (!dados[campo]) {
      const agora = new Date();
      const hh = String(agora.getHours()).padStart(2, "0");
      const mm = String(agora.getMinutes()).padStart(2, "0");
      setDados((prev) => ({ ...prev, [campo]: `${hh}:${mm}` }));
    }
  };

  const handleChange = (e) => {
    const formatada = formatarHora(e.target.value);
    setDados((prev) => ({ ...prev, [campo]: formatada }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      setDados((prev) => ({ ...prev, [campo]: "" }));
    }
  };

  const handleBlur = () => {
    setDados((prev) => ({
      ...prev,
      [campo]: completarHora(prev[campo] || ""),
    }));
  };

  return (
    <input
      type="text"
      value={dados[campo] || ""}
      onFocus={handleFocus}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      placeholder="hh:mm"
      className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full ${className}`}
    />
  );
}

/* ==========================
   MOCK DE MANIFESTOS
   ========================== */
const mockManifestos = [
  {
    manifesto: "123456",
    empresa: "001 - MANTRAN TRANSPORTES LTDA",
    filial: "001 - TESTE MANTRAN",
    placa: "RENSJ17",
    motorista: "ADALTO RODRIGUES DE MACEDO",
    kmInicial: 10,
    kmFinal: 100,
    qtKmRota: 0,
    qtKmExcedido: 90,
    conhecimentos: [
      {
        empresa: "001",
        filial: "001",
        tp: "CT",
        serie: "001",
        nro: "058782",
        destinatario: "HNK-SALVADOR-AGUA MI",
        dtEntrega: "",
        hrEntrega: "",
        dtEmissao: "09/10/2025",
        nroControle: "058810",
      },
    ],
    nfsCte: [
      {
        empresa: "001",
        filial: "001",
        nf: "123456",
        serie: "1",
        cnpjRemet: "12.345.678/0001-99",
        razaoRemet: "REMETENTE LTDA",
        nroControle: "98765",
        nroImpresso: "000123",
      },
    ],
  },
];

/* ==========================
   COMPONENTE PRINCIPAL
   ========================== */
export default function BaixaManifesto({ open }) {
  const navigate = useNavigate();
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  const [activeTab, setActiveTab] = useState("conhecimentos");
  const [modalMsg, setModalMsg] = useState(false);

  const mockInicial = {
    empresa: "001 - MANTRAN TRANSPORTES LTDA",
    filial: "001 - TESTE MANTRAN",
    nrManifesto: "",
    placa: "",
    kmInicial: "",
    kmFinal: "",
    dtChegada: "",
    hrChegada: "",
    dtEntrega: "",
    hrEntrega: "",
    qtKmRota: "",
    qtKmExcedido: "",
    ocorrencia: "001 - ENTREGA REALIZADA NORMALMENTE",
    motorista: "",
  };

  const [dados, setDados] = useState(mockInicial);
  const [conhecimentos, setConhecimentos] = useState([]);
  const [nfsCte, setNfsCte] = useState([]);

  /* ==========================
     FUNÇÕES
     ========================== */
  const limpar = () => {
    setDados(mockInicial);
    setConhecimentos([]);
    setNfsCte([]);
  };

  const carregarManifesto = (numero) => {
    const num = numero.trim();
    if (!num) {
      limpar();
      return;
    }

    const found = mockManifestos.find((m) => m.manifesto === num);

    if (found) {
      setDados((prev) => ({
        ...prev,
        nrManifesto: num,
        empresa: found.empresa,
        filial: found.filial,
        placa: found.placa,
        motorista: found.motorista,
        kmInicial: String(found.kmInicial),
        kmFinal: String(found.kmFinal),
        qtKmRota: String(found.qtKmRota),
        qtKmExcedido: String(found.qtKmExcedido),
      }));
      setConhecimentos(found.conhecimentos || []);
      setNfsCte(found.nfsCte || []);
    } else {
      // não achou, limpa dados dependentes mas mantém nº manifesto digitado
      setDados((prev) => ({
        ...prev,
        nrManifesto: num,
        placa: "",
        motorista: "",
        kmInicial: "",
        kmFinal: "",
        qtKmRota: "",
        qtKmExcedido: "",
      }));
      setConhecimentos([]);
      setNfsCte([]);
    }
  };

  const handleManifestoKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      carregarManifesto(e.target.value);
    }
  };

  const baixar = () => {
    // aqui você faria a baixa de fato (API / backend)
    setModalMsg(true);
  };

  const fecharModalMsg = () => {
    setModalMsg(false);
    limpar();
  };

  /* ==========================
     RENDER
     ========================== */
  return (
    <>
      <div
        className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 
          bg-gray-50 h-[calc(100vh-56px)] flex flex-col
          ${open ? "ml-[192px]" : "ml-[56px]"}`}
      >
        {/* TÍTULO */}
        <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
          BAIXA DE MANIFESTO / CONHECIMENTO
        </h1>

        {/* CONTEÚDO CENTRAL */}
        <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md flex flex-col gap-3 overflow-y-auto">
          <div className="border border-gray-300 rounded p-3 bg-white flex flex-col gap-3">
            {/* CARD 1 - DADOS */}
            <fieldset className="border border-gray-300 rounded p-3">
              <legend className="px-2 text-red-700 font-semibold text-[13px]">
                Dados
              </legend>

              {/* Linha 1 - Empresa / Filial */}
              <div className="grid grid-cols-12 gap-2 mb-2">
                <Label className="col-span-2">Empresa</Label>
                <Sel
                  className="col-span-4"
                  value={dados.empresa}
                  onChange={(e) =>
                    setDados((prev) => ({ ...prev, empresa: e.target.value }))
                  }
                >
                  <option>001 - MANTRAN TRANSPORTES LTDA</option>
                </Sel>

                <Label className="col-span-2">Filial</Label>
                <Sel
                  className="col-span-4"
                  value={dados.filial}
                  onChange={(e) =>
                    setDados((prev) => ({ ...prev, filial: e.target.value }))
                  }
                >
                  <option>001 - TESTE MANTRAN</option>
                </Sel>
              </div>

              {/* Linha 2 - Nº Manifesto, Placa, KM Inicial / Final */}
              <div className="grid grid-cols-12 gap-2 mb-2">
                <Label className="col-span-2">Nº Manifesto</Label>
                <Txt
                  className="col-span-2"
                  value={dados.nrManifesto}
                  onChange={(e) =>
                    setDados((prev) => ({ ...prev, nrManifesto: e.target.value }))
                  }
                  onKeyDown={handleManifestoKeyDown}
                  onBlur={(e) => carregarManifesto(e.target.value)}
                />

                <Label className="col-span-2">Placa Veículo</Label>
                <Txt
                  className="col-span-2"
                  value={dados.placa}
                  onChange={(e) =>
                    setDados((prev) => ({ ...prev, placa: e.target.value }))
                  }
                />

                <Label className="col-span-1">KM Inicial</Label>
                <Txt
                  className="col-span-1 text-right"
                  value={dados.kmInicial}
                  onChange={(e) =>
                    setDados((prev) => ({ ...prev, kmInicial: e.target.value }))
                  }
                />

                <Label className="col-span-1">KM Final</Label>
                <Txt
                  className="col-span-1 text-right"
                  value={dados.kmFinal}
                  onChange={(e) =>
                    setDados((prev) => ({ ...prev, kmFinal: e.target.value }))
                  }
                />
              </div>

              {/* Linha 3 - Data/Hora Chegada + QT KM Rota / Excedido */}
              <div className="grid grid-cols-12 gap-2 mb-2">
                <Label className="col-span-2">Data Chegada</Label>
                <DateInput
                  campo="dtChegada"
                  dados={dados}
                  setDados={setDados}
                  className="col-span-2"
                />

                <Label className="col-span-2">Hora Chegada</Label>
                <TimeInput
                  campo="hrChegada"
                  dados={dados}
                  setDados={setDados}
                  className="col-span-2"
                />

                <Label className="col-span-1">QT KM Rota</Label>
                <Txt
                  className="col-span-1 text-right"
                  value={dados.qtKmRota}
                  onChange={(e) =>
                    setDados((prev) => ({ ...prev, qtKmRota: e.target.value }))
                  }
                />

                <Label className="col-span-1">QT KM Excedido</Label>
                <Txt
                  className="col-span-1 text-right"
                  value={dados.qtKmExcedido}
                  onChange={(e) =>
                    setDados((prev) => ({ ...prev, qtKmExcedido: e.target.value }))
                  }
                />
              </div>

              {/* Linha 4 - Data/Hora Entrega + Ocorrência */}
              <div className="grid grid-cols-12 gap-2 mb-2">
                <Label className="col-span-2">Data Entrega</Label>
                <DateInput
                  campo="dtEntrega"
                  dados={dados}
                  setDados={setDados}
                  className="col-span-2"
                />

                <Label className="col-span-2">Hora Entrega</Label>
                <TimeInput
                  campo="hrEntrega"
                  dados={dados}
                  setDados={setDados}
                  className="col-span-2"
                />

                <Label className="col-span-1">Ocorrência</Label>
                <Sel
                  className="col-span-3"
                  value={dados.ocorrencia}
                  onChange={(e) =>
                    setDados((prev) => ({ ...prev, ocorrencia: e.target.value }))
                  }
                >
                  <option>001 - ENTREGA REALIZADA NORMALMENTE</option>
                  <option>002 - RECUSADO</option>
                  <option>003 - ENDEREÇO NÃO LOCALIZADO</option>
                </Sel>
              </div>

              {/* Linha 5 - Motorista + Docs Pendentes */}
              <div className="grid grid-cols-12 gap-2">
                <Label className="col-span-2">Motorista</Label>
                <Txt
                  className="col-span-8"
                  value={dados.motorista}
                  onChange={(e) =>
                    setDados((prev) => ({ ...prev, motorista: e.target.value }))
                  }
                />

                <div className="col-span-2 flex justify-end">
                  <button
                    type="button"
                    className="border border-gray-300 rounded px-3 py-1 bg-gray-50 hover:bg-gray-100 text-[12px]"
                    onClick={() => {
                      // apenas mock
                      alert("Abrir Docs Pendentes (mock)");
                    }}
                  >
                    Docs Pendentes
                  </button>
                </div>
              </div>
            </fieldset>

            {/* CARD 2 - GRID COM ABAS */}
            <fieldset className="border border-gray-300 rounded p-3">
              <legend className="px-2 text-red-700 font-semibold text-[13px]">
                Documentos do Manifesto
              </legend>

              {/* Abas */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-1">
                  {[
                    { key: "conhecimentos", label: "Conhecimentos" },
                    { key: "nfs", label: "NFs do CTe" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-3 py-1 text-[12px] border rounded-t 
                        ${activeTab === tab.key
                          ? "bg-white text-red-700 border-gray-300"
                          : "bg-gray-100 text-gray-600 border-transparent"
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex gap-1 text-gray-500">
                  <ChevronLeft size={16} />
                  <ChevronRight size={16} />
                </div>
              </div>

              {/* Tabelas */}
              <div className="border-t border-gray-300 pt-2 overflow-auto max-h-[260px]">
                {activeTab === "conhecimentos" ? (
                  <table className="min-w-[900px] w-full text-[12px] border-collapse">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        {[
                          "Empresa",
                          "Filial",
                          "TP",
                          "Série",
                          "Nº Docto",
                          "Destinatário",
                          "DT Entrega",
                          "HR Entrega",
                          "DT Emissão",
                          "Nº Controle",
                        ].map((c) => (
                          <th
                            key={c}
                            className="border border-gray-300 px-2 py-1 text-left whitespace-nowrap"
                          >
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {conhecimentos.map((r, i) => (
                        <tr
                          key={i}
                          className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                          <td className="border border-gray-200 px-2 py-[3px]">
                            {r.empresa}
                          </td>
                          <td className="border border-gray-200 px-2 py-[3px]">
                            {r.filial}
                          </td>
                          <td className="border border-gray-200 px-2 py-[3px]">
                            {r.tp}
                          </td>
                          <td className="border border-gray-200 px-2 py-[3px]">
                            {r.serie}
                          </td>
                          <td className="border border-gray-200 px-2 py-[3px]">
                            {r.nro}
                          </td>
                          <td className="border border-gray-200 px-2 py-[3px]">
                            {r.destinatario}
                          </td>
                          <td className="border border-gray-200 px-2 py-[3px]">
                            {r.dtEntrega}
                          </td>
                          <td className="border border-gray-200 px-2 py-[3px]">
                            {r.hrEntrega}
                          </td>
                          <td className="border border-gray-200 px-2 py-[3px]">
                            {r.dtEmissao}
                          </td>
                          <td className="border border-gray-200 px-2 py-[3px]">
                            {r.nroControle}
                          </td>
                        </tr>
                      ))}
                      {conhecimentos.length === 0 && (
                        <tr>
                          <td
                            colSpan={10}
                            className="border border-gray-200 px-2 py-2 text-center text-gray-500"
                          >
                            Nenhum conhecimento carregado.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                ) : (
                  <table className="min-w-[900px] w-full text-[12px] border-collapse">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        {[
                          "Empresa",
                          "Filial",
                          "NF",
                          "Série",
                          "CNPJ Remetente",
                          "Razão Social Remetente",
                          "Nº Controle",
                          "Nº Impresso",
                        ].map((c) => (
                          <th
                            key={c}
                            className="border border-gray-300 px-2 py-1 text-left whitespace-nowrap"
                          >
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {nfsCte.map((r, i) => (
                        <tr
                          key={i}
                          className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                          <td className="border border-gray-200 px-2 py-[3px]">
                            {r.empresa}
                          </td>
                          <td className="border border-gray-200 px-2 py-[3px]">
                            {r.filial}
                          </td>
                          <td className="border border-gray-200 px-2 py-[3px]">
                            {r.nf}
                          </td>
                          <td className="border border-gray-200 px-2 py-[3px]">
                            {r.serie}
                          </td>
                          <td className="border border-gray-200 px-2 py-[3px]">
                            {r.cnpjRemet}
                          </td>
                          <td className="border border-gray-200 px-2 py-[3px]">
                            {r.razaoRemet}
                          </td>
                          <td className="border border-gray-200 px-2 py-[3px]">
                            {r.nroControle}
                          </td>
                          <td className="border border-gray-200 px-2 py-[3px]">
                            {r.nroImpresso}
                          </td>
                        </tr>
                      ))}
                      {nfsCte.length === 0 && (
                        <tr>
                          <td
                            colSpan={8}
                            className="border border-gray-200 px-2 py-2 text-center text-gray-500"
                          >
                            Nenhuma NF vinculada ao manifesto.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </fieldset>
          </div>
        </div>

        {/* RODAPÉ PADRÃO */}
        <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">
          {/* Fechar */}
          <button
            onClick={() => navigate(-1)}
            className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
          >
            <XCircle size={20} />
            <span>Fechar</span>
          </button>

          {/* Limpar */}
          <button
            onClick={limpar}
            className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
          >
            <RotateCcw size={20} />
            <span>Limpar</span>
          </button>

          {/* Baixar */}
          <button
            onClick={baixar}
            className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
          >
            <Download size={20} />
            <span>Baixar</span>
          </button>
        </div>
      </div>

      {/* MODAL SUCESSO - padrão modalMsg */}
      {modalMsg && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 shadow-lg rounded border text-center w-[300px]">
            <p className="text-green-700 font-bold mb-4">
              Manifesto baixado com sucesso!
            </p>
            <button
              className="px-3 py-1 bg-red-700 text-white rounded"
              onClick={fecharModalMsg}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
