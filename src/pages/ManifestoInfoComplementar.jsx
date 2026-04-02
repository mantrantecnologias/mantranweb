// === ManifestoInfoComplementar.jsx ===
import { useState, useEffect, useRef } from "react";
import { XCircle, RotateCcw, Edit, FilePlus2 } from "lucide-react";
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

export default function ManifestoInfoComplementar({ onClose }) {
  // === Estados dos campos (iniciam vazios) ===
  const [numero, setNumero] = useState("");
  const [responsavelCnpj, setResponsavelCnpj] = useState("");
  const [responsavelRazao, setResponsavelRazao] = useState("");
  const [fornecedorCnpj, setFornecedorCnpj] = useState("");
  const [fornecedorRazao, setFornecedorRazao] = useState("");
  const [comprovante, setComprovante] = useState("");
  const [valor, setValor] = useState("");
  const [contratante, setContratante] = useState("Emitente");
  const [contratanteCnpj, setContratanteCnpj] = useState("");
  const [contratanteRazao, setContratanteRazao] = useState("");

  // === Refs para navegação ===
  const numeroRef = useRef(null);
  const btnAlterarRef = useRef(null);
  const btnFecharRef = useRef(null);

  // Foco inicial no campo Número
  useEffect(() => {
    setTimeout(() => numeroRef.current?.focus(), 100);
  }, []);

  // Handler para navegação com Enter por tabIndex
  const handleKeyDown = (e, nextTabIndex) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const next = document.querySelector(`[tabindex="${nextTabIndex}"]`);
      if (next) next.focus();
    }
  };

  // Ação do botão Alterar
  const handleAlterar = () => {
    alert("Alterar executado!");
    setTimeout(() => btnFecharRef.current?.focus(), 100);
  };

  // Limpar todos os campos
  const limparCampos = () => {
    setNumero("");
    setResponsavelCnpj("");
    setResponsavelRazao("");
    setFornecedorCnpj("");
    setFornecedorRazao("");
    setComprovante("");
    setValor("");
    setContratante("Emitente");
    setContratanteCnpj("");
    setContratanteRazao("");
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 text-[13px]">
      <div className="bg-white w-[750px] rounded shadow-lg border border-gray-300 p-4">
        {/* Título */}
        <h2 className="text-center text-red-700 font-semibold text-[14px] mb-3 border-b pb-1">
          INFORMAÇÕES COMPLEMENTARES
        </h2>

        <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
          {/* ===== CARD 1 - CIOT ===== */}
          <fieldset className="border border-gray-300 rounded p-3 bg-white">
            <legend className="text-[13px] text-red-700 font-medium px-2">
              CIOT
            </legend>

            {/* LINHA 01 - Número */}
            <div className="grid grid-cols-12 gap-2 items-center mb-2">
              <Label className="col-span-2">Número</Label>

              <Txt
                ref={numeroRef}
                className="col-span-10"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                tabIndex={100}
                onKeyDown={(e) => handleKeyDown(e, 101)}
              />
            </div>

            {/* LINHA 02 - Responsável */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-2">Responsável</Label>

              {/* CNPJ - InputBuscaCliente */}
              <InputBuscaCliente
                label={null}
                className="col-span-3"
                value={responsavelCnpj}
                onChange={(e) => setResponsavelCnpj(e.target.value)}
                placeholder="CNPJ ou Razão"
                tabIndex={101}
                onSelect={(emp) => {
                  setResponsavelCnpj(maskCNPJ(emp.cnpj));
                  setResponsavelRazao(emp.razao);
                  setTimeout(() => {
                    const next = document.querySelector('[tabindex="102"]');
                    if (next) next.focus();
                  }, 100);
                }}
              />

              {/* Razão Social — NÃO EDITÁVEL */}
              <Txt
                className="col-span-7 bg-gray-200"
                readOnly
                value={responsavelRazao}
                placeholder="Razão Social"
                tabIndex={-1}
              />
            </div>
          </fieldset>


          {/* ===== CARD 2 - VALE PEDÁGIO ===== */}
          <fieldset className="border border-gray-300 rounded p-3 bg-white">
            <legend className="text-[13px] text-red-700 font-medium px-2">
              Vale Pedágio
            </legend>

            {/* LINHA 01 — FORNECEDOR */}
            <div className="grid grid-cols-12 gap-2 items-center mb-2">
              <Label className="col-span-2">Fornecedor</Label>

              {/* CNPJ */}
              <Txt
                className="col-span-3"
                value={fornecedorCnpj}
                onChange={(e) => setFornecedorCnpj(e.target.value)}
                placeholder="CNPJ"
                tabIndex={102}
                onKeyDown={(e) => handleKeyDown(e, 103)}
              />

              {/* Razão Social — NÃO EDITÁVEL */}
              <Txt
                className="col-span-7 bg-gray-200"
                readOnly
                value={fornecedorRazao}
                placeholder="Razão Social"
                tabIndex={-1}
              />
            </div>

            {/* LINHA 02 — COMPROVANTE / VALOR */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-2">Comprovante</Label>

              <Txt
                className="col-span-6"
                value={comprovante}
                onChange={(e) => setComprovante(e.target.value)}
                placeholder="Nº Comprovante"
                tabIndex={103}
                onKeyDown={(e) => handleKeyDown(e, 104)}
              />

              <Label className="col-span-2">Valor</Label>

              <Txt
                className="col-span-2 text-right"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="0,00"
                tabIndex={104}
                onKeyDown={(e) => handleKeyDown(e, 105)}
              />
            </div>
          </fieldset>

          {/* ===== CARD 3 - CONTRATANTE ===== */}
          <fieldset className="border border-gray-300 rounded p-3 bg-white">
            <legend className="text-[13px] text-red-700 font-medium px-2">
              Contratante
            </legend>

            {/* LINHA 01 */}
            <div className="grid grid-cols-12 gap-2 items-center mb-2">
              <Label className="col-span-2">Contratante</Label>

              <Sel
                className="col-span-3 w-full"
                value={contratante}
                onChange={(e) => setContratante(e.target.value)}
                tabIndex={105}
                onKeyDown={(e) => handleKeyDown(e, 106)}
              >
                <option>Emitente</option>
                <option>Remetente</option>
                <option>Destinatário</option>
                <option>Outros</option>
              </Sel>
            </div>

            {/* LINHA 02 */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-2">CNPJ / CPF</Label>

              {/* Documento - InputBuscaCliente */}
              <InputBuscaCliente
                label={null}
                className="col-span-3"
                value={contratanteCnpj}
                onChange={(e) => setContratanteCnpj(e.target.value)}
                placeholder="CNPJ ou Razão"
                tabIndex={106}
                onSelect={(emp) => {
                  setContratanteCnpj(maskCNPJ(emp.cnpj));
                  setContratanteRazao(emp.razao);
                  setTimeout(() => {
                    const next = document.querySelector('[tabindex="107"]');
                    if (next) next.focus();
                  }, 100);
                }}
              />

              {/* Razão Social — NÃO EDITÁVEL */}
              <Txt
                className="col-span-7 bg-gray-200"
                readOnly
                value={contratanteRazao}
                placeholder="Razão Social"
                tabIndex={-1}
              />
            </div>
          </fieldset>

        </div>

        {/* ===== CARD 4 - RODAPÉ ===== */}
        <div className="border-t border-gray-200 mt-4 pt-2 flex justify-start gap-4 text-[12px]">
          {/* Alterar */}
          <button
            ref={btnAlterarRef}
            tabIndex={107}
            onClick={handleAlterar}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAlterar();
              }
            }}
            className="flex flex-col items-center text-gray-600 hover:text-red-700 transition"
          >
            <Edit size={18} />
            <span>Alterar</span>
          </button>

          {/* Fechar */}
          <button
            ref={btnFecharRef}
            tabIndex={108}
            onClick={onClose}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onClose();
              }
            }}
            className="flex flex-col items-center text-red-700 hover:text-red-800 transition"
          >
            <XCircle size={18} />
            <span>Fechar</span>
          </button>

          {/* Limpar */}
          <button
            onClick={limparCampos}
            className="flex flex-col items-center text-gray-600 hover:text-red-700 transition"
          >
            <RotateCcw size={18} />
            <span>Limpar</span>
          </button>

          {/* Gerar CIOT */}
          <button className="flex flex-col items-center text-green-700 hover:text-green-800 transition">
            <FilePlus2 size={18} />
            <span>Gerar CIOT</span>
          </button>
        </div>
      </div>
    </div>
  );
}
