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

export default function MotoristaApisul({ onClose }) {
  const [dados, setDados] = useState({
    apolice: "",
    vigencia: "",
    categoria: "",
    valor: "",
    observacao: "",
  });

  const limpar = () =>
    setDados({
      apolice: "",
      vigencia: "",
      categoria: "",
      valor: "",
      observacao: "",
    });

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-md shadow-lg w-[550px] p-4 text-[13px]">

        <h2 className="text-center text-red-700 font-semibold mb-3">
          MOTORISTA – APISUL (Seguro)
        </h2>

        <div className="space-y-3">

          <div className="flex items-center gap-3">
            <Label className="w-[170px] text-right">Apólice</Label>
            <Txt
              className="w-[180px]"
              value={dados.apolice}
              onChange={(e) => setDados({ ...dados, apolice: e.target.value })}
            />

            <Label className="w-[80px] text-right">Vigência</Label>
            <Txt
              type="date"
              className="flex-1"
              value={dados.vigencia}
              onChange={(e) => setDados({ ...dados, vigencia: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-3">
  
  {/* Valor */}
  <Label className="w-[100px] text-right ">Valor</Label>
  <Txt
    className="w-[120px]"
    value={dados.valor}
    onChange={(e) => setDados({ ...dados, valor: e.target.value })}
  />
</div>



          <div className="flex items-start gap-3">
            <Label className="w-[80px] text-right mt-[5px]">Observação</Label>
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
            onClick={() => alert("Função alterar futuramente")}
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
