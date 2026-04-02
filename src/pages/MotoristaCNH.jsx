import { useState } from "react";
import { XCircle, RotateCcw } from "lucide-react";

function Label({ children, className = "" }) {
  return <label className={`text-[12px] text-gray-700 ${className}`}>{children}</label>;
}

function Txt(props) {
  return (
    <input
      {...props}
      className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full ${props.className || ""}`}
    />
  );
}

function Sel({ children, ...rest }) {
  return (
    <select
      {...rest}
      className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] ${rest.className || ""}`}

    >
      {children}
    </select>
  );
}

export default function MotoristaCNH({ onClose }) {
  const [dados, setDados] = useState({
    pamcari: "",
    comissao: "",
    habilitacaoData: "",
    habilitacaoUf: "",
    renach: "",
    espelho: "",
    mopp: "",
  });

  const limpar = () =>
    setDados({
      pamcari: "",
      comissao: "",
      habilitacaoData: "",
      habilitacaoUf: "",
      renach: "",
      espelho: "",
      mopp: "",
    });

  const ufs = [
    "",
    "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MG","MS",
    "MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"
  ];

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[999]">
      <div className="bg-white w-[600px] rounded shadow-lg p-4 text-[13px]">
        
        <h2 className="text-center text-red-700 font-semibold pb-2">
          MOTORISTA – CNH
        </h2>

        <div className="space-y-3">

          {/* ================= PAMCARI + COMISSÃO ================= */}
          <div className="grid grid-cols-12 items-center gap-2">

            <Label className="col-span-2 text-right">Pamcari</Label>
            <Txt
              className="col-span-3"
              value={dados.pamcari}
              onChange={(e) => setDados({ ...dados, pamcari: e.target.value })}
            />

            <Label className="col-span-2 text-right">% Comissão</Label>
            <Txt
              className="col-span-1"
              value={dados.comissao}
              onChange={(e) => setDados({ ...dados, comissao: e.target.value })}
            />
          </div>

          {/* ================= 1ª HABILITAÇÃO ================= */}
          <div className="grid grid-cols-12 items-center gap-2">
            <Label className="col-span-2 text-right">1ª Habilitação</Label>

            <Txt
              type="date"
              className="col-span-4"
              value={dados.habilitacaoData}
              onChange={(e) =>
                setDados({ ...dados, habilitacaoData: e.target.value })
              }
            />

            <Sel
              className="col-span-2"
              value={dados.habilitacaoUf}
              onChange={(e) =>
                setDados({ ...dados, habilitacaoUf: e.target.value })
              }
            >
              {ufs.map((uf) => (
                <option key={uf}>{uf}</option>
              ))}
            </Sel>
          </div>

          {/* ================= RENACH ================= */}
          <div className="grid grid-cols-12 items-center gap-2">
            <Label className="col-span-2 text-right">Nº RENACH</Label>
            <Txt
              className="col-span-6"
              value={dados.renach}
              onChange={(e) => setDados({ ...dados, renach: e.target.value })}
            />
          </div>

          {/* ================= ESPELHO ================= */}
          <div className="grid grid-cols-12 items-center gap-2">
            <Label className="col-span-2 text-right">Nº Espelho</Label>
            <Txt
              className="col-span-6"
              value={dados.espelho}
              onChange={(e) => setDados({ ...dados, espelho: e.target.value })}
            />
          </div>

          {/* ================= MOPP ================= */}
          <div className="grid grid-cols-12 items-center gap-2">
            <Label className="col-span-2 text-right">Val. MOPP</Label>
            <Txt
              type="date"
              className="col-span-4"
              value={dados.mopp}
              onChange={(e) => setDados({ ...dados, mopp: e.target.value })}
            />
          </div>
        </div>

        {/* Rodapé */}
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
