import { XCircle } from "lucide-react";

export default function MotoristaTrabalhista({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[999]">
      <div className="bg-white w-[520px] rounded shadow-lg p-4 border border-gray-300 text-[13px]">

        {/* Título padrão */}
        <h2 className="text-center text-red-700 font-semibold pb-2">
          INFORMAÇÕES TRABALHISTAS
        </h2>

        <div className="space-y-3">

          <div>
            <label className="text-[12px] text-gray-700">Nº CTPS</label>
            <input className="w-full border border-gray-300 rounded px-2 h-[26px]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] text-gray-700">Série</label>
              <input className="w-full border border-gray-300 rounded px-2 h-[26px]" />
            </div>

            <div>
              <label className="text-[12px] text-gray-700">UF</label>
              <select className="w-full border border-gray-300 rounded px-2 h-[26px]">
                <option></option>
                {[
                  "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG",
                  "MS","MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR",
                  "RS","SC","SE","SP","TO"
                ].map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[12px] text-gray-700">Data Emissão</label>
            <input type="date" className="w-full border border-gray-300 rounded px-2 h-[26px]" />
          </div>

          <div>
            <label className="text-[12px] text-gray-700">Matrícula</label>
            <input className="w-full border border-gray-300 rounded px-2 h-[26px]" />
          </div>

          <div>
            <label className="text-[12px] text-gray-700">Código Cargo</label>
            <input className="w-full border border-gray-300 rounded px-2 h-[26px]" />
          </div>

        </div>

        {/* Rodapé padrão */}
        <div className="flex justify-end mt-4">
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
