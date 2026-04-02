import { useState } from "react";
import {
  X,
  PlusCircle,
  FileText,
  RotateCcw,
  CheckCircle,
} from "lucide-react";

export default function ViagemDespesa({ isOpen, onClose }) {
  const [titulos, setTitulos] = useState([]);
  const [dados, setDados] = useState({
    credito: "16464947000193",
    motorista: "ALAN DA COSTA",
    titulo: "079032122350",
    parcela: 1,
    qtdParcelas: 1,
    desconto: 0,
    valor: 300.0,
    categoria: "100",
    categoriaDesc: "DESPESAS COM FRETE COMPRA",
    subcategoria: "2",
    conta: "00000001",
    banco: "999",
    agencia: "0000-0",
    centroCusto: "MANTRAN",
    saldo: 300.0,
  });

  if (!isOpen) return null;

  const handleGerarCP = () => {
    setTitulos((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        ...dados,
        data: new Date().toLocaleDateString("pt-BR"),
      },
    ]);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-[900px] rounded shadow-lg border border-gray-300 p-4 max-h-[95vh] overflow-y-auto">
        <h2 className="text-red-700 font-semibold text-[16px] mb-3 border-b pb-1">
          Despesas de Viagem - Pagamento
        </h2>

        {/* === CARD 1 - Dados para Pagamento === */}
        <fieldset className="border border-gray-300 rounded p-3 bg-white mb-3">
          <legend className="text-red-700 font-semibold px-2">
            Dados para Contas a Pagar
          </legend>

          <div className="space-y-2">
            {/* Linha 1 */}
            <div className="flex items-center gap-2">
              <label className="w-[80px] text-right">A Crédito de</label>
              <input
                className="border border-gray-300 rounded px-2 py-[2px] w-[160px]"
                value={dados.credito}
                readOnly
              />
              <input
                className="border border-gray-300 rounded px-2 py-[2px] flex-1"
                value="BEVANI TRANSPORTES LTDA"
                readOnly
              />
              <label className="w-[110px] text-right">Saldo Pendente</label>
              <input
                className="border border-gray-300 rounded px-2 py-[2px] w-[100px] text-right"
                value={dados.saldo.toFixed(2)}
                readOnly
              />
            </div>

            {/* Linha 2 */}
            <div className="flex items-center gap-2">
              <label className="w-[80px] text-right">Motorista</label>
              <input
                className="border border-gray-300 rounded px-2 py-[2px] flex-1"
                value={dados.motorista}
                readOnly
              />
              <label className="w-[100px] text-right">Valor a Pagar</label>
              <input
                className="border border-gray-300 rounded px-2 py-[2px] w-[100px] text-right"
                value={dados.valor.toFixed(2)}
                readOnly
              />
            </div>

            {/* Linha 3 */}
            <div className="flex items-center gap-2">
              <label className="w-[80px] text-right">Nº Título</label>
              <input
                className="border border-gray-300 rounded px-2 py-[2px] w-[140px]"
                value={dados.titulo}
                readOnly
              />
              <label>Nº Parcela</label>
              <input
                type="number"
                className="border border-gray-300 rounded px-2 py-[2px] w-[60px]"
                value={dados.parcela}
                readOnly
              />
              <label>Qtde. Parcela</label>
              <input
                type="number"
                className="border border-gray-300 rounded px-2 py-[2px] w-[60px]"
                value={dados.qtdParcelas}
                readOnly
              />
              <label>Descontos</label>
              <input
                type="number"
                className="border border-gray-300 rounded px-2 py-[2px] w-[80px] text-right"
                value={dados.desconto}
                readOnly
              />
            </div>

            {/* Linha 4 */}
            <div className="flex items-center gap-2">
              <label className="w-[80px] text-right">Dt. Venc</label>
              <input
                type="date"
                className="border border-gray-300 rounded px-2 py-[2px] w-[150px]"
                value="2025-10-29"
              />
              <label className="w-[80px] text-right">Categoria</label>
              <input
                className="border border-gray-300 rounded px-2 py-[2px] w-[80px] text-center"
                value={dados.categoria}
                readOnly
              />
              <input
                className="border border-gray-300 rounded px-2 py-[2px] flex-1"
                value={dados.categoriaDesc}
                readOnly
              />
              <label>Sub. Categoria</label>
              <input
                className="border border-gray-300 rounded px-2 py-[2px] w-[80px] text-center"
                value={dados.subcategoria}
                readOnly
              />
            </div>

            {/* Linha 5 */}
            <div className="flex items-center gap-2">
              <label className="w-[80px] text-right">Observação</label>
              <input className="border border-gray-300 rounded px-2 py-[2px] flex-1" />
            </div>

            {/* Linha 6 */}
            <div className="flex items-center gap-2">
              <label className="w-[80px] text-right">Dt. Pagto</label>
              <input
                type="date"
                className="border border-gray-300 rounded px-2 py-[2px] w-[140px]"
              />
              <label>Nº Conta</label>
              <input
                className="border border-gray-300 rounded px-2 py-[2px] w-[220px]"
                value="0000000 - CAIXINHA INTERNO"
                readOnly
              />
              <label>Banco</label>
              <input
                className="border border-gray-300 rounded px-2 py-[2px] w-[60px] text-center"
                value={dados.banco}
                readOnly
              />
              <label>Agência</label>
              <input
                className="border border-gray-300 rounded px-2 py-[2px] w-[80px] text-center"
                value={dados.agencia}
                readOnly
              />
            </div>

            {/* Linha 7 */}
            <div className="flex items-center gap-2">
              <label className="w-[80px] text-right">Centro Custo</label>
              <input
                className="border border-gray-300 rounded px-2 py-[2px] w-[160px] text-center"
                value={dados.conta}
                readOnly
              />
              <input
                className="border border-gray-300 rounded px-2 py-[2px] flex-1"
                value={dados.centroCusto}
                readOnly
              />
            </div>

            {/* BOTÕES */}
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={onClose}
                className="border border-gray-300 rounded px-3 py-[4px] hover:bg-gray-100 flex items-center gap-1 text-gray-700"
              >
                <X size={14} /> Sair
              </button>
              <button
                onClick={handleGerarCP}
                className="border border-gray-300 rounded px-3 py-[4px] hover:bg-gray-100 flex items-center gap-1 text-green-700"
              >
                <CheckCircle size={14} /> Gerar CP
              </button>
            </div>
          </div>
        </fieldset>

        {/* === CARD 2 - Relação de Títulos === */}
        <fieldset className="border border-gray-300 rounded p-3 bg-white min-w-0">
          <legend className="text-red-700 font-semibold px-2">
            Relação de Títulos Gerados
          </legend>

          <div className="block border border-gray-300 rounded bg-white mt-2 max-h-[300px] overflow-auto">
            <table className="min-w-[1200px] text-[12px] border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  {[
                    "Empresa",
                    "Filial",
                    "Motorista",
                    "Nº Título",
                    "Valor",
                    "Data Vencimento",
                    "Banco",
                    "Agência",
                  ].map((h) => (
                    <th
                      key={h}
                      className="border px-2 py-1 whitespace-nowrap text-center"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {titulos.map((t) => (
                  <tr key={t.id} className="bg-orange-50 hover:bg-gray-100">
                    <td className="border px-2 text-center">001</td>
                    <td className="border px-2 text-center">001</td>
                    <td className="border px-2">{t.motorista}</td>
                    <td className="border px-2 text-center">{t.titulo}</td>
                    <td className="border px-2 text-right">
                      {t.valor.toFixed(2)}
                    </td>
                    <td className="border px-2 text-center">{t.data}</td>
                    <td className="border px-2 text-center">{t.banco}</td>
                    <td className="border px-2 text-center">{t.agencia}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </fieldset>
      </div>
    </div>
  );
}
