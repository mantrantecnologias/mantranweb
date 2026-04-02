import { XCircle, UserPlus, FileText } from "lucide-react";

export default function EmpresaAgregadoMotorista({
  onClose,
  onCadastroMotorista,
  onContratoCooperativa,
}) {
  const motoristasMock = [
    {
      cnh: "05114112511",
      nome: "MICHEL DE JESUS RODRIGUES",
      cidade: "POJUCA",
      uf: "BA",
      situacao: "Ativo",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[850px] rounded shadow-lg p-4">

        {/* TÍTULO */}
        <h2 className="text-center text-red-700 font-semibold text-sm border-b pb-1 mb-2">
          MOTORISTAS DO AGREGADO
        </h2>

        {/* ===================== CARD 1 — GRID ===================== */}
        <fieldset className="border border-gray-300 rounded p-3 mb-4">
          <legend className="px-2 text-red-700 font-semibold">
            Motoristas
          </legend>

          <div className="border border-gray-300 rounded bg-white max-h-[320px] overflow-auto">
            <table className="min-w-full text-[12px] border-collapse">
              <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
                <tr>
                  <th className="border px-2 py-1 text-left whitespace-nowrap">CNH</th>
                  <th className="border px-2 py-1 text-left whitespace-nowrap">Nome</th>
                  <th className="border px-2 py-1 text-left whitespace-nowrap">Cidade</th>
                  <th className="border px-2 py-1 text-left whitespace-nowrap">UF</th>
                  <th className="border px-2 py-1 text-left whitespace-nowrap">Situação</th>
                </tr>
              </thead>

              <tbody>
                {motoristasMock.map((m, i) => (
                  <tr
                    key={i}
                    className={`${
                      i % 2 === 0 ? "bg-orange-50" : "bg-white"
                    } hover:bg-gray-200 cursor-pointer`}
                  >
                    <td className="border px-2 py-1 whitespace-nowrap">{m.cnh}</td>
                    <td className="border px-2 py-1 whitespace-nowrap">{m.nome}</td>
                    <td className="border px-2 py-1 whitespace-nowrap">{m.cidade}</td>
                    <td className="border px-2 py-1 whitespace-nowrap">{m.uf}</td>
                    <td className="border px-2 py-1 whitespace-nowrap">{m.situacao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </fieldset>

        {/* ===================== CARD 2 — BOTÕES ===================== */}
        <div className="flex justify-between mt-3">

          {/* BOTÃO VOLTAR */}
          <button
            onClick={onClose}
            className="border border-gray-700 px-3 py-[4px] rounded flex items-center gap-1 text-[13px] hover:bg-gray-100 text-red-700"
          >
            <XCircle size={15} /> Fechar
          </button>

          <div className="flex gap-3">

            {/* CADASTRO MOTORISTA */}
            <button
              onClick={onCadastroMotorista}
              className="border border-gray-700 px-3 py-[4px] rounded flex items-center gap-1 text-[13px] hover:bg-gray-100 text-red-700"
            >
              <UserPlus size={15} /> Cadastro Motorista
            </button>

            {/* CONTRATO COOPERATIVA */}
            <button
              onClick={onContratoCooperativa}
              className="border border-gray-700 px-3 py-[4px] rounded flex items-center gap-1 text-[13px] hover:bg-gray-100 text-red-700"
            >
              <FileText size={15} /> Contrato Cooperativa
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}
