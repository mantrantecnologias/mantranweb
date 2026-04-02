// src/pages/filial/FilialParametro.jsx
import React, { useState, useEffect } from "react";
import { XCircle, CheckCircle2 } from "lucide-react";
import { FilialService } from "../../services/FilialService";
import FilialParametroModel from "../../models/filial/FilialParametroModel";
import FilialModel from "../../models/filial/FilialModel";
import { successMessage, errorMessage, infoMessage } from "../../components/Mensagem";
import Loading from "../../components/Loading";

function Label({ children, className = "" }) {
  return (
    <span className={`text-[12px] text-gray-700 ${className}`}>{children}</span>
  );
}

export default function FilialParametro({ cd_Filial, onClose }) {
  const [model, setModel] = useState(new FilialParametroModel());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cd_Filial) {
      buscarParametros();
    }
  }, [cd_Filial]);

  const buscarParametros = async () => {
    try {
      setLoading(true);
      // ✅ Sempre enviar o modelo completo conforme exigência do sistema
      const resp = await FilialService.BuscarFilialParametro(new FilialModel({ cd_Filial }));
      if (resp?.sucesso && resp?.data) {
        setModel(new FilialParametroModel(resp.data));
      } else {
        errorMessage(resp?.erros || "Erro ao buscar parâmetros da filial.");
      }
    } catch {
      errorMessage("Falha de comunicação.");
    } finally {
      setLoading(false);
    }
  };

  const isChecked = (val) => val === "S";

  const toggleCheckbox = (field) => {
    setModel((prev) => ({
      ...prev,
      [field]: prev[field] === "S" ? "N" : "S",
    }));
  };

  const handleAlterar = async () => {
    try {
      setLoading(true);
      // ✅ Converte para o modelo de filial esperado pelo backend
      const modelSave = new FilialModel(model);
      const resp = await FilialService.AlterarFilialParametro(modelSave);
      if (resp?.sucesso) {
        successMessage(resp.data || "Parâmetros alterados com sucesso!");
        onClose();
      } else {
        errorMessage(resp?.erros || "Erro ao alterar parâmetros.");
      }
    } catch {
      errorMessage("Falha de comunicação.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !model.cd_Filial) return <Loading />;

  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 sm:left-14 lg:left-52 bg-black/40 flex items-center justify-center z-[9999] p-2 sm:p-4">
      <div className="bg-white w-full max-w-[1250px] max-h-[95vh] flex flex-col rounded-md shadow-2xl relative">
        {loading && <Loading />}

        {/* HEADER */}
        <div className="p-3 border-b border-gray-200">
          <h2 className="text-center text-red-700 font-semibold text-[15px]">
            FILIAL PARÂMETRO - {cd_Filial}
          </h2>
        </div>

        {/* BODY (Scroll) */}
        <div className="p-4 overflow-y-auto flex-1">
          {/* =================== GRID RESPONSIVO =================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 text-[12px]">

            {/* ==================== COLUNA 1 ==================== */}
            <div className="flex flex-col gap-3">

              {/* CONHECIMENTO */}
              <fieldset className="border border-gray-300 rounded p-2">
                <legend className="px-1 text-[11px] font-semibold text-red-700">
                  CONHECIMENTO
                </legend>
                <div className="mt-1 space-y-1">
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_CTe_Alt_DTEmissao)} onChange={() => toggleCheckbox("fl_CTe_Alt_DTEmissao")} /><Label>Al Dt. Emissão ao Autorizar</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Apenas_CTRC_Servico)} onChange={() => toggleCheckbox("fl_Apenas_CTRC_Servico")} /><Label>Apenas CTRC de Serviço x Cliente</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Corrigir_Remetente_Destinatario)} onChange={() => toggleCheckbox("fl_Corrigir_Remetente_Destinatario")} /><Label>Corrigir Remetente e Destinatário</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Custos_Adicionais_Opcionais)} onChange={() => toggleCheckbox("fl_Custos_Adicionais_Opcionais")} /><Label>Custos Adicionais Opcionais</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_ICMS_MultiModal)} onChange={() => toggleCheckbox("fl_ICMS_MultiModal")} /><Label>ICMS MultiModal</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Cte_PDF_Lote)} onChange={() => toggleCheckbox("fl_Cte_PDF_Lote")} /><Label>Impressão CTe em Lote</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Mesmo_Reme_Dest)} onChange={() => toggleCheckbox("fl_Mesmo_Reme_Dest")} /><Label>Mesmo Remetente/Destinatário</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Bloqueio_NF_Sem_Rota)} onChange={() => toggleCheckbox("fl_Bloqueio_NF_Sem_Rota")} /><Label>Não Gerar CTE s/ Rota</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_CTE_Sem_Ender_Observ)} onChange={() => toggleCheckbox("fl_CTE_Sem_Ender_Observ")} /><Label>Não Usar Endereço na Obs. CTe</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Soma_Container_Mercadoria)} onChange={() => toggleCheckbox("fl_Soma_Container_Mercadoria")} /><Label>Soma VR_Container no VR_Mercadoria</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Usar_Recebedor_CTe)} onChange={() => toggleCheckbox("fl_Usar_Recebedor_CTe")} /><Label>Usar Recebedor CTe</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Zerar_Compl_Imposto)} onChange={() => toggleCheckbox("fl_Zerar_Compl_Imposto")} /><Label>Zerar Prest. CTe Complemento Imposto</Label></label>
                </div>
              </fieldset>

              {/* MINUTA */}
              <fieldset className="border border-gray-300 rounded p-2">
                <legend className="px-1 text-[11px] font-semibold text-red-700">
                  MINUTA
                </legend>
                <div className="mt-1 space-y-1">
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Averba_Minuta)} onChange={() => toggleCheckbox("fl_Averba_Minuta")} /><Label>Averba Minuta de Transporte</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Bloqueio_Minuta_Coleta)} onChange={() => toggleCheckbox("fl_Bloqueio_Minuta_Coleta")} /><Label>Gerar 1 Minuta por Coleta</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_OST_Sem_ICMS)} onChange={() => toggleCheckbox("fl_OST_Sem_ICMS")} /><Label>Minuta Não Cobrar ICMS</Label></label>
                </div>
              </fieldset>

            </div>


            {/* ==================== COLUNA 2 ==================== */}
            <div className="flex flex-col gap-3">

              {/* NFE */}
              <fieldset className="border border-gray-300 rounded p-2">
                <legend className="px-1 text-[11px] font-semibold text-red-700">
                  NFE
                </legend>
                <div className="mt-1 space-y-1">
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Assumir_VR_Frete_NF)} onChange={() => toggleCheckbox("fl_Assumir_VR_Frete_NF")} /><Label>Assumir Valor Frete da NF</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Baixa_NFe_Atualizar_Cliente)} onChange={() => toggleCheckbox("fl_Baixa_NFe_Atualizar_Cliente")} /><Label>Baixa NF Atualizar Cliente</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_EDI_Entrega_Transportadora)} onChange={() => toggleCheckbox("fl_EDI_Entrega_Transportadora")} /><Label>NF EDI: Entrega Transportadora</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Assumir_NF_Bloqueada)} onChange={() => toggleCheckbox("fl_Assumir_NF_Bloqueada")} /><Label>NF EDI: Importar NF Bloqueada</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_NF_Estrangeira_Troca_Rem_Des)} onChange={() => toggleCheckbox("fl_NF_Estrangeira_Troca_Rem_Des")} /><Label>NF EDI: Nota TP 0 Troca Rem x Des</Label></label>
                </div>
              </fieldset>

              {/* COLETA */}
              <fieldset className="border border-gray-300 rounded p-2">
                <legend className="px-1 text-[11px] font-semibold text-red-700">
                  COLETA
                </legend>
                <div className="mt-1 space-y-1">
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Baixa_CTe_Encerra_Coleta)} onChange={() => toggleCheckbox("fl_Baixa_CTe_Encerra_Coleta")} /><Label>Baixa CTe Não Encerra Coleta</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Encerrar_Coleta)} onChange={() => toggleCheckbox("fl_Encerrar_Coleta")} /><Label>Não Encerrar Coleta</Label></label>
                </div>
              </fieldset>

              {/* MANIFESTO */}
              <fieldset className="border border-gray-300 rounded p-2">
                <legend className="px-1 text-[11px] font-semibold text-red-700">
                  MANIFESTO
                </legend>
                <div className="mt-1">
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Nao_Emitir_MDFe_Veiculo)} onChange={() => toggleCheckbox("fl_Nao_Emitir_MDFe_Veiculo")} /><Label>Não Emitir MDFE com Veículo nos Últimos 30 dias</Label></label>
                </div>
              </fieldset>

            </div>


            {/* ==================== COLUNA 3 ==================== */}
            <div className="flex flex-col gap-3">

              {/* SISTEMA */}
              <fieldset className="border border-gray-300 rounded p-2">
                <legend className="px-1 text-[11px] font-semibold text-red-700">
                  SISTEMA
                </legend>
                <div className="mt-1 space-y-1">
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Cte_Eletronico)} onChange={() => toggleCheckbox("fl_Cte_Eletronico")} /><Label>Filial com CTE</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_MDFe_Eletronico)} onChange={() => toggleCheckbox("fl_MDFe_Eletronico")} /><Label>Filial com MDFE</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Financeiro_NET)} onChange={() => toggleCheckbox("fl_Financeiro_NET")} /><Label>Financeiro Híbrido</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Operacao_NET)} onChange={() => toggleCheckbox("fl_Operacao_NET")} /><Label>Operação Híbrido</Label></label>
                </div>
              </fieldset>

              {/* FINANCEIRO */}
              <fieldset className="border border-gray-300 rounded p-2">
                <legend className="px-1 text-[11px] font-semibold text-red-700">
                  FINANCEIRO
                </legend>
                <div className="mt-1 space-y-1">
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Fatura_NF)} onChange={() => toggleCheckbox("fl_Fatura_NF")} /><Label>Fatura Versão por NF</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Nao_Compactar_Arquivos_Fatura)} onChange={() => toggleCheckbox("fl_Nao_Compactar_Arquivos_Fatura")} /><Label>Não Compactar Arquivos Fatura</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Faturamento_Automatico)} onChange={() => toggleCheckbox("fl_Faturamento_Automatico")} /><Label>Filial Faturamento Automático</Label></label>
                </div>
              </fieldset>

              {/* INTEGRAÇÃO */}
              <fieldset className="border border-gray-300 rounded p-2">
                <legend className="px-1 text-[11px] font-semibold text-red-700">
                  INTEGRAÇÃO
                </legend>
                <div className="mt-1 space-y-1">
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Integracao_BD)} onChange={() => toggleCheckbox("fl_Integracao_BD")} /><Label>Gerar CTRC via Integração</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Integracao_Microled)} onChange={() => toggleCheckbox("fl_Integracao_Microled")} /><Label>Integração Microlied</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Integracao_Sapiens)} onChange={() => toggleCheckbox("fl_Integracao_Sapiens")} /><Label>Integração Sapiens</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Liberacao_Gestao_Entregas)} onChange={() => toggleCheckbox("fl_Liberacao_Gestao_Entregas")} /><Label>Validar Liberação Gestão Entrega</Label></label>
                </div>
              </fieldset>

            </div>


            {/* ==================== COLUNA 4 ==================== */}
            <div className="flex flex-col gap-3">

              {/* VIAGEM */}
              <fieldset className="border border-gray-300 rounded p-2">
                <legend className="px-1 text-[11px] font-semibold text-red-700">
                  VIAGEM
                </legend>
                <div className="mt-1 space-y-1">
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Agregado_Placa)} onChange={() => toggleCheckbox("fl_Agregado_Placa")} /><Label>Agregado por Placa</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Gerar_CP_Frota)} onChange={() => toggleCheckbox("fl_Gerar_CP_Frota")} /><Label>Gerar CP para Frota</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Habilitar_CP_Despesa_Viagem)} onChange={() => toggleCheckbox("fl_Habilitar_CP_Despesa_Viagem")} /><Label>Habilita CP Despesa Viagem (A)</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Historico_Despesa_Obrigatorio)} onChange={() => toggleCheckbox("fl_Historico_Despesa_Obrigatorio")} /><Label>Histórico Despesa Obrigatório</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Motorista_Varias_Viagens)} onChange={() => toggleCheckbox("fl_Motorista_Varias_Viagens")} /><Label>Incluir Nova Viagem Mesma Placa</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Motorista_Varias_Viagens_ETC)} onChange={() => toggleCheckbox("fl_Motorista_Varias_Viagens_ETC")} /><Label>Incluir Nova Viagem Mesma Placa (ETC)</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Calc_Imp_Viagem)} onChange={() => toggleCheckbox("fl_Calc_Imp_Viagem")} /><Label>Não Calcular Impostos Viagem</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_TAC_Varios_Agregados)} onChange={() => toggleCheckbox("fl_TAC_Varios_Agregados")} /><Label>Permite TAC para Vários Agregados</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Valida_Container)} onChange={() => toggleCheckbox("fl_Valida_Container")} /><Label>Validar Pagamento Container</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Viagem_Tabela_Cliente)} onChange={() => toggleCheckbox("fl_Viagem_Tabela_Cliente")} /><Label>Viagem Busca Tabela por Cliente</Label></label>
                </div>
              </fieldset>

              {/* CADASTROS BÁSICOS */}
              <fieldset className="border border-gray-300 rounded p-2">
                <legend className="px-1 text-[11px] font-semibold text-red-700">
                  CADASTROS BÁSICOS
                </legend>
                <div className="mt-1 space-y-1">
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Bloquear_Docs_Vencidos)} onChange={() => toggleCheckbox("fl_Bloquear_Docs_Vencidos")} /><Label>Bloquear Documentos Vencidos</Label></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-red-700" checked={isChecked(model.fl_Valida_GRIS)} onChange={() => toggleCheckbox("fl_Valida_GRIS")} /><Label>Validação de GRIS do Motorista</Label></label>
                </div>
              </fieldset>

            </div>

          </div>
        </div>

        {/* RODAPÉ FIXO */}
        <div className="border-t border-gray-200 bg-gray-50 p-3 flex justify-end gap-2 text-[13px] rounded-b-md">
          <button
            onClick={onClose}
            className="flex items-center gap-1 px-3 py-1 border rounded hover:bg-white transition"
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
