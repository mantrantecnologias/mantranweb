import { useState } from "react";
import { XCircle, RotateCcw, CheckSquare } from "lucide-react";
import { useIconColor } from "../../context/IconColorContext";
import { useModulos } from "../../context/ModulosContext";

function LabelCheck({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-[13px] text-gray-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 cursor-pointer"
      />
      {label}
    </label>
  );
}

const defaultModulos = {
  operacao: false,
  ecommerce: false,
  financeiro: false,
  ediXml: false,
  oficina: false,
  bi: false,
  relatorios: false,
  comercial: false,
  crm: false,
  seguranca: false,
  wms: false,
  roteirizador: false,
  baixaXml: false,
  vendas: false,
  localize: false,
  mobile: false,
};

export default function EmpresaModulos({ onClose }) {
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();
  const { modulos, setModulos } = useModulos();

  // Trabalha numa cópia local e só grava no Alterar
  const [localModulos, setLocalModulos] = useState(modulos || defaultModulos);

  const handleCheck = (key) => {
    setLocalModulos((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const limpar = () => {
    setLocalModulos(defaultModulos);
  };

  const salvar = () => {
    setModulos(localModulos); // 🔥 grava no contexto global
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-4 w-[520px]">
        {/* Título */}
        <div className="text-[16px] font-semibold mb-3 text-red-700">
          Módulos Contratados
        </div>

        {/* Card */}
        <div className="border rounded-lg p-3 shadow-sm">
          <fieldset className="border rounded-lg p-3">
            <legend className="text-[12px] px-1 text-gray-600">Módulos</legend>

            <div className="grid grid-cols-2 gap-2">
              <LabelCheck
                label="Operação"
                checked={localModulos.operacao}
                onChange={() => handleCheck("operacao")}
              />

              <LabelCheck
                label="E-commerce"
                checked={localModulos.ecommerce}
                onChange={() => handleCheck("ecommerce")}
              />

              <LabelCheck
                label="Financeiro"
                checked={localModulos.financeiro}
                onChange={() => handleCheck("financeiro")}
              />

              <LabelCheck
                label="EDI XML"
                checked={localModulos.ediXml}
                onChange={() => handleCheck("ediXml")}
              />

              <LabelCheck
                label="Oficina"
                checked={localModulos.oficina}
                onChange={() => handleCheck("oficina")}
              />

              <LabelCheck
                label="Mantran BI"
                checked={localModulos.bi}
                onChange={() => handleCheck("bi")}
              />

              <LabelCheck
                label="Gerador de Relatórios"
                checked={localModulos.relatorios}
                onChange={() => handleCheck("relatorios")}
              />

              <LabelCheck
                label="Comercial"
                checked={localModulos.comercial}
                onChange={() => handleCheck("comercial")}
              />

              <LabelCheck
                label="CRM"
                checked={localModulos.crm}
                onChange={() => handleCheck("crm")}
              />

              <LabelCheck
                label="Segurança"
                checked={localModulos.seguranca}
                onChange={() => handleCheck("seguranca")}
              />

              <LabelCheck
                label="WMS"
                checked={localModulos.wms}
                onChange={() => handleCheck("wms")}
              />

              <LabelCheck
                label="Roteirizador"
                checked={localModulos.roteirizador}
                onChange={() => handleCheck("roteirizador")}
              />

              <LabelCheck
                label="Baixa XML"
                checked={localModulos.baixaXml}
                onChange={() => handleCheck("baixaXml")}
              />

              <LabelCheck
                label="Vendas"
                checked={localModulos.vendas}
                onChange={() => handleCheck("vendas")}
              />

              <LabelCheck
                label="Localize Cargas"
                checked={localModulos.localize}
                onChange={() => handleCheck("localize")}
              />

              <LabelCheck
                label="Mobile"
                checked={localModulos.mobile}
                onChange={() => handleCheck("mobile")}
              />
            </div>
          </fieldset>
        </div>

        {/* RODAPÉ */}
        <div className="flex justify-between mt-4">
          {/* Fechar */}
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-[13px] px-3 py-1 rounded transition"
            style={{ color: footerIconColorNormal }}
            onMouseEnter={(e) => (e.target.style.color = footerIconColorHover)}
            onMouseLeave={(e) => (e.target.style.color = footerIconColorNormal)}
          >
            <XCircle size={18} /> Fechar
          </button>

          <div className="flex gap-2">
            {/* Limpar */}
            <button
              onClick={limpar}
              className="flex items-center gap-1 text-[13px] px-3 py-1 rounded transition"
              style={{ color: footerIconColorNormal }}
              onMouseEnter={(e) => (e.target.style.color = footerIconColorHover)}
              onMouseLeave={(e) => (e.target.style.color = footerIconColorNormal)}
            >
              <RotateCcw size={18} /> Limpar
            </button>

            {/* Alterar / Salvar */}
            <button
              onClick={salvar}
              className="flex items-center gap-1 text-[13px] px-3 py-1 rounded transition"
              style={{ color: footerIconColorNormal }}
              onMouseEnter={(e) => (e.target.style.color = footerIconColorHover)}
              onMouseLeave={(e) => (e.target.style.color = footerIconColorNormal)}
            >
              <CheckSquare size={18} /> Alterar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
