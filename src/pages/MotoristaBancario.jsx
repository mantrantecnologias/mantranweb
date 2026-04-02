import { XCircle, RotateCcw } from "lucide-react";
import { useState } from "react";

function Label({ children }) {
  return <label className="text-[12px] text-gray-700">{children}</label>;
}

function Txt(props) {
  return (
    <input
      {...props}
      className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full ${
        props.className || ""
      }`}
    />
  );
}

export default function MotoristaBancario({ onClose }) {
  const [dados, setDados] = useState({
    banco: "",
    agencia: "",
    conta: "",
    dtEsocial: "",
    cdEsocial: "",
  });

  const limpar = () =>
    setDados({
      banco: "",
      agencia: "",
      conta: "",
      dtEsocial: "",
      cdEsocial: "",
    });

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[999]">
      <div className="bg-white w-[500px] rounded-md shadow-lg border border-gray-300 p-4 text-[13px]">

        {/* TÍTULO */}
        <h2 className="text-center text-red-700 font-semibold mb-3">
          MOTORISTA – DADOS BANCÁRIOS
        </h2>

        {/* CAMPOS */}
        <div className="space-y-3">

          <div>
            <Label>Banco</Label>
            <Txt
              value={dados.banco}
              onChange={(e) => setDados({ ...dados, banco: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Agência</Label>
              <Txt
                value={dados.agencia}
                onChange={(e) =>
                  setDados({ ...dados, agencia: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Conta</Label>
              <Txt
                value={dados.conta}
                onChange={(e) => setDados({ ...dados, conta: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label>Alteração eSocial</Label>
            <Txt
              type="date"
              value={dados.dtEsocial}
              onChange={(e) =>
                setDados({ ...dados, dtEsocial: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Código eSocial</Label>
            <Txt
              value={dados.cdEsocial}
              onChange={(e) =>
                setDados({ ...dados, cdEsocial: e.target.value })
              }
            />
          </div>
        </div>

        {/* RODAPÉ */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-red-700 border border-red-700 rounded px-3 py-[4px] text-[12px] hover:bg-red-50"
          >
            <XCircle size={14} />
            Fechar
          </button>

          <button
            onClick={limpar}
            className="flex items-center gap-1 text-red-700 border border-red-700 rounded px-3 py-[4px] text-[12px] hover:bg-red-50"
          >
            <RotateCcw size={14} />
            Limpar
          </button>
        </div>
      </div>
    </div>
  );
}
