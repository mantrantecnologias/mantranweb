import { useState } from "react";
import {
  XCircle,
  RotateCcw,
  Send,
  Printer,
  FileText,
  FileSpreadsheet,
  Trash2,
  CheckSquare,
  Square,
} from "lucide-react";

export default function ConsultaNFSE({ isOpen, onClose }) {
  const [rows, setRows] = useState([
    { id: 1, nf: "0001", serie: "1", cnpj: "50221019000136", cliente: "HNK BR BEBIDAS LTDA", nfse: "123456", emissao: "20/10/2025", status: "AUTORIZADA", situacao: "NORMAL", checked: false },
    { id: 2, nf: "0002", serie: "1", cnpj: "42446277004694", cliente: "SHPX LOGÍSTICA LTDA", nfse: "789012", emissao: "19/10/2025", status: "AUTORIZADA", situacao: "NORMAL", checked: false },
    { id: 2, nf: "0003", serie: "1", cnpj: "42446277004694", cliente: "SHPX LOGÍSTICA LTDA", nfse: "789012", emissao: "19/10/2025", status: "CANCELADA", situacao: "NORMAL", checked: false },
    { id: 2, nf: "0004", serie: "1", cnpj: "42446277004694", cliente: "SHPX LOGÍSTICA LTDA", nfse: "789012", emissao: "19/10/2025", status: "AUTORIZADA", situacao: "NORMAL", checked: false },
    { id: 2, nf: "0005", serie: "1", cnpj: "42446277004694", cliente: "SHPX LOGÍSTICA LTDA", nfse: "789012", emissao: "19/10/2025", status: "AUTORIZADA", situacao: "NORMAL", checked: false },
  ]);

  const toggleAll = (value) => {
    setRows(rows.map((r) => ({ ...r, checked: value })));
  };

  const toggleRow = (id) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, checked: !r.checked } : r)));
  };

  if (!isOpen) return null;

  function Label({ children, className = "" }) {
    return <label className={`text-[12px] text-gray-700 ${className}`}>{children}</label>;
  }

  function Txt(props) {
    return (
      <input
        {...props}
        className={`border border-gray-300 rounded px-2 py-[2px] h-[26px] text-[13px] ${props.className || ""}`}
      />
    );
  }

  function Sel({ children, ...rest }) {
    return (
      <select
        {...rest}
        className="border border-gray-300 rounded px-2 py-[2px] h-[26px] text-[13px]"
      >
        {children}
      </select>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[1000px] rounded shadow-lg border border-gray-300 p-4 flex flex-col max-h-[90vh]">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center border-b pb-1 mb-2">
          <h2 className="text-red-700 font-semibold text-[14px]">Consulta de NFSe</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-700"
            title="Fechar"
          >
            <XCircle size={20} />
          </button>
        </div>

        {/* CARD 1 — Filtros */}
        <div className="border border-gray-300 rounded p-2 mb-2 bg-white space-y-2">
          <h3 className="text-red-700 font-semibold text-[13px]">Parâmetros para Pesquisa</h3>

          <div className="flex flex-wrap gap-3">
            <Label className="w-[70px] text-right">Empresa</Label>
            <Sel className="flex-[1.2] min-w-[220px]">
              <option>001 - MANTRAN TRANSPORTES LTDA</option>
            </Sel>

            <Label className="w-[50px] text-right">Filial</Label>
            <Sel className="flex-[1] min-w-[180px]">
              <option>001 - TESTE MANTRAN</option>
            </Sel>
          </div>

          <div className="flex flex-wrap gap-3">
            <Label className="w-[100px] text-right">CGC/CPF Cliente</Label>
            <Txt className="w-[180px]" />
            <Txt className="flex-1" placeholder="Nome do Cliente" />
          </div>

          <div className="flex flex-wrap gap-3">
            <Label className="w-[60px] text-right">Nº NFS</Label>
            <Txt className="w-[100px]" />
            <Label className="w-[70px] text-right">Nº NFSe</Label>
            <Txt className="w-[100px]" />
            <Label className="w-[70px] text-right">Período</Label>
            <Txt type="date" className="w-[140px]" defaultValue="2025-10-20" />
            <Label className="w-[25px] text-center">até</Label>
            <Txt type="date" className="w-[140px]" defaultValue="2025-10-20" />
            <button
              className="border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded px-3 h-[26px] text-[12px]"
              title="Pesquisar"
            >
              Pesquisar
            </button>
          </div>
        </div>

        {/* CARD 2 — Grid */}
        <div className="border border-gray-300 rounded p-2 mb-2 flex-1 overflow-auto">
          <h3 className="text-red-700 font-semibold text-[13px] mb-1">
            Notas Fiscais de Serviço
          </h3>
          <table className="min-w-full text-[12px] border-collapse">
            <thead className="bg-gray-100 border-b border-gray-300 text-gray-700">
              <tr>
                <th className="px-2 py-1 border-r">Chk</th>
                <th className="px-2 py-1 border-r">Nº NFS</th>
                <th className="px-2 py-1 border-r">Série</th>
                <th className="px-2 py-1 border-r">CNPJ/CPF</th>
                <th className="px-2 py-1 border-r">Nome do Cliente</th>
                <th className="px-2 py-1 border-r">Nº NFSe</th>
                <th className="px-2 py-1 border-r">Dt. Emissão</th>
                <th className="px-2 py-1 border-r">Status</th>
                <th className="px-2 py-1">Situação</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="border-t border-gray-200 text-center">
                    <input
                      type="checkbox"
                      checked={row.checked}
                      onChange={() => toggleRow(row.id)}
                    />
                  </td>
                  <td className="border-t border-gray-200 text-center">{row.nf}</td>
                  <td className="border-t border-gray-200 text-center">{row.serie}</td>
                  <td className="border-t border-gray-200 text-center">{row.cnpj}</td>
                  <td className="border-t border-gray-200 px-2">{row.cliente}</td>
                  <td className="border-t border-gray-200 text-center">{row.nfse}</td>
                  <td className="border-t border-gray-200 text-center">{row.emissao}</td>
                  <td className="border-t border-gray-200 text-center">{row.status}</td>
                  <td className="border-t border-gray-200 text-center">{row.situacao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CARD 3 — Botões */}
        <div className="border-t border-gray-300 bg-white pt-2 flex justify-between items-center">
          {/* Botões principais (centrais) */}
          <div className="flex gap-6 text-red-700 ml-6">
            <button title="Envio" className="flex flex-col items-center text-[12px]">
              <Send size={18} />
              Envio
            </button>
            <button title="Consulta" className="flex flex-col items-center text-[12px]">
              <RotateCcw size={18} />
              Consulta
            </button>
            <button title="Cancelar" className="flex flex-col items-center text-[12px]">
              <Trash2 size={18} />
              Cancelar
            </button>
            <button title="Impressão" className="flex flex-col items-center text-[12px]">
              <Printer size={18} />
              Impressão
            </button>
            <button title="PDF" className="flex flex-col items-center text-[12px]">
              <FileText size={18} />
              PDF
            </button>
            <button title="XML" className="flex flex-col items-center text-[12px]">
              <FileSpreadsheet size={18} />
              XML
            </button>
          </div>

          {/* Botões de seleção (à direita) */}
          <div className="flex gap-4 mr-4">
            <button
              title="Selecionar Todos"
              onClick={() => toggleAll(true)}
              className="flex items-center gap-1 text-[12px] text-gray-700 border border-gray-300 bg-gray-50 hover:bg-gray-100 px-2 py-[2px] rounded"
            >
              <CheckSquare size={16} className="text-green-700" />
              Selecionar Todos
            </button>
            <button
              title="Limpar Seleção"
              onClick={() => toggleAll(false)}
              className="flex items-center gap-1 text-[12px] text-gray-700 border border-gray-300 bg-gray-50 hover:bg-gray-100 px-2 py-[2px] rounded"
            >
              <Square size={16} className="text-red-700" />
              Limpar Seleção
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
