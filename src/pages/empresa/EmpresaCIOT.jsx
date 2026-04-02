import { useState, useEffect } from "react";
import { XCircle, RotateCcw, Edit } from "lucide-react";
import { CiotService } from "../../services/CiotService";
import CiotOperadoraModel from "../../models/ciot/CiotOperadoraModel";
import { errorMessage, successMessage, infoMessage } from "../../components/Mensagem";

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

export default function EmpresaCIOT({ onClose }) {
  const [operadoras, setOperadoras] = useState([]);
  const [model, setModel] = useState(new CiotOperadoraModel());

  useEffect(() => {
    carregarOperadoras();
  }, []);

  const carregarOperadoras = async () => {
    try {
      const resp = await CiotService.BuscarListaOperadoras();
      if (resp?.sucesso && resp?.data) {
        const listaModelada = resp.data.map(op => new CiotOperadoraModel(op));
        setOperadoras(listaModelada);
        if (listaModelada.length > 0) {
          const cod = listaModelada[0].cd_Operadora;
          buscarDetalhesOperadora(cod);
        }
      } else {
        errorMessage(resp?.erros || "Erro ao carregar operadoras.");
      }
    } catch {
      errorMessage("Falha de comunicação.");
    }
  };

  const buscarDetalhesOperadora = async (cd_operadora) => {
    try {
      const reqModel = new CiotOperadoraModel({ cd_Operadora: cd_operadora });
      const resp = await CiotService.BuscarOperadora(reqModel);
      if (resp?.sucesso && resp?.data) {
        setModel(new CiotOperadoraModel(resp.data));
      } else {
        errorMessage(resp?.erros || "Erro ao carregar detalhes da operadora.");
        // Mantém apenas o código no model
        setModel(prev => ({ ...new CiotOperadoraModel(), cd_Operadora: cd_operadora }));
      }
    } catch {
      errorMessage("Falha de comunicação ao buscar detalhes.");
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

  const handleOperadoraChange = (e) => {
    const cod = e.target.value;
    buscarDetalhesOperadora(cod);
  };

  const handleLimpar = () => {
    setModel(new CiotOperadoraModel({ cd_Operadora: operadoras[0]?.cd_Operadora }));
  };

  const handleAlterar = async () => {
    try {
      if (!model.cd_Operadora) {
        return infoMessage("Selecione uma operadora primeiro.");
      }

      const resp = await CiotService.AlterarOperadora(model);
      if (resp?.sucesso) {
        successMessage(resp.data || "Operadora alterada com sucesso!");
        onClose(); // opcional: fechar o modal após salvar
      } else {
        try {
          const erro = typeof resp?.erros === "string" ? JSON.parse(resp.erros) : resp?.erros;
          if (erro?.errorCode === "VALIDATION_ERROR") {
            infoMessage(erro.message);
          } else {
            errorMessage(erro?.message || "Erro ao alterar operadora.");
          }
        } catch {
          errorMessage(resp?.erros || "Erro ao alterar operadora.");
        }
      }
    } catch {
      errorMessage("Falha de comunicação.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-[550px] rounded shadow-lg border border-gray-300 p-4">

        {/* ===== Título ===== */}
        <h2 className="text-center text-red-700 font-semibold text-[15px] mb-3 border-b pb-1">
          PARÂMETROS OPERADORAS DE FRETE
        </h2>

        {/* ===== Grid principal ===== */}
        <div className="grid grid-cols-2 gap-3">

          <div className="col-span-2">
            <Label>Operadora</Label>
            <select
              value={model.cd_Operadora}
              onChange={handleOperadoraChange}
              className="border border-gray-300 rounded h-[26px] px-1 text-[13px] w-full"
            >
              <option value="">Selecione a Operadora...</option>
              {operadoras.map((op, i) => {
                const cod = op.cd_Operadora;
                const nome = op.nome;
                return (
                  <option key={i} value={cod}>
                    {cod} - {nome}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <Label>Usuário</Label>
            <Txt
              value={model.nome_Usuario}
              onChange={(e) => handleChangeModel("nome_Usuario", e.target.value)}
            />
          </div>

          <div>
            <Label>Senha</Label>
            <Txt
              type="password"
              value={model.senha}
              onChange={(e) => handleChangeModel("senha", e.target.value)}
            />
          </div>

          <div>
            <Label>Último Nº Rota</Label>
            <Txt
              value={model.nr_Ultima_Rota}
              onChange={(e) => handleChangeModel("nr_Ultima_Rota", e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 mt-5">
            <input
              type="checkbox"
              checked={isChecked(model.fl_Operadora_Utilizada)}
              onChange={() => toggleCheckbox("fl_Operadora_Utilizada")}
            />
            <Label className="m-0 cursor-pointer">Operadora Utilizada</Label>
          </div>

          <div className="flex items-center gap-2 mt-5">
            <input
              type="checkbox"
              checked={isChecked(model.fl_Gerar_Contas_Pagar)}
              onChange={() => toggleCheckbox("fl_Gerar_Contas_Pagar")}
            />
            <Label className="m-0 cursor-pointer">Gerar Contas a Pagar</Label>
          </div>

          <div>
            <Label>Versão</Label>
            <Txt
              value={model.versao}
              onChange={(e) => handleChangeModel("versao", e.target.value)}
            />
          </div>

          <div>
            <Label>Ambiente</Label>
            <select
              value={model.ambiente}
              onChange={(e) => handleChangeModel("ambiente", e.target.value)}
              className="border border-gray-300 rounded h-[26px] px-1 text-[13px] w-full"
            >
              <option value="H">H - Homologação</option>
              <option value="P">P - Produção</option>
            </select>
          </div>
        </div>

        {/* ===== Botões ===== */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-red-700 hover:text-black"
          >
            <XCircle size={18} /> Fechar
          </button>

          <button
            onClick={handleLimpar}
            className="flex items-center gap-1 text-gray-700 hover:text-black"
          >
            <RotateCcw size={18} /> Limpar
          </button>

          <button
            onClick={handleAlterar}
            className="flex items-center gap-1 text-gray-700 hover:text-black"
          >
            <Edit size={18} /> Alterar
          </button>
        </div>
      </div>
    </div>
  );
}
