import { useState } from "react";

function Label({ children, className = "" }) {
  return <label className={`text-[12px] text-gray-700 ${className}`}>{children}</label>;
}
function Txt(props) {
  return (
    <input {...props}
      className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full`} />
  );
}

export default function MotoristaFiscal({ onClose }) {
  const [dados, setDados] = useState({
    inss: "",
    iss: "",
    sest: false,
    senat: false,
    dtEsocial: "",
    codEsocial: "",
    score: "",
    contaContabil: "",
    contaReduzida: "",
  });

  const limpar = () =>
    setDados({
      inss: "",
      iss: "",
      sest: false,
      senat: false,
      dtEsocial: "",
      codEsocial: "",
      score: "",
      contaContabil: "",
      contaReduzida: "",
    });

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-md shadow-lg w-[600px] p-4 text-[13px]">
        <h2 className="text-center text-red-700 font-semibold mb-3">
          MOTORISTA – FISCAL / IMPOSTOS
        </h2>

        <div className="space-y-3">

          <div className="flex gap-3">
            <div className="flex-1">
              <Label>% Desconto INSS</Label>
              <Txt
                value={dados.inss}
                onChange={(e) => setDados({ ...dados, inss: e.target.value })}
              />
            </div>
            <div className="flex-1">
              <Label>% ISS</Label>
              <Txt
                value={dados.iss}
                onChange={(e) => setDados({ ...dados, iss: e.target.value })}
              />
            </div>
            <div className="flex-1">
              <Label>Score</Label>
              <Txt
                value={dados.score}
                onChange={(e) => setDados({ ...dados, score: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-6 items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={dados.sest}
                onChange={(e) => setDados({ ...dados, sest: e.target.checked })}
              />
              Retém Sest
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={dados.senat}
                onChange={(e) => setDados({ ...dados, senat: e.target.checked })}
              />
              Retém Senat
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
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
                value={dados.codEsocial}
                onChange={(e) =>
                  setDados({ ...dados, codEsocial: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <Label>Conta Contábil</Label>
            <Txt
              value={dados.contaContabil}
              onChange={(e) =>
                setDados({ ...dados, contaContabil: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Conta Reduzida</Label>
            <Txt
              value={dados.contaReduzida}
              onChange={(e) =>
                setDados({ ...dados, contaReduzida: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="border border-gray-300 rounded px-3 py-[4px] text-[12px] hover:bg-gray-100">
            Fechar
          </button>
          <button onClick={limpar} className="border border-gray-300 rounded px-3 py-[4px] text-[12px] hover:bg-gray-100">
            Limpar
          </button>
        </div>
      </div>
    </div>
  );
}
