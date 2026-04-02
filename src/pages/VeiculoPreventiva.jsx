import { useState } from "react";

/* Helpers */
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

/* Formatadores */
function formatarDataBR(dataISO) {
  if (!dataISO) return "";
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

function formatarDataISO(dataBR) {
  if (!dataBR) return "";
  const [dia, mes, ano] = dataBR.split("/");
  return `${ano}-${mes}-${dia}`;
}

function formatarKM(valor) {
  if (!valor) return "";
  return Number(valor.replace(/\D/g, "")).toLocaleString("pt-BR");
}

function somenteNumeros(v) {
  return v.replace(/\D/g, "");
}

export default function VeiculoPreventiva({ onClose }) {
  const [card1, setCard1] = useState({
    veicCodigo: "0000001",
    veicDescricao: "RENSJ17 - VW 24280 CRM 6X2",
    veicTipo: "FROTA",
    planoCodigo: "",
    planoDescricao: "",
    dataPrev: "",
    kmPrev: "",
  });

  const [grid, setGrid] = useState([
    {
      id: 1,
      placa: "RENSJ17",
      plano: "00001",
      descricao: "TROCA DE ÓLEO",
      manutPrev: "06/08/2025",
      kmPrev: "5.000",
      manutReal: "",
      kmReal: "",
    },
  ]);

  const limparCard1 = () =>
    setCard1({
      veicCodigo: "",
      veicDescricao: "",
      veicTipo: "",
      planoCodigo: "",
      planoDescricao: "",
      dataPrev: "",
      kmPrev: "",
    });

  /* INCLUIR COM FORMATOS CORRETOS */
  const incluir = () => {
    if (!card1.planoCodigo || !card1.dataPrev || !card1.kmPrev) return;

    const dataBR = formatarDataBR(card1.dataPrev);
    const kmFormatado = formatarKM(card1.kmPrev);

    const novo = {
      id: Date.now(),
      placa: card1.veicDescricao.split(" - ")[0] || "",
      plano: card1.planoCodigo,
      descricao: card1.planoDescricao,
      manutPrev: dataBR,
      kmPrev: kmFormatado,
      manutReal: "",
      kmReal: "",
    };

    setGrid((prev) => [...prev, novo]);
  };

  const excluir = (id) => {
    setGrid((prev) => prev.filter((g) => g.id !== id));
  };

  /* CARREGAR PARA O CARD 1 (reconvertendo) */
  const carregarLinha = (linha) => {
    setCard1({
      veicCodigo: "0000001",
      veicDescricao: linha.placa + " - VW 24280 CRM 6X2",
      veicTipo: "FROTA",
      planoCodigo: linha.plano,
      planoDescricao: linha.descricao,
      dataPrev: formatarDataISO(linha.manutPrev),
      kmPrev: somenteNumeros(linha.kmPrev),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-md shadow-lg w-[820px] p-3 text-[13px]">
        <h2 className="text-center text-red-700 font-semibold mb-2">
          VEÍCULO PREVENTIVA
        </h2>

        <div className="flex flex-col gap-2">

          {/* Card 1 */}
          <fieldset className="border border-gray-300 rounded p-2 flex-[0.55]">
            <legend className="text-red-700 font-semibold px-2">
              Dados da Preventiva
            </legend>

            <div className="space-y-2">
              {/* Linha 1 */}
              <div className="flex items-center gap-2">
                <Label className="w-[60px] text-right">Veículo</Label>
                <Txt
                  className="w-[80px] text-center"
                  value={card1.veicCodigo}
                  onChange={(e) =>
                    setCard1({ ...card1, veicCodigo: e.target.value })
                  }
                />
                <Txt
                  className="flex-1"
                  value={card1.veicDescricao}
                  onChange={(e) =>
                    setCard1({ ...card1, veicDescricao: e.target.value })
                  }
                />
                <Txt
                  className="w-[80px] text-center"
                  value={card1.veicTipo}
                  onChange={(e) =>
                    setCard1({ ...card1, veicTipo: e.target.value })
                  }
                />
              </div>

              {/* Linha 2 */}
              <div className="flex items-center gap-2">
                <Label className="w-[60px] text-right">Plano Manut.</Label>
                <Txt
                  className="w-[80px]"
                  value={card1.planoCodigo}
                  onChange={(e) =>
                    setCard1({ ...card1, planoCodigo: e.target.value })
                  }
                />
                <Txt
                  className="flex-1"
                  value={card1.planoDescricao}
                  onChange={(e) =>
                    setCard1({ ...card1, planoDescricao: e.target.value })
                  }
                />
              </div>

              {/* Linha 3 */}
              <div className="flex items-center gap-2">
                <Label className="w-[60px] text-right">Data Prev.</Label>
                <Txt
                  type="date"
                  className="w-[150px]"
                  value={card1.dataPrev}
                  onChange={(e) =>
                    setCard1({ ...card1, dataPrev: e.target.value })
                  }
                />

                <Label className="w-[80px] text-right">KM Prev.</Label>
                <Txt
                  className="w-[120px] text-right"
                  value={formatarKM(card1.kmPrev)}
                  onChange={(e) =>
                    setCard1({ ...card1, kmPrev: somenteNumeros(e.target.value) })
                  }
                />
              </div>
            </div>
          </fieldset>

          {/* Card 2 */}
          <fieldset className="border border-gray-300 rounded p-2 flex-1">
            <legend className="text-red-700 font-semibold px-2">
              Manutenções
            </legend>

            <div className="overflow-auto max-h-[260px]">
              <table className="min-w-full border text-[12px]">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    {[
                      "Placa",
                      "Plano",
                      "Descrição Plano",
                      "Manutenção Prev.",
                      "KM Previsto",
                      "Manutenção Realizada",
                      "KM Realizado",
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
                      <td className="border px-2 py-1">{linha.placa}</td>
                      <td className="border px-2 py-1">{linha.plano}</td>
                      <td className="border px-2 py-1">{linha.descricao}</td>
                      <td className="border px-2 py-1">{linha.manutPrev}</td>
                      <td className="border px-2 py-1">{linha.kmPrev}</td>
                      <td className="border px-2 py-1">{linha.manutReal}</td>
                      <td className="border px-2 py-1">{linha.kmReal}</td>
                    </tr>
                  ))}

                  {grid.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="border px-2 py-2 text-center text-gray-500"
                      >
                        Nenhuma manutenção cadastrada.
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
              className="border border-gray-300 rounded px-3 py-[4px] text-[12px] hover:bg-gray-100"
            >
              Fechar
            </button>
            <button
              onClick={limparCard1}
              className="border border-gray-300 rounded px-3 py-[4px] text-[12px] hover:bg-gray-100"
            >
              Limpar
            </button>
            <button
              onClick={incluir}
              className="border border-gray-300 rounded px-3 py-[4px] text-[12px] hover:bg-gray-100"
            >
              Incluir
            </button>
            <button
              onClick={() => {
                if (grid.length > 0) excluir(grid[grid.length - 1].id);
              }}
              className="border border-gray-300 rounded px-3 py-[4px] text-[12px] hover:bg-gray-100"
            >
              Excluir
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
