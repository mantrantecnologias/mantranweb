import { useState, useEffect, useRef } from "react";
import { XCircle, RotateCcw, FileSpreadsheet } from "lucide-react";

/* === COMPONENTES AUXILIARES === */
function Label({ children, className = "" }) {
  return <label className={`text-[12px] text-gray-700 ${className}`}>{children}</label>;
}
function Txt({ className = "", ...rest }) {
  return (
    <input
      {...rest}
      className={`border border-gray-300 rounded px-2 py-[2px] h-[26px] text-[13px] ${className}`}
    />
  );
}

export default function GerarColetaModal({ onClose }) {
  const [coletas] = useState([
    {
      id: 1,
      empresa: "001",
      filial: "Matriz",
      coleta: "C0001",
      enderecoColeta: "RUA JOSÉ BONIFÁCIO, 100",
      numero: "100",
      bairro: "CENTRO",
      cidade: "CAMPINAS",
      uf: "SP",
      enderecoDestinatario: "AV. PAULISTA, 1500",
      numeroDest: "1500",
      bairroDest: "BELA VISTA",
      cidadeDest: "SÃO PAULO",
      ufDest: "SP",
    },
  ]);

  // === Controle de arrastar ===
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const offset = useRef({ x: 0, y: 0 });
  const [expandido, setExpandido] = useState(true);

  const handleMouseDown = (e) => {
    setDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    }
  };

  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

  const handleGerarColeta = () => {
    if (window.confirm("Confirma a Geração da Coleta?")) {
      alert("✅ Coleta gerada com sucesso!");
    }
  };

  const handleLimpar = () => {
    document.querySelectorAll("input").forEach((i) => (i.value = ""));
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      {/* === MODAL FLUTUANTE === */}
      <div
        className="relative bg-white rounded-lg shadow-lg border border-gray-300 w-[1200px] max-h-[90vh] flex flex-col overflow-hidden"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: dragging ? "grabbing" : "default",
        }}
      >
        {/* === CABEÇALHO === */}
        <div
          className="flex justify-between items-center bg-gradient-to-r from-red-700 to-gray-800 text-white px-4 py-2 rounded-t-lg select-none"
          onMouseDown={handleMouseDown}
        >
          <h2 className="text-sm font-semibold">Geração de Coleta</h2>
        </div>

        {/* === CONTEÚDO === */}
        <div className="flex-1 bg-gray-50 p-3 flex flex-col gap-3 overflow-auto">
          {/* === CARD 1 - PARÂMETROS (expansível) === */}
          <fieldset className="border border-gray-300 rounded p-3 bg-white min-w-0">
            <legend
              className="text-red-700 font-semibold px-2 flex justify-between items-center cursor-pointer select-none"
              onClick={() => setExpandido(!expandido)}
            >
              <span>Parâmetros</span>
              <span className="text-[11px] text-gray-500">
                {expandido ? "▲ Recolher" : "▼ Expandir"}
              </span>
            </legend>

            {expandido && (
              <div className="space-y-2 transition-all duration-300 ease-in-out">
                {/* Linha 1 - CLIENTE */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1 text-right">Cliente</Label>
                  <Txt className="col-span-2 w-full" placeholder="CNPJ" />
                  <Txt className="col-span-5 w-full" placeholder="Razão Social" />
                  <Txt className="col-span-3 w-full" placeholder="Cidade" />
                  <Txt className="col-span-1 w-full" placeholder="UF" />
                </div>

                {/* Linha 2 - EXPEDIDOR */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1 text-right">Expedidor</Label>
                  <Txt className="col-span-2 w-full" placeholder="CNPJ" />
                  <Txt className="col-span-5 w-full" placeholder="Razão Social" />
                  <Txt className="col-span-3 w-full" placeholder="Cidade" />
                  <Txt className="col-span-1 w-full" placeholder="UF" />
                </div>

                {/* Linha 3 - RECEBEDOR */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-1 text-right">Recebedor</Label>
                  <Txt className="col-span-2 w-full" placeholder="CNPJ" />
                  <Txt className="col-span-5 w-full" placeholder="Razão Social" />
                  <Txt className="col-span-3 w-full" placeholder="Cidade" />
                  <Txt className="col-span-1 w-full" placeholder="UF" />
                </div>

                {/* Linha 4 - MOTORISTA | TRAÇÃO */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-6 flex items-center gap-2 min-w-0">
                    <Label className="ml-[40px]">Motorista</Label>
                    <Txt className="w-[140px]" placeholder="CNH" />
                    <Txt className="flex-1 min-w-0" placeholder="Nome" />
                  </div>
                  <div className="col-span-6 flex items-center gap-2 justify-end min-w-0">
                    <Label>Tração</Label>
                    <Txt className="w-[100px]" placeholder="Código" />
                    <Txt className="w-[280px]" placeholder="Placa / Descrição" />
                  </div>
                </div>

                {/* Linha 5 - REBOQUE | REBOQUE 2 */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-6 flex items-center gap-2 min-w-0">
                    <Label className="ml-[40px]">Reboque</Label>
                    <Txt className="w-[100px]" placeholder="Código" />
                    <Txt className="flex-1 min-w-0" placeholder="Placa / Descrição" />
                  </div>
                  <div className="col-span-6 flex items-center gap-2 justify-end min-w-0">
                    <Label>Reboque 2</Label>
                    <Txt className="w-[100px]" placeholder="Código" />
                    <Txt className="w-[280px]" placeholder="Placa / Descrição" />
                  </div>
                </div>

                {/* Linha 6 - PRODUTO | EMBALAGEM */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-6 flex items-center gap-2 min-w-0">
                    <Label className="ml-[46px]">Produto</Label>
                    <Txt className="w-[100px]" placeholder="Código" />
                    <Txt className="flex-1 min-w-0" placeholder="Descrição" />
                  </div>
                  <div className="col-span-6 flex items-center gap-2 justify-end min-w-0">
                    <Label>Embalagem</Label>
                    <Txt className="w-[100px]" placeholder="Código" />
                    <Txt className="w-[280px]" placeholder="Descrição" />
                  </div>
                </div>

                {/* Linha 7 - LACRE | BOTÃO */}
                <div className="grid grid-cols-12 gap-2 items-center mt-1">
                  <div className="col-span-6 flex items-center gap-2">
                    <Label>Nº Lacre Compl.</Label>
                    <Txt className="w-[180px]" />
                  </div>
                  <div className="col-span-6 flex justify-end">
                    <button
                      onClick={handleGerarColeta}
                      className="border border-gray-300 rounded px-3 py-[4px] text-[12px] hover:bg-gray-100 flex items-center gap-1 text-red-700"
                    >
                      <FileSpreadsheet size={14} /> Gerar Coleta
                    </button>
                  </div>
                </div>

                {/* Linha 8 - Data + Flag */}
                <div className="flex items-center gap-4 mt-1">
                  <Label className="ml-[20px]">Data Coleta</Label>
                  <Txt type="date" className="w-[150px]" />
                  <label className="flex items-center gap-1 text-red-700">
                    <input type="checkbox" /> Agrupar Destinatário
                  </label>
                </div>
              </div>
            )}
          </fieldset>

          {/* === CARD 2 - GRID === */}
          <fieldset className="border border-gray-300 rounded p-3 bg-white min-w-0">
            <legend className="text-red-700 font-semibold px-2">Coletas</legend>

            <div className="block w-full min-w-0 border border-gray-300 rounded bg-white mt-2 max-h-[200px] overflow-auto">
              <table className="min-w-[1600px] text-[12px] border-collapse">
                <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
                  <tr>
                    {[
                      "Empresa",
                      "Filial",
                      "Coleta",
                      "Endereço Coleta",
                      "Nº",
                      "Bairro",
                      "Cidade Coleta",
                      "UF",
                      "Endereço Destinatário",
                      "Nº",
                      "Bairro",
                      "Cidade",
                      "UF",
                    ].map((h) => (
                      <th key={h} className="border px-2 py-1 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {coletas.map((c, i) => (
                    <tr
                      key={c.id}
                      className={`${i % 2 === 0 ? "bg-orange-50" : "bg-white"} hover:bg-gray-100`}
                    >
                      <td className="border text-center">{c.empresa}</td>
                      <td className="border text-center">{c.filial}</td>
                      <td className="border text-center">{c.coleta}</td>
                      <td className="border px-2">{c.enderecoColeta}</td>
                      <td className="border text-center">{c.numero}</td>
                      <td className="border text-center">{c.bairro}</td>
                      <td className="border text-center">{c.cidade}</td>
                      <td className="border text-center">{c.uf}</td>
                      <td className="border px-2">{c.enderecoDestinatario}</td>
                      <td className="border text-center">{c.numeroDest}</td>
                      <td className="border text-center">{c.bairroDest}</td>
                      <td className="border text-center">{c.cidadeDest}</td>
                      <td className="border text-center">{c.ufDest}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </fieldset>

          {/* === RODAPÉ === */}
          <div className="flex justify-start gap-3 mt-2">
            <button
              onClick={onClose}
              className="flex items-center gap-1 text-[13px] border border-gray-300 rounded px-3 py-[4px] hover:bg-gray-100 text-red-700"
            >
              <XCircle size={16} /> Fechar
            </button>
            <button
              onClick={handleLimpar}
              className="flex items-center gap-1 text-[13px] border border-gray-300 rounded px-3 py-[4px] hover:bg-gray-100 text-red-700"
            >
              <RotateCcw size={16} /> Limpar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
