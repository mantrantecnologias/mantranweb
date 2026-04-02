import { useState } from "react";

export default function CustosAdicionaisModal({ onClose }) {
  const [ajudante, setAjudante] = useState(false);
  const [ajudanteValor, setAjudanteValor] = useState("0");

  const [custos, setCustos] = useState({
    escolta: false,
    estacionamento: false,
    imo: false,
    imoAdesivagem: false,
    anvisa: false,
    estadia: false,
    adicionalNoturno: false,
    cargaRefrigerada: false,
    plataforma: false,
    trt: false,
    adicionalDiasNaoUteis: false,
    monitoramento: false,
  });

  const toggleCusto = (key) => {
    setCustos({ ...custos, [key]: !custos[key] });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-[420px] p-4">
        {/* Cabeçalho */}
        <div className="bg-black text-white text-center py-1 font-semibold text-sm rounded-t">
          CUSTOS ADICIONAIS
        </div>

        {/* Conteúdo */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-3 text-[13px]">
          {/* Coluna 1 */}
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={ajudante}
                onChange={(e) => setAjudante(e.target.checked)}
              />
              <label>Ajudante</label>
              {ajudante && (
                <input
                  type="text"
                  value={ajudanteValor}
                  onChange={(e) => setAjudanteValor(e.target.value)}
                  className="border border-gray-300 rounded w-[50px] px-1 py-[2px] text-center"
                />
              )}
            </div>

            <label className="flex items-center gap-2">
              <input type="checkbox" checked={custos.imo} onChange={() => toggleCusto("imo")} />
              IMO
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={custos.imoAdesivagem}
                onChange={() => toggleCusto("imoAdesivagem")}
              />
              IMO Adesivagem
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" checked={custos.estadia} onChange={() => toggleCusto("estadia")} />
              Estadia
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={custos.cargaRefrigerada}
                onChange={() => toggleCusto("cargaRefrigerada")}
              />
              Carga Refrigerada
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" checked={custos.trt} onChange={() => toggleCusto("trt")} />
              TRT
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={custos.monitoramento}
                onChange={() => toggleCusto("monitoramento")}
              />
              Monitoramento
            </label>
          </div>

          {/* Coluna 2 */}
          <div className="flex flex-col space-y-1">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={custos.escolta} onChange={() => toggleCusto("escolta")} />
              Escolta
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={custos.estacionamento}
                onChange={() => toggleCusto("estacionamento")}
              />
              Estacionamento
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" checked={custos.anvisa} onChange={() => toggleCusto("anvisa")} />
              ANVISA
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={custos.adicionalNoturno}
                onChange={() => toggleCusto("adicionalNoturno")}
              />
              Adicional Noturno
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={custos.plataforma}
                onChange={() => toggleCusto("plataforma")}
              />
              Plataforma
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={custos.adicionalDiasNaoUteis}
                onChange={() => toggleCusto("adicionalDiasNaoUteis")}
              />
              Adicional Dias não úteis
            </label>
          </div>
        </div>

        {/* Rodapé */}
        <div className="flex justify-center mt-4">
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 border border-gray-400 rounded px-4 py-1 text-sm flex items-center gap-2"
          >
            <span>🔙</span> Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
