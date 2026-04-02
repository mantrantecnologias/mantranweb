import React, { useState } from "react";
import { CalendarDays, Clock, CheckCircle, XCircle } from "lucide-react";

export default function ViagemInicio({ isOpen, onClose, onConfirm }) {
  const [dataInicio, setDataInicio] = useState(() => new Date().toISOString().slice(0, 10));
  const [horaInicio, setHoraInicio] = useState(() => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  });
  const [kmInicial, setKmInicial] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg w-[320px] p-4">
        <h2 className="text-center bg-green-700 text-white text-[14px] py-1 rounded-t font-semibold mb-3">
          INÍCIO DA VIAGEM
        </h2>

        {/* === CARD 1 - Dados === */}
        <div className="space-y-3 text-[13px]">
          {/* Linha 1 */}
          <div className="flex items-center gap-2">
            <label className="w-[90px] text-right font-medium ">Data </label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="border border-gray-300 rounded px-2 py-[2px] text-[13px] flex-1"
            />
            <input
              type="time"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              className="border border-gray-300 rounded px-2 py-[2px] text-[13px] w-[100px] text-center"
            />
            
          </div>

          {/* Linha 2 */}
          <div className="flex items-center gap-2">
            <label className="w-[90px] text-right font-medium">KM Inicial</label>
            <input
              type="number"
              value={kmInicial}
              onChange={(e) => setKmInicial(e.target.value)}
              className="border border-gray-300 rounded px-2 py-[2px] text-[13px] flex-1 text-right"
            />
          </div>
        </div>

        {/* === CARD 2 - Botões === */}
        <div className="flex justify-between mt-5">
          <button
            onClick={onClose}
            className="flex items-center gap-1 border border-gray-300 rounded px-4 py-1 text-[13px] hover:bg-gray-100"
          >
            <XCircle size={16} className="text-blue-600" />
            Sair
          </button>
          <button
            onClick={() => {
              if (onConfirm) onConfirm({ dataInicio, horaInicio, kmInicial });
              onClose();
            }}
            className="flex items-center gap-1 border border-gray-300 rounded px-4 py-1 text-[13px] text-green-700 hover:bg-green-50"
          >
            <CheckCircle size={16} />
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
