import { useState } from "react";
import {
  XCircle,
  RotateCcw,
  PlusCircle,
  Pencil,
  Trash2,
} from "lucide-react";

function Label({ children, className = "" }) {
  return (
    <label className={`text-[12px] text-gray-600 ${className}`}>{children}</label>
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

function Sel({ children, className = "", ...rest }) {
  return (
    <select
      {...rest}
      className={
        "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] " +
        className
      }
    >
      {children}
    </select>
  );
}

/* ========= Helpers para tratamento de data ========= */
const toBr = (v) => {
  if (!v) return "";
  const [y, m, d] = v.split("-");
  return `${d}/${m}/${y}`;
};

const toIso = (v) => {
  if (!v) return "";
  const [d, m, y] = v.split("/");
  return `${y}-${m}-${d}`;
};

export default function VeiculoGris({ onClose }) {
  const [card1, setCard1] = useState({
    seguradoraCod: "001",
    seguradoraDesc: "SOMPO SEGUROS",
    tpGris: "RASTREAMENTO",
    numeroDocto: "",
    validade: "",
  });

  const [grid, setGrid] = useState([
    {
      id: 1,
      corretora: "001",
      nomeCorretora: "SOMPO SEGUROS",
      numeroDocto: "543543",
      validade: "16/11/2025",
      tpGris: "RASTREAMENTO",
    },
  ]);

  const limpar = () =>
    setCard1({
      seguradoraCod: "",
      seguradoraDesc: "",
      tpGris: "RASTREAMENTO",
      numeroDocto: "",
      validade: "",
    });

  const incluir = () => {
    if (!card1.seguradoraCod || !card1.numeroDocto || !card1.validade) return;

    const novo = {
      id: Date.now(),
      corretora: card1.seguradoraCod,
      nomeCorretora: card1.seguradoraDesc,
      numeroDocto: card1.numeroDocto,
      validade: toBr(card1.validade),
      tpGris: card1.tpGris,
    };

    setGrid((prev) => [...prev, novo]);
  };

  const alterar = () => {
    setGrid((prev) =>
      prev.map((g) =>
        g.numeroDocto === card1.numeroDocto
          ? {
              ...g,
              corretora: card1.seguradoraCod,
              nomeCorretora: card1.seguradoraDesc,
              validade: toBr(card1.validade),
              tpGris: card1.tpGris,
            }
          : g
      )
    );
  };

  const excluir = () => {
    setGrid((prev) =>
      prev.filter((g) => g.numeroDocto !== card1.numeroDocto)
    );
  };

  const carregarLinha = (linha) => {
    setCard1({
      seguradoraCod: linha.corretora,
      seguradoraDesc: linha.nomeCorretora,
      tpGris: linha.tpGris,
      numeroDocto: linha.numeroDocto,
      validade: toIso(linha.validade),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-md shadow-lg w-[720px] p-3 text-[13px]">
        <h2 className="text-center text-red-700 font-semibold mb-2">
          VEÍCULO – GERENCIAMENTO DE RISCO (GRIS)
        </h2>

        <div className="flex flex-col gap-2">

          {/* Card 1 */}
          <fieldset className="border border-gray-300 rounded p-2">
            <legend className="text-red-700 font-semibold px-2">
              Cadastro de GRIS
            </legend>

            <div className="space-y-2">

              {/* Linha 1 */}
              <div className="flex items-center gap-2">
                <Label className="w-[80px] text-right">Seguradora</Label>
                <Txt
                  className="w-[80px]"
                  value={card1.seguradoraCod}
                  onChange={(e) =>
                    setCard1({ ...card1, seguradoraCod: e.target.value })
                  }
                />
                <Txt
                  className="flex-1"
                  value={card1.seguradoraDesc}
                  onChange={(e) =>
                    setCard1({ ...card1, seguradoraDesc: e.target.value })
                  }
                />
              </div>

              {/* Linha 2 */}
              <div className="flex items-center gap-2">
                <Label className="w-[80px] text-right">Tp. GRIS</Label>
                <Sel
                  className="flex-1"
                  value={card1.tpGris}
                  onChange={(e) =>
                    setCard1({ ...card1, tpGris: e.target.value })
                  }
                >
                  <option value="RASTREAMENTO">RASTREAMENTO</option>
                  <option value="MONITORAMENTO">MONITORAMENTO</option>
                </Sel>
              </div>

              {/* Linha 3 */}
              <div className="flex items-center gap-2">
                <Label className="w-[80px] text-right">Nº Docto</Label>
                <Txt
                  className="w-[120px]"
                  value={card1.numeroDocto}
                  onChange={(e) =>
                    setCard1({ ...card1, numeroDocto: e.target.value })
                  }
                />

                <Label className="w-[70px] text-right">Validade</Label>
                <Txt
                  type="date"
                  className="w-[150px]"
                  value={card1.validade}
                  onChange={(e) =>
                    setCard1({ ...card1, validade: e.target.value })
                  }
                />
              </div>

            </div>
          </fieldset>

          {/* Card 2 – Grid */}
          <fieldset className="border border-gray-300 rounded p-2">
            <legend className="text-red-700 font-semibold px-2">
              GRIS Cadastrado
            </legend>

            <div className="overflow-auto max-h-[260px]">
              <table className="min-w-full border text-[12px]">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    {[
                      "Corretora",
                      "Nome da Corretora",
                      "Nº Documento",
                      "Validade",
                      "Tp. GRIS",
                    ].map((h) => (
                      <th key={h} className="border px-2 py-1 text-left">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {grid.map((linha) => (
                    <tr
                      key={linha.id}
                      className="hover:bg-blue-50 cursor-pointer"
                      onClick={() => carregarLinha(linha)}
                    >
                      <td className="border px-2 py-1">{linha.corretora}</td>
                      <td className="border px-2 py-1">{linha.nomeCorretora}</td>
                      <td className="border px-2 py-1">{linha.numeroDocto}</td>
                      <td className="border px-2 py-1">{linha.validade}</td>
                      <td className="border px-2 py-1">{linha.tpGris}</td>
                    </tr>
                  ))}

                  {grid.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="border px-2 py-2 text-center text-gray-500"
                      >
                        Nenhum registro.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </fieldset>
        </div>

        {/* Rodapé */}
        <div className="flex justify-between items-center mt-3">

          <div className="flex gap-2">

            <button
              onClick={onClose}
              className="flex items-center gap-1 border border-red-700 text-red-700 px-3 py-[4px] text-[12px] rounded hover:bg-red-50"
            >
              <XCircle size={16} /> Fechar
            </button>

            <button
              onClick={limpar}
              className="flex items-center gap-1 border border-red-700 text-red-700 px-3 py-[4px] text-[12px] rounded hover:bg-red-50"
            >
              <RotateCcw size={16} /> Limpar
            </button>

            <button
              onClick={incluir}
              className="flex items-center gap-1 border border-red-700 text-red-700 px-3 py-[4px] text-[12px] rounded hover:bg-red-50"
            >
              <PlusCircle size={16} /> Incluir
            </button>

            <button
              onClick={alterar}
              className="flex items-center gap-1 border border-red-700 text-red-700 px-3 py-[4px] text-[12px] rounded hover:bg-red-50"
            >
              <Pencil size={16} /> Alterar
            </button>

            <button
              onClick={excluir}
              className="flex items-center gap-1 border border-red-700 text-red-700 px-3 py-[4px] text-[12px] rounded hover:bg-red-50"
            >
              <Trash2 size={16} /> Excluir
            </button>

          </div>

          <div className="text-[12px] text-gray-700">
            Total Registros: <span className="font-semibold">{grid.length}</span>
          </div>

        </div>
      </div>
    </div>
  );
}
