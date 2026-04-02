import { useState, useEffect } from "react";
import { XCircle, Edit } from "lucide-react";
import EmpresaParametroModel from "../../models/empresa/EmpresaParametroModel";
import { EmpresaService } from "../../services/EmpresaService";
import { infoMessage, errorMessage, passwordMessage, successMessage } from "../../components/Mensagem";

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
      className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full ${props.className || ""}`}
    />
  );
}

export default function EmpresaParametro({ empresa, onClose }) {
  const [model, setModel] = useState(new EmpresaParametroModel());

  useEffect(() => {
    if (empresa?.cd_Empresa) {
      carregarParametros();
    } else {
      infoMessage("Selecione uma empresa primeiro.");
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const carregarParametros = async () => {
    try {
      const resp = await EmpresaService.BuscarEmpresaParametro(empresa);
      if (resp?.sucesso && resp?.data) {
        setModel(new EmpresaParametroModel(resp.data));
      } else {
        errorMessage(resp?.erros || "Erro ao carregar os parâmetros da empresa.");
      }
    } catch (e) {
      errorMessage("Falha na comunicação com o servidor.");
    }
  };

  const handleChangeModel = (field, value) => {
    setModel((prev) => ({ ...prev, [field]: value }));
  };

  const isChecked = (val) => val === "S" || val === true;
  const toggleCheckbox = (field) => {
    const currentValue = isChecked(model[field]);
    handleChangeModel(field, !currentValue ? "S" : "N");
  };

  const handleSalvarAlteracoes = async () => {
    const { value: password, isConfirmed } = await passwordMessage(
      "Alteração de Parâmetro", 
      "Senha do Administrador"
    );

    if (isConfirmed) {
      if (!password) {
        return infoMessage("A senha precisa ser informada!");
      }

      // 1) Verify password
      const respSenha = await EmpresaService.VerificaSenhaEmpresa(password);
      
      // Se não houver sucesso (caiu no bloco Não Autorizado ou outro erro HTTP)
      if (!respSenha?.sucesso) {
        return errorMessage("Senha Inválida!");
      }

      // Opcional: checar a string "Autorizado" se necessário, 
      // mas se status foi 200, já deu certo.
      
      // 2) Save changes
      const respSalvar = await EmpresaService.AlterarEmpresaParametro(model);

      if (respSalvar?.sucesso) {
        successMessage(respSalvar.data || "Parâmetros atualizados com sucesso!");
        onClose(); // fecha o modal automaticamente pós-salvamento
      } else {
        try {
          const erro = typeof respSalvar?.erros === "string" ? JSON.parse(respSalvar.erros) : respSalvar?.erros;
          if (erro?.errorCode === "VALIDATION_ERROR") {
            infoMessage(erro.message);
          } else {
            errorMessage(erro?.message || "Erro ao salvar parâmetros.");
          }
        } catch {
          errorMessage(respSalvar?.erros || "Erro ao salvar parâmetros.");
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white w-full max-w-[800px] max-h-full flex flex-col rounded shadow-lg border border-gray-300">
        {/* HEADER */}
        <div className="p-3 border-b border-gray-200">
          <h2 className="text-center text-red-700 font-semibold text-[15px]">
            EMPRESA PARÂMETRO
          </h2>
        </div>

        {/* BODY */}
        <div className="p-4 overflow-y-auto flex-1 text-gray-700">
          {/* EMPRESA */}
          <div className="mb-4">
            <Label>Empresa</Label>
            <Txt
              value={`${empresa?.cd_Empresa || ""} - ${empresa?.razao_Social || ""}`}
              disabled
              className="bg-gray-100"
            />
          </div>

          {/* GRID PRINCIPAL */}
          <div className="grid grid-cols-2 gap-4">
            {/* Coluna Esquerda */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[12px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChecked(model.fl_Reinicia_Numeracao_Fatura)}
                  onChange={() => toggleCheckbox("fl_Reinicia_Numeracao_Fatura")}
                />
                Reinicia a numeração das faturas mensalmente
              </label>

              <label className="flex items-center gap-2 text-[12px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChecked(model.fl_Numeracao_Tipo_Cliente)}
                  onChange={() => toggleCheckbox("fl_Numeracao_Tipo_Cliente")}
                />
                Numeração diferenciada de faturas por Correntista e Eventual
              </label>

              <label className="flex items-center gap-2 text-[12px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChecked(model.fl_Remetente_Solicitante)}
                  onChange={() => toggleCheckbox("fl_Remetente_Solicitante")}
                />
                Usar como Remetente do CT-e o Solicitante da Coleta
              </label>

              <label className="flex items-center gap-2 text-[12px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChecked(model.fl_Usar_Filial_Faturamento)}
                  onChange={() => toggleCheckbox("fl_Usar_Filial_Faturamento")}
                />
                Usar Filial Faturamento
              </label>

              <label className="flex items-center gap-2 text-[12px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChecked(model.fl_Tem_CIOT)}
                  onChange={() => toggleCheckbox("fl_Tem_CIOT")}
                />
                Integração com CIOT
              </label>

              <label className="flex items-center gap-2 text-[12px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChecked(model.fl_Baixa_XML_NFE)}
                  onChange={() => toggleCheckbox("fl_Baixa_XML_NFE")}
                />
                Baixa XML de Nota Fiscal
              </label>

              <label className="flex items-center gap-2 text-[12px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChecked(model.fl_Tem_Milk_Run)}
                  onChange={() => toggleCheckbox("fl_Tem_Milk_Run")}
                />
                Acesso ao módulo Milk Run
              </label>

              <label className="flex items-center gap-2 text-[12px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChecked(model.fl_Tem_Intelepost)}
                  onChange={() => toggleCheckbox("fl_Tem_Intelepost")}
                />
                Integração com a Intelpost
              </label>

              <label className="flex items-center gap-2 text-[12px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChecked(model.fl_Tem_ATM)}
                  onChange={() => toggleCheckbox("fl_Tem_ATM")}
                />
                Integração com ATM
              </label>

              <label className="flex items-center gap-2 text-[12px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChecked(model.fl_Email_CTRC_Apenas_Tomador)}
                  onChange={() => toggleCheckbox("fl_Email_CTRC_Apenas_Tomador")}
                />
                Enviar Email Cte Somente para Tomador
              </label>

              <label className="flex items-center gap-2 text-[12px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChecked(model.fl_Envio_Mensagem)}
                  onChange={() => toggleCheckbox("fl_Envio_Mensagem")}
                />
                Enviar Documentos por mensagem Whatsapp
              </label>
            </div>

            {/* Coluna Direita */}
            <div className="space-y-4">
              <div>
                <Label>Número de licença Mobile</Label>
                <Txt
                  name="qt_Licenca_Mobile"
                  value={model.qt_Licenca_Mobile}
                  onChange={(e) =>
                    handleChangeModel("qt_Licenca_Mobile", e.target.value.replace(/\D/g, ""))
                  }
                />
              </div>

              <div>
                <Label>Sequência de Fatura Correntista</Label>
                <Txt
                  name="sq_Fatura_C"
                  value={model.sq_Fatura_C}
                  onChange={(e) => handleChangeModel("sq_Fatura_C", e.target.value)}
                />
              </div>

              <div>
                <Label>Sequência de Fatura Eventual</Label>
                <Txt
                  name="sq_Fatura_E"
                  value={model.sq_Fatura_E}
                  onChange={(e) => handleChangeModel("sq_Fatura_E", e.target.value)}
                />
              </div>

              <div>
                <Label>Numeração de Viagem</Label>
                <Txt
                  name="numeracao_Viagem"
                  value={model.numeracao_Viagem}
                  onChange={(e) => handleChangeModel("numeracao_Viagem", e.target.value)}
                />
              </div>

              <div>
                <Label>Email SAC</Label>
                <Txt
                  name="email_SAC"
                  value={model.email_SAC}
                  onChange={(e) => handleChangeModel("email_SAC", e.target.value)}
                />
              </div>

              <div className="pt-2 space-y-2">
                <label className="flex items-center gap-2 text-[12px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isChecked(model.fl_Numeracao_Viagem_Empresa)}
                    onChange={() => toggleCheckbox("fl_Numeracao_Viagem_Empresa")}
                  />
                  Numeração de Viagem por Empresa
                </label>

                <label className="flex items-center gap-2 text-[12px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isChecked(model.fl_DRE_Padrao)}
                    onChange={() => toggleCheckbox("fl_DRE_Padrao")}
                  />
                  DRE Padrão
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER BOTOES */}
        <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-center gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-[13px] text-red-700 hover:text-black transition"
          >
            <XCircle size={18} /> Fechar
          </button>

          <button 
            onClick={handleSalvarAlteracoes}
            className="flex items-center gap-1 text-[13px] text-gray-700 hover:text-black transition"
          >
            <Edit size={18} /> Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}
