// === ManifestoSeguro.jsx ===
import { useState } from "react";
import {
  PlusCircle,
  Edit,
  Trash2,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import InputBuscaCorretora from "../components/InputBuscaCorretora";
import InputBuscaCliente from "../components/InputBuscaCliente";
import { maskCNPJ } from "../utils/masks";


// ===== Helpers padrão Mantran =====
function Label({ children, className = "" }) {
  return (
    <label
      className={`text-[12px] text-gray-600 flex items-center justify-end ${className}`}
    >
      {children}
    </label>
  );
}

function Txt({ className = "", readOnly = false, ...props }) {
  return (
    <input
      {...props}
      readOnly={readOnly}
      className={`
        border border-gray-300 rounded
        px-2 py-[2px] h-[26px] text-[13px]
        ${readOnly ? "bg-gray-200 text-gray-600" : "bg-white"}
        ${className}
      `}
    />
  );
}

function Sel({ children, className = "", ...rest }) {
  return (
    <select
      {...rest}
      className={`
        border border-gray-300 rounded
        px-2 py-[2px] h-[26px] text-[13px] bg-white
        ${className}
      `}
    >
      {children}
    </select>
  );
}

export default function ManifestoSeguro({ onClose }) {
  // === Estados da primeira parte (Seguradora) ===
  const [codigo, setCodigo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [responsavel, setResponsavel] = useState("Emitente");
  const [cnpj, setCnpj] = useState("");
  const [razao, setRazao] = useState("");
  const [seguradoras, setSeguradoras] = useState([]);
  const [selectedSegIndex, setSelectedSegIndex] = useState(null);

  // === Estados da segunda parte (Averbação) ===
  const [numeroAverb, setNumeroAverb] = useState("");
  const [averbacoes, setAverbacoes] = useState([]);
  const [selectedAverbIndex, setSelectedAverbIndex] = useState(null);

  // === Funções ===
  const handleIncluirSeguradora = () => {
    if (!codigo || !descricao) return alert("Preencha o código e a descrição!");
    const nova = { codigo, descricao, responsavel, cnpj, razao };
    setSeguradoras([...seguradoras, nova]);
    limparSeguradora();
  };

  const handleExcluirSeguradora = () => {
    if (selectedSegIndex === null) return alert("Selecione uma seguradora!");
    setSeguradoras(seguradoras.filter((_, i) => i !== selectedSegIndex));
    setSelectedSegIndex(null);
  };

  const limparSeguradora = () => {
    setCodigo("");
    setDescricao("");
    setResponsavel("Emitente");
    setCnpj("");
    setRazao("");
  };

  const handleIncluirAverb = () => {
    if (!numeroAverb) return alert("Informe o número da averbação!");
    setAverbacoes([...averbacoes, numeroAverb]);
    setNumeroAverb("");
  };

  const handleExcluirAverb = () => {
    if (selectedAverbIndex === null) return alert("Selecione uma averbação!");
    setAverbacoes(averbacoes.filter((_, i) => i !== selectedAverbIndex));
    setSelectedAverbIndex(null);
  };

  const limparAverb = () => setNumeroAverb("");

  const verificarATM = () => alert("Verificação ATM realizada com sucesso ✅");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[900px] max-w-[95vw] rounded shadow-lg border border-gray-300 p-4 max-h-[90vh] overflow-y-auto">
        {/* Título */}
        <h1 className="text-center text-red-700 font-semibold border-b pb-1 text-sm">
          SEGURO DE CARGA
        </h1>

        {/* === CARD 1 - Seguradora === */}
        <fieldset className="border border-gray-300 rounded p-3 bg-white mt-3">
          <legend className="text-red-700 font-semibold text-[13px] px-2">
            Seguradora
          </legend>

          {/* LINHA 01 */}
          <div className="grid grid-cols-12 gap-2 items-center mb-2">
            <Label className="col-span-2">Código</Label>

            {/* Código - InputBuscaCorretora */}
            <InputBuscaCorretora
              label={null}
              className="col-span-2"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Cód. ou Nome"
              onSelect={(corr) => {
                setCodigo(corr.codigo);
                setDescricao(corr.nome);
              }}
            />

            {/* Descrição — NÃO EDITÁVEL */}
            <Txt
              className="col-span-8 bg-gray-200"
              readOnly
              value={descricao}
              placeholder="Nome da Seguradora"
            />
          </div>

          {/* LINHA 02 */}
          <div className="grid grid-cols-12 gap-2 items-center">
            <Label className="col-span-2">Responsável</Label>

            <Sel
              className="col-span-2 w-full"
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
            >
              <option>Emitente</option>
              <option>Tomador</option>
              <option>Destinatário</option>
            </Sel>

            <Label className="col-span-1">CNPJ</Label>

            {/* CNPJ - InputBuscaCliente */}
            <InputBuscaCliente
              label={null}
              className="col-span-3"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              placeholder="CNPJ ou Razão"
              onSelect={(emp) => {
                setCnpj(maskCNPJ(emp.cnpj));
                setRazao(emp.razao);
              }}
            />

            {/* Razão Social — NÃO EDITÁVEL */}
            <Txt
              className="col-span-4 bg-gray-200"
              readOnly
              value={razao}
              placeholder="Razão Social"
            />
          </div>
        </fieldset>


        {/* === CARD 2 e 3 (Grid + Botões) === */}
        <div className="flex gap-2 mt-2">
          {/* GRID */}
          <div className="flex-1 border border-gray-300 rounded p-2 bg-white max-h-[200px] overflow-auto">
            <table className="min-w-full text-[12px] border">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  {["Código", "Nome", "TP Resp.", "CGC/CPF Resp."].map(
                    (col) => (
                      <th
                        key={col}
                        className="border p-1 text-left whitespace-nowrap"
                      >
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {seguradoras.map((s, i) => (
                  <tr
                    key={i}
                    onClick={() => setSelectedSegIndex(i)}
                    className={`cursor-pointer ${selectedSegIndex === i ? "bg-red-50" : ""
                      }`}
                  >
                    <td className="border p-1">{s.codigo}</td>
                    <td className="border p-1">{s.descricao}</td>
                    <td className="border p-1">{s.responsavel}</td>
                    <td className="border p-1">{s.cnpj}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* BOTÕES */}
          <div className="flex flex-col gap-2">
            <button
              onClick={handleIncluirSeguradora}
              className="border border-gray-300 rounded px-2 py-[3px] bg-green-50 hover:bg-green-100 flex items-center gap-1 text-[12px]"
            >
              <PlusCircle size={14} className="text-green-700" /> Incluir
            </button>
            <button className="border border-gray-300 rounded px-2 py-[3px] bg-yellow-50 hover:bg-yellow-100 flex items-center gap-1 text-[12px]">
              <Edit size={14} className="text-yellow-600" /> Alterar
            </button>
            <button
              onClick={handleExcluirSeguradora}
              className="border border-gray-300 rounded px-2 py-[3px] bg-red-50 hover:bg-red-100 flex items-center gap-1 text-[12px]"
            >
              <Trash2 size={14} className="text-red-700" /> Excluir
            </button>
            <button
              onClick={limparSeguradora}
              className="border border-gray-300 rounded px-2 py-[3px] bg-gray-50 hover:bg-gray-100 flex items-center gap-1 text-[12px]"
            >
              <RotateCcw size={14} className="text-gray-600" /> Limpar
            </button>
            <button
              onClick={verificarATM}
              className="border border-gray-300 rounded px-2 py-[3px] bg-blue-50 hover:bg-blue-100 flex items-center gap-1 text-[12px]"
            >
              <ShieldCheck size={14} className="text-blue-600" /> Verif. ATM
            </button>
          </div>
        </div>

        {/* === CARD 4 - Averbação === */}
        <fieldset className="border border-gray-300 rounded p-3 bg-white mt-3">
          <legend className="text-red-700 font-semibold text-[13px] px-2">
            Averbação
          </legend>
          <div className="flex items-center gap-2">
            <label className="w-20 text-[12px] text-gray-600">Número</label>
            <input
              value={numeroAverb}
              onChange={(e) => setNumeroAverb(e.target.value)}
              placeholder="Informe o número da averbação"
              className="border border-gray-300 rounded px-2 py-[2px] h-[24px] flex-1 text-[13px]"
            />
          </div>
        </fieldset>

        {/* === CARD 5 e 6 (Grid + Botões) === */}
        <div className="flex gap-2 mt-2">
          {/* GRID */}
          <div className="flex-1 border border-gray-300 rounded p-2 bg-white max-h-[150px] overflow-auto">
            <table className="min-w-full text-[12px] border">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="border p-1 text-left">Averbação</th>
                </tr>
              </thead>
              <tbody>
                {averbacoes.map((a, i) => (
                  <tr
                    key={i}
                    onClick={() => setSelectedAverbIndex(i)}
                    className={`cursor-pointer ${selectedAverbIndex === i ? "bg-red-50" : ""
                      }`}
                  >
                    <td className="border p-1">{a}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* BOTÕES */}
          <div className="flex flex-col gap-2">
            <button
              onClick={handleIncluirAverb}
              className="border border-gray-300 rounded px-2 py-[3px] bg-green-50 hover:bg-green-100 flex items-center gap-1 text-[12px]"
            >
              <PlusCircle size={14} className="text-green-700" /> Incluir
            </button>
            <button className="border border-gray-300 rounded px-2 py-[3px] bg-yellow-50 hover:bg-yellow-100 flex items-center gap-1 text-[12px]">
              <Edit size={14} className="text-yellow-600" /> Alterar
            </button>
            <button
              onClick={handleExcluirAverb}
              className="border border-gray-300 rounded px-2 py-[3px] bg-red-50 hover:bg-red-100 flex items-center gap-1 text-[12px]"
            >
              <Trash2 size={14} className="text-red-700" /> Excluir
            </button>
            <button
              onClick={limparAverb}
              className="border border-gray-300 rounded px-2 py-[3px] bg-gray-50 hover:bg-gray-100 flex items-center gap-1 text-[12px]"
            >
              <RotateCcw size={14} className="text-gray-600" /> Limpar
            </button>
          </div>
        </div>

        {/* === CARD 7 - Rodapé === */}
        <div className="border-t border-gray-300 bg-white mt-3 pt-2 flex justify-start">
          <button
            onClick={onClose}
            className="flex flex-col items-center text-[11px] text-red-700 hover:text-red-800 transition"
          >
            <XCircle size={20} />
            <span>Fechar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
