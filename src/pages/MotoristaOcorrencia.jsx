import { useState } from "react";
import { XCircle, RotateCcw, Edit } from "lucide-react";

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

export default function MotoristaGris({ onClose }) {
  const [dados, setDados] = useState({
    fator: "",
    franquia: "",
    limite: "",
    observacao: "",
  });

  const limpar = () =>
    setDados({
      fator: "",
      franquia: "",
      limite: "",
      observacao: "",
    });

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-md shadow-lg w-[520px] p-4 text-[13px]">
        
        <h2 className="text-center text-red-700 font-semibold mb-3">
          MOTORISTA – GRIS
        </h2>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Label className="w-[230px] text-right">% Fator</Label>
            <Txt
              className="w-[120px]"
              value={dados.fator}
              onChange={(e) => setDados({ ...dados, fator: e.target.value })}
            />

            <Label className="w-[80px] text-right">Franquia</Label>
            <Txt
              className="w-[120px]"
              value={dados.franquia}
              onChange={(e) => setDados({ ...dados, franquia: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2">
            <Label className="w-[100px] text-right">Limite</Label>
            <Txt
              className="w-[120px]"
              value={dados.limite}
              onChange={(e) => setDados({ ...dados, limite: e.target.value })}
            />
          </div>

          <div className="flex items-start gap-2">
            <Label className="w-[80px] text-right mt-[5px]">Obs</Label>
            <textarea
              className="flex-1 border border-gray-300 rounded px-2 py-1 h-[80px] text-[13px]"
              value={dados.observacao}
              onChange={(e) =>
                setDados({ ...dados, observacao: e.target.value })
              }
            />
          </div>
        </div>

        {/* Rodapé */}
        <div className="flex justify-end gap-3 mt-4">

          <button
            onClick={onClose}
            className="flex items-center gap-1 text-red-700 border border-red-700 rounded px-3 py-[4px] hover:bg-red-50"
          >
            <XCircle size={14} />
            Fechar
          </button>

          <button
            onClick={() => alert("Função Alterar futuramente")}
            className="flex items-center gap-1 text-red-700 border border-red-700 rounded px-3 py-[4px] hover:bg-red-50"
          >
            <Edit size={14} />
            Alterar
          </button>

          <button
            onClick={limpar}
            className="flex items-center gap-1 text-red-700 border border-red-700 rounded px-3 py-[4px] hover:bg-red-50"
          >
            <RotateCcw size={14} />
            Limpar
          </button>
        </div>
      </div>
    </div>
  );
}
