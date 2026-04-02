import { useState, useRef, useEffect } from "react";
import {
  XCircle,
  RotateCcw,
  PlusCircle,
  Edit,
  Trash2,
  FileCode,
} from "lucide-react";

function Label({ children, className = "" }) {
  return <label className={`text-[12px] text-gray-600 ${className}`}>{children}</label>;
}

function Txt({ readOnly = false, ...props }) {
  return (
    <input
      {...props}
      readOnly={readOnly}
      className={`border rounded px-1 py-[2px] h-[26px] text-[13px] w-full ${
        readOnly ? "bg-gray-200 text-gray-600 cursor-not-allowed" : "bg-white"
      }`}
    />
  );
}

function Sel({ children, ...rest }) {
  return (
    <select
      {...rest}
      className="border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full bg-white"
    >
      {children}
    </select>
  );
}

export default function ClienteContrato({ isOpen, onClose }) {
  const modalRef = useRef(null);
  const dragRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState("contrato");
  const [showRegras, setShowRegras] = useState(false);

  // === ESTADOS DA GRID DE REGRAS ===
const [linhas, setLinhas] = useState([
  {
    campo: "Peso da Nota Fiscal",
    cond1: "Menor ou igual a",
    val1: "1000",
    eou1: "",
    cond2: "Menor que",
    val2: "600",
    eou2: "",
  },
]);

function updateLinha(index, changes) {
  setLinhas((prev) =>
    prev.map((l, i) => (i === index ? { ...l, ...changes } : l))
  );
}


  const [form, setForm] = useState({
    cnpj: "0529457003012",
    razao: "HNK BR LOGISTICA E DISTRIBUICAO LTDA",
    contratoCod: "",
    contratoDesc: "",
    vigenciaIni: "",
    vigenciaFim: "",
    tabela: "",
    tabIni: "",
    tabFim: "",
    observacao: "",
  });

  const [contratos, setContratos] = useState([
    { cod: "000003", desc: "CONTRATO 1", inicio: "12/11/2025", fim: "12/10/2026" },
  ]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const { innerWidth, innerHeight } = window;
      const rect = modalRef.current.getBoundingClientRect();
      setPos({
        x: (innerWidth - rect.width) / 2,
        y: (innerHeight - rect.height) / 2,
      });
    }
  }, [isOpen]);

  const startDrag = (e) => {
    setDragging(true);
    const rect = modalRef.current.getBoundingClientRect();
    setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  const duringDrag = (e) => {
    if (dragging) setPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };
  const stopDrag = () => setDragging(false);

  const handleLimpar = () =>
    setForm({
      ...form,
      contratoCod: "",
      contratoDesc: "",
      vigenciaIni: "",
      vigenciaFim: "",
      tabela: "",
      tabIni: "",
      tabFim: "",
      observacao: "",
    });

  const handleIncluir = () => {
    if (!form.contratoCod || !form.contratoDesc)
      return alert("Preencha os campos de contrato!");
    setContratos([
      ...contratos,
      {
        cod: form.contratoCod,
        desc: form.contratoDesc,
        inicio: form.vigenciaIni,
        fim: form.vigenciaFim,
      },
    ]);
    alert("Contrato incluído com sucesso!");
  };

  const handleSelectContrato = (c) => {
    setForm({
      ...form,
      contratoCod: c.cod,
      contratoDesc: c.desc,
      vigenciaIni: c.inicio,
      vigenciaFim: c.fim,
    });
    setActiveTab("contrato");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onMouseMove={duringDrag}
      onMouseUp={stopDrag}
    >
      <div
        ref={modalRef}
        className="absolute bg-white border border-gray-300 rounded-md shadow-lg w-[90vw] max-w-[1050px] max-h-[90vh] overflow-y-auto p-3"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          cursor: dragging ? "grabbing" : "default",
        }}
      >
        {/* === Cabeçalho === */}
        <div
          ref={dragRef}
          onMouseDown={startDrag}
          className="text-center text-red-700 font-semibold text-[14px] py-1 border-b cursor-grab select-none"
        >
          CLIENTE - CONTRATOS
        </div>

        {/* === Abas === */}
        <div className="flex border-b border-gray-300 bg-white mt-2">
          {["contrato", "cockpit"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1 text-sm font-medium border-t border-x rounded-t-md ${
                activeTab === tab
                  ? "bg-white text-red-700 border-gray-300"
                  : "bg-gray-100 text-gray-600 border-transparent"
              } ${tab !== "contrato" ? "ml-1" : ""}`}
            >
              {tab === "contrato" ? "Contrato" : "Cockpit"}
            </button>
          ))}
        </div>

        <div className="p-3 text-[13px] space-y-3">
          {/* === ABA CONTRATO === */}
          {activeTab === "contrato" && (
            <>
              {/* === CARD 1 === */}
              <fieldset className="border border-gray-300 rounded p-3 space-y-3">
                <legend className="text-red-700 font-semibold px-2">Contrato</legend>

                <div className="grid grid-cols-[100px_160px_1fr] gap-3 items-center">
                  <Label className="text-right">CNPJ/CPF</Label>
                  <Txt value={form.cnpj} readOnly />
                  <Txt value={form.razao} readOnly />
                </div>

                <div className="grid grid-cols-[100px_150px_1fr] gap-3 items-center">
                  <Label className="text-right">Contrato</Label>
                  <Txt
                    value={form.contratoCod}
                    onChange={(e) => setForm({ ...form, contratoCod: e.target.value })}
                  />
                  <Txt
                    value={form.contratoDesc}
                    onChange={(e) => setForm({ ...form, contratoDesc: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-[100px_180px_80px_180px] gap-3 items-center">
                  <Label className="text-right">Vigência</Label>
                  <Txt
                    type="date"
                    value={form.vigenciaIni}
                    onChange={(e) => setForm({ ...form, vigenciaIni: e.target.value })}
                  />
                  <Label className="text-center">Até</Label>
                  <Txt
                    type="date"
                    value={form.vigenciaFim}
                    onChange={(e) => setForm({ ...form, vigenciaFim: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-[100px_1fr_80px_180px_80px_180px] gap-3 items-center">
                  <Label className="text-right">Tabela</Label>
                  <Sel
                    value={form.tabela}
                    onChange={(e) => setForm({ ...form, tabela: e.target.value })}
                  >
                    <option value="">000000 - TABELA PADRÃO</option>
                    <option value="001">001 - TABELA ESPECIAL</option>
                  </Sel>
                  <Label className="text-right">Vigência</Label>
                  <Txt
                    type="date"
                    value={form.tabIni}
                    onChange={(e) => setForm({ ...form, tabIni: e.target.value })}
                  />
                  <Label className="text-center">Até</Label>
                  <Txt
                    type="date"
                    value={form.tabFim}
                    onChange={(e) => setForm({ ...form, tabFim: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-[100px_1fr] gap-3 items-start">
                  <Label className="text-right mt-[4px]">Observação</Label>
                  <textarea
                    value={form.observacao}
                    onChange={(e) => setForm({ ...form, observacao: e.target.value })}
                    className="border border-gray-300 rounded px-2 py-1 text-[13px] w-full min-h-[60px] resize-y"
                  ></textarea>
                </div>
              </fieldset>

              {/* === CARD 2 - DUPLICAR === */}
              <fieldset className="border border-gray-300 rounded p-3">
                <legend className="text-red-700 font-semibold px-2">
                  Duplicar Contrato e Regra
                </legend>
                <div className="grid grid-cols-[100px_160px_1fr] gap-3 items-center">
                  <Label className="text-right">Cliente</Label>
                  <Txt />
                  <Txt />
                  <button className="bg-red-700 text-white px-3 py-[4px] rounded text-[12px] hover:bg-red-800">
                    Duplicar
                  </button>
                </div>
              </fieldset>
            </>
          )}

          {/* === ABA COCKPIT === */}
          {activeTab === "cockpit" && (
            <fieldset className="border border-gray-300 rounded p-3">
              <legend className="text-red-700 font-semibold px-2">Contratos</legend>
              <div className="border border-gray-300 rounded max-h-[400px] overflow-auto">
                <table className="min-w-full text-[12px] border-collapse">
                  <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
                    <tr>
                      {[
                        "Nº Contrato",
                        "Descrição",
                        "Data Início Vigência",
                        "Data Final Vigência",
                      ].map((col) => (
                        <th key={col} className="border px-2 py-1 text-left">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {contratos.map((c, i) => (
                      <tr
                        key={i}
                        onClick={() => handleSelectContrato(c)}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="border px-2 py-1">{c.cod}</td>
                        <td className="border px-2 py-1">{c.desc}</td>
                        <td className="border px-2 py-1">{c.inicio}</td>
                        <td className="border px-2 py-1">{c.fim}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </fieldset>
          )}
        </div>

        {/* === Rodapé === */}
        <div className="border-t mt-3 pt-2 flex justify-between bg-white sticky bottom-0">
          <div className="flex gap-3">
            {[
              { icon: XCircle, label: "Fechar", action: onClose },
              { icon: RotateCcw, label: "Limpar", action: handleLimpar },
              { icon: PlusCircle, label: "Incluir", action: handleIncluir },
              { icon: Edit, label: "Alterar" },
              { icon: Trash2, label: "Excluir" },
              { icon: FileCode, label: "Regras", action: () => setShowRegras(true) },
            ].map(({ icon: Icon, label, action }) => (
              <button
                key={label}
                onClick={action}
                className="flex items-center gap-1 text-red-700 hover:text-gray-700 text-[13px]"
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {showRegras && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white border rounded-md shadow-lg w-[850px] p-4">
              <div className="text-center text-red-700 font-semibold border-b pb-1 mb-3">
                CLIENTE - REGRAS DE CONTRATO
              </div>

              {/* === CARD 1 === */}
              <fieldset className="border border-gray-300 rounded p-3 space-y-2 mb-2">
                <legend className="text-red-700 font-semibold px-2">Cabeçalho</legend>
                <div className="grid grid-cols-[100px_160px_1fr_100px_100px] gap-3 items-center">
                  <Label className="text-right">CNPJ/CPF</Label>
                  <Txt value={form.cnpj} readOnly />
                  <Txt value={form.razao} readOnly />
                  <button className="bg-green-700 text-white px-3 py-[4px] rounded text-[12px] hover:bg-green-800">
                    Validar
                  </button>
                  <button className="bg-yellow-600 text-white px-3 py-[4px] rounded text-[12px] hover:bg-yellow-700">
                    Limpar Regra
                  </button>
                </div>

                <div className="grid grid-cols-[100px_150px_1fr] gap-3 items-center">
                  <Label className="text-right">Contrato</Label>
                  <Txt value={form.contratoCod} readOnly />
                  <Txt value={form.contratoDesc} readOnly />
                </div>
              </fieldset>

              {/* === CARD 2 === */}
<fieldset className="border border-gray-300 rounded p-3 mb-2">
  <legend className="text-red-700 font-semibold px-2">Regras</legend>

  {/* Botões Incluir e Excluir Linha */}
  <div className="flex justify-end gap-2 mb-2">
    <button
      onClick={() =>
        setLinhas([...linhas, { campo: "", cond1: "", val1: "", eou1: "", cond2: "", val2: "", eou2: "" }])
      }
      className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-[4px] rounded text-[12px]"
    >
      <PlusCircle size={14} /> Incluir Linha
    </button>
    <button
      onClick={() => setLinhas(linhas.slice(0, -1))}
      className="flex items-center gap-1 bg-red-700 hover:bg-red-800 text-white px-3 py-[4px] rounded text-[12px]"
    >
      <Trash2 size={14} /> Excluir Linha
    </button>
  </div>

  <div className="overflow-x-auto">
    <table className="min-w-full text-[12px] border-collapse">
      <thead className="bg-gray-100">
        <tr>
          {[
            "Nome Campo",
            "Condição 1",
            "Valor Condição 1",
            "e/ou",
            "Condição 2",
            "Valor Condição 2",
            "e/ou",
          ].map((col) => (
            <th key={col} className="border px-2 py-1 text-left">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {linhas.map((linha, i) => (
          <tr key={i}>
            <td className="border px-2 py-1">
              <Sel
                value={linha.campo}
                onChange={(e) =>
                  updateLinha(i, { campo: e.target.value })
                }
              >
                <option value="">Selecione...</option>
                <option value="Peso da Nota Fiscal">Peso da Nota Fiscal</option>
                <option value="Valor da Nota Fiscal">Valor da Nota Fiscal</option>
              </Sel>
            </td>
            <td className="border px-2 py-1">
              <Sel
                value={linha.cond1}
                onChange={(e) => updateLinha(i, { cond1: e.target.value })}
              >
                <option value="">Selecione...</option>
                <option>Menor ou igual a</option>
                <option>Maior que</option>
                <option>Igual a</option>
              </Sel>
            </td>
            <td className="border px-2 py-1">
              <Txt
                value={linha.val1}
                onChange={(e) => updateLinha(i, { val1: e.target.value })}
              />
            </td>
            <td className="border px-2 py-1">
              <Sel
                value={linha.eou1}
                onChange={(e) => updateLinha(i, { eou1: e.target.value })}
              >
                <option value=""> </option>
                <option value="E">E</option>
                <option value="OU">OU</option>
              </Sel>
            </td>
            <td className="border px-2 py-1">
              <Sel
                value={linha.cond2}
                onChange={(e) => updateLinha(i, { cond2: e.target.value })}
              >
                <option value="">Selecione...</option>
                <option>Menor que</option>
                <option>Maior ou igual a</option>
                <option>Igual a</option>
              </Sel>
            </td>
            <td className="border px-2 py-1">
              <Txt
                value={linha.val2}
                onChange={(e) => updateLinha(i, { val2: e.target.value })}
              />
            </td>
            <td className="border px-2 py-1">
              <Sel
                value={linha.eou2}
                onChange={(e) => updateLinha(i, { eou2: e.target.value })}
              >
                <option value=""> </option>
                <option value="E">E</option>
                <option value="OU">OU</option>
              </Sel>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</fieldset>

              {/* === CARD 3 === */}
              <fieldset className="border border-gray-300 rounded p-3 space-y-2">
                <legend className="text-red-700 font-semibold px-2">Composição da Regra</legend>
                <textarea
                  className="border border-gray-300 rounded px-2 py-1 text-[13px] w-full min-h-[60px]"
                  defaultValue="(Peso_NF <= 1000 OR Peso_NF < 600) AND ST_Nota_Fiscal.CD_Empresa = '001'"
                ></textarea>
                <Label className="text-right">Observação</Label>
                <textarea className="border border-gray-300 rounded px-2 py-1 text-[13px] w-full min-h-[40px]" />
              </fieldset>

              {/* === Rodapé Modal === */}
              <div className="border-t mt-3 pt-2 flex justify-between">
                <div className="flex gap-3">
                  {[
                    { icon: XCircle, label: "Fechar", action: () => setShowRegras(false) },
                    { icon: RotateCcw, label: "Limpar" },
                    { icon: PlusCircle, label: "Incluir" },
                    { icon: Edit, label: "Alterar" },
                    { icon: Trash2, label: "Excluir" },
                  ].map(({ icon: Icon, label, action }) => (
                    <button
                      key={label}
                      onClick={action}
                      className="flex items-center gap-1 text-red-700 hover:text-gray-700 text-[13px]"
                    >
                      <Icon size={16} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
