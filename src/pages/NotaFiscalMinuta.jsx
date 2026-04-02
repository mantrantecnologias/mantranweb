import { XCircle } from "lucide-react";

export default function NotaFiscalMinuta({ isOpen, onClose }) {

  // 🔑 ESTA LINHA É A CORREÇÃO
  if (!isOpen) return null;
  const notas = [
    {
      numero: "00028548",
      serie: "001",
      vols: "1",
      dtEmissao: "10/10/2025 00:00",
      pesoNF: "0,555",
      valorNF: "69,90",
      volM3: "0,000",
      descricaoVol: "CAIXA",
      tipoNF: "N",
      situacaoNF: "Normal",
      condContrato: "",
      qtPalets: "0",
      pesoInformado: "0,555",
      tpEntrega: "Entrega Normal",
      divisao: "1054 - Leo Campinas",
      chaveNF: "35251004086140014157001000058801393009188",
      procDI: "",
      numDI: "",
      blHouse: "",
      invoice: "",
      referencia: "",
      ceva: "",
      serieCeva: "",
      romaneio: "",
    },
    {
      numero: "00028549",
      serie: "001",
      vols: "2",
      dtEmissao: "12/10/2025 00:00",
      pesoNF: "1,250",
      valorNF: "159,80",
      volM3: "0,000",
      descricaoVol: "PALLET",
      tipoNF: "N",
      situacaoNF: "Normal",
      condContrato: "",
      qtPalets: "1",
      pesoInformado: "1,250",
      tpEntrega: "Entrega Normal",
      divisao: "1054 - Leo Campinas",
      chaveNF: "35251004086140014157001000058801393009189",
      procDI: "",
      numDI: "",
      blHouse: "",
      invoice: "",
      referencia: "",
      ceva: "",
      serieCeva: "",
      romaneio: "",
    },
  ];

  // === Cálculos ===
  const totalRegistros = notas.length;
  const totalMercadoria = notas.reduce(
    (acc, n) => acc + parseFloat((n.valorNF || "0").replace(",", ".")),
    0
  );
  const totalPeso = notas.reduce(
    (acc, n) => acc + parseFloat((n.pesoNF || "0").replace(",", ".")),
    0
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[1200px] max-h-[85vh] overflow-hidden rounded shadow-2xl border border-gray-300 p-4">

        <h2 className="text-center text-red-700 font-semibold text-[15px] border-b pb-1 mb-3">
          NOTAS FISCAIS DA MINUTA
        </h2>

        {/* GRID */}
        <div className="border border-gray-300 rounded overflow-auto max-h-[60vh]">
          <table className="min-w-max w-full text-[12px] border-collapse">
            <thead className="bg-gray-100 text-gray-700 border-b border-gray-300">
              <tr className="whitespace-nowrap">
                {[
                  "Nº Nota",
                  "Série",
                  "Vols",
                  "DT Emissão",
                  "Peso NF",
                  "Valor NF",
                  "Vol M³",
                  "Descrição Vol",
                  "Tipo NF",
                  "Situação NF",
                  "Cond. Contrato",
                  "Qt Palets",
                  "Peso Informado",
                  "TP Entrega",
                  "Divisão",
                  "Chave NF",
                  "Nº Proc DI",
                  "Nº DI / DA",
                  "BL / House",
                  "Nº Invoice",
                  "Nº Referência",
                  "Nº Ceva",
                  "Nº Série Ceva",
                  "Nº Romaneio",
                ].map((col) => (
                  <th
                    key={col}
                    className="px-2 py-[6px] text-left border-r border-gray-200 font-semibold whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {notas.map((nf, i) => (
                <tr
                  key={i}
                  className={`hover:bg-gray-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                >
                  {Object.values(nf).map((v, j) => (
                    <td
                      key={j}
                      className="px-2 py-[8px] border-t border-gray-200 text-gray-800 whitespace-nowrap h-[36px]"
                    >
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Rodapé */}
        <div className="flex justify-between items-center mt-4 border-t pt-2 text-[13px] text-gray-700">
          <div className="flex gap-6 pl-2">
            <span>
              <strong>Total Registros:</strong> {totalRegistros}
            </span>
            <span>
              <strong>Total Mercadoria:</strong>{" "}
              {totalMercadoria.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span>
              <strong>Total Peso:</strong>{" "}
              {totalPeso.toLocaleString("pt-BR", {
                minimumFractionDigits: 3,
                maximumFractionDigits: 3,
              })}
            </span>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1 border border-gray-300 rounded px-3 py-[4px] hover:bg-gray-100 text-red-700 text-[13px]"
          >
            <XCircle size={16} /> Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
