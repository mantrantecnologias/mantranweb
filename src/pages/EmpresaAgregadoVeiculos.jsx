import { XCircle, PlusCircle, Truck } from "lucide-react";

export default function EmpresaAgregadoVeiculos({ onClose, onCadastroVeiculo }) {
  const veiculosMock = [
    {
      frota: "0034813",
      placa: "HJS3B31",
      modelo: "CARRETA SIDER",
      classe: "19",
    },
    {
      frota: "0035662",
      placa: "NYQ0H81",
      modelo: "CAVALO MEC",
      classe: "13",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[850px] rounded shadow-lg p-4">

        {/* TÍTULO */}
        <h2 className="text-center text-red-700 font-semibold text-sm border-b pb-1 mb-2">
          VEÍCULOS DO AGREGADO
        </h2>

        {/* ===================== CARD 1: GRID ===================== */}
        <fieldset className="border border-gray-300 rounded p-3 mb-4">
          <legend className="px-2 text-red-700 font-semibold">Veículos</legend>

          <div className="border border-gray-300 rounded bg-white max-h-[320px] overflow-auto">
            <table className="min-w-full text-[12px] border-collapse">
              <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
                <tr>
                  <th className="border px-2 py-1 text-left whitespace-nowrap">Nº Frota</th>
                  <th className="border px-2 py-1 text-left whitespace-nowrap">Placa</th>
                  <th className="border px-2 py-1 text-left whitespace-nowrap">Descrição/Modelo</th>
                  <th className="border px-2 py-1 text-left whitespace-nowrap">Classe</th>
                </tr>
              </thead>

              <tbody>
                {veiculosMock.map((v, i) => (
                  <tr
                    key={i}
                    className={`${
                      i % 2 === 0 ? "bg-orange-50" : "bg-white"
                    } hover:bg-gray-200 cursor-pointer`}
                  >
                    <td className="border px-2 py-1 whitespace-nowrap">{v.frota}</td>
                    <td className="border px-2 py-1 whitespace-nowrap">{v.placa}</td>
                    <td className="border px-2 py-1 whitespace-nowrap">{v.modelo}</td>
                    <td className="border px-2 py-1 whitespace-nowrap">{v.classe}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </fieldset>

        {/* ===================== CARD 2: BOTÕES ===================== */}
        <div className="flex justify-between mt-3">

          {/* BOTÃO VOLTAR */}
          <button
            onClick={onClose}
            className="border border-gray-700 px-3 py-[4px] rounded flex items-center gap-1 text-[13px] hover:bg-gray-100 text-red-700"
          >
            <XCircle size={15} /> Fechar
          </button>

          {/* BOTÃO CADASTRO VEÍCULO */}
          <button
            onClick={onCadastroVeiculo}
            className="border border-gray-700 px-3 py-[4px] rounded flex items-center gap-1 text-[13px] hover:bg-gray-100 text-red-700"
          >
            <Truck size={15} /> Cadastro Veículo
          </button>

        </div>
      </div>
    </div>
  );
}
