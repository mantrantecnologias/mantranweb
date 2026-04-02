import { useState } from "react";

export default function EncerraColetaModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[750px] rounded shadow-lg border border-gray-300 p-4">
        <h2 className="text-red-700 font-semibold text-[14px] mb-3 border-b pb-1">
          Encerramento da Coleta
        </h2>

        <div className="space-y-3 text-[12px]">
          {/* Linha 1 — Data e Hora Encerramento */}
          <div className="flex items-center gap-3">
            <label className="w-[120px] text-right">Data Encerramento</label>
            <input
              type="date"
              defaultValue="2025-10-24"
              className="border border-gray-300 rounded px-2 h-[24px] w-[130px]"
            />
            <input
              type="time"
              defaultValue="10:00"
              className="border border-gray-300 rounded px-2 h-[24px] w-[80px]"
            />
            <span>Hs</span>

            <div className="flex-1 flex justify-end gap-2">
              <button
                onClick={onClose}
                className="border border-gray-300 bg-gray-50 px-3 rounded text-[12px] hover:bg-gray-100"
              >
                Sair
              </button>
              <button className="border border-gray-300 bg-blue-50 text-blue-700 px-4 rounded text-[12px] hover:bg-blue-100">
                OK
              </button>
            </div>
          </div>

          {/* Linha 2 — Km Fim */}
          <div className="flex items-center gap-3">
            <label className="w-[120px] text-right">Km Fim</label>
            <input
              defaultValue="0"
              className="w-[100px] border border-gray-300 rounded px-2 h-[24px]"
            />
          </div>

          {/* Linha 3 — Informações Complementares */}
          <div className="border-t border-gray-300 pt-2 mt-3">
            <label className="text-[12px] font-semibold text-gray-600 block mb-2">
              Informações Complementares - Encerramento
            </label>

            <div className="flex items-center gap-3 mb-2">
              <label className="w-[120px] text-right">Recebido por</label>
              <input
                className="flex-1 border border-gray-300 rounded px-2 h-[24px]"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="w-[120px] text-right">Nº RG</label>
              <input
                className="w-[250px] border border-gray-300 rounded px-2 h-[24px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
