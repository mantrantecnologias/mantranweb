import { XCircle } from "lucide-react";

export default function MotoristaGris({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[999]">
      <div className="bg-white w-[480px] rounded shadow-lg border border-gray-300 p-4 text-[13px]">

        {/* TÍTULO PADRÃO */}
        <h2 className="text-center text-red-700 font-semibold pb-2">
          INFORMAÇÕES GRIS
        </h2>

        {/* CONTEÚDO */}
        <div className="space-y-3">

          <div>
            <label className="text-[12px] text-gray-700">Score</label>
            <input 
              className="w-full border border-gray-300 rounded px-2 h-[26px]" 
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] text-gray-700">% Desconto INSS</label>
              <input 
                type="number"
                className="w-full border border-gray-300 rounded px-2 h-[26px]" 
              />
            </div>

            <div>
              <label className="text-[12px] text-gray-700">% ISS</label>
              <input 
                type="number"
                className="w-full border border-gray-300 rounded px-2 h-[26px]" 
              />
            </div>
          </div>

          <div>
            <label className="text-[12px] text-gray-700">Retém Sest/Senat</label>
            <select className="w-full border border-gray-300 rounded px-2 h-[26px]">
              <option></option>
              <option>Sim</option>
              <option>Não</option>
            </select>
          </div>

          <div>
            <label className="text-[12px] text-gray-700">Aposentadoria Idade</label>
            <select className="w-full border border-gray-300 rounded px-2 h-[26px]">
              <option></option>
              <option>Sim</option>
              <option>Não</option>
            </select>
          </div>

        </div>

        {/* RODAPÉ PADRÃO */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-red-700 border border-red-700 rounded px-3 py-[4px] text-[12px] hover:bg-red-50"
          >
            <XCircle size={14} />
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
}
