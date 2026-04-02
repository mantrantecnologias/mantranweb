// src/pages/filial/FilialNumeracao.jsx
import React, { useState } from "react";
import { XCircle, CheckCircle2 } from "lucide-react";
import { FilialService } from "../../services/FilialService";
import { successMessage, errorMessage } from "../../components/Mensagem";
import Loading from "../../components/Loading";

function Label({ children, className = "" }) {
  return (
    <label className={`text-[12px] text-gray-700 ${className}`}>{children}</label>
  );
}

function Txt(props) {
  return (
    <input
      {...props}
      className={
        "border border-gray-300 rounded px-1 py-[2px] h-[24px] text-[12px] " +
        (props.className || "")
      }
    />
  );
}

export default function FilialNumeracao({ model, setModel, onClose }) {
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setModel(prev => ({ ...prev, [field]: value }));
  };

  const handleAlterar = async () => {
    try {
      setLoading(true);
      const resp = await FilialService.AlterarFilial(model);
      if (resp?.sucesso) {
        successMessage(resp.data || "Numerações alteradas com sucesso!");
        onClose();
      } else {
        errorMessage(resp?.erros || "Erro ao alterar numerações.");
      }
    } catch {
      errorMessage("Falha de comunicação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 sm:left-14 lg:left-52 bg-black/40 flex items-center justify-center z-[9999]">
      <div className="bg-white w-[900px] max-w-[95vw] rounded-md shadow-xl p-4 relative">
        {loading && <Loading />}
        
        <h2 className="text-center text-red-700 font-semibold text-[15px] mb-3">
          NUMERAÇÃO DOCUMENTOS - {model.cd_Filial}
        </h2>

        <div className="grid md:grid-cols-2 gap-4 text-[12px]">
          {/* Bloco 1 */}
          <fieldset className="border border-gray-300 rounded p-2">
            <legend className="px-1 text-[11px] font-semibold text-red-700">
              CONTROLE / CTe / Coleta / Viagem
            </legend>
            <div className="mt-1 space-y-2">
              <div className="flex items-center gap-2">
                <Label className="w-[150px]">Nº Último Controle</Label>
                <Txt 
                  className="flex-1 text-right" 
                  value={model.nr_CTRC_Controle} 
                  onChange={(e) => handleChange("nr_CTRC_Controle", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="w-[150px]">Nº Último CTe</Label>
                <Txt 
                  className="flex-1 text-right" 
                  value={model.nr_Ultimo_CTRC} 
                  onChange={(e) => handleChange("nr_Ultimo_CTRC", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="w-[150px]">Nº Série do CTe</Label>
                <Txt 
                  className="flex-1 text-right" 
                  value={model.nr_CTRC_Serie} 
                  onChange={(e) => handleChange("nr_CTRC_Serie", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="w-[150px]">Nº Última Coleta</Label>
                <Txt 
                  className="flex-1 text-right" 
                  value={model.nr_Ultima_Coleta} 
                  onChange={(e) => handleChange("nr_Ultima_Coleta", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="w-[150px]">Nº Última Viagem</Label>
                <Txt 
                  className="flex-1 text-right" 
                  value={model.nr_Ultima_Viagem} 
                  onChange={(e) => handleChange("nr_Ultima_Viagem", e.target.value)}
                />
              </div>
            </div>
          </fieldset>

          {/* Bloco 2 */}
          <fieldset className="border border-gray-300 rounded p-2">
            <legend className="px-1 text-[11px] font-semibold text-red-700">
              FATURA / OS / OCORRÊNCIA / ROMANEIO
            </legend>
            <div className="mt-1 space-y-2">
              <div className="flex items-center gap-2">
                <Label className="w-[150px]">Nº Última Fatura</Label>
                <Txt 
                  className="flex-1 text-right" 
                  value={model.nr_Ultima_Fatura} 
                  onChange={(e) => handleChange("nr_Ultima_Fatura", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="w-[150px]">Nº Última OS</Label>
                <Txt 
                  className="flex-1 text-right" 
                  value={model.nr_OS} 
                  onChange={(e) => handleChange("nr_OS", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="w-[150px]">Nº Última Ocorrência</Label>
                <Txt 
                  className="flex-1 text-right" 
                  value={model.nr_Ultima_Ocorrencia} 
                  onChange={(e) => handleChange("nr_Ultima_Ocorrencia", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="w-[150px]">Nº Último Romaneio</Label>
                <Txt 
                  className="flex-1 text-right" 
                  value={model.nr_Ultimo_Romaneio} 
                  onChange={(e) => handleChange("nr_Ultimo_Romaneio", e.target.value)}
                />
              </div>
            </div>
          </fieldset>

          {/* Bloco 3 */}
          <fieldset className="border border-gray-300 rounded p-2">
            <legend className="px-1 text-[11px] font-semibold text-red-700">
              NF SERVIÇO / MANIFESTO
            </legend>
            <div className="mt-1 space-y-2">
              <div className="flex items-center gap-2">
                <Label className="w-[150px]">Nº Última NF Serviço</Label>
                <Txt 
                  className="flex-1 text-right" 
                  value={model.nr_Ultima_NF_Servico} 
                  onChange={(e) => handleChange("nr_Ultima_NF_Servico", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="w-[150px]">Nº NF Saída</Label>
                <Txt 
                  className="flex-1 text-right" 
                  value={model.nr_Ultima_NF_Movimento} 
                  onChange={(e) => handleChange("nr_Ultima_NF_Movimento", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="w-[150px]">Série NF Serviço</Label>
                <Txt 
                  className="flex-1 text-right" 
                  value={model.nf_Servico_Serie} 
                  onChange={(e) => handleChange("nf_Servico_Serie", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="w-[150px]">Nº Último Manifesto</Label>
                <Txt 
                  className="flex-1 text-right" 
                  value={model.nr_Ultimo_Manifesto} 
                  onChange={(e) => handleChange("nr_Ultimo_Manifesto", e.target.value)}
                />
              </div>
            </div>
          </fieldset>

          {/* Bloco 4 */}
          <fieldset className="border border-gray-300 rounded p-2">
            <legend className="px-1 text-[11px] font-semibold text-red-700">
              MDF-e / NSU / SÉRIES
            </legend>
            <div className="mt-1 space-y-2">
              <div className="flex items-center gap-2">
                <Label className="w-[150px]">Nº Último MDF-e</Label>
                <Txt 
                  className="flex-1 text-right" 
                  value={model.nr_Ultimo_MDFe} 
                  onChange={(e) => handleChange("nr_Ultimo_MDFe", e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Label className="w-[150px]">Nº Série MDF-e</Label>
                <Txt 
                  className="flex-1 text-right" 
                  value={model.nr_Serie_MDFe} 
                  onChange={(e) => handleChange("nr_Serie_MDFe", e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Label className="w-[150px]">Nº Último NSU</Label>
                <Txt
                  className="flex-1 text-right"
                  value={model.nr_Ultimo_NSU}
                  onChange={(e) => handleChange("nr_Ultimo_NSU", e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Label className="w-[150px]">Créd Série</Label>
                <Txt 
                  className="flex-1 text-right" 
                  value={model.nf_Credito_Serie} 
                  onChange={(e) => handleChange("nf_Credito_Serie", e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Label className="w-[150px]">Deb Série</Label>
                <Txt 
                  className="flex-1 text-right" 
                  value={model.nf_Debito_Serie} 
                  onChange={(e) => handleChange("nf_Debito_Serie", e.target.value)}
                />
              </div>
            </div>
          </fieldset>
        </div>

        {/* Rodapé */}
        <div className="mt-4 border-t border-gray-200 pt-2 flex justify-end gap-2 text-[13px]">
          <button
            onClick={onClose}
            className="flex items-center gap-1 px-3 py-1 border rounded hover:bg-gray-100 transition"
          >
            <XCircle size={16} className="text-red-700" />
            Fechar
          </button>
          <button
            onClick={handleAlterar}
            className="flex items-center gap-1 px-3 py-1 bg-red-700 text-white rounded hover:bg-red-800 transition"
          >
            <CheckCircle2 size={16} />
            Alterar
          </button>
        </div>
      </div>
    </div>
  );
}
