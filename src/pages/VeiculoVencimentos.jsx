import { useState } from "react";
import { XCircle, Edit, RotateCcw } from "lucide-react";

function Label({ children, className = "" }) {
  return (
    <label className={`text-[12px] text-gray-600 ${className}`}>
      {children}
    </label>
  );
}

function Txt(props) {
  return (
    <input
      {...props}
      className={
        "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] " +
        (props.className || "")
      }
    />
  );
}

export default function VeiculoVencimentos({ onClose }) {
  const [dados, setDados] = useState({
    capacitacao: "",
    teclado: false,
    extintor1: "",
    extintor2: "",
    ruido: "",
    opacidade: "",
    mascara: "",
    ibama: "",
  });

  const limpar = () =>
    setDados({
      capacitacao: "",
      teclado: false,
      extintor1: "",
      extintor2: "",
      ruido: "",
      opacidade: "",
      mascara: "",
      ibama: "",
    });

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-md shadow-lg w-[620px] p-4 text-[13px]">
        <h2 className="text-center text-red-700 font-semibold mb-3">
          VEÍCULO – VENCIMENTOS
        </h2>

        <div className="space-y-3">

          {/* ======================= GRUPO 1 ======================= */}
          <fieldset className="border border-gray-300 rounded p-3">
            <legend className="text-red-700 font-semibold px-2">
              Segurança
            </legend>

            <div className="grid grid-cols-12 gap-3 items-center mt-1">

              <Label className="col-span-3 text-right">Capacitação (IMO)</Label>
              <Txt
                type="date"
                className="col-span-3"
                value={dados.capacitacao}
                onChange={(e) =>
                  setDados({ ...dados, capacitacao: e.target.value })
                }
              />

              <div className="col-span-5 flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={dados.teclado}
                  onChange={(e) =>
                    setDados({ ...dados, teclado: e.target.checked })
                  }
                />
                <Label>Teclado (Rastreador)</Label>
              </div>

              <Label className="col-span-3 text-right">Val. Extintor</Label>
              <Txt
                type="date"
                className="col-span-3"
                value={dados.extintor1}
                onChange={(e) =>
                  setDados({ ...dados, extintor1: e.target.value })
                }
              />

              <Label className="col-span-3 text-right">Extintor 2</Label>
              <Txt
                type="date"
                className="col-span-3"
                value={dados.extintor2}
                onChange={(e) =>
                  setDados({ ...dados, extintor2: e.target.value })
                }
              />
            </div>
          </fieldset>

          {/* ======================= GRUPO 2 ======================= */}
          <fieldset className="border border-gray-300 rounded p-3">
  <legend className="text-red-700 font-semibold px-2">
    Ambiental
  </legend>

  {/* Linha 1 */}
  <div className="grid grid-cols-12 gap-3 items-center mt-1">
    <Label className="col-span-3 text-right">Val. Ruído</Label>
    <Txt
      type="date"
      className="col-span-3"
      value={dados.ruido}
      onChange={(e) => setDados({ ...dados, ruido: e.target.value })}
    />

    <Label className="col-span-3 text-right">Opacidade</Label>
    <Txt
      type="date"
      className="col-span-3"
      value={dados.opacidade}
      onChange={(e) => setDados({ ...dados, opacidade: e.target.value })}
    />
  </div>

  {/* Linha 2 */}
  <div className="grid grid-cols-12 gap-3 items-center mt-2">
    <Label className="col-span-3 text-right">Val. Máscara</Label>
    <Txt
      type="date"
      className="col-span-3"
      value={dados.mascara}
      onChange={(e) => setDados({ ...dados, mascara: e.target.value })}
    />

    <Label className="col-span-3 text-right">Val. Ibama</Label>
    <Txt
      type="date"
      className="col-span-3"
      value={dados.ibama}
      onChange={(e) => setDados({ ...dados, ibama: e.target.value })}
    />
  </div>
</fieldset>

        </div>

        {/* ======================= RODAPÉ ======================= */}
        <div className="flex justify-end gap-3 mt-4">

          {/* Fechar */}
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-red-700 border border-red-700 rounded px-3 py-[4px] text-[12px] hover:bg-red-50"
          >
            <XCircle size={14} />
            Fechar
          </button>

          {/* Alterar */}
          <button
            onClick={() => alert("Função Alterar futuramente")}
            className="flex items-center gap-1 text-red-700 border border-red-700 rounded px-3 py-[4px] text-[12px] hover:bg-red-50"
          >
            <Edit size={14} />
            Alterar
          </button>

          {/* Limpar */}
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
